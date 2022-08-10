const express = require('express')
const http = require('http')
const jwt = require('jsonwebtoken')

const app = express()

app.use(express.json()) // middleware

const SECRET_KEY_JWT = 'very_secret_key' 
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

app.get('/todos', checkAuth, (req, res)=> {
    const userId = req.user.id
    const todosOfUser = todos.filter(todo => todo.user === userId)
    return res.status(200).json(todosOfUser)
})

app.post('/todos', checkAuth,  (req, res) => {
    const newTodo = req.body
    newTodo.user = req.user.id
    todos = [...todos, newTodo] // ...todos 
    return res.status(200).json({message: 'Create todo successfully'})
})

app.delete('/todos/:todoId', (req,res)=> {
    const params = req.params
    const todoId = params.todoId // todoId = '2' 

    todos = todos.filter(todo => todo.id !== +todoId) 
    return res.status(200).json({message: 'Delete todo successfully'}) 
})

app.get('/todos/:todoId', (req,res)=> {
    const {todoId} = req.params 
    const todo = todos.find(todo => todo.id === todoId) // find # filter 
    if (!todo) return res.json({})
    return res.json(todo)
})
// app.post()

app.put('/todos/:todoId', (req,res)=> {
    const {todoId} = req.params 
    const updatedTodo = req.body
    todos = todos.map(todo => todo.id === todoId ? updatedTodo : todo)
    return res.json({message: 'Updated todo successfully'})
})

let users = [{id: '1', email: 'admin@gmail.com', fullName: 'admin', password: 'admin'}]

app.post('/auth/register', (req, res) => {
    const user = req.body 
    users = [...users, user]
    res.json({message: 'Registered successfully'})
})

app.post('/auth/login', (req, res) => {
    const {email, password} = req.body 
    const found = users.find(user => user.email === email && user.password === password) 
    if (found) {
        const token = jwt.sign({id: found.id, email: found.email}, SECRET_KEY_JWT)
        return res.json({token, email: found.email})
    }
    res.status(401).json({message: 'Logged in failed'})
})

app.get('/users', (req, res) => {
    res.json(users)
})

const port = 9999;

server.listen(port, () =>
    console.log(`Server is listening on http://localhost:${port}`)
)

