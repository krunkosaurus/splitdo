var Q = require('q');

function splitDo(origAr, splitBy, cb){
  var deferred = Q.defer();
  var origAr = origAr;

  // Check for existence of done callback to see if this should work non-blocking.
  var hasDoneCallback = !!cb.toString().match(/done\){/);
  // Array of split orig array.
  var splitArrays = [];
  var jobs = [];

  while (origAr.length > 0){
    splitArrays.push(origAr.splice(0, splitBy));
  }

  if (hasDoneCallback){
    // For each splitArray create a job
    splitArrays.forEach(function(arSection, i, all){
      jobs.push(function(){
        var d = Q.defer();
        cb(arSection, function(){
          d.resolve();

          // Check to see if all jobs are done.
          if (i + 1 == all.length){
            deferred.resolve();
          }
        });
        return d.promise;
      });
    });

    var result = Q();
    jobs.forEach(function (f) {
      result = result.then(f);
    });
  }else{
    splitArrays.forEach(function(arSection){
        cb(arSection);
    });
    deferred.resolve();
  }

  return deferred.promise;
}

module.exports = splitDo;
