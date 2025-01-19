import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './todoList.css';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState('');
  const [editTodoId, setEditTodoId] = useState(null);

  // Fetch todos from the backend
  const fetchTodos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/todos');
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // Add or update a todo
  const handleAddOrUpdateTodo = async (e) => {
    e.preventDefault();

    if (editTodoId) {
      // Update existing todo
      try {
        await axios.put(`http://localhost:5000/api/todos/${editTodoId}`, { task });
        setEditTodoId(null);
        setTask('');
        fetchTodos();
      } catch (error) {
        console.error('Error updating todo:', error);
      }
    } else {
      // Add new todo
      try {
        await axios.post('http://localhost:5000/api/todos', { task });
        setTask('');
        fetchTodos();
      } catch (error) {
        console.error('Error adding todo:', error);
      }
    }
  };

  // Delete a todo
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/todos/${id}`);
      fetchTodos();
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  // Set the todo for editing
  const handleUpdate = (id, task) => {
    setEditTodoId(id);
    setTask(task);
  };

  // Toggle todo completion status
  const handleToggle = async (id, completed) => {
    try {
      await axios.put(`http://localhost:5000/api/todos/${id}`, {
        completed: !completed,
      });

      // Update local state
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo._id === id ? { ...todo, completed: !completed } : todo
        )
      );
    } catch (error) {
      console.error('Error updating todo status:', error);
    }
  };

  return (
    <div>
      <h1>Todo List</h1>

      <form onSubmit={handleAddOrUpdateTodo} className="todo-form">
        <input
          type="text"
          placeholder="Enter a task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <button type="submit">{editTodoId ? 'Update Task' : 'Add Task'}</button>
      </form>

      <div className="todoList-container">
        {todos.map((todo) => (
          <div key={todo._id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
            <div className="todo-text">
              <form>
                <label>
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggle(todo._id, todo.completed)}
                  />
                  <span>{todo.task}</span>
                </label>
              </form>
            </div>
            <div className="todo-action">
              <button onClick={() => handleDelete(todo._id)}>Delete</button>
              <button onClick={() => handleUpdate(todo._id, todo.task)}>Edit</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodoList;
