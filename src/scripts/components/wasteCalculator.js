import Swal from 'sweetalert2';
import { getUserIDFromToken } from './decodeUserID';
import { showSuccessAlert, showErrorAlert } from './allertMessage';

const token = sessionStorage.getItem('token');

async function addActivity(aktivitas, totalJual, totalEmisiKarbon) {
  if (!token) {
    showErrorAlert('Anda harus login untuk membuat aktivitas.');
    return;
  }

  const userId = getUserIDFromToken(token);
  if (!userId) {
    showErrorAlert('Invalid token. Please log in again.');
    return;
  }

  try {
    const response = await fetch(`${process.env.BASE_URL}/activities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        aktivitas, totalJual, totalEmisiKarbon, userId,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    document.dispatchEvent(new CustomEvent('activityAdded', { detail: { success: true, data } }));

    // Show success notification
    Swal.fire({
      icon: 'success',
      title: 'Aktivitas Berhasil Ditambahkan',
      text: 'Aktivitas telah berhasil ditambahkan ke server.',
      confirmButtonText: 'OK',
    });
  } catch (error) {
    console.error('Error adding activity to server:', error);

    // Show error notification
    Swal.fire({
      icon: 'error',
      title: 'Kesalahan',
      text: 'Terjadi kesalahan saat menambahkan aktivitas.',
      confirmButtonText: 'OK',
    });

    document.dispatchEvent(new CustomEvent('activityAdded', { detail: { success: false, error: error.message } }));
  }
}

async function addWasteToActivity(activityId, jenis, berat, asalLimbah, harga, emisiKarbon) {
  if (!token) {
    showErrorAlert('Anda harus login untuk menambahkan limbah.');
    return;
  }

  const userId = getUserIDFromToken(token);
  if (!userId) {
    showErrorAlert('Invalid token. Please log in again.');
    return;
  }
  try {
    const response = await fetch(`${process.env.BASE_URL}/activities/${activityId}/waste`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Include the token here
      },
      body: JSON.stringify({
        jenis,
        berat,
        asalLimbah,
        harga,
        emisiKarbon,
        activityId,
        userId,
      }),
    });
    const data = await response.json();
    document.dispatchEvent(new CustomEvent('wasteAdded', { detail: data }));

    // Show success notification
    Swal.fire({
      icon: 'success',
      title: 'Limbah Berhasil Ditambahkan',
      text: 'Limbah telah berhasil ditambahkan ke server.',
      confirmButtonText: 'OK',
    });
  } catch (error) {
    console.error('Error adding waste to server:', error);

    // Show error notification
    Swal.fire({
      icon: 'error',
      title: 'Kesalahan',
      text: 'Terjadi kesalahan saat menambahkan data limbah.',
      confirmButtonText: 'OK',
    });
  }
}

export function initializeEventListeners() {
  setupActivityFormSubmission();
  setupWasteFormSubmission();
  loadActivities();
}

function setupActivityFormSubmission() {
  const form = document.getElementById('addActivityForm');
  const activityNameInput = document.querySelector('#activityName');
  const errorMessage = document.querySelector('#activityErrorMessage');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (form.checkValidity()) {
      const aktivitas = activityNameInput.value;
      addActivity(aktivitas);
    } else {
      errorMessage.textContent = 'Harap isi semua bidang dengan benar.';
    }
  });

  document.addEventListener('activityAdded', (event) => {
    const { success, error } = event.detail;
    if (success) {
      form.reset();
      $('#addActivityModal').modal('hide');
      loadActivities();
    } else {
      errorMessage.textContent = `Terjadi kesalahan saat menambahkan aktivitas: ${error}`;
    }
  });
}

function setupWasteFormSubmission() {
  const form = document.getElementById('addWasteForm');
  const activitySelect = document.querySelector('#activitySelect');
  const typeInput = document.querySelector('#wasteType');
  const weightInput = document.querySelector('#wasteWeight');
  const sourceInput = document.querySelector('#wasteSource');
  const priceInput = document.querySelector('#wastePrice');
  const emissionsInput = document.querySelector('#wasteEmissions');
  const errorMessage = document.querySelector('#wasteErrorMessage');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (form.checkValidity()) {
      const activityId = activitySelect.value;
      if (!activityId) {
        errorMessage.textContent = 'Mohon pilih aktivitas terlebih dahulu.';
        return;
      }
      const type = typeInput.value;
      const weight = weightInput.value;
      const source = sourceInput.value;
      const price = priceInput.value;
      const emissions = emissionsInput.value;

      try {
        await addWasteToActivity(activityId, type, weight, source, price, emissions);
        form.reset();
        errorMessage.textContent = ''; // Clear any previous error messages
        fetchAndDisplayWastes(activityId);
        $('#addWasteModal').modal('hide');
      } catch (error) {
        errorMessage.textContent = 'Terjadi kesalahan saat menambahkan data limbah.';
        console.error('Error adding waste:', error);
      }
    } else {
      errorMessage.textContent = 'Harap isi semua bidang dengan benar.';
    }
  });

  activitySelect.addEventListener('change', (event) => {
    const activityId = event.target.value;
    if (activityId) {
      fetchAndDisplayWastes(activityId);
    }
  });

  $('#addWasteModal').on('shown.bs.modal', () => {
    activitySelect.value = ''; // Clear previous selection
    const activityId = activitySelect.value;
    if (activityId) {
      fetchAndDisplayWastes(activityId);
    }
    loadWasteValue();
  });
}

// Function to fetch and display wastes for a given activity
async function fetchAndDisplayWastes(activityId) {
  try {
    const wastes = await getWastesByActivityId(activityId);
    appendWastesToTable(wastes);
  } catch (error) {
    console.error('Error fetching and displaying wastes:', error);
  }
}

// Helper function to get wastes by activity ID
async function getWastesByActivityId(activityId) {
  try {
    if (!token) {
      throw new Error('Token is not available. Please log in again.');
    }
    const response = await fetch(`${process.env.BASE_URL}/activities/wastes/byActivity/${activityId}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const responseJson = await response.json();
    return responseJson;
  } catch (error) {
    return undefined;
  }
}

// Function to append wastes to the table
function appendWastesToTable(wasteIds) {
  const tableBody = document.getElementById('waste-table');
  tableBody.innerHTML = '';
  wasteIds.forEach((waste) => {
    const row = document.createElement('tr');
    const formattedBerat = `${parseFloat(waste.berat).toLocaleString('id-ID')} Kg`;
    const formattedHarga = `Rp ${parseFloat(waste.harga).toLocaleString('id-ID')}`;
    const formattedEmisiKarbon = `${waste.emisiKarbon} kg CO₂`;

    row.innerHTML = `
      <td class="text-center p-2">${waste.jenis}</td>
      <td class="text-center p-2">${formattedBerat}</td>
      <td class="text-center p-2">${waste.asalLimbah}</td>
      <td class="text-center p-2">${formattedHarga}</td>
      <td class="text-center p-2">${formattedEmisiKarbon}</td>
      <td class="text-center p-2">
        <button class="btn btn-danger btn-sm" data-id="${waste._id}">Remove</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
  checkIfTableIsEmpty();

  // Add event listeners to the delete buttons with SweetAlert confirmation
  document.querySelectorAll('.btn-danger').forEach((button) => {
    button.addEventListener('click', async (event) => {
      const wasteId = event.target.getAttribute('data-id');

      Swal.fire({
        title: 'Apakah Anda yakin?',
        text: 'Data limbah ini akan dihapus secara permanen.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ya, hapus!',
        cancelButtonText: 'Batal',
      }).then(async (result) => {
        if (result.isConfirmed) {
          const isSuccess = await deleteWasteById(wasteId);
          if (isSuccess) {
            // Remove the row from the table
            event.target.closest('tr').remove();
            checkIfTableIsEmpty();

            Swal.fire(
              'Dihapus!',
              'Data limbah telah dihapus.',
              'success',
            );
          }
        }
      });
    });
  });
}

async function loadActivities() {
  try {
    if (!token) {
      throw new Error('Token is not available. Please log in again.');
    }
    const userId = getUserIDFromToken(token);
    if (!userId) {
      showErrorAlert('Invalid token. Please log in again.');
      return;
    }
    const response = await fetch(`${process.env.BASE_URL}/activities`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const activities = await response.json();

    // Filter activities with status 'draft'
    const draftActivities = activities.filter((activity) => activity.statusAktivitas === 'draft');

    // Separate activities that match the userId
    const userActivities = draftActivities.filter((activity) => activity.userId === userId);
    const otherActivities = draftActivities.filter((activity) => activity.userId !== userId);

    // Concatenate user activities at the top
    const sortedActivities = [...userActivities, ...otherActivities];

    // Create the options HTML
    const optionsHTML = sortedActivities.map((activity) => `<option value="${activity._id}">${activity.aktivitas}</option>`).join('');

    // Populate activity select dropdowns with an initial empty option and then the options HTML
    const activitySelects = document.querySelectorAll('#activitySelect, #activitySelect2');
    activitySelects.forEach((activitySelect) => {
      activitySelect.innerHTML = `<option value="" disabled selected>Pilih Aktivitas</option>${optionsHTML}`;
    });
  } catch (error) {
    console.error('Error loading activities:', error);

    // Show error notification
    Swal.fire({
      icon: 'error',
      title: 'Kesalahan',
      text: 'Terjadi kesalahan dalam memuat aktivitas. Silakan login untuk melanjutkan.',
      confirmButtonText: 'OK',
    });
  }
}

async function deleteWasteById(wasteId) {
  try {
    const response = await fetch(`${process.env.BASE_URL}/wastes/${wasteId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete waste');
    }

    const result = await response.json();
    // Refresh the table or remove the row
    document.dispatchEvent(new CustomEvent('wasteDeleted', { detail: wasteId }));
    return true;
  } catch (error) {
    console.error('Error deleting waste:', error);

    Swal.fire({
      icon: 'error',
      title: 'Kesalahan',
      text: 'Terjadi kesalahan saat menghapus data limbah.',
      confirmButtonText: 'OK',
    });

    return false;
  }
}

function checkIfTableIsEmpty() {
  const tableBody = document.getElementById('waste-table');
  if (tableBody.rows.length === 0) {
    tableBody.innerHTML = `
      <td colspan="6" class="text-center no-data-message p-3">
        <h5>Tidak ada data</h5>
      </td>
    `;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    const form = document.getElementById('submitActivityForm');
    const form2 = document.getElementById('addWasteForm');
    const showModalButton = document.getElementById('showModalButton');
    const submitSelesaiButton = document.getElementById('submitSelesai');
    console.log(submitSelesaiButton);
    const modal = $('#submitActivityModal');
    const activitySelect2 = document.querySelector('#activitySelect2');
    const errorMessage = document.querySelector('#submitActivityErrorMessage');

    if (submitSelesaiButton) {
      submitSelesaiButton.addEventListener('click', async () => {
        modal.modal('show');

        modal.on('shown.bs.modal', () => {
          form.addEventListener('submit', async (event) => {
            event.preventDefault();
            const activityId = activitySelect2.value;

            if (!activityId) {
              errorMessage.textContent = 'Harap pilih aktivitas yang ingin diselesaikan.';
              return;
            }

            Swal.fire({
              title: 'Apakah Anda yakin?',
              text: 'Jika Anda menekan "Selesai", Anda tidak dapat mengedit data ini lagi.',
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Ya, selesai!',
              cancelButtonText: 'Batal',
            }).then(async (result) => {
              if (result.isConfirmed) {
                try {
                  const isSuccess = await updateActivityStatus(activityId, 'success');
                  if (isSuccess) {
                    appendActivityToTable(activityId);
                    form.reset();
                    window.location.reload();
                    loadActivities();
                    activitySelect2.disabled = true;
                    modal.modal('hide');
                    Swal.fire(
                      'Selesai!',
                      'Data aktivitas telah disimpan.',
                      'success',
                    );
                  } else {
                    throw new Error('Gagal memperbarui status aktivitas.');
                  }
                } catch (error) {
                  Swal.fire(
                    'Gagal',
                    error.message,
                    'error',
                  );
                  console.error('Error submitting activity:', error);
                }
              }
            });
          });

          // Clear error message on change of activity select
          if (activitySelect2) {
            activitySelect2.addEventListener('change', () => {
              errorMessage.textContent = '';
            });
          }
        });
      });
    } else {
      console.error('Element with id "submitSelesai" not found.');
    }
  }, 100); // Adjust the delay time as needed
});

// Function to update activity status
async function updateActivityStatus(activityId, statusAktivitas) {
  try {
    const response = await fetch(`${process.env.BASE_URL}/activities/${activityId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ statusAktivitas }),
    });

    if (!response.ok) {
      throw new Error('Failed to update activity status');
    }

    const data = await response.json();
    return true;
  } catch (error) {
    console.error('Error updating activity status:', error);
    return false;
  }
}

// Function to fetch activity details by ID
async function fetchActivityDetails(activityId) {
  try {
    const response = await fetch(`${process.env.BASE_URL}/activities/${activityId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch activity details');
    }
    return await response.json();

  } catch (error) {
    console.error('Error fetching activity details:', error);
    return null;
  }
}

// Function to append activity to the table
async function appendActivityToTable(activityId) {
  const activity = await fetchActivityDetails(activityId);
  if (!activity) return;

  const activityTableBody = document.getElementById('activity-table');
  const newRow = document.createElement('tr');

  const formattedTotalJual = activity.totalJual
    ? `Rp ${parseFloat(activity.totalJual).toLocaleString('id-ID')}`
    : 'Rp0';

  const formattedTotalEmisiKarbon = activity.totalEmisiKarbon
    ? `${parseFloat(activity.totalEmisiKarbon).toLocaleString('id-ID')} kg CO₂`
    : '0 kg CO₂';

  newRow.innerHTML = `
    <td class="text-center p-2">${activity.aktivitas}</td>
    <td class="text-center p-2">
      <button class="btn btn-success btn-greep" data-activity-id="${activity._id}">Selengkapnya</button>
    </td>
  `;

  // Remove "No data" message if it exists
  const noDataMessage = activityTableBody.querySelector('.no-data-message');
  if (noDataMessage) {
    noDataMessage.remove();
  }

  activityTableBody.appendChild(newRow);

  // Add event listener to the details button
  newRow.querySelector('.btn-open-modal').addEventListener('click', () => {
    showActivityDetailsModal(activity);
  });
}


// Function to fetch all activities
function fetchAllActivities() {
  return new Promise((resolve, reject) => {
    fetch(`${process.env.BASE_URL}/activities`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch activities');
        }
        return response.json();
      })
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        console.error('Error fetching activities:', error);
        reject(error);
      });
  });
}

function displayActivitiesInTable(activities) {
  const tableBody = document.getElementById('activity-table');
  if (!tableBody) {
    console.error('Table body element not found.');
    return;
  }

  tableBody.innerHTML = ''; // Clear existing table rows

  activities.forEach((activity) => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td class="text-center p-2"><b>${activity.aktivitas}</b></td>
      <td class="text-center p-2">
        <button class="btn btn-success btn-open-modal btn-greep" data-activity-id="${activity._id}">Selengkapnya</button>
      </td>
    `;
    tableBody.appendChild(row);
  });

  // Add event listener to buttons to show activity details in modal
  document.querySelectorAll('.btn-open-modal').forEach((button) => {
    button.addEventListener('click', async (event) => {
      const activityId = event.target.getAttribute('data-activity-id');

      try {
        // Fetch and display wastes for the given activity
        await fetchandShowWastes(activityId);
        $('#activityDetailsModal').modal('show'); // Show the specific modal
      } catch (error) {
        console.error('Error displaying activity details:', error);
        Swal.fire('Kesalahan', 'Gagal memuat data aktivitas.', 'error');
      }
    });
  });
}

// Function to fetch and display wastes for a given activity
async function fetchandShowWastes(activityId) {
  try {
    const wastes = await getWastesByActivityId(activityId);
    updateModalContent(wastes);
  } catch (error) {
    console.error('Error fetching and displaying wastes:', error);
  }
}

function updateModalContent(wasteIds) {
  const tableBody = document.getElementById('waste-table-body');
  let totalHarga = 0;
  let totalEmisiKarbon = 0;

  tableBody.innerHTML = '';
  wasteIds.forEach((waste) => {
    const berat = parseFloat(waste.berat);
    const harga = parseFloat(waste.harga);
    const emisiKarbon = parseFloat(waste.emisiKarbon);

    const totalHargaPerWaste = berat * harga;
    const totalEmisiKarbonPerWaste = berat * emisiKarbon;

    totalHarga += totalHargaPerWaste;
    totalEmisiKarbon += totalEmisiKarbonPerWaste;

    const row = document.createElement('tr');
    const formattedBerat = `${berat.toLocaleString('id-ID')} Kg`;
    const formattedHarga = `Rp ${harga.toLocaleString('id-ID')}`;
    const formattedEmisiKarbon = `${emisiKarbon.toLocaleString('id-ID')} kg CO₂`;
    const formattedTotalHargaPerWaste = `Rp ${totalHargaPerWaste.toLocaleString('id-ID')}`;
    const formattedTotalEmisiKarbonPerWaste = `${totalEmisiKarbonPerWaste.toLocaleString('id-ID')} kg CO₂`;

    row.innerHTML = `
      <td class="text-center">${waste.jenis}</td>
      <td class="text-center">${formattedBerat}</td>
      <td class="text-center">${waste.asalLimbah}</td>
      <td class="text-center">${formattedHarga}</td>
      <td class="text-center">${formattedEmisiKarbon}</td>
      <td class="text-center">${formattedTotalHargaPerWaste}</td>
      <td class="text-center">${formattedTotalEmisiKarbonPerWaste}</td>
    `;
    tableBody.appendChild(row);
  });

  // Update the totals in the footer
  document.getElementById('totalHarga').innerText = `Rp ${totalHarga.toLocaleString('id-ID')}`;
  document.getElementById('totalEmisiKarbon').innerText = `${totalEmisiKarbon.toLocaleString('id-ID')} kg CO₂`;

  checkIfTableIsEmpty();
}


async function loadWasteValue() {
  try {
    const response = await fetch(`${process.env.BASE_URL}/value`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();

    // Check if data is an array
    if (!Array.isArray(data.wasteValues)) {
      throw new Error('Expected an array for waste values');
    }

    // Create the options HTML
    const optionsHTML = data.wasteValues.map((value) => `<option value="${value.jenisSampah}" data-id="${value._id}" data-harga="${value.harga}" data-emisi="${value.emisi}">${value.jenisSampah}</option>`).join('');

    const valueSelects = document.querySelectorAll('#wasteType');
    valueSelects.forEach((valueSelect) => {
      valueSelect.innerHTML = `<option value="" disabled selected>Pilih Jenis Limbah</option>${optionsHTML}`;
    });

    // Event listener for when a waste type is selected
    document.querySelector('#wasteType').addEventListener('change', (event) => {
      const selectedOption = event.target.options[event.target.selectedIndex];
      const harga = selectedOption.getAttribute('data-harga');
      const emisi = selectedOption.getAttribute('data-emisi');

      document.querySelector('#wastePrice').value = harga;
      document.querySelector('#wasteEmissions').value = emisi;
    });
  } catch (error) {
    console.error('Error loading values:', error);

    // Show error notification
    Swal.fire({
      icon: 'error',
      title: 'Kesalahan',
      text: 'Terjadi kesalahan dalam memuat jenis limbah.',
      confirmButtonText: 'OK',
    });
  }
}

// Function to filter successful activities
function filterSuccessfulActivities(activities, userId) {
  return activities.filter((activity) => activity.statusAktivitas === 'success' && activity.userId === userId);
}

// Function to sort activities in descending order
function sortActivitiesDescending(activities) {
  return activities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Ensure the correct date field is used
}

// Main function to load and display activities
function loadAndDisplayActivities() {
  const userId = getUserIDFromToken(token); // Assuming you have this function to get the user ID from the token
  if (!userId) {
    console.error('Invalid user ID.');
    return;
  }

  fetchAllActivities()
    .then((activities) => {
      const successfulActivities = filterSuccessfulActivities(activities, userId);

      // Sort activities in descending order
      const sortedActivities = sortActivitiesDescending(successfulActivities);

      displayActivitiesInTable(sortedActivities);
    })
    .catch((error) => {
      console.error('Error fetching activities:', error);
    });
}

// Adjust the timeout duration (in milliseconds) as needed
setTimeout(() => {
  loadAndDisplayActivities();
}, 100);
