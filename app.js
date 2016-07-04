$(function() {
  var offSet;
  var tempSearch;

  //sends API query for type ('gifs'/'stickers'), search term, and offset.
  //append to DOM, saves offset to allow displaying new pages of results.
  function searchAPI(type, search, offset) {
    tempResult = [];

    if (search.length < 3) {
      $('.search-results').append('Search too short, please retry search with at least 3 characters');
      return
    }
    console.log('API Query', 'http://api.giphy.com/v1/' + type + '/search?q=' + search + '&offset=' + offset + '&api_key=dc6zaTOxFJmzC');
    $.get('https://api.giphy.com/v1/' + type + '/search?q=' + search + '&offset=' + offset + '&api_key=dc6zaTOxFJmzC')
      .then(function(data){
        var searchData = data.data;
        for (var i = 0; i < 5; i++) {
          var $searchDataID = searchData[i].id;
          var tempResultURL = searchData[i].images.fixed_width_small.url;
          var tempResultFullURL = searchData[i].images.original.url;
          $('.search-results').append('<div class="result" id="' + $searchDataID + '" data-type="' + type + '"></div>');
          $('#' + $searchDataID).append(
            '<img src="' + tempResultURL + '"></img>' +
            '<div class="url"><span class="link">URL:</span><a href="' + tempResultFullURL + '" target="_blank"> Full Size</a></div>'
          )
        }
        $('.search-results').append('<div class="button-page"><button id="next" data-type="' + type + '">Next</button></div>');
        if (offSet > 4) {
          $('.button-page').prepend('<button id="prev" data-type="' + type + '">Previous</button>');
        }

      },function() {
        console.log('searchAPI function failed');
      })
  }

  //search trending function
  function searchTrending(type) {
    tempResult = [];
    $('.search-word').empty();
    $('.search-word').append('Showing Trending');
    $('.search-results').empty();
    $.get('https://api.giphy.com/v1/' + type + '/trending?api_key=dc6zaTOxFJmzC')
      .then(function(data){
        var searchData = data.data;
        for (var i = 0; i < 25; i++) {
          var $searchDataID = searchData[i].id;
          var tempResultURL = searchData[i].images.fixed_width_small.url;
          var tempResultFullURL = searchData[i].images.original.url;

          $('.search-results').append('<div class="result" id="' + $searchDataID + '" data-type="trending"></div>');
          $('#' + $searchDataID).append(
            '<img src="' + tempResultURL + '"></img>' +
            '<div class="url"><span class="link">URL:</span><a href="' + tempResultFullURL + '" target="_blank"> Full Size</a></div>'
          )
        }

      },function() {
        console.log('searchAPI function failed');
      })
  }

  //function for searching random
  function searchRandom(type, tags) {
    var tempTags = '';
    if (tags.length > 0) {
      tempTags = '&tag=' + tags;
    }
    $.get('https://api.giphy.com/v1/' + type + '/random?api_key=dc6zaTOxFJmzC' + tempTags)
      .then(function(data){
        var tempRand = data.data;

        $('.search-results').empty();
        $('.search-results').append(
          '<div class="random-result">' +
          '<img src="' + tempRand.image_url + '" alt="' + type + '" />' +
          '</div>' +
          '<div class="url"><span class="link">URL:</span><a href="' + tempRand.image_url + '" target="_blank"> Direct Link</a></div>'
          )
      },function(){
        console.log('Request Failed');
      })
  }

  //initiate random searches for GIF and Stickers, append to screen
  $('.random').on('click','button',function(){
    var randType = $(this).data('type');
    var tempTags = $('#search-random-'+randType).val();
    $('.search-word').empty();
    $('.search-word').append('Showing Random ' + randType.toUpperCase());
    //request info from API for GIF and append to screen
    searchRandom(randType+'s', tempTags);
  })

  //Search database for specific GIF or sticker and display results
  $('.all').on('click','button',function(){
    //reset offSet for new search
    offSet = 0;
    //determine search for GIF or stickers
    var tempType = $(this).data('type');
    //store search term to be used in initial search and to get next page of results
    tempSearch = $('#search-' + tempType).val();
    $('.search-word').empty();
    $('.search-word').append('Searching ' + tempType.toUpperCase() + 's for: '+ tempSearch);
    //clear search input and search results from previous page
    $('#search-' + tempType).val('');
    $('.search-results').empty();
    searchAPI(tempType+'s', tempSearch, offSet);
  })

  //show trending GIF or Stickers
  $('.trending').on('click','button',function(){
    var trendType = $(this).data('type')
    searchTrending(trendType);
  })

  //next page on search results
  $('.search-results').on('click','.button-page #next',function() {
    var tempType = $(this).data('type');
    //clear previous results
    $('.search-results').find('.result').remove();
    $('.button-page').remove();
    //increases offset by 5 each time to get new page on next button click
    offSet += 5;
    //uses stored value from most recent search, and has an incremented offset of +5
    searchAPI(tempType, tempSearch, offSet)
  })

  //prev page on search results
  $('.search-results').on('click','.button-page #prev',function() {
    var tempType = $(this).data('type');
    //clear previous results
    $('.search-results').find('.result').remove();
    $('.button-page').remove();
    //decreases offset by 5 each time to get prev page on prev button click
    offSet -= 5;
    //uses stored value from most recent search, and has an decremented offset of -5
    searchAPI(tempType, tempSearch, offSet)
  })

  //toggle search for GIF or Stickers
  $('#toggle-gif').on('click',function() {
    $('.gifs-container').removeClass('hidden');
    $('#toggle-gif').addClass('active');
    $('.stickers-container').addClass('hidden');
    $('#toggle-sticker').removeClass('active');
  })
  $('#toggle-sticker').on('click',function() {
    $('.stickers-container').removeClass('hidden');
    $('#toggle-sticker').addClass('active');
    $('.gifs-container').addClass('hidden');
    $('#toggle-gif').removeClass('active');
  })

})
