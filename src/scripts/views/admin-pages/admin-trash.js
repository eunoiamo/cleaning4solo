/* eslint-disable no-undef */
import Swal from 'sweetalert2';
import Cleaning4SoloAPI from '../../data/cleaning4soloAPI';
import { createValueTableDataTemplate } from '../templates/admin-template';
import { showSuccessAlert } from '../../components/allertMessage';

const Trash = {
  async render() {
    return `
      <div class="head-title">
        <div class="left">
          <h1>Trash Panel</h1>
          <ul class="breadcrumb">
            <li>
              <a href="#">Dashboard</a>
            </li>
            <li><i class='bx bx-chevron-right' ></i></li>
            <li>
              <a class="active" href="#">Trash</a>
            </li>
          </ul>
        </div>
      </div>
      <div class="form-container color-text">
        <h2 id="form-title">Tambah Limbah Baru</h2>
        <form id="addValueForm">
          <div class="form-group mb-2">
            <label for="valueType">Jenis Limbah</label>
            <input type="text" class="form-control" id="valueType" name="type" required>
          </div>
          <div class="form-group mb-2">
            <label for="valuePrice">Harga/Kg</label>
            <input type="text" class="form-control" id="valuePrice" name="price" required>
          </div>
          <div class="form-group mb-2">
            <label for="valueCarbon">Emisi Karbon/Kg</label>
            <input type="text" class="form-control" id="valueCarbon" name="carbon" required>
          </div>
          
          <button type="submit" class="btn-add-value btn btn-success rounded-pill my-3 px-5 py-2">Add Trash</button>
        </form>
      </div>
      <div class="table-data">
        <div class="order">
          <table>
            <thead>
              <tr>
                <th>Jenis Sampah</th>
                <th class="text-center">Harga</th>
                <th class="text-center">Emisi Karbon</th>
                <th class="text-center">Action</th>
              </tr>
            </thead>
            <tbody class="value-list">
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  async afterRender() {
    this._renderValueList();

    const formAddValue = document.querySelector('#addValueForm');
    formAddValue.addEventListener('submit', (event) => this._handleFormSubmit(event));

    document.addEventListener('click', async (event) => {
      if (event.target.classList.contains('btnDeleteValue')) {
        await this._deleteWasteValue(event);
      } else if (event.target.classList.contains('btnEditValue')) {
        await this._handleEditValue(event);
      } else if (event.target.classList.contains('btnUpdateValue')) {
        await this._handleUpdateValue(event);
      }
    });
  },

     async _renderValueList() {
    try {
      const valuesData = await Cleaning4SoloAPI.getAllValues();
      const { wasteValues } = valuesData;
      const valueContainer = document.querySelector('.value-list');
      valueContainer.innerHTML = '';

      if (wasteValues.length === 0) {
        valueContainer.innerHTML = '<p class="text-center">Belum ada data</p>';
      } else {
        wasteValues.forEach((value) => {
          valueContainer.innerHTML += createValueTableDataTemplate(value);
        });
      }
    } catch (error) {
      console.error('Failed to fetch values:', error.message);
    }
  },

  async _handleFormSubmit(event) {
    event.preventDefault();

    const valueType = document.querySelector('#valueType').value;
    const valuePrice = document.querySelector('#valuePrice').value;
    const valueCarbon = document.querySelector('#valueCarbon').value;

    try {
      const response = await Cleaning4SoloAPI.createWasteValue(valueType, valuePrice, valueCarbon);
      showSuccessAlert("Data Berhasil Diposting");

      document.querySelector('#addValueForm').reset();
      this._renderValueList();
    } catch (error) {
      console.error('Failed to create blog:', error.message);
    }
  },

  async _deleteWasteValue(event) {
    const valueId = event.target.getAttribute('data-id');

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
        await Cleaning4SoloAPI.deleteWasteValue(valueId);
        Swal.fire('Deleted!', 'Limbah Berhasil Dihapus.', 'success');
        this._renderValueList();
      } catch (error) {
        Swal.fire('Failed', `Gagal menghapus data: ${error.message}`, 'error');
      }
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire('Cancelled', 'Data anda tidak terhapus!)', 'info');
    }
  },

  async _handleEditValue(event) {
    const valueId = event.target.getAttribute('data-id');
    try {
      const valueData = await Cleaning4SoloAPI.getDetailValue(valueId);
      console.log(valueData)
      const { jenisSampah, harga, emisi } = valueData;
      document.querySelector('#valueType').value = jenisSampah;
      document.querySelector('#valuePrice').value = harga;
      document.querySelector('#valueCarbon').value = emisi;

      const submitButton = document.querySelector('.btn-add-value');
      submitButton.innerHTML = 'Update Data Limbah';
      submitButton.classList.add('btnUpdateValue');
      submitButton.classList.remove('btn-add-value');
      submitButton.setAttribute('data-id', valueId);

      document.querySelector('#form-title').innerText = 'Edit Data Limbah';
    } catch (error) {
      console.error('Failed to fetch Waste:', error.message);
    }
  },

  async _handleUpdateValue(event) {
    event.preventDefault();
    const valueId = event.target.getAttribute('data-id');

    const valueType = document.querySelector('#valueType').value;
    const valuePrice = document.querySelector('#valuePrice').value;
    const valueCarbon = document.querySelector('#valueCarbon').value;

    try {
      const response = await Cleaning4SoloAPI.updateWasteValue(valueId, { jenisSampah: valueType, harga: valuePrice, emisi: valueCarbon });
      showSuccessAlert("Berhasil Diupdate!");

      document.querySelector('#addValueForm').reset();
      this._renderValueList();

      const submitButton = document.querySelector('.btnUpdateValue');
      submitButton.innerHTML = 'Tambah Limbah Baru';
      submitButton.classList.add('btn-add-value');
      submitButton.classList.remove('btnUpdateValue');
      submitButton.removeAttribute('data-id');

      document.querySelector('#form-title').innerText = 'Tambah Limbah Baru';
    } catch (error) {
      console.error('Failed to update blog:', error.message);
      Swal.fire('Error', `Failed to update blog: ${error.message}`, 'error');
    }
  },
};

export { Trash };
