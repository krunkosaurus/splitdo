var Q = require('q');

function splitDo(origAr, splitBy, cb){
  var deferred;
  var origAr = origAr;

  // Check for existence of done callback to see if this should work non-blocking.
  var hasDoneCallback = cb.length > 1;
  // Array of split orig array.

  var splitArrays = [];
  var jobs = [];

  while (origAr.length > 0){
    splitArrays.push(origAr.splice(0, splitBy));
  }

  if (hasDoneCallback){
    deferred = Q.defer();
    // For each splitArray create a job
    splitArrays.forEach(function(arSection, i, all){
      jobs.push(function(){
        var d = Q.defer();

        cb(arSection, d.resolve);
        return d.promise;
      });
    });

    var result = Q();

    jobs.forEach(function (f) {
      result = result.then(f);
    });
    result
      .fin(deferred.resolve)
      .done();

    return deferred.promise;
  }else{
    splitArrays.forEach(function(arSection){
        cb(arSection);
    });
  }
}

module.exports = splitDo;
