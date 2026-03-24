let teamA = JSON.parse(localStorage.getItem("teamA")) || []
let teamB = JSON.parse(localStorage.getItem("teamB")) || []

let teamAName = localStorage.getItem("teamAName") || "Team A"
let teamBName = localStorage.getItem("teamBName") || "Team B"


function save() {
    localStorage.setItem("teamA", JSON.stringify(teamA))
    localStorage.setItem("teamB", JSON.stringify(teamB))

    localStorage.setItem("teamAName", teamAName)
    localStorage.setItem("teamBName", teamBName)
}


function renameTeam(team) {
    if (team === "A") {
        const val = document.getElementById("teamAInput").value
        if (val) teamAName = val
    }
    if (team === "B") {
        const val = document.getElementById("teamBInput").value
        if (val) teamBName = val
    }
    save()
    renderHome()
}

function renderPlayer(p, team) {
    const li = document.createElement("li")
    li.className = "player"

    li.innerHTML = `
    <span onclick="goToPlayer('${p.username}')">${p.username}</span>
    <button onclick="removePlayer('${team}','${p.username}')">
        Remove
    </button>
    <button onclick="switchTeam('${team}','${p.username}')">
        Switch
    </button>
    `

    return li
}


function renderHome() {
    document.getElementById("teamAName").textContent = teamAName
    document.getElementById("teamBName").textContent = teamBName
    const listA = document.getElementById("teamAList")
    const listB = document.getElementById("teamBList")
    listA.innerHTML = ""
    listB.innerHTML = ""
    
    teamA.forEach(p => {
        listA.appendChild(renderPlayer(p, "A"))
    })
    
    teamB.forEach(p => {
        listB.appendChild(renderPlayer(p, "B"))
    })
}


function goToPlayer(username) {
    localStorage.setItem("selectedPlayer", username)
    window.location.href = "playerinfo.html"
}


function switchTeam(team, username) {

    if (team === "A" && teamB.length < 5) {
        const player = teamA.find(p => p.username === username)
        teamA = teamA.filter(p => p.username !== username)
        teamB.push(player)
    } 
    else if (team === "B" && teamA.length < 5) {
        const player = teamB.find(p => p.username === username)
        teamB = teamB.filter(p => p.username !== username)
        teamA.push(player)
    } 
    else {
        alert("The other team is full")
    }
    
    save()
    renderHome()
}


function removePlayer(team, username) {
    if (team === "A") {
        teamA = teamA.filter(p => p.username !== username)
    }
    if (team === "B") {
        teamB = teamB.filter(p => p.username !== username)
    }
    save()
    renderHome()

}


function usernameExists(username) {
            teamA.some(p => p.username === username) ||
            teamB.some(p => p.username === username)
}


function renderAddPlayer() {

    const teamSelect = document.getElementById("teamSelect")
    teamSelect.innerHTML = `
        <option value="A" ${teamA.length >= 5 ? "disabled" : ""}>
        ${teamAName}
        </option>

        <option value="B" ${teamB.length >= 5 ? "disabled" : ""}>
        ${teamBName}
        </option>
        `

    loadEuropeanCountries();
    document.getElementById("playerForm").addEventListener("submit", e => {

        e.preventDefault()
        const username = document.getElementById("username").value
        if (usernameExists(username)) {
            document.getElementById("error").textContent = "Username already exists"
            return
        }
        const player = {
            username,
            firstname: document.getElementById("firstname").value,
            lastname: document.getElementById("lastname").value,
            age: document.getElementById("age").value,
            country: document.getElementById("country").value,
            ranking: document.getElementById("ranking").value

        };
        const team = document.getElementById("teamSelect").value
        if (team === "A") {
            teamA.push(player)
        }
        if (team === "B") {
            teamB.push(player)
        }
        save()
        window.location.href = "index.html"
    })
}

function renderPlayerInfo() {

    const username = localStorage.getItem("selectedPlayer")

    const player = teamA.find(p => p.username === username)

    const profile = document.getElementById("profile");

    profile.innerHTML = `
<div class="profile">
<h2>${player?.username}</h2>
<p><b>Name:</b> ${player?.firstname} ${player?.lastname}</p>
<p><b>Age:</b> ${player?.age}</p>
<p><b>Country:</b> ${player?.country}</p>
<p><b>Ranking:</b> ${player?.ranking}</p>
<br>
<button onclick="window.location='home.html'">
Back
</button>

</div>

`

}

function editPlayer(username) {
    let player = teamA.find(p => p.username === username) ||
                 teamB.find(p => p.username === username);

    const profile = document.getElementById("profile");

    profile.innerHTML = `
        <div class="profile">
            <h2>Edit Player</h2>

            <p><b>Username:</b></p>
            <input id="editUsername" value="${player.username}">

            <p><b>First name:</b></p>
            <input id="editFirstname" value="${player.firstname}">

            <p><b>Last name:</b></p>
            <input id="editLastname" value="${player.lastname}">

            <p><b>Age:</b></p>
            <input id="editAge" type="number" value="${player.age}">

            <p><b>Country:</b></p>
            <input id="editCountry" value="${player.country}">

            <p><b>Ranking:</b></p>
            <select id="editRanking">
                <option ${player.ranking === "Iron" ? "selected" : ""}>Iron</option>
                <option ${player.ranking === "Bronze" ? "selected" : ""}>Bronze</option>
                <option ${player.ranking === "Silver" ? "selected" : ""}>Silver</option>
                <option ${player.ranking === "Gold" ? "selected" : ""}>Gold</option>
                <option ${player.ranking === "Diamond" ? "selected" : ""}>Diamond</option>
            </select>

            <br><br>
            <button onclick="updatePlayer('${username}')">Update</button>
            <button onclick="renderPlayerInfo()">Cancel</button>
        </div>
    `;
}


function updatePlayer(originalUsername) {

    const newUsername = document.getElementById("editUsername").value;

    let team = teamA.some(p => p.username === originalUsername) ? "A" : "B";
    let list = team === "A" ? teamA : teamB;
    let other = team === "A" ? teamB : teamA;

    let player = list.find(p => p.username === originalUsername);

    if (other.some(p => p.username === newUsername)) {
        alert("Username already exists in the other team");
        return;
    }

    player.username = newUsername;
    player.firstname = document.getElementById("editFirstname").value;
    player.lastname = document.getElementById("editLastname").value;
    player.age = document.getElementById("editAge").value;
    player.country = document.getElementById("editCountry").value;
    player.ranking = document.getElementById("editRanking").value;

    save();
    renderPlayerInfo();
}