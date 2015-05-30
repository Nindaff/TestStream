# TestStream
TestStream is a simple Writable stream implementation that bufffers all of the incoming data to be tested against when the stream is finished. This is usefull for readable/duplex/transform stream implementors trying to do end to end testing.

### Usage
```js
  // `Hello, World!` is the contents of `file.txt`
  fs.creatReadStream('file.txt')
    .pipe(TestStream())
    .on('testable', function(data) {
      // data -> Buffer('Hello, World!');
    });

  // TestStream also works for `objectMode` streams.
  Model.find({}).stream()
    .pipe(TestStream({objectMode: true}))
    .on('testable', function(data) {
      // data is now an Array of
      // javascript data
    });
```
