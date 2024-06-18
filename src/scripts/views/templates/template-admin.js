const createSidebarComponent = () => `
<section id="sidebar">
  <a href="#" class="brand">
    <img src="/img/logo.svg" alt="logo" class="img-log">
    <span class="text">Cleaning4Solo</span>
  </a>
  <ul class="side-menu top">
    <li class="active">
      <a href="#">
        <i class='bx bxs-dashboard' ></i>
        <span class="text">Dashboard</span>
      </a>
    </li>
    <li>
      <a href="#">
        <i class='bx bx-news' ></i>
        <span class="text">Blogs</span>
      </a>
    </li>
    <li>
      <a href="#">
        <i class='bx bx-images' ></i>
        <span class="text">Gallery</span>
      </a>
    </li>
    <li>
      <a href="#">
        <i class='bx bx-calendar event-icon' ></i>
        <span class="text">Events</span>
      </a>
    </li>
    <li>
      <a href="#">
        <i class='bx bx-user-circle' ></i>
        <span class="text">Trash Category</span>
      </a>
    </li>
  </ul>
  <ul class="side-menu">
    <li>
      <a href="#">
        <i class='bx bxs-cog' ></i>
        <span class="text">Settings</span>
      </a>
    </li>
    <li>
      <a href="#" class="logout">
        <i class='bx bxs-log-out-circle' ></i>
        <span class="text">Logout</span>
      </a>
    </li>
  </ul>
</section>
`;

const createContentComponent = () => `
<section id="content">
  <nav>
    <i class='bx bx-menu' ></i>
    <form action="#">
      <div class="form-input">
        <input type="search" placeholder="Search...">
        <button type="submit" class="search-btn"><i class='bx bx-search' ></i></button>
      </div>
    </form>
    <input type="checkbox" id="switch-mode" hidden>
    <label for="switch-mode" class="switch-mode"></label>
    <a href="#" class="profile">
      <img src="img/profile.svg">
    </a>
  </nav>
  <main>
    <div class="head-title">
      <div class="left">
        <h1>Dashboard</h1>
        <ul class="breadcrumb">
          <li>
            <a href="#">Dashboard</a>
          </li>
          <li><i class='bx bx-chevron-right' ></i></li>
          <li>
            <a class="active" href="#">Home</a>
          </li>
        </ul>
      </div>
      <a href="#" class="btn-download">
        <i class='bx bxs-cloud-download' ></i>
        <span class="text">Download PDF</span>
      </a>
    </div>
    <ul class="box-info">
      <li>
        <i class='bx bxs-group' ></i>
        <span class="text">
          <h3>3</h3>
          <p>Trash Category</p>
        </span>
      </li>
      <li>
        <i class='bx bx-calendar event-icon' ></i>
        <span class="text">
          <h3>20</h3>
          <p>Events</p>
        </span>
      </li>
      <li>
        <i class='bx bx-images' ></i>
        <span class="text">
          <h3>45</h3>
          <p>Event</p>
        </span>
      </li>
    </ul>
    <div class="table-data">
      <div class="order">
        <div class="head">
          <h3>Perubahan yang dilakukan</h3>
          <i class='bx bx-search' ></i>
          <i class='bx bx-filter' ></i>
        </div>
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Date Order</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <img src="img/profile.svg">
                <p>Prabroro</p>
              </td>
              <td>01-10-2021</td>
              <td><span class="status completed">Insert</span></td>
            </tr>
            <tr>
              <td>
                <img src="img/profile.svg">
                <p>Prabroro</p>
              </td>
              <td>01-10-2021</td>
              <td><span class="status pending">Delete</span></td>
            </tr>
            <tr>
              <td>
                <img src="img/profile.svg">
                <p>Prabroro</p>
              </td>
              <td>01-10-2021</td>
              <td><span class="status process">Update</span></td>
            </tr>
            <tr>
              <td>
                <img src="img/profile.svg">
                <p>Prabroro</p>
              </td>
              <td>01-10-2021</td>
              <td><span class="status pending">Delete</span></td>
            </tr>
            <tr>
              <td>
                <img src="img/profile.svg">
                <p>Prabroro</p>
              </td>
              <td>01-10-2021</td>
              <td><span class="status completed">Insert</span></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="todo">
        <div class="head">
          <h3>Kosong</h3>
          <i class='bx bx-plus' ></i>
          <i class='bx bx-filter' ></i>
        </div>
        <ul class="todo-list">
          <li class="completed">
            <p>Kosong</p>
            <i class='bx bx-dots-vertical-rounded' ></i>
          </li>
          <li class="completed">
            <p>Kosong</p>
            <i class='bx bx-dots-vertical-rounded' ></i>
          </li>
          <li class="not-completed">
            <p>Kosong</p>
            <i class='bx bx-dots-vertical-rounded' ></i>
          </li>
          <li class="completed">
            <p>Kosong</p>
            <i class='bx bx-dots-vertical-rounded' ></i>
          </li>
          <li class="not-completed">
            <p>Kosong</p>
            <i class='bx bx-dots-vertical-rounded' ></i>
          </li>
        </ul>
      </div>
    </div>
  </main>
</section>
`;

export { createSidebarComponent, createContentComponent };
