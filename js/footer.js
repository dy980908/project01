document.addEventListener("DOMContentLoaded", () => {
  // 🔽 푸터 텍스트 데이터
  const footerData = {
    callTitle: "고객센터",
    callNumber: "1234-5678",
    callTime: `
      <p class="foo_ext">평일 <span>08:00 - 18:00</span></p>
      <p class="foo_ext">토요일, 일요일, 공휴일 휴무</p>
    `,
    orderTitle: "주문마감",
    orderDeadline: "전날 밤 12시까지",
    orderExtra: `
      <p class="order-info">
       <img class="order-icon" src="../public/images/icon/error.png" alt="※">

       <span class="order-text">
        <span>발열도시락만 <b>당일 오전 8시까지</b> 수정 가능</span>
    </span>

           <span class="order-text_mo">
        <span>발열도시락만 <b>당일 오전 8시까지</b>
        <br>주문 수정가능</span>
    </span>
    </p>

    `,
    companyInfo: `
      <div>본 사이트는</div>
      <div> 실제 서비스가 아닌,</div>
      <div>포트폴리오 목적으로 제작된 데모 페이지입니다.</div>
    `,
    copyright: ""
  };

  // 🔽 SNS 링크 데이터
  const snsLinks = [
    {
      href: "",
      imgSrc: "../public/images/icon/naverblog_icon.svg",
      alt: "네이버 블로그"
    },
    {
      href: "",
      imgSrc: "../public/images/icon/instagram_icon.svg",
      alt: "인스타그램"
    },
  ];

  // ===== 푸터 텍스트 세팅 =====
  const el = (id) => document.getElementById(id);

  el("footer_call_title").innerHTML = footerData.callTitle;
  el("footer_call_number").innerHTML = footerData.callNumber;
  el("footer_call_time").innerHTML = footerData.callTime;

  el("footer_order_title").innerHTML = footerData.orderTitle;
  el("footer_order_deadline").innerHTML = footerData.orderDeadline;
  el("footer_order_extra").innerHTML = footerData.orderExtra;

  el("footer_company_info").innerHTML = footerData.companyInfo;
  el("footer_copyright").innerHTML = footerData.copyright;

  // ===== SNS 아이콘 세팅 =====
  const snsContainer = document.getElementById("footer_sns");
  if (snsContainer) {
    snsContainer.innerHTML = snsLinks
      .map(
        (sns) => `
        <div class="sns_icon">
          <a href="${sns.href}" target="_blank">
            <img src="${sns.imgSrc}" alt="${sns.alt}">
          </a>
        </div>
      `
      )
      .join("");
  }
});
