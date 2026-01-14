CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

INSERT INTO category (id, name, slug, status, created_at, updated_at)
VALUES
  (uuid_generate_v4(), 'Technology', 'technology', 'ACTIVE', NOW(), NOW()),
  (uuid_generate_v4(), 'Health', 'health', 'ACTIVE', NOW(), NOW());