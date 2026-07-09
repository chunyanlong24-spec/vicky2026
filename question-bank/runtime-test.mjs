import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const bankDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.dirname(bankDir);
const htmlPath = ["坤泰-暑假.html", "index.html"]
  .map((name) => path.join(root, name))
  .find((target) => fs.existsSync(target));
if (!htmlPath) throw new Error("找不到坤泰网页入口文件");
const files = [
  ["math.js", "math", "数学"],
  ["english.js", "english", "英语"],
  ["chinese.js", "chinese", "语文"],
  ["physics.js", "physics", "物理"],
  ["chemistry.js", "chemistry", "化学"],
  ["geography.js", "geography", "地理"],
  ["biology.js", "biology", "生物"]
];
const context = vm.createContext({ window: {} });

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

for (const [file] of files) {
  const target = path.join(bankDir, file);
  assert(fs.existsSync(target), `缺少题库文件 ${file}`);
  vm.runInContext(fs.readFileSync(target, "utf8"), context, { filename: file });
}
for (const file of ["kuntai-english-priority.js", "kuntai-physics-priority.js", "kuntai-volume.js", "priority-engine.js"]) {
  const target = path.join(bankDir, file);
  assert(fs.existsSync(target), `缺少个性化文件 ${file}`);
  vm.runInContext(fs.readFileSync(target, "utf8"), context, { filename: file });
}

const html = fs.readFileSync(htmlPath, "utf8");
for (const [file] of files) {
  assert(html.includes(`src="question-bank/${file}"`), `网页未加载 ${file}`);
}
for (const file of ["kuntai-english-priority.js", "kuntai-physics-priority.js", "kuntai-volume.js", "priority-engine.js"]) {
  assert(html.includes(`src="question-bank/${file}"`), `网页未加载 ${file}`);
}
assert(html.includes("const practiceTargets"), "专项练习缺少固定题量配置");
assert(html.includes("buildPracticeQueue(subject)"), "专项练习缺少固定队列生成");
assert(html.includes("今天这科先停，不继续加题"), "专项练习缺少做完即停提示");
const inlineScripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)]
  .map((match) => match[1])
  .filter(Boolean);
inlineScripts.forEach((script) => new Function(script));

const questions = files.flatMap(([, key, subject]) => {
  const rows = context.window.KUNTAI_BANK?.[key];
  assert(Array.isArray(rows), `${subject}题库未注册`);
  return rows;
});
const priorityQuestions = Object.values(context.window.KUNTAI_PRIORITY_BANK || {}).flat();
questions.push(...priorityQuestions);
assert(new Set(questions.map((question) => question.id)).size === questions.length, "题目ID存在重复");
assert(questions.every((question) => {
  if (!question.variant?.stem) return false;
  return (question.variant.answerMode || "choice") === "choice"
    ? question.variant.options?.length === 4
    : Boolean(question.variant.acceptedAnswers?.length || question.variant.requiredKeywords?.length);
}), "存在缺少变式的题目");

const webpageNormalize = (text = "") => text
  .replace(/^同类变式[:：]?/, "")
  .replace(/[0-9０-９.()\-+×÷=°]+/g, "#")
  .replace(/\s+/g, "")
  .replace(/[，。！？、；：“”‘’《》]/g, "")
  .slice(0, 140);
const webpageSeen = new Set();
const webpageRejected = [];
for (const question of questions) {
  const signature = webpageNormalize(`${question.stem}|${question.audioText || ""}`);
  const variantSignature = webpageNormalize(`${question.variant?.stem || ""}|${question.variant?.audioText || ""}`);
  const templateKey = `${question.subject}|${question.point}|${signature}`;
  const answerMode = question.answerMode || "choice";
  const validAnswer = answerMode === "choice"
    ? Number.isInteger(question.answer) && question.answer >= 0 && question.answer < (question.options?.length || 0)
    : Boolean(question.acceptedAnswers?.length || question.requiredKeywords?.length);
  const accepted = validAnswer &&
    Array.isArray(question.explanation?.steps) &&
    question.explanation.steps.length >= 3 &&
    variantSignature &&
    variantSignature !== signature &&
    !webpageSeen.has(templateKey);
  if (accepted) webpageSeen.add(templateKey);
  else webpageRejected.push(question.id);
}
assert(!webpageRejected.length, `网页质量门禁误拒绝 ${webpageRejected.length} 题：${webpageRejected.slice(0, 10).join(", ")}`);

const used = new Set();
const dayReports = [];
for (let day = 1; day <= 55; day += 1) {
  const report = { day, total: 0, subjects: {} };
  const targets = context.window.KuntaiPriorityEngine.targetsForDay(day);
  for (const [subject, target] of Object.entries(targets)) {
    const available = questions.filter((question) => question.subject === subject && !used.has(question.id));
    const priority = day <= 21
      ? context.window.KuntaiPriorityEngine.interleaveByWeakness(
        available.filter(question => question.priorityProfile === "kuntai-2026-07")
      )
      : [];
    const regular = day <= 21
      ? available.filter(question => question.priorityProfile !== "kuntai-2026-07")
      : available;
    const selected = [...priority, ...regular].slice(0, target);
    assert(selected.length === target, `第${day}天${subject}题库不足`);
    selected.forEach((question) => used.add(question.id));
    report.subjects[subject] = selected.length;
    report.total += selected.length;
  }
  assert(report.total === 60, `第${day}天题量不是60`);
  dayReports.push(report);
}
assert(dayReports[0].subjects.英语 === 14 && dayReports[0].subjects.物理 === 10, "前21天未优先英语14题、物理10题");
assert(dayReports[20].subjects.英语 === 14 && dayReports[20].subjects.物理 === 10, "第21天个性化配额错误");
assert(dayReports[21].subjects.英语 === 10 && dayReports[21].subjects.物理 === 8, "第22天未切回常规高刷配额");
assert(used.size === 55 * 60, "55天主线排题总量不等于3300题");

const summary = {
  bankBase: questions.length,
  usableWithVariants: questions.length * 2,
  days: dayReports.length,
  dailyQuestions: 60,
  scheduledUniqueQuestions: used.size,
  reserveBaseQuestions: questions.length - used.size,
  firstDay: dayReports[0],
  lastDay: dayReports.at(-1)
};
console.log(JSON.stringify(summary, null, 2));

