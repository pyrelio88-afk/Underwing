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
