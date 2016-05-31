'use strict';

const DR = require('../lib/date_rotator');
const expect = require('chai').expect;
const moment = require('moment');

describe('DateRotator', function () {
  it('should return primary name first', function () {
    const dr = new DR('foo', {ext: '.txt'});
    expect(dr.next()).to.equal('foo.txt');
  });

  it('should pop out names with datestr', function () {
    const dr = new DR('foo');
    const date = moment().add(1, 'days').toDate();
    dr.next();
    const datestr = moment(new Date()).format('YYYY-MM-DD');
    expect(dr.next({datetime: date})).to.equal(`foo.${datestr}`);
  });
});
