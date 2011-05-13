
var useOgv = document.createElement("video").canPlayType("video/ogg") === "maybe" && 
                  !document.createElement("video").canPlayType("video/mp4"), 

    useType = useOgv && ".ogv" || "_512kb.mp4", 
    
    localMediaList = [
      { 
        src: "assets/snowdriving.ogv", 
        in: 10,
        out: 13
      }, 
      {
        src: "assets/eich.ogv",
        in: 8, 
        out: 11
      }
    ],  
    remoteMediaList = [
      {
        src: "http://ia600208.us.archive.org/5/items/Brunette_2/Brunette_2" + useType,  
        in: 3,
        out: 6
      },
      {
        src: "http://ia600208.us.archive.org/0/items/Blonde_2/Blonde_2" + useType,  
        in: 6,
        out: 9
      }
    ], 
    mixedSourceList = [
      {
        src: "http://ia600102.us.archive.org/23/items/HotNumber/HotNumber" + useType,  
        in: 0, 
        out: 2
      },
      {
        src: "http://ia600102.us.archive.org/23/items/HotNumber/HotNumber" + useType,  
        in: 5, 
        out: 7
      },
      {
        src: "http://ia600208.us.archive.org/5/items/Brunette_2/Brunette_2" + useType,  
        in: 8,
        out: 10
      }, 
      {
        src: "assets/snowdriving.ogv",
        in: 11,
        out: 13
      }, 
      {
        src: "http://ia600208.us.archive.org/0/items/Blonde_2/Blonde_2" + useType, 
        in: 14,
        out: 16
      }
    ];

//$seq = Popcorn.sequence( "seq-fixture", clips );
//$seq.play();

module("API");
test("Popcorn.sequence", function() {
  
  expect(2);
  
  ok( Popcorn.sequence, "Popcorn.sequence exists" );
  
  equal( typeof Popcorn.sequence, "function", "Popcorn.sequence() is a function" );
  
});

test("sequence( media, array )", function() {
  
  expect( 21 );
  
  
  var seq = Popcorn.sequence( "video-sequence-a", localMediaList );

  window.seq = seq;  

  // int
  ok( seq.hasOwnProperty( "active" ), 'seq.hasOwnProperty( "active" )' );

  // array
  ok( seq.hasOwnProperty( "clips" ), 'seq.hasOwnProperty( "clips" )' );

  // bool
  ok( seq.hasOwnProperty( "cycling" ), 'seq.hasOwnProperty( "cycling" )' );    

  // object
  ok( seq.hasOwnProperty( "dims" ), 'seq.hasOwnProperty( "dims" )' );

  // node
  ok( seq.hasOwnProperty( "place" ), 'seq.hasOwnProperty( "place" )' );

  // bool
  ok( seq.hasOwnProperty( "playing" ), 'seq.hasOwnProperty( "playing" )' );

  // array
  ok( seq.hasOwnProperty( "playlist" ), 'seq.hasOwnProperty( "playlist" )' );

  // string  
  ok( seq.hasOwnProperty( "seqId" ), 'seq.hasOwnProperty( "seqId" )' );

  // node list
  ok( seq.hasOwnProperty( "queue" ), 'seq.hasOwnProperty( "queue" )' );


  // int
  equal( typeof seq.active, "number", 'seq.active typeof ');

  // array
  equal( typeof seq.clips, "object", 'seq.clips typeof ');

  // bool
  equal( typeof seq.cycling, "boolean", 'seq.cycling typeof ');    

  // object
  equal( typeof seq.dims, "object", 'seq.dims typeof ');

  // node
  equal( typeof seq.place, "object", 'seq.place typeof ');

  // bool
  equal( typeof seq.playing, "boolean", 'seq.playing typeof ');

  // array
  equal( typeof seq.playlist, "object", 'seq.playlist typeof ');

  // string  
  equal( typeof seq.seqId, "string", 'seq.seqId typeof ');

  // node list
  equal( typeof seq.queue, "object", 'seq.queue typeof ');


  equal( seq.queue.length, localMediaList.length, 'Popcorn.sequence( video-sequence-a, localMediaList).queue.length returns localMediaList.length' );
  
  equal( seq.playlist.length, localMediaList.length, 'Popcorn.sequence( video-sequence-a, localMediaList).playlist.length returns localMediaList.length' );

  equal( seq.clips.length, localMediaList.length, 'Popcorn.sequence( video-sequence-a, localMediaList).clips.length returns localMediaList.length' );

});

test("Popcorn.sequence.prototype", function() {
  
  var expects = 3, 
      seq = Popcorn.sequence( "video-sequence-a", localMediaList ), 
      fns = Object.getOwnPropertyNames( Popcorn.sequence.prototype );


  expects += (fns.length - 1) * 2;

  expect( expects );
  
  //  PROTOTYPE FNS

  fns.forEach(function( prop, idx ) {
    if ( prop !== "constructor" ) {
      ok( seq.__proto__[ prop ], "seq.__proto__[ " + prop + " ]" );
      equal( typeof seq.__proto__[ prop ], "function", "seq.__proto__[ " + prop + " ] is function" );
    }
  });

  //  TODO write typeof tests for all the own props
  
  ok( seq.eq( 1 ) instanceof Popcorn, "seq.eq( 1 ) instanceof Popcorn" );
  
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

console.log(useOgv  );
if ( !useOgv ) {

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


    var expects = 2, 
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

    seq.listen( "canplaythrough", function( event ) {
    
      ok( true, "`canplaythrough` fired for all in sequence" );

      plus();
      
    });  

  });

}

module("Player");
test("Normalized Dimensions", function () {
  
  var expects = 4, 
      count = 0;

  expect(expects);
  
  function plus() { 
    if ( ++count === expects ) {
      start(); 
    }
  }  
  
  stop(10000);
  
  var seq = Popcorn.sequence( "video-sequence-b", localMediaList ), 
      dims = {
        width: 0, 
        height: 0
      };
  
  seq.listen( "loadedmetadata", function( event ) {

    //console.log( "loaded" );
    //console.log( seq );
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

module("Playback");
test("Reference Tests", function () {
  
  var expects = 11, 
      count = 0;

  expect(expects);
  
  function plus() { 
    if ( ++count === expects ) {
      start(); 
    }
  }

  stop(35000);


  var seq = Popcorn.sequence( "video-sequence-b", mixedSourceList ),
      dims = {
        width: 0,
        height: 0
      };
  //[ 4, 7, 11, 15, 19, 22 ]
  [ 1, 4, 7, 10, 13 ].forEach(function( time, idx ) {

    seq.exec( time, function() {
      //console.log( seq.active, time );
      equal( seq.active, idx, "video " + idx + " is active" );
      plus();

      // currentSrc will force resources to have abs url, thus making local resources unmatchable
      ok( seq.queue[ idx ].currentSrc.indexOf(mixedSourceList[ idx ].src) > -1, "seq.queue[ idx ].currentSrc same as mixedSourceList[ idx ].src" );
      plus();
    });
  });

  seq.playlist.forEach(function( pop ) {
    //console.log( pop.data.trackEvents.byStart );
  });
  
  seq.listen( "loadedmetadata", function( event ) {

    equal( event.type, "loadedmetadata", "Artificial bubbling occurred" );
		plus();
		
    //window.seq = seq;

    seq.play();
  });
});

module("Playback");
test("Finished Sequence Tests", function () {
  
  var expects = 2, 
      count = 0;

  expect(expects);

  function plus() { 
    if ( ++count === expects ) {
      start(); 
    }
  }

  stop(360000);


  var seq2 = Popcorn.sequence( "video-sequence-a", remoteMediaList ),
      dims = {
        width: 0,
        height: 0
      };

  seq2.listen( "pause", function() {
 
    if ( seq2.active === seq2.playlist.length - 1 && seq2.playlist[seq2.active].media.currentTime >  seq2.clips[seq2.active].in ) {
      equal( Math.floor(seq2.playlist[ seq2.active ].media.currentTime), seq2.clips[ seq2.active ].out, "The sequence had ended at the correct time" );
      plus();
      equal( seq2.active, seq2.playlist.length -1, "The last video clip is displayed" );
      plus();
    }
  });
  
  seq2.listen( "loadedmetadata", function( event ) {

    seq2.play();
  });

});



