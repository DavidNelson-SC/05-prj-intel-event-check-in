//Get all needed DOM elements
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const greeting = document.getElementById("greeting");
const attendeeCount = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");
const checkInButton = document.getElementById("checkInBtn");

//Track attendance
let count = 0;
const maxCount = 50;

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
  const selectedTeamOption = teamSelect.options[teamSelect.selectedIndex];
  const teamName = selectedTeamOption.text;

  console.log(name, teamName);

  if (!name || !team) {
    return;
  }

  //Increment count
  count++;
  console.log("Total check-ins: " + count);

  //Update progress bar
  const percentage = Math.round((count / maxCount) * 100) + "%";
  console.log("Progress: " + percentage);
  attendeeCount.textContent = count;
  progressBar.style.width = percentage;

  // Update team counter
  const teamCounter = document.getElementById(team + "Count");
  teamCounter.textContent = parseInt(teamCounter.textContent) + 1;

  //Show welcome message
  const message = `🎉 Welcome, ${name} from ${teamName}!`;
  greeting.textContent = message;
  greeting.classList.add("success-message");
  greeting.style.display = "block";
  console.log(message);

  if (count >= maxCount) {
    nameInput.disabled = true;
    teamSelect.disabled = true;
    checkInButton.disabled = true;
  }

  form.reset();
});

