/**
 * function: sortCreationDate
 * Purpose: Sorts the list of tasks based on their creation date
 * @param {Array} list List of tasks
 */
 function sortCreationDate(list)
 {
     let temp = 0;
     for (let i = 0; i < list.length; i++)
     {
         for (let j = 0; j < list.length; j++)
         {
             if (list[i]._createdDateTime >= list[j]._createdDateTime)
             {
                 temp = list[j];
                 list[j] = list[i];
                 list[i] = temp;
             }
         }
     }
     updateLocalStorage(PROJECT_KEY, project);
 }

 /**
  * function: filterTag
  * Purpose: To create a list that contains only the tagCondition tag
  * @param {Array} list Array of all tasks in the backlog
  * @param {String} tagCondition The tag that we want to filter for
  * @returns Array of all tasks in the backlog that has the tagCondition tag
  */
function filterTag(list, tagCondition)
{
    output = new Array();
    for (let i = 0; i < list.length; i++)
    {
        let current_task = list[i];

        // Identifying the task priority to colour code 
        let bg_color = ""
        if (current_task._priority == "low") {
            bg_color = "rgba(65, 210, 149, 255)"
        } else if (current_task._priority == "medium") {
            bg_color = "rgba(247, 233, 30, 255)"
        } else if (current_task._priority == "high") {
            bg_color = "rgba(247, 110, 30, 255)"
        } else if (current_task._priority == "critical") {
            bg_color = "rgba(235, 64, 52, 255)"
        }

        if (tagCondition == "All" || list[i]._tag.toUpperCase() === tagCondition.toUpperCase())
        {
            // Output for the card display 
            output += `<div  id="card${i}" class="card" draggable="true" ondragstart="dragStart(event)" onclick="viewTask(${i})">
                <div class="card-content-name">${current_task._name}</div>
                <div class="card-content-tag">${current_task._tag}</div>
                <div class="card-content-sp">${current_task._storyPoints}</div>
                <span class="priority-dot" style="background-color: ${bg_color};"></span>
            </div>`; 
        }

        }

    return output;
}

/**
 * function: displayTasksSorted()
 * Purpose: Displays the cards in the product backlog
 */
function displayTasksSorted(sortBool) 
{
    // Retrieving the data from the local storage
    let list = project._tasks;
    
    // Calling the sortCreationDate to sort the list
    if (sortBool == true)
    {
        // Confirming if the user wants to override their current tasks order and sort by creation date instead
        if (confirm("Would you like to override your current tasks order and sort by creation date instead?") == true) 
        {
            sortCreationDate(list);
        }
    }
    
    // Retrieving the selected filter option from the dropdown menu in the product backlog
    let tagID = document.getElementById("filter-selection");
    let tagCondition = tagID.options[tagID.selectedIndex].text;

    // Calling the fitlerTag function to filter the product backlog based on its tag condition
    filteredList = filterTag(list, tagCondition);

    document.getElementById("board-lists").innerHTML = filteredList;
}
//displayTasksSorted();

/**
 * function: filterSelected()
 * Purpose: To update the display of tasks after a filter option has been selected
 */
function filterSelected(sortBool)
{
    if (sortBool == true)
    {
        displayTasksSorted(sortBool);
    }
    else
    {
        displayTasksSorted(false);
    }
    
}

/**
 * function: sortBool()
 * Purpose: To provide a boolean of true for the filterSelected function if the "Reset" button was clicked
 */
function sortBool()
{
    filterSelected(true);
}