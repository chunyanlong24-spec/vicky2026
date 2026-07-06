(function () {
  "use strict";

  window.KUNTAI_PRIORITY_BANK = window.KUNTAI_PRIORITY_BANK || {};
  const bank = [];
  const letters = ["A", "B", "C", "D"];

  function explanation(point, reason, answerText) {
    return {
      exam: `坤泰重点补弱：${point}`,
      error: "易因课内词句不熟、忽略上下文或语法形式而失分。",
      steps: [
        `先判断题目属于“${point}”，明确需要听、写或结合语境作答。`,
        reason,
        `最后把答案“${answerText}”放回原句核对意义和语法。`
      ],
      similar: "同类题先抓关键词和句子结构，再检查词义、词形、时态及拼写。"
    };
  }

  function choice(id, code, point, difficulty, audioText, stem, options, answer, reason, variant) {
    bank.push({
      id,
      subject: "英语",
      point,
      type: code === "EN_A_LISTENING" ? "A卷听力理解" : "结合上下文填空",
      difficulty,
      priorityProfile: "kuntai-2026-07",
      weaknessCode: code,
      answerMode: "choice",
      audioText,
      stem,
      translation: "",
      options: options.map((text, index) => `${letters[index]}. ${text}`),
      answer,
      explanation: explanation(point, reason, options[answer]),
      revealAfterSubmit: audioText ? `听力原文：${audioText}` : `完整句子答案：${options[answer]}`,
      variant: {
        stem: variant.stem,
        audioText: variant.audioText || "",
        options: variant.options.map((text, index) => `${letters[index]}. ${text}`),
        answer: variant.answer,
        answerMode: "choice",
        revealAfterSubmit: variant.audioText ? `听力原文：${variant.audioText}` : ""
      }
    });
  }

  function textQuestion(id, code, point, difficulty, mode, stem, audioText, answers, reason, reveal, variant) {
    bank.push({
      id,
      subject: "英语",
      point,
      type: code === "EN_WRITING_GRAMMAR" ? "作文语法纠错" :
        code === "EN_B_READING_RESPONSE" ? "B卷阅读表达" : "课内词句听写",
      difficulty,
      priorityProfile: "kuntai-2026-07",
      weaknessCode: code,
      answerMode: mode,
      audioText: audioText || "",
      stem,
      translation: "",
      acceptedAnswers: answers,
      requiredKeywords: [],
      explanation: explanation(point, reason, answers[0]),
      revealAfterSubmit: reveal,
      variant: {
        stem: variant.stem,
        audioText: variant.audioText || "",
        acceptedAnswers: variant.answers,
        requiredKeywords: variant.requiredKeywords || [],
        answerMode: variant.mode || mode,
        revealAfterSubmit: variant.reveal || ""
      }
    });
  }

  const listening = [
    ["Please turn off the lights before you leave.", "离开前请关灯。", "Please close the window before class.", "上课前请关窗。"],
    ["The school library opens at half past eight.", "学校图书馆八点半开放。", "The reading room closes at five twenty.", "阅览室五点二十分关闭。"],
    ["Tom has a fever and needs to see a doctor.", "汤姆发烧了，需要看医生。", "Lucy has a toothache and should visit a dentist.", "露西牙疼，应该看牙医。"],
    ["We will meet at the bus stop after lunch.", "午饭后我们在公交站见。", "They will wait at the school gate before dinner.", "晚饭前他们会在校门口等。"],
    ["The blue sweater is cheaper than the black one.", "蓝色毛衣比黑色便宜。", "The red bag is heavier than the yellow one.", "红色包比黄色包重。"],
    ["Could you help me carry these books upstairs?", "你能帮我把这些书搬上楼吗？", "Would you show me how to use this machine?", "你能教我怎样使用这台机器吗？"],
    ["The train was late because of the heavy rain.", "火车因大雨晚点。", "The match was cancelled because of the strong wind.", "比赛因大风取消。"],
    ["You must wear a helmet when riding a bicycle.", "骑自行车时必须戴头盔。", "Students must wear glasses during the experiment.", "实验时学生必须戴护目镜。"],
    ["My brother has collected stamps for five years.", "我哥哥收集邮票五年了。", "Her cousin has learned the piano for three years.", "她表妹学钢琴三年了。"],
    ["If it is sunny tomorrow, we will climb the hill.", "如果明天晴天，我们就去爬山。", "If the rain stops, they will play football outside.", "如果雨停，他们会去外面踢足球。"],
    ["The girl speaking to our teacher is my cousin.", "正在和老师说话的女孩是我表妹。", "The man waiting beside the car is our new coach.", "在车旁等候的男子是我们的新教练。"],
    ["There used to be a small bridge over the river.", "过去河上有一座小桥。", "There used to be several trees behind the house.", "过去房后有几棵树。"],
    ["Neither Jack nor his sister likes noisy music.", "杰克和他妹妹都不喜欢吵闹的音乐。", "Neither the teacher nor the students were late.", "老师和学生都没有迟到。"],
    ["The museum is across from the post office.", "博物馆在邮局对面。", "The bank is between the hotel and the supermarket.", "银行在宾馆和超市之间。"],
    ["I prefer reading at home to watching television.", "比起看电视，我更喜欢在家阅读。", "She prefers walking to school to taking a taxi.", "比起坐出租车，她更喜欢步行上学。"],
    ["The meeting has been put off until next Monday.", "会议推迟到下周一。", "The sports day has been moved to Friday afternoon.", "运动会改到周五下午。"],
    ["Please speak slowly so that everyone can follow you.", "请说慢一点，以便大家都能听懂。", "Write clearly so that the reader can understand your idea.", "请写清楚，以便读者理解你的观点。"],
    ["The boy was too nervous to answer the question.", "男孩太紧张，没能回答问题。", "The box was too heavy for the child to move.", "箱子太重，孩子搬不动。"],
    ["By the time we arrived, the film had already begun.", "我们到达时，电影已经开始。", "By the time she called, her father had left home.", "她打电话时，父亲已经离家。"],
    ["Students are encouraged to reuse paper and bottles.", "学校鼓励学生重复利用纸张和瓶子。", "Visitors are asked to keep food outside the room.", "参观者被要求把食物留在室外。"],
    ["Although the task was difficult, the team did not give up.", "虽然任务困难，团队没有放弃。", "Although he felt tired, he finished the report on time.", "虽然疲惫，他仍按时完成报告。"]
  ];

  listening.forEach((row, index) => {
    const translations = listening.map(item => item[1]);
    const vTranslations = listening.map(item => item[3]);
    const answer = index % 4;
    const vAnswer = (index + 2) % 4;
    const options = [translations[(index + 4) % 21], translations[(index + 9) % 21], translations[(index + 14) % 21]];
    options.splice(answer, 0, row[1]);
    const vOptions = [vTranslations[(index + 5) % 21], vTranslations[(index + 10) % 21], vTranslations[(index + 15) % 21]];
    vOptions.splice(vAnswer, 0, row[3]);
    choice(
      `kuntai-en-listen-${String(index + 1).padStart(3, "0")}`,
      "EN_A_LISTENING", "A卷听力·课内句子", "保分", row[0],
      "听录音，选择最符合录音内容的中文意思。", options, answer,
      "听清人物、时间、地点、比较或因果等关键词，再判断整句含义。",
      { stem: "听另一段录音，选择最符合内容的中文意思。", audioText: row[2], options: vOptions, answer: vAnswer }
    );
  });

  const dictation = [
    ["patient", "有耐心的", "careful", "仔细的"], ["available", "可获得的；有空的", "valuable", "有价值的"],
    ["environment", "环境", "government", "政府"], ["responsible", "负责任的", "possible", "可能的"],
    ["successful", "成功的", "traditional", "传统的"], ["encourage", "鼓励", "improve", "改善"],
    ["experience", "经历；经验", "experiment", "实验"], ["difference", "差异", "importance", "重要性"],
    ["communication", "交流", "information", "信息"], ["development", "发展", "achievement", "成就"],
    ["protect", "保护", "prevent", "阻止"], ["suggest", "建议", "explain", "解释"],
    ["prepare", "准备", "compare", "比较"], ["continue", "继续", "consider", "考虑"],
    ["instead", "代替；反而", "especially", "尤其"], ["unless", "除非", "although", "虽然"],
    ["depend on", "依靠；取决于", "take part in", "参加"], ["be proud of", "为……自豪", "look forward to", "期待"],
    ["make a decision", "作决定", "pay attention to", "注意"], ["in order to", "为了", "as a result", "因此"],
    ["How long have you lived here?", "你在这里住多久了？", "What were you doing at eight?", "八点时你在做什么？"]
  ];

  dictation.forEach((row, index) => {
    textQuestion(
      `kuntai-en-dictation-${String(index + 1).padStart(3, "0")}`,
      "EN_TEXTBOOK_DICTATION", "初一初二课内词句背写听", "保分", "listening-text",
      `听音频，键盘写出对应英文。中文提示：${row[1]}`, row[0], [row[0]],
      "根据中文提示确定词义，再听清音节、重音和词尾，完整拼写。",
      `${row[0]}：${row[1]}`,
      {
        stem: `听另一条音频，写出对应英文。中文提示：${row[3]}`,
        audioText: row[2], answers: [row[2]], reveal: `${row[2]}：${row[3]}`
      }
    );
  });

  const cloze = [
    ["Ms. Li is very ____ with young children and never gets angry.", ["patient", "empty", "rapid", "blind"], 0, "never gets angry提示有耐心", "The nurse listened ____ while the old man described his pain.", ["carefully", "cheaply", "widely", "suddenly"], 0],
    ["The hall is not ____ this afternoon because another class is using it.", ["valuable", "available", "natural", "central"], 1, "because后的占用说明不能使用", "Is Mr. Chen ____ tomorrow morning? I need his advice.", ["available", "silent", "ancient", "narrow"], 0],
    ["Planting grass can ____ the soil from being washed away.", ["borrow", "protect", "divide", "invite"], 1, "protect...from...固定搭配", "Wear gloves to ____ your hands during the experiment.", ["compare", "protect", "repeat", "introduce"], 1],
    ["We missed the last bus, so we walked home ____.", ["instead", "already", "nearly", "abroad"], 0, "原计划改变后用instead", "The lift was broken, so they used the stairs ____.", ["instead", "again", "hardly", "once"], 0],
    ["You will miss the beginning ____ you leave now.", ["if", "unless", "because", "although"], 1, "unless表示除非", "The plant will die ____ we give it enough water.", ["unless", "after", "until", "though"], 0],
    ["The team worked hard and finally ____ its goal.", ["achieved", "avoided", "borrowed", "refused"], 0, "goal与achieve搭配", "After months of practice, she ____ her dream of joining the team.", ["achieved", "hid", "dropped", "mixed"], 0],
    ["It is our ____ to keep the classroom clean.", ["responsibility", "direction", "temperature", "competition"], 0, "our后需名词且语义为责任", "Every student should be ____ for the books borrowed.", ["responsible", "comfortable", "possible", "available"], 0],
    ["The teacher ____ that we should check the data again.", ["suggested", "prevented", "invited", "created"], 0, "suggest that提出建议", "My doctor ____ taking a short walk after dinner.", ["suggested", "finished", "missed", "escaped"], 0],
    ["This old photo is ____ because it records our family history.", ["valuable", "common", "empty", "noisy"], 0, "记录家史说明有价值", "The advice was especially ____ to new students.", ["valuable", "careless", "private", "similar"], 0],
    ["The number of visitors has ____ since the new road opened.", ["increased", "hidden", "divided", "refused"], 0, "since引导现在完成时语境", "Online orders ____ by thirty percent last month.", ["increased", "borrowed", "protected", "explained"], 0],
    ["We held a meeting for the ____ of solving the traffic problem.", ["purpose", "surface", "silence", "shape"], 0, "for the purpose of固定结构", "The main ____ of the survey is to learn students' needs.", ["purpose", "colour", "weight", "height"], 0],
    ["The family could not ____ a new computer, so they repaired the old one.", ["afford", "collect", "require", "recognize"], 0, "could not afford表示买不起", "Many students cannot ____ to waste time before the exam.", ["afford", "invite", "increase", "divide"], 0],
    ["The job ____ patience and careful planning.", ["requires", "prevents", "borrows", "recognizes"], 0, "工作需要某品质", "Good communication ____ both listening and speaking.", ["requires", "hides", "refuses", "breaks"], 0],
    ["Please ____ the two plans before making a decision.", ["compare", "protect", "repeat", "achieve"], 0, "two plans提示比较", "We ____ the results with last year's data.", ["compared", "suggested", "invited", "prepared"], 0],
    ["The new rule may ____ accidents near the school gate.", ["prevent", "encourage", "increase", "collect"], 0, "prevent accidents阻止事故", "Regular exercise can help ____ some health problems.", ["prevent", "borrow", "recognize", "divide"], 0],
    ["I did not ____ him at first because he had changed a lot.", ["recognize", "require", "afford", "improve"], 0, "外貌变化导致没认出", "Can you ____ the person in this old picture?", ["recognize", "prevent", "achieve", "compare"], 0],
    ["Could you ____ why the machine stopped?", ["explain", "protect", "collect", "refuse"], 0, "why后的原因需要解释", "The guide ____ the safety rules clearly.", ["explained", "increased", "borrowed", "avoided"], 0],
    ["Weather can greatly ____ our travel plans.", ["influence", "repeat", "divide", "invite"], 0, "天气影响计划", "Parents' habits often ____ their children.", ["influence", "afford", "recognize", "require"], 0],
    ["Everyone should help protect the ____.", ["environment", "achievement", "purpose", "experience"], 0, "protect the environment固定表达", "The project studies how noise affects the local ____.", ["environment", "competition", "temperature", "direction"], 0],
    ["The biggest ____ was finding enough clean water.", ["challenge", "purpose", "surface", "silence"], 0, "biggest challenge表示最大挑战", "Learning to speak in public was a real ____ for him.", ["challenge", "shape", "height", "tradition"], 0],
    ["Whether we go hiking will ____ the weather.", ["depend on", "look after", "take away", "turn off"], 0, "depend on取决于", "Success often ____ careful preparation.", ["depends on", "looks for", "turns into", "takes away"], 0]
  ];

  cloze.forEach((row, index) => {
    choice(
      `kuntai-en-cloze-${String(index + 1).padStart(3, "0")}`,
      "EN_CONTEXT_CLOZE", "结合上下文填空·词汇语法", "保分", "",
      row[0], row[1], row[2], row[3],
      { stem: row[4], options: row[5], answer: row[6] }
    );
  });

  const reading = [
    ["Mia noticed that the classroom plants dried quickly near the heater. She moved them to a bright window away from the heat and recorded the soil each day. A week later, the leaves looked healthier.", "Why did Mia move the plants?", ["because they dried quickly near the heater"], ["dried", "heater"], "Leo found the fish tank water warming in direct sunlight, so he moved it to a bright place without strong sun.", "Why did Leo move the fish tank?", ["because the water was warming in direct sunlight"]],
    ["The school opened a quiet room during lunch. Students could read, draw or simply sit there. A survey showed that many students returned to afternoon lessons feeling calmer.", "What effect did the quiet room have?", ["it helped students feel calmer"], ["calmer"], "A short walking path opened behind the library. Students using it said they returned to class with better focus.", "What benefit did students report?", ["they returned with better focus"]],
    ["Kai tested two paper bridges. Bridge A held six books and Bridge B held nine. Both used the same amount of paper, but Bridge B had folded sides.", "Which bridge was stronger?", ["bridge b"], ["bridge", "b"], "Nina made two towers with equal cards. The tower with triangular supports stood longer.", "Which design was more stable?", ["the tower with triangular supports"]],
    ["The community placed picture labels on recycling bins. Sorting mistakes fell, although the number and location of bins stayed unchanged.", "What probably reduced the mistakes?", ["the picture labels", "clearer labels"], ["labels"], "Arrows were painted on the school floor, and fewer visitors entered the wrong rooms.", "What probably helped visitors?", ["the floor arrows", "the arrows"]],
    ["A river survey found clear water upstream from a factory outlet but cloudy water downstream after production began. Students decided to collect more samples on different days.", "Why did students need more samples?", ["to check whether the pattern was consistent"], ["check", "pattern"], "Noise readings were higher near a road on one afternoon, so the group measured again at different times.", "Why did the group measure again?", ["to check the result at different times"]],
    ["Lena wanted to join the basketball team but missed the first trial. She asked the coach for another chance, trained for two weeks and recorded her progress.", "What did Lena do after missing the trial?", ["she asked for another chance and trained"], ["asked", "trained"], "Ben failed the first robot test, then listed the faults and rebuilt the wheels.", "How did Ben respond to failure?", ["he listed the faults and rebuilt the wheels"]],
    ["The museum guide did not give visitors every answer. Instead, she asked them to compare two tools and explain what each might have been used for.", "How did the guide encourage thinking?", ["by asking visitors to compare and explain"], ["compare", "explain"], "The science teacher showed two leaves and asked students to find evidence before naming the healthier one.", "What did the teacher ask students to use?", ["evidence"]],
    ["A class planned a charity sale. They first chose expensive products, but a survey showed most students wanted useful low-cost items. The class changed its plan.", "Why did the class change its plan?", ["because students wanted useful low-cost items"], ["useful", "low-cost"], "The library planned a music corner, but readers requested more study seats, so the budget was changed.", "Why was the budget changed?", ["because readers requested more study seats"]],
    ["During a hike, Chen saw dark clouds and heard thunder. Although the group was close to the top, he suggested returning to the shelter immediately.", "What quality did Chen show?", ["he was safety-conscious", "he cared about safety"], ["safety"], "A lab leader stopped an experiment when she smelled an unknown gas and informed the teacher.", "What quality did the leader show?", ["she cared about safety", "she was safety-conscious"]],
    ["A student copied a fact from a website but could not find its author or date. She searched for the same information on a government site before using it.", "Why did she check another site?", ["to verify the information"], ["verify", "information"], "Owen saw a surprising health claim online and checked a hospital website before sharing it.", "Why did Owen check the hospital website?", ["to verify the claim"]],
    ["The neighbourhood book box was often messy. Rui added simple category labels and invited users to return books to the matching shelf. Finding books became easier.", "How did Rui improve the book box?", ["she added category labels"], ["labels"], "A sports cupboard was disorganized, so Ali labelled separate shelves for balls, ropes and cones.", "What change did Ali make?", ["he labelled separate shelves"]],
    ["A café offered a discount to customers carrying reusable cups. In one month, the number of disposable cups used fell by a third.", "What was the result of the discount?", ["fewer disposable cups were used"], ["fewer", "cups"], "A shop charged for plastic bags, and more customers brought cloth bags.", "What change happened?", ["more customers brought cloth bags"]],
    ["The first rehearsal lasted too long because scene changes were slow. The team marked each prop's place and assigned two students to move them. The next rehearsal finished on time.", "Why did the next rehearsal finish on time?", ["because the team organized the props and roles"], ["props", "roles"], "A class presentation ran late, so speakers shortened repeated points and assigned a timekeeper.", "How did the group control the time?", ["they shortened repeated points and used a timekeeper"]],
    ["The village bus route had few passengers at noon but many before school and after work. The company changed the timetable instead of cancelling the route.", "What information influenced the timetable?", ["passenger numbers at different times"], ["passenger", "times"], "A library had most visitors after school, so it extended evening hours.", "What data influenced the decision?", ["visitor numbers at different times"]],
    ["Jia's grandmother taught her to repair a cloth bag instead of throwing it away. Jia later showed the method at school and explained that repair saves materials.", "What lesson did Jia learn?", ["repairing items can save materials"], ["repair", "materials"], "Mo learned to replace a loose button and then taught classmates to mend uniforms.", "What idea did Mo share?", ["mending clothes can extend their use"]],
    ["A team interviewed residents about a noisy street. Older residents mentioned sleep, shop owners mentioned deliveries, and students mentioned road safety.", "Why should the team include different residents?", ["to understand different needs"], ["different", "needs"], "A park survey included children, runners and nearby families.", "Why were different users included?", ["to understand different needs"]],
    ["The weather app predicted light rain, but the mountain notice warned of rapidly changing conditions. The group packed raincoats and chose a shorter route.", "Why did the group choose a shorter route?", ["because mountain conditions could change quickly"], ["conditions", "change"], "A river path looked dry, but a flood warning was active, so walkers used a higher route.", "Why did they avoid the river path?", ["because there was a flood warning"]],
    ["When the internet failed, the group could not open its shared notes. One member had printed the key data, so the presentation continued.", "What helped the presentation continue?", ["the printed key data"], ["printed", "data"], "A power cut stopped the screen, but the speaker used a paper chart.", "What allowed the talk to continue?", ["the paper chart"]],
    ["The school garden produced more vegetables than expected. Instead of letting them spoil, students weighed them, kept records and sent the extra food to a community kitchen.", "What did students do with the extra vegetables?", ["they sent them to a community kitchen"], ["community", "kitchen"], "A bakery had unsold bread and delivered it to a food bank before closing.", "What happened to the unsold bread?", ["it was delivered to a food bank"]],
    ["Yun thought a classmate ignored her message. The next day she learned his phone had broken. She apologized for judging too quickly.", "What did Yun learn?", ["not to judge before knowing the facts"], ["judge", "facts"], "Tao assumed his teammate was lazy, then learned she was caring for her brother.", "What lesson did Tao learn?", ["not to judge from incomplete information"]],
    ["A reading club once counted only the number of books finished. It later asked members to share one idea they had questioned or applied.", "How did the club's goal change?", ["from counting books to thinking about ideas"], ["counting", "ideas"], "A science club stopped rewarding only correct results and began valuing careful records of failed tests.", "What did the club begin to value?", ["careful records of failed tests"]]
  ];

  reading.forEach((row, index) => {
    const stem = `${row[0]}\n\n${row[1]}`;
    const vStem = `${row[4]}\n\n${row[5]}`;
    textQuestion(
      `kuntai-en-reading-${String(index + 1).padStart(3, "0")}`,
      "EN_B_READING_RESPONSE", "B卷阅读表达·短答", "提升", "text",
      stem, "", row[2], "先定位题目关键词，再用原文信息组成简洁完整的英文答案。",
      `参考答案：${row[2][0]}`,
      { stem: vStem, answers: row[6], requiredKeywords: [], reveal: `参考答案：${row[6][0]}` }
    );
    bank[bank.length - 1].requiredKeywords = row[3];
  });

  const grammar = [
    ["He go to school by bus every day.", "he goes to school by bus every day", "She walk to the library on Sundays.", "she walks to the library on sundays", "一般现在时第三人称单数加-s"],
    ["They was playing football at eight.", "they were playing football at eight", "We was waiting outside then.", "we were waiting outside then", "复数主语用were"],
    ["I have finished my homework yesterday.", "i finished my homework yesterday", "She has visited the museum last week.", "she visited the museum last week", "明确过去时间用一般过去时"],
    ["If it will rain tomorrow, we will stay home.", "if it rains tomorrow we will stay home", "If he will come, I will tell you.", "if he comes i will tell you", "条件状语从句用一般现在时"],
    ["The book was write by a young scientist.", "the book was written by a young scientist", "The windows were break by the wind.", "the windows were broken by the wind", "被动语态用过去分词"],
    ["She is good in playing the piano.", "she is good at playing the piano", "Tom is interested on history.", "tom is interested in history", "固定介词搭配"],
    ["I look forward to meet you.", "i look forward to meeting you", "He is used to get up early.", "he is used to getting up early", "介词to后用动名词"],
    ["The teacher asked us not make noise.", "the teacher asked us not to make noise", "My mother told me to not stay up.", "my mother told me not to stay up", "ask/tell sb not to do"],
    ["There have a park near my home.", "there is a park near my home", "There has two books on the desk.", "there are two books on the desk", "there be句型不用have"],
    ["This problem is more easier than that one.", "this problem is easier than that one", "The river is more longer than before.", "the river is longer than before", "比较级不能重复使用more"],
    ["He is one of the best student in our class.", "he is one of the best students in our class", "She is one of the tallest girl here.", "she is one of the tallest girls here", "one of后接复数名词"],
    ["Neither Tom nor his friends is late.", "neither tom nor his friends are late", "Neither the students nor their teacher are ready.", "neither the students nor their teacher is ready", "neither...nor遵循就近原则"],
    ["The news make everyone excited.", "the news makes everyone excited", "Mathematics are useful in daily life.", "mathematics is useful in daily life", "形式为复数但意义为单数的主语"],
    ["Although it was raining, but we continued.", "although it was raining we continued", "Because he was ill, so he stayed home.", "because he was ill he stayed home", "although/because不与but/so连用"],
    ["I don't know where is the station.", "i don't know where the station is", "Could you tell me what time does it start?", "could you tell me what time it starts", "宾语从句使用陈述语序"],
    ["The boy which won the race is my cousin.", "the boy who won the race is my cousin", "The woman which teaches us is kind.", "the woman who teaches us is kind", "指人定语从句用who"],
    ["Reading books make me relaxed.", "reading books makes me relaxed", "Swimming every day help him stay fit.", "swimming every day helps him stay fit", "动名词短语作主语视为单数"],
    ["She has bought the bike for two years.", "she has had the bike for two years", "He has left Chengdu for a month.", "he has been away from chengdu for a month", "延续时间需用延续性动词"],
    ["The teacher gave me many useful advices.", "the teacher gave me much useful advice", "We need some new informations.", "we need some new information", "advice/information不可数"],
    ["He did the work careful and quickly.", "he did the work carefully and quickly", "She answered the question correct.", "she answered the question correctly", "修饰动词使用副词"],
    ["In my opinion, exercise not only keeps us healthy and also teaches teamwork.", "in my opinion exercise not only keeps us healthy but also teaches teamwork", "Reading not only gives knowledge and also opens our minds.", "reading not only gives knowledge but also opens our minds", "not only...but also固定结构"]
  ];

  grammar.forEach((row, index) => {
    textQuestion(
      `kuntai-en-grammar-${String(index + 1).padStart(3, "0")}`,
      "EN_WRITING_GRAMMAR", "作文语法·句子纠错", "提升", "text",
      `改正句子中的语法错误：${row[0]}`, "", [row[1]], row[4],
      `正确句子：${row[1]}`,
      { stem: `改正另一句：${row[2]}`, answers: [row[3]], reveal: `正确句子：${row[3]}` }
    );
  });

  window.KUNTAI_PRIORITY_BANK.english = bank;
})();
