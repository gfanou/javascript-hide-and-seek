
/**
 * This function runs when the player is done hiding
 * rabbits and clicks the "Seek" button.
 *
 * This is an old version that doesn't use an interval
 *
 * As such, it runs very quickly and doesn't allow
 * for any jQuery animation to play
 */
function seek() {
    // Disable randomize button
    //$("#randomizeButton").prop("disabled", true);

    // Remove the rabbit visible class so you
    // can't tell where you hid the rabbits
    $(".hidingSpot").removeClass("rabbitVisible");

    while (hiddenRabbits > 0) {
        // To prevent the fox from searching where
        // he's already been, randomly pick a square
        // until one is found without the "fox" class
        do {
            // pick a random square
            var randomSquare = Math.floor(Math.random() * 81) + 1;
            var theSpan = $("#" + randomSquare);
        } while (theSpan.hasClass("fox"));

        // Tag this hiding place as having been searched
        // by the fox
        theSpan.addClass("fox");

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

    }

    $("p").text("It took the fox " + searchCounter + " searches to find all the rabbits!");

}