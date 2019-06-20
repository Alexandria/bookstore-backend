'use strict';
import {
  QueryInterface,
  DataTypes
} from 'sequelize';
import { curDateTime } from '../../utils/dateTime'
module.exports = {
  up: (queryInterface: QueryInterface) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    return queryInterface.bulkInsert('users', [{
      email: 'admin@gmail.com',
      password: '$2b$10$v/2bDaU7eBAqIFs6hOY4.u4M1wNr81zy7qEAc5Sgz4XJ6F/4gTU02","createdAt":"2019-06-20T17:25:11.839Z","updatedAt":"2019-06-20T17:25:11.839Z',
      createdAt: curDateTime,
      updatedAt: curDateTime
    }], {})
  },

  down: (queryInterface: QueryInterface) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
    return queryInterface.bulkDelete('users', {})
  }
};
