import Swal from 'sweetalert2';
import Cleaning4SoloAPI from '../../data/cleaning4soloAPI';
import {
  createHeaderDashboardTemplate,
  createBoxInfoItemTemplate,
  createTableDataItemTemplate,
  createNewEventListTemplate,
} from '../templates/admin-template';

const Dashboard = {
  async render() {
    return `
      <div class="head-title"></div>
      <ul class="box-info"></ul>
      <div class="table-data">
        <div class="order">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Date Join</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody class="user-list"></tbody>
          </table>
        </div>
        <div class="todo">
          <div class="head">
            <h3>Event Terbaru</h3>
            <a href="#/events">
              <i class="bx bx-plus"></i>
            </a>
          </div>
          <ul class="event-list"></ul>
        </div>
      </div>
    `;
  },

  async afterRender() {
    const { events } = await Cleaning4SoloAPI.eventAPI();
    const { blogs } = await Cleaning4SoloAPI.blogAPI();
    let { data: users } = await Cleaning4SoloAPI.getUser(); // Diperbarui untuk mendapatkan data pengguna

    const headerContainer = document.querySelector('.head-title');
    const infoContainer = document.querySelector('.box-info');
    const userContainer = document.querySelector('.user-list');
    const newEventListContainer = document.querySelector('.event-list');

    headerContainer.innerHTML = createHeaderDashboardTemplate();
    infoContainer.innerHTML = createBoxInfoItemTemplate(users.length, events.length, blogs.length);

    if (users.length === 0) {
      userContainer.innerHTML = '<p class="text-center" data-aos="fade-up">Belum ada user</p>';
    } else {
      users.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      users.forEach((user) => {
        userContainer.innerHTML += createTableDataItemTemplate(user);
      });
    }

    if (events.length === 0) {
      newEventListContainer.innerHTML = '<p class="text-center" data-aos="fade-up">Belum ada acara</p>';
    } else {
      events.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      events.forEach((event) => {
        newEventListContainer.innerHTML += createNewEventListTemplate(event);
      });
    }

    document.addEventListener('click', async (event) => {
      if (event.target.classList.contains('btnDeleteUser')) {
        const userId = event.target.getAttribute('dataId');

        const result = await Swal.fire({
          title: 'Are you sure?',
          text: "You won't be able to revert this!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, delete it!',
          cancelButtonText: 'No, cancel!',
          reverseButtons: true,
        });

        if (result.isConfirmed) {
          try {
            await Cleaning4SoloAPI.deleteUserId(userId);
            Swal.fire('Deleted!', 'User has been deleted.', 'success');

            // Perbarui UI: Hapus baris dari tabel pengguna
            userContainer.innerHTML = ''; // Kosongkan kontainer pengguna
            users = users.filter((user) => user._id !== userId); // Filter pengguna yang dihapus
            users.forEach((user) => {
              userContainer.innerHTML += createTableDataItemTemplate(user);
            });

            // Perbarui informasi jumlah pengguna
            infoContainer.innerHTML = createBoxInfoItemTemplate(users.length, events.length, blogs.length);
          } catch (error) {
            Swal.fire('Failed', `Failed to delete user: ${error.message}`, 'error');
          }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire('Cancelled', 'User is safe :)', 'error');
        }
      }
    });
  },

};

export { Dashboard };
