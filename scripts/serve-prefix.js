const http = require('http');
const path = require('path');
const fs = require('fs');

const port = process.env.PORT || 3000;
const base = process.env.BASE_PATH || '/imhannsop';
const outDir = path.join(__dirname, '..', 'out');

const mime = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.json': 'application/json',
  '.ico': 'image/x-icon',
};

const server = http.createServer((req, res) => {
  let url = req.url || '/';
  if (url === '/') {
    res.writeHead(302, { Location: base + '/' });
    return res.end();
  }
  if (!url.startsWith(base)) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    return res.end('Not found');
  }

  let rel = decodeURIComponent(url.slice(base.length));
  if (rel === '' || rel === '/') rel = '/index.html';
  const filePath = path.join(outDir, rel);

  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('Not found');
    }
    const ext = path.extname(filePath).toLowerCase();
    const type = mime[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': type });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(port, () => {
  console.log(`Serving ${outDir} at http://localhost:${port}${base}/`);
});
