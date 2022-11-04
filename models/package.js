'use strict';
const {
  Model, UUIDV4
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Package extends Model {
    static associate(models) {
      Package.belongsTo(models.Features, {
        foreignKey: "features_id"
      })
    }
  }
  Package.init({
    package_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    package_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    package_description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    package_price: {
      type: DataTypes.DECIMAL,
      defaultValue: 0,
      allowNull: false,
    },
    features_id: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Package',
    tableName: 'tb_packages'
  });
  return Package;
};