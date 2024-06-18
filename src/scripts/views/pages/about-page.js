import PureCounter from '@srexi/purecounterjs';
import GLightbox from 'glightbox';
import 'glightbox/dist/css/glightbox.min.css';
import {
  createAboutUsComponent, createGalleryComponent, createStatsCounterComponent, createTeamComponent,
} from '../templates/about-us';
import { initializeGalleryIsotope } from '../../components/gallery';
import Cleaning4SoloAPI from '../../data/cleaning4soloAPI';
import 'lazysizes';

const About = {
  async render() {
    return `
      <section id="hero" class="hero"></section>
      <section id="stats-counter" class="stats-counter sections-bg"></section>
      <section id="team" class="team"></section>
      <section id="gallery" class="gallery sections-bg">
        <div class="container py-5" data-aos="fade-up">
          <div class="section-header">
            <h2>Gallery</h2>
            <p>Berikut ini adalah dokumentasi dari berbagai kegiatan dan momen penting Komunitas Solo Bersih.</p>
          </div>
          <div class="gallery-isotope" data-gallery-filter="*" data-gallery-layout="masonry" data-gallery-sort="original-order" data-aos="fade-up" data-aos-delay="100">
            <div>
              <ul class="gallery-flters">
                <li data-filter="*" class="filter-active">Semua</li>
                <li data-filter=".bersih">Bersih-bersih</li>
                <li data-filter=".kolaborasi">Kolaborasi</li>
                <li data-filter=".foto-bersama">Foto bersama</li>
              </ul>
            </div>
            <div class="row gy-4 gallery-container"></div>
          </div>
        </div>
      </section>
    `;
  },

  async afterRender() {
    const data = await Cleaning4SoloAPI.getAllGalleries();
    const { galleries } = data;
    const teamContainer = document.querySelector('.team');
    teamContainer.innerHTML = createTeamComponent();

    const counterContainer = document.querySelector('.stats-counter');
    counterContainer.innerHTML = createStatsCounterComponent();

    const mainContainer = document.querySelector('.hero');
    mainContainer.innerHTML = createAboutUsComponent();

    const galleryContainer = document.querySelector('.gallery-container');

    if (galleries.length === 0) {
      galleryContainer.innerHTML = '<p class="text-center fw-bold fs-2">Belum ada Foto</p>';
    } else {
      galleries.forEach((picture) => {
        galleryContainer.innerHTML += createGalleryComponent(picture);
      });
    }

    initializeGalleryIsotope();
    new PureCounter();
    const glightbox = GLightbox({
      selector: '.glightbox',
    });
  },
};

export default About;
