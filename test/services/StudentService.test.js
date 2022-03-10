/* eslint-disable no-console */
/* eslint-disable no-undef */
const StudentService = require('../../services/StudentService');
const db = require('../../database/models');

const StudentModel = db.students;
const TeacherModel = db.teachers;
const AssignedStudentModel = db.assigned_students;

describe('Testing StudentService getTeacherIdFromEmail', () => {
  test('StudentService getTeacherIdFromEmail should return id for existing teacher', async () => {
    const mockFindOne = jest.spyOn(TeacherModel, 'findOne');
    mockFindOne.mockImplementation(() => Promise.resolve({
      id: 23,
      email: 'teacher@test.com'
    }));
    const result = await StudentService.getTeacherIdFromEmail('teacher@test.com');
    expect(result).toBe(23);
    mockFindOne.mockRestore();
  });

  test('StudentService getTeacherIdFromEmail should return id for newly inserted teacher', async () => {
    const mockFindOne = jest.spyOn(TeacherModel, 'findOne');
    mockFindOne.mockImplementation(() => Promise.resolve({}));
    const mockCreate = jest.spyOn(TeacherModel, 'create');
    mockCreate.mockImplementation(() => Promise.resolve({
      id: 24,
      email: 'teacher@test.com'
    }));
    const result = await StudentService.getTeacherIdFromEmail('teacher@test.com');
    expect(result).toBe(24);
    mockFindOne.mockRestore();
    mockCreate.mockRestore();
  });
});

describe('Testing StudentService getStudentIdFromEmail', () => {
  test('StudentService getStudentIdFromEmail should return id for existing student', async () => {
    const mockFindOne = jest.spyOn(StudentModel, 'findOne');
    mockFindOne.mockImplementation(() => Promise.resolve({
      id: 23,
      email: 'student@test.com'
    }));
    const result = await StudentService.getStudentIdFromEmail('student@test.com');
    expect(result).toBe(23);
    mockFindOne.mockRestore();
  });

  test('StudentService getStudentIdFromEmail should return id for newly inserted student', async () => {
    const mockFindOne = jest.spyOn(StudentModel, 'findOne');
    mockFindOne.mockImplementation(() => Promise.resolve({}));
    const mockCreate = jest.spyOn(StudentModel, 'create');
    mockCreate.mockImplementation(() => Promise.resolve({
      id: 24,
      email: 'student@test.com'
    }));
    const result = await StudentService.getStudentIdFromEmail('student@test.com');
    expect(result).toBe(24);
    mockFindOne.mockRestore();
    mockCreate.mockRestore();
  });
});

describe('Testing StudentService register', () => {
  test('StudentService register should return error with invalid body', async () => {
    let thrownError;
    try {
      await StudentService.register({
        teachers: 'teacherken@gmail.com',
        students:
          [
            'studentjon1@gmail.com',
            'studenthon2@gmail.com'
          ]
      });
    } catch (error) {
      thrownError = error;
    }
    expect(thrownError).toEqual(new Error('"teacher" is required'));
  });

  test('StudentService register should return error with invalid body', async () => {
    let thrownError;
    try {
      await StudentService.register({
        teacher: 'teacherken@gmail.com',
        students: 'studentjon1@gmail.com'
      });
    } catch (error) {
      thrownError = error;
    }
    expect(thrownError).toEqual(new Error('"students" must be an array'));
  });

  test('StudentService register should return object when success', async () => {
    const mockGetTeacherIdFromEmail = jest.spyOn(StudentService, 'getTeacherIdFromEmail');
    mockGetTeacherIdFromEmail.mockImplementation(() => Promise.resolve(1));
    const mockGetStudentIdFromEmail = jest.spyOn(StudentService, 'getStudentIdFromEmail');
    mockGetStudentIdFromEmail.mockImplementation(() => Promise.resolve(2));
    const mockUpsert = jest.spyOn(AssignedStudentModel, 'upsert');
    mockUpsert.mockImplementation(() => Promise.resolve({}));

    const result = await StudentService.register({
      teacher: 'teacherken@gmail.com',
      students:
        [
          'studentjon1@gmail.com'
        ]
    });
    expect(result).toStrictEqual({ teacherId: 1, studentIds: [2] });
    mockGetTeacherIdFromEmail.mockRestore();
    mockGetStudentIdFromEmail.mockRestore();
    mockUpsert.mockRestore();
  });
});

describe('Testing StudentService commonStudents', () => {
  test('StudentService commonStudents should return error with invalid body', async () => {
    let thrownError;
    try {
      await StudentService.commonStudents({
        teachers: 'teacherken@gmail.com'
      });
    } catch (error) {
      thrownError = error;
    }
    expect(thrownError).toEqual(new Error('"teachers" is not allowed'));
  });

  test('StudentService commonStudents should return object when success', async () => {
    const mockGetTeacherIdFromEmail = jest.spyOn(StudentService, 'getTeacherIdFromEmail');
    mockGetTeacherIdFromEmail.mockImplementation(() => Promise.resolve(1));
    const mockFindAll = jest.spyOn(StudentModel, 'findAll');
    mockFindAll.mockImplementation(() => Promise.resolve([{
      id: 23,
      email: 'student@test.com'
    }]));
    const result = await StudentService.commonStudents({
      teacher: ['teacherkentest@gmail.com']
    });
    expect(result).toStrictEqual({ students: ['student@test.com'] });
    mockGetTeacherIdFromEmail.mockRestore();
    mockFindAll.mockRestore();
  });
});

describe('Testing StudentService suspend', () => {
  test('StudentService suspend should return error with invalid body', async () => {
    let thrownError;
    try {
      await StudentService.suspend({
        students: 'teacherken@gmail.com'
      });
    } catch (error) {
      thrownError = error;
    }
    expect(thrownError).toEqual(new Error('"student" is required'));
  });

  test('StudentService suspend should return error with invalid body', async () => {
    let thrownError;
    try {
      await StudentService.suspend({
        student: ['studentjon1@gmail.com']
      });
    } catch (error) {
      thrownError = error;
    }
    expect(thrownError).toEqual(new Error('"student" must be a string'));
  });

  test('StudentService suspend should return object when success', async () => {
    const mockUpdate = jest.spyOn(StudentModel, 'update');
    mockUpdate.mockImplementation(() => Promise.resolve({}));

    const result = await StudentService.suspend({
      student: 'studentjon1@gmail.com'
    });
    expect(result).toStrictEqual(true);
    mockUpdate.mockRestore();
  });
});

describe('Testing StudentService retrieveForNotifications', () => {
  test('StudentService retrieveForNotifications should return error with invalid body', async () => {
    let thrownError;
    try {
      await StudentService.retrieveForNotifications({
        teachers: 'teacherken@gmail.com',
        notification: 'Hello students! @studentagnescha@gmail.com @studentmiche@gmail.com'
      });
    } catch (error) {
      thrownError = error;
    }
    expect(thrownError).toEqual(new Error('"teacher" is required'));
  });

  test('StudentService retrieveForNotifications should return error with invalid body', async () => {
    let thrownError;
    try {
      await StudentService.retrieveForNotifications({
        teacher: 'teacherken@gmail.com'
      });
    } catch (error) {
      thrownError = error;
    }
    expect(thrownError).toEqual(new Error('"notification" is required'));
  });

  test('StudentService retrieveForNotifications should return object when success', async () => {
    const mockGetTeacherIdFromEmail = jest.spyOn(StudentService, 'getTeacherIdFromEmail');
    mockGetTeacherIdFromEmail.mockImplementation(() => Promise.resolve(1));
    const mockFindAll = jest.spyOn(AssignedStudentModel, 'findAll');
    mockFindAll.mockImplementation(() => Promise.resolve([{ student_id: 2 }]));
    const mockStudentFindAll = jest.spyOn(StudentModel, 'findAll');
    mockStudentFindAll.mockImplementation(() => Promise.resolve([{ email: 'student@gmail.com' }]));
    const result = await StudentService.retrieveForNotifications({
      teacher: 'teacherken@gmail.com',
      notification: 'Hello students! @studentagnescha@gmail.com'
    });
    expect(result).toStrictEqual({ recipients: ['student@gmail.com', 'studentagnescha@gmail.com'] });
    mockGetTeacherIdFromEmail.mockRestore();
    mockFindAll.mockRestore();
    mockStudentFindAll.mockRestore();
  });
});
