'use strict';

const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const DateRotator = require('./date_rotator');
// const assert = require('assert');

module.exports = class StreamWriter {
  constructor(options, rotator) {
    options = options || {};

    this.primary = options.primary;
    this.ext = options.ext || '.txt';
    this.directory = options.directory;
    // will throw if no access
    mkdirp.sync(this.directory);

    const ctime = this._ctime() || new Date();
    this.rotator = rotator || new DateRotator(this.primary, {
      dateformat: options.dateformat,
      ctime: ctime
    });

    this._rotate();
  }

  _ctime() {
    if(fs.existsSync(this.primaryPath)) {
      const stat = fs.statSync(this.primaryPath);
      return stat.ctime;
    }
    return null;
  }

  get primaryPath() {
    return path.join(this.directory, `${this.primary}${this.ext}`);
  }

  _open(filepath) {
    if(!fs.existsSync(filepath)) {
      this.stream = fs.createWriteStream(filepath);
      return;
    }
    this.stream = fs.createWriteStream(filepath, {flag: 'a'});
  }

  _close() {
    if(this.stream) {
      this.stream.close();
    }
  }

  _next() {
    return this.rotator.next(this.primary, {
      ext: this.ext
    });
  }

  _rotate() {
    this._close();
    const rotatedName = this._next();
    try {
      fs.renameSync(this.primaryPath, path.join(this.directory, rotatedName));
    } catch (e) {
      // do nothing
    }
    this._open(this.primaryPath);
  }

  _shouldRotate(buf, options) {
    return this.rotator.shouldRotate(buf, options);
  }

  write(buf, options) {
    if(this._shouldRotate(buf, options)) {
      this._rotate(options);
    }
    this.stream.write(buf);
  }
};
