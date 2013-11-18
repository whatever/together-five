/* exported getElapsedSeconds */

/**
 * Get Elapsed Time of Webapp
 * Compute the elapsed time since the "getElapsedSeconds" started.
 * @return {float} the number of seconds with 3 digits of precision
 */
var getElapsedSeconds = (function () {
  var $_$ = +new Date();
  return function () { return (new Date() - $_$)/1000; };
})();
