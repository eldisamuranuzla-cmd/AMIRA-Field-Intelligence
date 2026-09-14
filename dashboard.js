(() => {
  const $=id=>document.getElementById(id);
  const esc=s=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
  const fmt=n=>new Intl.NumberFormat("id-ID",{maximumFractionDigits:1}).format(n);
  function ingest(master, amanda){
    const jobs=new Map(), mats=new Map();
    (master.sections.M_JOB||[]).forEach(r=>jobs.set(String(r.JOBCODE||"").trim(),r));
    (master.sections.M_MATERIAL||[]).forEach(r=>mats.set(String(r.MATERIALCODE||r.ITEMBACODE||r.CODE||"").trim(),r));
    const rows=amanda.flatMap(x=>x).map(r=>{
      const code=String(r.JOBCODE||"").trim(), job=jobs.get(code)||{};
      const ws=AMIRA.classify(code,job.JOBNAME||job.DESCRIPTION||job.JOBDESC||"");
      return {...r,_job:job,_ws:ws,_valid:!!code && !!(r.EMPNO||r.NAMA)};
    });
    const valid=rows.filter(r=>r._valid);
    const workers=new Set(valid.map(r=>r.EMPNO||r.EMPCODE||r.NAMA).filter(Boolean));
    const photos=valid.filter(r=>r.PHOTO_PATH||r.PHOTO_PATH2).length;
    const gps=valid.filter(r=>AMIRA.num(r.LAT)!==0 || AMIRA.num(r.LONG)!==0).length;
    const byWS={}; const byBlock={}; const byMat={};
    valid.forEach(r=>{
      byWS[r._ws]=(byWS[r._ws]||0)+1;
      const b=r.BLOKCODE||"—"; byBlock[b]=(byBlock[b]||0)+1;
      const m=r.MATERIAL||r.MATERIALCODE||r.ITEMBACODE||r._job.ITEMBACODE||r._job.MATERIAL||"—";
      byMat[m]=(byMat[m]||0)+1;
    });
    AMIRA.state={master,amanda,jobs,mats,rows,stats:{total:rows.length,valid:valid.length,workers:workers.size,photos,gps,byWS,byBlock,byMat}};
    render();
  }
  function render(){
    const s=AMIRA.state.stats||{total:0,valid:0,workers:0,photos:0,gps:0,byWS:{},byBlock:{},byMat:{}};
    $("trx").textContent=fmt(s.total); $("hk").textContent=fmt(s.workers); $("realization").textContent=fmt(s.valid);
    $("validRate").textContent=s.total?`Valid ${fmt(s.valid/s.total*100)}%`:"Validasi —";
    $("evidence").textContent=s.valid?fmt(s.photos/s.valid*100)+"%":"0%";
    $("evidenceText").textContent=`${fmt(s.photos)} foto • ${fmt(s.gps)} GPS`;
    $("gpsCount").textContent=`${fmt(s.gps)} GPS`;
    $("sourceBadge").textContent=s.total?`Amanda ${s.total} transaksi`:"POC — menunggu data";
    $("workstream").innerHTML=AMIRA.workstreams.map(w=>`<div class="ws"><div><b>${w}</b><span>${fmt(s.byWS[w]||0)}</span></div><div class="meter"><i style="width:${Math.min(100,(s.byWS[w]||0)/(s.valid||1)*100)}%"></i></div></div>`).join("")+
      `<div class="ws"><div><b>OTHER</b><span>${fmt(s.byWS.OTHER||0)}</span></div><div class="meter"><i style="width:${Math.min(100,(s.byWS.OTHER||0)/(s.valid||1)*100)}%"></i></div></div>`;
    const mats=Object.entries(s.byMat).sort((a,b)=>b[1]-a[1]).slice(0,5);
    $("materialTable").innerHTML=mats.length?mats.map(([m,n])=>`<tr><td>${esc(m)}</td><td>—</td><td>${fmt(n)}</td></tr>`).join(""):`<tr><td colspan="3">Belum ada data</td></tr>`;
    const blocks=Object.entries(s.byBlock).sort((a,b)=>b[1]-a[1]).slice(0,8), max=Math.max(...blocks.map(x=>x[1]),1);
    $("blocks").innerHTML=blocks.length?blocks.map(([b,n])=>`<div class="block"><span>${esc(b)}</span><div><i style="width:${n/max*100}%"></i></div><b>${fmt(n)}</b></div>`).join(""):"<p class='muted'>Belum ada transaksi.</p>";
    $("activity").innerHTML=AMIRA.state.rows.filter(r=>r._valid).slice(0,12).map(r=>`<tr><td>${esc(r.ATTTIME||r.S_TIME||"—")}</td><td>${esc(r.NAMA||r.EMPCODE||r.EMPNO||"—")}</td><td>${esc(r.JOBCODE||"—")}</td><td>${esc(r.BLOKCODE||"—")}</td><td>${r.PHOTO_PATH||r.PHOTO_PATH2?"●":"—"}</td></tr>`).join("") || `<tr><td colspan="5">Upload Amanda CSV untuk melihat transaksi.</td></tr>`;
    $("balance").innerHTML=mats.length?mats.map(([m,n])=>`<tr><td>${esc(m)}</td><td>${fmt(n)}</td><td><span class="pill ok">TERDETEKSI</span></td></tr>`).join(""):`<tr><td colspan="3">Belum ada data</td></tr>`;
    $("evidenceDonut").textContent=s.valid?fmt(s.photos/s.valid*100)+"%":"0%";
    $("evidenceList").innerHTML=`<div class="legend">● Foto valid <b>${fmt(s.photos)}</b></div><div class="legend">● GPS <b>${fmt(s.gps)}</b></div><div class="legend">● Tanpa foto <b>${fmt(Math.max(0,s.valid-s.photos))}</b></div>`;
    $("alerts").innerHTML=s.total?`<div class="alert info">ⓘ ${fmt(s.valid)} transaksi valid dari ${fmt(s.total)} baris.</div>${s.gps<s.valid?`<div class="alert warn">⚠ ${fmt(s.valid-s.gps)} transaksi belum memiliki GPS.</div>`:""}${s.photos<s.valid?`<div class="alert warn">⚠ ${fmt(s.valid-s.photos)} transaksi belum memiliki foto.</div>`:""}`:`<div class="alert info">ⓘ Upload Master Rawat dan CSV Amanda untuk mengaktifkan engine.</div>`;
  }
  function filesToTexts(files){ return Promise.all([...files].map(f=>f.text())); }
  $("uploadBtn").onclick=async()=>{
    const masterFile=await new Promise(resolve=>{
      const i=$("masterInput"); i.onchange=()=>resolve(i.files[0]); i.click();
    });
    if(!masterFile) return;
    const master=AMIRAParser.parseMaster(await masterFile.text());
    const amandaFiles=await new Promise(resolve=>{
      const i=$("amandaInput"); i.onchange=()=>resolve(i.files); i.click();
    });
    const texts=await filesToTexts(amandaFiles||[]);
    ingest(master,texts.map(AMIRAParser.parseAmanda));
  };
  $("today").textContent=new Date().toLocaleDateString("id-ID",{weekday:"long",day:"2-digit",month:"long",year:"numeric"});
  render();
})();