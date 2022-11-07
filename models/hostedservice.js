'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class HostedService extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  HostedService.init({
    service_id: {
      type: DataTypes.INTEGER,
      // defaultValue: 1,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    user_email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    git_repository: {
      type: DataTypes.STRING
    },
    pod_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    service_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    service_started: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    service_ended: {
      type: DataTypes.DATE,
    },
    service_image: {
      type: DataTypes.STRING,
      allowNull: false
    },
    db_dialect: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'HostedService',
    tableName: 'tb_hostedservices'
  });
  return HostedService;
};