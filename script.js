//Get all needed DOM elements
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const greeting = document.getElementById("greeting");
const attendeeCount = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");
const attendeeList = document.getElementById("attendeeList");
const waterCount = document.getElementById("waterCount");
const zeroCount = document.getElementById("zeroCount");
const powerCount = document.getElementById("powerCount");

//Track attendance
const maxCount = 50;
const storageKey = "intelCheckInData";

const teamLabels = {
  water: "Team Water Wise",
  zero: "Team Net Zero",
  power: "Team Renewables",
};

let attendanceData = loadAttendanceData();

renderAll();

//handle form submission
form.addEventListener("submit", function (event) {
  event.preventDefault();

  //Get values from form
  const name = nameInput.value.trim();
  const team = teamSelect.value;
  const teamName = teamSelect.options[teamSelect.selectedIndex].text;

  if (!name || !team) {
    return;
  }

  //Increment totals
  attendanceData.count = attendanceData.count + 1;
  attendanceData.teams[team] = attendanceData.teams[team] + 1;
  attendanceData.attendees.push({
    name: name,
    team: team,
    teamName: teamName,
  });

  saveAttendanceData();
  renderAll();

  //Show greeting and celebration when goal is reached
  if (attendanceData.count >= maxCount) {
    const winningTeam = getWinningTeam();
    greeting.textContent = `🎉 Goal reached! ${winningTeam.name} is leading with ${winningTeam.count} attendees.`;
  } else {
    greeting.textContent = `✅ Welcome, ${name} from ${teamName}!`;
  }

  greeting.style.display = "block";
  greeting.classList.add("success-message");

  form.reset();
});

function renderAll() {
  renderTotals();
  renderAttendeeList();

  if (attendanceData.count >= maxCount) {
    const winningTeam = getWinningTeam();
    greeting.textContent = `🎉 Goal reached! ${winningTeam.name} is leading with ${winningTeam.count} attendees.`;
    greeting.style.display = "block";
    greeting.classList.add("success-message");
  }
}

function renderTotals() {
  attendeeCount.textContent = attendanceData.count;
  waterCount.textContent = attendanceData.teams.water;
  zeroCount.textContent = attendanceData.teams.zero;
  powerCount.textContent = attendanceData.teams.power;

  const percentage = Math.min(
    Math.round((attendanceData.count / maxCount) * 100),
    100,
  );
  progressBar.style.width = `${percentage}%`;
}

function renderAttendeeList() {
  attendeeList.innerHTML = "";

  if (attendanceData.attendees.length === 0) {
    const emptyItem = document.createElement("li");
    emptyItem.className = "attendee-empty";
    emptyItem.textContent = "No attendees checked in yet.";
    attendeeList.appendChild(emptyItem);
    return;
  }

  for (let i = 0; i < attendanceData.attendees.length; i++) {
    const attendee = attendanceData.attendees[i];
    const attendeeItem = document.createElement("li");
    attendeeItem.className = "attendee-item";
    attendeeItem.textContent = `${attendee.name} — ${attendee.teamName}`;
    attendeeList.appendChild(attendeeItem);
  }
}

function getWinningTeam() {
  let winningTeamKey = "water";
  let winningTeamCount = attendanceData.teams.water;

  if (attendanceData.teams.zero > winningTeamCount) {
    winningTeamKey = "zero";
    winningTeamCount = attendanceData.teams.zero;
  }

  if (attendanceData.teams.power > winningTeamCount) {
    winningTeamKey = "power";
    winningTeamCount = attendanceData.teams.power;
  }

  return {
    key: winningTeamKey,
    name: teamLabels[winningTeamKey],
    count: winningTeamCount,
  };
}

function saveAttendanceData() {
  localStorage.setItem(storageKey, JSON.stringify(attendanceData));
}

function loadAttendanceData() {
  const defaultData = {
    count: 0,
    teams: {
      water: 0,
      zero: 0,
      power: 0,
    },
    attendees: [],
  };

  const savedData = localStorage.getItem(storageKey);

  if (!savedData) {
    return defaultData;
  }

  try {
    const parsedData = JSON.parse(savedData);

    if (
      !parsedData ||
      typeof parsedData.count !== "number" ||
      !parsedData.teams ||
      !Array.isArray(parsedData.attendees)
    ) {
      return defaultData;
    }

    return {
      count: parsedData.count,
      teams: {
        water: Number(parsedData.teams.water) || 0,
        zero: Number(parsedData.teams.zero) || 0,
        power: Number(parsedData.teams.power) || 0,
      },
      attendees: normalizeAttendees(parsedData.attendees),
    };
  } catch (error) {
    return defaultData;
  }
}

function normalizeAttendees(savedAttendees) {
  const normalizedAttendees = [];

  for (let i = 0; i < savedAttendees.length; i++) {
    const attendee = savedAttendees[i];
    const team = attendee.team;

    if (!attendee.name || !teamLabels[team]) {
      continue;
    }

    normalizedAttendees.push({
      name: attendee.name,
      team: team,
      teamName: teamLabels[team],
    });
  }

  return normalizedAttendees;
}

