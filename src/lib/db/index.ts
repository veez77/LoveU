// Database connection using Vercel Postgres
import { sql } from '@vercel/postgres';

export { sql };

// Helper to execute queries with error handling
export async function query<T>(
  queryString: string,
  params: any[] = []
): Promise<T[]> {
  try {
    const result = await sql.query(queryString, params);
    return result.rows as T[];
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Helper for single row queries
export async function queryOne<T>(
  queryString: string,
  params: any[] = []
): Promise<T | null> {
  const results = await query<T>(queryString, params);
  return results[0] || null;
}

// Initialize database (run schema)
export async function initializeDatabase() {
  // This will be called when setting up the database
  // The schema.sql file should be run manually or via a migration script
  console.log('Database initialization should be done via schema.sql');
}
