var mediaList = [
  "assets/snowdriving.ogv",
  "assets/eich.ogv",
  "assets/crockford.ogv"
];

test("Popcorn.sequence", function() {
  
  expect(2);
  
  ok( Popcorn.sequence, "Popcorn.sequence exists" );
  
  equal( typeof Popcorn.sequence, "function", "Popcorn.sequence() is a function" );
  
});


test("sequence( media, array )", function() {
  
  expect(1);
  
  same( Popcorn.sequence( "video-sequence-a", mediaList ).queue.length, mediaList.length, 'Popcorn.sequence( video-sequence-b, mediaList) returns mediaList' )


});


test("sequenced videos", function() {
    
  expect(2);
  
  
  console.log(document.querySelectorAll("video")[0]);
  var dims = {
        width: document.querySelectorAll("video")[0].style.width,
        height: document.querySelectorAll("video")[0].style.height
      };

  console.log(dims);
  equals( document.querySelectorAll("video").length, 3, "3 Videos in the sequence" );
  //equals( document.querySelectorAll("video[width='']").length, 3, "3 Videos in the sequence" );
  
  ok(true, "foo")

});

