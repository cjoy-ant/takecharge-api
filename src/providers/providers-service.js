const ProvidersService = {
  getAllProviders(knex) {
    return knex.select("*").from("takecharge_providers");
  },

  getById(knex, hcp_id) {
    return knex
      .from("takecharge_providers")
      .select("*")
      .where("hcp_id", hcp_id)
      .first();
  },

  deleteProvider(knex, hcp_id) {
    return knex("takecharge_providers").where({ hcp_id }).delete();
  },

  updateProvider(knex, hcp_id, newProviderFields) {
    return knex("takecharge_providers")
      .where({ hcp_id })
      .update(newProviderFields);
  },

  insertProvider(knex, newProvider) {
    return knex
      .insert(newProvider)
      .into("takecharge_providers")
      .returning("*")
      .then((rows) => {
        return rows[0];
      });
  },
};

module.exports = ProvidersService;
