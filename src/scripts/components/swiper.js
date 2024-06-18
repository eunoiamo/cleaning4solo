/* eslint-disable no-undef */
function initSwiper() {
  const swiperElements = document.querySelectorAll('.swiper');
  swiperElements.forEach((swiperElement) => {
    const config = {
      loop: true,
      speed: 600,
      autoplay: {
        delay: 1000,
      },
      slidesPerView: 'auto',
      breakpoints: {
        380: {
          slidesPerView: 3,
          spaceBetween: 8,
        },
        640: {
          slidesPerView: 4,
          spaceBetween: 10,
        },
        992: {
          slidesPerView: 5,
          spaceBetween: 20,
        },
        1200: {
          slidesPerView: 6,
          spaceBetween: 20,
        },
      },
    };
    const swiper = new Swiper(swiperElement, config);
  });
}

export default initSwiper;
