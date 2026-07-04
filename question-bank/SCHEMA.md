# Kuntai Question Bank Contract

Each subject file must assign an array to:

```js
window.KUNTAI_BANK = window.KUNTAI_BANK || {};
window.KUNTAI_BANK.<subject> = [/* questions */];
```

Question shape:

```js
{
  id: "unique-id",
  subject: "科目",
  point: "教材考点",
  type: "真实考试题型",
  difficulty: "保分|提升|拔高|预习保分",
  stem: "题干",
  translation: "英语题可用，其他科目省略",
  options: ["A. ...", "B. ...", "C. ...", "D. ..."],
  answer: 0,
  explanation: {
    exam: "考点",
    error: "常见错因",
    steps: ["步骤1", "步骤2", "步骤3"],
    similar: "迁移方法"
  },
  variant: {
    stem: "不同材料/条件/问法的同类变式",
    translation: "英语题可用",
    options: ["A. ...", "B. ...", "C. ...", "D. ..."],
    answer: 0
  }
}
```

Quality requirements:

- Original, exam-style questions aligned with current junior-high textbook concepts.
- No copied long passages or copyrighted exam text.
- No advice/meta questions such as "how should you review".
- Base stems must be genuinely distinct after numbers and names are removed.
- Variant must change material, conditions, or question angle, not only numbers.
- Exactly one correct answer.
- Distractors must be plausible.
- Answer positions should be reasonably balanced across A-D.
- Explanation must contain at least three meaningful steps.
- Include a mix of 保分、提升、拔高 and preview content where appropriate.
