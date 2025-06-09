import { AdminsModel } from './backend/admins/adminsModel.js';
import ApisModel from './backend/apis/apisModel.js';

(async () => {
  await AdminsModel.createTable();
  await ApisModel.createTable();
})();