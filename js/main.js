// 탑버튼 ===========================================================
(function(){
  const topBtn  = document.querySelector('.top_btn');
  const header  = document.getElementById('header');

  if (!topBtn) return;

  // 헤더가 fixed면 헤더 높이 + 여유값 이후에 표시
  const showAt = () => (header?.offsetHeight || 0) + 200;

  function onScroll(){
    const y = window.pageYOffset || document.documentElement.scrollTop;
    if (y > showAt()) topBtn.classList.add('on');
    else topBtn.classList.remove('on');
  }

  // 스크롤 감지
  window.addEventListener('scroll', onScroll, { passive: true });
  // 로드시 한 번 상태 반영
  onScroll();

  // 클릭 시 맨 위로
  topBtn.addEventListener('click', function(e){
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();
document.addEventListener("DOMContentLoaded", () => {
  AOS.init();
});

// 자주묻는질문 토글
document.querySelectorAll(".section04_group").forEach(group => {
    
    const question = group.querySelector(".question");
    const answerBtn = group.querySelector(".a_button");

    question.addEventListener("click", () => {
        const isOpen = group.classList.contains("active");

        document.querySelectorAll(".section04_group").forEach(g => g.classList.remove("active"));

        if (!isOpen) group.classList.add("active");
    });

    if (answerBtn) {
        answerBtn.addEventListener("click", (e) => {
            e.stopPropagation(); // 버블링 막기
            group.classList.remove("active");
        });
    }
});
