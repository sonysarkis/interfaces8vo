import { Router } from 'express';
import { AdminsController } from './adminsController.js';

export function createAdminsRouter() {
    const adminsRouter = Router();
    const adminsController = new AdminsController();

    adminsRouter.post('/login', adminsController.login);
    adminsRouter.post('/register', adminsController.register);
    adminsRouter.get('/auth', adminsController.getAuth);
    adminsRouter.post('/:id', adminsController.update);
    adminsRouter.post('/:id/status', adminsController.toggleStatus);
    adminsRouter.get('/:id', adminsController.get);

    return adminsRouter;
}