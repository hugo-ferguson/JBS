// updates the task's className in HTML and status in Task Class
function changeTaskStatus(columnId, taskId, index) {
    if (columnId == "sprint-tasks-box1") {
        document.getElementById(taskId).childNodes[1].className = "not-started-sprint-task";
        project._sprints[sprintIndex]._tasks[index].status = "not-started";
    }
    else if (columnId == "sprint-tasks-box2") {
        document.getElementById(taskId).childNodes[1].className = "in-progress-sprint-task";
        project._sprints[sprintIndex]._tasks[index].status = "in-progress";
    }
    else if (columnId == "sprint-tasks-box3") {
        document.getElementById(taskId).childNodes[1].className = "completed-sprint-task";
        project._sprints[sprintIndex]._tasks[index].status = "completed";
    }

    updateLocalStorage(PROJECT_KEY, project);
}

// gets index of task in sprint array
function getTaskIndex(id) {
    let taskIndex = id.substring(11, id.length);
    return taskIndex;
}

// swaps index values of id and onclick according to new positions in sprint array
function swapSprintTaskIDs(id1, id2, index1, index2) {
    // swapping id attributes
    document.getElementById(id1).setAttribute("id", "temp");
    document.getElementById(id2).setAttribute("id", id1);
    document.getElementById("temp").setAttribute("id", id2);
    // swapping onclick index values
    document.getElementById(id1).setAttribute("onclick", "viewSprintTaskDetails(" + index1 + "," + sprintIndex + ")");
    document.getElementById(id2).setAttribute("onclick", "viewSprintTaskDetails(" + index2 + "," + sprintIndex + ")");
}

// swaps task positions in sprint array
function updateSprintClassTasks(index1, index2) {
    let tempTask = project._sprints[sprintIndex]._tasks[index1];
    project._sprints[sprintIndex]._tasks[index1] = project._sprints[sprintIndex]._tasks[index2];
    project._sprints[sprintIndex]._tasks[index2] = tempTask;
    updateLocalStorage(PROJECT_KEY, project);

    // idea/ brainstorming (ignore - bad idea lmao)
    // index1 = dragindex, index2 = dropindex
    // thing getting dragged does the replacing, drop
    // copy index2
    // replace index2 with index1
    // insert index1 before index2
}


/* ~~~~~~~~ drag and drop functions ~~~~~~~~ */
// reference sources: https://ramya-bala221190.medium.com/dragging-dropping-and-swapping-elements-with-javascript-11d9cdac2178
//                    https://javascript.plainenglish.io/using-javascript-to-create-trello-like-card-re-arrange-and-drag-and-drop-557e60125bb4
let dragindex = 0;
let dropindex = 0;
let clone = "";
let sprintIndex = 0; 

function allowDrop(ev) {
    ev.preventDefault();
}

function dragStart(ev, newSprintIndex) {
    sprintIndex = newSprintIndex;
    ev.dataTransfer.setData("text/plain", ev.target.id);
}

function dropIt(ev) {
    ev.preventDefault();
    clone = ev.target.parentElement.cloneNode(true);

    // if not dropping on task div/ card (ie. if dropping on background of status column box/ gap)
    if (clone.className == "sprint-tasks-column") {
        let sourceId = ev.dataTransfer.getData("text/plain");
        let sourceIdEl = document.getElementById(sourceId);
        //let sourceIdParentEl=sourceIdEl.parentElement;
        let targetEl = document.getElementById(ev.target.id)
        let targetParentEl = targetEl.parentElement;
        // appending to end of status column
        if (targetEl.className === sourceIdEl.className) {
           targetParentEl.appendChild(sourceIdEl);
        } else {
            targetEl.appendChild(sourceIdEl);
        }

        // getting index of task in sprint array
        let index1 = getTaskIndex(sourceId);
        // swapping task status colour and changing task status in class
        let columnId = document.getElementById(sourceId).parentElement.id;
        changeTaskStatus(columnId, sourceId, index1);
        // updating task position in project._sprint[sprintIndex]._tasks 
        // (ie. appends to end of sprint array)
        let tempTask = project._sprints[sprintIndex]._tasks[index1];
        project._sprints[sprintIndex]._tasks.splice(index1, 1);
        project._sprints[sprintIndex]._tasks.push(tempTask);

        // updating task indexes in HTML (id and onlick)
        document.getElementById(sourceId).setAttribute("id", "temp");
        for (let i = parseInt(index1,10) + 1; i < project._sprints[sprintIndex]._tasks.length; i++) {
            let id1 = "sprint-task" + parseInt(i,10);
            let newId = "sprint-task" + parseInt(i-1,10);
            document.getElementById(id1).setAttribute("id", newId);
            document.getElementById(newId).setAttribute("onclick", "viewSprintTaskDetails(" + parseInt(i-1,10) + "," + sprintIndex + ")"); 
        }
        let newId = "sprint-task" + parseInt(project._sprints[sprintIndex]._tasks.length - 1,10);
        document.getElementById("temp").setAttribute("id", newId);
        document.getElementById(newId).setAttribute("onclick", "viewSprintTaskDetails(" + parseInt(project._sprints[sprintIndex]._tasks.length - 1,10) + "," + sprintIndex + ")");


    // else, if dropping on task div/ card
    } else {
        clone = ev.target.parentElement.cloneNode(true);
        let cloneParentId = ev.target.parentElement.parentElement.id;
        let data = ev.dataTransfer.getData("text"); 

        if (clone.id !== data) {
            let nodelist = document.getElementById(cloneParentId).childNodes;
            for (let i = 0; i < nodelist.length; i++) {
                // getting dragindex
                if (nodelist[i].id == data) {
                    dragindex = i;
                }
                // getting dropindex
                if (nodelist[i].id == clone.id) {
                    dropindex = i;
                }
            }
            // doing the swap
            document.getElementById(cloneParentId).replaceChild(document.getElementById(data), ev.target.parentElement);
            document.getElementById(cloneParentId).insertBefore(clone, document.getElementById(cloneParentId).childNodes[dragindex]);

            // getting indexes of tasks in sprint array
            let index1 = getTaskIndex(data);
            let index2 = getTaskIndex(clone.id);
            // swapping task status colour and changing task status in class
            let columnId = document.getElementById(data).parentElement.id;
            changeTaskStatus(columnId, data, index1);
            // swapping task indexes in HTML (id and onlick)
            swapSprintTaskIDs(data, clone.id, index1, index2)
            // updating task position in project._sprint[sprintIndex]._tasks
            updateSprintClassTasks(index1, index2);
        }
    }
    //console.log(project._sprints[sprintIndex]._tasks);
}