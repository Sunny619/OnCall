document.addEventListener('DOMContentLoaded', function () {
    fetch('/getTeamAll')
        .then(response => response.json())
        .then(data => loadHTMLTable(data['data']['rows']));

});
document.querySelector('#view-all-btn').addEventListener
('click', function(event){
    reloadTable();
})
// document.querySelector('#search-by-name-btn').addEventListener
// ('click', function(event){
//     console.log("clciked")
//     const val = document.querySelector('#search-by-name').value;
//     fetch('/searchByName', {
//         headers: {
//             'Content-type': 'application/json'
//         },
//         method: 'POST',
//         body: JSON.stringify({
//             val: val, 
//         })
//     }).then(res => res.json())
//         .then(data => {
//             loadHTMLTable(data['data'])
//         });//insertRowIntoTable(data['data']));
// })
document.querySelector('#search-by-team-btn').addEventListener
('click', function(event){
    const val = document.querySelector('#search-by-team').value;
    fetch('/searchByTeamInTeams', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
            val: val, 
        })
    }).then(res => res.json())
        .then(data => {
            loadHTMLTable(data['data'])
        });//insertRowIntoTable(data['data']));
})
// document.querySelector('#search-by-date-btn').addEventListener
// ('click', function(event){
//     console.log("clicked date search")
//     const start_date = document.querySelector('#search-by-date-start').value;
//     const end_date = document.querySelector('#search-by-date-end').value;
//     fetch('/searchByDate', {
//         headers: {
//             'Content-type': 'application/json'
//         },
//         method: 'POST',
//         body: JSON.stringify({
//             start_date: start_date,
//             end_date: end_date 
//         })
//     }).then(res => res.json())
//         .then(data => {
//             if(data['data'] == 0)
//                 document.querySelector('#error-msg').innerHTML = "End date cannot be before the start date";
//             else
//                 loadHTMLTable(data['data'])
//         });//insertRowIntoTable(data['data']));
// })
document.querySelector('table tbody').addEventListener
('click', function(event){
    //console.log(event.target);
    if(event.target.className === "delete-row-btn")
    {
        deleteRow(event.target.dataset.team, event.target.dataset.name);
    }
});

// function displayModifyButtons(row)
// {
//     console.log(row.childNodes[1]);
//     if(row.childNodes[3].childNodes[1].style.display == "none")
//     {
//         row.childNodes[3].childNodes[1].style.display = "block";
//         row.childNodes[4].childNodes[1].style.display = "block";
//     }
//     else
//     {
//         row.childNodes[3].childNodes[1].style.display = "none";
//         row.childNodes[4].childNodes[1].style.display = "none";
//     }
// }
// function ModifyRow(val, col,year, start_date, end_date, team)
// {
//     //console.log(date,col,val);
//     fetch('/modify', {
//         headers: {
//             'Content-type': 'application/json'
//         },
//         method: 'PUT',
//         body: JSON.stringify({
//             val : val,
//             col: col,
//             year : year,
//             start_date: start_date,
//             end_date: end_date,
//             team: team
//         })
//     }).then(res => res.json())
//         .then(data => {
//             location.reload();
//         });
// }
function deleteRow(team, name)
{
    fetch('/deleteTeam', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'DELETE',
        body: JSON.stringify({
            team: team,
            name:name
        })
    }).then(res => res.json())
        .then(data => {
            location.reload();
        });//insertRowIntoTable(data['data']));
}


const addBtn = document.querySelector('#add-btn');
addBtn.onclick = () => {

    const nameInput = document.querySelector('#name-input');
    const name = nameInput.value;
    nameInput.value = "";
    const teamInput = document.querySelector('#team-input');
    const team = teamInput.value;
    teamInput.value = "";
    console.log(JSON.stringify({
        team:team,
        name:name
    }));
    fetch('/insertTeam', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
            team:team,
            name:name
        })
    }).then(res => res.json())
        .then(data => insertRowIntoTable(data['data']));
}
function insertRowIntoTable(data) {

    console.log(data);
    if(data == 0)
    {
        reloadTable();
    }
    else if(data == 1)
    {
        document.querySelector('#error-msg').innerHTML = "The given entry already exists";
    }
    else if(data == 2)
    {
        document.querySelector('#error-msg').innerHTML = "Please enter all the fields";
    }

}
function loadHTMLTable(data) {
    //data = data['rows']
    console.log(data);
    const table = document.querySelector('table tbody');
    let tableHTML = "";
    console.log(data);
    if (data.length === 0) {
        table.innerHTML = "<tr><td class = 'no-data' colspan = '3'>No Data</td></tr>"
    }

    data.forEach(({ team, name}) => {
        tableHTML += "<tr>";
        tableHTML += `<td>${team}</td>`;
        tableHTML += `<td>${name}</td>`;
        tableHTML += `<td><button class= 'delete-row-btn' data-team = ${team} data-name = ${name} >Delete</button></td>`;
        tableHTML += "</tr>";
    });
    table.innerHTML = tableHTML;
}
function reloadTable()
{
    fetch('/getTeamAll')
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']['rows']));
}