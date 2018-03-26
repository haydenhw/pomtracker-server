const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const taskSchema = mongoose.Schema({
  taskName: { type: String, required: true },
  recordedTime: { type: Number, required: true },
  shortId: { type: String, required: true },
  log: [{
    startTime: String,
    endTime: String,
  }],
});

const ProjectSchema = mongoose.Schema({
  ownerId: { type: String, required: true },
  projectName: { type: String, required: true },
  position: Number,
  shortId: { type: String, required: true },
  tasks: [taskSchema],
});

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

UserSchema.methods.serialize = function() {
  return {
    username: this.username || '',
    _id: this._id || '',
  };
};

UserSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

UserSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
};

const Projects = mongoose.model('Projects', ProjectSchema);
const User = mongoose.model('User', UserSchema);

module.exports = { Projects, User }
