import express from 'express';
import auth from '../middlewares/auth.js';
import adminStatsRoutes from './admin/admin.stats.routes.js';
import adminUsersRoutes from './admin/admin.users.routes.js';
import adminCompaniesRoutes from './admin/admin.companies.routes.js';
import adminJobsRoutes from './admin/admin.jobs.routes.js';
import adminApplicationsRoutes from './admin/admin.applications.routes.js';
import adminMessagesRoutes from './admin/admin.messages.routes.js';
import adminFiltersRoutes from './admin/admin.filters.routes.js';

const router = express.Router();

// Middleware pour vérifier que l'utilisateur est admin
router.use(auth(['admin']));

// Routes par domaine
router.use('/', adminStatsRoutes);
router.use('/', adminUsersRoutes);
router.use('/', adminCompaniesRoutes);
router.use('/', adminJobsRoutes);
router.use('/', adminApplicationsRoutes);
router.use('/', adminMessagesRoutes);
router.use('/', adminFiltersRoutes);

export default router;
