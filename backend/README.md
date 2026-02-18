# 🎭 GOLDEN VIBES EVENTS - API BACKEND

**Documentation complète du backend Laravel**

---

## 📋 TABLE DES MATIÈRES

1. [Présentation du projet](#présentation-du-projet)
2. [Technologies utilisées](#technologies-utilisées)
3. [Installation](#installation)
4. [Structure de la base de données](#structure-de-la-base-de-données)
5. [Modèles (Models)](#modèles-models)
6. [Routes API](#routes-api)
7. [Controllers](#controllers)
8. [Authentification](#authentification)
9. [Upload de fichiers](#upload-de-fichiers)
10. [Tests](#tests)
11. [Déploiement](#déploiement)

---

## 📌 PRÉSENTATION DU PROJET

**Golden Vibes Events** est une plateforme web pour un événement culturel de Miss/Master au Cameroun.

### Fonctionnalités principales

**Partie publique :**
- Consultation des candidats (Miss et Master)
- Système de vote avec paiement mobile (Orange Money, MTN Money)
- Billetterie numérique avec QR codes
- Présentation des partenaires
- Formulaire de contact
- Événements annexes

**Partie administration :**
- Tableau de bord avec statistiques
- Gestion complète des candidats (CRUD)
- Gestion des événements annexes
- Gestion des partenaires
- Gestion de la billetterie
- Consultation des messages
- Graphiques et statistiques avancées

---

## 🛠️ TECHNOLOGIES UTILISÉES

- **Laravel 11** - Framework PHP
- **MySQL** - Base de données
- **Laravel Sanctum** - Authentification API avec tokens
- **Storage** - Gestion des fichiers uploadés

---

## 📦 INSTALLATION

### Prérequis

- PHP 8.2+
- Composer
- MySQL
- Node.js (optionnel, pour assets)

### Étapes d'installation

```bash
# 1. Cloner le projet
git clone <repo-url>
cd backend

# 2. Installer les dépendances
composer install

# 3. Copier le fichier .env
cp .env.example .env

# 4. Configurer la base de données dans .env
DB_DATABASE=golden_vibes_events
DB_USERNAME=root
DB_PASSWORD=

# 5. Générer la clé d'application
php artisan key:generate

# 6. Créer la base de données
mysql -u root -e "CREATE DATABASE golden_vibes_events"

# 7. Exécuter les migrations
php artisan migrate

# 8. Créer le lien symbolique pour storage
php artisan storage:link

# 9. Lancer le serveur
php artisan serve
```

L'API sera accessible sur : `http://localhost:8000/api`

---

## 🗄️ STRUCTURE DE LA BASE DE DONNÉES

### Tables principales

#### 1. **users**
Administrateurs du système
```
- id
- name
- email (unique)
- password
- role (super_admin | admin)
- timestamps
```

#### 2. **candidats**
Candidats Miss et Master
```
- id
- numero (unique) - Ex: "001"
- nom
- categorie (miss | master)
- photo1 - Chemin première photo
- photo2 - Chemin deuxième photo
- video - URL ou chemin vidéo
- votes_count - Nombre total de votes (calculé)
- statut (actif | inactif)
- timestamps
```

#### 3. **votes**
Votes des utilisateurs
```
- id
- candidat_id (FK → candidats)
- nombre_votes - Quantité de votes achetés
- montant - Montant total (nombre_votes × 100 FCFA)
- telephone - Numéro mobile money
- mode_paiement (orange | mtn)
- transaction_id (unique) - ID transaction paiement
- statut (en_attente | valide | echoue)
- timestamps
```

#### 4. **packs**
Packs de billets
```
- id
- nom - Ex: "VIP", "Standard"
- prix - Prix unitaire en FCFA
- places_disponibles - Nombre total de places
- places_vendues - Places déjà vendues
- avantages (JSON) - ["Accès backstage", "Cocktail", ...]
- statut (en_vente | epuise | inactif)
- timestamps
```

#### 5. **billets**
Billets vendus
```
- id
- pack_id (FK → packs)
- nom_client
- email
- telephone
- quantite - Nombre de billets achetés
- montant_total - Prix total
- mode_paiement (orange | mtn)
- transaction_id (unique)
- qr_code (unique) - Code QR pour validation
- statut_paiement (en_attente | valide | echoue)
- statut_billet (valide | utilise | annule)
- timestamps
```

#### 6. **partenaires**
Partenaires de l'événement
```
- id
- nom
- logo - Chemin du logo
- description
- categorie (platine | or | argent | bronze)
- site_web - URL du site
- statut (actif | inactif)
- ordre - Ordre d'affichage
- timestamps
```

#### 7. **evenements**
Événements annexes
```
- id
- nom
- date
- heure
- lieu - Adresse complète
- ville
- theme - Ex: "Élégance Africaine"
- description
- statut (a_venir | en_cours | termine)
- timestamps
```

#### 8. **evenement_photos**
Photos des événements (relation 1-N)
```
- id
- evenement_id (FK → evenements)
- photo - Chemin de la photo
- timestamps
```

#### 9. **messages**
Messages de contact
```
- id
- nom
- email
- telephone
- objet (candidature | partenariat | info | reclamation | autre)
- message
- statut (lu | non_lu)
- timestamps
```

---

## 📦 MODÈLES (MODELS)

### Relations entre modèles

```
User (Admin)
  - Pas de relations (gestion admin)

Candidat
  ├── hasMany(Vote) - Un candidat a plusieurs votes
  
Vote
  └── belongsTo(Candidat) - Un vote appartient à un candidat

Pack
  ├── hasMany(Billet) - Un pack a plusieurs billets
  
Billet
  └── belongsTo(Pack) - Un billet appartient à un pack

Partenaire
  - Pas de relations

Evenement
  ├── hasMany(EvenementPhoto) - Un événement a plusieurs photos
  
EvenementPhoto
  └── belongsTo(Evenement) - Une photo appartient à un événement

Message
  - Pas de relations
```

### Exemple d'utilisation des relations

```php
// Récupérer un candidat avec tous ses votes
$candidat = Candidat::with('votes')->find(1);

// Récupérer un événement avec toutes ses photos
$evenement = Evenement::with('photos')->find(1);

// Récupérer un pack avec tous les billets vendus
$pack = Pack::with('billets')->find(1);
```

---

## 🛣️ ROUTES API

### Routes publiques (sans authentification)

#### **Test API**
```
GET /api/test
```
Teste si l'API fonctionne.

---

#### **Statistiques publiques**
```
GET /api/stats
```
Retourne le nombre total de votes et de candidats.

**Réponse :**
```json
{
  "success": true,
  "data": {
    "total_votes": 45670,
    "total_candidats": 20
  }
}
```

---

#### **Candidats**

**Liste des candidats**
```
GET /api/candidats
Query params optionnels:
  - categorie: miss|master
  - search: keyword (nom ou numéro)
  - sort: nom|numero|votes
  - order: asc|desc
```

**Détail d'un candidat**
```
GET /api/candidats/{id}
```

**Statistiques votes d'un candidat**
```
GET /api/candidats/{id}/votes
```

---

#### **Votes**

**Créer un vote (avec paiement)**
```
POST /api/votes
Body: {
  "candidat_id": 1,
  "nombre_votes": 5,
  "telephone": "237xxxxxx",
  "mode_paiement": "orange" | "mtn"
}
```

**Callback paiement (webhook)**
```
POST /api/votes/callback
```

---

#### **Billetterie**

**Liste des packs**
```
GET /api/packs
```

**Acheter un billet**
```
POST /api/billets
Body: {
  "pack_id": 1,
  "quantite": 2,
  "nom": "Nom Client",
  "email": "email@example.com",
  "telephone": "237xxxxxx",
  "mode_paiement": "orange" | "mtn"
}
```

---

#### **Partenaires**
```
GET /api/partenaires
```

---

#### **Événements**
```
GET /api/evenements
```

---

#### **Contact**
```
POST /api/contact
Body: {
  "nom": "Nom Prénom",
  "email": "email@example.com",
  "telephone": "237xxxxxx",
  "objet": "candidature" | "partenariat" | "info" | "reclamation" | "autre",
  "message": "Message..."
}
```

---

### Routes admin (protégées - nécessite token)

#### **Authentification**

**Login**
```
POST /api/login
Body: {
  "email": "admin@gve.com",
  "password": "password"
}

Response: {
  "success": true,
  "token": "1|xxxxx",
  "user": {...}
}
```

**Logout**
```
POST /api/logout
Headers: Authorization: Bearer {token}
```

---

#### **Dashboard & Statistiques**

**Stats globales**
```
GET /api/admin/stats
Headers: Authorization: Bearer {token}
```

**Stats votes (graphiques)**
```
GET /api/admin/stats/votes?periode=7j|30j|all
Headers: Authorization: Bearer {token}
```

---

#### **Gestion Candidats**

```
GET    /api/admin/candidats           # Liste
POST   /api/admin/candidats           # Créer
POST   /api/admin/candidats/{id}      # Modifier (POST car FormData)
DELETE /api/admin/candidats/{id}      # Supprimer

Headers: Authorization: Bearer {token}
Content-Type: multipart/form-data (pour POST/PUT avec fichiers)
```

**Body création/modification :**
```
numero: "001"
nom: "Nom Prénom"
categorie: "miss" | "master"
photo1: file
photo2: file
video: file | url
statut: "actif" | "inactif"
```

---

#### **Gestion Événements**

```
GET    /api/admin/evenements
POST   /api/admin/evenements
POST   /api/admin/evenements/{id}
DELETE /api/admin/evenements/{id}

Headers: Authorization: Bearer {token}
```

---

#### **Gestion Partenaires**

```
GET    /api/admin/partenaires
POST   /api/admin/partenaires
POST   /api/admin/partenaires/{id}
DELETE /api/admin/partenaires/{id}

Headers: Authorization: Bearer {token}
```

---

#### **Gestion Billetterie**

```
GET    /api/admin/packs               # Liste packs
POST   /api/admin/packs               # Créer pack
PUT    /api/admin/packs/{id}          # Modifier pack
DELETE /api/admin/packs/{id}          # Supprimer pack
GET    /api/admin/billets             # Liste ventes

Headers: Authorization: Bearer {token}
```

---

#### **Gestion Messages**

```
GET /api/admin/messages                # Liste messages
PUT /api/admin/messages/{id}/lire      # Marquer comme lu

Headers: Authorization: Bearer {token}
```

---

## 🎮 CONTROLLERS

### Controllers publics

#### **CandidatController.php**
Gère l'affichage public des candidats.

**Méthodes :**
- `index()` - Liste tous les candidats actifs avec filtres
- `show($id)` - Détail d'un candidat
- `votes($id)` - Statistiques de votes d'un candidat

---

#### **VoteController.php**
Gère le système de vote et paiement.

**Méthodes :**
- `store()` - Créer un vote et rediriger vers paiement
- `callback()` - Webhook pour validation paiement (à implémenter)

---

#### **PackController.php**
Affiche les packs de billets disponibles.

---

#### **BilletController.php**
Gère l'achat de billets.

**Méthodes :**
- `store()` - Créer une commande de billet avec paiement

---

#### **PartenaireController.php**
Affiche les partenaires actifs.

---

#### **EvenementController.php**
Affiche les événements avec leurs photos.

---

#### **ContactController.php**
Enregistre les messages de contact.

---

#### **StatsController.php**
Fournit les statistiques publiques (compteur votes).

---

### Controllers admin

#### **AuthController.php**
Gère l'authentification des administrateurs.

**Méthodes :**
- `login()` - Connexion et génération de token Sanctum
- `logout()` - Déconnexion et suppression du token

---

#### **DashboardController.php**
Fournit les statistiques du tableau de bord admin.

**Méthodes :**
- `stats()` - Statistiques globales
- `statsVotes()` - Statistiques détaillées des votes (graphiques)

---

#### **CandidatAdminController.php**
CRUD complet des candidats.

**Méthodes :**
- `index()` - Liste tous les candidats
- `store()` - Créer un candidat avec upload photos/vidéo
- `update($id)` - Modifier un candidat
- `destroy($id)` - Supprimer un candidat et ses fichiers

---

#### **EvenementAdminController.php**
CRUD complet des événements.

**Méthodes :**
- `index()` - Liste événements avec photos
- `store()` - Créer événement + upload photos multiples
- `update($id)` - Modifier événement
- `destroy($id)` - Supprimer événement et photos

---

#### **PartenaireAdminController.php**
CRUD complet des partenaires.

---

#### **PackAdminController.php**
CRUD des packs de billets + liste des ventes.

**Méthodes :**
- `index()` - Liste packs
- `store()` - Créer pack
- `update($id)` - Modifier pack
- `destroy($id)` - Supprimer pack (si aucun billet vendu)
- `billets()` - Liste de tous les billets vendus

---

#### **MessageController.php**
Gestion des messages de contact.

**Méthodes :**
- `index()` - Liste messages
- `markAsRead($id)` - Marquer message comme lu

---

## 🔐 AUTHENTIFICATION

### Laravel Sanctum

L'API utilise **Laravel Sanctum** pour l'authentification par tokens.

#### Configuration

**config/sanctum.php :**
```php
'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', sprintf(
    '%s%s',
    'localhost,localhost:3000,localhost:5173,127.0.0.1,127.0.0.1:8000,::1',
    Sanctum::currentApplicationUrlWithPort(),
))),
```

**.env :**
```
SANCTUM_STATEFUL_DOMAINS=localhost:5173,localhost:3000
SESSION_DOMAIN=localhost
```

#### Utilisation

**1. Login :**
```bash
POST /api/login
{
  "email": "admin@gve.com",
  "password": "password"
}

# Réponse
{
  "token": "1|xxxxxxxx"
}
```

**2. Requêtes authentifiées :**
```bash
GET /api/admin/candidats
Headers:
  Authorization: Bearer 1|xxxxxxxx
```

**3. Logout :**
```bash
POST /api/logout
Headers:
  Authorization: Bearer 1|xxxxxxxx
```

---

## 📤 UPLOAD DE FICHIERS

### Configuration Storage

Les fichiers sont stockés dans `storage/app/public/`.

**Créer le lien symbolique :**
```bash
php artisan storage:link
```

Cela crée un lien : `public/storage → storage/app/public`

### Dossiers de stockage

```
storage/app/public/
├── candidats/           # Photos candidats
│   └── videos/          # Vidéos candidats
├── evenements/          # Photos événements
└── partenaires/         # Logos partenaires
```

### Upload dans les controllers

**Exemple :**
```php
// Upload une image
$path = $request->file('photo')->store('candidats', 'public');

// Résultat: candidats/xyz123.jpg
// Accessible via: http://localhost:8000/storage/candidats/xyz123.jpg
```

**Suppression :**
```php
use Illuminate\Support\Facades\Storage;

Storage::disk('public')->delete($path);
```

---

## 🧪 TESTS AVEC POSTMAN

### Installation de Postman

1. **Télécharger Postman :** https://www.postman.com/downloads/
2. **Installer** et lancer l'application
3. **Skip** la création de compte (optionnel)

---

### Importer la collection Postman

**Vous avez reçu le fichier :** `GoldenVibesAPI.postman_collection.json`

**Pour l'importer :**
1. Ouvrir Postman
2. Clic sur **"Import"** (en haut à gauche)
3. Glisser-déposer le fichier JSON OU cliquer **"Upload Files"**
4. **Import** → La collection "Golden Vibes Events API" apparaît

---

### Configuration de la variable d'environnement (Recommandé)

**Pour éviter de répéter l'URL partout :**

1. **Clic droit sur la collection** "Golden Vibes Events API"
2. **Edit**
3. **Onglet "Variables"**
4. **Ajouter :**
   - Variable : `base_url`
   - Initial Value : `http://localhost:8000/api`
   - Current Value : `http://localhost:8000/api`
5. **Save**

**Dans chaque requête, remplacer :**
```
http://localhost:8000/api/candidats
```
**Par :**
```
{{base_url}}/candidats
```

**Avantage :** En production, vous changez juste la variable !

---

### Tests à effectuer (dans l'ordre)

#### ✅ TEST 1 : API fonctionne ?

```
GET {{base_url}}/test
```

**Résultat attendu :**
```json
{
  "message": "API Golden Vibes fonctionne !"
}
```

**❌ Si erreur :** Vérifier que Laravel tourne (`php artisan serve`)

---

#### ✅ TEST 2 : Liste des candidats (PUBLIC)

```
GET {{base_url}}/candidats
```

**Query params optionnels :**
- `?categorie=miss`
- `?categorie=master`
- `?search=nom`

**Résultat :** Liste de 20 candidats (10 Miss + 10 Master)

---

#### ✅ TEST 3 : Statistiques publiques

```
GET {{base_url}}/stats
```

**Résultat :**
```json
{
  "success": true,
  "data": {
    "total_votes": 0,
    "total_candidats": 20
  }
}
```

---

#### ✅ TEST 4 : Login Admin (IMPORTANT)

```
POST {{base_url}}/login
Headers:
  Content-Type: application/json

Body (raw JSON):
{
  "email": "admin@goldenvibes.com",
  "password": "password"
}
```

**Résultat :**
```json
{
  "success": true,
  "token": "1|xxxxxxxxxxxxxxxxxxxxxx",
  "user": {
    "id": 1,
    "name": "Super Admin",
    "email": "admin@goldenvibes.com",
    "role": "super_admin"
  }
}
```

**🔑 IMPORTANT : COPIER LE TOKEN !**

---

#### ✅ TEST 5 : Dashboard Stats (ADMIN - Nécessite Token)

```
GET {{base_url}}/admin/stats
Headers:
  Authorization: Bearer {VOTRE_TOKEN_ICI}
```

**Remplacer `{VOTRE_TOKEN_ICI}` par le token obtenu au test 4.**

**Résultat :**
```json
{
  "success": true,
  "data": {
    "total_candidats": 20,
    "total_candidats_miss": 10,
    "total_candidats_master": 10,
    "total_votes": 0,
    "montant_votes": 0,
    "billets_vendus": 0,
    "revenus_billets": 0,
    "messages_non_lus": 0,
    "top_candidats": [...]
  }
}
```

**❌ Erreur 401 :** Token invalide ou mal copié.

---

#### ✅ TEST 6 : Créer un candidat avec photos (ADMIN)

```
POST {{base_url}}/admin/candidats
Headers:
  Authorization: Bearer {TOKEN}
  
Body (form-data):
  numero: "021"
  nom: "Candidat Test Postman"
  categorie: "miss"
  statut: "actif"
  photo1: [Select File - choisir une image]
  photo2: [Select File - choisir une image]
```

**⚠️ Important :**
- Dans Postman, sélectionner **"form-data"** (pas JSON)
- Pour `photo1` et `photo2`, le type doit être **"File"** (pas "Text")

**Résultat :**
```json
{
  "success": true,
  "data": {
    "id": 21,
    "numero": "021",
    "nom": "Candidat Test Postman",
    "photo1": "candidats/xyz123.jpg",
    "photo2": "candidats/abc456.jpg",
    ...
  },
  "message": "Candidat ajouté avec succès"
}
```

**Vérifier les photos :**
```
http://localhost:8000/storage/candidats/xyz123.jpg
```

**Si les images ne s'affichent pas :**
```bash
php artisan storage:link
```

---

#### ✅ TEST 7 : Liste des packs de billets

```
GET {{base_url}}/packs
```

**Résultat :** 4 packs (VIP, Gold, Standard, Étudiant)

---

#### ✅ TEST 8 : Liste des partenaires

```
GET {{base_url}}/partenaires
```

**Résultat :** 8 partenaires

---

#### ✅ TEST 9 : Liste des événements

```
GET {{base_url}}/evenements
```

**Résultat :** 3 événements avec leurs photos

---

#### ✅ TEST 10 : Envoyer un message de contact

```
POST {{base_url}}/contact
Headers:
  Content-Type: application/json

Body (raw JSON):
{
  "nom": "Jean Dupont",
  "email": "jean@test.com",
  "telephone": "237600000000",
  "objet": "info",
  "message": "Message de test depuis Postman"
}
```

**Résultat :**
```json
{
  "success": true,
  "message": "Message envoyé avec succès"
}
```

**Vérifier dans l'admin :**
```
GET {{base_url}}/admin/messages
Headers:
  Authorization: Bearer {TOKEN}
```

---

### Checklist complète des tests

- [ ] Test API fonctionne
- [ ] Liste candidats (20 résultats)
- [ ] Stats publiques
- [ ] Login admin (token copié ✓)
- [ ] Dashboard stats (avec token)
- [ ] Créer candidat avec photos
- [ ] Liste packs (4 packs)
- [ ] Liste partenaires (8 partenaires)
- [ ] Liste événements (3 événements)
- [ ] Message contact

**✅ Si tous les tests passent : L'API est prête pour React !**

---

### Exporter/Partager la collection

**Pour donner la collection à un collaborateur :**

1. **Clic droit sur la collection** "Golden Vibes Events API"
2. **Export**
3. **Collection v2.1** → **Export**
4. **Enregistrer** le fichier `.json`
5. **Partager** le fichier

**Le collaborateur pourra l'importer et avoir toutes les requêtes prêtes !**

---

### Tests avancés (Optionnel)

#### Voter pour un candidat (simulation paiement)

```
POST {{base_url}}/votes
Headers:
  Content-Type: application/json

Body:
{
  "candidat_id": 1,
  "nombre_votes": 5,
  "telephone": "237699999999",
  "mode_paiement": "orange"
}
```

**Résultat :**
```json
{
  "success": true,
  "data": {
    "payment_url": "https://paiement-orange.com/pay?txn=TXN-XXXXXXXX",
    "transaction_id": "TXN-XXXXXXXX"
  }
}
```

**Note :** Pour l'instant, c'est une simulation. L'intégration réelle Orange/MTN sera ajoutée plus tard.

---

#### Acheter un billet

```
POST {{base_url}}/billets
Headers:
  Content-Type: application/json

Body:
{
  "pack_id": 1,
  "quantite": 2,
  "nom": "Client Test",
  "email": "client@test.com",
  "telephone": "237699999999",
  "mode_paiement": "mtn"
}
```

---

### Dépannage Postman

**Erreur "Could not get any response" :**
- Vérifier que `php artisan serve` tourne
- Vérifier l'URL : `http://localhost:8000/api/...`

**Erreur 401 Unauthorized :**
- Token expiré ou invalide
- Refaire le login et copier le nouveau token
- Vérifier le format : `Bearer {token}` (avec espace)

**Erreur 500 :**
- Problème serveur Laravel
- Vérifier les logs : `storage/logs/laravel.log`
- Vérifier le terminal où Laravel tourne

**Photos ne s'affichent pas :**
```bash
php artisan storage:link
```

**Base de données vide :**
```bash
php artisan migrate:fresh --seed
```

---

## 🚀 DÉPLOIEMENT

### Sur cPanel

**1. Build et upload :**
```bash
# Zipper le projet
zip -r golden-vibes-backend.zip . -x "node_modules/*" "vendor/*"

# Upload sur cPanel dans /api
```

**2. Sur le serveur :**
```bash
cd /home/user/api
unzip golden-vibes-backend.zip

# Installer dépendances
composer install --optimize-autoloader --no-dev

# Configuration
cp .env.example .env
php artisan key:generate

# Permissions
chmod -R 775 storage bootstrap/cache

# Migrations
php artisan migrate --force

# Storage link
php artisan storage:link
```

**3. Configurer .env production :**
```
APP_ENV=production
APP_DEBUG=false
APP_URL=https://votre-domaine.com

DB_DATABASE=production_db
DB_USERNAME=prod_user
DB_PASSWORD=secure_password

SANCTUM_STATEFUL_DOMAINS=votre-domaine.com
SESSION_DOMAIN=votre-domaine.com
```

---

## 📝 PROCHAINES ÉTAPES

### À implémenter

- [ ] **Seeders** - Données de test
- [ ] **API Paiement Orange Money** - Intégration réelle
- [ ] **API Paiement MTN Money** - Intégration réelle
- [ ] **Génération QR Codes** - Pour billets
- [ ] **Envoi emails** - Confirmation votes/billets
- [ ] **Envoi SMS** - Notifications
- [ ] **Tests unitaires** - PHPUnit
- [ ] **API Documentation** - Swagger/OpenAPI

---

## 👨‍💻 DÉVELOPPEUR

**Projet :** Golden Vibes Events  
**Backend :** Laravel 11  
**Frontend :** React JS (séparé)  
**Date :** Février 2026  

---

## 📄 LICENCE

Projet privé - Golden Vibes Events © 2026
