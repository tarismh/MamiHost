'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tb_features', {
      features_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      storage: {
        type: Sequelize.DECIMAL
      },
      support_domain: {
        type: Sequelize.BOOLEAN
      },
      support_SSD: {
        type: Sequelize.BOOLEAN
      },
      support_SSL: {
        type: Sequelize.BOOLEAN
      },
      unlimited_bandwidth: {
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tb_features');
  }
};