Parse.initialize("yonHV4Su3pvCcERRWakgYDbM5cBzgnx3Qm3cDS6l", "dx7aXTtqcgxsOGqKpCZ4isdUlFywkdDdSG9KTJeF");

var container = $(".albums");

var timesCalled = 0;
var total = 0;
var show = 12; // number of results to show


// generate larger image
function embiggen(oldExt, newExt, fullImgUrl, oldString) {
    bigImg = fullImgUrl.split(oldExt).join(newExt);
    newImg = oldString.substring(0,oldString.length - 14) + bigImg;
}

function getAlbums(empty,what) {
  
  $(".search-btn .glyphicon-search").css("background","url(../public/img/ajax.gif) no-repeat 50% 50%").css("color","transparent");
  $(".load-more").html("Loading...");

  if (empty != "no") {
    container.empty(); //clear previous
    timesCalled = 0;
  }

  var AlbumDeets = Parse.Object.extend("Album");

  if (what) {

    var query = what.toLowerCase();

    console.log("q",query);

    var artName = new Parse.Query(AlbumDeets);
    artName.contains("lArtistName",query);

    // alternatively, use 'startsWith'

    var albName = new Parse.Query(AlbumDeets);
    albName.contains("lCollectionName",query);

    // chain the query
    var dblQuery = Parse.Query.or(artName, albName);
    var mainQuery = dblQuery;
  } else {
    console.log("no query");
    var mainQuery = new Parse.Query(AlbumDeets);
    console.log("no query times called",timesCalled)
  }
  
  mainQuery.ascending("artistName");
  
  mainQuery.limit(show);
  
  var skip = show*timesCalled;
  mainQuery.skip(skip);
  console.log("skip",skip,"show",show);

  mainQuery.count({
    success: function (number) {
      console.log("results",number);
      total = number;
      loadMore();
    }
  });

  mainQuery.find({
    success: function(results) {
      console.log("Successfully retrieved " + results.length + " albums.");

      if (timesCalled < 2 && results.length < 1) {
        $(".no-results").removeClass("hidden").addClass("show");
      } else {
        $(".no-results").removeClass("show").addClass("hidden");
        // Do something with the returned Parse.Object values

        var aTemplate = "<div class='col-xs-6 col-6 col-sm-3 col-lg-3'>" +
          "<div class='flip' style='-webkit-animation-delay:{i}s; -moz-animation-delay:{i}s; animation-delay:{i}s'>" +
          "<div class='card'>" +
          "<div class='album front animated fadeIn' style='background-image:url({bigImg})'>" +
          "<img class='artwork' src='{artwork}' alt='{collectionName}' /></div>" +
          "<div class='album back' style='background-image:url({back})'>" +
          "<img class='artwork' src='{back}' alt='{collectionName}' />" +
          "</div></div></div></div>"

        for (var i = 0; i < results.length; i++) { 
          var object = results[i];
          console.log("i",i,"times called",timesCalled);
          var artistName = object.get('artistName');
          var collectionName = object.get('collectionName');
          var artwork = object.get('artworkUrl100');
            var artworkSize = artwork.slice(-14);
            var smallSize = artwork.slice(-14,-11);
            var newSize = smallSize *2 + '';
            embiggen(smallSize,newSize,artworkSize,artwork);
          var back = object.get('imgFile')._url;
          container.append(
            aTemplate.replace(/\{i\}*/g,i*0.1).replace(/\{bigImg\}*/g,newImg).replace(/\{collectionName\}*/g,collectionName).replace(/\{back\}*/g,back).replace(/\{artwork\}*/g,artwork));
        }
      }
      $(".search-btn .glyphicon-search").css("background","initial").css("color","inherit");
    },
    error: function(error) {
      console.log("Error: " + error.code + " " + error.message);
      //add alert here
    }
  });
  timesCalled++; // put this inside the loadmore function?
}

//form
$("#albumSearch").submit(function () {
  var q = $(this).find("#search").val();

  // search
  console.log(q);

  getAlbums("yes",q);

  $(".load-more").on("click", function () {
    getAlbums("no",q);
  });

  // stop the form doing its default behaviour
  // of going to the next page

  return false;

});

  $(document).ready(function() {

    var term = $("#search").val(); // get possible url term
    console.log("term",term);

    getAlbums("yes",term);

    $(".load-more").on("click", function () {
      getAlbums("no");
    });

    $("body").on("click", ".flip", function () {
      $(this).find(".card").toggleClass("flipped");
    });

    console.log("initial run");
  });

  function loadMore() {
    if (total > show) {
      // todo: prevent load more when all are loaded
      $(".load-more").removeClass("disabled").html("Load more");
    } else {
      $(".load-more").addClass("disabled").html("All results loaded");
    }
  }

console.log("times",timesCalled);