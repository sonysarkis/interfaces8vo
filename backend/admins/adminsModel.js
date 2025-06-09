import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import createConnection from '../connection.js';

class AdminsModel {
    static async register({ admin }) {
        const {
            password,
            email
        } = admin;
        const hashedPassword = bcrypt.hashSync(password, Number(process.env.SALT_ROUNDS));

        let connection;
        try {
            connection = await createConnection();
            const [result] = await connection.execute(
                "INSERT INTO admins (password, email) VALUES (?, ?)",
                [hashedPassword, email]
            );
            // No se retorna la contraseña
            return {
                email: email
            };
        } catch (error) {
            throw new Error(`Error al crear el administrador ${email}: ${error.message}`);
        } finally {
            if (connection) {
                await connection.end();
            }
        }
    }

    static async login({ admin }) {
        const {
            email,
            password
        } = admin;
        let connection;
        try {
            connection = await createConnection();
            const [rows] = await connection.execute('SELECT * FROM admins WHERE email = ?', [email]);
            if (rows.length === 0) {
                throw new Error(`El administrador ${email} no existe.`);
            }
            const user = rows[0];
            const isValid = await bcrypt.compare(password, user.password);
            if (!isValid) {
                throw new Error("Contraseña inválida.");
            }

            const token = jwt.sign(
                { username: user.username, email: user.email },
                process.env.SECRET_JWT_KEY,
                {
                    expiresIn: "1h"
                }
            );
            return {
                email: user.email,
                token: token
            };
        } catch (error) {
            throw new Error(error.message);
        } finally {
            if (connection) {
                await connection.end();
            }
        }
    }

    static async verifyToken({ token }) {
        return jwt.verify(token, process.env.SECRET_JWT_KEY, (err) => {
            if (err) {
                return { valid: false };
            }
            return { valid: true };
        });
    }

    static async createTable() {
        let connection;
        try {
            const hashedPassword = bcrypt.hashSync(process.env.ADMIN_PASSWORD, Number(process.env.SALT_ROUNDS));
            connection = await createConnection();
            const createTableQuery = `
                CREATE TABLE IF NOT EXISTS admins (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    email VARCHAR(500) NOT NULL UNIQUE,
                    password VARCHAR(500) NOT NULL
                );
            `;
            const insertAdminQuery = `INSERT IGNORE INTO admins (email, password) VALUES ('admin@admin.com', '${hashedPassword}');`
            await connection.execute(createTableQuery);
            await connection.execute(insertAdminQuery);
            console.log("Tabla 'admins' creada o ya existe.");
        } catch (error) {
            console.error(`Error al crear la tabla 'admins': ${error.message}`);
        } finally {
            if (connection) {
                await connection.end();
            }
        }
    }
}

export { AdminsModel };