/* eslint-disable no-undef */
/* eslint-disable func-names */
import Isotope from 'isotope-layout';
import imagesLoaded from 'imagesloaded';

function initializeGalleryIsotope() {
  document.querySelectorAll('.gallery-isotope').forEach((isotopeItem) => {
    const layout = isotopeItem.getAttribute('data-gallery-layout') ?? 'masonry';
    const filter = isotopeItem.getAttribute('data-gallery-filter') ?? '*';
    const sort = isotopeItem.getAttribute('data-gallery-sort') ?? 'original-order';
    const container = isotopeItem.querySelector('.gallery-container');
    if (!container) {
      console.error('.gallery-container element not found');
      return;
    }

    let initIsotope;
    imagesLoaded(container, () => {
      initIsotope = new Isotope(container, {
        itemSelector: '.gallery-item',
        layoutMode: layout,
        filter,
        sortBy: sort,
      });

      const filters = isotopeItem.querySelectorAll('.gallery-flters li');

      filters.forEach((filterElement) => {
        filterElement.addEventListener('click', function () {
          const activeFilter = isotopeItem.querySelector('.gallery-flters .filter-active');
          if (activeFilter) {
            activeFilter.classList.remove('filter-active');
          }
          this.classList.add('filter-active');
          initIsotope.arrange({
            filter: this.getAttribute('data-filter'),
          });
        });
      });
    });
  });
}

export { initializeGalleryIsotope };
