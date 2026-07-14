-- =============================================================
-- CRM Leads — creación de tabla + índices (IDEMPOTENTE)
-- Seguro de correr varias veces. SOLO crea/ajusta `crm_leads`.
-- NO toca marketplace_listings ni ninguna otra tabla ni tus productos.
-- =============================================================

CREATE TABLE IF NOT EXISTS crm_leads (
  id serial PRIMARY KEY,
  source text NOT NULL,
  status text NOT NULL DEFAULT 'new',
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  company text,
  message text,
  notes text,
  metadata jsonb DEFAULT '{}'::jsonb,
  archived boolean NOT NULL DEFAULT false,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- Por si la tabla ya existía sin la columna `archived`:
ALTER TABLE crm_leads ADD COLUMN IF NOT EXISTS archived boolean NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_crm_leads_status ON crm_leads (status);
CREATE INDEX IF NOT EXISTS idx_crm_leads_source ON crm_leads (source);
CREATE INDEX IF NOT EXISTS idx_crm_leads_created_at ON crm_leads (created_at);
CREATE INDEX IF NOT EXISTS idx_crm_leads_email ON crm_leads (email);
CREATE INDEX IF NOT EXISTS idx_crm_leads_archived ON crm_leads (archived);
