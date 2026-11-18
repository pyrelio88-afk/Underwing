"use strict";
const ART={
  bp:"assets/art/cards/bp.webp",
  followup:"assets/art/cards/followup.webp",
  meds:"assets/art/cards/meds.webp",
  symptom:"assets/art/cards/symptom.webp",
  glucose:"assets/art/cards/glucose.webp",
  inhaler:"assets/art/cards/inhaler.webp",
  weight:"assets/art/cards/weight.webp",
  fall:"assets/art/cards/fall.webp",
  wound:"assets/art/cards/wound.webp",
  hypo:"assets/art/cards/hypo.webp",
  breathing:"assets/art/cards/breathing.webp",
  dementia:"assets/art/cards/dementia.webp",
  transfer:"assets/art/cards/transfer.webp",
  eyedrops:"assets/art/cards/eyedrops.webp",
  insulin_pen:"assets/art/cards/insulin_pen.webp",
  mascot:"assets/art/cards/mascot.webp"
};
const DISEASE_ART=slug=>"assets/art/disease/"+slug+".webp";
const I=(id,style="")=>`<svg class="ico" ${style?`style="${style}"`:""} aria-hidden="true"><use href="#i-${id}"/></svg>`;
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const pad=n=>String(n).padStart(2,"0");
const localDate=d=>d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate());
const daysBetween=(a,b)=>Math.round((new Date(b+"T00:00")-new Date(a+"T00:00"))/864e5);
const clone=o=>JSON.parse(JSON.stringify(o));

/* ================= 来源 ================= */
const SOURCES={
  cn2024:{n:1,t:"中国高血压防治指南（2024年修订版）",pub:"中国高血压防治指南修订委员会等，《中华高血压杂志》2024;32(7)",url:"http://www.chl-bha.org.cn/Public/ueditor/php/upload/20240815/17236841017752.pdf",v:"ok",note:"已通读指南「血压测量」「诊断性评估」等章节全文核对"},
  ws872:{n:2,t:"WS/T 872—2025 基层医疗卫生机构高血压防治管理标准",pub:"国家卫生健康委员会，2025",url:"https://www.nhc.gov.cn/fzs/c100048/202509/2f3f7cce449145f8b361e70b3ed4ae9a/files/WS%20T%20872%E2%80%942025-20250930105429913.pdf",v:"ok",note:"已通读卫生行业标准全文及第5章「血压测量」核对"},
  hbpm2019:{n:3,t:"2019 中国家庭血压监测指南",pub:"中国高血压联盟，《中华高血压杂志》2019;27(8)",url:"https://pmc.ncbi.nlm.nih.gov/articles/PMC8029889",v:"ok",note:"已通读指南英文全文（PMC8029889）核对"},
  jcdm:{n:5,t:"国家基层糖尿病防治管理手册（2019）",pub:"中华医学会糖尿病学分会、国家基层糖尿病防治管理办公室",url:"https://down.jctnb.org.cn/uploads/download_content/2020/04/15e8d3c35d095115863142938544.pdf",v:"ok",note:"已通读「血糖监测」「低血糖」「高血糖危象」「双向转诊」章节核对"},
  bjcyl:{n:6,t:"血糖“监测”怎么做？权威指南教你血糖监测方法",pub:"北京市卫生健康委员会网站，北京市垂杨柳医院，2026-08-11",url:"https://wjw.beijing.gov.cn/bmfw_20143/jkzs/jksh/202608/t20260811_4818174.html",v:"ok",note:"已通读原页面核对"},
  cgm2021:{n:7,t:"中国血糖监测临床应用指南（2021年版）",pub:"中华医学会糖尿病学分会，《中华糖尿病杂志》2021;13(10)",url:"https://pmc.ncbi.nlm.nih.gov/articles/PMC9786627/",v:"ok",note:"已通读指南英文全文（PMC9786627）及2024版指南血糖监测章节核对"},
  aha:{n:4,t:"Home Blood Pressure Monitoring",pub:"American Heart Association，最近审阅 2025-08-14",url:"https://www.heart.org/en/health-topics/high-blood-pressure/understanding-blood-pressure-readings/monitoring-your-blood-pressure-at-home",v:"ok",note:"已通读原页面核对"},
  ahaThreat:{n:8,t:"Health Threats from High Blood Pressure",pub:"American Heart Association，最近审阅 2025-08-14",url:"https://www.heart.org/en/health-topics/high-blood-pressure/health-threats-from-high-blood-pressure",v:"ok",note:"已通读原页面核对"},
  fallgl:{n:9,t:"老年人跌倒干预技术指南",pub:"原卫生部疾病预防控制局，2011（好大夫在线转载全文）",url:"https://www.haodf.com/neirong/wenzhang/1238704433.html",v:"ok",note:"已通读原文核对"},
  cdccore:{n:10,t:"预防老年人跌倒健康教育核心信息",pub:"国家卫生健康委疾病预防控制局、中国疾控中心慢病中心，2021（2024 年网页发布）",url:"https://ncncd.chinacdc.cn/xzzq/202409/t20240923_311832.htm",v:"ok",note:"已通读原文核对"},
  bjcdc:{n:11,t:"【北京疾控提醒您】预防老年人跌倒，把好“三道关”",pub:"北京市疾病预防控制中心，2026",url:"https://www.beijing.gov.cn/fuwu/bmfw/sy/jrts/202611/t20261103_4929878.html",v:"ok",note:"已通读原文核对"},
  cmahypo:{n:12,t:"警惕低血糖，哪些措施不可少？",pub:"中华医学会科学普及部，2022",url:"https://www.cma.org.cn/art/2022/6/16/art_4584_45503.html",v:"ok",note:"已通读原文核对"},
  medline:{n:13,t:"Low blood sugar - self-care",pub:"MedlinePlus（美国国家医学图书馆），2026 年审核",url:"https://medlineplus.gov/ency/patientinstructions/000085.htm",v:"ok",note:"已通读原文核对"},
  cctv:{n:14,t:"联合国糖尿病日｜糖友别大意，警惕“隐形杀手”低血糖！",pub:"央视网（撰稿：北京市朝阳区小红门社区卫生服务中心），2026",url:"https://jiankang.cctv.cn/2026/11/13/ARTIOgCx13Bq8qRQCwQf2maO261113.shtml",v:"ok",note:"已通读原文核对"},
  bjwjw:{n:15,t:"每周急救话题：低血糖-被低估的疾病",pub:"北京市卫生健康委员会，2025",url:"https://wjw.beijing.gov.cn/bmfw_20143/jkzs/jzjj/202503/t20250311_4031898.html",v:"ok",note:"已通读原文核对"},
  nhcCopd:{n:16,t:"慢阻肺患者健康教育处方",pub:"国家卫生健康委员会，2019",url:"https://www.nhc.gov.cn/wjw/jkshfs/201903/799bcaed7ad24433a4f0c301c2b5d180/files/1733375501887_61600.pdf",v:"ok",note:"已通读原文核对"},
  cmaCopd2018:{n:17,t:"慢性阻塞性肺疾病基层诊疗指南（实践版·2018）",pub:"中华医学会等，中华全科医师杂志，2018",url:"https://zjjcmspublic.oss-cn-hangzhou-zwynet-d01-a.internet.cloud.zj.gov.cn/jcms_files/jcms1/web3462/site/attach/0/03e2c527a0cd446f845e76dc5d0a3316.pdf",v:"ok",note:"已通读原文核对"},
  puh3:{n:18,t:"缩唇呼吸与腹式呼吸",pub:"北京大学第三医院呼吸与危重症医学科，2021",url:"https://www.puh3.net.cn/hxywzzyxk/info/1402/3472.htm",v:"ok",note:"已通读原文核对"},
  ala:{n:19,t:"Breathing Exercises",pub:"American Lung Association（美国肺脏协会），2026 更新",url:"https://www.lung.org/lung-health-diseases/wellness/breathing-exercises",v:"ok",note:"已通读原文核对"},
  nhcAD:{n:20,t:"国家卫生健康委办公厅关于印发阿尔茨海默病预防与干预核心信息的通知（国卫办老龄函〔2019〕738号）",pub:"国家卫生健康委员会，2019（中国政府网转载）",url:"https://www.gov.cn/zhengce/zhengceku/2019-11/15/content_5452419.htm",v:"ok",note:"已通读原文核对"},
  nhc12356:{n:21,t:"国家卫生健康委关于应用“12356”全国统一心理援助热线电话号码的通知（国卫医政函〔2024〕259号）",pub:"国家卫生健康委员会，2024（中国政府网转载）",url:"https://www.gov.cn/zhengce/zhengceku/202412/content_6994470.htm",v:"ok",note:"已通读原文核对"},
  niaComm:{n:22,t:"Communicating With Someone Who Has Alzheimer’s Disease",pub:"National Institute on Aging（美国国立老龄化研究所），2024 审核",url:"https://www.nia.nih.gov/health/alzheimers-changes-behavior-and-communication/alzheimers-caregiving-changes-communication",v:"ok",note:"已通读原文核对"},
  niaDos:{n:23,t:"Infographic: Do’s and Don’ts: Communicating With a Person Who Has Alzheimer's Disease",pub:"National Institute on Aging，2026 更新",url:"https://www.nia.nih.gov/health/alzheimers-changes-behavior-and-communication/dos-and-donts-communicating-person-who-has",v:"ok",note:"已通读信息图页面全文核对"},
  alzComm:{n:24,t:"Communication and Alzheimer's",pub:"Alzheimer's Association（美国阿尔茨海默病协会）",url:"https://www.alz.org/help-support/caregiving/daily-care/communications",v:"ok",note:"已通读原文核对"},
  niaAgit:{n:25,t:"Coping With Agitation, Aggression, and Sundowning in Alzheimer's Disease",pub:"National Institute on Aging，2024 审核",url:"https://www.nia.nih.gov/health/alzheimers-changes-behavior-and-communication/coping-agitation-aggression-and-sundowning",v:"ok",note:"已通读原文核对"},
  niaBehav:{n:26,t:"Alzheimer’s Caregiving: Managing Personality and Behavior Changes",pub:"National Institute on Aging，2024 审核",url:"https://www.nia.nih.gov/health/alzheimers-changes-behavior-and-communication/alzheimers-caregiving-managing-personality-and",v:"ok",note:"已通读原文核对"},
  niaWander:{n:27,t:"Coping With Alzheimer’s Behaviors: Wandering and Getting Lost",pub:"National Institute on Aging，2024 审核",url:"https://www.nia.nih.gov/health/alzheimers-changes-behavior-and-communication/coping-alzheimers-behaviors-wandering-and",v:"ok",note:"已通读原文核对"},
  alzWander:{n:28,t:"Wandering",pub:"Alzheimer's Association（美国阿尔茨海默病协会）",url:"https://www.alz.org/help-support/caregiving/stages-behaviors/wandering",v:"ok",note:"已通读原文核对"},
  niaSelf:{n:29,t:"Alzheimer's Caregiving: Caring for Yourself",pub:"National Institute on Aging，2024 审核",url:"https://www.nia.nih.gov/health/alzheimers-caregiving-caring-yourself",v:"ok",note:"已通读原文核对"},
  hkLift:{n:30,t:"扶抱及位置转移",pub:"香港特别行政区政府 长者健康及护理资讯网（elderly.gov.hk）",url:"https://www.elderly.gov.hk/sc_chi/carers_corner/caring_skills/liftingandtransfer.html",v:"ok",note:"已通读原文核对"},
  hkSide:{n:31,t:"扶抱及位置轉移技巧－從床到椅：從側身提供協助",pub:"香港特别行政区政府 长者健康及护理资讯网（elderly.gov.hk）",url:"https://www.elderly.gov.hk/tc_chi/education_and_media_resources/files/lifting_and_transfer6.pdf",v:"ok",note:"已通读原文核对"},
  dfyyTransfer:{n:32,t:"【医学小常识】偏瘫患者如何进行床椅间的转移？",pub:"北京中医药大学东方医院康复科，2023",url:"https://dongfangyy.com.cn/Html/News/Articles/9540.html",v:"ok",note:"已通读原文核对"},
  bjYouan:{n:33,t:"稳“赢”不“倒”，佑安提示老年朋友要拒绝“步步惊心”",pub:"首都医科大学附属北京佑安医院，发布于北京市卫生健康委员会网站，2025",url:"https://wjw.beijing.gov.cn/bmfw_20143/jkzs/jksh/202501/t20250115_3989937.html",v:"ok",note:"已通读原文核对"},
  mpWheel:{n:34,t:"Moving a patient from bed to a wheelchair",pub:"MedlinePlus（美国国家医学图书馆），2025 审核",url:"https://medlineplus.gov/ency/patientinstructions/000428.htm",v:"ok",note:"已通读原文核对"},
  albTransfer:{n:35,t:"Transfer: Bed to Wheelchair",pub:"Alberta Health Services（加拿大艾伯塔省卫生服务局），2026",url:"https://myhealth.alberta.ca/Health/aftercareinformation/pages/conditions.aspx?hwid=acv3106",v:"ok",note:"已通读原文核对"},
  nhsFalls:{n:36,t:"Falls",pub:"NHS（英国国家医疗服务体系），2025 审核",url:"https://www.nhs.uk/conditions/falls/",v:"ok",note:"已通读原文核对"},
  nhlbiMdi:{n:37,t:"How to Use a Metered-Dose Inhaler (Fact Sheet)",pub:"National Heart, Lung, and Blood Institute（美国国立心肺血液研究所，NIH）",url:"https://www.nhlbi.nih.gov/resources/how-use-metered-dose-inhaler-fact-sheet",v:"ok",note:"已通读原文核对"},
  nhlbiDpi:{n:38,t:"How to Use a Dry Powder Inhaler (Fact Sheet)",pub:"National Heart, Lung, and Blood Institute（美国国立心肺血液研究所，NIH）",url:"https://www.nhlbi.nih.gov/resources/how-use-dry-powder-inhaler-fact-sheet",v:"ok",note:"已通读原文核对"},
  mpInhaler:{n:39,t:"How to use an inhaler - no spacer",pub:"MedlinePlus（美国国家医学图书馆）",url:"https://medlineplus.gov/ency/patientinstructions/000041.htm",v:"ok",note:"已通读原文核对"},
  mpSpacer:{n:40,t:"How to use an inhaler - with spacer",pub:"MedlinePlus（美国国家医学图书馆）",url:"https://medlineplus.gov/ency/patientinstructions/000042.htm",v:"ok",note:"已通读原文核对"},
  ahaHf:{n:41,t:"Heart Failure Signs and Symptoms & Self-Check Plan for HF Management",pub:"American Heart Association（美国心脏协会）",url:"https://www.heart.org/en/health-topics/heart-failure/warning-signs-of-heart-failure",v:"ok",note:"已通读原文核对"},
  mpHf:{n:42,t:"Heart failure - discharge",pub:"MedlinePlus（美国国家医学图书馆）",url:"https://medlineplus.gov/ency/patientinstructions/000114.htm",v:"ok",note:"已通读原文核对"},
  nhsHf:{n:43,t:"Heart failure",pub:"NHS（英国国家医疗服务体系）",url:"https://www.nhs.uk/conditions/heart-failure/",v:"ok",note:"已通读原文核对"},
  mpWound:{n:44,t:"Surgical wound care - closed",pub:"MedlinePlus（美国国家医学图书馆）",url:"https://medlineplus.gov/ency/patientinstructions/000738.htm",v:"ok",note:"已通读原文核对"},
  hkWound:{n:45,t:"伤口的护理",pub:"香港特别行政区政府 卫生署长者健康服务网站（elderly.gov.hk）",url:"https://www.elderly.gov.hk/sc_chi/healthy_ageing/healthy_living/wound_care.html",v:"ok",note:"已通读原文核对"},
  nhsCuts:{n:46,t:"Cuts and grazes",pub:"NHS（英国国家医疗服务体系）",url:"https://www.nhs.uk/conditions/cuts-and-grazes/",v:"ok",note:"已通读原文核对"},
  cmaIns2016:{n:47,t:"中国糖尿病药物注射技术指南（2016年版）",pub:"中华医学会糖尿病学分会，《中华糖尿病杂志》2017;9(2):79-105",url:"https://file.medtrib.cn/pdf/f9e28c1f-3a53-4cb8-a738-cb2cd4240cfa/%E4%B8%AD%E5%9B%BD%E7%B3%96%E5%B0%BF%E7%97%85%E8%8D%AF%E7%89%A9%E6%B3%A8%E5%B0%84%E6%8A%80%E6%9C%AF%E6%8C%87%E5%8D%97%282016%E5%B9%B4%E7%89%88%29.pdf",v:"ok",note:"已通读指南全文及附录核对"},
  neiDrops:{n:48,t:"How to Put in Eye Drops",pub:"National Eye Institute（美国国家眼科研究所，NIH）",url:"https://www.nei.nih.gov/health-information/eye-health-information/how-put-eye-drops",v:"ok",note:"已通读原文核对"},
  aaoDrops:{n:49,t:"How to Put in Eye Drops",pub:"American Academy of Ophthalmology（美国眼科学会），2023",url:"https://www.aao.org/eye-health/treatments/how-to-put-in-eye-drops",v:"ok",note:"已通读原文核对"},
  mpDrops:{n:50,t:"How to Use Eyedrops",pub:"MedlinePlus（美国国家医学图书馆）",url:"https://medlineplus.gov/druginfo/meds/a601171.html",v:"ok",note:"已通读原文核对"},
  nhsEyePain:{n:51,t:"Eye pain",pub:"NHS（英国国家医疗服务体系）",url:"https://www.nhs.uk/conditions/eye-pain/",v:"ok",note:"已通读原文核对"}
};
const ref=(...k)=>`<sup class="ref">${k.map(x=>`<a href="#src-${x}" aria-label="来源 ${SOURCES[x].n}">[${SOURCES[x].n}]</a>`).join("")}</sup>`;


/* ================= 卡牌数据 =================
   借鉴集换式卡牌（宝可梦/万智牌/炉石）的版式：
   类型条（同一类型同一颜色、同一图标，反复出现，降低学习成本）→ 名字（最大、最上，扇形拿牌时也能看到）
   → 插画窗 → 三个「属性」（用时/准备/适合）→ 关键一招（规则框）→ 停止条（只有它用红色）→ 底栏（编号 + 稀有度）。
   稀有度 = 来源核对程度：◆◆◆ 所有来源已通读核对 / ◆◆ 部分来源已核对 / ◆ 整理工具（不含临床建议） / ◇ 编写中。
   kind: clinical = 含临床内容，每条必须有来源；organize = 整理/记录工具，不含临床建议。 */
const TYPES={
  measure:{name:"测量",icon:"heart",c:"blue"},
  meds:   {name:"给药",icon:"pill",c:"violet"},
  record: {name:"记录",icon:"note",c:"teal"},
  safety: {name:"安全",icon:"shield",c:"amber"},
  care:   {name:"护理",icon:"band",c:"green"}
};
const CARDS={
  bp:      {no:1,type:"measure",title:"在家量血压",sub:"家庭血压测量",icon:"heart",art:"bp",kind:"clinical",ready:true,
            desc:"怎么量准、怎么记全，什么时候该停下来找医护。",
            stats:[["用时","约 10 分钟"],["准备","上臂式血压计"],["适合","高血压随访"]],
            key:"静坐 5 分钟，袖带贴皮肤、与心脏同高",keyRefs:["cn2024","aha"],
            stopMini:"高于 180/120 且胸痛、气短、说话不清：打 120",stopRefs:["aha"],
            flavor:"慢一点，才量得准。",srcKeys:["cn2024","ws872","hbpm2019","aha","ahaThreat"],
            tags:["血压","高血压","血压计","低压","高压","收缩压","舒张压","袖带","头晕","量血压","测血压","心脑血管"]},
  glucose: {no:2,type:"measure",title:"在家测血糖",sub:"指尖血糖自测",icon:"drop",art:"glucose",kind:"clinical",ready:true,
            desc:"扎手指测得准、记得全，什么情况要马上找医护。",
            stats:[["用时","约 3 分钟"],["准备","血糖仪、试纸、采血针"],["适合","糖尿病"]],
            key:"酒精干透再扎，弃第一滴，不用力挤",keyRefs:["bjcyl","jcdm"],
            stopMini:"叫不醒、抽搐、意识不清：打 120",stopRefs:["jcdm"],
            flavor:"记下的每个数，都是给医生的线索。",srcKeys:["jcdm","bjcyl","cgm2021"],
            tags:["血糖","糖尿病","高血糖","血糖仪","扎手指","指尖血","试纸","采血针","空腹血糖","餐后血糖","控糖","糖化"]},
  followup:{no:3,type:"record",title:"复诊准备",sub:"带什么、问什么",icon:"clip",art:"followup",kind:"organize",ready:true,
            desc:"复诊前要带的东西、要问的问题，一张清单理清楚。",
            stats:[["用时","约 15 分钟"],["准备","病历本、药盒"],["适合","所有复诊"]],
            key:"带上所有正在吃的药，写好最想问的 3 个问题",flavor:"把要说的话，提前排好队。",
            tags:["复诊","看病","门诊","挂号","出院","问医生","检查单","化验单","病历","随访","带药"]},
  medlog:  {no:4,type:"record",title:"用药记录",sub:"照医嘱抄、按时记",icon:"pill",art:"meds",kind:"organize",ready:true,
            desc:"照着药盒和医嘱抄下来，每次吃完打个勾。不做剂量建议。",
            stats:[["用时","每次 10 秒"],["准备","药盒、处方单"],["适合","长期用药"]],
            key:"照处方单抄，不自己改；吃完就打勾",flavor:"打个勾，就不怕忘。",
            tags:["吃药","服药","用药","药盒","漏服","处方","医嘱","打勾","慢病用药","分装药盒","按时吃药"]},
  symptom: {no:5,type:"record",title:"症状日记",sub:"哪里不舒服、多久",icon:"note",art:"symptom",kind:"organize",ready:true,
            desc:"把不舒服的时间、程度、持续多久记下来，复诊时给医生看。",
            stats:[["用时","每条 1 分钟"],["准备","手机或本子"],["适合","任何不适"]],
            key:"记下时间、程度、持续多久、当时在做什么",flavor:"说不清的难受，写下来就清楚了。",
            tags:["不舒服","难受","症状","记录","头疼","头晕","胸闷","疼","日记","病情变化","发作"]},
  inhaler: {no:6,type:"meds",title:"吸入剂怎么用",sub:"气雾剂与干粉吸入核对",icon:"wind",art:"inhaler",kind:"clinical",ready:true,
            desc:"分清气雾剂和干粉吸入器，核对呼气、含紧、屏气、漱口每一步。",
            stats:[["用时","每次约 2–3 分钟"],["准备","吸入装置、漱口清水（有储雾罐的一并备好）"],["适合","哮喘、慢阻肺等使用吸入药的家人"]],
            key:"先呼空再吸：气雾剂慢深吸，干粉用力深吸，屏气数到 10",keyRefs:["nhlbiMdi","nhlbiDpi"],
            stopMini:"吸药后仍一直喘不上气、嘴唇发紫、胸痛或昏迷：打 120",stopRefs:["nhcCopd","ala"],
            flavor:"吸得对，药才到得了肺里。",srcKeys:["nhlbiMdi","nhlbiDpi","mpInhaler","mpSpacer","nhcCopd","ala"],
            tags:["吸入器","喷雾","气雾剂","干粉","储雾罐","哮喘","慢阻肺","喘息","气喘","吸药","漱口","支气管"]},
  weight:  {no:7,type:"measure",title:"每天称体重",sub:"心衰与水肿居家监测",icon:"scale",art:"weight",kind:"clinical",ready:true,
            desc:"固定时间怎么称、水肿怎么看，体重涨多少要马上联系医生。",
            stats:[["用时","每天约 2 分钟"],["准备","硬平地面上的同一台体重秤"],["适合","心力衰竭（心衰）、容易水肿的家人"]],
            key:"每天晨起排尿后、早饭前，穿同样衣服用同一台秤",keyRefs:["ahaHf","mpHf"],
            stopMini:"休息时仍严重喘不上气、胸痛不缓解、昏迷或嘴唇发紫：打 120",stopRefs:["ahaHf","mpHf","nhsHf"],
            flavor:"秤上的变化，比腿肿更早说话。",srcKeys:["ahaHf","mpHf","nhsHf"],
            tags:["体重","称重","心衰","心力衰竭","水肿","浮肿","脚肿","腿肿","脚踝肿","憋气","积水","肚子胀"]},
  fall:    {no:8,type:"safety",title:"居家防跌倒",sub:"家里怎么改、摔了怎么办",icon:"walk",art:"fall",kind:"clinical",ready:true,
            desc:"家里哪些地方最容易摔、怎么改，摔倒后怎么办。",
            stats:[["用时","改家一次，长期受益"],["准备","防滑垫、扶手、小夜灯"],["适合","家中有老人"]],
            key:"浴室防滑装扶手，夜里留灯，起身慢一点",keyRefs:["fallgl","bjcdc"],
            stopMini:"摔倒后叫不醒、意识不清：打 120",stopRefs:["fallgl"],
            flavor:"慢一点，家里就安全一点。",srcKeys:["fallgl","cdccore","bjcdc"],
            tags:["摔倒","跌倒","摔跤","防滑","扶手","卫生间","浴室","夜灯","骨折","老人安全","走路不稳","起夜"]},
  wound:   {no:9,type:"care",title:"居家伤口观察",sub:"术后与日常敷料观察",icon:"band",art:"wound",kind:"clinical",ready:true,
            desc:"敷料怎么护、每天看哪几样，出现哪些红肿渗液信号要找医护。",
            stats:[["用时","每次观察约 3 分钟"],["准备","肥皂和清水、医嘱备好的无菌敷料"],["适合","术后缝合切口、居家换药与伤口观察"]],
            key:"碰敷料前先洗手，保持干燥，不乱涂药膏，看红肿热痛脓",keyRefs:["mpWound","nhsCuts"],
            stopMini:"伤口大量出血、按压仍止不住：持续按压并打 120",stopRefs:["nhsCuts"],
            flavor:"看清变化，好得才稳当。",srcKeys:["mpWound","hkWound","nhsCuts"],
            tags:["伤口","换药","术后","手术","切口","刀口","拆线","纱布","敷料","红肿","流脓","渗液","出血","发炎","感染","压疮","褥疮"]},
  hypo:    {no:10,type:"safety",title:"识别低血糖",sub:"心慌手抖出冷汗",icon:"warn",art:"hypo",kind:"clinical",ready:true,
            desc:"认出低血糖的早期信号和加重信号，知道什么时候要打 120。",
            stats:[["用时","测一次约 3 分钟"],["准备","血糖仪、医生交代的应对方法"],["适合","用降糖药的糖尿病人"]],
            key:"糖尿病人血糖≤3.9 mmol/L 就是低血糖；叫不醒别喂，打120",keyRefs:["cmahypo","cctv"],
            stopMini:"叫不醒、意识不清、抽搐或昏迷：不喂东西，打 120",stopRefs:["cctv","medline"],
            flavor:"早一点认出来，就早一点安全。",srcKeys:["cmahypo","medline","cctv","bjwjw"],
            tags:["低血糖","血糖低","心慌","手抖","出冷汗","冒冷汗","饥饿","头晕","犯困","昏迷","补糖","糖尿病急救"]},
  breathing:{no:11,type:"care",title:"缩唇和腹式呼吸",sub:"慢阻肺呼吸练习",icon:"wind",art:"breathing",kind:"clinical",ready:true,
            desc:"缩唇呼吸和腹式呼吸怎么做，气短时怎么拿出来用。",
            stats:[["用时","每次约 10–15 分钟"],["准备","一把有靠背的椅子"],["适合","慢阻肺（慢性阻塞性肺疾病）、肺康复"]],
            key:"鼻子吸气，嘴唇像吹口哨一样慢慢呼出",keyRefs:["nhcCopd","ala"],
            stopMini:"一直喘不上气、嘴唇发紫、胸痛、昏迷：打 120",stopRefs:["ala","nhcCopd"],
            flavor:"慢慢呼，气会顺一些。",srcKeys:["nhcCopd","cmaCopd2018","puh3","ala"],
            tags:["呼吸","气短","喘不上气","憋气","慢阻肺","肺气肿","肺康复","缩唇呼吸","腹式呼吸","哮喘","吹口哨"]},
  dementia:{no:12,type:"care",title:"认知障碍日常照护",sub:"沟通、作息与防走失",icon:"note",art:"dementia",kind:"clinical",ready:true,
            desc:"怎么沟通、怎么安排作息、怎么防走失，照护的人怎么撑得住。",
            stats:[["适合","家里有认知障碍（失智、老年痴呆）的老人"],["准备","防走失手环或定位器、近期照片"]],
            key:"一次只说一件事，别争对错，作息固定（国家卫健委）",keyRefs:["alzComm","niaComm","nhcAD","niaAgit"],
            stopMini:"激动到可能伤到自己或别人：打 120",stopRefs:["niaAgit"],
            flavor:"不是他故意的，是病在作怪。",srcKeys:["nhcAD","nhc12356","niaComm","niaDos","alzComm","niaAgit","niaBehav","niaWander","alzWander","niaSelf"],
            tags:["失智","痴呆","老年痴呆","阿尔茨海默","记性差","忘事","糊涂","走失","迷路","防走失","发脾气","日落现象","认知障碍"]},
  transfer:{no:13,type:"care",title:"床到轮椅转移",sub:"安全扶家人坐上椅",icon:"band",art:"transfer",kind:"clinical",ready:true,
            desc:"一个人怎么安全地扶家人从床边坐上轮椅，不伤腰、不摔倒。",
            stats:[["准备","轮椅、防滑鞋，需要时备转移带"],["适合","至少一条腿能站住的家人"]],
            key:"先刹好轮椅，屈膝挺腰用腿发力，别拽手臂",keyRefs:["hkLift","mpWheel","albTransfer"],
            stopMini:"转移中摔倒、可能伤到头背脖子或髋部：别硬抱，打 120",stopRefs:["nhsFalls"],
            flavor:"慢一点，两个人都安全。",srcKeys:["hkLift","hkSide","dfyyTransfer","bjYouan","mpWheel","albTransfer","nhsFalls"],
            tags:["轮椅","转移","抱人","扶人","下床","起床","中风","偏瘫","瘫痪","半身不遂","护腰","闪腰","转移带","卧床"]},
  insulin_pen:{no:14,type:"meds",title:"胰岛素笔怎么用",sub:"注射步骤与部位轮换",icon:"pill",art:"insulin_pen",kind:"clinical",ready:true,
            desc:"怎么装针排气、轮换部位、停够时间，避免硬结和低血糖风险。",
            stats:[["用时","每次约 3–5 分钟"],["准备","胰岛素笔、一次性新针头、锐器盒"],["适合","居家使用胰岛素笔的糖尿病家人"]],
            key:"一针一换先排气，避开硬结轮换打，推到底停够 10 秒",keyRefs:["cmaIns2016"],
            stopMini:"注射后叫不醒、意识不清、抽搐或昏迷：别喂食，打 120",stopRefs:["cctv","cmahypo","medline"],
            flavor:"部位常轮换，针头不留笔。",srcKeys:["cmaIns2016","jcdm","cmahypo","medline","cctv"],
            tags:["胰岛素","打胰岛素","胰岛素笔","打针","皮下注射","笔芯","针头","硬结","脂肪增生","肚皮打针","控糖","糖尿病"]},
  eyedrops:{no:15,type:"meds",title:"眼药水怎么滴",sub:"点眼步骤与防污染",icon:"drop",art:"eyedrops",kind:"clinical",ready:true,
            desc:"怎么拉下眼皮滴准、按内眼角防流走，不碰脏瓶嘴。",
            stats:[["用时","每次约 3 分钟"],["准备","肥皂和清水、处方滴眼液、干净纸巾"],["适合","青光眼、术后或日常点眼药的家人"]],
            key:"洗净手不碰瓶嘴，滴进下眼皮小口袋，闭眼轻按内眼角",keyRefs:["neiDrops","aaoDrops","mpDrops"],
            stopMini:"突然看不见、剧烈眼痛伴头痛呕吐，或化学品入眼：打 120",stopRefs:["nhsEyePain"],
            flavor:"悬空滴一滴，轻按留得住。",srcKeys:["neiDrops","aaoDrops","mpDrops","nhsEyePain"],
            tags:["眼药水","滴眼液","点眼药","眼睛","青光眼","白内障","干眼","结膜炎","眼痛","视力模糊","眼科","内眼角"]}
};
const GENERAL=["followup","medlog","symptom"];
const TOTAL_NO=()=>Object.keys(CARDS).length;
/* 稀有度：按来源核对状态自动计算，不手填 */
function rarity(k){const c=CARDS[k];if(!c.ready)return {n:0,label:"编写中"};if(c.kind==="organize")return {n:1,label:"整理工具 · 不含临床建议"};
  const ks=c.srcKeys||[];const ok=ks.filter(s=>SOURCES[s]&&SOURCES[s].v==="ok").length;
  return ok===ks.length?{n:3,label:`来源全部核对 ${ok}/${ks.length}`}:{n:2,label:`来源已核对 ${ok}/${ks.length}`}}

/* ================= 详细内容（每张卡的「为什么」与每一步的理由） =================
   每条：t 标题 / d 怎么做 / why 为什么（只写来源支持的理由，没有就不写）/ r 来源 key */
const CONTENT={
  bp:{
    lead:"怎么在家把血压量准、记全，以及什么时候要停下来找医护。",
    why:[
      {t:"家里量的血压，是医生调整治疗的依据。",d:"美国心脏协会建议所有高血压患者在家监测，帮医生判断治疗是否有效；家庭血压也可以帮助确认诊断。但它不能代替定期复诊。",r:["aha"]},
      {t:"一次读数只是一张「快照」。",d:"一段时间里连续记下的读数，才能完整反映血压情况，帮你和医生一起判断治疗是否起效。",r:["aha"]},
      {t:"不管在家量到多少，都不要自己停药。",d:"读数高或低，先记下来，再和医生商量。",r:["aha"]}],
    for:[["医生让你或家人在家监测血压，或想把读数带去复诊",["aha","cn2024"]],["家里有经过验证的上臂式电子血压计",["cn2024"]]],
    notfor:"已经胸痛、呼吸困难、说话不清时，不要先量血压，直接看「何时联系医护」。",
    steps:[
      {t:"量之前 30 分钟内不抽烟、不喝咖啡或茶、不运动，先排空小便",r:["ws872","aha"],d:"提前计划好测量时间。"},
      {t:"坐好，安静休息至少 5 分钟",r:["cn2024","ws872"],d:"坐有靠背的椅子，双脚平放、不跷腿。休息和测量时都不说话、不看手机。",dr:["aha"]},
      {t:"袖带绑在裸露的上臂",r:["aha","ws872"],d:"袖带下缘在肘窝上方约两横指，松紧以能塞进 1–2 根手指为宜。手臂放桌上，袖带中部与心脏同高。",dr:["ws872","cn2024"],why:"袖带大小不合适，读数就会不准。",wr:["aha"]},
      {t:"连测 2 次，中间隔约 1 分钟",r:["ws872","aha"],d:"两次差别超过 10 mmHg，再测第 3 次。",dr:["cn2024"]},
      {t:"每一次读数都记下来，连同日期和时间",r:["ws872"],d:"不要只记平均值或「好看的那一次」。录入后先核对，确认无误才算数。",why:"连续的记录比单次读数更能反映真实情况。",wr:["aha"]}],
    mistakes:[
      {t:"隔着衣服量，或把袖子卷起来勒住胳膊",d:"袖带要直接贴在皮肤上。",r:["aha"]},
      {t:"刚进门、刚上完楼就量",d:"先静坐至少 5 分钟。",r:["cn2024"]},
      {t:"边量边聊天、看手机",d:"测量时不说话、不动。",r:["ws872"]},
      {t:"用手腕式或手指式血压计",d:"它们读数不够可靠，指南推荐经过验证的上臂式电子血压计；臂围大于 32 cm 用大袖带，小于 24 cm 用小袖带。",r:["cn2024","aha"]},
      {t:"看到一次偏高，就自己停药、加药或改剂量",d:"不论家里量到多少，都不要自行停药或改药，先问医生。",r:["aha"]}],
    freq:{lead:"以你的医生安排为准。指南的一般做法供参考：",items:[
      ["早晚各量：早上起床后 1 小时内、排尿后、吃药和早饭前；晚上睡前。",["ws872","hbpm2019"]],
      ["刚开始治疗或血压还没控制好时，常见做法是复诊前连续量 5–7 天；控制稳定后可每周至少量 1 天。",["hbpm2019","cn2024"]]]},
    stop:[
      ["120","马上拨打 120","血压高于 180/120 mmHg，并且出现胸痛、气短、背痛、麻木、无力、视物改变或说话困难中的任何一种。不要等它自己降下来。",["aha"]],
      ["urgent","尽快联系医生","读数高于 180/120 mmHg，等至少 1 分钟复测仍然很高（没有上述症状）。",["aha"]],
      ["followup","复诊时告诉医生","单次偏高先别慌，再量一次并都记下来。家庭血压多日平均 ≥135/85 mmHg 需要医生评估。",["aha","cn2024"]]],
    stopNote:"急救电话按中国大陆 120 写（原文为美国 911）。",
    organ:"htn",
    srcs:["cn2024","ws872","hbpm2019","aha","ahaThreat"]
  },
  glucose:{
    lead:"扎手指测血糖：怎么测得准、记得全，什么情况要马上找医护。",
    why:[
      {t:"看清吃饭、活动、用药对血糖的影响。",d:"指尖血糖能实时反映饮食、运动、药物对血糖的影响，帮医生判断方案是否合适。",r:["bjcyl"]},
      {t:"监测是判断控糖效果最直观的办法。",d:"长期平稳控糖能大幅降低眼底、肾脏、心脑血管损伤的风险。",r:["bjcyl"]},
      {t:"它和「糖化血红蛋白」互相补充。",d:"糖化血红蛋白反映近 2–3 个月的平均血糖，但会掩盖日常的大幅波动和夜间低血糖，两者要搭配。",r:["bjcyl"]}],
    for:[["医生让你或家人在家用血糖仪测指尖血糖",["cgm2021"]]],
    notfor:"已经叫不醒、抽搐、意识不清——请直接看「何时联系医护」。休克、严重脱水或水肿时，指尖血糖不可靠。",notforRefs:["bjcyl"],
    steps:[
      {t:"先检查试纸",r:["jcdm","bjcyl"],d:"试纸在有效期内、存放干燥避光；血糖仪和试纸要配套，需要调码的先核对。",dr:["jcdm"]},
      {t:"洗手擦干；用酒精消毒就等它干透再扎",r:["bjcyl","jcdm"],why:"酒精没干会稀释血样、干扰试纸，读数不准。",wr:["bjcyl"]},
      {t:"扎指尖，让血自己流出来",r:["jcdm"],d:"不要用力挤压指尖。",why:"挤出的组织液会稀释血样，让数值不准。",wr:["bjcyl"]},
      {t:"擦去第一滴，用第二滴",r:["jcdm","bjcyl"],d:"具体加样方法严格按你这台血糖仪的说明书来。",dr:["jcdm"]},
      {t:"记下日期、时间、结果和单位",r:["jcdm"],d:"同时写上是空腹、餐前、餐后 2 小时还是睡前。"},
      {t:"用过的采血针放进锐器盒",r:["jcdm"],d:"手册要求按医疗废物处理。",dr:["jcdm"]}],
    mistakes:[
      {t:"餐后 2 小时从吃完饭开始算",d:"应该从吃第一口饭开始计时，否则会低估真实血糖。",r:["bjcyl"]},
      {t:"测血糖那天故意少吃",d:"结果反映不了平时的真实血糖，会误导医生。",r:["bjcyl"]},
      {t:"酒精还没干就扎、或者使劲挤血",d:"都会让读数不准。",r:["bjcyl"]},
      {t:"看到数值好了就自己停药、减药",d:"糖尿病无法根治，擅自停药血糖会快速反弹。先问医生。",r:["bjcyl"]}],
    freq:{lead:"测几次、测哪个时间点，按医生给的方案。基层手册里的一般做法供参考：",leadRefs:["jcdm","cgm2021"],items:[
      ["吃降糖药的：每周 2–4 次空腹或餐后 2 小时；或复诊前 1 周内连续 3 天，每天测早餐前后、午餐前后、晚餐前后和睡前 7 个点。",["jcdm"]],
      ["打胰岛素的：测哪几个点和胰岛素方案有关，请让医生写清楚。",["jcdm"]],
      ["出现心慌、出汗等低血糖症状时，马上测一次。",["jcdm"]]]},
    stop:[
      ["120","马上拨打 120","叫不醒、意识不清、说胡话或抽搐。",["jcdm"]],
      ["urgent","尽快去医院","血糖很高（≥16.7 mmol/L），同时恶心呕吐、肚子痛、呼吸有烂苹果味或精神很差。",["jcdm"]],
      ["doctor","按医生教的方法处理，并告诉医生","测到 ≤3.9 mmol/L 就算低血糖。低血糖时怎么吃、吃多少，请提前问医生写下来；反复出现低血糖要联系医生。",["jcdm"]],
      ["followup","复诊时说","血糖忽高忽低，或长期达不到医生定的目标。",["jcdm"]]],
    organ:"dm",
    srcs:["jcdm","bjcyl","cgm2021"]
  },
  fall:{
    lead:"家里哪些地方最容易摔、怎么改，摔倒后怎么办。",
    why:[
      {t:"跌倒是我国 65 岁及以上老人因伤害死亡的第一位原因，也最常让老人骨折。",d:"",r:["cdccore"]},
      {t:"老人跌倒一半以上发生在家里。",d:"把家里改一改，家人照顾好，就能明显少摔。",r:["fallgl"]},
      {t:"跌倒不是单纯的“不小心”，和身体变化、用药、鞋子、灯光、地面都有关系，所以是可以预防的。",d:"",r:["cdccore"]}],
    for:[["家里有 65 岁以上老人",["cdccore"]],["老人走路不稳、起夜多，或以前摔过",["fallgl","bjcdc"]]],
    notfor:"老人已经摔倒、叫不醒或说不清话：不要先改家，直接看“何时联系医护”。",
    steps:[
      {t:"卫生间先改：防滑、干燥、装扶手",r:["fallgl","bjcdc"],d:"地面防滑并保持干燥；淋浴处放防滑胶垫；马桶旁、淋浴处装牢固的扶手；能用坐便就别用蹲厕。",why:"卫生间是老人最常去、也最容易受伤的地方。"},
      {t:"夜里留一盏灯",r:["fallgl","bjcdc"],d:"床边放伸手就能摸到的台灯；床边、走廊、卫生间门口装小夜灯或感应灯。",why:"很多跌倒发生在起夜摸黑去卫生间的路上。"},
      {t:"把通道清出来",r:["fallgl","cdccore"],d:"移走地上的杂物、纸箱；电线收好或固定在墙角；小地毯拿走或用双面胶固定；常用东西放在伸手就够得着的地方。",why:"绊脚的东西和登高取物都容易让人摔倒。"},
      {t:"穿合脚、防滑、低跟的鞋",r:["cdccore","bjcdc"],d:"鞋底纹路清楚、防滑；鞋大小合适；尽量不穿后跟不包脚的拖鞋走动；裤腿不要太长。"},
      {t:"起身、转身都放慢",r:["bjcdc","cdccore"],d:"醒来先在床上躺一会儿，再坐起停一停，双脚落地后再站。转身、接电话、开门也慢半拍。不站着穿裤子。",why:"起身太快容易头晕、眼前发黑、站不稳。"},
      {t:"发现有人摔倒：先别急着扶",r:["fallgl","cdccore"],d:"先确认周围安全，再看他能不能回应、有没有呼吸、有没有出血或骨折的样子。不要猛烈摇晃，注意给他保暖。",why:"盲目扶起可能加重损伤。"},
      {t:"清醒、没受伤时，再帮他慢慢起来",r:["fallgl"],d:"如果他自己想站起来，可以帮他慢慢起身，先坐下或躺下休息观察，确认没事再离开。"},
      {t:"摔过一次，就去医院查原因",r:["fallgl","cdccore"],d:"不管伤没伤到，都要告诉家人和医生，由家人陪着去医院查一查为什么会摔、以后怎么防。"}],
    mistakes:[
      {t:"一看到老人摔倒，马上拉起来",d:"先判断伤情。有骨折、腰背受伤或中风迹象时，扶起或搬动会让情况更糟。",r:["fallgl","cdccore"]},
      {t:"站着穿裤子、踩凳子拿高处的东西",d:"日常要放慢速度，不站立穿裤，不登高取物。常用东西放低一点。",r:["cdccore"]},
      {t:"怕摔，就让老人整天坐着别动",d:"长期少动会让肌肉更弱，反而更容易摔。应在安全前提下坚持锻炼平衡和腿部力量。",r:["cdccore","bjcdc"]},
      {t:"觉得头晕，自己把药停了或减了",d:"一些药会让人头晕、站不稳，但不要自行停药或加减药量，要告诉医生，由医生调整。",r:["bjcdc","cdccore"]},
      {t:"扶手随便装一个就行",d:"扶手的位置、高度、承重都要合适，否则可能变成新的风险。",r:["bjcdc"]}],
    stop:[
      ["120","马上拨打 120","摔倒后叫不醒、意识不清：马上打 120。如果没有呼吸，立即做心肺复苏。",["fallgl"]],
      ["120","马上拨打 120","人清醒，但想不起怎么摔的，或有剧烈头痛、嘴角歪斜、说话不清、手脚无力：不要扶起，马上打 120。",["fallgl"]],
      ["120","马上拨打 120","手脚疼得厉害、变形，或腰背痛、双腿感觉异常、大小便失禁：可能骨折或伤到腰椎，不要随便搬动，打 120。",["fallgl"]],
      ["followup","每次跌倒都要告诉医生","每次跌倒，不管伤没伤，都要告诉医生，查找原因、评估风险。",["fallgl","cdccore"]]],
    srcs:["fallgl","cdccore","bjcdc"]
  },
  hypo:{
    lead:"认出低血糖的早期信号和加重信号，知道什么时候要打 120。",
    why:[
      {t:"对用药的糖尿病人来说，血糖≤3.9 mmol/L 就算低血糖。",d:"持续严重的低血糖会伤脑，甚至危及生命。",r:["cmahypo"]},
      {t:"老人低血糖常常不典型，有时没有任何前兆就昏迷，或者看起来像中风，家人要格外留意。",d:"",r:["cmahypo","cctv"]},
      {t:"低血糖还会让老人跌倒，带来骨折、头部受伤。",d:"",r:["cctv"]}],
    for:[["家人有糖尿病，正在用胰岛素或降糖药",["cmahypo","medline"]],["出现心慌、手抖、出冷汗、饥饿等不舒服",["cmahypo"]]],
    notfor:"人已经叫不醒、昏迷或抽搐：不要喂任何东西，直接看“何时联系医护”。",
    steps:[
      {t:"认出早期信号",r:["cmahypo","medline"],d:"心慌、手抖、出冷汗、脸色发白、很饿、手脚发凉、浑身没劲、头晕。",why:"这时人往往还清醒，是处理的好时机。"},
      {t:"留意加重的信号",r:["cmahypo","bjwjw"],d:"说话不清、答非所问、行为反常、看东西模糊、犯困、意识模糊，甚至抽搐、昏迷。"},
      {t:"有症状就测一次指尖血糖",r:["medline","cmahypo"],d:"糖尿病人一有这些症状就测；测到≤3.9 mmol/L 就按低血糖处理。"},
      {t:"人清醒、能吞咽：按医生事先教的方法补糖",r:["medline","bjwjw"],d:"按医生之前交代的种类和量，给吃含糖的食物或饮料。不清楚怎么做，平时就要先问好医生。",why:"家人应提前知道该给什么、给多少、什么时候叫急救。"},
      {t:"过一会儿再测",r:["medline","cctv"],d:"吃完等约 15 分钟再测一次血糖，看有没有回升、症状有没有好转。"},
      {t:"叫不醒、不能吞咽：不喂食，侧躺，打 120",r:["cctv","cmahypo"],d:"让他侧躺，保持呼吸通畅，马上打 120，等医护人员来处理。",why:"昏迷时喂水喂糖容易呛进气管，引起窒息。"},
      {t:"事后告诉医生",r:["medline"],d:"把发生的时间、血糖数、当时吃饭和用药情况记下来，复诊时给医生看。"}],
    mistakes:[
      {t:"人已经昏迷，还硬往嘴里灌糖水",d:"昏迷时不要喂水、喂糖、喂任何东西，容易误吸窒息。应侧卧、打 120。",r:["cctv","cmahypo"]},
      {t:"觉得老人只是“累了、困了”",d:"老人低血糖症状常不典型，可能表现为犯困、行为异常，甚至像中风。有糖尿病的老人出现这些情况，要想到低血糖。",r:["cmahypo"]},
      {t:"发生过低血糖，就自己减药、停药或换药",d:"经常低血糖要告诉医生，但不要在没问医生前自己改用药。",r:["medline","cctv"]},
      {t:"血糖越低越好",d:"控糖不是越低越好，严重低血糖对心脏、大脑的伤害很大。",r:["cctv"]}],
    stop:[
      ["120","马上拨打 120","叫不醒、意识不清、抽搐或昏迷：不要喂东西，侧躺，马上打 120。",["cctv","medline"]],
      ["120","马上拨打 120","已经犯困、嗜睡：及时打急救电话。",["cmahypo"]],
      ["120","马上拨打 120","吃了含糖食物后症状仍不好转：打 120 或尽快去急诊，不要自己开车。",["medline"]],
      ["doctor","告诉医生","低血糖反复发生或经常偏低：尽快告诉医生，由医生调整方案。",["medline"]]],
    stopNote:"急救电话按中国大陆 120 写（部分原文为美国 911）。",
    srcs:["cmahypo","medline","cctv","bjwjw"]
  },
  breathing:{
    lead:"缩唇呼吸和腹式呼吸怎么做，气短时怎么拿出来用。",
    why:[
      {t:"慢阻肺（慢性阻塞性肺疾病）的人，肺里旧气容易排不干净，憋在里面。",d:"缩唇呼吸让呼气变慢、变长，能帮小气道撑开，把肺里的旧气呼出去。",r:["ala","puh3"]},
      {t:"腹式呼吸是让肚子带着呼吸，少用脖子、肩膀的力气，呼吸更省劲，气短会轻一些。",d:"",r:["ala","puh3"]},
      {t:"国家卫健委的慢阻肺健康教育处方和中华医学会基层诊疗指南，都把腹式呼吸、缩唇呼吸列为患者要学会的自我管理技巧。",d:"",r:["nhcCopd","cmaCopd2018"]},
      {t:"呼吸练习是吃药之外的帮手，不能代替药物。",d:"药要按医嘱长期用，不要自己停。",r:["nhcCopd"]}],
    for:[["慢阻肺（慢性阻塞性肺疾病）病情稳定时的日常练习",["nhcCopd"]],["哮喘等慢性肺病，医生或康复师建议练习呼吸的人",["ala"]],["走路、爬楼时感到气短，想让呼吸慢下来",["ala"]]],
    notfor:"正在急性加重：咳嗽、咳痰、喘憋短时间内明显加重——不要硬练，请直接看何时联系医护；嘴唇发紫、胸痛、意识不清——请直接看何时联系医护；合并肺大疱、心力衰竭等，请先问医生要个人方案。",
    steps:[
      {t:"先找个舒服的姿势",r:["ala","nhcCopd"],d:"坐在有靠背的椅子上，或者躺下、半躺都可以。放松脖子和肩膀。",why:"肩颈一紧，就会用错力气呼吸。卧位、坐位、站位都能练。"},
      {t:"闭上嘴，用鼻子慢慢吸气",r:["ala","nhcCopd"],d:"心里默数「1、2」，用鼻子吸气，嘴巴闭着。",why:"用鼻吸气是两种呼吸法的第一步。"},
      {t:"嘴唇缩起来，慢慢呼出去",r:["ala","nhcCopd","puh3"],d:"把嘴唇撅起来，像吹口哨或轻轻吹蜡烛，默数「1、2、3、4」，慢慢把气呼完。呼气要比吸气长，一般是吸气的 2 倍以上，大约 4–6 秒。",why:"嘴唇缩起来形成一点阻力，气道能撑开更久，肺里憋住的气更容易排出来。"},
      {t:"手放肚子上，练腹式呼吸",r:["ala","nhcCopd","puh3"],d:"双手轻放在肚子上。吸气时让肚子像气球一样鼓起来，呼气时肚子慢慢瘪下去，胸口尽量不动。",why:"手放在肚子上，能感觉到肚子起伏，帮你把注意力放在膈肌（肚子和胸之间的那块呼吸肌）上。"},
      {t:"两种方法连起来做",r:["ala"],d:"腹式呼吸吸气，再用缩唇的方式慢慢呼出。一边呼吸，一边保持肩膀放松。",why:"美国肺脏协会教的腹式呼吸，呼气就是用缩唇的方式。"},
      {t:"每次练 10–15 分钟，每天 2–3 次",r:["nhcCopd","ala"],d:"按国家卫健委的建议，腹式呼吸每次 10–15 分钟，每天 2–3 次或更多。累了就停下休息。",why:"天天练才会熟，熟了气短时才用得上。"},
      {t:"熟练后，气短时拿出来用",r:["ala"],d:"走路、爬楼或者气短时，用缩唇呼吸让呼吸慢下来，直到呼吸恢复平稳。",why:"缩唇呼吸能让呼吸变慢、每一口气更有效，也能让人平静下来。"}],
    mistakes:[
      {t:"等到喘不上气才第一次练",d:"这些方法看着简单，其实要花时间练熟。要在呼吸还好的时候练，熟练了再在气短时用。",r:["ala"]},
      {t:"呼气太快、太短",d:"关键是慢慢呼、呼得长，呼气时间至少是吸气的 2 倍，这样才能把肺里的旧气呼出来。",r:["ala","puh3"]},
      {t:"耸肩、用胸口使劲吸",d:"要放松脖子和肩膀，让肚子起伏，胸口尽量不动。",r:["ala","puh3"]},
      {t:"觉得练了呼吸就可以少吃药、停药",d:"药要按医嘱长期用，不可随意停药。呼吸练习只是配合治疗。",r:["nhcCopd"]}],
    freq:{lead:"以你的医生安排为准。来源里的一般做法供参考：",items:[
      ["国家卫健委建议：腹式呼吸每次 10–15 分钟，每天 2–3 次或更多。",["nhcCopd"]],
      ["美国肺脏协会建议：两种呼吸法每天各练大约 5–10 分钟。",["ala"]]]},
    stop:[
      ["120","马上拨打 120","用了缩唇呼吸还是一直喘不上气，或者嘴唇发紫、胸痛、昏迷：马上打 120。",["ala","nhcCopd"]],
      ["urgent","尽快联系医生或就医","短时间内咳嗽、咳痰、喘憋明显加重：少活动，尽快联系医生或去附近医院；严重的直接打 120。",["nhcCopd"]],
      ["urgent","尽快联系医生或就医","呼吸困难越来越重，或者出现腿肿、肚子胀、吃不下、头晕头痛：尽快就诊。",["nhcCopd"]],
      ["followup","定期复查","大约每半年去医院查一次肺功能，了解病情变化。",["nhcCopd"]]],
    stopNote:"急救电话按中国大陆 120 写（部分原文为美国 911）。",
    srcs:["nhcCopd","cmaCopd2018","puh3","ala"]
  },
  dementia:{
    lead:"怎么沟通、怎么安排作息、怎么防走失，照护的人怎么撑得住。",
    why:[
      {t:"阿尔茨海默病（最常见的老年痴呆）会让人记性变差、说话找不到词、判断变差，性格和行为也会变。",d:"这些变化是病造成的，不是老人故意的。",r:["nhcAD","niaBehav"]},
      {t:"家人学会沟通方法和照护技巧，日常「协助而不包办」，能帮老人保住现在还有的能力。",d:"",r:["nhcAD"]},
      {t:"走失很常见，也很危险，甚至会危及生命。",d:"提前做好防护，比事后找人要好得多。",r:["alzWander","nhcAD"]},
      {t:"照护的人压力很大。",d:"照顾好自己，才能照顾得长久；感到难过、生气、委屈，都是正常的。",r:["nhcAD","niaSelf"]}],
    for:[["已确诊阿尔茨海默病或其他认知障碍的家人",["nhcAD"]],["家人记性明显变差、在家照护的日常",["nhcAD"]]],
    notfor:"家人突然变得糊涂、行为在一两天内大变，尤其刚发烧感染或换过药：这不是日常照护能处理的，请直接看何时联系医护；还没确诊、只是怀疑记性变差：请先陪同到老年病科、神经内科、精神/心理科或记忆门诊就诊。",
    steps:[
      {t:"说话前先叫名字、看着他",r:["niaComm","alzComm"],d:"走到他面前，叫他的名字，看着他的眼睛。在安静的地方一对一说话，关掉电视、收音机。",why:"背景声音太多，他很难集中注意力听你说。"},
      {t:"短句子，一次只说一件事",r:["alzComm","niaComm"],d:"说慢一点、清楚一点。一次只问一个问题，多用「是不是」「要不要」来问，比如「要喝点茶吗？」而不是「你想喝什么？」。要做的事一步一步说。",why:"长句子、一次说好几件事，会让他应付不过来。"},
      {t:"给他时间，别打断、别纠正",r:["alzComm","niaDos","niaComm"],d:"多等一会儿让他回答。他说错了也不要批评、纠正，不要争对错；听不懂就换个说法再说一遍。不要问「你还记不记得……」。",why:"争对错只会让他更急。耐心和安慰，能让他更愿意表达。"},
      {t:"态度和蔼，保住他的尊严",r:["nhcAD","niaComm"],d:"语气温和，不要当着他的面把他当不在场一样议论，不要用哄小孩的口气。可以握着他的手说话。",why:"国家卫健委强调要注重情感支持，不伤其自尊心，不轻易否定他的要求。"},
      {t:"每天的作息尽量固定",r:["niaAgit","niaBehav"],d:"洗澡、穿衣、吃饭尽量每天同一个时间。白天多拉开窗帘晒太阳，适当活动；傍晚别安排太多事，下午晚些时候少喝咖啡、浓茶，白天别睡太久。",why:"固定作息让他有安全感；有的老人到了傍晚更容易烦躁糊涂（「日落现象」），规律作息能帮助预防。"},
      {t:"做好防走失准备",r:["nhcAD","niaWander","alzWander"],d:"给他戴上写有姓名、住址和你电话的手环或卡片，或者在衣服上缝上联系方式；可以用定位设备。告诉邻居和社区他容易走失。手机里存一张他近期的照片。",why:"国家卫健委建议佩戴防走失设备，万一走失，能更快找回来。"},
      {t:"让家里更难「走出去」",r:["niaWander","alzWander"],d:"门加锁或装在高处、低处不显眼的位置，门上可装开门提醒铃。把鞋、钥匙、外套、包这些「要出门」的东西收起来。容易走失的老人不要让他独自待着，但也绝不要把他一个人锁在家里。",why:"看到出门的东西容易勾起「要出去」的念头；开门有提醒，你能及时发现。"},
      {t:"他烦躁、发脾气时：先稳住自己",r:["niaAgit"],d:"说话慢、语气平静，听他担心什么，告诉他「你很安全，我在这儿帮你」。可以给点吃的喝的，放他喜欢的音乐，陪他散步或一起叠衣服，转移注意力。你自己也深呼吸、数到 10。如果他动手，先退到安全距离，把刀具、车钥匙等收好。",why:"激越（坐立不安、发脾气）大多有原因，比如疼痛、便秘、睡不好、环境太吵、被逼着做做不到的事。先安抚，再找原因，告诉医生。"}],
    mistakes:[
      {t:"跟他争对错、纠正他说错的话",d:"不要批评、纠正，不要争辩；他说的你不同意，就随它去。",r:["alzComm","niaDos"]},
      {t:"一口气问好几个问题、说长串的话",d:"一次只问一个问题，用简单、一步一步的说法。",r:["alzComm"]},
      {t:"什么都替他做",d:"日常生活中协助而不包办，有助于维持他现有的能力。",r:["nhcAD"]},
      {t:"觉得他是故意找茬",d:"行为变化是病造成的，不是他本人的错。",r:["niaBehav"]},
      {t:"照护的人一直硬扛，不肯求助",d:"照顾一位认知障碍老人，往往超过一个人能承担的量。要请家人朋友帮忙具体的事，每天给自己留点休息时间，定期看自己的医生。",r:["niaSelf"]}],
    stop:[
      ["120","马上拨打 120","他激动到可能伤到自己或别人，或者出现其他紧急情况：打 120，并告诉接线员他有认知障碍（痴呆）。",["niaAgit"]],
      ["urgent","马上报警","发现人不见了：马上在附近找；15 分钟内没找到，立刻报警（110），告诉警察他有认知障碍，并提供近期照片。",["alzWander","niaWander"]],
      ["urgent","马上告诉医生","行为突然变了或者忽好忽坏，特别是最近有感染（如发烧、尿路感染）或刚换过药：马上告诉医生。",["niaBehav"]],
      ["followup","照护的人也需要帮助","照护的人觉得撑不住、长期睡不好、情绪很差：可以拨打全国统一心理援助热线 12356，也可以去看心理门诊。",["nhc12356","niaSelf"]]],
    stopNote:"急救电话按中国大陆 120、报警电话按 110 写（原文均为美国 911）。",
    srcs:["nhcAD","nhc12356","niaComm","niaDos","alzComm","niaAgit","niaBehav","niaWander","alzWander","niaSelf"]
  },
  transfer:{
    lead:"一个人怎么安全地扶家人从床边坐上轮椅，不伤腰、不摔倒。",
    why:[
      {t:"扶抱的方法不对，照护的人容易伤到腰背，家人也容易摔倒。",d:"方法对了，两个人都更安全、更安心。",r:["hkLift","albTransfer"]},
      {t:"拽着胳膊把人拉起来，容易让肩膀疼、肩关节半脱位（肩膀关节松脱），中风后一侧无力的人尤其容易受伤。",d:"",r:["dfyyTransfer","albTransfer"]},
      {t:"下面的一人扶法，前提是家人至少有一条腿能站住、能配合挪小步。",d:"站不住，就要找人帮忙或者用移位机（机械吊起的辅助器）。",r:["mpWheel"]}],
    for:[["家人能坐稳，至少一条腿能承重",["mpWheel"]],["中风后一侧无力、术后体弱等需要人扶着下床的家人",["dfyyTransfer","albTransfer"]]],
    notfor:"家人两条腿都站不住、不能配合：不要一个人硬抱，请找人帮忙或用移位机；髋部、腿部、脊柱骨折或手术后早期：先问医护能不能这样转移；刚摔倒、可能伤到头、背、脖子或髋部：不要扶起，请直接看何时联系医护。",
    steps:[
      {t:"先想好步骤，清走地上的东西",r:["mpWheel","hkLift","albTransfer"],d:"动手前把步骤在脑子里过一遍。移开地上的小地毯、杂物。给家人穿上防滑鞋或防滑袜。跟家人说清楚等会儿怎么做。",why:"地面滑、有东西绊脚，最容易摔。家人知道怎么配合，转移更顺。"},
      {t:"轮椅斜放床边，刹车刹好",r:["mpWheel","hkLift","hkSide","albTransfer","bjYouan"],d:"把轮椅推到床边，和床成大约 30–45 度角。如果一侧身体更有力，把轮椅放在有力的那一侧。刹好刹车，把脚踏板翻起来。",why:"斜放离得近，转身距离短。刹车没刹好，轮椅一受力就会滑走。"},
      {t:"扶家人坐起来，先坐一会儿",r:["mpWheel","albTransfer","bjYouan"],d:"让家人侧身朝向轮椅这边，你一只手托肩背、一只手托膝盖后面，顺势把腿放到床边，扶他坐起。坐稳后先歇一会儿，再挪到床边，双脚踩实地面。",why:"刚坐起来可能会头晕，先坐一会儿再站，能减少晕倒和摔倒。"},
      {t:"需要时系上转移带",r:["mpWheel","albTransfer"],d:"如果家里有转移带（系在腰上的宽带子，方便抓握），系在家人腰部，转移时抓住带子。",why:"抓转移带比空手环抱更牢，也不用去拉胳膊。"},
      {t:"站近、屈膝、挺腰",r:["hkLift","hkSide","mpWheel","albTransfer"],d:"尽量站近家人。双脚分开站稳，膝盖弯下来，腰背挺直，收紧肚子。一只脚的脚尖朝向轮椅。",why:"靠近能减轻腰背负担；用腿发力，不用腰发力，才不容易闪腰。"},
      {t:"数「1、2、3」一起站",r:["mpWheel","albTransfer","hkSide"],d:"你托住家人的胸背或抓转移带，喊「1、2、3」，到「3」时一起起身。用腿慢慢站直，同时请家人双手撑床帮忙用力。让家人扶轮椅或扶你的身体，不要搂你的脖子。",why:"两个人同时用力最省劲。被搂住脖子容易伤到你，也容易一起摔倒。"},
      {t:"小步转身，慢慢坐下",r:["mpWheel","albTransfer"],d:"让家人用有力的那条腿为轴，小步转向轮椅，直到腿后面碰到椅面。请家人扶住扶手、身体稍向前倾，你屈膝慢慢把他放进座位深处。",why:"小步转身比一下子扭过去更稳；屈膝慢放，避免重重砸在椅子上。"},
      {t:"坐好后放下脚踏板",r:["bjYouan","dfyyTransfer"],d:"让家人身体靠后坐好，放下脚踏板，把双脚放上去。轮椅有安全带的，系好。",why:"坐得靠后、脚有支撑、系好安全带，推行时不容易往前滑。"}],
    mistakes:[
      {t:"拽着家人的胳膊往上拉，或从腋下把人提起来",d:"这样容易让肩膀疼、肩关节半脱位、肌肉拉伤。要托住躯干、抓腰带或转移带，从下往上托住肩膀，不要拉扯。",r:["dfyyTransfer","albTransfer","hkSide"]},
      {t:"弯着腰去抱人",d:"弯腰扭腰最伤腰。要挺直腰背、收紧肚子、屈膝扎稳，用腿发力。",r:["hkLift","hkSide","albTransfer"]},
      {t:"忘了刹轮椅、没收脚踏板",d:"转移前一定要刹好刹车、收起脚踏板。",r:["mpWheel","dfyyTransfer"]},
      {t:"让家人搂着你的脖子",d:"不要让家人抓住或搂住你的脖子，可以扶轮椅或扶你的身体。",r:["mpWheel","albTransfer"]},
      {t:"一个人抱不动也硬撑",d:"需要时找家人或朋友帮忙，由一个人喊口令；也可以用起重器、转移器等辅助器具，量力而为。",r:["hkLift","albTransfer"]}],
    stop:[
      ["120","马上拨打 120","家人在转移中摔倒，可能伤到头、背、脖子或髋部，或者自己起不来：不要硬把人抱起来，让他保持舒服、保暖，打 120。",["nhsFalls"]],
      ["urgent","尽快联系医生或就医","摔倒后有疼痛、受伤或者看起来不舒服：尽快联系医生或就医。",["nhsFalls"]],
      ["doctor","告诉医生","只要摔倒过一次，哪怕看起来没事，也要告诉家人的医生。",["mpWheel","nhsFalls"]],
      ["followup","请医护人员当面教","转移总是很吃力、不知道怎么做才对：请康复师或其他医护人员当面教一次，并在指导下练习。",["hkLift","albTransfer"]]],
    stopNote:"急救电话按中国大陆 120 写（原文为英国 999）；紧急咨询按「尽快联系医生或就医」写（原文为 NHS 111）。",
    srcs:["hkLift","hkSide","dfyyTransfer","bjYouan","mpWheel","albTransfer","nhsFalls"]
  },
  inhaler:{
    lead:"定量气雾剂和干粉吸入器的通用核对步骤，以及哪些地方最容易做反。",
    why:[
      {t:"吸入装置只有用对手法，药才能进到气道和肺里，而不是留在嘴里和嗓子眼。",d:"定量气雾剂配合储雾罐使用，能帮更多药雾送进气道。",r:["mpSpacer","nhlbiMdi"]},
      {t:"两类常见装置的吸气方式正好相反。",d:"按压喷雾的「定量气雾剂」要慢而深地吸；靠吸气带出药粉的「干粉吸入器」要深而有力地吸。",r:["nhlbiMdi","nhlbiDpi"]},
      {t:"慢阻肺和哮喘的日常控制药要按医嘱长期规律用，不能因为不喘了就自己停。",d:"",r:["nhcCopd"]}],
    for:[["医生开了定量气雾剂或干粉吸入器，在家日常吸药或家属旁站核对",["nhlbiMdi","nhlbiDpi"]],["老人手口配合不好，医生建议接储雾罐使用定量气雾剂",["mpSpacer"]]],
    notfor:"正在剧烈喘憋、嘴唇发紫、胸痛或意识不清：不要在家里反复试吸，直接看「何时联系医护」。不同装置装药细节各有差别，首次使用请先对照药盒说明书或请药师当面示范。",notforRefs:["nhcCopd","nhlbiDpi"],
    steps:[
      {t:"先看清是哪一类装置，打开盖子检查吸嘴",r:["nhlbiMdi","nhlbiDpi","mpInhaler"],d:"取下吸嘴盖（用储雾罐的也取下盖子），看看吸嘴里有没有灰尘或异物，同时瞄一眼计数器还有没有余量。",dr:["mpInhaler","nhlbiDpi"]},
      {t:"装药准备：气雾剂摇匀，干粉器按说明上药且别摇晃",r:["nhlbiMdi","nhlbiDpi","mpInhaler"],d:"定量气雾剂用前充分摇匀（新开封或好几天没用的，先按说明书向空中试喷排气），有储雾罐的插紧储雾罐；干粉吸入器按该装置说明书拨动或旋转上好一次药，上好药后保持平稳，不要倾斜或摇晃。",why:"干粉装好后再摇晃或倒置，药粉容易洒掉。",wr:["nhlbiDpi"]},
      {t:"坐直或站直，先把肺里的气慢慢呼空",r:["nhlbiMdi","nhlbiDpi"],d:"挺直上身，把头转开、远离吸嘴，慢慢把气呼到底。千万不要对着吸嘴呼气。",why:"挺直身体能让肺充分张开；对着干粉吸入器呼气，水汽会让药粉受潮结块。",wr:["nhlbiDpi"]},
      {t:"吸嘴放进嘴里，双唇包紧不漏气",r:["mpInhaler","mpSpacer","nhlbiMdi"],d:"把吸嘴放在上下牙齿之间、舌头上方，嘴唇紧紧包住吸嘴。手指不要挡住装置上的进气孔。",dr:["nhlbiDpi"]},
      {t:"按装置类型吸药：气雾剂「慢而深」，干粉器「深而有力」",r:["nhlbiMdi","nhlbiDpi"],d:"定量气雾剂：开始用嘴缓慢深吸气的同时按压一次药罐，持续慢吸 3–5 秒（接储雾罐也是按压一次后慢而深地吸气）。干粉吸入器：不接储雾罐，直接用嘴深而有力地吸满一口气。",why:"干粉吸入器没有喷射动力，要靠足够有力的吸气把药粉带进肺里。",wr:["nhlbiDpi"]},
      {t:"移开吸嘴，闭嘴屏气数到 10，再慢慢呼气",r:["nhlbiMdi","nhlbiDpi","mpSpacer"],d:"把装置从嘴边拿开，闭紧嘴巴屏住呼吸，心里数到 10（屏不了那么久就尽量屏到舒服的限度），再慢慢把气呼出。如果医嘱要求吸第二下，中间等约 1 分钟再重做。",why:"屏气能让药雾或药粉有时间沉降在气道深处。",wr:["mpSpacer"]},
      {t:"盖回盖子；吸了含激素的药，马上用清水漱口并吐掉",r:["nhlbiMdi","nhlbiDpi","mpSpacer"],d:"用清水漱口、仰头漱嗓子，然后把水吐掉，不要咽下去。装置盖好放在阴凉干燥处，别放潮湿的浴室。",why:"漱口吐掉能减少药留在口腔咽喉引起的口腔真菌感染（鹅口疮）等副作用。",wr:["nhlbiMdi","mpSpacer"]}],
    mistakes:[
      {t:"气雾剂吸得太猛，或者干粉器吸得太轻太慢",d:"两类装置刚好相反：气雾剂要慢而深地吸 3–5 秒；干粉吸入器要深而有力地吸。",r:["nhlbiMdi","nhlbiDpi"]},
      {t:"对着干粉吸入器吸嘴呼气，或把干粉器拿去摇晃、接储雾罐",d:"呼气时一定要把装置拿开；干粉吸入器不能摇晃，也不能配储雾罐。",r:["nhlbiDpi"]},
      {t:"吸完马上呼气，没有屏气",d:"吸完闭嘴屏气数到 10 左右，药才来得及留在肺里。",r:["nhlbiMdi","mpSpacer"]},
      {t:"需要吸两下时，连按两下一起吸",d:"一次只按一下；需要再来一下时，间隔约 1 分钟再按步骤重做。",r:["nhlbiMdi","mpSpacer"]},
      {t:"吸完含激素的吸入药不漱口，或者把漱口水咽下去",d:"含糖皮质激素的吸入药用完都要漱口并把水吐掉，不要吞咽。",r:["nhlbiMdi","nhlbiDpi","mpSpacer"]},
      {t:"觉得不喘了就自己停药，或药用完了没提前备",d:"要按医嘱坚持规律用药，不可随意停药；留意剂量计数器，归零前提前配药，归零后丢弃更换。",r:["nhcCopd","nhlbiDpi"]}],
    freq:{lead:"每天吸几次、每次吸几下，严格按医生开的处方和行动计划执行：",leadRefs:["nhlbiMdi","nhcCopd"],items:[
      ["日常控制药按医嘱每天规律使用，不要因为症状好转就自己停药。",["nhcCopd"]],
      ["同一回需要吸一下以上时，两下之间一般间隔约 1 分钟（缓解气喘的药可间隔 1–2 分钟），再从呼气开始重复步骤。",["nhlbiMdi","mpSpacer"]]]},
    stop:[
      ["120","马上拨打 120","喘不上气一直不缓解，或者出现嘴唇发紫、胸痛、昏迷：马上打 120。",["nhcCopd","ala"]],
      ["urgent","尽快联系医生或就医","短时间内咳嗽、咳痰或喘憋明显加重：减少活动，尽快联系医生或去医院，严重的直接打 120。",["nhcCopd"]],
      ["doctor","请医生或药师当面核对","不确定手里的装置怎么上药、总觉得药没吸进去，或者吸药后口腔发白疼痛：带装置去门诊请医生或药师当面核对。",["nhlbiMdi","nhlbiDpi"]],
      ["followup","留意余量、定期复查","常看装置上的计数器，走到「0」之前提前开药补充，定期复查肺功能了解病情变化。",["nhlbiDpi","nhcCopd"]]],
    stopNote:"急救电话按中国大陆 120 写（部分英文来源为美国 911）。",
    srcs:["nhlbiMdi","nhlbiDpi","mpInhaler","mpSpacer","nhcCopd","ala"]
  },
  weight:{
    lead:"怎么每天把体重称准、顺手看水肿，尽早发现身体「攒水」的信号。",
    why:[
      {t:"体重短时间内突然往上涨，往往是身体里多余水分排不出去的最早信号。",d:"心力衰竭（心衰）加重时，体内积水常常比肉眼看出腿肿、明显气喘来得更早。",r:["ahaHf","mpHf"]},
      {t:"只有每天在同样条件下称并记下来，才能分清是真的涨了水，还是刚吃完饭、换了厚衣服。",d:"",r:["ahaHf","mpHf"]},
      {t:"及早发现体重和水肿变化并联系医生，医生才能及时评估调整方案。",d:"平时要按医嘱规律服药，不要自己停药或加减药量。",r:["ahaHf","nhsHf"]}],
    for:[["已确诊心力衰竭（心衰），出院后在家日常监测的家人",["ahaHf","mpHf","nhsHf"]],["有脚踝、小腿或肚子水肿，医生交代每天称体重记录的人",["ahaHf","nhsHf"]]],
    notfor:"人已经在安静休息时严重喘不上气、没法平躺、咳粉红色泡沫痰、胸痛或意识不清：不要先去称体重，直接看「何时联系医护」。",notforRefs:["ahaHf","mpHf","nhsHf"],
    steps:[
      {t:"把同一台体重秤放在坚硬、平整的地面上",r:["ahaHf","mpHf"],d:"放在瓷砖或木地板同一位置，不要放在地毯、软垫或不平的地面上。",why:"地毯和软垫会让读数失准，换不同的秤也会带来误差。",wr:["mpHf"]},
      {t:"每天早上固定时间称：排空小便后、吃早饭和喝水前",r:["ahaHf","mpHf"],d:"起床后先上厕所排尿，还没吃早饭、喝水前去称。",why:"排尿后、进食前的体重最稳定，最能和前一天直接对比。",wr:["ahaHf","mpHf"]},
      {t:"脱鞋，每次穿差不多厚薄的衣服",r:["ahaHf","mpHf"],d:"脱掉鞋子和厚外套，每天尽量穿同样件数、相近重量的居家服上秤。家人站不稳时在旁边护住，等站稳再读数。"},
      {t:"当场记下日期和体重，和基准体重比一比",r:["ahaHf","mpHf"],d:"记在本子上或鹤伴病历夹里，对比前一天和一周前的数字，复诊时带给医生看。",why:"连着记才能一眼看出是一天内猛涨还是一周里慢慢涨。",wr:["mpHf"]},
      {t:"顺手看一眼脚背、脚踝、小腿和肚子有没有肿",r:["ahaHf","mpHf","nhsHf"],d:"看看脚、脚踝、小腿、手指或肚子有没有比平时肿，留意鞋子、袜口、裤腰、戒指是不是突然变紧，袜子松紧带是不是勒出深印子。"},
      {t:"留心日常呼吸和夜里睡觉的变化",r:["ahaHf","mpHf","nhsHf"],d:"记一下平时走路、穿衣是不是比前几天更容易气短，夜里平躺会不会憋醒、是不是得垫高好几个枕头或坐起来才喘得过气。"}],
    mistakes:[
      {t:"今天早饭前称、明天晚饭后称，或者穿着厚外套和鞋子称",d:"时间、吃喝和衣服重量一变，一天就能差出不少，掩盖真实的积水变化。要固定晨起排尿后、早饭前、脱鞋穿相近衣物称。",r:["ahaHf","mpHf"]},
      {t:"把体重秤放在地毯或软垫上",d:"软地面会让读数失真，秤要放在硬而平的地面。",r:["ahaHf","mpHf"]},
      {t:"只用眼睛看一眼秤，不写下来",d:"光靠脑子记很容易混，每天写下来才能算出一天和一周涨了多少。",r:["ahaHf","mpHf"]},
      {t:"看到体重涨了或脚肿了，自己加吃利尿药或停别的药",d:"体重突增是联系医生的信号，不是自己改药的信号；怎么调药和控水控盐，要听医生的。",r:["ahaHf","nhsHf"]},
      {t:"等到腿肿得穿不上鞋、喘不上气才重视",d:"突然涨体重常常出现在明显水肿之前，达到医生交代的上涨幅度就要当天联系医生。",r:["ahaHf","mpHf"]}],
    freq:{lead:"每天称重一次；体重报警线优先按主管医生给你的数字，指南常用参考线如下：",leadRefs:["ahaHf","mpHf"],items:[
      ["每天早上固定时间称 1 次并记录。",["ahaHf","mpHf"]],
      ["如果医生没另定标准，一般 1 天内体重增加超过约 1 公斤（原文 2–3 磅），或 1 周内增加超过约 2 公斤（原文 5 磅），就要及时联系医生。",["mpHf","ahaHf"]]]},
    stop:[
      ["120","马上拨打 120","安静休息时仍严重呼吸困难、大口喘气说不出话，或胸痛胸闷持续不缓解、咳粉红色泡沫痰、嘴唇皮肤发紫发灰、晕倒或突然意识模糊：马上打 120，不要自己开车去医院。",["ahaHf","mpHf","nhsHf"]],
      ["urgent","当天尽快联系医生","1 天内体重涨了超过约 1 公斤（2–3 磅），或 1 周内涨了超过约 2 公斤（5 磅），或达到出院时医生给你定的报警线。",["mpHf","ahaHf"]],
      ["urgent","当天尽快联系医生","脚踝、小腿或肚子水肿明显加重，日常活动比平时更气短，或者平躺就喘、夜里憋醒、需要多垫枕头才能睡。",["ahaHf","mpHf","nhsHf"]],
      ["followup","复诊时带上记录","持续觉得乏力、干咳、肚子胀、吃不下饭，或想确认平时的饮水量和低盐饮食要求：带上每日体重记录去复诊。",["ahaHf","nhsHf"]]],
    stopNote:"急救电话按中国大陆 120 写（原文为美国 911 / 英国 999）；体重参考线原文为 1 天超 2–3 磅（约 1 公斤）、1 周超 5 磅（约 2 公斤），优先以主管医生给你的数字为准。",
    srcs:["ahaHf","mpHf","nhsHf"]
  },
  wound:{
    lead:"术后闭合切口和日常包扎伤口在家怎么护、看什么，出现哪些变化要联系医护。",
    why:[
      {t:"伤口上的敷料能挡住细菌、吸收渗液，还能防止缝线或皮钉勾到衣服。",d:"",r:["mpWound"]},
      {t:"每天留心红肿、温度、疼痛和渗液变化，能在伤口感染刚露头时就发现。",d:"",r:["mpWound","hkWound","nhsCuts"]},
      {t:"压疮（褥疮）、下肢溃疡等超过 4 周还不愈合的慢性伤口，需要医护人员评估并指导选用无菌敷料，不能只在家自行包扎。",d:"",r:["hkWound"]}],
    for:[["手术后已缝合或闭合切口，出院在家恢复期的日常观察与护理",["mpWound"]],["日常擦伤、割伤包扎后，或长者居家伤口的感染迹象观察",["nhsCuts","hkWound"]]],
    notfor:"伤口正在大量出血止不住，或有异物扎在伤口里：不要自己拔异物，直接看「何时联系医护」；开放性大伤口、深度烧烫伤或压疮清创换药，请由医护人员处理并当面教步骤。",notforRefs:["nhsCuts","hkWound"],
    steps:[
      {t:"碰敷料或伤口前，先用肥皂和温水彻底洗手",r:["mpWound","nhsCuts"],d:"把手指缝和指甲缝都洗净，用干净毛巾擦干。帮家人换敷料，或者伤口已经有感染迹象时，戴上干净的一次性手套。",why:"手上的细菌最容易顺着换药带进伤口。",wr:["mpWound"]},
      {t:"按出院医嘱保留原敷料，保持清洁干燥",r:["mpWound"],d:"医生让留几天就留几天；只有敷料被水弄湿、松脱，或者被血和渗液浸透时，才需要提前更换。"},
      {t:"每天观察伤口周围的「红、肿、热、痛、渗液」",r:["mpWound","hkWound","nhsCuts"],d:"看看切口边缘有没有裂开、变深、变黑或干枯；周围发红和肿胀有没有往外扩大；摸一摸周围皮肤是不是发烫；问问家人疼痛是在减轻还是越来越重；看渗液有没有变多、变稠、变黄绿或发出异味。"},
      {t:"需要换新敷料时，手不要碰到敷料贴伤口的那一面",r:["mpWound","hkWound"],d:"如果医护交代需要清洗，常用医用生理盐水按无菌要求清洁（浓度接近人体体液、不刺激伤口组织）。捏住新敷料边角盖在伤口上，四边贴牢胶布。",why:"敷料内侧是无菌面，手指碰到就会污染。",wr:["mpWound"]},
      {t:"洗澡先问准时间，能淋浴也别泡澡、别搓伤口",r:["mpWound"],d:"什么时候能沾水听外科医生的。获准洗澡时选淋浴、别泡盆浴，不要揉搓切口，也不要去扯缝线或皮钉；洗完用干净毛巾轻轻拍干周围皮肤，晾干后再贴新敷料。",why:"泡水容易让切口重新裂开或引起感染。",wr:["mpWound"]},
      {t:"换下的旧敷料封进袋子丢弃，再次洗净双手",r:["mpWound"],d:"把旧敷料、胶布放进塑料袋扎紧口再丢弃，摘下手套后再用肥皂和清水洗一次手。"}],
    mistakes:[
      {t:"自己往切口上涂抗生素药膏、护肤霜、爽身粉或偏方",d:"除非外科医生明确交代，否则不要在闭合切口上涂任何药膏、乳液或粉末。",r:["mpWound"]},
      {t:"觉得多打开透透气、天天用力擦洗好得更顺",d:"没弄湿、没渗透时按医嘱天数保留敷料，不要频繁揭开或擦洗伤口。",r:["mpWound"]},
      {t:"切口还没长好就泡澡，或用手去抠血痂、拽缝线",d:"泡水容易让伤口裂开或感染；缝线、皮钉由医护人员按期处理，不要自己拉扯。",r:["mpWound"]},
      {t:"手指直接摸到新纱布或敷料的内侧面",d:"换药前先洗手，拿敷料只捏边角，保持贴伤口那一面干净无菌。",r:["mpWound"]},
      {t:"伤口扎进玻璃、金属等异物时自己硬拔",d:"不要自己拔出嵌在伤口里的异物，应压住异物两侧边缘止血并尽快就医。",r:["nhsCuts"]}],
    freq:{lead:"换药间隔严格按出院小结或外科医生的交代执行：",leadRefs:["mpWound","hkWound"],items:[
      ["每天观察 1 次敷料外观、周围皮肤和体温感受；敷料一旦被水打湿或被渗液浸透，随时更换。",["mpWound"]],
      ["何时淋浴、何时拆线或取皮钉，按手术医生指定日期复诊处理。",["mpWound"]]]},
    stop:[
      ["120","马上拨打 120","伤口大量出血，用干净纱布或布巾直接按压、抬高受伤部位后仍然止不住血：持续按住别松手，马上打 120。",["nhsCuts"]],
      ["urgent","尽快联系医生或就医","切口周围发红或肿胀范围扩大、摸着发烫、疼痛越来越重，或者渗液变多、变成黄绿色浓稠脓液、有臭味。",["mpWound","hkWound","nhsCuts"]],
      ["urgent","尽快联系医生或就医","伴有发烧、发冷打颤、恶心或全身不舒服，或者原本闭合的切口裂开、变深、边缘发黑。",["mpWound","hkWound","nhsCuts"]],
      ["followup","长期不愈合要去复诊","伤口超过 4 周仍未愈合（如卧床老人的压疮、腿脚慢性溃疡），尽早就医或请专科护士评估。",["hkWound"]]],
    stopNote:"急救电话按中国大陆 120 写（原文为英国 999）；紧急医疗咨询按「尽快联系医生或就医」写（原文为 NHS 111）。",
    srcs:["mpWound","hkWound","nhsCuts"]
  },
  insulin_pen:{
    lead:"胰岛素笔怎么装针排气、轮换部位、停够时间，减少皮下硬结和血糖波动。",
    why:[
      {t:"规范注射才能把胰岛素稳稳送到皮下脂肪层，避免扎进肌肉层。",d:"一旦误扎进肌肉，吸收会突然加快、峰值提前，容易引起血糖大幅波动和不明原因的低血糖。",r:["cmaIns2016"]},
      {t:"总扎同一个地方、重复用旧针头，皮下会长出橡皮样的硬结（皮下脂肪增生）。",d:"再往硬结上打针，药液吸收变慢又不稳定；每次换新针头、做好部位轮换就能有效预防。",r:["cmaIns2016"]},
      {t:"胰岛素笔和笔芯必须「一人一笔」，就算换了新针头也绝不能共用。",d:"注射时微量血液和人体组织可能回流进笔芯，共用会传播传染病。",r:["cmaIns2016"]}],
    for:[["医生开了胰岛素注射笔，在家自行皮下注射或由家属协助注射的糖尿病患者",["cmaIns2016"]]],
    notfor:"人已经出现心慌、手抖、出冷汗等低血糖表现，或者叫不醒、意识不清、抽搐：此时不要再打胰岛素，直接看「何时联系医护」或「识别低血糖」卡；儿童在强烈哭闹挣扎时先别强行进针，等情绪稳定后再打，以免断针。",notforRefs:["cmaIns2016","cmahypo","cctv"],
    steps:[
      {t:"洗手，核对药液性状与温度",r:["cmaIns2016"],d:"洗净双手；核对笔芯在有效期内、无破损漏液、无结晶体或变色。刚从冰箱冷藏室（2–8 ℃）取出的新笔芯，提前约 30 分钟放到室温回暖；已开封正在用的笔芯通常室温（不超过 30 ℃）避光保存，开启后 1 个月内用完（具体按说明书）。",why:"冰凉的胰岛素打进皮下容易诱发疼痛和不适。",wr:["cmaIns2016"]},
      {t:"若是云雾状胰岛素，先平滚再翻转混匀",r:["cmaIns2016"],d:"清亮透明的药液不用摇；如果是云雾状的混悬型或预混胰岛素，把笔平放在手心水平滚动 10 次，再双手夹住上下缓慢翻转 10 次，直到变成均匀的云雾状白色，不要剧烈猛摇。",why:"混匀不充分会让浓度忽高忽低，剧烈摇晃则会产生气泡影响准度。",wr:["cmaIns2016"]},
      {t:"垂直拧紧一次性新针头，针尖朝上排气",r:["cmaIns2016"],d:"每次都换用全新的配套无菌针头，对准笔身轴线垂直拧紧，摘下外针帽和内针帽（留好外针帽）。按说明书拨到排气刻度，针尖向上直立，手指轻弹笔芯架让气泡升到顶部，按下注射键直到针尖挂出至少一滴药液，再旋到医生处方规定的刻度。",why:"排气能消除针头死腔和笔芯气泡，保证药路通畅。",wr:["cmaIns2016"]},
      {t:"选好并轮换部位，先看再摸避开硬结",r:["cmaIns2016"],d:"常用皮下部位是腹部（避开肚脐周围 2.5 厘米以内）、大腿前外侧上段、上臂外侧中段和臀部外上侧。每次打针前看一看、摸一摸，避开硬结、凹陷、红肿、淤青、水肿或破损处；相邻两针至少间隔 1 厘米（约一横指宽），按顺时针规律轮换。"},
      {t:"露出皮肤清洁消毒，等酒精干透再进针",r:["cmaIns2016"],d:"不要隔着衣服打针。用酒精棉片消毒皮肤后，等酒精彻底挥发干透再刺入。",why:"隔衣注射看不清皮肤也没法捏皮；酒精没干就扎，会把酒精带进皮下引起疼痛。",wr:["cmaIns2016"]},
      {t:"按针头长度进针，推到底后停留至少 10 秒",r:["cmaIns2016"],d:"用 4 毫米短针头时，大多数成年人无需捏皮、垂直（90 度）平滑果断刺入即可（幼童、极瘦的人或用 6 毫米及以上较长针头时，用拇指、食指和中指轻捏起皮肤或呈 45 度角进针，别用整只手抓起肌肉）。针头完全刺入后沿笔身轴心把拇指按钮推到底，保持按压在皮下停留至少 10 秒，再顺原角度拔针，有捏皮的拔针后再松手。",why:"笔用针头很细，停够至少 10 秒才能让药液全部注入体内、防止漏液。",wr:["cmaIns2016"]},
      {t:"立即卸下针头，放进防刺穿锐器盒",r:["cmaIns2016","jcdm"],d:"打完马上卸下针头丢进专用锐器盒（没有专用盒时，自打针者套回外针帽放进加盖硬壳塑料瓶等刺不穿的容器，绝不直接扔进公共垃圾桶；家属协助他人注射时不要徒手回套针帽，优先用安全型针头直接弃入锐器盒），不要把针头留在笔上。",why:"针头留在笔上会让空气或污染物进入笔芯、药液外溢影响准度；乱丢针头容易刺伤家人和保洁员。",wr:["cmaIns2016"]}],
    mistakes:[
      {t:"一根针头反复用好几次，或者打完不卸针头留在笔上",d:"笔用针头仅限一次性使用。重复用会让针尖变钝更疼、药液结晶堵针，还显著增加皮下脂肪增生风险；留在笔上会漏液进气。",r:["cmaIns2016"]},
      {t:"总往同一块皮肤扎，甚至专挑「不太疼」的硬结处打",d:"皮下硬结处虽然痛感轻，但吸收慢、血糖波动大。发现硬结要立即停扎该处，改在健康皮肤轮换注射。",r:["cmaIns2016"]},
      {t:"推下按钮马上拔针，皮下停留不到 10 秒",d:"过早拔针容易造成针尖和皮肤漏液，药量打不足；剂量较大时停留还要超过 10 秒。",r:["cmaIns2016"]},
      {t:"隔着衣服打针，或用整只手一把抓起肌肉捏皮",d:"不可隔衣注射；需要捏皮时只用拇指、食指、中指轻提皮肤，整把抓会把肌肉一起揪起导致肌内注射。",r:["cmaIns2016"]},
      {t:"把未开封胰岛素放进冷冻室结冰，或把使用中的笔来回放冰箱冰着直接打",d:"低于 0 ℃ 冷冻会破坏胰岛素活性；未开封放 2–8 ℃ 冷藏，开封后一般室温保存即可（室温超 30 ℃ 放冰箱时，打针前先手心滚暖）。",r:["cmaIns2016"]},
      {t:"自己随意改刻度、停药，或和家人共用同一支胰岛素笔",d:"一人一笔绝不共用；血糖波动或发生过低血糖要找医生调方案，不要自己改药。",r:["cmaIns2016","medline","cctv"]}],
    freq:{lead:"每天打几次、什么时间打、选哪个部位，严格按医生的处方方案执行：",leadRefs:["cmaIns2016","jcdm"],items:[
      ["一次性注射笔用针头每次注射都换新的，用完立即卸下妥善废弃。",["cmaIns2016"]],
      ["部位轮换可遵循「每天同一时间打同一大区，每周按顺时针换下一区，相邻两针至少隔 1 厘米」，避免 1 个月内重复扎同一点；至少每年请医护人员检查 1 次注射部位。",["cmaIns2016"]]]},
    stop:[
      ["120","马上拨打 120","注射后如果出现叫不醒、意识不清、抽搐或昏迷（严重低血糖）：不要喂水喂糖，让家人侧躺，马上打 120。",["cctv","cmahypo","medline"]],
      ["urgent","尽快去医院","测得血糖很高（≥16.7 mmol/L），同时恶心呕吐、肚子痛、呼吸有烂苹果味或精神很差。",["jcdm"]],
      ["doctor","尽快联系医生","频繁出现不明原因的低血糖或血糖大幅波动，或摸到注射部位有橡皮样硬结、凹陷、红肿发炎、频繁出血淤青：请医生检查部位并评估方案（从硬结换回正常皮肤注射常需医生下调方案，切勿自行乱改）。",["cmaIns2016"]],
      ["followup","每次复诊请医护核对","家属协助打针若不慎被用过的针头刺伤应及时就医处理；日常复诊（至少每年 1 次）请医护人员观察注射手法、触诊检查注射部位。",["cmaIns2016"]]],
    stopNote:"本卡只核对注射笔通用操作，不涉及任何药名与剂量；具体刻度、时间点与针头规格一律遵医嘱。",
    srcs:["cmaIns2016","jcdm","cmahypo","medline","cctv"]
  },
  eyedrops:{
    lead:"怎么把眼药水稳稳滴进下眼皮「小口袋」、按住内眼角防流走，同时不碰脏瓶嘴。",
    why:[
      {t:"滴眼方法对了，药水才能留在眼睛表面充分吸收，不会一眨眼就流到脸上。",d:"",r:["aaoDrops","mpDrops"]},
      {t:"滴完闭眼并轻按内眼角（泪囊处），能挡住药水顺泪道流进鼻腔和喉咙。",d:"这样既能让药水在眼里多留一会儿，也能减少药物吸收入全身带来的副作用。",r:["neiDrops","aaoDrops","mpDrops"]},
      {t:"滴嘴一旦碰到眼皮、睫毛或手指，细菌就会进到药瓶里，下次再滴容易引起眼部感染。",d:"",r:["aaoDrops","neiDrops","mpDrops"]}],
    for:[["医生开了处方滴眼液（如青光眼、白内障术后、干眼或眼表炎症），在家自己滴或帮家人滴眼药水",["aaoDrops","neiDrops"]]],
    notfor:"眼睛刚受外伤、溅入化学品、有玻璃或金属异物扎进眼里，或突然看不见、剧烈眼痛伴头痛呕吐：不要自己找眼药水乱滴，直接看「何时联系医护」；未经医生开的旧眼药水或开封超过 4 周的普通眼药水不要使用。",notforRefs:["nhsEyePain","aaoDrops"],
    steps:[
      {t:"用肥皂和流动清水洗净双手，核对药瓶",r:["aaoDrops","mpDrops","neiDrops"],d:"滴药前彻底洗手并擦干；核对药瓶标签，检查滴嘴有没有破损裂口。说明书要求摇匀的药水，用前先摇匀。",dr:["aaoDrops","mpDrops"]},
      {t:"摘下隐形眼镜，拧开瓶盖别碰滴嘴",r:["aaoDrops","mpDrops","neiDrops"],d:"戴隐形眼镜的人先取下镜片（除非眼科医生或说明书明确说可以戴着滴）。拧开瓶盖放稳，手指不要碰到瓶口滴嘴。",why:"手指碰到滴嘴会把细菌带进药液里。",wr:["aaoDrops"]},
      {t:"仰头往上看，轻轻拉下下眼皮做成「小口袋」",r:["neiDrops","aaoDrops","mpDrops"],d:"坐稳或平躺，头向后仰，眼睛看向天花板固定一点；用一只手的食指轻轻把下眼皮往下拉，让下眼皮和眼球之间露出一个小口袋。"},
      {t:"瓶嘴悬空对准「小口袋」，滴入医嘱规定的滴数",r:["mpDrops","neiDrops","aaoDrops"],d:"另一只手倒拿药瓶，其余手指可轻靠在脸颊或鼻梁上稳住手，让滴嘴悬在「小口袋」上方，不要碰到眼球、眼皮或睫毛，轻轻挤出医嘱规定的滴数落进口袋里。"},
      {t:"松开下眼皮，轻轻闭眼并按住内眼角至少 1 分钟",r:["neiDrops","aaoDrops","mpDrops"],d:"松开拉下眼皮的手，轻轻闭上眼睛（可低头朝地面看，闭眼 1–3 分钟），不要使劲挤眼或频繁眨眼；同时用一根手指轻轻按住靠近鼻梁的内眼角。",why:"使劲眨眼会把药水挤出去；按住内眼角能防止药水顺泪小管流进鼻子。",wr:["aaoDrops","neiDrops"]},
      {t:"纸巾轻沾余液，拧紧瓶盖再次洗手",r:["mpDrops","aaoDrops"],d:"用干净纸巾轻轻沾掉流到眼周脸上的多余药液；直接盖回并拧紧瓶盖（不要用纸巾擦或用水冲滴嘴），最后用肥皂和清水洗净双手。",dr:["mpDrops"]},
      {t:"需要用两种以上眼药水时，中间至少间隔 5 分钟",r:["neiDrops","mpDrops","aaoDrops"],d:"如果同一只眼要滴不止一种眼药水，两种之间至少等 5 分钟（部分指南写 3–5 分钟，等够 5 分钟更稳妥），避免后滴的把先滴的冲走。"}],
    mistakes:[
      {t:"滴嘴贴着眼球、睫毛或眼皮滴，或者用纸巾去擦滴嘴",d:"滴嘴碰到任何表面都会污染整瓶药水；用完直接拧紧瓶盖，不要擦拭或冲洗滴嘴。",r:["aaoDrops","neiDrops","mpDrops"]},
      {t:"滴完马上用力挤眼、眨眼或揉眼睛",d:"用力闭眼和眨眼会把刚滴进去的药水挤出眼外，应轻轻闭眼并轻按内眼角。",r:["aaoDrops","mpDrops"]},
      {t:"几种眼药水连着滴，中间不留间隔",d:"连着滴会把前一种药水冲掉，两种之间至少等 5 分钟。",r:["neiDrops","mpDrops","aaoDrops"]},
      {t:"翻出家里以前剩下的旧眼药水或别人的眼药水直接用",d:"普通多剂量眼药水开封超过 4 周可能不再无菌，乱用旧药或未开处方的眼药水可能引起严重感染。",r:["nhsEyePain"]},
      {t:"觉得眼睛不红不痛了，就自己把青光眼或术后眼药水停掉",d:"按眼科医生和药盒标签规定的时间与疗程点药，不要擅自停药或改次数。",r:["aaoDrops","nhsEyePain"]}],
    freq:{lead:"每天滴几次、滴哪只眼，严格按眼科医生的处方和药盒标签执行：",leadRefs:["aaoDrops","nhsEyePain"],items:[
      ["同一只眼要用两种及以上眼药水，或同一只眼需要滴第二下时，中间至少间隔 5 分钟。",["neiDrops","mpDrops"]],
      ["普通多剂量滴眼液开封超过 4 周一般就不再使用（具体以说明书为准），建议在瓶身写上开封日期。",["nhsEyePain"]]]},
    stop:[
      ["120","马上拨打 120 或由家人送急诊","突然看不见或视力明显变差、眼痛剧烈到夜里睡不着、眼红同时伴剧烈头痛和恶心呕吐，或眼部手术治疗后 4 周内出现剧痛或视力下降：立即去急诊或打 120，不要自己开车。",["nhsEyePain"]],
      ["120","马上拨打 120 或急诊","化学品溅进眼睛，或玻璃、金属等尖锐异物扎进眼睛：不要揉压眼睛，立即就医或打 120。",["nhsEyePain"]],
      ["urgent","尽快看眼科医生","滴药后眼睛持续疼痛、明显怕光、整只眼通红加重，或戴隐形眼镜的人同时出现眼痛和视力模糊。",["nhsEyePain","aaoDrops"]],
      ["followup","复诊时告诉医生","手抖、看不清瓶嘴、总滴不进眼睛：不要硬撑漏滴，复诊时告诉眼科医生，询问辅助点眼器或其他办法。",["neiDrops","aaoDrops"]]],
    stopNote:"急救电话按中国大陆 120 写（原文为英国 999）；紧急医疗咨询按「尽快看眼科医生」写（原文为英国 NHS 111）。",
    srcs:["neiDrops","aaoDrops","mpDrops","nhsEyePain"]
  }
};

/* ================= 常见病种（可多选，可搜索，可自己加） ================= */
const GROUPS={
  cv:["心脑血管","steel"],
  en:["内分泌与代谢","amber"],
  re:["呼吸","teal"],
  di:["消化与肝胆","plum"],
  ki:["肾脏·泌尿·妇科","indigo"],
  mu:["骨骼与关节","amber"],
  ne:["神经与精神","indigo"],
  ot:["皮肤·感官·其他","teal"]
};
const C=(id,name,g,alias,cards)=>({id,name,g,alias,cards});
/* 注意：条件 id "hypo" 为甲状腺功能减退，与照护卡 key "hypo"（识别低血糖）分属两个命名空间，切勿映射为低血糖卡 */
const CONDITIONS=[
  C("htn","高血压","cv","血压高 高压",["bp"]),
  C("chd","冠心病","cv","心绞痛 心梗 冠脉 支架 缺血性心脏病",["bp"]),
  C("hf","心力衰竭","cv","心衰 心功能不全 水肿",["weight","bp"]),
  C("af","心房颤动","cv","房颤 房扑 心律不齐",["bp"]),
  C("stroke","脑卒中（中风）","cv","中风 脑梗 脑出血 偏瘫",["bp","fall","transfer"]),
  C("lipid","血脂异常","cv","高血脂 高脂血症 胆固醇高",[]),
  C("t2d","2 型糖尿病","en","糖尿病 血糖高",["glucose","hypo","insulin_pen"]),
  C("t1d","1 型糖尿病","en","糖尿病 胰岛素",["glucose","hypo","insulin_pen"]),
  C("gout","痛风 / 高尿酸","en","尿酸高 高尿酸血症",[]),
  C("hypo","甲状腺功能减退","en","甲减 桥本",[]),
  C("hyper","甲状腺功能亢进","en","甲亢",[]),
  C("osteo","骨质疏松","en","骨松 缺钙 脆性骨折",["fall"]),
  C("obes","肥胖","en","超重 减重",["weight"]),
  C("copd","慢阻肺","re","COPD 慢支 肺气肿 慢性阻塞性肺疾病",["inhaler","breathing"]),
  C("asthma","哮喘","re","支气管哮喘 喘息",["inhaler","breathing"]),
  C("pneu","肺炎恢复期","re","肺部感染 下呼吸道感染",[]),
  C("flu","流感 / 新冠居家","re","感冒 发烧 新冠 上呼吸道感染",[]),
  C("gerd","胃食管反流","di","反酸 烧心",[]),
  C("gastritis","慢性胃炎 / 胃溃疡","di","胃病 胃疼 消化性溃疡 十二指肠炎 幽门螺杆菌",[]),
  C("nafld","脂肪肝","di","代谢相关脂肪性肝病 慢性肝病",[]),
  C("hbv","慢性乙肝","di","乙肝 丙肝 病毒性肝炎 肝炎",[]),
  C("constip","便秘","di","排便困难",[]),
  C("ckd","慢性肾脏病","ki","肾病 肾功能不全 尿毒症 透析",["bp","weight"]),
  C("bph","前列腺增生","ki","前列腺 尿频 起夜",["fall"]),
  C("uti","尿路感染","ki","尿频 尿急 尿痛 膀胱炎",[]),
  C("oa","骨关节炎","mu","膝关节 关节疼 退行性",["fall","transfer"]),
  C("back","腰椎间盘突出 / 腰痛","mu","腰疼 腰突 坐骨神经 颈痛",[]),
  C("ra","类风湿关节炎","mu","类风湿 关节肿痛",[]),
  C("fx","骨折术后","mu","骨折 手术 康复",["wound","fall","transfer"]),
  C("dementia","认知障碍 / 阿尔茨海默病","ne","老年痴呆 失智 记忆力",["fall","dementia"]),
  C("pd","帕金森病","ne","手抖 步态不稳",["fall","transfer"]),
  C("dep","抑郁","ne","抑郁症 情绪低落",[]),
  C("anx","焦虑","ne","焦虑症 紧张",[]),
  C("insom","失眠","ne","睡不着 睡眠",[]),
  C("epi","癫痫","ne","羊癫疯 抽搐发作",[]),
  C("mig","偏头痛","ne","头痛 头痛障碍",[]),
  C("cancer","肿瘤治疗期居家","ot","癌症 恶性肿瘤 化疗 放疗",["weight"]),
  C("surg","手术后居家恢复","ot","术后 伤口 拆线 烧伤换药",["wound","transfer"]),
  C("bedsore","长期卧床 / 压疮预防","ot","卧床 褥疮 压疮 压力性损伤",["wound","transfer"]),
  C("frail","老人易跌倒","ot","跌倒 摔倒 衰弱",["fall","transfer"]),
  C("anemia","贫血","ot","缺铁性贫血 乏力",[]),
  C("eczema","湿疹 / 皮炎","ot","皮肤痒 特应性皮炎 接触性皮炎 脂溢性皮炎",[]),
  C("psor","银屑病","ot","牛皮癣 皮损",[]),
  C("cata","白内障术后","ot","眼睛 手术 视力损害",["eyedrops","fall"]),
  C("glauc","青光眼","ot","眼压 视野 滴眼药水",["eyedrops","fall"]),
  C("rhin","过敏性鼻炎","ot","鼻炎 变应性鼻炎 打喷嚏",[]),
  C("preg","孕期","ki","怀孕 产检 妊娠期",[]),
  C("newborn","新生儿照护","ot","宝宝 婴儿 幼儿",[])
];
const condById=id=>CONDITIONS.find(c=>c.id===id)||null;

/* ================= 疾病照护枢纽图谱（依据 GBD 与 WHO 权威清单核定，仅含已过筛 Tier 1 与 Tier 2 共 86 项） =================
   边界说明：待专科专家边界裁决的 2 项（70 疥疮、88 运动神经元病）与窄范围待复核的 Tier 3 共 11 项（89–99）暂不列入主动推荐图谱；
   不宣称任何疾病覆盖百分比，全球枢纽不写单一国家急救电话号码，所有临床细则以执业医护个体化医嘱为准。 */
const AGE_BANDS=[{id:"all",label:"全部年龄"},{id:"0-5",label:"0–5岁"},{id:"6-17",label:"6–17岁"},{id:"18-44",label:"18–44岁"},{id:"45-59",label:"45–59岁"},{id:"60+",label:"60+岁"}];
const HUB_META={activeCount:86,tier1Count:20,tier2Count:66,pendingBoundaryCount:2,pendingTier3Count:11,note:"收录 86 个已确诊常见健康问题的居家照护枢纽（Tier 1 共 20 项、Tier 2 共 66 项）；另有 2 项边界条目与 11 项窄范围条目待专科复核后开放。罕见病、急危重症与需专业医护操作的内容不在收录范围。"};
const DISEASE_HUBS=[
  {"id":"01_heart","no":1,"name":"缺血性心脏病（冠心病）","tier":1,"g":"cv","ages":["45-59","60+"],"sexCat":"通用","sexNote":"男女均可患病，症状表现因人而异；中青年亦可能早发。","artSlug":"01_heart","callouts":["康复期照护每天记下来","急性胸痛拨打当地急救电话","按医嘱用药不自行停药","定期复诊","症状变化及时联系医护"],"scopeNote":"仅限已确诊冠心病或心梗出院后的康复期日常记录与复诊准备；突发急性胸痛、胸闷气短请立即拨打所在地急救电话，不做症状鉴别。","alias":"冠心病 心绞痛 心梗 心肌梗死 支架 冠脉搭桥 胸闷","subCards":["bp","medlog","symptom","followup"]},
  {"id":"02_stroke","no":2,"name":"脑卒中（居家康复期）","tier":1,"g":"cv","ages":["45-59","60+"],"sexCat":"通用","sexNote":"男女均可患病，突发症状识别不作性别绝对化区分。","artSlug":"02_stroke","callouts":["康复期照护每天记下来","突发症状拨打当地急救电话","按医嘱用药不自行停药","定期复诊","症状变化及时联系医护"],"scopeNote":"仅限脑卒中出院后的居家康复记录、防跌倒与安全转移；急性期不适用，再次出现口角歪斜、言语不清或肢体无力请立即拨打所在地急救电话。","alias":"中风 脑梗 脑出血 偏瘫 半身不遂 卒中康复","subCards":["bp","fall","transfer","medlog","symptom","followup"]},
  {"id":"03_lrti","no":3,"name":"下呼吸道感染（康复期观察）","tier":1,"g":"re","ages":["0-5","60+"],"sexCat":"通用","sexNote":"男女通用；婴幼儿与老年人康复期需重点观察呼吸与精神状态。","artSlug":"03_lrti","callouts":["康复期观察每天记下来","定期复诊","急性加重拨打当地急救电话","按医嘱用药不自行停药","症状变化及时联系医护"],"scopeNote":"仅覆盖已确诊后的居家康复观察、体温与症状记录及复诊提醒；呼吸急促、嗜睡或急性加重请立即拨打所在地急救电话。","alias":"肺部感染 支气管炎 肺炎恢复期 咳嗽发烧","subCards":["symptom","medlog","followup"]},
  {"id":"04_diabetes","no":4,"name":"糖尿病","tier":1,"g":"en","ages":["6-17","18-44","45-59","60+"],"sexCat":"通用","sexNote":"男女通用；2 型多见于成年与中老年，1 型与儿童青少年照护需按专科医嘱执行。","artSlug":"04_diabetes","callouts":["血糖数值按时记下来","胰岛素笔操作按医嘱核对","每天观察双脚皮肤","按医嘱用药不自行停药","定期复诊"],"scopeNote":"覆盖指尖血糖记录、胰岛素笔操作核对、低血糖识别与每日双足皮肤观察；不设定通用血糖目标值，不自行增减药物。","alias":"2型糖尿病 1型糖尿病 血糖高 控糖 胰岛素 糖足","subCards":["glucose","hypo","insulin_pen","wound","medlog","followup"]},
  {"id":"05_copd","no":5,"name":"慢阻肺病","tier":1,"g":"re","ages":["45-59","60+"],"sexCat":"通用","sexNote":"男女均可患病，均需长期规范管理。","artSlug":"05_copd","callouts":["吸入操作按医嘱核对","症状日记每天记下来","定期复诊","急性加重拨打当地急救电话","按医嘱用药不自行停药"],"scopeNote":"覆盖稳定期吸入装置操作核对、呼吸练习、症状日记与复诊提醒；喘憋短时间明显加重或嘴唇发紫请立即拨打所在地急救电话。","alias":"慢性阻塞性肺疾病 COPD 慢支 肺气肿 喘憋","subCards":["inhaler","breathing","medlog","symptom","followup"]},
  {"id":"06_fall","no":6,"name":"跌倒（预防与伤后居家）","tier":1,"g":"mu","ages":["0-5","6-17","60+"],"sexCat":"通用","sexNote":"男女通用；60 岁及以上老人居家跌倒风险高，婴幼儿与儿童亦需居家防护。","artSlug":"06_fall","callouts":["家里环境防跌倒改造","助行器具每天检查","摔伤后观察记下来","摔倒受伤拨打当地急救电话","定期复诊"],"scopeNote":"覆盖居家环境防跌倒改造、助行器具日常检查、安全转移与伤后观察记录；跌倒后意识不清、剧痛变形或疑似伤及头颈腰背请勿硬扶，立即拨打所在地急救电话。","alias":"摔倒 防摔 老人跌倒 骨折预防 助行器 扶手","subCards":["fall","transfer","wound","symptom","followup"]},
  {"id":"07_backpain","no":7,"name":"腰痛","tier":1,"g":"mu","ages":["18-44","45-59","60+"],"sexCat":"通用","sexNote":"男女通用，成年至老年均常见。","artSlug":"07_backpain","callouts":["活动与休息每天记下来","疼痛日记坚持记下来","定期复诊","危险信号拨打当地急救电话","按医嘱用药不自行停药"],"scopeNote":"覆盖日常活动与休息记录、疼痛日记与复诊准备；不做病因诊断，若伴下肢麻木无力、大小便异常或发热等危险信号请立即拨打所在地急救电话或急诊就医。","alias":"腰疼 腰肌劳损 腰椎间盘突出 腰突 坐骨神经痛","subCards":["symptom","medlog","followup"]},
  {"id":"08_diarrhea","no":8,"name":"腹泻病（居家观察）","tier":1,"g":"di","ages":["0-5","6-17","18-44","45-59","60+"],"sexCat":"通用","sexNote":"男女通用；5 岁以下婴幼儿与老年人尤其需警惕脱水信号。","artSlug":"08_diarrhea","callouts":["补液情况记下来","排便情况记下来","定期复诊","脱水信号拨打当地急救电话","按医嘱用药不自行停药"],"scopeNote":"仅覆盖补液与排便情况记录及复诊提醒；出现精神萎靡、尿量明显减少、口干无泪或持续呕吐等脱水信号请立即拨打所在地急救电话。","alias":"拉肚子 水样便 急性肠炎 脱水 补液","subCards":["symptom","medlog","followup"]},
  {"id":"09_depression","no":9,"name":"抑郁障碍","tier":1,"g":"ne","ages":["6-17","18-44","45-59","60+"],"sexCat":"通用","sexNote":"各性别均可能受累，均需不带评判的陪伴与专业支持。","artSlug":"09_depression","callouts":["耐心陪伴不评判","每天作息记下来","记住当地求助渠道","自伤意念立即求助","定期复诊"],"scopeNote":"窄范围照护：仅提供家属耐心陪伴原则、每日作息记录与复诊准备，不替代心理治疗或药物方案；一旦出现自伤意念或言行，请立即联系所在地急救电话或精神科急诊。","alias":"抑郁症 情绪低落 心理陪伴 失眠早醒","subCards":["symptom","medlog","followup"]},
  {"id":"10_anxiety","no":10,"name":"焦虑障碍","tier":1,"g":"ne","ages":["6-17","18-44","45-59","60+"],"sexCat":"通用","sexNote":"各性别均可能受累，避免性别刻板印象，注重倾听与规律作息。","artSlug":"10_anxiety","callouts":["耐心陪伴不评判","每天作息记下来","记住当地求助渠道","症状加重及时联系医护","定期复诊"],"scopeNote":"窄范围照护：仅提供家属陪伴沟通、作息与不适记录及复诊提醒，不提供心理治疗技术或自测评分；症状明显加重请及时联系医护或当地求助渠道。","alias":"焦虑症 惊恐 心慌紧张 坐立不安","subCards":["symptom","medlog","followup"]},
  {"id":"11_hearing","no":11,"name":"听力损失","tier":1,"g":"ot","ages":["60+"],"sexCat":"通用","sexNote":"男女通用；60 岁及以上年龄相关听力下降常见，其他年龄段有症状同样需专科评估。","artSlug":"11_hearing","callouts":["助听器具每天检查","面对面慢慢说话","耳鸣情况记下来","复诊记录按时记下来","听力变化及时联系医护"],"scopeNote":"覆盖助听器具日常检查、面对面慢速沟通、耳鸣伴随记录与复诊提醒；不解读听力检查报告，突发听力骤降请尽快就医。","alias":"耳背 老年性耳聋 助听器 耳鸣 听不清","subCards":["symptom","followup"]},
  {"id":"12_malaria","no":12,"name":"疟疾","tier":1,"g":"ot","ages":["0-5","6-17","18-44","45-59","60+"],"sexCat":"通用","sexNote":"男女通用；流行区 5 岁以下儿童重症风险高，需重点观察体温与精神状态。","artSlug":"12_malaria","callouts":["服药操作按医嘱核对","每天体温记下来","防蚊措施每天记下来","定期复诊","发热加重及时联系医护"],"scopeNote":"地区适用卡：主要适用于疟疾流行地区或旅居史已确诊人群。覆盖按医嘱服药核对、体温记录、防蚊措施记录与复诊提醒；不做诊断，高热不退、抽搐或意识改变请立即联系医护或急救。","alias":"打摆子 蚊媒传染病 热带发热 蚊帐防蚊 地区卡","subCards":["medlog","symptom","followup"]},
  {"id":"13_cancer","no":13,"name":"恶性肿瘤居家照护（通用卡）","tier":1,"g":"ot","ages":["18-44","45-59","60+"],"sexCat":"通用","sexNote":"男女通用；具体癌种与术后注意事项（如肢体水肿观察）请严格按主管医疗团队交代执行。","artSlug":"13_cancer","callouts":["治疗期症状观察记下来","乏力食欲每天记下来","体重定期记下来","定期复诊","肢体肿胀观察记下来"],"scopeNote":"覆盖治疗间歇期症状、乏力食欲、定期体重及肢体肿胀观察记录与复诊准备；不涉及分期、预后判断或治疗方案选择，儿童肿瘤请直接由专科团队管理。","alias":"癌症 化疗 放疗 靶向治疗 术后随访 淋巴水肿 肿瘤居家","subCards":["weight","symptom","medlog","followup"]},
  {"id":"14_ckd","no":14,"name":"慢性肾脏病（含透析居家）","tier":1,"g":"ki","ages":["18-44","45-59","60+"],"sexCat":"通用","sexNote":"男女通用。","artSlug":"14_ckd","callouts":["透析居家操作按培训核对","饮食记录按个人方案","定期复诊","症状变化及时联系医护","按医嘱用药不自行停药"],"scopeNote":"覆盖家庭血压与晨起体重记录、个人饮食方案记录、复诊准备及经医护培训后的居家透析操作核对；不解读化验指标，水肿加重、少尿或气促请及时就医。","alias":"慢性肾病 肾功能不全 尿毒症 腹膜透析 血液透析 肌酐","subCards":["bp","weight","medlog","symptom","followup"]},
  {"id":"15_headache","no":15,"name":"头痛障碍（偏头痛为主）","tier":1,"g":"ne","ages":["6-17","18-44","45-59"],"sexCat":"B","sexNote":"全球流行病学显示各年龄段女性患病率均高于男性；男性与青少年患者同样需规范记录诱因。","artSlug":"15_headache","callouts":["头痛日记每天记下来","触发因素记下来","突发剧烈头痛拨打当地急救电话","定期复诊","按医嘱用药不自行停药"],"scopeNote":"覆盖头痛发作时间、持续时长、触发因素日记与按医嘱用药记录；不做头痛分型诊断，若突发剧烈头痛或伴发热、视物模糊、肢体无力请立即拨打所在地急救电话。","alias":"偏头痛 紧张型头痛 头疼 头痛日记","subCards":["symptom","medlog","followup"]},
  {"id":"16_hiv","no":16,"name":"HIV/AIDS 居家随访","tier":1,"g":"ot","ages":["6-17","18-44","45-59","60+"],"sexCat":"B","sexNote":"全球现患人群中女性占比略高且存在显著地区差异；任何性别均享有同等隐私保护。","artSlug":"16_hiv","callouts":["服药操作按医嘱核对","复诊记录记下来","记录内容自己保管不分享","症状变化及时联系医护","按医嘱坚持用药不自行停药"],"scopeNote":"隐私敏感卡：所有记录仅保存在本机浏览器，不默认外发或共享。覆盖抗病毒治疗按医嘱服药核对与复诊记录；不涉及暴露后处置（暴露后须立即就医由医护决定）。","alias":"艾滋病 抗病毒治疗 长期随访 隐私记录","subCards":["medlog","symptom","followup"]},
  {"id":"17_tb","no":17,"name":"结核病","tier":1,"g":"re","ages":["0-5","6-17","18-44","45-59","60+"],"sexCat":"通用","sexNote":"男女通用，全年龄均可患病。","artSlug":"17_tb","callouts":["服药操作按医嘱核对","复诊记录记下来","症状变化每天记下来","症状加重及时联系医护","按医嘱用药不自行停药"],"scopeNote":"地区重点卡：覆盖已确诊后按医嘱规律服药核对、症状变化与复诊记录；居家通风与隔离要求请严格按所在地疾控部门与主治医生指导执行。","alias":"肺结核 结核 抗结核服药 长期规律用药 地区卡","subCards":["medlog","symptom","followup"]},
  {"id":"18_cirrhosis","no":18,"name":"肝硬化及其他慢性肝病","tier":1,"g":"di","ages":["18-44","45-59","60+"],"sexCat":"通用","sexNote":"男女通用；涵盖代谢相关脂肪性肝病、慢性肝炎进展及肝硬化等已确诊慢性肝病。","artSlug":"18_cirrhosis","callouts":["每天症状观察记下来","定期复诊","饮酒情况如实记下来","症状加重及时联系医护","按医嘱用药不自行停药"],"scopeNote":"覆盖每日症状与腹围体重变化观察、饮酒情况如实记录、按医嘱用药与定期复诊；不解读肝功能化验，出现呕血、黑便、黄疸加深或意识模糊请立即拨打所在地急救电话。","alias":"肝硬化 慢性肝病 脂肪肝 腹水 护肝随访","subCards":["weight","symptom","medlog","followup"]},
  {"id":"19_dementia","no":19,"name":"阿尔茨海默病及其他痴呆","tier":1,"g":"ne","ages":["45-59","60+"],"sexCat":"通用","sexNote":"男女均可患病，60 岁以上多见，亦存在中年早发情况。","artSlug":"19_dementia","callouts":["每天照护流程记下来","做好防走失准备","沟通耐心多安慰","照护者也要休息好","定期复诊"],"scopeNote":"覆盖固定日常照护作息、温和沟通原则、防走失准备、居家防跌倒及照护者自我喘息提示；若行为在一两天内骤变或激动伤人，请立即联系医生或所在地急救电话。","alias":"老年痴呆 认知障碍 失智症 记忆力减退 防走失","subCards":["dementia","fall","medlog","symptom","followup"]},
  {"id":"20_anemia","no":20,"name":"贫血（以缺铁性贫血为主）","tier":1,"g":"ot","ages":["0-5","6-17","18-44","45-59","60+"],"sexCat":"B","sexNote":"全球数据显示女性（尤其育龄女性）患病率高于男性；儿童与老年人亦需重视已确诊后的随访。","artSlug":"20_anemia","callouts":["服药操作按医嘱核对","饮食记录按个人方案","定期复诊","乏力加重及时联系医护","每天症状记下来"],"scopeNote":"仅适用于已明确病因（如缺铁性贫血）后的服药核对、个人饮食方案记录与复诊提醒；贫血背后病因多样，本卡不做病因推断或血红蛋白数值解读。","alias":"缺铁性贫血 血色素低 头晕乏力 补铁核对","subCards":["medlog","symptom","followup"]},
  {"id":"21_oral","no":21,"name":"口腔疾病（龋齿·牙周病·义齿护理）","tier":2,"g":"ot","ages":["0-5","6-17","18-44","45-59","60+"],"sexCat":"通用","sexNote":"男女通用，覆盖儿童乳恒牙、成人牙周至老年义齿日常护理。","artSlug":"21_oral","callouts":["每天口腔护理记下来","义齿护理按医嘱来","复诊记录记下来","牙齿疼痛出血及时联系医护","定期复诊检查"],"scopeNote":"覆盖每日刷牙清洁记录、活动义齿摘戴清洁核对与口腔复诊准备；不做龋齿或牙周病诊断，牙痛剧烈、牙龈持续出血或面部肿胀请及时就医。","alias":"蛀牙 龋齿 牙周炎 牙龈出血 假牙 义齿 牙齿缺失","subCards":["symptom","followup"]},
  {"id":"22_hypertension","no":22,"name":"高血压","tier":2,"g":"cv","ages":["18-44","45-59","60+"],"sexCat":"通用","sexNote":"成年至老年男女均常见；居家测量操作规范一致。","artSlug":"22_hypertension","callouts":["血压数值按时记下来","服药操作按医嘱核对","定期复诊","头晕不适及时联系医护","按医嘱用药不自行停药"],"scopeNote":"覆盖规范家庭上臂式血压测量、读数记录、按医嘱服药核对与复诊准备；不设定统一降压目标值，切勿凭单次读数自行停药或改量。","alias":"血压高 高压 原发性高血压 量血压","subCards":["bp","medlog","followup","symptom"]},
  {"id":"23_obesity","no":23,"name":"超重与肥胖","tier":2,"g":"en","ages":["0-5","6-17","18-44","45-59","60+"],"sexCat":"B","sexNote":"全球数据显示成人女性肥胖率略高于男性；儿童青少年与成人管理方式不同，需按年龄段遵医嘱执行。","artSlug":"23_obesity","callouts":["体重定期记下来","饮食活动每天记下来","定期复诊","身体不适及时联系医护","按医嘱用药不自行停药"],"scopeNote":"覆盖定期体重记录、日常饮食与活动记录及复诊准备；不设定通用减重数值目标，不提供节食偏方或减重疗效承诺。","alias":"肥胖症 超重 体重管理 减重记录 儿童肥胖","subCards":["weight","symptom","followup"]},
  {"id":"24_gerd","no":24,"name":"胃食管反流病","tier":2,"g":"di","ages":["18-44","45-59","60+"],"sexCat":"通用","sexNote":"男女通用。","artSlug":"24_gerd","callouts":["症状日记每天记下来","饮食体位记下来","定期复诊","症状加重及时联系医护","按医嘱用药不自行停药"],"scopeNote":"覆盖反酸烧心症状日记、餐后体位与饮食诱因记录、按医嘱用药及复诊提醒；若出现吞咽困难、呕血黑便、胸痛或不明原因体重下降请及时就医。","alias":"反酸 烧心 食管反流 胃反流 夜间反酸","subCards":["symptom","medlog","followup"]},
  {"id":"25_osteoarthritis","no":25,"name":"骨关节炎（膝关节为主）","tier":2,"g":"mu","ages":["45-59","60+"],"sexCat":"通用","sexNote":"中老年男女均常见；全球卡按统一功能与防跌倒要点记录。","artSlug":"25_osteoarthritis","callouts":["关节活动每天记下来","疼痛日记坚持记下来","助行器具每天检查","家里做好防跌倒","定期复诊"],"scopeNote":"覆盖关节活动与疼痛日记、拐杖或助行器日常检查、居家防跌倒及复诊准备；不解读影像学报告，关节突发红肿热痛请及时就医。","alias":"膝骨关节炎 退行性关节炎 老寒腿 膝盖疼 手骨关节炎","subCards":["fall","transfer","symptom","medlog","followup"]},
  {"id":"26_osteoporosis","no":26,"name":"骨质疏松症","tier":2,"g":"en","ages":["45-59","60+"],"sexCat":"B","sexNote":"全球数据显示 50 岁以上女性脆性骨折终身风险高于男性，男性高龄人群同样不可忽视防跌倒。","artSlug":"26_osteoporosis","callouts":["家里环境防跌倒改造","助行器具每天检查","复诊记录记下来","摔伤后及时联系医护","按医嘱用药不自行停药"],"scopeNote":"覆盖居家环境防跌倒改造、助行器具检查、按医嘱用药核对与复诊记录；不解读骨密度数值，跌倒摔伤后切勿盲目搬动，及时联系医护。","alias":"骨松 缺钙 脆性骨折 老年防骨折","subCards":["fall","transfer","medlog","followup"]},
  {"id":"27_rhinitis","no":27,"name":"变应性鼻炎","tier":2,"g":"re","ages":["6-17","18-44","45-59","60+"],"sexCat":"通用","sexNote":"儿童青少年与成人男女均常见。","artSlug":"27_rhinitis","callouts":["鼻喷操作按医嘱核对","环境变化记下来","定期复诊","症状加重及时联系医护","按医嘱用药不自行停药"],"scopeNote":"覆盖鼻喷剂按医嘱操作核对、花粉尘螨等居家环境变化记录、症状日记与复诊提醒；不做过敏原诊断。","alias":"过敏性鼻炎 鼻炎 打喷嚏 流清涕 鼻塞 鼻喷剂","subCards":["symptom","medlog","followup"]},
  {"id":"28_neckpain","no":28,"name":"颈痛","tier":2,"g":"mu","ages":["18-44","45-59","60+"],"sexCat":"B","sexNote":"全球负担研究显示各年龄段女性颈痛患病率均高于男性。","artSlug":"28_neckpain","callouts":["活动情况每天记下来","疼痛日记坚持记下来","定期复诊","危险信号拨打当地急救电话","按医嘱用药不自行停药"],"scopeNote":"覆盖日常颈部活动与久坐休息记录、疼痛日记与复诊准备；不做颈椎病分型诊断，若伴上肢麻木无力、行走踩棉花感或外伤后剧痛请立即拨打所在地急救电话或就医。","alias":"脖子疼 颈椎不适 肩颈痛 疼痛日记","subCards":["symptom","medlog","followup"]},
  {"id":"29_asthma","no":29,"name":"支气管哮喘","tier":2,"g":"re","ages":["0-5","6-17","18-44","45-59","60+"],"sexCat":"通用","sexNote":"全年龄男女均可患病；儿童使用吸入装置（如配储雾罐）需由家长按医嘱协助核对。","artSlug":"29_asthma","callouts":["吸入操作按医嘱核对","峰流速数值只记不解读","环境变化记下来","定期复诊","急性发作拨打当地急救电话"],"scopeNote":"覆盖吸入器规范操作核对、峰流速数值记录（只记录不自行解读）、环境诱因日记与复诊提醒；急性喘息发作、说话不成句请立即拨打所在地急救电话。","alias":"哮喘 儿童哮喘 喘息 气雾剂 储雾罐 峰流速","subCards":["inhaler","breathing","medlog","symptom","followup"]},
  {"id":"30_gallbladder","no":30,"name":"胆囊与胆道疾病","tier":2,"g":"di","ages":["18-44","45-59","60+"],"sexCat":"B","sexNote":"全球数据显示各年龄段女性胆囊与胆道疾病发病率高于男性。","artSlug":"30_gallbladder","callouts":["每天症状记下来","定期复诊","急性腹痛拨打当地急救电话","按医嘱用药不自行停药","症状变化及时联系医护"],"scopeNote":"覆盖已确诊胆结石、慢性胆囊炎等稳定期的饮食与右上腹症状记录及定期复诊；突发剧烈腹痛、寒战高热或眼黄尿黄请立即拨打所在地急救电话。","alias":"胆结石 胆囊炎 胆道疾病 右上腹痛","subCards":["symptom","medlog","followup"]},
  {"id":"31_osa","no":31,"name":"阻塞性睡眠呼吸暂停","tier":2,"g":"re","ages":["18-44","45-59","60+"],"sexCat":"通用","sexNote":"成年男女均可患病，症状表现因人而异（不一定都表现为响亮打鼾）。","artSlug":"31_osa","callouts":["呼吸机操作按医嘱核对","每天睡眠记下来","定期复诊","按医嘱用药不自行停药","身体不适及时联系医护"],"scopeNote":"覆盖家用无创呼吸机日常佩戴与清洁核对（如有处方）、夜间睡眠与白天困倦记录及复诊提醒；不解读多导睡眠监测报告。","alias":"打呼噜 睡眠呼吸暂停 OSA 家用呼吸机 白天嗜睡","subCards":["symptom","followup"]},
  {"id":"32_vision","no":32,"name":"视力损害（含白内障术后随访）","tier":2,"g":"ot","ages":["60+"],"sexCat":"通用","sexNote":"男女通用；中老年白内障与低视力人群居家需重点防跌倒。","artSlug":"32_vision","callouts":["术后观察每天记下来","用药操作按医嘱核对","家里环境方便低视力","定期复诊","视力骤降及时联系医护"],"scopeNote":"覆盖白内障等眼科术后观察、眼药水规范滴用核对、低视力照明与防跌倒环境调整及定期复诊；视力骤降、眼痛明显请立即联系医护。","alias":"白内障 术后滴眼药 低视力 看不清 放大镜","subCards":["eyedrops","fall","medlog","symptom","followup"]},
  {"id":"33_myopia","no":33,"name":"近视与屈光不正","tier":2,"g":"ot","ages":["6-17","18-44"],"sexCat":"通用","sexNote":"男女通用；儿童青少年需关注日常用眼习惯记录，亦涵盖成人屈光不正与老视居家用眼适应。","artSlug":"33_myopia","callouts":["用眼习惯每天记下来","定期复诊","居家环境适应调整记下来","视力变化及时联系医护","按医嘱用药不自行停药"],"scopeNote":"覆盖日常读写采光与用眼时长记录、配镜复查记录与居家照明调整；不解读验光度数，不承诺任何“治愈近视”效果，突发眼前黑影或闪光感请及时就医。","alias":"近视眼 学生近视 散光 远视 老花眼 配镜复查","subCards":["symptom","followup"]},
  {"id":"34_rhd","no":34,"name":"风湿性心脏病","tier":2,"g":"cv","ages":["6-17","18-44","45-59"],"sexCat":"通用","sexNote":"男女均可患病；青少年与青壮年长期随访与预防复发尤为关键。","artSlug":"34_rhd","callouts":["服药操作按医嘱核对","复诊记录记下来","发热症状每天记下来","发热加重及时联系医护","按医嘱用药不自行停药"],"scopeNote":"地区重点卡：覆盖按医嘱长期用药/注射日程核对、咽痛发热症状记录与定期心内科复诊；不判断心脏杂音，出现气促水肿或持续发热请及时就医。","alias":"风心病 心脏瓣膜病 链球菌感染随访","subCards":["bp","weight","medlog","symptom","followup"]},
  {"id":"35_heartfailure","no":35,"name":"心力衰竭","tier":2,"g":"cv","ages":["45-59","60+"],"sexCat":"通用","sexNote":"男女患病规模相近；涵盖高血压性心脏病、慢性心肌病及瓣膜病等稳定期心衰随访。","artSlug":"35_heartfailure","callouts":["体重每天记下来","症状变化每天记下来","服药操作按医嘱核对","定期复诊","气促加重拨打当地急救电话"],"scopeNote":"覆盖每日晨起固定条件称体重、水肿与气促症状记录、血压监测及按医嘱服药核对；不自行调整利尿等药物，静息气促加重、不能平卧请立即拨打所在地急救电话。","alias":"心衰 慢性心功能不全 腿肿 喘不上气 每天称体重 心肌病","subCards":["weight","bp","medlog","symptom","followup"]},
  {"id":"36_afib","no":36,"name":"房颤与房扑","tier":2,"g":"cv","ages":["45-59","60+"],"sexCat":"通用","sexNote":"男女通用，随年龄增长患病增加。","artSlug":"36_afib","callouts":["脉搏心率按时记下来","服药操作按医嘱核对","定期复诊","心慌加重及时联系医护","按医嘱用药不自行停药"],"scopeNote":"覆盖日常脉搏/心率与血压记录（只记录不解读心电图）、抗凝等长期用药按医嘱核对及定期复诊；突发偏侧无力、言语不清或持续胸痛心慌请立即求助。","alias":"心房颤动 房颤 房扑 心律失常 心慌 脉搏不齐","subCards":["bp","medlog","symptom","followup"]},
  {"id":"37_pad","no":37,"name":"外周动脉疾病","tier":2,"g":"cv","ages":["45-59","60+"],"sexCat":"B","sexNote":"全球数据显示女性（尤其绝经后女性）患病率高于男性，许多患者症状隐匿。","artSlug":"37_pad","callouts":["步行情况每天记下来","腿部症状记下来","每天观察双脚皮肤","定期复诊","腿痛加重及时联系医护"],"scopeNote":"覆盖每日步行距离与腿部酸痛症状记录、双足皮肤温度与破损观察、血压管理及定期复诊；下肢突发冰冷剧痛、苍白发紫或足部破溃请尽快就医。","alias":"下肢动脉硬化闭塞 间歇性跛行 走一段腿疼 老烂腿预防","subCards":["bp","wound","medlog","symptom","followup"]},
  {"id":"38_bph","no":38,"name":"良性前列腺增生","tier":2,"g":"ki","ages":["45-59","60+"],"sexCat":"A","sexNote":"仅适用于男性患者。","artSlug":"38_bph","callouts":["排尿情况每天记下来","夜里起夜防跌倒","定期复诊","排尿困难及时联系医护","按医嘱用药不自行停药"],"scopeNote":"覆盖排尿频次与夜尿情况记录、夜间起夜照明与防跌倒措施、按医嘱服药核对及定期复诊；不解读前列腺体积或 PSA 指标，突发完全排不出尿请立即就医。","alias":"前列腺肥大 夜尿多 起夜 排尿费力 尿频","subCards":["fall","medlog","symptom","followup"]},
  {"id":"39_stones","no":39,"name":"尿石症（肾结石）","tier":2,"g":"ki","ages":["18-44","45-59","60+"],"sexCat":"B","sexNote":"全球数据显示男性新发病例占比高于女性，男女患者均需重视饮水与复诊管理。","artSlug":"39_stones","callouts":["疼痛情况记下来","排尿情况记下来","饮水情况每天记下来","定期复诊","急性剧烈疼痛拨打当地急救电话"],"scopeNote":"覆盖腰腹疼痛与排尿观察记录、按医嘱每日饮水记录及定期复查；不判断结石成分，突发剧烈肾绞痛、无尿或伴寒战高热请立即拨打所在地急救电话。","alias":"肾结石 输尿管结石 泌尿系结石 腰痛血尿","subCards":["symptom","medlog","followup"]},
  {"id":"40_gout","no":40,"name":"痛风与高尿酸血症","tier":2,"g":"en","ages":["18-44","45-59","60+"],"sexCat":"B","sexNote":"全球数据显示男性患病率显著高于女性，绝经后女性亦可能患病。","artSlug":"40_gout","callouts":["发作期好好休息","关节情况记下来","服药操作按医嘱核对","定期复诊","按医嘱用药不自行停药"],"scopeNote":"覆盖急性发作期休息观察、关节红肿疼痛记录、按医嘱规范用药核对（发作期与间歇期均不自行增减药）及定期复诊；不设定统一血尿酸目标值。","alias":"痛风 高尿酸 大脚趾肿痛 关节红肿 痛风石","subCards":["symptom","medlog","followup"]},
  {"id":"41_ild","no":41,"name":"间质性肺疾病与肺结节病","tier":2,"g":"re","ages":["45-59","60+"],"sexCat":"通用","sexNote":"男女通用。","artSlug":"41_ild","callouts":["氧疗操作按医嘱核对","每天症状记下来","定期复诊","气促加重及时联系医护","按医嘱用药不自行停药"],"scopeNote":"本条目为异质性疾病组，仅覆盖已确诊患者居家家庭氧疗设备日常核对（如有处方）、呼吸康复、气促咳嗽记录与定期复诊；不解读肺功能或胸部影像。","alias":"肺纤维化 间质性肺炎 肺结节病 家庭氧疗 干咳气短","subCards":["breathing","medlog","symptom","followup"]},
  {"id":"42_pancreatitis","no":42,"name":"慢性胰腺炎（居家随访）","tier":2,"g":"di","ages":["18-44","45-59","60+"],"sexCat":"B","sexNote":"全球数据显示男性疾病负担高于女性。","artSlug":"42_pancreatitis","callouts":["酶制剂操作按医嘱核对","疼痛情况记下来","饮食记录记下来","定期复诊","急性发作拨打当地急救电话"],"scopeNote":"窄范围照护：仅限慢性胰腺炎稳定期或出院后随访，覆盖胰酶等处方药随餐核对、腹痛与脂肪泻观察、个人饮食与戒酒记录；突发剧烈持续上腹痛伴呕吐请立即拨打所在地急救电话。","alias":"胰腺炎 慢性胰腺炎 出院随访 上腹痛 消化酶核对","subCards":["medlog","symptom","followup"]},
  {"id":"43_psoriasis","no":43,"name":"银屑病","tier":2,"g":"ot","ages":["6-17","18-44","45-59","60+"],"sexCat":"通用","sexNote":"男女患病率相近。","artSlug":"43_psoriasis","callouts":["皮肤护理每天记下来","外用药操作按医嘱核对","定期复诊","皮损加重及时联系医护","按医嘱用药不自行停药"],"scopeNote":"覆盖日常保湿与皮肤护理记录、处方外用药涂抹核对及定期复诊；不推荐偏方或承诺“根治”，若全身大面积潮红脱屑、脓疱伴发热请尽快就医。","alias":"牛皮癣 鳞屑斑块 银屑病关节炎观察 皮肤保湿","subCards":["medlog","symptom","followup"]},
  {"id":"44_ra","no":44,"name":"类风湿关节炎","tier":2,"g":"mu","ages":["18-44","45-59","60+"],"sexCat":"B","sexNote":"全球数据显示女性患病人数约为男性的两倍以上。","artSlug":"44_ra","callouts":["关节症状每天记下来","服药操作按医嘱核对","定期复诊","关节肿痛加重及时联系医护","按医嘱用药不自行停药"],"scopeNote":"覆盖晨僵时长与关节肿痛日记、长期慢作用药物按医嘱核对及定期专科复诊；切勿因疼痛缓解自行停药，不解读类风湿因子等化验单。","alias":"类风湿 手指关节肿痛 晨僵 风湿免疫","subCards":["medlog","symptom","followup"]},
  {"id":"45_ibd","no":45,"name":"炎症性肠病","tier":2,"g":"di","ages":["6-17","18-44","45-59"],"sexCat":"通用","sexNote":"男女通用；涵盖溃疡性结肠炎与克罗恩病稳定期居家管理。","artSlug":"45_ibd","callouts":["症状情况每天记下来","饮食记录记下来","服药操作按医嘱核对","定期复诊","症状加重及时联系医护"],"scopeNote":"覆盖排便次数性状与腹痛症状日记、个人饮食耐受记录、按医嘱长期用药核对与定期复诊；不解读肠镜报告，出现高热、大量便血或剧烈腹痛请及时就医。","alias":"溃疡性结肠炎 克罗恩病 IBD 慢性腹泻 黏液脓血便","subCards":["medlog","symptom","followup"]},
  {"id":"46_fibroids","no":46,"name":"子宫肌瘤","tier":2,"g":"ki","ages":["18-44","45-59"],"sexCat":"A","sexNote":"仅适用于女性患者。","artSlug":"46_fibroids","callouts":["月经情况记下来","症状情况每天记下来","定期复诊","出血异常及时联系医护","按医嘱用药不自行停药"],"scopeNote":"覆盖月经周期、经量变化与压迫不适记录及定期妇科复诊；不解读超声报告，若出现经量暴增、头晕心慌或异常持续出血请及时联系医护。","alias":"肌瘤 月经量多 经期延长 妇科随访","subCards":["symptom","medlog","followup"]},
  {"id":"47_ulcer","no":47,"name":"消化性溃疡","tier":2,"g":"di","ages":["18-44","45-59","60+"],"sexCat":"B","sexNote":"全球数据显示男性患病负担高于女性。","artSlug":"47_ulcer","callouts":["症状情况每天记下来","服药记录记下来","定期复诊","呕血黑便拨打当地急救电话","按医嘱用药不自行停药"],"scopeNote":"覆盖规律服药（含按完整疗程服药）核对、上腹痛与餐食关系记录及复诊复查提醒；一旦出现呕血、黑便（柏油样便）或突发刀割样腹痛，请立即拨打所在地急救电话。","alias":"胃溃疡 十二指肠溃疡 胃痛 黑便警示 幽门螺杆菌复查","subCards":["medlog","symptom","followup"]},
  {"id":"48_epilepsy","no":48,"name":"癫痫","tier":2,"g":"ne","ages":["0-5","6-17","18-44","45-59","60+"],"sexCat":"通用","sexNote":"全年龄男女均可患病；儿童、育龄期与老年患者需按专科个体化医嘱管理。","artSlug":"48_epilepsy","callouts":["发作时间表现记下来","发作诱因记下来","服药操作按医嘱核对","发作时侧卧不塞东西","发作超过5分钟拨打当地急救电话"],"scopeNote":"覆盖发作起止时间、表现与诱因记录及每日规律服药核对；发作时保持周围安全、协助侧卧、解开领口，严禁往嘴里塞任何物品或强行按压肢体；发作超过 5 分钟或连续发作未清醒请立即拨打所在地急救电话。","alias":"羊癫疯 抽搐 惊厥 癫痫发作记录 侧卧急救","subCards":["medlog","symptom","followup"]},
  {"id":"49_parkinsons","no":49,"name":"帕金森病","tier":2,"g":"ne","ages":["45-59","60+"],"sexCat":"B","sexNote":"全球数据显示男性疾病负担高于女性；60 岁以上为主，亦见中年发病。","artSlug":"49_parkinsons","callouts":["运动情况每天记下来","症状变化记下来","服药操作按医嘱核对","家里做好防跌倒","定期复诊"],"scopeNote":"覆盖震颤僵直与步态变化记录、准时服药核对、居家防跌倒改造与安全转移协助及定期复诊；不做病情分期判断，切勿突然自行停药。","alias":"手抖 震颤 步态冻结 动作变慢 防摔倒","subCards":["fall","transfer","medlog","symptom","followup"]},
  {"id":"50_eczema","no":50,"name":"特应性皮炎 / 湿疹","tier":2,"g":"ot","ages":["0-5","6-17","18-44"],"sexCat":"B","sexNote":"全球数据显示儿童（尤其 5 岁以下）及女性负担较高；成人慢性湿疹同样适用。","artSlug":"50_eczema","callouts":["皮肤护理每天记下来","外用药操作按医嘱核对","定期复诊","拍照只给复诊医生看","皮损加重及时联系医护"],"scopeNote":"覆盖每日润肤保湿与洗护记录、处方外用药核对及复诊提醒；皮损照片仅保存在本机供复诊时给医生查看，应用不做图像识别诊断；出现渗液结痂发热请及时就医。","alias":"湿疹 婴儿湿疹 奶癣 特应性皮炎 皮肤瘙痒 润肤","subCards":["medlog","symptom","followup"]},
  {"id":"51_thyroid","no":51,"name":"甲状腺功能异常（甲亢 / 甲减）","tier":2,"g":"en","ages":["6-17","18-44","45-59","60+"],"sexCat":"B","sexNote":"全球流行病学显示自身免疫性甲状腺疾病女性患病率高于男性；妊娠期或备孕女性须由内分泌科与产科共同管理。","artSlug":"51_thyroid","callouts":["服药操作按医嘱核对","症状情况每天记下来","定期复诊","妊娠期问题及时联系医护","按医嘱用药不自行停药"],"scopeNote":"覆盖每日固定方式服药核对（如空腹或与特定食物间隔按说明书执行）、心率情绪怕冷怕热症状记录及定期抽血复诊；不解读甲功化验单，绝不混淆为低血糖。","alias":"甲减 甲亢 甲状腺功能减退 甲状腺功能亢进 桥本甲状腺炎 Graves病","subCards":["medlog","symptom","followup"]},
  {"id":"52_lipids","no":52,"name":"血脂异常 / 高脂血症","tier":2,"g":"cv","ages":["18-44","45-59","60+"],"sexCat":"通用","sexNote":"成年至老年男女均常见。","artSlug":"52_lipids","callouts":["服药操作按医嘱核对","定期复诊","按医嘱用药不自行停药","身体不适及时联系医护","复诊记录记下来"],"scopeNote":"覆盖按医嘱规律服药核对、肌肉酸痛或乏力等不适观察及定期复查记录；不设定统一血脂目标值，切勿看到化验好转即自行停药。","alias":"高血脂 高胆固醇 高甘油三酯 低密度脂蛋白 调脂随访","subCards":["medlog","followup","symptom"]},
  {"id":"53_dengue","no":53,"name":"登革热","tier":2,"g":"ot","ages":["0-5","6-17","18-44","45-59","60+"],"sexCat":"通用","sexNote":"男女通用，流行区全年龄均可感染。","artSlug":"53_dengue","callouts":["每天体温记下来","补液情况记下来","定期复诊","重症信号拨打当地急救电话","按医嘱用药不自行停药"],"scopeNote":"地区适用卡：主要适用于热带与亚热带流行地区或流行季已确诊轻症居家观察人群。覆盖每日体温与饮水补液记录、防蚊隔离配合及复诊提醒；出现剧烈腹痛、持续呕吐、牙龈鼻腔出血或嗜睡躁动等重症信号请立即拨打所在地急救电话。","alias":"伊蚊 骨痛热 热带发热 补液观察 地区卡","subCards":["symptom","medlog","followup"]},
  {"id":"54_hepatitis","no":54,"name":"病毒性肝炎（乙肝 / 丙肝）居家随访","tier":2,"g":"di","ages":["18-44","45-59","60+"],"sexCat":"通用","sexNote":"男女通用；亦涵盖急性肝炎出院康复期的居家观察与复诊记录。","artSlug":"54_hepatitis","callouts":["服药操作按医嘱核对","复诊记录记下来","康复期观察记下来","症状加重及时联系医护","按医嘱用药不自行停药"],"scopeNote":"覆盖抗病毒等处方药物每日准时服药核对、乏力纳差黄疸观察及定期复查提醒；不判断传染性或隔离期限，不解读肝功能与病毒量数值。","alias":"慢性乙肝 慢性丙肝 肝炎康复期 抗病毒按时吃药","subCards":["medlog","symptom","followup"]},
  {"id":"55_incontinence","no":55,"name":"尿失禁","tier":2,"g":"ki","ages":["45-59","60+"],"sexCat":"B","sexNote":"全球研究显示女性患病率约为男性的两倍（含产后与绝经后人群），老年男性术后或前列腺疾病亦常见。","artSlug":"55_incontinence","callouts":["排尿日记每天记下来","护垫器具使用记下来","定期复诊","排尿困难及时联系医护","按医嘱用药不自行停药"],"scopeNote":"覆盖排尿时间与漏尿诱因日记、吸收护垫更换与局部皮肤清洁护理、起夜防跌倒及复诊提醒；不做尿失禁分型诊断，伴排尿疼痛、血尿或排尿困难请及时就医。","alias":"漏尿 压力性尿失禁 急迫性尿失禁 护垫护理 产科瘘转介提示","subCards":["fall","symptom","medlog","followup"]},
  {"id":"56_ms","no":56,"name":"多发性硬化","tier":2,"g":"ne","ages":["18-44","45-59"],"sexCat":"B","sexNote":"全球研究显示青壮年女性患病与负担高于男性。","artSlug":"56_ms","callouts":["症状情况每天记下来","活动情况记下来","服药操作按医嘱核对","定期复诊","症状变化及时联系医护"],"scopeNote":"覆盖日常视力、肢体感觉与活动耐力记录、助行器与轮椅转移安全、疾病修正治疗按医嘱核对及定期专科复诊；不做复发判定，新发视物重影、无力麻木或平衡恶化请及时联系医护。","alias":"MS 中枢神经脱髓鞘 肢体麻木 视神经炎随访","subCards":["fall","transfer","medlog","symptom","followup"]},
  {"id":"57_sle","no":57,"name":"系统性红斑狼疮","tier":2,"g":"mu","ages":["18-44","45-59"],"sexCat":"B","sexNote":"全球流行病学显示育龄期女性患病人数显著高于男性（男女均需规范随访）。","artSlug":"57_sle","callouts":["症状情况每天记下来","日晒防护记下来","服药操作按医嘱核对","定期复诊","症状加重及时联系医护"],"scopeNote":"覆盖每日皮疹关节痛与体温症状记录、日常物理防晒执行记录、按医嘱规律服药核对（严禁擅自停减药物）与定期复诊；不解读免疫学化验指标。","alias":"SLE 红斑狼疮 蝶形红斑 光敏感 防晒 风湿免疫","subCards":["bp","medlog","symptom","followup"]},
  {"id":"58_as","no":58,"name":"强直性脊柱炎","tier":2,"g":"mu","ages":["18-44","45-59"],"sexCat":"B","sexNote":"青壮年起病多见，男性患病比例高于女性，女性患者表现可能相对隐匿。","artSlug":"58_as","callouts":["运动情况每天记下来","姿势习惯记下来","疼痛日记坚持记下来","定期复诊","按医嘱用药不自行停药"],"scopeNote":"覆盖按康复医嘱的日常伸展运动记录、睡姿坐姿习惯、夜间腰背痛与晨僵日记及定期复诊；不解读骶髂关节影像，若突发眼红眼痛视物模糊（伴发葡萄膜炎警示）请尽快就医。","alias":"强直 AS 脊柱关节炎 夜间腰背痛 晨僵 伸展训练","subCards":["symptom","medlog","followup"]},
  {"id":"59_endometriosis","no":59,"name":"子宫内膜异位症","tier":2,"g":"ki","ages":["18-44","45-59"],"sexCat":"A","sexNote":"仅适用于女性患者。","artSlug":"59_endometriosis","callouts":["疼痛情况每天记下来","月经情况记下来","定期复诊","疼痛加重及时联系医护","按医嘱用药不自行停药"],"scopeNote":"覆盖月经周期、痛经及慢性盆腔痛程度日记、按医嘱用药核对与定期妇科复诊；不做诊断或分期判断，疼痛突然剧烈加重或异常出血请及时就医。","alias":"内异症 巧克力囊肿 痛经 慢性盆腔痛","subCards":["symptom","medlog","followup"]},
  {"id":"60_pcos","no":60,"name":"多囊卵巢综合征","tier":2,"g":"ki","ages":["18-44"],"sexCat":"A","sexNote":"仅适用于育龄期女性（国际共识过渡期亦称多内分泌代谢卵巢综合征 PMOS）。","artSlug":"60_pcos","callouts":["月经情况记下来","症状情况每天记下来","服药操作按医嘱核对","定期复诊","按医嘱用药不自行停药"],"scopeNote":"覆盖月经周期记录、皮肤毛发与体重变化记录、按医嘱用药核对及定期复诊；不解读性激素或代谢化验结果。","alias":"PCOS PMOS 月经稀发 内分泌妇科","subCards":["weight","medlog","symptom","followup"]},
  {"id":"61_scd","no":61,"name":"镰状细胞病","tier":2,"g":"ot","ages":["0-5","6-17","18-44","45-59"],"sexCat":"通用","sexNote":"男女通用（常染色体遗传）；撒哈拉以南非洲、地中海、中东、印度及全球散居社区重点适用。","artSlug":"61_scd","callouts":["疼痛发作情况记下来","服药操作按医嘱核对","定期复诊","发作期按既定医嘱执行","发作严重拨打当地急救电话"],"scopeNote":"地区重点卡：覆盖日常饮水保暖记录、疼痛危象发作记录、按医嘱预防性用药核对与定期复诊；携带状态与患病区别须由医生解释；突发剧痛不缓解、高热、胸痛气促或苍白嗜睡请立即拨打所在地急救电话。","alias":"镰刀型细胞贫血 遗传性溶血 疼痛危象 地区卡","subCards":["medlog","symptom","followup"]},
  {"id":"62_cp","no":62,"name":"脑瘫（终身照护）","tier":2,"g":"ne","ages":["0-5","6-17","18-44","45-59","60+"],"sexCat":"通用","sexNote":"男女通用；从婴幼儿期至成年老年期的连续功能支持与居家照护。","artSlug":"62_cp","callouts":["康复训练执行记下来","器具使用记下来","定期复诊","训练只按康复师方案执行","按医嘱用药不自行停药"],"scopeNote":"覆盖严格按康复医师/治疗师方案的日常训练执行记录、站立架/矫形器/轮椅使用检查、安全转移及定期复诊；应用不自行制定康复动作方案。","alias":"脑性瘫痪 康复训练 矫形器 站立架 终身照护","subCards":["transfer","fall","symptom","medlog","followup"]},
  {"id":"63_burn","no":63,"name":"轻度烧伤与出院后伤口护理","tier":2,"g":"ot","ages":["0-5","6-17","18-44","45-59","60+"],"sexCat":"通用","sexNote":"全年龄男女通用；儿童与老人皮肤薄，尤其需注意防烫伤与规范观察。","artSlug":"63_burn","callouts":["伤口情况每天观察记下来","出院后伤口护理记下来","大面积烧伤拨打当地急救电话","面部手部烧伤立即求助","定期复诊"],"scopeNote":"窄范围照护：仅适用于经医生评估可居家观察的轻度小面积烫烧伤或出院后换药观察；不做烧伤深度分级，凡大面积烧伤、面部/手足/关节/会阴烧伤、吸入烟雾或电击化学灼伤，请立即拨打所在地急救电话。","alias":"烫伤 烧伤换药 敷料观察 伤口渗液","subCards":["wound","symptom","followup"]},
  {"id":"64_gastro","no":64,"name":"儿童急性胃肠炎（已确诊）","tier":2,"g":"di","ages":["0-5","6-17"],"sexCat":"通用","sexNote":"男女童通用；婴幼儿脱水进展快，需重点记录出入量。","artSlug":"64_gastro","callouts":["补液情况记下来","排便情况记下来","定期复诊","脱水信号拨打当地急救电话","按医嘱用药不自行停药"],"scopeNote":"仅适用于已由儿科确诊后的居家口服补液记录、呕吐排便次数性状记录与复诊提醒；若出现哭时无泪、尿布长时间不湿、眼窝凹陷、高热或嗜睡烦躁，请立即拨打所在地急救电话。","alias":"小儿腹泻 宝宝拉肚子 呕吐 口服补液记录 儿童肠胃炎","subCards":["symptom","medlog","followup"]},
  {"id":"65_pneumonia","no":65,"name":"儿童肺炎（居家康复期）","tier":2,"g":"re","ages":["0-5","6-17"],"sexCat":"通用","sexNote":"男女童通用。","artSlug":"65_pneumonia","callouts":["康复期观察每天记下来","定期复诊","呼吸困难加重拨打当地急救电话","体温每天记下来","按医嘱用药不自行停药"],"scopeNote":"仅适用于已确诊儿童肺炎经院内治疗好转后的居家康复期观察、体温呼吸记录与按医嘱服药核对；若出现呼吸急促、鼻翼扇动、胸壁吸气性凹陷、口唇发绀或拒食嗜睡，请立即拨打所在地急救电话。","alias":"小儿肺炎 支气管肺炎康复 宝宝咳嗽发烧 呼吸观察","subCards":["symptom","medlog","followup"]},
  {"id":"66_cold","no":66,"name":"普通感冒与流感（已确诊居家护理）","tier":2,"g":"re","ages":["0-5","6-17","18-44","45-59","60+"],"sexCat":"通用","sexNote":"全年龄男女通用；婴幼儿、孕妇、老年人及慢病患者需警惕重症信号。","artSlug":"66_cold","callouts":["症状情况每天记下来","休息补液记下来","定期复诊","重症信号拨打当地急救电话","按医嘱用药不自行停药"],"scopeNote":"覆盖已明确诊断急性上呼吸道感染或流感的体温症状记录、休息饮水记录与按医嘱用药核对；居家隔离与返校返岗要求按所在地疾控规定执行；出现呼吸困难、持续高热不退、胸痛或意识模糊请立即拨打所在地急救电话。","alias":"感冒 流行性感冒 甲流 乙流 发烧流涕 上感","subCards":["symptom","medlog","followup"]},
  {"id":"67_gdm","no":67,"name":"妊娠期高血糖（含妊娠期糖尿病）","tier":2,"g":"en","ages":["18-44","45-59"],"sexCat":"A","sexNote":"仅适用于妊娠期女性。","artSlug":"67_gdm","callouts":["只按产科医生方案记录","血糖按医生交代的方案记","危险信号及时联系医护","用药分娩问题只问产科医生","定期复诊"],"scopeNote":"严格遵循产科与内分泌科医生制定的个人方案记录空腹及餐后血糖、饮食运动与复诊问题；不套用非孕期血糖标准，不提供孕期用药或分娩时机建议，出现胎动异常、腹痛或头晕心慌请及时联系产科医护。","alias":"妊娠糖尿病 孕期血糖高 糖妈妈 产检血糖记录","subCards":["glucose","insulin_pen","symptom","followup"]},
  {"id":"68_ghtn","no":68,"name":"妊娠期高血压疾病","tier":2,"g":"cv","ages":["18-44","45-59"],"sexCat":"A","sexNote":"仅适用于妊娠期女性。","artSlug":"68_ghtn","callouts":["血压按医生交代的方案记","危险信号及时联系医护","用药分娩问题只问产科医生","每天记录按时完成","定期复诊"],"scopeNote":"严格按产科医生交代的个人频次与方案测量记录家庭血压；不自行停改产科处方，一旦出现持续头痛、视物模糊、上腹不适、水肿骤增、阴道流血或胎动异常，请立即联系产科急诊。","alias":"孕期血压高 子痫前期观察 产检量血压","subCards":["bp","symptom","medlog","followup"]},
  {"id":"69_fungal","no":69,"name":"皮肤真菌病","tier":2,"g":"ot","ages":["0-5","6-17","18-44","45-59","60+"],"sexCat":"通用","sexNote":"全年龄男女均常见；儿童头癣体癣与中老年足癣甲真菌病均需坚持足疗程护理。","artSlug":"69_fungal","callouts":["皮损变化每天记下来","皮肤保持清洁干燥","个人用品分开记下来","用药按处方按疗程核对","皮损扩散及时联系医护"],"scopeNote":"覆盖皮损范围每日观察、患处清洁干燥护理、毛巾拖鞋等个人用品分开记录及按处方足疗程用药核对；不判断真菌种类，若局部红肿热痛渗液提示继发细菌感染，请及时就医。","alias":"脚气 足癣 体癣 股癣 手癣 灰指甲 甲癣 皮肤癣","subCards":["medlog","symptom","followup"]},
  {"id":"71_uti","no":71,"name":"尿路感染","tier":2,"g":"ki","ages":["0-5","6-17","18-44","45-59","60+"],"sexCat":"B","sexNote":"全球流行病学显示女性患病与复发显著高于男性；婴幼儿（常仅表现不明发热）与老年人（可表现突然糊涂跌倒）症状常不典型。","artSlug":"71_uti","callouts":["排尿症状记下来","每天体温记下来","饮水情况记下来","服药按处方按疗程核对","发热伴腰痛及时联系医护"],"scopeNote":"覆盖排尿不适与体温饮水记录、按处方足疗程服药核对及经医护培训后的留置导尿管日常核对；出现寒战发热伴腰痛、肉眼血尿、排尿不出或老人意识骤变，请立即就医。","alias":"膀胱炎 尿频尿急尿痛 小便刺痛 导尿管居家核对","subCards":["medlog","symptom","followup"]},
  {"id":"72_skin_infection","no":72,"name":"细菌性皮肤感染（蜂窝织炎 / 脓皮病）","tier":2,"g":"ot","ages":["0-5","6-17","18-44","45-59","60+"],"sexCat":"通用","sexNote":"全年龄通用；儿童脓疱疮发病多，中老年及下肢水肿/糖尿病患者易发蜂窝织炎。","artSlug":"72_skin_infection","callouts":["皮损范围每天记下来","每天体温记下来","皮损清洁护理记下来","用药操作按医嘱核对","红肿迅速扩大拨打当地急救电话"],"scopeNote":"覆盖红肿皮损边界观察记录、每日体温记录、清洁换药护理与按处方用药核对；若红肿范围迅速扩大、疼痛加剧、出现红线蔓延或伴高热寒战，请立即拨打所在地急救电话。","alias":"蜂窝织炎 丹毒 脓疱疮 毛囊炎 皮肤红肿热痛","subCards":["wound","medlog","symptom","followup"]},
  {"id":"73_contact_derm","no":73,"name":"接触性皮炎","tier":2,"g":"ot","ages":["0-5","6-17","18-44","45-59","60+"],"sexCat":"通用","sexNote":"全年龄男女通用。","artSlug":"73_contact_derm","callouts":["接触物诱因记下来","皮损变化每天记下来","防护措施记下来","外用药操作按医嘱核对","皮损扩散及时联系医护"],"scopeNote":"覆盖可疑接触物（洗涤剂、金属饰品、染发剂、植物等）与发病时间记录、防护手套等隔离措施、处方外用药核对及复诊提醒；不做过敏原斑贴试验解读，大面积水疱肿胀请及时就医。","alias":"过敏性皮炎 主妇手 接触过敏 红斑瘙痒","subCards":["medlog","symptom","followup"]},
  {"id":"74_urticaria","no":74,"name":"荨麻疹","tier":2,"g":"ot","ages":["0-5","6-17","18-44"],"sexCat":"B","sexNote":"全球数据显示女性患病占比略高于男性，儿童与青壮年均高发（中老年患者同样适用）。","artSlug":"74_urticaria","callouts":["风团瘙痒日记每天记","诱因记下来","用药操作按医嘱核对","呼吸困难立即拨打当地急救电话","口唇舌肿胀立即求助"],"scopeNote":"覆盖风团出现消退时间与瘙痒日记、可疑诱因记录及按医嘱规律服药核对；一旦出现呼吸困难、声音嘶哑、口唇舌头肿胀、头晕冷汗或腹痛呕吐（严重过敏反应警示），请立即拨打所在地急救电话。","alias":"风疙瘩 风团 慢性荨麻疹 皮肤起包瘙痒","subCards":["medlog","symptom","followup"]},
  {"id":"75_acne","no":75,"name":"痤疮","tier":2,"g":"ot","ages":["6-17","18-44"],"sexCat":"B","sexNote":"青少年与青年高发，全球统计年轻女性就诊与患病率略高，年轻男性重度结节囊肿亦常见。","artSlug":"75_acne","callouts":["皮肤清洁护理记下来","皮损变化记下来","生活习惯记下来","用药操作按医嘱核对","情绪问题及时求助"],"scopeNote":"覆盖温和洁面保湿记录、皮损变化记录、作息习惯与处方外用/口服药操作核对（注意部分处方药需严格避孕与防晒，须遵医嘱）；不挤压痘痘，若结节囊肿加重或引发明显情绪困扰请及时就医求助。","alias":"青春痘 粉刺 痘痘 毛囊皮脂腺","subCards":["medlog","symptom","followup"]},
  {"id":"76_pms","no":76,"name":"经前综合征","tier":2,"g":"ki","ages":["6-17","18-44","45-59"],"sexCat":"A","sexNote":"仅适用于月经初潮后至围绝经前的有月经人群。","artSlug":"76_pms","callouts":["月经周期症状记下来","情绪睡眠每天记下来","疼痛不适记下来","用药操作按医嘱核对","情绪严重影响生活立即求助"],"scopeNote":"覆盖月经周期与躯体不适、情绪睡眠日记及按医嘱用药核对；若经前情绪低落、易怒或焦虑严重影响日常生活工作（疑似经前烦躁障碍 PMDD）或出现自伤意念，请立即寻求专科医护帮助。","alias":"PMS 经前期不适 经前情绪波动 乳房胀痛 月经日记","subCards":["symptom","medlog","followup"]},
  {"id":"77_gastritis","no":77,"name":"胃炎与十二指肠炎","tier":2,"g":"di","ages":["18-44","45-59","60+"],"sexCat":"通用","sexNote":"成年至老年男女均常见。","artSlug":"77_gastritis","callouts":["上腹症状日记每天记","饮食记录记下来","服药按疗程完成核对","呕血黑便拨打当地急救电话","剧烈腹痛立即求助"],"scopeNote":"覆盖上腹饱胀隐痛症状日记、饮食刺激因素记录、按处方完整疗程服药核对（含根除幽门螺杆菌后按医嘱复查提醒）；不解读胃镜病理，若呕血、黑便、剧烈腹痛或消瘦明显请立即就医或拨打当地急救电话。","alias":"慢性胃炎 浅表性胃炎 萎缩性胃炎 十二指肠炎 胃胀胃痛 幽门螺杆菌","subCards":["medlog","symptom","followup"]},
  {"id":"78_otitis","no":78,"name":"中耳炎","tier":2,"g":"ot","ages":["0-5","6-17"],"sexCat":"通用","sexNote":"婴幼儿与学龄儿童高发（成人患者亦可参考症状记录）。","artSlug":"78_otitis","callouts":["耳痛发热每天记下来","听力变化观察记下来","耳道分泌物观察记下来","滴耳剂操作按医嘱核对","高热不退及时联系医护"],"scopeNote":"覆盖耳痛哭闹抓耳与体温观察记录、耳道分泌物与听力反应观察、处方滴耳剂/口服药操作核对及按期复诊；保持外耳道清洁勿自行掏挖，若高热不退、耳后红肿压痛、眩晕呕吐或面部无力请及时就医。","alias":"急性中耳炎 分泌性中耳炎 宝宝抓耳朵 耳痛 耳流脓 滴耳液","subCards":["medlog","symptom","followup"]},
  {"id":"79_sebderm","no":79,"name":"脂溢性皮炎","tier":2,"g":"ot","ages":["0-5","18-44","45-59","60+"],"sexCat":"通用","sexNote":"男女均常见；呈婴儿期（头皮“摇篮帽”）与成人及高龄期双峰分布。","artSlug":"79_sebderm","callouts":["头皮面部皮损记下来","洗护操作按医嘱核对","外用药洗剂按医嘱核对","定期复诊","继发感染征象及时联系医护"],"scopeNote":"覆盖头皮面部红斑鳞屑观察记录、按医嘱温和洗护与处方洗剂/外用药使用核对及复诊提醒；婴儿结痂切勿强行抠剥，若出现脓性渗出或大面积扩散请及时就医。","alias":"头皮脂溢性皮炎 婴儿摇篮帽 头屑红斑 面部脂溢性皮炎","subCards":["medlog","symptom","followup"]},
  {"id":"80_varicella","no":80,"name":"水痘与带状疱疹","tier":2,"g":"ot","ages":["0-5","6-17","45-59","60+"],"sexCat":"通用","sexNote":"水痘多见于儿童青少年，带状疱疹多见于 45 岁以上中老年人及免疫力低下者。","artSlug":"80_varicella","callouts":["皮疹水疱每天记下来","瘙痒疼痛记下来","皮肤护理记下来","每天体温记下来","眼部受累立即联系医护"],"scopeNote":"覆盖水疱结痂变化观察、皮肤清洁防抓挠护理、体温与神经痛程度记录及按处方用药核对；隔离期按当地疾控要求执行；一旦皮疹累及眼周鼻尖、伴眼痛视物模糊、面瘫耳痛或高热，请立即联系医护。","alias":"缠腰龙 生蛇 带状疱疹神经痛 水痘 水疱护理","subCards":["wound","medlog","symptom","followup"]},
  {"id":"81_pop","no":81,"name":"盆腔器官脱垂","tier":2,"g":"ki","ages":["45-59","60+"],"sexCat":"A","sexNote":"仅适用于女性患者（中老年与经产女性多见）。","artSlug":"81_pop","callouts":["症状日记每天记下来","盆底肌训练按指导执行","排尿排便习惯记下来","定期复诊","排尿困难及时联系医护"],"scopeNote":"覆盖下坠感症状日记、经医护指导后的盆底肌训练执行记录、预防便秘重体力负重记录及子宫托（如有处方）复查提醒；不做脱垂分度判断，若排尿困难、异常出血或脱出物无法回纳伴疼痛请及时就医。","alias":"子宫脱垂 阴道壁膨出 盆底功能障碍 凯格尔训练记录","subCards":["symptom","followup"]},
  {"id":"82_glaucoma","no":82,"name":"青光眼","tier":2,"g":"ot","ages":["45-59","60+"],"sexCat":"通用","sexNote":"中老年男女均需长期规律随访；全球数据显示致视力损害负担男性略高，闭角型与开角型均须严遵医嘱。","artSlug":"82_glaucoma","callouts":["眼药水操作按医嘱核对","用药依从每天记下来","视力变化观察记下来","家里做好防跌倒","眼痛视力骤降拨打当地急救电话"],"scopeNote":"覆盖每日按时规范滴用眼药水核对（切勿漏滴或擅自停药）、视力与视野变化观察、居家防跌倒照明改造及定期复诊；不作家用眼压判断，突发剧烈眼痛、头痛恶心呕吐、看灯光有彩虹圈或视力骤降请立即拨打所在地急救电话。","alias":"开角型青光眼 闭角型青光眼 滴眼药水 视野缺损 眼胀痛","subCards":["eyedrops","fall","medlog","symptom","followup"]},
  {"id":"83_amd","no":83,"name":"年龄相关性黄斑变性","tier":2,"g":"ot","ages":["45-59","60+"],"sexCat":"B","sexNote":"60 岁以上为主，全球数据显示女性现患与负担占比略高于男性。","artSlug":"83_amd","callouts":["中心视力变化记下来","阅读照明环境调整记下来","家里做好防跌倒","定期复诊","视力骤降及时联系医护"],"scopeNote":"覆盖中心视力变化观察（如看直线是否弯曲变形、视野中央暗点）、阅读照明与放大镜辅助调整、居家防跌倒改造及按期眼科复查；一旦视力突然下降或视物变形加重，请尽快联系眼科医护。","alias":"老年黄斑变性 AMD 视物变形 中心暗点 低视力防摔","subCards":["fall","symptom","medlog","followup"]},
  {"id":"84_g6pd","no":84,"name":"G6PD 缺乏症（蚕豆病）","tier":2,"g":"ot","ages":["0-5","6-17","18-44"],"sexCat":"B","sexNote":"X 连锁遗传，男性临床溶血受累为主，女性杂合子亦可能出现溶血表现；新生儿期男女婴均需密切观察黄疸。","artSlug":"84_g6pd","callouts":["触发物清单按医生交代核对","溶血征象观察记下来","就医主动告知病史","用药前先问医师药师","尿色加深黄疸加重立即求助"],"scopeNote":"地区重点卡：主要见于非洲、地中海、中东、南亚、东南亚及我国南方地区。严格按医生发放的个人禁忌清单核对饮食与日用品（不套用网传通用清单），每次就医购药主动告知病史；出现浓茶色/酱油色尿、眼黄肤黄、面色苍白乏力气促请立即急诊求助。","alias":"蚕豆病 葡萄糖6磷酸脱氢酶缺乏 溶血警示 新生儿黄疸观察 地区卡","subCards":["symptom","followup"]},
  {"id":"85_thalassemia","no":85,"name":"地中海贫血","tier":2,"g":"ot","ages":["0-5","6-17","18-44","45-59","60+"],"sexCat":"通用","sexNote":"男女患病率相当（常染色体遗传）；需从婴幼儿期起终身规范管理。","artSlug":"85_thalassemia","callouts":["输血日程记下来","生长发育记下来","乏力面色观察记下来","用药操作按医嘱核对","乏力明显加重及时联系医护"],"scopeNote":"地区重点卡：主要见于地中海、中东、南亚、东南亚及我国南方地区。覆盖定期输血日程记录、祛铁等处方药经培训后操作核对、儿童生长发育及面色乏力观察；携带者无需按患者管理，出现发热、乏力明显加重或黄疸加深请及时联系医护。","alias":"地贫 珠蛋白生成障碍性贫血 定期输血 祛铁随访 地区卡","subCards":["medlog","symptom","followup"]},
  {"id":"86_pressure","no":86,"name":"压疮 / 压力性损伤","tier":2,"g":"ot","ages":["45-59","60+"],"sexCat":"通用","sexNote":"男女通用；高龄长期卧床、轮椅依赖、脊髓损伤或术后制动人群重点预防。","artSlug":"86_pressure","callouts":["受压部位皮肤每天观察","翻身时间记下来","减压器具每天核对","营养水分按个人方案记","皮肤破损渗液及时联系医护"],"scopeNote":"覆盖骶尾足跟等受压部位皮肤每日观察、定时翻身减压时间记录、减压床垫坐垫核对、安全床椅转移及个人营养水分记录；不做压疮分期诊断，一旦皮肤破损、起水疱、渗液异味或发热请及时联系医护。","alias":"褥疮 长期卧床 翻身拍背 减压床垫 皮肤破损护理","subCards":["wound","transfer","fall","symptom","followup"]},
  {"id":"87_pneumoconiosis","no":87,"name":"尘肺病","tier":2,"g":"re","ages":["45-59","60+"],"sexCat":"B","sexNote":"因职业粉尘暴露结构差异，全球各年龄段男性患病显著高于女性；任何有粉尘暴露史确诊者均同样适用。","artSlug":"87_pneumoconiosis","callouts":["呼吸困难程度每天记下来","咳嗽咳痰观察记下来","血氧数值只记不解读","氧疗设备每天核对","气促明显加重拨打当地急救电话"],"scopeNote":"覆盖日常气促程度与咳嗽咳痰观察、指夹式血氧数值记录（只记录不自行解读）、家用制氧设备核对（如有处方）、吸入用药与呼吸训练及脱离粉尘环境提醒；出现气促明显加重、咯血、胸痛或高热请立即拨打所在地急救电话。","alias":"矽肺 煤工尘肺 石棉肺 职业性肺病 呼吸康复 家庭氧疗","subCards":["inhaler","breathing","medlog","symptom","followup"]}
];
const hubById=id=>{if(id===null||id===undefined||id==="")return null;const s=String(id).trim();const bare=s.replace(/^\d+_/,"");return DISEASE_HUBS.find(h=>h.id===s||h.artSlug===s||h.id.replace(/^\d+_/,"")===bare||(Number.isInteger(+s)&&+s>0&&h.no===+s))||null};
function filterHubs({q="",age="all",g="all",sys="all"}={}){
  const kw=String(q||"").trim().toLowerCase();
  const grp=(g&&g!=="all")?g:(sys||"all");
  return DISEASE_HUBS.filter(h=>{
    if(age&&age!=="all"&&!(h.ages||[]).includes(age))return false;
    if(grp&&grp!=="all"&&h.g!==grp)return false;
    if(!kw)return true;
    const hay=[h.name,h.alias||"",h.scopeNote||"",...(h.callouts||[])].join(" ").toLowerCase();
    if(hay.includes(kw))return true;
    const parts=kw.split(/\s+/).filter(Boolean);
    if(parts.length>1&&parts.every(p=>hay.includes(p)))return true;
    return (h.alias||"").split(/\s+/).some(a=>a&&a.length>=2&&kw.includes(a.toLowerCase()));
  });
}

/* ================= 虚构数据与本地状态 ================= */
const GLUCOSE_CTX={fasting:"空腹",premeal:"餐前",post2h:"餐后 2 小时",bedtime:"睡前",random:"随机"};
const SEED={
  person:{name:"王秀兰",initial:"王",note:"72 岁 · 高血压随访（虚构人物）"},
  myConds:["htn"], customConds:[],
  deck:["bp","followup","medlog"],
  events:[
    {id:"e1",kind:"visit",date:"2026-10-20",title:"社区卫生服务中心复诊",detail:"医生建议在家早晚测量血压，下次复诊带上记录。",src:"虚构门诊病历 · 第 1 页",status:"ok"},
    {id:"e2",kind:"med",date:"2026-10-20",title:"处方：降压药（虚构，名称略）",detail:"按医嘱服用。鹤伴不记录、也不建议剂量调整。",src:"虚构处方单",status:"ok"},
    {id:"e3",kind:"test",date:"2026-10-27",title:"血常规、肾功能检查",detail:"结果单已拍照存档，具体数值请对照原件。",src:"虚构检验报告单",status:"pend"},
    {id:"e4",kind:"visit",date:"2026-11-24",title:"预约：社区复诊",detail:"带上血压记录与检查结果单。",src:"虚构预约短信",status:"pend",visit:true}
  ],
  readings:[["2026-11-10","07:10",146,92],["2026-11-10","21:05",138,86],["2026-11-11","07:05",142,90],["2026-11-11","21:15",136,84],["2026-11-12","07:20",148,94],["2026-11-12","21:00",139,85],["2026-11-13","07:00",141,88],["2026-11-13","21:10",134,83],["2026-11-14","07:15",144,91],["2026-11-14","21:20",137,86],["2026-11-15","07:05",139,87],["2026-11-15","21:00",133,82],["2026-11-16","07:10",140,88],["2026-11-16","21:05",135,84]]
    .map((r,i)=>({id:"r"+i,date:r[0],time:r[1],sys:r[2],dia:r[3],status:"ok",src:"虚构 · 家庭血压计手动录入"})),
  glucoseReadings:[
    {id:"g0",date:"2026-11-15",time:"06:50",ctx:"fasting",val:5.8,note:"",status:"ok",src:"虚构 · 居家自测记录"},
    {id:"g1",date:"2026-11-16",time:"09:30",ctx:"post2h",val:7.6,note:"早餐第一口算起满 2 小时",status:"ok",src:"虚构 · 居家自测记录"}
  ],
  weightReadings:[
    {id:"w0",date:"2026-11-15",time:"06:45",kg:58.4,note:"晨起排尿后、早饭前",status:"ok",src:"虚构 · 居家自测记录"},
    {id:"w1",date:"2026-11-16",time:"06:48",kg:58.5,note:"晨起排尿后、早饭前",status:"ok",src:"虚构 · 居家自测记录"}
  ],
  prep:{questions:"",medsReady:false},
  meds:[{id:"m1",name:"降压药（虚构，名称略）",how:"照处方单抄写：每日 1 次，早饭前",log:[]}],
  symptoms:[],
  stepDone:{}
};
const KEY="underwing.v3", PREF="underwing.prefs";
function normalizeDB(raw,useSeedVitals=false){
  const d=Object.assign(clone(SEED),raw||{});
  if(!useSeedVitals&&raw){
    if(!("glucoseReadings" in raw))d.glucoseReadings=[];
    if(!("weightReadings" in raw))d.weightReadings=[];
  }
  d.glucoseReadings||=[];
  d.weightReadings||=[];
  d.stepDone||={};
  if(!Array.isArray(d.events))d.events=[];
  if(!Array.isArray(d.readings))d.readings=[];
  if(!Array.isArray(d.glucoseReadings))d.glucoseReadings=[];
  if(!Array.isArray(d.weightReadings))d.weightReadings=[];
  if(!Array.isArray(d.meds))d.meds=[];
  if(!Array.isArray(d.symptoms))d.symptoms=[];
  if(!Array.isArray(d.deck))d.deck=[];
  if(!Array.isArray(d.myConds))d.myConds=[];
  if(!Array.isArray(d.customConds))d.customConds=[];
  if(!d.person||typeof d.person!=="object")d.person=clone(SEED.person);
  if(!d.prep||typeof d.prep!=="object")d.prep=clone(SEED.prep);
  if(typeof d.stepDone!=="object"||Array.isArray(d.stepDone))d.stepDone={};
  return d;
}
let DB=(()=>{try{const s=JSON.parse(localStorage.getItem(KEY));if(s&&Array.isArray(s.events))return normalizeDB(s,false)}catch(e){}return normalizeDB(clone(SEED),true)})();
DB.glucoseReadings||=[];
DB.weightReadings||=[];
DB.stepDone||={};

/* 存储探针（Q8）：启动时写-读-删一个测试键，失败则记为不可用，绝不静默丢数据 */
const storeProbe=(()=>{try{const k="__uw_probe__";localStorage.setItem(k,"1");const ok=localStorage.getItem(k)==="1";localStorage.removeItem(k);return ok}catch(e){return false}})();
let persistState="unknown",persistAsked=false;
async function requestPersist(){if(persistAsked)return;persistAsked=true;try{if(navigator.storage&&navigator.storage.persist){persistState=await navigator.storage.persist()?"granted":"declined"}else persistState="unsupported"}catch(e){persistState="error"}}
let saveFailed=false;
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(DB));saveFailed=false;requestPersist()}catch(e){if(!saveFailed){saveFailed=true;toast("这次没存上：浏览器不允许存储或空间不足。屏幕上的内容还在，换个浏览器或清出空间后再试一次。")}}};
function applyPrefs(){const dark=prefs.theme==="dark"||(prefs.theme==="auto"&&matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.dataset.theme=dark?"dark":"light";document.documentElement.dataset.size=prefs.size;try{localStorage.setItem(PREF,JSON.stringify(prefs))}catch(e){}syncRM()}
/* 减弱动态：系统设置或应用内开关，任一生效即给 html 加 .rm（Q5） */
const RMQ=matchMedia("(prefers-reduced-motion: reduce)");
function motionReduced(){return RMQ.matches||prefs.motion==="reduce"}
function syncRM(){document.documentElement.classList.toggle("rm",motionReduced())}
RMQ.addEventListener?.("change",syncRM);
let prefs=(()=>{try{return Object.assign({theme:"light",size:"md",aiEndpoint:"",motion:"full",recent:[]},JSON.parse(localStorage.getItem(PREF)))}catch(e){return {theme:"light",size:"md",aiEndpoint:"",motion:"full",recent:[]}}})();
matchMedia("(prefers-color-scheme: dark)").addEventListener?.("change",applyPrefs);

/* ================= 附件：IndexedDB（只在本机） ================= */
const FILES=(()=>{let dbp;const open=()=>dbp||(dbp=new Promise((res,rej)=>{const r=indexedDB.open("underwing-files",1);r.onupgradeneeded=()=>r.result.createObjectStore("f");r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)}));
  const tx=async(m,fn)=>{const d=await open();return new Promise((res,rej)=>{const t=d.transaction("f",m);const q=fn(t.objectStore("f"));t.oncomplete=()=>res(q&&q.result);t.onerror=()=>rej(t.error)})};
  return{put:(k,v)=>tx("readwrite",s=>s.put(v,k)),get:k=>tx("readonly",s=>s.get(k)),del:k=>tx("readwrite",s=>s.delete(k)),clear:()=>tx("readwrite",s=>s.clear())}})();
const fileURLs={};
async function loadThumbs(){for(const e of DB.events)for(const f of (e.files||[])){if(fileURLs[f.id])continue;try{const b=await FILES.get(f.id);if(b)fileURLs[f.id]=URL.createObjectURL(b)}catch(_){}}
  document.querySelectorAll("[data-fid]").forEach(el=>{const u=fileURLs[el.dataset.fid];if(u&&el.tagName==="IMG")el.src=u})}

const KIND={
  visit:{label:"就诊",c:"plum",i:"steth"},
  test:{label:"检查",c:"indigo",i:"flask"},
  med:{label:"用药",c:"amber",i:"pill"},
  bp:{label:"血压",c:"steel",i:"heart"},
  glucose:{label:"血糖",c:"amber",i:"drop"},
  weight:{label:"体重",c:"teal",i:"scale"},
  doc:{label:"病历文件",c:"teal",i:"doc"},
  note:{label:"症状",c:"indigo",i:"note"}
};
let state={view:"cards",card:null,filter:"all",libTab:"search",q:"",hub:null,age:"all",sys:"all",chartKind:"bp"};
function pendingCount(){return [...DB.events,...DB.readings,...(DB.glucoseReadings||[]),...(DB.weightReadings||[])].filter(e=>e.status==="pend").length}

(()=>{
"use strict";
const HS=[
{id:"cards",route:"cards",hash:"#/cards",label:"我的卡组",sub:"居家照护行动卡",pos:[-1.08,.46,1.32],cam:[-2.1,1.55,3.85],tgt:[-.45,.62,.45],col:0x255A41,dCol:0x68CEA9},
{id:"hubs",route:"library",tab:"hubs",hash:"#/library?tab=hubs",label:"疾病图谱",sub:"86种疾病配套方案",pos:[1.08,.52,1.32],cam:[2.1,1.6,3.85],tgt:[.45,.65,.45],col:0x1F5E6E,dCol:0x8CC6D7},
{id:"folder",route:"folder",hash:"#/folder",label:"健康夹",sub:"体征走势与复诊单",pos:[-1.58,.58,-.32],cam:[-3.4,1.75,1.55],tgt:[-.6,.65,-.1],col:0x35449C,dCol:0xA8B8FD},
{id:"redlines",route:"cards",action:"redlines",hash:"#/cards",label:"急救红线",sub:"突发红线速查",pos:[1.58,.6,-.32],cam:[3.4,1.75,1.55],tgt:[.6,.65,-.1],col:0xD97A4A,dCol:0xE28E62},
{id:"bedside",route:"card",idOut:"bp",action:"bedside",hash:"#/cards",label:"床旁陪伴",sub:"语音分步伴读",pos:[0,.96,-1.68],cam:[.5,2.2,-4.3],tgt:[0,.78,-.6],col:0xB58324,dCol:0xF5C451}
];
const ZONES={home:{pos:[0,2.35,6.2],tgt:[0,.72,0]}};
for(const h of HS)ZONES[h.id]={pos:h.cam,tgt:h.tgt};
const ALIAS={library:"hubs",settings:"home",card:"cards"},PC=56,CRANE='<path d="M3 14 10 11 13 4 15 9 21 7 15 14 11 19 8 15Z"/><path d="M10 11 15 14"/>';
let active=null;
const D=document,H=D.documentElement;
const rTheme=t=>t==="dark"||t==="light"?t:(H.dataset.theme==="dark"?"dark":(H.dataset.theme==="light"?"light":(matchMedia?.("(prefers-color-scheme: dark)").matches?"dark":"light")));
const rRM=v=>typeof v==="boolean"?v:H.classList.contains("rm")||Boolean(matchMedia?.("(prefers-reduced-motion: reduce)").matches);
const mkEl=(t,c,txt)=>{const n=D.createElement(t);if(c)n.className=c;if(txt)n.textContent=txt;return n;};
const svgEl=(t,a)=>{const n=D.createElementNS("http://www.w3.org/2000/svg",t);for(const k in a)n.setAttribute(k,a[k]);return n;};
const disp=(r,txs)=>{r?.traverse(o=>{o.geometry?.dispose?.();if(o.material)for(const m of(Array.isArray(o.material)?o.material:[o.material])){for(const k in m)m[k]?.isTexture&&m[k].dispose?.();m.dispose?.();}});for(const t of txs)t?.dispose?.();};

function createCtrl(el,opts){
const T=window.THREE,OC=T?.OrbitControls||window.THREE_ADDONS?.OrbitControls||null;
let dead=0,webgl=false,theme=rTheme(opts.theme),rm=rRM(opts.reducedMotion),uSusp=Boolean(opts.suspended),dHid=Boolean(D.hidden),lost=false,inRen=0;
let zone="home",frames=0,raf=0,lastTs=0,tClock=0,tw=null,hovId=null,down=null,tapMs=-999;
let cvs=null,tip=null,fb=null,ren=null,scn=null,cam=null,orb=null,ro=null,mo=null,rmq=null,texs=[];
let lH,lK,lR,mPl,mPd,mIn,mH1,mH2,mGl,mP,pMesh,crane,wL,wR,h1,h2;
const pData=[],hits=[],hsList=[],offs=[];
const ray=T?new T.Raycaster():null,ndc=T?new T.Vector2():null,tmpO=T?new T.Object3D():null,tmpV=T?new T.Vector3():null;
const on=(t,e,f)=>{t.addEventListener(e,f);offs.push(()=>t.removeEventListener(e,f));};
const susp=()=>Boolean(uSusp||dHid||lost),pay=h=>({route:h.route,id:h.idOut||h.id,zone:h.id,tab:h.tab,action:h.action,hash:h.hash,label:h.label});

el.classList.add("scene3d");if(opts.fixed)el.classList.add("scene3d--fixed");el.dataset.sceneTheme=theme;

function showFB(){
el.classList.add("scene3d--fallback");if(fb)return;
fb=mkEl("div","scene3d-fallback");const halo=mkEl("div","scene3d-fallback-halo");
const svg=svgEl("svg",{class:"scene3d-crane-svg",viewBox:"0 0 24 24","aria-hidden":"true"});
if(D.getElementById("i-crane"))svg.appendChild(svgEl("use",{href:"#i-crane"}));else svg.innerHTML=CRANE;
halo.appendChild(svg);fb.append(halo,mkEl("div","scene3d-fallback-label","鹤伴 · 翼下守护空间"));el.appendChild(fb);
}
function hideFB(){el.classList.remove("scene3d--fallback");fb?.parentNode?.removeChild(fb);fb=null;}
function poseFor(zKey){
const z=ZONES[zKey]||ZONES.home,a=Math.max(1,el.clientWidth||innerWidth||1)/Math.max(1,el.clientHeight||innerHeight||1);
const s=a<1?(zKey==="home"?1.32:1.18):1,yo=a<1&&zKey==="home"?.35:0;
return{pos:[z.pos[0]*s,z.pos[1]*(a<1?1.12:1)+yo,z.pos[2]*s],tgt:[z.tgt[0],z.tgt[1]-(a<1?.12:0),z.tgt[2]]};
}
function applyTheme(){
const dk=theme==="dark";el.dataset.sceneTheme=theme;if(!webgl||!scn)return;
const p=dk?[0xC7E5DA,0x16201B,.95,0xD8EFE5,1.75,0x68CEA9,1.05,0x1B241F,0x222D27,0x68CEA9,0x68CEA9,0x8CC6D7,.34,0x80E0B8,.78]
:[0xF4F8F2,0xCAD8CC,1.15,0xFFFDF7,2.15,0x80C776,.78,0xE5ECE5,0xEEF3ED,0x255A41,0x5FA886,0x80C776,.42,0x4C8C6B,.62];
lH.color.setHex(p[0]);lH.groundColor.setHex(p[1]);lH.intensity=p[2];lK.color.setHex(p[3]);lK.intensity=p[4];lR.color.setHex(p[5]);lR.intensity=p[6];
mPl.color.setHex(p[7]);mPd.color.setHex(p[8]);mIn.color.setHex(p[9]);mH1.color.setHex(p[10]);mH2.color.setHex(p[11]);mGl.opacity=p[12];
mP.color.setHex(p[13]);mP.opacity=p[14];mP.blending=dk?T.AdditiveBlending:T.NormalBlending;mP.needsUpdate=true;
for(const e of hsList){const c=dk?e.hs.dCol:e.hs.col;e.cMat.color.setHex(c);e.rMat.color.setHex(c);}
renderOnce();
}
function updPose(t){
if(!crane)return;
const b=Math.sin(t*1.15);crane.position.y=b*.032;wL.rotation.z=.04+b*.032;wR.rotation.z=-.04-b*.032;h1.rotation.z=t*.05;h2.rotation.z=-t*.035;
for(let i=0;i<hsList.length;i++){const e=hsList[i];e.ring.scale.setScalar(e.hs.id===zone||e.hs.id===hovId?1.18:.96+.04*Math.sin(t*1.8+i));e.core.rotation.y=t*.65+i;}
if(pMesh&&cam){
for(let i=0;i<PC;i++){const d=pData[i],ang=d.a+t*d.va,rad=d.r+Math.sin(t*.7+d.p)*.08;tmpO.position.set(Math.cos(ang)*rad,.28+((d.y+t*d.vy)%2.85),Math.sin(ang)*rad);tmpO.quaternion.copy(cam.quaternion);tmpO.scale.setScalar(d.s*(.85+.15*Math.sin(t*1.4+d.p)));tmpO.updateMatrix();pMesh.setMatrixAt(i,tmpO.matrix);}
pMesh.instanceMatrix.needsUpdate=true;
}
}
function renderOnce(){if(dead||!webgl||lost||!ren||!scn||!cam||inRen)return;inRen=1;try{orb?.update();ren.render(scn,cam);frames++;}finally{inRen=0;}}
function stopRAF(){if(raf){cancelAnimationFrame(raf);raf=0;}lastTs=0;}
const needLoop=()=>!dead&&webgl&&!susp()&&(!rm||Boolean(tw));
function tick(ts){
raf=0;if(!needLoop())return;
const dt=lastTs?Math.min(.05,Math.max(0,(ts-lastTs)/1000)):.016;lastTs=ts;
if(tw&&cam&&orb){tw.t=Math.min(1,tw.t+dt/.68);const u=1-Math.pow(1-tw.t,3);cam.position.lerpVectors(tw.p0,tw.p1,u);orb.target.lerpVectors(tw.t0,tw.t1,u);if(tw.t>=1)tw=null;}
if(!rm){tClock+=dt;updPose(tClock);}
renderOnce();if(needLoop())raf=requestAnimationFrame(tick);
}
const ensureRAF=()=>{if(!raf&&needLoop()){lastTs=0;raf=requestAnimationFrame(tick);}};
function resize(){
if(dead||!webgl||!ren||!cam)return;
const r=el.getBoundingClientRect(),w=Math.floor(r.width),h=Math.floor(r.height);if(w<2||h<2)return;
const a=w/h;cam.fov=a<1?Math.min(60,42+(1-a)*28):42;cam.aspect=a;cam.updateProjectionMatrix();
ren.setPixelRatio(Math.min(devicePixelRatio||1,2));ren.setSize(w,h,false);renderOnce();
}
function pick(cx,cy){
if(!webgl||!cvs||!ray||!cam)return null;
const r=cvs.getBoundingClientRect();if(r.width<2||r.height<2)return null;
ndc.set(((cx-r.left)/r.width)*2-1,-((cy-r.top)/r.height)*2+1);
ray.setFromCamera(ndc,cam);const res=ray.intersectObjects(hits,false);
return res.length?res[0].object.userData.hs:null;
}
function setHover(hs,cx,cy){
const id=hs?hs.id:null;
if(hs&&tip&&cvs){
if(hovId!==id){tip.innerHTML="";tip.append(D.createTextNode(hs.label),mkEl("small",0,hs.sub));}
const r=el.getBoundingClientRect(),hw=Math.max(64,Math.ceil((tip.offsetWidth||120)/2)+8);
tmpV.set(hs.pos[0],hs.pos[1]+.34,hs.pos[2]).project(cam);
tip.style.left=Math.max(hw,Math.min(r.width-hw,(tmpV.x*.5+.5)*r.width))+"px";
tip.style.top=Math.max(44,Math.min(r.height-24,(-tmpV.y*.5+.5)*r.height))+"px";
tip.classList.add("is-visible");
}else tip?.classList.remove("is-visible");
el.style.cursor=hs?"pointer":"grab";
if(hovId!==id){hovId=id;opts.onHoverChange?.(hs?Object.assign(pay(hs),{screenX:cx,screenY:cy}):null);if(rm)renderOnce();}
}
function build(){
const {Group:Gr,Mesh:Me,MeshStandardMaterial:MS,MeshBasicMaterial:MB,CylinderGeometry:CG,TorusGeometry:TG,PlaneGeometry:PG,BufferGeometry:BG,BufferAttribute:BA,CanvasTexture:CT}=T;
const mat=(c,o)=>new MS(Object.assign({color:c,roughness:.36,metalness:.06},o));
const flat=(c,r,d)=>mat(c,{roughness:r,metalness:.04,flatShading:true,side:d?T.DoubleSide:T.FrontSide});
const addM=(p,g,m,x,y,z)=>{const o=new Me(g,m);if(x!==undefined)o.position.set(x,y,z);p.add(o);return o;};
const mkPoly=(pts,tris,m)=>{const p=new Float32Array(tris.length*3);for(let i=0;i<tris.length;i++){const v=tris[i]*3;p[i*3]=pts[v];p[i*3+1]=pts[v+1];p[i*3+2]=pts[v+2];}const g=new BG();g.setAttribute("position",new BA(p,3));g.computeVertexNormals();return new Me(g,m);};
const gradTex=(sz,st)=>{const c=mkEl("canvas");c.width=c.height=sz;const x=c.getContext("2d");if(x){const g=x.createRadialGradient(sz/2,sz/2,1,sz/2,sz/2,sz/2);for(const [a,b]of st)g.addColorStop(a,b);x.fillStyle=g;x.fillRect(0,0,sz,sz);}const t=new CT(c);t.colorSpace=T.SRGBColorSpace;t.needsUpdate=true;texs.push(t);return t;};

scn=new T.Scene();const sp=poseFor("home");
cam=new T.PerspectiveCamera(42,1,.1,50);cam.position.set(...sp.pos);
lH=new T.HemisphereLight(0xF4F8F2,0xCAD8CC,1.15);lK=new T.DirectionalLight(0xFFFDF7,2.15);lK.position.set(3.6,5.4,4.2);lR=new T.DirectionalLight(0x80C776,.78);lR.position.set(-3.4,2.8,-3.6);
scn.add(lH,lK,lR);

const dais=new Gr();
mPl=mat(0xE5ECE5,{roughness:.78,metalness:.04});mPd=mat(0xEEF3ED,{roughness:.56});mIn=mat(0x255A41,{roughness:.42,metalness:.12});
addM(dais,new CG(2.02,2.12,.09,44),mPl,0,.045,0);addM(dais,new CG(.74,.84,.11,32),mPd,0,.145,0);
addM(dais,new TG(1.48,.02,8,56),mIn,0,.095,0).rotation.x=Math.PI/2;
mGl=new MB({map:gradTex(128,[[0,"rgba(128,199,118,.55)"],[.55,"rgba(104,206,169,.18)"],[1,"rgba(104,206,169,0)"]]),transparent:true,opacity:.42,depthWrite:false});
addM(dais,new PG(4.4,4.4),mGl,0,.004,0).rotation.x=-Math.PI/2;
mH1=mat(0x5FA886,{metalness:.2,transparent:true,opacity:.65});mH2=mat(0x80C776,{metalness:.2,transparent:true,opacity:.48});
h1=addM(dais,new TG(1.86,.011,8,64),mH1,0,.62,0);h1.rotation.set(Math.PI*.46,.12,0);
h2=addM(dais,new TG(2.08,.009,8,64),mH2,0,.72,0);h2.rotation.set(Math.PI*.54,-.14,0);
scn.add(dais);

crane=new Gr();
const mPo=flat(0xFAF7F0,.32,1),mWm=flat(0xEFE9DC,.38,1),mJd=flat(0x255A41,.42,1),mCe=flat(0x80C776,.36,1),mCr=flat(0xDC8E74,.4),mSl=flat(0x4C5852,.45);
mCr.emissive.setHex(0x3C241B);mCr.emissiveIntensity=.25;
const bp=[0,.8,.42,0,.56,.06,-.2,.88,.06,.2,.88,.06,0,.96,-.02,0,.74,-.44,-.14,.88,-.56,.14,.88,-.56,0,1.12,-.84];
crane.add(mkPoly(bp,[0,1,2,0,3,1,0,2,4,0,4,3,1,5,2,1,3,5,2,5,4,4,5,3],mPo),mkPoly(bp,[4,6,8,4,8,7,5,8,6,5,7,8],mWm),mkPoly([0,.94,-.08,-.09,.92,-.46,.09,.92,-.46,0,1.1,-.78],[0,1,3,0,3,2],mCe));
crane.add(mkPoly([-.06,.78,.34,.06,.78,.34,0,.9,.24,-.05,1.12,.44,.05,1.12,.44,0,1.16,.34,-.04,1.44,.36,.04,1.44,.36,0,1.44,.28],[0,1,3,1,4,3,1,2,4,2,5,4,2,0,5,0,3,5,3,4,6,4,7,6,4,5,7,5,8,7,5,3,8,3,6,8],mPo));
crane.add(mkPoly([-.05,1.44,.35,.05,1.44,.35,0,1.56,.39,0,1.49,.56,0,1.44,.27],[0,1,3,0,3,2,1,2,3,0,2,4,1,4,2,0,4,1],mPo));
crane.add(mkPoly([-.035,1.54,.37,.035,1.54,.37,0,1.6,.42,0,1.56,.32],[0,1,2,0,2,3,1,3,2],mCr),mkPoly([-.025,1.47,.53,.025,1.47,.53,0,1.51,.54,0,1.42,.82],[0,1,3,0,3,2,1,2,3],mSl));
const mkW=s=>{const g=new Gr();g.position.set(s*.17,.89,.06);g.add(mkPoly([0,0,.08,0,-.04,-.22,s*.42,.3,.12,s*.88,.4,-.02,s*.5,.02,-.34,s*1.34,.08,-.22,s*1.08,-.22,.18],[0,2,1,2,4,1,2,3,4,3,5,4,3,6,5],mPo),mkPoly([s*.04,-.03,.06,s*.4,.25,.1,s*.84,.34,-.02,s*.48,-.01,-.31,s*1.04,-.23,.15],[0,1,3,1,2,3,2,4,3],mJd),mkPoly([s*.88,.4,-.02,s*1.34,.08,-.22,s*1.08,-.22,.18],[0,1,2],mCe));return g;};
wL=mkW(-1);wR=mkW(1);const legG=new CG(.018,.015,.42,6);
crane.add(wL,wR);addM(crane,legG,mSl,-.1,.39,-.02);addM(crane,legG,mSl,.1,.39,-.02);scn.add(crane);

mP=new MB({map:gradTex(64,[[0,"rgba(255,255,255,1)"],[.45,"rgba(255,255,255,.45)"],[1,"rgba(255,255,255,0)"]]),color:0x4C8C6B,transparent:true,opacity:.62,depthWrite:false});
pMesh=new T.InstancedMesh(new PG(.11,.11),mP,PC);
for(let i=0;i<PC;i++)pData.push({a:(i/PC)*Math.PI*2+(i%5)*.3,r:1.05+(i%7)*.24,y:(i*.19)%2.85,vy:.05+(i%4)*.018,va:(i%2?1:-1)*(.06+(i%5)*.015),s:.65+(i%4)*.25,p:i*.7});
scn.add(pMesh);

const sG=new CG(.012,.012,.28,6),cG=new T.OctahedronGeometry(.1,0),rG=new TG(.19,.016,8,28),hG=new T.SphereGeometry(.35,8,8),hM=new MB({visible:false}),sM=mat(0x8AA094,{roughness:.5,transparent:true,opacity:.65});
for(const hs of HS){
const g=new Gr();g.position.set(...hs.pos);
const cMat=mat(hs.col,{roughness:.28,metalness:.12}),rMat=mat(hs.col,{roughness:.3,metalness:.15,transparent:true,opacity:.85});
addM(g,sG,sM,0,-.18,0);const core=addM(g,cG,cMat),ring=addM(g,rG,rMat),hit=addM(g,hG,hM);
ring.rotation.x=Math.PI/2;hit.userData.hs=hs;scn.add(g);hits.push(hit);hsList.push({hs,core,ring,cMat,rMat});
}
}

function initRen(){
if(opts.forceFallback||!T||typeof T.WebGLRenderer!=="function"||!OC){showFB();return;}
cvs=mkEl("canvas","scene3d-canvas");cvs.setAttribute("aria-hidden","true");
let gl=null;try{gl=cvs.getContext("webgl2",{alpha:true,antialias:true,powerPreference:"default"});}catch(_){gl=null;}
if(!gl||gl.isContextLost?.()){cvs=null;showFB();return;}
try{ren=new T.WebGLRenderer({canvas:cvs,alpha:true,antialias:true,powerPreference:"default"});}catch(_){ren=null;cvs=null;showFB();return;}
webgl=true;tip=mkEl("div","scene3d-tip");el.append(cvs,tip);
ren.setPixelRatio(Math.min(devicePixelRatio||1,2));ren.outputColorSpace=T.SRGBColorSpace;ren.toneMapping=T.ACESFilmicToneMapping;ren.toneMappingExposure=1.05;
build();
orb=new OC(cam,cvs);orb.enableDamping=!rm;orb.dampingFactor=.06;orb.enablePan=false;orb.minDistance=3.4;orb.maxDistance=11.2;orb.minPolarAngle=.34;orb.maxPolarAngle=Math.PI*.47;orb.autoRotate=!rm;orb.autoRotateSpeed=.35;
const sp=poseFor("home");cam.position.set(...sp.pos);orb.target.set(...sp.tgt);orb.update();
on(orb,"start",()=>{tw=null;});on(orb,"change",()=>{if(rm&&!raf)renderOnce();});
on(cvs,"pointerdown",e=>{down={id:e.pointerId,x:e.clientX,y:e.clientY,m:0};});
on(cvs,"pointermove",e=>{if(down&&e.pointerId===down.id)down.m=Math.max(down.m,Math.hypot(e.clientX-down.x,e.clientY-down.y));setHover(pick(e.clientX,e.clientY),e.clientX,e.clientY);});
on(cvs,"pointerup",e=>{
const d=down;down=null;if(!d||d.id!==e.pointerId||(e.pointerType==="mouse"&&e.button!==0))return;
if(Math.hypot(e.clientX-d.x,e.clientY-d.y)>=6||d.m>=6){tapMs=performance.now();return;}
const hs=pick(e.clientX,e.clientY);if(hs){tapMs=performance.now();ctrl.focusZone(hs.id);opts.onHotspotSelect?.(pay(hs));}
});
on(cvs,"pointercancel",()=>{if(down&&down.m>=6)tapMs=performance.now();down=null;setHover(null);});
on(cvs,"pointerleave",()=>{down=null;setHover(null);});
on(cvs,"click",e=>{if(performance.now()-tapMs<250)return;const hs=pick(e.clientX,e.clientY);if(hs){ctrl.focusZone(hs.id);opts.onHotspotSelect?.(pay(hs));}});
on(cvs,"webglcontextlost",e=>{e.preventDefault();lost=true;stopRAF();showFB();});
on(cvs,"webglcontextrestored",()=>{lost=false;hideFB();resize();ensureRAF();});
if(typeof ResizeObserver==="function"){ro=new ResizeObserver(resize);ro.observe(el);}
on(window,"resize",resize);updPose(0);applyTheme();resize();ensureRAF();
}

on(D,"visibilitychange",()=>{dHid=Boolean(D.hidden);if(susp())stopRAF();else{if(rm)renderOnce();ensureRAF();}});
if(opts.syncDocument!==false){
if(typeof MutationObserver==="function"){mo=new MutationObserver(muts=>{if(opts.theme==null&&muts.some(m=>m.attributeName==="data-theme"))ctrl.setTheme(rTheme());if(opts.reducedMotion==null&&muts.some(m=>m.attributeName==="class"))ctrl.setReducedMotion(rRM());});mo.observe(H,{attributes:true,attributeFilter:["data-theme","class"]});}
rmq=matchMedia?.("(prefers-reduced-motion: reduce)");rmq?.addEventListener&&on(rmq,"change",()=>{if(opts.reducedMotion==null)ctrl.setReducedMotion(rRM());});
}

const ctrl={
get webgl(){return webgl;},
setTheme(t){if(!dead){theme=t==="dark"?"dark":"light";applyTheme();}},
setReducedMotion(v){if(dead)return;rm=Boolean(v);if(orb){orb.autoRotate=!rm;orb.enableDamping=!rm;}if(rm){if(tw&&cam&&orb){cam.position.copy(tw.p1);orb.target.copy(tw.t1);tw=null;}stopRAF();renderOnce();}else ensureRAF();},
focusZone(z){
if(dead)return;const k=Object.hasOwn(ALIAS,z)?ALIAS[z]:z;zone=Object.hasOwn(ZONES,k)?k:"home";if(!webgl||!cam||!orb)return;
const p=poseFor(zone),p1=new T.Vector3(...p.pos),t1=new T.Vector3(...p.tgt);
if(rm||susp()){tw=null;cam.position.copy(p1);orb.target.copy(t1);updPose(tClock);renderOnce();}
else{tw={t:0,p0:cam.position.clone(),p1,t0:orb.target.clone(),t1};ensureRAF();}
},
setSuspended(h){if(!dead){uSusp=Boolean(h);if(susp())stopRAF();else{if(rm)renderOnce();ensureRAF();}}},
getState(){return{webgl,zone,theme,reducedMotion:rm,suspended:susp(),hotspotCount:HS.length,frameCount:frames};},
destroy(){
if(dead)return;dead=1;stopRAF();ro?.disconnect();mo?.disconnect();ro=mo=null;
for(const fn of offs)fn();offs.length=0;orb?.dispose?.();disp(scn,texs);texs=[];ren?.dispose?.();
cvs?.parentNode?.removeChild(cvs);tip?.parentNode?.removeChild(tip);hideFB();
el.classList.remove("scene3d--fixed");el.style.cursor="";delete el.dataset.sceneTheme;
if(active===ctrl)active=null;
}
};
initRen();return ctrl;
}

window.UnderwingScene={
init(el,opts={}){if(active)active.destroy();const n=typeof el==="string"?D.querySelector(el):(el?.nodeType===1?el:null);if(!n)return{webgl:false,destroy(){}};const c=active=createCtrl(n,opts||{});return{webgl:c.webgl,destroy:()=>c.destroy()};},
setTheme(t){active?.setTheme(t);},setReducedMotion(e){active?.setReducedMotion(e);},focusZone(z){active?.focusZone(z);},setSuspended(h){active?.setSuspended(h);},
getState(){return active?active.getState():{webgl:false,zone:"home",theme:rTheme(),reducedMotion:rRM(),suspended:false,hotspotCount:HS.length,frameCount:0};}
};
})();

const $id=id=>document.getElementById(id),qs=s=>document.querySelector(s),qsa=s=>document.querySelectorAll(s);
const DEFAULT_AGE_BANDS=[{id:"all",label:"全部年龄"},{id:"0-5",label:"0–5岁"},{id:"6-17",label:"6–17岁"},{id:"18-44",label:"18–44岁"},{id:"45-59",label:"45–59岁"},{id:"60+",label:"60+岁"}];
const _b=(c,a,t)=>`<button type="button" class="btn ${c}" ${a}>${t}</button>`;
const _i=(s,a="")=>`<img src="${s}" alt="${a}" loading="lazy" decoding="async">`;
const getAgeBands=()=>typeof AGE_BANDS!=="undefined"&&Array.isArray(AGE_BANDS)?AGE_BANDS:DEFAULT_AGE_BANDS;
const getHubsAll=()=>typeof DISEASE_HUBS!=="undefined"&&Array.isArray(DISEASE_HUBS)?DISEASE_HUBS:[];
const diseaseArt=slug=>typeof DISEASE_ART==="function"?DISEASE_ART(slug):"assets/art/disease/"+slug+".webp";
const findHub=id=>!id?null:(typeof hubById==="function"?hubById(id):getHubsAll().find(h=>h.id===id||h.artSlug===id)||null);
function queryHubs({q="",age="all",g="all"}={}){
if(typeof filterHubs==="function")return filterHubs({q,age,g,sys:g});
const kw=String(q||"").trim().toLowerCase();
return getHubsAll().filter(h=>(!age||age==="all"||(h.ages||[]).includes(age))&&(!g||g==="all"||h.g===g)&&(!kw||[h.name,h.alias||"",h.scopeNote||"",...(h.callouts||[])].join(" ").toLowerCase().includes(kw)));
}
function formatHubAges(ages){
const bands=getAgeBands();if(!ages||!ages.length||ages.length>=5)return "全年龄段适用";
const map=Object.fromEntries(bands.map(b=>[b.id,b.label]));return ages.map(a=>map[a]||a).join(" · ");
}
function suggestedFor(condIds){
const m=new Map();
(condIds||[]).forEach(id=>{const c=condById(id);if(!c)return;(c.cards||[]).forEach(k=>{if(!CARDS[k])return;if(!m.has(k))m.set(k,[]);m.get(k).push(c.name)})});
GENERAL.forEach(k=>{if(CARDS[k]&&!m.has(k))m.set(k,["任何慢病都用得上"])});
return m;
}
function search(q){
q=(q||"").trim().toLowerCase();if(!q)return{conds:[],cards:[],hubs:[]};
const conds=CONDITIONS.filter(c=>(c.name+" "+(c.alias||"")).toLowerCase().includes(q)||(c.alias||"").split(" ").some(a=>a&&q.includes(a.toLowerCase()))||q.includes(c.name.replace(/[（）() \/]/g,"").slice(0,3)));
const cards=Object.entries(CARDS).filter(([k,c])=>(c.title+(c.sub||"")+(c.desc||"")+(c.tags||[]).join(" ")).toLowerCase().includes(q)).map(([k])=>k);
return{conds,cards,hubs:queryHubs({q,age:"all",g:"all"})};
}
function renderSide(){
const dh=$id("deskHud");
if(dh&&!dh.dataset.init){
dh.dataset.init="1";
dh.innerHTML=`<span class="hud-lbl">${I("compass")}鹤翼空间</span>${[["home","全景"],["cards","卡组"],["hubs","图谱"],["folder","健康夹"]].map(([z,l])=>`<button type="button" class="hud-pill" data-zone="${z}" aria-pressed="false">${l}</button>`).join("")}<button type="button" class="hud-pill hud-peek" id="deskPeekBtn" data-act="toggle-sanctuary" aria-pressed="false">${I("eye")}<span>沉浸 3D</span></button>`;
}
const side=$id("iosSidebar");
if(side&&!side.dataset.init){
side.dataset.init="1";
side.innerHTML=`<div class="brandrow"><div class="logo"><img src="${ART.mascot}" alt="鹤伴吉祥物" decoding="async"></div><div class="brand"><b>鹤伴</b><em>Underwing</em><span>把居家照护，护在翼下</span></div></div>
${_b("btn-primary block",'data-act="addbp"',I("plus")+"记录血压")}
<div class="side-quick" role="group" aria-label="快捷记录">${_b("sm",'data-act="addglucose"',I("drop")+"血糖")}${_b("sm",'data-act="addweight"',I("scale")+"体重")}${_b("sm",'data-act="clinicsheet"',I("clip")+"复诊单")}</div>
${_b("sm block redline-btn",'data-act="redlines"',`<span class="rl-ico" data-stop>${I("alert")}</span>突发状况 · 红线速查`)}
<button type="button" class="sitem" data-nav="cards" id="sideHome"><span class="av" style="background:var(--brand-t);color:var(--brand)">${I("cards")}</span><span><b>我的卡组</b><small id="deckCount"></small></span></button>
<button type="button" class="sitem" data-nav="library" data-tab="hubs" id="sideHubs"><span class="av" style="background:var(--amber-t);color:var(--amber)">${I("layers")}</span><span><b>照护图谱</b><small>86 种疾病配套卡</small></span></button>
<button type="button" class="sitem" data-nav="library" data-tab="search" id="sideLib"><span class="av" style="background:var(--steel-t);color:var(--steel)">${I("search")}</span><span><b>找照护卡</b><small>按病名搜 · 48 常见情况</small></span></button>
<div class="side-lbl">卡组</div><div id="sideCards"></div><div class="side-lbl">健康夹</div><div id="sidePerson"></div>
<div class="side-foot"><button type="button" class="sitem" data-nav="settings"><span class="av" style="background:var(--indigo-t);color:var(--indigo)">${I("gear")}</span><span><b>设置与隐私</b><small>外观 · 字号 · 备份</small></span></button><span class="demo">演示版 · 人物与读数均为虚构</span></div>`;
}
const deckValid=DB.deck.filter(k=>CARDS[k]),dc=$id("deckCount"),sc=$id("sideCards"),p=pendingCount(),sp=$id("sidePerson");
if(dc)dc.textContent=`${deckValid.length} 张卡 · ${DB.myConds.length+DB.customConds.length} 个情况`;
if(sc)sc.innerHTML=deckValid.map(k=>{const c=CARDS[k];return `<button type="button" class="sitem" data-card="${k}" aria-current="${state.view==="card"&&state.card===k}"><span class="av">${_i(ART[c.art]||ART.bp)}</span><span><b>${esc(c.title)}</b><small>${esc(c.ready?c.sub:"编写中")}</small></span></button>`}).join("")||'<p class="muted" style="padding:0 10px">还没有卡，去「照护图谱」加几张。</p>';
if(sp)sp.innerHTML=`<button type="button" class="sitem" data-nav="folder" aria-current="${state.view==="folder"}"><span class="av" style="background:var(--teal-t);color:var(--teal);font-family:var(--serif);font-weight:700">${esc(DB.person.initial)}</span><span><b>${esc(DB.person.name)}<span class="fict">虚构</span></b><small>${p?p+" 条待核对":"全部已确认"}</small></span></button>`;
$id("sideHome")?.setAttribute("aria-current",String(state.view==="cards"));
$id("sideLib")?.setAttribute("aria-current",String(state.view==="library"&&state.libTab!=="hubs"));
$id("sideHubs")?.setAttribute("aria-current",String(state.view==="library"&&state.libTab==="hubs"));
qs('.side-foot [data-nav="settings"]')?.setAttribute("aria-current",String(state.view==="settings"));
qsa(".mtab").forEach(t=>t.setAttribute("aria-current",String(t.dataset.nav===state.view||(t.dataset.nav==="cards"&&state.view==="card"))));
}
function cardTile(k,{inDeck,why}={}){
const c=CARDS[k];if(!c)return "";
const acts=inDeck?(c.ready?_b("sm btn-primary",`data-card="${k}"`,I("open")+"打开")+_b("sm btn-ghost",`data-undeck="${k}"`,"移出"):_b("sm btn-ghost",`data-undeck="${k}"`,"移出")):_b("sm btn-primary",`data-deck="${k}"`,I("plus")+"加入卡组")+(c.ready?_b("sm btn-ghost",`data-card="${k}"`,"打开看看"):"");
return `<div class="tilecell">${why?`<p class="whyfor">适合：${esc(why)}</p>`:""}${tcg(k,{actions:acts})}</div>`;
}
function hubCardHTML(h,isOpen){
const grp=GROUPS[h.g]||["常见情况","teal"],subs=(h.subCards||[]).filter(k=>CARDS[k]);
return `<article class="hub-card ${isOpen?"is-open":""}"><button type="button" class="hub-card-btn" data-hub="${esc(h.id)}" aria-expanded="${isOpen}"><div class="hub-top"><span class="hub-sys"><i class="gdot" style="background:var(--${grp[1]})"></i>${esc(grp[0])}</span><span class="tno">No.${pad(h.no)}</span></div><div class="hub-art">${_i(diseaseArt(h.artSlug),esc(h.name)+"居家照护要点信息图")}</div><div class="hub-body"><h3>${esc(h.name)}</h3><div class="hub-ages">${esc(formatHubAges(h.ages))}</div></div><div class="hub-foot"><span>${isOpen?"收起配套照护卡":`展开 ${subs.length} 张配套卡`}</span>${I(isOpen?"chevron-up":"chevron-down")}</div></button></article>`;
}
function hubStageHTML(h){
const grp=GROUPS[h.g]||["常见情况","teal"],subKeys=((h.subCards&&h.subCards.length)?h.subCards:GENERAL).filter(k=>CARDS[k]),missing=subKeys.filter(k=>!DB.deck.includes(k)),callouts=h.callouts||[];
return `<section class="hub-stage" aria-label="${esc(h.name)}居家照护图谱与配套卡"><div class="hub-stage-overview"><div class="hub-stage-art">${_i(diseaseArt(h.artSlug),esc(h.name)+"居家照护信息图（含5项核对要点）")}</div><div class="hub-stage-info"><div class="hub-stage-title"><div><span class="hub-sys"><i class="gdot" style="background:var(--${grp[1]})"></i>${esc(grp[0])} · 图谱 No.${pad(h.no)}</span><h2>${esc(h.name)}</h2></div></div>${callouts.length?`<ul class="hub-callouts" aria-label="图谱核对要点">${callouts.map(c=>`<li><i aria-hidden="true"></i><span>${esc(c)}</span></li>`).join("")}</ul>`:""}<div class="hub-notes"><span><b>适用年龄段：</b>${esc(formatHubAges(h.ages))}</span>${h.sexNote?`<span><b>人群与性别提示：</b>${esc(h.sexNote)}</span>`:""}</div>${h.scopeNote?`<p class="muted" style="margin:0">${esc(h.scopeNote)}</p>`:""}<div class="hub-stage-acts">${_b(`sm ${missing.length?"btn-primary":""}`,`data-deckbatch="${esc(subKeys.join(","))}"`,missing.length?`${I("plus")}一键加入本病照护卡（${missing.length} 张未在卡组）`:`${I("check")}本病 ${subKeys.length} 张配套卡均已在卡组`)}<span class="muted">点下方卡片可翻面看原理或逐步核对</span></div></div></div><div class="fan-section"><div class="fan-head"><h3>本病配套照护卡（${subKeys.length} 张）</h3><span class="muted">一张卡一件事：测量 · 给药 · 护理 · 复诊</span></div><div class="fan-deck">${subKeys.map(k=>`<div class="fan-item">${cardTile(k,{inDeck:DB.deck.includes(k)})}</div>`).join("")}</div></div></section>`;
}
function hubGridWithStageHTML(hubs,activeHub){
if(!hubs.length)return `<div class="empty"><p>当前筛选条件下没有匹配的疾病照护图谱。可在上方切换「全部年龄」或「全部系统」查看。</p></div>`;
const inList=activeHub&&hubs.some(h=>h.id===activeHub.id);
return `${activeHub&&!inList?`<div class="mt-sm">${hubStageHTML(activeHub)}</div>`:""}<div class="hub-grid">${hubs.map(h=>{const open=!!(activeHub&&activeHub.id===h.id);return hubCardHTML(h,open)+(open?hubStageHTML(h):"")}).join("")}</div>`;
}
function cardsHTML(){
const conds=[...DB.myConds.map(id=>condById(id)?.name).filter(Boolean),...DB.customConds],deckKeys=DB.deck.filter(k=>CARDS[k]),sug=suggestedFor(DB.myConds),missing=[...sug.keys()].filter(k=>CARDS[k]&&!deckKeys.includes(k)),recents=(prefs.recent||[]).filter(k=>CARDS[k]&&!deckKeys.includes(k));
const quickQs=[["量血压","量血压"],["低血糖","低血糖"],["摔倒","防跌倒"],["轮椅","轮椅转移"],["吸入剂","吸入剂"],["眼药水","滴眼药水"],["胰岛素","胰岛素笔"]];
let secNo=1;const idx=()=>`<span class="sec-idx">${pad(secNo++)}</span>`;
return `<section class="ios-hero" aria-label="我的卡组概览"><div class="ios-hero-top"><h1>我的卡组</h1><span class="ios-hero-meta">已备 ${deckKeys.length} 张 · 关注 ${conds.length} 项</span></div><p class="lead">只放家里用得上的照护卡。每张卡只讲一件事：准备什么、怎么做、哪里易错，以及何时联系医护。</p><div class="ios-quick-strip" role="group" aria-label="快捷记录与应急工具">${_b("sm btn-primary",'data-act="addbp"',I("heart")+"记血压")}${_b("sm",'data-act="addglucose"',I("drop")+"记血糖")}${_b("sm",'data-act="addweight"',I("scale")+"记体重")}${_b("sm",'data-act="clinicsheet"',I("clip")+"复诊单")}${_b("sm redline-btn",'data-act="redlines"',`<span class="rl-ico" data-stop>${I("alert")}</span>红线速查`)}${_b("sm",'data-nav="library" data-tab="hubs"',I("layers")+"疾病图谱")}</div></section>
<section class="ios-list" aria-label="正在照顾的情况与常见情境"><div class="ios-row"><div class="ios-row-main"><span class="ios-row-lbl">我在照顾：</span>${conds.length?conds.map(n=>`<span class="chip">${esc(n)}</span>`).join(""):'<span class="muted">未勾选情况</span>'}</div>${_b("sm btn-ghost",'data-nav="library" data-tab="conds"',"管理"+I("chevron-right"))}</div><div class="ios-row"><div class="ios-row-main"><span class="ios-row-lbl">情境速查：</span>${quickQs.map(([q,l])=>`<button type="button" class="ios-pill" data-quickq="${esc(q)}">${esc(l)}</button>`).join("")}</div></div></section>
<div class="lbl">${idx()}卡组 · ${deckKeys.length} 张</div>
${deckKeys.length?`<div class="cardgrid tcg-grid">${deckKeys.map(k=>cardTile(k,{inDeck:true})).join("")}</div>`:`<div class="empty"><p>卡组还是空的。搜一下病名或打开疾病图谱，把家里用得上的照护卡加进来。</p>${_b("btn-primary",'data-nav="library"',I("search")+"找照护卡")}</div>`}
${recents.length?`<div class="lbl">${idx()}最近看过 ${_b("sm btn-ghost",'data-act="clearrecent"',"清除")}</div><div class="cardgrid tcg-grid">${recents.map(k=>cardTile(k,{inDeck:deckKeys.includes(k)})).join("")}</div>`:""}
${missing.length?`<div class="lbl">${idx()}根据关注情况推荐加入</div><div class="cardgrid tcg-grid">${missing.map(k=>cardTile(k,{why:sug.get(k).join("、")})).join("")}</div>`:""}
<p class="ios-caption">${I("shield")} 鹤伴不诊断、不代替医生，也不建议停药或改剂量；所有记录与病历仅保存在本机浏览器里。</p>`;
}
function syncLibTabs(){
const tab=state.libTab||"search",box=document.getElementById("libTabs");if(!box)return;
box.querySelectorAll("[data-libtab]").forEach(b=>b.setAttribute("aria-selected",String(b.dataset.libtab===tab)));
if(typeof syncSegPill==="function")syncSegPill(box,'[aria-selected="true"]');
}
function libraryBodyHTML(){
const q=state.q||"",tab=state.libTab||"search",hubsAll=getHubsAll(),ageBands=getAgeBands(),curAge=state.age||"all",curSys=state.sys||"all",activeHub=findHub(state.hub);
if(tab==="search"){
if(!q.trim()){
const hotQs=["高血压","糖尿病","中风","心力衰竭","慢阻肺","认知障碍","青光眼","术后"];
return `<div class="row mt-sm"><span class="muted">常搜词：</span>${hotQs.map(w=>`<button type="button" class="ios-pill" data-quickq="${esc(w)}">${esc(w)}</button>`).join("")}</div><div class="lbl"><span class="sec-idx">01</span>全部照护卡（${Object.keys(CARDS).length} 张）</div><div class="cardgrid tcg-grid">${Object.keys(CARDS).map(k=>cardTile(k,{inDeck:DB.deck.includes(k)})).join("")}</div>`;
}
const r=search(q),cardSet=new Map();
r.conds.forEach(c=>[...(c.cards||[]),...GENERAL].forEach(k=>{if(!CARDS[k])return;if(!cardSet.has(k))cardSet.set(k,[]);if(!cardSet.get(k).includes(c.name))cardSet.get(k).push(c.name)}));
r.cards.forEach(k=>{if(CARDS[k]&&!cardSet.has(k))cardSet.set(k,[])});
const hubHits=r.hubs.slice(0,8);
return `${r.conds.length?`<div class="lbl">找到的病种</div><div class="condgrid">${r.conds.map(c=>condBtn(c)).join("")}</div>`:""}${cardSet.size?`<div class="lbl">相关照护卡</div><div class="results">${[...cardSet.entries()].sort((a,b)=>(CARDS[b[0]].kind==="clinical")-(CARDS[a[0]].kind==="clinical")).map(([k,why])=>resRow(k,why)).join("")}</div>`:`<div class="empty mt-sm"><p>没找到「${esc(q)}」对应的专属照护卡。可以把它加成自己的情况，先用通用整理卡（复诊准备、用药记录、症状日记）。</p>${_b("btn-primary",`data-addcustom="${esc(q.trim())}"`,I("plus")+"添加「"+esc(q.trim())+"」")}</div>`}${hubHits.length?`<div class="lbl">匹配的疾病照护图谱（点开卡片展开配套卡）</div>${hubGridWithStageHTML(hubHits,activeHub)}`:""}`;
}
if(tab==="hubs"){
const filtered=queryHubs({q,age:curAge,g:curSys}),hubNote=(typeof HUB_META!=="undefined"&&HUB_META.note)?HUB_META.note:`共收录 ${hubsAll.length} 个常见健康问题的居家照护枢纽；找不到的情况可在「常见病种」里自行添加。`;
return `<section class="hub-filters" aria-label="图谱筛选条件"><div class="filter-bar" role="group" aria-label="按年龄段筛选"><span class="filter-lbl">年龄段</span><div class="filter-pills">${ageBands.map(a=>`<button type="button" class="fpill" data-age="${esc(a.id)}" aria-pressed="${curAge===a.id}">${esc(a.label)}</button>`).join("")}</div></div><div class="filter-bar" role="group" aria-label="按身体系统筛选"><span class="filter-lbl">身体系统</span><div class="filter-pills"><button type="button" class="fpill" data-sys="all" aria-pressed="${curSys==="all"}">全部系统</button>${Object.entries(GROUPS).map(([g,[gn,gc]])=>`<button type="button" class="fpill" data-sys="${esc(g)}" aria-pressed="${curSys===g}"><i class="gdot" style="background:var(--${gc})"></i>${esc(gn)}</button>`).join("")}</div></div></section><div class="hub-meta-bar"><span>显示 <b class="num-tab">${filtered.length}</b> / <span class="num-tab">${hubsAll.length}</span> 个疾病照护枢纽 · 点开任意图谱展开配套卡</span></div>${hubGridWithStageHTML(filtered,activeHub)}<p class="muted mt-sm">${esc(hubNote)}</p>`;
}
return `<p class="muted mt-sm">点选你或家人在照顾的情况，可以多选。选好后首页会自动推荐对应的照护卡。</p>${Object.entries(GROUPS).map(([g,[gn,gc]])=>`<div class="grouph"><i style="background:var(--${gc})"></i>${esc(gn)}</div><div class="condgrid">${CONDITIONS.filter(c=>c.g===g).map(c=>condBtn(c)).join("")}</div>`).join("")}<div class="grouph"><i style="background:var(--ink-3)"></i>我自己加的</div><div class="condgrid">${DB.customConds.map(n=>`<button type="button" class="cond" aria-pressed="true" data-rmcustom="${esc(n)}">${esc(n)} ✕</button>`).join("")}<form id="customForm" class="row"><input class="inp" id="customIn" placeholder="列表里没有？输入病名" style="width:min(220px,100%)"><button class="btn sm">添加</button></form></div>`;
}
function libraryHTML(){
const q=state.q||"",tab=state.libTab||"search",hubsAll=getHubsAll(),srcList=Object.values(SOURCES);
return `<h1>照护图谱与找卡</h1><p class="lead">按 ${hubsAll.length||86} 种疾病照护图谱、${CONDITIONS.length} 项常见情况或关键词找卡，并可查阅 ${srcList.length} 份已核对临床指南来源。</p><div class="ios-search-row"><label class="ios-search search">${I("search","color:var(--ink-3)")}<input id="q" type="search" placeholder="输入病名或想做的事：糖尿病、中风、量血压…（按 / 聚焦）" value="${esc(q)}" aria-label="搜索病名或照护卡"></label>${_b("redline-btn",'data-act="redlines"',`<span class="rl-ico" data-stop>${I("alert")}</span>红线速查`)}</div><div class="ios-seg" id="libTabs" role="tablist" aria-label="找卡方式"><span class="ios-seg-pill" aria-hidden="true"></span><button type="button" role="tab" data-libtab="search" aria-selected="${tab==="search"}">${I("search")}搜索与卡库</button><button type="button" role="tab" data-libtab="hubs" aria-selected="${tab==="hubs"}">${I("layers")}疾病图谱${hubsAll.length?`（${hubsAll.length}）`:""}</button><button type="button" role="tab" data-libtab="conds" aria-selected="${tab==="conds"}">${I("check")}常见病种（${CONDITIONS.length}）</button></div><div id="libBody">${libraryBodyHTML()}</div><details class="ios-sources" id="libSources"><summary><span>${I("book")}${srcList.length} 份已核对临床指南与权威来源</span><span class="muted">展开查阅 ${I("chevron-down")}</span></summary><ol class="ios-src-list">${srcList.map(s=>`<li><a href="${s.url}" target="_blank" rel="noopener">${esc(s.t)}</a> <span class="muted">${esc(s.pub)}</span></li>`).join("")}</ol></details><p class="ios-caption">目录收录居家照护常见情况，不能囊括所有疾病；找不到的情况可自行添加，具体方案以主管医护交代为准。</p>`;
}
const condBtn=c=>{const on=DB.myConds.includes(c.id);return `<button type="button" class="cond" data-cond="${c.id}" aria-pressed="${on}">${on?"✓ ":""}${esc(c.name)}</button>`};
function resRow(k,why){
const c=CARDS[k];if(!c)return "";const inD=DB.deck.includes(k);
return `<div class="res">${_i(ART[c.art]||ART.bp,esc(c.title)+"插画")}<div><b>${esc(c.title)}</b> <span class="chip">${c.ready?"可以用":"编写中"}</span> ${c.kind==="organize"?'<span class="chip">整理工具</span>':""}<div class="muted">${esc(c.desc||"")}</div>${why.length?`<div class="why">适合：${esc(why.join("、"))}</div>`:""}</div><div class="row">${c.ready?_b("sm btn-ghost",`data-card="${k}"`,"打开"):""}${inD?_b("sm",`data-undeck="${k}"`,"✓ 已在卡组"):_b("sm btn-primary",`data-deck="${k}"`,I("plus")+"加入卡组")}</div></div>`;
}

const pad3=n=>String(n).padStart(3,"0");
const diamonds=n=>`<span class="rar" aria-label="稀有度 ${n} 级">${[1,2,3].map(i=>`<i class="${i<=n?"on":""}"></i>`).join("")}</span>`;
function tcgFront(k){
const c=CARDS[k];if(!c)return "";const T=TYPES[c.type]||TYPES.care,R=rarity(k);
return `<div class="tcg-face front"><div class="tcg-type"><span class="tchip">${I(T.icon)}${T.name}</span><span class="tno">No.${pad3(c.no)}</span></div><div class="tcg-name"><h3>${c.title}</h3><small>${c.sub||""}</small></div><div class="tcg-art"><img src="${ART[c.art]||ART.bp}" alt="${esc(c.title)}的插画：${esc(c.sub||c.desc||"")}" loading="lazy" decoding="async"></div>${c.ready?`<dl class="tcg-stats">${(c.stats||[]).map(([a,b])=>`<div><dt>${a}</dt><dd>${b}</dd></div>`).join("")}</dl><div class="tcg-key"><b>关键一招</b><p>${c.key||""}${c.keyRefs?.length?ref(...c.keyRefs):""}</p></div>${c.stopMini?`<div class="stopstrip" data-stop>${I("alert")}<span>${c.stopMini}${c.stopRefs?.length?ref(...c.stopRefs):""}</span></div>`:`<div class="tcg-flavor">「${c.flavor||""}」</div>`}`:`<div class="tcg-wip"><b>编写中</b><p>${c.desc||""}</p><p class="muted">临床内容还在查证来源，暂不开放。</p></div>`}<div class="tcg-foot">${diamonds(R.n)}<span>${R.label}</span><span class="tset">鹤伴 · ${pad3(c.no)}/${pad3(TOTAL_NO())}</span></div></div>`;
}
function tcgBack(k,bid){
const c=CARDS[k];if(!c)return "";const C=CONTENT[k],why=C?.why?C.why.map(w=>`<li><b>${w.t||""}</b>${w.d||""}${w.r?.length?ref(...w.r):""}</li>`).join(""):`<li>${c.desc||""}</li>`,steps=C?.steps?C.steps.map((s,i)=>`<li><span>${i+1}</span><div>${s.t||""}</div></li>`).join(""):"";
return `<div class="tcg-face back" id="${bid}" aria-hidden="true" inert><div class="tcg-type"><span class="tchip">${I("note")}为什么要做</span><span class="tno">No.${pad3(c.no)}</span></div><ul class="tcg-why">${why}</ul>${steps?`<div class="tcg-mini"><b>步骤速览</b><ol>${steps}</ol></div>`:""}<div class="tcg-foot"><span>${c.kind==="organize"?"整理工具，不判断病情":"每条都有来源，点角标可查"}</span></div></div>`;
}
let __tcgSeq=0;
function tcg(k,{size="grid",actions=""}={}){
const c=CARDS[k];if(!c)return "";const T=TYPES[c.type]||TYPES.care,bid="tcgb"+(++__tcgSeq);
return `<div class="tcg-wrap ${size}" data-tile="${k}"><div class="tcg t-${T.c} r${rarity(k).n} ${c.ready?"":"wip"}" data-tcg="${k}" tabindex="-1"><div class="tcg-inner">${tcgFront(k)}${tcgBack(k,bid)}<div class="glare" aria-hidden="true"></div></div></div><div class="tcg-acts">${actions}<button type="button" class="btn sm btn-ghost" data-flip="${k}" aria-expanded="false" aria-controls="${bid}">${I("auto")}<span>翻面看解释</span></button></div></div>`;
}
const tiltState=new WeakMap(),activeTilts=new Set();let __tiltRaf=0,__tiltLast=0;
function resetTiltEl(el){
const inner=el.querySelector(".tcg-inner");if(inner)inner.style.transform="";
el.classList.remove("live","glare-on");tiltState.delete(el);activeTilts.delete(el);
}
function tickTilts(now){
const dt=__tiltLast?Math.min(48,Math.max(4,now-__tiltLast)):16.67;__tiltLast=now;
const k=1-Math.pow(.84,dt/16.67),km=1-Math.pow(.82,dt/16.67),kf=Math.min(1,k*1.2);
activeTilts.forEach(el=>{
if(!el.isConnected||motionReduced()){resetTiltEl(el);return}
const s=tiltState.get(el),inner=el.querySelector(".tcg-inner");if(!s||!inner){resetTiltEl(el);return}
s.tFlip=el.classList.contains("flipped")?180:0;
s.rx+=(s.tx-s.rx)*k;s.ry+=(s.ty-s.ry)*k;s.mx+=(s.tmx-s.mx)*km;s.my+=(s.tmy-s.my)*km;s.cFlip+=(s.tFlip-s.cFlip)*kf;
inner.style.transform=`rotateX(${s.rx.toFixed(2)}deg) rotateY(${(s.cFlip+s.ry).toFixed(2)}deg)`;
const g=el.querySelector(".glare");
if(g){g.style.setProperty("--mx",s.mx.toFixed(1)+"%");g.style.setProperty("--my",s.my.toFixed(1)+"%");g.style.setProperty("--hyp",Math.min(1,Math.hypot(s.mx-50,s.my-50)/50).toFixed(2))}
if(!s.active&&Math.hypot(s.tx-s.rx,s.ty-s.ry)<.04&&Math.abs(s.cFlip-s.tFlip)<.25)resetTiltEl(el);
});
if(activeTilts.size)__tiltRaf=requestAnimationFrame(tickTilts);else{__tiltRaf=0;__tiltLast=0}
}
const ensureTiltLoop=()=>{if(!__tiltRaf&&activeTilts.size)__tiltRaf=requestAnimationFrame(tickTilts)};
document.addEventListener("pointermove",e=>{
if(motionReduced()||e.pointerType==="touch")return;
const el=e.target.closest?.(".tcg");if(!el)return;const r=el.getBoundingClientRect();if(!r.width||!r.height)return;
const x=Math.max(0,Math.min(1,(e.clientX-r.left)/r.width)),y=Math.max(0,Math.min(1,(e.clientY-r.top)/r.height)),h=el.parentElement?.classList.contains("hero");
const tx=+((.5-y)*(h?18:14)).toFixed(2),ty=+((x-.5)*(h?20:15)).toFixed(2),tmx=x*100,tmy=y*100,f=el.classList.contains("flipped")?180:0;
let s=tiltState.get(el);
if(!s){s={tx,ty,rx:0,ry:0,tmx,tmy,mx:tmx,my:tmy,tFlip:f,cFlip:f,active:true};tiltState.set(el,s)}
else{s.tx=tx;s.ty=ty;s.tmx=tmx;s.tmy=tmy;s.tFlip=f;s.active=true}
el.classList.add("live","glare-on");activeTilts.add(el);ensureTiltLoop();
},{passive:true});
document.addEventListener("pointerout",e=>{
const el=e.target.closest?.(".tcg");
if(el&&!el.contains(e.relatedTarget)){
el.classList.remove("glare-on");const s=tiltState.get(el);
if(s){s.active=false;s.tx=0;s.ty=0;s.tmx=50;s.tmy=50;activeTilts.add(el);ensureTiltLoop()}else el.classList.remove("live");
}
},{passive:true});
function flip(k){document.querySelectorAll(`[data-tcg="${k}"]`).forEach(el=>{
const on=el.classList.toggle("flipped"),fr=el.querySelector(".front"),bk=el.querySelector(".back");
if(fr){fr.setAttribute("aria-hidden",String(on));fr.toggleAttribute("inert",on)}
if(bk){bk.setAttribute("aria-hidden",String(!on));bk.toggleAttribute("inert",!on)}
const b=el.parentElement?.querySelector("[data-flip]");
if(b){b.setAttribute("aria-expanded",String(on));const sp=b.querySelector("span")||b.lastChild;if(sp)sp.textContent=on?"翻回正面":"翻面看解释"}
const s=tiltState.get(el);
if(s&&!motionReduced()){s.tFlip=on?180:0;activeTilts.add(el);ensureTiltLoop()}else if(motionReduced())resetTiltEl(el);
})}

const FOLLOWUP_STEPS=[
["带齐证件和本子","身份证、医保卡、病历本，上次的出院小结或门诊病历。"],
["带上检查单原件","化验单、片子、报告；医生看原件，数值以原件为准。"],
["带上正在吃的所有药","把药盒装进袋子带去，或拍下药盒正面和说明书。保健品、中药也算。"],
["带上家里的记录","血压、血糖、症状日记等，打印或在手机里打开。"],
["写下最想问的 3 个问题","最重要的先问。听不懂当场请医生再说一遍，或写下来。"],
["回家后记进病历夹","新医嘱、下次复诊日期、新开的检查，一回家就记。"]
];
const getCardSteps=k=>CONTENT[k]?.steps?.length?CONTENT[k].steps:(k==="followup"?FOLLOWUP_STEPS.map(([t,d])=>({t,d})):[]);
const genericStop=()=>`<section class="gen-stop" aria-labelledby="stopH" data-stop><h2 id="stopH">${I("alert")}何时联系医护</h2><p style="margin:0">情况紧急、或者你拿不准是不是紧急，<b>拨打 120</b>。其他让你担心的变化，<b>联系医生或社区医院</b>。这张卡是整理工具，不判断病情。</p></section>`;
function cardHero(k,lead){
const c=CARDS[k],T=TYPES[c.type],hasSteps=getCardSteps(k).length>0;
return `<button type="button" class="back" data-nav="cards">${I("back")}卡组</button><header class="dhead"><div class="kicker t-${T.c}">${I(T.icon)}${T.name}卡 · No.${pad3(c.no)}</div><h1>${c.title}</h1><p class="lead">${lead}</p><div class="row">${hasSteps?_b("sm btn-primary no-print",`data-act="bedside" data-for="${k}"`,I("book")+"床旁伴读 · 大字跟做"):""}${DB.deck.includes(k)?'<span class="chip">✓ 已在卡组</span>':_b(`sm ${hasSteps?"":"btn-primary"}`,`data-deck="${k}"`,I("plus")+"加入卡组")}${_b("sm btn-ghost no-print",'onclick="window.print()"',I("print")+"打印")}<a class="jump" href="#stopH">${I("alert")}何时联系医护</a></div></header>`;
}
function doneStepsFor(k){const a=DB.stepDone&&Array.isArray(DB.stepDone[k])?DB.stepDone[k]:[];return new Set(a.filter(Number.isInteger))}
function relatedCardsFor(k){
const map=new Map(),add=(rk,r)=>{if(!rk||rk===k||!CARDS[rk]||!CARDS[rk].ready)return;if(!map.has(rk))map.set(rk,[]);if(r&&!map.get(rk).includes(r)&&map.get(rk).length<2)map.get(rk).push(r)};
if(typeof CONDITIONS!=="undefined")CONDITIONS.forEach(c=>{if((c.cards||[]).includes(k))(c.cards||[]).forEach(rk=>add(rk,c.name))});
if(typeof DISEASE_HUBS!=="undefined"&&Array.isArray(DISEASE_HUBS))DISEASE_HUBS.forEach(h=>{if((h.subCards||[]).includes(k))(h.subCards||[]).filter(rk=>CARDS[rk]?.kind==="clinical").forEach(rk=>add(rk,h.name))});
const FB={bp:["weight","fall","followup","medlog"],glucose:["hypo","insulin_pen","followup","medlog"],inhaler:["breathing","symptom","medlog","followup"],weight:["bp","symptom","followup","medlog"],fall:["transfer","wound","dementia","bp"],wound:["transfer","fall","symptom","followup"],hypo:["glucose","insulin_pen","medlog","followup"],breathing:["inhaler","symptom","followup","medlog"],dementia:["fall","transfer","medlog","followup"],transfer:["fall","wound","dementia","bp"],insulin_pen:["glucose","hypo","medlog","followup"],eyedrops:["fall","medlog","followup","symptom"],followup:["medlog","symptom","bp","glucose"],medlog:["followup","symptom","bp","insulin_pen"],symptom:["followup","medlog","bp","breathing"]};
(FB[k]||GENERAL).forEach(rk=>add(rk,""));GENERAL.forEach(rk=>add(rk,"日常整理"));
return [...map.entries()].slice(0,4);
}
function relatedCardsBlock(k){
const list=relatedCardsFor(k);if(!list.length)return "";
return `<section class="sect no-print" aria-labelledby="relH"><h2 id="relH">同组常搭配的照护卡</h2><p class="muted" style="margin:0 0 10px">照顾同一位家人时，常常会一起用到的卡片。</p><div class="ios-list" style="margin:0">${list.map(([rk,rs])=>{const c=CARDS[rk];return `<div class="ios-rel-row">${_i(ART[c.art]||"")}<div class="ios-rel-info"><b>${esc(c.title)}</b><div class="muted">${esc(rs.length?"常用于："+rs.join("、"):c.sub)}</div></div><div class="row">${_b("sm",`data-card="${rk}"`,I("open")+"查看")}${DB.deck.includes(rk)?'<span class="chip">✓ 已在卡组</span>':_b("sm btn-ghost",`data-deck="${rk}"`,I("plus")+"加入卡组")}</div></div>`}).join("")}</div></section>`;
}
function detailShell(k,lead,main,rail){
const C=CONTENT[k],nav=[["sec-why","为什么要做",C?.why?.length],["stepsH","步骤",1],["sec-mis","容易做错的地方",C?.mistakes?.length],["stopH","何时联系医护",1],["srcH","来源",C?.srcs?.length]].filter(x=>x[2]);
return `<div class="detail"><div class="dcard">${tcg(k,{size:"hero"})}</div><div class="dbody">${cardHero(k,lead)}<nav class="segnav no-print" aria-label="本卡分节">${nav.map(n=>`<a href="#${n[0]}">${n[1]}</a>`).join("")}</nav>${main}${rail}${relatedCardsBlock(k)}</div></div>`;
}
const refs=a=>a&&a.length?ref(...a):"";
const stopBlock=(list,note)=>`<section class="stop" aria-labelledby="stopH" data-stop><h2 id="stopH">${I("alert")}何时联系医护</h2>${(list||[]).map(([lv,h,t,r])=>`<div class="lvl lvl-${lv}"><b>${h}：</b>${t}${refs(r)}</div>`).join("")}${note?`<p class="note">${note}</p>`:""}</section>`;
const DETAIL_QUICK_ACT={bp:{act:"addbp",label:"记录血压",hint:"把刚量的高压、低压记进病历夹"},glucose:{act:"addglucose",label:"记录指尖血糖",hint:"记下时段与血糖数值，复诊时给医生看"},weight:{act:"addweight",label:"记录晨起体重",hint:"固定早晨排尿后称重，记进病历夹核对"}};
const progBar=(d,tot)=>`<div class="progress" aria-live="polite"><div class="track"><div class="fill" id="pfill"></div></div><span id="ptext" class="muted">${d} / ${tot}${d===tot&&tot?" · 做完了":""}</span><button type="button" class="btn sm btn-ghost no-print" id="resetStepsBtn" data-act="resetsteps" ${d?"":"hidden"}>重置步骤</button></div>`;
function clinicalHTML(k){
const C=CONTENT[k];if(!C)return "";
const stepsArr=C.steps||[],doneSet=doneStepsFor(k),total=stepsArr.length,doneN=[...doneSet].filter(i=>i>=0&&i<total).length,nextIdx=stepsArr.findIndex((_,i)=>!doneSet.has(i)),qa=DETAIL_QUICK_ACT[k];
const main=`<section class="sect" id="sec-why" data-guidance><h2>为什么要做</h2><ul class="whylist">${(C.why||[]).map(w=>`<li data-needref><b>${w.t}</b><span>${w.d||""}${refs(w.r)}</span></li>`).join("")}</ul><div class="fit"><div><h3>适合</h3><ul class="plain">${(C.for||[]).map(([t,r])=>`<li data-needref>${t}${refs(r)}</li>`).join("")}</ul></div><div><h3>先别用这张卡</h3><p class="muted">${C.notfor||""}${refs(C.notforRefs)}</p></div></div></section>${C.organ?organSection(C.organ):""}<section class="sect" aria-labelledby="stepsH" data-guidance><h2 id="stepsH">步骤</h2>${progBar(doneN,total)}<ol class="steps">${stepsArr.map((s,i)=>{const d=doneSet.has(i),cls=d?"done":i===nextIdx?"is-next":"";return `<li data-i="${i}" class="${cls}"><button type="button" class="stepbtn" aria-label="标记第 ${i+1} 步完成" aria-pressed="${d}">${d?"✓":(i+1)}</button><div><h3>${s.t}${refs(s.r)}</h3>${s.d?`<p>${s.d}${refs(s.dr)}</p>`:""}${s.why?`<p class="why"><b>为什么：</b>${s.why}${refs(s.wr)}</p>`:""}</div></li>`}).join("")}</ol></section><section class="sect" id="sec-mis" data-guidance><h2>容易做错的地方</h2>${(C.mistakes||[]).map(m=>`<div class="mistake"><span class="x" aria-hidden="true">✕</span><div><b>${m.t}</b><p>${m.d}${refs(m.r)}</p></div></div>`).join("")}</section>${C.freq?`<section class="sect" data-guidance><h2>多久做一次？</h2><p>${C.freq.lead}${refs(C.freq.leadRefs)}</p><ul class="plain">${(C.freq.items||[]).map(([t,r])=>`<li data-needref>${t}${refs(r)}</li>`).join("")}</ul><p class="muted">这些是面向一般人群的做法，不是给你个人的硬性规定。</p></section>`:""}`;
const rail=`${qa?`<div class="panel no-print">${_b("block btn-primary",`data-act="${qa.act}"`,I("plus")+qa.label)}<p class="muted mt-sm" style="margin-bottom:0">${qa.hint}</p></div>`:""}${stopBlock(C.stop,C.stopNote)}${sourcesBlock(C.srcs)}`;
return detailShell(k,C.lead,main,rail);
}
function organSection(){return ""}
const sourcesBlock=srcs=>`<section class="sect sources" id="srcH"><h2>来源</h2><ol style="overflow-wrap:anywhere">${(srcs||[]).map(k=>{const s=SOURCES[k];return s?`<li id="src-${k}"><a href="${s.url}" target="_blank" rel="noopener">${esc(s.t)}</a> <span class="muted">${esc(s.pub)}</span><span class="vtag ${s.v==="ok"?"v-ok":"v-pend"}">${s.v==="ok"?"已通读核对":"待人工通读"}</span>${s.note?`<div class="muted">${esc(s.note)}</div>`:""}</li>`:""}).join("")}</ol><p class="muted">编号与正文里的角标对应，点击可打开原文。</p></section>`;
function stepsBlock(steps,color,k="followup"){
const doneSet=doneStepsFor(k),doneN=[...doneSet].filter(i=>i>=0&&i<steps.length).length,nextIdx=steps.findIndex((_,i)=>!doneSet.has(i));
return `<section class="sect"><h2 id="stepsH"><span class="dot" style="background:var(--${color||"teal"})"></span>步骤</h2>${progBar(doneN,steps.length)}<ol class="steps">${steps.map(([t,d],i)=>{const ok=doneSet.has(i),cls=ok?"done":i===nextIdx?"is-next":"";return `<li data-i="${i}" class="${cls}"><button type="button" class="stepbtn" aria-label="标记第 ${i+1} 步完成" aria-pressed="${ok}">${ok?"✓":(i+1)}</button><div><h3>${t}</h3><p>${d}</p></div></li>`}).join("")}</ol></section>`;
}
const mistakesBlock=ms=>`<section class="sect"><h2>容易做错的地方</h2>${ms.map(([t,d])=>`<div class="mistake"><span class="x" aria-hidden="true">✕</span><div><b>${t}</b><p>${d}</p></div></div>`).join("")}</section>`;
function followupHTML(){
const ms=[["只口头说「吃着降压药」","说清楚药名，或直接拿药盒给医生看。"],["忘了说吃过别的药或保健品","都要说，包括别的医院开的药。"],["听不懂不好意思问","请医生再说一遍，或请他写下来。"]];
return cardHero("followup","复诊前要带什么、要问什么，一张清单理清楚。")+`<div class="cols"><div>${stepsBlock(FOLLOWUP_STEPS,"teal","followup")}${mistakesBlock(ms)}${relatedCardsBlock("followup")}</div><aside class="rail"><div class="panel no-print"><div class="row" style="flex-direction:column;align-items:stretch">${_b("btn-primary",'data-act="clinicsheet"',I("doc")+"生成一页复诊单")}${_b("",'data-prep="questions"',I("note")+"写下想问的问题")}${_b("",'data-nav="folder"',I("folder")+"看复诊准备进度")}</div></div>${genericStop()}</aside></div>`;
}
function medlogHTML(){
const today=localDate(new Date());
return cardHero("medlog","照药盒和医嘱抄下来，每次吃完打个勾。鹤伴不做剂量建议。")+`<div class="cols"><div><section class="sect"><h2><span class="dot" style="background:var(--amber)"></span>药品清单</h2><p class="muted" style="margin:0 0 10px">「怎么吃」请照处方单或药盒上医生写的抄，不要自己改。</p>${DB.meds.map(m=>{const done=m.log.filter(x=>x.startsWith(today));return `<div class="mistake"><span style="color:var(--amber)">${I("pill")}</span><div style="flex:1"><b>${esc(m.name)}</b><div style="color:var(--ink-2)">${esc(m.how)}</div><div class="muted">今天已记 ${done.length} 次${done.length?"："+done.map(x=>x.slice(11)).join("、"):""}</div></div><div class="row">${_b("sm btn-primary",`data-take="${m.id}"`,I("check")+"刚吃了")}${_b("sm btn-ghost",`data-rmmed="${m.id}"`,"删除")}</div></div>`}).join("")||'<p class="muted">还没有药。</p>'}<form id="medForm" class="no-print mt-sm"><div class="two"><input class="inp" id="mn" placeholder="药名（照药盒抄）"><input class="inp" id="mh" placeholder="怎么吃（照医嘱抄）"></div><button class="btn sm mt-sm">${I("plus")}添加</button></form></section>${mistakesBlock([["漏吃了，下一顿吃两份补上","不要自己补，先看说明书或问药师、医生。"],["感觉好了就自己停药","停药、换药、改剂量都要先问医生。"],["几种药装在一起分不清","用分格药盒，并保留原包装。"]])}${relatedCardsBlock("medlog")}</div><aside class="rail">${genericStop()}</aside></div>`;
}
function symptomHTML(){
return cardHero("symptom","把不舒服的时间、程度、持续多久记下来，复诊时给医生看。")+`<div class="cols"><div><section class="sect"><h2><span class="dot" style="background:var(--indigo)"></span>记一条</h2><form id="symForm"><div class="two"><div><label class="f" for="sw">哪里不舒服</label><input class="inp" id="sw" placeholder="例如：头晕"></div><div><label class="f" for="sl">程度（0 不难受 – 10 最难受）</label><input class="inp" id="sl" type="number" min="0" max="10" value="3"></div></div><label class="f" for="sd">持续多久、当时在做什么、做了什么</label><input class="inp" id="sd" placeholder="例如：起床时，持续约 2 分钟，坐下后好转"><button class="btn btn-primary mt-sm">${I("plus")}记下来</button></form></section><section class="sect"><h2><span class="dot" style="background:var(--indigo)"></span>记录（${DB.symptoms.length}）</h2>${DB.symptoms.slice().reverse().map(x=>`<div class="mistake"><span style="color:var(--indigo)">${I("note")}</span><div><b>${esc(x.what)} · 程度 ${x.lvl}/10</b><div style="color:var(--ink-2)">${esc(x.detail)}</div><div class="muted">${x.at}</div></div></div>`).join("")||'<p class="muted">还没有记录。</p>'}</section>${relatedCardsBlock("symptom")}</div><aside class="rail">${genericStop()}</aside></div>`;
}

/* ================= 病历夹与多指标趋势 ================= */
function isDemoPerson(){
  return /虚构/.test(DB.person?.note||"")||(DB.person?.name===SEED.person.name&&(DB.events||[]).some(e=>/虚构/.test(e.src||"")));
}
function chartSVG(kind){
  const ck=["bp","glucose","weight"].includes(kind||state.chartKind)?(kind||state.chartKind):"bp";
  const W=360,H=220,L=40,R=22,T=12,B=28;
  const xAnchor=(xv)=>xv<L+16?"start":xv>W-26?"end":"middle";
  if(ck==="bp"){
    const ok=DB.readings.filter(r=>r.status==="ok").sort((a,b)=>(a.date+(a.time||"")).localeCompare(b.date+(b.time||""))).slice(-14);
    if(ok.length<2)return '<p class="muted">已确认的血压读数满 2 条后显示趋势。</p>';
    const min=60,max=190;
    const x=i=>L+(W-L-R)*i/(ok.length-1),y=v=>T+(H-T-B)*(1-(Math.max(min,Math.min(max,v))-min)/(max-min));
    const ptStr=r=>`${r.date}${r.time?" "+r.time:""} · ${r.sys}/${r.dia} mmHg`;
    const last=ok[ok.length-1];
    const hits=["sys","dia"].map(k=>ok.map((r,i)=>`<circle cx="${x(i)}" cy="${y(r[k])}" r="11" fill="transparent" data-pt="${esc(ptStr(r))}" data-pti="${i}" style="cursor:pointer"/>`).join("")).join("");
    const line=(k,c,focusable)=>`<polyline fill="none" style="stroke:var(--${c})" stroke-width="2.5" stroke-linejoin="round" points="${ok.map((r,i)=>x(i)+","+y(r[k])).join(" ")}"/>`+
      ok.map((r,i)=>`<circle class="pt-node${i===ok.length-1?" is-active":""}" cx="${x(i)}" cy="${y(r[k])}" r="4.5" ${focusable?'tabindex="0"':""} data-pt="${esc(ptStr(r))}" data-pti="${i}" aria-label="${esc(ptStr(r))}" style="fill:var(--card);stroke:var(--${c});cursor:pointer" stroke-width="2"><title>${esc(ptStr(r))}</title></circle>`).join("");
    const grid=[80,120,160].map(v=>`<line x1="${L}" x2="${W-R}" y1="${y(v)}" y2="${y(v)}" style="stroke:var(--line)"/><text x="${L-6}" y="${y(v)+4}" text-anchor="end" font-size="11" style="fill:var(--ink-3)">${v}</text>`).join("");
    const refl=(v,c)=>`<line x1="${L}" x2="${W-R}" y1="${y(v)}" y2="${y(v)}" style="stroke:var(--${c})" stroke-width="1.2" stroke-dasharray="5 4"/>`;
    const lab=ok.map((r,i)=>(i===0||r.date!==ok[i-1].date)&&i%2===0?`<text x="${x(i)}" y="${H-8}" font-size="11" text-anchor="${xAnchor(x(i))}" style="fill:var(--ink-3)">${r.date.slice(5)}</text>`:"").join("");
    return `<div class="chart-readout" id="chartReadout" aria-live="polite">最新已确认：${esc(ptStr(last))}</div>
    <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="最近 ${ok.length} 次已确认血压读数的趋势">${grid}${refl(135,"steel")}${refl(85,"indigo")}${hits}${line("sys","steel",true)}${line("dia","indigo",false)}${lab}</svg>
    <div class="legend"><span><i style="background:var(--steel)"></i>收缩压（高压）</span><span><i style="background:var(--indigo)"></i>舒张压（低压）</span><span>虚线：135/85 家庭血压评估参考${ref("cn2024")}，不是个人目标</span></div>`;
  }
  if(ck==="glucose"){
    const ok=(DB.glucoseReadings||[]).filter(r=>r.status==="ok").sort((a,b)=>(a.date+(a.time||"")).localeCompare(b.date+(b.time||""))).slice(-14);
    if(ok.length<2)return `<p class="muted">已确认的指尖血糖记录满 2 条后显示趋势。</p><button type="button" class="btn sm no-print" data-act="addglucose">${I("plus")}记录指尖血糖</button>`;
    const vals=ok.map(r=>+r.val);
    const min=Math.min(2.5,Math.floor(Math.min(...vals)-1)),max=Math.max(12,Math.ceil(Math.max(...vals)+1.5)),span=Math.max(1,max-min);
    const x=i=>L+(W-L-R)*i/(ok.length-1),y=v=>T+(H-T-B)*(1-(Math.max(min,Math.min(max,v))-min)/span);
    const ptStr=r=>`${r.date}${r.time?" "+r.time:""}（${GLUCOSE_CTX[r.ctx]||"自测"}）· ${Number(r.val).toFixed(1)} mmol/L`;
    const last=ok[ok.length-1];
    const ticks=[3.9,7.0,10.0].filter(v=>v>=min&&v<=max);
    const grid=ticks.map(v=>`<line x1="${L}" x2="${W-R}" y1="${y(v)}" y2="${y(v)}" style="stroke:var(--line)"/><text x="${L-6}" y="${y(v)+4}" text-anchor="end" font-size="11" style="fill:var(--ink-3)">${v.toFixed(1)}</text>`).join("");
    const refLow=`<line x1="${L}" x2="${W-R}" y1="${y(3.9)}" y2="${y(3.9)}" style="stroke:var(--amber)" stroke-width="1.2" stroke-dasharray="5 4"/>`;
    const pts=ok.map((r,i)=>x(i)+","+y(+r.val)).join(" ");
    const dots=ok.map((r,i)=>`<circle cx="${x(i)}" cy="${y(+r.val)}" r="11" fill="transparent" data-pt="${esc(ptStr(r))}" data-pti="${i}" style="cursor:pointer"/>`+
      `<circle class="pt-node${i===ok.length-1?" is-active":""}" cx="${x(i)}" cy="${y(+r.val)}" r="4.5" tabindex="0" data-pt="${esc(ptStr(r))}" data-pti="${i}" aria-label="${esc(ptStr(r))}" style="fill:var(--card);stroke:var(--amber);cursor:pointer" stroke-width="2"><title>${esc(ptStr(r))}</title></circle>`).join("");
    const lab=ok.map((r,i)=>(i===0||r.date!==ok[i-1].date)&&i%Math.max(1,Math.ceil(ok.length/5))===0?`<text x="${x(i)}" y="${H-8}" font-size="11" text-anchor="${xAnchor(x(i))}" style="fill:var(--ink-3)">${r.date.slice(5)}</text>`:"").join("");
    return `<div class="chart-readout" id="chartReadout" aria-live="polite">最新已确认：${esc(ptStr(last))}</div>
    <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="最近 ${ok.length} 次已确认指尖血糖记录的趋势">${grid}${refLow}<polyline fill="none" style="stroke:var(--amber)" stroke-width="2.5" stroke-linejoin="round" points="${pts}"/>${dots}${lab}</svg>
    <div class="legend"><span><i style="background:var(--amber)"></i>指尖血糖（mmol/L）</span><span>虚线：3.9 mmol/L 用药糖友低血糖警戒线${ref("cmahypo")}，控糖目标请遵医嘱</span></div>`;
  }
  const ok=(DB.weightReadings||[]).filter(r=>r.status==="ok").sort((a,b)=>(a.date+(a.time||"")).localeCompare(b.date+(b.time||""))).slice(-14);
  if(ok.length<2)return `<p class="muted">已确认的体重记录满 2 条后显示趋势。</p><button type="button" class="btn sm no-print" data-act="addweight">${I("plus")}记录晨起体重</button>`;
  const vals=ok.map(r=>+r.kg),loRaw=Math.min(...vals),hiRaw=Math.max(...vals),padW=Math.max(1.5,(hiRaw-loRaw)*0.45);
  const min=Math.floor((loRaw-padW)*2)/2,max=Math.ceil((hiRaw+padW)*2)/2,span=Math.max(1,max-min);
  const x=i=>L+(W-L-R)*i/(ok.length-1),y=v=>T+(H-T-B)*(1-(Math.max(min,Math.min(max,v))-min)/span);
  const ptStr=r=>`${r.date}${r.time?" "+r.time:""} · ${Number(r.kg).toFixed(1)} kg`;
  const last=ok[ok.length-1];
  const mid=+((min+max)/2).toFixed(1);
  const grid=[min,mid,max].map(v=>`<line x1="${L}" x2="${W-R}" y1="${y(v)}" y2="${y(v)}" style="stroke:var(--line)"/><text x="${L-6}" y="${y(v)+4}" text-anchor="end" font-size="11" style="fill:var(--ink-3)">${v.toFixed(1)}</text>`).join("");
  const pts=ok.map((r,i)=>x(i)+","+y(+r.kg)).join(" ");
  const dots=ok.map((r,i)=>`<circle cx="${x(i)}" cy="${y(+r.kg)}" r="11" fill="transparent" data-pt="${esc(ptStr(r))}" data-pti="${i}" style="cursor:pointer"/>`+
    `<circle class="pt-node${i===ok.length-1?" is-active":""}" cx="${x(i)}" cy="${y(+r.kg)}" r="4.5" tabindex="0" data-pt="${esc(ptStr(r))}" data-pti="${i}" aria-label="${esc(ptStr(r))}" style="fill:var(--card);stroke:var(--teal);cursor:pointer" stroke-width="2"><title>${esc(ptStr(r))}</title></circle>`).join("");
  const lab=ok.map((r,i)=>(i===0||r.date!==ok[i-1].date)&&i%Math.max(1,Math.ceil(ok.length/5))===0?`<text x="${x(i)}" y="${H-8}" font-size="11" text-anchor="${xAnchor(x(i))}" style="fill:var(--ink-3)">${r.date.slice(5)}</text>`:"").join("");
  return `<div class="chart-readout" id="chartReadout" aria-live="polite">最新已确认：${esc(ptStr(last))}</div>
  <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="最近 ${ok.length} 次已确认体重记录的趋势">${grid}<polyline fill="none" style="stroke:var(--teal)" stroke-width="2.5" stroke-linejoin="round" points="${pts}"/>${dots}${lab}</svg>
  <div class="legend"><span><i style="background:var(--teal)"></i>晨起体重（kg）</span><span>建议固定早晨排空小便后、早饭前用同一台秤测量</span></div>`;
}
function chartSummaryText(kind){
  const ck=["bp","glucose","weight"].includes(kind)?kind:"bp";
  if(ck==="bp"){
    const ok=DB.readings.filter(r=>r.status==="ok");
    if(!ok.length)return "";
    const s=Math.round(ok.reduce((a,r)=>a+r.sys,0)/ok.length),d=Math.round(ok.reduce((a,r)=>a+r.dia,0)/ok.length);
    return `<p class="muted" style="margin:0 0 8px">${new Set(ok.map(r=>r.date)).size} 天 ${ok.length} 次已确认读数，平均 ${s}/${d} mmHg。怎么调整治疗请交给医生判断。</p>`;
  }
  if(ck==="glucose"){
    const ok=(DB.glucoseReadings||[]).filter(r=>r.status==="ok");
    if(!ok.length)return "";
    const vs=ok.map(r=>+r.val),lo=Math.min(...vs).toFixed(1),hi=Math.max(...vs).toFixed(1);
    return `<p class="muted" style="margin:0 0 8px">${new Set(ok.map(r=>r.date)).size} 天 ${ok.length} 次已确认记录，范围 ${lo}–${hi} mmol/L。空腹与餐后数值请连同时段一起给医生看。</p>`;
  }
  const ok=(DB.weightReadings||[]).filter(r=>r.status==="ok").sort((a,b)=>(a.date+(a.time||"")).localeCompare(b.date+(b.time||"")));
  if(!ok.length)return "";
  const last=Number(ok[ok.length-1].kg),first=Number(ok[0].kg),diff=last-first;
  return `<p class="muted" style="margin:0 0 8px">${new Set(ok.map(r=>r.date)).size} 天 ${ok.length} 次已确认记录，最近一次 ${last.toFixed(1)} kg${ok.length>=2?`（较首条记录 ${diff>=0?"+":""}${diff.toFixed(1)} kg）`:""}。体重变化意味着什么请交给医生判断。</p>`;
}
function prepItems(){
  const visit=DB.events.find(e=>e.visit);const today=localDate(new Date()),end=visit&&visit.date<today?visit.date:today;
  const days=new Set(DB.readings.filter(r=>r.status==="ok"&&daysBetween(r.date,end)<=7&&daysBetween(r.date,end)>=0).map(r=>r.date)).size;
  const pend=pendingCount();const test=DB.events.find(e=>e.kind==="test");
  return [
    {ok:days>=5,t:"复诊前的血压记录",s:`最近 7 天里有 ${days} 天有已确认读数，天数以医生要求为准`,btn:days>=5?"":"记录",act:"addbp"},
    {ok:pend===0,t:"核对待确认的条目",s:pend?`还有 ${pend} 条待核对`:"全部已对照原件确认",btn:pend?"处理":"",act:"showpend"},
    {ok:Boolean(test&&test.status==="ok"),t:"检查结果单原件",s:"复诊带原件，数值以原件为准",btn:test&&test.status==="ok"?"":"查看",act:"showtest"},
    {ok:!!DB.prep.questions.trim(),t:"想问医生的问题",s:DB.prep.questions.trim()?esc(DB.prep.questions.trim().split("\n")[0]).slice(0,40):"写下来，复诊时不怕忘",btn:DB.prep.questions.trim()?"修改":"填写",act:"questions"},
    {ok:DB.prep.medsReady,t:"正在吃的药",s:"带上药盒或拍下药盒",btn:DB.prep.medsReady?"撤回":"已备好",act:"meds"}];
}

/* ================= 一页复诊单内容汇编 ================= */
function clinicSheetHTML(){
  const today=localDate(new Date());
  const demo=isDemoPerson();
  const condNames=[...(DB.myConds||[]).map(id=>typeof condById==="function"&&condById(id)?.name).filter(Boolean),...(DB.customConds||[])];
  const visit=(DB.events||[]).find(e=>e.visit);
  const qs=(DB.prep?.questions||"").split(/\n+/).map(s=>s.trim()).filter(Boolean);
  const okBP=(DB.readings||[]).filter(r=>r.status==="ok").sort((a,b)=>(b.date+(b.time||"")).localeCompare(a.date+(a.time||"")));
  const okGlu=(DB.glucoseReadings||[]).filter(r=>r.status==="ok").sort((a,b)=>(b.date+(b.time||"")).localeCompare(a.date+(a.time||"")));
  const okWt=(DB.weightReadings||[]).filter(r=>r.status==="ok").sort((a,b)=>(b.date+(b.time||"")).localeCompare(a.date+(a.time||"")));
  const syms=(DB.symptoms||[]).slice(-5).reverse();
  const okEvs=(DB.events||[]).filter(e=>e.status==="ok").sort((a,b)=>b.date.localeCompare(a.date)).slice(0,6);
  const pend=pendingCount();
  const bpSummary=(()=>{
    if(!okBP.length)return '<p class="muted" style="margin:4px 0 0">暂无已确认的血压记录。</p>';
    const avgS=Math.round(okBP.reduce((a,r)=>a+r.sys,0)/okBP.length),avgD=Math.round(okBP.reduce((a,r)=>a+r.dia,0)/okBP.length);
    const minS=Math.min(...okBP.map(r=>r.sys)),maxS=Math.max(...okBP.map(r=>r.sys));
    const minD=Math.min(...okBP.map(r=>r.dia)),maxD=Math.max(...okBP.map(r=>r.dia));
    return `<div style="font-variant-numeric:tabular-nums">共 ${okBP.length} 次已确认记录，平均 <b>${avgS}/${avgD}</b> mmHg（高压 ${minS}–${maxS}，低压 ${minD}–${maxD}）</div>
    <ul class="plain" style="margin-top:6px;font-size:.88rem;font-variant-numeric:tabular-nums">${okBP.slice(0,5).map(r=>`<li>${esc(r.date)} ${esc(r.time||"")}：<b>${r.sys}/${r.dia}</b> mmHg</li>`).join("")}</ul>`;
  })();
  const gluSummary=(()=>{
    if(!okGlu.length)return '<p class="muted" style="margin:4px 0 0">暂无已确认的指尖血糖记录。</p>';
    const vs=okGlu.map(r=>+r.val),lo=Math.min(...vs).toFixed(1),hi=Math.max(...vs).toFixed(1);
    return `<div style="font-variant-numeric:tabular-nums">共 ${okGlu.length} 次已确认记录，范围 <b>${lo}–${hi}</b> mmol/L</div>
    <ul class="plain" style="margin-top:6px;font-size:.88rem;font-variant-numeric:tabular-nums">${okGlu.slice(0,5).map(r=>`<li>${esc(r.date)} ${esc(r.time||"")}（${esc(GLUCOSE_CTX[r.ctx]||"自测")}）：<b>${Number(r.val).toFixed(1)}</b> mmol/L${r.note?` · ${esc(r.note)}`:""}</li>`).join("")}</ul>`;
  })();
  const wtSummary=(()=>{
    if(!okWt.length)return '<p class="muted" style="margin:4px 0 0">暂无已确认的体重记录。</p>';
    const latest=Number(okWt[0].kg),oldest=Number(okWt[okWt.length-1].kg),diff=latest-oldest;
    return `<div style="font-variant-numeric:tabular-nums">共 ${okWt.length} 次已确认记录，最近一次 <b>${latest.toFixed(1)}</b> kg${okWt.length>=2?`（较较早记录 ${diff>=0?"+":""}${diff.toFixed(1)} kg）`:""}</div>
    <ul class="plain" style="margin-top:6px;font-size:.88rem;font-variant-numeric:tabular-nums">${okWt.slice(0,5).map(r=>`<li>${esc(r.date)} ${esc(r.time||"")}：<b>${Number(r.kg).toFixed(1)}</b> kg${r.note?` · ${esc(r.note)}`:""}</li>`).join("")}</ul>`;
  })();
  return `<div class="clinic-sheet">
    <header class="cs-head">
      <div>
        <h2 style="margin:0">${I("clip","color:var(--teal)")}一页复诊单</h2>
        <div style="margin-top:4px"><b style="font-size:1.08rem">${esc(DB.person.name)}</b>${demo?'<span class="fict">虚构</span>':""} <span class="muted">· ${esc(DB.person.note||"")}</span></div>
        <div style="margin-top:4px;font-size:.9rem"><b>正在关注的情况：</b>${condNames.length?esc(condNames.join("、")):"未勾选"}</div>
      </div>
      <div class="muted" style="font-variant-numeric:tabular-nums">整理日期：${today}${visit?`<br>预约复诊：${esc(visit.date)}`:""}</div>
    </header>
    <p class="muted" style="margin:0">本页由家属根据居家记录与病历原件整理，供复诊时向医生汇报参考；不含诊断或调药建议，检查结果与处方请以医院原件为准。</p>

    <div class="cs-grid">
      <section class="cs-sec" style="background:var(--bg-2)">
        <h3>1. 本次最想问医生的问题</h3>
        ${qs.length?`<ol style="margin:0;padding-left:1.3em">${qs.map(q=>`<li>${esc(q)}</li>`).join("")}</ol>`:'<p class="muted" style="margin:0">暂未填写（可点击下方「填写 / 修改问题」提前写好）。</p>'}
      </section>

      <section class="cs-sec">
        <h3>2. 目前用药记录（照药盒与处方抄录）</h3>
        ${(DB.meds||[]).length?`<ul class="plain">${DB.meds.map(m=>{
          const recentLogs=(m.log||[]).filter(dt=>daysBetween(dt.slice(0,10),today)<=7&&daysBetween(dt.slice(0,10),today)>=0).length;
          return `<li><b>${esc(m.name)}</b> — ${esc(m.how)} <span class="muted">（近 7 天已记 ${recentLogs} 次）</span></li>`;
        }).join("")}</ul>`:'<p class="muted" style="margin:0">暂无用药记录，复诊请带上正在服用的所有药盒原件（含保健品与中药）。</p>'}
        <p class="muted" style="margin:6px 0 0">${DB.prep?.medsReady?"✓ 家属已备好药盒原件待带去复诊":"提醒：出门前请把药盒装进袋子一并带去"}</p>
      </section>
    </div>

    <section class="cs-sec">
      <h3>3. 近期已确认居家监测汇总</h3>
      ${pend?`<p class="muted" style="margin:0 0 8px">注：另有 ${pend} 条「待核对」条目未计入下方汇总，请核对原件后再确认。</p>`:""}
      <div style="display:grid;gap:10px">
        <div><b style="color:var(--steel)">家庭血压</b>${bpSummary}</div>
        <div style="border-top:1px dashed var(--line);padding-top:8px"><b style="color:var(--amber)">指尖血糖</b>${gluSummary}</div>
        <div style="border-top:1px dashed var(--line);padding-top:8px"><b style="color:var(--teal)">晨起体重</b>${wtSummary}</div>
      </div>
    </section>

    <div class="cs-grid">
      <section class="cs-sec">
        <h3>4. 近期症状日记</h3>
        ${syms.length?`<ul class="plain">${syms.map(x=>`<li><b>${esc(x.what)}</b>（程度 ${x.lvl}/10）${x.detail?`：${esc(x.detail)}`:""} <span class="muted">· ${esc(x.at)}</span></li>`).join("")}</ul>`:'<p class="muted" style="margin:0">近期未记录不适症状。</p>'}
      </section>

      <section class="cs-sec">
        <h3>5. 关键病历事件（已确认）</h3>
        ${okEvs.length?`<ul class="plain">${okEvs.map(e=>`<li><span style="font-variant-numeric:tabular-nums">${esc(e.date)}</span> · <b>${esc(e.title)}</b>${e.detail?` — ${esc(e.detail.replace(/\s+/g," ").slice(0,90))}`:""} <span class="muted">（${esc(e.src)}）</span></li>`).join("")}</ul>`:'<p class="muted" style="margin:0">暂无已确认的病历事件。</p>'}
      </section>
    </div>
  </div>`;
}

function folderHTML(){
  const vitalEvs=[
    ...DB.readings.map(r=>({id:r.id,kind:"bp",date:r.date,time:r.time,title:`血压 ${r.sys}/${r.dia} mmHg`,detail:"",src:r.src,status:r.status})),
    ...(DB.glucoseReadings||[]).map(r=>({id:r.id,kind:"glucose",date:r.date,time:r.time,title:`指尖血糖（${GLUCOSE_CTX[r.ctx]||"自测"}）${Number(r.val).toFixed(1)} mmol/L`,detail:r.note||"",src:r.src,status:r.status})),
    ...(DB.weightReadings||[]).map(r=>({id:r.id,kind:"weight",date:r.date,time:r.time,title:`体重 ${Number(r.kg).toFixed(1)} kg`,detail:r.note||"",src:r.src,status:r.status}))
  ];
  const all=[...DB.events,...vitalEvs]
    .filter(e=>state.filter==="all"||(state.filter==="pend"?e.status==="pend":e.kind===state.filter))
    .sort((a,b)=>(b.date+(b.time||"")).localeCompare(a.date+(a.time||"")));
  const items=prepItems(),done=items.filter(i=>i.ok).length,Cc=2*Math.PI*52;
  const visit=DB.events.find(e=>e.visit);const left=visit?daysBetween(localDate(new Date()),visit.date):null;
  const segs=[["all","全部",""],["pend","待核对","pending"],...Object.entries(KIND).map(([k,v])=>[k,v.label,v.c])];
  const ck=["bp","glucose","weight"].includes(state.chartKind)?state.chartKind:"bp";
  const demo=isDemoPerson();
  return `<h1>病历夹</h1>
  <p class="lead">按时间整理就诊、检查、用药与居家血压、血糖、体重。每条都有出处；新录入的要对照原件确认后才算数。</p>
  <div class="cols"><div>
    <div class="panel person" style="flex-wrap:wrap"><div class="avatar">${esc(DB.person.initial)}</div>
      <div style="flex:1;min-width:150px"><b style="font-size:1.1rem">${esc(DB.person.name)}</b>${demo?'<span class="fict">虚构</span>':""}<div class="muted">${esc(DB.person.note)}</div></div>
      <div class="row no-print"><button type="button" class="btn sm" data-act="clinicsheet">${I("clip")}一页复诊单</button><button type="button" class="btn sm only-desk" data-act="print">${I("print")}打印</button></div></div>
    <div class="row no-print" style="margin-top:14px">
      <button type="button" class="btn btn-primary" data-act="upload">${I("upload")}上传病历</button>
      <button type="button" class="btn" data-act="ai">${I("spark")}AI 整理（先脱敏）</button>
      <button type="button" class="btn sm" data-act="addbp">${I("heart")}记录血压</button>
      <button type="button" class="btn sm" data-act="addglucose">${I("drop")}记录血糖</button>
      <button type="button" class="btn sm" data-act="addweight">${I("scale")}记录体重</button></div>
    <div class="seg no-print" role="group" aria-label="筛选" style="margin-top:14px">${segs.map(([k,l,c])=>`<button type="button" data-filter="${k}" aria-pressed="${state.filter===k}">${c?`<span class="sw" style="background:var(--${c})"></span>`:""}${l}</button>`).join("")}</div>
    <ol class="timeline">${all.map(e=>{const k=KIND[e.kind]||KIND.doc;return `<li class="ev ${e.status==="pend"?"pending":""}">
      <div class="node" style="background:var(--${k.c}-t);color:var(--${k.c})">${I(k.i)}</div>
      <div class="box" style="min-width:0"><div class="date">${e.date}${e.time?" "+e.time:""} · <span style="color:var(--${k.c});font-weight:700">${k.label}</span><span class="status ${e.status==="ok"?"st-ok":"st-pend"}">${e.status==="ok"?"已确认":"待核对"}</span>${e.ai?'<span class="status" style="background:var(--indigo-t);color:var(--indigo)">AI 整理</span>':""}</div>
        <b>${esc(e.title)}</b>${e.detail?`<div style="color:var(--ink-2);font-size:.92rem;white-space:pre-line">${esc(e.detail)}</div>`:""}
        ${e.files?.length?`<div class="thumbs">${e.files.map(f=>f.type.startsWith("image/")?`<img class="thumb" data-fid="${f.id}" data-view="${f.id}" alt="${esc(f.name)}">`:`<button type="button" class="thumb" data-view="${f.id}">${I("doc")}<br>PDF</button>`).join("")}</div>`:""}
        <div class="src">出处：${esc(e.src)}</div>
        <div class="row no-print" style="margin-top:10px">${e.status==="pend"?`<button type="button" class="btn sm btn-primary" data-confirm="${e.id}">${I("check")}已对照原件，确认</button>`:""}${e.files?.length?`<button type="button" class="btn sm" data-act="ai" data-from="${e.id}">${I("spark")}整理这份</button>`:""}${e.status==="pend"||e.kind==="doc"?`<button type="button" class="btn sm btn-ghost" data-del="${e.id}">删除</button>`:""}</div>
      </div></li>`}).join("")||'<li class="ev"><div class="box" style="margin-left:60px"><p style="margin:0 0 8px">这个分类下还没有记录。</p><button type="button" class="btn sm" data-filter="all">看全部记录</button></div></li>'}</ol>
    <div class="row no-print" style="margin-top:18px">
      <button type="button" class="btn sm" data-act="exportjson">${I("doc")}导出 JSON 备份</button>
      <button type="button" class="btn sm" data-act="importjson">${I("upload")}导入备份恢复</button>
      <button type="button" class="btn sm btn-ghost" data-act="reset">恢复演示数据</button></div>
  </div>
  <aside class="rail">
    <section class="panel" aria-labelledby="prepH"><h2 id="prepH" style="margin-bottom:4px">复诊准备</h2>
      <p class="muted" style="margin:0 0 12px">${visit?`${visit.date} 社区复诊${left!==null&&left>=0?` · 还有 ${left} 天`:""}`:""}</p>
      <div class="prep"><div class="ring" role="img" aria-label="复诊准备完成 ${done} 项，共 ${items.length} 项">
        <svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="52" fill="none" style="stroke:var(--bg-2)" stroke-width="10"/><circle cx="60" cy="60" r="52" fill="none" style="stroke:var(--teal)" stroke-width="10" stroke-linecap="round" stroke-dasharray="${Cc}" stroke-dashoffset="${Cc*(1-done/items.length)}"/></svg>
        <div class="num"><div><b>${done}/${items.length}</b><small>已准备</small></div></div></div>
        <div><b>${done===items.length?"都准备好了":"还差 "+(items.length-done)+" 项"}</b><div class="muted">这是带去复诊的清单进度，不是健康评分。</div>
        <div class="row" style="margin-top:10px;gap:8px"><button type="button" class="btn btn-accent sm" style="background:var(--teal)" data-act="clinicsheet">${I("clip")}一页复诊单</button><button type="button" class="btn sm" data-act="addbp">${I("plus")}记血压</button></div></div></div>
      <ul class="checks">${items.map(i=>`<li><span class="${i.ok?"ok":"warn"}">${I(i.ok?"check":"warn","width:22px;height:22px")}</span>
        <div class="t"><b>${i.t}</b><small>${i.s}</small></div>${i.btn?`<button type="button" class="btn sm" data-prep="${i.act}">${i.btn}</button>`:""}</li>`).join("")}</ul></section>
    <section class="panel chartbox">
      <div class="row" style="justify-content:space-between;align-items:center;margin-bottom:8px">
        <h2 style="margin:0">${ck==="glucose"?"血糖趋势":ck==="weight"?"体重趋势":"血压趋势"}</h2>
        <div class="seg no-print" role="group" aria-label="趋势指标">
          <button type="button" data-chart="bp" aria-pressed="${ck==="bp"}">血压</button>
          <button type="button" data-chart="glucose" aria-pressed="${ck==="glucose"}">血糖</button>
          <button type="button" data-chart="weight" aria-pressed="${ck==="weight"}">体重</button>
        </div>
      </div>
      ${chartSummaryText(ck)}${chartSVG(ck)}
    </section>
  </aside></div>`;
}

/* ================= 设置 ================= */
function settingsHTML(){
  const seg=(name,opts)=>`<div class="seg" role="group">${opts.map(([v,l,ic])=>`<button type="button" data-pref="${name}" data-val="${v}" aria-pressed="${prefs[name]===v}">${ic?I(ic):""}${l}</button>`).join("")}</div>`;
  const srcAll=Object.values(SOURCES),srcOk=srcAll.filter(s=>s.v==="ok").length;
  return `<h1>设置与隐私</h1><p class="lead">看得清、点得准，数据留在你自己手里。</p>
  <div class="cols"><div>
  <section class="panel"><h2>显示</h2>
    <div class="setrow"><div><b>外观</b><div class="muted">深色适合晚上量血压时用</div></div>${seg("theme",[["light","浅色","sun"],["dark","深色","moon"],["auto","跟随系统","auto"]])}</div>
    <div class="setrow"><div><b>字号</b><div class="muted">给老人用时建议调大</div></div>${seg("size",[["md","标准"],["lg","大"],["xl","特大"]])}</div>
    <div class="setrow"><div><b>动效</b><div class="muted">减弱后卡片不再倾斜，翻面改为淡入</div></div>${seg("motion",[["full","标准"],["reduce","减弱"]])}</div></section>
  <section class="panel"><h2>AI 整理</h2>
    <p style="margin:0 0 8px">AI 整理只会发送<b>你确认过的、脱敏后的文字</b>，不会发送图片原件。</p>
    <label class="f" for="aiEp">AI 服务地址（你们自己的后端代理）</label>
    <input class="inp" id="aiEp" placeholder="留空 = 本地演示，不联网" value="${esc(prefs.aiEndpoint)}">
    <p class="muted" style="margin:6px 0 0">密钥只能放在后端代理里，网页里不保存任何 API 密钥。留空时用本地规则整理，不联网。</p>
    <button type="button" class="btn sm" style="margin-top:10px" data-act="saveEp">保存</button></section>
  <section class="panel"><h2>你的数据与备份</h2>
    <ul class="plain"><li>记录和上传的病历都只存在这台设备的浏览器里，不上传服务器。</li>
    <li>${storeProbe?"本机存储可用。":"本机存储不可用，记录可能存不住。"}${persistState==="granted"?"浏览器已同意常驻存储。":persistState==="declined"?"浏览器未同意常驻存储，记录仍可能被清理。":persistState==="unsupported"?"这个浏览器不支持常驻存储请求。":""}部分手机浏览器长时间不打开网页会清理缓存，重要记录请定期导出 JSON 备份保存。</li>
    <li>JSON 备份包含卡组、病历事件、血压、血糖、体重、用药与症状记录（本机拍照上传的图片与 PDF 原件请另行留存原件）。</li>
    <li>演示里的人物、病历和读数都是虚构的。请不要把真实病历放进公开演示。</li>
    <li>自动脱敏会漏，不能保证完全匿名；发送前一定逐行看一遍。</li></ul>
    <div class="row" style="margin-top:14px">
      <button type="button" class="btn btn-primary" data-act="exportjson">${I("doc")}导出 JSON 备份</button>
      <button type="button" class="btn" data-act="importjson">${I("upload")}导入备份恢复</button>
      <button type="button" class="btn" data-act="wipe">清除本机所有记录和文件</button></div></section>
  </div><aside class="rail">
  <section class="panel"><h2>鹤伴做什么、不做什么</h2>
    <ul class="plain"><li>做：把照护步骤讲清楚，每条临床信息都能点回来源；把病历按时间整理好，方便带去复诊。</li>
    <li>不做：诊断、解读化验结果好坏、建议停药或改剂量。</li></ul>
    <p class="muted" style="margin:12px 0 0">快捷键（电脑）：1 卡组 · 2 找卡 · 3 病历夹 · 4 设置 · / 搜索 · N 记录血压 · U 上传病历</p></section>
  <section class="panel"><h2>内容更新日志</h2>
    <p style="margin:0">来源共 ${srcAll.length} 条，其中 ${srcOk} 条已通读核对，${srcAll.length-srcOk} 条待人工通读。</p>
    <p class="muted" style="margin:8px 0 0">卡片里的来源编号与正文角标对应，点击可打开原文。</p></section>
  </aside></div>`;
}

/* ================= 弹层 ================= */
const dlg=document.getElementById("dlg"),dlgBody=document.getElementById("dlgBody");
let __dlgAnim=null;
function stopBedsideSpeech(){
  try{if(typeof window!=="undefined"&&"speechSynthesis" in window)window.speechSynthesis.cancel()}catch(_){}
}
dlg.addEventListener("close",stopBedsideSpeech);
function openDlg(html,wide=false){
  const wasOpen=dlg.open;
  dlg.classList.toggle("wide",wide);
  dlgBody.innerHTML=html;
  if(!dlg.open)dlg.showModal();
  if(!wasOpen&&!motionReduced()&&!(typeof navigator!=="undefined"&&navigator.webdriver)&&dlgBody.animate){
    try{__dlgAnim?.cancel();__dlgAnim=dlgBody.animate([{opacity:0,transform:"translateY(8px) scale(0.98)"},{opacity:1,transform:"translateY(0) scale(1)"}],{duration:180,easing:"cubic-bezier(0.23,1,0.32,1)"})}catch(_){}
  }
}

/* ---------- 记录血压 ---------- */
function openAdd(pre){
  const d=new Date();
  openDlg(`<h2>${I("heart","color:var(--steel)")}记录一次血压</h2><p class="muted" style="margin:0">按血压计屏幕上的数字填写。连测两次就分别记两条。</p>
  <form id="f" novalidate>
   <div class="two"><div><label class="f" for="fd">日期</label><input class="inp" id="fd" type="date" value="${pre?.date||localDate(d)}"></div>
   <div><label class="f" for="ft">时间</label><input class="inp" id="ft" type="time" value="${pre?.time||pad(d.getHours())+":"+pad(d.getMinutes())}"></div></div>
   <div class="two"><div><label class="f" for="fs">收缩压（高压）</label><input class="inp" id="fs" inputmode="numeric" autocomplete="off" placeholder="例如 135" value="${pre?.sys||""}"></div>
   <div><label class="f" for="fdi">舒张压（低压）</label><input class="inp" id="fdi" inputmode="numeric" autocomplete="off" placeholder="例如 85" value="${pre?.dia||""}"></div></div>
   <div id="ferr" class="err" role="alert"></div>
   <div class="row" style="margin-top:18px;justify-content:flex-end"><button type="button" class="btn btn-ghost" data-close>取消</button><button class="btn btn-primary">下一步：核对</button></div></form>`);
  setTimeout(()=>document.getElementById("fs")?.focus(),30);
  document.getElementById("f").onsubmit=ev=>{ev.preventDefault();
    const s=+document.getElementById("fs").value,di=+document.getElementById("fdi").value,err=document.getElementById("ferr");
    if(!(s>=60&&s<=280&&di>=30&&di<=180)){err.textContent="数字看起来不对，请对照血压计屏幕再填一次（高压一般在 60–280，低压在 30–180 之间）。";return}
    if(di>=s){err.textContent="低压应该比高压小，请检查是否填反了。";return}
    showConfirm({date:document.getElementById("fd").value,time:document.getElementById("ft").value,sys:s,dia:di})};
}
function showConfirm(r){
  const high=r.sys>180||r.dia>120;
  openDlg(`<h2>${I("lock")}核对这次读数</h2><p class="muted" style="margin:0">对照血压计屏幕，确认无误再保存。</p>
   <div class="approve"><div class="code"><b>${r.sys}/${r.dia}</b> mmHg<div class="muted">${r.date} ${r.time} · 家庭血压计手动录入</div></div>
   ${high?`<div class="stop" data-stop style="margin:4px 0 12px"><h2>${I("alert")}这次读数很高</h2>
     <p style="margin:0">先静坐，<b>等至少 1 分钟再量一次</b>。仍高于 180/120，请<b>尽快联系医生</b>；如果同时有胸痛、气短、背痛、麻木、无力、视物改变或说话困难，<b>立即拨打 120</b>${ref("aha")}。</p></div>`:""}
   <div class="row"><button type="button" class="btn btn-primary" data-saveok>${I("check")}数字无误，保存</button><button type="button" class="btn" data-savepend>先存为待核对</button><button type="button" class="btn btn-ghost" data-back>返回修改</button></div></div>`);
  dlgBody.querySelector("[data-back]").onclick=()=>openAdd(r);
  const put=st=>{const id="u"+Date.now();DB.readings.push({id,...r,status:st,src:"家庭血压计手动录入"});state.chartKind="bp";save();dlg.close();go("folder");
    toast(`已${st==="ok"?"保存":"存为待核对"} ${r.sys}/${r.dia}`,()=>{DB.readings=DB.readings.filter(x=>x.id!==id);save();render()})};
  dlgBody.querySelector("[data-savepend]").onclick=()=>put("pend");
  dlgBody.querySelector("[data-saveok]").onclick=()=>put("ok");
}

/* ---------- 记录指尖血糖 ---------- */
function openAddGlucose(pre){
  const d=new Date(),ctx=pre?.ctx||"fasting";
  const opts=[["fasting","空腹（至少 8 小时未进食）"],["post2h","餐后 2 小时（从吃第一口饭算起）"],["premeal","餐前"],["bedtime","睡前"],["random","随机 / 不舒服时加测"]];
  openDlg(`<h2>${I("drop","color:var(--amber)")}记录一次指尖血糖</h2><p class="muted" style="margin:0">按血糖仪屏幕上的数字填写，单位为 mmol/L。</p>
  <form id="fg" novalidate>
   <div class="two"><div><label class="f" for="fgd">日期</label><input class="inp" id="fgd" type="date" value="${pre?.date||localDate(d)}"></div>
   <div><label class="f" for="fgt">时间</label><input class="inp" id="fgt" type="time" value="${pre?.time||pad(d.getHours())+":"+pad(d.getMinutes())}"></div></div>
   <div class="two"><div><label class="f" for="fgc">测量时段</label><select class="inp" id="fgc">${opts.map(([v,l])=>`<option value="${v}" ${ctx===v?"selected":""}>${l}</option>`).join("")}</select></div>
   <div><label class="f" for="fgv">血糖数值（mmol/L）</label><input class="inp" id="fgv" inputmode="decimal" autocomplete="off" placeholder="例如 6.2" value="${pre?.val??""}"></div></div>
   <label class="f" for="fgn">备注（选填）</label><input class="inp" id="fgn" placeholder="例如：早餐后散步 20 分钟、测前有点手抖" value="${esc(pre?.note||"")}">
   <div id="fgerr" class="err" role="alert"></div>
   <div class="row" style="margin-top:18px;justify-content:flex-end"><button type="button" class="btn btn-ghost" data-close>取消</button><button class="btn btn-primary">下一步：核对</button></div></form>`);
  setTimeout(()=>document.getElementById("fgv")?.focus(),30);
  document.getElementById("fg").onsubmit=ev=>{ev.preventDefault();
    const raw=document.getElementById("fgv").value.trim(),v=parseFloat(raw),err=document.getElementById("fgerr");
    if(!Number.isFinite(v)||v<1||v>35){err.textContent="数字看起来不对，请对照血糖仪屏幕再填一次（单位 mmol/L，一般在 1.0–35.0 之间）。";return}
    showConfirmGlucose({date:document.getElementById("fgd").value,time:document.getElementById("fgt").value,ctx:document.getElementById("fgc").value,val:Math.round(v*10)/10,note:document.getElementById("fgn").value.trim().slice(0,80)})};
}
function showConfirmGlucose(r){
  const low=r.val<=3.9,veryHigh=r.val>=16.7;
  const srcCma=!document.getElementById("src-cmahypo")&&SOURCES.cmahypo?`<div id="src-cmahypo" class="muted" style="margin-top:6px;font-size:.8rem">来源 [${SOURCES.cmahypo.n}]：<a href="${SOURCES.cmahypo.url}" target="_blank" rel="noopener">${esc(SOURCES.cmahypo.t)}</a></div>`:"";
  const srcJcdm=!document.getElementById("src-jcdm")&&SOURCES.jcdm?`<div id="src-jcdm" class="muted" style="margin-top:6px;font-size:.8rem">来源 [${SOURCES.jcdm.n}]：<a href="${SOURCES.jcdm.url}" target="_blank" rel="noopener">${esc(SOURCES.jcdm.t)}</a></div>`:"";
  openDlg(`<h2>${I("lock")}核对这次血糖读数</h2><p class="muted" style="margin:0">对照血糖仪屏幕与测量时段，确认无误再保存。</p>
   <div class="approve"><div class="code"><b>${r.val.toFixed(1)}</b> mmol/L<div class="muted">${r.date} ${r.time} · ${esc(GLUCOSE_CTX[r.ctx]||"自测")}${r.note?" · "+esc(r.note):""}</div></div>
   ${low?`<div class="stop" data-stop style="margin:4px 0 12px"><h2>${I("alert")}这次血糖偏低（≤ 3.9 mmol/L）</h2>
     <p style="margin:0">对正在用降糖药或胰岛素的糖尿病人，血糖 ≤ 3.9 mmol/L 属于低血糖${ref("cmahypo")}。若家人<b>清醒、能正常吞咽</b>，请按医生事先交代的方法补充含糖食物或饮料，约 15 分钟后再测一次；若<b>叫不醒、意识不清、抽搐或不能吞咽，不要喂任何东西，让家人侧躺并马上拨打 120</b>${ref("cmahypo")}。</p>${srcCma}</div>`:""}
   ${veryHigh?`<div class="stop" data-stop style="margin:4px 0 12px"><h2>${I("alert")}这次血糖很高（≥ 16.7 mmol/L）</h2>
     <p style="margin:0">如果同时有恶心呕吐、肚子痛、呼吸有烂苹果味或精神很差，请<b>尽快去医院</b>；若叫不醒、意识不清或抽搐，<b>马上拨打 120</b>${ref("jcdm")}。</p>${srcJcdm}</div>`:""}
   <div class="row"><button type="button" class="btn btn-primary" data-saveok>${I("check")}数字无误，保存</button><button type="button" class="btn" data-savepend>先存为待核对</button><button type="button" class="btn btn-ghost" data-back>返回修改</button></div></div>`);
  dlgBody.querySelector("[data-back]").onclick=()=>openAddGlucose(r);
  const put=st=>{const id="g"+Date.now();DB.glucoseReadings.push({id,...r,status:st,src:"居家指尖血糖手动录入"});state.chartKind="glucose";save();dlg.close();go("folder");
    toast(`已${st==="ok"?"保存":"存为待核对"} 血糖 ${r.val.toFixed(1)} mmol/L`,()=>{DB.glucoseReadings=DB.glucoseReadings.filter(x=>x.id!==id);save();render()})};
  dlgBody.querySelector("[data-savepend]").onclick=()=>put("pend");
  dlgBody.querySelector("[data-saveok]").onclick=()=>put("ok");
}

/* ---------- 记录晨起体重 ---------- */
function openAddWeight(pre){
  const d=new Date();
  openDlg(`<h2>${I("scale","color:var(--teal)")}记录晨起体重</h2><p class="muted" style="margin:0">建议固定在早晨排空小便后、吃早饭前、穿相近厚度的衣服用同一台秤称重。</p>
  <form id="fw" novalidate>
   <div class="two"><div><label class="f" for="fwd">日期</label><input class="inp" id="fwd" type="date" value="${pre?.date||localDate(d)}"></div>
   <div><label class="f" for="fwt">时间</label><input class="inp" id="fwt" type="time" value="${pre?.time||pad(d.getHours())+":"+pad(d.getMinutes())}"></div></div>
   <div><label class="f" for="fwk">体重（kg）</label><input class="inp" id="fwk" inputmode="decimal" autocomplete="off" placeholder="例如 58.5" value="${pre?.kg??""}"></div>
   <label class="f" for="fwn">测量条件备注（选填）</label><input class="inp" id="fwn" placeholder="例如：晨起排尿后、早饭前、薄睡衣" value="${esc(pre?.note??"晨起排尿后、早饭前")}">
   <div id="fwerr" class="err" role="alert"></div>
   <div class="row" style="margin-top:18px;justify-content:flex-end"><button type="button" class="btn btn-ghost" data-close>取消</button><button class="btn btn-primary">下一步：核对</button></div></form>`);
  setTimeout(()=>document.getElementById("fwk")?.focus(),30);
  document.getElementById("fw").onsubmit=ev=>{ev.preventDefault();
    const raw=document.getElementById("fwk").value.trim(),kg=parseFloat(raw),err=document.getElementById("fwerr");
    if(!Number.isFinite(kg)||kg<2||kg>300){err.textContent="数字看起来不对，请对照体重秤屏幕再填一次（单位为公斤 kg，一般在 2–300 之间）。";return}
    showConfirmWeight({date:document.getElementById("fwd").value,time:document.getElementById("fwt").value,kg:Math.round(kg*10)/10,note:document.getElementById("fwn").value.trim().slice(0,80)})};
}
function showConfirmWeight(r){
  openDlg(`<h2>${I("lock")}核对这次体重读数</h2><p class="muted" style="margin:0">新录入记录可先存为「待核对」，对照体重秤或记录本确认无误后再归档。</p>
   <div class="approve"><div class="code"><b>${r.kg.toFixed(1)}</b> kg<div class="muted">${r.date} ${r.time} · ${esc(r.note||"居家体重秤手动录入")}</div></div>
   <p class="muted" style="margin:0 0 12px">短时间内体重明显波动，或伴随脚踝水肿、夜里平躺气短时，请及时联系医生评估。</p>
   <div class="row"><button type="button" class="btn btn-primary" data-savepend>先存为待核对</button><button type="button" class="btn" data-saveok>${I("check")}数字无误，直接确认</button><button type="button" class="btn btn-ghost" data-back>返回修改</button></div></div>`);
  dlgBody.querySelector("[data-back]").onclick=()=>openAddWeight(r);
  const put=st=>{const id="w"+Date.now();DB.weightReadings.push({id,...r,status:st,src:"居家体重秤手动录入"});state.chartKind="weight";save();dlg.close();go("folder");
    toast(`已${st==="ok"?"确认保存":"存为待核对"} 体重 ${r.kg.toFixed(1)} kg`,()=>{DB.weightReadings=DB.weightReadings.filter(x=>x.id!==id);save();render()})};
  dlgBody.querySelector("[data-savepend]").onclick=()=>put("pend");
  dlgBody.querySelector("[data-saveok]").onclick=()=>put("ok");
}

function openQuestions(){
  openDlg(`<h2>${I("clip","color:var(--teal)")}想问医生的问题</h2><p class="muted" style="margin:0">一行一个，最重要的写在前面。</p>
  <label class="f sr" for="qa">问题</label><textarea class="inp" id="qa" style="margin-top:12px" placeholder="例如：早上读数总比晚上高，需要注意什么？">${esc(DB.prep.questions)}</textarea>
  <div class="row" style="margin-top:14px;justify-content:flex-end"><button type="button" class="btn btn-ghost" data-close>取消</button><button type="button" class="btn btn-primary" id="qsave">保存</button></div>`);
  document.getElementById("qsave").onclick=()=>{DB.prep.questions=document.getElementById("qa").value;save();dlg.close();render();toast("问题清单已保存")};
}

/* ---------- 一页复诊单 ---------- */
function openClinicSheet(){
  openDlg(`${clinicSheetHTML()}
  <div class="row no-print" style="margin-top:16px;justify-content:space-between">
    <button type="button" class="btn sm" id="csEditQ">${I("note")}填写 / 修改问题</button>
    <div class="row"><button type="button" class="btn btn-ghost" data-close>关闭</button><button type="button" class="btn btn-primary" id="csPrint">${I("print")}打印复诊单</button></div>
  </div>`,true);
  const pb=document.getElementById("csPrint");if(pb)pb.onclick=()=>window.print();
  const qb=document.getElementById("csEditQ");if(qb)qb.onclick=()=>openQuestions();
}

/* ---------- 床旁伴读 · 一步步大字跟做（Hack4Good 无障碍伴读 + 离线语音） ---------- */
function openBedside(cardKey){
  const k=cardKey||state.card;
  const c=CARDS[k];
  const steps=typeof getCardSteps==="function"?getCardSteps(k):(CONTENT[k]?.steps||[]);
  if(!c||!steps.length)return;
  const hasTTS=typeof window!=="undefined"&&"speechSynthesis" in window&&typeof SpeechSynthesisUtterance!=="undefined";
  let idx=steps.findIndex((_,i)=>!doneStepsFor(k).has(i));
  if(idx<0)idx=0;
  let speaking=false;
  const plainText=s=>String(s||"").replace(/<[^>]+>/g,"").replace(/\[\d+\]/g,"").trim();

  const syncPageSteps=()=>{
    if(state.view==="card"&&state.card===k){
      const set=doneStepsFor(k);
      document.querySelectorAll("ol.steps li").forEach(li=>{
        const i=+li.dataset.i,d=set.has(i);
        li.classList.toggle("done",d);
        const b=li.querySelector(".stepbtn");
        if(b){b.setAttribute("aria-pressed",String(d));b.textContent=d?"✓":String(i+1)}
      });
      if(typeof updateProgress==="function")updateProgress();
    }
  };
  const setStepDone=(i,done)=>{
    DB.stepDone||={};
    const set=doneStepsFor(k);
    if(done)set.add(i);else set.delete(i);
    const arr=[...set].filter(n=>n>=0&&n<steps.length).sort((a,b)=>a-b);
    if(arr.length)DB.stepDone[k]=arr;else delete DB.stepDone[k];
    save();
    syncPageSteps();
  };
  const updateSpeakUI=()=>{
    const sb=document.getElementById("bsSpeakBtn");
    if(!sb)return;
    sb.setAttribute("aria-pressed",String(speaking));
    sb.innerHTML=`${I("vol")}${speaking?"停止朗读":"朗读本步"}`;
  };
  const speakCurrent=()=>{
    if(!hasTTS)return;
    if(speaking){stopBedsideSpeech();speaking=false;updateSpeakUI();return}
    stopBedsideSpeech();
    const s=steps[idx];
    const msg=`${c.title}，第 ${idx+1} 步，共 ${steps.length} 步。${plainText(s.t)}。${s.d?plainText(s.d):""}${s.why?"。为什么这样做："+plainText(s.why):""}`;
    try{
      const u=new SpeechSynthesisUtterance(msg);
      u.lang="zh-CN";
      u.rate=0.92;
      const voices=window.speechSynthesis.getVoices?.()||[];
      const zhVoice=voices.find(v=>/^zh[-_]?CN/i.test(v.lang))||voices.find(v=>/^zh/i.test(v.lang));
      if(zhVoice)u.voice=zhVoice;
      u.onend=()=>{speaking=false;updateSpeakUI()};
      u.onerror=()=>{speaking=false;updateSpeakUI()};
      speaking=true;
      updateSpeakUI();
      window.speechSynthesis.speak(u);
    }catch(_){speaking=false;updateSpeakUI()}
  };

  const drawStep=(animate=false)=>{
    stopBedsideSpeech();
    speaking=false;
    const set=doneStepsFor(k),isDone=set.has(idx),s=steps[idx];
    const srcUsed=new Set([...(s.r||[]),...(s.dr||[]),...(s.wr||[]),...(c.stopRefs||[])]);
    const localSrcs=[...srcUsed].filter(sk=>SOURCES[sk]&&!document.getElementById("src-"+sk));
    openDlg(`<div class="bedside-dlg">
      <div class="bs-head">
        <div>
          <div class="muted" style="font-size:.84rem">${esc(c.title)} · 床旁伴读</div>
          <div class="row" style="gap:8px;margin-top:4px">
            <span class="chip" style="font-variant-numeric:tabular-nums;font-weight:700">第 ${idx+1} / ${steps.length} 步</span>
            ${isDone?'<span class="status st-ok" style="margin-left:0">✓ 本步已完成</span>':'<span class="chip">当前步骤</span>'}
          </div>
        </div>
        <div class="row" style="gap:8px">
          ${hasTTS?`<button type="button" class="btn sm" id="bsSpeakBtn" aria-pressed="false">${I("vol")}朗读本步</button>`:`<span class="muted">当前浏览器不支持离线朗读</span>`}
          ${isDone?`<button type="button" class="btn sm btn-ghost" id="bsToggle">撤回完成</button>`:""}
          <button type="button" class="btn sm btn-ghost" data-close>退出伴读</button>
        </div>
      </div>

      <div class="row" role="group" aria-label="跳到指定步骤" style="gap:6px">
        ${steps.map((_,i)=>`<button type="button" class="btn sm ${i===idx?"btn-primary":""}" data-bsjump="${i}" aria-current="${i===idx}" style="min-width:44px;padding:0 10px;font-variant-numeric:tabular-nums">${set.has(i)?"✓ "+(i+1):(i+1)}</button>`).join("")}
      </div>

      <div class="bs-step" id="bsStepCard">
        <h3 class="bs-title"><span style="font-variant-numeric:tabular-nums">${idx+1}.</span> ${s.t}${refs(s.r)}</h3>
        ${s.d?`<p class="bs-desc">${s.d}${refs(s.dr)}</p>`:""}
        ${s.why?`<div class="bs-why"><b>为什么这样做：</b><span>${s.why}${refs(s.wr)}</span></div>`:""}
      </div>

      ${c.stopMini?`<div class="stop" data-stop style="padding:12px 14px">
        <div style="font-weight:700;display:flex;align-items:center;gap:6px">${I("alert")}出现以下情况请立刻停下联系医护</div>
        <p style="margin:4px 0 0">${c.stopMini}${refs(c.stopRefs)}</p>
      </div>`:""}

      <div class="bs-nav">
        <button type="button" class="btn" id="bsPrev" ${idx===0?"disabled":""}>${I("back")}上一步</button>
        ${idx<steps.length-1
          ?`<button type="button" class="btn btn-primary" id="bsNext">${I("check")}${isDone?"下一步":"完成本步，下一步"}</button>`
          :`<button type="button" class="btn btn-primary" id="bsFinish">${I("check")}完成全部步骤</button>`}
      </div>
      ${localSrcs.length?`<div class="muted" style="font-size:.8rem">${localSrcs.map(sk=>`<span id="src-${sk}" style="margin-right:10px">[${SOURCES[sk].n}] <a href="${SOURCES[sk].url}" target="_blank" rel="noopener">${esc(SOURCES[sk].t)}</a></span>`).join("")}</div>`:""}
    </div>`,true);

    if(animate&&!motionReduced()&&!(typeof navigator!=="undefined"&&navigator.webdriver)){
      const sc=document.getElementById("bsStepCard");
      try{sc?.animate?.([{opacity:0.01,transform:"translateY(5px)"},{opacity:1,transform:"translateY(0)"}],{duration:150,easing:"cubic-bezier(0.23,1,0.32,1)"})}catch(_){}
    }
    const sb=document.getElementById("bsSpeakBtn");if(sb)sb.onclick=speakCurrent;
    const pv=document.getElementById("bsPrev");if(pv)pv.onclick=()=>{if(idx>0){idx--;drawStep(true)}};
    const tg=document.getElementById("bsToggle");if(tg)tg.onclick=()=>{setStepDone(idx,!isDone);drawStep(false)};
    const nx=document.getElementById("bsNext");if(nx)nx.onclick=()=>{setStepDone(idx,true);idx++;drawStep(true)};
    const fn=document.getElementById("bsFinish");if(fn)fn.onclick=()=>{setStepDone(idx,true);stopBedsideSpeech();dlg.close();toast(`已完成「${c.title}」全部步骤`)};
    dlgBody.querySelectorAll("[data-bsjump]").forEach(b=>{b.onclick=()=>{idx=+b.dataset.bsjump;drawStep(true)}});
  };
  drawStep(false);
}

/* ---------- 突发状况 · 先看红线速查（Hack4Good 急救与禁忌三重编码速查） ---------- */
function openRedLines(initGrp="all"){
  const GROUPS_RL=[
    ["all","全部情况",null],
    ["cv","血压与心衰",["bp","weight"]],
    ["dm","血糖与胰岛素",["hypo","glucose","insulin_pen"]],
    ["fall","跌倒与转移",["fall","transfer"]],
    ["re","呼吸与吸入",["breathing","inhaler"]],
    ["care","伤口·滴眼·认知",["wound","eyedrops","dementia"]]
  ];
  let curGrp=GROUPS_RL.some(g=>g[0]===initGrp)?initGrp:"all";

  const draw=(animate=false)=>{
    const grpDef=GROUPS_RL.find(g=>g[0]===curGrp)||GROUPS_RL[0];
    const allowKeys=grpDef[2]||Object.keys(CARDS).filter(k=>CARDS[k]?.ready&&CONTENT[k]?.stop);
    const cards=allowKeys.filter(k=>CARDS[k]?.ready&&CONTENT[k]?.stop);
    const srcUsed=new Set();
    const itemsHTML=cards.map(k=>{
      const c=CARDS[k],C=CONTENT[k];
      const lv120=(C.stop||[]).filter(([lv])=>lv==="120");
      const lvUrg=(C.stop||[]).filter(([lv])=>lv==="urgent");
      const stops=[...lv120,...lvUrg];
      if(!stops.length)return "";
      stops.forEach(([,,,r])=>(r||[]).forEach(sk=>srcUsed.add(sk)));
      const mis=(C.mistakes||[])[0];
      if(mis?.r)mis.r.forEach(sk=>srcUsed.add(sk));
      return `<article class="rl-item" style="border:1px solid var(--line);border-radius:12px;padding:14px;background:var(--card)">
        <div class="row" style="justify-content:space-between;align-items:center;margin-bottom:8px">
          <h3 style="margin:0">${esc(c.title)}</h3>
          <button type="button" class="btn sm" data-redcard="${k}">${I("open")}打开完整卡</button>
        </div>
        <div class="stop" data-stop style="padding:12px 14px">
          ${stops.map(([lv,h,t,r])=>`<div class="lvl lvl-${lv}"><b>${I("alert")} ${h}：</b>${t}${refs(r)}</div>`).join("")}
          ${C.stopNote?`<p class="note" style="margin:8px 0 0;font-size:.82rem">${esc(C.stopNote)}</p>`:""}
        </div>
        ${mis?`<div style="margin-top:10px;padding:10px 12px;border-radius:10px;background:var(--bg-2);font-size:.9rem"><b>先别这样做（${esc(mis.t)}）：</b>${mis.d}${refs(mis.r)}</div>`:""}
      </article>`;
    }).join("");

    const srcList=[...srcUsed].filter(sk=>SOURCES[sk]);
    openDlg(`<div class="redlines-dlg">
      <div class="row" style="justify-content:space-between;align-items:flex-start">
        <div>
          <h2 style="margin:0"><span data-stop style="color:var(--danger);display:inline-flex">${I("alert")}</span>突发状况 · 先看红线速查</h2>
          <p class="muted" style="margin:4px 0 0">把各照护卡里「立即拨打急救电话」与「尽快联系医生」的指征集中在一页，方便紧急时刻核对。</p>
        </div>
        <button type="button" class="btn sm btn-ghost" data-close>关闭</button>
      </div>

      <div class="stop" data-stop style="margin:12px 0;padding:12px 14px">
        <p style="margin:0"><b>情况紧急、或者你拿不准是不是紧急，请直接拨打当地急救电话（中国大陆拨打 120；非中国大陆地区请拨打所在地急救电话）。</b>本页内容均摘自已核对权威指南，不判断具体病情。</p>
      </div>

      <div class="seg" role="group" aria-label="按场景筛选红线" style="margin-bottom:14px">
        ${GROUPS_RL.map(([id,lbl])=>`<button type="button" data-rlgrp="${id}" aria-pressed="${curGrp===id}">${lbl}</button>`).join("")}
      </div>

      <div class="rl-grid" id="rlGrid" style="display:grid;gap:12px">
        ${itemsHTML}
      </div>

      ${srcList.length?`<details style="margin-top:14px;border-top:1px solid var(--line);padding-top:10px">
        <summary class="muted" style="cursor:pointer;min-height:44px;display:flex;align-items:center;font-weight:600">查看本页引用的权威指南来源（${srcList.length} 条）</summary>
        <ol class="sources" style="margin:6px 0 0;padding-left:1.4em;font-size:.84rem;overflow-wrap:anywhere">
          ${srcList.map(sk=>{const s=SOURCES[sk];return `<li id="src-${sk}" value="${s.n}"><a href="${s.url}" target="_blank" rel="noopener">${esc(s.t)}</a> <span class="muted">${esc(s.pub)}</span></li>`}).join("")}
        </ol>
      </details>`:""}

      <div class="row" style="margin-top:14px;justify-content:flex-end"><button type="button" class="btn" data-close>关闭</button></div>
    </div>`,true);

    if(animate&&!motionReduced()&&!(typeof navigator!=="undefined"&&navigator.webdriver)){
      const g=document.getElementById("rlGrid");
      try{g?.animate?.([{opacity:0.01,transform:"translateY(5px)"},{opacity:1,transform:"translateY(0)"}],{duration:160,easing:"cubic-bezier(0.23,1,0.32,1)"})}catch(_){}
    }
    dlgBody.querySelectorAll("[data-rlgrp]").forEach(b=>{b.onclick=()=>{curGrp=b.dataset.rlgrp;draw(true)}});
    dlgBody.querySelectorAll("[data-redcard]").forEach(b=>{b.onclick=()=>{const target=b.dataset.redcard;dlg.close();go("card",target)}});
  };
  draw(false);
}

/* ---------- JSON 数据备份导出与导入恢复 ---------- */
function exportBackupJSON(){
  const payload={
    app:"underwing",
    schema:"underwing.backup.v1",
    storageKey:KEY,
    exportedAt:new Date().toISOString(),
    prefs:{theme:prefs.theme,size:prefs.size,motion:prefs.motion},
    data:clone(DB)
  };
  const blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json;charset=utf-8"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");
  a.href=url;
  a.download=`underwing-backup-${localDate(new Date())}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1500);
  toast("已导出 JSON 备份文件");
}
function validateBackupPayload(rawText){
  const text=String(rawText||"").trim();
  if(!text)return{ok:false,error:"请先选择 .json 备份文件，或粘贴备份 JSON 内容。"};
  let parsed;
  try{parsed=JSON.parse(text)}catch(e){return{ok:false,error:"内容不是有效的 JSON 格式，请检查文件是否完整。"}}
  if(!parsed||typeof parsed!=="object"||Array.isArray(parsed))return{ok:false,error:"备份结构无效：顶层必须是 JSON 对象。"};
  if("app" in parsed&&parsed.app!=="underwing")return{ok:false,error:"这不是鹤伴（underwing）导出的备份文件。"};
  const d=(parsed.data&&typeof parsed.data==="object"&&!Array.isArray(parsed.data))?parsed.data:parsed;
  if(!Array.isArray(d.events)||!Array.isArray(d.readings)||!Array.isArray(d.deck)){
    return{ok:false,error:"备份缺少必要字段（events、readings、deck），无法安全恢复。"};
  }
  const dateRe=/^\d{4}-\d{2}-\d{2}$/;
  for(const ev of d.events){
    if(!ev||typeof ev!=="object"||typeof ev.title!=="string"||!dateRe.test(String(ev.date||""))){
      return{ok:false,error:"备份中的病历事件格式不正确，已拦截导入。"};
    }
  }
  for(const r of d.readings){
    if(!r||typeof r!=="object"||!Number.isFinite(+r.sys)||!Number.isFinite(+r.dia)||+r.sys<40||+r.sys>300||+r.dia<20||+r.dia>200){
      return{ok:false,error:"备份中的血压记录数值超出有效范围，已拦截导入。"};
    }
  }
  if(d.glucoseReadings!==undefined){
    if(!Array.isArray(d.glucoseReadings))return{ok:false,error:"备份中的血糖记录格式无效。"};
    for(const g of d.glucoseReadings){
      if(!g||typeof g!=="object"||!Number.isFinite(+g.val)||+g.val<0.5||+g.val>40)return{ok:false,error:"备份中的血糖记录数值超出有效范围，已拦截导入。"};
    }
  }
  if(d.weightReadings!==undefined){
    if(!Array.isArray(d.weightReadings))return{ok:false,error:"备份中的体重记录格式无效。"};
    for(const w of d.weightReadings){
      if(!w||typeof w!=="object"||!Number.isFinite(+w.kg)||+w.kg<1||+w.kg>350)return{ok:false,error:"备份中的体重记录数值超出有效范围，已拦截导入。"};
    }
  }
  const clean=normalizeDB(clone(d),false);
  clean.person={
    name:String(clean.person?.name||"家人").slice(0,30),
    initial:String(clean.person?.initial||String(clean.person?.name||"家")[0]||"家").slice(0,2),
    note:String(clean.person?.note||"").slice(0,120)
  };
  clean.deck=clean.deck.filter(k=>typeof k==="string"&&CARDS[k]);
  clean.myConds=clean.myConds.filter(id=>typeof id==="string"&&(typeof condById!=="function"||condById(id)));
  clean.customConds=clean.customConds.filter(s=>typeof s==="string"&&s.trim()).map(s=>s.trim().slice(0,20));
  clean.events=clean.events.map((ev,i)=>({
    id:String(ev.id||"ie"+i),
    kind:KIND[ev.kind]?ev.kind:"doc",
    date:String(ev.date).slice(0,10),
    time:ev.time?String(ev.time).slice(0,8):undefined,
    title:String(ev.title).slice(0,120),
    detail:String(ev.detail||"").slice(0,1200),
    src:String(ev.src||"备份导入").slice(0,120),
    status:ev.status==="ok"?"ok":"pend",
    visit:Boolean(ev.visit),
    ai:Boolean(ev.ai)
  }));
  clean.readings=clean.readings.map((r,i)=>({
    id:String(r.id||"ir"+i),
    date:dateRe.test(String(r.date||""))?String(r.date):localDate(new Date()),
    time:String(r.time||"08:00").slice(0,8),
    sys:Math.round(+r.sys),
    dia:Math.round(+r.dia),
    status:r.status==="ok"?"ok":"pend",
    src:String(r.src||"备份导入").slice(0,80)
  }));
  clean.glucoseReadings=clean.glucoseReadings.map((g,i)=>({
    id:String(g.id||"ig"+i),
    date:dateRe.test(String(g.date||""))?String(g.date):localDate(new Date()),
    time:String(g.time||"07:00").slice(0,8),
    ctx:GLUCOSE_CTX[g.ctx]?g.ctx:"random",
    val:Math.round(+g.val*10)/10,
    note:String(g.note||"").slice(0,80),
    status:g.status==="ok"?"ok":"pend",
    src:String(g.src||"备份导入").slice(0,80)
  }));
  clean.weightReadings=clean.weightReadings.map((w,i)=>({
    id:String(w.id||"iw"+i),
    date:dateRe.test(String(w.date||""))?String(w.date):localDate(new Date()),
    time:String(w.time||"07:00").slice(0,8),
    kg:Math.round(+w.kg*10)/10,
    note:String(w.note||"").slice(0,80),
    status:w.status==="ok"?"ok":"pend",
    src:String(w.src||"备份导入").slice(0,80)
  }));
  clean.meds=clean.meds.filter(m=>m&&typeof m==="object"&&m.name).map((m,i)=>({
    id:String(m.id||"im"+i),
    name:String(m.name).slice(0,60),
    how:String(m.how||"照医嘱").slice(0,120),
    log:Array.isArray(m.log)?m.log.filter(x=>typeof x==="string").slice(-200):[]
  }));
  clean.symptoms=clean.symptoms.filter(s=>s&&typeof s==="object"&&s.what).map(s=>({
    what:String(s.what).slice(0,60),
    lvl:Math.max(0,Math.min(10,+s.lvl||0)),
    detail:String(s.detail||"").slice(0,240),
    at:String(s.at||localDate(new Date())).slice(0,20)
  }));
  clean.prep={questions:String(clean.prep?.questions||"").slice(0,2000),medsReady:Boolean(clean.prep?.medsReady)};
  const cleanSteps={};
  Object.entries(clean.stepDone||{}).forEach(([k,arr])=>{
    if(CARDS[k]&&Array.isArray(arr)){
      const valid=[...new Set(arr.filter(n=>Number.isInteger(n)&&n>=0&&n<50))];
      if(valid.length)cleanSteps[k]=valid;
    }
  });
  clean.stepDone=cleanSteps;
  const nextPrefs={};
  if(parsed.prefs&&typeof parsed.prefs==="object"){
    if(["light","dark","auto"].includes(parsed.prefs.theme))nextPrefs.theme=parsed.prefs.theme;
    if(["md","lg","xl"].includes(parsed.prefs.size))nextPrefs.size=parsed.prefs.size;
    if(["full","reduce"].includes(parsed.prefs.motion))nextPrefs.motion=parsed.prefs.motion;
  }
  return{
    ok:true,
    db:clean,
    prefs:nextPrefs,
    summary:`照护对象「${clean.person.name}」 · 卡组 ${clean.deck.length} 张 · 病历事件 ${clean.events.length} 条 · 血压 ${clean.readings.length} 条 · 血糖 ${clean.glucoseReadings.length} 条 · 体重 ${clean.weightReadings.length} 条`
  };
}
function openImportBackup(){
  openDlg(`<h2>${I("upload","color:var(--teal)")}导入 JSON 备份恢复</h2>
  <p class="muted" style="margin:0">选择之前导出的 .json 备份文件，或将备份 JSON 粘贴到下方文本框。恢复后如果发现选错文件，可立即点提示条里的「撤销」。</p>
  <div class="row" style="margin-top:12px">
    <button type="button" class="btn sm" id="impPickBtn">${I("doc")}选择 .json 备份文件</button>
    <input type="file" id="impFileIn" accept=".json,application/json" hidden>
    <span class="muted" id="impFileName">未选择文件</span>
  </div>
  <label class="f" for="impText">备份 JSON 内容</label>
  <textarea class="inp" id="impText" style="min-height:150px;font-size:.9rem" placeholder='粘贴鹤伴导出的 JSON 备份内容……'></textarea>
  <div id="impPreview" class="muted" style="margin-top:8px"></div>
  <div id="impErr" class="err" role="alert"></div>
  <div class="row" style="margin-top:16px;justify-content:flex-end">
    <button type="button" class="btn btn-ghost" data-close>取消</button>
    <button type="button" class="btn btn-primary" id="impConfirmBtn">${I("check")}验证并恢复数据</button>
  </div>`,true);
  const fileEl=document.getElementById("impFileIn"),pickBtn=document.getElementById("impPickBtn"),txtEl=document.getElementById("impText");
  const prevEl=document.getElementById("impPreview"),errEl=document.getElementById("impErr"),fnEl=document.getElementById("impFileName");
  const refreshPreview=()=>{
    errEl.textContent="";
    if(!txtEl.value.trim()){prevEl.textContent="";return}
    const r=validateBackupPayload(txtEl.value);
    if(r.ok){prevEl.textContent="已识别备份："+r.summary}else{prevEl.textContent="";errEl.textContent=r.error}
  };
  pickBtn.onclick=()=>{fileEl.value="";fileEl.click()};
  fileEl.onchange=async()=>{
    const f=fileEl.files?.[0];if(!f)return;
    fnEl.textContent=f.name;
    try{txtEl.value=await f.text();refreshPreview()}catch(e){errEl.textContent="读取文件失败，请重试。"}
  };
  txtEl.oninput=refreshPreview;
  document.getElementById("impConfirmBtn").onclick=()=>{
    const r=validateBackupPayload(txtEl.value);
    if(!r.ok){errEl.textContent=r.error;txtEl.focus();return}
    const prevDB=clone(DB),prevPrefs=clone(prefs);
    DB=r.db;
    Object.assign(prefs,r.prefs);
    applyPrefs();save();dlg.close();render();
    toast("已从备份恢复本机记录",()=>{DB=prevDB;Object.assign(prefs,prevPrefs);applyPrefs();save();render()});
  };
}

/* ---------- 上传病历 ---------- */
const fileIn=document.getElementById("fileIn");
function pickFiles(){fileIn.value="";fileIn.click()}
fileIn.onchange=()=>{const fs=[...fileIn.files].filter(f=>/^image\/|application\/pdf/.test(f.type));if(fs.length)openUpload(fs)};
function openUpload(files){
  const MAX=15*1024*1024;const big=files.filter(f=>f.size>MAX);files=files.filter(f=>f.size<=MAX);
  openDlg(`<h2>${I("upload","color:var(--teal)")}上传病历</h2><p class="muted" style="margin:0">文件只存在这台设备里。先填几项，存进病历夹后状态是「待核对」。</p>
   <div class="thumbs" id="upThumbs">${files.map((f,i)=>f.type.startsWith("image/")?`<img class="thumb" id="upt${i}" alt="">`:`<span class="thumb">${I("doc")}<br>PDF</span>`).join("")}</div>
   ${big.length?`<p class="err">${big.length} 个文件超过 15 MB，没有加入。</p>`:""}
   <form id="upf"><div class="two"><div><label class="f" for="ud">病历上的日期</label><input class="inp" id="ud" type="date" value="${localDate(new Date())}"></div>
   <div><label class="f" for="uk">类型</label><select class="inp" id="uk"><option value="visit">门诊 / 住院病历</option><option value="test">检查 / 化验单</option><option value="med">处方</option><option value="doc" selected>其他</option></select></div></div>
   <label class="f" for="ut">标题</label><input class="inp" id="ut" placeholder="例如：社区医院门诊病历" value="${esc(files[0]?.name.replace(/\.[^.]+$/,"")||"")}">
   <div class="row" style="margin-top:16px;justify-content:flex-end"><button type="button" class="btn btn-ghost" data-close>取消</button><button class="btn btn-primary" ${files.length?"":"disabled"}>存进病历夹</button></div></form>`);
  files.forEach((f,i)=>{if(f.type.startsWith("image/")){const u=URL.createObjectURL(f);const el=document.getElementById("upt"+i);if(el)el.src=u}});
  document.getElementById("upf").onsubmit=async ev=>{ev.preventDefault();
    const id="d"+Date.now(),meta=[];
    try{for(const [i,f] of files.entries()){const fid=id+"_"+i;await FILES.put(fid,f);meta.push({id:fid,name:f.name,type:f.type,size:f.size});fileURLs[fid]=URL.createObjectURL(f)}}
    catch(e){toast("文件没能存进这台设备，请换个浏览器再试");return}
    const k=document.getElementById("uk").value;
    DB.events.push({id,kind:k,date:document.getElementById("ud").value,title:document.getElementById("ut").value.trim()||"上传的病历",detail:"",src:`本机上传 · ${meta.length} 个文件`,status:"pend",files:meta});
    save();dlg.close();state.filter="all";go("folder");
    toast(`已存入 ${meta.length} 个文件`,async()=>{DB.events=DB.events.filter(e=>e.id!==id);for(const m of meta)await FILES.del(m.id);save();render()})};
}
async function viewFile(fid){
  const ev=DB.events.find(e=>e.files?.some(f=>f.id===fid));if(!ev)return;
  const f=ev.files.find(x=>x.id===fid);if(!f)return;
  let u=fileURLs[fid];if(!u){const b=await FILES.get(fid);if(!b){toast("这台设备上找不到这个文件");return}u=fileURLs[fid]=URL.createObjectURL(b)}
  openDlg(`<h2>${I("doc")}${esc(f.name)}</h2>${f.type.startsWith("image/")?`<img src="${u}" alt="${esc(f.name)}" style="width:100%;border-radius:12px;margin-top:10px">`:`<p><a href="${u}" target="_blank" rel="noopener">在新窗口打开 PDF</a></p>`}
  <div class="row" style="margin-top:12px;justify-content:flex-end"><button type="button" class="btn" data-close>关闭</button></div>`,true);
}

/* ---------- 自动脱敏 ---------- */
const SAMPLE=`社区卫生服务中心 门诊病历（虚构示例）
姓名：王秀兰  性别：女  年龄：72岁  门诊号：MZ20261020-0388
身份证号：110101195405061234  电话：13812345678
住址：北京市东城区和平里街道幸福小区3号楼2单元501
就诊日期：2026-10-20
主诉：头晕 3 天。
诊断：原发性高血压
检查结果（2026-10-27）：
血红蛋白 128 g/L 参考 115-150
肌酐 92 μmol/L 参考 41-81 ↑
尿酸 380 μmol/L 参考 155-357 ↑
医嘱：继续目前降压治疗，家庭血压监测，早晚各测一次，2026-11-24 复诊。
医师：李明华`;
const RULES=[
 ["身份证号",/\b\d{17}[\dXx]\b/g],
 ["手机号",/(?<!\d)1[3-9]\d{9}(?!\d)/g],
 ["电话",/(?<!\d)0\d{2,3}-?\d{7,8}(?!\d)/g],
 ["邮箱",/[\w.+-]+@[\w-]+\.[\w.]+/g],
 ["编号",/((?:门诊|住院|病案|病历|医保|社保|卡|ID)\s*号?\s*[:：]\s*)([A-Za-z0-9\-]{4,})/g,2],
 ["姓名",/((?:姓\s*名|患\s*者|病\s*人)\s*[:：]\s*)([\u4e00-\u9fa5·]{2,4})/g,2],
 ["医生",/((?:医\s*师|医\s*生|主治|签\s*名|报告人|审核人)\s*[:：]\s*)([\u4e00-\u9fa5·]{2,4})/g,2],
 ["出生日期",/((?:出生日期|出生|生日)\s*[:：]\s*)([0-9年月日\-\/.]{6,12})/g,2],
 ["地址",/((?:住\s*址|地\s*址|家庭住址|现住址)\s*[:：]\s*)([^\n]+)/g,2],
 ["医疗机构",/[\u4e00-\u9fa5]{2,16}(?:医院|卫生院|卫生服务中心|诊所|保健院)/g]
];
function deidentify(text,extraNames=[]){
  const found={};let out=text;
  const tag=t=>`〔${t}〕`;
  for(const [type,re,grp] of RULES){out=out.replace(re,(...m)=>{found[type]=(found[type]||0)+1;return grp?m[1]+tag(type):tag(type)})}
  extraNames.filter(n=>n&&n.length>=2).forEach(n=>{const re=new RegExp(n.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),"g");out=out.replace(re,()=>{found["姓名"]=(found["姓名"]||0)+1;return tag("姓名")})});
  return{out,found};
}
const highlight=t=>esc(t).replace(/〔([^〕]+)〕/g,'<mark class="red">〔$1〕</mark>');

/* ---------- 本地规则整理（演示；不联网、不诊断） ---------- */
function localExtract(text){
  const items=[];const lines=text.split(/\n+/).map(l=>l.trim()).filter(Boolean);
  const normDate=s=>{const m=s.match(/(20\d{2})[-年\/.](\d{1,2})[-月\/.](\d{1,2})/);return m?`${m[1]}-${pad(m[2])}-${pad(m[3])}`:null};
  let visitDate=null,testDate=null;
  lines.forEach(l=>{const d=normDate(l);if(!d)return;if(/就诊|门诊|入院|日期/.test(l)&&!visitDate)visitDate=d;if(/检查|化验|报告|结果/.test(l)&&!testDate)testDate=d});
  const dx=lines.find(l=>/^(诊断|初步诊断|出院诊断)\s*[:：]/.test(l));
  if(dx||visitDate)items.push({kind:"visit",date:visitDate||localDate(new Date()),title:"就诊记录"+(dx?"："+dx.replace(/^[^:：]+[:：]\s*/,""):""),detail:dx?"诊断按病历原文照录，鹤伴不做判断。":""});
  const labs=[];lines.forEach(l=>{const m=l.match(/^([\u4e00-\u9fa5A-Za-z][\u4e00-\u9fa5A-Za-z0-9\-（）()]{0,14})\s+([<>]?\d+(?:\.\d+)?)\s*([a-zA-Zμ%\/\^0-9.×]+)?\s*(?:参考(?:范围|值)?\s*[:：]?\s*([\d.]+\s*[-~～]\s*[\d.]+))?\s*(↑|↓|H|L)?$/);if(m&&!/日期|年龄|电话/.test(m[1]))labs.push(`${m[1]} ${m[2]}${m[3]?" "+m[3]:""}${m[4]?"（参考 "+m[4]+"）":""}${m[5]?" "+m[5]:""}`)});
  if(labs.length)items.push({kind:"test",date:testDate||visitDate||localDate(new Date()),title:`检查结果（${labs.length} 项，原文照录）`,detail:labs.join("\n")+"\n箭头是报告单原有标记；结果意味着什么请问医生。"});
  const adv=lines.filter(l=>/^(医嘱|建议|处理|处置)\s*[:：]/.test(l));
  if(adv.length)items.push({kind:"med",date:visitDate||localDate(new Date()),title:"医生交代（原文）",detail:adv.map(l=>l.replace(/^[^:：]+[:：]\s*/,"")).join("\n")});
  const nxt=text.match(/(20\d{2}[-年\/.]\d{1,2}[-月\/.]\d{1,2})\s*(?:日)?\s*复诊/);
  if(nxt)items.push({kind:"visit",date:normDate(nxt[1]),title:"预约：复诊",detail:"由病历里的复诊日期整理而来。",visit:false});
  return items;
}
function openAI(fromId){
  const st={step:1,raw:"",clean:"",found:{},items:[]};
  const ev=fromId?DB.events.find(e=>e.id===fromId):null;
  const stepper=()=>`<div class="stepper">${["1 原文","2 自动脱敏","3 确认发送","4 核对结果"].map((t,i)=>`<span class="${st.step===i+1?"on":""}">${t}</span>`).join("")}</div>`;
  const dest=prefs.aiEndpoint?esc(prefs.aiEndpoint):"本地演示规则（不联网）";
  const draw=()=>{
    if(st.step===1)openDlg(`<h2>${I("spark","color:var(--indigo)")}AI 整理病历</h2>${stepper()}
      <p class="muted" style="margin:0 0 8px">${ev?`来自「${esc(ev.title)}」。`:""}把病历上的文字粘贴或打进来。本版不识别图片里的字，图片原件不会发送。</p>
      <textarea class="inp" id="aiRaw" style="min-height:220px" placeholder="粘贴病历文字……">${esc(st.raw)}</textarea>
      <div class="row" style="margin-top:12px;justify-content:space-between"><button type="button" class="btn sm btn-ghost" id="aiSample">填入虚构示例</button>
      <div class="row"><button type="button" class="btn btn-ghost" data-close>取消</button><button type="button" class="btn btn-primary" id="aiNext1">下一步：自动脱敏</button></div></div>`,true);
    if(st.step===2)openDlg(`<h2>${I("eye","color:var(--indigo)")}检查脱敏结果</h2>${stepper()}
      <div class="redlist">${Object.entries(st.found).map(([k,v])=>`<span class="chip">${k} × ${v}</span>`).join("")||'<span class="muted">没有自动识别到个人信息。</span>'}</div>
      <div class="panel" style="padding:14px;white-space:pre-wrap;font-size:.92rem;max-height:200px;overflow:auto" aria-label="脱敏预览">${highlight(st.clean)}</div>
      <label class="f" for="aiClean">可以直接改：把漏掉的姓名、地址、单位等删掉或换成〔…〕</label>
      <textarea class="inp" id="aiClean" style="min-height:160px">${esc(st.clean)}</textarea>
      <p class="err" style="color:var(--pending)">自动脱敏会漏，不能保证完全匿名。请逐行看一遍再继续。</p>
      <div class="row" style="justify-content:flex-end"><button type="button" class="btn btn-ghost" id="aiBack2">返回</button><button type="button" class="btn btn-primary" id="aiNext2">我看过了，下一步</button></div>`,true);
    if(st.step===3)openDlg(`<h2>${I("lock","color:var(--indigo)")}确认发送</h2>${stepper()}
      <div class="disclose"><b>发送到：</b>${dest}<br><b>发送内容：</b>只发上一步你确认过的脱敏文字（${st.clean.length} 字），不发图片，不发你的其他记录。<br>
      <b>保存：</b>${prefs.aiEndpoint?"服务方会不会保存、存多久，以你们后端的说明为准；鹤伴本机不保存原文。":"本地演示不联网，原文和结果只在这台设备上；关掉窗口原文就丢弃。"}<br>
      <b>AI 只做整理：</b>按时间列出就诊、检查数值（照抄）、医生交代。不诊断，不解释结果好坏，不给用药建议。</div>
      <div class="row" style="margin-top:14px;justify-content:flex-end"><button type="button" class="btn btn-ghost" id="aiBack3">返回修改</button><button type="button" class="btn btn-ghost" data-close>取消</button><button type="button" class="btn btn-primary" id="aiSend">${I("spark")}发送并整理</button></div>`,true);
    if(st.step===4)openDlg(`<h2>${I("check","color:var(--ok)")}核对整理结果</h2>${stepper()}
      <p class="muted" style="margin:0 0 8px">勾选要放进病历夹的条目。进去后是「待核对」，要对照原件确认。整理结果不是诊断。</p>
      <div class="panel" style="padding:6px 14px">${st.items.map((it,i)=>`<label class="outrow"><input type="checkbox" checked data-pick="${i}"><div><div class="date">${it.date} · ${KIND[it.kind].label}</div><b>${esc(it.title)}</b><div style="white-space:pre-line;color:var(--ink-2);font-size:.9rem">${esc(it.detail)}</div></div></label>`).join("")||'<p class="muted">没整理出条目。可以返回改一下文字，或手动记录。</p>'}</div>
      <div class="row" style="margin-top:14px;justify-content:flex-end"><button type="button" class="btn btn-ghost" data-close>放弃</button><button type="button" class="btn btn-primary" id="aiSave" ${st.items.length?"":"disabled"}>放进病历夹（待核对）</button></div>`,true);
    bind();
  };
  const bind=()=>{
    const $=id=>document.getElementById(id);
    if($("aiSample"))$("aiSample").onclick=()=>{$("aiRaw").value=SAMPLE};
    if($("aiNext1"))$("aiNext1").onclick=()=>{st.raw=$("aiRaw").value.trim();if(!st.raw){$("aiRaw").focus();return}const r=deidentify(st.raw,[DB.person.name]);st.clean=r.out;st.found=r.found;st.step=2;draw()};
    if($("aiClean"))$("aiClean").oninput=e=>{st.clean=e.target.value};
    if($("aiBack2"))$("aiBack2").onclick=()=>{st.step=1;draw()};
    if($("aiNext2"))$("aiNext2").onclick=()=>{st.clean=$("aiClean").value;const again=deidentify(st.clean,[DB.person.name]);if(again.out!==st.clean){st.clean=again.out;Object.entries(again.found).forEach(([k,v])=>st.found[k]=(st.found[k]||0)+v);toast("又发现并替换了一些个人信息，请再看一遍");draw();return}st.step=3;draw()};
    if($("aiBack3"))$("aiBack3").onclick=()=>{st.step=2;draw()};
    if($("aiSend"))$("aiSend").onclick=async()=>{const b=$("aiSend");b.disabled=true;b.textContent="整理中……";
      try{if(prefs.aiEndpoint){const r=await fetch(prefs.aiEndpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({task:"organize_medical_record",text:st.clean})});if(!r.ok)throw new Error("HTTP "+r.status);const j=await r.json();st.items=(j.items||[]).filter(x=>KIND[x.kind]&&x.date&&x.title).map(x=>({kind:x.kind,date:String(x.date).slice(0,10),title:String(x.title).slice(0,80),detail:String(x.detail||"").slice(0,600)}))}
        else st.items=localExtract(st.clean);st.step=4;draw()}
      catch(e){b.disabled=false;b.textContent="再试一次";toast("整理失败："+e.message+"。没有发送其他内容。")}};
    if($("aiSave"))$("aiSave").onclick=()=>{const picks=[...document.querySelectorAll("[data-pick]")].filter(x=>x.checked).map(x=>st.items[+x.dataset.pick]);const ids=[];
      picks.forEach((it,i)=>{const id="a"+Date.now()+i;ids.push(id);DB.events.push({id,...it,src:(prefs.aiEndpoint?"AI 整理":"本地规则整理")+"自脱敏文字"+(ev?"（"+ev.title+"）":""),status:"pend",ai:true})});
      save();dlg.close();state.filter="all";go("folder");toast(`已加入 ${ids.length} 条待核对`,()=>{DB.events=DB.events.filter(e=>!ids.includes(e.id));save();render()})};
  };
  draw();
}

/* ================= 提示条 ================= */
let tt;function toast(msg,undo){const t=document.getElementById("toast");document.getElementById("toastMsg").textContent=msg;const u=document.getElementById("toastUndo");u.style.display=undo?"":"none";u.onclick=()=>{undo&&undo();t.classList.remove("show")};t.classList.add("show");clearTimeout(tt);tt=setTimeout(()=>t.classList.remove("show"),6000)}

const app=$id("app");
const BASE_CARD_VIEWS={followup:followupHTML,medlog:medlogHTML,symptom:symptomHTML};
const CARD_VIEWS=new Proxy(BASE_CARD_VIEWS,{
get(t,p){if(typeof p!=="string")return Reflect.get(t,p);if(CARDS[p]&&!CARDS[p].ready)return undefined;if(t[p])return t[p];if(CARDS[p]?.ready&&CONTENT[p])return ()=>clinicalHTML(p);return undefined},
has(t,p){return Boolean(typeof p==="string"&&CARDS[p]?.ready&&(t[p]||CONTENT[p]))}
});
let __viewAnim=null,__hubAnim=null,__pillAnim=null;
const canAnimateUI=()=>!motionReduced()&&!(typeof navigator!=="undefined"&&navigator.webdriver);
function animateViewSwap(target){
if(!canAnimateUI())return;const el=target||app;if(!el)return;
try{__viewAnim?.stop?.();__viewAnim?.cancel?.()}catch(_){}
const M=window.Motion?.animate;
if(M){try{__viewAnim=M(el,{opacity:[0,1],y:[8,0]},{type:"spring",stiffness:360,damping:32});return}catch(_){}}
if(el.animate)try{__viewAnim=el.animate([{opacity:0,transform:"translateY(6px)"},{opacity:1,transform:"translateY(0)"}],{duration:180,easing:"cubic-bezier(0.23,1,0.32,1)"})}catch(_){}
}
function animateHubStage(){
const st=qs(".hub-stage");if(!st)return;
if(canAnimateUI()){
const M=window.Motion?.animate;
if(M){try{__hubAnim?.stop?.();__hubAnim=M(st,{opacity:[0,1],y:[10,0]},{type:"spring",stiffness:360,damping:30});st.querySelectorAll(".fan-deck .fan-item").forEach((it,i)=>{if(i<5)M(it,{opacity:[0,1],y:[10,0]},{type:"spring",stiffness:380,damping:30,delay:i*.032})})}catch(_){}}
else if(st.animate)try{__hubAnim?.cancel?.();__hubAnim=st.animate([{opacity:0,transform:"translateY(8px)"},{opacity:1,transform:"translateY(0)"}],{duration:200,easing:"cubic-bezier(0.23,1,0.32,1)"})}catch(_){}
}
st.scrollIntoView?.({behavior:motionReduced()?"instant":"smooth",block:"nearest"});
}
function syncSegPill(box,sel){
if(!box)return;
const pill=box.querySelector(".ios-seg-pill"),btn=box.querySelector(sel);
if(!pill||!btn||!btn.offsetWidth){box.classList.add("no-pill");return}
box.classList.remove("no-pill");
const x=btn.offsetLeft,w=btn.offsetWidth;
if(canAnimateUI()&&window.Motion?.animate){try{__pillAnim?.stop?.();__pillAnim=window.Motion.animate(pill,{x,width:w},{type:"spring",stiffness:420,damping:34});return}catch(_){}}
pill.style.width=w+"px";pill.style.transform=`translateX(${x}px)`;
}
const isMobileMQ=matchMedia("(max-width: 768px)"),isMob=()=>isMobileMQ.matches,US=()=>window.UnderwingScene,rAF=requestAnimationFrame,gTop=el=>el?.getBoundingClientRect().top;
let pane=null,curMobileBreak="middle",desktopPeek=false,__lastVH=0,sheetSeq=0;
const getThemeMode=()=>document.documentElement.dataset.theme==="dark"?"dark":"light";
const sceneZoneFor=()=>state.view==="folder"?"folder":(state.view==="library"&&state.libTab==="hubs")?"hubs":state.view==="card"?"cards":"home";
const syncDeskZoneUI=z=>qsa(".desk-hud [data-zone]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.zone===z)));
const syncScenePrefs=()=>{US()?.setTheme(getThemeMode());US()?.setReducedMotion(motionReduced())};
const syncSceneSuspend=()=>US()?.setSuspended(Boolean(dlg?.open)||(isMob()&&curMobileBreak==="top"));
const detectBreak=y=>{const b=pane?.breakpoints?.breaks;return b?[["top",b.top],["middle",b.middle],["bottom",b.bottom]].filter(([,v])=>typeof v==="number").sort((a,c)=>Math.abs(a[1]-y)-Math.abs(c[1]-y))[0]?.[0]||"middle":"middle"};
function syncPeekUI(){
const isPeek=isMob()?curMobileBreak==="bottom":desktopPeek;
document.body.classList.toggle("sanctuary-peek",!isMob()&&desktopPeek);
qsa('[data-act="toggle-sanctuary"]').forEach(b=>{
b.setAttribute("aria-pressed",String(isPeek));
if(b.id==="scenePeekBtn")b.textContent=isPeek?"展开面板":"鹤翼空间";
else{const sp=b.querySelector("span");if(sp)sp.textContent=isPeek?"返回面板":"沉浸 3D"}
});
syncSceneSuspend();
}
function mobileBreaks(){
const vh=Math.max(480,window.innerHeight||844),navTop=Math.floor(gTop(qs("nav.mtabs"))||(vh-56)),bottomOffset=Math.max(54,vh-navTop);
const topH=Math.max(360,navTop-72),midH=Math.min(topH-72,Math.max(240,Math.round((navTop-64)*0.54)));
return{bottomOffset,vh,breaks:{top:{enabled:true,height:topH},middle:{enabled:true,height:midH},bottom:{enabled:true,height:64}}};
}
function syncPaneScrollHeight(){
if(!app||!isMob()||!pane?.isPanePresented?.())return;
const navTop=Math.floor(gTop(qs("nav.mtabs"))||(window.innerHeight-56)),appTop=Math.ceil(gTop(app)||0),maxH=Math.max(120,navTop-appTop);
Object.assign(app.style,{height:maxH+"px",maxHeight:maxH+"px",overflowY:"auto"});
}
function movePaneToBreak(brk){
if(!pane?.isPanePresented?.())return;
if(pane.settings)pane.settings.animationDuration=motionReduced()?0:220;
const p=pane.moveToBreak(brk);
rAF(syncPaneScrollHeight);Promise.resolve(p).then(()=>rAF(syncPaneScrollHeight),()=>{});
}
function resetSheetDOM(){
const sp=$id("sheetPane");
if(sp)Object.assign(sp.style,{display:"",overflowX:"",transition:""});
if(app)Object.assign(app.style,{height:"",maxHeight:"",overflowX:"",overflowY:"",overscrollBehavior:""});
}
async function syncResponsiveSheet(force=false){
const sp=$id("sheetPane"),host=$id("sheetHost");if(!sp||!host)return;
const seq=++sheetSeq;
if(isMob()&&window.CupertinoPane){
document.body.classList.remove("sanctuary-peek");
if(pane&&!force)return;
if(pane){const p=pane;pane=null;try{await p.destroy({animate:false})}catch(_){}}
if(seq!==sheetSeq||!isMob())return;
resetSheetDOM();
const {bottomOffset,vh,breaks}=mobileBreaks();__lastVH=vh;
curMobileBreak=state.view==="cards"?"middle":"top";
const onEnd=()=>{if(pane?.isPanePresented?.()){curMobileBreak=detectBreak(pane.getPanelTransformY());syncPeekUI();rAF(syncPaneScrollHeight)}};
const np=new window.CupertinoPane(sp,{parentElement:host,initialBreak:curMobileBreak,breaks,bottomOffset,backdrop:false,bottomClose:false,buttonDestroy:false,fastSwipeClose:false,showDraggable:true,clickBottomOpen:true,handleKeyboard:false,topperOverflow:false,scrollZeroDragBottom:true,animationDuration:motionReduced()?0:220,events:{onTransitionEnd:onEnd,onDragEnd:onEnd}});
pane=np;await np.present({animate:false});
if(seq!==sheetSeq||pane!==np){try{await np.destroy({animate:false})}catch(_){}return}
syncPeekUI();rAF(syncPaneScrollHeight);
}else if(pane){
const p=pane;pane=null;try{await p.destroy({animate:false})}catch(_){}
if(seq!==sheetSeq)return;
resetSheetDOM();syncPeekUI();
}
}
function setSanctuaryPeek(peek){
if(isMob()&&pane?.isPanePresented?.()){curMobileBreak=peek?"bottom":(state.view==="cards"?"middle":"top");movePaneToBreak(curMobileBreak);syncPeekUI()}
else if(!isMob()){desktopPeek=Boolean(peek);syncPeekUI()}
}
function ensureMobileTop(){if(isMob()&&pane?.isPanePresented?.()&&curMobileBreak!=="top"){curMobileBreak="top";movePaneToBreak("top");syncPeekUI()}}
function handleSceneHotspot(t){
if(!t)return;setSanctuaryPeek(false);
if(t.action==="redlines"||t.zone==="redlines"){US()?.focusZone("redlines");syncDeskZoneUI("redlines");openRedLines();return}
if(t.action==="bedside"||t.zone==="bedside"){
US()?.focusZone("bedside");syncDeskZoneUI("bedside");
const dk=(DB.deck||[]).find(k=>CARDS[k]?.ready&&typeof getCardSteps==="function"&&getCardSteps(k).length);
openBedside((state.card&&CARDS[state.card]?.ready&&typeof getCardSteps==="function"&&getCardSteps(state.card).length)?state.card:(dk||t.id||"bp"));return;
}
if(t.tab==="hubs"){state.libTab="hubs";state.hub=null}
if(t.route==="card")go("card",t.id||"bp");else go(t.route||"cards");
}
const refreshView=()=>{if(state.view==="library")patchLibraryResults(false);else render()};
const allVitalEvents=()=>[...DB.events,...DB.readings,...(DB.glucoseReadings||[]),...(DB.weightReadings||[])];
function render(){
const cv=state.view==="card"&&state.card&&CARD_VIEWS[state.card];
if(cv)app.innerHTML=cv();
else if(state.view==="library")app.innerHTML=libraryHTML();
else if(state.view==="folder")app.innerHTML=folderHTML();
else if(state.view==="settings")app.innerHTML=settingsHTML();
else{state.view="cards";app.innerHTML=cardsHTML()}
renderSide();bindForms();updateProgress();loadThumbs();
if(state.view==="library")syncLibTabs();
rAF(syncPaneScrollHeight);
}
function bindCustomForm(){const cf=$id("customForm");if(cf)cf.onsubmit=e=>{e.preventDefault();addCustom($id("customIn").value)}}
function patchLibraryResults(withAnim=false){
if(state.view!=="library"){render();return}
const lb=$id("libBody");if(!lb){render();return}
syncLibTabs();lb.innerHTML=libraryBodyHTML();renderSide();bindCustomForm();
if(withAnim)animateViewSwap(lb);
}
function bindForms(){
const q=$id("q");
if(q&&!q.dataset.uwBound){
q.dataset.uwBound="1";let composing=false;
const commit=val=>{state.q=val;if(state.libTab==="conds")state.libTab="search";applyHash();patchLibraryResults(false)};
q.addEventListener("compositionstart",()=>{composing=true});
q.addEventListener("compositionend",e=>{composing=false;commit(e.target.value)});
q.addEventListener("input",e=>{if(composing||e.isComposing)return;commit(e.target.value)});
q.addEventListener("focus",ensureMobileTop);
}
bindCustomForm();
const mf=$id("medForm");
if(mf)mf.onsubmit=e=>{e.preventDefault();const n=$id("mn").value.trim(),h=$id("mh").value.trim();if(!n)return;DB.meds.push({id:"m"+Date.now(),name:n,how:h||"照医嘱",log:[]});save();render();toast("已添加 "+n)};
const sf=$id("symForm");
if(sf)sf.onsubmit=e=>{e.preventDefault();const w=$id("sw").value.trim();if(!w)return;const now=new Date();DB.symptoms.push({what:w,lvl:Math.max(0,Math.min(10,+$id("sl").value||0)),detail:$id("sd").value.trim(),at:localDate(now)+" "+pad(now.getHours())+":"+pad(now.getMinutes())});save();render();toast("已记下")};
}
function addCustom(n){n=(n||"").trim().slice(0,20);if(!n)return;if(!DB.customConds.includes(n))DB.customConds.push(n);GENERAL.forEach(k=>{if(!DB.deck.includes(k))DB.deck.push(k)});save();render();toast(`已添加「${n}」，并放入通用整理卡`)}
function updateProgress(){
const lis=[...qsa("ol.steps li")];if(!lis.length)return;
const firstUndone=lis.find(l=>!l.classList.contains("done"))||null;
lis.forEach(l=>l.classList.toggle("is-next",l===firstUndone));
const f=$id("pfill"),t=$id("ptext"),rb=$id("resetStepsBtn");if(!f||!t)return;
const d=lis.filter(l=>l.classList.contains("done")).length;
f.style.transform="scaleX("+(d/lis.length)+")";t.textContent=d+" / "+lis.length+(d===lis.length?" · 做完了":"");
if(rb)rb.hidden=d===0;
}
function go(view,card=null){
const changed=state.view!==view||state.card!==card;
state.view=view;state.card=card;
if(view==="card"&&card&&CARD_VIEWS[card]){prefs.recent=[card,...(prefs.recent||[]).filter(k=>k!==card)].slice(0,6);applyPrefs()}
applyHash();render();
const z=sceneZoneFor();US()?.focusZone(z);syncDeskZoneUI(z);
if(isMob()&&pane?.isPanePresented?.()){
const nextB=view!=="cards"?"top":(curMobileBreak==="bottom"?"middle":curMobileBreak);
if(nextB!==curMobileBreak){curMobileBreak=nextB;movePaneToBreak(nextB);syncPeekUI()}
}else if(!isMob()&&desktopPeek)setSanctuaryPeek(false);
if(changed)animateViewSwap(app);
if(app)app.scrollTop=0;window.scrollTo(0,0);
}
const FILTERS=["all","pend","visit","test","med","bp","glucose","weight","doc","note"];
function parseHash(){
const m=/^#\/(cards|library|folder|settings|card)(?:\/([A-Za-z0-9_-]+))?(?:\?(.*))?$/.exec(location.hash);
if(!m||(m[1]==="card"&&!CARD_VIEWS[m[2]]))return null;
const h={view:m[1],card:m[2]||null,filter:"all",libTab:"search",q:"",hub:null,age:"all",sys:"all",chartKind:"bp"},q=new URLSearchParams(m[3]||"");
if(FILTERS.includes(q.get("filter")))h.filter=q.get("filter");
if(["bp","glucose","weight"].includes(q.get("chart")))h.chartKind=q.get("chart");
if(["search","hubs","conds"].includes(q.get("tab")))h.libTab=q.get("tab");
if(q.get("q"))h.q=q.get("q");
if(q.get("hub")){h.hub=q.get("hub");if(!q.get("tab"))h.libTab="hubs"}
if(q.get("age"))h.age=q.get("age");
if(q.get("sys"))h.sys=q.get("sys");
return h;
}
function applyHash(){
let h=state.view==="card"&&state.card?`#/card/${state.card}`:`#/${state.view}`;const q=new URLSearchParams();
if(state.view==="folder"){if(state.filter!=="all")q.set("filter",state.filter);if(state.chartKind&&state.chartKind!=="bp")q.set("chart",state.chartKind)}
if(state.view==="library"){if(state.libTab!=="search")q.set("tab",state.libTab);if(state.q)q.set("q",state.q);if(state.hub&&(state.libTab==="hubs"||state.libTab==="search"))q.set("hub",state.hub);if(state.age&&state.age!=="all")q.set("age",state.age);if(state.sys&&state.sys!=="all")q.set("sys",state.sys)}
const s=q.toString();if(s)h+="?"+s;if(location.hash!==h)history.replaceState(null,"",h);
}
function applyHashState(h){Object.assign(state,h)}
window.addEventListener("hashchange",()=>{const h=parseHash();if(h){applyHashState(h);render();const z=sceneZoneFor();US()?.focusZone(z);syncDeskZoneUI(z);if(!isMob()&&desktopPeek)setSanctuaryPeek(false);else if(isMob()&&pane&&curMobileBreak==="bottom")setSanctuaryPeek(false);animateViewSwap(app);window.scrollTo(0,0)}});
window.addEventListener("beforeprint",()=>{const el=$id("printf");if(el)el.textContent=`打印于 ${localDate(new Date())} · 鹤伴居家照护卡 · 本页内容不能代替医生判断`});
function activateChartPoint(el){
if(!el||!el.dataset?.pt)return;
const ro=$id("chartReadout");if(ro)ro.textContent="查看读数："+el.dataset.pt;
const box=el.closest(".chartbox")||document,idx=el.dataset.pti;
box.querySelectorAll("circle.pt-node").forEach(c=>c.classList.toggle("is-active",idx!==undefined?c.dataset.pti===idx:c===el));
}
document.addEventListener("pointerover",e=>{const pt=e.target.closest?.("[data-pt]");if(pt)activateChartPoint(pt)});
document.addEventListener("focusin",e=>{const pt=e.target.closest?.("[data-pt]");if(pt)activateChartPoint(pt)});
document.addEventListener("click",e=>{
const pt=e.target.closest?.("[data-pt]");if(pt){activateChartPoint(pt);return}
const tcgFace=e.target.closest?.(".tcg:not(.wip)");
if(tcgFace&&!e.target.closest("a,button,input,select,textarea")){if(tcgFace.dataset.tcg)flip(tcgFace.dataset.tcg);return}
const t=e.target.closest("button,img[data-view],[data-zone],[data-hub],[data-age],[data-sys],[data-chart],[data-deckbatch],[data-quickq],[data-act],[data-card],[data-deck],[data-undeck],[data-nav],[data-libtab],[data-cond],[data-filter],[data-pref]");
if(!t)return;const d=t.dataset;
if(d.view){viewFile(d.view);return}
if(d.flip){flip(d.flip);return}
if(d.zone){US()?.focusZone(d.zone);syncDeskZoneUI(d.zone);return}
if(d.nav){if(d.tab)state.libTab=d.tab;if(d.hub!==undefined)state.hub=d.hub||null;go(d.nav);return}
if(d.card){if(CARD_VIEWS[d.card])go("card",d.card);return}
if(d.deck){const k=d.deck;if(!CARDS[k])return;if(!DB.deck.includes(k))DB.deck.push(k);save();refreshView();toast(`「${CARDS[k].title}」已加入卡组`,()=>{DB.deck=DB.deck.filter(x=>x!==k);save();render()});return}
if(d.deckbatch!==undefined){
const keys=d.deckbatch.split(",").map(s=>s.trim()).filter(k=>k&&CARDS[k]&&CARDS[k].ready),added=keys.filter(k=>!DB.deck.includes(k));
if(!added.length){toast("这组照护卡已经在卡组里了");return}
const prev=clone(DB.deck);added.forEach(k=>DB.deck.push(k));save();refreshView();
toast(`已将 ${added.length} 张照护卡加入卡组`,()=>{DB.deck=prev;save();render()});return;
}
if(d.undeck){const k=d.undeck,i=DB.deck.indexOf(k);DB.deck=DB.deck.filter(x=>x!==k);save();refreshView();toast(`已移出「${CARDS[k]?.title||k}」`,()=>{if(i>=0)DB.deck.splice(i,0,k);else DB.deck.push(k);save();render()});return}
if(d.quickq!==undefined){
const wasLib=state.view==="library";state.q=d.quickq;state.libTab=d.tab||"search";state.view="library";state.card=null;applyHash();
if(wasLib){const qEl=$id("q");if(qEl)qEl.value=state.q;patchLibraryResults(true)}else{render();animateViewSwap(app)}
ensureMobileTop();const z=sceneZoneFor();US()?.focusZone(z);syncDeskZoneUI(z);$id("q")?.focus();return;
}
if(d.hub!==undefined){
if(t.tagName!=="BUTTON"&&e.target.closest(".tcg,.fan-deck"))return;
const id=d.hub,wasLib=state.view==="library";state.hub=(!id||state.hub===id)?null:id;
if(!wasLib){state.view="library";state.libTab="hubs";applyHash();render();const z=sceneZoneFor();US()?.focusZone(z);syncDeskZoneUI(z);animateViewSwap(app);ensureMobileTop()}else{applyHash();patchLibraryResults(false)}
if(state.hub)animateHubStage();return;
}
if(d.age!==undefined||d.sys!==undefined){
if(d.age!==undefined)state.age=d.age||"all";if(d.sys!==undefined)state.sys=d.sys||"all";
if(state.hub&&typeof filterHubs==="function"&&!filterHubs({q:state.q,age:state.age,g:state.sys}).some(h=>h.id===state.hub))state.hub=null;
applyHash();patchLibraryResults(true);return;
}
if(d.chart){if(["bp","glucose","weight"].includes(d.chart)){state.chartKind=d.chart;applyHash();render();animateViewSwap(qs(".chartbox"))}return}
if(d.cond){const id=d.cond,on=DB.myConds.includes(id);DB.myConds=on?DB.myConds.filter(x=>x!==id):[...DB.myConds,id];save();refreshView();if(!on&&condById(id)){const add=condById(id).cards.filter(k=>CARDS[k]?.ready&&!DB.deck.includes(k));toast(add.length?`已选「${condById(id).name}」，首页推荐了 ${add.length} 张卡`:`已选「${condById(id).name}」`)}return}
if(d.rmcustom){DB.customConds=DB.customConds.filter(x=>x!==d.rmcustom);save();refreshView();return}
if(d.addcustom){addCustom(d.addcustom);return}
if(d.libtab){state.libTab=d.libtab;applyHash();patchLibraryResults(true);const z=sceneZoneFor();US()?.focusZone(z);syncDeskZoneUI(z);return}
if(t.classList.contains("stepbtn")){
const li=t.closest("li");if(!li)return;li.classList.toggle("done");const ok=li.classList.contains("done");
t.setAttribute("aria-pressed",ok);t.textContent=ok?"✓":(+li.dataset.i+1);
if(state.card){DB.stepDone||={};const idxs=[...qsa("ol.steps li.done")].map(el=>+el.dataset.i).filter(Number.isInteger);if(idxs.length)DB.stepDone[state.card]=idxs;else delete DB.stepDone[state.card];save()}
updateProgress();return;
}
if(d.filter){state.filter=d.filter;applyHash();render();animateViewSwap(qs(".timeline"));return}
if(d.pref){prefs[d.pref]=d.val;applyPrefs();syncScenePrefs();render();return}
if(d.take){const m=DB.meds.find(x=>x.id===d.take);if(!m)return;const n=new Date(),s=localDate(n)+" "+pad(n.getHours())+":"+pad(n.getMinutes());m.log.push(s);save();render();toast("已记下 "+s.slice(11),()=>{m.log.pop();save();render()});return}
if(d.rmmed){const bk=clone(DB.meds);DB.meds=DB.meds.filter(x=>x.id!==d.rmmed);save();render();toast("已删除",()=>{DB.meds=bk;save();render()});return}
if(d.confirm){const id=d.confirm;allVitalEvents().forEach(x=>{if(x.id===id)x.status="ok"});save();render();toast("已确认",()=>{allVitalEvents().forEach(x=>{if(x.id===id)x.status="pend"});save();render()});return}
if(d.del){const id=d.del,bk=clone(DB),f=a=>(a||[]).filter(x=>x.id!==id);DB.events=f(DB.events);DB.readings=f(DB.readings);DB.glucoseReadings=f(DB.glucoseReadings);DB.weightReadings=f(DB.weightReadings);save();render();toast("已删除 1 条记录",()=>{DB=bk;save();render()});return}
if(t.hasAttribute("data-close")){dlg.close();return}
const acts={addbp:openAdd,addglucose:openAddGlucose,addweight:openAddWeight,clinicsheet:openClinicSheet,questions:openQuestions,redlines:openRedLines,exportjson:exportBackupJSON,importjson:openImportBackup,upload:pickFiles};
const p=d.prep;
if(p){if(acts[p])acts[p]();else if(p==="showpend"||p==="showtest"){state.filter=p==="showpend"?"pend":"test";applyHash();render()}else if(p==="meds"){DB.prep.medsReady=!DB.prep.medsReady;save();render()}return}
const a=d.act;if(!a)return;
if(a==="toggle-sanctuary"){setSanctuaryPeek(!(isMob()?curMobileBreak==="bottom":desktopPeek));return}
if(acts[a]){acts[a]();return}
if(a==="bedside")openBedside(d.for||state.card);
else if(a==="ai")openAI(d.from);
else if(a==="resetsteps"){
const k=state.card,prev=k&&DB.stepDone?.[k]?clone(DB.stepDone[k]):[];if(k&&DB.stepDone)delete DB.stepDone[k];
qsa("ol.steps li.done").forEach(li=>{li.classList.remove("done");const b=li.querySelector(".stepbtn");if(b){b.setAttribute("aria-pressed","false");b.textContent=String(+li.dataset.i+1)}});
save();updateProgress();if(prev.length&&k)toast("已重置本卡步骤进度",()=>{DB.stepDone||={};DB.stepDone[k]=prev;save();render()});
}else if(a==="saveEp"){const v=$id("aiEp").value.trim();if(v&&!/^https:\/\//.test(v)&&!/^http:\/\/localhost/.test(v)){toast("地址要以 https:// 开头");return}prefs.aiEndpoint=v;applyPrefs();toast(v?"已保存 AI 服务地址":"已改回本地演示")}
else if(a==="print"){state.filter="all";applyHash();render();setTimeout(()=>window.print(),60)}
else if(a==="reset"){const bk=clone(DB);DB=clone(SEED);save();render();toast("已恢复演示数据",()=>{DB=bk;save();render()})}
else if(a==="clearrecent"){prefs.recent=[];applyPrefs();render()}
else if(a==="wipe"&&confirm("清除这台设备上鹤伴的所有记录和上传的文件？此操作不能撤销。")){localStorage.removeItem(KEY);FILES.clear().catch(()=>{});DB=clone(SEED);render();toast("已清除，并恢复为演示数据")}
});
document.addEventListener("keydown",e=>{
if(dlg.open){if(!e.target.closest("input,textarea,select")&&dlgBody.querySelector(".bedside-dlg")){if(e.key==="ArrowLeft"){const b=$id("bsPrev");if(b&&!b.disabled){e.preventDefault();b.click()}}if(e.key==="ArrowRight"){const b=$id("bsNext")||$id("bsFinish");if(b){e.preventDefault();b.click()}}}return}
if(e.target.closest("input,textarea,select")||e.metaKey||e.ctrlKey||e.altKey)return;
if((e.key==="ArrowLeft"||e.key==="ArrowRight")&&e.target.matches?.("circle.pt-node")){const f=[...qsa("circle.pt-node[tabindex='0']")],c=f.indexOf(e.target);if(c>=0){e.preventDefault();f[Math.max(0,Math.min(f.length-1,c+(e.key==="ArrowRight"?1:-1)))]?.focus();return}}
const v={"1":"cards","2":"library","3":"folder","4":"settings"}[e.key];if(v)go(v);
if(e.key==="/"){e.preventDefault();if(state.view!=="library")go("library");ensureMobileTop();const qEl=$id("q");if(qEl){qEl.focus();qEl.select?.()}}
if(e.key==="n"||e.key==="N"){e.preventDefault();openAdd()}
if(e.key==="u"||e.key==="U"){e.preventDefault();go("folder");pickFiles()}
});
document.addEventListener("dragover",e=>{if(state.view==="folder")e.preventDefault()});
document.addEventListener("drop",e=>{if(state.view!=="folder")return;e.preventDefault();const fs=[...e.dataTransfer.files].filter(f=>/^image\/|application\/pdf/.test(f.type));if(fs.length)openUpload(fs)});
qsa("img[data-art]").forEach(i=>i.src=ART[i.dataset.art]);
applyPrefs();
const bootHash=parseHash();if(bootHash)applyHashState(bootHash);
try{const sEl=$id("scene3d");if(sEl&&US())US().init(sEl,{fixed:true,theme:getThemeMode(),reducedMotion:motionReduced(),syncDocument:true,onHotspotSelect:handleSceneHotspot})}catch(_){}
if(typeof MutationObserver==="function"&&dlg){new MutationObserver(syncSceneSuspend).observe(dlg,{attributes:true,attributeFilter:["open"]});dlg.addEventListener("close",syncSceneSuspend)}
RMQ?.addEventListener?.("change",syncScenePrefs);
matchMedia("(prefers-color-scheme: dark)").addEventListener?.("change",syncScenePrefs);
isMobileMQ.addEventListener?.("change",()=>syncResponsiveSheet());
let __rszT=0;
window.addEventListener("resize",()=>{if(!isMob()){if(pane)syncResponsiveSheet();return}const vh=window.innerHeight||844;if(Math.abs(vh-__lastVH)>24){clearTimeout(__rszT);__rszT=setTimeout(()=>syncResponsiveSheet(true),120)}else if(pane)rAF(syncPaneScrollHeight)});
render();syncDeskZoneUI(sceneZoneFor());syncResponsiveSheet();
