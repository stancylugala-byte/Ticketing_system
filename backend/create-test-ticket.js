require('dotenv').config();
const db = require('./src/models');
const { Ticket, User, TicketCategory } = db;

async function createTestTicket() {
  try {
    console.log('🎫 Creating test ticket...');

    // Get client user ID
    const clientId = '00000000-0000-0000-0000-000000000002';
    
    // Get a category
    const category = await TicketCategory.findOne({ 
      where: { category_name: 'Technical Support' } 
    });

    if (!category) {
      console.error('❌ Category not found. Run seed-data.js first.');
      process.exit(1);
    }

    // Create ticket
    const ticket = await Ticket.create({
      title: 'Login button not working',
      description: 'When I click the login button on the homepage, nothing happens. I\'ve tried clearing my cache and using different browsers (Chrome, Firefox). The issue persists across all browsers. This is blocking me from accessing my account.',
      priority: 'High',
      category_id: category.category_id,
      user_id: clientId,
      status: 'Open',
      sla_id: 3 // High priority SLA
    });

    console.log('✅ Test ticket created successfully!');
    console.log(`   ID: ${ticket.id}`);
    console.log(`   Title: ${ticket.title}`);
    console.log(`   Priority: ${ticket.priority}`);
    console.log(`   Status: ${ticket.status}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to create ticket:', error);
    process.exit(1);
  }
}

createTestTicket();
