const navbarScroled = () => {
  const selectHeader = document.querySelector('#header');
  if (selectHeader) {
    const headerOffset = selectHeader.offsetTop;
    const nextElement = selectHeader.nextElementSibling;

    const headerFixed = () => {
      if ((headerOffset - window.scrollY) < 0) {
        selectHeader.classList.add('sticked', 'py-4', 'shadow');
        if (nextElement) nextElement.classList.add('sticked-header-offset');
      } else {
        selectHeader.classList.remove('sticked', 'shadow');
        if (nextElement) nextElement.classList.remove('sticked-header-offset');
      }
    };
    window.addEventListener('load', headerFixed);
    document.addEventListener('scroll', headerFixed);
  }
};

export default navbarScroled;
