Array.prototype.mapAndFindById = function (idKey, id, callback) {
  return this.map((element, index) => {
    if (element[idKey] === id) {
      return callback(element, index);
    }

    return element;
  });
};

Array.prototype.sliceDelete = function (index) {
  return [
    ...this.slice(0, index),
    ...this.slice(index + 1),
  ];
};


function updateProjectNameName() {
  return projects.mapAndFindById('shortId', '456', (project, index) => {
    return Object.assign({}, project, { projectName: 'API Hack' });
  });
}

function deleteTask(idKey, projectId, taskId) {
  return projects.mapAndFindById(idKey, projectId, (project) => {
    const deleteIndex = project.tasks.findIndex((task) => { return task[idKey] === taskId; });
    const newTasks = project.tasks.sliceDelete(deleteIndex);

    return Object.assign({}, project, { tasks: newTasks });
  });
}
