'use strict';

const { DATE } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('tb_hostedservices', {
      service_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
        // defaultValue: DataTypes.UUIDV4,
      },
      user_email: {
        type: DataTypes.STRING
      },
      duration: {
        type: DataTypes.INTEGER
      },
      service_ip: {
        type: DataTypes.STRING
      },
      service_port: {
        type: DataTypes.STRING
      },
      service_username: {
        type: DataTypes.STRING
      },
      service_password: {
        type: DataTypes.STRING
      },
      service_image: {
        type: DataTypes.STRING,
        allowNull: false
      },
      db_dialect: {
        type: DataTypes.STRING
      },
      service_OS: {
        type: DataTypes.STRING
      },
      service_type: {
        type: DataTypes.STRING
      },
      service_started: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      service_ended: {
        type: DataTypes.DATE,
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
    await queryInterface.dropTable('tb_hostedservices');
  }
};