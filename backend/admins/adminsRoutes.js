import { Router } from 'express';
import { AdminsController } from './adminsController.js';

export function createAdminsRouter() {
    const adminsRouter = Router();
    const adminsController = new AdminsController();

    adminsRouter.post('/login', adminsController.login);
    adminsRouter.get('/auth', adminsController.getAuth);

    return adminsRouter;
}