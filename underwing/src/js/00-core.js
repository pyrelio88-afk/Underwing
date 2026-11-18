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
