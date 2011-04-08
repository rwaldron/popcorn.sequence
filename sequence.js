//  Requires Popcorn.js
(function( global, Popcorn ) {

	//	TODO: as support increases, migrate to element.dataset 
  
  var doc = global.document, 
      rprotocol = /:\/\//, 
      //  TODO: better solution to this sucky stop-gap
      lochref = location.href.replace( location.href.split("/").slice(-1)[0], "" );

  Popcorn.sequence = function( place, list ) {
    return new Popcorn.sequence.init( place, list );
  };
 
  Popcorn.sequence.init = function( place, list ) {
    
    //  Video element
    this.place = doc.getElementById( place );
    
    //  Store ref to a special ID
    this.seqId = Popcorn.guid( "__sequenced" );

    //  Create the queue
    this.queue = [];

    //  Create the clips
    this.clips = [];
    
    //  Create the Popcorn object list
    this.playlist = [];
    
    //  Create dimensions store    
    this.dims = {
      width: 0, //this.video.videoWidth,
      height: 0 //this.video.videoHeight
    };

    this.active = 0;

    var self = this;

    //  Create `video` elements
    Popcorn.forEach( list, function( media, idx ) {
      
      var video = doc.createElement( "video" ), 

      		//	Context sensitive callbacks
          loadedMetaData = function( event ) {

          	var target = event.srcElement;

            //  If no out point was set for this clip, set it to the duration of the video
            self.clips[ idx ].out = ( !self.clips[ idx ].out && target.duration ) || self.clips[ idx ].out;

            //  If this is idx zero, use it as dimension for all
            if ( !idx ) {
              self.dims.width = event.srcElement.videoWidth;
              self.dims.height = event.srcElement.videoHeight;
            }
            
            video.removeEventListener( "loadedmetadata", loadedMetaData, false );
          }, 
          canPlayThrough = function( event ) {

            self.queue[ idx ].currentTime = self.clips[ idx ].in;

            self.queue[ idx ].setAttribute("data-sequence-id", [ self.clips[ idx ].in, self.clips[ idx ].out ].join(":") );

            video.removeEventListener( "canplaythrough", canPlayThrough, false );
          };


      //  Setup newly created video element
      video.controls = true;

      //  If the first, show it, if the after, hide it
      video.style.display = ( idx && "none" ) || "" ;

      //  Seta registered sequence id
      video.id = self.seqId + "-" + idx ;

      //  Push this video into the sequence queue
      self.queue.push( video );

      //  Push the in/out points into sequence clips
      self.clips.push({ 
        in: ( "in" in media ) && media.in || 0,
        out: ( "out" in media ) && media.out || 0,  
      });

      //  Append the video to the place holder element
      self.place.appendChild( video );

      //  Set the sources
      video.src = !rprotocol.test( media.src ) ? lochref + media.src : media.src;

      //  Set some squence specific data vars
      video.setAttribute("data-sequence-owner", place );
      video.setAttribute("data-sequence-guid", self.seqId );
      video.setAttribute("data-sequence-id", idx );
      
      //  Hook up event listeners for managing special playback 
      video.addEventListener( "loadedmetadata", loadedMetaData, false);

      video.addEventListener( "canplaythrough", canPlayThrough, false );

      video.addEventListener( "play", function( event ) {

        var target = event.srcElement;
        
        if ( target.currentTime >= self.clips[ idx ].out || 
        			target.currentTime < self.clips[ idx ].in  ) {

//setAttribute("data-sequence-id"
          console.log( "target play event", target, target.currentTime, self.clips[ idx ].out );
          target.currentTime =  self.clips[ idx ].in;
        }

      }, false );

			video.addEventListener( "timeupdate", function( event ) {

				var target = event.srcElement, 
						;
				
				if ( target.currentTime >= )
				
			}, false );
			
      video.addEventListener( "ended", function( event ) {

      	console.log( event.srcElement.src );

        var nextId = 0, 
        		next, clip;

        //  Update to current correct dimensions
        if ( !self.dims.width ) {
          self.dims.width = self.dims.width || media.videoWidth;
          self.dims.height = self.dims.height || media.videoHeight;
        }

        Popcorn.sequence.cycle( self.queue, self.clips, idx );

      }, false);

      //  Add a Popcorn object instance to the 
      //  playlist video list
      self.playlist.push( Popcorn("#" + video.id) );

    });

    return this;
  };

  Popcorn.sequence.init.prototype = Popcorn.sequence.prototype;

  Popcorn.sequence.cycle = function( queue, clips, currentIdx ) {

		var current = queue[ currentIdx ], 
				nextIdx, next, clip;


    if ( queue[ currentIdx + 1 ] ) {
      nextIdx = currentIdx + 1;
    }

    //  Reset queue
    if ( !queue[ currentIdx + 1 ] ) {
      nextIdx = 0;
    }

		next = queue[ nextIdx ];
		clip = clips[ nextIdx ];


    //  Hide the currently ending video
    current.style.display = "none";

//    //  Constrain dimentions
//    Popcorn.extend( next, {
//      width: self.dims.width, 
//      height: self.dims.height
//    });

    //  Show the next video in the sequence    
    next.style.display = "";

    //  When not resetting to 0
    if ( !!nextIdx ) {

			next.currentTime = clip.in;
    
      //  Play the next video in the sequence
			next.play();
    }

    //  When reseting to first video
    if ( !nextId ) {
      //  Reset currentTime to 0
      next.currentTime = clip.in;
    }
  
  };

  //  Sequence object prototype
  Popcorn.extend( Popcorn.sequence.prototype, {

    //  Returns Popcorn object from sequence at index
    eq: function( idx ) {
      return this.playlist[ idx ];
    }, 
    
    //  Returns sum duration for all videos in sequence
    duration: function() {
      
      var ret = 0, 
          seq = this.playlist;
      
      for ( var i = 0; i < seq.length; i++ ) {
        ret += seq[ i ].video.duration;
      }
      
      return ret;
    }, 

    play: function() {

      console.log( this );
   
    }, 
    
    //  Binds event handlers that fire only when all 
    //  videos in sequence have heard the event
    listen: function( type, callback ) {
      
      var seq = this.playlist,
          total = seq.length, 
          count = 0;
      
      Popcorn.forEach( seq, function( video ) {
      
        video.listen( type, function( event ) {
          
          if ( ++count === total ) {
            callback && callback.call( video, event )
          }
          
        });
      });
    }
  });

  
})( this, Popcorn );
