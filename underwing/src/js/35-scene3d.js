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
