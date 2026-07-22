/* ---------- Modal Helper ---------- */
(function(){
  const overlay = document.getElementById('alertOverlay');

  function closeOverlay(){
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden','true');
    document.removeEventListener('keydown', escHandler);
  }
  function escHandler(e){ if(e.key === 'Escape') closeOverlay(); }

  function showModal({ title='알림', message='', buttons=[] }){
    overlay.innerHTML = `
      <div class="sheet">
        <header>
          <div class="icon" aria-hidden="true">${title}</div>
        </header>
        <div class="body">${message}</div>
        <div class="actions">
          ${buttons.map((b,i)=>`
            <button type="button" class="btn ${b.class||''}" data-idx="${i}">${b.label}</button>
          `).join('')}
        </div>
      </div>
    `;
    overlay.classList.add('open');
    overlay.removeAttribute('aria-hidden');
    document.addEventListener('keydown', escHandler, { once:false });

    // 바깥 클릭 닫기
    overlay.addEventListener('click', (e)=>{
      if(e.target === overlay) closeOverlay();
    }, { once:true });

    // 버튼 콜백 연결
    overlay.querySelectorAll('[data-idx]').forEach(btn=>{
      btn.addEventListener('click', ()=> {
        const idx = Number(btn.dataset.idx);
        const def = buttons[idx];
        try { def?.onClick?.(); } finally { if(def?.autoClose !== false) closeOverlay(); }
      });
    });
  }

  window.AppAlert = {
    info({title='알림', message=''}={}){
      showModal({
        title, message,
        buttons: [{ label:'확인', class:'primary' }]
      });
    },
    confirm({title='확인', message='', okText='확인', cancelText='취소', onOk=()=>{}}={}){
      showModal({
        title, message,
        buttons: [
          { label: cancelText, class:'', onClick: ()=>{}, autoClose:true },
          { label: okText,     class:'danger', onClick: onOk, autoClose:true },
        ]
      });
    }
  };
})();

/* ---------- “취소하기 / 수정하기” 버튼 연결 ---------- */
(function(){
  const root = document;
  const cancelBtn = root.querySelector('.change_actions .cancel');
  const submitBtn = root.querySelector('.change_actions .submit');

  function revertChanges(){
    cancelBtn?.closest('form')?.reset();
  }

  function saveChanges(){
    return true;
  }

  cancelBtn?.addEventListener('click', (e)=>{
    e.preventDefault();
    window.AppAlert.confirm({
      title: '<img src="./public/images/icon/error.png" alt="에러">',
      message: '수정 중인 내용을 모두 버리고&nbsp;<span>기존 정보로 되돌릴까요?</span>',
      okText: '되돌리기',
      cancelText: '계속 수정',
      onOk: revertChanges
    });
  });

  submitBtn?.addEventListener('click', (e)=>{
    e.preventDefault();
    const ok = saveChanges();
    if (ok) {
      window.AppAlert.info({
        title: '<img src="./public/images/icon/success.svg" alt="완료">',
        message: '변경사항이 저장되었습니다.'
      });
    } else {
      window.AppAlert.info({
        title: '<img src="./public/images/icon/error.png" alt="에러">',
        message: '저장 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
      });
    }
  });
})();
