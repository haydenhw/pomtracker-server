const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
  taskName: { type: String, required: true },
  recordedTime: { type: Number, required: true },
  shortId: { type: String, required: true },
  log: [{
    startTime: String,
    endTime: String,
  }],
});

const projectSchema = mongoose.Schema({
  projectName: { type: String, required: true },
  position: Number,
  shortId: { type: String, required: true },
  tasks: [taskSchema],
});

const Projects = mongoose.model('Projects', projectSchema);

module.exports = { Projects };
