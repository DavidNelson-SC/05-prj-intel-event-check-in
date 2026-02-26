//Get all needed DOM elements
const form = document.getElementById('checkInForm');
const nameInput = document.getElementById('attendeeName');
const teamSelect = document.getElementById('teamSelect');

//Track attendance
let count = 0;
const maxCount = 50;

//handle form submission
form.addEventListener("submit", function(event) {
    event.preventDefault(); 

    //Get values from form
    const name = nameInput.value;
    const team = teamSelect.value;
    const teamName = teamSelect.options[0].text;

    console.log(name, teamName);

    //Increment count
    count++
    console.log("Total check-ins: " + count);

    //Update progress bar
    const percentage = Math.round((count/maxCount) * 100) + "%";
    console.log('Progress: ' + percentage);

    // Update team counter
    const teamCounter = document.getElementById(team + "Count");
    teamCounter.textContent = parseInt(teamCounter.textContent) + 1;

    //Show welcome message
    const message = `🎉Welcome, ${name} from ${teamName}`;
    console.log(message);

    form.reset();
});

