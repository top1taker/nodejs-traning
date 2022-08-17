const mongoose = require('mongoose')


const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
    },
    fullName: {
      type: String,
    },
    password: {type: String},
  },
  {timestamps: true} // createdAt, updatedAt, deletedAt
)

module.exports = mongoose.model('User', userSchema)
