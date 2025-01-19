const Todo = require('../models/todoModel');

// Get all todos

exports.getTodos = async (req, res)=>{
    const todos = await Todo.find();
    res.json(todos);
};

//Create a todo
exports.createTodo = async (req, res)=>{
    const {task} = req.body;

    const todo = new Todo ({task});
    await todo.save();
    res.status(201).json(todo);
};

//update a todo
exports.updateTodo = async(req, res)=>{
    const {id} = req.params;
    const updatedTodo = await Todo.findByIdAndUpdate(id, req.body, {new: true});
    res.json(updatedTodo);
}

//Delete a todo
exports.deleteTodo = async(req, res)=>{
    const {id} = req.params;
    await Todo.findByIdAndDelete(id);
    res.json({message: 'Todo deleted'});
}