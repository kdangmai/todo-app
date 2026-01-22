const sequelize = require('../config/database');
const { Sequelize } = require('sequelize');
const bcrypt = require('bcryptjs');

async function run(){
  try{
    await sequelize.authenticate();
    console.log('DB connected');
    const qi = sequelize.getQueryInterface();
    const table = 'users';
    let desc;
    try{ desc = await qi.describeTable(table); }catch(e){
      console.error('Table users not found:', e.message); process.exit(1);
    }

    if(desc.password_hash){
      console.log('Column password_hash already exists.');
      process.exit(0);
    }

    console.log('Adding column password_hash (nullable for now)...');
    await qi.addColumn(table, 'password_hash', { type: Sequelize.STRING, allowNull: true });

    // set default password for existing users
    console.log('Setting temporary password for existing users...');
    const [users] = await sequelize.query(`SELECT user_id, username FROM ${table}`);
    for(const u of users){
      const hash = await bcrypt.hash('ChangeMe123!', 10);
      await sequelize.query(`UPDATE ${table} SET password_hash = :hash WHERE user_id = :id`, { replacements: { hash, id: u.user_id } });
    }

    // now make column non-nullable
    console.log('Altering column to NOT NULL...');
    await qi.changeColumn(table, 'password_hash', { type: Sequelize.STRING, allowNull: false });

    console.log('Done. Existing users have password: ChangeMe123! — ask them to change it.');
    process.exit(0);
  }catch(e){
    console.error('Error:', e.message);
    process.exit(1);
  }
}

run();
