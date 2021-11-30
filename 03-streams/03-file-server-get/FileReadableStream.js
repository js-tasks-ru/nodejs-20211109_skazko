const stream = require('stream');
const fs = require('fs');
const FileReadError = require('./FileReadError.js');
const path = require('path');

const FILES_DIRECTORY = 'files';

class FileReadableStream extends stream.Readable {
  constructor(filename) {
    super();
    this.filename = filename;
    this.fd = null;
  }
  _construct(callback) {
    if (this.filename.includes('/')) {
      callback(new FileReadError({code: FileReadError.WRONG_FILE_NAME}));
    }
    fs.open(path.join(__dirname, FILES_DIRECTORY, this.filename), (err, fd) => {
      if (err) {
        if (err.code === 'ENOENT') {
          callback(new FileReadError({code: FileReadError.NO_SUCH_FILE}));
        } else {
          callback(new FileReadError({code: FileReadError.FILE_READ_ERROR}));
        }
      } else {
        this.fd = fd;
        callback();
      }
    });
  }
  _read(n) {
    const buf = Buffer.alloc(n);
    fs.read(this.fd, buf, 0, n, null, (err, bytesRead) => {
      if (err) {
        this.destroy(err);
      } else {
        this.push(bytesRead > 0 ? buf.slice(0, bytesRead) : null);
      }
    });
  }
  _destroy(err, callback) {
    if (this.fd) {
      fs.close(this.fd, (er) => {
        callback(er || err);
      });
    } else {
      callback(err);
    }
  }
}

module.exports = FileReadableStream;
