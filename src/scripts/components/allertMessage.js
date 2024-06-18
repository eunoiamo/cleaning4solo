import Swal from 'sweetalert2';

const showSuccessAlert = (message) => {
  Swal.fire({
    icon: 'success',
    title: message,
    showConfirmButton: false,
    timer: 1500,
  });
};

const showErrorAlert = (message) => {
  Swal.fire({
    icon: 'error',
    title: message,
    showConfirmButton: false,
    timer: 1500,
  });
};

const showWarningAlert = (message) => {
  Swal.fire({
    icon: 'warning',
    title: message,
    showConfirmButton: false,
    timer: 1500,
  });
};

export { showSuccessAlert, showErrorAlert, showWarningAlert };
