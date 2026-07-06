import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const context = vm.createContext({ window: {} });
const files = ["kuntai-english-priority.js", "kuntai-physics-priority.js"];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

for (const file of files) {
  const target = path.join(here, file);
  assert(fs.existsSync(target), `缺少重点题库文件：${file}`);
  vm.runInContext(fs.readFileSync(target, "utf8"), context, { filename: file });
}

const english = context.window.KUNTAI_PRIORITY_BANK?.english;
const physics = context.window.KUNTAI_PRIORITY_BANK?.physics;
assert(Array.isArray(english), "英语重点题库未注册");
assert(Array.isArray(physics), "物理重点题库未注册");
assert(english.length >= 105, "英语重点母题不足105");
assert(physics.length >= 63, "物理重点母题不足63");

const all = [...english, ...physics];
assert(new Set(all.map((question) => question.id)).size === all.length, "重点题库ID重复");
assert(all.every((question) => question.priorityProfile === "kuntai-2026-07"), "priorityProfile不一致");
assert(all.every((question) => ["choice", "text", "listening-text"].includes(question.answerMode)), "answerMode不合法");
assert(all.every((question) => question.variant?.stem && question.explanation?.steps?.length >= 3), "变式或解析不完整");

const countByCode = (rows, code) => rows.filter((question) => question.weaknessCode === code).length;
const englishMinimums = {
  EN_A_LISTENING: 21,
  EN_TEXTBOOK_DICTATION: 21,
  EN_CONTEXT_CLOZE: 21,
  EN_B_READING_RESPONSE: 21,
  EN_WRITING_GRAMMAR: 21
};
const physicsMinimums = {
  PH_FRICTION: 7,
  PH_BUOYANCY: 7,
  PH_FLOAT_SINK: 7,
  PH_HYDROMETER: 7,
  PH_PULLEY_EFFICIENCY: 7,
  PH_RATIO_MODEL: 7,
  PH_B_FUNCTION_MODEL: 21
};

for (const [code, minimum] of Object.entries(englishMinimums)) {
  assert(countByCode(english, code) >= minimum, `${code}不足${minimum}题`);
}
for (const [code, minimum] of Object.entries(physicsMinimums)) {
  assert(countByCode(physics, code) >= minimum, `${code}不足${minimum}题`);
}

for (const question of english) {
  if (question.answerMode === "choice") {
    assert(question.options?.length === 4 && Number.isInteger(question.answer), `${question.id}选择题结构错误`);
  } else {
    assert(question.acceptedAnswers?.length, `${question.id}缺少文本答案`);
  }
  if (question.answerMode === "listening-text") {
    assert(question.audioText, `${question.id}缺少听力文本`);
  }
}

for (const question of physics) {
  assert(question.options?.length === 4, `${question.id}物理选项不足4个`);
  assert(new Set(question.options).size === 4, `${question.id}物理选项重复`);
  assert(Number.isInteger(question.answer) && question.answer >= 0 && question.answer < 4, `${question.id}物理答案错误`);
}

console.log(JSON.stringify({ english: english.length, physics: physics.length, total: all.length }, null, 2));
