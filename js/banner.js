document.addEventListener("DOMContentLoaded", function () {
  // 🔽문구설정하기🔽
  const bannerMessage = `최소주문 &nbsp;<span>4개 이상!</span> &nbsp;&nbsp;첫주문 무료`;

  const bannerLogout = document.getElementById("bannerText_logout");
  const bannerLogin = document.getElementById("bannerText_login");

  if (bannerLogout) bannerLogout.innerHTML = bannerMessage;
  if (bannerLogin) bannerLogin.innerHTML = bannerMessage;
});
