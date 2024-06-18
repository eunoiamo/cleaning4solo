/* eslint-disable no-plusplus */
import Cleaning4SoloAPI from '../../data/cleaning4soloAPI';
import { createBreadCrumbComponent, createJumbotronComponent, createLatestPostComponent } from '../templates/template-creator';
import jumbotronData from '../../data/jumbotron.json';

const Blog = {
  async render() {
    return `
    <section class="header-container"></section>
    <div class="container breadcrumb"></div>
    <section id="blog" class="blog">
      <div class="container" data-aos="fade-up">
        <div class="row gy-4 my-5 posts-list"></div>
      </div>
    </section>
    `;
  },

  async afterRender() {
    const data = await Cleaning4SoloAPI.blogAPI();
    const { blogs } = data;
    const url = 'blogs';
    const jumbotronContainer = document.querySelector('.header-container');
    const breadcrumbContainer = document.querySelector('.breadcrumb');
    const postContainer = document.querySelector('.posts-list');

    jumbotronContainer.innerHTML = '';
    breadcrumbContainer.innerHTML = '';
    postContainer.innerHTML = '';

    jumbotronContainer.innerHTML = createJumbotronComponent(jumbotronData.blogsJumbotron);
    breadcrumbContainer.innerHTML = createBreadCrumbComponent(url);

    if (blogs.length === 0) {
      postContainer.innerHTML = '<p class="text-center fw-bold fs-2">Belum ada blog</p>';
    } else {
      blogs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      blogs.forEach((post) => {
        postContainer.innerHTML += createLatestPostComponent(post);
      });
    }
  },
};

export default Blog;
