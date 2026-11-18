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
