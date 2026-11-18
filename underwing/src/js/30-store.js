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
