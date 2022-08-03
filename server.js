const express = require('express')
const http = require('http')

const app = express()
app.use(express.json())

const server = http.createServer(app)

let todos = [{id: 1, title: 'todo1'}, {id: 2, title: 'todo2'}] 

app.get('/todos', (req, res)=> {
    return res.status(200).json(todos)
})

app.post('/todos', (req, res) => {
    const newTodo = req.body
    todos = [...todos, newTodo] // ...todos 
    // todos = [{title: 'todo1'}, {title: 'todo2'} ]
    // ...todos = {title: 'todo1'}, {title: 'todo2'} => [...todos, newTodo] => [{title: 'todo1'}, {title: 'todo2'}, newTodo ]
    // todos.push(newTodo)
    return res.status(200).json({message: 'Create todo successfully'})
})

app.delete('/todos/:todoId', (req,res)=> {
    const params = req.params
    const todoId = params.todoId // todoId = '2' 

    todos = todos.filter(todo => todo.id !== +todoId) 
    return res.status(200).json({message: 'Delete todo successfully'}) 
})

app.get('todos/:todoId', (req,res)=> {
    
})
// app.post()

const port = 9999;

server.listen(port, () =>
    console.log(`Server is listening on http://localhost:${port}`)
)

