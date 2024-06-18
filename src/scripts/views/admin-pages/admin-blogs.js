/* eslint-disable no-undef */
import Swal from 'sweetalert2';
import Cleaning4SoloAPI from '../../data/cleaning4soloAPI';
import {
  createBlogTableDataItemTemplate,
} from '../templates/admin-template';
import { showSuccessAlert } from '../../components/allertMessage';

const Blog = {
  async render() {
    return `
      <div class="head-title">
        <div class="left">
          <h1>Blog Panel</h1>
          <ul class="breadcrumb">
            <li>
              <a href="#">Dashboard</a>
            </li>
            <li><i class='bx bx-chevron-right' ></i></li>
            <li>
              <a class="active" href="#">Blog</a>
            </li>
          </ul>
        </div>
      </div>
      <div class="form-container color-text">
        <h2 id="formTitle">Add New Blog</h2>
        <form id="addBlogForm">
          <div class="form-group mb-2">
            <label for="blogTitle">Title</label>
            <input type="text" class="form-control" id="blogTitle" name="title" required>
          </div>
          <div class="form-group mb-2 row align-items-center">
            <label for="imageUrl" class="col-sm-3 col-form-label">Image Url</label>
            <div class="col-sm-9 input-group">
              <input type="text" class="form-control" id="imageUrl" name="imageUrl" required>
              <div class="input-group-append">
                <span class="input-group-text h-100 "><i class='bx bx-link'></i></span>
              </div>
            </div>
          </div>
          <div class="form-group mb-2">
            <label for="blogContent">Content</label>
            <textarea id="blogContent" class="form-control" name="content"></textarea>
          </div>
          <button type="submit" class="btn-add-blog btn btn-success rounded-pill my-3 px-5 py-2">Add Blog</button>
        </form>
      </div>
      <div class="table-data">
        <div class="order">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th class="text-center">Date Published</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody class="blog-list">
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  async afterRender() {
    this._renderBlogList();

    tinymce.init({
      selector: 'textarea',
      plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
      toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
    });

    const formAddBlog = document.querySelector('#addBlogForm');
    formAddBlog.addEventListener('submit', (event) => this._handleFormSubmit(event));

    document.addEventListener('click', async (event) => {
      if (event.target.classList.contains('btnDeleteBlog')) {
        await this._handleDeleteBlog(event);
      } else if (event.target.classList.contains('btnEditBlog')) {
        await this._handleEditBlog(event);
      } else if (event.target.classList.contains('btnUpdateBlog')) {
        await this._handleUpdateBlog(event);
      }
    });
  },

  async _renderBlogList() {
    try {
      const blogsData = await Cleaning4SoloAPI.blogAPI();
      const { blogs } = blogsData;
      const blogContainer = document.querySelector('.blog-list');
      blogContainer.innerHTML = '';

      if (blogs.length === 0) {
        blogContainer.innerHTML = '<p class="text-center">Belum ada blog</p>';
      } else {
        blogs.forEach((blog) => {
          blogContainer.innerHTML += createBlogTableDataItemTemplate(blog);
        });
      }
    } catch (error) {
      console.error('Failed to fetch blogs:', error.message);
    }
  },

  async _handleFormSubmit(event) {
    event.preventDefault();

    const blogTitle = document.querySelector('#blogTitle').value;
    const imageUrl = document.querySelector('#imageUrl').value;
    const blogContent = tinymce.get('blogContent').getContent();

    try {
      const response = await Cleaning4SoloAPI.createBlog(blogTitle, imageUrl, blogContent);
      showSuccessAlert(response.message);

      document.querySelector('#addBlogForm').reset();
      tinymce.get('blogContent').setContent('');
      this._renderBlogList();
    } catch (error) {
      console.error('Failed to create blog:', error.message);
    }
  },

  async _handleDeleteBlog(event) {
    const blogId = event.target.getAttribute('data-id');

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel',
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        await Cleaning4SoloAPI.deleteBlogId(blogId);
        Swal.fire('Deleted!', 'Blog post has been deleted.', 'success');
        this._renderBlogList();
      } catch (error) {
        Swal.fire('Failed', `Failed to delete blog post: ${error.message}`, 'error');
      }
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire('Cancelled', 'Your blog post is safe :)', 'info');
    }
  },

  async _handleEditBlog(event) {
    const blogId = event.target.getAttribute('data-id');
    try {
      const blogData = await Cleaning4SoloAPI.getDetailBlog(blogId);
      const { title, image, content } = blogData.data;
      document.querySelector('#blogTitle').value = title;
      document.querySelector('#imageUrl').value = image;
      tinymce.get('blogContent').setContent(content);

      const submitButton = document.querySelector('.btn-add-blog');
      submitButton.innerHTML = 'Update Blog';
      submitButton.classList.add('btnUpdateBlog');
      submitButton.classList.remove('btn-add-blog');
      submitButton.setAttribute('data-id', blogId);

      document.querySelector('#formTitle').innerText = 'Edit Blog';
    } catch (error) {
      console.error('Failed to fetch blog:', error.message);
    }
  },

  async _handleUpdateBlog(event) {
    event.preventDefault();
    const blogId = event.target.getAttribute('data-id');

    const blogTitle = document.querySelector('#blogTitle').value;
    const imageUrl = document.querySelector('#imageUrl').value;
    const blogContent = tinymce.get('blogContent').getContent();

    try {
      const response = await Cleaning4SoloAPI.updateBlog(blogId, { title: blogTitle, image: imageUrl, content: blogContent });
      showSuccessAlert(response.message);

      document.querySelector('#addBlogForm').reset();
      tinymce.get('blogContent').setContent('');
      this._renderBlogList();

      const submitButton = document.querySelector('.btnUpdateBlog');
      submitButton.innerHTML = 'Add Blog';
      submitButton.classList.add('btn-add-blog');
      submitButton.classList.remove('btnUpdateBlog');
      submitButton.removeAttribute('data-id');

      document.querySelector('#formTitle').innerText = 'Add New Blog';
    } catch (error) {
      console.error('Failed to update blog:', error.message);
      Swal.fire('Error', `Failed to update blog: ${error.message}`, 'error');
    }
  },
};

export { Blog };
