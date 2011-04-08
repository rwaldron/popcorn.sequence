//  Requires Popcorn.js
(function( global, Popcorn ) {

  //  TODO: as support increases, migrate to element.dataset 
  
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
    this.cycling = false;
    this.playing = false;

    this.times = {
      last: 0
    };

    var self = this;

    //  Create `video` elements
    Popcorn.forEach( list, function( media, idx ) {
      
      var video = doc.createElement( "video" );


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
        in: ( "in" in media ) && media.in || 1,
        out: ( "out" in media ) && media.out || 0,  
      });

      self.clips[ idx ].out = self.clips[ idx ].out || self.clips[ idx ].in + 2;
      
      //  Set the sources
      video.src = !rprotocol.test( media.src ) ? lochref + media.src : media.src;

      //  Set some squence specific data vars
      video.setAttribute("data-sequence-owner", place );
      video.setAttribute("data-sequence-guid", self.seqId );
      video.setAttribute("data-sequence-id", idx );
      video.setAttribute("data-sequence-clip", [ self.clips[ idx ].in, self.clips[ idx ].out ].join(":") );

      //  Append the video to the place holder element
      self.place.appendChild( video );
      

      self.playlist.push( Popcorn("#" + video.id ) );      

    });

    Popcorn.forEach( this.queue, function( media, idx ) {

      var //  Context sensitive callbacks
          canPlayThrough = function( event ) {

            var target = event.srcElement;
            
            media.play();

            setTimeout(function() {
              media.pause();
            }, 100);

            //  If this is idx zero, use it as dimension for all
            if ( !idx ) {
              self.dims.width = media.videoWidth;
              self.dims.height = media.videoHeight;
            }
            
            media.currentTime = self.clips[ idx ].in - .5;

            media.removeEventListener( "canplaythrough", canPlayThrough, false );
          };


      //  Hook up event listeners for managing special playback 
      media.addEventListener( "canplaythrough", canPlayThrough, false );


      //  TODO: consolidate & DRY
      media.addEventListener( "play", function( event ) {

        self.playing = true;
        
      }, false );

      media.addEventListener( "pause", function( event ) {

        self.playing = false;

      }, false );      

      media.addEventListener( "timeupdate", function( event ) {

        var target = event.srcElement, 
            seqIdx = +target.dataset.sequenceId, 
            round = Math.round( media.currentTime );


        console.log( seqIdx, self.active, seqIdx === self.active );

        if ( self.times.last !== round && 
              seqIdx === self.active ) {

          self.times.last = round;
          
          if ( round === self.clips[ seqIdx ].out + 1 ) {

            console.log( "apptempting", idx, target.dataset, self.active );          

            Popcorn.sequence.cycle.call( self, seqIdx );
          }
          //if (  )

            
  //        if ( ( ceil < self.clips[ idx ].in || 
  //                 floor >= self.clips[ idx ].out ) && !self.cycling && self.playing ) {
/*
          if ( floor >= self.clips[ idx ].out && !self.cycling ) {

            self.cycling = true;

            if ( idx !== self.active ) {
              return;
            }

            console.log( "apptempting", idx, target.dataset, self.active );          
          
            Popcorn.sequence.cycle.call( self, idx );

          } else {
*/
  //          //console.log( idx, "timeupdate event, could not cycle" );
  //          //console.log( idx, "in", ceil < self.clips[ idx ].in, ceil, self.clips[ idx ].in );
  //          //console.log( idx, "out", ceil >= self.clips[ idx ].out, ceil, self.clips[ idx ].out );
  //          //console.log( !self.cycling, self.playing );

//          }
        }        
      }, false );
    });

    return this;
  };

  Popcorn.sequence.init.prototype = Popcorn.sequence.prototype;

  Popcorn.sequence.cycle = function( idx ) {

    ////console.log( seq, idx );

    var queue = this.queue, 
        clips = this.clips, 
        current = queue[ idx ], 
        nextIdx = 0, 
        next, clip, $pop;


    if ( queue[ idx + 1 ] ) {
      nextIdx = idx + 1;
    }

    //  Reset queue
    if ( !queue[ idx + 1 ] ) {
      nextIdx = 0;
    }

    next = queue[ nextIdx ];
    clip = clips[ nextIdx ];

    //  Constrain dimentions
    Popcorn.extend( next, {
      width: this.dims.width, 
      height: this.dims.height
    });

    //  Hide the currently ending video
    current.style.display = "none";
    //  Show the next video in the sequence    
    next.style.display = "";

    $popnext = this.playlist[ nextIdx ];
    //  When not resetting to 0
    //if ( !!nextIdx ) {

      current.pause();

      this.active = nextIdx;
      this.times.last = clip.in - 1;


      //  Play the next video in the sequence
      $popnext.currentTime( clip.in );

      console.log( $popnext.video.readyState );
      

      $popnext.play();

      

      //next.play();
      
      this.cycling = false;
    //}

    //  When reseting to first video
    if ( !nextIdx ) {
      //  Reset currentTime to 0
      //next.currentTime = clip.in;
    }
  
  };

  //  Sequence object prototype
  Popcorn.extend( Popcorn.sequence.prototype, {

    //  Returns Popcorn object from sequence at index
    eq: function( idx ) {
      return this.playlist[ idx ];
    }, 
    
    //  Returns sum duration for all videos in sequence
    duration: function( clips ) {
      
      var ret = 0, 
          seq = this.playlist;
      
      for ( var i = 0; i < seq.length; i++ ) {
        if ( !clips ) {
          ret += seq[ i ].video.duration;
        } else {
          ret += this.clips[ i ].out - this.clips[ i ].in;
        }
      }

      return ret;
    },

    play: function() {

      //console.log( this );

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
