import 'dotenv/config';
import createConnection from '../connection.js';
import { changeStyle } from './stylesChange.js';

class StylesModel {
    static async getAll() {
        let connection;
        try {
            connection = await createConnection();
            const [rows] = await connection.execute(`SELECT * FROM styles`);
            return rows;
        } catch (error) {
            throw new Error(`Error al obtener los estilos: ${error.message}`);
        } finally {
            if (connection) {
                await connection.end();
            }
        }
    }

    static async getSelected() {
        let connection;
        try {
            connection = await createConnection();
            const [rows] = await connection.execute(`SELECT * FROM styles WHERE selected = TRUE`);
            if (rows.length === 0) {
                throw new Error('No hay estilos seleccionados');
            }
            return rows[0];
        } catch (error) {
            throw new Error(`Error al obtener el estilo seleccionado: ${error.message}`);
        } finally {
            if (connection) {
                await connection.end();
            }
        }
    }

    static async store({ style }) {
        const {
            name,
            primary,
            secondary,
            accent,
            background,
            text,
            familyTitle,
            sizeTitle,
            weightTitle,
            familySubtitle,
            sizeSubtitle,
            weightSubtitle,
            familyBody,
            sizeBody,
            weightBody
        } = style;
    
        let connection;
        try {
            connection = await createConnection();
            const [result] = await connection.execute(
                `INSERT INTO styles (
                    name, \`primary\`, \`secondary\`, accent, background, \`text\`,
                    familyTitle, sizeTitle, weightTitle,
                    familySubtitle, sizeSubtitle, weightSubtitle,
                    familyBody, sizeBody, weightBody
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    name, primary, secondary, accent, background, text,
                    familyTitle, sizeTitle, weightTitle,
                    familySubtitle, sizeSubtitle, weightSubtitle,
                    familyBody, sizeBody, weightBody
                ]
            );
            return { name: name, message: 'Estilo creado correctamente' };
        } catch (error) {
            throw new Error(`Error al crear el estilo: ${error.message}`);
        } finally {
            if (connection) {
                await connection.end();
            }
        }
    }

    static async destroy({ name }) {
        let connection;
        try {
            connection = await createConnection();
            const [result] = await connection.execute(
                `DELETE FROM styles WHERE name = ?`,
                [name]
            );
            if (result.affectedRows === 0) {
                throw new Error('Estilo no encontrado');
            }
            return { message: 'Estilo eliminado correctamente' };
        } catch (error) {
            throw new Error(`Error al eliminar el estilo: ${error.message}`);
        } finally {
            if (connection) {
                await connection.end();
            }
        }
    }

    static async select({ name }) {
        let connection;
        try {
            connection = await createConnection();
            // Primero deselecciona todos
            await connection.execute(
                `UPDATE styles SET selected = FALSE WHERE selected = TRUE`
            );
            // Luego selecciona el nuevo
            const [result] = await connection.execute(
                `UPDATE styles SET selected = TRUE WHERE name = ?`,
                [name]
            );
            if (result.affectedRows === 0) {
                throw new Error('Estilo no encontrado');
            }
            await changeStyle();
            return { message: 'Estilo seleccionado correctamente' };
        } catch (error) {
            throw new Error(`Error al seleccionar el estilo: ${error.message}`);
        } finally {
            if (connection) {
                await connection.end();
            }
        }
    }

    static async createTable() {
        let connection;
        try {
            connection = await createConnection();
            const dropTableQuery = `DROP TABLE IF EXISTS styles;`;
            await connection.execute(dropTableQuery);
            const createTableQuery = `
                CREATE TABLE IF NOT EXISTS styles (
                    name VARCHAR(500) PRIMARY KEY,
                    \`primary\` VARCHAR(500) NOT NULL,
                    \`secondary\` VARCHAR(500) NOT NULL,
                    accent VARCHAR(500) NOT NULL,
                    background VARCHAR(500) NOT NULL,
                    \`text\` VARCHAR(500) NOT NULL,
                    familyTitle VARCHAR(500) NOT NULL,
                    sizeTitle VARCHAR(500) NOT NULL,
                    weightTitle VARCHAR(500) NOT NULL,
                    familySubtitle VARCHAR(500) NOT NULL,
                    sizeSubtitle VARCHAR(500) NOT NULL,
                    weightSubtitle VARCHAR(500) NOT NULL,
                    familyBody VARCHAR(500) NOT NULL,
                    sizeBody VARCHAR(500) NOT NULL,
                    weightBody VARCHAR(500) NOT NULL,
                    selected BOOLEAN DEFAULT FALSE
                );
            `;
            await connection.execute(createTableQuery);
            console.log("Tabla 'styles' creada o ya existe.");
        } catch (error) {
            console.error(`Error al crear la tabla 'styles': ${error.message}`);
        } finally {
            if (connection) {
                await connection.end();
            }
        }
    }
}

export { StylesModel };