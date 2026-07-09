(function () {
  const priorityTargets = {
    "数学": 12,
    "英语": 14,
    "语文": 8,
    "物理": 10,
    "化学": 8,
    "地理": 4,
    "生物": 4
  };

  const standardTargets = {
    "数学": 12,
    "英语": 10,
    "语文": 10,
    "物理": 8,
    "化学": 8,
    "地理": 6,
    "生物": 6
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
