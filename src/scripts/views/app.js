import UrlParser from '../routes/url-parser';
import routes from '../routes/routes';
import adminRoutes from '../routes/adminroutes';
import { getUserRoleFromToken } from '../components/decodeUserID';
import { showErrorAlert, showSuccessAlert } from '../components/allertMessage';

class App {
  constructor({ content, isAdmin }) {
    this._content = content;
    this._isAdmin = isAdmin;
  }

  async renderPage() {
    const url = UrlParser.parseActiveUrlWithCombiner();

    let selectedRoutes;
    if (this._isAdmin) {
      const role = await getUserRoleFromToken();
      if (role !== 'master') {
        showErrorAlert('Anda tidak terdaftar sebagai Admin');
        window.location.hash = '#/homepage';
        return;
      }
      selectedRoutes = adminRoutes;
    } else {
      selectedRoutes = routes;
    }

    const page = selectedRoutes[url] || selectedRoutes['/'];
    let renderedContent;

    if (typeof page === 'function') {
      renderedContent = await page();
    } else {
      renderedContent = page;
    }

    if (renderedContent && typeof renderedContent.render === 'function') {
      this._content.innerHTML = await renderedContent.render();
      await renderedContent.afterRender();
    } else {
      this._content.innerHTML = renderedContent;
    }
  }
}

export default App;
