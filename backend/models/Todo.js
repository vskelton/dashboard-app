const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User', // This is the key.  It links a todo item to a user.
  },
});

const Todo = mongoose.model('Todo', TodoSchema);

module.exports = Todo;