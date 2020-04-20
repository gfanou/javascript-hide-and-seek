$(init);

// Constants for the grid dimensions
const ROWS = 9;
const COLS = 9;

// Constant for how many milliseconds the fade in/out animation should take
const FADE_MILLS = 350;

// How many hiding places the fox has searched
var searchCounter = 0;

// The number of rabbits that are still hidden
// and the number the fox has found
var hiddenRabbits = 0, foundRabbits = 0;

// The number of random rabbits left to hide
var rabbitsToHide = 0;

// The interval that makes the fox search every X milliseconds
var searchInterval;


function init() {
    // Generate HTML for the board
    createGameBoard();

    // Make all game board squares clickable
    $(".hidingSpot").click(hideRabbit);
    // Add function to the Randomize button
    $("#randomizeButton").click(randomlyHideRabbits);
    // Add function to the Seek button
    $("#seekButton").click(seekWithInterval);

}

/**
 * This function runs when the player clicks on a span
 * to hide a rabbit.
 */
function hideRabbit() {

    // if there isn't already a rabbit here
    if (!$(this).hasClass("rabbit")) {

        // add one to hidden rabbits
        hiddenRabbits++;

        // ... and put the new value in the input box
        $("#hidden").val(hiddenRabbits);

        // give this span the "rabbit" class as a marker
        // and the "rabbitVisible" class for the background
        // image
        $(this).addClass("rabbit").addClass("rabbitVisible");
    }
}


/**
 * This function runs when the player is done hiding
 * rabbits and clicks the "Seek" button
 *
 * It kicks off the search process by starting an
 * interval that repeatedly runs the foxSearch()
 * function
 */
function seekWithInterval() {
    // Remove the rabbitVisible class so you
    // can't tell where you hid the rabbits
    $(".hidingSpot").removeClass("rabbitVisible");

    // Start an interval to make the fox search
    searchInterval = setInterval(foxSearch, FADE_MILLS * 5);
}


/**
 * Too busy to manually hide your own rabbits? This function has you covered.
 */
function randomlyHideRabbits() {
    // Disable the seek button until all rabbits are hidden
    // Doesn't seem to be working, though, so commented out
    //$("#seekButton").prop("disabled", true);

    // How many rabbits should be randomly hidden, minimum of 1,
    // maximum of half the available hiding spots
    rabbitsToHide = Math.floor(Math.random() * (ROWS * COLS) / 2) + 1;

    // Hide the first rabbit. The clickRandomSpan() function will call itself if more rabbits need
    // to be hidden
    clickRandomSpan();
}


function clickRandomSpan() {
    // Choose a random valid span id
    var randomSpanId = getRandomSquareId();

    // Programmatically click the span, which will call the hideRabbit()
    // function just as if the player had clicked it
    $(randomSpanId).click();

    // If we are randomly hiding rabbits and there are still more rabbits
    // left to hide...
    if (hiddenRabbits < rabbitsToHide) {
        // ...call this function again 200 milliseconds from now
        setTimeout(clickRandomSpan, 100);
    } else {
        // Enable the seek button
        // Commented out because button enabling/disabling isn't working right
        //$("#seekButton").removeProp("disabled");
    }
}


/**
 * Invoked by the interval every X milliseconds to perform the fox's search action
 */
function foxSearch() {
    // To prevent the fox from searching where
    // he's already been, randomly pick a square
    // until one is found without the "fox" class
    do {
        // This function returns a random ID (like "#42")
        var randomSquareId = getRandomSquareId();
        // Select the span using its ID
        var theSpan = $(randomSquareId);
    } while (theSpan.hasClass("fox"));

    // Put the fox graphic in the span
    theSpan.addClass("fox");

    // Fade the span to half transparency twice, then reveal the result of the search
    theSpan.fadeTo(FADE_MILLS, .5).fadeTo(FADE_MILLS, 1).fadeTo(FADE_MILLS, .5).fadeTo(FADE_MILLS, 1, 0, setTimeout(function () {
        testHidingPlace(theSpan);
    }, FADE_MILLS * 4));
}

/**
 * Tests whether a rabbit is hiding
 */
function testHidingPlace(theSpan) {
    // If there is a rabbit here...
    if (theSpan.hasClass("rabbit")) {

        // Subtract from rabbits left to find
        hiddenRabbits--;

        // Update "hidden rabbits" box
        $("#hidden").val(hiddenRabbits);

        // Add to rabbits found
        foundRabbits++;

        // Update the "found rabbits" box
        $("#found").val(foundRabbits);

        // turn the square red
        theSpan.addClass("rabbitDoom");
    }

    // Increment the total number of searches
    searchCounter++;

    // If all the rabbits are found
    if (hiddenRabbits == 0) {
        // Stop running the search function
        clearInterval(searchInterval);

        // Put total searches on the screen
        $("p").text("It took the fox " + searchCounter + " searches to find all the rabbits!");
    }

}


/**
 * Initializes the game board on page load
 */
function createGameBoard() {
    var squareCounter = 1;

    // Make many rows
    for (var row = 1; row <= ROWS; row++) {

        // Make a row of squares
        for (var col = 1; col <= COLS; col++) {

            // Make a square
            var newSpan = $("<span>");

            // Add a non-breaking space as its text
            newSpan.html("&nbsp;");

            // Give it an ID of 1 through 81
            newSpan.attr("id", squareCounter);

            // Give it a class of "hidingSpot"
            newSpan.addClass("hidingSpot");

            // 50/50 chance of getting bush1 or bush2
            // style
            var random = Math.random();
            if (random < .5) {
                newSpan.addClass("bush1");
            } else {
                newSpan.addClass("bush2");
            }

            // Add one to the counter
            squareCounter++;

            // Append it as the last child of the
            // div with ID "gameBoard"
            $("#gameBoard").append(newSpan);

        }

        // Add a break tag to end the row
        $("#gameBoard").append("<br>");

    }
}

/**
 * This utility function picks a number between 1 and the
 * biggest square ID, then concatenates the chosen number
 * with the "#" symbol to form a jQuery ID selector
 */
function getRandomSquareId() {
    return "#" + (Math.floor(Math.random() * (ROWS * COLS)) + 1);
}