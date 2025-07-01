import { AdminsModel } from './backend/admins/adminsModel.js';
import { StylesModel } from './backend/styles/stylesModel.js';

(async () => {
  await AdminsModel.createTable();
  await StylesModel.createTable();
})();