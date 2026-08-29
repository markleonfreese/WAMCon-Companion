const TZ = "Australia/Perth";
const STORE_KEY = "wamcon-companion-v1";
let sessions = [];
let state = JSON.parse(localStorage.getItem(STORE_KEY) || '{"checkins":{},"notes":{},"planned":{}}');
let selectedDay = "today";
let filter = "all";
let deferredPrompt = null;

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

function save(){ localStorage.setItem(STORE_KEY, JSON.stringify(state)); }

function perthParts(date=new Date()){
  const p = new Intl.DateTimeFormat("en-CA",{timeZone:TZ,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit",hourCycle:"h23"}).formatToParts(date);
  const o = Object.fromEntries(p.filter(x=>x.type!=="literal").map(x=>[x.type,x.value]));
  return {date:`${o.year}-${o.month}-${o.day}`,time:`${o.hour}:${o.minute}:${o.second}`,minutes:+o.hour*60 + +o.minute};
}
function mins(t){
  if(!t) return Number.POSITIVE_INFINITY;
  const [h,m]=t.split(":").map(Number); return h*60+m;
}
function fmt(t){
  if(!t) return "Time not listed";
  const [h,m]=t.split(":").map(Number);
  const d=new Date(2026,0,1,h,m);
  return d.toLocaleTimeString("en-AU",{hour:"numeric",minute:"2-digit"}).replace(" ","");
}

function relation(s, now=perthParts()){
  if(!s.start || !s.end) return s.date < now.date ? "past" : "untimed";
  if(s.date < now.date) return "past";
  if(s.date > now.date) return "future";
  if(now.minutes >= mins(s.start) && now.minutes < mins(s.end)) return "live";
  if(now.minutes >= mins(s.end)) return "past";
  return "future";
}

function updateClock(){
  const now = new Date();
  $("#clock").textContent = new Intl.DateTimeFormat("en-AU",{timeZone:TZ,hour:"2-digit",minute:"2-digit",second:"2-digit",hourCycle:"h23"}).format(now);
  $("#dayLabel").textContent = new Intl.DateTimeFormat("en-AU",{timeZone:TZ,weekday:"short",day:"numeric",month:"short"}).format(now) + " · AWST";
  updateNowCard();
  refreshCardStatuses();
}

function actualDay(){
  const d=perthParts().date;
  return (d==="2026-08-14"||d==="2026-08-15") ? d : "2026-08-14";
}
function effectiveDay(){ return selectedDay==="today" ? actualDay() : selectedDay; }

function updateNowCard(){
  if(!sessions.length) return;
  const now=perthParts();
  const today=sessions.filter(s=>s.date===now.date && s.start && s.end);
  const live=today.filter(s=>relation(s,now)==="live");
  const next=today.filter(s=>relation(s,now)==="future").sort((a,b)=>mins(a.start)-mins(b.start))[0];

  if(live.length){
    const allShowcase=live.every(s=>s.eventGroup==="showcase");
    $("#nowHeadline").textContent = live.length===1 ? live[0].title : allShowcase ? `${live.length} showcase acts playing now` : `${live.length} sessions running now`;
    $("#nowSub").textContent = live.length===1 ? `${live[0].venue} · until ${fmt(live[0].end)}` : live.map(s=>`${s.title} · ${s.venue} · to ${fmt(s.end)}`).join(" | ");
  } else if(next){
    const diff=mins(next.start)-now.minutes;
    $("#nowHeadline").textContent = `Next: ${next.title}`;
    $("#nowSub").textContent = `${next.venue} · ${fmt(next.start)} · starts in ${diff} min`;
  } else if(now.date==="2026-08-14"){
    $("#nowHeadline").textContent="Conference sessions finished for Friday";
    $("#nowSub").textContent="Switch to Saturday to plan tomorrow.";
  } else if(now.date==="2026-08-15"){
    $("#nowHeadline").textContent="WAM Music Week events have finished for today";
    $("#nowSub").textContent="Your check-ins, plan and notes remain available below.";
  } else {
    $("#nowHeadline").textContent="WAMCon 2026 companion";
    $("#nowSub").textContent="Friday 14 + Saturday 15 August · Walyalup/Fremantle.";
  }
}

function shouldShow(s){
  const d=effectiveDay();
  if(s.date!==d) return false;
  const r=relation(s);
  if(filter==="showcase") return s.eventGroup==="showcase";
  if(filter==="upcoming") return r==="live" || r==="future" || r==="untimed";
  if(filter==="checked") return !!state.checkins[s.id];
  if(filter==="planned") return !!state.planned[s.id];
  return true;
}

function escapeHtml(value=""){
  return String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}

function buildProgramDetails(s){
  if(!s.description && !s.practical && !(s.topics||[]).length && !s.roleLine) return "";
  const topicHtml=(s.topics||[]).map(t=>`<span class="topic">${escapeHtml(t)}</span>`).join("");
  return `<details class="program-details">
    <summary>Program details</summary>
    <div class="program-body">
      ${s.roleLine?`<div class="role-line">${escapeHtml(s.roleLine)}</div>`:""}
      ${s.description?`<p>${escapeHtml(s.description)}</p>`:""}
      ${s.practical?`<div class="practical"><strong>Good to know:</strong> ${escapeHtml(s.practical)}</div>`:""}
      ${topicHtml?`<div class="topics">${topicHtml}</div>`:""}
    </div>
  </details>`;
}

function render(){
  const root=$("#schedule");
  root.innerHTML="";
  const list=sessions.filter(shouldShow).sort((a,b)=>{
    const aUntimed=!a.start, bUntimed=!b.start;
    if(aUntimed!==bUntimed) return aUntimed ? 1 : -1;
    return mins(a.start)-mins(b.start) || a.venue.localeCompare(b.venue);
  });
  if(!list.length){ root.innerHTML='<div class="empty">No sessions match this view.</div>'; return; }

  for(const s of list){
    const node=$("#sessionTemplate").content.firstElementChild.cloneNode(true);
    node.dataset.id=s.id;
    node.id=`session-${s.id}`;
    node.querySelector(".start").textContent=s.start ? fmt(s.start) : "SAT";
    node.querySelector(".end").textContent=s.end ? `to ${fmt(s.end)}` : "time not listed";
    node.querySelector(".title").textContent=s.title;
    node.querySelector(".meta").textContent=`${s.type} · ${s.venue}`;
    node.querySelector(".people").textContent=s.people || "";
    const badges=node.querySelector(".badges");
    badges.innerHTML=`<span class="badge">${escapeHtml(s.type)}</span>${!s.start?'<span class="badge">Untimed</span>':""}`;

    const actions=node.querySelector(".actions");
    actions.insertAdjacentHTML("beforebegin",buildProgramDetails(s));

    const plan=node.querySelector(".plan-btn");
    const check=node.querySelector(".check-btn");
    const noteWrap=node.querySelector(".note-wrap");
    const notes=node.querySelector(".notes");

    if(state.planned[s.id]){
      plan.textContent="In my plan";
      badges.insertAdjacentHTML("beforeend",'<span class="badge plan">My plan</span>');
    }
    if(state.checkins[s.id]){
      check.textContent="Checked in";
      node.classList.add("checked");
      badges.insertAdjacentHTML("beforeend",'<span class="badge check">Checked in</span>');
      noteWrap.hidden=false;
    }
    notes.value=state.notes[s.id] || "";

    plan.addEventListener("click",()=>{
      state.planned[s.id]=!state.planned[s.id];
      if(!state.planned[s.id]) delete state.planned[s.id];
      save(); render();
    });
    check.addEventListener("click",()=>{
      if(state.checkins[s.id]){
        if(confirm("Remove this check-in? Your note will be kept.")) delete state.checkins[s.id];
      }else{
        state.checkins[s.id]=new Date().toISOString();
      }
      save(); render();
      setTimeout(()=>document.querySelector(`#session-${s.id}`)?.scrollIntoView({block:"center"}),60);
    });
    notes.addEventListener("input",e=>{
      state.notes[s.id]=e.target.value;
      save();
      const st=node.querySelector(".save-state");
      st.textContent="Saved locally · "+new Date().toLocaleTimeString("en-AU",{hour:"numeric",minute:"2-digit"});
    });
    root.appendChild(node);
  }
  refreshCardStatuses();
}

function refreshCardStatuses(){
  const now=perthParts();
  $$(".session-card").forEach(card=>{
    const s=sessions.find(x=>x.id===card.dataset.id);
    if(!s) return;
    const r=relation(s,now);
    card.classList.toggle("live",r==="live");
    card.classList.toggle("past",r==="past");
    const badges=card.querySelector(".badges");
    const existing=badges.querySelector(".badge.live");
    if(r==="live"&&!existing) badges.insertAdjacentHTML("afterbegin",'<span class="badge live">Now</span>');
    if(r!=="live"&&existing) existing.remove();
  });
}

function setView(day,newFilter){
  selectedDay=day;
  filter=newFilter;
  $$(".day-tab").forEach(b=>b.classList.toggle("active",b.dataset.day===day));
  $$(".chip").forEach(b=>b.classList.toggle("active",b.dataset.filter===newFilter));
  render();
}

function jumpToNow(){
  setView("today","all");
  setTimeout(()=>{
    const live=$(".session-card.live");
    const firstFuture=[...$$(".session-card")].find(c=>{
      const s=sessions.find(x=>x.id===c.dataset.id);
      return s && relation(s)==="future";
    });
    (live||firstFuture||$("#schedule")).scrollIntoView({behavior:"smooth",block:"start"});
  },60);
}

function showShowcase(){
  setView("2026-08-15","showcase");
  setTimeout(()=>{
    const live=$(".session-card.live");
    const firstFuture=[...$$(".session-card")].find(c=>{
      const s=sessions.find(x=>x.id===c.dataset.id);
      return s && relation(s)==="future";
    });
    (live||firstFuture||$("#schedule")).scrollIntoView({behavior:"smooth",block:"start"});
  },60);
}

function exportNotes(){
  const attended=sessions.filter(s=>state.checkins[s.id] || state.notes[s.id] || state.planned[s.id]).map(s=>({
    date:s.date,start:s.start,end:s.end,title:s.title,venue:s.venue,type:s.type,
    planned:!!state.planned[s.id],checkedInAt:state.checkins[s.id]||null,notes:state.notes[s.id]||"",
    program:s.description||"",practical:s.practical||"",people:s.people||""
  }));
  const lines=["WAMCon 2026 Companion Export",`Exported: ${new Date().toISOString()}`,""];
  attended.forEach(x=>{
    lines.push(`${x.date} ${x.start||"untimed"}-${x.end||""} | ${x.title} | ${x.venue}`);
    if(x.people) lines.push(`People: ${x.people}`);
    if(x.program) lines.push(`Program: ${x.program}`);
    if(x.practical) lines.push(`Good to know: ${x.practical}`);
    lines.push(`Planned: ${x.planned?"Yes":"No"} | Checked in: ${x.checkedInAt||"No"}`);
    if(x.notes) lines.push(`Notes:\n${x.notes}`);
    lines.push("");
  });
  const blob=new Blob([lines.join("\n")],{type:"text/plain"});
  const a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download="wamcon-2026-notes.txt"; a.click(); URL.revokeObjectURL(a.href);
}

$$(".day-tab").forEach(b=>b.addEventListener("click",()=>{selectedDay=b.dataset.day; $$(".day-tab").forEach(x=>x.classList.toggle("active",x===b)); render();}));
$$(".chip").forEach(b=>b.addEventListener("click",()=>{filter=b.dataset.filter; $$(".chip").forEach(x=>x.classList.toggle("active",x===b)); render();}));
$("#jumpNow").addEventListener("click",jumpToNow);
$("#exportBtn").addEventListener("click",exportNotes);
$("#showShowcaseBtn")?.addEventListener("click",showShowcase);

window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredPrompt=e;$("#installBtn").hidden=false;});
$("#installBtn").addEventListener("click",async()=>{if(!deferredPrompt)return; deferredPrompt.prompt(); await deferredPrompt.userChoice; deferredPrompt=null; $("#installBtn").hidden=true;});

Promise.all([
  fetch("./schedule.json",{cache:"no-store"}).then(r=>r.json()),
  fetch("./showcase.json",{cache:"no-store"}).then(r=>r.json())
]).then(([conference,showcase])=>{
  sessions=[...conference,...showcase];
  render();
  updateClock();
  setInterval(updateClock,1000);
}).catch(()=>{
  $("#schedule").innerHTML='<div class="empty">Could not load the local schedule files.</div>';
});

if("serviceWorker" in navigator){ window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js")); }
