/* Shared interactive front-end for all SalesMate admin modules. Sample data only. */
(() => {
  'use strict';
  const $ = (q, el=document) => el.querySelector(q);
  const $$ = (q, el=document) => Array.from(el.querySelectorAll(q));
  const toast = (message) => {
    const t = $('#toast');
    if (!t) return;
    t.textContent = message; t.hidden = false;
    clearTimeout(window.__cafeToastTimeout);
    window.__cafeToastTimeout = setTimeout(() => {t.hidden=true;},3400);
  };
  const shell=$('.admin-shell'), sidebar=$('.sidebar');
  if (shell && sidebar) {
    // Consistent collapsed state on EVERY admin route. No localStorage pinning.
    function setSidebar(open) {
      sidebar.classList.toggle('is-open', open);
      sidebar.classList.toggle('is-closed', !open);
      shell.classList.toggle('sidebar-open', open);
      shell.classList.toggle('sidebar-closed', !open);
      sidebar.setAttribute('data-expanded', String(open));
    }
    setSidebar(false);
    sidebar.addEventListener('pointerenter', (e) => {
      if (e.pointerType === 'mouse' || e.pointerType === 'pen') setSidebar(true);
    });
    sidebar.addEventListener('pointerleave', (e) => {
      if (e.pointerType === 'mouse' || e.pointerType === 'pen') setSidebar(false);
    });
    // Keyboard access uses focus instead of hover; it never pins the sidebar open.
    sidebar.addEventListener('focusin', () => setSidebar(true));
    sidebar.addEventListener('focusout', (e) => {
      if (!sidebar.contains(e.relatedTarget) && !sidebar.matches(':hover')) setSidebar(false);
    });
    // On touch screens, tapping the collapsed navigation region reveals the labels.
    sidebar.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'touch') setSidebar(true);
    });
    document.addEventListener('pointerdown', (e) => {
      if (!sidebar.contains(e.target) && !sidebar.matches(':hover') && !sidebar.contains(document.activeElement)) setSidebar(false);
    });
  }
  function applyFilters(){
    const q=($('[data-filter-text]')?.value||'').trim().toLowerCase();
    const st=$('[data-filter-status]')?.value||'all';
    const sort=$('[data-sort]')?.value||'default';
    const container=$('[data-filter-container]')||$('.module-table tbody');
    if(!container)return;
    let count=0;
    const records=$$('[data-filter-row]',container);
    if(sort!=='default'){
      const ordered=[...records].sort((a,b)=>{
        if(sort==='oldest')return records.indexOf(b)-records.indexOf(a);
        const x=(a.dataset.name||a.dataset.search||a.textContent).toLowerCase();
        const y=(b.dataset.name||b.dataset.search||b.textContent).toLowerCase();
        return (sort==='desc'?-1:1)*x.localeCompare(y);
      });
      ordered.forEach(el=>container.appendChild(el));
    }
    for(const row of records){
      const text=(row.dataset.search||row.textContent||'').toLowerCase();
      const status=((row.dataset.status||'')+' '+text).toLowerCase();
      const show=(!q||text.includes(q))&&(st==='all'||status.includes(st));
      row.hidden=!show;if(show)count++;
    }
    const empty=$('.no-results');if(empty)empty.hidden=count>0;
  }
  $$('[data-filter-text],[data-filter-status],[data-sort]').forEach(el=>el.addEventListener(el.tagName==='INPUT'?'input':'change',applyFilters));
  let detail;
  function closeDetail(){if(detail){detail.remove();detail=null;}}
  function showDetail(button){
    closeDetail();
    const title=button.dataset.title||'Details';
    const desc=button.dataset.description||'This is a sample entry in the SalesMate prototype.';
    detail=document.createElement('div');detail.className='detail-popover';detail.setAttribute('role','dialog');detail.setAttribute('aria-label',title);
    const close=document.createElement('button');close.className='close-detail';close.textContent='×';close.setAttribute('aria-label','Close');close.addEventListener('click',closeDetail);
    const h=document.createElement('h3');h.textContent=title;
    const p=document.createElement('p');p.textContent=desc;
    const done=document.createElement('button');done.className='ui-btn soft';done.textContent='Close';done.addEventListener('click',closeDetail);
    detail.append(close,h,p,done);document.body.appendChild(detail);
    const rect=button.getBoundingClientRect();
    detail.style.top=Math.max(12,Math.min(window.innerHeight-detail.offsetHeight-14,rect.bottom+9))+'px';
    detail.style.left=Math.max(12,Math.min(window.innerWidth-detail.offsetWidth-12,rect.left+Math.min(18,rect.width)))+'px';
  }
  function formField(label, name, type='text', required=true){
    const safe=label.replace(/&/g,'&amp;').replace(/</g,'&lt;');
    return `<label>${safe}<input name="${name}" type="${type}" ${required?'required':''}></label>`;
  }
  const modalDefinitions={
    reward:{title:'Add Reward',desc:'Create or edit a sample reward offering.',html:formField('Reward name','name')+formField('Required stamps','stamps','number')+'<label>Availability<select name="status"><option>Available</option><option>Limited</option><option>Unavailable</option></select></label>'},
    create:{title:'Create New',desc:'Choose the type of Cafe Juana announcement or package to create.',html:'<label>Type<select name="type"><option>Promotional Offer</option><option>Event Announcement</option><option>Hall Package</option></select></label>'+formField('Title','name')+formField('Start date','start','date',false)+'<label>Description<textarea name="description" placeholder="Add the announcement details"></textarea></label>'},
    offers:{title:'Edit Promotional Offer',desc:'Preview promotional details before publishing.',html:formField('Offer name','name')+'<label>Status<select name="status"><option>Published</option><option>Scheduled</option><option>Draft</option></select></label>'},
    events:{title:'Edit Event Announcement',desc:'Review event details and publishing status.',html:formField('Event title','name')+formField('Event date','date','date',false)+'<label>Status<select name="status"><option>Published</option><option>Scheduled</option><option>Draft</option></select></label>'},
    halls:{title:'Hall Package Details',desc:'Package rates are available upon inquiry.',html:formField('Package title','name')+formField('Guest capacity','guests','number',false)+'<label>Availability<select name="status"><option>Available</option><option>Unavailable</option></select></label>'},
    staff:{title:'Invite Staff',desc:'Prototype invitation only; no email or invitation will actually be sent.',html:formField('Staff email address','email','email')+'<label>Role<select name="role"><option>Staff Member</option><option>Owner / Administrator</option></select></label>'},
    photo:{title:'Change Profile Photo',desc:'Choose an image to preview. This prototype does not upload files to a server.',html:'<label>Choose profile image<input type="file" name="photo" accept="image/*"></label>'},
    history:{title:'Reports History',desc:'Illustrative reporting periods from your Figma design.',html:'<label>Report type<select name="report"><option>Customer Reports</option><option>Stamp Activity</option><option>Redemptions</option><option>Ratings</option></select></label><label>Period<select name="period"><option>Last 7 months</option><option>Last 30 days</option><option>This year</option></select></label>'}
  };
  function closeModal(){document.querySelector('.modal-backdrop')?.remove();}
  function openModal(kind,trigger){
    closeDetail();closeModal();
    const model=modalDefinitions[kind];if(!model)return;
    const wrapper=document.createElement('div');wrapper.className='modal-backdrop';wrapper.innerHTML=`<div class="modal-box" role="dialog" aria-modal="true" aria-label="${model.title}"><button class="modal-close" type="button" aria-label="Close">×</button><h2>${model.title}</h2><p>${model.desc}</p><form class="modal-form">${model.html}<p class="modal-status" aria-live="polite"></p><div class="modal-actions"><button type="button" class="ui-btn soft modal-cancel">Cancel</button><button type="submit" class="ui-btn primary">${kind==='history'?'View history':kind==='halls'?'Preview details':'Save preview'}</button></div></form></div>`;
    document.body.appendChild(wrapper);
    wrapper.addEventListener('click',e=>{if(e.target===wrapper||e.target.closest('.modal-close,.modal-cancel'))closeModal();});
    const edit=trigger?.dataset.edit;
    if(edit && wrapper.querySelector('input[name="name"]'))wrapper.querySelector('input[name="name"]').value=edit;
    wrapper.querySelector('.modal-form')?.addEventListener('submit',e=>{
      e.preventDefault();const data=new FormData(e.currentTarget);const name=(data.get('name')||data.get('report')||data.get('type')||'').toString();
      const st=wrapper.querySelector('.modal-status');st.textContent=(kind==='history'?`Showing ${name} history preview.`:`${name||model.title} — saved in this prototype preview only. No backend record was changed.`);
      toast(kind==='history'?'History selection updated (sample data).':'Prototype preview saved; backend not connected.');
    });
  }
  document.addEventListener('click',e=>{
    const modal=e.target.closest('[data-open-modal]');if(modal){e.preventDefault();openModal(modal.dataset.openModal,modal);return;}
    const d=e.target.closest('[data-detail]');if(d){e.preventDefault();showDetail(d);return;}
    if(e.target.closest('[data-form-reset]')){e.preventDefault();const f=e.target.closest('form');if(f)f.reset();toast('Fields reset.');return;}
    if(e.target.closest('[data-save-preferences]')){
      e.preventDefault();const prefs={};$$('[data-pref]').forEach(input=>prefs[input.name]=input.checked);try{localStorage.setItem('cj-prefs',JSON.stringify(prefs));}catch(_e){}
      toast('Preferences saved in this browser.');return;
    }
    if(e.target.closest('[data-reset-preferences]')){
      e.preventDefault();$$('[data-pref]').forEach(input=>input.checked=(input.name!=='weekly'));
      const light=$('[data-theme-radio][value="light"]');if(light)light.checked=true;
      document.body.classList.remove('dark');try{localStorage.setItem('cafe-juana-dark-mode','false');localStorage.removeItem('cj-prefs');}catch(_e){}
      toast('Preference preview reset.');return;
    }
    if(e.target.closest('[data-page]')){e.preventDefault();const b=e.target.closest('[data-page]');$$('.pagination button').forEach(el=>el.classList.remove('is-current'));b.classList.add('is-current');toast('Pagination preview: sample customer records are shown.');return;}
    const filt=e.target.closest('[data-activity-filter]');if(filt){e.preventDefault();$$('[data-activity-filter]').forEach(el=>el.classList.remove('selected'));filt.classList.add('selected');const v=filt.dataset.activityFilter;$$('.module-table tbody tr').forEach(row=>row.hidden=(v!=='all'&&!row.textContent.toLowerCase().includes(v)));return;}
    if(detail && !e.target.closest('.detail-popover')&&!e.target.closest('[data-detail]'))closeDetail();
  });
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeModal();closeDetail();}});
  const elig=$('[data-check-eligibility]');
  if(elig)elig.addEventListener('submit',e=>{
    e.preventDefault();const f=e.currentTarget,c=f.elements.customer.value,r=Number(f.elements.reward.value),balances={'Juan Dela Cruz':8,'Maria Santos':10,'John Carlo':6,'Anna Cruz':3};
    const avail=balances[c]||0,ok=avail>=r;
    $('.eligibility-result',f).textContent=`${c}: ${avail} stamps available; ${r} required. ${ok?'Eligible for this reward.':'Not yet eligible.'} No stamps have been deducted.`;
  });
  $$('[data-save-form]').forEach(f=>f.addEventListener('submit',e=>{e.preventDefault();const obj=Object.fromEntries(new FormData(f).entries());try{localStorage.setItem('cj-profile',JSON.stringify(obj));}catch(_e){}toast('Profile changes saved in browser preview.');}));
  $$('[data-password-form]').forEach(f=>f.addEventListener('submit',e=>{
    e.preventDefault();const inputs=$$('input',f);const a=inputs[1]?.value||'',b=inputs[2]?.value||'';
    if(a.length<8||!/[a-z]/i.test(a)||!/[0-9]/.test(a)){toast('Use at least 8 characters, including letters and numbers.');return;}
    if(a!==b){toast('New passwords do not match.');return;}
    toast('Valid password format. Changes require a real authentication backend.');
  }));
  $$('[data-theme-radio]').forEach(el=>el.addEventListener('change',()=>{
    const dark=el.checked&&el.value==='dark';document.body.classList.toggle('dark',dark);try{localStorage.setItem('cafe-juana-dark-mode',String(dark));}catch(_e){}
  }));
  if(document.querySelector('[data-pref]')){
    try{const saved=JSON.parse(localStorage.getItem('cj-prefs')||'{}');$$('[data-pref]').forEach(el=>{if(typeof saved[el.name]==='boolean')el.checked=saved[el.name];});}catch(_e){}
    const dark=$('[data-theme-radio][value="dark"]');if(dark)dark.checked=document.body.classList.contains('dark');
    const light=$('[data-theme-radio][value="light"]');if(light)light.checked=!document.body.classList.contains('dark');
  }
  // Lightweight search across sample records and routes.
  const global=$('#global-search');if(global){global.addEventListener('keydown',e=>{
    if(e.key!=='Enter')return;e.preventDefault();const q=global.value.toLowerCase().trim();if(!q)return;
    const routes=[['customer','customer-management.html'],['stamp','stamp-history.html'],['purchase','purchase-transactions.html'],['receipt','purchase-transactions.html'],['reward','reward-catalog.html'],['redemption','redemptions.html'],['offer','promotional-offers.html'],['event','event-announcements.html'],['hall','hall-packages.html'],['report','customer-reports.html'],['rating','ratings-report.html'],['setting','account-settings.html']];
    const matched=routes.find(([name])=>q.includes(name));if(matched)location.href=matched[1];else toast('No matching demo module. Try "customers", "stamps", or "rewards".');
  });}
})();
