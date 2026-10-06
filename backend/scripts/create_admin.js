import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import config from '../config.js';
import userMongo from '../mongo-db/user_mongo.js';

const { ADMIN_USERNAME, ADMIN_PASSWORD, ADMIN_DISPLAY_NAME, ADMIN_EMAIL } = process.env;

if (!ADMIN_USERNAME || !ADMIN_PASSWORD || !ADMIN_DISPLAY_NAME || !ADMIN_EMAIL) {
  console.error('Define ADMIN_USERNAME, ADMIN_PASSWORD, ADMIN_DISPLAY_NAME y ADMIN_EMAIL.');
  process.exitCode = 1;
} else if (ADMIN_PASSWORD.length < 8) {
  console.error('ADMIN_PASSWORD debe tener al menos 8 caracteres.');
  process.exitCode = 1;
} else {
  try {
    await mongoose.connect(config.dbConnection);
    if (await userMongo.exists({ role: 'admin' }))
      throw new Error('Ya existe un administrador; no se creó otra cuenta.');

    await userMongo.create({
      username: ADMIN_USERNAME.trim(),
      password: await bcrypt.hash(ADMIN_PASSWORD, 10),
      displayName: ADMIN_DISPLAY_NAME.trim(),
      email: ADMIN_EMAIL.trim().toLowerCase(),
      role: 'admin',
    });
    console.log(`Administrador "${ADMIN_USERNAME}" creado correctamente.`);
  } catch (error) {
    console.error('No se pudo crear el administrador:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}
