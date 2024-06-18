import { showErrorAlert, showSuccessAlert } from '../../components/allertMessage';
import updateLoginSection from '../../components/login';
import Cleaning4SoloAPI from '../../data/cleaning4soloAPI';
import { loginFormTemplate, signupFormTemplate, overlayTemplate } from '../templates/template-creator';

const Login = {
  async render() {
    return `
    <div class="body-login" id="body-login">
        <div class="login-container" id="login-container">
            ${loginFormTemplate()}
            ${signupFormTemplate()}
            ${overlayTemplate()}
        </div>
    </div>
    `;
  },

  async afterRender() {
    const overlaySignIn = document.getElementById('signUp-overlay');
    const overlaySignUp = document.getElementById('signIn-overlay');
    const container = document.getElementById('login-container');
    const header = document.querySelector('.navbar');
    const footer = document.querySelector('footer');
    const btnSignIn = document.querySelector('.sign-in');
    const btnSignUp = document.querySelector('.sign-up');
    const loginEmailInput = document.getElementById('login-email-input');
    const loginPasswordInput = document.getElementById('login-password-input');

    const signInUsernameInput = document.getElementById('signin-username-input');
    const signInEmailInput = document.getElementById('signin-email-input');
    const signInPasswordInput = document.getElementById('signin-password-input');

    if (header) header.style.display = 'none';
    if (footer) footer.style.display = 'none';

    overlaySignIn.addEventListener('click', () => {
      container.classList.add('right-panel-active');
    });

    overlaySignUp.addEventListener('click', () => {
      container.classList.remove('right-panel-active');
    });

    // signup signin
    btnSignUp.addEventListener('click', async (event) => {
      event.preventDefault();
      try {
        const data = await Cleaning4SoloAPI.signup(signInUsernameInput.value, signInEmailInput.value, signInPasswordInput.value);
        sessionStorage.setItem('token', data.token);
        showSuccessAlert(data.message);
        setTimeout(() => {
          container.classList.remove('right-panel-active');
        }, 1000);
      } catch (err) {
        showErrorAlert(err.message);
      }
    });

    btnSignIn.addEventListener('click', async (event) => {
      event.preventDefault();
      try {
        const data = await Cleaning4SoloAPI.login(loginEmailInput.value, loginPasswordInput.value);
        sessionStorage.setItem('token', data.token);
        updateLoginSection();
        showSuccessAlert(data.message);
        setTimeout(() => {
          if (data.data.role === 'master') {
            window.location.href = '/admin.html';
          } else {
            window.location.hash = '#/homepage';
            location.reload();
          }
        }, 2000);
      } catch (err) {
        showErrorAlert(err.message);
      }
    });

    window.addEventListener('hashchange', () => {
      if (window.location.hash !== '#/login') {
        if (header) header.style.display = '';
        if (footer) footer.style.display = '';
      }
    });
  },
};

export default Login;
