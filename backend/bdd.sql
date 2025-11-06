-- TABLE UTILISATEUR
CREATE TABLE user_ (
    id_user SERIAL PRIMARY KEY,
    firstname VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    role VARCHAR(50) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    bio_pro VARCHAR(200),
    city VARCHAR(50),
    website VARCHAR(255),
    country VARCHAR(50),
    connexion_index INT,
    profile_views INT,
    applies_index INT,
    private_visibility BOOLEAN NOT NULL,
    -- NOUVELLES COLONNES AJOUTÉES
    description TEXT,                    -- Description détaillée
    skills TEXT[],                       -- Compétences (array)
    job_title VARCHAR(100),              -- Titre du poste
    experience_level VARCHAR(20),        -- Niveau d'expérience
    availability BOOLEAN DEFAULT false,  -- Disponibilité
    portfolio_link VARCHAR(255),         -- Lien portfolio
    linkedin_link VARCHAR(255)           -- Lien LinkedIn
);

-- TABLE ENTREPRISE
CREATE TABLE company (
    id_company SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description VARCHAR(255) NOT NULL,
    website VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    password VARCHAR(255),
    industry VARCHAR(100),
    employees_number VARCHAR(50),
    recruiter_firstname VARCHAR(50),
    recruiter_phone VARCHAR(50),
    recruiter_mail VARCHAR(50),
    recruiter_lastname VARCHAR(50),
    city VARCHAR(50),
    zip_code VARCHAR(50),
    country VARCHAR(50),
    -- NOUVELLES COLONNES AJOUTÉES
    logo VARCHAR(255),                   -- Logo entreprise
    recruiter_name VARCHAR(100),         -- Nom du recruteur principal
    recruiter_email VARCHAR(100),        -- Email du recruteur principal
    benefits TEXT[]                      -- Liste des avantages proposés par l'entreprise
);

-- TABLE OFFRES D'EMPLOI
CREATE TABLE job_offer (
    id_job_offer SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(50) NOT NULL,
    contract_type VARCHAR(50) NOT NULL,
    published_at TIMESTAMP NOT NULL DEFAULT NOW(),
    salary_min INT,
    salary_max INT,
    salary INT,
    remote VARCHAR(50),
    experience VARCHAR(255),
    industry VARCHAR(255),
    contract_duration VARCHAR(50),
    working_time VARCHAR(255),
    formation_required VARCHAR(255),
    id_company INT NOT NULL REFERENCES company (id_company) ON DELETE CASCADE,
    -- NOUVELLES COLONNES AJOUTÉES POUR /my-applications
    urgency VARCHAR(10) DEFAULT 'medium' CHECK (urgency IN ('low', 'medium', 'high')),
    benefits TEXT[],
    requirements TEXT[],
    education VARCHAR(255)
);

-- TABLE MESSAGES
CREATE TABLE message (
   id_message SERIAL PRIMARY KEY,
   content TEXT,
   send_at TIMESTAMP NOT NULL DEFAULT NOW(),
   id_receiver INT NOT NULL REFERENCES user_(id_user) ON DELETE CASCADE,
   id_sender INT NOT NULL REFERENCES user_(id_user) ON DELETE CASCADE
);

-- TABLE FICHIERS UTILISATEURS
CREATE TABLE user_files (
   id_user_files SERIAL PRIMARY KEY,
   file_type VARCHAR(50),
   file_url VARCHAR(255),
   uploaded_at TIMESTAMP DEFAULT NOW(),
   id_user INT NOT NULL REFERENCES user_(id_user) ON DELETE CASCADE
);

-- TABLE CANDIDATURES
CREATE TABLE apply (
    id_user INT NOT NULL REFERENCES user_ (id_user) ON DELETE CASCADE,
    id_job_offer INT NOT NULL REFERENCES job_offer (id_job_offer) ON DELETE CASCADE,
    application_date TIMESTAMP NOT NULL DEFAULT NOW(),
    status VARCHAR(50) NOT NULL,
    -- NOUVELLES COLONNES AJOUTÉES POUR MY-APPLICATIONS
    notes TEXT,                           -- Notes candidature
    interview_date TIMESTAMP,             -- Date d'entretien
    is_archived BOOLEAN DEFAULT FALSE,    -- Candidature archivée
    PRIMARY KEY (id_user, id_job_offer)
);

-- TABLE OFFRES SAUVEGARDÉES
CREATE TABLE save (
    id_user INT NOT NULL REFERENCES user_ (id_user) ON DELETE CASCADE,
    id_job_offer INT NOT NULL REFERENCES job_offer (id_job_offer) ON DELETE CASCADE,
    saved_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (id_user, id_job_offer)
);

-- TABLE DOCUMENTS DE CANDIDATURE
CREATE TABLE application_documents (
    id_document SERIAL PRIMARY KEY,
    id_user INT NOT NULL REFERENCES user_ (id_user) ON DELETE CASCADE,
    id_job_offer INT NOT NULL REFERENCES job_offer (id_job_offer) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL CHECK (document_type IN ('cv', 'cover_letter', 'portfolio')),
    file_name VARCHAR(255) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    uploaded_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(id_user, id_job_offer, document_type)
);

-- INDEX POUR OPTIMISER LES REQUÊTES
CREATE INDEX IF NOT EXISTS idx_application_documents_user_job 
ON application_documents(id_user, id_job_offer);

-- ========================================
-- MODIFICATIONS AJOUTÉES EN BASE DE DONNÉES
-- ========================================

-- Colonnes ajoutées à la table user_ :
-- - description TEXT                    -- Description détaillée
-- - skills TEXT[]                       -- Compétences (array)
-- - job_title VARCHAR(100)              -- Titre du poste
-- - experience_level VARCHAR(20)        -- Niveau d'expérience
-- - availability BOOLEAN DEFAULT false  -- Disponibilité
-- - portfolio_link VARCHAR(255)         -- Lien portfolio
-- - linkedin_link VARCHAR(255)          -- Lien LinkedIn

-- Colonnes ajoutées à la table company :
-- - logo VARCHAR(255)                   -- Logo entreprise

-- Colonnes ajoutées à la table apply :
-- - notes TEXT                          -- Notes candidature
-- - interview_date TIMESTAMP            -- Date d'entretien
-- - is_archived BOOLEAN DEFAULT FALSE   -- Candidature archivée

-- ========================================
-- INDEX POUR OPTIMISER LES PERFORMANCES
-- ========================================

-- Index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_job_offer_title ON job_offer(title);
CREATE INDEX IF NOT EXISTS idx_job_offer_location ON job_offer(location);
CREATE INDEX IF NOT EXISTS idx_job_offer_contract_type ON job_offer(contract_type);
CREATE INDEX IF NOT EXISTS idx_job_offer_published_at ON job_offer(published_at);
CREATE INDEX IF NOT EXISTS idx_job_offer_company ON job_offer(id_company);

-- Index composites pour optimiser les requêtes complexes
CREATE INDEX IF NOT EXISTS idx_job_offer_search ON job_offer USING gin(to_tsvector('french', title || ' ' || description));
CREATE INDEX IF NOT EXISTS idx_job_offer_location_type ON job_offer(location, contract_type);
CREATE INDEX IF NOT EXISTS idx_job_offer_published_company ON job_offer(published_at DESC, id_company);

-- Index pour les entreprises
CREATE INDEX IF NOT EXISTS idx_company_name ON company(name);
CREATE INDEX IF NOT EXISTS idx_company_industry ON company(industry);
CREATE INDEX IF NOT EXISTS idx_company_city ON company(city);
