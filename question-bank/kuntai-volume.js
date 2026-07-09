(function () {
  "use strict";

  window.KUNTAI_PRIORITY_BANK = window.KUNTAI_PRIORITY_BANK || {};
  const bank = [];
  const letters = ["A", "B", "C", "D"];

  function explanation(subject, point, method) {
    return {
      exam: `坤泰暑假高强度刷题：${subject}·${point}`,
      error: "高刷题量下容易只凭感觉做题，跳过题型识别、关键词和步骤检查。",
      steps: [
        `先识别题型：${point}。`,
        method,
        "再把答案放回题干核对，确认不是只记住了表面词或数字。",
        "做错后进入同类变式，直到能独立说出第一步方法。"
      ],
      similar: "同类题会换材料、换设问或换条件，核心方法保持一致。"
    };
  }

  function addChoice(id, subject, code, point, difficulty, stem, options, answer, method, variant) {
    bank.push({
      id,
      subject,
      point,
      type: "坤泰高强度刷题",
      difficulty,
      priorityProfile: "kuntai-2026-07",
      weaknessCode: code,
      answerMode: "choice",
      stem,
      options: options.map((text, index) => `${letters[index]}. ${text}`),
      answer,
      explanation: explanation(subject, point, method),
      variant: {
        stem: variant.stem,
        options: variant.options.map((text, index) => `${letters[index]}. ${text}`),
        answer: variant.answer,
        answerMode: "choice"
      }
    });
  }

  function addHighVolume(subject, prefix, count, config) {
    for (let i = 0; i < count; i += 1) {
      const scene = config.scenes[i % config.scenes.length];
      const focus = config.focuses[Math.floor(i / config.scenes.length) % config.focuses.length];
      const context = config.contexts[Math.floor(i / (config.scenes.length * config.focuses.length)) % config.contexts.length];
      const action = config.actions[i % config.actions.length];
      const layer = ["基础识别", "标准应用", "限时训练", "易错辨析", "综合提升"][i % 5];
      addChoice(
        `${prefix}-${String(i + 1).padStart(4, "0")}`,
        subject,
        `${prefix.toUpperCase().replace(/-/g, "_")}_${i % config.focuses.length}`,
        `${focus}·${layer}`,
        i % 5 === 4 ? "提升" : "保分",
        `${subject}暑假刷题${i + 1}：在“${scene}”材料中考查${focus}。若题目给出“${context}”，最稳的处理方式是？`,
        [action, config.wrongA, config.wrongB, config.wrongC],
        0,
        config.method,
        {
          stem: `${subject}同类变式${i + 1}：把材料换成“${config.contexts[(i + 5) % config.contexts.length]}”，继续考查${focus}，第一步应抓什么？`,
          options: [config.variantAction, config.wrongB, config.wrongC, config.wrongA],
          answer: 0
        }
      );
    }
  }

  addHighVolume("英语", "kuntai-english-volume", 700, {
    scenes: ["听力短句", "课内词句听写", "语境填空", "阅读表达", "作文语法", "短文填空", "阅读细节", "同义改写", "校园生活短文", "学习方法短文", "成都文化短文", "志愿活动短文", "人物故事", "科普短文"],
    focuses: ["听力关键词", "课内词句", "上下文线索", "词性变化", "短语搭配", "阅读定位", "阅读表达", "作文句型", "时态语态", "连接词逻辑", "同义转换", "主旨判断"],
    contexts: ["先听或读关键词", "先判断空格词性", "先回原文定位", "先看前后句逻辑", "先确认固定搭配", "先排除语法不通选项", "先找表格栏目", "先把答案放回原句"],
    actions: ["抓关键词、词性和句子逻辑，再核对语法是否通顺", "先回到原文定位，再用同义表达回答", "把课内短语和语境线索连起来判断", "先判断句子结构，再选择词形或连接词"],
    method: "英语题先抓关键词和句子结构，再检查词义、词形、时态和拼写。",
    variantAction: "抓关键词、上下文和词性，不只看中文意思",
    wrongA: "只凭中文大意选熟词",
    wrongB: "不看词性直接填原形",
    wrongC: "不回原文定位就作答"
  });

  addHighVolume("数学", "kuntai-math-volume", 700, {
    scenes: ["一次函数图像", "分段计费", "几何角度图", "方程应用", "二次函数预习", "圆与相似预习", "坐标系图形", "方案选择", "实际应用表格", "证明题草图", "动点问题", "面积关系图"],
    focuses: ["一次函数k与b", "函数建模", "方程应用", "几何角度", "图形性质", "证明条件", "二次函数顶点", "坐标读图", "实际应用列式", "综合审题"],
    contexts: ["先确定变量", "先写关系式", "先标已知条件", "先找图形性质", "先代入特殊点", "先拆成小问题", "先看题目问什么", "先排除无关条件"],
    actions: ["识别题型后写关系式，再把条件逐步代入", "先标图形已知，再连接结论需要的性质", "把实际问题转成方程或函数表达式", "先拆题，再计算，避免跳步"],
    method: "数学题先识别模型，再写关系式；几何题先标已知，函数题先确定变量。",
    variantAction: "抓题型、变量和已知条件",
    wrongA: "只看数字直接猜",
    wrongB: "跳过关系式心算",
    wrongC: "把无关条件也混进计算"
  });

  addHighVolume("语文", "kuntai-chinese-volume", 560, {
    scenes: ["现代文阅读", "文言文理解", "古诗赏析", "名著阅读", "作文素材", "语言应用", "说明文阅读", "句子赏析", "标题作用", "人物形象", "情感主旨", "材料概括"],
    focuses: ["现代文细节作用", "文言实词", "古诗情感", "名著人物", "作文叙事素材", "语言表达场景", "说明对象", "句子赏析", "标题含义", "主旨概括"],
    contexts: ["先判断文体", "先抓关键词", "先回原文定位", "先概括内容", "先写人物情感", "先看题干问法", "先组织答题模板"],
    actions: ["按题型写出内容、作用和情感，答案要完整", "先回原文找依据，再整理成答题句", "古诗先看意象、关键词和作者处境", "语言应用先匹配场景、对象和目的"],
    method: "语文题先判断文体和设问，再按内容、作用、情感或表达目的组织答案。",
    variantAction: "抓文体、关键词和答题结构",
    wrongA: "只抄原文不分析",
    wrongB: "不写人物和情感",
    wrongC: "不看场景随便写"
  });

  addHighVolume("物理", "kuntai-physics-volume", 560, {
    scenes: ["力学受力图", "压强浮力", "密度计", "B卷函数图像", "实验探究", "电路预习", "欧姆定律", "匀速运动图像", "滑轮组", "杠杆模型", "液体深度比较", "传感器示数"],
    focuses: ["受力分析", "压强公式", "浮力条件", "密度关系", "函数图像", "实验变量", "电路识别", "欧姆定律", "机械效率", "杠杆平衡"],
    contexts: ["先画受力图", "先判断运动状态", "先找不变量", "先写公式", "先确定分段点", "先比较浮力和重力", "先看图像增减", "先统一单位"],
    actions: ["先画受力图或过程图，再找不变量和公式", "把过程分段，分别判断力、压强或浮力变化", "先判断实验变量和控制量", "先写公式，再代入同一单位"],
    method: "物理题先画图、找状态、写公式，再判断变量之间的关系。",
    variantAction: "抓受力状态、公式和分段点",
    wrongA: "只凭图像形状猜",
    wrongB: "把浮力压力压强混淆",
    wrongC: "不统一单位就计算"
  });

  addHighVolume("化学", "kuntai-chemistry-volume", 450, {
    scenes: ["元素符号", "化学式", "实验操作", "氧气性质", "水的组成", "质量守恒", "化学方程式", "微观粒子", "气体检验", "仪器使用"],
    focuses: ["元素符号", "常见化学式", "实验安全", "气体制取", "气体检验", "质量守恒", "方程式配平", "分子原子", "实验现象"],
    contexts: ["先看反应物生成物", "先检查下标", "先判断实验目的", "先区分现象和结论", "先数原子个数", "先看仪器操作"],
    actions: ["回到教材核心概念，检查符号、下标、配平和实验安全", "把实验操作、现象和结论分开判断", "用原子个数守恒检查方程式", "先识别常见物质和基础实验"],
    method: "化学题先识别概念和实验目的，再检查符号、配平和操作安全。",
    variantAction: "抓化学式、实验目的和守恒关系",
    wrongA: "元素符号和化学式混用",
    wrongB: "只记现象不看条件",
    wrongC: "不检查配平"
  });

  addHighVolume("地理", "kuntai-geography-volume", 300, {
    scenes: ["经纬网", "等高线", "气候资料图", "中国区域图", "地图比例尺", "河流流向", "交通线路", "农业分布", "四川区域", "世界气候"],
    focuses: ["经纬度判断", "半球位置", "等高线地形", "方向判断", "比例尺", "气候类型", "区域特征", "读图信息"],
    contexts: ["先看图例", "先找方向标", "先读坐标", "先看等高线疏密", "先看气温降水", "先定位区域"],
    actions: ["先读图例、方向和坐标，再结合材料判断区域特征", "从图中提取信息，不凭印象猜", "先定位，再分析自然和人文条件", "把气温、降水、地形分开判断"],
    method: "地理题先读图例、位置和材料关键词，再分析区域特征。",
    variantAction: "抓图例、位置、方向和材料关键词",
    wrongA: "不看图例直接猜",
    wrongB: "经纬度看反",
    wrongC: "只凭生活经验作答"
  });

  addHighVolume("生物", "kuntai-biology-volume", 300, {
    scenes: ["人体消化", "呼吸系统", "血液循环", "植物光合作用", "蒸腾作用", "遗传变异", "实验探究", "显微镜", "生态系统", "生殖发育"],
    focuses: ["结构功能", "营养吸收", "呼吸循环", "光合作用", "蒸腾作用", "遗传变异", "单一变量", "对照实验", "生态关系", "显微镜操作"],
    contexts: ["先找实验变量", "先区分实验组和对照组", "先看结构对应功能", "先抓关键词", "先看图示箭头", "先排除无关条件"],
    actions: ["先找变量、对照和结论，再判断实验是否严谨", "结构和功能对应起来记", "读图先看箭头、标签和条件", "用单一变量原则排除干扰项"],
    method: "生物题先找变量、对照、结构功能和图示信息。",
    variantAction: "抓变量、对照、结构功能和图示信息",
    wrongA: "同时改变多个条件",
    wrongB: "只背名词不看图",
    wrongC: "结构功能对应错"
  });

  window.KUNTAI_PRIORITY_BANK.volume = bank;
})();
