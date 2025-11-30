import supabase from '../database/db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import logger from '../utils/logger.js';
dotenv.config();

export async function requestPasswordResetMail(email) {
	const normalizedEmail = String(email).trim().toLowerCase();

	// Essayer d'abord de trouver un utilisateur
	const { data: user } = await supabase
		.from('user_')
		.select('*')
		.eq('email', normalizedEmail)
		.maybeSingle();

	// Si pas d'utilisateur, essayer de trouver une entreprise
	let account = null;
	let accountType = null;
	let accountId = null;
	let accountName = null;

	if (user) {
		account = user;
		accountType = 'user';
		accountId = user.id_user;
		accountName = user.firstname || 'Utilisateur';
	} else {
		const { data: company } = await supabase
			.from('company')
			.select('*')
			.eq('recruiter_mail', normalizedEmail)
			.maybeSingle();
		if (company) {
			account = company;
			accountType = 'company';
			accountId = company.id_company;
			accountName = company.recruiter_firstname || company.name || 'Entreprise';
		}
	}

	if (!account) {
		// Ne pas révéler si c'est un utilisateur ou une entreprise pour des raisons de sécurité
		return { error: 'Aucun compte trouvé avec cet email' };
	}

	// Créer un token avec le type de compte et l'ID
	const tokenPayload =
		accountType === 'company'
			? { id_company: accountId, type: 'company' }
			: { id_user: accountId, type: 'user' };

	const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '15m' });

	// Configuration de l'email
	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASS,
		},
	});

	// Utiliser l'URL du frontend depuis les variables d'environnement
	const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
	const resetLink = `${frontendUrl}/reset-password?token=${token}`;

	await transporter.sendMail({
		from: `"Support LinkUp" <${process.env.EMAIL_USER}>`,
		to: normalizedEmail,
		subject: 'Réinitialisation de votre mot de passe',
		html: `
        <p>Bonjour ${accountName},</p>
        <p>Cliquez sur ce lien pour réinitialiser votre mot de passe :</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>Ce lien est valable 15 minutes.</p>
        <p>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
    `,
	});

	return { success: true };
}

export async function tokenUpdatePassword(token, newPassword) {
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const { BCRYPT_SALT_ROUNDS } = await import('../utils/constants.js');
		const hashed = await bcrypt.hash(newPassword, BCRYPT_SALT_ROUNDS);

		// Vérifier le type de compte (user ou company)
		if (decoded.type === 'company' && decoded.id_company) {
			// Mise à jour pour une entreprise
			const { error } = await supabase
				.from('company')
				.update({ password: hashed })
				.eq('id_company', decoded.id_company);
			if (error) throw error;
		} else if (decoded.id_user) {
			// Mise à jour pour un utilisateur (rétrocompatibilité)
			const { error } = await supabase
				.from('user_')
				.update({ password: hashed })
				.eq('id_user', decoded.id_user);
			if (error) throw error;
		} else {
			throw new Error('Token invalide : type de compte non reconnu');
		}

		return { success: true };
	} catch (err) {
		logger.error('Erreur resetPassword:', err);
		return { error: 'Lien invalide ou expiré' };
	}
}
