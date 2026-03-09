const DESIGNS=[

"风将起",

"你在我喜欢的世界里",

"像晴天像雨天",

"倒影里的星星",

"在惊涛骇浪里",

"黑梦",

"共赴",

"情骨",

"去见你",

"耿"

]

let stock={}

let records=[]

function init(){

loadData()

DESIGNS.forEach(d=>{

if(!stock[d]) stock[d]={total:20,reserved:0,done:0}

})

populateDropdown()

renderAll()

}

function populateDropdown(){

let select=document.getElementById("design")

select.innerHTML=""

DESIGNS.forEach(d=>{

let remain=stock[d].total-stock[d].done

let option=document.createElement("option")

option.value=d

option.text=d+" (剩余 "+remain+")"

select.appendChild(option)

})

}

function addRecord(){

let name=document.getElementById("name").value.trim()

let design=document.getElementById("design").value

let receive=document.getElementById("receive").value.trim()

let date=document.getElementById("date").value

if(name==""){

alert("Enter name")

return

}

let s=stock[design]

if(s.reserved>=20){

alert("This design fully reserved")

return

}

records.push({date,name,design,receive,done:false})

s.reserved++

saveData()

renderAll()

}

function toggleDone(i){

let r=records[i]

let s=stock[r.design]

if(!r.done){

if(s.done>=20){

alert("No stock left")

return

}

s.done++

r.done=true

}else{

s.done--

r.done=false

}

saveData()

renderAll()

}

function editRecord(i){

let r=records[i]

let newName=prompt("Edit Name",r.name)

if(!newName) return

let newReceive=prompt("Edit Receive",r.receive)

r.name=newName

r.receive=newReceive

saveData()

renderRecords()

}

function deleteRecord(i){

if(!confirm("Delete this record?")) return

let r=records[i]

let s=stock[r.design]

s.reserved--

if(r.done) s.done--

records.splice(i,1)

saveData()

renderAll()

}

function renderDesigns(){

let grid=document.getElementById("designGrid")

grid.innerHTML=""

let sorted=[...DESIGNS].sort((a,b)=>stock[b].done-stock[a].done)

sorted.forEach(d=>{

let s=stock[d]

let remain=s.total-s.done

let warning=remain<5?"lowStock":""

let div=document.createElement("div")

div.className="designCard"

div.onclick=()=>selectDesign(d)

div.innerHTML=`
<img src="images/${d}.jpg" onerror="this.src='https://via.placeholder.com/100'">
<div>${d}</div>
<div class="counter ${warning}">

剩余: ${remain}<br>

Reserved: ${s.reserved}<br>

Done: ${s.done}
</div>

`

grid.appendChild(div)

})

}

function selectDesign(name){

document.getElementById("design").value=name

window.scrollTo({

top:0,

behavior:"smooth"

})

}

function renderRecords(){

let tbody=document.getElementById("records")

tbody.innerHTML=""

let search=document.getElementById("search").value.toLowerCase()

records.forEach((r,i)=>{

if(search && !r.name.toLowerCase().includes(search)) return

let checked=r.done?"checked":""

let row=`
<tr class="${r.done ? 'completed' : ''}">
<td>${r.date}</td>
<td>${r.name}</td>
<td>${r.design}</td>
<td>${r.receive}</td>
<td><input type="checkbox" ${checked} onclick="toggleDone(${i})"></td>
<td><button onclick="editRecord(${i})">Edit</button></td>
<td><button onclick="deleteRecord(${i})">Delete</button></td>
</tr>

`

tbody.innerHTML+=row

})

}

function renderTop(){

let top=[...DESIGNS]

.sort((a,b)=>stock[b].done-stock[a].done)

.slice(0,5)

let html=""

top.forEach((d,i)=>{

html+=`
<div>${i+1}. ${d} — ${stock[d].done} exchanged</div>

`

})

document.getElementById("topDesigns").innerHTML=html

}

function renderAll(){

populateDropdown()

renderDesigns()

renderRecords()

renderTop()

}

function saveData(){

localStorage.setItem("gift_records",JSON.stringify(records))

localStorage.setItem("gift_stock",JSON.stringify(stock))

}

function loadData(){

let r=localStorage.getItem("gift_records")

let s=localStorage.getItem("gift_stock")

if(r) records=JSON.parse(r)

if(s) stock=JSON.parse(s)

}

function exportCSV(){

let csv="Date,Name,Design,Receive,Done\n"

records.forEach(r=>{

csv+=`${r.date},${r.name},${r.design},${r.receive},${r.done}\n`

})

let blob=new Blob([csv],{type:"text/csv"})

let url=URL.createObjectURL(blob)

let a=document.createElement("a")

a.href=url

a.download="gift_exchange.csv"

a.click()

}

init()
 
 
// app.js - Updated with Firebase Realtime Database

const DESIGNS = [

  "风将起",

  "你在我喜欢的世界里",

  "像晴天像雨天",

  "倒影里的星星",

  "在惊涛骇浪里",

  "黑梦",

  "共赴",

  "情骨",

  "去见你",

  "耿"

];

let stock = {};

let records = [];

// Initialize Firebase

const firebaseConfig = {

  apiKey: "YOUR_API_KEY",

  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",

  databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",

  projectId: "YOUR_PROJECT_ID",

  storageBucket: "YOUR_PROJECT_ID.appspot.com",

  messagingSenderId: "YOUR_SENDER_ID",

  appId: "YOUR_APP_ID"

};

firebase.initializeApp(firebaseConfig);

const db = firebase.database();

function init() {

  // Initialize stock

  DESIGNS.forEach(d => {

    if (!stock[d]) stock[d] = { total: 20, reserved: 0, done: 0 };

  });

  renderAll();

  listenFirebase(); // start listening for live updates

}

function populateDropdown() {

  let select = document.getElementById("design");

  select.innerHTML = "";

  DESIGNS.forEach(d => {

    let remain = stock[d].total - stock[d].done;

    let option = document.createElement("option");

    option.value = d;

    option.text = `${d} (剩余 ${remain})`;

    select.appendChild(option);

  });

}

function addRecord() {

  let name = document.getElementById("name").value.trim();

  let design = document.getElementById("design").value;

  let receive = document.getElementById("receive").value.trim();

  let date = document.getElementById("date").value;

  if (!name) {

    alert("Enter name");

    return;

  }

  let s = stock[design];

  if (s.reserved >= 20) {

    alert("This design fully reserved");

    return;

  }

  const newRecord = { date, name, design, receive, done: false };

  // Push to Firebase

  db.ref("records").push(newRecord);

  s.reserved++;

  saveData(); // localStorage fallback

  renderAll();

}

function toggleDone(i) {

  let r = records[i];

  let s = stock[r.design];

  if (!r.done) {

    if (s.done >= 20) {

      alert("No stock left");

      return;

    }

    s.done++;

    r.done = true;

  } else {

    s.done--;

    r.done = false;

  }

  // Update Firebase

  db.ref(`records/${r.firebaseId}`).update({ done: r.done });

  saveData();

  renderAll();

}

function editRecord(i) {

  let r = records[i];

  let newName = prompt("Edit Name", r.name);

  if (!newName) return;

  let newReceive = prompt("Edit Receive", r.receive);

  r.name = newName;

  r.receive = newReceive;

  // Update Firebase

  db.ref(`records/${r.firebaseId}`).update({ name: newName, receive: newReceive });

  saveData();

  renderRecords();

}

function deleteRecord(i) {

  if (!confirm("Delete this record?")) return;

  let r = records[i];

  let s = stock[r.design];

  s.reserved--;

  if (r.done) s.done--;

  // Remove from Firebase

  db.ref(`records/${r.firebaseId}`).remove();

  records.splice(i, 1);

  saveData();

  renderAll();

}

function renderDesigns() {

  let grid = document.getElementById("designGrid");

  grid.innerHTML = "";

  let sorted = [...DESIGNS].sort((a, b) => stock[b].done - stock[a].done);

  sorted.forEach(d => {

    let s = stock[d];

    let remain = s.total - s.done;

    let warning = remain < 5 ? "lowStock" : "";

    let div = document.createElement("div");

    div.className = "designCard";

    div.onclick = () => selectDesign(d);

    div.innerHTML = `
<img src="images/${d}.jpg" onerror="this.src='https://via.placeholder.com/100'">
<div>${d}</div>
<div class="counter ${warning}">

        剩余: ${remain}<br>

        Reserved: ${s.reserved}<br>

        Done: ${s.done}
</div>

    `;

    grid.appendChild(div);

  });

}

function selectDesign(name) {

  document.getElementById("design").value = name;

  window.scrollTo({ top: 0, behavior: "smooth" });

}

function renderRecords() {

  let tbody = document.getElementById("records");

  tbody.innerHTML = "";

  let search = document.getElementById("search").value.toLowerCase();

  records.forEach((r, i) => {

    if (search && !r.name.toLowerCase().includes(search)) return;

    let checked = r.done ? "checked" : "";

    let row = `
<tr class="${r.done ? 'completed' : ''}">
<td>${r.date}</td>
<td>${r.name}</td>
<td>${r.design}</td>
<td>${r.receive}</td>
<td><input type="checkbox" ${checked} onclick="toggleDone(${i})"></td>
<td><button onclick="editRecord(${i})">Edit</button></td>
<td><button onclick="deleteRecord(${i})">Delete</button></td>
</tr>

    `;

    tbody.innerHTML += row;

  });

}

function renderTop() {

  let top = [...DESIGNS]

    .sort((a, b) => stock[b].done - stock[a].done)

    .slice(0, 5);

  let html = "";

  top.forEach((d, i) => {

    html += `<div>${i + 1}. ${d} — ${stock[d].done} exchanged</div>`;

  });

  document.getElementById("topDesigns").innerHTML = html;

}

function renderAll() {

  populateDropdown();

  renderDesigns();

  renderRecords();

  renderTop();

}

function saveData() {

  localStorage.setItem("gift_records", JSON.stringify(records));

  localStorage.setItem("gift_stock", JSON.stringify(stock));

}

function loadData() {

  let r = localStorage.getItem("gift_records");

  let s = localStorage.getItem("gift_stock");

  if (r) records = JSON.parse(r);

  if (s) stock = JSON.parse(s);

}

// Export CSV

function exportCSV() {

  let csv = "Date,Name,Design,Receive,Done\n";

  records.forEach(r => {

    csv += `${r.date},${r.name},${r.design},${r.receive},${r.done}\n`;

  });

  let blob = new Blob([csv], { type: "text/csv" });

  let url = URL.createObjectURL(blob);

  let a = document.createElement("a");

  a.href = url;

  a.download = "gift_exchange.csv";

  a.click();

}

// Listen for Firebase updates

function listenFirebase() {

  db.ref("records").on("value", snap => {

    let data = snap.val() || {};

    records = [];

    stock = {};

    DESIGNS.forEach(d => {

      stock[d] = { total: 20, reserved: 0, done: 0 };

    });

    Object.entries(data).forEach(([id, r]) => {

      r.firebaseId = id;

      records.push(r);

      stock[r.design].reserved++;

      if (r.done) stock[r.design].done++;

    });

    renderAll();

    saveData();

  });

}

// Initialize

loadData();

init();
 
