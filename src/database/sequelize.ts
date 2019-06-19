import { Sequelize } from 'sequelize'
//const Sequelize = require('sequelize')
export const sequelize = new Sequelize('postgres://localhost:5433/library');

