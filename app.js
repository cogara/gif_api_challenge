$(function() {
  var offSet;
  var tempSearch;

  //sends API query for type ('gifs'/'stickers'), search term, and offset.
  //append to DOM
  function searchAPI(type, search, offset) {
    tempResult = [];

    if (search.length < 3) {
      $('.search-results').append('Search too short, please retry search with at least 3 characters');
      return
    }
    console.log('API Query', 'http://api.giphy.com/v1/' + type + '/search?q=' + search + '&offset=' + offset + '&api_key=dc6zaTOxFJmzC');
    $.get('http://api.giphy.com/v1/' + type + '/search?q=' + search + '&offset=' + offset + '&api_key=dc6zaTOxFJmzC')
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
        $('.search-results').append('<div class="button-next"><button id="'+ type +'next">Next</button></div>');
        if (offSet > 4) {
          $('.button-next').prepend('<button id="' + type + 'prev">Previous</button>');
        }

      },function() {
        console.log('searchAPI function failed');
      })
  }
  function searchTrending(type) {
    tempResult = [];
    $('.search-word').empty();
    $('.search-word').append('Showing Trending');
    $('.search-results').empty();
    $.get('http://api.giphy.com/v1/' + type + '/trending?api_key=dc6zaTOxFJmzC')
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

  function searchRandom(type, tags) {
    var tempTags = '';
    if (tags.length > 0) {
      tempTags = '&tag=' + tags;
    }
    $.get('http://api.giphy.com/v1/' + type + '/random?api_key=dc6zaTOxFJmzC' + tempTags)
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
  $('.button-search-gif').on('click',function(){
    //reset page # on each new search

    offSet = 0;
    //store search term to be used in initial search and to get next page of results
    tempSearch = $('#search-gif').val();
    $('.search-word').empty();
    $('.search-word').append('Searching JIFs for: '+ tempSearch);
    //clear search input and search results from previous page
    $('#search-gif').val('');
    $('.search-results').empty();
    // if (tempSearch.length < 3) {
    //   $('.search-results').append('Search too short, please retry search with at least 3 characters');
    //   console.log('Search too short');
    //   return
    // }
    //inputs gifs as type, most recently stored search term, and offset
    searchAPI('gifs', tempSearch, offSet);
  });
  $('.button-search-sticker').on('click',function(){
    //reset page # on each new search
    offSet = 0;
    //store search term to be used in initial search and to get next page of results
    tempSearch = $('#search-sticker').val();
    $('.search-word').empty();
    $('.search-word').append('Searching Stickers For: '+ tempSearch);
    //clear search input and search results from previous page
    $('#search-sticker').val('');
    $('.search-results').empty();
    // if (tempSearch.length < 3) {
    //   console.log('Search too short');
    //   return
    // }
    //inputs gifs as type, most recently stored search term, and offset
    searchAPI('stickers', tempSearch, offSet);
  });

  //next page on search results
  $('.search-results').on('click','#gifsnext',function(){
    //clear previous results
    $('.search-results').find('.result').remove();
    $('.button-next').remove();
    //increases offset by 5 each time to get new page on next button click
    offSet += 5;
    //uses stored value from most recent search, and has an incremented offset of +5
    searchAPI('gifs', tempSearch, offSet)
  })
  $('.search-results').on('click','#stickersnext',function(){
    //clear previous results
    $('.search-results').find('.result').remove();
    $('.button-next').remove();
    //increases offset by 5 each time to get new page on next button click
    offSet += 5;
    //uses stored value from most recent search, and has an incremented offset of +5
    searchAPI('stickers', tempSearch, offSet)
  })

  //prev page on search results
  $('.search-results').on('click','#gifsprev',function(){
    //clear previous results
    $('.search-results').find('.result').remove();
    $('.button-next').remove();
    //increases offset by 5 each time to get new page on next button click
    offSet -= 5;
    //uses stored value from most recent search, and has an incremented offset of +5
    searchAPI('gifs', tempSearch, offSet)
  })
  $('.search-results').on('click','#stickersprev',function(){
    //clear previous results
    $('.search-results').find('.result').remove();
    $('.button-next').remove();
    //increases offset by 5 each time to get new page on next button click
    offSet -= 5;
    //uses stored value from most recent search, and has an incremented offset of +5
    searchAPI('stickers', tempSearch, offSet)
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

  //show trending GIF or Stickers
  $('.button-trending-gif').on('click',function() {
    searchTrending('gifs');
  })
  $('.button-trending-sticker').on('click',function() {
    searchTrending('stickers');
  })

})
