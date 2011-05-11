(function( global, Popcorn ) {
})( this, Popcorn );




$(function() {


  var clips = [], 
      $seq;

  // Creat 100 3 second clips
  for ( var i = 0; i < 100; i++ ) {

    var rand = Math.floor( Math.random() * 30 );

//    test junk
//    $("<video>", {
//      src: "",
//      css: {
//        width: "300px", 
//        height: "200px"
//      }
//    }).appendTo("#seq-fixture");

    clips.push({
      src: "http://www.tubeyloops.com/tubeyloops/startrek.theora.ogv",
      in: rand,
      out: rand + 3
    });
  
  }

  $seq = Popcorn.sequence( "seq-fixture", clips );
  $seq.play();
  // expose for inspection
  window.$seq = $seq;
});
