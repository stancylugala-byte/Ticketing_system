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
        role:      'Manager',
      },
      {
        full_name: 'Developer',
        email:     'developer@gmail.com',
        password,
        role:      'Developer',
      },
      {
        full_name: 'System Administrator',
        email:     'admin@gmail.com',
        password,
        role:      'Admin',
      },
    ];

    for (const u of users) {
      const [user, created] = await db.User.findOrCreate({
        where:    { email: u.email },
        defaults: u,
      });

      if (created) {
        console.log(`✅ Created: ${u.email} (${u.role})`);
      } else {
        await user.update({ password, role: u.role, full_name: u.full_name });
        console.log(`🔄 Updated: ${u.email} → role set to ${u.role}`);
      }
    }

    console.log('\n🎉 Done! Login credentials:');
    console.log('   Client          → (register via /signup)');
    console.log('   Support Officer → officer@gmail.com    /  @1234F  →  /dashboard/support');
    console.log('   Developer       → developer@gmail.com  /  @1234F  →  /dashboard/dev');
    console.log('   Manager         → manager@gmail.com    /  @1234F  →  /dashboard/manager');
    console.log('   Admin           → admin@gmail.com      /  @1234F  →  /dashboard/admin');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
}

seed();
