import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const bankDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.dirname(bankDir);
const context = vm.createContext({ window: {} });
const files = [
  "math.js",
  "english.js",
  "chinese.js",
  "physics.js",
  "chemistry.js",
  "geography.js",
  "biology.js",
  "jintai-priority.js",
  "jintai-priority-engine.js"
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

for (const file of files) {
  const target = path.join(bankDir, file);
  assert(fs.existsSync(target), `缺少文件：${file}`);
  vm.runInContext(fs.readFileSync(target, "utf8"), context, { filename: file });
}

const baseQuestions = Object.values(context.window.KUNTAI_BANK || {}).flat();
const priorityQuestions = Object.values(context.window.KUNTAI_PRIORITY_BANK || {}).flat();
const questions = [...baseQuestions, ...priorityQuestions];

assert(baseQuestions.length > 0, "七科基础题库为空");
assert(priorityQuestions.length >= 3600, "金泰优先题不足3600道，无法支撑初三前暑假高强度刷题");
const priorityBySubject = priorityQuestions.reduce((groups, question) => {
  groups[question.subject] = (groups[question.subject] || 0) + 1;
  return groups;
}, {});
assert(priorityBySubject.数学 >= 800, "金泰数学题不足800道");
assert(priorityBySubject.物理 >= 600, "金泰物理题不足600道");
assert(priorityBySubject.英语 >= 600, "金泰英语题不足600道");
assert(priorityBySubject.语文 >= 600, "金泰语文题不足600道");
assert(priorityBySubject.化学 >= 450, "金泰化学题不足450道");
assert(priorityBySubject.地理 >= 300, "金泰地理题不足300道");
assert(priorityBySubject.生物 >= 300, "金泰生物题不足300道");
assert(new Set(questions.map(question => question.id)).size === questions.length, "题目ID存在重复");
assert(priorityQuestions.every(question => question.priorityProfile === "jintai-2026-07"), "金泰优先题profile错误");
assert(questions.every(question => {
  const answerMode = question.answerMode || "choice";
  const validAnswer = answerMode === "choice"
    ? Number.isInteger(question.answer) && question.answer >= 0 && question.answer < (question.options?.length || 0)
    : Boolean(question.acceptedAnswers?.length || question.requiredKeywords?.length);
  const validVariant = question.variant?.stem && (
    (question.variant.answerMode || "choice") === "choice"
      ? question.variant.options?.length === 4
      : Boolean(question.variant.acceptedAnswers?.length || question.variant.requiredKeywords?.length)
  );
  return validAnswer && validVariant && question.explanation?.steps?.length >= 3;
}), "存在答案、变式或解析不完整的题目");

const normalize = (text = "") => text
  .replace(/^同类变式[:：]?/, "")
  .replace(/[0-9０-９.()\-+×÷=°]+/g, "#")
  .replace(/\s+/g, "")
  .replace(/[，。！？、；：“”‘’《》]/g, "")
  .slice(0, 140);
const seenTemplates = new Set();
const rejected = [];
for (const question of questions) {
  const answerMode = question.answerMode || "choice";
  const validAnswer = answerMode === "choice"
    ? Number.isInteger(question.answer) && question.answer >= 0 && question.answer < (question.options?.length || 0)
    : Boolean(question.acceptedAnswers?.length || question.requiredKeywords?.length);
  const originalSignature = normalize(`${question.stem}|${question.audioText || ""}`);
  const variantSignature = normalize(`${question.variant?.stem || ""}|${question.variant?.audioText || ""}`);
  const templateKey = `${question.subject}|${question.point}|${originalSignature}`;
  const accepted = validAnswer
    && question.explanation?.steps?.length >= 3
    && variantSignature
    && variantSignature !== originalSignature
    && !seenTemplates.has(templateKey);
  if (accepted) seenTemplates.add(templateKey);
  else rejected.push(question.id);
}
assert(!rejected.length, `网页质量门禁会过滤${rejected.length}题：${rejected.slice(0, 10).join(", ")}`);

const expectedSubjects = ["数学", "英语", "语文", "物理", "化学", "地理", "生物"];
for (let day = 1; day <= 55; day += 1) {
  const targets = context.window.KuntaiPriorityEngine.targetsForDay(day);
  assert(JSON.stringify(Object.keys(targets)) === JSON.stringify(expectedSubjects), `第${day}天不是七科`);
  assert(Object.values(targets).reduce((sum, value) => sum + value, 0) === 60, `第${day}天题量不是60`);
}

const used = new Set();
for (let day = 1; day <= 55; day += 1) {
  const targets = context.window.KuntaiPriorityEngine.targetsForDay(day);
  for (const [subject, target] of Object.entries(targets)) {
    const available = questions.filter(question => question.subject === subject && !used.has(question.id));
    const priority = day <= 21
      ? context.window.KuntaiPriorityEngine.interleaveByWeakness(
        available.filter(question => question.priorityProfile === "jintai-2026-07")
      )
      : [];
    const regular = day <= 21
      ? available.filter(question => question.priorityProfile !== "jintai-2026-07")
      : available;
    const selected = [...priority, ...regular].slice(0, target);
    assert(selected.length === target, `第${day}天${subject}题库不足，无法做到不重复`);
    selected.forEach(question => {
      assert(!used.has(question.id), `第${day}天出现重复题：${question.id}`);
      used.add(question.id);
    });
  }
}

const html = fs.readFileSync(path.join(root, "jintai.html"), "utf8");
assert(html.includes("金泰-暑假"), "金泰页面标题错误");
assert(html.includes('src="question-bank/jintai-priority.js"'), "金泰页面未加载金泰优先题库");
assert(html.includes('src="question-bank/jintai-priority-engine.js"'), "金泰页面未加载金泰排题规则");
assert(!html.includes("kuntai-english-priority.js"), "金泰页面仍加载坤泰英语优先题库");
assert(!html.includes("kuntai-physics-priority.js"), "金泰页面仍加载坤泰物理优先题库");
for (const subject of expectedSubjects) {
  assert(html.includes(subject), `金泰页面缺少${subject}`);
}

console.log(JSON.stringify({
  base: baseQuestions.length,
  priority: priorityQuestions.length,
  priorityBySubject,
  total: questions.length,
  day1: context.window.KuntaiPriorityEngine.targetsForDay(1),
  day22: context.window.KuntaiPriorityEngine.targetsForDay(22)
}, null, 2));
