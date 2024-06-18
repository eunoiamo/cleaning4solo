/* eslint-disable no-plusplus */
/* eslint-disable no-undef */
import PureCounter from '@srexi/purecounterjs';
import initSwiper from '../../components/swiper';

import {
  CreateCounterComponent,
  createEventComponent,
  createHomePageComponent,
  createLatestPostComponent,
  createLocationComponent,
  createPartnerComponent,
  createVissionMissionComponent,
} from '../templates/template-creator';
import Cleaning4SoloAPI from '../../data/cleaning4soloAPI';

const Homepage = {
  async render() {
    return `
      <section id="hero1" class="hero1"></section>
      <section id="vission" class="vission my-lg-5 pt-lg-4"></section>
      <section id="future-events" class="py-3 future-events">
        <div class="container">
          <div class="section-events h-50"> 
            <h2 class="fs-1 fw-bold text-center my-4" data-aos="fade-up">Event</h2>
            <p class="section-header">Bergabunglah dengan kami untuk berkontribusi nyata dalam menjaga dan memperbaiki lingkungan kita!</p>
          </div>
          <div class="row gy-4 event-item justify-content-center">
          </div>
        </div>
      </section>
      <section id="stats-counter" class="stats-counter my-4"></section>

      <section id="latest-post" class="py-3late latest-post pt-5">
      <div class="section-header">
        <h2 class="fs-1 fw-bold text-center my-4" data-aos="fade-up">Postingan</h2>
        <p>Inilah postingan-postingan terbaru yang baru kami unggah, penuh dengan tips, berita, dan update terkini!</p>
        <div class="container m-auto row gy-4 latest-post-container justify-content-center pb-5 my-4 h-75"></div>
      </div>
    </section>
    <section id="our-location" class="py-3 our-location"></section>
    <section id="partners" class="partners section bg-color-transparent my-4"></section>
      `;
  },

  async afterRender() {
    const blogData = await Cleaning4SoloAPI.blogAPI();
    const eventData = await Cleaning4SoloAPI.eventAPI();
    const { blogs } = blogData;
    const { events } = eventData;
    const mainContainer = document.querySelector('.hero1');
    const counterContainer = document.querySelector('.stats-counter');
    const vissionContainer = document.querySelector('.vission');
    const eventContainer = document.querySelector('.event-item');
    const latestPostContainer = document.querySelector('.latest-post-container');
    const locationContainer = document.querySelector('.our-location');
    const partnersContainer = document.querySelector('.partners');

    mainContainer.innerHTML = createHomePageComponent();
    counterContainer.innerHTML = CreateCounterComponent();
    vissionContainer.innerHTML = createVissionMissionComponent();
    locationContainer.innerHTML = createLocationComponent();
    partnersContainer.innerHTML = createPartnerComponent();

    latestPostContainer.innerHTML = '';
    eventContainer.innerHTML = '';

    if (blogs.length === 0) {
      latestPostContainer.innerHTML = '<p class="text-center" data-aos="fade-up">Belum ada postingan</p>';
    } else {
      blogs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      const latestBlogs = blogs.slice(0, 3);
      latestBlogs.forEach((post) => {
        latestPostContainer.innerHTML += createLatestPostComponent(post);
      });
    }

    if (events.length === 0) {
      eventContainer.innerHTML = '<p class="text-center" data-aos="fade-up">Belum ada acara</p>';
    } else {
      events.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      events.forEach((event) => {
        eventContainer.innerHTML += createEventComponent(event);
      });
    }

    initSwiper();
    new PureCounter();
  },
};

export default Homepage;
