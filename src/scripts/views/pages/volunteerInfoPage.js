/* eslint-disable no-plusplus */
import Cleaning4SoloAPI from '../../data/cleaning4soloAPI';
import { createBreadCrumbComponent, createJumbotronComponent, createEventComponent } from '../templates/template-creator';
import jumbotronData from '../../data/jumbotron.json';
import { showSuccessAlert, showErrorAlert, showWarningAlert } from '../../components/allertMessage';
import { getUserIDFromToken } from '../../components/decodeUserID';

const VolunteerInfoPage = {
  async render() {
    return `
    <section class="header-container"></section>
    <div class="container breadcrumb"></div>
    <section id="blog" class="blog">
      <div class="container">
        <div class="row gy-4 my-5 posts-list"></div>
      </div>
    </section>
    `;
  },

  async afterRender() {
    const token = sessionStorage.getItem('token');
    if (!token) {
      showErrorAlert('You need to be logged in to join an event.');
      return;
    }
    const userId = getUserIDFromToken(token);
    if (!userId) {
      showErrorAlert('Invalid token. Please log in again.');
      return;
    }
    const data = await Cleaning4SoloAPI.getDetaiVolunteer(userId);
    if (!data || data.status === 404) {
      showWarningAlert('Anda belum menjadi volunteer dari event apapun');
      const volunteerContainer = document.querySelector('.posts-list');
      volunteerContainer.innerHTML = '<p class="text-center fw-bold fs-2">Belum ada data Volunteer</p>';
      return;
    }
    const volunteer = data.data;
    const url = 'volunteer';
    const jumbotronContainer = document.querySelector('.header-container');
    const breadcrumbContainer = document.querySelector('.breadcrumb');
    const volunteerContainer = document.querySelector('.posts-list');

    jumbotronContainer.innerHTML = '';
    breadcrumbContainer.innerHTML = '';
    volunteerContainer.innerHTML = '';

    jumbotronContainer.innerHTML = createJumbotronComponent(jumbotronData.volunteerJumbotron);
    breadcrumbContainer.innerHTML = createBreadCrumbComponent(url);
    console.log(volunteer);
    volunteer.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    volunteer.forEach((events) => {
      volunteerContainer.innerHTML += createEventComponent(events);
      const button = volunteerContainer.querySelector(`.btn-join-event[data-event-id="${events._id}"]`);
      button.style.display = 'none';
      const buttonDelete = volunteerContainer.querySelector(`.btn-delete-event[data-event-id="${events._id}"]`);
      buttonDelete.style.display = '';
    });
  },
};

export default VolunteerInfoPage;
