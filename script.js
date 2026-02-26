//Get all needed DOM elements
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const greeting = document.getElementById("greeting");
const attendeeCount = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");
const attendeeList = document.getElementById("attendeeList");

//Track attendance
let count = 0;
const maxCount = 50;
const checkedInAttendees = [];

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

  checkedInAttendees.push(name);

  //Increment count
  count++;
  attendeeCount.textContent = count;

  //Update progress bar
  const percentage = Math.min(Math.round((count / maxCount) * 100), 100);
  progressBar.style.width = `${percentage}%`;

  // Update team counter
  const teamCounter = document.getElementById(team + "Count");
  teamCounter.textContent = parseInt(teamCounter.textContent) + 1;

  //Show welcome message and add attendee to list
  const message = `🎉 Welcome, ${name} from ${teamName}!`;
  greeting.textContent = message;

  const attendeeListItem = document.createElement("li");
  attendeeListItem.textContent = `${name} — ${teamName}`;
  attendeeList.appendChild(attendeeListItem);

  form.reset();
});

