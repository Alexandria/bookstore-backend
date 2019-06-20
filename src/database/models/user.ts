import {
    Model,
    DataTypes
} from 'sequelize';
import { sequelize } from './index'


export interface UserAttributes extends Model {
    user_id?: number
    email: string
    password: string

    createdAt?: Date
    updatedAt?: Date
}

export type UserModel = typeof Model & {
    new(): UserAttributes
}

export const User = <UserModel>sequelize.define('user', {
    user_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true

    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
})


