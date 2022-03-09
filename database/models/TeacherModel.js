module.exports = (sequelize, Sequelize) => {
  const Teacher = sequelize.define('teacher', {
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
    }
  }, { updatedAt: false });
  return Teacher;
};
