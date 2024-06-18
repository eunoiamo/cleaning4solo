import Cleaning4SoloAPI from '../../data/cleaning4soloAPI';
import UrlParser from '../../routes/url-parser';
import { createBodyBlogDetailComponent, createHeaderBlogsDetailComponent } from '../templates/template-creator';

const DetailBlog = {
  async render() {
    return `
      <div class="jumbotron d-flex align-items-center mb-5 bg-color-transparent " style="height: 30vh;"></div>
      <div class="container body-container my-4"></div>
    `;
  },

  async afterRender() {
    const url = UrlParser.parseActiveUrlWithoutCombiner();
    const blogs = await Cleaning4SoloAPI.getDetailBlog(url.id);

    const headerContainer = document.querySelector('.jumbotron');
    const bodyContainer = document.querySelector('.body-container');

    headerContainer.innerHTML = createHeaderBlogsDetailComponent(blogs.data);
    bodyContainer.innerHTML = createBodyBlogDetailComponent(blogs.data);
  },
};

export default DetailBlog;
