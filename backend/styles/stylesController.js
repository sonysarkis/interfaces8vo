import { validateStyle } from "./stylesValidate.js";
import { StylesModel } from "./stylesModel.js";

class StylesController {
    create = async (req, res) => {
        const validationResult = validateStyle(req.body);
        if (!validationResult.success) {
            console.error(validationResult.error.message);
            return res.status(400).json({ error: JSON.parse(validationResult.error.message) });
        }
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
}

export { StylesController };