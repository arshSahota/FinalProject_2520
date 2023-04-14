const database = [
    {
      id: 1,
      name: "Jimmy Smith",
      email: "jimmy123@gmail.com",
      password: "jimmy123!",
      people: [],
      reminders: [{
                        id: 1,
                        title: "abc",
                        description: "abcabc",
                        completed: false,
                        subtasks: [],
                        tags: []
                    }]
    },
    {
      id: 2,
      name: "Johnny Doe",
      email: "johnny123@gmail.com",
      password: "johnny123!",
      people: [],
      reminders: [{
        id: 1,
        title: "abc",
        description: "abcabc",
        completed: false,
        subtasks: [],
        tags: []
    }]
    },
    {
      id: 3,
      name: "Jonathan Chen",
      email: "jonathan123@gmail.com",
      password: "jonathan123!",
      people: [],
      reminders: [{
        id: "",
        title: "",
        description: "",
        completed: false,
        subtasks: [],
        tags: []
      }]
    },
  ];

  const userModel = {
    findOne: (email) => {
        const user = database.find((user) => user.email === email);
        if (user) {
            return user;
        }
        return null;
    },
    findById: (id) => {
        const user = database.find((user) => user.id === id);
        if (user) {
            return user;
        }
        return null;
    },
    addUser: (email, password) => {
      const newUser = {
        id: database.length + 1,
        name: email,
        email,
        password,
        reminders: [],
      };
      database.push(newUser);
      return newUser;
    },  
    getAllUsers: () => {
      return database;
    },
    addTagToReminder: (userId, reminderId, tag) => {
      const user = database.find((user) => user.id === userId);
      if (user) {
        const reminder = user.reminders.find((reminder) => reminder.id === reminderId);
        if (reminder) {
          reminder.tags.push(tag);
          return true;
        }
      }
      return false;
    },
    addSubtaskToReminder: (userId, reminderId, subtask) => {
      const user = database.find((user) => user.id === userId);
      if (user) {
        const reminder = user.reminders.find((reminder) => reminder.id === reminderId);
        if (reminder) {
          reminder.subtasks.push(subtask);
          return true;
        }
      }
      return false;
    }
  } 

  module.exports = { database, userModel };
  