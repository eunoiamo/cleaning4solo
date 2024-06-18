const navbarToggle = () => {
  const mobileNavShow = document.querySelector('.mobile-nav-show');
  const mobileNavHide = document.querySelector('.mobile-nav-hide');

  // cek
  document.querySelectorAll('.mobile-nav-toggle').forEach((el) => {
    el.addEventListener('click', (event) => {
      event.preventDefault();
      mobileNavToggle();
    });
  });

  function mobileNavToggle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavShow.classList.toggle('d-none');
    mobileNavHide.classList.toggle('d-none');
  }

  const navDropdowns = document.querySelectorAll('.navbar .dropdown > a');

  navDropdowns.forEach((el) => {
    el.addEventListener('click', (event) => {
      if (document.querySelector('.mobile-nav-active')) {
        event.preventDefault();
        event.currentTarget.classList.toggle('active');
        event.currentTarget.nextElementSibling.classList.toggle('dropdown-active');

        const dropDownIndicator = event.currentTarget.querySelector('.dropdown-indicator');
        dropDownIndicator.classList.toggle('bi-chevron-up');
        dropDownIndicator.classList.toggle('bi-chevron-down');
      }
    });
  });
};

export default navbarToggle;
