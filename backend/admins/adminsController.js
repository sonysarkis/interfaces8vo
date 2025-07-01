import { validateLogin } from "./adminsValidate.js";
import { AdminsModel } from "./adminsModel.js";
import jwt from "jsonwebtoken";
import 'dotenv/config';

class AdminsController {
    register = async (req, res) => {
        const authResult = await this.auth(req);
        if (authResult.valid) {
            return res.status(400).json({ error: "Cierra la sesión actual para poder registrarte" });
        }
        const result = validateLogin(req.body)
        if (!result.success) {
            console.log(result.error.message)
            return res.status(400).json({ error: JSON.parse(result.error.message) })
        }
        const admin = result.data    
        try {
            const response = await AdminsModel.register({ admin })
            return res.json(response)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: 'Error al crear el administrador' });
        }
    }

    login = async (req, res) => {
        const authResult = await this.auth(req);
        if (authResult.valid) {
            return res.status(400).json({ error: "Ya has iniciado sesión" });
        }
        const result = validateLogin(req.body);
        if (!result.success) {
            return res.status(400).json({ error: JSON.parse(result.error.message) });
        }

        const admin = result.data;
        try {
            const response = await AdminsModel.login({ admin });
            return res.status(200).json({
                message: `El administrador ${response.email} ha iniciado sesión exitosamente`,
                token: response.token,
                email: response.email,
                type: response.type,
                status: response.status,
                id: response.id
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: error.message });
        }
    }

    getAuth = async (req, res) => {
        const authResult = await this.auth(req);
        return res.json(authResult);
    }

    update = async (req, res) => {
        const { id } = req.params;
        const data = req.body;
        try {
            const result = await AdminsModel.updateUserById(id, data);
            return res.json({ success: true, message: 'Usuario actualizado correctamente', result });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: error.message });
        }
    }

    toggleStatus = async (req, res) => {
        const { id } = req.params;
        try {
            const result = await AdminsModel.toggleStatusById(id);
            return res.json({ success: true, message: 'Estado del usuario actualizado correctamente', result });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: error.message });
        }
    }

    get = async (req, res) => {
        const { id } = req.params;
        try {
            const result = await AdminsModel.getUserDataById(id);
            return res.json(result);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: error.message });
        }
    }

    getall = async (req, res) => {
        try {
            const result = await AdminsModel.getallUsers();
            return res.json(result);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: error.message });
        }
    }

    async auth(req) {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token || token === 'null' || token === 'undefined' || token === '') {
            return { valid: false };
        }

        try {
            const decoded = await new Promise((resolve, reject) => {
                jwt.verify(token, process.env.SECRET_JWT_KEY, (err, decoded) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(decoded);
                    }
                });
            });
            const admin = decoded.admin;
            return { valid: true, admin: admin };

        } catch (err) {
            console.log(err);
            return { valid: false, error: `Error al verificar el token:, ${err.message}` };
        }
    }
}

export { AdminsController };