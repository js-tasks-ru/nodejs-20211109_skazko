const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');
const LimitExceededError = require('./LimitExceededError');

const server = new http.Server();

const ONE_MB = 1024 * 1024;

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':
      if (pathname.includes('/')) {
        res.statusCode = 400;
        res.end('Wrong filename');
        break;
      } else {
        const writeStream = fs.createWriteStream(filepath, {flags: 'wx'});
        const limitSizeStream = new LimitSizeStream({limit: ONE_MB});
        req
            .pipe(limitSizeStream)
            .on('error', (err) => {
              if (err instanceof LimitExceededError) {
                res.statusCode = 413;
                res.end(err.code);
                writeStream.destroy();
                fs.unlink(filepath, () => {});
              } else {
                res.statusCode = 500;
                res.end('Internal Server Error');
              }
            })
            .pipe(writeStream)
            .on('error', (err) => {
              if (err && err.code === 'EEXIST') {
                res.statusCode = 409;
                res.end(err.code);
              } else {
                res.statusCode = 500;
                res.end('Internal Server Error');
              }
            })
            .on('close', () => {
              res.statusCode = 201;
              res.end();
            });

        req.on('aborted', () => {
          writeStream.destroy();
          fs.unlink(filepath, () => {});
        });
      }
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
