import { onRequest } from 'firebase-functions/v2/https';
import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import admin from 'firebase-admin';

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

// Email credentials from environment variables
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

// Service account credentials from environment variables
const serviceAccount = {
    "type": "service_account",
    "project_id": process.env.FIREBASE_PROJECT_ID,
    "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
    "private_key": process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    "client_email": process.env.FIREBASE_CLIENT_EMAIL,
    "client_id": process.env.FIREBASE_CLIENT_ID,
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": process.env.FIREBASE_CLIENT_X509_CERT_URL,
    "universe_domain": "googleapis.com"
};

// Initialize Firebase Admin
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

// Nodemailer setup
const transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
    },
});

// Email Route
app.post('/send-email', async (req, res) => {
    const { to, subject, message, html, pdfBase64, pdfFileName, imageUrls } = req.body;

    const attachments = [];
    if (pdfBase64) {
        attachments.push({
            filename: pdfFileName || 'Booking_Invoice.pdf',
            content: pdfBase64,
            encoding: 'base64',
            contentType: 'application/pdf'
        });
    }
    if (Array.isArray(imageUrls) && imageUrls.length) {
        for (let i = 0; i < imageUrls.length; i++) {
            const url = imageUrls[i];
            attachments.push({
                filename: `image_${i + 1}.jpg`,
                path: url,
                contentType: 'image/jpeg'
            });
        }
    }

    const mailOptions = {
        from: EMAIL_USER,
        to,
        subject,
        text: message,
        html: html || undefined,
        attachments: attachments.length ? attachments : undefined,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).send({ success: true, message: 'Email sent' });
    } catch (error) {
        res.status(500).send({ success: false, error: error.message });
    }
});

// Export Cloud Function
export const api = onRequest({ cors: true, auth: false }, app);
