const STORE = {
  providers: [
    {
      hcp_id: 1,
      hcp_type: "Primary Care Physician, Internal Medicine",
      hcp_name: "Dr. Maria Ignacio",
      hcp_location: "Advocate Medical Group",
      hcp_phone: "773-275-7700",
      hcp_address_street: "4025 N. Western Ave.",
      hcp_address_city: "Chicago",
      hcp_address_state: "IL",
      hcp_address_zip: "60618",
      hcp_date_modified: ''
    },
    {
      hcp_id: 2,
      hcp_type: "Gastroenterologist",
      hcp_name: "Dr. Abdul Verma",
      hcp_location: "Humbolt Park Health",
      hcp_phone: "773-292-8200",
      hcp_address_street: "1044 N. Francisco Ave.",
      hcp_address_city: "Chicago",
      hcp_address_state: "IL",
      hcp_address_zip: "60622",
      hcp_date_modified: ''
    },
    {
      hcp_id: 3,
      hcp_type: "Dentist",
      hcp_name: "Dr. Simona Balan",
      hcp_location: "Dental Clinic of Morton Grove",
      hcp_phone: "847-663-1996",
      hcp_address_street: "5901 Dempster St. Ste. 201",
      hcp_address_city: "Morton Grove",
      hcp_address_state: "IL",
      hcp_address_zip: "60053",
      hcp_date_modified: ''
    },
    {
      hcp_id: 4,
      hcp_type: "Physical Therapy",
      hcp_name: "Dr. Gran Intarakumhang",
      hcp_location: "Athletico",
      hcp_phone: "773-267-6922",
      hcp_address_street: "5240 N. Pulaski Rd.",
      hcp_address_city: "Chicago",
      hcp_address_state: "IL",
      hcp_address_zip: "60630",
      hcp_date_modified: ''
    },
  ],
  recommendations: [
    {
      recommendation_id: 1,
      recommendation_type: "Gastroenterologist",
      recommendation_notes:
        "take omeprazolee daily for reflux, avoid reflux triggers",
      recommendation_date_modified: ''
    },
    {
      recommendation_id: 2,
      recommendation_type: "Dentist",
      recommendation_notes: "floss and use mouthwash daily",
      recommendation_date_modified: ''
    },
    {
      recommendation_id: 3,
      recommendation_type: "Physical Therapy",
      recommendation_notes: "ankle stretches and exercises x2/day",
      recommendation_date_modified: ''
    },
  ],
  visits: [
    {
      visit_id: 1,
      visit_type: "Primary Care Physician, Internal Medicine",
      visit_provider_name: "Dr. Maria Ignacio",
      visit_location: "Advocate Medical Group",
      visit_date: "2021-08-15T13:00",
      visit_reason: "annual checkup",
      visit_notes: "ask about genetic testing referral",
      visit_date_modified: ''
    },
    {
      visit_id: 2,
      visit_type: "Dentist",
      visit_provider_name: "Dr. Simona Balan",
      visit_location: "Dental Clinic of Morton Grove",
      visit_date: "2021-02-23T14:30",
      visit_reason: "fill 3 cavities",
      visit_notes: "$40 per cavity and $50 co-pay",
      visit_date_modified: ''
    },
    {
      visit_id: 3,
      visit_type: "Physical Therapy",
      visit_provider_name: "Dr. Gran Intarakumhang",
      visit_location: "Athletico",
      visit_date: "2020-09-22T09:00",
      visit_reason: "broken ankle evaluation",
      visit_notes: "bring crutches and camboot",
      visit_date_modified: ''
    },
  ],
};

export default STORE;
