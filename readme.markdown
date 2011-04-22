# sequence.js


A little something like this...

	var sequence = Popcorn.sequence( "container-id", [
			{
				src: "assets/snowdriving.ogv",  
				in: 0, 
				out: 5
			},
			{
				src: "assets/snowdriving.ogv",  
				in: 7,
				out: 10
			},
			{
				src: "assets/snowdriving.ogv",
				in: 3,
				out: 6
			}
		]);


And stuff like this...


	// Return a Popcorn object for "assets/snowdriving.ogv"
	sequence.eq( 0 );

	// Play the sequence	
	sequence.play();

	// Execute a callback at the 4th second in the sequence
	sequence.exec( 4, function() {

	});

	// TODO: Add sequence.listen() example

Todo:

Somehow need to get back to previous videos?
