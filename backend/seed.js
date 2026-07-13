require('dotenv').config();
const bcrypt = require('bcryptjs');
const db     = require('./src/models');

async function seed() {
  try {
    await db.sequelize.authenticate();
    console.log('✅ Connected to database');

    const password = await bcrypt.hash('@1234F', 12);

    const users = [
      {
        full_name: 'Support Officer',
        email:     'officer@gmail.com',
        password,
        role:      'SupportOfficer',
      },
      {
        full_name: 'Support Manager',
        email:     'manager@gmail.com',
        password,
        role:      'Admin',
      },
    ];

    for (const userData of users) {
      const existing = await db.User.findOne({ where: { email: userData.email } });
      if (existing) {
        // Update password and role in case they changed
        await existing.update({ password, role: userData.role });
        console.log(`🔄 Updated existing user: ${userData.email} (${userData.role})`);
      } else {
        await db.User.create(userData);
        console.log(`✅ Created user: ${userData.email} (${userData.role})`);
      }
    }

    console.log('\n🎉 Seed complete!');
    console.log('─────────────────────────────────────');
    console.log('Support Officer → officer@gmail.com');
    console.log('Support Manager → manager@gmail.com');
    console.log('Password        → @1234F');
    console.log('─────────────────────────────────────');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
}

seed();
