import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../sequelize'


export class Books extends Model {
    book_id!: number
    title!: string
    author!: string

    createdAt!: Date
    updatedAt!: Date
}

// Need to declare the static model so `findOne` etc. use correct types.
//http://docs.sequelizejs.com/manual/typescript
type BookModel = typeof Model & {
    new(): Books;
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

