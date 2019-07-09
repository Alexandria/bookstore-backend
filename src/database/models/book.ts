import {
    DataTypes,
    Model
} from 'sequelize';
import { sequelize } from './index'

export interface BookAttributes extends Model {
    book_id?: number
    title: string
    author: string

}

export type BookModel = typeof Model & {
    new(): BookAttributes;
}

export const Book = <BookModel>sequelize.define('book', {
    book_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true

    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    author: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

