CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE takecharge_providers (
  hcp_id UUID PRIMARY KEY DEFAULT uuid_generate_v1mc(),
  hcp_type TEXT NOT NULL,
  hcp_name TEXT NOT NULL,
  hcp_location TEXT NOT NULL,
  hcp_phone TEXT NOT NULL,
  hcp_address_street TEXT NOT NULL,
  hcp_address_city TEXT NOT NULL,
  hcp_address_state TEXT NOT NULL,
  hcp_address_zip TEXT NOT NULL,
  hcp_date_modified TIMESTAMPTZ DEFAULT NOW() NOT NULL
);