const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Configuration Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail', // ou votre service email
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

app.use(express.json());

app.post('/api/contact', (req, res) => {
  console.log('Données reçues :', req.body);
  res.json({ message: 'Reçu', body: req.body });
});
// Route de contact
app.post('/api/contact', async (req, res) => {
  try {
    const { nom, email, telephone, sujet, message } = req.body;

    // Validation
    if (!nom || !email || !telephone || !sujet || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Tous les champs sont obligatoires' 
      });
    }

    // Configuration de l'email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.RECIPIENT_EMAIL, // Email où vous voulez recevoir les messages
      subject: `Nouveau message de contact: ${sujet}`,
      html: `
        <h2>Nouveau message de contact</h2>
        <p><strong>Nom:</strong> ${nom}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Téléphone:</strong> ${telephone}</p>
        <p><strong>Sujet:</strong> ${sujet}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
        
        <hr>
        <p><em>Message reçu le ${new Date().toLocaleString('fr-FR')}</em></p>
      `
    };

    // Envoi de l'email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ 
      success: true, 
      message: 'Message envoyé avec succès' 
    });

  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de l\'envoi du message' 
    });
  }
});

// Route de test
app.get('/', (req, res) => {
  res.json({ message: 'API Backend Webwizards avec Nodemailer - Serveur en fonctionnement' });
});

app.listen(3000, () => {
  console.log('Serveur démarré sur le port 3000');
});
