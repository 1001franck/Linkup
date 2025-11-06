import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export async function sendResetMail(to, firstname, token) {
	const transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASS,
		},
	});

	const resetLink = `http://localhost:5173/reset-password?token=${token}`;

	const mailOptions = {
		from: `"Support SaraJob" <${process.env.EMAIL_USER}>`,
		to,
		subject: "Réinitialisation de votre mot de passe",
		html: `
        <p>Bonjour ${firstname},</p>
        <p>Vous avez demandé à réinitialiser votre mot de passe.</p>
        <p>Cliquez ici pour le modifier (valide 15 minutes) :</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>Si vous n'êtes pas à l'origine de cette demande, ignorez ce message.</p>
    `,
	};

	await transporter.sendMail(mailOptions);
}