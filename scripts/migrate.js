// Database migration script
// Run with: node scripts/migrate.js

const { readFileSync } = require('fs');
const { join } = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

async function migrate() {
  // Check for database URL
  if (!process.env.POSTGRES_URL) {
    console.error('Error: POSTGRES_URL not found in .env.local');
    console.error('Please set up your database connection first.');
    process.exit(1);
  }

  try {
    // Import Vercel Postgres
    const { sql } = require('@vercel/postgres');

    console.log('Reading schema file...');
    const schemaPath = join(__dirname, '..', 'src', 'lib', 'db', 'schema.sql');
    const schema = readFileSync(schemaPath, 'utf-8');

    console.log('Connecting to database...');
    console.log('Running migrations...');

    // Execute schema
    // Note: This is a simple approach. For production, use proper migration tools
    await sql.query(schema);

    console.log('✓ Database schema created successfully!');
    console.log('\nNext steps:');
    console.log('1. Verify tables in your database dashboard');
    console.log('2. Start the development server: npm run dev');
    console.log('3. Create your first family and user');

    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    console.error('\nTroubleshooting:');
    console.error('- Check that POSTGRES_URL is correct in .env.local');
    console.error('- Verify database is accessible');
    console.error('- If tables already exist, you may need to drop them first');
    process.exit(1);
  }
}

migrate();
