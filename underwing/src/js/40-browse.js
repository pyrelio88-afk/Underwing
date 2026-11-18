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
