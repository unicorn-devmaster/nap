'use strict';Object.defineProperty(exports, "__esModule", { value: true });var _graphqlCompose = require('graphql-compose');
var _graphqlComposeRelay = require('graphql-compose-relay');var _graphqlComposeRelay2 = _interopRequireDefault(_graphqlComposeRelay);
var _user = require('./models/user');function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}







var GQC = new _graphqlCompose.ComposeStorage();

var RootQueryTC = GQC.rootQuery();
(0, _graphqlComposeRelay2.default)(RootQueryTC);

RootQueryTC.addFields({
  userById: _user.UserTC.getResolver('findById'),
  userByIds: _user.UserTC.getResolver('findByIds'),
  userOne: _user.UserTC.getResolver('findOne'),
  userMany: _user.UserTC.getResolver('findMany'),
  userTotal: _user.UserTC.getResolver('count'),
  userConnection: _user.UserTC.getResolver('connection') });


GQC.rootMutation().addFields({
  userCreate: _user.UserTC.getResolver('createOne'),
  userUpdateById: _user.UserTC.getResolver('updateById'),
  userUpdateOne: _user.UserTC.getResolver('updateOne'),
  userUpdateMany: _user.UserTC.getResolver('updateMany'),
  userRemoveById: _user.UserTC.getResolver('removeById'),
  userRemoveOne: _user.UserTC.getResolver('removeOne'),
  userRemoveMany: _user.UserTC.getResolver('removeMany') });


var graphqlSchema = GQC.buildSchema();exports.default =
graphqlSchema;