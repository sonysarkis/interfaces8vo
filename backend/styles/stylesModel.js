import 'dotenv/config';
import createConnection from '../connection.js';

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

    static async createTable() {
        let connection;
        try {
            connection = await createConnection();
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
                    weightBody VARCHAR(500) NOT NULL
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