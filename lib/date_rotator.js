'use strict';

const moment = require('moment');
// const fs = require('fs');
// const assert = require('assert');


module.exports = class DateRotator {

  constructor(primary, options) {
    options = options || {};
    this.dateformat = options.dateformat || 'YYYY-MM-DD';
    this.rotations = [];
    this.ctime = options.ctime || new Date();
    this.dateStr = moment(this.ctime).format(this.dateformat);
    this.primary = primary;
    this.ext = options.ext || '';
  }


  next(options) {
    options = options || {};
    const primary = this.primary;
    const ext = this.ext;
    if(this.rotations.length) {
      const dateStr = this.dateStr;
      const newStr = moment(options.datetime || new Date()).format(this.dateformat);
      const name = `${primary}.${dateStr}${ext}`;
      console.log(ext, name);
      this.rotations.push(dateStr);
      this.dateStr = newStr;
      return name;
    }
    const name = `${primary}${ext}`;
    this.rotations.push(name);
    return name;
  }

  shouldRotate(buf, options) {
    options = options || {};
    const currentDate = options.datetime || new Date();
    const currentDateStr = moment(currentDate).format(this.dateformat);
    return currentDateStr !== this.dateStr;
  }

};
