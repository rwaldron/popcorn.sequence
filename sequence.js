//  Requires Popcorn.js
(function( global, Popcorn ) {
  
  var doc = global.document, 
      rprotocol = /:\/\//;

  Popcorn.sequence = function( mediaId, list ) {
    return new Popcorn.sequence.init( mediaId, list );
  };
 
  Popcorn.sequence.init = function( mediaId, list ) {
    
    //  Video element
    this.video = doc.getElementById( mediaId );
    
    //  Store ref to a special ID
    this.seqId = Popcorn.guid( "__sequenced"  );
    
    //  Store ref to the video's parent
    this.parent = this.video.parentNode;
    
    //  Create the queue
    this.queue = [];
    
    //  Push the initial target video into the queue
    this.queue.push( this.video );
    
    //  Create the Popcorn object list
    this.playlist = [];
    
    //  Create dimensions store    
    this.dims = {
      width: this.video.videoWidth,
      height: this.video.videoHeight
    };
    
    var self = this;
    
    //  Create `video` elements
    Popcorn.forEach( list, function( src, idx ) {
      
      var media;
      
      if ( !idx ) {
        
        media = self.video;

      } else {
        
        media = doc.createElement( "video" );
        
        media.controls = true;

        media.style.display = "none";
        
        media.id = self.seqId + "-" + idx ;
        
        self.queue.push( media );
        
        self.parent.appendChild( media );
        
      }
      
      media.src = !rprotocol.test( src ) ? location.href + src : src;
      
      media.setAttribute("data-sequence-owner", mediaId );
      media.setAttribute("data-sequence-guid", self.seqId );
      media.setAttribute("data-sequence-id", idx );

    });
    
    //  Listen for cue to switch out videos 
    Popcorn.forEach( this.queue, function( media, idx ) {
      
      
      media.addEventListener( "ended", function() {
      
        var nextId = 0;
      
        //  Update to current correct dimensions        
        if ( !self.dims.width ) {
          self.dims.width = media.videoWidth;
          self.dims.height = media.videoHeight;
        }
      
        if ( self.queue[ idx + 1 ] ) {
          nextId = idx + 1;
        }
        
        //  Reset queue
        if ( !self.queue[ idx + 1 ] ) {
          nextId = 0;
        }
        

        //  Hide the currently ending video
        media.style.display = "none";

        //  Constrain dimentions
        Popcorn.extend( self.queue[ nextId ], {
          width: self.dims.width, 
          height: self.dims.height
        });          

        //  Show the next video in the sequence    
        self.queue[ nextId ].style.display = "";
        
        //  When not resetting to 0
        if ( !!nextId ) {
          //  Play the next video in the sequence
          self.queue[ nextId ].play();
        }
        
        //  When reseting to first video
        if ( !nextId ) {
          //  Reset currentTime to 0
          self.queue[ nextId ].currentTime = 0;
        }
        
      }, false);
      
      //  Add a Popcorn object instance to the 
      //  playlist video list
      self.playlist.push( Popcorn("#" + media.id) );
      
    });
    
    return this;
  };
  
  Popcorn.sequence.init.prototype = Popcorn.sequence.prototype;
  
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