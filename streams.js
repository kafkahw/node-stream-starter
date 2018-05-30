const { Readable, Transform, Writable } = require('stream');


function ingestArray(arr=[]) {

  return new Readable({
    objectMode: true,

    read(size) {
      if (arr.length === 0) {
        // Notifies the end of reading stream
        return this.push(null);
      }
      // The call of this.push triggers the execution of next read()
      this.push(arr.shift());
    }
  });
}


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



function aggregateBy(num) {
  let arr = [];

  return new Writable({
    objectMode: true,

    write(chunk, encoding, callback) {
      if (arr.length < num) {
        // Adds to array if arry is shorter than specified length
        arr.push(chunk);
      } else {
        // Writes to console if array's length reaches the specified value
        console.log(arr);

        // Re-initialize array with current chunk
        arr = [chunk];
      }
      callback();
    },

    final(callback) {
      console.log(arr);
      callback();
    }
  });
}


const objectToString = new Transform({
  writableObjectMode: true,

  transform(chunk, encoding, callback) {
    this.push(JSON.stringify(chunk) + '\n');
    callback();
  }
});

const testArr = []
for (let i = 0; i < 20; i++) {
  testArr.push(i);
}

ingestArray(testArr)
    .pipe(removeEven)
    .pipe(aggregateBy(3));
    // .pipe(process.stdout);
