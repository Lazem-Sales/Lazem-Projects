const ICONS = {
  clinic: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4v6a4 4 0 0 0 8 0V4"/><path d="M18 4v5a2 2 0 1 1-4 0"/><circle cx="18" cy="15.5" r="3.2"/></svg>',
  ambulance: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17V9a1 1 0 0 1 1-1h9v9"/><path d="M13 12h5.5l2.5 3v2h-2"/><circle cx="7" cy="17.5" r="1.6"/><circle cx="17.5" cy="17.5" r="1.6"/><path d="M6.5 6.5v3M5 8h3"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>',
  calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M8 3v4M16 3v4M3.5 10h17"/></svg>',
  map: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-6.8-6.1-6.8-11.3a6.8 6.8 0 1 1 13.6 0C18.8 14.9 12 21 12 21Z"/><circle cx="12" cy="9.7" r="2.3"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M5 5l14 14M19 5L5 19"/></svg>',
  alert: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8.5v5"/><circle cx="12" cy="16.3" r="0.15" fill="currentColor" stroke-width="2.2"/><path d="M10.6 3.8 2.9 17.5a1.6 1.6 0 0 0 1.4 2.4h15.4a1.6 1.6 0 0 0 1.4-2.4L13.4 3.8a1.6 1.6 0 0 0-2.8 0Z"/></svg>',
  bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9a6 6 0 0 1 12 0c0 4.5 1.5 6 1.5 6h-15S6 13.5 6 9Z"/><path d="M10 19.5a2 2 0 0 0 4 0"/></svg>'
};

// Service-type icons live as real files in /assets — no embedded data here.
const SVC_ICONS = {
  ambulance: 'assets/icon-ambulance.png',
  clinic: 'assets/icon-clinic.png',
  both: 'assets/icon-both.png'
};

function hasType(p, t){ return p.services.some(s => s.type === t); }
function overallIcon(p){
  const amb = hasType(p,'ambulance'), cli = hasType(p,'clinic');
  if(amb && cli) return SVC_ICONS.both;
  return amb ? SVC_ICONS.ambulance : SVC_ICONS.clinic;
}
function overallLabel(p){
  const amb = hasType(p,'ambulance'), cli = hasType(p,'clinic');
  if(amb && cli) return 'عيادة طبية وسيارة إسعاف';
  return amb ? 'سيارة إسعاف فقط' : 'عيادة طبية فقط';
}

let projects = [];
const today = new Date();

function getStatus(p){
  if(p.suspendedSince && new Date(p.suspendedSince) <= today) return "suspended";
  if(new Date(p.end) < today) return "expired";
  return "active";
}
const STATUS_LABEL = { active:"نشط", suspended:"متوقف مؤقتًا", expired:"منتهي" };

function daysUntilEnd(p){
  return Math.ceil((new Date(p.end) - today) / 86400000);
}
function isEndingSoon(p){
  const d = daysUntilEnd(p);
  return getStatus(p) === 'active' && d >= 0 && d <= 30;
}

function fmtDate(iso){
  const d = new Date(iso);
  return d.toLocaleDateString('ar-SA-u-ca-gregory-nu-latn', { year:'numeric', month:'2-digit', day:'2-digit' });
}

function serviceLabel(s){
  return (s.type === 'clinic' ? 'عيادة طبية' : 'سيارة إسعاف') + ' · ' + s.level;
}

function renderStats(){
  const counts = { active:0, suspended:0, expired:0 };
  let soon = 0;
  projects.forEach(p => { counts[getStatus(p)]++; if(isEndingSoon(p)) soon++; });
  document.getElementById('stats').innerHTML = `
    <div class="stat"><b>${projects.length}</b><span>إجمالي المشاريع</span></div>
    <div class="stat"><b>${counts.active}</b><span>نشطة</span></div>
    <div class="stat"><b>${counts.suspended + counts.expired + soon}</b><span>تحتاج متابعة</span></div>
  `;
}

function renderGrid(){
  const grid = document.getElementById('grid');
  grid.innerHTML = projects.map((p, i) => {
    const status = getStatus(p);
    return `
    <div class="card" data-i="${i}" tabindex="0" role="button" aria-label="${p.client}" style="animation-delay:${Math.min(i,10) * 0.06}s">
      <div class="card-top">
        <div class="avatar"><img src="${p.logo}" alt="${p.client}"></div>
        <div class="card-title">
          <div class="title-box"><h3>${p.client}</h3></div>
          <div class="code"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 7 4 12l5.5 5M14.5 7 20 12l-5.5 5"/></svg>${p.code}</div>
        </div>
      </div>
      <span class="badge badge-${status}"><span class="badge-dot"></span>${STATUS_LABEL[status]}</span>
      ${isEndingSoon(p) ? `<span class="badge badge-soon">${ICONS.bell}باقي ${daysUntilEnd(p)} يوم</span>` : ''}
      <div class="services">
        ${p.services.map(s => `<div class="svc"><img src="${SVC_ICONS[s.type]}" alt=""><span class="lvl">${s.level}</span>${s.type==='clinic'?'عيادة':'إسعاف'}</div>`).join('')}
      </div>
    </div>`;
  }).join('');

  grid.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => openPanel(+card.dataset.i));
    card.addEventListener('keydown', e => { if(e.key === 'Enter') openPanel(+card.dataset.i); });
  });
}

function openPanel(i){
  const p = projects[i];
  const status = getStatus(p);
  const panel = document.getElementById('panel');
  panel.innerHTML = `
    <div class="panel-head">
      <div style="display:flex; align-items:flex-start; gap:14px; min-width:0;">
        <div class="avatar" style="height:52px; max-width:130px;"><img src="${p.logo}" alt="${p.client}"></div>
        <div style="min-width:0;">
          <h2>${p.client}</h2>
          <div class="sub-label">${p.sub}</div>
          <div class="code"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 7 4 12l5.5 5M14.5 7 20 12l-5.5 5"/></svg>${p.code}</div>
        </div>
      </div>
      <div class="close-btn" id="closeBtn">${ICONS.close}</div>
    </div>
    <span class="badge badge-${status}"><span class="badge-dot"></span>${STATUS_LABEL[status]}</span>
    ${isEndingSoon(p) ? `<span class="badge badge-soon">${ICONS.bell}باقي ${daysUntilEnd(p)} يوم</span>` : ''}

    <div style="margin-top:18px;">
      ${p.services.map(s => `
        <div class="detail-row">
          <div class="detail-icon"><img src="${SVC_ICONS[s.type]}" alt=""></div>
          <div class="detail-text">
            <div class="label">نوع الخدمة</div>
            <div class="val">${serviceLabel(s)}</div>
          </div>
        </div>`).join('')}

      <div class="detail-row">
        <div class="detail-icon">${ICONS.calendar}</div>
        <div class="detail-text">
          <div class="label">أيام العمل في الأسبوع</div>
          <div class="val">${p.days} أيام</div>
        </div>
      </div>

      <div class="detail-row">
        <div class="detail-icon">${ICONS.clock}</div>
        <div class="detail-text">
          <div class="label">ساعات العمل في اليوم</div>
          <div class="val">${p.hours} ساعة</div>
        </div>
      </div>

      <div class="detail-row">
        <div class="detail-icon">${ICONS.calendar}</div>
        <div class="detail-text">
          <div class="label">المدة الزمنية للعقد</div>
          <div class="val">${fmtDate(p.start)} — ${fmtDate(p.end)}</div>
        </div>
      </div>

      ${p.multiCity ? `
      <div class="detail-row">
        <div class="detail-icon">${ICONS.map}</div>
        <div class="detail-text">
          <div class="label">نطاق التشغيل</div>
          <div class="val">${p.multiCity}</div>
          ${p.cities ? `<div class="city-tags">${p.cities.map(c => `<span class="city-tag">${c}</span>`).join('')}</div>` : ''}
        </div>
      </div>` : ''}
    </div>

    ${p.suspendedSince ? `
    <div class="note-box">${ICONS.alert}<span>الخدمة متوقفة حاليًا اعتبارًا من ${fmtDate(p.suspendedSince)}، والعقد ساري حتى ${fmtDate(p.end)}.</span></div>` : ''}
    ${status === 'expired' ? `
    <div class="note-box">${ICONS.alert}<span>انتهت المدة التعاقدية بتاريخ ${fmtDate(p.end)} — يحتاج تجديد أو متابعة.</span></div>` : ''}
    ${isEndingSoon(p) ? `
    <div class="note-box">${ICONS.bell}<span>باقي ${daysUntilEnd(p)} يوم على انتهاء العقد (${fmtDate(p.end)}) — يُنصح بالمتابعة للتجديد.</span></div>` : ''}
  `;
  document.getElementById('closeBtn').addEventListener('click', closePanel);
  document.getElementById('overlay').classList.add('open');
}
function closePanel(){ document.getElementById('overlay').classList.remove('open'); }
document.getElementById('overlay').addEventListener('click', e => { if(e.target.id === 'overlay') closePanel(); });
document.addEventListener('keydown', e => { if(e.key === 'Escape') closePanel(); });

// Data now lives in data/projects.json instead of being hardcoded here.
fetch('data/projects.json')
  .then(res => res.json())
  .then(data => {
    projects = data;
    renderStats();
    renderGrid();
  })
  .catch(err => {
    document.getElementById('grid').innerHTML = '<p style="color:#b9820b">تعذّر تحميل بيانات المشاريع من data/projects.json</p>';
    console.error(err);
  });
