module.exports = (sequelize, Sequelize) => {
  const Student = sequelize.define('student', {
    id: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.STRING(255),
      allowNull: false
    },
    email: {
      type: Sequelize.STRING(255),
      allowNull: false
    },
    suspend: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    }
  }, { updatedAt: false });
  return Student;
};
