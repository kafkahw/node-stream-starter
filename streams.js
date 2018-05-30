const { Readable, Transform, Writable } = require('stream');

const inStream = new Readable({
  objectMode: true,

  read(size) {
    this.push(this.curr++);

    if (this.curr > 20) {
      this.push(null);
    }
  }
});
inStream.curr = 1;


const removeEven = new Transform({
  readableObjectMode: true,
  writableObjectMode: true,

  transform(chunk, encoding, callback) {
    if (chunk % 2 !== 0) {
      this.push(chunk);
    }
    callback();
  }
});


let arr = [];
const aggregateThree = new Writable({
  objectMode: true,

  write(chunk, encoding, callback) {
    if (arr.length < 3) {
      arr.push(chunk);
    } else {
      console.log(arr);
      arr = [chunk];
    }
    callback();
  },

  final(callback) {
    console.log(arr);
    callback();
  }
});


const objectToString = new Transform({
  writableObjectMode: true,

  transform(chunk, encoding, callback) {
    this.push(JSON.stringify(chunk) + '\n');
    callback();
  }
});

inStream
    .pipe(removeEven)
    .pipe(aggregateThree);
    // .pipe(process.stdout);
