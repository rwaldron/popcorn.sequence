(function( global, Popcorn ) {
})( this, Popcorn );




$(function() {


  var clips = [
      {
        src: "http://ia600102.us.archive.org/23/items/HotNumber/HotNumber_512kb.mp4", 
        in: 0, 
        out: 5
      },
      {
        src: "http://ia600208.us.archive.org/5/items/Brunette_2/Brunette_2_512kb.mp4", 
        in: 7,
        out: 10
      },
      {
        src: "assets/snowdriving.ogv",
        in: 3,
        out: 6
      },
      {
        src: "http://ia600208.us.archive.org/0/items/Blonde_2/Blonde_2_512kb.mp4",
        in: 20,
        out: 22
      },
      {
        src: "http://ia600400.us.archive.org/8/items/TripDownMarketStreetrBeforeTheFire/TripDownMktStreet_clean_512kb.mp4",
        in: 2,
        out: 6
      }
    ],
    $seq;

  $seq = Popcorn.sequence( "seq-fixture", clips );


  $seq.play();

	// expose for inspection
  window.$seq = $seq;

});
