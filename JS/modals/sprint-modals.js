var newSprintModal = document.getElementById("new-sprint-modal");
var addSprintBtn = document.getElementById("new-sprint");
var closeNewSprintModal = document.getElementById("close-new-sprint");

var sprintTasksModal = document.getElementById("sprint-tasks-modal");
var closeSprintTasksModal = document.getElementById("close-sprint-tasks");
var viewSprintTasks = document.getElementById("view-sprint-tasks");

var sprintProgressModal = document.getElementById("sprint-progress-modal");
var closeProgressModal = document.getElementById("close-progress-modal");
var openProgressModalFromTasks = document.getElementById("sprint-tasks-progress-btn");

var hoursOnTaskModal = document.getElementById("sprint-hours-on-task-modal");
var closeHoursOnTaskModal = document.getElementById("close-hours-on-task-modal");

var editTaskModal = document.getElementById("edit-task-in-sprint");
var openEditTaskModal = document.getElementsByClassName("sprint-task")[0];
var closeEditTaskModal = document.getElementById("close-edit-task-modal");

let saveSprintButton = document.getElementById("save-sprint-btn");
let deleteSprintButton = document.getElementById("delete-sprint-btn");
let sprintNameInput = document.getElementById("sprint-name-input");
let sprintStartDateInput = document.getElementById("sprint-start-date-input");
let sprintEndDateInput = document.getElementById("sprint-end-date-input");
let sprintStatusInput = document.getElementById("sprint-status-input");

closeSprintTasksModal.onclick = function () {
  sprintTasksModal.style.display = "none";
}

// Show the sprint modal in edit mode
// and prefill with sprint data
function editSprint(i) {
  // Show the add sprint modal in 'edit mode'
  newSprintModal.style.display = 'block';
  // document.getElementById("modal-header").innerText = "Edit sprint";
  document.getElementById("modal-header").innerHTML = `<span class="close-modal" id="close-sprint-tasks">&times;</span>`;
  document.getElementById("modal-header").textContent = "Edit sprint";

  // Set selected sprint to index
  sprint = project.sprints[i];

  // Fill the sprints values in the edit modal
  sprintNameInput.value = sprint.name;
  sprintStatusInput.value = sprint.status;
  sprintStartDateInput.value = new Date(sprint.startDate).toISOString().substring(0, 10);
  sprintEndDateInput.value = new Date(sprint.endDate).toISOString().substring(0, 10);

  // Change save function from create sprint to save
  // when editing
  saveSprintButton.onclick = function() {
    updateSprint(i)
  }

  // Change delete funtion from clear to delete sprint
  // when editing
  deleteSprintButton.onclick = function() {
    deleteSprint(i)
  }
}

// Delete a sprint from the project
function deleteSprint(i) {
  if (confirm('Are you sure you want to delete this sprint?')) {
    project.deleteSprint(i);

    updateLocalStorage(PROJECT_KEY, project);
    // Update display
    displaySprints();
    // Clear and hide the modal once created
    clearSprintModal();
    newSprintModal.style.display = "none";
  }  
}

// Update a sprint using the data entered in the sprint modal
function updateSprint(i) {
  if (validateSprintFields()) {
    // Set selected sprint to index
    project.sprints[i];

    // Fill the sprints values in the edit modal
    project.sprints[i].name = sprintNameInput.value;
    project.sprints[i].status = sprintStatusInput.value;
    project.sprints[i].startDate = new Date(sprintStartDateInput.value);
    project.sprints[i].endDate = new Date(sprintEndDateInput.value);

    updateLocalStorage(PROJECT_KEY, project);
    // Update display
    displaySprints();
    // Clear and hide the modal once created
    clearSprintModal();
    newSprintModal.style.display = "none";
  }
}

function viewSprintProgress(i) {
  sprintProgressModal.style.display = "block";
  let sprint = project._sprints[i];

  if (!sprint.hasHoursLogged() || sprint._tasks.length == 0) {
      // do nothing
      let burndownTitle = document.getElementsByClassName("burndown-chart-header")[0];
      burndownTitle.innerText = "No burndown chart available. Please log hours on tasks to see progress."
  } else {

    let burndownTitle = document.getElementsByClassName("burndown-chart-header")[0];
      burndownTitle.innerText = "Burndown Chart"
    // CHART
    let sprintData = sprint.getData();

    const dates = sprintData[0];

    const data = {
      labels: dates,
      datasets: [{
        label: 'Ideal velocity',
        backgroundColor: 'rgb(49, 222, 135)',
        borderColor: 'rgb(49, 222, 135)',
        data: sprintData[1],
      }, {
        label: 'Actual velocity',
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgb(255, 99, 132)',
        data: sprintData[2],
      }, {
        label: 'Accumulated effort',
        backgroundColor: 'rgb(54, 90, 209)',
        borderColor: 'rgb(54, 90, 209)',
        data: sprintData[3],
      }]
    };

    const config = {
      type: 'line',
      data: data,
      options: {
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: 'Dates'
            }
          },
          y: {
            display: true,
            title: {
              display: true,
              text: 'Hours'
            }
          }
        }
      }

    };

    let chartCheck = Chart.getChart("burndown-chart");

    if (chartCheck !== undefined) {
      chartCheck.destroy();
    }

    const myChart = new Chart(
      document.getElementById('burndown-chart'),
      config
    );
  }


  // TASKS 
  let tasksHTML = "";
  for (let j = 0; j < sprint._tasks.length; j++) {
    if (sprint._tasks[j]._status == "not-started") {
      tasksHTML += `<div class="sprint-task-container">
        <div class="sprint-progress-task-tag" style="background-color: #FF2E63;"></div>`
    }
    else if (sprint._tasks[j]._status == "in-progress") {
      tasksHTML += `<div class="sprint-task-container">
        <div class="sprint-progress-task-tag" style="background-color: #02b6c9;"></div>`
    }
    else if (sprint._tasks[j]._status == "completed") {
      tasksHTML += `<div class="sprint-task-container">
        <div class="sprint-progress-task-tag" style="background-color: #00c448;"></div>`
    }
    tasksHTML += `<div id="sprint-task${j}" class="sprint-progress-task" onclick="showTaskHours(${i}, ${j})">
                      ${sprint._tasks[j]._name}
                    </div></div>`
  }

  let hoursOnTask = document.getElementById("hours-on-task");
  hoursOnTask.innerHTML = tasksHTML;
}

function showTaskHours(sprint, task) {
  hoursOnTaskModal.style.display = "block";
  let thisTask = project._sprints[sprint]._tasks[task];
  let name = document.getElementById("time-on-task-name");
  let storyPoints = document.getElementById("task-hours-story-points");
  let priority = document.getElementById("task-hours-priority");
  let assigned = document.getElementById("task-hours-assigned");
  let hours = document.getElementById("task-hours-logged");

  if (thisTask.status == "not-started" ) {
  name.innerHTML = `<div class="time-on-task-status" style="float: left; background-color: #FF2E63;"></div>
                      ${thisTask._name}
                    <div class="time-on-task-status" style="float: right; background-color: #FF2E63;"></div>`
  }

  else if (thisTask.status == "in-progress" ) {
    name.innerHTML = `<div class="time-on-task-status" style="float: left; background-color: #02b6c9;"></div>
                        ${thisTask._name}
                      <div class="time-on-task-status" style="float: right; background-color: #02b6c9;"></div>`
    }
  
  else if (thisTask.status == "completed" ) {
    name.innerHTML = `<div class="time-on-task-status" style="float: left; background-color: #00c448;"></div>
                        ${thisTask._name}
                      <div class="time-on-task-status" style="float: right; background-color: #00c448;"></div>`
      }
  storyPoints.innerText = thisTask._storyPoints;
  priority.innerText = thisTask._priority;
  assigned.innerText = thisTask._assignee;

  let table = `<table class="hours-on-task-table">
                  <thead>
                    <tr>
                      <th>HOURS</th>
                      <th>DATE</th>
                    </tr>
                  </thead>
                  <tbody>`;

  for (const [key, value] of thisTask._hours) {
    table += `<tr><td>${value}</td><td>${key}</td></tr>`
  }

  table += `</tbody>
          </table>
          <div class="task-total-hours">
          <div id="total-hours-header">
            TOTAL TIME LOGGED
          </div>
          <div id="total-hours-body">
            ${thisTask.getTotalHours()}
          </div>
        </div>`

  hours.innerHTML = table;
}

// Create a new sprint in the current project
function createSprint(name, status, startDate, endDate) {
  // Check that user has entered all required fields
  if (validateSprintFields()) {
    project.createSprint(name, status, startDate, endDate)
    // Update Local storage with new sprint
    updateLocalStorage(PROJECT_KEY, project);
    // Update display
    displaySprints();
    // Clear and hide the modal once created
    clearSprintModal();
    newSprintModal.style.display = "none";
  }
}

function clearSprintModal() {
  // clear input areas
  sprintNameInput.value = '';
  sprintStatusInput.selectedIndex = 0;
  sprintStartDateInput.value = '';
  sprintEndDateInput.value = '';
}

function showAlertField(field) {
  alertMessage = 'Please enter a value for ';
  alert(alertMessage + field);
}

// Checks if user has entered all required fields
function validateSprintFields() {
  if (sprintNameInput.value == '') {
    showAlertField('name');
    return false;
  }
  else if (sprintStartDateInput.value == '') {
    showAlertField('start date');
    return false;
  }
  else if (sprintEndDateInput.value == '') {
    showAlertField('end date');
    return false;
  }

  return true;
}

saveSprintButton.onclick = function () {
  // let status = '';

  // // Convert status input value to the correct value
  // // expected by the program (which is the display value)
  // if (sprintStatusInput.value == 'not-started') {
  //   status = 'not-started';
  // } else if (sprintStatusInput.value == "in-progress") {
  //   status = 'in-progress';
  // } else {
  //   status = 'completed';
  // }

  // Create a new sprint with the users data
  createSprint(sprintNameInput.value,
    sprintStatusInput.value,
    new Date(sprintStartDateInput.value),
    new Date(sprintEndDateInput.value));
}

deleteSprintButton.onclick = function () {
  clearSprintModal();
}

closeHoursOnTaskModal.onclick = function () {
  hoursOnTaskModal.style.display = "none";
}

addSprintBtn.onclick = function () {
  newSprintModal.style.display = "block";
  clearSprintModal()
}
closeNewSprintModal.onclick = function () {
  newSprintModal.style.display = "none";
}

openEditTaskModal.onclick = function () {
  editTaskModal.style.display = "block";
  let totalHoursDiv = document.getElementById("task-total-hours-text");
  totalHoursDiv.innerText = task.getTotalHours();
}
closeEditTaskModal.onclick = function () {
  editTaskModal.style.display = "none";
}

openProgressModalFromTasks.onclick = function () {
  sprintProgressModal.style.display = "block";
}
closeProgressModal.onclick = function () {
  sprintProgressModal.style.display = "none";
}


window.onclick = function (event) {
  if (event.target == newSprintModal) {
    newSprintModal.style.display = "none";
  }
  if (event.target == sprintTasksModal) {
    sprintTasksModal.style.display = "none";
  }
  if (event.target == sprintProgressModal) {
    sprintProgressModal.style.display = "none";
  }
  if (event.target == hoursOnTaskModal) {
    hoursOnTaskModal.style.display = "none";
  }
  if (event.target == editTaskModal) {
    editTaskModal.style.display = "none";
  }
}