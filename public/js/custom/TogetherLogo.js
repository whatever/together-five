/* exported getElapsedSeconds, TogetherLogo  */
var getElapsedSeconds = (function () {
  'use strict';
  var $_$ = +new Date();
  return function () { return (new Date() - $_$)/1000; };
})();

/**
 * Get Mouse Position from Event (Cross-Browser)
 */
var getMousePosition = (function() {
  'use strict';
  if (window.pageXOffset !== undefined) {
    return function (ev) {
      return [ev.clientX+window.pageXOffset, ev.clientY+window.pageYOffset];
    };
  }
  else {
    return function () {
      var ev = window.event,
      d = document.documentElement, b= document.body;
      return [ev.clientX+d.scrollLeft+ b.scrollLeft, ev.clientY+d.scrollTop+ b.scrollTop];
    };
  }
})();

var TogetherLogo = function (id) {
  'use strict';
  var _const = { freq : 14 - 1.1387, shift : 2 + 1.64166, yscale : 0.7 };
  var _x = { freq : 0.0001, shift: 0.0001 };
  var _canvas;

  if (id === undefined) {
    _canvas = document.createElement('CANVAS');
  }
  else if (typeof id === 'string') {
    _canvas = document.getElementById(id);
  }
  else {
    _canvas = id;
  }

  var _c = _canvas.getContext('2d');
  var _img = new Image();

  var ___ = { a : 1.0, b : 1.0, c : 1.0, e : 0.0 };

  var a = [
    +0.00000000, +1.14270000, +0.45296000, +0.17753000, -0.02593500,
    -0.10291000, -0.07243600, -0.00105080, +0.04607100, +0.04281500,
    +0.00682870, -0.02524500, -0.02924900, -0.00849660, +0.01496500,
    +0.02147800, +0.00887470, -0.00902450, -0.01640690, -0.00873870,
    +0.00524910, +0.01280000, +0.00836650, -0.00269900, -0.01008200
  ];

  var _mesh = [ ];
  var _xmin = -1.00, _xmax = 1.0, _xsize = 90;
  var dx = (_xmax - _xmin)/(_xsize-1);

  for (var i = 0; i < _xsize; i++) {
    var x = dx * i + _xmin;
    var y = 0;
    _mesh.push([ x, y ]);
  }

  window.onmousemove = (function () {
    var last = { x : undefined, y : undefined };
    return function (ev) {
      var xy = getMousePosition(ev);
      var dx = 0, dy = 0;
      if (typeof last.x === 'number') {
        dx = Math.abs(xy[0] - last.x)/3;
      }
      if (typeof last.y === 'number') {
        dy = Math.abs(xy[1] - last.y)/3;
      }
      var d = Math.sqrt(dx*dx + dy*dy) * 40;
      last.x = xy[0];
      last.y = xy[1];
      _set({ a : 0, b : (0.7*dy + 0.3*dx), c : d*(dx + dy), e : dx });
    };

    // Immediately begin loop
  })();

  _loop();
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
    if (vals === undefined) {
      return;
    }
    if (typeof vals.a === 'number' && vals.a) {
      ___.a += vals.a;
    }
    if (typeof vals.b === 'number' && vals.b) {
      ___.b += vals.b;
    }
    if (typeof vals.c === 'number' && vals.c) {
      ___.c += 0.001;
    }
    if (typeof vals.e === 'number') {
      ___.e = 1.0;
    }
    if (typeof vals.bg === 'string') {
      _img = new Image();
      _img.src = vals.bg;
    }
  }
  function _loop () {
    requestAnimationFrame(_loop);
    _canvas.width = _canvas.width;
    _update();
    _draw();
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
      var val = xfreq * (x + 1.25) + xshift;
      y += ___.a * _circleWave(val);
      y += ___.b * _trickle((val/20 + t/2));
      y += ___.e * _noise1(val + t/3);
      y /= 10.5;
      y *= _const.yscale;
      y -= 0.006;
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
    if (_img.height !== 0) {
      _c.drawImage(_img, -1, -1, 2, 2);
    }

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
    var sgn = 1.0;
    if (x % 4 < 2.0) {
      sgn = -1;
    }
    x %= 2;
    x -= 1;
    return sgn * Math.sqrt(1 - x * x);
  }
  function _noise1 (x) {
    var plus = x < 0 ? -x/10 : 0;
    return plus  - a[1] * Math.cos(2*x) - a[3] * Math.cos(3*x);
  }

  function _trickle (x) {
    return 0.02 * Math.cos(30 * x) + 0.02 * Math.sin(7*x)+ 0.02 * Math.sin(5*x);
  }
};
