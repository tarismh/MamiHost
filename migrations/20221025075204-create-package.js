'use strict';

module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('tb_packages', {
      package_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        // autoIncrement: true,
        primaryKey: true
      },
      package_name: {
        type: DataTypes.STRING
      },
      package_description: {
        type: DataTypes.STRING
      },
      package_price: {
        type: DataTypes.DECIMAL
      },
      features_id: {
        type: DataTypes.INTEGER,
        refefrences: {
          model: 'tb_features',
          key: 'features_id'
        }
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    });
  },
  async down(queryInterface, DataTypes) {
    await queryInterface.dropTable('tb_packages');
  }
};