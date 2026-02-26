//Get all needed DOM elements
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const greeting = document.getElementById("greeting");
const attendeeCount = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");
const checkInButton = document.getElementById("checkInBtn");
const waterCount = document.getElementById("waterCount");
const zeroCount = document.getElementById("zeroCount");
const powerCount = document.getElementById("powerCount");
const attendeeList = document.getElementById("attendeeList");

//Track attendance
let count = 0;
const maxCount = 50;
const storageKey = "intelEventCheckInState";
let attendees = [];

function toNumber(value) {
  const parsedValue = Number(value);

  if (Number.isNaN(parsedValue)) {
    return 0;
  }

  return parsedValue;
}

function getTeamDisplayName(teamCode) {
  if (teamCode === "water") {
    return "Team Water Wise";
  }

  if (teamCode === "zero") {
    return "Team Net Zero";
  }

  return "Team Renewables";
}

function updateProgress() {
  const percentage = Math.round((count / maxCount) * 100) + "%";
  attendeeCount.textContent = count;
  progressBar.style.width = percentage;
}

function renderAttendeeList() {
  attendeeList.innerHTML = "";

  if (attendees.length === 0) {
    const emptyItem = document.createElement("li");
    emptyItem.textContent = "No attendees checked in yet.";
    emptyItem.className = "attendee-empty";
    attendeeList.appendChild(emptyItem);
    return;
  }

  let index = 0;
  while (index < attendees.length) {
    const attendee = attendees[index];
    const item = document.createElement("li");
    item.className = "attendee-item";
    item.textContent = `${attendee.name} — ${attendee.teamName}`;
    attendeeList.appendChild(item);
    index++;
  }
}

function saveState() {
  const checkInState = {
    count: count,
    teams: {
      water: toNumber(waterCount.textContent),
      zero: toNumber(zeroCount.textContent),
      power: toNumber(powerCount.textContent),
    },
    attendees: attendees,
  };

  localStorage.setItem(storageKey, JSON.stringify(checkInState));
}

function setFormAvailability() {
  const isFull = count >= maxCount;
  nameInput.disabled = isFull;
  teamSelect.disabled = isFull;
  checkInButton.disabled = isFull;
}

function getWinningTeamName() {
  const waterTotal = toNumber(waterCount.textContent);
  const zeroTotal = toNumber(zeroCount.textContent);
  const powerTotal = toNumber(powerCount.textContent);

  if (waterTotal >= zeroTotal && waterTotal >= powerTotal) {
    return "Team Water Wise";
  }

  if (zeroTotal >= waterTotal && zeroTotal >= powerTotal) {
    return "Team Net Zero";
  }

  return "Team Renewables";
}

function showGoalReachedMessage() {
  const winningTeamName = getWinningTeamName();
  greeting.textContent = `🎉 Goal reached! ${winningTeamName} wins the check-in challenge!`;
  greeting.classList.add("success-message");
  greeting.style.display = "block";
}

function loadSavedState() {
  try {
    const savedState = localStorage.getItem(storageKey);

    if (!savedState) {
      updateProgress();
      renderAttendeeList();
      return;
    }

    const parsedState = JSON.parse(savedState);
    const savedTeams = parsedState.teams || {};

    count = toNumber(parsedState.count);
    waterCount.textContent = toNumber(savedTeams.water);
    zeroCount.textContent = toNumber(savedTeams.zero);
    powerCount.textContent = toNumber(savedTeams.power);
    attendees = Array.isArray(parsedState.attendees)
      ? parsedState.attendees
      : [];
  } catch (error) {
    localStorage.removeItem(storageKey);
    count = 0;
    waterCount.textContent = 0;
    zeroCount.textContent = 0;
    powerCount.textContent = 0;
    attendees = [];
  }

  updateProgress();
  renderAttendeeList();
  setFormAvailability();

  if (count >= maxCount) {
    showGoalReachedMessage();
  }
}

loadSavedState();

//handle form submission
form.addEventListener("submit", function (event) {
  event.preventDefault();

  if (count >= maxCount) {
    greeting.textContent =
      "🚫 Check-in is closed. The event is now at full capacity (50/50).";
    greeting.classList.add("success-message");
    greeting.style.display = "block";
    return;
  }

  //Get values from form
  const name = nameInput.value.trim();
  const team = teamSelect.value;
  const teamName = getTeamDisplayName(team);

  console.log(name, teamName);

  if (!name || !team) {
    return;
  }

  //Increment count
  count++;
  console.log("Total check-ins: " + count);

  updateProgress();

  // Update team counter
  const teamCounter = document.getElementById(team + "Count");
  teamCounter.textContent = toNumber(teamCounter.textContent) + 1;

  attendees.push({
    name: name,
    team: team,
    teamName: teamName,
  });

  renderAttendeeList();

  //Show welcome message
  const message = `🎉 Welcome, ${name} from ${teamName}!`;
  greeting.textContent = message;
  greeting.classList.add("success-message");
  greeting.style.display = "block";
  console.log(message);

  saveState();

  if (count >= maxCount) {
    setFormAvailability();
    showGoalReachedMessage();
  }

  form.reset();
});

