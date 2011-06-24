(function( global, Popcorn ) {
})( this, Popcorn );




$(function() {


  var 
		useOgv = document.createElement("video").canPlayType("video/ogg") === "maybe" && 
									!document.createElement("video").canPlayType("video/mp4"), 

		useType = useOgv && ".ogv" || ".webm",

		srcVideo = "http://videos.mozilla.org/serv/webmademovies/popcorntest" + useType,

  	clips = [
      {
        src: srcVideo,  
        in: 0, 
        out: 5
      },
      {
        src: srcVideo,  
        in: 7,
        out: 10
      },
      {
        src: "assets/snowdriving.ogv",
        in: 3,
        out: 6
      },
      {
        src: srcVideo, 
        in: 20,
        out: 22
      },
      {
        src: "http://ia600400.us.archive.org/8/items/TripDownMarketStreetrBeforeTheFire/TripDownMktStreet_clean" + useType, 
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
