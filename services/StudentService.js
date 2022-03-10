const baseJoi = require('joi');
const extension = require('joi-date-extensions');
const _ = require('lodash');

const Joi = baseJoi.extend(extension);
const db = require('../database/models');

const StudentModel = db.students;
const TeacherModel = db.teachers;
const AssignedStudentModel = db.assigned_students;

const registerSchema = Joi.object().keys({
  teacher: Joi.string().required(),
  students: Joi.array().required()
});

const commonStudentsSchema = Joi.object().keys({
  teacher: Joi.alternatives().try(Joi.array().items(Joi.string()), Joi.string())
});

const suspendSchema = Joi.object().keys({
  student: Joi.string().required()
});

const retrieveForNotificationsSchema = Joi.object().keys({
  teacher: Joi.string().required(),
  notification: Joi.string().required()
});

const StudentService = {

  getTeacherIdFromEmail: async (email) => {
    const teacher = await TeacherModel.findOne({
      where: {
        email
      }
    });
    if (teacher && teacher.id) {
      return teacher.id;
    }
    const insertTeacher = await TeacherModel.create({
      email,
      name: email
    });
    return insertTeacher.id;
  },

  getStudentIdFromEmail: async (email) => {
    const student = await StudentModel.findOne({
      where: {
        email
      }
    });
    if (student && student.id) {
      return student.id;
    }
    const insertStudent = await StudentModel.create({
      email,
      name: email
    });
    return insertStudent.id;
  },

  register: async (request) => {
    const validation = Joi.validate(request, registerSchema);
    if (validation.error) {
      const errorMessage = validation.error.details.shift();
      throw new Error(errorMessage.message);
    }
    const teacherId = await StudentService.getTeacherIdFromEmail(request.teacher);
    const studentIds = await Promise.all(request.students.map(async (studentEmail) => {
      const id = await StudentService.getStudentIdFromEmail(studentEmail);
      await AssignedStudentModel.upsert(
        { teacher_id: teacherId, student_id: id }
      );
      return id;
    }));
    return { teacherId, studentIds };
  },

  commonStudents: async (request) => {
    const validation = Joi.validate(request, commonStudentsSchema);
    if (validation.error) {
      const errorMessage = validation.error.details.shift();
      throw new Error(errorMessage.message);
    }
    const emails = _.isArray(request.teacher) ? request.teacher : [request.teacher];
    const teacherStudentIds = await Promise.all(emails.map(async (teacherEmail) => {
      const id = await StudentService.getTeacherIdFromEmail(teacherEmail);
      const studentIdsForTeacher = await AssignedStudentModel.findAll({
        where: {
          teacher_id: id
        },
        attributes: ['student_id'],
        raw: true
      });
      return _.map(studentIdsForTeacher, studentId => studentId.student_id);
    }));
    const commonStudentIds = teacherStudentIds.shift()
      .filter(v => teacherStudentIds.every(a => a.indexOf(v) !== -1));
    const students = await StudentModel.findAll({
      where: {
        id: commonStudentIds
      },
      attributes: ['email'],
      raw: true
    });
    return { students: _.map(students, student => student.email) };
  },

  suspend: async (request) => {
    const validation = Joi.validate(request, suspendSchema);
    if (validation.error) {
      const errorMessage = validation.error.details.shift();
      throw new Error(errorMessage.message);
    }
    await StudentModel.update(
      { suspend: true },
      { where: { email: request.student } }
    );
    return true;
  },

  extractEmails: text => text.match(/(@[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi),

  retrieveForNotifications: async (request) => {
    const validation = Joi.validate(request, retrieveForNotificationsSchema);
    if (validation.error) {
      const errorMessage = validation.error.details.shift();
      throw new Error(errorMessage.message);
    }
    const teacherId = await StudentService.getTeacherIdFromEmail(request.teacher);
    let studentIdsForTeacher = await AssignedStudentModel.findAll({
      where: {
        teacher_id: teacherId
      },
      attributes: ['student_id'],
      raw: true
    });
    studentIdsForTeacher = _.map(studentIdsForTeacher, studentId => studentId.student_id);
    const students = await StudentModel.findAll({
      where: {
        id: studentIdsForTeacher,
        suspend: false
      },
      attributes: ['email'],
      raw: true
    });
    const studentEmails = _.map(students, student => student.email);
    let mentionedEmails = StudentService.extractEmails(request.notification);
    mentionedEmails = mentionedEmails.map(mentionedEmail => mentionedEmail.substring(1));
    const recipients = studentEmails.concat(mentionedEmails);
    return { recipients };
  }
};

module.exports = StudentService;
