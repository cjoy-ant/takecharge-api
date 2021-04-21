CREATE TABLE takecharge_recommendations (
  recommendation_id UUID PRIMARY KEY DEFAULT uuid_generate_v1mc(),
  recommendation_type TEXT 
    REFERENCES takecharge_providers(hcp_type) ON DELETE CASCADE NOT NULL,
  recommendation_notes TEXT NOT NULL,
  recommendation_date_modified TIMESTAMPTZ NOT NULL
);