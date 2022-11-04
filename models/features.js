'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Features extends Model {
    static associate(models) {
      Features.hasOne(models.Package, {
        foreignKey: "features_id",
      });
    }
  }
  Features.init({
    features_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    storage: {
      type: DataTypes.DECIMAL,
      defaultValue: 0,
    },
    support_domain: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    support_SSD: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    support_SSL: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    unlimited_bandwidth: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {
    sequelize,
    modelName: 'Features',
    tableName: 'tb_features'
  });
  return Features;
};