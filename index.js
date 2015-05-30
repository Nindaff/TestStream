/**
 * Module Dependencies
 */

var Stream = require('stream');
var Buffer = require('buffer').Buffer;

/**
 * TestStream is a writable stream that pushes all incoming data
 * to a buffer. If `objectMode` is set, the buffer will be a plain
 * JavaScript Array, otherwise the buffer will be an instance of
 * `Buffer` and all incoming data if not already buffers will be
 * appended as `Buffer`s.
 *
 * The stream emits the event `testable` right after the `finish` event
 * is called and passes the buffer as the first and only parameter.
 *
 * @example
 *   var expected_data = 'something';
 *   getSomethingStream() 
 *     .pipe(TestStream())
 *     .on('testable', function(data) {
 *       // data.toString() => 'something'
 *     });
 * 
 * @param {Object} options Any valid writeable stream options.
 */

var TestStream = module.exports = function TestStream(options) {
  if (!(this instanceof TestStream)) return new TestStream(options);
  Stream.Writable.call(this, options);
  var self = this;
  self._buffer = self._writableState.objectMode ? [] : new Buffer(0);
  self.on('finish', function() {
    self.emit('testable', self._buffer);
  });
};

TestStream.prototype = Object.create(Stream.Writable.prototype);
TestStream.prototype.constructor = TestStream;

/**
 * `_write` implementation
 */

TestStream.prototype._write = function(data, encoding, cb) {
  var chunk;
  if (this._writableState.objectMode) {
    this._buffer.push(data);
    return cb();
  }
  encoding = 'string' === typeof encoding ? encoding : 'utf8';
  try {
    chunk = data instanceof Buffer ? data : new Buffer(data, encoding);
    this._buffer = Buffer.concat([this._buffer, chunk]);
  } catch (e) { return cb(e); }
  cb();
};