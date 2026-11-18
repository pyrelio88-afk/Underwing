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
