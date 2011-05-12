# Popcorn: Sequence.js

### Create video clip sequences that playback seamlessly

-------------------------
Contributions should follow these guidelines:
https://gist.github.com/793649


-------------------------
Usage:

	var sequence = Popcorn.sequence( 
					"container-id", 
					[
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


Sequences implement the following methods:





	// Return a Popcorn object for "assets/snowdriving.ogv"

	sequence.eq( 0 );



	// Play the sequence	

	sequence.play();



	// Execute a callback at the 4th second in the sequence

	sequence.exec( 4, function() {

	});



	// Listen for an event in the sequence

	sequence.listen( eventName, function() {

		// canplaythrough, loadedmetadata, loadeddata events will fire only when all clips have fired 
		// timeupdate, play, pause will fire on the currently active clip

	});



	// TODO: Add sequence.listen() example


## For seamless playback, besure to wrap playback in a "canplaythrough" event callback

Todo:



Somehow need to get back to previous videos?
