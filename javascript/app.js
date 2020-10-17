(async function() {
    // Insert your IGDB API User Key Here
    // Go here to generate one if you don't have one: https://api.igdb.com/signup
    const userKey = "8s7l5hzbtpetpsle4hsvy0gmkhtfmi";
    const contentType = "application/json";
    const igdbGameList = $("#igdbGameList");
    const userGameList = $("#userGameList");
    let games = [];
    let platforms = {};
  
    $.ajax({
      method: "GET",
      headers: {
        "user-key": userKey,
        Accept: contentType
      },
      url:
        "https://cors-anywhere.herokuapp.com/https://api-endpoint.igdb.com/games/?fields=id,name,summary,cover.url,platforms,first_release_date,popularity&order=popularity:desc&limit=50",
      async: true,
      crossDomain: true
    })
      .done(function(response) {
        // Save the games
        games = response;
  
        // Populate the games search list
        $.each(response, function(index, item) {
          igdbGameList.append(buildGameItem(item));
        });
      })
      .fail(function() {
        alert("Unable to contact IGDB. Be sure to paste your API user key in the userKey variable at the top of the JS.");
      });
  
    // Setup live search
    $(".games-search-box").keyup(function() {
      // Get the query string
      const queryString = $(this)
        .val()
        .toLowerCase();
  
      $(this)
        .parent()
        .find(".game-list li")
        .each(function() {
          if (
            $(this).filter("[data-game-name *= " + queryString + "]").length >
              0 ||
            queryString.length < 1
          ) {
            $(this).show();
          } else {
            $(this).hide();
          }
        });
    });
  
    function buildGameItem(gameItem) {
      const releaseDate =
        gameItem.first_release_date == null
          ? "Unknown"
          : new Date(gameItem.first_release_date).getFullYear();
  
      // Build the cover image
      const img = $(
        `<img class="game-cover" src="${gameItem.cover.url}" alt="${
          gameItem.name
        } cover"/>`
      );
  
      // Build the game details
      const div = $(
        `<div class="game-details"><p>${
          gameItem.name
        }</p><p>Released: ${releaseDate}</p><p>Available Platforms:</p></div>`
      );
  
      // Build the available platforms
      const platformsList = $(`<ul class="platforms-list"></ul>`);
  
      $.each(gameItem.platforms, function(index, id) {
        if (platforms[id] == null) {
          platforms[id] = requestPlatform(id, platformsList);
        } else {
          ul.append(buildPlatformLi(id));
        }
      });
  
      // Build the list item
      const li = $(
        `<li class="border-box" data-game-name="${gameItem.name.toLowerCase()}"></li>`
      );
  
      // Assemble the list item
      li.append(img);
      li.append(div);
      div.append(platformsList);
  
      // Setup click to add to user game list
      li.click(igdbGameClick);
  
      return li;
    }
  
    function igdbGameClick(event) {
      const li = $(this);
  
      if (li.hasClass("in-user-list")) {
        // Remove the game from the user list
        findGameInList(li, userGameList).remove();
      } else {
        // Add the game to the user list
        const cloneLi = li.clone();
        cloneLi.addClass("user-game");
  
        // Setup the user list click
        cloneLi.click(userGameClick);
  
        cloneLi.appendTo(userGameList);
      }
  
      // Visually indicate the change
      li.toggleClass("in-user-list");
    }
  
    function userGameClick(event) {
      const li = $(this);
  
      // Visually indicate the change in the IGDB game list
      findGameInList(li, igdbGameList).toggleClass("in-user-list");
  
      // Remove the game from the user list
      li.remove();
    }
  
    function findGameInList(gameLi, list) {
      return list.find(`li[data-game-name="${gameLi.data("game-name")}"]`);
    }
  
    function requestPlatform(id, platformsList) {
      $.ajax({
        method: "GET",
        headers: {
          "user-key": "1e6632b6e0ff4f34fdc611d33b0f95cc",
          Accept: "application/json"
        },
        url: `https://cors-anywhere.herokuapp.com/https://api-endpoint.igdb.com/platforms/${id}/?fields=id,name,logo.url`,
        crossDomain: true
      }).done(function(response) {
        // Save the platform
        if (response.length > 0) {
          platforms[id] = response[0];
        }
  
        // Append it to the game
        platformsList.append(buildPlatformLi(id));
      });
    }
  
    function buildPlatformLi(id) {
      return $(`<li>${platforms[id].name}</li>`);
    }
  });
  