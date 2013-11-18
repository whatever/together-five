'use strict';

var app = function (_canvasId) {
  var _canvas = document.getElementById(_canvasId), _gl = _canvas.getContext('webgl') || _canvas.getContext('experimental-webgl');

  var _rotation = [ 0, 0, 0 ], _momentum = [ 0, 0, 0 ];

  // Planes
  var _planes = [
    new MaskedPlane([0, -0.30, 0], [4.0, 4.0, 4.0], { color : [1, 1, 1, 0.20], mask : '/public/img/-2_TRANS.png', pattern : '/public/img/-2_PATTERN.png' }),
    new MaskedPlane([0, -0.15, 0], [4.0, 4.0, 4.0], { color : [1, 1, 0, 0.20], mask : '/public/img/-1_TRANS.png', pattern : '/public/img/-1_PATTERN.png' }),
    new MaskedPlane([0, -0.00, 0], [4.0, 4.0, 4.0], { color : [1, 0, 1, 0.20], mask : '/public/img/+0_TRANS.png', pattern : '/public/img/+0_PATTERN.png' }),
    new MaskedPlane([0, +0.15, 0], [4.0, 4.0, 4.0], { color : [1, 1, 1, 0.20], mask : '/public/img/+1_TRANS.png', pattern : '/public/img/+1_PATTERN.png' }),
    new MaskedPlane([0, +0.30, 0], [4.0, 4.0, 4.0], { color : [0, 1, 1, 0.20], mask : '/public/img/+2_TRANS.png', pattern : '/public/img/+2_PATTERN.png' }),
  ];
  // Logo
  var _logo = new TogetherLogo(
    [ 0.0, 0.45, 0.0 ],
    [ 2.0, 0.00, 1.0 ],
    { color : [ 0, 0, 0, 1. ] }
  );

  var _is = { running : true };
  var _isRunning = true;

  // ...
  var _pressedKeys = {};
  
  var _controls = {
    z_translate : 4.,
    textureNumber : 0,
    lighting_x : 0.10,
    lighting_y : 0.1,
    lighting_z : 0.1,
    lightingDirection : [ -1.00, -0.30, -1.0 ],
    ambientLightColor : [ +.35 * 255, .30 * 255, .27 * 255 ],
    directionalLightColor : [ .6 * 255, .6 * 255, .6 * 255 ],
    alpha : 1.,
    transparency : true,
    rotate : 0.2,
  };

  // var _gui = new dat.GUI();
  // _gui.add(_controls, "rotate", -Math.PI, Math.PI, .01);

  document.onkeyup = function (ev) {
    _pressedKeys[ev.keyCode] = false;
  }

  document.onkeydown = function (ev) {
    _pressedKeys[ev.keyCode] = true;
  }

  // ...
  var _passProg = webgl.createProgramFromIds(gl, "vert-pass", "frag-pass");
  var _maskProg = webgl.createProgramFromIds(gl, "vert-mask", "frag-mask");
  var _patternMaskProg = webgl.createProgramFromIds(gl, "vert-pattern-mask", "frag-pattern-mask");

  // Return actual object
  return {
    init : function () {
      setup();
      _gl.bindBuffer(_gl.ARRAY_BUFFER, null);
    },
    addMovement : function (dx, dy) {
      if (isNaN(dx) && !isFinite(dx))
        dx = 0.;
      if (isNaN(dy) && !isFinite(dy))
        dy = 0.;

      _momentum[0] -= _sign(dx) * Math.min(Math.sqrt(Math.abs(dx))/200, 10);
      _momentum[2] -= _sign(dy) * Math.min(Math.sqrt(Math.abs(dy))/200, 10);

      function _sign(x) { return x ? x < 0 ? -1 : 1 : 0; }
    },
    loop : loop,
    print : function () {
    }
  };
  /**
   * Begin looping animation
   * @return {undefined} undefined
   */
  function loop () {
    if (_isRunning)
      requestAnimationFrame(loop);
    update();
    draw();
  }

  function setup() {
    _gl.viewport(0, 0, _canvas.width, _canvas.height);
    _gl.clearColor(0, 0, 0, 1);
    _gl.clearDepth(1.0);
    _gl.enable(_gl.BLEND);
    _gl.blendFunc(_gl.SRC_ALPHA, _gl.ONE);
  }

  function update() {
    updatePosition();
    // _rotation[0] += _rotation[0]
    // _rotation[2] += 1.1;
    _rotation[0] /= 1.025;
    _rotation[2] /= 1.025;
    _rotation[0] += _momentum[0];
    _rotation[2] += _momentum[2];
    _momentum[0] /= 1.20;
    _momentum[2] /= 1.20;
  }

  /**
   * Draw Frame
   * @return {undefined} undefined
   */
  function draw() {
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    var t = getElapsedSeconds() / 1.5;
    webgl.perspectiveMatrix({
      fieldOfView : 45,
      aspectRatio : 1,
      nearPlane : .1,
      farPlane : 100
    });

    mat4.identity(webgl.mvMatrix);
    mat4.translate(webgl.mvMatrix, [ 0, 0, -_controls.z_translate ]);
    mat4.rotate(webgl.mvMatrix, Math.PI/2, [ 1, 0, 0 ]);
    var r = vec3.create();
    r[2] = _rotation[0];
    r[0] = - _rotation[2];
    var d = Math.sqrt(r[0]*r[0] + r[1]*r[1] + r[2]*r[2]);
    mat4.rotate(webgl.mvMatrix, d, r);

    for (var i = 0; i < _planes.length; i++) {
      _gl.enable(_gl.BLEND);
      _gl.blendFunc(_gl.SRC_ALPHA, _gl.ONE);
      _planes[i].draw(_patternMaskProg);
    }

    mat4.identity(webgl.mvMatrix);
    mat4.translate(webgl.mvMatrix, [ 0, 0, -_controls.z_translate ]);
    mat4.rotate(webgl.mvMatrix, Math.PI/2, [ 1, 0, 0 ]);
    mat4.rotate(webgl.mvMatrix, d, r);

    _gl.blendFunc(_gl.SRC_ALPHA, _gl.ONE_MINUS_SRC_ALPHA);
    _logo.draw(_maskProg);
  }

  function updatePosition() {
    if (_pressedKeys[72]) {
    }
    if (_pressedKeys[74]) {
    }
    if (_pressedKeys[75]) {
    }
    if (_pressedKeys[76]) {
    }
    if (_pressedKeys[87]) {
      _controls.z_translate += .09;
    }
    if (_pressedKeys[83]) {
      _controls.z_translate -= .09;
    }
  }
}
