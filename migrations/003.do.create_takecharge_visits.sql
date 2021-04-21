CREATE TABLE takecharge_visits (
  visit_id UUID PRIMARY KEY DEFAULT uuid_generate_v1mc(),
  visit_type TEXT NOT NULL,
  visit_provider_name TEXT NOT NULL,
  visit_location TEXT NOT NULL,
  visit_date TIMESTAMPTZ NOT NULL,
  visit_reason TEXT NOT NULL,
  visit_notes TEXT NOT NULL,
  visit_date_modified TIMESTAMPTZ NOT NULL
);