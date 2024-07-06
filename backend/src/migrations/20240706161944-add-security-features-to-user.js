'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('user', 'loginAttempts', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    });
    await queryInterface.addColumn('user', 'lockUntil', {
      type: Sequelize.DATE,
      allowNull: true
    });
    await queryInterface.addColumn('user', 'lastPasswordChange', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('user', 'loginAttempts');
    await queryInterface.removeColumn('user', 'lockUntil');
    await queryInterface.removeColumn('user', 'lastPasswordChange');
  }
};
