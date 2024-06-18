import { Dashboard } from '../views/admin-pages/dashboard';
import { Blog } from '../views/admin-pages/admin-blogs';
import { Gallery } from '../views/admin-pages/admin-gallery';
import { Event } from '../views/admin-pages/admin-event';
import { Trash } from '../views/admin-pages/admin-trash';

const adminRoutes = {
  '/': Dashboard,
  '/dashboard': Dashboard,
  '/blogs': Blog,
  '/gallery': Gallery,
  '/event': Event,
  '/trash': Trash,
};

export default adminRoutes;
