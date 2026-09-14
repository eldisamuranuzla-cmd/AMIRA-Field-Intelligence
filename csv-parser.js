window.AMIRAParser = (() => {
  function splitCSVLine(line) {
    const out=[]; let cur="", q=false;
    for(let i=0;i<line.length;i++){
      const ch=line[i];
      if(ch === '"'){ if(q && line[i+1]==='"'){cur+='"';i++;} else q=!q; }
      else if(ch===',' && !q){out.push(cur);cur="";} else cur+=ch;
    }
    out.push(cur); return out;
  }
  function parseLines(text){
    return text.replace(/^\uFEFF/,"").split(/\r?\n/).filter(x=>x.trim()!=="").map(splitCSVLine);
  }
  function parseMaster(text){
    const lines=parseLines(text), sections={}, headers={}, data={};
    let section=null;
    for(const cells of lines){
      const first=(cells[0]||"").trim();
      if(first.startsWith("[") && first.endsWith("]")){ section=first.slice(1,-1); data[section]=[]; continue; }
      if(!section) continue;
      if(!headers[section]){ headers[section]=cells.map(x=>x.trim()); continue; }
      const row={}; headers[section].forEach((h,i)=>row[h]=(cells[i]??"").trim());
      data[section].push(row);
    }
    return {sections:data,headers};
  }
  function parseAmanda(text){
    const lines=parseLines(text);
    let idx=lines.findIndex(r => r.some(c=>String(c).trim()==="EMPNO"));
    if(idx<0) idx=lines.findIndex(r=>r.some(c=>String(c).trim()==="JOBCODE"));
    if(idx<0) return [];
    const headers=lines[idx].map(x=>x.trim()), rows=[];
    for(let i=idx+1;i<lines.length;i++){
      const c=lines[i]; if(!c.length) continue;
      const row={}; headers.forEach((h,j)=>row[h]=(c[j]??"").trim());
      if(row.JOBCODE || row.EMPNO || row.NAMA) rows.push(row);
    }
    return rows;
  }
  return {parseMaster,parseAmanda};
})();