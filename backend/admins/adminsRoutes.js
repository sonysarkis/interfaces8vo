import { Router } from 'express';
import { AdminsController } from './adminsController.js';
import fetch from 'node-fetch';

export function createAdminsRouter() {
    const adminsRouter = Router();
    const adminsController = new AdminsController();

    adminsRouter.post('/login', adminsController.login);
    adminsRouter.post('/register', adminsController.register);
    adminsRouter.get('/auth', adminsController.getAuth);
    adminsRouter.post('/user/:id', adminsController.update);
    adminsRouter.post('/user/:id/status', adminsController.toggleStatus);
    adminsRouter.get('/user/:id', adminsController.get);

    // Proxy para Nominatim (GET)
    adminsRouter.get('/nominatim', async (req, res) => {
        const { url } = req.query;
        if (!url || !url.startsWith('https://nominatim.openstreetmap.org/')) {
            return res.status(400).json({ error: 'URL inválida' });
        }
        try {
            const response = await fetch(url, {
                headers: {
                    'User-Agent': 'YourAppName/1.0'
                }
            });
            const data = await response.json();
            res.json(data);
        } catch (err) {
            res.status(500).json({ error: 'Error al consultar Nominatim' });
        }
    });

    return adminsRouter;
}