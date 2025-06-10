import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { createAdminsRouter } from './backend/admins/adminsRoutes.js';
import { createStylesRouter } from './backend/styles/stylesRoutes.js';
import { changeStyle } from './backend/styles/stylesChange.js';
import { buildFonts } from './backend/styles/buildFonts.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, 'dist/application/browser/')));

const FrontRoutes = ['/', '/login', '/registro', '/personalization', "/personalization/landing", "/personalization/login-preview"];
FrontRoutes.forEach(route => {
  app.get(route, (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/application/browser/index.html'));
  });
});

app.use("/admin-auth", createAdminsRouter());
app.use("/styles", createStylesRouter());

await changeStyle();
buildFonts();

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});