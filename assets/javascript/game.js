$(document).ready(function() {

    //global variables, array initialization
    let dogs = ["Labrador", "Beagle", "German_Shepherd", "Dalmation", "Collie", "Weimaraner", "Puppies"];

    //functions and methods
    //function to render buttons for each dog in the array
    function renderButtons() {
        console.log("render button loop");
        $("#buttons-view").empty();
        for (let i = 0; i < dogs.length; i++) {
            let a = $("<button data-dog=" + dogs[i] + " type='button' class='btn btn-info'>");
            a.text(dogs[i]);
            $("#buttons-view").append(a);
        };
        addListeners();
    };

    //function to add dog to dog array from form input and call renderButtons function
    $("#add-dog").on("click", function(event) {
        console.log("Add a dog loop");
        // event.preventDefault() prevents the form from trying to submit itself.
        event.preventDefault();
        // This line will grab the text from the input box
        let dog = $("#dog-input").val().trim();
        if (!dogs.includes(dog) && (dog !== "")) {
            console.log("new dog = " + dog);
            // The dog from the textbox is then added to the dog array
            dogs.push(dog);
            console.log(dogs);
            // calling renderButtons which regenerates buttons from array
            renderButtons();
        } else {
            alert("No dog entered or that dog breed/type already exists!");
        }
        $("#dog-input").val("");
        $("#dog-input").text("Enter dog breed...");
    });

    //function to add click listeners to dynamically created elements for play/pause and gif gen
    function addListeners() {

        // insert code to create and append new gif elements
        $("button").on("click", function() { //function to return gifs upon button click
            const dog = $(this).attr("data-dog"); // creates var to hold data-dog value of the btn clicked by user and returned by ajax call
            console.log("Dog button clicked: " + dog);
            const queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
                dog + "&api_key=BkaUZZWcFij6J7AoQj3WtPb1R2p9O6V9&limit=10"; //ajax call to giphy with dog value.  Limit to 10 (via api)
            $.ajax({
                url: queryURL,
                method: "GET"
            }).then(function(response) {
                let results = response.data; //var to hold ajax response data
                console.log(response);
                $("#dog-view").empty(); //clears the div from any existing gifs
                for (let i = 0; i < results.length; i++) { //for length of results (10), create divs to hold and display ratings and images 
                    const gifDiv = $("<div>");
                    const rating = results[i].rating;
                    const p = $("<p>").text("Rating: " + rating);
                    const dogImage = $("<img>");
                    const dogImageStillUrl = results[i].images.fixed_height_still.url;
                    const dogImageAnimateUrl = results[i].images.fixed_height.url;
                    dogImage.attr("src", results[i].images.fixed_height_still.url); //up date img src with returned value
                    dogImage.attr("data-still", dogImageStillUrl);
                    dogImage.attr("data-animate", dogImageAnimateUrl);
                    dogImage.attr("data-state", "still");
                    console.log("dog gif element created");
                    dogImage.addClass("gif");
                    // dogImage.attr("id", ("dogBtn-" + i));
                    // dogImage.attr("id", ("dogBtn-" + i));
                    gifDiv.prepend(p); //add rating to div
                    gifDiv.append(dogImage); //add image to div
                    $("#dog-view").prepend(gifDiv); //add completed div to placeholder in html
                };
            });
        });
        // addListeners();
        $("div").on("click ", ".gif", function() { //click on any dynamically generated element with class gif to play or pause
            console.log("Animate loop!");
            let state = $(this).attr("data-state");
            console.log("Loop entry, State = " + state);
            if (state === "still") {
                console.log("still to animate loop");
                $(this).attr("src", $(this).attr("data-animate"));
                $(this).attr("data-state", "animate");
                console.log("state now animate");
            } else {
                console.log("animate to still loop");
                $(this).attr("src", $(this).attr("data-still"));
                $(this).attr("data-state", "still");
                console.log("state now still");
            };
            console.log("ready return");
            return;
        });

    };
    //function calls
    renderButtons();
    console.log("End of js script");
});