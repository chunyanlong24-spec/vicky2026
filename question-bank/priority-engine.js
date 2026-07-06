(function () {
  const priorityTargets = {
    "数学": 3,
    "英语": 5,
    "语文": 3,
    "物理": 3,
    "化学": 2,
    "地理": 1,
    "生物": 2
  };

  const standardTargets = {
    "数学": 4,
    "英语": 3,
    "语文": 4,
    "物理": 1,
    "化学": 3,
    "地理": 2,
    "生物": 2
  };

  function targetsForDay(day) {
    return { ...(day <= 21 ? priorityTargets : standardTargets) };
  }

  function normalizeAnswer(value) {
    return String(value ?? "")
      .trim()
      .toLowerCase()
      .replace(/[，。！？,.!?;；:："'“”‘’]/g, "")
      .replace(/\s+/g, " ");
  }

  function evaluateAnswer(question, response) {
    if ((question.answerMode || "choice") === "choice") {
      return Number(response) === question.answer;
    }
    const normalized = normalizeAnswer(response);
    if (!normalized) return false;
    if (question.acceptedAnswers?.some(answer => normalizeAnswer(answer) === normalized)) {
      return true;
    }
    return Boolean(
      question.requiredKeywords?.length
      && question.requiredKeywords.every(keyword => normalized.includes(normalizeAnswer(keyword)))
    );
  }

  function interleaveByWeakness(rows) {
    const groups = new Map();
    rows.forEach(row => {
      const key = row.weaknessCode || "general";
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(row);
    });
    const result = [];
    const values = [...groups.values()];
    const max = Math.max(0, ...values.map(group => group.length));
    for (let index = 0; index < max; index += 1) {
      values.forEach(group => {
        if (group[index]) result.push(group[index]);
      });
    }
    return result;
  }

  window.KuntaiPriorityEngine = {
    targetsForDay,
    normalizeAnswer,
    evaluateAnswer,
    interleaveByWeakness
  };
})();
