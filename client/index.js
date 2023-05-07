document.addEventListener('DOMContentLoaded', function () {
    fetch('/getAll')
        .then(response => response.json())
        .then(data => loadHTMLTable(data['data']['rows']));
    fetch('/getTeams')
        .then(response => response.json())
        .then(data => loadTeams(data['data']['rows']));

});
document.querySelector('#view-all-btn').addEventListener
    ('click', function (event) {
        reloadTable();
    })

document.querySelector('#team-input').addEventListener
    ('change', function (event) {
        const val = document.querySelector('#team-input').value;
        console.log(val);
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
                loadNamesPrimary(data['data'])
                loadNamesSecondary(data['data'])
            });
    })
document.querySelector('#search-by-name-btn').addEventListener
    ('click', function (event) {
        console.log("clciked")
        const val = document.querySelector('#search-by-name').value;
        fetch('/searchByName', {
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
document.querySelector('#search-by-team-btn').addEventListener
    ('click', function (event) {
        console.log("clciked team")
        const val = document.querySelector('#search-by-team').value;
        fetch('/searchByTeam', {
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
document.querySelector('#search-by-date-btn').addEventListener
    ('click', function (event) {
        console.log("clicked date search")
        const start_date = document.querySelector('#search-by-date-start').value;
        const end_date = document.querySelector('#search-by-date-end').value;
        fetch('/searchByDate', {
            headers: {
                'Content-type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                start_date: start_date,
                end_date: end_date
            })
        }).then(res => res.json())
            .then(data => {
                if (data['data'] == 0)
                    document.querySelector('#error-msg').innerHTML = "End date cannot be before the start date";
                else
                    loadHTMLTable(data['data'])
            });//insertRowIntoTable(data['data']));
    })
document.querySelector('table tbody').addEventListener
    ('click', function (event) {
        //console.log(event.target);
        if (event.target.className === "delete-row-btn") {
            console.log(event.target.dataset.start_date)
            deleteRow(event.target.dataset.year, event.target.dataset.start_date, event.target.dataset.end_date, event.target.dataset.team);
        }
        if (event.target.className === "modify-row-btn") {
            console.log(event.target.parentNode.parentNode);
            displayModifyButtons(event.target.parentNode.parentNode);
            //deleteRowByDate(event.target.dataset.id)
        }
        if (event.target.className === "modify-col-p-btn") {
            const year = event.target.dataset.year;
            const start_date = event.target.dataset.start_date
            const end_date = event.target.dataset.end_date
            const team = event.target.dataset.team
            //console.log(event.target.parentNode);
            const val = event.target.parentNode.childNodes[0].value
            //console.log(val);
            ModifyRow(val, "primary_call", year, start_date, end_date, team)
        }
        if (event.target.className === "modify-col-s-btn") {
            const year = event.target.dataset.year;
            const start_date = event.target.dataset.start_date
            const end_date = event.target.dataset.end_date
            const team = event.target.dataset.team
            //console.log(event.target.parentNode);
            const val = event.target.parentNode.childNodes[0].value
            //console.log(val);   
            ModifyRow(val, "secondary_call", year, start_date, end_date, team)
        }
    });

function displayModifyButtons(row) {
    console.log(row.childNodes[1]);
    if (row.childNodes[3].childNodes[1].style.display == "none") {
        row.childNodes[3].childNodes[1].style.display = "block";
        row.childNodes[4].childNodes[1].style.display = "block";
        const team = row.childNodes[2].innerHTML;
        const elementP = row.childNodes[3].childNodes[1].childNodes[0];
        const elementS = row.childNodes[4].childNodes[1].childNodes[0];
        fetch('/searchByTeamInTeams', {
            headers: {
                'Content-type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                val: team, 
            })
        }).then(res => res.json())
            .then(data => {
                loadModPrimary(data['data'],elementP)
                loadModSecondary(data['data'],elementS)
            });
    }
    else {
        row.childNodes[3].childNodes[1].style.display = "none";
        row.childNodes[4].childNodes[1].style.display = "none";
    }
}
function ModifyRow(val, col, year, start_date, end_date, team) {
    //console.log(date,col,val);
    fetch('/modify', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'PUT',
        body: JSON.stringify({
            val: val,
            col: col,
            year: year,
            start_date: start_date,
            end_date: end_date,
            team: team
        })
    }).then(res => res.json())
        .then(data => {
            location.reload();
        });
}
function deleteRow(year, start_date, end_date, team) {
    fetch('/delete', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'DELETE',
        body: JSON.stringify({
            year: year,
            start_date: start_date,
            end_date: end_date,
            team: team
        })
    }).then(res => res.json())
        .then(data => {
            location.reload();
        });//insertRowIntoTable(data['data']));
}


const addBtn = document.querySelector('#add-btn');
addBtn.onclick = () => {
    const startDateInput = document.querySelector('#start-date-input');
    const start_date = startDateInput.value;
    startDateInput.value = "";
    const year = new Date(start_date).getFullYear();
    const endDateInput = document.querySelector('#end-date-input');
    const end_date = endDateInput.value;
    endDateInput.value = "";
    //console.log(date);
    const primaryInput = document.querySelector('#primary-input');
    const primary = primaryInput.value;
    primaryInput.value = "";
    //console.log(primary);
    const secondaryInput = document.querySelector('#secondary-input');
    const secondary = secondaryInput.value;
    secondaryInput.value = "";
    const teamInput = document.querySelector('#team-input');
    const team = teamInput.value;
    teamInput.value = "";
    console.log(JSON.stringify({
        year: year,
        start_date: start_date,
        end_date: end_date,
        primary_call: primary,
        secondary_call: secondary,
        team: team
    }));
    fetch('/insert', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
            year: year,
            start_date: start_date,
            end_date: end_date,
            team: team,
            primary_call: primary,
            secondary_call: secondary
        })
    }).then(res => res.json())
        .then(data => insertRowIntoTable(data['data']));
}
function insertRowIntoTable(data) {
    // const table = document.querySelector('table tbody');
    // const isData = table.querySelector('.no-data');
    // console.log(data);
    // const { date, primary, secondary } = data;
    // let tableHTML = "";

    // tableHTML += "<tr>";
    // tableHTML += `<td>${date}</td>`;
    // tableHTML += `<td>${primary}</td>`;
    // tableHTML += `<td>${secondary}</td>`;
    // tableHTML += `<td><button class= 'modify-row-btn' data-id=${date}>Modify</button></td>`;
    // tableHTML += `<td><button class= 'delete-row-btn' data-id=${date} >Delete</button></td>`;
    // tableHTML += "</tr>";

    // if (isData) {
    //     table.innerHTML = tableHTML;
    // }
    // else {
    //     const newRow = table.insertRow();
    //     newRow.innerHTML = tableHTML;
    // }
    console.log(data);
    if (data == 0) {
        reloadTable();
    }
    else if (data == 1) {
        document.querySelector('#error-msg').innerHTML = "The given entry already exists";
    }
    else if (data == 2) {
        document.querySelector('#error-msg').innerHTML = "An existing Oncall clashes with the given date range";
    }
    else if (data == 3) {
        document.querySelector('#error-msg').innerHTML = "End date cannot be before the start date";

    }
}
function loadHTMLTable(data) {
    //data = data['rows']
    console.log(data);
    const table = document.querySelector('table tbody');
    let tableHTML = "";
    console.log(data);
    if (data.length === 0) {
        table.innerHTML = "<tr><td class = 'no-data' colspan = '5'>No Data</td></tr>"
    }

    data.forEach(({ year, start_date, end_date, team, primary_call, secondary_call }) => {
        tableHTML += "<tr>";
        tableHTML += `<td>${start_date}</td>`;
        tableHTML += `<td>${end_date}</td>`;
        tableHTML += `<td>${team}</td>`;
        tableHTML += `<td><div>${primary_call}</div><div style="display:none"><select><option value="" disabled selected>Select Primary</option></select><button class= 'modify-col-p-btn' data-year=${year} data-start_date=${start_date} data-end_date=${end_date} data-team = ${team}>Modify</button></div></td>`;
        tableHTML += `<td><div>${secondary_call}</div><div style="display:none"><select><option value="" disabled selected>Select Secondary</option></select><button class= 'modify-col-s-btn' data-year=${year} data-start_date=${start_date} data-end_date=${end_date} data-team = ${team}>Modify</button></div></td>`;
        tableHTML += `<td><button class= 'modify-row-btn' data-year=${year} data-start_date=${start_date} data-end_date=${end_date} data-team = ${team}>Modify</button></td>`;
        tableHTML += `<td><button class= 'delete-row-btn' data-year=${year} data-start_date=${start_date} data-end_date=${end_date} data-team = ${team} >Delete</button></td>`;
        tableHTML += "</tr>";
    });
    table.innerHTML = tableHTML;
}
function loadTeams(data) {
    //data = data['rows']
    console.log(data);
    const drop = document.querySelector('#team-input');
    let dropHTML = '<option value="" disabled selected>Select team</option>';
    console.log(data);
    if (data.length === 0) {
        drop.innerHTML = "<option>No Teams</option>"
    }

    data.forEach(({ team }) => {
        dropHTML += `<option val = ${team}>${team}</option>`;
    });
    drop.innerHTML = dropHTML;

}
function loadNamesPrimary(data, team) {
    //data = data['rows']
    console.log(data);
    const drop = document.querySelector('#primary-input');
    let dropHTML = '<option value="" disabled selected>Select Primary</option>';
    console.log(data);
    data.forEach(({ team,name }) => {
        dropHTML += `<option val = ${name}>${name}</option>`;
    });
    drop.innerHTML = dropHTML;
}
function loadNamesSecondary(data) {
    //data = data['rows']
    console.log(data);
    const drop = document.querySelector('#secondary-input');
    let dropHTML = '<option value="" disabled selected>Select Secondary</option>';
    console.log(data);
    data.forEach(({ team,name }) => {
        dropHTML += `<option val = ${name}>${name}</option>`;
    });
    drop.innerHTML = dropHTML;
}
function loadModPrimary(data, drop) {
    //data = data['rows']
    let dropHTML = '<option value="" disabled selected>Select Primary</option>';
    console.log(data);
    data.forEach(({ team,name }) => {
        dropHTML += `<option val = ${name}>${name}</option>`;
    });
    drop.innerHTML = dropHTML;
}
function loadModSecondary(data, drop) {
    //data = data['rows']
    let dropHTML = '<option value="" disabled selected>Select Secondary</option>';
    console.log(data);
    data.forEach(({ team,name }) => {
        dropHTML += `<option val = ${name}>${name}</option>`;
    });
    drop.innerHTML = dropHTML;
}
function reloadTable() {
    fetch('/getAll')
        .then(response => response.json())
        .then(data => loadHTMLTable(data['data']['rows']));
}