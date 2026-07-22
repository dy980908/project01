document.addEventListener('DOMContentLoaded', function () {
  const logoutHeader = document.querySelector('.gnb_logout');
  const loginHeader = document.querySelector('.gnb_login');

  const isLoggedIn = localStorage.getItem('dummyLoggedIn') === 'true';

  if (isLoggedIn) {
    logoutHeader.style.display = 'none';
    loginHeader.style.display = 'block';
  } else {
    logoutHeader.style.display = 'block';
    loginHeader.style.display = 'none';
  }
});
