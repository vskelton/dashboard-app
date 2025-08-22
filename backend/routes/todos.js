const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); //Import the auth middleware
const Todo = require('../models/Todo');

//@route POST /api/todos
//@desc Add a new todo item
//@access Private
router.post('/', auth, async (req, res) => {
  try {
    const { text } = req.body;
    const newTodo = new Todo({
      text,
      user: req.user.id, // This links the todo to the authenticated user
    });
    const todo = await newTodo.save();
    res.json(todo);
  } catch (err) {
    res.status(500).send('Server error.');
  }
});

//@route GET /api/todos
//@desc Get all todo items for the authenticated user
//@access Private
router.get('/', auth, async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user.id });
    res.json(todos);
  } catch (err) {
    res.status(500).send('Server error.');
  }
});

//@route PUT /api/todos/:id
//@desc Update a todo item
//@access Private
router.put('/:id', auth, async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ msg: 'Todo not found.' });
    }

    // Check if the todo belongs to the authenticated user
    if(todo.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized.' });
    }

    todo.completed = !todo.completed; // Toggle to completed status
    await todo.save();
    res.json(todo);
  } catch (err) {
    res.status(500).send('Server error.');
  }
});

//@route DELETE /api/todos/:id
//@desc Delete a todo item
//@access Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ msg: 'Todo not found.' });
    }

    // Check if the todo belongs to the authenticated user
    if (todo.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized.' });
    }

    await Todo.deleteOne({ _id: req.params.id });
    res.json({ msg: 'Todo removed.' });
  } catch (err) {
    res.status(500).send('Server error.');
  }
});

module.exports = router