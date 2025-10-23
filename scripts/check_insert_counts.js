const fs=require('fs');
const s=fs.readFileSync('d:/Mesa/formulario-beneficiarios/scripts/003_insert_sample_beneficiarios.sql','utf8');
const m=s.match(/INSERT INTO\s+beneficiarios\s*\((.*?)\)\s*VALUES/si);
if(!m){console.log('no header');process.exit();}
const cols=m[1].split(/\n/).map(l=>l.trim().replace(/,$/,'')).filter(Boolean);
console.log('cols',cols.length);
const vals=s.slice(m.index+m[0].length);
let tuples=[];let buf='';let depth=0;let in_s=false;let in_d=false;let esc=false;
for(let i=0;i<vals.length;i++){
  const ch=vals[i];
  buf+=ch;
  if(esc){esc=false;continue}
  if(ch==='\\'){esc=true;continue}
  if(ch==="'" && !in_d){in_s=!in_s;continue}
  if(ch==='"' && !in_s){in_d=!in_d;continue}
  if(!in_s && !in_d){
    if(ch==='('){depth++}
    else if(ch===')'){depth--; if(depth===0){
      let t = buf.trim();
      if(t.startsWith(',')) t = t.slice(1).trim();
      tuples.push(t);
      buf=''
    }}
  }
}
console.log('tuples',tuples.length);
if(tuples.length>1){
  console.log('--- raw tuple 2 start ---');
  console.log(tuples[1]);
  console.log('--- raw tuple 2 end ---');
}
function countItems(t){let t2=t.trim(); if(t2.startsWith('(')&&t2.endsWith(')')) t2=t2.slice(1,-1); let items=[]; let cur=''; let in_s=false; let in_d=false; let esc=false; let depth=0; for(let i=0;i<t2.length;i++){const ch=t2[i]; if(esc){cur+=ch; esc=false; continue} if(ch==='\\'){cur+=ch; esc=true; continue} if(ch==="'" && !in_d){ in_s=!in_s; cur+=ch; continue } if(ch==='"' && !in_s){ in_d=!in_d; cur+=ch; continue } if(!in_s && !in_d){ if(ch==='('){ depth++; cur+=ch; continue } if(ch===')'){ depth--; cur+=ch; continue } if(ch===',' && depth===0){ items.push(cur.trim()); cur=''; continue } } cur+=ch } if(cur.trim()!=='') items.push(cur.trim()); return items }
for(let i=0;i<tuples.length;i++){
  const items=countItems(tuples[i]);
  if(items.length!==cols.length){
    console.log('Mismatch in tuple',i+1,'items',items.length,'cols',cols.length);
    for(let j=0;j<Math.min(30,items.length);j++) console.log(j+1,items[j].slice(0,120));
    process.exit();
  }
}
console.log('All tuples match column count');
