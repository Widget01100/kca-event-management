const database = require('./database');

async function seedDatabase() {
    console.log('🌱 Seeding database with complete data...');
    await database.initializeDatabase();
    console.log('✅ Database seeded successfully!');
    console.log('\n📊 Database now contains:');
    console.log('   • 7 events across 7 categories');
    console.log('   • 5 users with hashed passwords (bcrypt)');
    console.log('   • Audit logging system active');
    console.log('   • Attendance tracking ready');
    process.exit(0);
}

seedDatabase().catch(err => {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
});
