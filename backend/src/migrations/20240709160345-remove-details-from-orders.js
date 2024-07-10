'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const tableDesc = await queryInterface.describeTable('orders');
    if (tableDesc.details) {
      await queryInterface.removeColumn('orders', 'details');
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('orders', 'details', {
      type: Sequelize.JSON,
      allowNull: true
    });
  }
};
