const http = require('http');
const FileReadStream = require('./FileReadableStream.js');
const FileReadError = require('./FileReadError.js');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  switch (req.method) {
    case 'GET': {
      const fileReadStream = new FileReadStream(pathname);
      fileReadStream
          .on('error', ({code}) => {
            const {message, statusCode} = handleFileReadErrorByCode(code);
            res.statusCode = statusCode;
            res.end(message);
          })
          .pipe(res);

      req.on('aborted', (err) => fileReadStream.destroy());

      break;
    }

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

function handleFileReadErrorByCode(code) {
  switch (code) {
    case FileReadError.NO_SUCH_FILE:
      return ({statusCode: 404, message: 'File not found'});
    case FileReadError.WRONG_FILE_NAME:
      return ({statusCode: 400, message: 'Wrong file path'});
    case FileReadError.FILE_READ_ERROR:
      return ({statusCode: 500, message: 'File read error'});
    default:
      return ({statusCode: 500, message: 'Internal Server Error'});
  }
}

module.exports = server;
