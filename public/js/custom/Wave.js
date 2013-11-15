var getElapsedSeconds = (function () {
  var $_$ = +new Date();
  return function () { return (new Date() - $_$)/1000.; };
})();

// ...
var Wave = (function (id) {
  var _canvas = document.getElementById(id);
  var _c = _canvas.getContext("2d");
  var _isRunning = true;

  var ___ = {
    a : 0.0,
    b : 0.0,
    c : 0.0,
    e : 0.0
  };

  var _gui = new dat.GUI();
  _gui.add(___, "a", -1.0, +1.0, .001);
  _gui.add(___, "b", -1.0, +1.0, .001);
  _gui.add(___, "c", -1.0, +1.0, .001);

  var a = [
    +0.00000000, +1.14270000, +0.45296000, +0.17753000, -0.02593500,
    -0.10291000, -0.07243600, -0.00105080, +0.04607100, +0.04281500,
    +0.00682870, -0.02524500, -0.02924900, -0.00849660, +0.01496500,
    +0.02147800, +0.00887470, -0.00902450, -0.01640690, -0.00873870,
    +0.00524910, +0.01280000, +0.00836650, -0.00269900, -0.01008200
  ];

  function circleWave (x) {
  }

  function _noise (x) {
    var y = 0.0;
    y += .02 * Math.sin(9 * x);
    y += .09 * Math.sin(3 * x);
    y += .02 * Math.sin(5 * x);
    y += .02 * Math.cos(2 * x);
    y += .09 * Math.cos(4 * x);
    y += .02 * Math.cos(6 * x);
    return y;
  }

  function _wave1 (x) {
    x += 1;
    var sgn = 1.;
    if (x % 4 < 2.0) {
      sgn = -1;
    }
    x %= 2;
    x -= 1;
    var set = [ 1, 9, 10, 15, 16, 17, 21, 22 ];
    var y = 0.0;
    for (var i = 0; i < set.length; i++) {
      var k = set[i];
      y += a[k] * Math.cos(k * x);
    }
    return sgn * y;
  }

  function _wave2 (x) {
    x += 1;
    var sgn = 1.;
    if (x % 4 < 2.0) {
      sgn = -1;
    }
    x %= 2;
    x -= 1;
    var set = [ 2, 3, 4, 12, 13, 14, 18, 20 ];
    var y = 0.0;
    for (var i = 0; i < set.length; i++) {
      var k = set[i];
      y += a[k] * Math.cos(k * x);
    }
    return sgn * y;
  }

  function _wave3 (x) {
    x += 1;
    var sgn = 1.;
    if (x % 4 < 2.0) {
      sgn = -1;
    }
    x %= 2;
    x -= 1;
    var set = [ 5, 6, 7, 8, 11, 19, 23, 24 ];
    var y = 0.0;
    for (var i = 0; i < set.length; i++) {
      var k = set[i];
      y += a[k] * Math.cos(k * x);
    }
    return sgn * y;
  }

  (function () {
    // Coefficients for 
    var offset = .75;
    var scale  = 1/1.6;
  })();

  var _mesh = [ ];
  var _xmin = -1.0, _xmax = 1.0, _xsize = 200;
  var dx = (_xmax - _xmin)/(_xsize-1);

  for (var i = 0; i < _xsize; i++) {
    var x = dx * i + _xmin;
    var y = 0;
    _mesh.push([ x, y ]);
  }

  return {
    set     : _set,
    loop    : _loop,
    update  : _update,
    draw    : _draw
  };
  /**
   *    --======*==-
   *  --======*==-
   *    --======*==-
   *  --======*==-
   */
  function _set (vals) {
    if (vals === undefined)
      return;
    if (typeof vals.a == "number") 
      ___.a = vals.a;
    if (typeof vals.b == "number") 
      ___.b = vals.b;
    if (typeof vals.c == "number") 
      ___.c = vals.c;
  }
  function _loop () {
    if (_isRunning)
      requestAnimationFrame(_loop);
    canvas.width = canvas.width;
    canvas.height = canvas.height;
    _update();
    _draw();
  }
  // ...
  function _alpha (val) {
    if (val !== undefined)
      _alpha = val;
    return _alpha;
  }
  // ...
  function _beta (val) {
    if (val !== undefined)
      _beta = val;
    return _beta;
  }
  /**
   *
   */
  function _update () {
    for (var i = 0; i < _mesh.length; i++) {
      var x = _mesh[i][0];
      var y = 0.0;
      var t = getElapsedSeconds();
      var val = 11 * (x + 100);
      y += ___.a * _wave1(val);
      y += ___.b * _wave2(val);
      y += ___.c * _wave3(val);
      y += _noise(3*x + 3*t);
      y /= 1.6;
      y /= 11;
      _mesh[i] = [ x, y ];
    }
  }

  function _draw () {
    var a = _canvas.width/2;
    var b = _canvas.height/2;

    _c.strokeStyle = 'black';
    _c.lineWidth   = '0.010';
    _c.transform(+a, +0, +0, -b, +a, +b); 
    // <--
    _c.beginPath();
    var p = [ _mesh[0][0], _mesh[0][1] ];
    _c.moveTo(p[0], p[1]);
    for (var i = 1; i < _mesh.length; i++) {
      p = [ _mesh[i][0], _mesh[i][1] ];
      _c.lineTo(p[0], p[1]);
    }
    _c.stroke();
    // --->
  }
});
