const state = { lang: "ar", selected: 11, query: "" };
let elements = [];
const categoryMeta = {
  alkali:{ar:"الفلزات القلوية",en:"Alkali metals",color:"#ff9e8b"},
  alkaline:{ar:"الفلزات القلوية الترابية",en:"Alkaline earth metals",color:"#ffc56b"},
  metalloid:{ar:"أشباه الفلزات",en:"Metalloids",color:"#8bd6a4"},
  nonmetal:{ar:"اللافلزات",en:"Nonmetals",color:"#7ab9ff"},
  halogen:{ar:"الهالوجينات",en:"Halogens",color:"#ffb66d"},
  noble:{ar:"الغازات النبيلة",en:"Noble gases",color:"#c6a6ff"},
  "post-transition":{ar:"فلزات أخرى",en:"Post-transition metals",color:"#a8c5d8"}
};
const copy = {
 ar:{
  edition:"الجدول المبسّط · أول 3 دورات",eyebrow:"اكتشف عالم العناصر",heroTitle:'كل عنصر له<br><em>قصة ذرّية.</em>',
  heroDesc:"استكشف أول ثلاث دورات من الجدول الدوري، وتعرّف على بنية الذرة وتوزيع إلكتروناتها وخصائصها.",
  statElements:"عنصرًا تفاعليًا",statPeriods:"دورات معروضة",statGroups:"مجموعات رئيسية",
  exploreKicker:"INTERACTIVE PERIODIC TABLE",tableTitle:'الجدول الدوري <span>المبسّط</span>',tableNote:"اضغط على أي عنصر لاستكشافه",
  searchPlaceholder:"ابحث بالاسم أو الرمز أو العدد الذري...",clearSearch:"مسح البحث",atomicIndex:"01 — 18 / ATOMIC INDEX",selectHint:"اختر عنصرًا لعرض البطاقة",
  tableFoot:"هذا عرض مبسّط للمجموعات الرئيسية في أول ثلاث دورات، وليس الجدول الكامل ذي 118 عنصرًا.",
  profileKicker:"ELEMENT PROFILE",profileTitle:'من الذرة إلى <span>العالم</span>',
  scienceNoteTitle:"ملاحظة علمية",scienceNote:"التوزيع حسب الأغلفة هنا يوضح عدد الإلكترونات في كل غلاف للذرة المتعادلة. القيم المعروضة تعليمية، وتختلف بعض التفاصيل والكتل النظيرية باختلاف النظائر.",
  footerLine:"صُنع للتعلّم، وصُمّم للاستكشاف.",number:"العدد الذري",mass:"الكتلة الذرية",state:"الحالة",shells:"توزيع الأغلفة الإلكترونية",
  configuration:"التوزيع الإلكتروني بالمدارات الفرعية",properties:"الخواص الفيزيائية والكيميائية",uses:"استخدامات في الحياة",about:"نبذة عن العنصر",
  period:"الدورة",group:"المجموعة",notFound:"لا توجد عناصر تطابق بحثك.",selected:"العنصر المحدد",visual:"نموذج ذري توضيحي",
  category:"العائلة الكيميائية",backToTable:"العودة إلى الجدول",prev:"العنصر السابق",next:"العنصر التالي"
 },
 en:{
  edition:"Simplified table · first 3 periods",eyebrow:"DISCOVER THE ELEMENTS",heroTitle:'Every element has<br><em>an atomic story.</em>',
  heroDesc:"Explore the first three periods of the periodic table and discover atomic structure, electron shells, and element properties.",
  statElements:"interactive elements",statPeriods:"periods shown",statGroups:"main groups",
  exploreKicker:"INTERACTIVE PERIODIC TABLE",tableTitle:'The <span>simplified</span> periodic table',tableNote:"Select an element to explore",
  searchPlaceholder:"Search by name, symbol, or atomic number...",clearSearch:"Clear search",atomicIndex:"01 — 18 / ATOMIC INDEX",selectHint:"Select an element to open its profile",
  tableFoot:"A simplified view of the main-group elements in the first three periods—not the complete 118-element table.",
  profileKicker:"ELEMENT PROFILE",profileTitle:'From atom to <span>everyday life</span>',
  scienceNoteTitle:"Scientific note",scienceNote:"Shell distribution shows the number of electrons in each shell of a neutral atom. Values are educational; isotopic masses and some properties vary by isotope.",
  footerLine:"Made for learning. Designed for discovery.",number:"Atomic number",mass:"Atomic mass",state:"State",shells:"Electron shell distribution",
  configuration:"Subshell electron configuration",properties:"Physical & chemical properties",uses:"Everyday applications",about:"About this element",
  period:"Period",group:"Group",notFound:"No elements match your search.",selected:"Selected element",visual:"Illustrative atomic model",
  category:"Chemical family",backToTable:"Back to table",prev:"Previous element",next:"Next element"
 }
};
const $ = id => document.getElementById(id);
function tr(key){ return copy[state.lang][key] || key; }
function label(el,key){return state.lang==="ar"?el[key+"_ar"]:el[key+"_en"];}
function normalize(v){return String(v).toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").trim();}
function setLanguage(lang){
  state.lang=lang;
  document.documentElement.lang=lang;
  document.documentElement.dir=lang==="ar"?"rtl":"ltr";
  $("langToggle").innerHTML=lang==="ar"?'EN <span>↗</span>':'عربي <span>↗</span>';
  document.querySelectorAll("[data-i18n]").forEach(el=>{const k=el.dataset.i18n;if(copy[lang][k])el.textContent=copy[lang][k];});
  document.querySelectorAll("[data-i18n-html]").forEach(el=>{const k=el.dataset.i18nHtml;if(copy[lang][k])el.innerHTML=copy[lang][k];});
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el=>{const k=el.dataset.i18nPlaceholder;if(copy[lang][k])el.placeholder=copy[lang][k];});
  renderLegend();renderTable();renderDetail();
}
function renderLegend(){
  $("legend").innerHTML=Object.entries(categoryMeta).map(([key,meta])=>`<span class="legend-item"><i class="legend-swatch" style="background:${meta.color}"></i>${meta[state.lang]}</span>`).join("");
}
function matches(el){
  if(!state.query)return true;
  const q=normalize(state.query);
  return normalize(el.s).includes(q)||normalize(el.ar).includes(q)||normalize(el.en).includes(q)||String(el.n)===q;
}
function renderTable(){
  const shown=elements.filter(matches);
  const grid=$("periodicTable");
  if(!shown.length){grid.innerHTML=`<div class="empty-state">${tr("notFound")}</div>`;return;}
  grid.innerHTML=shown.map(el=>{
    const meta=categoryMeta[el.cat];
    return `<button class="element-tile ${el.n===state.selected?"active":""}" style="--el-color:${meta.color};grid-column:${el.group};grid-row:${el.period}" data-n="${el.n}" aria-label="${el.s} ${state.lang==="ar"?el.ar:el.en}" aria-pressed="${el.n===state.selected}">
      <span class="tile-number">${el.n}</span><span class="tile-symbol">${el.s}</span>
      <span class="tile-name">${state.lang==="ar"?el.ar:el.en}</span><span class="tile-mass">${el.mass}</span></button>`;
  }).join("");
  grid.querySelectorAll(".element-tile").forEach(btn=>btn.addEventListener("click",()=>{
    state.selected=Number(btn.dataset.n);renderTable();renderDetail();
    if(window.matchMedia("(max-width:760px)").matches)$("detailSection").scrollIntoView({behavior:"smooth",block:"start"});
  }));
}
function atomSvg(el){
  const count=el.shells.reduce((a,b)=>a+b,0);
  const dots=[];
  el.shells.forEach((n,idx)=>{
    const r=22+idx*19;
    for(let i=0;i<n;i++){
      const angle=(Math.PI*2*i/n)+(idx*.25);
      const x=105+Math.cos(angle)*r,y=105+Math.sin(angle)*r;
      dots.push(`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.3" fill="${categoryMeta[el.cat].color}"><title>Electron</title></circle>`);
    }
  });
  const rings=el.shells.map((_,i)=>`<circle cx="105" cy="105" r="${22+i*19}" fill="none" stroke="${categoryMeta[el.cat].color}" stroke-opacity=".5" stroke-width="1"/>`).join("");
  return `<svg viewBox="0 0 210 210" role="img" aria-label="${tr("visual")}" class="atom-svg">${rings}<circle cx="105" cy="105" r="12" fill="${categoryMeta[el.cat].color}" opacity=".96"/><circle cx="105" cy="105" r="17" fill="none" stroke="${categoryMeta[el.cat].color}" stroke-opacity=".25"/>${dots.join("")}</svg>`;
}
function renderDetail(){
  const el=elements.find(item=>item.n===state.selected)||elements[0];
  if(!el)return;
  const meta=categoryMeta[el.cat],name=state.lang==="ar"?el.ar:el.en;
  const stateLabel=state.lang==="ar"?el.state_ar:el.state_en;
  const desc=state.lang==="ar"?el.ar_desc:el.en_desc;
  const props=state.lang==="ar"?el.ar_props:el.en_props;
  const uses=state.lang==="ar"?el.ar_uses:el.en_uses;
  $("elementDetail").innerHTML=`
    <div class="detail-visual" style="--el-color:${meta.color}">
      <div class="detail-atom">${atomSvg(el)}</div>
      <div class="visual-caption"><span>ATOMIC MODEL / ${String(el.n).padStart(2,"0")}</span><span>${el.s} · ${el.shells.reduce((a,b)=>a+b,0)} e⁻</span></div>
    </div>
    <div class="detail-content" style="--el-color:${meta.color}">
      <div class="detail-overline"><i class="dot"></i>${tr("selected")} · ${String(el.n).padStart(2,"0")}</div>
      <div class="detail-title-row"><div class="big-symbol">${el.s}</div><div><h3 class="detail-title">${name}</h3><div class="detail-subtitle">${el.en} · ${tr("period")} ${el.period} · ${tr("group")} ${el.group}</div></div></div>
      <div class="metric-grid">
        <div class="metric"><span>${tr("number")}</span><strong>${el.n}</strong></div>
        <div class="metric"><span>${tr("mass")}</span><strong>${el.mass} u</strong></div>
        <div class="metric"><span>${tr("state")}</span><strong>${stateLabel}</strong></div>
      </div>
      <div class="detail-block"><h3>${tr("about")}</h3><p>${desc}</p></div>
      <div class="detail-block"><h3>${tr("shells")}</h3><div class="shells">${el.shells.map((num,i)=>`<span class="shell-pill">${state.lang==="ar"?"الغلاف":"Shell"} ${i+1}: ${num} e⁻</span>`).join("")}</div></div>
      <div class="detail-block"><h3>${tr("configuration")}</h3><div class="detail-config">${el.config}</div></div>
      <div class="detail-block"><h3>${tr("properties")}</h3><p>${props}</p></div>
      <div class="detail-block"><h3>${tr("uses")}</h3><p>${uses}</p></div>
      <span class="detail-tag"><i class="legend-swatch" style="background:${meta.color}"></i>${tr("category")}: ${meta[state.lang]}</span>
    </div>`;
  $("prevElement").setAttribute("aria-label",tr("prev"));$("nextElement").setAttribute("aria-label",tr("next"));
}
function changeElement(delta){
  const idx=elements.findIndex(el=>el.n===state.selected);
  const next=(idx+delta+elements.length)%elements.length;
  state.selected=elements[next].n;renderTable();renderDetail();
}
$("langToggle").addEventListener("click",()=>setLanguage(state.lang==="ar"?"en":"ar"));
$("searchInput").addEventListener("input",e=>{state.query=e.target.value;renderTable();});
$("clearSearch").addEventListener("click",()=>{$("searchInput").value="";state.query="";renderTable();$("searchInput").focus();});
$("prevElement").addEventListener("click",()=>changeElement(-1));
$("nextElement").addEventListener("click",()=>changeElement(1));
document.addEventListener("keydown",e=>{
  if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"){e.preventDefault();$("searchInput").focus();}
  if(e.key==="ArrowLeft"&&document.activeElement.tagName!=="INPUT")changeElement(state.lang==="ar"?1:-1);
  if(e.key==="ArrowRight"&&document.activeElement.tagName!=="INPUT")changeElement(state.lang==="ar"?-1:1);
});
fetch("assets/elements.json").then(r=>{if(!r.ok)throw new Error("Could not load element data");return r.json();}).then(data=>{
  elements=data;renderLegend();renderTable();renderDetail();
}).catch(err=>{
  $("periodicTable").innerHTML='<div class="empty-state">تعذر تحميل بيانات العناصر. تأكد من وجود assets/elements.json بجانب index.html.</div>';
  console.error(err);
});
