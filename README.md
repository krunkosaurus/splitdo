# splitdo
**splitdo** is a node library for processing jobs on chunks of array data.  It has been tested on huge array sets that have millions of items. Internally **splitdo** harnesses [promises](https://github.com/kriskowal/q) so that you can run long-running, computational tasks on each chunk of array data and signal when you are done to continue working on the next chunk.  This is especially useful for operating and sending array data across the internet.

**Splitdo** features:

* Abstracts away the complexity of promises and gives you one simple `done` callback for each job.
* Supports single and multi-demensional arrays
* supports nesting splitdo jobs.  For example, if you have a folder of CSV files containing user accounts to upload, run one splitdo job to fetch the users and conver them to JSON and nest it with another splitdo job to upload the users to your MySQL database 1000 users at a time.

# Examples

## Simple Example
```javascript

// For every 1000 users in user array, upload to mysql.
splitDo(usersAr, 1000, function(subset, done){
  sendToMysql(subset, done);
}).then(function(){
  alert('All users uploaded!');
});
```

## Nested Example
```javascript
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
