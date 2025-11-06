/**
 * Script pour créer un administrateur
 * Usage: node backend/scripts/create-admin.js <email> <password> [firstname] [lastname]
 * 
 * Exemple:
 * node backend/scripts/create-admin.js admin@linkup.com Admin123! Admin User
 */

import bcrypt from 'bcryptjs';
import supabase from '../src/database/db.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Récupérer les arguments de la ligne de commande
const args = process.argv.slice(2);

if (args.length < 2) {
  console.error('❌ Usage: node create-admin.js <email> <password> [firstname] [lastname]');
  console.error('   Exemple: node create-admin.js admin@linkup.com Admin123! Admin User');
  process.exit(1);
}

const [email, password, firstname = 'Admin', lastname = 'User'] = args;

async function createAdmin() {
  try {
    console.log(`🔐 Création de l'administrateur: ${email}...`);

    // Vérifier si l'utilisateur existe déjà
    const { data: existingUser, error: checkError } = await supabase
      .from('user_')
      .select('id_user, email')
      .eq('email', email.toLowerCase().trim())
      .maybeSingle();

    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError;
    }

    if (existingUser) {
      console.log(`⚠️  L'utilisateur ${email} existe déjà.`);
      
      // Vérifier si c'est déjà un admin
      const { data: userData } = await supabase
        .from('user_')
        .select('role')
        .eq('id_user', existingUser.id_user)
        .single();

      if (userData?.role === 'admin') {
        console.log('✅ Cet utilisateur est déjà administrateur.');
        return;
      }

      // Mettre à jour le rôle en admin
      const { error: updateError } = await supabase
        .from('user_')
        .update({ role: 'admin' })
        .eq('id_user', existingUser.id_user);

      if (updateError) {
        throw updateError;
      }

      console.log(`✅ L'utilisateur ${email} a été promu administrateur.`);
      return;
    }

    // Hasher le mot de passe
    const passwordHash = await bcrypt.hash(password, 10);

    // Créer l'administrateur
    const { data, error } = await supabase
      .from('user_')
      .insert({
        email: email.toLowerCase().trim(),
        password: passwordHash,
        firstname: firstname,
        lastname: lastname,
        role: 'admin',
        phone: '0123456789',
        private_visibility: false
      })
      .select('id_user, email, firstname, lastname, role')
      .single();

    if (error) {
      throw error;
    }

    console.log('✅ Administrateur créé avec succès !');
    console.log('📋 Détails:');
    console.log(`   ID: ${data.id_user}`);
    console.log(`   Email: ${data.email}`);
    console.log(`   Nom: ${data.firstname} ${data.lastname}`);
    console.log(`   Rôle: ${data.role}`);
    console.log(`\n🔑 Vous pouvez maintenant vous connecter avec:`);
    console.log(`   Email: ${email}`);
    console.log(`   Mot de passe: ${password}`);

  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'administrateur:', error.message);
    process.exit(1);
  }
}

createAdmin();

