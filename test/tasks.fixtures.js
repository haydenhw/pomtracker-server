const shortid = require('shortid');
function makeTasksArray() {
  return [
    {
      id: 1,
      date_created: '2029-01-22T16:28:32.615Z',
      task_name: 'Read docs',
      recorded_time: 1000,
      project_id: 1,
      client_id: 'abc',
      user_id: shortid.generate(),
    },
    {
      id: 2,
      date_created: '2100-05-22T16:28:32.615Z',
      task_name: 'Build a todo app',
      recorded_time: 1500,
      project_id: 1,
      client_id: 'xyz',
      user_id: shortid.generate(),
    },
    {
      id: 3,
      date_created: '1919-12-22T16:28:32.615Z',
      task_name: 'Make github reop',
      recorded_time: 8589,
      project_id: 2,
      client_id: '123',
      user_id: shortid.generate(),
    },
  ];
}

function makeMaliciousTask() {
  const maliciousTask = {
    id: 911,
    client_id: 'How-to',
    date_created: new Date().toISOString(),
    task_name: 'Naughty naughty very naughty <script>alert("xss");</script>',
    client_id: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`
  }
  const expectedTask = {
    ...maliciousTask,
    task_name: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
    client_id: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`
  }
  return {
    maliciousTask,
    expectedTask,
  }
}

module.exports = {
  makeTasksArray,
  makeMaliciousTask,
}
