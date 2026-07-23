document.addEventListener("DOMContentLoaded", () => {
  const bgImg = document.getElementById("parallaxImg");
  const section01 = document.querySelector(".section01");

  function initParallax() {
    const sectionHeight = section01.offsetHeight;
    const winH = window.innerHeight;
    const imgH = bgImg.naturalHeight * (bgImg.clientWidth / bgImg.naturalWidth);

    const moveRange = imgH - winH;
    const speed = 2; // ⬅⬅ 원하는 만큼 높이면 translate가 훨씬 빨라짐

    window.addEventListener("scroll", () => {
      const sc = window.scrollY;
      const progress = Math.min(Math.max(sc / sectionHeight, 0), 1);

      const translate = moveRange * progress * speed;

      bgImg.style.transform = `translateY(-${translate}px)`;
    });
  }

  if (bgImg.complete) initParallax();
  else bgImg.onload = initParallax;
});
