# sequence.js


A little something like this...

	var sequence = Popcorn.sequence( "video-element-id", [
				  "assets/snowdriving.ogv",
				  "assets/eich.ogv",
				  "assets/crockford.ogv"
				]);


And stuff like this...

	sequence.get( 0 );
	
	// returns a Popcorn object for "assets/snowdriving.ogv"
	

Todo:

Somehow need to get back to previous videos?