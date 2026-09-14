window.AMIRAParser=(()=>{
 function split(line){
  const o=[];let c="",q=false;
  for(let i=0;i<line.length;i++){
   const x=line[i];
   if(x==='"'){
    if(q&&line[i+1]==='"'){c+='"';i++}else q=!q;
   }else if(x===','&&!q){o.push(c);c=""}else c+=x;
  }
  o.push(c);return o;
 }
 function lines(t){
  return String(t??"").replace(/^\uFEFF/,"").split(/\r?\n/).filter(x=>x.trim()).map(split);
 }
 function sectionName(cell){
  const m=String(cell??"").trim().match(/^\s*=*\s*\[([^\]]+)\]\s*$/);
  return m?m[1].trim():null;
 }
 function parseMaster(t){
  const ls=lines(t),data={},headers={};let s=null;
  for(const c of ls){
   const sec=sectionName(c[0]);
   if(sec){s=sec;data[s]=[];headers[s]=null;continue}
   if(!s)continue;
   if(!headers[s]){headers[s]=c.map(x=>x.trim());continue}
   const r={};
   headers[s].forEach((h,i)=>{if(h)r[h]=(c[i]??"").trim()});
   if(Object.values(r).some(v=>v!==""))data[s].push(r);
  }
  return{sections:data,headers};
 }
 function parseAmanda(t){
  const ls=lines(t);
  let i=ls.findIndex(r=>r.some(c=>String(c).trim()==="EMPNO"));
  if(i<0)i=ls.findIndex(r=>r.some(c=>String(c).trim()==="JOBCODE"));
  if(i<0)return[];
  const h=ls[i].map(x=>x.trim()),out=[];
  for(let j=i+1;j<ls.length;j++){
   const sec=sectionName(ls[j][0]); if(sec)break;
   const c=ls[j],r={};
   h.forEach((x,k)=>{if(x)r[x]=(c[k]??"").trim()});
   if(r.JOBCODE||r.EMPNO||r.NAMA)out.push(r);
  }
  return out;
 }
 return{parseMaster,parseAmanda};
})();