/* eslint-disable no-undef */
import Swal from 'sweetalert2';
import Cleaning4SoloAPI from '../../data/cleaning4soloAPI';
import { createGalleryTableDataItemTemplate } from '../templates/admin-template';
import { showSuccessAlert } from '../../components/allertMessage';

const Gallery = {
  async render() {
    return `
      <div class="head-title">
        <div class="left">
          <h1>Gallery Panel</h1>
          <ul class="breadcrumb">
            <li>
              <a href="#">Dashboard</a>
            </li>
            <li><i class='bx bx-chevron-right'></i></li>
            <li>
              <a class="active" href="#">Gallery</a>
            </li>
          </ul>
        </div>
      </div>
      <div class="form-container color-text">
        <h2>Add New Gallery</h2>
        <form id="addGalleryForm">
          <div class="form-group  row align-items-center">
            <label for="imageUrl" class="col-sm-3 col-form-label">Image Url</label>
            <div class="col-sm-9 input-group">
              <input type="text" class="form-control" id="imageUrl" name="imageUrl" required>
              <div class="input-group-append">
                <span class="input-group-text h-100 "><i class='bx bx-link'></i></span>
              </div>
            </div>
          </div>
          <div class="form-group ">
            <label for="category">Kategori</label>
            <select class="form-control" id="category" name="category" required>
              <option value="" disabled selected>Pilih kategori</option>
              <option value="bersih">Bersih-bersih</option>
              <option value="kolaborasi">Kolaborasi</option>
              <option value="foto-bersama">Foto bersama</option>
            </select>
          </div>
          <button type="submit" class="btn-add-gallery btn btn-success rounded-pill my-3 px-5 py-2">Add Image</button>
        </form>
      </div>
      <div class="table-data">
        <div class="order">
          <table>
            <thead>
              <tr>
                <th scope="col">Preview</th>
                <th class="text-center" scope="col">Category</th>
                <th class="text-center" scope="col">Action</th>
              </tr> 
            </thead>
            <tbody class="gallery-list">
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  async afterRender() {
    const galleryData = await Cleaning4SoloAPI.getAllGalleries();
    const { galleries } = galleryData;
    const galleryContainer = document.querySelector('.gallery-list');
    const formAddGallery = document.querySelector('#addGalleryForm');

    if (galleries.length === 0) {
      galleryContainer.innerHTML = '<p class="text-center" data-aos="fade-up">Belum ada galeri</p>';
    } else {
      galleries.forEach((picture) => {
        galleryContainer.innerHTML += createGalleryTableDataItemTemplate(picture);
      });
    }

    formAddGallery.addEventListener('submit', async (event) => {
      event.preventDefault();

      const imageUrl = document.querySelector('#imageUrl').value;
      const category = document.querySelector('#category').value;

      try {
        const response = await Cleaning4SoloAPI.createGallery(imageUrl, category);
        showSuccessAlert(response.message);

        document.querySelector('#imageUrl').value = '';
        document.querySelector('#category').value = '';
        galleryContainer.innerHTML = '';
        const updatedGallery = await Cleaning4SoloAPI.getAllGalleries();
        updatedGallery.galleries.forEach((picture) => {
          galleryContainer.innerHTML += createGalleryTableDataItemTemplate(picture);
        });
      } catch (error) {
        console.error('Failed to create gallery:', error.message);
      }
    });

    document.addEventListener('click', async (event) => {
      if (event.target.classList.contains('btnDeleteGallery')) {
        const galleryId = event.target.getAttribute('data-id');

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
            await Cleaning4SoloAPI.deleteGalleryById(galleryId);
            Swal.fire({
              title: 'Deleted!',
              text: 'Gallery post has been deleted.',
              icon: 'success',
            });
            galleryContainer.innerHTML = '';
            const updatedGallery = await Cleaning4SoloAPI.getAllGalleries();
            updatedGallery.galleries.forEach((picture) => {
              galleryContainer.innerHTML += createGalleryTableDataItemTemplate(picture);
            });
          } catch (error) {
            Swal.fire({
              title: 'Failed',
              text: `Failed to delete gallery post: ${error.message}`,
              icon: 'error',
            });
          }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire({
            title: 'Cancelled',
            text: 'Your gallery post is safe :)',
            icon: 'info',
          });
        }
      }
    });
  },
};

export { Gallery };
