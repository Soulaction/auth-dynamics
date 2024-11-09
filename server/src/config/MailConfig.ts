import {createTransport} from 'nodemailer';
import SMTPConnection from "nodemailer/lib/smtp-connection";

export const mailTransporter = createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    }
} as SMTPConnection.Options)
