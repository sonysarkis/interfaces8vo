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

    static async getUserDataById(id) {
        let connection;
        try {
            connection = await createConnection();
            const [rows] = await connection.execute('SELECT * FROM admins WHERE id = ?', [id]);
            if (rows.length === 0) {
                throw new Error(`El usuario con id ${id} no existe.`);
            }
            return rows[0];
        } catch (error) {
            throw new Error(`Error al obtener los datos del usuario: ${error.message}`);
        } finally {
            if (connection) {
                await connection.end();
            }
        }
    }

    static async getallUsers() {
        let connection;
        try {
            connection = await createConnection();
            const [rows] = await connection.execute('SELECT * FROM admins');
            return rows.map(user => {
                // Excluir la contraseña del resultado
                const { password, ...userWithoutPassword } = user;
                return userWithoutPassword;
            });
        } catch (error) {
            throw new Error(`Error al obtener todos los usuarios: ${error.message}`);
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
                token: token,
                type: user.type,
                status: user.status,
                id: user.id
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
            connection = await createConnection();
            const createTableQuery = `
                CREATE TABLE IF NOT EXISTS admins (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    email VARCHAR(500) NOT NULL UNIQUE,
                    password VARCHAR(500) NOT NULL,
                    type ENUM('admin', 'user') DEFAULT 'user',
                    status ENUM('active', 'inactive') DEFAULT 'active',
                    nombre VARCHAR(100) DEFAULT NULL,
                    apellido VARCHAR(100) DEFAULT NULL,
                    segundo_apellido VARCHAR(100) DEFAULT NULL,
                    edad INT DEFAULT NULL,
                    genero VARCHAR(20) DEFAULT NULL,
                    telefono VARCHAR(30) DEFAULT NULL,
                    username VARCHAR(100) DEFAULT NULL,
                    fecha_nacimiento DATE DEFAULT NULL,
                    grupo_sanguineo VARCHAR(10) DEFAULT NULL,
                    altura FLOAT DEFAULT NULL,
                    peso FLOAT DEFAULT NULL,
                    color_ojos VARCHAR(30) DEFAULT NULL,
                    pelo_color VARCHAR(30) DEFAULT NULL,
                    pelo_tipo VARCHAR(30) DEFAULT NULL,
                    ip VARCHAR(45) DEFAULT NULL,
                    imagen VARCHAR(500) DEFAULT NULL,
                    direccion VARCHAR(200) DEFAULT NULL,
                    ciudad VARCHAR(100) DEFAULT NULL,
                    estado VARCHAR(100) DEFAULT NULL,
                    estado_code VARCHAR(10) DEFAULT NULL,
                    pais VARCHAR(100) DEFAULT NULL,
                    codigo_postal VARCHAR(20) DEFAULT NULL,
                    coord_lat FLOAT DEFAULT NULL,
                    coord_lng FLOAT DEFAULT NULL,
                    banco_tipo_tarjeta VARCHAR(30) DEFAULT NULL,
                    banco_numero_tarjeta VARCHAR(30) DEFAULT NULL,
                    banco_expiracion VARCHAR(10) DEFAULT NULL,
                    banco_iban VARCHAR(50) DEFAULT NULL,
                    banco_moneda VARCHAR(10) DEFAULT NULL,
                    compania_nombre VARCHAR(100) DEFAULT NULL,
                    compania_departamento VARCHAR(100) DEFAULT NULL,
                    compania_titulo VARCHAR(100) DEFAULT NULL,
                    compania_direccion VARCHAR(200) DEFAULT NULL,
                    compania_ciudad VARCHAR(100) DEFAULT NULL,
                    compania_estado VARCHAR(100) DEFAULT NULL,
                    compania_estado_code VARCHAR(10) DEFAULT NULL,
                    compania_pais VARCHAR(100) DEFAULT NULL,
                    compania_codigo_postal VARCHAR(20) DEFAULT NULL,
                    compania_coord_lat FLOAT DEFAULT NULL,
                    compania_coord_lng FLOAT DEFAULT NULL,
                    mac VARCHAR(30) DEFAULT NULL,
                    universidad VARCHAR(200) DEFAULT NULL,
                    ein VARCHAR(20) DEFAULT NULL,
                    ssn VARCHAR(20) DEFAULT NULL,
                    user_agent VARCHAR(300) DEFAULT NULL,
                    cripto_moneda VARCHAR(30) DEFAULT NULL,
                    cripto_wallet VARCHAR(100) DEFAULT NULL,
                    cripto_network VARCHAR(50) DEFAULT NULL
                );
            `;
            const hashedPassword = bcrypt.hashSync('admin_password', Number(process.env.SALT_ROUNDS));
            const insertAdminQuery = `
                INSERT INTO admins (email, password, type)
                VALUES ('admin@example.com', '${hashedPassword}', 'admin')
            `;
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

    static async updateUserById(id, data) {
        const fields = [
            'email','type','status','nombre','apellido','segundo_apellido','edad','genero','telefono','username','fecha_nacimiento','grupo_sanguineo','altura','peso','color_ojos','pelo_color','pelo_tipo','ip','imagen','direccion','ciudad','estado','estado_code','pais','codigo_postal','coord_lat','coord_lng','banco_tipo_tarjeta','banco_numero_tarjeta','banco_expiracion','banco_iban','banco_moneda','compania_nombre','compania_departamento','compania_titulo','compania_direccion','compania_ciudad','compania_estado','compania_estado_code','compania_pais','compania_codigo_postal','compania_coord_lat','compania_coord_lng','mac','universidad','ein','ssn','user_agent','cripto_moneda','cripto_wallet','cripto_network'
        ];
        const updates = [];
        const values = [];
        for (const field of fields) {
            if (
                field in data &&
                data[field] !== undefined &&
                data[field] !== null &&
                !(typeof data[field] === 'string' && data[field].trim() === '')
            ) {
                updates.push(`${field} = ?`);
                values.push(data[field]);
            }
        }
        // Manejo especial para password
        if ('password' in data && data.password && data.password.trim() !== '') {
            updates.push('password = ?');
            const hashedPassword = bcrypt.hashSync(data.password, Number(process.env.SALT_ROUNDS));
            values.push(hashedPassword);
        }
        if (updates.length === 0) throw new Error('No hay campos válidos para actualizar.');
        let connection;
        try {
            connection = await createConnection();
            await connection.execute(
                `UPDATE admins SET ${updates.join(', ')} WHERE id = ?`,
                [...values, id]
            );
            return { success: true };
        } catch (error) {
            throw new Error('Error al actualizar el usuario: ' + error.message);
        } finally {
            if (connection) await connection.end();
        }
    }

    static async toggleStatusById(id) {
        let connection;
        try {
            connection = await createConnection();
            const [rows] = await connection.execute('SELECT status FROM admins WHERE id = ?', [id]);
            if (rows.length === 0) {
                throw new Error('Usuario no encontrado');
            }
            const currentStatus = rows[0].status;
            const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
            await this.updateUserById(id, { status: newStatus });
            return { success: true, status: newStatus };
        } catch (error) {
            throw new Error('Error al alternar el status: ' + error.message);
        } finally {
            if (connection) await connection.end();
        }
    }
}

export { AdminsModel };