(function( global, Popcorn ) {
})( this, Popcorn );




$(function() {


	var localMediaObjs = [
		    { 
		    	src: "assets/snowdriving.ogv", 
		    	in: 22
		    }, 
		    {
		    	src: "assets/eich.ogv",
		    	in: 5, 
		    	out: 10
		    }, 
		    {
					src: "assets/crockford.ogv", 
					out: 10
		    }
		  ],  
			$seq;

	$seq = Popcorn.sequence( "seq-fixture", localMediaObjs );


	$seq.play();

	window.$seq = $seq;

});
