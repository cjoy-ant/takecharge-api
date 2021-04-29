# TakeCharge

## About the App

TakeCharge is a health care based React app that aims to provide patients a way to be in control of their health. Patient portals, such as MyChart only work if:

1. All of the patient’s providers work within that same health system
2. The patient is tech savvy
3. The patient is cognitively intact and health literate.

TakeCharge allows patients to save and manage information related to their health care providers, visits, and recommendations in a way that THEY can understand. The patient, their caregiver, or their healthcare provider can quickly type the information into designated areas throughout the app, using only language that is appropriate for the patient. As a simple, user-friendly app, patients can keep this information easily accessible at their fingertips.

### [Client-side App Repo](https://github.com/cjoy-ant/takecharge-client)

### [Live Project](https://takecharge-client.vercel.app/)

---

## Pages

### Home Page

![Home Page](images/takecharge.png)

### About Page

![About Page](images/takecharge-about.png)

### List of Providers

![Providers](images/takecharge-providers.png)

### List of Visits

![Visits](images/takecharge-visits.png)

### List of Recommendations

![Recommendation](images/takecharge-recommendations.png)

---

## [API Documentation](https://morning-river-07197.herokuapp.com/)

### Endpoints

#### /api/providers

- GET: returns all of the user's health care providers
- POST: add a health care provider

#### /api/providers/:provider_id

- PATCH: update information for a specified health care provider
- DELETE: delete a specified health care provider

#### /api/visits

- GET: returns all of the user's visits
- POST: add a visit

#### /api/visits/:visit_id

- PATCH: update information for a specified visit
- DELETE: delete a specified visit

#### /api/recommendations

- GET: returns all of the recommendations for the user
- POST: add a recommendation

#### /api/recommendations/:rec_id

- PATCH: update information for a specified recommendation
- DELETE: delete a specified recommendation

---

### Technology Used:

- HTML
- CSS
- JavaScript
- ReactJS
- NodeJS
- PostgreSQL

---

### Aspiring Features:

- Enable different languages
- Dark UI theme
- Ability to add a new provider from Visit and Recommendation forms
- User authentication
- Encyrption

---

### What I learned from this Project:

Through working on this project, I was able to practice my skills in building a client-side app with the ReactJS framework. I further refined my skills in building reusable components, creating routes to allow for different views, and utilizing context to efficiently manage state.

In addition, I gained more experience in building and testing a server, and using PostgreSQL to build a database. I was also able to gain more experience with connecting my client-side app to my API, and successfully deploy both to Vercel and Heroku.
