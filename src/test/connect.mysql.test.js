import mysql from 'mysql2';

const pool = mysql.createPool({
    host: '127.0.0.1',
    port: '8811',
    user: 'root',
    password: 'tipj:',
    database: 'shopDEV'
})

const batchSize = 100000;
const totalSize = 1000000;

let currentId = 1;

console.time(`::::::::::TIME::::::::::`);
const insertBatch = async () => {
    const values = [];
    for (let i = 0; i < batchSize && currentId <= totalSize; i++) {
        const name = `name-${currentId}`
        const age = currentId
        const address = `address-${currentId}`
        values.push([currentId, name, age, address])
        currentId++;
    }

    if (!values.length) {
        console.timeEnd(`::::::::::TIME::::::::::`);
        pool.end(err => {
            if (err) {
                console.log(`error occurred while running batch`);
            } else {
                console.log(`Connection pool closed successfull`);
            }
        })
        return;
    }

    const sql = `INSERT INTO test_table (id,name,age, address) VALUES ?`

    pool.query(sql, [values], async function (err, result) {
        if (err) throw err
        console.log(`Inserted ${result.affectedRows} records`);

        await insertBatch();
    })
}

insertBatch().catch(console.error)


// const promisePool = pool.promise();

// // Test connection
// async function testConnection() {
//     try {
//         const connection = await promisePool.getConnection();
//         console.log('✅ Database connected successfully!');
//         connection.release(); // Trả connection về pool
//         return true;
//     } catch (error) {
//         console.error('❌ Database connection failed:', error.message);
//         return false;
//     }
// }

// testConnection();