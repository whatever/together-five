var getElapsedSeconds = (function () {
  var $_$ = +new Date();
  return function () { return (new Date() - $_$)/1000.; };
})();

var Wave = (function (id) {
  var _const = {
    freq : 14 - 1.1387,
    shift : 2 + 1.64166,
    yscale : 0.7
  };

  var _x = {
    freq : 0.0001,
    shift: 0.0001
  };

  /*
  var _gui = new dat.GUI();
  _gui.add(_x, "freq",  -4., +4., .05);
  _gui.add(_x, "shift", -2., +5., .10);
  _gui.add(_const, "yscale", 0., 2., .05);
  */

  var _canvas = document.getElementById(id);
  var _c = _canvas.getContext("2d");
  var _isRunning = true;
  var _img = new Image();
  _img.src = "/public/BKGD.png";
  _img.onload = function () {
  }

  var ___ = {
    a : 1.0,
    b : 1.0,
    c : 1.0,
    e : 0.0
  };

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
    y += .57 * Math.cos(x/9);
    y += .07 * Math.sin(3 * x);
    y += .03 * Math.sin(5 * x);
    y += .03 * Math.sin(13 * x);
    y += .03 * Math.cos(5 * x);
    y += .03 * Math.cos(Math.sin(5 * x));
    y += .03 * Math.cos(Math.cos(7 * x) * x);
    return ___.e * (.18 * y + .48 * Math.cos(x/2) * x);
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
  var _xmin = -1.00, _xmax = 1.0, _xsize = 90;
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
    if (typeof vals.a == "number" && vals.a) 
      ___.a += vals.a;
    if (typeof vals.b == "number" && vals.b) 
      ___.b += vals.b;
    if (typeof vals.c == "number" && vals.c) 
      ___.c += .001;
    if (typeof vals.e == "number") 
      ___.e += ___.e < 1 ? Math.min(vals.e, 1) : 0;
  }
  function _loop () {
    if (_isRunning)
      requestAnimationFrame(_loop);
    canvas.width = canvas.width;
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

      var xfreq = _x.freq + _const.freq;
      var xshift = _x.shift + _const.shift;
      var val = xfreq * (x + 1.25) + xshift
      y += ___.a * _circleWave(val);
      y += ___.e * _noise1(val);
      y += (___.e * ___.e) * _ripple(val + 4*t);
      y -= _trickle(val + 4.90*t);
      y /= 8.5;
      y *= _const.yscale;
      y -= .006;
      _mesh[i] = [ x, y ];
    }

    // Controls!
    ___.a = ((___.a - 1) / 1.1) + 1;
    ___.b = ((___.b - 1) / 1.1) + 1;
    ___.c = ((___.c - 1) / 1.1) + 1;
    ___.e /= 1.030;
  }

  function _draw () {

    var a = _canvas.width/2;
    var b = _canvas.height/2;

    _c.lineWidth   = '0.010';

    _c.transform(+a, +0, +0, +b, +a, +b); 
    _c.drawImage(_img, -1, -1, 2, 2);

    var faded = 'rgba(020, 020, 20, 0)';
    var dark  = 'rgba(100, 200, 0, .7)';

    _c.transform(1, 0, 0, -1, 0, 0); 
    var g = _c.createLinearGradient(-1, 0, 1, 0);
    g.addColorStop(0.0, faded);
    g.addColorStop(0.3, dark);
    g.addColorStop(0.6, dark);
    g.addColorStop(1.0, faded);

    // <--
    _c.beginPath();
    _c.strokeStyle = g;
    // _c.strokeStyle = 'white';
    var p = [ _mesh[0][0], _mesh[0][1] ];
    _c.moveTo(p[0], p[1]);
    for (var i = 1; i < _mesh.length; i++) {
      p = [ _mesh[i][0], _mesh[i][1] ];
      _c.lineTo(p[0], p[1]);
    }
    _c.stroke();
    // --->
  }

  function _circleWave (x) {
    x += 1;
    var sgn = 1.;
    if (x % 4 < 2.0)
      sgn = -1;
    x %= 2;
    x -= 1;
    return sgn * Math.sqrt(1 - x * x);
  }
  function _noise1 (x) {
    var plus = x < 0 ? -x/10 : 0;
    return plus + -a[1] * Math.cos(2*x) - a[3] * Math.cos(3*x);
  }

  function _ripple (x) {
    return -a[1] * Math.cos(2*x) + a[3] * Math.cos(3 * x) + 1*Math.cos(x);
  }

  function _trickle (x) {
    return .02 * Math.cos(30 * x) + .02 * Math.sin(7*x)+ .02 * Math.sin(5*x);;
  }
});
