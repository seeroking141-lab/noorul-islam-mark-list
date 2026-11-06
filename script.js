(function(){
var KEY="madrasa-marklist-v1";
var sample=[["MUHAMMED ALFAS ET","M",[30,38,26,43,40,44,48]],["MUHAMMED MUSTHAFA V","M",[24,20,23,23,18,28,27]],["MUHAMMED HASHIM MT","M",[10,20,5,13,3,10,14]],["MUHAMMED SHADIN KP","M",[23,13,11,3,3,8,14]],["MUHAMMED ANSIL PT","M",[23,13,21,42,12,44,27]],["MUHAMMED SHAMMAS V","M",[34,47,35,48,25,37,42]],["MUHAMMED MUSTHAFA PK","M",[28,50,30,23,22,25,44]],["MUHAMMED RAJIH ALI KP","M",[37,46,35,23,35,18,38]],["MUHAMMED ASMIL M","M",[36,35,40,41,41,39,48]],["MUHAMMED SHAHABAS PK","M",[29,25,26,33,41,31,41]],["MUHAMMED MUSTHAFA V","M",[29,43,20,25,31,30,41]],["MUHAMMED ANAS V","M",[30,20,31,30,27,28,38]],["ASEEL KP","M",[41,47,42,42,44,44,47]],["RIYA FATHIMA","F",[40,47,40,47,42,36,50]],["AYISHA HABEEBA","F",[42,46,42,50,46,45,50]],["FATHIMA JISHANA","F",[40,47,42,48,47,41,49]],["FATHIMA JAZA","F",[31,33,33,40,37,22,45]],["SHAMLA","F",[46,47,43,42,38,36,35]],["FATHIMA NASMIN","F",[37,48,46,43,33,36,41]],["SHAHANA SIYA","F",[46,49,49,48,43,40,40]],["FATHIMA SHIFANA","F",[41,50,49,50,45,48,47]]];
var S={meta:{reg:"9623",year:"2026",cls:"6",term:"പാദ വാർഷികം"},cfg:{pass:18,green:45,yellow:40,max:50},
 st:sample.map(function(r){return{n:r[0],g:r[1],h:"",m:r[2].slice()}})};
var ALL={lists:[S],cur:0};
try{var raw=localStorage.getItem(KEY);if(raw){var p=JSON.parse(raw);if(p&&p.lists&&p.lists.length){ALL=p;ALL.cur=Math.max(0,Math.min(Number.isInteger(ALL.cur)?ALL.cur:0,ALL.lists.length-1))}else if(p&&p.st&&p.cfg&&p.meta){ALL={lists:[p],cur:0}}}}catch(e){}
S=ALL.lists[ALL.cur];
function save(){try{localStorage.setItem(KEY,JSON.stringify(ALL,function(k,v){return k==="els"?undefined:v}))}catch(e){}}
function $(id){return document.getElementById(id)}
function num(v){if(v===""||v===null||v===undefined)return null;var x=Number(v);return isNaN(x)?null:x}

// meta + settings
var metaMap={reg:"reg",year:"year",cls:"cls",term:"term"};
Object.keys(metaMap).forEach(function(k){var el=$(k);el.value=S.meta[k];el.addEventListener("input",function(){S.meta[k]=el.value;renderTabs();save()})});
["pass","green","yellow","max"].forEach(function(k){var el=$(k);el.value=S.cfg[k];el.addEventListener("input",function(){var v=num(el.value);if(v!==null){S.cfg[k]=v;recalc();save()}})});

var tb=$("rows");
function mk(tag,cls,txt){var e=document.createElement(tag);if(cls)e.className=cls;if(txt!==undefined)e.textContent=txt;return e}

function buildRows(){
  tb.innerHTML="";
  S.st.forEach(function(s,i){
    var tr=mk("tr");s.els={};
    tr.appendChild(mk("td","",String(i+1)));
    var tdn=mk("td","nm"),ni=mk("input");ni.value=s.n;ni.placeholder="Student name";
    ni.addEventListener("input",function(){s.n=ni.value;save()});tdn.appendChild(ni);tr.appendChild(tdn);
    var tdg=mk("td","gn"),gi=mk("input");gi.value=s.g;gi.maxLength=1;gi.style.textAlign="center";gi.title="M or F";
    gi.addEventListener("input",function(){gi.value=gi.value.toUpperCase();s.g=gi.value;recalc();save()});tdg.appendChild(gi);tr.appendChild(tdg);
    var tdh=mk("td","hj"),hi=mk("input");hi.value=s.h;hi.style.textAlign="center";
    hi.addEventListener("input",function(){s.h=hi.value;save()});tdh.appendChild(hi);tr.appendChild(tdh);
    s.els.m=[];
    for(var j=0;j<7;j++){(function(j){
      var td=mk("td"),inp=mk("input","m");inp.type="number";inp.inputMode="decimal";inp.min=0;inp.value=s.m[j]===""||s.m[j]==null?"":s.m[j];
      inp.addEventListener("input",function(){s.m[j]=inp.value;recalc();save()});
      td.appendChild(inp);tr.appendChild(td);s.els.m.push(inp)})(j)}
    s.els.t=mk("td","tot");s.els.r=mk("td");s.els.k=mk("td","rk");
    tr.appendChild(s.els.t);tr.appendChild(s.els.r);tr.appendChild(s.els.k);
    var tdx=mk("td"),x=mk("button","x","×");x.title="Remove student";
    x.addEventListener("click",function(){S.st.splice(i,1);buildRows();recalc();save()});
    tdx.appendChild(x);tr.appendChild(tdx);tb.appendChild(tr);
  });
  recalc();
}

function recalc(){
  var c=S.cfg,tots=[];
  S.st.forEach(function(s){
    var vals=s.m.map(num),have=vals.filter(function(v){return v!==null});
    s.total=have.length?have.reduce(function(a,b){return a+b},0):null;
    s.rem=!have.length?"":have.length<7?"INCOMPLETE":Math.min.apply(null,have)<c.pass?"FAIL":"PASS";
    if(s.total!==null)tots.push(s.total);
    vals.forEach(function(v,j){var e=s.els.m[j],k="m";
      if(v!==null){if(v<c.pass)k+=" r";else if(v>=c.green)k+=" g";else if(v>=c.yellow)k+=" y"}
      e.className=k;e.max=c.max});
  });
  S.st.forEach(function(s){
    s.els.t.textContent=s.total===null?"":s.total;
    s.els.r.innerHTML="";
    if(s.rem){s.els.r.appendChild(mk("span","tag "+s.rem,s.rem))}
    s.els.k.textContent=s.total===null?"":1+tots.filter(function(t){return t>s.total}).length;
  });
  stats();
}

function stats(){
  function cnt(g){var a=S.st.filter(function(s){return s.rem&&(!g||s.g===g)});
    var p=a.filter(function(s){return s.rem==="PASS"}).length;return{n:a.length,p:p,f:a.filter(function(s){return s.rem==="FAIL"}).length}}
  var b=cnt("M"),gl=cnt("F"),t=cnt(null);
  function pc(x){return x.n?(x.p/x.n*100).toFixed(2)+"%":"–"}
  var items=[["Students",t.n,"Boys "+b.n+" · Girls "+gl.n,""],["Passed",t.p,"Boys "+b.p+" · Girls "+gl.p,""],["Failed",t.f,"Need attention",t.f?"bad":""],["Pass %",pc(t),"Boys "+pc(b)+" · Girls "+pc(gl),""]];
  var h=$("stats");h.innerHTML="";
  items.forEach(function(i){var d=mk("div","stat "+i[3]);d.appendChild(mk("b","",String(i[1])));d.appendChild(mk("strong","",i[0]));d.appendChild(mk("br"));d.appendChild(mk("span","",i[2]));h.appendChild(d)});
}

$("print").addEventListener("click",function(){window.print()});
$("add").addEventListener("click",function(){S.st.push({n:"",g:"",h:"",m:["","","","","","",""]});buildRows();save();
  var inputs=tb.querySelectorAll("tr:last-child td.nm input");if(inputs[0])inputs[0].focus()});
var armed=false,cb=$("clear");
cb.addEventListener("click",function(){
  if(!armed){armed=true;cb.textContent="Tap again to confirm";setTimeout(function(){armed=false;cb.textContent="Clear all marks"},3000);return}
  armed=false;cb.textContent="Clear all marks";S.st.forEach(function(s){s.m=["","","","","","",""]});buildRows();save();
});
function blank(){return["","","","","","",""]}
function loadForm(){Object.keys(metaMap).forEach(function(k){$(k).value=S.meta[k]});["pass","green","yellow","max"].forEach(function(k){$(k).value=S.cfg[k]})}
function renderTabs(){var t=$("tabs");t.innerHTML="";ALL.lists.forEach(function(l,i){var b=mk("button","tab"+(i===ALL.cur?" on":""),"Class "+(l.meta.cls||"?")+(l.meta.term?" · "+l.meta.term:"")+(l.meta.year?" · "+l.meta.year:""));b.addEventListener("click",function(){go(i)});t.appendChild(b)})}
function go(i){ALL.cur=i;S=ALL.lists[i];loadForm();renderTabs();buildRows();save()}
function fresh(students){var m=S.meta,c=S.cfg;ALL.lists.push({meta:{reg:m.reg,year:m.year,cls:"",term:m.term},cfg:{pass:c.pass,green:c.green,yellow:c.yellow,max:c.max},st:students});go(ALL.lists.length-1);$("cls").focus()}
$("newc").addEventListener("click",function(){fresh([{n:"",g:"",h:"",m:blank()}])});
$("copyc").addEventListener("click",function(){fresh(S.st.map(function(s){return{n:s.n,g:s.g,h:"",m:blank()}}))});
var darm=false,db=$("delc");
db.addEventListener("click",function(){
  if(ALL.lists.length<2){db.textContent="Keep at least one class";setTimeout(function(){db.textContent="Delete this class"},2500);return}
  if(!darm){darm=true;db.textContent="Tap again to delete";setTimeout(function(){darm=false;db.textContent="Delete this class"},3000);return}
  darm=false;db.textContent="Delete this class";ALL.lists.splice(ALL.cur,1);go(Math.min(ALL.cur,ALL.lists.length-1));
});
renderTabs();buildRows();
})();
