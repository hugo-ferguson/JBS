// Stores a single task
class Task 
{
    constructor(name, type, tag, storyPoints, priority, description, status)
    {
        this._name = name;
        this._tag = tag;
        this._type = type;
        this._storyPoints = parseInt(storyPoints);
        this._priority = priority;
        this._description = description;
        this._status = status;
        this._createdDateTime = new Date();       // Store the time the task was created at
        this._hours = new Map();        // Store the hours for the task against a date ["dd/mm/yy": hours]
        // this._hours.set("00/00/00", 0);
        this._hasHours = false;
        this._assignee = null;
    }

    // getters    
    get name() { return this._name; }

    get type() { return this._type; }

    get storyPoints() { return this._storyPoints; }

    get priority() { return this._priority; }

    get description() { return this._description; }

    get status() { return this._status; }

    get createdDateTime() { return this._createdDateTime;}

    get hours() { return this._hours;}

    get hasHours() { return this._hasHours; }

    // setters
    set name(newName) { this._name = newName; }

    set type(newType) { this._type = newType; }

    set storyPoints(newStoryPoints) { this._storyPoints = newStoryPoints; }

    set priority(newPriority) { this._priority = newPriority; }

    set description(newDescription) { this._description = newDescription; }

    set status(newStatus) { this._status = newStatus; }

    set hours(newHours) { this._hours = newHours; }

    set hasHours(value) { this._hasHours = value; }
    
    set assignee(newAssignee) { this._assignee = newAssignee; }

    addHours(date, hours) {
        let dateString = getDateString(date); 
        hours = parseInt(hours);
        if (!(this._hours instanceof Map)) {
            this._hours = new Map(this._hours);
        }
        this._hours.set(dateString, hours);
        this._hasHours = true;
    }

    getHours(date) {
        this._hours = new Map(this._hours);
        return this._hours.get(date);
    }

    getTotalHours() {
        let totalHours = 0;
        for (const [key, value] of this._hours) {
            totalHours += value;
          }
        return totalHours;
    }

    // methods
    fromData(data) 
    {
        this._name = data._name;
        this._type = data._type;
        this._tag = data._tag;
        this._storyPoints = parseInt(data._storyPoints);
        this._priority = data._priority;
        this._description = data._description;
        this._status = data._status;
        this._createdDateTime = new Date(data._createdDateTime); 
        this._hours = new Map(data._hours);
        this._hasHours = data._hasHours;
    }
}

// Stores a single sprint, which contains tasks assigned to it
class Sprint
{
    constructor(name, status, startDate, endDate)
    {
        this._name = name;
        this._status = status;
        this._tasks = new Array(0);               // Array of tasks added to this sprint
        this._startDate = startDate;
        this._endDate = endDate;
    }

    get name() { return this._name; }

    get status() { return this._status; }

    get startDate() { return new Date(this._startDate); }

    get endDate() { return new Date(this._endDate); }

    get tasks() { return this._tasks; }

    set name(newName) {
        this._name = newName;
    }

    set status(newStatus) {
        this._status = newStatus;
    }
    
    set startDate(newStartDate) {
        this._startDate = newStartDate;
    }

    set endDate(newEndDate) {
        this._endDate = newEndDate;
    }
    
    addTask(task) { this._tasks.push(task); }
    
    getTotalStoryPoints() {
        let output = 0;
        for (let i = 0; i < this._tasks.length; i++) 
        {
            output += parseInt(this._tasks[i]._storyPoints);
        } 
        return output;
    }

    hasHoursLogged() {
        for (let i = 0; i < this._tasks.length; i++) 
        {
            if (!this._tasks[i].hasHours) {
                return false;
            }
        } 
        return true; 
    }

    getData() {
        let xAxis = []
        let ideal = []
        let actual = []
        let accumulation = []

        const totalStoryPoints = this.getTotalStoryPoints();
        let idealRemainingStoryPoints = totalStoryPoints;
        let actualRemainingStoryPoints = totalStoryPoints;

        let timeDifference = this._endDate.getTime() - this._startDate.getTime();
        let sprintDuration = timeDifference / (1000 * 3600 * 24);
        const idealIncrement = Number.parseFloat(totalStoryPoints/Math.floor(sprintDuration)).toFixed(2);

        let accumulatedHours = 0

        const currDate = new Date();
        const today = getDateString(currDate);
        const start = getDateString(this._startDate);

        let end = today;
        if (currDate.getTime() > this._endDate.getTime()) {
            end = getDateString(this._endDate);
        }

        let i = start;
        xAxis.push(i);
        ideal.push(idealRemainingStoryPoints);
        actual.push(actualRemainingStoryPoints);
        accumulation.push(accumulatedHours);

        const thirtyDays = new Set(["04", "06", "09", "11"]);

        while (i != end) {
            if (i.slice(0, 5) == "31/12") {
                // end of year
                let newYear = (parseInt(i.slice(6)) + 1).toString();
                if (newYear.length == 1) {
                    newYear = "0" + newYear;
                }
                i = "01/01/" + newYear;
            } else if (i.slice(3, 5) == "02" && i.slice(0, 2) == "28") {
                // end of february
                i = "01/03/" + i.slice(6);
            } else if ((thirtyDays.has(i.slice(3, 5)) && i.slice(0, 2) == "30") || (!(thirtyDays.has(i.slice(3, 5))) && i.slice(0, 2) == "31")) {
                // end of months
                let newMonth = (parseInt(i.slice(3, 5)) + 1).toString();
                if (newMonth.length == 1) {
                    newMonth = "0" + newMonth;
                }
                i = "01/" + newMonth + i.slice(5);
            } else {
                let newDate = (parseInt(i.slice(0, 2)) + 1).toString();
                if (newDate.length == 1) {
                    newDate = "0" + newDate;
                }
                i = newDate + i.slice(2); 
            }

            idealRemainingStoryPoints -= idealIncrement;
            idealRemainingStoryPoints = parseFloat(Number.parseFloat(idealRemainingStoryPoints).toFixed(2));

            let hoursForDate = this.getHoursForDate(i);
            actualRemainingStoryPoints -= hoursForDate;
            accumulatedHours += hoursForDate;

            xAxis.push(i);
            ideal.push(idealRemainingStoryPoints);
            actual.push(actualRemainingStoryPoints);
            accumulation.push(accumulatedHours);
        }

        let data = [xAxis, ideal, actual, accumulation];
        return data;
    }

    /**
     * 
     * @param {*} date a String of the date in the format "dd/mm/yy"
     */
    getHoursForDate(date) {
        let totalHours = 0
        for (let i = 0; i < this._tasks.length; i++) 
        {
            if (this._tasks[i].getHours(date) != undefined) {
                totalHours += this._tasks[i]._hours.get(date);
            }
        } 
        return totalHours; 
    }

    // Loads sprint data from a json string
    fromData(data)
    {
        this._name = data._name;
        this._status = data._status;             // Array of tasks added to this sprint
        this._startDate = new Date(data._startDate);
        this._endDate = new Date(data._endDate);
        this._tasks = [];
        // Add a new task for each entry in the JSON-project's tasks array
        for (let i = 0; i < data._tasks.length; i++) 
        {
            let tempTask = new Task();
            tempTask.fromData(data._tasks[i]);
            this._tasks.push(tempTask);
        }
    }
}

// Stores a Project object, which contains a number of
// tasks that don't belong to a sprint, as well as a number of
// sprints which contain their own tasks
class Project
{
    constructor()
    {
        this._tasks = new Array(0);               // Array of tasks that haven't been added to a sprint
        this._sprints = new Array(0);             // Array of sprints that contain tasks
        this._members = new Array(0);             // Array of Team Members
    }

    get tasks() { return this._tasks; }

    get sprints() { return this._sprints; }

    get members() { return this._members; }

    // Loads project data from a json string
    fromData(data)
    {
        this._tasks = [];
        // Add a new task for each entry in the JSON-project's tasks array
        for (let i = 0; i < data._tasks.length; i++) 
        {
            let tempTask = new Task();
            tempTask.fromData(data._tasks[i]);
            this._tasks.push(tempTask);
        }

        this._sprints = [];
        for (let i = 0; i < data._sprints.length; i++) 
        {
            let tempSprint = new Sprint();
            tempSprint.fromData(data._sprints[i]);
            this._sprints.push(tempSprint);
        }

        this._members = [];
        for (let i = 0; i < data._members.length; i++) 
        {
            let tempMember = new Person();
            tempMember.fromData(data._members[i]);
            this._members.push(tempMember);
        }
    }

    // Create a new sprint inside the project
    createSprint(name, status, startDate, endDate)
    {
        // Create a new sprint and add to array
        let newSprint = new Sprint(name, status, startDate, endDate);
        this._sprints.push(newSprint);
    }

    // Creates a new task
    createTask(name, type, storyPoints, priority, tag, description) 
    {
        // Create a new task and add to array
        let newTask = new Task(name, type, tag, storyPoints, priority, description, "not-started");
        this._tasks.unshift(newTask);
    }

    // Deletes a task with specified index
    deleteTask(index) 
    {
        // Remove index from tasks array
        this._tasks.splice(index, 1);
    }

    // Remove a task from the project's task list
    removeTask(index) {
        this._tasks.splice(index, 1)
    }

    deleteSprint(index) {
        // Remove index from tasks array
        this._sprints.splice(index, 1);
    }

    createPerson(name, email, colour) {
        
        // create new person and adds them to array
        let newPerson = new Person(name, email, colour);
        this._members.push(newPerson);
    }

    // Remove team member from the array
    deleteTeamMember(index) {
        this._members.splice(index, 1)
    }
}

// Creates a team member, initialising all their necessary fields
class Person
{
    constructor(name, email, colour)
    {
        this._name = name;
        this._email = email;
        this._colour = colour;
        this._hours = [] 
    }

    // getters
    get name() { return this._name; }

    get email() { return this._email; }

    get colour() { return this._colour; }

    get hours()  { return this._hours; }

    // setters
    set name(newName) { this._name = newName; }

    set email(newEmail) {this._email = newEmail; }

    set colour(newColour) {this._colour = newColour; }

    addHours(date, hours) {
        if (this._hours.length == 0) {
            this._hours.push([date, hours]);
        } 
        else {
            let added = 0
            for (var i = 0; i < (this._hours.length); i++) {
                if ((this._hours[i][0]).getTime() == date.getTime()) {
                    this._hours[i][1] += hours;
                    added = 1;
                    break
                }
                else if (Date.parse(this._hours[i][0]) > Date.parse(date)) {
                    this._hours.splice(i,0,[date,hours]);
                    added = 1;
                    break
                }
            }
            if (added == 0) {
                this._hours.push([date, hours]);
            }
        }
    }   

    getDataForChart() {
        let array = this._hours;
        let dates = []
        let hours = []

        for (let i=0; i<array.length; i++) {
            let date = getDateString(array[i][0]);
            dates.push(date);
            hours.push(array[i][1]);
        }
        return [dates, hours]
    }

    fromData(data) 
    {
    this._name = data._name;
    this._email = data._email;
    this._colour = data._colour;
    this._hours = data._hours
    }
}



function getDateString(givenDate) 
{
    let date = new Date(givenDate);
    let day = date.getDate().toString();
    let month = (date.getMonth()+1).toString();
    let year = date.getFullYear().toString();
    if (day.length == 1) {
        day = "0" + day;
    }
    if (month.length == 1) {
        month = "0" + month;
    }
    let dateString = day + "/" + month + "/" + year.slice(2);
    return dateString;
}

// checkIfDataExistsLocalStorage(key)
// 
// Description:
//      Checks if data exists in local storage for a given key.
//      Checks if the data at key is either empty, null, or a 
//      blank string. Returns true if does, false if not.
//
// Arguments:
//      key: String value to check local storage at.
//
// Returns:
//      bool: Whether or not data was found at the key.
function checkDataExistsLocalStorage(key)
{
	let data = localStorage.getItem(key);
    return !(data === undefined || data === null || data === "");
}

// getDataLocalStorage(key)
// 
// Description:
//      Gets the data stored at a given key in json format.
//
// Arguments:
//      key: String value from which to get data from local storage.
//
// Returns:
//      string: JSON string of the data stored at key.
function getDataLocalStorage(key)
{
	let data = localStorage.getItem(key);
	data = JSON.parse(data);
	return data;
}

// updateLocalStorage(key)
// 
// Description:
//      Stores data in local storage at the specified key.
//
// Arguments:
//      key: String value to store data at in local storage.
//
// Returns:
//      This function has no returns.
function updateLocalStorage(key, data)
{    
    // change hashmaps to arrays
    for (let i = 0; i < data.tasks.length; i++) {
        var thisTask = data.tasks[i]
        thisTask.hours = Array.from(thisTask.hours);
    }
    // change hashmaps to arrays
    for (let s = 0; s < data.sprints.length; s++) {
        for (let t = 0; t < data.sprints[s].tasks.length; t++) {
            var thisTask = data.sprints[s].tasks[t]
            thisTask.hours = Array.from(thisTask.hours);
        }
    }
	let string = JSON.stringify(data);
	localStorage.setItem(key, string);
}

// create global project
let project = new Project();
// check if data is available in local storage before continuing
if (checkDataExistsLocalStorage(PROJECT_KEY)) 
{
    // if data exists, retrieve it
    let data = getDataLocalStorage(PROJECT_KEY);
    // restore data into the project
    project.fromData(data);
}

updateLocalStorage(PROJECT_KEY, project);

// TESTS

// let sprint = new Sprint("test sprint asdkfh", "not-started", new Date(2022, 7, 26), new Date(2022, 8, 9))

// let task1 = new Task("task 1 546", 'type', "tag", 9, "critical", "description", "not-started")
// sprint.addTask(task1);

// // let task2 = new Task("abc", 'type', "tag", 6, "low", "description", "in-progress")
// // sprint.addTask(task2);

// // let task3 = new Task("Task 3", 'type', "tag", 6, "low", "description", "in-progress")
// // sprint.addTask(task3);

// task1.addHours(new Date(2022, 7, 28), 1)
// task1.addHours(new Date(2022, 7, 29), 1)
// task1.addHours(new Date(2022, 7, 31), 1)
// task1.addHours(new Date(2022, 8, 2), 4)
// task1.addHours(new Date(2022, 8, 6), 1)

// // task2.addHours(new Date(2022, 7, 27), 2)
// // task2.addHours(new Date(2022, 7, 30), 3)
// // task2.addHours(new Date(2022, 7, 31), 2)
// // task2.addHours(new Date(2022, 8, 1), 1)
// // task2.addHours(new Date(2022, 8, 3), 1)

// project._sprints.push(sprint);
// updateLocalStorage(PROJECT_KEY, project);


    // PERSON TEST

// let person1 = new Person('Andy', 'andy@email.com', '#FFFFFF')
// person1.addHours(new Date('2022-02-22'), 1)
// person1.addHours(new Date('2022-02-22'), 1)
// person1.addHours(new Date('2022-02-24'), 7)
// person1.addHours(new Date('2022-02-23'), 4)
// person1.addHours(new Date('2022-02-26'), 8)
// person1.addHours(new Date('2022-02-23'), 2)


// console.log(person1)