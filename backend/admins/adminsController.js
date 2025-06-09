import { validateLogin } from "./adminsValidate.js";
import { AdminsModel } from "./adminsModel.js";
import jwt from "jsonwebtoken";
import 'dotenv/config';

class AdminsController {
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
                email: response.email
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