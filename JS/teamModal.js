// Create new team member
var newTeamMemberModal = document.getElementById("create-team-member-modal");
var addTeamMemberBtn = document.getElementById("new-team-member");
var closeNewTeamMemberModal = document.getElementById("close-new-team-member-modal");
let saveTeamMemberBtn = document.getElementById('save-team-member-btn');

// Team member overview
// var viewTeamMemberModal = document.getElementById("team-member-0");
var closeTeamMemberOverview = document.getElementById("close-team-member-overview-modal");
var teamMemberOverview = document.getElementById("team-member-overview-modal");

// Team member average contribution
var viewAverageContributionModal = document.getElementById("average-contribution");
var viewAverageContributionModal2 = document.getElementById("average-contribution2");
var averageContributionModal = document.getElementById("team-member-average-contribution-modal");
var closeAverageContributionModal = document.getElementById("close-team-member-average-contribution-modal");


// Team member total contribution
var viewTotalContributionModal = document.getElementById("total-contribution");
var viewTotalContributionModal2 = document.getElementById("total-contribution2");
var totalContributionModal = document.getElementById("team-member-total-contribution-modal");
var closeTotalContributionModal = document.getElementById("close-team-member-total-contribution-modal")

// Modal person inputs
personNameInput = document.getElementById('team-member-name-input');
personEmailInput = document.getElementById('team-member-email-input');
personColourInput = document.getElementById('team-member-color-input');

// Create a new person
function createPerson(name, email, colour) {
    if (validateTeamMemberFields()) {
        project.createPerson(name, email, colour);
        // Update Local storage with new person
        updateLocalStorage(PROJECT_KEY, project);
        // Update display
        displayTeamMembers();
        // Clear and hide the modal once created
        clearTeamModal();
        newTeamMemberModal.style.display = "none";
    }
}

// Clear the team member modal
function clearTeamModal() {
    personNameInput.value = '';
    personEmailInput.value = '';
    personColourInput.value = '#252A34';
}

// Checks if user has entered all required fields
function validateTeamMemberFields() {
    if (personNameInput.value == '') {
      showAlertField('name');
      return false;
    }
    else if (personEmailInput.value == '') {
      showAlertField('email');
      return false;
    }
  
    return true;
}

function showAlertField(field) {
    alertMessage = 'Please enter a value for ';
    alert(alertMessage + field);
}

// create
addTeamMemberBtn.onclick = function() {
    newTeamMemberModal.style.display = "block";
}
closeNewTeamMemberModal.onclick = function () {
    newTeamMemberModal.style.display = "none";
}

// Delete a team member from the project
// but NOT from any tasks they are part of
function deleteTeamMember(index) {
    if (confirm('Are you sure you want to delete this team member? Note: this will not remove them from any tasks they are assigned to.')) {
        project.deleteTeamMember(index);
        // Save to local storage
        updateLocalStorage(PROJECT_KEY, project);
        // Update display
        displayTeamMembers();
        // Clear and hide the modal once created
        clearTeamModal();
        newTeamMemberModal.style.display = "none";
    }

}

// save team member
saveTeamMemberBtn.onclick = function() {
    createPerson(personNameInput.value, 
        personEmailInput.value,
        personColourInput.value)
}

// overview
// viewTeamMemberModal.onclick = function() {
//     teamMemberOverview.style.display = "block";
// }
closeTeamMemberOverview.onclick = function() {
    teamMemberOverview.style.display = "none";
}

// average
viewAverageContributionModal.onclick = function(){
    averageContributionModal.style.display = "block";
}
closeAverageContributionModal.onclick = function () {
    averageContributionModal.style.display = "none";
}
viewAverageContributionModal2.onclick = function() {
    averageContributionModal.style.display = "block";
}

// total
viewTotalContributionModal.onclick = function(){
    totalContributionModal.style.display = "block";
}
closeTotalContributionModal.onclick = function () {
    totalContributionModal.style.display = "none";
}
viewTotalContributionModal2.onclick = function() {
    totalContributionModal.style.display = "block";
}

// window events
window.onclick = function(event) {
    if (event.target == newTeamMemberModal) {
        newTeamMemberModal.style.display = "none";
    }
    if (event.target == teamMemberOverview){
        teamMemberOverview.style.display = "none";
    }
    if (event.target == averageContributionModal){
        averageContributionModal.style.display = "none";
        totalContributionModal.style.display = "none";
    }
    if (event.target == totalContributionModal){
        averageContributionModal.style.display = "none";
        totalContributionModal.style.display = "none";
    }
}