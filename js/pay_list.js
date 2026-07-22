/* ================================================================
   pay_list.js
   월간 캘린더 + '밥온다/풀온다' 배지 + 정산 패널
   - order_list.js와 동일한 렌더/네비/선택 구조
   - 과거 포함 모든 날짜 클릭 가능 (기록 확인용)
   ================================================================ */

/* ===== 유틸 ===== */
const pad2   = n => String(n).padStart(2,'0');
const fmtYMD = (y,m,d) => `${y}-${pad2(m)}-${pad2(d)}`;
const daysInMonth = (y,m) => new Date(y, m, 0).getDate(); // m: 1~12
const mondayIndex = jsDay => (jsDay + 6) % 7; // 월=0 ~ 일=6
const kstNow = () => new Date(new Date().toLocaleString('en-US', { timeZone:'Asia/Seoul' }));

/* ===== 데이터 저장소 =====
   날짜별 합계: { 'YYYY-MM-DD': { heat:Number, salad:Number } }  */
window.orderStore = window.orderStore || {}; // API 연동 시 이 객체만 갱신하세요

/* ===== 런타임 상태/DOM (DOMContentLoaded 이후 채움) ===== */
let calGrid, calTitle, btnPrev, btnNext, btnToday;
let selectedDateEl, eventListEl;

let paylistRootCurrent, paylistMonthTitleEl, paylistTotalEl, paylistExtEl, paylistStatusEl, paylistListEl;

let nowKST, selectedDate, cYear, cMonth;

/* ===== 날짜 상태 ===== */
const isToday = (y,m,d) => {
  const t = kstNow();
  return t.getFullYear()===y && (t.getMonth()+1)===m && t.getDate()===d;
};
const isPastYMD = (ymd) => {
  const dt = new Date(`${ymd}T00:00:00+09:00`);
  const t  = kstNow(); t.setHours(0,0,0,0);
  return dt.getTime() < t.getTime();
};

/* ===== 배지 DOM ===== */
function buildNumGroup(heat, salad){
  const h = Number(heat||0), s = Number(salad||0);
  if (h<=0 && s<=0) return null;
  const box = document.createElement('div');
  box.className = 'num_group';
  if (h>0){
    const p = document.createElement('p');
    p.className = 'heat_num';
    p.textContent = String(h);
    box.appendChild(p);
  }
  if (s>0){
    const p = document.createElement('p');
    p.className = 'salad_num';
    p.textContent = String(s);
    box.appendChild(p);
  }
  return box;
}

/* ===== 캘린더 셀 생성 ===== */
function createDayCell(y,m,d, { muted=false } = {}){
  const ymd  = fmtYMD(y,m,d);
  const past = isPastYMD(ymd);

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className =
    'day' +
    (muted ? ' muted' : '') +
    (isToday(y,m,d) ? ' today' : '') +
    (selectedDate===ymd ? ' selected' : '') +
    (past ? ' past' : '');
  btn.setAttribute('data-date', ymd);
  btn.innerHTML = `<span class="num">${d}</span>`;

  // 주문 배지 + has-order 클래스
  const st = (window.orderStore||{})[ymd];
  const hasOrder = (st?.heat || 0) + (st?.salad || 0) > 0;
  if (hasOrder) btn.classList.add('has-order');
  const badge = buildNumGroup(st?.heat, st?.salad);
  if (badge) btn.appendChild(badge);

  btn.addEventListener('click', ()=>{
    selectedDate = ymd;
    renderSelectedDatePanel();
    calGrid?.querySelectorAll('.day').forEach(x=>x.classList.remove('selected'));
    btn.classList.add('selected');
    if (isPastYMD(ymd)) {
      renderPaylistForExactDate(ymd);
    } else {
      renderPaylistForMonth(ymd.slice(0,7));
    }
  });

  return btn;
}

/* ===== 캘린더 렌더 ===== */
function renderCalendar(year=cYear, month=cMonth){
  if (!calGrid || !calTitle) return;
  calTitle.textContent = `${year}년 ${month}월`;
  calGrid.innerHTML = '';

  const first       = new Date(year, month-1, 1);
  const firstIdx    = mondayIndex(first.getDay()); // 월=0
  const totalDays   = daysInMonth(year, month);

  // 이전 달
  if (firstIdx > 0){
    const pm = month===1 ? 12 : month-1;
    const py = month===1 ? year-1 : year;
    const prevTotal = daysInMonth(py, pm);
    for (let i=firstIdx-1; i>=0; i--){
      const d = prevTotal - i;
      calGrid.appendChild(createDayCell(py, pm, d, { muted:true }));
    }
  }

  // 이번 달
  for (let d=1; d<=totalDays; d++){
    calGrid.appendChild(createDayCell(year, month, d));
  }

  // 다음 달(6주 = 42칸 맞추기)
  const need = 42 - calGrid.children.length;
  if (need > 0){
    const nm = month===12 ? 1 : month+1;
    const ny = month===12 ? year+1 : year;
    for (let d=1; d<=need; d++){
      calGrid.appendChild(createDayCell(ny, nm, d, { muted:true }));
    }
  }
}

/* ===== 좌측: 선택된 날짜 패널 ===== */
function renderSelectedDatePanel(){
  selectedDateEl && (selectedDateEl.textContent = selectedDate);
  if (!eventListEl) return;
  const st = (window.orderStore||{})[selectedDate] || { heat:0, salad:0 };
  const rows = [];
  if (st.heat  > 0) rows.push(`• 밥온다 × <strong>${st.heat}</strong>`);
  if (st.salad > 0) rows.push(`• 풀온다 × <strong>${st.salad}</strong>`);
  eventListEl.innerHTML = rows.length ? rows.map(x=>`<div>${x}</div>`).join('') : `<div style="color:#888;">선택된 날짜에 주문이 없습니다.</div>`;
}

/* ===== 외부에서 데이터 변경 시 배지만 갱신 ===== */
function refreshCalendarBadges(){
  if (!calGrid) return;
  calGrid.querySelectorAll('.day[data-date]').forEach(el=>{
    // 기존 배지 제거
    el.querySelectorAll('.num_group').forEach(n=>n.remove());

    const ymd = el.getAttribute('data-date');
    const st  = (window.orderStore||{})[ymd];
    const hasOrder = (st?.heat || 0) + (st?.salad || 0) > 0;

    // has-order 클래스 토글
    el.classList.toggle('has-order', hasOrder);

    // 배지 다시 붙이기
    const badge = buildNumGroup(st?.heat, st?.salad);
    if (badge) el.appendChild(badge);
  });
}
window.refreshCalendarBadges = refreshCalendarBadges;

/* ===== 정산 패널 ===== */
const PRICES   = window.PRICES || { heat:8000, salad:6000 };
const VAT_RATE = 0.10;
const WEEK_KO  = ['일','월','화','수','목','금','토'];

const parseYMD = (ymd)=>{ const [y,m,d]=ymd.split('-').map(n=>parseInt(n,10)); return new Date(y,(m-1),d); };
const isBizDay = (ymd)=>{ const w=parseYMD(ymd).getDay(); return w>=1 && w<=5; }; // 주말 제외 (원하면 이 줄 지우세요)
const won      = (n)=> (n||0).toLocaleString('ko-KR') + '원';

/* 월 요약 */
function buildMonthSummary(monthKey){
  const rows=[]; let subtotal=0;
  Object.entries(window.orderStore||{}).forEach(([ymd, st])=>{
    if (!ymd.startsWith(monthKey)) return;
    if (!isBizDay(ymd)) return; // 주말 제외
    const heat  = st?.heat||0;
    const salad = st?.salad||0;
    if (heat+salad===0) return;
    const total = (heat*PRICES.heat) + (salad*PRICES.salad);
    rows.push({ ymd, heat, salad, total, weekday: WEEK_KO[parseYMD(ymd).getDay()] });
    subtotal += total;
  });
  rows.sort((a,b)=> a.ymd < b.ymd ? -1 : 1);
  const vat   = Math.floor(subtotal*VAT_RATE);
  const grand = subtotal + vat;
  return { rows, subtotal, vat, grand };
}

/* 월 정산 렌더 */
function renderPaylistForMonth(monthKey){
  if (!paylistRootCurrent || !paylistListEl) return;
  const [y,m] = monthKey.split('-').map(n=>parseInt(n,10));
  paylistMonthTitleEl && (paylistMonthTitleEl.textContent = `${y}년 ${m}월`);

  const { rows, subtotal, vat, grand } = buildMonthSummary(monthKey);
  paylistTotalEl && (paylistTotalEl.textContent = won(grand));
  paylistExtEl   && (paylistExtEl.textContent   = '부가세10%포함 / 세금계산서 발행');
  paylistStatusEl&& (paylistStatusEl.textContent = '정산중');

  if (!rows.length){
    paylistListEl.innerHTML = `<li class="empty">해당 월에 정산할 주문이 없습니다.</li>`;
    return;
  }

  const items = rows.map(r=>`
    <li>
      <div>
        <p class="pay_date">${r.ymd} (${r.weekday})</p>
        <p class="pay_type">${[r.heat?'밥온다':'', r.salad?'풀온다':''].filter(Boolean).join(' / ')}</p>
        <p class="pay_qty">
          ${r.heat?`밥온다 × ${r.heat}개`:''}
          ${r.heat&&r.salad?' / ':''}
          ${r.salad?`풀온다 × ${r.salad}개`:''}
        </p>
      </div>
      <div class="pay_day_total">${won(r.total)}</div>
    </li>
  `).join('');

  const summary = `
    <li class="paylist_card_summary">
      <div class="paylist_card_total_head">총 결제 금액</div>
      <div>
        <p class="paylist_card_total">${won(grand)}</p>
        <p class="paylist_ext">
          부가세 10% 포함 
          <br>· 소계&nbsp;&nbsp;───&nbsp;&nbsp;${won(subtotal)} 
          <br>· 부가세&nbsp;&nbsp;───&nbsp;&nbsp;${won(vat)}
        </p>
      </div>
    </li>`;

  paylistListEl.innerHTML = items + summary;
}

/* 일자 정산 렌더 (과거 클릭 시) */
function renderPaylistForExactDate(ymd){
  if (!paylistRootCurrent || !paylistListEl) return;

  const st = (window.orderStore||{})[ymd] || { heat:0, salad:0 };
  const heat  = st.heat||0;
  const salad = st.salad||0;
  const weekday = WEEK_KO[parseYMD(ymd).getDay()];
  const lineTotal = (heat*PRICES.heat) + (salad*PRICES.salad);
  const vat       = Math.floor(lineTotal*VAT_RATE);
  const grand     = lineTotal + vat;

  paylistMonthTitleEl && (paylistMonthTitleEl.textContent = `${ymd} 정산`);
  paylistTotalEl && (paylistTotalEl.textContent = won(grand));
  paylistExtEl   && (paylistExtEl.textContent   = '부가세10%포함 / 세금계산서 발행');
  paylistStatusEl&& (paylistStatusEl.textContent = '정산중');

  if ((heat+salad)===0){
    paylistListEl.innerHTML = `<li class="empty">${ymd}에 정산할 주문이 없습니다.</li>`;
    return;
  }

  const kinds = [heat?'발열도시락':'', salad?'샐러드도시락':''].filter(Boolean).join(' / ');
  const counts = [
    heat  ? `밥온다 × ${heat}개`   : '',
    salad ? `샐러드 × ${salad}개` : ''
  ].filter(Boolean).join(' / ');

  paylistListEl.innerHTML = `
    <li>
      <div>
        <p class="pay_date">${ymd} (${weekday})</p>
        <p class="pay_type">${kinds || '-'}</p>
        <p class="pay_qty">${counts || '-'}</p>
      </div>
      <div class="pay_day_total">${won(lineTotal)}</div>
    </li>
    <li class="paylist_card_summary">
      <div class="paylist_card_total_head">총 결제 금액</div>
      <div>
        <p class="paylist_card_total">${won(grand)}</p>
        <p class="paylist_ext">
          부가세 10% 포함 
          <br>· 소계&nbsp;&nbsp;───&nbsp;&nbsp;${won(lineTotal)} 
          <br>· 부가세&nbsp;&nbsp;───&nbsp;&nbsp;${won(vat)}
        </p>
      </div>
    </li>
  `;
}

/* ===== 초기 구동 ===== */
document.addEventListener('DOMContentLoaded', ()=>{
  // DOM 캐싱
  calGrid  = document.querySelector('#calGrid');
  calTitle = document.querySelector('#calTitle');
  btnPrev  = document.querySelector('#prevMonth');
  btnNext  = document.querySelector('#nextMonth');
  btnToday = document.querySelector('#goToday');

  selectedDateEl = document.querySelector('#selectedDate');
  eventListEl    = document.querySelector('#eventList');

  paylistRootCurrent = document.querySelector('.info_right .info_paylist > li:not(.paylist_past)');
  if (paylistRootCurrent){
    paylistMonthTitleEl = paylistRootCurrent.querySelector('.actions strong');
    paylistTotalEl      = paylistRootCurrent.querySelector('.paylist_card_head .pay');
    paylistExtEl        = paylistRootCurrent.querySelector('.paylist_card_head .paylist_ext');
    paylistStatusEl     = paylistRootCurrent.querySelector('.paylist_card_head .process_check_btn');
    paylistListEl       = paylistRootCurrent.querySelector('.paylist_card');
  }

  // 상태
  nowKST = kstNow();
  selectedDate = fmtYMD(nowKST.getFullYear(), nowKST.getMonth()+1, nowKST.getDate());
  cYear  = nowKST.getFullYear();
  cMonth = nowKST.getMonth()+1;

  // (옵션) 샘플 데이터 — 운영에서 제거 가능
  (function seedSampleOrders(){
    const base = kstNow();
    const add = (offset, heat, salad) => {
      const d = new Date(+base); d.setDate(d.getDate()+offset);
      const key = fmtYMD(d.getFullYear(), d.getMonth()+1, d.getDate());
      window.orderStore[key] = { heat, salad };
    };
    if (Object.keys(window.orderStore).length === 0) {
      add(-5, 6, 0);
      add(-3, 0, 5);
      add(-1, 4, 2);
      add( 0, 7, 3);
      add( 2, 1, 1);
      add( 5, 0, 8);
      console.log('[SAMPLE] orderStore =', window.orderStore);
    }
  })();

  // 렌더 + 이벤트
  renderCalendar();
  renderSelectedDatePanel();
  renderPaylistForMonth(selectedDate.slice(0,7));

  btnPrev?.addEventListener('click', ()=>{
    cMonth--; if (cMonth===0){ cMonth=12; cYear--; }
    renderCalendar();
  });
  btnNext?.addEventListener('click', ()=>{
    cMonth++; if (cMonth===13){ cMonth=1; cYear++; }
    renderCalendar();
  });
  btnToday?.addEventListener('click', ()=>{
    nowKST = kstNow();
    cYear  = nowKST.getFullYear();
    cMonth = nowKST.getMonth()+1;
    selectedDate = fmtYMD(cYear, cMonth, nowKST.getDate());
    renderCalendar();
    renderSelectedDatePanel();
    renderPaylistForMonth(selectedDate.slice(0,7));
  });
});
