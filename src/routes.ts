import { Request, Response, Router } from 'express';

import { ensureSuper } from './middlewares/ensureSuper';
// import { ensureEmployee } from './middlewares/ensureEmployee';
// import { ensureNormal } from './middlewares/ensureNormal';
import { ensureAuthenticated } from './middlewares/ensureAuthenticated';

import { AuthenticateUserController } from './controllers/AuthenticateUserController';
import { UserController } from './controllers/UserController';
import { MapController } from './controllers/MapController';
import { BuildingController } from './controllers/BuildingController';
import { OrganizationController } from './controllers/OrganizationController';
import { PointParentController } from './controllers/pointControllers/PointParentController';
import { PointChildController } from './controllers/pointControllers/PointChildController';
import { ForgotPasswordController } from './controllers/ForgotPasswordController';
import { ChangePasswordController } from './controllers/ChangePasswordController';

const router = Router();

const userController = new UserController();
const mapController = new MapController();
const buildingController = new BuildingController();
const organizationController = new OrganizationController();
const authenticateUserController = new AuthenticateUserController();
const pointParentController = new PointParentController();
const pointChildController = new PointChildController();
const forgotPasswordController = new ForgotPasswordController();
const changePasswordControler = new ChangePasswordController();

router.get('/', (req: Request, resp: Response) =>
  resp.status(200).json({ message: 'Welcome api-proex' }),
);

router.post('/users', ensureAuthenticated, ensureSuper, userController.create);
router.get('/users', ensureAuthenticated, userController.read);
router.get('/user', ensureAuthenticated, userController.readByToken);
router.put('/users/:id', ensureAuthenticated, ensureSuper, userController.update);
router.delete('/users/:id', ensureAuthenticated, ensureSuper, userController.delete);

router.post('/maps', ensureAuthenticated, ensureSuper, mapController.create);
router.get('/maps', ensureAuthenticated, mapController.read);
router.get('/maps/:id', ensureAuthenticated, mapController.readById);
router.put('/maps/:id', ensureAuthenticated, ensureSuper, mapController.update);
router.delete('/maps/:id', ensureAuthenticated, ensureSuper, mapController.delete);

router.post('/buildings', ensureAuthenticated, ensureSuper, buildingController.create);
router.get('/buildings', ensureAuthenticated, buildingController.read);
router.get('/buildings/:id', ensureAuthenticated, buildingController.readById);
router.put('/buildings/:id', ensureAuthenticated, ensureSuper, buildingController.update);
router.delete('/buildings/:id', ensureAuthenticated, ensureSuper, buildingController.delete);

router.post('/organizations', ensureAuthenticated, ensureSuper, organizationController.create);
router.get('/organizations', ensureAuthenticated, organizationController.read);
router.get('/organizations/:id', ensureAuthenticated, organizationController.readById);
router.put('/organizations/:id', ensureAuthenticated, ensureSuper, organizationController.update);
router.delete(
  '/organizations/:id',
  ensureAuthenticated,
  ensureSuper,
  organizationController.delete,
);

//router.get('/points', ensureAuthenticated, pointParentController.read);
//router.get('/points/:id', ensureAuthenticated, pointParentController.readById);
router.post('/points/parent', ensureAuthenticated, ensureSuper, pointParentController.create);
router.put('/points/parent/:id', ensureAuthenticated, ensureSuper, pointParentController.update);
router.delete('/points/parent/:id', ensureAuthenticated, ensureSuper, pointParentController.delete);

router.post('/points/child', ensureAuthenticated, ensureSuper, pointChildController.create);
router.put('/points/child/:id', ensureAuthenticated, ensureSuper, pointChildController.update);
router.delete('/points/child/:id', ensureAuthenticated, ensureSuper, pointChildController.delete);

router.post('/login', authenticateUserController.handle);
router.post('/forgot-password', forgotPasswordController.handle);
router.post('/change-password', changePasswordControler.handle);

export { router };
