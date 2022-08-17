const mongoose = require('mongoose')

const Schema = mongoose.Schema

const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    completed: {
      type: Boolean,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {timestamps: true} // createdAt, updatedAt, deletedAt
)

module.exports = mongoose.model('Todo', todoSchema)
