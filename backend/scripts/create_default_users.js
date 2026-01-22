const db = require('../models');
const bcrypt = require('bcryptjs');

async function run(){
  try{
    await db.sequelize.authenticate();
    console.log('DB connected');

    // find roles
    const managerRole = await db.Role.findOne({ where: { role_name: 'Manager' } });
    const staffRole = await db.Role.findOne({ where: { role_name: 'Employee' } });

    if(!managerRole || !staffRole) return console.error('Roles not found. Run DB sync first.');

    const users = [
      { username: 'admin', full_name: 'Admin User', role_id: managerRole.role_id },
      { username: 'alice', full_name: 'Alice Staff', role_id: staffRole.role_id }
    ];

    for(const u of users){
      const exists = await db.User.findOne({ where: { username: u.username } });
      if(exists){
        console.log('User exists:', u.username);
        continue;
      }
      const hash = await bcrypt.hash('ChangeMe123!', 10);
      const created = await db.User.create({ username: u.username, full_name: u.full_name, password_hash: hash, role_id: u.role_id });
      console.log('Created user', created.username);
    }

    process.exit(0);
  }catch(e){
    console.error('Error:', e.message);
    process.exit(1);
  }
}

run();
