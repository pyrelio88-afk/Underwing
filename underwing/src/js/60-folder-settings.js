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
