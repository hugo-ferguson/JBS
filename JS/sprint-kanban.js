// Read parameters from URL
let parameters = new URLSearchParams(window.location.search);
let selectedSprintId = parameters.get('id');

if (selectedSprintId) {
  viewSprintTasks(selectedSprintId)
}

function displayNotStarted(list, k)
{
    let sprint_list = project._sprints[k]._tasks
    let output = ""
    for (let j = 0; j < sprint_list.length; j++)
    {
        for (let i = 0; i < list.length; i++)
        {
            if (sprint_list[j]._name == list[i]._name)
            {
                let current_task = list[i];
                output += `<div class="sprint-task" id="sprint-task${j}" draggable="true" ondragstart="dragStart(event, ${k})" onclick="viewSprintTaskDetails(${j},${k})">
                                <div class="not-started-sprint-task"></div>
                               <div class="sprint-task-name">${current_task._name}</div>
                        </div>`
            }
        }
    }
    document.getElementById("sprint-tasks-box1").innerHTML = output
}

function displayInProgress(list, k)
{
    let sprint_list = project._sprints[k]._tasks
    let output = ""
    for (let j = 0; j < sprint_list.length; j++)
    {
        for (let i = 0; i < list.length; i++)
        {
            if (sprint_list[j]._name == list[i]._name)
            {
                let current_task = list[i];
                output += `<div class="sprint-task" id="sprint-task${j}" draggable="true" ondragstart="dragStart(event, ${k})" onclick="viewSprintTaskDetails(${j},${k})">
                                <div class="in-progress-sprint-task"></div>
                               <div class="sprint-task-name">${current_task._name}</div>
                        </div>`
            }
        }
    }
    document.getElementById("sprint-tasks-box2").innerHTML = output
}

function displayCompleted(list, k)
{
    let sprint_list = project._sprints[k]._tasks
    let output = ""
    for (let j = 0; j < sprint_list.length; j++)
    {
        for (let i = 0; i < list.length; i++)
        {
            if (sprint_list[j]._name == list[i]._name)
            {
                let current_task = list[i];
                output += `<div class="sprint-task" id="sprint-task${j}" draggable="true" ondragstart="dragStart(event, ${k})" onclick="viewSprintTaskDetails(${j},${k})">
                                <div class="completed-sprint-task"></div>
                               <div class="sprint-task-name">${current_task._name}</div>
                        </div>`
            }
        }
    }
    document.getElementById("sprint-tasks-box3").innerHTML = output
}

function viewSprintTasks(i)
{
    sprintTasksModal.style.display = "block";

    let list = project._sprints[i]._tasks
    
    // Hide the progress button for sprints with no tasks,
    // as the progress modal cannot display a graph
    // with no tasks
    if (list.length < 1) {
        openProgressModalFromTasks.style.display = 'none'
    }

    let task_not_started = new Array()
    let task_in_progress = new Array()
    let task_completed = new Array()

    sprintModalName = project._sprints[i]._name
    document.getElementById("sprint-task-name").innerText = sprintModalName

    
    for (let j = 0; j < list.length; j++)
    {
        let current_task = list[j];
        if (current_task._status == "not-started")
        {
            task_not_started.push(current_task)
        }
        else if (current_task._status == "in-progress")
        {
            task_in_progress.push(current_task)
        }
        else if (current_task._status == "completed")
        {
            task_completed.push(current_task)
        }
    }

    displayNotStarted(task_not_started, i)
    displayInProgress(task_in_progress, i)
    displayCompleted(task_completed, i)

    addTaskBtn = document.getElementById('add-task')

    addTaskBtn.onclick = function() {
        redirectTasksPage(i)
    }

    progressBtn = document.getElementById('sprint-tasks-progress-btn');

    progressBtn.onclick = function() {
        viewSprintProgress(i)
    }
}

function redirectTasksPage(i) {
    // Setup + button's onclick function to navigate to tasks
    // page with the sprint as a parameter
    // Create a list of parameters to pass to the tasks page
    let parameters = {id: i}
    let uri = encodeURIComponent;
    // Convert parameters to a formatted query string 
    // ('...html?param1=value1&param2=value2&...)
    let query = Object.keys(parameters).map(parameter =>
		uri(parameter) + '=' + uri(parameters[parameter])).join('&');
    // Create URL by appending query string to the task page's URL
    let url = TASKS_PAGE + '?' + query;
    document.location.href = url;
}

function viewSprintTaskDetails(j,k)
{
    sprintTasksModal.style.display = "none";
    editTaskModal.style.display = "block"; 
    let task = project._sprints[k]._tasks[j];
    document.getElementById("edit-modal-task-name").innerText = task._name;
    document.getElementById("edit-task-in-sprint-task-status-select").value = task._status;
    document.getElementById("task-assigned-to-input").value = task._assignee;
    document.getElementById("story-points-input").value = task._storyPoints;
    document.getElementById("priority-input").value = task._priority;
    document.getElementById("task-total-hours-text").innerText = task.getTotalHours();
    document.getElementById("task-description-text").value = task._description;
    document.getElementById("log-hours-date").value = "";
    document.getElementById("log-hours-time").value = "";
    document.getElementById("log-hours-time").placeholder = "Log hours here:"; 

    sprintTaskSaveButtonHTML = `<button class="task-modal-btn" onclick="saveTaskInSprint(${j}, ${k})">OKAY</button>`;
    document.getElementById("save-sprint-task-btn").innerHTML = sprintTaskSaveButtonHTML;
    
    sprintTaskRemoveButtonHTML = `<button class="task-modal-btn" style="padding: 20px;" onclick="removeTaskFromSprint(${j},${k})">REMOVE</button>`;
    document.getElementById("remove-sprint-task-btn").innerHTML = sprintTaskRemoveButtonHTML;
}

function saveTaskInSprint(j, k)
{
    let taskDescription = document.getElementById("task-description-text").value;
    let taskAssignee = document.getElementById("task-assigned-to-input").value;
    let taskChosenDate = document.getElementById("log-hours-date").value;
    let taskLoggedHours = document.getElementById("log-hours-time").value;
    if (taskDescription == '') {
        alert("Please enter a value for task description");
    } 
    let alertMessage = "Please enter a value for:";
    if (taskAssignee != '' || taskChosenDate != '' || taskLoggedHours != '') {
        if (taskAssignee == '') {
            alertMessage += "\n - task assigned to";
        }
        if (taskChosenDate == '') {
            alertMessage += "\n - logged hours date";
        }
        if (taskLoggedHours == '') {
            alertMessage += "\n - logged hours";
        }
    } 
    if (taskAssignee == '' || taskChosenDate == '' || taskLoggedHours == '') {
        console.log(alertMessage);
    } else {
        let sprint = project._sprints[k];
        let task = sprint._tasks[j];
        task._status = document.getElementById("edit-task-in-sprint-task-status-select").value
        task._assignee = document.getElementById("task-assigned-to-input").value
        task._storyPoints = document.getElementById("story-points-input").value
        task._priority = document.getElementById("priority-input").value
        task._description = document.getElementById("task-description-text").value
        
        let chosenDate = new Date(document.getElementById("log-hours-date").value);
        let loggedHours = document.getElementById("log-hours-time").value;

        if (chosenDate.getTime() < sprint._startDate || chosenDate.getTime() > sprint._endDate) {
            alert("Cannot log hours for days outside sprint start and end dates.");
        } else {
            alert(`Your changes have been saved`);
            editTaskModal.style.display = "none"; 
            viewSprintTasks(k);
            task.addHours(chosenDate, loggedHours);
            updateLocalStorage(PROJECT_KEY, project);
        }
    }
}

function removeTaskFromSprint(j,k)
{
    if(confirm(`Are you sure you want to remove this task from the sprint?`))
    {
        // Tasks are removed from the sprint and are NOT
        // returned to the backlog
        task = project._sprints[k]._tasks[j]
        project._sprints[k]._tasks.splice(j,1)
        //project._tasks.push(task)
        sortCreationDate(project._tasks)
        updateLocalStorage(PROJECT_KEY, project);
        editTaskModal.style.display = "none"; 
        viewSprintTasks(k);
    }
}