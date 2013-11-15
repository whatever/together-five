var getElapsedSeconds = (function () {
  var $_$ = +new Date();
  return function () { return (new Date() - $_$)/1000.; };
})();
