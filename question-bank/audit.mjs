import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const subjects = [
  ["math.js", "math", "数学", 220],
  ["english.js", "english", "英语", 200],
  ["chinese.js", "chinese", "语文", 220],
  ["physics.js", "physics", "物理", 55],
  ["chemistry.js", "chemistry", "化学", 170],
  ["geography.js", "geography", "地理", 140],
  ["biology.js", "biology", "生物", 140]
];

const context = vm.createContext({ window: {} });
const loadErrors = [];

for (const [file] of subjects) {
  const target = path.join(here, file);
  if (!fs.existsSync(target)) {
    loadErrors.push(`${file}: 文件不存在`);
    continue;
  }
  try {
    vm.runInContext(fs.readFileSync(target, "utf8"), context, {
      filename: file,
      timeout: 10_000
    });
  } catch (error) {
    loadErrors.push(`${file}: ${error.message}`);
  }
}

function normalize(value) {
  return String(value || "")
    .normalize("NFKC")
    .toLowerCase()
    .replace(/\d+(?:\.\d+)?/g, "#")
    .replace(/[a-d][.、:：)]/gi, "")
    .replace(/[\s，。！？；：“”‘’（）【】《》、,.!?;:'"()[\]{}<>/_=+\-*×÷]/g, "");
}

function charBigrams(value) {
  const text = normalize(value);
  const result = new Set();
  for (let i = 0; i < text.length - 1; i += 1) result.add(text.slice(i, i + 2));
  return result;
}

function similarity(left, right) {
  const a = charBigrams(left);
  const b = charBigrams(right);
  if (!a.size || !b.size) return 0;
  let overlap = 0;
  for (const token of a) if (b.has(token)) overlap += 1;
  return overlap / (a.size + b.size - overlap);
}

function optionText(value) {
  return String(value || "")
    .normalize("NFKC")
    .toLowerCase()
    .replace(/^[a-d][.、:：)]\s*/i, "")
    .replace(/\s+/g, "")
    .replace(/[，。！？；：“”‘’（）【】《》、,.!?;:'"()[\]{}<>]/g, "");
}

function inspectQuestion(question, expectedSubject, index, seenIds, seenStems) {
  const label = `${expectedSubject}[${index}]`;
  const errors = [];
  if (!question || typeof question !== "object") return [`${label}: 不是对象`];

  if (!question.id || typeof question.id !== "string") errors.push(`${label}: 缺少 id`);
  else if (seenIds.has(question.id)) errors.push(`${label}: id 重复 ${question.id}`);
  else seenIds.add(question.id);

  if (question.subject !== expectedSubject) errors.push(`${label}: subject 应为 ${expectedSubject}`);
  for (const key of ["point", "type", "difficulty", "stem"]) {
    if (!String(question[key] || "").trim()) errors.push(`${label}: 缺少 ${key}`);
  }
  const allowedDifficulties = new Set(["保分", "提升", "拔高", "预习保分"]);
  if (!allowedDifficulties.has(question.difficulty)) {
    errors.push(`${label}: difficulty不合法 ${question.difficulty}`);
  }
  if (normalize(question.stem).length < 8) errors.push(`${label}: 题干过短`);
  if (/如何复习|复习方式|学习建议|怎样背诵|刷题建议/.test(question.stem || "")) {
    errors.push(`${label}: 属于学习建议题，不是考试题`);
  }

  const signature = `${expectedSubject}:${normalize(question.stem)}`;
  if (seenStems.has(signature)) errors.push(`${label}: 题干结构重复于 ${seenStems.get(signature)}`);
  else seenStems.set(signature, label);

  if (!Array.isArray(question.options) || question.options.length !== 4) {
    errors.push(`${label}: 选项必须恰好4个`);
  } else if (new Set(question.options.map(optionText)).size !== 4) {
    errors.push(`${label}: 选项内容重复`);
  }
  if (!Number.isInteger(question.answer) || question.answer < 0 || question.answer > 3) {
    errors.push(`${label}: answer 必须为0至3`);
  }

  const explanation = question.explanation;
  if (!explanation || typeof explanation !== "object") {
    errors.push(`${label}: 缺少 explanation`);
  } else {
    for (const key of ["exam", "error", "similar"]) {
      if (normalize(explanation[key]).length < 4) errors.push(`${label}: explanation.${key} 过短`);
    }
    if (!Array.isArray(explanation.steps) || explanation.steps.length < 3 ||
        explanation.steps.some((step) => normalize(step).length < 4)) {
      errors.push(`${label}: explanation.steps 至少3个有效步骤`);
    }
    const explanationText = [explanation.exam, explanation.error, ...(explanation.steps || []), explanation.similar].join(" ");
    const explicitAnswers = [...explanationText.matchAll(/(?:所以|故|应|正确答案|答案)(?:选择|选|为|是)\s*([A-D])/gi)]
      .map((match) => match[1].toUpperCase());
    if (explicitAnswers.some((letter) => "ABCD"[question.answer] !== letter)) {
      errors.push(`${label}: 解析中的答案字母与answer不一致`);
    }
  }

  const variant = question.variant;
  if (!variant || typeof variant !== "object") {
    errors.push(`${label}: 缺少 variant`);
  } else {
    if (normalize(variant.stem).length < 8) errors.push(`${label}: variant题干过短`);
    if (normalize(variant.stem) === normalize(question.stem)) errors.push(`${label}: variant与原题相同`);
    if (similarity(question.stem, variant.stem) > 0.9) errors.push(`${label}: variant与原题过于相似`);
    if (!Array.isArray(variant.options) || variant.options.length !== 4) {
      errors.push(`${label}: variant选项必须恰好4个`);
    } else if (new Set(variant.options.map(optionText)).size !== 4) {
      errors.push(`${label}: variant选项内容重复`);
    }
    if (!Number.isInteger(variant.answer) || variant.answer < 0 || variant.answer > 3) {
      errors.push(`${label}: variant.answer 必须为0至3`);
    }
    if (expectedSubject === "英语" && normalize(variant.translation).length < 4) {
      errors.push(`${label}: 英语variant缺少中文翻译`);
    }
  }

  if (expectedSubject === "英语" && normalize(question.translation).length < 4) {
    errors.push(`${label}: 英语题缺少中文翻译`);
  }
  return errors;
}

const report = {
  generatedAt: new Date().toISOString(),
  totals: { base: 0, usableWithVariants: 0, errors: loadErrors.length },
  loadErrors,
  subjects: {}
};
const allErrors = [...loadErrors];
const seenIds = new Set();
const seenStems = new Map();
const baseStemOwners = new Map();

for (const [, key, expectedSubject] of subjects) {
  const bank = context.window.KUNTAI_BANK?.[key];
  if (!Array.isArray(bank)) continue;
  bank.forEach((question, index) => {
    const signature = `${expectedSubject}:${normalize(question.stem)}`;
    if (signature.length > expectedSubject.length + 1) baseStemOwners.set(signature, `${expectedSubject}[${index}]`);
  });
}

for (const [, key, expectedSubject, minimum] of subjects) {
  const bank = context.window.KUNTAI_BANK?.[key];
  const errors = [];
  if (!Array.isArray(bank)) {
    errors.push(`${expectedSubject}: 未注册 window.KUNTAI_BANK.${key}`);
  } else {
    bank.forEach((question, index) => {
      errors.push(...inspectQuestion(question, expectedSubject, index, seenIds, seenStems));
      const variantSignature = `${expectedSubject}:${normalize(question.variant?.stem)}`;
      const baseOwner = baseStemOwners.get(variantSignature);
      if (baseOwner && baseOwner !== `${expectedSubject}[${index}]`) {
        errors.push(`${expectedSubject}[${index}]: variant复用了基础题 ${baseOwner}`);
      }
    });
    if (bank.length < minimum) errors.push(`${expectedSubject}: 基础题 ${bank.length}，低于目标 ${minimum}`);
  }

  const rows = Array.isArray(bank) ? bank : [];
  const answers = [0, 0, 0, 0];
  const variantAnswers = [0, 0, 0, 0];
  const difficulties = {};
  const points = new Set();
  for (const question of rows) {
    if (Number.isInteger(question.answer) && question.answer >= 0 && question.answer <= 3) answers[question.answer] += 1;
    if (Number.isInteger(question.variant?.answer) && question.variant.answer >= 0 && question.variant.answer <= 3) {
      variantAnswers[question.variant.answer] += 1;
    }
    difficulties[question.difficulty] = (difficulties[question.difficulty] || 0) + 1;
    if (question.point) points.add(question.point);
  }

  if (rows.length >= 20) {
    answers.forEach((count, answer) => {
      const ratio = count / rows.length;
      if (ratio < 0.15 || ratio > 0.35) errors.push(`${expectedSubject}: 原题答案${"ABCD"[answer]}占比${(ratio * 100).toFixed(1)}%`);
    });
  }
  if (rows.length && points.size < 8) errors.push(`${expectedSubject}: 仅覆盖 ${points.size} 个考点`);

  report.subjects[expectedSubject] = {
    base: rows.length,
    usableWithVariants: rows.length * 2,
    points: points.size,
    answers,
    variantAnswers,
    difficulties,
    errors
  };
  report.totals.base += rows.length;
  report.totals.usableWithVariants += rows.length * 2;
  report.totals.errors += errors.length;
  allErrors.push(...errors);
}

console.log(JSON.stringify(report, null, 2));
if (allErrors.length) process.exitCode = 1;
