console.log("Javascript Line 1");
var navBtnFlag = false;
// function to show and hide contents at HOME/reload
function displayHome() {
    // contents to show
    $("#carouselExampleIndicators").show();
    $("#random-recipes").show();

    // contents to hide
   
    $("#single-recipe-result").hide();
    $("#random-video").hide();
    $("#nav-button").hide();
};

// function to show and hide contents when List is displayed
function displayList() {
    // contents to show
    $("#recipe-items").show();
    $("#random-recipes").show();

    $("#result-list").show();

    // contents to hide
    $("#carouselExampleIndicators").hide();
    $(".olgas-tip-cards").hide();    
    $("#random-video").hide();
    $("#single-recipe-result").hide();
    $("#carouselExampleIndicators").hide();
};

// function to show and hide contents when specific Recipe is displayed
function displayRecipe() {
    // scroll page to top
    $('html,body').scrollTop(0);

    // contents to show
    $("#single-recipe-result").show();
    $("#random-video").show();

    // contents to hide
    $("#carouselExampleIndicators").hide();
    $(".olgas-tip-cards").hide();
    $("#recipe-items").hide();
    $("#random-recipes").hide();
    $("#result-list").hide();
    $("#carouselExampleIndicators").hide();

    // recipe contents show
    $("#single-recipe-result").show();
    $("#random-video").show();
    if (navBtnFlag === true) {
        $("#nav-button").show();
    }
};

$("#nav-button").on("click", function(event) {
    displayList();
});



// click event for search box to call searchAPI via searchTerm
$("#search-button").on("click", function(event) {
    // hide carousel upon search
    

    // preventing page refresh upon click
    event.preventDefault();
    
    var searchTerm = $("#input-search").val();
    console.log(searchTerm);
    // Here we run our AJAX call to Yummly API
    if (searchTerm === ""){
        alert("Please enter a \"recipe name\" or \"ingredient\"");
    } else {
        searchAPI(searchTerm);
    }
});

// pull data from API via search
var searchAPI = function(searchTerm) {
    // API credentials
    var appID = "c264894e";
    var apiKey = "f5984f792fe199d55811bb9a14dd9e5c";
    // Here we are building the URL we need to query the database
    var queryURL = "https://api.yummly.com/v1/api/recipes?_app_id=" + appID + "&_app_key=" + apiKey + "&q=" + searchTerm;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        console.log(queryURL);
        createRow(response);
    });
};
// The createRow function takes data returned by API and appends the table data to the tbody
var createRow = function(response) {
    $("#insert-row").empty();
    displayList();
    // create a new table row element
    for (var i = 0; i < 10; i++) {
        
        var tRow = $("<tr>");
        var recipeTitle = $("<td>").text(response.matches[i].recipeName);
        recipeTitle.attr("class", "single-title");
        var img = hdImgURL(response.matches[i].smallImageUrls[0]);
        var image = $("<img>").attr("src", img);
        image.attr("class", "single-img");
        var imageTD = $("<td>").append(image);
        var recipeID = response.matches[i].id;
        tRow.addClass("searchResult");
        tRow.attr("IDdata", recipeID);
        var ratingText = $("<td>").text("rating: " + response.matches[i].rating);
        tRow.append(recipeTitle, imageTD);

        $("#insert-row").append(tRow);
    }
    navBtnFlag = true;
    
};
// click event when a row from the result is clicked
$("#result-list").on("click", "tr", function(event) {
    // prevent page from refreshing
    event.preventDefault();
    // empty contents before displaying new content
    
    // $("#result-table").empty();
    
    var recipeID = $(this).attr("IDdata");
    console.log(recipeID + "from click event");
    getAPI(recipeID);

});

// click event for drop-down menu items
$(".dropdown-menu").on("click", "a", function(event) {
    // prevent page from refreshing
    event.preventDefault();
    
    //Create variable to read and store the clicked category/cuisine
    var searchTerm = $(this).attr("data");
    searchAPI(searchTerm);
});

// click event for random recipe items
$("#random-recipes").on("click", "img", function(event) {
    // prevent page from refreshing
    event.preventDefault();

    var recipeID = $(this).attr("data");
    console.log(recipeID);
    getAPI(recipeID);

});

// click event for carousel items
$(".carousel-item").on("click", "img", function(event) {
    // prevent page from refreshing
    event.preventDefault();
    var recipeID = $(this).attr("dataID");
    console.log(recipeID);
    console.log("carousel image clicked");
    getAPI(recipeID);

});

// pull data from API via GET call to access specific recipe item
var getAPI = function(recipeID) {
    

    // API credentials
    var appID = "c264894e";
    var apiKey = "f5984f792fe199d55811bb9a14dd9e5c";
    // Here we are building the URL we need to query the database
    var queryURL = "https://api.yummly.com/v1/api/recipe/" + recipeID + "?_app_id=" + appID + "&_app_key=" + apiKey;
    
    // Here we run our AJAX GET call to Yummly API
    $.ajax({
    url: queryURL,
    method: "GET"
    })
    // We store all of the retrieved data inside of an object called "response"
    .then(function(response) {
        // console.log(recipeID + "from getAPI function");
        // console.log(queryURL);
        // console.log(response);
        createRowGetAPI(response);
        
    });
};
// creating data to display for specific recipe
var createRowGetAPI = function(response) {
    console.log(response.ingredientLines);
    //event.preventDefault();
    $("#search-result4").empty();
    $("#search-result1").empty();
    $("#search-result2").empty();
    $("#search-result3").empty();
    displayRecipe();
    // $("#random-recipes").empty();
    var recipeName = $("<tr>").text(response.name);

    recipeName.attr("id", "single-recipe-name");    
    var category = $("<tr>").text("Recipe category: " + response.attributes.course);
    console.log(response.attributes.course);
    category.attr("id", "single-recipe-category");
    var cookTime = $("<tr>").text("Cooking time: " + response.totalTime);
    cookTime.attr("id", "single-recipe-cooktime");
    //for (var i = 0; i < response.ingredientLines.length; i++) {
    var ingredients = response.ingredientLines.map((ingredient, index) => {
        return $("<tr>").text(index+1 + "." + " " + ingredient);
    });
   console.log(ingredients);   
    //}
    // var ingredients = $("<tr>").text("Ingredients: " + response.ingredientLines);
    // ingredients.attr("id", "single-recipe-ingredients");
    var rating = $("<tr>").text("Rating of the recipe: " + response.rating);
    rating.attr("id", "single-recipe-rating");
    var urllink = response.source.sourceRecipeUrl;
    console.log(urllink);
    //var source = $("<tr>").text(response.source.sourceRecipeUrl);
    var thelink = $('<a>',{
        id: "urllink",
        text: 'Click here to see the instructions',
        title: 'instructions for recipe',
        href: urllink,
        target: "_blank"
    }).appendTo('#search-result4');
    
    var serving = $("<tr>").text("The meal will serve: " + response.numberOfServings);
    serving.attr("id", "single-recipe-serving");

    // recipeName.attr("id", "recipe-name");
    // var cookTime = $("<tr>").text(response.totalTime);
    // var ingredients = $("<tr>").text(response.ingredientLines);
    // var rating = $("<tr>").text(response.rating);
    // var category = $("<tr>").text(response.attributes.course[0]);
    // var urlLink = response.source.sourceRecipeUrl;
    // var source = $("<tr>").text(response.source.sourceRecipeUrl);
    // var serving = $("<tr>").text(response.numberOfServings);

    var image = $("<img>").attr("src", response.images[0].hostedLargeUrl);
    image.attr("id", "single-recipe-image");
    // var lineBreak = $("<tr>").text(" ");
    

    // $("#search-result").append(image, recipeName, category, cookTime,  rating, serving, ingredients, source);
    $("#search-result1").append(image);
    $("#search-result2").append(recipeName, category, cookTime, rating, serving);
    $("#search-result3").append("Ingredients: ", ingredients);

    // console.log(cookTime);
    // console.log(recipeName);
    // console.log(ingredients);

    // $("#search-result").append(image, recipeName, cookTime, ingredients, rating, category, source, serving);
    // console.log(cookTime);
    // console.log(recipeName);

    ///////// display youtube video /////////////
    $("#random-video").empty();
    
    
    var youtubeSearchTerm = response.name + " recipe";
    console.log(youtubeSearchTerm);
    
    var queryURL = "https://www.youtube.com/embed/?listType=search&list=" + youtubeSearchTerm + "&loop=50";
    
    var frame = $("<iframe class=embed-responsive-item>").attr("src", queryURL );

    $("#random-video").append(frame);

};

// display carousel images from Yummly API
window.onload = function() {

    displayHome();
    
    var appID = "c264894e&";
    //
    var apiKey = "f5984f792fe199d55811bb9a14dd9e5c";
    var categories = ["main dishes", "soup", "desserts", "side dishes", "snacks", "appetizers"];
    var searchTerm = categories[Math.floor(Math.random() * categories.length)];
    var searchRandom = categories[Math.floor(Math.random() * categories.length)];
    // Here we are building the URL we need to query the database
    var queryURL = "https://api.yummly.com/v1/api/recipes?_app_id=" +appID+ "_app_key=" + apiKey +"&q="+searchTerm;
    var queryURL2 = "https://api.yummly.com/v1/api/recipes?_app_id=" +appID+ "_app_key=" + apiKey +"&q="+searchRandom;

    var arrayRandomRecipesNames = [];
    var arrayRandomRecipes = [];
    var arrayRandom = [];
    var arrayRecipeIDs = [];

    // Here we run our AJAX call to the Yummly API
    $.ajax({
    url: queryURL,
    method: "GET"
    })
    // We store all of the retrieved data inside of an object called "response"
    .then(function(response) {
        console.log(response);
        // grabing response to generate carousel images
        for (var i = 0; i < 10; i++){
        var imgUrl = response.matches[i].smallImageUrls;
        var recipeID = response.matches[i].id;
        var recipeName = response.matches[i].recipeName;
        // console.log(recipeID);
        // console.log(recipeName);
        
        // var ingredients = response.matches[i].imageUrlsBySize;
        
        arrayRandomRecipes.push(imgUrl);
        arrayRecipeIDs.push(recipeID);
        
        }
        function getValue() {
            var randomValue;
            do {
                randomValue = Math.floor(Math.random() * 10);
            } while(randomValue === index1 || randomValue === index2 || randomValue === index3);
            return randomValue;
        };
        var index1 = getValue();
        var index2 = getValue();
        var index3 = getValue();
        console.log(index1, index2, index3);
        
        $("#first-image-name").html(response.matches[index1].recipeName);
        $("#second-image-name").html(response.matches[index2].recipeName);
        $("#third-image-name").html(response.matches[index3].recipeName);
        
        var randomURL1 = arrayRandomRecipes[index1];
        var randomURL2 = arrayRandomRecipes[index2];
        var randomURL3 = arrayRandomRecipes[index3];
        //console.log(randomURL);

        var newURL1 = hdImgURL(randomURL1[0]);
        var newURL2 = hdImgURL(randomURL2[0]);
        var newURL3 = hdImgURL(randomURL3[0]);
        $("#first-image").attr("src", newURL1);
        $("#first-image").attr("dataID", response.matches[index1].id);
        console.log(response.matches[index1].id);
        $("#second-image").attr("src", newURL2);
        $("#second-image").attr("dataID", response.matches[index2].id);
        console.log(response.matches[index2].id);
        $("#third-image").attr("src", newURL3);
        $("#third-image").attr("dataID", response.matches[index3].id);
        console.log(response.matches[index3].id);
    });

    $.ajax({
        url: queryURL2,
        method: "GET"
    })
    // We store all of the retrieved data inside of an object called "response"
    .then(function(response) {

        for (var i = 0; i < 10; i++){
            var img = response.matches[i].smallImageUrls;
            var recipeName = response.matches[i].recipeName;
            var recipeID = response.matches[i].id;
            //console.log(imgUrl);
            arrayRandom.push(img);
            arrayRandomRecipesNames.push(recipeName);
            arrayRecipeIDs.push(recipeID);
            //console.log(arrayRandomRecipes);
        }
        for(var j = 0; j < 10; j++) {

            var randomPic = arrayRandom[j];
            // console.log(randomPic);

            var randomPicName = arrayRandomRecipesNames[j];
            // console.log(randomPicName);

            var newPic = hdImgURL(randomPic[0]);
            // console.log(newPic);

            var newID = arrayRecipeIDs[j];

            $("#random" + j).attr("src", newPic);
            $("#random" + j).attr("data", newID);
            // console.log(newID);
            $("#random" + j + "-name").text(randomPicName);
        }
    });       
};
function randomURL (url) {
    var newURL = arrayRandomRecipes[Math.floor(Math.random() * arrayRandomRecipes.length)];
    return newURL;
};
// function to grab image link in high definition 
function hdImgURL(url) {
    var arrayURL = url.split('');
    var newArrayUrl = arrayURL.slice(0, arrayURL.length - 2);
    newArrayUrl.push("1500"); 
    var newURL = newArrayUrl.join('');
    return newURL;
};

//////////////////////////////////////////////////////////////////////////
/////////////////// YouTube function starts here /////////////////////////
//////////////////////////////////////////////////////////////////////////
var player;

function onYouTubeIframeAPIReady(){
    player = new YT.Player('player',    {
      height: '500',
      width: '500',
    events : {
    'onReady' : onPlayerReady,
    'onStateChange' : onPlayerStateChange
    }
    });
    }
function onPlayerReady(e){
   //console.log('youtube player is ready');
    } 
function onPlayerStateChange(e){
    //console.log('player state change');
};

//////////////////////////////////////////////////////////////////////////
/////////////////// Firebase function starts here ////////////////////////
//////////////////////////////////////////////////////////////////////////
var config = {
    apiKey: "AIzaSyBoTmj0O0YVYVuyOeMPPm_1Cr7Evs_bBAY",
    authDomain: "project1-foodieleaks.firebaseapp.com",
    databaseURL: "https://project1-foodieleaks.firebaseio.com",
    projectId: "project1-foodieleaks",
    storageBucket: "",
    messagingSenderId: "360937501742"
    };
    firebase.initializeApp(config);
    
    // Get a reference to the database service
    var database = firebase.database();
    // Initializing our click count at 0
    var clickCounter = 0;
    // click event to increment 
    $("#click-button").on("click", function() {
    
        // Add 1 to clickCounter
        clickCounter++;
    
        // **** Store Click Data to Firebase in a JSON property called clickCount *****
        // **** Note how we are using the Firebase .set() method ****
        // **** .ref() refers to the path you want to save your data to
        // **** Since we left .ref() blank, it will save to the root directory
        database.ref().set({
          clickCount: clickCounter
        });
    
        // Now! go to https://fir-click-counter-7cdb9.firebaseio.com/ to see the impact to the DB
    });
    
    database.ref().on("value", function(snapshot) {
    
        // Then we console.log the value of snapshot
        console.log(snapshot.val());
    
        // Update the clickCounter variable with data from the database.
        clickCounter = snapshot.val().clickCount;
    
        // Then we change the html associated with the number.
        $("#click-value").text(snapshot.val().clickCount);
    
        // If there is an error that Firebase runs into -- it will be stored in the "errorObject"
        // Again we could have named errorObject anything we wanted.
      }, function(errorObject) {
    
        // In case of error this will print the error
        console.log("The read failed: " + errorObject.code);
    });