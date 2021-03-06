'use strict';

var gaze = require('../lib/gaze.js');
var helper = require('./helper.js');
var path = require('path');

exports.api = {
  setUp: function (done) {
    process.chdir(path.resolve(__dirname, 'fixtures'));
    done();
  },
  newGaze: function (test) {
    test.expect(2);
    new gaze.Gaze('**/*', {}, function () {
      var result = this.relative(null, true);
      helper.deepEqual(test, result['.'], ['Project (LO)/', 'nested/', 'one.js', 'sub/']);
      helper.deepEqual(test, result['sub/'], ['one.js', 'two.js']);
      this.on('end', test.done);
      this.close();
    });
  },
  func: function (test) {
    test.expect(1);
    var g = gaze('**/*', function (err, watcher) {
      test.deepEqual(watcher.relative('sub', true), ['one.js', 'two.js']);
      g.on('end', test.done);
      g.close();
    });
  },
  ready: function (test) {
    test.expect(1);
    var g = new gaze.Gaze('**/*');
    g.on('ready', function (watcher) {
      test.deepEqual(watcher.relative('sub', true), ['one.js', 'two.js']);
      this.on('end', test.done);
      this.close();
    });
  },
  newGazeNomatch: function (test) {
    test.expect(1);
    var g = new gaze.Gaze('nomatch.js');
    g.on('nomatch', function (watcher) {
      test.ok(true, 'nomatch was emitted.');
      this.on('end', test.done);
      this.close();
    });
  },
  nomatch: function (test) {
    test.expect(1);
    gaze('nomatch.js', function (err, watcher) {
      watcher.on('nomatch', function () {
        test.ok(true, 'nomatch was emitted.');
        watcher.close();
      });
      watcher.on('end', test.done);
    });
  },
};
