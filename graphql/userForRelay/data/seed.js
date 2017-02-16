'use strict';Object.defineProperty(exports, "__esModule", { value: true });var _fs = require('fs');var _fs2 = _interopRequireDefault(_fs);
var _mongodb = require('mongodb');function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _asyncToGenerator(fn) {return function () {var gen = fn.apply(this, arguments);return new Promise(function (resolve, reject) {function step(key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {return Promise.resolve(value).then(function (value) {step("next", value);}, function (err) {step("throw", err);});}}return step("next");});};}

var collectionPrefix = 'userForRelay_';exports.default = function () {var _ref = _asyncToGenerator(regeneratorRuntime.mark(

  function _callee2(db) {var files, collectionNames;return regeneratorRuntime.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:
            files = [
            'users'];_context2.next = 3;return (


              db.listCollections().toArray());case 3:_context2.t0 = function (o) {return o.name;};collectionNames = _context2.sent.map(_context2.t0);_context2.next = 7;return (

              Promise.all(
              files.map(function (file) {
                return _asyncToGenerator(regeneratorRuntime.mark(function _callee() {var colName, data, result;return regeneratorRuntime.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:
                          colName = '' + (collectionPrefix || '') + file;
                          data = JSON.parse(
                          _fs2.default.readFileSync(__dirname + '/' + file + '.json', 'utf8'));

                          data.forEach(function (d, i) {
                            data[i]._id = new _mongodb.ObjectID.createFromHexString(data[i]._id);
                          });if (!
                          collectionNames.includes(colName)) {_context.next = 7;break;}
                          console.log('  \'' + colName + '\' dropped');_context.next = 7;return (
                            db.dropCollection(colName));case 7:_context.next = 9;return (

                            db.collection(colName).insertMany(data));case 9:result = _context.sent;
                          console.log('  \'' + colName + '\' created with ' + result.insertedCount + ' records');case 11:case 'end':return _context.stop();}}}, _callee, this);}))();

              })));case 7:return _context2.abrupt('return', _context2.sent);case 8:case 'end':return _context2.stop();}}}, _callee2, this);}));function seed(_x) {return _ref.apply(this, arguments);}return seed;}();