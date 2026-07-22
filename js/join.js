document.addEventListener("DOMContentLoaded", function () {
  // "지인 추천" 체크박스 찾기
  const friendCheckbox = document.querySelector(
    'input[type="checkbox"][name="section"][value="지인 추천"]'
  );

  // 텍스트 입력창 (#friend_input)
  const friendInput = document.getElementById("friend_input");

  if (!friendCheckbox || !friendInput) {
    console.warn("지인 추천 체크박스나 friend_input 요소를 찾지 못했습니다.");
    return;
  }

  function toggleFriendInput() {
    if (friendCheckbox.checked) {
      friendInput.disabled = false;  // 활성화
      friendInput.focus();           // 포커스 이동 (선택)
    } else {
      friendInput.disabled = true;   // 비활성화
      friendInput.value = "";        // 내용 초기화 (선택)
    }
  }

  // 체크박스 상태 바뀔 때마다 실행
  friendCheckbox.addEventListener("change", toggleFriendInput);

  // 페이지 로딩 시 초기 상태 맞춰주기
  toggleFriendInput();
});
