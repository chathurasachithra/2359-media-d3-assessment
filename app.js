const express = require('express');
const path = require('path');
const logger = require('morgan');
const cors = require('cors');

const db = require('./database/models');
const indexRouter = require('./routes/index');
const v1Router = require('./routes/v1');

const app = express();

app.use(cors());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// routes
app.use('/', indexRouter);
app.use('/api', v1Router);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  res.status(404).json({
    statusCode: 404, message: 'Route Not Found'
  });
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

db.sequelize.sync();

module.exports = app;
