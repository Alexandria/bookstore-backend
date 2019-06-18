import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../sequelize'


export class Users extends Model {
    book_id!: number
    title!: string
    author!: string

    createdAt!: Date
    updatedAt!: Date
}

// Need to declare the static model so `findOne` etc. use correct types.
//http://docs.sequelizejs.com/manual/typescript
type UserModel = typeof Model & {
    new(): Users;
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

