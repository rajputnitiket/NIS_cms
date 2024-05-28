import { ConnectionPool, config } from 'mssql';
import dotenv from 'dotenv';
const sql = require('mssql');

dotenv.config();

console.log('Connecting to SQL Server...');
console.log(process.env.SQL_HOST);
export const sqlConfig: config = {
    server: process.env.SQL_HOST!, // or "localhost"
    database: process.env.SQL_DB,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASS,
    port: 1433,
    options: {
        encrypt: true, // If you're on Azure, you'll need this
        trustServerCertificate: true, // Change to true for local dev / self-signed certs
    },
};



// Create MSSQL connection pool
const pool = new ConnectionPool(sqlConfig);

// Function to execute SQL queries
async function query(sql: string, values: any[] = []) {
    try {
        await pool.connect(); // Ensure connection is established before executing queries
        const request = pool.request();
        if (values.length > 0) {
            values.forEach((value, index) => {
                request.input(index.toString(), value);
            });
        }
        const result = await request.query(sql);
        return result.recordset;
    } catch (error) {
        throw error;
    }
}

async function connectSQL() {
    try {
        console.log(process.env.SQL_DB);

        await pool.connect();
        console.log('Connected to SQL Server');
    } catch (error) {
        console.error('SQL Server connection error:', error);
        process.exit(1);
    }
}

export { connectSQL, query };

