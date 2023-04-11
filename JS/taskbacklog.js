// Read parameters from URL
let parameters = new URLSearchParams(window.location.search);
let selectedSprintId = parameters.get('id');

// function to display tasks in product backlog
function displayTasks() {
  let output = "";
  for (let i = 0; i < project._tasks.length; i++) {
    cardOnclick = `viewTask(${i})`;
    // If there is a parameter for the selected sprint,
    // change the onclick of each card to add the task to the sprint
    // instead of showing the task
    if (selectedSprintId) {
      cardOnclick = `addTaskToSprint(${selectedSprintId}, ${i})`;
    } 

    let current_task = project._tasks[i];
    let bg_color = "";
    if (current_task._priority == "low") {
        bg_color = "rgba(65, 210, 149, 255)"
    } else if (current_task._priority == "medium") {
        bg_color = "rgba(247, 233, 30, 255)"
    } else if (current_task._priority == "high") {
      bg_color = "rgba(247, 110, 30, 255)"
    } else if (current_task._priority == "critical") {
      bg_color = "rgba(235, 64, 52, 255)"
    }
    output += `<div  id="card${i}" class="card" draggable="true" ondragstart="dragStart(event)" onclick="${cardOnclick}">
    <div class="card-content-name">${current_task._name}</div>
    <div class="card-content-tag">${current_task._tag}</div>
    <div class="card-content-sp">${current_task._storyPoints}</div>
    <span class="priority-dot" style="background-color: ${bg_color}"></span>
  </div>`
  }
  let taskCards = document.getElementById("board-lists");
  taskCards.innerHTML = output;
}

displayTasks()

// Adds task to a sprint by adding then redirecting
// back to the sprints page
function addTaskToSprint(sprintIndex, taskIndex) {
  
  // Add the task to the selected sprint backlog
  let sprint = project.sprints[sprintIndex];
  sprint.addTask(project.tasks[taskIndex]);

  // Remove task from product backlog
  project.removeTask(taskIndex);

  // Save to local storage
  updateLocalStorage(PROJECT_KEY, project);

  // Redirect back to sprints with sprint selected
  // Setup + button's onclick function to navigate to tasks
  // page with the sprint as a parameter
  // Create a list of parameters to pass to the tasks page
  let parameters = {id: sprintIndex}
  let uri = encodeURIComponent;
  // Convert parameters to a formatted query string 
  // ('...html?param1=value1&param2=value2&...)
  let query = Object.keys(parameters).map(parameter =>
  uri(parameter) + '=' + uri(parameters[parameter])).join('&');
  // Create URL by appending query string to the task page's URL
  let url = SPRINTS_PAGE + '?' + query;
  document.location.href = url;
}


// helper function for swapping task IDs and onclick index values in HTML
// arguments:
//     id1: a string representing the id of the task
//     id2: a string representing the id of the task
//     index1: int value representing index of task to be swapped
//     index2: int value representing index of task to be swapped
function swapTaskIDs(id1, id2, index1, index2) {
  // swapping id attributes
  document.getElementById(id1).setAttribute("id", "temp");
  document.getElementById(id2).setAttribute("id", id1);
  document.getElementById("temp").setAttribute("id", id2);
  // swapping onclick index values
  document.getElementById(id1).setAttribute("onclick", "viewTask(" + index1 + ")");
  document.getElementById(id2).setAttribute("onclick", "viewTask(" + index2 + ")");
}

// helper function for swapping tasks in project._tasks array
function swapTasks(index1, index2) {
  let tempTask = project._tasks[index1];
  project._tasks[index1] = project._tasks[index2];
  project._tasks[index2] = tempTask;
  updateLocalStorage(PROJECT_KEY, project);
}


/* ~~~~~~~~ drag and drop functions ~~~~~~~~ */
// reference source: https://ramya-bala221190.medium.com/dragging-dropping-and-swapping-elements-with-javascript-11d9cdac2178
let dragindex = 0;
let dropindex = 0;
let clone = "";

function allowDrop(e) {
  e.preventDefault();
}

function dragStart(e) {
  e.dataTransfer.setData("text", e.target.id);
}

function dropIt(e) {
  e.preventDefault();
  clone = e.target.cloneNode(true);
  let data = e.dataTransfer.getData("text"); 
  if(clone.id !== data) {
    let nodelist = document.getElementById("board-lists").childNodes;
    for(let i = 0; i < nodelist.length; i++) {
      // getting dragindex
      if(nodelist[i].id == data) {
        dragindex = i;
      }
      // getting dropindex
      if (nodelist[i].id == clone.id) {
        dropindex = i;
      }
    }
    // doing the swap
    document.getElementById("board-lists").replaceChild(document.getElementById(data), e.target);
    document.getElementById("board-lists").insertBefore(clone, document.getElementById("board-lists").childNodes[dragindex]);

    // swapping task IDs in HTML and tasks in project._tasks array
    swapTaskIDs(data, clone.id, dragindex, dropindex);
    swapTasks(dragindex, dropindex);
  }
}

