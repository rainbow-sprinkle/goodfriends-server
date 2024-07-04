import mysql from 'mysql2';

const db = mysql.createConnection({
    host     : process.env.DB_HOST,
    user     : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DB
});

db.connect((err: any) => {
    if (err) throw err;
    console.log("connected");

    // Keep Alive
    setInterval(() => {
        db.query('SELECT 1', (error) => {
            if (error) {
                console.error('Keep Alive query failed:', error);
            } else {
                console.log('Keep Alive query succeeded.');
            }
        });
    }, 100 * 1000);
});

export default db;