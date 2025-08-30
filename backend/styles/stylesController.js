import { validateStyle } from "./stylesValidate.js";
import { StylesModel } from "./stylesModel.js";
import fs from 'fs';
import path from 'path';
import { buildFonts } from "./buildFonts.js";
import { changeStyle, resetStyle } from "./stylesChange.js";

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

    confirmStyle = async (req, res) => {
        try {
            const result = await changeStyle();
            if (result){
                res.json({ success: true });
            } else {
                res.json({ success: false });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    defaultStyle = (req, res) => {
        try {
            const result = resetStyle();
            if (result){
                res.json({ success: true });
            } else {
                res.json({ success: false });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
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

    getFonts = async (req, res) => {
        try {
            // Ruta de la carpeta de fuentes
            const fontsDir = path.resolve('dist/application/browser/fonts');
            // Verificar si la carpeta existe
            if (!fs.existsSync(fontsDir)) {
                return res.status(404).json({ error: 'No se encontraron fuentes' });
            }
            // Leer los archivos de la carpeta
            const files = fs.readdirSync(fontsDir);
            // Filtrar solo los archivos de fuentes y quitar la extensión
            const fonts = files
                .filter(file => /\.(ttf|otf|woff|woff2)$/i.test(file))
                .map(file => path.basename(file, path.extname(file)));

            return res.json(fonts);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: error.message });
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
            const ext = path.extname(req.file.originalname);
            const baseName = path.basename(req.file.originalname, ext);
            const newFileName = ext === '.ttf' ? `${baseName}C${ext}` : req.file.originalname;
            const destPath = path.join(fontsDir, newFileName);
            // Mover el archivo subido a la carpeta de fuentes
            fs.renameSync(req.file.path, destPath);

            buildFonts(); // Regenerar los @font-face en el CSS
    
            return res.json({
                message: 'Archivo subido correctamente',
                file: {
                    name: `${baseName}C`, // remove the .ttf extension
                    path: `fonts/${newFileName}`
                }
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: error.message });
        }
    }

    deleteFont = async (req, res) => {
        const { fontName } = req.body;
        if (!fontName) {
            return res.status(400).json({ error: 'El nombre de la fuente es requerido' });
        }
        try {
            // Ruta de la carpeta de fuentes
            const fontsDir = path.resolve('dist/application/browser/fonts');
            const fontPath = path.join(fontsDir, `${fontName}.ttf`);
            // Verificar si el archivo existe
            if (!fs.existsSync(fontPath)) {
                return res.status(404).json({ error: 'Fuente no encontrada' });
            }
            // Eliminar el archivo
            fs.unlinkSync(fontPath);
            return res.json({ message: 'Fuente eliminada correctamente' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: error.message });
        }
    }
}

export { StylesController };