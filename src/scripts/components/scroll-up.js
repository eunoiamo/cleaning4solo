import UrlParser from '../routes/url-parser';

const createScrollUpButton = () => {
  const scrollUpButton = document.getElementById('scrollUpButton');

  const handleScroll = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    if (scrollTop > 20) {
      scrollUpButton.classList.add('active');
    } else {
      scrollUpButton.classList.remove('active');
    }
  };

  window.addEventListener('scroll', handleScroll);

  const currentUrlObject = UrlParser.parseActiveUrlWithoutCombiner();
  const resource = currentUrlObject.resource ? `/${currentUrlObject.resource}` : '/';
  const id = currentUrlObject.id ? `/${currentUrlObject.id}` : '';
  const verb = currentUrlObject.verb ? `/${currentUrlObject.verb}` : '';
  const combinedUrl = `${resource}${id}${verb}`;

  scrollUpButton.setAttribute('href', `#${combinedUrl}`);

  scrollUpButton.addEventListener('click', (event) => {
    event.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    history.replaceState(null, '', `#${combinedUrl}`);
  });

  handleScroll();
};

export default createScrollUpButton;
