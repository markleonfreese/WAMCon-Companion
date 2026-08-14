function normaliseImportText(value=""){
  return String(value).replace(/\r\n?/g,"\n");
}

function isExportSessionHeader(line){
  return /^\d{4}-\d{2}-\d{2}\s+(?:\d{2}:\d{2}|untimed)-(?:\d{2}:\d{2})?\s+\|\s+.+\s+\|\s+.+$/.test(line.trim());
}

function parseExportHeader(line){
  const parts=line.split(" | ");
  if(parts.length<3) return null;
  const first=parts.shift().trim();
  const venue=parts.pop().trim();
  const title=parts.join(" | ").trim();
  const match=first.match(/^(\d{4}-\d{2}-\d{2})\s+((?:\d{2}:\d{2})|untimed)-((?:\d{2}:\d{2})?)$/);
  if(!match) return null;
  return {
    date:match[1],
    start:match[2]==="untimed" ? "" : match[2],
    end:match[3] || "",
    title,
    venue,
    planned:false,
    checkedInAt:null,
    notes:""
  };
}

function parseWamconExport(text){
  const lines=normaliseImportText(text).split("\n");
  if(!lines.some(line=>line.trim()==="WAMCon 2026 Companion Export")){
    throw new Error("This does not look like a WAMCon Companion export file.");
  }

  const records=[];
  let current=null;
  let noteLines=null;

  function finishCurrent(){
    if(!current) return;
    if(noteLines){
      while(noteLines.length && !noteLines[noteLines.length-1].trim()) noteLines.pop();
      current.notes=noteLines.join("\n").trim();
    }
    records.push(current);
    current=null;
    noteLines=null;
  }

  for(const rawLine of lines){
    const line=rawLine;
    if(isExportSessionHeader(line)){
      finishCurrent();
      current=parseExportHeader(line);
      continue;
    }
    if(!current) continue;

    if(noteLines){
      noteLines.push(line);
      continue;
    }

    const status=line.match(/^Planned:\s*(Yes|No)\s*\|\s*Checked in:\s*(.+)$/i);
    if(status){
      current.planned=status[1].toLowerCase()==="yes";
      const check=status[2].trim();
      current.checkedInAt=/^no$/i.test(check) ? null : check;
      continue;
    }

    const notes=line.match(/^Notes:\s?(.*)$/);
    if(notes){
      noteLines=[];
      if(notes[1]) noteLines.push(notes[1]);
    }
  }
  finishCurrent();
  return records;
}

function norm(value=""){
  return String(value).trim().toLowerCase().replace(/[’‘]/g,"'").replace(/\s+/g," ");
}

function findSessionForImport(record){
  return sessions.find(s=>
    s.date===record.date &&
    (s.start||"")===(record.start||"") &&
    norm(s.title)===norm(record.title)
  ) || sessions.find(s=>
    s.date===record.date && norm(s.title)===norm(record.title)
  ) || sessions.find(s=>
    s.date===record.date &&
    (s.start||"")===(record.start||"") &&
    norm(s.venue)===norm(record.venue)
  );
}

function mergeImportedRecord(session,record){
  let changed=false;
  if(record.planned && !state.planned[session.id]){
    state.planned[session.id]=true;
    changed=true;
  }
  if(record.checkedInAt && !state.checkins[session.id]){
    state.checkins[session.id]=record.checkedInAt;
    changed=true;
  }
  if(record.notes){
    const imported=record.notes.trim();
    const existing=(state.notes[session.id]||"").trim();
    if(!existing){
      state.notes[session.id]=imported;
      changed=true;
    }else if(norm(existing)!==norm(imported) && !existing.includes(imported)){
      state.notes[session.id]=`${existing}\n\n--- Imported from v1 ---\n${imported}`;
      changed=true;
    }
  }
  return changed;
}

async function importNotesFile(file){
  if(!file) return;
  if(!sessions.length){
    alert("The schedule is still loading. Try the import again in a moment.");
    return;
  }

  try{
    const records=parseWamconExport(await file.text());
    if(!records.length) throw new Error("No session records were found in that export.");

    let matched=0;
    let changed=0;
    const unmatched=[];

    for(const record of records){
      const session=findSessionForImport(record);
      if(!session){
        unmatched.push(record.title);
        continue;
      }
      matched++;
      if(mergeImportedRecord(session,record)) changed++;
    }

    save();
    render();

    const bits=[`${matched} session${matched===1?"":"s"} matched`,`${changed} updated`];
    if(unmatched.length) bits.push(`${unmatched.length} not matched`);
    alert(`Import complete: ${bits.join(", ")}. Your existing data was preserved.`);
  }catch(error){
    alert(`Could not import this file. ${error.message||error}`);
  }
}

const importBtn=document.querySelector("#importBtn");
const importFile=document.querySelector("#importFile");
if(importBtn && importFile){
  importBtn.addEventListener("click",()=>importFile.click());
  importFile.addEventListener("change",async()=>{
    const file=importFile.files && importFile.files[0];
    await importNotesFile(file);
    importFile.value="";
  });
}
