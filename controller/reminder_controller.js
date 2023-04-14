let database = require("../database");
let userModel = require("../database").userModel;


let remindersController = {
  list: (req, res) => {
  if (!req.user) {
    res.redirect("/login");
    return;
  }

  const user = database.userModel.findById(req.user.id);
  const friendsIds = user.people || [];
  const friendsReminders = [];

  friendsIds.forEach(id => {
    const friend = userModel.findById(id);
    friendsReminders.push({ name: friend.name, reminders: friend.reminders });
  });

  res.render("reminder/index", { reminders: user.reminders, user: req.user, friends: friendsReminders });
},

  new: (req, res) => {
    res.render("reminder/create", { reminders: req.user.reminders, user: req.user });

  },
  listOne: async (req, res) => {
    const currentUser = await database.userModel.findById(req.user.id);
    let reminderToFind = req.params.id;
    let searchResult = currentUser.reminders.find(function (reminder) {
      return reminder.id == reminderToFind;
    });
  
    if (searchResult != undefined) {
      res.render("reminder/single-reminder", { 
        reminderItem: searchResult, 
        user: req.user, 
        existingTags: searchResult.tags,
        existingSubtasks: searchResult.subtasks?.map(subtask => subtask.title).join('\n') || ''
      });
    } else {
      const friendsIds = currentUser.people || [];
      const friendsReminders = [];
      for (const id of friendsIds) {
        const friend = await userModel.findById(id);
        friendsReminders.push({ name: friend.name, reminders: friend.reminders });
      }
      res.render("reminder/index", { reminders: currentUser.reminders, friends: friendsReminders });
    }
  },
  create: (req, res) =>{
    const currentUser = database.userModel.findById(req.user.id)
    let reminder = {
    id: currentUser.reminders.length + 1,
    title: req.body.title,
    description: req.body.description,
    completed: false,
    date: req.body.date,
    subtasks: [],
    tags: []
    };
    currentUser.reminders.push(reminder);
    res.redirect("/reminders");
  },  
  edit: (req, res) => {
    const currentUser = database.userModel.findById(req.user.id)
    const id = req.params.id;
    const reminder = currentUser.reminders.find((reminder) => reminder.id == id);

    if (reminder) {
        res.render("reminder/edit", {
            reminderItem: reminder,
            existingTags: reminder.tags ? reminder.tags.join(',') : '',
            existingSubtasks: reminder.subtasks?.map(subtask => subtask.title).join('\n') || ''
        });
    } else {
        res.redirect("/reminders");
    }
},
update: (req, res) => {
  const currentUser = database.userModel.findById(req.user.id)
  const id = req.params.id;
  const title = req.body.title;
  const description = req.body.description;
  const completed = req.body.completed === 'true';
  const tags = req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [];
  const subtasks = typeof req.body.subtasks === 'string' ? req.body.subtasks.split('\n').map(subtask => subtask.trim()).filter(subtask => subtask) : [];

  const reminder = currentUser.reminders.find((reminder) => reminder.id == id);
  if (reminder) {
    reminder.title = title;
    reminder.description = description;
    reminder.completed = completed;
    reminder.tags = tags;
    reminder.subtasks = subtasks
    if (reminder.subtasks && Array.isArray(subtasks) && subtasks.length > 0) {
      const newSubtasks = subtasks.map((title, index) => ({ id: reminder.subtasks.length + index + 1, title, completed: false }));
      reminder.subtasks = reminder.subtasks.concat(newSubtasks);
    }
  }
  res.redirect("/reminders");
}, 
  delete: (req, res) => {
    const currentUser = database.userModel.findById(req.user.id)
    const id = parseInt(req.params.id);
    currentUser.reminders = currentUser.reminders.filter((reminder) => reminder.id !== id);
    res.redirect("/reminders");
  }, 
  getSocialShare: (req, res) => {
    const people = userModel.getAllUsers().filter(user => user.id !== req.user.id);
    res.render("reminder/socialshare", { people });
  },  
  followSocialShare: function(req, res) {
    console.log('req.user:', req.user);
    const currentUser = database.userModel.findById(req.user.id);
    const followedId = Number(req.body.followedId);
  
    if (followedId !== currentUser.id && !currentUser.people.includes(followedId)) {
      currentUser.people.push(followedId);
    }
    console.log(currentUser);
    res.redirect("/socialshare");
  },  
  newSubtask: (req, res) => {
    let reminderId = req.params.id;
    res.render("create-subtask", { reminderId: reminderId, user: req.user });
  },
  createSubtask: function(req, res) {
    const currentUser = database.userModel.findById(req.user.id)
    let reminderId = req.params.id;
    let subtaskTitle = req.body.title;
    let reminder = currentUser.reminders.find(r => r.id == reminderId);
    
    reminder.subtasks.push({
        id: currentUser.reminders.subtasks.length + 1,
        title: subtaskTitle,
        completed: false
    });
    res.redirect("/reminder")
  },
};

module.exports = remindersController;
