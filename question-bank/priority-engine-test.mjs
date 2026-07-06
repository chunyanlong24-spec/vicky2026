import assert from "node:assert/strict";
import vm from "node:vm";
import fs from "node:fs";

const context = { window: {} };
vm.createContext(context);
vm.runInContext(
  fs.readFileSync(new URL("./priority-engine.js", import.meta.url), "utf8"),
  context
);

const engine = context.window.KuntaiPriorityEngine;
assert.ok(engine, "priority engine must be exposed");

const first21 = {
  "数学": 3,
  "英语": 5,
  "语文": 3,
  "物理": 3,
  "化学": 2,
  "地理": 1,
  "生物": 2
};
const later = {
  "数学": 4,
  "英语": 3,
  "语文": 4,
  "物理": 1,
  "化学": 3,
  "地理": 2,
  "生物": 2
};

for (let day = 1; day <= 21; day += 1) {
  assert.deepEqual(
    JSON.parse(JSON.stringify(engine.targetsForDay(day))),
    first21,
    `day ${day} must use weakness-priority targets`
  );
  assert.equal(
    Object.values(engine.targetsForDay(day)).reduce((sum, value) => sum + value, 0),
    19
  );
}
assert.deepEqual(JSON.parse(JSON.stringify(engine.targetsForDay(22))), later);

assert.equal(engine.evaluateAnswer({
  answerMode: "text",
  acceptedAnswers: ["patient"]
}, " Patient. "), true);
assert.equal(engine.evaluateAnswer({
  answerMode: "keywords",
  requiredKeywords: ["because", "vocabulary"]
}, "Because her vocabulary was limited."), true);
assert.equal(engine.evaluateAnswer({
  answerMode: "keywords",
  requiredKeywords: ["because", "vocabulary"]
}, "She did not read it."), false);
assert.equal(engine.evaluateAnswer({
  answerMode: "choice",
  answer: 2
}, 2), true);

console.log("priority engine: targets and answer modes passed");
