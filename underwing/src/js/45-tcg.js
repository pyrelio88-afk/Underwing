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
