
var useOgv = document.createElement("video").canPlayType("video/ogg") === "maybe" && 
                  !document.createElement("video").canPlayType("video/mp4"), 

    useType = useOgv && ".ogv" || ".webm",
    
    srcVideo = "http://videos.mozilla.org/serv/webmademovies/popcorntest" + useType,
    
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
        src: srcVideo,  
        in: 3,
        out: 6
      },
      {
        src: srcVideo,  
        in: 6,
        out: 9
      }
    ], 
    mixedSourceList = [
      {
        src: srcVideo,  
        in: 0, 
        out: 2
      },
      {
        src: srcVideo,  
        in: 5, 
        out: 7
      },
      {
        src: srcVideo,  
        in: 8,
        out: 10
      }, 
      {
        src: "assets/snowdriving.ogv",
        in: 11,
        out: 13
      }, 
      {
        src: srcVideo, 
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
  
  expect( 23 );
  
  
  var seq = Popcorn.sequence( "video-sequence-a", localMediaList );

  window.seq = seq;  

  // int
  ok( seq.hasOwnProperty( "active" ), 'seq.hasOwnProperty( "active" )' );

  // object
  ok( seq.hasOwnProperty( "inOuts" ), 'seq.hasOwnProperty( "inOuts" )' );

  ok( seq.inOuts.hasOwnProperty( "ofVideos" ), 'seq.inOuts.hasOwnProperty( "ofVideos" )' );
  ok( seq.inOuts.hasOwnProperty( "ofClips" ), 'seq.inOuts.hasOwnProperty( "ofClips" )' );

  // bool
  ok( seq.hasOwnProperty( "cycling" ), 'seq.hasOwnProperty( "cycling" )' );    

  // object
  ok( seq.hasOwnProperty( "dims" ), 'seq.hasOwnProperty( "dims" )' );

  // node
  ok( seq.hasOwnProperty( "parent" ), 'seq.hasOwnProperty( "parent" )' );

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
  equal( typeof seq.inOuts, "object", 'seq.inOuts typeof ');

  // bool
  equal( typeof seq.cycling, "boolean", 'seq.cycling typeof ');    

  // object
  equal( typeof seq.dims, "object", 'seq.dims typeof ');

  // node
  equal( typeof seq.parent, "object", 'seq.parent typeof ');

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

  equal( seq.inOuts.ofVideos.length, localMediaList.length, 'Popcorn.sequence( video-sequence-a, localMediaList).inOuts.ofVideos.length returns localMediaList.length' );

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

  seq.remove();
});

module("Elements");
test("local media", function() {
    
  var expects = 1, 
      count = 0;

  expect(expects);
  
  function plus() { 
    if ( ++count === expects ) {
      start(); 
      seq.remove();
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
      seq.remove();
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
      seq.remove();
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
      seq.remove();
    }
  }  
  
  stop();

  var seq = Popcorn.sequence( "video-sequence-a", remoteMediaList );

  seq.playlist.forEach( function( video, idx ) {

    equals( seq.eq( idx ) instanceof Popcorn, true, "seq.eq( " + idx + ") instanceof Popcorn" );
    plus();
    
  });
});


if ( !useOgv ) {

  module("Events");
  test("local media", function () {


    var expects = 2, 
        count = 0;

    expect(expects);
    
    function plus() { 
      if ( ++count === expects ) {
        start(); 
        seq.remove();
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
        seq.remove();
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

//  test("trigger(native)", function () {
//  
//    var expects = 1;

//    expect(expects);
//    
//    var seq = Popcorn.sequence( "video-sequence-b", mixedSourceList );


//    // unamed function expression
//    seq.listen("play", function( event, data ) {

//      ok(true, "fired");

//      console.log( this, event.active, seq.active );
//      //equal( event.type, "play", "Custom Event `foo` fired");
//      //same( data, { a: "alpha" }, "Correct data was passed to callback, " + JSON.stringify({ a: "alpha" }) );

//    }).trigger("play");

//  });

}

module("Player");
test("Normalized Dimensions", function () {
  
  var expects = 4, 
      count = 0;

  expect(expects);
  
  function plus() { 
    if ( ++count === expects ) {
      start(); 
      seq.remove();
    }
  }  
  
  stop(10000);
  
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

module("Playback");
test("Reference Tests", function () {
  
  var expects = 11, 
      count = 0;

  expect(expects);
  
  function plus() { 
    if ( ++count === expects ) {
      start(); 
      seq.remove();
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
test("Finished Sequence Tests", function () {
  
  var expects = 2, 
      count = 0;

  expect(expects);

  function plus() { 
    if ( ++count === expects ) {
      start(); 
      seq.remove();
    }
  }    
  stop(360000);


  var seq = Popcorn.sequence( "video-sequence-a", remoteMediaList );

  seq.listen( "pause", function() {
 
    if ( seq.active === seq.playlist.length - 1 && seq.playlist[seq.active].media.currentTime >  seq.inOuts.ofVideos[seq.active].in ) {
      equal( Math.floor(seq.playlist[ seq.active ].media.currentTime), seq.inOuts.ofVideos[ seq.active ].out, "The sequence had ended at the correct time" );
      plus();
      equal( seq.active, seq.playlist.length -1, "The last video clip is displayed" );
      plus();
    }
  });
  
  seq.listen( "loadedmetadata", function( event ) {
    seq.play();
  });

});


module("Custom Events");
test("listen(Custom)/trigger(Custom)", function () {
  
  var expects = 4;

  expect(expects);
  
  var seq = Popcorn.sequence( "video-sequence-b", mixedSourceList );


  // unamed function expression
  seq.listen("foo", function( event, data ) {

    equal( event.type, "foo", "Custom Event `foo` fired");
    same( data, { a: "alpha" }, "Correct data was passed to callback, " + JSON.stringify({ a: "alpha" }) );

  }).trigger("foo", { a: "alpha" });

  
  // named function expression
  function barFn( event, data ) {
    equal( event.type, "bar", "Custom Event `bar` fired");
    same( data, { b: "beta" }, "Correct data was passed to callback, " + JSON.stringify({ b: "beta" }) );

    seq.remove();
  }

  seq.listen("bar", barFn).trigger("bar", { b: "beta" });

});

module("Event Hooks");
test("Cycle", function () {
  
  var expects = mixedSourceList.length - 1, 
      count = 0, index = 0;

  expect(expects * 3);
  
  function plus() { 
    if ( ++count === expects * 3 ) {
      start(); 
      seq.remove();
    }
  }

  stop(60000);

 
  var seq = Popcorn.sequence( "video-sequence-b", mixedSourceList );


  seq.listen( "canplaythrough", function( event ) {

    seq.listen("cycle", function( event, data ) {

      //console.log( "cycle: ", event, data );

      equal( data.position.previous, index, "previous position matches index counter" );
      plus();

      index++;
      
      equal( data.position.current, index, "current position matches incremented index counter" );
      plus();

      equal( event.type, "cycle", "cycle event: " + index );
      plus();

      
    });

    seq.play(); 
  }); 

});

module("Plugin Support");
test("Implementation", function() {

  expect( Popcorn.sizeOf(Popcorn.manifest) );

  Popcorn.forEach( Popcorn.manifest, function( obj, plugin ) {
    ok( plugin in Popcorn.sequence.prototype, "Plugin: '"+plugin+"' exists in Popcorn.sequence.prototype" );    
  });  
});

test("Functional", function () {
  
  var expects = 5, 
      count = 0;

  expect(expects);
  
  function plus() { 
    if ( ++count === expects ) {
      start(); 
    }
  }

  stop(35000);

 
  var seq = Popcorn.sequence( "video-sequence-b", mixedSourceList ),
      tests = [
        {
          start: 1, 
          end: seq.duration(),
          text: "this footnote starts at 1s and persists for entire sequence<br>",
          target: "footnote-container"
        }, 
        {
          start: 1, 
          end: seq.duration() - 2,
          text: "this footnote appears at :01 and dissappears 2 seconds before the end of the sequence<br>",
          target: "footnote-container"
        }, 
        {
          start: 5, 
          end: 7,
          text: "this footnote appears at 5s and dissappears at 7s; spanning 1 clip<br>",
          target: "footnote-container"
        }, 
        {
          start: 3, 
          end: 7,
          text: "this footnote appears at 3s and dissappears at 6s; Spanning 2 clips<br>",
          target: "footnote-container"
        }, 
        {
          start: 3, 
          end: 9,
          text: "this footnote appears at 3s and dissappears at 9s; Spanning 3 clips<br>",
          target: "footnote-container"
        }
      ], 
      expecting = [ 2, 5, 3, 1 ], 
      index = 0;


  seq.listen( "canplaythrough", function( event ) {

    equal( seq.duration(), 13, "This sequence is 13 seconds long" );
    plus();

    //console.log( seq, seq.duration() );

    tests.forEach(function( test, idx ) {
      //console.log( test );

      seq.footnote( test );

    });

    seq.listen("cycle", function( event, data ) {
    
      setTimeout(function() {
     
        var visibles = [],
        nodes = document.getElementById("footnote-container").childNodes;

        [].forEach.call( nodes, function( node ) {
          if ( node.style.display !== "none" ) {
            visibles.push(node);
          }
        });

        equal( visibles.length, expecting[ index ], "Visible footnotes: " + expecting[ index ] );
        plus();

        index++;

      }, 1000);

    });


    seq.play();
  }); 

});



