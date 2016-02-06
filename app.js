
/**
 * Module dependencies
 */

var express = require('express'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  morgan = require('morgan'),
  routes = require('./routes'),
  api = require('./routes/api'),
  http = require('http'),
  path = require('path'),
  auth = require('./auth/auth');

var app = module.exports = express();

/**
 * Configuration
 */

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(morgan('dev'));
app.use(bodyParser());
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Routes
 */

// serve index and view partials
app.get('/', routes.index);
app.get('/partials/:name', routes.partials);

// satellizer authentication
app.post('/auth/google', auth.googleAuth);

// JSON API
app.get('/api/me', auth.ensureAuthenticated, auth.findUser);
app.get('/api/erasmusList', api.erasmusList);
app.get('/api/erasmus/:id', api.erasmus);
app.get('/api/erasmus/:erasmus_id/assignedPeer', api.assignedPeer);
app.get('/api/peerList', api.peerList);
app.get('/api/peer/:id', api.peer);
app.get('/api/peer/:peer_id/assignedErasmus', api.assignedErasmus);

// redirect all others to the index (HTML5 history)
app.get('*', routes.index);

/**
 * Start Server
 */

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
