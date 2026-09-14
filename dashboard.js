(()=>{
 const $=x=>document.getElementById(x);
 const fmt=n=>new Intl.NumberFormat("id-ID",{maximumFractionDigits:1}).format(Number(n)||0);
 const esc=v=>String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
 function render(){
  const s=AMIRA.state.stats||{total:0,valid:0,workers:0,photos:0,gps:0,byWS:{},byBlock:{},byMat:{}};
  $("trx").textContent=fmt(s.total);
  $("hk").textContent=fmt(s.workers);
  $("realization").textContent=fmt(s.valid);
  $("validRate").textContent=s.total?`Valid ${fmt(s.valid/s.total*100)}%`:"POC — menunggu data";
  $("evidence").textContent=s.valid?fmt(s.photos/s.valid*100)+"%":"0%";
  $("evidenceText").textContent=`${fmt(s.photos)} foto • ${fmt(s.gps)} GPS`;
  $("gpsCount").textContent=fmt(s.gps);
  $("materialCount").textContent=Object.keys(s.byMat).filter(k=>k!=="—").length;
  $("sourceBadge").textContent=s.total?`Amanda ${fmt(s.total)} transaksi`:"POC — menunggu data";
  $("mapInfo").textContent=s.gps?`${fmt(s.gps)} titik GPS terdeteksi`:"Upload data untuk melihat GPS";

  const wsMax=Math.max(...AMIRA.workstreams.map(w=>s.byWS[w]||0),1);
  $("workstream").innerHTML=AMIRA.workstreams.map(w=>`
   <div class="ws"><div><b>${w}</b><span>${fmt(s.byWS[w]||0)}</span></div>
   <div class="meter"><i style="width:${Math.min(100,(s.byWS[w]||0)/wsMax*100)}%"></i></div></div>
  `).join("")+`<div class="ws"><div><b>OTHER</b><span>${fmt(s.byWS.OTHER||0)}</span></div></div>`;

  const mats=Object.entries(s.byMat).filter(([m])=>m!=="—").sort((a,b)=>b[1]-a[1]).slice(0,5);
  $("materialTable").innerHTML=mats.length
   ?mats.map(([m,n])=>`<tr><td>${esc(m)}</td><td>Master Job</td><td>${fmt(n)}</td></tr>`).join("")
   :`<tr><td colspan="3">Material belum terdeteksi dari transaksi Amanda</td></tr>`;
  $("balance").innerHTML=mats.length
   ?mats.map(([m,n])=>`<tr><td>${esc(m)}</td><td>${fmt(n)}</td><td>Detected</td></tr>`).join("")
   :`<tr><td colspan="3">Belum ada material usage</td></tr>`;

  const bs=Object.entries(s.byBlock).sort((a,b)=>b[1]-a[1]).slice(0,8);
  const mx=Math.max(...bs.map(x=>x[1]),1);
  $("blocks").innerHTML=bs.length
   ?bs.map(([b,n])=>`<div class="block"><span>${esc(b)}</span><div><i style="width:${n/mx*100}%"></i></div><b>${fmt(n)}</b></div>`).join("")
   :"<p class='muted'>Belum ada transaksi.</p>";

  $("activity").innerHTML=AMIRA.state.rows.filter(r=>r._valid).slice(0,15).map(r=>`
   <tr><td>${esc(r.ATTTIME||r.S_TIME||"—")}</td>
   <td>${esc(r.NAMA||r.EMPCODE||r.EMPNO||"—")}</td>
   <td>${esc(r.JOBCODE||"—")}</td><td>${esc(r.BLOKCODE||"—")}</td>
   <td>${r.PHOTO_PATH||r.PHOTO_PATH2?"●":"—"}</td></tr>
  `).join("")||`<tr><td colspan="5">Upload Amanda CSV untuk melihat transaksi.</td></tr>`;

  const ev=s.valid?Math.round(s.photos/s.valid*100):0;
  $("evidenceDonut").textContent=ev+"%";
  $("evidenceList").innerHTML=`
   <div class="legend">● Foto <b>${fmt(s.photos)}</b></div>
   <div class="legend">● GPS <b>${fmt(s.gps)}</b></div>
   <div class="legend">● Tanpa foto <b>${fmt(Math.max(0,s.valid-s.photos))}</b></div>`;

  $("alerts").innerHTML=s.total
   ?`<div class="alert info">ⓘ ${fmt(s.valid)} transaksi valid dari ${fmt(s.total)} baris Amanda.</div>`
   :`<div class="alert info">ⓘ Upload Master Rawat lalu pilih CSV Amanda untuk mengaktifkan engine.</div>`;

  // POC visual: transaction rows are the current realization proxy.
  const bars=$("bars");
  bars.innerHTML=s.total?`
   <div style="height:${Math.max(8,Math.min(100,s.valid/(Math.max(s.total,1))*100))}%;flex:1;background:#17825f;border-radius:5px 5px 0 0;position:relative">
    <span style="position:absolute;bottom:-18px;left:50%;transform:translateX(-50%);font-size:9px">Valid</span>
   </div>
   <div style="height:${Math.max(8,Math.min(100,(s.total-s.valid)/(Math.max(s.total,1))*100))}%;flex:1;background:#c9d8d2;border-radius:5px 5px 0 0;position:relative">
    <span style="position:absolute;bottom:-18px;left:50%;transform:translateX(-50%);font-size:9px">Review</span>
   </div>`:"";
 }
 async function readFiles(files){return Promise.all([...files].map(f=>f.text()))}

 $("uploadBtn").onclick=()=>{
  const master=$("masterInput");
  master.click();
  master.onchange=async()=>{
   if(!master.files[0])return;
   const m=AMIRAParser.parseMaster(await master.files[0].text());
   const amanda=$("amandaInput");
   amanda.click();
   amanda.onchange=async()=>{
    if(!amanda.files.length)return;
    const aa=(await readFiles(amanda.files)).map(AMIRAParser.parseAmanda);
    const jobs=new Map((m.sections.M_JOB||[]).map(r=>[String(r.JOBCODE||"").trim(),r]));
    const rows=aa.flat().map(r=>{
     const j=jobs.get(String(r.JOBCODE||"").trim())||{};
     const ws=AMIRA.classify(r.JOBCODE,j.DESCRIPTION||j.JOBNAME||j.JOBDESC||"");
     return {...r,_job:j,_ws:ws,_valid:!!r.JOBCODE&&(!!r.EMPNO||!!r.NAMA)};
    });
    const v=rows.filter(r=>r._valid);
    const workers=new Set(v.map(r=>r.EMPNO||r.EMPCODE||r.NAMA).filter(Boolean));
    const byWS={},byBlock={},byMat={};
    v.forEach(r=>{
     byWS[r._ws]=(byWS[r._ws]||0)+1;
     const bl=r.BLOKCODE||"—"; byBlock[bl]=(byBlock[bl]||0)+1;
     const mat=r.MATERIAL||r.MATERIALCODE||r.ITEMBACODE||r._job.ITEMBACODE||"—";
     byMat[mat]=(byMat[mat]||0)+1;
    });
    AMIRA.state={master:m,amanda:aa,jobs,rows,stats:{
     total:rows.length,valid:v.length,workers:workers.size,
     photos:v.filter(r=>r.PHOTO_PATH||r.PHOTO_PATH2).length,
     gps:v.filter(r=>AMIRA.num(r.LAT)||AMIRA.num(r.LONG)).length,
     byWS,byBlock,byMat
    }};
    render();
   };
  };
 };
 $("today").textContent=new Date().toLocaleDateString("id-ID",{weekday:"long",day:"2-digit",month:"long",year:"numeric"});
 render();
})();