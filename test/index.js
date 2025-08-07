var splitDo = require('../');
var assert = require('assert');

var testAr1 = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
var testAr2 = [1,2,3,4,5,6,7,8,9,10,11,12,13,14];
var testAr3 = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16];
var testAr4 = [
  [1,'a','b'],
  [2,'a','b'],
  [3,'a','b'],
  [4,'a','b'],
  [5,'a','b'],
  [6,'a','b'],
  [7,'a','b'],
  [8,'a','b'],
  [9,'a','b'],
  [10,'a','b'],
  [11,'a','b'],
  [12,'a','b'],
  [13,'a','b'],
  [14,'a','b'],
  [15,'a','b']
];

var testAr5 = [
  [1,'a','b'],
  [2,'a','b'],
  [3,'a','b'],
  [4,'a','b'],
  [5,'a','b'],
  [6,'a','b'],
  [7,'a','b'],
  [8,'a','b'],
  [9,'a','b'],
  [10,'a','b'],
  [11,'a','b'],
  [12,'a','b'],
  [13,'a','b'],
  [14,'a','b'],
  [15,'a','b']
];

var testAr6 = [1,2,3,4,5,6];
var testAr7 = [{"a":"1"}, {"b":"2"},{"c":"3"}];

// Make sure each item gets called correctly. (regular, blocking)
console.log('test1 start');
splitDo(testAr1, 3, function(item){
  console.log('test1: item', item);
});
console.log('test1 done');


// Check off by one -1 (regular, blocking)
console.log('test2 start');
splitDo(testAr2, 3, function(item){
  console.log('test2: item', item);
});
console.log('test2 done');

// Check off by one +1 (non-blocking)
console.log('test3 start');
splitDo(testAr3, 3, function(item, done){
  console.log('test3: item', item);
  done();
}).then(function(){
  console.log('test3 done');
});

// Check multi dimensional array (non-blocking)
console.log('test4 start');
splitDo(testAr4, 3, function(item, done){
  console.log('test4: item', item);
  done();
}).then(function(){
  console.log('test4 done');
});

// Check multi dimensional array with timeout to prove (non-blocking)
console.log('test5 start');
splitDo(testAr5, 3, function(item, done, segmentNumber, allSegments){
  setTimeout(function(){
    console.log('test5: item', item);
    done();
  }, 1000);
}).then(function(){
  console.log('test5 done');
});

// Check splitby one does not use array format.
console.log('test6 start');
splitDo(testAr6, 1, function(item, done, segmentNumber, allSegments){
  console.log('arguments', arguments);
  setTimeout(function(){
    console.log('test6: item', item);
    done();
  }, 1000);
}).then(function(){
  console.log('test6 done');
});

// Check splitby one does not use array format.
console.log('test7 start');
splitDo(testAr7, 1, function(item, done, segmentNumber, allSegments){
  setTimeout(function(){
    console.log('test7: item', item);
    done();
  }, 1000);
}).then(function(){
  console.log('test7 done');
});

// Ensure the original array is not mutated.
console.log('test8 start');
var original = [1,2,3,4];
var originalCopy = original.slice();
splitDo(original, 2, function(){
  // no-op
});
assert.deepStrictEqual(original, originalCopy);
console.log('test8 done');
