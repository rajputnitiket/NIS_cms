
const sql = require('mysql');
const env = require('dotenv');


env.config();


export async function connectSQL() {
    try {
        console.log(process.env.SQL_DB);

        await sql.connect({
            server: process.env.SQL_HOST!,
            database: process.env.SQL_DB,
            user: process.env.SQL_USER,
            password: process.env.SQL_PASS,
            options: {
                encrypt: true, // If you're on Azure, you'll need this
                trustServerCertificate: true, // Change to true for local dev / self-signed certs
            }
        });
        console.log('Connected to SQL Server');
    } catch (error) {
        console.error('SQL Server connection error:', error);
        process.exit(1);
    }
}


(async () => {

    await connectSQL();

})();
