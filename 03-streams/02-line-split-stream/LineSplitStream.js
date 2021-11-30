const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {

  #headString = ''

  constructor(options) {
    super(options);
  }

  _transform(chunk, encoding, callback) {
    const chunkString = chunk.toString()
    const hasHeadForNextChunk = !chunkString.endsWith(os.EOL)
    const chunkStringArray = (this.#headString + chunkString).split(os.EOL)

    if (hasHeadForNextChunk) {
      this.#headString = chunkStringArray.pop();
    } else {
      this.#headString = ''
    }

    chunkStringArray.forEach((str) => this.push(str))

    callback(null)
  }

  _flush(callback) {
    if (this.#headString) {
      this.push(this.#headString)
    }
    callback()
  }
}

module.exports = LineSplitStream;
