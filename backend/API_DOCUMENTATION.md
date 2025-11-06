# Documentation API – Plateforme de Recrutement

## Authentification & Sécurité

- POST /auth/users/signup
- POST /auth/users/login

- POST /auth/companies/signup
- POST /auth/companies/login

### Mot de passe oublié

- POST /password/reset
- POST /password/forgot

### Déconnexion

- POST /auth/users/logout
- POST /auth/companies/logout

### Users

- GET /users/me
- PUT /users/me
- DELETE /users/me (suppression de compte)
- GET /users

### Companies

- GET /companies
- GET /companies/:id
- POST /companies
- PUT /companies/:id
- DELETE /companies/me (suppression de compte entreprise)
- DELETE /companies/:id (admin seulement)

### Jobs (Offres)

- GET /jobs
- POST /jobs
- GET /jobs/:id
- PUT /jobs/:id
- DELETE /jobs/:id

### Applications (Candidatures)

- POST /applications
- GET /applications/my
- GET /applications/job/:jobId
- PUT /applications/:jobId/status
- DELETE /applications/:jobId
- GET /applications/stats

### Messages

- POST /messages
- GET /messages/conversations
- GET /messages/:userId
- PUT /messages/:messageId/read
- DELETE /messages/:messageId

### Saved Jobs

- GET /saved-jobs
- POST /saved-jobs
- DELETE /saved-jobs/:id_job_offer

### User Files (CV / Photo)

- POST /user-files/upload (form-data file + file_type)
- GET /user-files/me
- DELETE /user-files/:id

### Admin

- GET /admin/dashboard
- GET /admin/users
- GET /admin/companies
- GET /admin/jobs
- GET /admin/filters
- POST /admin/users/:userId/ban
- POST /admin/companies/:companyId/ban

### Authentification

L'authentification se fait via des **cookies sécurisés** :

- **Login** : Crée automatiquement un cookie `token` sécurisé
- **Accès** : Le cookie est envoyé automatiquement par le navigateur
- **Logout** : Supprime le cookie et révoque le token

**Note** : Plus besoin de gérer manuellement les tokens côté client !

## Exemples d'utilisation (curl)

### Auth - Users

#### Inscription utilisateur :

```bash
curl -X POST http://localhost:3000/auth/users/signup \
	-H "Content-Type: application/json" \
	-d '{"email":"user@example.com","password":"password123","phone":"0612345678","firstname":"John","lastname":"Doe"}'
```

#### Login utilisateur :

```bash
curl -X POST http://localhost:3000/auth/users/login \
	-H "Content-Type: application/json" \
	-d '{"email":"user@example.com","password":"password123"}'
```

#### Déconnexion utilisateur :

```bash
curl -X POST http://localhost:3000/auth/users/logout \
  	-H "Authorization: Bearer $TOKEN"
```

### Auth - Companies

#### Inscription entreprise :

```bash
curl -X POST http://localhost:3000/auth/companies/signup \
	-H "Content-Type: application/json" \
	-d '{"name":"MaBoite","description":"Société","industry":"IT","password":"secret", "recruiter_mail":"recruiter@maboite.com"}'
```

#### Login entreprise :

```bash
curl -X POST http://localhost:3000/auth/companies/login \
	-H "Content-Type: application/json" \
	-d '{"recruiter_mail":"recruiter@maboite.com","password":"secret"}'
```

#### Déconnexion entreprise :

```bash
curl -X POST http://localhost:3000/auth/companies/logout \
	-H "Authorization: Bearer $TOKEN"
```

### Mot de passe oublié

#### Envoi d'un mail pour réinitialiser :

```bash
curl -X POST http://localhost:3000/password/forgot \
	-H "Content-Type: application/json" \
	-d '{"email":"email@gmail.com"}'
```

#### Modifier le mot de passe en bdd :

<!-- Le token à inscrire est celui dans le lien de la page pour réinitialiser le mdp -->
<!-- C'est un token spécial qui dure 15 min -->

```bash
	curl -X POST http://localhost:3000/password/reset \
	-H "Content-Type: application/json" \
	-d '{
		"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
		"newPassword": "nouveaumdp123"
	}'
```

### Utilisateur

#### Récupérer profil connecté :

```bash
curl -H "Authorization: Bearer $TOKEN" http://localhost:3000/users/me
```

#### Modifier profil :

```bash
curl -X PUT http://localhost:3000/users/me \
	-H "Content-Type: application/json" \
	-H "Authorization: Bearer $TOKEN" \
	-d '{"firstname":"John","lastname":"Doe","phone":"0612345678"}'
```

#### Supprimer mon compte :

```bash
curl -X DELETE -H "Authorization: Bearer $TOKEN" http://localhost:3000/users/me
```

### Offres (Jobs)

#### Lister / rechercher offres :

```bash
curl "http://localhost:3000/jobs?q=dev&location=Paris&page=1&limit=10"
```

#### Créer une offre (auth) :

```bash
curl -X POST http://localhost:3000/jobs \
	-H "Content-Type: application/json" \
	-H "Authorization: Bearer $TOKEN" \
	-d '{"title":"Dev Fullstack","description":"Description...","location":"Paris","id_company":1}'
```

#### Voir détail :

```bash
curl http://localhost:3000/jobs/1
```

#### Incrémenter les vues manuellement :

```bash
curl -X POST http://localhost:3000/jobs/1/view
```

#### Mettre à jour (auth, owner/admin) :

```bash
curl -X PUT http://localhost:3000/jobs/1 \
	-H "Content-Type: application/json" \
	-H "Authorization: Bearer $TOKEN" \
	-d '{"title":"Titre mis à jour"}'
```

#### Supprimer (auth, owner/admin) :

```bash
curl -X DELETE -H "Authorization: Bearer $TOKEN" http://localhost:3000/jobs/1
```

### Entreprises

#### Lister :

```bash
curl http://localhost:3000/companies
```

#### Détail :

```bash
curl http://localhost:3000/companies/1
```

#### Créer (auth) :

```bash
curl -X POST http://localhost:3000/companies \
	-H "Content-Type: application/json" \
	-H "Authorization: Bearer $TOKEN" \
	-d '{"name":"MaBoite","description":"Desc","industry":"IT"}'
```

#### Supprimer mon compte entreprise :

```bash
curl -X DELETE -H "Authorization: Bearer $TOKEN" http://localhost:3000/companies/me
```

### Candidatures

#### Postuler (auth) :

```bash
curl -X POST http://localhost:3000/applications \
	-H "Content-Type: application/json" \
	-H "Authorization: Bearer $TOKEN" \
	-d '{"id_job_offer":1}'
```

#### Mes candidatures :

```bash
curl -H "Authorization: Bearer $TOKEN" http://localhost:3000/applications/my
```

#### Stats (admin) :

```bash
curl -H "Authorization: Bearer $TOKEN" http://localhost:3000/applications/stats
```

### Messagerie

```bash
curl -X POST http://localhost:3000/messages \
	-H "Content-Type: application/json" \
	-H "Authorization: Bearer $TOKEN" \
	-d '{"id_receiver":2,"content":"Salut"}'
```

#### Conversations :

```bash
curl -H "Authorization: Bearer $TOKEN" http://localhost:3000/messages/conversations
```

#### Messages avec un user :

```bash
curl -H "Authorization: Bearer $TOKEN" http://localhost:3000/messages/2
```

#### Marquer comme lu :

```bash
curl -X PUT -H "Authorization: Bearer $TOKEN" http://localhost:3000/messages/123/read
```

### Saved Jobs

#### Sauvegarder :

```bash
curl -X POST http://localhost:3000/saved-jobs \
	-H "Content-Type: application/json" \
	-H "Authorization: Bearer $TOKEN" \
	-d '{"id_job_offer":1}'
```

#### Lister sauvegardés :

```bash
curl -H "Authorization: Bearer $TOKEN" http://localhost:3000/saved-jobs
```

#### Supprimer sauvegarde :

```bash
curl -X DELETE -H "Authorization: Bearer $TOKEN" http://localhost:3000/saved-jobs/1
```

### User Files (CV / Photo)

Form fields (upload) — champs requis :

- file (fichier) — requis
- file_type (string) — pdf ou photo

#### Upload CV (multipart/form-data) :

```bash
curl -X POST http://localhost:3000/user-files/upload \
	-H "Authorization: Bearer $TOKEN" \
	-F "file=@/chemin/vers/cv.pdf" \
	-F "file_type=pdf"
```

#### Upload photo :

```bash
curl -X POST http://localhost:3000/user-files/upload \
	-H "Authorization: Bearer $TOKEN" \
	-F "file=@/chemin/vers/photo.jpg" \
	-F "file_type=photo"
```

#### Lister mes fichiers :

```bash
curl -H "Authorization: Bearer $TOKEN" http://localhost:3000/user-files/me
```

#### Supprimer un fichier :

```bash
curl -X DELETE -H "Authorization: Bearer $TOKEN" http://localhost:3000/user-files/12
```

### Admin

#### Dashboard admin :

```bash
curl -H "Authorization: Bearer $TOKEN" http://localhost:3000/admin/dashboard
```

#### Ban user : 

```bash
curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" http://localhost:3000/admin/users/4/ban -d '{"reason":"spam","duration":"7d"}'
```

---

Fichier schema: `backend/bdd.sql`
Fichier Looping: `MCD-MLD.loo`