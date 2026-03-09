let selectedDesign=null;
const selector=document.getElementById("designSelector");
designs.forEach(d=>{
const card=document.createElement("div");
card.className="designCard";
card.innerText=d;
card.onclick=()=>{
selectedDesign=d;
document.querySelectorAll(".designCard")
.forEach(c=>c.classList.remove("selected"));
card.classList.add("selected");
};
selector.appendChild(card);
});
function addExchange(){
const name=document.getElementById("nameInput").value;
if(!name||!selectedDesign)return;
const ref=db.ref("exchanges").push();
ref.set({
name:name,
design:selectedDesign,
completed:false,
time:Date.now()
});
document.getElementById("nameInput").value="";
}
db.ref("exchanges").on("value",snap=>{
const data=snap.val()||{};
renderList(data);
});
function renderList(data){
const list=document.getElementById("exchangeList");
list.innerHTML="";
const counts={};
Object.entries(data).forEach(([id,item])=>{
counts[item.design]=(counts[item.design]||0)+1;
const li=document.createElement("li");
li.className="exchangeItem";
if(item.completed)li.classList.add("completed");
li.innerHTML=`
${item.name} — ${item.design}
<button onclick="complete('${id}')">✓</button>
<button onclick="del('${id}')">🗑</button>
`;
list.appendChild(li);
});
updateDashboard(counts);
}
function complete(id){
db.ref("exchanges/"+id).update({
completed:true
});
}
function del(id){
db.ref("exchanges/"+id).remove();
}
function updateDashboard(counts){
const top=document.getElementById("topDesigns");
top.innerHTML="";
const sorted=Object.entries(counts)
.sort((a,b)=>b[1]-a[1])
.slice(0,5);
sorted.forEach(([design,count])=>{
const li=document.createElement("li");
li.innerText=`${design} (${count})`;
top.appendChild(li);
});
}
