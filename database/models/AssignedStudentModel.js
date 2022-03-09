module.exports = (sequelize, Sequelize) => {
  const AssignedStudent = sequelize.define('assigned_student', {
    id: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    teacher_id: {
      type: Sequelize.INTEGER(11),
      allowNull: false
    },
    student_id: {
      type: Sequelize.INTEGER(11),
      allowNull: false
    },
  }, { updatedAt: false });
  return AssignedStudent;
};
