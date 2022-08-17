const express = require('express')
const http = require('http')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

const User = require('./models/user.js')
const Todo = require('./models/todo.js')

const app = express()

app.use(express.json()) // middleware

const SECRET_KEY_JWT = 'very_secret_key' 
const MONGO_URI = 'mongodb+srv://node_training:node_training@cluster0.y4wpyj9.mongodb.net/todo_db?retryWrites=true&w=majority'

// create middleware
const checkAuth = (req, res, next) => {
        const token = req.headers['authorization']
        const decoded = jwt.decode(token, SECRET_KEY_JWT) 
        if (decoded) {
            req.user = decoded
            return next()
        } else {
            res.status(401).json({message: 'Not authenticated'})
        }
}

const server = http.createServer(app)

let todos = [
{
    "id": "1",
    "title": "todo 1",
    "completed": false,
    "user": "1"
},
{
    "id": "2",
    "title": "todo 2",
    "completed": false,
    "user": "1"
},
{
    "id": "3",
    "title": "todo 3",
    "completed": false,
    "user": "1"
}] 

app.get('/todos', checkAuth, async (req, res)=> { // route
    try {
        const userId = req.user.id
        const todos = await Todo.find({user: userId})
        return res.status(200).json(todos)
    } catch (err) {
        console.log('list todos', {err})
        return res.status(500).json({message: 'List todos failed'})
    }
})

app.post('/todos', checkAuth, async (req, res) => {
    try {
        const {title, completed} = req.body
        const userId = req.user.id
        const todo = await Todo.create({
            title,
            completed,
            user: userId
        })
        console.log('create todo', {todo})
        return res.status(200).json({message: 'Create todo successfully'})
    } catch (err) {
        console.log('create todo', {err})
        return res.status(500).json({message: 'Create todo failed'})
    }
})

app.delete('/todos/:todoId', checkAuth, async (req,res)=> {
    try {

        const userId = req.user.id
        const {todoId} = req.params
        
        const result = await Todo.deleteOne({user: userId, id: todoId})
        console.log({result})
        
        
        return res.status(200).json({message: 'Delete todo successfully'}) 
    } catch (err) {
        console.log('delete todo', {err})
        return res.status(500).message({message: 'Delete todo failed'})
    }
})

app.get('/todos/:todoId', checkAuth, async  (req,res)=> {
    try {
        const {todoId} = req.params
        const userId = req.user.id
        const todo = await Todo.find({user: userId, id: todoId})
        return res.status(200).json(todo)
    } catch (err) {
        console.log('list todos', {err})
        return res.status(500).json({message: 'List todos failed'})
    }
})
// app.post()

app.put('/todos/:todoId', checkAuth, async (req,res)=> {
    const userId = req.user.id
    const {todoId} = req.params 
    const updatedTodo = req.body
    const updated = await Todo.findOneAndUpdate({user: userId, id: todoId}, updatedTodo)
    console.log({updated})
    return res.json({message: 'Updated todo successfully'})
})


app.post('/auth/register', async (req, res) => {
    const {email, password, fullName} = req.body 

    try {
        const user = await User.create({
        fullName,
        email: email.toLowerCase(),
        password,
      })
      console.log('register', {user})
      res.json({message: 'Registered successfully'})
    } catch (err) {
        console.log('register', {err})
        res.status(500).json({message: 'Failed to register'})
    }
   

    // users = [...users, user]
})

app.post('/auth/login', async (req, res) => {
    try {
        const {email, password} = req.body
    
        const found = await User.findOne({email, password}) 
        // User.find => filter User.findOne => find
    
        if (found) {
          const token = jwt.sign(
            {id: found.id, email: found.email},
            SECRET_KEY_JWT
          )
    
          return res.status(200).json({email, token})
        } else {
          return res.status(401).json({message: 'Login failed'})
        }  
    } catch (err) {
        console.log('Login', {err})
        res.status(500).json({message: 'Login failed'})
    }

}
)

app.get('/users', async (req, res) => {
    try {

        const users = await User.find({}) 
        res.json(users)
    } catch (err) {
        console.log('list users', {err})
        res.status(500).json({message: 'List user failed'})
    }

})

const port = 9999;

mongoose
  .connect(MONGO_URI)
  .then(() => {
        server.listen(port, () =>
        console.log(`Server is listening on http://localhost:${port}`)
    )
  })
  .catch((err) => {
    console.log('Database connection failed. Server not started')
    console.log(err)
  })



