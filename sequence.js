/*!
 * Popcorn.sequence
 *
 * Copyright 2011, Rick Waldron
 * Licensed under MIT license.
 *
 */


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

    this.offs = [];
    
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

    var self = this, 
        clipOffset = 0;

    //  Create `video` elements
    Popcorn.forEach( list, function( media, idx ) {

      var video = doc.createElement( "video" );

      video.preload = "auto";

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
        "in": ( "in" in media ) && media.in || 1,
        "out": ( "out" in media ) && media.out || 0
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

    self.clips.forEach(function( obj ) {

      var clipDuration = obj.out - obj.in, 
          offs = {
            "in": clipOffset,
            "out": clipOffset + clipDuration
          };

      self.offs.push( offs );
      
      clipOffset = offs.out + 1;
    });

    Popcorn.forEach( this.queue, function( media, idx ) {

      var //  Context sensitive callbacks
      canPlayThrough = function( event ) {

        var target = event.srcElement || event.target;

        //  If this is idx zero, use it as dimension for all
        if ( !idx ) {
          self.dims.width = media.videoWidth;
          self.dims.height = media.videoHeight;
        }
        
        media.currentTime = self.clips[ idx ].in - 0.5;

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

        var target = event.srcElement || event.target, 
            seqIdx = +( target.dataset && target.dataset.sequenceId || target.getAttribute("data-sequence-id") ), 
            round = Math.round( media.currentTime );

        if ( self.times.last !== round && 
              seqIdx === self.active ) {

          self.times.last = round;
          
          if ( round === self.clips[ seqIdx ].out + 1 ) {

            Popcorn.sequence.cycle.call( self, seqIdx );
          }
        }        
      }, false );
    });

    return this;
  };

  Popcorn.sequence.init.prototype = Popcorn.sequence.prototype;

  Popcorn.sequence.cycle = function( idx ) {

    ////console.log( seq, idx );

    var //  Localized array references
    queue = this.queue, 
    clips = this.clips, 
    current = queue[ idx ], 
    nextIdx = 0, 
    next, clip, $pop;

    
    var //  Popcorn instances
    $popnext, 
    $popprev;


    if ( queue[ idx + 1 ] ) {
      nextIdx = idx + 1;
    }

    //  Reset queue
    if ( !queue[ idx + 1 ] ) {
      nextIdx = 0;
      this.playlist[idx].pause();
    } else {
    
      next = queue[ nextIdx ];
      clip = clips[ nextIdx ];

      //  Constrain dimentions
      Popcorn.extend( next, {
        width: this.dims.width, 
        height: this.dims.height
      });

      $popnext = this.playlist[ nextIdx ];
      $popprev = this.playlist[ idx ];

      //  When not resetting to 0
      current.pause();

      this.active = nextIdx;
      this.times.last = clip.in - 1;

      //  Play the next video in the sequence
      $popnext.currentTime( clip.in );

      $popnext[ nextIdx ? "play" : "pause" ]();

      //  Set the previous back to it's beginning time
      $popprev.currentTime( clips[ idx ].in );

      if ( nextIdx ) {
        //  Hide the currently ending video
        current.style.display = "none";
        //  Show the next video in the sequence    
        next.style.display = "";    
      }

      this.cycling = false;

      //  When reseting to first video
      if ( !nextIdx ) {
        //  Reset currentTime to 0
        //next.currentTime = clip.in;
      }
    }
  };

  var excludes = [ "timeupdate", "play", "pause" ];
  
  //  Sequence object prototype
  Popcorn.extend( Popcorn.sequence.prototype, {

    //  Returns Popcorn object from sequence at index
    eq: function( idx ) {
      return this.playlist[ idx ];
    }, 
    //  Returns Clip object from sequence at index
    clip: function( idx ) {
      return this.clips[ idx ];
    },
    //  Returns sum duration for all videos in sequence
    duration: function( clips ) {

      var ret = 0, 
          seq = this.playlist;
      
      for ( var i = 0; i < seq.length; i++ ) {
        ret += this.clips[ i ].out - this.clips[ i ].in;
      }

      return ret;
    },

    play: function() {

      this.playlist[ this.active ].play();

      return this;
    },
    //  Attach an event to a single point in time
    exec: function ( time, fn ) {

      var self = this, 
          index = this.active, 
          offsetBy;
      
      this.offs.forEach(function( off, idx ) {
        if ( time >= off.in && time <= off.out ) {
          index = idx;
        }
      });

      //offsetBy = time - self.clips[ index ].in;
      
      time += this.clips[ index ].in - this.offs[ index ].in;

      //  Creating a one second track event with an empty end
      Popcorn.addTrackEvent( this.playlist[ index ], {
        start: time,
        end: time + 1,
        _running: false,
        _natives: {
          start: fn || Popcorn.nop,
          end: Popcorn.nop,
          type: "exec"
        }
      });

      return this;
    },
    //  Binds event handlers that fire only when all 
    //  videos in sequence have heard the event
    listen: function( type, callback ) {

      var self = this, 
          seq = this.playlist,
          total = seq.length, 
          count = 0;

      Popcorn.forEach( seq, function( video ) {

        video.listen( type, function( event ) {

          event.active = self;
          
          if ( excludes.indexOf( type ) > -1 ) {

            callback && callback.call( video, event );

          } else {
            if ( ++count === total ) {
              callback && callback.call( video, event );
            }
          }
        });
      });
    }
  });

})( this, Popcorn );
