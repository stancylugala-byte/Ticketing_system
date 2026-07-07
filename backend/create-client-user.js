require('dotenv').config();
const db = require('./src/models');
const { User } = db;

async function createClientUser() {
  try {
    console.log('👤 Creating client user...');

    // Create client user with a simple password hash (for testing)
    const client = await User.create({
      full_name: 'Test Client',
      email: 'client@test.com',
      password: '$2b$10$vI8aWBnW3fID.ZQ4/zo1G.fI9qFjGr0Pm14v8RH2X.YgxnQ5XZ4uK', // "client123"
      role: 'Client'
    });

    console.log('✅ Client user created successfully!');
    console.log(`   Email: client@test.com`);
    console.log(`   Password: client123`);
    console.log(`   Role: Client`);
    console.log(`\n🎯 Login at: http://localhost:5174/login`);
    console.log(`   Then go to: http://localhost:5174/dashboard/client`);
    
    process.exit(0);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      console.log('ℹ️  User already exists!');
      console.log(`   Email: client@test.com`);
      console.log(`   Password: client123`);
    } else {
      console.error('❌ Failed to create user:', error);
    }
    process.exit(1);
  }
}

createClientUser();
