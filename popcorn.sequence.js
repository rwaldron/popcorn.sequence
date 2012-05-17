/*!
 * Popcorn.sequence
 *
 * Copyright 2011, Rick Waldron
 * Licensed under MIT license.
 *
 */

/* jslint forin: true, maxerr: 50, indent: 4, es5: true  */
/* global Popcorn: true */

// Requires Popcorn.js
(function( global, Popcorn ) {

  // TODO: as support increases, migrate to element.dataset
  var doc = global.document,
      location = global.location,
      rprotocol = /:\/\//,
      // TODO: better solution to this sucky stop-gap
      lochref = location.href.replace( location.href.split("/").slice(-1)[0], "" ),
      // privately held
      range = function(start, stop, step) {

        start = start || 0;
        stop = ( stop || start || 0 ) + 1;
        step = step || 1;

        var len = Math.ceil((stop - start) / step) || 0,
            idx = 0,
            range = [];

        range.length = len;

        while (idx < len) {
         range[idx++] = start;
         start += step;
        }
        return range;
      };

  Popcorn.sequence = function( parent, list ) {
    return new Popcorn.sequence.init( parent, list );
  };

  Popcorn.sequence.init = function( parent, list ) {

    // Video element
    this.parent = doc.getElementById( parent );

    // Store ref to a special ID
    this.seqId = Popcorn.guid( "__sequenced" );

    // List of HTMLVideoElements
    this.queue = [];

    // List of Popcorn objects
    this.playlist = [];

    // Lists of in/out points
    this.inOuts = {

      // Stores the video in/out times for each video in sequence
      ofVideos: [],

      // Stores the clip in/out times for each clip in sequences
      ofClips: []

    };

    // Store first video dimensions
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

    // Store event pointers and queues
    this.events = {

    };

    var self = this,
        clipOffset = 0;

    // Create `video` elements
    Popcorn.forEach( list, function( media, idx ) {

      var video = doc.createElement( "video" );

      video.preload = "auto";

      // Setup newly created video element
      video.controls = true;

      // If the first, show it, if the after, hide it
      video.style.display = ( idx && "none" ) || "" ;

      // Seta registered sequence id
      video.id = self.seqId + "-" + idx ;

      // Push this video into the sequence queue
      self.queue.push( video );

      var //satisfy lint
       mIn = media["in"],
       mOut = media["out"];

      // Push the in/out points into sequence ioVideos
      self.inOuts.ofVideos.push({
        "in": mIn !== undefined && typeof mIn === "number" ?  mIn : 1,
        "out": mOut !== undefined && typeof mOut === "number" ? mOut : 0
      });

      self.inOuts.ofVideos[ idx ]["out"] = self.inOuts.ofVideos[ idx ]["out"] || self.inOuts.ofVideos[ idx ]["in"] + 2;

      // Set the sources
      video.src = !rprotocol.test( media.src ) ? lochref + media.src : media.src;

      // Set some squence specific data vars
      video.setAttribute("data-sequence-owner", parent );
      video.setAttribute("data-sequence-guid", self.seqId );
      video.setAttribute("data-sequence-id", idx );
      video.setAttribute("data-sequence-clip", [ self.inOuts.ofVideos[ idx ]["in"], self.inOuts.ofVideos[ idx ]["out"] ].join(":") );

      // Append the video to the parent element
      self.parent.appendChild( video );


      self.playlist.push( Popcorn("#" + video.id ) );

    });

    self.inOuts.ofVideos.forEach(function( obj ) {

      var clipDuration = obj["out"] - obj["in"],
          offs = {
            "in": clipOffset,
            "out": clipOffset + clipDuration
          };

      self.inOuts.ofClips.push( offs );

      clipOffset = offs["out"];
    });

    Popcorn.forEach( this.queue, function( media, idx ) {

      function canPlayThrough( event ) {

        // If this is idx zero, use it as dimension for all
        if ( !idx ) {
          self.dims.width = media.videoWidth;
          self.dims.height = media.videoHeight;
        }

        // -0.2 prevents trackEvents from firing when they trigger on a clips in value
        media.currentTime = self.inOuts.ofVideos[ idx ]["in"] - 0.2;

        media.removeEventListener( "canplaythrough", canPlayThrough, false );

        return true;
      }

      // Hook up event oners for managing special playback
      media.addEventListener( "canplaythrough", canPlayThrough, false );

      // TODO: consolidate & DRY
      media.addEventListener( "play", function( event ) {

        self.playing = true;

      }, false );

      media.addEventListener( "pause", function( event ) {

        self.playing = false;

      }, false );

      media.addEventListener( "timeupdate", function( event ) {

        var target = event.srcElement || event.target,
            seqIdx = +(  (target.dataset && target.dataset.sequenceId) || target.getAttribute("data-sequence-id") ),
            floor = Math.floor( media.currentTime );

        if ( self.times.last !== floor &&
              seqIdx === self.active ) {

          self.times.last = floor;

          if ( floor === self.inOuts.ofVideos[ seqIdx ]["out"] ) {

            Popcorn.sequence.cycle.call( self, seqIdx );
          }
        }
      }, false );

      media.addEventListener( "ended", function( event ) {

        var target = event.srcElement || event.target,
            seqIdx = +(  (target.dataset && target.dataset.sequenceId) || target.getAttribute("data-sequence-id") );

        Popcorn.sequence.cycle.call( self, seqIdx );
      }, false );
    });

    return this;
  };

  Popcorn.sequence.init.prototype = Popcorn.sequence.prototype;

  Popcorn.sequence.cycle = function( fromIdx, toIdx ) {

    if ( !this.queue ) {
      Popcorn.error("Popcorn.sequence.cycle is not a public method");
    }

    // no cycle needed, bail
    if ( fromIdx === toIdx ) {
      return this;
    }

    // Localize references
    var queue = this.queue,
        ioVideos = this.inOuts.ofVideos,
        current = queue[ fromIdx ],
        nextIdx, next, clip;

    // Popcorn instances
    var $popnext,
        $popprev;

    nextIdx = typeof toIdx === "number" ? toIdx : fromIdx + 1;

    // Reset queue
    if ( !queue[ nextIdx ] ) {

      nextIdx = 0;
      this.playlist[ fromIdx ].pause();

    } else {

      next = queue[ nextIdx ];
      clip = ioVideos[ nextIdx ];

      // Constrain dimentions
      Popcorn.extend( next, {
        width: this.dims.width,
        height: this.dims.height
      });

      $popnext = this.playlist[ nextIdx ];
      $popprev = this.playlist[ fromIdx ];

      current.pause();

      this.active = nextIdx;
      this.times.last = clip["in"] - 1;

      // Play the next video in the sequence
      $popnext.currentTime( clip["in"] );

      $popnext.play();

      // Trigger custom cycling event hook
      this.trigger( "cycle", {

        position: {
          previous: fromIdx,
          current: nextIdx
        }

      });

      // Hide the currently ending video
      current.style.display = "none";
      // Show the next video in the sequence
      next.style.display = "";

      this.cycling = false;
    }

    return this;
  };

  var excludes = [ "timeupdate", "play", "pause" ];

  // Sequence object prototype
  Popcorn.extend( Popcorn.sequence.prototype, {

    // Returns Popcorn object from sequence at index
    eq: function( idx ) {
      return this.playlist[ idx ];
    },
    // Remove a sequence from it's playback display container
    remove: function() {
      this.parent.innerHTML = null;
    },
    // Returns Clip object from sequence at index
    clip: function( idx ) {
      return this.inOuts.ofVideos[ idx ];
    },
    // Returns sum duration for all videos in sequence
    duration: function() {

      var ret = 0,
          seq = this.inOuts.ofClips,
          idx = 0;

      for ( ; idx < seq.length; idx++ ) {
        ret += seq[ idx ]["out"] - seq[ idx ]["in"];
      }

      return ret;
    },

    play: function() {

      if ( ( ( this.queue.length - 1 ) === this.active ) &&
           ( this.inOuts[ "ofVideos" ][ this.active ][ "out" ] >= Math.round( this.queue[ this.active ].currentTime ) ) )
      {
        this.jumpTo( 0 );
      } else {
        this.queue[ this.active ].play();
      }

      return this;
    },
    // Pause the sequence
    pause: function() {

      this.queue[ this.active ].pause();

      return this;

    },
    // Attach an event to a single point in time
    cue: function ( time, fn ) {

      var index = this.active;

      this.inOuts.ofClips.forEach(function( off, idx ) {
        if ( time >= off["in"] && time <= off["out"] ) {
          index = idx;
        }
      });

      //offsetBy = time - self.inOuts.ofVideos[ index ].in;

      time += this.inOuts.ofVideos[ index ]["in"] - this.inOuts.ofClips[ index ]["in"];

      // Cue up the callback on the correct popcorn instance
      this.playlist[ index ].cue( time, fn );

      return this;
    },
    // Binds event handlers that fire only when all
    // videos in sequence have heard the event
    on: function( type, callback ) {

      var self = this,
          seq = this.playlist,
          total = seq.length,
          count = 0,
          fnName;

      if ( !callback ) {
        callback = Popcorn.nop;
      }

      // Handling for DOM and Media events
      if ( Popcorn.Events.Natives.indexOf( type ) > -1 ) {
        Popcorn.forEach( seq, function( video ) {

          video.on( type, function( event ) {

            event.active = self;

            if ( excludes.indexOf( type ) > -1 ) {

              callback.call( video, event );

            } else {
              if ( ++count === total ) {
                callback.call( video, event );
              }
            }
          });
        });
      } else {

        // If no events registered with this name, create a cache
        if ( !this.events[ type ] ) {
          this.events[ type ] = {};
        }

        // Normalize a callback name key
        fnName = callback.name || Popcorn.guid( "__" + type );

        // Store in event cache
        this.events[ type ][ fnName ] = callback;
      }

      // Return the sequence object
      return this;
    },
    off: function( type, name ) {

      var seq = this.playlist;

      if ( Popcorn.Events.Natives.indexOf( type ) > -1 ) {
        Popcorn.forEach( seq, function( video ) {
          video.off( type, name );
        });
      } else {

        this.events[ type ] = null;
      }

      return this;
    },
    emit: function( type, data ) {
      var self = this;

      // Handling for DOM and Media events
      if ( Popcorn.Events.Natives.indexOf( type ) > -1 ) {
        //  find the active video and trigger api events on that video.
        return;
      } else {
        // Only proceed if there are events of this type
        // currently registered on the sequence
        if ( this.events[ type ] ) {
          Popcorn.forEach( this.events[ type ], function( callback, name ) {
            callback.call( self, { type: type }, data );
          });
        }
      }
      return this;
    },
    currentTime: function() {
      var index = this.active,
          currentTime = 0;

      this.inOuts.ofClips.forEach(function( off, idx ) {
        if ( idx < index ) {
          currentTime += this.inOuts.ofVideos[ idx ]["out"] - this.inOuts.ofVideos[ idx ]["in"];
        }
      }, this );
      currentTime += this.playlist[ index ].currentTime() - this.inOuts.ofVideos[ index ]["in"];
      return currentTime;
    },
    jumpTo: function( time ) {

      if ( time < 0 || time > this.duration() ) {
        return this;
      }

      var index, found, real, curInOuts;
          offsetTime = 0;

      found = false;

      this.inOuts.ofClips.forEach(function( off, idx ) {
        var inOuts = this.inOuts;
        if ( !found ) {
          if ( (time >= inOuts.ofClips[ idx ]["in"] &&
                time <= inOuts.ofClips[ idx ]["out"]) ) {

            found = true;
            index = idx;
            real = ( time - offsetTime ) + inOuts.ofVideos[ idx ]["in"];
          } else {
            offsetTime += inOuts.ofClips[ idx ]["out"] - offsetTime;
          }
        }
      }, this );
      Popcorn.sequence.cycle.call( this, this.active, index );
      curInOuts = this.inOuts.ofVideos[ index ]

      // Jump to the calculated time in the clip, making sure it's in the correct range
      this.playlist[ index ].currentTime( real >= curInOuts["in"] && real <= curInOuts["out"] ? real : curInOuts["in"] );

      return this;
    }
  });

  [ ["exec", "cue"], ["listen", "on"], ["unlisten", "off"], ["trigger", "emit"] ].forEach(function( remap ) {

    Popcorn.sequence.prototype[ remap[0] ] = Popcorn.sequence.prototype[ remap[1] ];
  })

  Popcorn.forEach( Popcorn.manifest, function( obj, plugin ) {

    // Implement passthrough methods to plugins
    Popcorn.sequence.prototype[ plugin ] = function( options ) {

      var videos = {}, assignTo = [],
          idx, off, inOuts, inIdx, outIdx,
          keys, clip, clipInOut, clipRange;

      for ( idx = 0; idx < this.inOuts.ofClips.length; idx++  ) {
        // store reference
        off = this.inOuts.ofClips[ idx ];
        // array to test against
        inOuts = range( off["in"], off["out"] );

        inIdx = inOuts.indexOf( options.start );
        outIdx = inOuts.indexOf( options.end );

        if ( inIdx > -1 ) {
          videos[ idx ] = Popcorn.extend( {}, off, {
            start: inOuts[ inIdx ],
            clipIdx: inIdx
          });
        }

        if ( outIdx > -1 ) {
          videos[ idx ] = Popcorn.extend( {}, off, {
            end: inOuts[ outIdx ],
            clipIdx: outIdx
          });
        }
      }

      keys = Object.keys( videos ).map(function( val ) {
                return +val;
              });

      assignTo = range( keys[ 0 ], keys[ 1 ] );

      for ( idx = 0; idx < assignTo.length; idx++ ) {

        var compile = {},
        play = assignTo[ idx ],
        vClip = videos[ play ];

        if ( vClip ) {
          // has instructions
          clip = this.inOuts.ofVideos[ play ];
          clipInOut = vClip.clipIdx;
          clipRange = range( clip["in"], clip["out"] );

          if ( vClip.start ) {
            compile.start = clipRange[ clipInOut ];
            compile.end = clipRange[ clipRange.length - 1 ];
          }

          if ( vClip.end ) {
            compile.start = clipRange[ 0 ];
            compile.end = clipRange[ clipInOut ];
          }
        } else {
          compile.start = this.inOuts.ofVideos[ play ]["in"];
          compile.end = this.inOuts.ofVideos[ play ]["out"];
        }

        // Call the plugin on the appropriate Popcorn object in the playlist
        // Merge original options object & compiled (start/end) object into
        // a new object
        this.playlist[ play ][ plugin ](
          Popcorn.extend( {}, options, compile )
        );
      }
      // Return the sequence object
      return this;
    };
  });
})( this, Popcorn );
