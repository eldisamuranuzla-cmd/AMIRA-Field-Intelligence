window.AMIRA={
 state:{master:null,amanda:[],jobs:new Map(),materials:new Map(),rows:[],stats:null},
 workstreams:["CPT","WDC","WDM","CWC"],
 classify(code,name=""){
  const n=String(name).toUpperCase(),c=String(code);
  if(/TPH|PATH|INFRASTRUKTUR|RORAK|CEKDAM|PENGALIRAN|FLATBAT|JALAN/.test(n)||["220401","220402","220404","220408","220501","220502","220503","220504","230601","230701","230801","230901"].includes(c))return"WDC";
  if(/CIRCLE|CPT/.test(n)||["220601","220602"].includes(c))return"CPT";
  if(/WEEDING|WIPPING|BABAT|DONGKEL|NEPROLEPHIS|LALANG|ANAK KAYU/.test(n)||["230101","230102","230103","230201","230202","230301"].includes(c))return"WDM";
  if(/PUPUK|PEMUPUKAN|NPK|PRUNING|SISIP|INFUS/.test(n)||["230501","230502","231001","240101"].includes(c))return"CWC";
  return"OTHER";
 },
 num(v){const x=parseFloat(String(v??"").replace(/,/g,""));return Number.isFinite(x)?x:0}
};