import Cleaning4SoloAPI from '../../data/cleaning4soloAPI';
import UrlParser from '../../routes/url-parser';
import { createDetailEventComponent } from '../templates/template-creator';

const EventDetail = {
  async render() {
    return `
    <section id="detail-event" class="detail-event"></section>
    `;
  },

  // eslint-disable-next-line no-empty-function
  async afterRender() {
    const url = UrlParser.parseActiveUrlWithoutCombiner();
    const events = await Cleaning4SoloAPI.getDetailEvent(url.id);
    const eventContainer = document.querySelector('.detail-event');
    eventContainer.innerHTML = createDetailEventComponent(events.data);
  },
};

export default EventDetail;
