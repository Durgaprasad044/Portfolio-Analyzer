const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 4000;

// Replace with your actual secret key from Google reCAPTCHA
const RECAPTCHA_SECRET_KEY = '6LdpmGgrAAAAAGgJJgQcY7-OdLkyD7yDNrk9kL9F';

app.use(cors());
app.use(express.json());

app.post('/verify-recaptcha', async (req, res) => {
  const { token } = req.body;

  console.log('Received token:', token);

  if (!token) {
    console.log('No token provided');
    return res.status(400).json({ success: false, message: 'No token provided' });
  }

  try {
    const response = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET_KEY}&response=${token}`,
      {
        method: 'POST',
      }
    );

    const data = await response.json();

    console.log('Google reCAPTCHA response:', data);

    if (data.success) {
      return res.json({ success: true });
    } else {
      return res.status(400).json({ success: false, message: 'Failed reCAPTCHA verification', errorCodes: data['error-codes'] });
    }
  } catch (error) {
    console.error('Error verifying reCAPTCHA:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
