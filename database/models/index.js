const Sequelize = require('sequelize');

const dbConfig = {
  HOST: 'localhost',
  USER: 'root',
  PASSWORD: 'root',
  DB: 'assignment_db',
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.teachers = require('./TeacherModel')(sequelize, Sequelize);
db.students = require('./StudentModel')(sequelize, Sequelize);
db.assigned_students = require('./AssignedStudentModel')(sequelize, Sequelize);

module.exports = db;
