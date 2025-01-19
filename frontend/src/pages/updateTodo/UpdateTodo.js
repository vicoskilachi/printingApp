import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import "./updateTodo.css";

const UpdateTodo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState('');

  useEffect(() => {
    const fetchTodo = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/todos/${id}`);
        setTask(response.data.task);
      } catch (error) {
        console.error('Error fetching todo:', error);
      }
    };
    fetchTodo();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/todos/${id}`, { task });
      navigate('/');
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  return (
    <div>
      <h1>Update Todo</h1>
      <form onSubmit={handleUpdate}>
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          required
        />
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default UpdateTodo;
