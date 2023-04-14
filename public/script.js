// Initialize reminders array
let reminders = [];

// Get HTML elements
const createReminderForm = document.querySelector("#create-reminder-form");
const reminderList = document.querySelector("#reminder-list");

// Function to add reminder to the list
function addReminderToList(reminder) {
    // Create HTML element for reminder
    const reminderItem = document.createElement("div");
    reminderItem.classList.add("reminder-item");
    reminderItem.innerHTML = `
    <h3>${reminder.name}</h3>
    <p>Date: ${reminder.date}</p>
    <p>Time: ${reminder.time}</p>
    <p>Notes: ${reminder.notes}</p>
    <button class="delete-reminder-btn btn btn-danger" data-id="${reminder.id}">Delete</button>
    <button class="edit-reminder-btn btn btn-primary" data-id="${reminder.id}">Edit</button>
`;

    // Add reminder to the list
    reminderList.appendChild(reminderItem);

    // Add event listener to delete button
    const deleteButton = reminderItem.querySelector(".delete-reminder-btn");
    deleteButton.addEventListener("click", deleteReminder);

    // Add event listener to edit button
    const editButton = reminderItem.querySelector(".edit-reminder-btn");
    editButton.addEventListener("click", editReminder);
}

// Function to display all reminders in the list
function displayAllReminders() {
    // Clear the list first
    reminderList.innerHTML = "";

    // Loop through all reminders and add them to the list
    reminders.forEach((reminder) => {
        addReminderToList(reminder);
    });
}

// Function to create a new reminder
function createReminder(event) {
    event.preventDefault();

    // Get reminder data from the form
    const name = document.querySelector("#reminder-name").value;
    const date = document.querySelector("#reminder-date").value;
    const time = document.querySelector("#reminder-time").value;
    const notes = document.querySelector("#reminder-notes").value;

    // Generate unique ID for the new reminder
    const id = Date.now();

    // Create a new reminder object
    const newReminder = {
        id: id,
        name: name,
        date: date,
        time: time,
        notes: notes,
    };

    // Add the new reminder to the array
    reminders.push(newReminder);

    // Add the new reminder to the list
    addReminderToList(newReminder);

    // Clear the form fields
    createReminderForm.reset();
}

// Function to delete a reminder
function deleteReminder(event) {
    const id = event.target.dataset.id;

    // Remove the reminder from the array
    reminders = reminders.filter((reminder) => reminder.id !== parseInt(id));

    // Remove the reminder from the list
    const reminderItem = event.target.closest(".reminder-item");
    reminderItem.remove();
}

// Function to edit a reminder
function editReminder(event) {
    const id = event.target.dataset.id;

    // Find the reminder in the array
    const reminder = reminders.find((reminder) => reminder.id === parseInt(id));

    // Populate the form with the reminder data
    document.querySelector("#reminder-name").value = reminder.name;
    document.querySelector("#reminder-date").value = reminder.date;
    document.querySelector("#reminder-time").value = reminder.time;
    document.querySelector("#reminder-notes").value = reminder.notes;

    // Delete the old reminder from the array and the list
    deleteReminder(event);
}

// Add event listener to the create reminder form
createReminderForm.addEventListener("submit", createReminder);

// Display all reminders on page load
displayAllReminders();
// ...other code...

function initTags(existingTags = []) {
    const tagsContainer = document.getElementById('tags-container');
    const tagInput = document.getElementById('tag-input');
    const addTagBtn = document.getElementById('add-tag-btn');
    const tagsInput = document.getElementById('tags-input');

    // ...rest of the tags code...

    existingTags.forEach(tagText => {
        const tagElement = createTagElement(tagText);
        tagsContainer.appendChild(tagElement);
    });
}

