class FileReadError extends Error {
  constructor({ code }) {
    super(code);

    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);

    this.code = code;
  }

  static NO_SUCH_FILE = 'NO_SUCH_FILE'
  static FILE_READ_ERROR = 'FILE_READ_ERROR'
  static WRONG_FILE_NAME = 'WRONG_FILE_NAME'
}

module.exports = FileReadError;
