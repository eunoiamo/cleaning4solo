import 'regenerator-runtime';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../public/css/style.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import App from './views/app';
import './components/dark-mode';
import navbarScroled from './components/navbar-scroled';
import navbarToggle from './components/mobile-nav';
import createScrollUpButton from './components/scroll-up';
import updateLoginSection from './components/login';
import { setupJoinEventListeners, deleteItemVolunteer } from './components/volunteer-func';

AOS.init({
  duration: 1000,
});

const app = new App({
  content: document.querySelector('#main-content'),
  isAdmin: false,
});

window.addEventListener('hashchange', () => {
  app.renderPage();
  createScrollUpButton();
});

window.addEventListener('load', () => {
  app.renderPage();
  createScrollUpButton();
});

window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    preloader.remove();
  }
});

document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('click', (event) => {
    if (event.target.classList.contains('btn-join-event')) {
      const eventId = event.target.getAttribute('data-event-id');
      setupJoinEventListeners(eventId);
    }
  });
  document.addEventListener('click', (event) => {
    if (event.target.classList.contains('btn-delete-event')) {
      const eventId = event.target.getAttribute('data-event-id');
      deleteItemVolunteer(eventId);
    }
  });
  updateLoginSection();
  navbarScroled();
  navbarToggle();
  const storedMode = localStorage.getItem('darkMode');
  if (storedMode === 'true') {
    document.body.classList.add('dark-mode');
  }
});
