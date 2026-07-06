# Kuntai Priority Bank Contract

Priority questions register under:

```js
window.KUNTAI_PRIORITY_BANK = window.KUNTAI_PRIORITY_BANK || {};
window.KUNTAI_PRIORITY_BANK.english = [];
window.KUNTAI_PRIORITY_BANK.physics = [];
```

Every item includes the standard question fields plus:

- `priorityProfile: "kuntai-2026-07"`
- `weaknessCode`
- `answerMode`: `choice`, `text`, or `listening-text`
- `audioText` for listening questions
- `acceptedAnswers` for typed questions
- `requiredKeywords` for reading responses when needed
- `revealAfterSubmit`

Choice questions use four options and a numeric answer. Typed questions use
`acceptedAnswers`; their variant follows the same answer mode.

