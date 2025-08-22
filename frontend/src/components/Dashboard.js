import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const[todos, setTodos] = useState([]);
  const[newTodo, setNewTodo] = useState('');
  const[message, setMessage] = useState('');

  const fetchTodos = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/todos', {
        headers: {
          'Authorization': `${token}`
        }
      });
      setTodos(res.data);
    } catch (err) {
      setMessage('Failed to fetch todos.');
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleAddTodo = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'http://localhost:5000/api/todos',
        { text: newTodo },
        {
          headers: {
            'Authorization': `${token}`
          }
        }
      );
      setTodos([...todos, res.data]);
      setNewTodo('');
    } catch (err) {
      setMessage('Failed to add todo.');
    }
  };

  const handleToggleCompleted = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/todos/${id}`,
        {},
        {
          headers: {
            'Authorization': `${token}`
          }
        }
      );
      setTodos(todos.map(todo => 
        todo._id === id ? {...todo, completed: !todo.completed } : todo
      ));
    } catch (err) {
      setMessage('Failed to update todo.');
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/todos/${id}`, {
        headers: {
          'Authorization': `${token}`
        }
      });
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (err) {
      setMessage('Failed to delete todo.')
    }
  };

  return (
    <div className='dashboard-container'>
      <h1>My Dashboard</h1>
      <div className='widgets-container'>
      {/* My Day Widget */}
      <div className='widget my-day-widget'>
        <h2>My Day</h2>
        <p>{new Date().toLocaleDateString()}</p>
        <p>{new Date().toLocaleTimeString()}</p>
      </div>

      {/* To-Do List Widget */}
      <div className='widget todo-list-widget'>
        <h2>To-Do List</h2>
        <form onSubmit={handleAddTodo}>
          <input
          type='text'
          placeholder='Add a new task...'
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          required
          />
          <button type='submite'>Add</button>
        </form>
        <ul>
          {todos.map(todo => (
            <li key={todo._id}>
              <span
              style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
              onClick={() => handleToggleCompleted(todo._id)}
              >
                {todo.text}
              </span>
              <button onClick={() => handleDeleteTodo(todo._id)}>Delete</button>
            </li>
          ))}
        </ul>
        {message && <p>{message}</p>}
      </div>
    </div>
    </div>
  );
};

export default Dashboard;