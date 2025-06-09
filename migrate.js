import { AdminsModel } from './backend/admins/adminsModel.js';

(async () => {
  await AdminsModel.createTable();
})();