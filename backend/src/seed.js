// seed.js - Reset and seed database with fresh data
const database = require('./database');

async function seedDatabase() {
    console.log('🌱 Seeding database...');
    await database.initializeDatabase();
    console.log('✅ Database seeded successfully!');
    process.exit(0);
}

seedDatabase().catch(err => {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
});
