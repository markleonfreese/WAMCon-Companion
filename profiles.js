(function(){
  function applyProfiles(profiles){
    if(!Array.isArray(sessions) || !sessions.length) return false;
    let changed=false;
    for(const s of sessions){
      const p=profiles[s.id];
      if(!p) continue;
      s.description=p.bio || s.description || "";
      s.topics=p.genres || s.topics || [];
      s.personalFit=p.fit || null;
      s.recommendation=p.why || "";
      s.roleLine=p.fit ? `Personal fit: ${p.fit.toFixed(1)}/5` : s.roleLine;
      s.practical=p.why || s.practical || "";
      s.sourceUrl=p.sourceUrl || "";
      if((p.fit||0)>=4.5) s.priority=true;
      changed=true;
    }
    if(changed){
      render();
      updateNowCard();
    }
    return changed;
  }

  fetch("./artists.json",{cache:"no-store"})
    .then(r=>r.json())
    .then(profiles=>{
      if(applyProfiles(profiles)) return;
      let tries=0;
      const timer=setInterval(()=>{
        tries++;
        if(applyProfiles(profiles) || tries>100) clearInterval(timer);
      },100);
    })
    .catch(()=>{});
})();
