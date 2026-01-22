require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./models');

const authRoutes = require('./routes/auth.routes');
const taskRoutes = require('./routes/task.routes');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send('Chào mừng đến với API của To-do App!'));

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

const PORT = process.env.PORT || 5000;

async function waitForDb(maxRetries = 30, delayMs = 1500) {
  for (let i = 1; i <= maxRetries; i++) {
    try {
      await db.sequelize.authenticate();
      console.log('✅ DB connected');
      return;
    } catch (e) {
      console.log(`⏳ DB not ready (try ${i}/${maxRetries})...`);
      await new Promise(r => setTimeout(r, delayMs));
    }
  }
  throw new Error('DB not ready after retries');
}

async function initDb() {
  await waitForDb();

  // ✅ KHÔNG dùng alter:true nữa để tránh tạo quá nhiều keys
  await db.sequelize.sync();

  // Seed roles
  await db.Role.findOrCreate({ where: { role_name: 'Manager' } });
  await db.Role.findOrCreate({ where: { role_name: 'Staff' } });

  console.log('✅ DB synced & roles seeded');
}

initDb()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on ${PORT}`));
  })
  .catch((err) => {
    console.error('DB init error:', err.message);
    process.exit(1);
  });
