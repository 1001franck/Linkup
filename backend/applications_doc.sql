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