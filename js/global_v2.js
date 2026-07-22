// 스크롤 위치에 따라 클래스 토글 ============================
(function () {
  const headerLogout = document.querySelector('.gnb_logout');
  const headerLogin  = document.querySelector('.gnb_login');

  // 둘 다 없으면 바로 종료
  if (!headerLogout && !headerLogin) return;

  const THRESHOLD = 1; // 0~1px 이하면 '맨 위'로 간주

  const onScroll = () => {
    const isTop = window.scrollY <= THRESHOLD;

    if (headerLogout) {
      headerLogout.classList.toggle('scrolled', !isTop);
    }
    if (headerLogin) {
      headerLogin.classList.toggle('scrolled', !isTop);
    }
  };

  onScroll(); // 초기 상태 반영
  window.addEventListener('scroll', onScroll, { passive: true });
})();

// 로그인 & 로그아웃 gnb 보여지는 설정 ============================
document.addEventListener("DOMContentLoaded", function () {
  const logoutGnb = document.querySelector(".gnb_logout");
  const loginGnb  = document.querySelector(".gnb_login");

  if (!logoutGnb || !loginGnb) return;

  const path = window.location.pathname;

  // index 페이지 예외 처리 (가장 먼저!)
  if (path === "/" || path.endsWith("/index.html")) {
    logoutGnb.style.display = "block";
    loginGnb.style.display  = "none";
    return; // 아래 조건들 실행 안하게 종료
  }

  const isPage = (name) =>
    path.endsWith(`/${name}.html`) ||
    path === `/${name}` ||
    path.endsWith(`/${name}`);

  // 기본값
  logoutGnb.style.display = "none";
  loginGnb.style.display  = "none";

  // ===== 비로그인 헤더(gnb_logout)만 표시할 페이지 =====
  if (
    isPage("brandstory") ||
    isPage("lunchbox")   ||
    isPage("how")        ||
    isPage("menu")       ||
    isPage("faq")        ||
    isPage("join")
  ) {
    logoutGnb.style.display = "block";
  }

  // ===== 로그인 헤더(gnb_login)만 표시할 페이지 =====
  else if (
    isPage("order")       ||
    isPage("order_list")  ||
    isPage("pay_list")    ||
    isPage("profile")     ||
    isPage("tax_invoice")
  ) {
    loginGnb.style.display = "block";
  }

  // ===== 로그인 페이지 (둘 다 숨김) =====
  else if (isPage("login")) {
    // 아무것도 표시하지 않음
  }
});

// 스크롤 유도 애니메이션 ============================================================
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("scrollArrow");
  if (!container) return;

  container.innerHTML = `
    <div class="scroll-down">
      <p>아래로 스크롤</p>
      <p>해주세요</P>
      <img src="./public/images/icon/scroll-icon.svg" alt="스크롤">
    </div>
  `;

  const arrow = container.querySelector(".scroll-down");
  if (arrow) {
    arrow.addEventListener("click", () => {
      const target = document.getElementById("section02");
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    });
  }

  // ===== 스크롤 위치에 따라 화살표 표시/숨김 =====
  const THRESHOLD = 100; // 1000px 이상이면 숨김

  const onScroll = () => {
    if (window.scrollY > THRESHOLD) {
      container.style.opacity = "0";
      container.style.pointerEvents = "none";
    } else {
      container.style.opacity = "1";
      container.style.pointerEvents = "auto";
    }
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
});
