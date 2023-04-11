var newtaskmodal = document.getElementById("new-task-modal");
var viewtaskmodal = document.getElementById("edit-task-modal");

// Get the buttons for the modals
var addbtn = document.getElementById("newtask");
var editbtn = document.getElementById("edit-btn");
var deletebtn = document.getElementById("delete-btn");

// Get the <span> element that closes the modal
var close1 = document.getElementsByClassName("close-modal")[0];
var close2 = document.getElementsByClassName("close-modal")[1];

// Get the buttons that save/clear the new task
var submit = document.getElementById("submit-tag");
var clear = document.getElementById("clear-tag");

// When the user clicks the button, open the modal 
addbtn.onclick = function() {
  clearTaskModal();
  document.getElementById("modal-header").innerText = "Create a task"
  newtaskmodal.style.display = "block";
  clearTaskModal()
  setPrioritySelect()
}

let task = null
let index = null
function viewTask(id) {
  task = project._tasks[id];
  index = id;
  document.getElementById("view-name").innerText = task._name;
  document.getElementById("view-description").innerText = task._description;
  let tagDiv = document.getElementById("view-task-tag");
  tagDiv.innerText = task._tag;
  if (task._tag == "core") {
    tagDiv.style.background = "#02b6c9";
  } else if (task._tag == "testing") {
    tagDiv.style.background = "#FF2E63";
  } else if (task._tag == "ui") {
    tagDiv.style.background = "#00c448";
  }
  document.getElementById('view-type').innerText = task.type
  taskTypeInput.value = task.type

  document.getElementById("view-story-points").innerText = task._storyPoints;
  document.getElementById("view-priority").innerText = task._priority;
  viewtaskmodal.style.display = "block";
}

editbtn.onclick = function() {
  viewtaskmodal.style.display = "none";
  document.getElementById("modal-header").innerText = "Edit task";
  // set values to tasks settings
  taskNameInput.value = task._name;
  taskStoryPointsInput.selectedIndex = task._storyPoints;
  if (task._priority == "low") {
    taskPriorityInput.selectedIndex = 1;
  } else if (task._priority == "medium") {
    taskPriorityInput.selectedIndex = 2;
  } else if (task._priority == "high") {
    taskPriorityInput.selectedIndex = 3;
  } else if (task._priority == "critical") {
    taskPriorityInput.selectedIndex = 4;
  }
  setPrioritySelect()

  taskDescriptionInput.value = task._description;

  if (task._tag == "core") {
    core.onclick();
  } else if (task._tag == "testing") {
    testing.onclick();
  } else if (task._tag == "ui") {
    ui.onclick();
  }

  newtaskmodal.style.display = "block";
}

deletebtn.onclick = function() {
  if (confirm(`Are you sure you want to delete this task?`)) {
      project.deleteTask(index);
      updateLocalStorage(PROJECT_KEY, project);
      viewtaskmodal.style.display = "none";
      displayTasks()
  }
}
// When the user clicks on <span> (x), close the modal
close1.onclick = function() {
  newtaskmodal.style.display = "none";
}

close2.onclick = function(){
  viewtaskmodal.style.display = "none";
}

// When the user clicks save, save the task they entered
submit.onclick = function() {
  let taskTag = ''

  if (core_clicked) {
    taskTag = 'core'
  } else if (testing_clicked) {
    taskTag = 'testing'
  } else if (ui_clicked) {
    taskTag = 'ui'
  }

  // Check that user has entered all required fields
  if (validateTaskFields()) {  
    if (document.getElementById("modal-header").innerText == "Create a task") {
      createTask(taskNameInput.value, 
        taskTypeInput.value,
        taskStoryPointsInput.value, 
        taskPriorityInput.value, 
        taskTag, 
        taskDescriptionInput.value);
      } else {
        task._name = taskNameInput.value; 
        task._storyPoints = taskStoryPointsInput.value;
        task._priority = taskPriorityInput.value;
        task._tag = taskTag;
        task._description = taskDescriptionInput.value;
        task._type = taskTypeInput.value;
        updateLocalStorage(PROJECT_KEY, project)
        alert(`Your changes have been saved`)
        newtaskmodal.style.display = "none";
        clearTaskModal();
        displayTasks();
      }
  }
}

// When the user clicks clear, clear the fields inside the modal
clear.onclick = function() {
  clearTaskModal();
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == newtaskmodal) {
    newtaskmodal.style.display = "none";
  }
  if (event.target == viewtaskmodal) {
    viewtaskmodal.style.display = "none";
  }
}

// Create a new task from inputs
function createTask(name, type, storyPoints, priority, tag, description) {
  // Create a new user story task from inputs
  project.createTask(name, type, storyPoints, priority, tag, description);
  // Save project to LS
  updateLocalStorage(PROJECT_KEY, project);
  // Update display
  displayTasks();
  // Clear and hide the modal once created
  clearTaskModal();
  newtaskmodal.style.display = "none";
}

// Checks if user has entered all required fields
function validateTaskFields() {
  alertField = ''

  if (taskNameInput.value == '') { 
    showAlertField('name'); 
    return false;
  }
  else if (taskStoryPointsInput.selectedIndex == 0) { 
    showAlertField('story points'); 
    return false ;
  }
  else if (taskPriorityInput.selectedIndex == 0) { 
    showAlertField('priority'); 
    return false ;
  }
  else if (taskDescriptionInput.value == '') {
    showAlertField('description')
    return false;
  }
  else if (taskTypeInput.value == '') {
    showAlertField('type');
    return false;
  }

  return true
}

// Create an alert for a field the user hasn't entered
function showAlertField(field) {
  alertMessage = 'Please enter a value for '
  alert(alertMessage + field)
}

// Clear the task modal inputs 
function clearTaskModal() {
  // clear text areas
  taskNameInput.value = '';
  taskStoryPointsInput.selectedIndex = 0;
  taskPriorityInput.selectedIndex = 0;
  taskDescriptionInput.value = '';
  taskTypeInput.value = ''

  // Reset tag buttons
  testing.style.background = "#FF2E63";
  ui.style.background = "#00c448";
  core.style.background = "#02b6c9";
  core_clicked = false;
  testing_clicked = false;
  ui_clicked = false;
}

function setPrioritySelect() {
  priority = taskPriorityInput.value
  kids = taskPriorityInput.children

  for (i = 0; i < kids.length; i++) {
    kids[i].style.backgroundColor = 'white'
  }

  if (priority == 'low') {
    taskPriorityInput.style.backgroundColor = '#41D295'
  }
  else if (priority == 'medium') {
    taskPriorityInput.style.backgroundColor = '#F7E91E'
  }
  else if (priority == 'high') {
    taskPriorityInput.style.backgroundColor = '#F76E1E'
  } 
  else if (priority == 'critical') {
    taskPriorityInput.style.backgroundColor = '#EB4034'
  }
}

// Get all the text fields in the task modal
let taskNameInput = document.getElementById('task-name-input');
let taskStoryPointsInput = document.getElementById('story-points-input');
let taskPriorityInput = document.getElementById('priority-input');
let taskDescriptionInput = document.getElementById('description-input');
let taskTypeInput = document.getElementById('type-input');

// grey out buttons on add task
var core = document.getElementById("core-tag");
var testing = document.getElementById("testing-tag");
var ui = document.getElementById("ui-tag");

var core_clicked = false;
var testing_clicked = false;
var ui_clicked = false;

core.onclick = function() {
  if(core_clicked == false){
    testing.style.background = "#8f8f8f";
    ui.style.background = "#8f8f8f";
    core.style.background = "#02b6c9";
    core_clicked = true;
    testing_clicked = false;
    ui_clicked = false;
  }
  else{
    testing.style.background = "#FF2E63";
    ui.style.background = "#00c448";
    core.style.background = "#02b6c9"
    testing_clicked = false;
    core_clicked = false;
    ui_clicked = false;
  }
}

testing.onclick = function() {
  if(testing_clicked == false){
    core.style.background = "#8f8f8f";
    ui.style.background = "#8f8f8f";
    testing.style.background = '#FF2E63'
    testing_clicked = true;
    core_clicked = false;
    ui_clicked = false;
  }
  else{
    core.style.background = "#02b6c9";
    ui.style.background = "#00c448";
    testing.style.background = "#FF2E63";
    testing_clicked = false;
    core_clicked = false;
    ui_clicked = false;
  }
}

ui.onclick = function() {
  if(ui_clicked == false){
    core.style.background = "#8f8f8f";
    testing.style.background = "#8f8f8f";
    ui.style.background = "#00c448";
    ui_clicked = true;
    testing_clicked = false;
    core_clicked = false;
  }
  else{
    core.style.background = "#02b6c9";
    testing.style.background = "#FF2E63";
    ui.style.background = "#00c448";
    ui_clicked = false;
    core_clicked = false;
    testing_clicked = false;
  }
}

taskPriorityInput.onchange = function() {
  setPrioritySelect(setPrioritySelect.value)
}