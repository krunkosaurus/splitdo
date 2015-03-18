# splitdo
**splitdo** is a node library for processing jobs on chunks of array data.  It has been tested on huge array sets that have millions of items. Internally **splitdo** harnesses [promises](https://github.com/kriskowal/q) so that you can run long-running, computational tasks on each chunk of array data and signal when you are done to continue working on the next chunk.  This is especially useful for operating on and sending array data across the internet.

*I don't get it. Why wouldn't I just use a normal for loop?*

The issue is that with single-threaded programming languages like Node, you cannot _pause_ a for loop while you operate on each array item or grouping of array items—nor would you want to even if you could.  **splitdo** allows this "pausing" while letting your CPU do other things and come back when you're nice and ready.  To do this **splitdo** gives you two done events to trigger: one called `.done` when each sub-array job is done, and one (called `.then`) when the whole array job is done. 

**Splitdo** features:

* Abstracts away the complexity of promises and gives you one simple `done` callback for each job.  Chain with `.then` afterwards if you need to run something else after your complete **splitdo** job is done.
* Supports single and multi-demensional arrays.
* Supports nesting **splitdo** jobs.  For example, if you have a folder of CSV files containing user accounts to upload, run one splitdo job to fetch the users and convert them to JSON and a nested **splitdo** job to upload the users, 1000-at-a-time, to not overwhelm your MySQL database (examples below).

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

splitDo(`referenceToArray`, `integer`, `callback`);

- `referenceToArray` (Array): Reference to array to operate on.
- `integer` (Integer): number of items in array to operate on at a time. This is 1-based so specifying 3 will operate on 3 items at a time.  
- `callback` (Function): Your function callback that will operate on peices of the array.  The first argument your callback receives is a subsection of the array.  The second argument in your `callback` is a done method you must execute to proceed to the next subsection.

**Note:** The second argument in your `callback` is optional and if you don't specify a done method (can be called anything) then your array will be executed sequentially in the standard node fashion.  This can be useful if you don't require pausing the array but still want to operate on sections of an array.

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

splitDo(filesAr, 1, function(file, doneFiles){
  
  // Fetch and concert each files to JSON
  csvFileToJson(file, function(users){

    splitDo(users, 1000, function(partialUsers, donePartialUsers){
      sendToMysql(partialUsers, file, donePartialUsers);
    }).then(function(){
      // Wait 200ms before processing the next file.
      setTimeout(doneFiles, 200);
    });

  });
    
})
  // Done uploading all files.
.then(function(){
  alert('All jobs done!');
})
```
