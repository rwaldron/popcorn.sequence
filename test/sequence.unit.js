var mediaList = [
      "assets/snowdriving.ogv",
      "assets/eich.ogv",
      "assets/crockford.ogv"
    ], 
    seqVideos;

module("API");
test("Popcorn.sequence", function() {
  
  expect(2);
  
  ok( Popcorn.sequence, "Popcorn.sequence exists" );
  
  equal( typeof Popcorn.sequence, "function", "Popcorn.sequence() is a function" );
  
});


test("sequence( media, array )", function() {
  
  expect( 13 );
  
  
  var seq = Popcorn.sequence( "video-sequence-a", mediaList );
  

  ok( seq.hasOwnProperty( "dims" ), 'seq.hasOwnProperty( "dims" )' );
  ok( seq.hasOwnProperty( "parent" ), 'seq.hasOwnProperty( "parent" )' );
  ok( seq.hasOwnProperty( "seqId" ), 'seq.hasOwnProperty( "seqId" )' );
  ok( seq.hasOwnProperty( "sequenced" ), 'seq.hasOwnProperty( "sequenced" )' );
  ok( seq.hasOwnProperty( "video" ), 'seq.hasOwnProperty( "video" )' );  
  
  
  equal( typeof seq.dims, "object", 'typeof seq.dims, "object"' );
  equal( typeof seq.get, "function", 'typeof seq.get, "function"' );
  //  TODO write typeof tests for all the own props
  
  
  ok( seq.get( 1 ) instanceof Popcorn, "seq.get( 1 ) instanceof Popcorn" );
  
  
  same( seq.queue.length, mediaList.length, 'Popcorn.sequence( video-sequence-b, mediaList).queue.length returns mediaList.length' );
  
  same( seq.sequenced.length, mediaList.length, 'Popcorn.sequence( video-sequence-b, mediaList).sequenced.length returns mediaList.length' );
  
  seq.sequenced.forEach( function( item ) {
    
    ok( item instanceof Popcorn, "item instanceof Popcorn" );
  
  });
  
  
  
  
  
  console.log(seq);
  console.log(seq.get( 0 ));
  
  
});




module("Sequence");
test("sequenced videos", function() {
    
  expect(1);
  
  
  seqVideos = document.querySelectorAll("video");
  
  equals( seqVideos.length, 3, "3 Videos in the sequence" );

});

module("Transistional");
test("video node dims", function () {
  
  
  /*
  var expects = 2, 
      count = 0;

  expect(expects);
  
  function plus() { 
    
    if ( ++count === expects ) {
      start(); 
    }
  }  
  
  
  stop(3000);


  var $videos = document.querySelectorAll("video"),
      videoA = $videos[0];
 
 
  videoA.addEventListener("canplaythrough", function() {
    
    var foo = document.querySelectorAll("video");
    
    foo[1].addEventListener("play", function() {
        
      
      var dims = {
            width: this.videoWidth,
            height: this.videoHeight
          };

      //console.log(dims.width, videoA.videoWidth);
      //console.log(dims.height, videoA.videoHeight);

      equal( videoA.videoWidth, dims.width, "videoA.videoWidth === dims.width" );
      plus();

      equal( videoA.videoHeight, dims.height, "videoA.videoHeight === dims.height" );
      plus();
      
      

    }, false );
    
  
    videoA.currentTime = videoA.duration;
    
  }, false );


  */  
    
});

