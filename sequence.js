//  Requires Popcorn.js

(function( global, Popcorn ) {
  
  var doc = global.document;



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
        
        self.queue.push( media );
        
        self.parent.appendChild( media );
        
      }
      
      media.src = location.href + src;
      
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
        

        //  Hide the currently finished video
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
        
      }, false);
    });
    
    return this;
  };

  
})( this, Popcorn );