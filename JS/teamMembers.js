function displayTeamMembers() {
    let members = project.members;
    let output = ""
    for (let i = 0; i < members.length; i++) {
        output += `<div class="team-member" onclick="viewTeamMemberModal(${i})">
        <div class="team-member-colour-bar" style="background-color: ${members[i].colour}"></div>
        <div class="team-member-card-name">${members[i].name}z
        <span class="material-symbols-outlined" onclick="deleteTeamMember(${i})">delete</span></div>
        <div class="team-member-card-email">${members[i].email}</div>
    </div>`
    }
    document.getElementsByClassName("team-member-box")[0].innerHTML = output;
}

displayTeamMembers()

function viewTeamMemberModal(i) {
    let member = project.members[i];
    document.getElementById("team-member-overview-modal").style.display = "block";
    document.getElementById("team-member-name-label").innerText = member.name;
    document.getElementById("team-member-email").innerText = member.email;

    // CHART
    let hoursData = member.getDataForChart();

    const dates = hoursData[0];

    const data = {
        labels: dates,
        datasets: [{
            label: 'Hours',
            backgroundColor: member.colour,
            borderColor: member.colour,
            data: hoursData[1],
        }]
    };

    const config = {
        type: 'bar',
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
                    },
                    beginAtZero: true
                }
            }
        }
    }

    const myChart = new Chart(
        document.getElementById('team-member-hours'),
        config
    );
    
    let chartCheck = Chart.getChart("team-member-hours");
    
    if (chartCheck !== undefined) {
        chartCheck.destroy();
    }
}