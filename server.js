// Import dependencies
const express = require('express');
const oracledb = require('oracledb');
const cors = require('cors');

// Create Express app
const app = express();
app.use(cors());

// Oracle connection config
const dbConfig = {
    user: "json_user",
    password: "mypassword",
    connectString: "localhost:1521/FREEPDB1"
};

// Route to get all JSON rows
app.get('/api/housing', async (req, res) => {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);

        const result = await connection.execute(
        `SELECT id, json_data FROM housing_json_data ORDER BY id`
    );

    // Convert CLOB to string
    const rows = await Promise.all(
        result.rows.map(async ([id, clob]) => {
            let jsonString = "";
            if (clob) {
            jsonString = await clob.getData();
            }
            return { id, json: JSON.parse(jsonString) };
        })
    );

    res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    } finally {
        if (connection) {
        try {
            await connection.close();
        } catch (err) {
            console.error(err);
        }
        }
    }
    });

// Start server
app.listen(3001, () => {
    console.log('API server running on http://localhost:3001');
});
