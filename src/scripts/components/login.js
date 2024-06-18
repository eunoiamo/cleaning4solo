import { showSuccessAlert } from './allertMessage';
import { getUserRoleFromToken } from './decodeUserID';

function logout() {
  showSuccessAlert('berhasil logout');
  sessionStorage.removeItem('token');
  window.location.href = '/';
  updateLoginSection();
}

window.logout = logout;

function updateLoginSection() {
  const userSection = document.querySelector('.login-page');
  const token = sessionStorage.getItem('token');

  if (!token) {
    renderLoginButton(userSection);
    return;
  }

  const role = getUserRoleFromToken();
  if (role === 'master') {
    renderAdminPanel(userSection);
  } else {
    renderVolunteerPanel(userSection);
  }
}

function renderLoginButton(userSection) {
  userSection.innerHTML = '<a href="#/login" class="button btn-green rounded-pill px-4 py-2">Login</a>';
}

function renderAdminPanel(userSection) {
  userSection.innerHTML = `<li class="dropdown">
    <a href="#"><img src="img/icon-user.svg" alt="" class="img-fluid" style="width: 35px;"><i class="dropdown-indicator"></i></a>
    <ul>
      <li><a href="/admin.html">Admin Panel</a></li>
      <li class="d-flex justify-content-center"><button onclick="logout()" class="button btn btn-danger rounded-pill w-75 py-2 my-2">Logout</button></li>
    </ul>
  </li>`;
}

function renderVolunteerPanel(userSection) {
  userSection.innerHTML = `<li class="dropdown">
    <a href="#"><img src="img/icon-user.svg" alt="" class="img-fluid" style="width: 35px;"><i class="dropdown-indicator"></i></a>
    <ul>
      <li><a href="#/volunteer">Your Event</a></li>
      <li class="d-flex justify-content-center"><button onclick="logout()" class="button btn btn-danger rounded-pill w-75 py-2 my-2">Logout</button></li>
    </ul>
  </li>`;
}

export default updateLoginSection;
