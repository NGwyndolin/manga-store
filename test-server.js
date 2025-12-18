const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(`
    <!DOCTYPE html>
    <html>
    <body>
      <h1>Test Simple HTTP</h1>
      <p>URL: ${req.url}</p>
      <p>Query: ${new URL(req.url, 'http://localhost').search}</p>
    </body>
    </html>
  `);
});

server.listen(8080, () => {
  console.log('Servidor en http://localhost:8080');
});
