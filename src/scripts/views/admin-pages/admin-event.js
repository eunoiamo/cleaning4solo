/* eslint-disable no-undef */
import Swal from 'sweetalert2';
import Cleaning4SoloAPI from '../../data/cleaning4soloAPI';
import { createEventTableDataItemTemplate } from '../templates/admin-template';
import { showSuccessAlert } from '../../components/allertMessage';

const Event = {
  async render() {
    return `
      <div class="head-title">
        <div class="left">
          <h1>Event Panel</h1>
          <ul class="breadcrumb">
            <li>
              <a href="#">Dashboard</a>
            </li>
            <li><i class='bx bx-chevron-right'></i></li>
            <li>
              <a class="active" href="#">Event</a>
            </li>
          </ul>
        </div>
      </div>
      <div class="form-container color-text">
        <h2 id="formTitle">Add New Event</h2>
        <form id="addEventForm">
          <div class="form-group mb-2 row align-items-center">
            <label for="imageUrl" class="col-sm-3 col-form-label">Image Url</label>
            <div class="col-sm-9 input-group">
              <input type="text" class="form-control" id="imageUrl" name="imageUrl" required>
              <div class="input-group-append">
                <span class="input-group-text h-100 "><i class='bx bx-link'></i></span>
              </div>
            </div>
          </div>
          <div class="form-group mb-2">
            <label for="name">Event Name</label>
            <input type="text" class="form-control" id="name" name="name" required>
          </div>
          <div class="form-group mb-2">
            <label for="description">Description</label>
            <textarea class="form-control" id="description" name="description" rows="3" required></textarea>
          </div>
          <div class="form-group mb-2">
            <label for="mapUrl">Map URL</label>
            <input type="text" class="form-control" id="mapUrl" name="mapUrl" required>
          </div>
          <div class="form-group mb-2">
            <label for="location">Location</label>
            <input type="text" class="form-control" id="location" name="location" required>
          </div>
          <div class="form-group mb-2">
            <label for="date">Date</label>
            <input type="date" class="form-control" id="date" name="date" required>
          </div>
          <button type="submit" class="btn-add-event btn btn-success rounded-pill my-3 px-5 py-2">Add Event</button>
        </form>
      </div>
      <div class="table-data">
        <div class="order">
          <table>
            <thead>
              <tr>
                <th scope="col">Preview</th>
                <th class="text-center" scope="col">Name</th>
                <th class="text-center" scope="col">Location</th>
                <th class="text-center" scope="col">Date</th>
                <th class="text-center" scope="col">Action</th>
              </tr> 
            </thead>
            <tbody class="event-list text-center">
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  async afterRender() {
    this._renderEventList();

    const formAddEvent = document.querySelector('#addEventForm');
    formAddEvent.addEventListener('submit', (event) => this._handleFormSubmit(event));

    document.addEventListener('click', async (event) => {
      if (event.target.classList.contains('btnDeleteEvent')) {
        await this._handleDeleteEvent(event);
      } else if (event.target.classList.contains('btnEditEvent')) {
        await this._handleEditEvent(event);
      } else if (event.target.classList.contains('btnUpdateEvent')) {
        await this._handleUpdateEvent(event);
      }
    });
  },

  async _renderEventList() {
    try {
      const eventData = await Cleaning4SoloAPI.eventAPI();
      const { events } = eventData;
      const eventContainer = document.querySelector('.event-list');
      eventContainer.innerHTML = '';

      if (events.length === 0) {
        eventContainer.innerHTML = '<p class="text-center">Belum ada event</p>';
      } else {
        events.forEach((event) => {
          eventContainer.innerHTML += createEventTableDataItemTemplate(event);
        });
      }
    } catch (error) {
      console.error('Failed to fetch events:', error.message);
    }
  },

  async _handleFormSubmit(event) {
    event.preventDefault();

    const imageUrl = document.querySelector('#imageUrl').value;
    const name = document.querySelector('#name').value;
    const description = document.querySelector('#description').value;
    const mapUrl = document.querySelector('#mapUrl').value;
    const location = document.querySelector('#location').value;
    const date = document.querySelector('#date').value;

    try {
      const response = await Cleaning4SoloAPI.createEvent({
        image: imageUrl, name, description, mapUrl, location, date,
      });
      showSuccessAlert(response.message);

      document.querySelector('#addEventForm').reset();
      this._renderEventList();
    } catch (error) {
      console.error('Failed to create event:', error.message);
    }
  },

  async _handleDeleteEvent(event) {
    const eventId = event.target.getAttribute('data-id');

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel',
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        await Cleaning4SoloAPI.deleteEventById(eventId);
        Swal.fire('Deleted!', 'Event has been deleted.', 'success');
        this._renderEventList();
      } catch (error) {
        Swal.fire('Failed', `Failed to delete event: ${error.message}`, 'error');
      }
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire('Cancelled', 'Your event is safe :)', 'info');
    }
  },

  async _handleEditEvent(event) {
    const eventId = event.target.getAttribute('data-id');
    try {
      const eventData = await Cleaning4SoloAPI.getDetailEvent(eventId);
      const spesifiedEvent = eventData.data;
      document.querySelector('#imageUrl').value = spesifiedEvent.image;
      document.querySelector('#name').value = spesifiedEvent.name;
      document.querySelector('#description').value = spesifiedEvent.description;
      document.querySelector('#mapUrl').value = spesifiedEvent.mapUrl;
      document.querySelector('#location').value = spesifiedEvent.location;
      document.querySelector('#date').value = spesifiedEvent.date;

      document.querySelector('.btn-add-event').innerHTML = 'Update Event';
      document.querySelector('.btn-add-event').classList.add('btnUpdateEvent');
      document.querySelector('.btn-add-event').classList.remove('btn-add-event');
      document.querySelector('.btnUpdateEvent').setAttribute('data-id', eventId);

      document.querySelector('#formTitle').innerText = 'Edit Event';
    } catch (error) {
      console.error('Failed to fetch event:', error.message);
    }
  },

  async _handleUpdateEvent(event) {
    event.preventDefault();
    const eventId = event.target.getAttribute('data-id');

    const imageUrl = document.querySelector('#imageUrl').value;
    const name = document.querySelector('#name').value;
    const description = document.querySelector('#description').value;
    const mapUrl = document.querySelector('#mapUrl').value;
    const location = document.querySelector('#location').value;
    const date = document.querySelector('#date').value;

    try {
      const response = await Cleaning4SoloAPI.updateEvent(eventId, {
        image: imageUrl, name, description, mapUrl, location, date,
      });
      showSuccessAlert(response.message);

      document.querySelector('#addEventForm').reset();
      this._renderEventList();

      document.querySelector('.btnUpdateEvent').innerHTML = 'Add Event';
      document.querySelector('.btnUpdateEvent').classList.add('btn-add-event');
      document.querySelector('.btnUpdateEvent').classList.remove('btnUpdateEvent');

      document.querySelector('#formTitle').innerText = 'Add New Event';
    } catch (error) {
      console.error('Failed to update event:', error.message);
      // Tambahkan Swal untuk menampilkan error
      Swal.fire('Error', `Failed to update event: ${error.message}`, 'error');
    }
  },
};

export { Event };
