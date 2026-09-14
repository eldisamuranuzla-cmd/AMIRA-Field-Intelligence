window.AMIRAParser=(()=>{
 function split(line){const o=[];let c="",q=false;for(let i=0;i<line.length;i++){let x=line[i];if(x=='"'){if(q&&line[i+1]=='"'){c+='"';i++}else q=!q}else if(x==','&&!q){o.push(c);c=""}else c+=x}o.push(c);return o}
 function lines(t){return t.replace(/^\uFEFF/,"").split(/\r?\n/).filter(x=>x.trim()).map(split)}
 function parseMaster(t){const ls=lines(t),data={},headers={};let s=null;for(const c of ls){let f=(c[0]||"").trim();if(f.startsWith("[")&&f.endsWith("]")){s=f.slice(1,-1);data[s]=[];continue}if(!s)continue;if(!headers[s]){headers[s]=c.map(x=>x.trim());continue}let r={};headers[s].forEach((h,i)=>r[h]=(c[i]??"").trim());data[s].push(r)}return{sections:data,headers}}
 function parseAmanda(t){const ls=lines(t);let i=ls.findIndex(r=>r.some(c=>String(c).trim()=="EMPNO"));if(i<0)i=ls.findIndex(r=>r.some(c=>String(c).trim()=="JOBCODE"));if(i<0)return[];let h=ls[i].map(x=>x.trim()),out=[];for(let j=i+1;j<ls.length;j++){let c=ls[j],r={};h.forEach((x,k)=>r[x]=(c[k]??"").trim());if(r.JOBCODE||r.EMPNO||r.NAMA)out.push(r)}return out}
 return{parseMaster,parseAmanda}
})();