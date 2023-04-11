function displaySprints() {
    let output = ""
    for (let i = 0; i < project._sprints.length; i++) {
      let current_sprint = project._sprints[i];
      let status_color = ""
      if (current_sprint._status == "not-started") {
        status_color = "rgb(255, 46, 99)"
      } else if (current_sprint._status == "in-progress") {
        status_color = "rgb(2, 182, 201)"
      } else if (current_sprint._status == "completed") {
        status_color = "rgb(0, 196, 72)"
      }
      output += `<div class="sprint" id="sprint${i}">
                    <div class="sprint-status" style="background-color: ${status_color}"></div>
                    <div class="sprint-name">${current_sprint._name}</div>
                    <div class="sprint-start-date">${getDateString(current_sprint._startDate)}</div> 
                    <span style="font-size: 50px;">  to </span>
                    <div class="sprint-end-date">${getDateString(current_sprint._endDate)}</div>
                    <button class="sprint-tasks-btn" id="tasks-sprint${i}" onclick="viewSprintTasks(${i})">Tasks</button>`
      if (current_sprint.tasks.length > 0) { 
        output += `<button class="sprint-progress-btn" id="progress-sprint${i}" onclick="viewSprintProgress(${i})">Progress</button>`
      }
      output += `<button class="sprint-progress-btn" id="edit-sprint${i}" onclick="editSprint(${i})">Edit</button>
        </div>`
      
    }
                    
    
    let sprintBox = document.getElementById("sprint-box");
    sprintBox.innerHTML = output;
  }

displaySprints();