import './loadEnv.js';
import { pool } from './db/db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
    try {
        const sql = fs.readFileSync(
            path.join(__dirname, 'migrations', 'create_likes_system.sql'),
            'utf8'
        );

        await pool.query(sql);
        console.log('Migration completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

runMigration();
