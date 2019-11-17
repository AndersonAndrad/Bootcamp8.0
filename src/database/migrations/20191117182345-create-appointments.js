'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.createTable('appointments', { 
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        date:{
          type: Sequelize.DATE,
          allowNull: false,
        },
        user_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        provider_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        canceled_at: {
          type: Sequelize.DATE,
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: false,
        }
       });
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.dropTable('appointments');
  }
};
