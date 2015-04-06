# splitdo
**splitdo** is a node library for processing jobs on chunks of array data (including multidimensional array data).  It has been tested on huge array sets that have millions of items. Internally **splitdo** harnesses [promises](https://github.com/kriskowal/q) so that you can run long-running, computational tasks such as transformations or database queries on each chunk of array data and signal when you are done to continue working on the next chunk.  This is especially useful for operating on and sending array data across the internet.

*I don't get it. Why wouldn't I just use a normal for loop?*

The issue is that with single-threaded programming languages like Node, you cannot _pause_ a for loop while you operate on each array item or grouping of array items—nor would you want to even if you could.  **splitdo** allows this "pausing" while letting your CPU do other things and come back when you're nice and ready.  To do this **splitdo** gives you two done events to trigger: one called `.done` when each sub-array job is done, and one (called `.then`) when the whole array job is done. 

**Splitdo** features:

* Abstracts away the complexity of promises and gives you one simple `done` callback for each job.  Chain with `.then` afterwards if you need to run something else after your complete **splitdo** job is done.
* Supports single and multi-demensional arrays.
* Supports nesting multiple **splitdo** jobs.  For example, if you have a folder of CSV files containing user accounts to upload, run one splitdo job to fetch each list of users and convert them to JSON and a nested **splitdo** job to upload the users, 1000-at-a-time, to not overwhelm your database (examples below).

# To install

Inside your project:

```bash
npm install splitdo
```

then in your project:

```javascript
var splitDo = require('splitdo');
```

# Documentation

splitDo(`arrayReference`, `splitByNumber`, `callback`);

- `arrayReference` (_Array_): Reference to array to operate on, can be in-line.
- `splitByNumber` (_Integer_): number of items in array to operate on at a time. This is 1-based so specifying 3 will operate on 3 items at a time.  Don't worry if this doesn't divide easily into your total array count. Any leftover items will be in the last callback.
- `callback` (_Function_(`arraySegment`, `doneCallback`, `segmentNumber`,  `allSegments`)): Your function callback that will operate on each peice of the array.  

  The first argument your callback receives is a subsection of the array.  The second argument is a done method you must execute to proceed to the next subsection.
  - `arraySegment` (_Array or Other_):  If your `splitBy` value is greater than 1 then this value is the current array segment for your callback to operate on.  For your convenience, if the passed value of `splitBy` is 1, then this value contains the value of each consequetive item in your original array.
  - `doneCallback` (_Function_): A callback you must execute to proceed to the next subsection.
  - `segmentNumber` (_Number_): Zero-based number of which segment you are operating on. For example if `arrayReference` has a length of 300, and `splitByNumber` is 100, then your callback would recieve: 0 then 1 then 2 on each execution.  This argument is helpeful but not used in most cases.
  - `allSegments` (_Array_): This is a reference to all array segments that your original array was split in to. This argument is helpeful but not used in most cases.  If your `splitBy` value is 1, this array is the same as your original array.

**Note:** The second argument in your `callback` is optional and if you don't specify a done method (can be called anything) then your array will be executed sequentially in the standard node fashion.  This can be more performant if you don't require pausing the array but still want to operate on sections of an array.

**Note:** In splitdo version `1.0.14` and above we introduced a convenience feature: If you are splitting by 1 we assume you want to operate on one item of an array at a time and we don't wrap these segments in another array.  This is a breaking change from previous releases so please be aware of it when upgrading.

# To run tests

1. Git clone this repo.
2. `npm install`
3. `npm test`

# Examples

## Simple Example
```javascript
var splitDo = require('splitdo');

// For every 1000 users in user array, upload to mysql.
splitDo(usersAr, 1000, function(subset, done){
  sendToMysql(subset, done);
}).then(function(){
  alert('All users uploaded!');
});
```

## Nested Example
```javascript
var splitDo = require('splitdo');

// Note here that `done` can be called anything. Especially useful for nesting.
splitDo(filesAr, 1, function(file, doneFile){
  
  // Fetch and concert each files to JSON
  csvFileToJson(file, function(users){

    splitDo(users, 1000, function(partialUsers, donePartialUser){
      sendToMysql(partialUsers, file, donePartialUser);
    }).then(function(){
      // Wait 200ms before processing the next file.
      setTimeout(doneFile, 200);
    });

  });
    
})
  // Done uploading all files.
.then(function(){
  alert('All jobs done!');
})
```
