import { Router } from 'express';
import { StylesController } from './stylesController.js';

export function createStylesRouter() {
    const stylesRouter = Router();
    const stylesController = new StylesController();

    stylesRouter.post('/create', stylesController.create);
    stylesRouter.post('/delete', stylesController.delete);
    stylesRouter.get('/index', stylesController.index);
    stylesRouter.post('/apply', stylesController.apply);
    stylesRouter.get('/selected', stylesController.selected);

    return stylesRouter;
}