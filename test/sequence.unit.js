/*
var localMediaList = [
      "assets/snowdriving.ogv",
      "assets/eich.ogv",
      "assets/crockford.ogv"
    ], 
    remoteMediaList = [
      "http://ia600208.us.archive.org/5/items/Brunette_2/Brunette_2.ogv", 
      "http://ia600208.us.archive.org/0/items/Blonde_2/Blonde_2.ogv"
    ],
    mixedMediaList = [
      "assets/snowdriving.ogv",
      "http://ia600208.us.archive.org/5/items/Brunette_2/Brunette_2.ogv", 
      "assets/eich.ogv",
      "http://ia600208.us.archive.org/0/items/Blonde_2/Blonde_2.ogv"
    ];

module("API");
test("Popcorn.sequence", function() {
  
  expect(2);
  
  ok( Popcorn.sequence, "Popcorn.sequence exists" );
  
  equal( typeof Popcorn.sequence, "function", "Popcorn.sequence() is a function" );
  
});


test("sequence( media, array )", function() {
  
  expect( 13 );
  
  
  var seq = Popcorn.sequence( "video-sequence-a", localMediaList );
  

  ok( seq.hasOwnProperty( "dims" ), 'seq.hasOwnProperty( "dims" )' );
  ok( seq.hasOwnProperty( "parent" ), 'seq.hasOwnProperty( "parent" )' );
  ok( seq.hasOwnProperty( "seqId" ), 'seq.hasOwnProperty( "seqId" )' );
  ok( seq.hasOwnProperty( "playlist" ), 'seq.hasOwnProperty( "playlist" )' );
  ok( seq.hasOwnProperty( "video" ), 'seq.hasOwnProperty( "video" )' );  
  
  
  equal( typeof seq.dims, "object", 'typeof seq.dims, "object"' );
  equal( typeof seq.eq, "function", 'typeof seq.eq, "function"' );
  //  TODO write typeof tests for all the own props
  
  
  ok( seq.eq( 1 ) instanceof Popcorn, "seq.eq( 1 ) instanceof Popcorn" );
  
  
  same( seq.queue.length, localMediaList.length, 'Popcorn.sequence( video-sequence-b, localMediaList).queue.length returns localMediaList.length' );
  
  same( seq.playlist.length, localMediaList.length, 'Popcorn.sequence( video-sequence-b, localMediaList).playlist.length returns localMediaList.length' );
  
  seq.playlist.forEach( function( item ) {
    
    ok( item instanceof Popcorn, "item instanceof Popcorn" );
  
  });
});




module("Elements");
test("local media", function() {
    
  var expects = 1, 
      count = 0;

  expect(expects);
  
  function plus() { 
    if ( ++count === expects ) {
      start(); 
    }
  }  
  
  stop();
  
  
  var seq = Popcorn.sequence( "video-sequence-a", localMediaList ),
      $videos = document.getElementById("qunit-fixture").querySelectorAll("video");
  
  equals( $videos.length, localMediaList.length, localMediaList.length + " Videos in the sequence" );
  plus();

});

test("remote media", function() {
    
  var expects = 1, 
      count = 0;

  expect(expects);
  
  function plus() { 
    if ( ++count === expects ) {
      start(); 
    }
  }  
  
  stop();
  
  var seq = Popcorn.sequence( "video-sequence-a", remoteMediaList ),
      $videos = document.getElementById("qunit-fixture").querySelectorAll("video");
  
  equals( $videos.length, remoteMediaList.length, remoteMediaList.length + " Videos in the sequence" );
  plus();

});


module("Access");
test("local media", function() {

  var expects = localMediaList.length, 
      count = 0;

  expect(expects);
  
  function plus() { 
    if ( ++count === expects ) {
      start(); 
    }
  }  
  
  stop();
  

  var seq = Popcorn.sequence( "video-sequence-a", localMediaList );

  seq.playlist.forEach( function( video, idx ) {

    equals( seq.eq( idx ) instanceof Popcorn, true, "seq.eq( " + idx + ") instanceof Popcorn" );
    plus();
    
  });
});

test("remote media", function() {

  var expects = remoteMediaList.length, 
      count = 0;

  expect(expects);
  
  function plus() { 
    if ( ++count === expects ) {
      start(); 
    }
  }  
  
  stop();

  var seq = Popcorn.sequence( "video-sequence-a", remoteMediaList );

  seq.playlist.forEach( function( video, idx ) {

    equals( seq.eq( idx ) instanceof Popcorn, true, "seq.eq( " + idx + ") instanceof Popcorn" );
    plus();
    
  });
});

module("Events");
test("local media", function () {


  var expects = 2, 
      count = 0;

  expect(expects);
  
  function plus() { 
    if ( ++count === expects ) {
      start(); 
    }
  }  
  
  stop();
  
  var seq = Popcorn.sequence( "video-sequence-a", localMediaList );
  
  seq.listen( "loadedmetadata", function( event ) {
  
    ok( true, "`loadedmetadata` fired for all in sequence" );
    plus();
    
  });
  

  seq.listen( "canplaythrough", function( event ) {
  
    ok( true, "`canplaythrough` fired for all in sequence" );
    plus();
    
  });  
  
});

test("remote media", function () {


  var expects = 1, 
      count = 0;

  expect(expects);
  
  function plus() { 
    if ( ++count === expects ) {
      start(); 
    }
  }  
  
  stop();
  
  var seq = Popcorn.sequence( "video-sequence-a", remoteMediaList );
  
  seq.listen( "loadedmetadata", function( event ) {
  
    ok( true, "`loadedmetadata` fired for all in sequence" );
    plus();
    
  });

});



module("Player");
test("Normalized Dimensions", function () {
  
  var expects = 6, 
      count = 0;

  expect(expects);
  
  function plus() { 
    if ( ++count === expects ) {
      start(); 
    }
  }  
  
  stop(2000);
  
  var seq = Popcorn.sequence( "video-sequence-b", localMediaList ), 
      dims = {
        width: 0, 
        height: 0
      };
  
  seq.listen( "loadedmetadata", function( event ) {

    seq.playlist.forEach( function( $p, idx ) {
      
      if ( !dims.width ) {
        dims.width = $p.video.width;
        dims.height = $p.video.height;
      }
      
      equal( $p.video.width, dims.width, "Video #" + idx + " $p.video.width equals normalized player width" );
      plus();
      
      equal( $p.video.height, dims.height, "Video #" + idx + " $p.video.height equals normalized player height" );
      plus();
    
    });

  });
  
});
*/
