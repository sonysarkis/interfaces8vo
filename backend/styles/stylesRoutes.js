import { Router } from 'express';
import { StylesController } from './stylesController.js';
import multer from 'multer';
import path from 'path';

// Configura multer para guardar archivos temporalmente
const upload = multer({ dest: path.resolve('uploads/') });

export function createStylesRouter() {
    const stylesRouter = Router();
    const stylesController = new StylesController();

    stylesRouter.post('/create', stylesController.create);
    stylesRouter.post('/delete', stylesController.delete);
    stylesRouter.get('/index', stylesController.index);
    stylesRouter.post('/apply', stylesController.apply);
    stylesRouter.get('/selected', stylesController.selected);
    stylesRouter.get('/fonts', stylesController.getFonts);
    stylesRouter.post('/upload-font', upload.single('file'), stylesController.uploadFont);
    stylesRouter.post('/delete-font', stylesController.deleteFont);
    stylesRouter.get('/confirm', stylesController.confirmStyle);
    stylesRouter.get('/default', stylesController.defaultStyle);

    return stylesRouter;
}