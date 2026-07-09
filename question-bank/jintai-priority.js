(function () {
  "use strict";

  window.KUNTAI_PRIORITY_BANK = {};
  const bank = [];
  const letters = ["A", "B", "C", "D"];

  function explanation(subject, point, error, method, answerText, similar) {
    return {
      exam: `金泰重点补弱：${subject}·${point}`,
      error,
      steps: [
        `先识别题型：${point}。`,
        method,
        `本题答案：${answerText}`,
        "做完后用同类变式检查是否真的掌握，而不是记住原题。"
      ],
      similar
    };
  }

  function addChoice(id, subject, code, point, difficulty, stem, options, answer, error, method, variant) {
    bank.push({
      id,
      subject,
      point,
      type: "金泰专项题",
      difficulty,
      priorityProfile: "jintai-2026-07",
      weaknessCode: code,
      answerMode: "choice",
      stem,
      options: options.map((text, index) => `${letters[index]}. ${text}`),
      answer,
      explanation: explanation(subject, point, error, method, options[answer], "同类题会换图形、条件或材料，核心方法保持不变。"),
      variant: {
        stem: variant.stem,
        options: variant.options.map((text, index) => `${letters[index]}. ${text}`),
        answer: variant.answer,
        answerMode: "choice"
      }
    });
  }

  function addText(id, subject, code, point, difficulty, stem, answers, keywords, error, method, reveal, variant) {
    bank.push({
      id,
      subject,
      point,
      type: "金泰专项题",
      difficulty,
      priorityProfile: "jintai-2026-07",
      weaknessCode: code,
      answerMode: "text",
      stem,
      acceptedAnswers: answers,
      requiredKeywords: keywords,
      explanation: explanation(subject, point, error, method, reveal, "同类题重点检查关键词是否完整、表达是否对应题干。"),
      revealAfterSubmit: reveal,
      variant: {
        stem: variant.stem,
        answerMode: "text",
        acceptedAnswers: variant.answers,
        requiredKeywords: variant.keywords,
        revealAfterSubmit: variant.reveal
      }
    });
  }

  [
    ["geo-rotate", "图形旋转", "点A(2,1)绕原点顺时针旋转90°后坐标为？", ["(1,-2)", "(-1,2)", "(2,-1)", "(-2,-1)"], 0, "点B(-3,2)绕原点顺时针旋转90°后坐标为？", ["(2,3)", "(-2,-3)", "(3,2)", "(-3,-2)"], 0],
    ["geo-parallel", "平行线角度", "两直线平行，同旁内角分别为3x+20°和2x+10°，x等于？", ["30", "34", "38", "42"], 0, "两直线平行，同旁内角为4x+12°和2x+36°，x等于？", ["22", "26", "30", "34"], 0],
    ["geo-square", "正方形性质与判定", "四边形ABCD是矩形，若再增加一个条件即可判定为正方形，最合适的是？", ["AB=BC", "AB∥CD", "∠A=90°", "AC=BD"], 0, "四边形ABCD是菱形，若再增加一个条件即可判定为正方形，最合适的是？", ["∠A=90°", "AB=BC", "AD∥BC", "AC⊥BD"], 0],
    ["geo-rhombus", "菱形性质与判定", "平行四边形ABCD中，若AC⊥BD，则它一定是？", ["菱形", "矩形", "梯形", "任意四边形"], 0, "平行四边形ABCD中，若AB=BC，则它一定是？", ["菱形", "矩形", "等腰梯形", "直角三角形"], 0],
    ["linear-function", "一次函数图像与表达式", "一次函数y=kx+b经过(0,-2)，且图像随x增大而上升，则下列正确的是？", ["b=-2，k>0", "b=0，k<0", "b=-2，k<0", "b>0，k>0"], 0, "一次函数y=kx+b经过(0,5)，且图像随x增大而下降，则下列正确的是？", ["b=5，k<0", "b=0，k>0", "b=5，k>0", "b<0，k<0"], 0],
    ["linear-solve", "一次函数三问压轴", "已知一次函数过(1,3)、(3,7)，它的解析式是？", ["y=2x+1", "y=x+2", "y=3x", "y=-2x+5"], 0, "某一次函数图像经过点(2,1)，斜率为2，则它与y轴交点对应的函数表达式是？", ["y=2x-3", "y=x-1", "y=3x-5", "y=-2x+5"], 0],
    ["ineq-two", "二元不等式组", "若x+y>6，且x=2，则y应满足？", ["y>4", "y<4", "y>8", "y<8"], 0, "若2x+y≤10，且x=3，则y应满足？", ["y≤4", "y≥4", "y≤7", "y≥7"], 0],
    ["midline", "几何中线问题", "△ABC中，D为BC中点，若AB=AC，则AD还一定是？", ["角平分线和高", "外角平分线", "中位线", "任意线段"], 0, "△ABC中，D为BC中点，AD⊥BC，若AB=AC，则AD一定还是？", ["顶角平分线", "底边延长线", "中位线", "对角线"], 0]
  ].forEach((row, index) => {
    addChoice(
      `jintai-math-${String(index + 1).padStart(3, "0")}`,
      "数学", `MATH_${row[0].toUpperCase().replace(/-/g, "_")}`, row[1], index % 3 === 0 ? "提升" : "保分",
      row[2], row[3], row[4],
      "易在复杂图形、函数条件或多未知量条件中找不到第一步，导致A卷/B卷连续失分。",
      "先把题型归类，再写出核心关系式；几何题先标已知、函数题先求k和b、不等式题先代入再变形。",
      { stem: row[5], options: row[6], answer: row[7] }
    );
  });

  [
    ["friction-dir", "摩擦力方向与大小", "木块在水平桌面上向右匀速运动，受到的滑动摩擦力方向是？", ["向左", "向右", "竖直向上", "竖直向下"], 0, "木块被水平向右拉着做匀速直线运动，拉力为6N，则滑动摩擦力大小为？", ["6N", "3N", "12N", "0N"], 0],
    ["ratio-level", "多位置液位/数值之比", "同一容器中液体密度不变，深度从h变为2h，液体压强之比p1:p2为？", ["1:2", "2:1", "1:4", "4:1"], 0, "同种液体中A点深度为h，B点深度为3h，压强pA:pB为？", ["1:3", "3:1", "1:9", "9:1"], 0],
    ["pulley-eff", "滑轮组机械效率", "滑轮组提升重物时，有用功为80J，总功为100J，机械效率为？", ["80%", "20%", "125%", "180%"], 0, "滑轮组有用功为150J，总功为200J，机械效率为？", ["75%", "50%", "125%", "25%"], 0],
    ["lever-balance", "杠杆平衡关系式", "杠杆平衡时，动力F1、动力臂l1、阻力F2、阻力臂l2满足？", ["F1l1=F2l2", "F1/l1=F2/l2", "F1+F2=l1+l2", "F1-F2=l1-l2"], 0, "若杠杆左端力为10N，力臂20cm，右端力臂10cm，则右端力为？", ["20N", "5N", "10N", "40N"], 0],
    ["densimeter", "密度计平衡", "同一支密度计漂浮在水和待测液体中时，所受浮力关系是？", ["相等", "水中更大", "待测液中更大", "无法比较"], 0, "密度计在液体中漂浮得更高，说明该液体密度与水相比通常是？", ["更大", "更小", "相等", "一定为0"], 0],
    ["float-condition", "物体沉浮条件", "物体浸没在液体中，若浮力小于重力，物体将？", ["下沉", "上浮", "悬浮", "一定漂浮"], 0, "物体浸没时F浮=G，它在液体中可能处于？", ["悬浮", "一定下沉", "一定上浮", "一定露出水面"], 0],
    ["buoyancy-pressure", "浮力与底面压强函数", "柱形物体底面积S一定，底面所受液体压强为p，则底面受到的压力可表示为？", ["F=pS", "F=p/S", "F=S/p", "F=p+S"], 0, "若物体底面积为0.02m²，底面压强为500Pa，则底面受力为？", ["10N", "25N", "500N", "0.04N"], 0],
    ["container-pressure", "容器对桌面压力与水高", "向柱形容器中加水，容器对水平桌面的压力随水面高度增加通常怎样变化？", ["逐渐增大", "逐渐减小", "保持不变", "先减小后增大"], 0, "柱形容器底面积不变，水高增加，水的重力怎样变化？", ["增大", "减小", "不变", "先不变后减小"], 0],
    ["sensor-water", "悬空物体加水与力传感器", "悬挂物体底部刚接触水后继续加水至浸没，力传感器示数通常怎样变化？", ["逐渐减小", "逐渐增大", "保持不变", "先增大后减小"], 0, "物体逐渐浸入水中时，浮力通常怎样变化？", ["逐渐增大", "逐渐减小", "保持不变", "变为0"], 0]
  ].forEach((row, index) => {
    addChoice(
      `jintai-physics-${String(index + 1).padStart(3, "0")}`,
      "物理", `PHYS_${row[0].toUpperCase().replace(/-/g, "_")}`, row[1], index % 2 === 0 ? "提升" : "保分",
      row[2], row[3], row[4],
      "易把方向、受力平衡、比例关系和函数变化混在一起，B卷综合图像题失分明显。",
      "先画受力或变量表，再抓不变量：密度、底面积、重力、平衡条件；最后写关系式或判断单调变化。",
      { stem: row[5], options: row[6], answer: row[7] }
    );
  });

  [
    ["cloze-vocab", "短文填空·课外词汇", "After reading the map carefully, Jenny found the right way and arrived ____.", ["successfully", "success", "successful", "succeed"], 0, "看清词性：修饰动词arrived用副词successfully。", "After several tries, the team finished the project ____.", ["successfully", "success", "successful", "succeed"], 0],
    ["cloze-context", "短文填空·上下文", "The box was too heavy, so David asked his friend to ____ him.", ["help", "hide", "hurt", "hear"], 0, "前文too heavy提示需要help。", "The question was difficult, so Lily asked the teacher to ____ it again.", ["explain", "invite", "repair", "collect"], 0],
    ["table-synonym", "完成表格·同义转换", "原文：He was not interested in the game. 表格应填：He showed no ____ in the game.", ["interest", "message", "habit", "reason"], 0, "not interested in可转换为show no interest in。", "原文：She decided to join the club. 表格应填：She made a ____ to join the club.", ["decision", "difference", "mistake", "promise"], 0],
    ["phrase-meaning", "同义短语积累", "Which phrase has the closest meaning to look after?", ["take care of", "look for", "look up", "take off"], 0, "look after等于take care of。", "Which phrase has the closest meaning to set up?", ["build up", "give up", "wake up", "put off"], 0]
  ].forEach((row, index) => {
    addChoice(
      `jintai-english-${String(index + 1).padStart(3, "0")}`,
      "英语", `EN_${row[0].toUpperCase().replace(/-/g, "_")}`, row[1], index % 2 === 0 ? "提升" : "保分",
      row[2], row[3], row[4],
      "遇到课外单词、陌生句子或表格同义转换时，容易只懂大意但填不准词形。",
      row[5],
      { stem: row[6], options: row[7], answer: row[8] }
    );
  });

  addText(
    "jintai-english-text-001", "英语", "EN_TABLE_PARAPHRASE", "完成表格·同义表达", "提升",
    "把句子改写成表格表达：The girl was able to solve the problem by herself. The girl ____ solve the problem alone.",
    ["could", "was able to"], ["could"], "表格题常扣在同义词/短语储备不足。",
    "先找原文核心意思was able to，再换成同义情态表达could。",
    "可填：could",
    { stem: "同类变式：He did not go to school because he was ill. He was absent from school ____ his illness.", answers: ["because of", "due to"], keywords: ["because", "of"], reveal: "可填：because of" }
  );

  [
    ["expository", "说明文阅读", "阅读片段：成都大运会场馆采用雨水回收系统，收集的雨水可用于绿化浇灌。本文主要说明对象是？", ["雨水回收系统", "运动员训练", "观众座位", "比赛成绩"], 0, "说明文先找说明对象，再看特征和作用。", "阅读片段：这种书包在肩带处增加软垫，可减轻肩部压力。本文主要说明对象是？", ["新型书包", "肩部疼痛", "学校操场", "课外阅读"], 0],
    ["narrative", "记叙/散文阅读", "阅读片段：父亲把伞往我这边倾斜，自己的肩头却湿了一片。这个细节主要表现了什么？", ["父亲无声的关爱", "雨下得很小", "伞质量不好", "路面很宽"], 0, "抓人物动作和细节背后的情感。", "阅读片段：母亲把热粥推到我面前，只说了一句：慢点喝。这个细节主要表现了什么？", ["母亲细腻的关心", "粥很贵", "天气炎热", "作者讨厌喝粥"], 0],
    ["poem-feeling", "课外古诗情感", "诗句“独在异乡为异客，每逢佳节倍思亲”表达的主要情感是？", ["思乡怀亲", "建功报国", "山水闲适", "讽刺批判"], 0, "古诗先看意象、处境和关键词，再概括情感。", "诗句“夕阳西下，断肠人在天涯”表达的主要情感是？", ["漂泊思乡", "欢乐团圆", "边塞豪情", "田园闲适"], 0],
    ["language-use", "语言应用", "学校要倡议节约用水，下列宣传语最恰当的是？", ["珍惜每一滴水，共护美好校园", "水很普通，不必在意", "今天不学习，明天再努力", "比赛第一，友谊第二"], 0, "语言应用题要匹配场景、对象和表达目的。", "班级要倡议文明阅读，下列宣传语最恰当的是？", ["轻声阅读，共享书香", "大声喧哗，热闹最好", "少读书，多睡觉", "书本越旧越没用"], 0]
  ].forEach((row, index) => {
    addChoice(
      `jintai-chinese-${String(index + 1).padStart(3, "0")}`,
      "语文", `CH_${row[0].toUpperCase().replace(/-/g, "_")}`, row[1], index % 2 === 0 ? "提升" : "保分",
      row[2], row[3], row[4],
      "说明文、现代文问答、课外古诗文和语言应用容易读不透题意，答案抓不住关键词。",
      row[5],
      { stem: row[6], options: row[7], answer: row[8] }
    );
  });

  addText(
    "jintai-chinese-text-001", "语文", "CH_READING_ANSWER", "阅读理解问答", "提升",
    "阅读片段：外婆把补好的校服叠得整整齐齐，放进我的书包。请用一句话概括这个细节表现的人物情感。",
    ["外婆对我的关爱", "外婆关爱我", "表现外婆的关心"], ["外婆", "关"],
    "阅读问答题容易只复述情节，没点出人物情感。",
    "先写人物，再写情感；答案要包含“外婆”和“关爱/关心”。",
    "示例：表现了外婆对我的细心关爱。",
    { stem: "同类变式：父亲默默修好我的自行车，没有多说一句。请概括这个细节表现的人物情感。", answers: ["父亲对我的关爱", "父亲关心我"], keywords: ["父亲", "关"], reveal: "示例：表现了父亲含蓄而深沉的关爱。" }
  );

  function addGeneratedChoice(prefix, subject, point, code, rows, error, method) {
    rows.forEach((row, index) => {
      addChoice(
        `${prefix}-${String(index + 1).padStart(3, "0")}`,
        subject,
        code,
        point,
        index % 4 === 0 ? "提升" : "保分",
        row.stem,
        row.options,
        row.answer,
        error,
        method,
        row.variant
      );
    });
  }

  const scenes = ["校园平面图", "棋盘路线", "机器人行走", "舞台灯位", "操场标记", "方格纸", "航模轨迹", "地图定位", "座位平面", "图形拼板", "无人机坐标", "舞蹈队形"];
  const mathRows = [];
  scenes.forEach((scene, index) => {
    const x = index + 2;
    const y = index % 2 === 0 ? index + 1 : -(index + 1);
    mathRows.push({
      stem: `${scene}中，点P(${x},${y})绕原点顺时针旋转90°，旋转后坐标应先用哪条规则判断？`,
      options: ["(x,y)→(y,-x)", "(x,y)→(-y,x)", "(x,y)→(-x,-y)", "(x,y)→(x,-y)"],
      answer: 0,
      variant: {
        stem: `${scene}变式：点Q先绕原点逆时针旋转90°，应使用哪条坐标变换规则？`,
        options: ["(x,y)→(-y,x)", "(x,y)→(y,-x)", "(x,y)→(-x,-y)", "(x,y)→(x,-y)"],
        answer: 0
      }
    });
  });

  ["折线模型", "楼梯扶手", "窗框结构", "桥梁横梁", "练习册配图", "折纸图", "路口斑马线", "几何网格", "黑板示意", "竞赛草图"].forEach((scene, index) => {
    mathRows.push({
      stem: `${scene}中两直线平行，一组同旁内角分别表示为${index + 2}x+20°和${index + 3}x+40°，第一步应列什么关系？`,
      options: ["两个角和为180°", "两个角相等", "两个角和为90°", "两个角没有关系"],
      answer: 0,
      variant: {
        stem: `${scene}变式：若题目给出内错角，判断角度关系时应优先使用哪条性质？`,
        options: ["两直线平行，内错角相等", "同旁内角相等", "对角线互相平分", "三角形三边相等"],
        answer: 0
      }
    });
  });

  ["矩形判定", "菱形判定", "正方形判定", "平行四边形证明", "四边形综合", "折叠四边形", "网格四边形", "中点四边形", "对角线模型", "边角条件模型"].forEach((scene, index) => {
    mathRows.push({
      stem: `${scene}题中，已知四边形是矩形，要补充一个条件判定为正方形，下列最有效的是？`,
      options: ["一组邻边相等", "对角线相等", "有一个角为直角", "两组对边平行"],
      answer: 0,
      variant: {
        stem: `${scene}变式：已知四边形是菱形，要进一步判定为正方形，最关键的条件是？`,
        options: ["有一个角为90°", "四条边相等", "对角线互相垂直", "一组对边平行"],
        answer: 0
      }
    });
  });

  ["打车费用", "打印收费", "水费阶梯", "电话套餐", "停车收费", "快递计费", "租车费用", "文具团购", "健身卡余额", "图书借阅押金"].forEach((scene, index) => {
    mathRows.push({
      stem: `${scene}的一次函数题中，图像经过(0,${index + 1})且随x增大而上升，关于k和b的判断正确的是？`,
      options: [`b=${index + 1}，k>0`, `b=0，k<0`, `b=${index + 1}，k<0`, "b<0，k>0"],
      answer: 0,
      variant: {
        stem: `${scene}变式：若一次函数图像向右下方倾斜，且与y轴交于正半轴，应判断为？`,
        options: ["k<0，b>0", "k>0，b<0", "k=0，b<0", "k>0，b=0"],
        answer: 0
      }
    });
  });

  ["零花钱限制", "购书预算", "社团报名", "运动积分", "车票组合", "水果采购", "文具采购", "班费使用", "打印页数", "志愿服务时长"].forEach((scene, index) => {
    mathRows.push({
      stem: `${scene}题中出现两个未知量x、y，并给出x+y>目标值。若已知x的范围，下一步最合理的是？`,
      options: ["把已知条件代入不等式，转化为关于y的不等式", "直接把x和y都删掉", "只比较题干字数", "把不等号改成等号"],
      answer: 0,
      variant: {
        stem: `${scene}变式：遇到二元不等式组时，若题目要求判断可行方案，应先做什么？`,
        options: ["逐条检验方案是否满足所有不等式", "只看第一个不等式", "只选数字最大的方案", "忽略单位"],
        answer: 0
      }
    });
  });

  ["等腰三角形中线", "复杂三角形草图", "折叠后的中线", "辅助线模型", "三角形面积模型", "中点连线模型", "角平分线模型", "垂线模型", "证明题草图", "B卷几何综合"].forEach((scene, index) => {
    mathRows.push({
      stem: `${scene}题中，D是BC中点，且AB=AC。要利用“中线”推进证明，最常用的结论是？`,
      options: ["等腰三角形底边上的中线也是高和角平分线", "中线一定等于底边", "所有三角形中线都垂直底边", "中线一定平分顶角但不一定过中点"],
      answer: 0,
      variant: {
        stem: `${scene}变式：图形复杂时，看到中点和等腰条件，优先补哪条辅助线思路？`,
        options: ["连接顶点与底边中点，寻找三线合一", "随意延长所有边", "只计算周长", "把三角形改成圆"],
        answer: 0
      }
    });
  });

  addGeneratedChoice(
    "jintai-math-extra", "数学", "暑假数学薄弱点分层", "MATH_SUMMER_WEAKNESS", mathRows,
    "金泰数学主要失分在几何复杂图形、一次函数和多未知量条件，容易不会启动第一步。",
    "先识别模型，再写关系式；如果是几何，先找平行、旋转、中点、特殊四边形；如果是函数或不等式，先确定变量关系。"
  );

  const physicsRows = [];
  ["木块匀速滑动", "传送带表面", "书本被推动", "箱子向右运动", "橡皮在桌面滑行", "小车被拉动", "冰壶减速", "鞋底摩擦", "斜面上滑块", "水平地面拖箱"].forEach((scene) => {
    physicsRows.push({
      stem: `${scene}时，判断摩擦力方向最可靠的方法是？`,
      options: ["先判断相对运动或相对运动趋势", "只看物体质量大小", "永远与拉力同向", "永远竖直向上"],
      answer: 0,
      variant: {
        stem: `${scene}变式：物体做匀速直线运动时，水平方向拉力与摩擦力大小关系通常是？`,
        options: ["大小相等，方向相反", "拉力一定更大", "摩擦力一定为0", "二者方向相同"],
        answer: 0
      }
    });
  });

  ["U形管液位", "柱形容器液面", "连通器示意", "杯中不同深度", "水槽多点压强", "油水分层", "试管倾斜", "水坝剖面", "潜水深度", "液体压强计"].forEach((scene) => {
    physicsRows.push({
      stem: `${scene}题要求比较多个位置压强之比，优先抓住哪两个量？`,
      options: ["液体密度和深度", "容器颜色和形状", "桌面高度和空气温度", "物体速度和路程"],
      answer: 0,
      variant: {
        stem: `${scene}变式：同种液体中深度越大，液体压强如何变化？`,
        options: ["越大", "越小", "不变", "先变小后变大"],
        answer: 0
      }
    });
  });

  ["滑轮组提升重物", "动滑轮拉物体", "斜面提升箱子", "起重装置", "实验测机械效率", "绳端拉力模型", "竖直提升水桶", "工人吊材料", "滑轮组做功", "功率估算"].forEach((scene) => {
    physicsRows.push({
      stem: `${scene}题中，计算机械效率时应使用哪组量？`,
      options: ["有用功/总功", "总功/有用功", "功率/时间", "距离/速度"],
      answer: 0,
      variant: {
        stem: `${scene}变式：若要求功率，最直接的关系式是？`,
        options: ["P=W/t", "P=F/S", "P=ρgh", "P=G/V"],
        answer: 0
      }
    });
  });

  ["跷跷板", "撬棍", "天平式杠杆", "开瓶器模型", "扳手模型", "杠杆尺实验", "力臂示意图", "支点移动", "阻力臂变化", "动力臂变化"].forEach((scene) => {
    physicsRows.push({
      stem: `${scene}题判断杠杆是否平衡，核心关系式是？`,
      options: ["F1l1=F2l2", "F1+F2=l1+l2", "F1/l2=F2/l1", "F1-F2=l1-l2"],
      answer: 0,
      variant: {
        stem: `${scene}变式：若动力臂变长，要保持平衡，动力通常怎样变化？`,
        options: ["变小", "变大", "不可能变化", "一定为0"],
        answer: 0
      }
    });
  });

  ["密度计漂浮", "木块漂浮", "小球悬浮", "铁块下沉", "盐水中鸡蛋", "潜水艇模型", "浮标模型", "冰块入水", "橡皮泥船", "液体密度比较"].forEach((scene) => {
    physicsRows.push({
      stem: `${scene}题判断沉浮时，最先比较哪两个力？`,
      options: ["浮力和重力", "压力和速度", "功率和时间", "电压和电流"],
      answer: 0,
      variant: {
        stem: `${scene}变式：物体漂浮或悬浮时，浮力与重力关系通常是？`,
        options: ["F浮=G", "F浮>G很多", "F浮<G", "二者无关"],
        answer: 0
      }
    });
  });

  ["柱形物体入水", "方块底面受压", "浮力图像", "压强函数", "水面高度函数", "容器对桌面压力", "力传感器示数", "悬挂物浸水", "逐渐加水实验", "B卷函数图像"].forEach((scene) => {
    physicsRows.push({
      stem: `${scene}题要求写函数关系，第一步应先确定什么？`,
      options: ["自变量、因变量和分段变化区间", "选项字数多少", "图像颜色", "题目所在页码"],
      answer: 0,
      variant: {
        stem: `${scene}变式：物体从刚接触水到逐渐浸没，浮力一般怎样变化？`,
        options: ["随排开水体积增大而增大", "一直为0", "先变小后消失", "只与容器颜色有关"],
        answer: 0
      }
    });
  });

  ["水面到容器底部高度", "桌面对容器支持力", "加水过程图像", "底面压强变化", "液体重力变化", "容器总重变化", "函数图像拐点", "分段函数模型", "读图判断斜率", "实验数据表格"].forEach((scene) => {
    physicsRows.push({
      stem: `${scene}题中，向柱形容器持续加水，容器对水平桌面的压力通常如何变化？`,
      options: ["随水的重力增加而增大", "始终减小", "始终为0", "只与水面颜色有关"],
      answer: 0,
      variant: {
        stem: `${scene}变式：若图像出现拐点，通常说明哪个物理过程发生改变？`,
        options: ["受力或浸没状态进入新阶段", "题目一定出错", "单位不再重要", "重力突然消失"],
        answer: 0
      }
    });
  });

  addGeneratedChoice(
    "jintai-physics-extra", "物理", "暑假物理薄弱模型", "PHYS_SUMMER_WEAKNESS", physicsRows,
    "金泰物理主要卡在受力方向、比例关系、机械效率和浮力压强函数图像。",
    "先画过程图或受力图，再找不变量和分段点；涉及函数时先确定自变量、因变量、变化区间。"
  );

  const englishRows = [];
  [
    ["Mia kept a diary every day, so her writing improved ____.", "quickly", "形容improved用副词quickly"],
    ["The village became ____ after the new road was built.", "popular", "became后接形容词popular作表语"],
    ["Jack missed the bus, ____ he was late for the meeting.", "so", "前因后果用so"],
    ["The question looks easy, ____ it needs careful thinking.", "but", "前后转折用but"],
    ["Reading outside class can increase our ____.", "vocabulary", "increase our vocabulary表示增加词汇量"],
    ["The girl gave a clear ____ of the accident.", "description", "a clear后接名词description"],
    ["Tom felt ____ when he saw the strange word.", "confused", "人感到困惑用confused"],
    ["The teacher asked us to read the passage ____.", "aloud", "read aloud表示朗读"]
  ].forEach((row, index) => {
    englishRows.push({
      stem: `短文填空训练${String.fromCharCode(65 + index)}：${row[0]}`,
      options: [row[1], "careful", "silent", "danger"],
      answer: 0,
      variant: {
        stem: `同类短文填空变式${String.fromCharCode(65 + index)}：根据上下文和词性判断空格答案。`,
        options: [row[1], "carefully", "silence", "dangerous"],
        answer: 0
      }
    });
  });

  [
    ["not interested in", "showed no interest in", "interest"],
    ["decided to", "made a decision to", "decision"],
    ["was able to", "could", "could"],
    ["because of", "as a result of", "because of"],
    ["look after", "take care of", "take care of"],
    ["set up", "build up", "build up"],
    ["more than", "over", "over"],
    ["at last", "finally", "finally"],
    ["be good at", "do well in", "do well in"],
    ["return", "come back", "come back"]
  ].forEach((row, index) => {
    englishRows.push({
      stem: `完成表格训练${index + 1}：原文短语为“${row[0]}”，表格中最接近的同义表达是？`,
      options: [row[1], "give up", "turn down", "put away"],
      answer: 0,
      variant: {
        stem: `同义转换变式${index + 1}：若表格需要保留原文核心意思“${row[0]}”，应优先选择？`,
        options: [row[2], "noise", "shape", "price"],
        answer: 0
      }
    });
  });

  ["science club", "school garden", "library volunteer", "sports meeting", "family trip", "online museum", "English corner", "book fair", "community clean-up", "summer camp"].forEach((scene, index) => {
    englishRows.push({
      stem: `课外阅读词汇${index + 1}：In the ${scene}, students worked together and learned to cooperate. cooperate最接近？`,
      options: ["work with others", "sleep alone", "forget the rule", "break the window"],
      answer: 0,
      variant: {
        stem: `课外词汇变式${index + 1}：The activity encouraged teamwork. teamwork最接近？`,
        options: ["working as a group", "doing nothing", "arriving late", "losing books"],
        answer: 0
      }
    });
  });

  ["protect", "improve", "prepare", "explain", "discover", "collect", "compare", "review", "continue", "realize"].forEach((word, index) => {
    englishRows.push({
      stem: `课外单词积累${index + 1}：Which sentence uses “${word}” correctly?`,
      options: [`We should ${word} the key point before the test.`, `He very ${word} happy.`, `${word} is a red desk.`, `The ${word} quickly apple.`],
      answer: 0,
      variant: {
        stem: `词汇运用变式${index + 1}：遇到陌生动词“${word}”时，最应该结合什么判断意思？`,
        options: ["上下文和句子结构", "单词长度", "字母颜色", "页码大小"],
        answer: 0
      }
    });
  });

  addGeneratedChoice(
    "jintai-english-extra", "英语", "暑假英语短文填空与表格", "EN_SUMMER_WEAKNESS", englishRows,
    "金泰英语主要因课外词汇、陌生句子和表格同义转换扣分。",
    "先看上下文，再判断词性、固定搭配和同义替换；表格题要从原文找核心意思再换表达。"
  );

  const chineseRows = [];
  ["智能书包", "节水装置", "成都公园城市", "太阳能路灯", "校园午餐保温箱", "图书馆自助借还机", "雨水花园", "低碳公交", "防近视台灯", "智能手环"].forEach((scene, index) => {
    chineseRows.push({
      stem: `说明文阅读${index + 1}：文章围绕“${scene}”介绍结构、功能和使用方法，本文的说明对象是？`,
      options: [scene, "作者心情", "人物争吵", "故事结局"],
      answer: 0,
      variant: {
        stem: `说明文变式${index + 1}：若题目问“主要说明了什么”，答题应优先抓住？`,
        options: ["说明对象及其特征", "人物外貌", "故事矛盾", "诗歌押韵"],
        answer: 0
      }
    });
  });

  ["父亲修车", "母亲留灯", "外婆缝衣", "老师递伞", "同学让座", "哥哥陪跑", "邻居送书", "爷爷种树", "护士安慰", "志愿者引路"].forEach((scene, index) => {
    chineseRows.push({
      stem: `现代文问答${index + 1}：片段写“${scene}”这一细节，最可能表现的人物情感是？`,
      options: ["关爱与支持", "厌烦与逃避", "炫耀与虚荣", "冷漠与疏远"],
      answer: 0,
      variant: {
        stem: `现代文变式${index + 1}：回答细节作用题时，除了概括事件，还必须点出什么？`,
        options: ["人物情感或主题作用", "标点数量", "自然段长度", "作者年龄"],
        answer: 0
      }
    });
  });

  ["月夜思乡", "边塞落日", "雨后春山", "孤舟远影", "秋风落叶", "江边暮色", "寒窗读书", "登高望远", "送别长亭", "田园归隐"].forEach((scene, index) => {
    chineseRows.push({
      stem: `课外古诗文${index + 1}：诗歌描写“${scene}”，若关键词有“独”“远”“泪”，最可能表达？`,
      options: ["孤独思念之情", "热闹欢庆之情", "讽刺商人逐利", "说明制作流程"],
      answer: 0,
      variant: {
        stem: `古诗情感变式${index + 1}：读不懂整首诗时，判断情感最可靠的入口是？`,
        options: ["意象、关键词和作者处境", "题目字数", "纸张颜色", "标点多少"],
        answer: 0
      }
    });
  });

  ["节约用水倡议", "文明阅读标语", "运动会加油词", "班级公约", "垃圾分类提示", "交通安全提醒", "保护视力海报", "读书分享邀请", "校园广播开场", "社团招新文案"].forEach((scene, index) => {
    chineseRows.push({
      stem: `语言应用${index + 1}：为“${scene}”拟写一句话，最重要的是？`,
      options: ["符合场景、对象和表达目的", "越生僻越好", "只追求押韵", "完全不用标点"],
      answer: 0,
      variant: {
        stem: `语言应用变式${index + 1}：选择宣传语时，应排除哪一类表达？`,
        options: ["与主题不符或态度消极的表达", "简洁明确的表达", "符合对象的表达", "有行动号召的表达"],
        answer: 0
      }
    });
  });

  addGeneratedChoice(
    "jintai-chinese-extra", "语文", "暑假语文阅读与表达", "CH_SUMMER_WEAKNESS", chineseRows,
    "金泰语文主要在说明文、现代文问答、课外古诗文和语言应用中丢分。",
    "先判断文体和题型，再抓对象、关键词、情感和表达目的；主观题要把“内容+作用/情感”写完整。"
  );

  function addHighVolume(subject, prefix, count, config) {
    const scenes = config.scenes;
    const focuses = config.focuses;
    const contexts = config.contexts;
    const actions = config.actions;
    for (let i = 0; i < count; i += 1) {
      const scene = scenes[i % scenes.length];
      const focus = focuses[Math.floor(i / scenes.length) % focuses.length];
      const context = contexts[Math.floor(i / (scenes.length * focuses.length)) % contexts.length];
      const action = actions[i % actions.length];
      const layer = ["基础识别", "标准应用", "易错辨析", "B卷提升", "限时回收"][i % 5];
      const point = `${focus}·${layer}`;
      addChoice(
        `${prefix}-${String(i + 1).padStart(4, "0")}`,
        subject,
        `${prefix.toUpperCase().replace(/-/g, "_")}_${i % focuses.length}`,
        point,
        i % 5 === 3 ? "提升" : "保分",
        `${subject}暑假刷题${i + 1}：在“${scene}”材料中考查${focus}。若题目场景是${context}，最稳的处理方式是？`,
        [
          action,
          config.wrongA,
          config.wrongB,
          config.wrongC
        ],
        0,
        config.error,
        config.method,
        {
          stem: `${subject}同类变式${i + 1}：把材料换成“${contexts[(i + 7) % contexts.length]}”，继续考查${focus}，第一步应抓什么？`,
          options: [
            config.variantAction,
            config.wrongB,
            config.wrongC,
            config.wrongA
          ],
          answer: 0
        }
      );
    }
  }

  addHighVolume("数学", "jintai-math-volume", 760, {
    scenes: ["旋转坐标图", "平移网格图", "平行线角度图", "正方形判定图", "菱形判定图", "平行四边形证明图", "一次函数图像", "分段函数收费表", "二元不等式组", "几何中线辅助线", "折叠几何图", "B卷综合图", "动点路线图", "面积关系图", "坐标系图形", "证明题草图", "角度追踪图", "函数表格题", "方案选择题", "实际应用题"],
    focuses: ["图形旋转规则", "平行线角度关系", "正方形判定", "菱形判定", "平行四边形性质", "一次函数k与b", "一次函数解析式", "分段函数建模", "二元不等式组", "几何中线三线合一", "复杂图形辅助线", "B卷多条件综合", "动点与函数关系", "图形面积转化", "证明条件选择", "坐标几何读图"],
    contexts: ["先标已知条件", "先找不变量", "先写核心关系式", "先排除无关条件", "先判断图形性质", "先确定变量含义", "先拆成两个小问题", "先画辅助线", "先代入特殊点", "先看题目问法"],
    actions: ["识别题型后写出对应关系式，再按条件逐步代入", "先把图形性质写在图上，再找能连接已知和结论的条件", "先确定变量、范围和目标，再列式判断", "把复杂图拆成基础模型，逐个回收角度或边长"],
    variantAction: "抓题型关键词和已知条件，不急着算答案",
    wrongA: "只看最后一个数字直接猜选项",
    wrongB: "把所有条件混在一起不分类",
    wrongC: "跳过关系式直接心算"
  });

  addHighVolume("物理", "jintai-physics-volume", 540, {
    scenes: ["摩擦力方向图", "匀速拉动物体", "多液位压强图", "液体深度比较", "滑轮组做功", "机械效率实验", "杠杆平衡图", "密度计漂浮", "物体沉浮条件", "浮力压强函数", "容器对桌面压力", "加水过程传感器", "B卷图像题", "数据表格题", "分段变化模型", "压强计实验", "浮标模型", "潜水艇模型"],
    focuses: ["摩擦力方向", "摩擦力大小平衡", "液体压强比", "多位置数值之比", "滑轮组有用功", "机械效率计算", "功率关系式", "杠杆平衡条件", "密度计密度关系", "沉浮条件判断", "浮力与压强函数", "容器压力函数", "加水过程分段", "图像斜率判断", "受力分析"],
    contexts: ["先画受力图", "先判断运动状态", "先找深度和密度", "先区分有用功和总功", "先确定力臂", "先比较浮力和重力", "先确定排开液体体积", "先找分段点", "先判断图像增减", "先列物理公式"],
    actions: ["画受力图或过程图，找到不变量和变化量后再列式", "先判断平衡状态，再比较对应的力和方向", "把过程分段，分别判断浮力、压强或压力的变化", "先写公式，再把题干数据放进同一单位"],
    variantAction: "抓住受力状态、公式和分段变化点",
    wrongA: "只凭图像形状猜结论",
    wrongB: "把浮力、压力、压强混为一谈",
    wrongC: "不画过程图直接套错公式"
  });

  addHighVolume("英语", "jintai-english-volume", 560, {
    scenes: ["短文填空", "完成表格", "课外词汇", "同义短语", "阅读细节", "句子改写", "词性判断", "上下文推断", "校园生活短文", "科普短文", "旅行短文", "志愿活动短文", "人物故事", "学习方法短文"],
    focuses: ["上下文线索", "词性变化", "同义转换", "短语替换", "表格信息提取", "课外词汇猜义", "动词时态", "形容词副词", "连接词逻辑", "阅读细节定位", "主旨概括", "句型改写"],
    contexts: ["先读空格前后句", "先判断空格词性", "先找原文同义表达", "先划关键词", "先看表格栏目", "先确定句子逻辑", "先排除语法不通的选项", "先回到原文定位", "先区分事实和推断"],
    actions: ["结合上下文、词性和固定搭配判断，不只看中文意思", "回到原文找关键词，再用同义词或短语改写", "先判断句子逻辑关系，再选择连接词或词形", "把答案放回原句检查语法和意思"],
    variantAction: "抓上下文关键词、词性和同义替换",
    wrongA: "只凭中文大意选看起来熟的词",
    wrongB: "不看词性直接填原形",
    wrongC: "表格题不回到原文定位"
  });

  addHighVolume("语文", "jintai-chinese-volume", 560, {
    scenes: ["说明文阅读", "散文阅读", "记叙文问答", "课外古诗文", "语言应用", "作文素材", "细节作用题", "标题作用题", "句子赏析", "人物形象", "情感主旨", "材料概括", "宣传语拟写", "情境表达"],
    focuses: ["说明对象", "说明方法", "现代文细节作用", "人物情感", "标题含义", "句子赏析", "古诗情感", "文言实词", "语言应用场景", "材料概括", "作文叙事素材", "抒情表达"],
    contexts: ["先判断文体", "先抓关键词", "先概括内容", "先写人物情感", "先看题干问法", "先找说明对象", "先看意象和处境", "先明确表达对象", "先组织答题模板"],
    actions: ["按题型写出内容、作用和情感，答案不要只复述原文", "先判断文体和设问，再抓对象、特征、情感或表达目的", "用关键词定位原文，再整理成完整答题句", "主观题按模板补全，不漏人物、事件、情感"],
    variantAction: "抓文体、题型关键词和答题结构",
    wrongA: "只抄原文一句话不作分析",
    wrongB: "答题没有人物和情感",
    wrongC: "不看场景随便写宣传语"
  });

  addHighVolume("化学", "jintai-chemistry-volume", 450, {
    scenes: ["元素符号", "化学式", "氧气性质", "水的组成", "实验操作", "质量守恒", "化学方程式", "物质分类", "微观粒子", "气体检验", "仪器使用", "实验现象"],
    focuses: ["元素符号识记", "常见化学式", "实验安全", "氧气制取", "气体检验", "质量守恒", "方程式配平", "物质变化判断", "分子原子概念", "实验现象描述"],
    contexts: ["先看反应物生成物", "先判断是否配平", "先确认实验目的", "先看仪器和操作", "先区分现象和结论", "先数原子个数", "先判断物理变化或化学变化"],
    actions: ["先识别教材核心概念，再检查符号、下标、配平和实验安全", "把现象、结论和操作分开判断", "用质量守恒和原子个数守恒检查选项", "先回到常见物质和基础实验"],
    variantAction: "抓化学式、实验目的和守恒关系",
    wrongA: "把元素符号和化学式混用",
    wrongB: "只记现象不看实验条件",
    wrongC: "方程式不检查配平"
  });

  addHighVolume("地理", "jintai-geography-volume", 300, {
    scenes: ["经纬网", "等高线", "中国区域图", "气候资料图", "河流流向", "地形剖面", "交通线路", "农业分布", "人口分布", "四川区域", "世界气候", "地图比例尺"],
    focuses: ["经纬度判断", "半球位置", "等高线地形", "方向判断", "比例尺计算", "气候类型", "区域特征", "河流与地形", "农业条件", "读图提取信息"],
    contexts: ["先看图例", "先找方向标", "先读坐标", "先看等高线疏密", "先看气温降水", "先定位区域", "先找材料关键词"],
    actions: ["先读图例、方向和坐标，再结合材料判断区域特征", "从图中提取信息，不凭印象猜地名", "先定位，再分析自然条件和人文条件", "把气温、降水、地形分别判断"],
    variantAction: "抓图例、位置、方向和材料关键词",
    wrongA: "不看图例直接猜",
    wrongB: "把经度纬度看反",
    wrongC: "只凭生活经验作答"
  });

  addHighVolume("生物", "jintai-biology-volume", 300, {
    scenes: ["人体消化", "呼吸系统", "血液循环", "植物光合作用", "蒸腾作用", "遗传变异", "实验探究", "显微镜使用", "生态系统", "生殖发育", "免疫健康", "生物分类"],
    focuses: ["人体结构功能", "营养物质吸收", "呼吸与循环", "光合作用条件", "蒸腾作用", "遗传与变异", "单一变量实验", "对照实验", "生态关系", "显微镜操作"],
    contexts: ["先找实验变量", "先区分实验组和对照组", "先看结构对应功能", "先判断生命活动", "先抓关键词", "先排除无关条件", "先看图示箭头"],
    actions: ["先找变量、对照和结论，再判断实验是否严谨", "结构功能对应起来记，不孤立背概念", "读图时先看箭头、标签和条件", "用单一变量原则排除干扰项"],
    variantAction: "抓变量、对照、结构功能和图示信息",
    wrongA: "实验中同时改变多个条件",
    wrongB: "只背名词不看图",
    wrongC: "把结构和功能对应错"
  });

  window.KUNTAI_PRIORITY_BANK.jintai = bank;
})();
