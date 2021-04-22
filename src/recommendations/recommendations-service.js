const RecommendationsService = {
  getAllRecommendations(knex) {
    return knex.select("*").from("takecharge_recommendations");
  },

  getById(knex, recommendation_id) {
    return knex
      .from("takecharge_recommendations")
      .select("*")
      .where("recommendation_id", recommendation_id)
      .first();
  },

  deleteRecommendation(knex, recommendation_id) {
    return knex("takecharge_recommendations")
      .where({ recommendation_id })
      .delete();
  },

  updateRecommendation(knex, recommendation_id, newRecommendationFields) {
    return knex("takecharge_recommendations")
      .where({ recommendation_id })
      .update(newRecommendationFields);
  },

  insertRecommendation(knex, newRecommendation) {
    return knex
      .insert(newRecommendation)
      .into("takecharge_recommendations")
      .returning("*")
      .then((rows) => {
        return rows[0];
      });
  },
};

module.exports = RecommendationsService;
