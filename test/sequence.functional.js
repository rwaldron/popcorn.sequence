(function( global, Popcorn ) {
})( this, Popcorn );




$(function() {


  var clips = [
        { 
          src: "assets/snowdriving.ogv", 
          in: 10,
          out: 13
        }, 
        {
          src: "assets/eich.ogv",
          in: 8, 
          out: 11
        }, 
        {
          src: "assets/crockford.ogv", 
          in: 3,
          out: 6
        }
      ],  
      $seq;

  $seq = Popcorn.sequence( "seq-fixture", clips );


  $seq.play();


  window.$seq = $seq;

});
