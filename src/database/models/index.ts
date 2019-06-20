'use strict';

import fs from 'fs'
import path from 'path'
import { Sequelize } from 'sequelize'
var basename = path.basename(__filename);
//var env = process.env.NODE_ENV || 'development';
//var config = require(__dirname + '/../config/config.json')[env];

interface DB {
  [key: string]: any
}
var db: DB = {};

// if (config.use_env_variable) {
//   var sequelize = new Sequelize(process.env[config.use_env_variable], config);
// } else {
//   var sequelize = new Sequelize(config.database, config.username, config.password, config);
// }

export const sequelize = new Sequelize('postgres://localhost:5433/library');

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    var model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
