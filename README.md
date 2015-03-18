# splitdo
**splitdo** is a node library for processing jobs on chunks of array data.  It has been tested on huge array sets that have millions of items. Internally **splitdo** harnesses [promises](https://github.com/kriskowal/q) so that you can run long-running, computational tasks on each chunk of array data and signal when you are done to continue working on the next chunk.  This is especially useful for operating on and sending array data across the internet.

*I don't get it. Why wouldn't I just use a normal for loop?*

The issue is that you cannot _pause_ a for loop while you operate on each array item or grouping of array items.  **splitdo** allows this and gives you two events to trigger: one when each sub-array job is done, and one when the whole job is done. 

**Splitdo** features:

* Abstracts away the complexity of promises and gives you one simple `done` callback for each job.  Chain with `.then` afterwards if you need to run something else after your complete **splitdo** job is done.
* Supports single and multi-demensional arrays.
* Supports nesting **splitdo** jobs.  For example, if you have a folder of CSV files containing user accounts to upload, run one splitdo job to fetch the users and convert them to JSON and a nested **splitdo** job to upload the users, 1000-at-a-time, to not overwhelm your MySQL database (examples below).

# To install

Inside your project:

```bash
npm install splitdo
```

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

splitDo(filesAr, 1, function(file, thisFileDone){
  
  // Fetch and concert each files to JSON
  csvFileToJson(file, function(users){

    splitDo(users, 1000, function(partialUsers, done){
      sendToMysql(partialUsers, file, done);
    }).then(function(){
      // Wait 200ms before processing the next file.
      setTimeout(thisFileDone, 200);
    });

  });
    
})
  // Done uploading all files.
.then(function(){
  alert('All jobs done!');
})
```
