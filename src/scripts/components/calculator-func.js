import Swal from 'sweetalert2';

function initializeEventListeners() {
  const submitButton = document.getElementById('submitWasteData');

  // Event delegation for form submission
  document.addEventListener('submit', (event) => {
    if (event.target && event.target.id === 'addWasteForm') {
      event.preventDefault();

      // Extract values from form inputs
      const type = document.getElementById('wasteType').value;
      const weight = document.getElementById('wasteWeight').value;
      const price = document.getElementById('wastePrice').value;
      const source = document.getElementById('wasteSource').value;
      const emissions = document.getElementById('wasteEmissions').value;

      // Construct a new row for the waste table
      const newRow = `
        <tr>
          <td class="text-center p-2">${type}</td>
          <td class="text-center p-2">
            <input type="text" value="${weight}">
          </td>
          <td class="text-center p-2">${source}</td>
          <td class="text-center p-2">${price}</td>
          <td class="text-center p-2">${emissions}</td>
        </tr>
      `;

      // Append the new row to the waste table
      const wasteTable = document.getElementById('waste-table');
      if (wasteTable) {
        // Remove "No data" message if it exists
        const noDataMessages = wasteTable.querySelectorAll('.no-data-message');
        noDataMessages.forEach((message) => {
          message.remove();
        });

        wasteTable.insertAdjacentHTML('beforeend', newRow); // Add new row
      }

      // Reset the form
      event.target.reset();

      // Hide the modal
      $('#addWasteModal').modal('hide');

      // Enable the submit button
      submitButton.disabled = false;
    }
  });

  // Event delegation for remove row buttons
  document.addEventListener('click', (event) => {
    if (event.target && event.target.classList.contains('btn-danger')) {
      removeRow(event.target);
    }
  });

  // Event delegation for button click
  document.addEventListener('click', (event) => {
    if (event.target && event.target.id === 'submitWasteData') {
      // Dummy data for the new activity row
      const activityName = 'New Activity';
      const totalJual = 'Rp50.000';
      const totalEmisi = '10.0 kg CO₂';

      // Check if the waste table is empty
      const wasteTable = document.getElementById('waste-table');
      const noDataMessage = document.querySelector('#waste-table td');
      if (!wasteTable || (noDataMessage && noDataMessage.textContent.trim() === 'Tidak ada data')) {
        // Disable the submit button
        submitButton.disabled = true;

        // Show SweetAlert alert
        Swal.fire({
          icon: 'warning',
          title: 'Tidak Ada Data',
          text: 'Mohon tambahkan data terlebih dahulu.',
          confirmButtonText: 'OK',
        });

        return; // Exit the event handler
      }

      // Construct a new row for the activity table
      const newActivityRow = `
        <tr>
          <td class="text-center p-2">${activityName}</td>
          <td class="text-center p-2">${totalJual}</td>
          <td class="text-center p-2">${totalEmisi}</td>
          <td class="text-center p-2">
            <button class="btn btn-success btn-sm btn-open-modal">Selengkapnya</button>

            <!-- Modal -->
          <div class="modal fade" id="bigModal" tabindex="-1" role="dialog" aria-labelledby="bigModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="bigModalLabel">Activity Details</h5>
                  <span class="close" data-dismiss="modal" aria-label="Close" style="position: absolute; top: 1; right: 0; padding: 0.5rem; cursor: pointer;">
                  <span aria-hidden="true" style="font-size: 1.5rem;">&times;</span>
                  </span>
                </div>
                <div class="modal-body">
                  <!-- Content will go here -->
                  This is the modal content.
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                  <!-- Additional buttons can be added here -->
                </div>
              </div>
            </div>
          </div>
          </td>
        </tr>
      `;

      // Clear the waste table and insert "No data" message
      if (wasteTable) {
        wasteTable.innerHTML = `
          <td colspan="6" class="text-center no-data-message p-3">
            <h5>Tidak ada data</h5>
          </td>
        `;
      }

      // Append the new row to the activity table
      const activityTable = document.getElementById('activity-table');
      if (activityTable) {
        activityTable.insertAdjacentHTML('beforeend', newActivityRow); // Add new row

        // Remove "No data" message if it exists
        const noDataMessages = activityTable.querySelector('.no-data-message');
        if (noDataMessages) {
          noDataMessages.remove();
        }
      }
    }
  });

  document.addEventListener('click', (event) => {
    if (event.target && event.target.classList.contains('btn-open-modal')) {
      // Open the big modal here
      $('#bigModal').modal('show');
      // Here you can populate the modal with the details of the activity
    }
  });

  // Define the removeRow function
  function removeRow(button) {
    // Get the row containing the button
    const row = button.closest('tr');
    // Remove the row from the table
    row.parentNode.removeChild(row);

    // Check if the waste table is empty
    const wasteTable = document.getElementById('waste-table');
    if (wasteTable && wasteTable.rows.length === 1) { // Assuming the first row is the header
      wasteTable.innerHTML = `
        <td colspan="6" class="text-center no-data-message p-3">
          <h5>Tidak ada data</h5>
        </td>
      `;
    }
  }
}

export { initializeEventListeners };
