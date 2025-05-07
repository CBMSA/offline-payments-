
require('dotenv').config();
const express = require('express');
const oracledb = require('oracledb');
const cors = require('cors');
const bodyParser = require('body-parser');
const twilio = require('twilio');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const client = new twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

// Oracle DB config
oracledb.initOracleClient(); // For Windows/macOS you may need a path
const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectString: process.env.DB_CONNECT_STRING
};

// Register Endpoint
app.post('/api/register', async (req, res) => {
  const {
    phone, name, surname, email, house, idNumber,
    bankName, bankAcc, cbdcBalance, bankBalance
  } = req.body;

  try {
    const conn = await oracledb.getConnection(dbConfig);

    await conn.execute(
      `INSERT INTO cbdc_users (phone, name, surname, email, house, id_number, bank_name, bank_account, cbdc_balance, bank_balance)
       VALUES (:phone, :name, :surname, :email, :house, :idNumber, :bankName, :bankAcc, :cbdcBalance, :bankBalance)`,
      { phone, name, surname, email, house, idNumber, bankName, bankAcc, cbdcBalance, bankBalance },
      { autoCommit: true }
    );

    // Send SMS
    await client.messages.create({
      body: `Welcome ${name}, R${cbdcBalance} CBDC credited.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone
    });

    res.status(200).json({ message: 'Registered and SMS sent.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Registration failed.' });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
