
(function(){
var KEY="madrasa-marklist-v1";
var sample=[["MUHAMMED ALFAS ET","M",[30,38,26,43,40,44,48]],["MUHAMMED MUSTHAFA V","M",[24,20,23,23,18,28,27]],["MUHAMMED HASHIM MT","M",[10,20,5,13,3,10,14]],["MUHAMMED SHADIN KP","M",[23,13,11,3,3,8,14]],["MUHAMMED ANSIL PT","M",[23,13,21,42,12,44,27]],["MUHAMMED SHAMMAS V","M",[34,47,35,48,25,37,42]],["MUHAMMED MUSTHAFA PK","M",[28,50,30,23,22,25,44]],["MUHAMMED RAJIH ALI KP","M",[37,46,35,23,35,18,38]],["MUHAMMED ASMIL M","M",[36,35,40,41,41,39,48]],["MUHAMMED SHAHABAS PK","M",[29,25,26,33,41,31,41]],["MUHAMMED MUSTHAFA V","M",[29,43,20,25,31,30,41]],["MUHAMMED ANAS V","M",[30,20,31,30,27,28,38]],["ASEEL KP","M",[41,47,42,42,44,44,47]],["RIYA FATHIMA","F",[40,47,40,47,42,36,50]],["AYISHA HABEEBA","F",[42,46,42,50,46,45,50]],["FATHIMA JISHANA","F",[40,47,42,48,47,41,49]],["FATHIMA JAZA","F",[31,33,33,40,37,22,45]],["SHAMLA","F",[46,47,43,42,38,36,35]],["FATHIMA NASMIN","F",[37,48,46,43,33,36,41]],["SHAHANA SIYA","F",[46,49,49,48,43,40,40]],["FATHIMA SHIFANA","F",[41,50,49,50,45,48,47]]];

var S={
meta:{reg:"9623",year:"2026",cls:"6",term:"പാദ വാർഷികം"},
cfg:{pass:18,green:45,yellow:40,max:50},
st:sample.map(function(r){
return{n:r[0],g:r[1],h:"",m:r[2].slice()};
})
};

var ALL={lists:[S],cur:0};

try{
var raw=localStorage.getItem(KEY);
if(raw){
var p=JSON.parse(raw);
if(p&&p.lists&&p.lists.length){
ALL=p;
ALL.cur=Math.max(0,Math.min(Number.isInteger(ALL.cur)?ALL.cur:0,ALL.lists.length-1));
}else if(p&&p.st&&p.cfg&&p.meta){
ALL={lists:[p],cur:0};
}
}
}catch(e){}

S=ALL.lists[ALL.cur];

function save(){
try{
localStorage.setItem(KEY,JSON.stringify(ALL,function(k,v){
return k==="els"?undefined:v;
}));
}catch(e){}
}

function $(id){return document.getElementById(id)}

function num(v){
if(v===""||v===null||v===undefined)return null;
var x=Number(v);
return isNaN(x)?null:x;
}

// PRINT CSS
var printStyle=document.createElement("style");

printStyle.id="madrasa-print-fix";

printStyle.textContent=`
@page{
size:A4 landscape;
margin:7mm;
}

@media print{

*{
-webkit-print-color-adjust:exact !important;
print-color-adjust:exact !important;
}

html,body{
width:100% !important;
margin:0 !important;
padding:0 !important;
background:white !important;
color:#111 !important;
}

body{
font-size:9px !important;
}

.wrap{
width:100% !important;
max-width:none !important;
margin:0 !important;
padding:0 !important;
}

.scroll{
overflow:visible !important;
width:100% !important;
}

table{
width:100% !important;
min-width:0 !important;
table-layout:fixed !important;
border-collapse:collapse !important;
font-size:7px !important;
}

th,td{
border:1px solid #aaa !important;
padding:3px 2px !important;
overflow:visible !important;
}

th{
background:#0f5c43 !important;
color:white !important;
white-space:normal !important;
font-size:7px !important;
}

th:nth-child(1),td:nth-child(1){
width:7mm !important;
}

th:nth-child(2),td:nth-child(2){
width:60mm !important;
}

th:nth-child(3),td:nth-child(3){
width:8mm !important;
}

th:nth-child(4),td:nth-child(4){
width:13mm !important;
}

th:nth-child(n+5):nth-child(-n+11),
td:nth-child(n+5):nth-child(-n+11){
width:17mm !important;
}

th:nth-child(12),td:nth-child(12){
width:13mm !important;
}

th:nth-child(13),td:nth-child(13){
width:22mm !important;
}

th:nth-child(14),td:nth-child(14){
width:10mm !important;
}

th:nth-child(15),td:nth-child(15){
display:none !important;
}

/* STUDENT NAME */
td.nm{
width:60mm !important;
min-width:60mm !important;
white-space:normal !important;
text-align:left !important;
}

td.nm input{
display:block !important;
width:100% !important;
min-width:0 !important;
max-width:100% !important;
box-sizing:border-box !important;
font-size:8px !important;
font-weight:bold !important;
text-align:left !important;
white-space:normal !important;
overflow:visible !important;
text-overflow:clip !important;
color:#111 !important;
border:0 !important;
background:transparent !important;
}

/* MARK INPUTS */
td input{
width:100% !important;
min-width:0 !important;
max-width:100% !important;
box-sizing:border-box !important;
font-size:7px !important;
text-align:center !important;
border:0 !important;
}

/* FAILED MARKS RED */
input.m.r,
td input.m.r{
color:#c00000 !important;
background:#ffd6d6 !important;
font-weight:900 !important;
border:1px solid #e00000 !important;
}

/* PASSED HIGH MARKS GREEN */
input.m.g,
td input.m.g{
color:#146c37 !important;
background:#d9f2df !important;
font-weight:bold !important;
}

/* YELLOW MARKS */
input.m.y,
td input.m.y{
color:#765600 !important;
background:#fff0b3 !important;
font-weight:bold !important;
}

/* RESULT */
.tag.FAIL{
color:#c00000 !important;
background:#ffd6d6 !important;
font-weight:bold !important;
}

.tag.PASS{
color:#087a37 !important;
font-weight:bold !important;
}

tr{
break-inside:avoid !important;
page-break-inside:avoid !important;
}

thead{
display:table-header-group !important;
}

button,.x{
display:none !important;
}

}
`;

document.head.appendChild(printStyle);

// META + SETTINGS
var metaMap={reg:"reg",year:"year",cls:"cls",term:"term"};

Object.keys(metaMap).forEach(function(k){
var el=$(k);
el.value=S.meta[k];
el.addEventListener("input",function(){
S.meta[k]=el.value;
renderTabs();
save();
});
});

["pass","green","yellow","max"].forEach(function(k){
var el=$(k);
el.value=S.cfg[k];
el.addEventListener("input",function(){
var v=num(el.value);
if(v!==null){
S.cfg[k]=v;
recalc();
save();
}
});
});

var tb=$("rows");

function mk(tag,cls,txt){
var e=document.createElement(tag);
if(cls)e.className=cls;
if(txt!==undefined)e.textContent=txt;
return e;
}

function buildRows(){

tb.innerHTML="";

S.st.forEach(function(s,i){

var tr=mk("tr");
s.els={};

tr.appendChild(mk("td","",String(i+1)));

var tdn=mk("td","nm");
var ni=mk("input");
ni.value=s.n;
ni.placeholder="Student name";

ni.addEventListener("input",function(){
s.n=ni.value;
save();
});

tdn.appendChild(ni);
tr.appendChild(tdn);

var tdg=mk("td","gn");
var gi=mk("input");
gi.value=s.g;
gi.maxLength=1;
gi.style.textAlign="center";
gi.title="M or F";

gi.addEventListener("input",function(){
gi.value=gi.value.toUpperCase();
s.g=gi.value;
recalc();
save();
});

tdg.appendChild(gi);
tr.appendChild(tdg);

var tdh=mk("td","hj");
var hi=mk("input");
hi.value=s.h;
hi.style.textAlign="center";

hi.addEventListener("input",function(){
s.h=hi.value;
save();
});

tdh.appendChild(hi);
tr.appendChild(tdh);

s.els.m=[];

for(var j=0;j<7;j++){
(function(j){

var td=mk("td");
var inp=mk("input","m");

inp.type="number";
inp.inputMode="decimal";
inp.min=0;
inp.value=s.m[j]===""||s.m[j]==null?"":s.m[j];

inp.addEventListener("input",function(){
s.m[j]=inp.value;
recalc();
save();
});

td.appendChild(inp);
tr.appendChild(td);
s.els.m.push(inp);

})(j);
}

s.els.t=mk("td","tot");
s.els.r=mk("td");
s.els.k=mk("td","rk");

tr.appendChild(s.els.t);
tr.appendChild(s.els.r);
tr.appendChild(s.els.k);

var tdx=mk("td");
var x=mk("button","x","×");

x.title="Remove student";

x.addEventListener("click",function(){
S.st.splice(i,1);
buildRows();
recalc();
save();
});

tdx.appendChild(x);
tr.appendChild(tdx);

tb.appendChild(tr);

});

recalc();
}

function recalc(){

var c=S.cfg,tots=[];

S.st.forEach(function(s){

var vals=s.m.map(num);
var have=vals.filter(function(v){return v!==null});

s.total=have.length?have.reduce(function(a,b){return a+b},0):null;

s.rem=!have.length?"":have.length<7?"INCOMPLETE":
Math.min.apply(null,have)<c.pass?"FAIL":"PASS";

if(s.total!==null)tots.push(s.total);

vals.forEach(function(v,j){

var e=s.els.m[j],k="m";

if(v!==null){
if(v<c.pass)k+=" r";
else if(v>=c.green)k+=" g";
else if(v>=c.yellow)k+=" y";
}

e.className=k;
e.max=c.max;

});

});

S.st.forEach(function(s){

s.els.t.textContent=s.total===null?"":s.total;
s.els.r.innerHTML="";

if(s.rem){
s.els.r.appendChild(mk("span","tag "+s.rem,s.rem));
}

s.els.k.textContent=s.total===null?"":1+tots.filter(function(t){
return t>s.total;
}).length;

});

stats();
}

function stats(){

function cnt(g){

var a=S.st.filter(function(s){
return s.rem&&(!g||s.g===g);
});

var p=a.filter(function(s){
return s.rem==="PASS";
}).length;

return{
n:a.length,
p:p,
f:a.filter(function(s){return s.rem==="FAIL"}).length
};

}

var b=cnt("M"),gl=cnt("F"),t=cnt(null);

function pc(x){
return x.n?(x.p/x.n*100).toFixed(2)+"%":"–";
}

var items=[
["Students",t.n,"Boys "+b.n+" · Girls "+gl.n,""],
["Passed",t.p,"Boys "+b.p+" · Girls "+gl.p,""],
["Failed",t.f,"Need attention",t.f?"bad":""],
["Pass %",pc(t),"Boys "+pc(b)+" · Girls "+pc(gl),""]
];

var h=$("stats");
h.innerHTML="";

items.forEach(function(i){
var d=mk("div","stat "+i[3]);
d.appendChild(mk("b","",String(i[1])));
d.appendChild(mk("strong","",i[0]));
d.appendChild(mk("br"));
d.appendChild(mk("span","",i[2]));
h.appendChild(d);
});

}

// PRINT BUTTON
$("print").addEventListener("click",function(){
window.print();
});

// ADD STUDENT
$("add").addEventListener("click",function(){

S.st.push({
n:"",
g:"",
h:"",
m:["","","","","","",""]
});

buildRows();
save();

var inputs=tb.querySelectorAll("tr:last-child td.nm input");

if(inputs[0])inputs[0].focus();

});

// CLEAR MARKS
var armed=false,cb=$("clear");

cb.addEventListener("click",function(){

if(!armed){
armed=true;
cb.textContent="Tap again to confirm";

setTimeout(function(){
armed=false;
cb.textContent="Clear all marks";
},3000);

return;
}

armed=false;
cb.textContent="Clear all marks";

S.st.forEach(function(s){
s.m=["","","","","","",""];
});

buildRows();
save();

});

function blank(){
return["","","","","","",""];
}

function loadForm(){

Object.keys(metaMap).forEach(function(k){
$(k).value=S.meta[k];
});

["pass","green","yellow","max"].forEach(function(k){
$(k).value=S.cfg[k];
});

}

function renderTabs(){

var t=$("tabs");
t.innerHTML="";

ALL.lists.forEach(function(l,i){

var b=mk(
"button",
"tab"+(i===ALL.cur?" on":""),
"Class "+(l.meta.cls||"?")+
(l.meta.term?" · "+l.meta.term:"")+
(l.meta.year?" · "+l.meta.year:"")
);

b.addEventListener("click",function(){
go(i);
});

t.appendChild(b);

});

}

function go(i){

ALL.cur=i;
S=ALL.lists[i];

loadForm();
renderTabs();
buildRows();
save();

}

function fresh(students){

var m=S.meta,c=S.cfg;

ALL.lists.push({
meta:{
reg:m.reg,
year:m.year,
cls:"",
term:m.term
},
cfg:{
pass:c.pass,
green:c.green,
yellow:c.yellow,
max:c.max
},
st:students
});

go(ALL.lists.length-1);
$("cls").focus();

}

$("newc").addEventListener("click",function(){

fresh([{
n:"",
g:"",
h:"",
m:blank()
}]);

});

$("copyc").addEventListener("click",function(){

fresh(S.st.map(function(s){
return{
n:s.n,
g:s.g,
h:"",
m:blank()
};
}));

});

// DELETE CLASS
var darm=false,db=$("delc");

db.addEventListener("click",function(){

if(ALL.lists.length<2){

db.textContent="Keep at least one class";

setTimeout(function(){
db.textContent="Delete this class";
},2500);

return;

}

if(!darm){

darm=true;
db.textContent="Tap again to delete";

setTimeout(function(){
darm=false;
db.textContent="Delete this class";
},3000);

return;

}

darm=false;
db.textContent="Delete this class";

ALL.lists.splice(ALL.cur,1);

go(Math.min(ALL.cur,ALL.lists.length-1));

});

renderTabs();
buildRows();

})();
