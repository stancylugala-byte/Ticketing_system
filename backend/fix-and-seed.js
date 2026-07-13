/**
 * fix-and-seed.js
 * Run this ONCE: node fix-and-seed.js
 * 
 * 1. Alters the users table to add 'Manager' to the role ENUM
 * 2. Seeds all 4 test users with correct roles and hashed passwords
 */
require('dotenv').config();
const bcrypt = require('bcryptjs');
const db     = require('./src/models');

async function fixAndSeed() {
  try {
    await db.sequelize.authenticate();
    console.log('✅ Connected to database\n');

    // ── Step 1: Add Manager to the role ENUM if not already there ──
    console.log('🔧 Updating users table ENUM to include Manager role...');
    try {
      await db.sequelize.query(`
        ALTER TABLE \`users\`
        MODIFY COLUMN \`role\`
          ENUM('Client','SupportOfficer','Developer','Manager','Admin')
          NOT NULL DEFAULT 'Client';
      `);
      console.log('✅ ENUM updated successfully\n');
    } catch (e) {
      // May fail if Manager already exists — that's fine
      console.log('ℹ️  ENUM update skipped (may already include Manager):', e.message, '\n');
    }

    // ── Step 2: Seed users ──────────────────────────────────────────
    const password = await bcrypt.hash('@1234F', 12);
    console.log('🌱 Seeding users...\n');

    const users = [
      { full_name: 'Support Officer',    email: 'officer@gmail.com',   role: 'SupportOfficer' },
      { full_name: 'Support Manager',    email: 'manager@gmail.com',   role: 'Manager'        },
      { full_name: 'Developer',          email: 'developer@gmail.com', role: 'Developer'      },
      { full_name: 'System Administrator', email: 'admin@gmail.com',   role: 'Admin'          },
    ];

    for (const u of users) {
      const [user, created] = await db.User.findOrCreate({
        where:    { email: u.email },
        defaults: { ...u, password },
      });

      if (created) {
        console.log(`✅ Created : ${u.email.padEnd(28)} role → ${u.role}`);
      } else {
        await user.update({ password, role: u.role, full_name: u.full_name });
        console.log(`🔄 Updated : ${u.email.padEnd(28)} role → ${u.role}`);
      }
    }

    // ── Step 3: Verify ──────────────────────────────────────────────
    console.log('\n📋 Verification — current users in DB:\n');
    const all = await db.User.findAll({
      attributes: ['email', 'role', 'full_name'],
      order: [['role', 'ASC']],
    });
    all.forEach(u => {
      console.log(`   ${u.email.padEnd(28)} ${u.role.padEnd(16)} ${u.full_name}`);
    });

    console.log('\n🎉 Ready! Login with password: @1234F\n');
    console.log('   officer@gmail.com   → Support Officer  → /dashboard/support');
    console.log('   manager@gmail.com   → Manager          → /dashboard/manager');
    console.log('   developer@gmail.com → Developer        → /dashboard/dev');
    console.log('   admin@gmail.com     → Admin            → /dashboard/admin');
    console.log('   (new signup)        → Client           → /dashboard/client\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Failed:', err.message);
    if (err.parent) console.error('   SQL:', err.parent.sqlMessage);
    process.exit(1);
  }
}

fixAndSeed();
