require('dotenv').config();
const db = require('./src/models');

const { User, TicketCategory, SlaPolicy, Ticket } = db;

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Create SLA Policies
    const slaPolicies = await SlaPolicy.bulkCreate([
      { priority: 'Low', response_time: 24, resolution_time: 72 },
      { priority: 'Medium', response_time: 12, resolution_time: 48 },
      { priority: 'High', response_time: 4, resolution_time: 24 },
      { priority: 'Critical', response_time: 1, resolution_time: 8 }
    ], { ignoreDuplicates: true });
    console.log('✓ SLA Policies created');

    // Create Categories
    const categories = await TicketCategory.bulkCreate([
      { category_name: 'Technical Support' },
      { category_name: 'Billing & Payments' },
      { category_name: 'Account Management' },
      { category_name: 'Feature Request' },
      { category_name: 'Bug Report' }
    ], { ignoreDuplicates: true });
    console.log('✓ Categories created');

    // Check if client user exists
    const clientExists = await User.findByPk('00000000-0000-0000-0000-000000000002');
    if (!clientExists) {
      await User.create({
        id: '00000000-0000-0000-0000-000000000002',
        full_name: 'Alex Thompson',
        email: 'alex@example.com',
        password: 'hashed_password',
        role: 'Client'
      });
      console.log('✓ Client user created');
    } else {
      console.log('✓ Client user already exists');
    }

    console.log('🎉 Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();
