const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {

  #transferredSize = 0
  #limit = 0

  constructor({limit, ...options}) {
    super(options);
    this.#limit = limit;
  }

  _transform(chunk, encoding, callback) {
    const newTransferredSize = this.#transferredSize + chunk.length
    if (newTransferredSize <= this.#limit) {
      this.#transferredSize = newTransferredSize;
      callback(null, chunk)
    } else {
      callback(new LimitExceededError())
    }
  }
}

module.exports = LimitSizeStream;
