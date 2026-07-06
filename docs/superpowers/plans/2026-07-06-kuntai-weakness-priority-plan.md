# Kuntai Weakness Priority Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a 21-day personalized English and physics weakness-priority route without increasing the current 19-question daily workload.

**Architecture:** Add two isolated priority-bank scripts which register questions in `window.KUNTAI_PRIORITY_BANK`. Extend the existing single-page runtime with a profile scheduler and backward-compatible text/listening answer modes; existing choice questions remain unchanged. Add standalone Node audits for schema, answer correctness, uniqueness, 21-day capacity, and scheduling.

**Tech Stack:** Static HTML/CSS/JavaScript, browser `Audio` and Speech Synthesis APIs, Node.js `vm`-based validation, GitHub Pages.

---

### Task 1: Priority Bank Contract And Failing Capacity Test

**Files:**
- Create: `question-bank/PRIORITY_SCHEMA.md`
- Create: `question-bank/priority-test.mjs`

- [ ] **Step 1: Write the contract**

Define:

```js
window.KUNTAI_PRIORITY_BANK = {
  english: [],
  physics: []
};
```

Required fields:

```js
{
  id: "kuntai-en-listen-001",
  subject: "英语",
  point: "A卷听力·课内句子",
  type: "听力理解",
  difficulty: "保分",
  priorityProfile: "kuntai-2026-07",
  weaknessCode: "EN_A_LISTENING",
  answerMode: "choice",
  audioText: "Please open your book on page twenty.",
  stem: "听录音，选择正确含义。",
  options: ["A. ...", "B. ...", "C. ...", "D. ..."],
  answer: 0,
  explanation: { exam: "", error: "", steps: ["", "", ""], similar: "" },
  variant: { stem: "", options: ["", "", "", ""], answer: 0 }
}
```

Text questions additionally use:

```js
{
  answerMode: "text",
  acceptedAnswers: ["patient"],
  revealAfterSubmit: "patient：有耐心的"
}
```

- [ ] **Step 2: Write the failing test**

`priority-test.mjs` must load both new scripts and assert:

```js
assert(english.length >= 105, "英语重点母题不足105");
assert(physics.length >= 63, "物理重点母题不足63");
assert(english.every(q => q.priorityProfile === "kuntai-2026-07"));
assert(physics.every(q => q.priorityProfile === "kuntai-2026-07"));
assert(new Set([...english, ...physics].map(q => q.id)).size === english.length + physics.length);
assert(english.filter(q => q.weaknessCode === "EN_A_LISTENING").length >= 21);
assert(physics.filter(q => q.weaknessCode === "PH_B_FUNCTION_MODEL").length >= 21);
```

- [ ] **Step 3: Run the test and verify RED**

Run:

```powershell
node question-bank/priority-test.mjs
```

Expected: FAIL because `kuntai-english-priority.js` and `kuntai-physics-priority.js` do not exist.

- [ ] **Step 4: Commit test and contract**

```powershell
git add question-bank/PRIORITY_SCHEMA.md question-bank/priority-test.mjs
git commit -m "test: define Kuntai priority bank contract"
```

### Task 2: English Priority Bank

**Files:**
- Create: `question-bank/kuntai-english-priority.js`
- Test: `question-bank/priority-test.mjs`

- [ ] **Step 1: Extend the failing test with weakness coverage**

Require at least:

```js
const englishMinimums = {
  EN_A_LISTENING: 21,
  EN_TEXTBOOK_DICTATION: 21,
  EN_CONTEXT_CLOZE: 21,
  EN_B_READING_RESPONSE: 21,
  EN_WRITING_GRAMMAR: 21
};
```

For every English question assert:

```js
assert(["保分", "提升"].includes(q.difficulty));
assert(["choice", "text", "listening-text"].includes(q.answerMode));
if (q.answerMode === "listening-text") {
  assert(q.audioText && q.acceptedAnswers?.length);
}
assert(q.variant && normalize(q.variant.stem) !== normalize(q.stem));
```

- [ ] **Step 2: Run and verify RED**

Run:

```powershell
node question-bank/priority-test.mjs
```

Expected: FAIL with missing English bank or missing weakness coverage.

- [ ] **Step 3: Implement 105 original mother questions**

Create 21 questions for each category:

```js
const categories = [
  ["EN_A_LISTENING", "A卷听力", "保分"],
  ["EN_TEXTBOOK_DICTATION", "课内词汇与句子听写", "保分"],
  ["EN_CONTEXT_CLOZE", "结合上下文填空", "保分"],
  ["EN_B_READING_RESPONSE", "B卷阅读表达", "提升"],
  ["EN_WRITING_GRAMMAR", "作文语法与句型", "提升"]
];
```

Listening questions must hide transcripts in `audioText`; dictation questions use `answerMode: "listening-text"`. Reading response questions use `acceptedAnswers` plus `requiredKeywords`. Grammar questions cover tense consistency, subject-verb agreement, conjunctions, pronouns, comparative forms, infinitives, gerunds, passive voice, and sentence order.

- [ ] **Step 4: Run test and verify GREEN**

Run:

```powershell
node question-bank/priority-test.mjs
node question-bank/audit.mjs
```

Expected: priority test passes English checks; existing audit remains exit 0.

- [ ] **Step 5: Commit**

```powershell
git add question-bank/kuntai-english-priority.js question-bank/priority-test.mjs
git commit -m "feat: add Kuntai English weakness bank"
```

### Task 3: Physics Priority Bank

**Files:**
- Create: `question-bank/kuntai-physics-priority.js`
- Test: `question-bank/priority-test.mjs`

- [ ] **Step 1: Extend the failing test with physics coverage**

Require:

```js
const physicsMinimums = {
  PH_FRICTION: 7,
  PH_BUOYANCY: 7,
  PH_FLOAT_SINK: 7,
  PH_HYDROMETER: 7,
  PH_PULLEY_EFFICIENCY: 7,
  PH_RATIO_MODEL: 7,
  PH_B_FUNCTION_MODEL: 21
};
```

Assert every physics question has four distinct options, one valid answer, three-step explanation, units in quantitative options, and a non-identical variant.

- [ ] **Step 2: Run and verify RED**

Run:

```powershell
node question-bank/priority-test.mjs
```

Expected: FAIL because the physics priority bank is missing.

- [ ] **Step 3: Implement 63 original mother questions**

Use explicit scenario families:

```js
[
  "摩擦力方向/大小/实验",
  "浮力计算与比较",
  "沉浮条件",
  "密度计平衡关系",
  "滑轮组效率/功/功率",
  "多位置液位与数值比",
  "浮力-压强-液位-传感器分段函数"
]
```

For function models, each stem must state interval boundaries and variables. Explanations must identify the stage, establish the equation, and interpret slope or endpoint. Variants must change apparatus constraints or the requested relationship.

- [ ] **Step 4: Run test and verify GREEN**

Run:

```powershell
node question-bank/priority-test.mjs
node question-bank/audit.mjs
```

Expected: all priority and existing audits pass.

- [ ] **Step 5: Commit**

```powershell
git add question-bank/kuntai-physics-priority.js question-bank/priority-test.mjs
git commit -m "feat: add Kuntai physics weakness bank"
```

### Task 4: Load Banks And Implement 21-Day Scheduler

**Files:**
- Modify: `index.html`
- Modify: `question-bank/runtime-test.mjs`
- Test: `question-bank/priority-test.mjs`

- [ ] **Step 1: Write failing scheduler assertions**

Export a pure scheduler helper in a new inline namespace:

```js
window.KuntaiScheduler = {
  targetsForDay(day) {
    return day <= 21
      ? { 数学: 3, 英语: 5, 语文: 3, 物理: 3, 化学: 2, 地理: 1, 生物: 2 }
      : { 数学: 4, 英语: 3, 语文: 4, 物理: 1, 化学: 3, 地理: 2, 生物: 2 };
  }
};
```

The runtime test must assert both target sets total 19 and first 21 days consume 105 unique English and 63 unique physics priority questions.

- [ ] **Step 2: Run and verify RED**

Run:

```powershell
node question-bank/runtime-test.mjs
```

Expected: FAIL because priority scripts and scheduler are not loaded.

- [ ] **Step 3: Implement script loading and pool preference**

Add before the main inline script:

```html
<script src="question-bank/kuntai-english-priority.js"></script>
<script src="question-bank/kuntai-physics-priority.js"></script>
```

For day 1-21, `mixedPool()` must consume unseen questions matching `priorityProfile` for English and physics before general-bank questions. Do not count specialty practice toward daily locked targets.

- [ ] **Step 4: Run and verify GREEN**

Run:

```powershell
node question-bank/runtime-test.mjs
node question-bank/priority-test.mjs
```

Expected: 55 days pass; first 21 days show the weakness-priority distribution and no repeated IDs.

- [ ] **Step 5: Commit**

```powershell
git add index.html question-bank/runtime-test.mjs
git commit -m "feat: prioritize weaknesses for first 21 days"
```

### Task 5: Listening And Typed Answer UI

**Files:**
- Modify: `index.html`
- Create: `question-bank/answer-mode-test.mjs`

- [ ] **Step 1: Write failing answer-mode contract tests**

Assert HTML contains:

```js
assert(html.includes('id="textAnswer"'));
assert(html.includes("function normalizeTextAnswer"));
assert(html.includes("function evaluateTextAnswer"));
assert(html.includes("audioText"));
assert(html.includes("revealAfterSubmit"));
```

Also test the pure normalizer:

```js
assert(normalizeTextAnswer(" Patient. ") === "patient");
assert(normalizeSentenceAnswer("He is patient.") === "he is patient");
```

- [ ] **Step 2: Run and verify RED**

Run:

```powershell
node question-bank/answer-mode-test.mjs
```

Expected: FAIL because typed answer UI is absent.

- [ ] **Step 3: Implement backward-compatible rendering**

Choice questions keep the existing options. Text modes render:

```html
<input id="textAnswer" autocomplete="off" placeholder="请输入答案">
```

`submitAnswer()` must read either selected choice or typed text. Listening questions display the instruction stem but not `audioText`; the read button plays `audioText`. After submit, render `revealAfterSubmit`.

Text answer evaluation:

```js
function normalizeTextAnswer(value) {
  return value.trim().toLowerCase().replace(/[.?!。？！]+$/g, "");
}
```

Reading responses accept exact allowed answers or all `requiredKeywords`. Incorrect or unstable text questions enter the existing explanation and variant lock.

- [ ] **Step 4: Run and verify GREEN**

Run:

```powershell
node question-bank/answer-mode-test.mjs
node question-bank/audio-test.mjs
node question-bank/runtime-test.mjs
```

Expected: all pass.

- [ ] **Step 5: Commit**

```powershell
git add index.html question-bank/answer-mode-test.mjs
git commit -m "feat: add listening and typed answer modes"
```

### Task 6: Adaptive Weakness Status And Parent Dashboard

**Files:**
- Modify: `index.html`
- Modify: `question-bank/runtime-test.mjs`

- [ ] **Step 1: Write failing profile-state assertions**

Require state entries:

```js
state.weaknessStats[weaknessCode] = {
  done: 0,
  correct: 0,
  unsteady: 0,
  recent: []
};
```

Test status:

```js
statusFor({ recent: [1,1,1,1,1,1,0] }) === "已达标回收";
statusFor({ recent: [1,0,1,0,0,1,0] }) === "继续强化";
```

- [ ] **Step 2: Run and verify RED**

Run:

```powershell
node question-bank/runtime-test.mjs
```

Expected: FAIL because weakness statistics are not tracked.

- [ ] **Step 3: Implement tracking and dashboard rows**

On submit, update weakness stats only for priority questions. Keep the latest seven results. Parent rows show weakness name, completed count, accuracy, unsteady count, and status:

```js
accuracy >= 85 && recent.length >= 7 ? "已达标回收"
  : accuracy < 80 ? "继续强化"
  : "重点补弱";
```

After day 21, priority questions with `继续强化` are inserted daily; `已达标回收` appears every third day.

- [ ] **Step 4: Run and verify GREEN**

Run:

```powershell
node question-bank/runtime-test.mjs
node question-bank/priority-test.mjs
```

Expected: adaptive status and insertion tests pass.

- [ ] **Step 5: Commit**

```powershell
git add index.html question-bank/runtime-test.mjs
git commit -m "feat: track weakness mastery for parents"
```

### Task 7: Full Regression, Content Audit, And Deployment

**Files:**
- Modify: `question-bank/audit.mjs`
- Modify: `question-bank/audit-report.json`

- [ ] **Step 1: Extend the full audit**

Load standard and priority banks. Validate:

```js
allowedAnswerModes.has(q.answerMode || "choice");
q.answerMode === "choice" ? q.options.length === 4 : q.acceptedAnswers.length > 0;
q.audioText ? q.subject === "英语" : true;
```

Reject priority variants that equal any standard or priority mother stem.

- [ ] **Step 2: Run all tests**

Run:

```powershell
node question-bank/audit.mjs
node question-bank/priority-test.mjs
node question-bank/answer-mode-test.mjs
node question-bank/audio-test.mjs
node question-bank/runtime-test.mjs
```

Expected: all exit 0; audit report has zero errors.

- [ ] **Step 3: Serve and verify resources**

Run:

```powershell
python -m http.server 8766 --bind 127.0.0.1
```

Verify HTTP 200 for `index.html`, both priority scripts, and all standard subject scripts.

- [ ] **Step 4: Review diff and commit**

```powershell
git diff --check
git status --short
git add index.html question-bank
git commit -m "feat: add Kuntai personalized weakness training"
```

- [ ] **Step 5: Push and verify GitHub Pages**

```powershell
git push origin main
```

Verify the fixed URL contains both priority script references and that the new scripts return HTTP 200.
