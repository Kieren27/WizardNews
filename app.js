const express = require("express");
const morgan = require("morgan");
const path = require('path');
const postBank = require("./postBank");

const app = express();

app.use(express.static(path.join(__dirname, './public')));

app.use(morgan('dev'));

app.get("/", (_req, res) => {
  const posts = postBank.list();

  const html =
    `<!DOCTYPE html>
  <html>
  <head>
    <title>Wizard News</title>
    <link rel="stylesheet" href="/style.css" />
  </head>
  <body>
    <div class="news-list">
      <header><img src="/logo.png"/>Wizard News</header>
      ${posts.map(post => `
        <div class='news-item'>
          <p>
            <span class="news-position">${post.id}. ▲</span>
            <a href="/posts/${post.id}">${post.title}</a>
            <small>(by ${post.name})</small>
          </p>
          <small class="news-info">
            ${post.upvotes} upvotes | ${post.date}
          </small>
        </div>`
    ).join('')}
    </div>
  </body>
</html>`

  res.send(html);
});

app.get('/posts/:id', (req, res) => {
  const id = req.params.id;
  const post = postBank.find(id);
  if (!post.id) {
    const html = `<!DOCTYPE html>
<html>
<head>
  <title>Wizard News</title>
  <link rel="stylesheet" href="/style.css" />
</head>
<body>
  <div class="news-list">
    <header><img src="/logo.png"/>404: Page Not Found</header>
    <h1>404: Page Not Found</h1>
    <span>404: Page Not Found</span>
    <p>404: Page Not Found</p>
  </div>
</body>
</html>`

    res.send(html);
  } else {

    const html = `<!DOCTYPE html>
<html>
<head>
  <title>Wizard News</title>
  <link rel="stylesheet" href="/style.css" />
</head>
<body>
  <div class="news-list">
    <header><img src="/logo.png"/>Wizard News</header>
    <h1>${post.title}</h1>
    <span>By (${post.name})</span>
    <p>${post.content}</p>
  </div>
</body>
</html>`

    res.send(html);
  }

})

const PORT = 1337;

app.listen(PORT, () => {
  console.log(`App listening in port ${PORT}`);
});
