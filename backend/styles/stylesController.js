import { validateStyle } from "./stylesValidate.js";
import { StylesModel } from "./stylesModel.js";
import fs from 'fs';
import path from 'path';

class StylesController {
    create = async (req, res) => {
        /*const validationResult = validateStyle(req.body);
        if (!validationResult.success) {
            console.error(validationResult.error.message);
            return res.status(400).json({ error: JSON.parse(validationResult.error.message) });
        }*/
        try {
            const response = await StylesModel.store({ style: req.body });
            return res.json(response);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: error.message });
        }
    }

    index = async (req, res) => {
        try {
            const styles = await StylesModel.getAll();
            return res.json(styles);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error al obtener los estilos' });
        }
    }

    delete = async (req, res) => {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ error: 'El nombre del estilo es requerido' });
        }
        try {
            const response = await StylesModel.destroy({ name: name });
            return res.json(response);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: error.message });
        }
    }

    apply = async (req, res) => {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ error: 'El nombre del estilo es requerido' });
        }
        try {
            const response = await StylesModel.select({ name: name });
            return res.json(response);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: error.message });
        }
    }

    selected = async (req, res) => {
        try {
            const style = await StylesModel.getSelected();
            return res.json(style);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error al obtener el estilo seleccionado' });
        }
    }
    
    uploadFont = async (req, res) => {
        if (!req.file) {
            return res.status(400).json({ error: 'No se ha subido ningún archivo' });
        }
        try {
            // Ruta destino para guardar la fuente
            const fontsDir = path.resolve('dist/application/browser/fonts');
            // Crear el directorio si no existe
            if (!fs.existsSync(fontsDir)) {
                fs.mkdirSync(fontsDir, { recursive: true });
            }
            // Ruta final del archivo
            const destPath = path.join(fontsDir, req.file.originalname);
            // Mover el archivo subido a la carpeta de fuentes
            fs.renameSync(req.file.path, destPath);
    
            return res.json({
                message: 'Archivo subido correctamente',
                file: {
                    name: req.file.originalname,
                    path: `fonts/${req.file.originalname}`
                }
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: error.message });
        }
    }
}

export { StylesController };