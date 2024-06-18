import { formatDate, formatShortDate } from '../../components/date-formater';

const createHeaderDashboardTemplate = () => `
<div class="left">
    <h1>Dashboard</h1>
    <ul class="breadcrumb">
        <li>
            <a href="#">Home</a>
        </li>
        <li><i class='bx bx-chevron-right' ></i></li>
        <li>
            <a class="active" href="#">Dashboard</a>
        </li>
    </ul>
</div>
`;

const createBoxInfoItemTemplate = (countUser, countEvent, countBlog) => `
<li>
<i class='bx bxs-group' ></i>
<span class="text">
    <h3>${countUser}</h3>
    <p>Pengguna</p>
</span>
</li>
<li>
<i class='bx bx-calendar event-icon' ></i>
<span class="text">
    <h3>${countEvent}</h3>
    <p>Events</p>
</span>
</li>
<li>
<i class='bx bx-images' ></i>
<span class="text">
    <h3>${countBlog}</h3>
    <p>Postingan</p>
</span>
</li>
`;

const createTableDataItemTemplate = (users) => `
<tr>
    <td>
        <img src="img/profile.svg" class="userPicture">
        <p class="my-auto">${users.username}</p>
    </td>
    <td>${formatShortDate(users.createdAt)}</td>
    <td><button class="btnDeleteUser button btn btn-danger rounded-pill" dataId="${users._id}">Delete</button></td>
</tr>
`;

const createNewEventListTemplate = (events) => `
<li class="completed">
    <div>
        <p class="fw-bold">${events.name}</p>
        <p><i class='bx bxs-map'></i> ${events.location}</p>
    </div>
    <p class="d-flex gap-2 align-items-center mt-0"><i class='bx bxs-calendar' ></i>${formatShortDate(events.date)}</p>
</li>
`;

const createBlogTableDataItemTemplate = (blog) => `
  <tr>
    <td class="text-center">${blog.title}</td>
    <td class="text-center">${formatDate(blog.createdAt)}</td>
    <td>
      <button class="btn btn-danger rounded-pill btnDeleteBlog" data-id="${blog._id}">Delete</button>
      <button class="btn btn-outline-warning rounded-pill btnEditBlog" data-id="${blog._id}">Update</button>
    </td>
  </tr>
`;


const createValueTableDataTemplate = (value) => `
  <tr>
    <td class="text-center">${value.jenisSampah}</td>
    <td class="text-center">Rp${value.harga}</td>
    <td class="text-center">${value.emisi}Kg/Co2</td>
    <td class="text-center">
      <button class="btn btn-danger rounded-pill btnDeleteValue" data-id="${value._id}">Delete</button>
      <button class="btn btn-outline-warning rounded-pill btnEditValue" data-id="${value._id}">Update</button>
    </td>
  </tr>
`;

const createGalleryTableDataItemTemplate = (gallery) => `
  <tr>
    <td><img src="${gallery.imageUrl}" alt="${gallery.title}" class="img-fluid" style="width: 200px; height: auto;"></td>
    <td class="text-center">${gallery.category}</td>
    <td class="text-center">
      <button class="btn btn-danger btnDeleteGallery" data-id="${gallery._id}">Delete</button>
    </td>
  </tr>
`;

const createEventTableDataItemTemplate = (event) => `
  <tr>
    <td class="text-center"><img src="${event.image}" alt="${event.name}" class="img-fluid" style="width: 100px; height: auto;"></td>
    <td class="text-center">${event.name}</td>
    <td class="text-center">${event.location}</td>
    <td class="text-center">${formatShortDate(event.date)}</td>
    <td>
      <button class="btn btn-danger btnDeleteEvent" data-id="${event._id}">Delete</button>
      <button class="btn btn-warning btnEditEvent" data-id="${event._id}">Update</button>
    </td>
  </tr>
`;

export {
  createBlogTableDataItemTemplate,
  createEventTableDataItemTemplate,
  createGalleryTableDataItemTemplate,
  createHeaderDashboardTemplate,
  createBoxInfoItemTemplate,
  createTableDataItemTemplate,
  createNewEventListTemplate,
  createValueTableDataTemplate,
};
