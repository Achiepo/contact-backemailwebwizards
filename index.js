const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // tonadresse@gmail.com
    pass: process.env.EMAIL_PASS  // mot de passe d’application
  }
});

// Route test simple
app.get('/', (req, res) => {
  res.send('API Express fonctionne correctement 🚀');
});


app.post('/api/contact', async (req, res) => {
  try {
    const { nom, email, telephone, sujet, message } = req.body;

    if (!nom || !email || !telephone || !sujet || !message) {
      return res.json({ success: false, message: 'Tous les champs sont obligatoires' });
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.DESTINATAIRE_EMAIL, // ex: ta deuxième adresse email
      subject: `Message de ${nom} - ${sujet}`,
      html: `
        <p><strong>Nom :</strong> ${nom}</p>
        <p><strong>Email :</strong> ${email}</p>
        <p><strong>Téléphone :</strong> ${telephone}</p>
        <p><strong>Sujet :</strong> ${sujet}</p>
        <p><strong>Message :</strong> ${message}</p>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: 'Message envoyé avec succès' });
  } catch (error) {
    console.error('Erreur lors de l\'envoi :', error);
    res.status(500).json({ success: false, message: 'Erreur lors de l\'envoi' });
  }
});

app.listen(3000, () => {
  console.log('Serveur lancé sur http://localhost:3000');
});
