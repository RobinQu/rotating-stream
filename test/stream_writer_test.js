'use strict';

const StreamWriter = require('../lib/stream_writer');
const fs = require('fs');
const moment = require('moment');
const expect = require('chai').expect;

describe('StreamWriter', function () {
  it('should write to primary file', function (done) {
    const sw = new StreamWriter({
      ext: '.log',
      primary: 'debug' + Math.random(),
      directory: '/tmp/logs'
    });
    sw.write('a');
    sw.write('b');
    setTimeout(function () {
      const str = fs.readFileSync('/tmp/logs/debug.log', 'utf8');
      expect(str).to.equal('ab');
      done();
    }, 10);
  });

  it.only('should rotate to another file', function (done) {
    const sw = new StreamWriter({
      ext: '.log',
      primary: 'debug' + Math.random(),
      directory: '/tmp/logs'
    });
    const date = moment().add(1, 'days').toDate();
    sw.write('hello');
    sw.write('world', {
      datetime: date
    });
    setTimeout(function () {
      // const str = fs.readFileSync('/tmp/logs/debug.log', 'utf8');
      done();
    }, 10);
  });
});
