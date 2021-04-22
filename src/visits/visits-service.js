const VisitsService = {
  getAllVisits(knex) {
    return knex.select("*").from("takecharge_visits");
  },

  getById(knex, visit_id) {
    return knex
      .from("takecharge_visits")
      .select("*")
      .where("visit_id", visit_id)
      .first();
  },

  deleteVisit(knex, visit_id) {
    return knex("takecharge_visits").where({ visit_id }).delete();
  },

  updateVisit(knex, visit_id, newVisitFields) {
    return knex("takecharge_visits").where({ visit_id }).update(newVisitFields);
  },

  insertVisit(knex, newVisit) {
    return knex
      .insert(newVisit)
      .into("takecharge_visits")
      .returning("*")
      .then((rows) => {
        return rows[0];
      });
  },
};

module.exports = VisitsService;
