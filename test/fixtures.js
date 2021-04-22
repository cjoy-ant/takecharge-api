function makeProvidersArray() {
  return [
    {
      hcp_id: "abbf75b2-a3b8-11eb-bcbc-0242ac130002",
      hcp_type: "test specialty 1",
      hcp_name: "test name 1",
      hcp_location: "test location 1",
      hcp_phone: "123-456-7890",
      hcp_address_street: "1234 Street",
      hcp_address_city: "Test City 1",
      hcp_address_state: "AL",
      hcp_address_zip: "123456",
      hcp_date_modified: "2021-04-21T16:24:02.922Z",
    },
    {
      hcp_id: "b57558ba-a3b8-11eb-bcbc-0242ac130002",
      hcp_type: "test specialty 2",
      hcp_name: "test name 2",
      hcp_location: "test location 2",
      hcp_phone: "123-456-7890",
      hcp_address_street: "2345 Street",
      hcp_address_city: "Test City 2",
      hcp_address_state: "AK",
      hcp_address_zip: "234567",
      hcp_date_modified: "2021-04-21T16:24:02.922Z",
    },
    {
      hcp_id: "bdccfe0a-a3b8-11eb-bcbc-0242ac130002",
      hcp_type: "test specialty 3",
      hcp_name: "test name 3",
      hcp_location: "test location 3",
      hcp_phone: "123-456-7890",
      hcp_address_street: "3456 Street",
      hcp_address_city: "Test City 3",
      hcp_address_state: "AZ",
      hcp_address_zip: "345678",
      hcp_date_modified: "2021-04-21T16:24:02.922Z",
    },
  ];
}

function makeRecommendationsArray() {
  return [
    {
      recommendation_id: "6dc0097e-a3b9-11eb-bcbc-0242ac130002",
      recommendation_type: "test recommendation 1",
      recommendation_notes: "test recommendation notes 1",
      recommendation_date_modified: "2021-04-21T16:24:02.922Z",
    },
    {
      recommendation_id: "728f4cda-a3b9-11eb-bcbc-0242ac130002",
      recommendation_type: "test recommendation 2",
      recommendation_notes: "test recommendation notes 2",
      recommendation_date_modified: "2021-04-21T16:24:02.922Z",
    },
    {
      recommendation_id: "77fc17e8-a3b9-11eb-bcbc-0242ac130002",
      recommendation_type: "test recommendation 3",
      recommendation_notes: "test recommendation notes 3",
      recommendation_date_modified: "2021-04-21T16:24:02.922Z",
    },
  ];
}

function makeVisitsArray() {
  return [
    {
      visit_id: "09c60daa-a3ba-11eb-bcbc-0242ac130002",
      visit_type: "test visit 1",
      visit_provider_name: "test provider name 1",
      visit_location: "test location 1",
      visit_date: "2021-04-30T16:24:02.922Z",
      visit_reason: "test visit reason 1",
      visit_notes: "test visit notes 1",
      visit_date_modified: "2021-04-21T16:24:02.922Z",
    },
    {
      visit_id: "0e78c3d8-a3ba-11eb-bcbc-0242ac130002",
      visit_type: "test visit 2",
      visit_provider_name: "test provider name 2",
      visit_location: "test location 1",
      visit_date: "2021-05-05T16:24:02.922Z",
      visit_reason: "test visit reason 2",
      visit_notes: "test visit notes 2",
      visit_date_modified: "2021-04-21T16:24:02.922Z",
    },
    {
      visit_id: "11d04254-a3ba-11eb-bcbc-0242ac130002",
      visit_type: "test visit 3",
      visit_provider_name: "test provider name 3",
      visit_location: "test location 3",
      visit_date: "2021-05-10T16:24:02.922Z",
      visit_reason: "test visit reason 3",
      visit_notes: "test visit notes 3",
      visit_date_modified: "2021-04-21T16:24:02.922Z",
    },
  ];
}

function makeMaliciousProvider() {
  const maliciousProvider = {
    hcp_id: "97a24eea-a3ba-11eb-bcbc-0242ac130002",
    hcp_type: 'BAD <script>alert("xss");</script>',
    hcp_name: 'BAD <script>alert("xss");</script>',
    hcp_location: 'BAD <script>alert("xss");</script>',
    hcp_phone: 'BAD <script>alert("xss");</script>',
    hcp_address_street: 'BAD <script>alert("xss");</script>',
    hcp_address_city: 'BAD <script>alert("xss");</script>',
    hcp_address_state: 'BAD <script>alert("xss");</script>',
    hcp_address_zip: 'BAD <script>alert("xss");</script>',
    hcp_date_modified: new Date().toISOString(),
  };

  const expectedProvider = {
    ...maliciousProvider,
    hcp_id: "97a24eea-a3ba-11eb-bcbc-0242ac130002",
    hcp_type: 'BAD &lt;script&gt;alert("xss");&lt;/script&gt;',
    hcp_name: 'BAD &lt;script&gt;alert("xss");&lt;/script&gt;',
    hcp_location: 'BAD &lt;script&gt;alert("xss");&lt;/script&gt;',
    hcp_phone: 'BAD &lt;script&gt;alert("xss");&lt;/script&gt;',
    hcp_address_street: 'BAD &lt;script&gt;alert("xss");&lt;/script&gt;',
    hcp_address_city: 'BAD &lt;script&gt;alert("xss");&lt;/script&gt;',
    hcp_address_state: 'BAD &lt;script&gt;alert("xss");&lt;/script&gt;',
    hcp_address_zip: 'BAD &lt;script&gt;alert("xss");&lt;/script&gt;',
  };
  return { maliciousProvider, expectedProvider };
}

function makeMaliciousRecommendation() {
  const maliciousRecommendation = {
    recommendation_id: "97a24eea-a3ba-11eb-bcbc-0242ac130002",
    recommendation_type: 'BAD <script>alert("xss");</script>',
    recommendation_notes: 'BAD <script>alert("xss");</script>',
    hcp_location: 'BAD <script>alert("xss");</script>',
    hcp_date_modified: new Date().toISOString(),
  };

  const expectedRecommendation = {
    ...maliciousRecommendation,
    recommendation_id: "2eb3a040-a3bb-11eb-bcbc-0242ac130002",
    recommendation_type: 'BAD &lt;script&gt;alert("xss");&lt;/script&gt;',
    recommendation_notes: 'BAD &lt;script&gt;alert("xss");&lt;/script&gt;',
  };
  return { maliciousRecommendation, expectedRecommendation };
}

function makeMaliciousVisit() {
  const maliciousVisit = {
    visit_id: "5a6ed7d6-a3bb-11eb-bcbc-0242ac130002",
    visit_type: 'BAD <script>alert("xss");</script>',
    visit_provider_name: 'BAD <script>alert("xss");</script>',
    visit_location: 'BAD <script>alert("xss");</script>',
    visit_date: 'BAD <script>alert("xss");</script>',
    visit_reason: 'BAD <script>alert("xss");</script>',
    visit_notes: 'BAD <script>alert("xss");</script>',
    visit_date_modified: new Date().toISOString(),
  };

  const expectedVisit = {
    ...maliciousVisit,
    visit_id: "5a6ed7d6-a3bb-11eb-bcbc-0242ac130002",
    visit_type: 'BAD &lt;script&gt;alert("xss");&lt;/script&gt;',
    visit_provider_name: 'BAD &lt;script&gt;alert("xss");&lt;/script&gt;',
    visit_location: 'BAD &lt;script&gt;alert("xss");&lt;/script&gt;',
    visit_date: 'BAD &lt;script&gt;alert("xss");&lt;/script&gt;',
    visit_reason: 'BAD &lt;script&gt;alert("xss");&lt;/script&gt;',
    visit_notes: 'BAD &lt;script&gt;alert("xss");&lt;/script&gt;',
  };
  return { maliciousVisit, expectedVisit };
}

module.exports = {
  makeProvidersArray,
  makeRecommendationsArray,
  makeVisitsArray,
  makeMaliciousProvider,
  makeMaliciousRecommendation,
  makeMaliciousVisit,
};
