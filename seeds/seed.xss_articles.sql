INSERT INTO projects (id, project_name, style, client_id)
VALUES
  (11, 'Injection post!', 'How-to',
    'This text contains an intentionally broken image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie); alert(''you just got pretend hacked! oh noes!'');">. The image will try to load, when it fails, it executes malicious JavaScript');
