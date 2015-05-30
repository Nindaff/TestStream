var TestStream = require('../');
var Stream = require('stream');
var fs = require('fs');
var should = require('should');

var FILE_NAME = __dirname + '/__teststream_file__.test';

var objMode = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
var pos = 0;
var readable = new Stream.Readable({objectMode: true});
readable._read = function() {
  if (pos >= objMode.length) {
    this.push(null);
    return;
  }
  this.push(objMode[pos]);
  pos++;
};

describe('TestStream', function() {
  it('should buffer all stream data to be tested against on the `testable` event.', function(done) {
    var expect = 'test test test test';
    fs.writeFileSync(FILE_NAME, expect);
    fs.createReadStream(FILE_NAME)
      .pipe(TestStream())
      .on('testable', function(data) {
        data.toString().should.equal(expect);
        fs.unlinkSync(FILE_NAME);
        done();
      });
  });

  it('should do the same for `objectMode` streams.', function(done) {
    readable.pipe(TestStream({objectMode: true}))
      .on('testable', function(data) {
        data.should.eql(objMode);
        done();
      });
  });
})