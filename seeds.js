var mongoose = require('mongoose');
var Computer = require("./models/computer");
var Comment = require("./models/comment");

var data = [
    {
        name: "Computer 1", 
        image: "https://images.pexels.com/photos/169573/pexels-photo-169573.jpeg?h=350&auto=compress&cs=tinysrgb",
        description: "Blah blah blah"
    },
    {
        name: "Computer 2", 
        image: "https://images.pexels.com/photos/169573/pexels-photo-169573.jpeg?h=350&auto=compress&cs=tinysrgb",
        description: "Blah blah blah"
    },
    {
        name: "Computer 3", 
        image: "https://images.pexels.com/photos/169573/pexels-photo-169573.jpeg?h=350&auto=compress&cs=tinysrgb",
        description: "Blah blah blah"
    }
];

function seedDB(){
	//Remove all computers
	Computer.remove({}, function(err){
	 if(err){
		 	console.log(err)
		 } else {
		 	console.log('removed computers from db...');
			//add a few computers
		 	data.forEach(function(seed){
		 		Computer.create(seed, function(err, computer){
		 			if(err){
		 				console.log(err);
		 			} else {
		 				console.log('added a computer...')
		 				// //create a comment
		 				 Comment.create(
		 				 	{
		 				 		text: 'This computer is great!',
		 				 		author: 'Homer'
		 				 	}, function(err, comment){
		 				 		if(err){
		 							console.log(err);
		 				 		} else{
		 				 			computer.comments.push(comment);
		 			     			computer.save();	
		 				 			console.log('added a comment to computer...')								
		 				 		}
		 				 	});
		 			}
		 		})
		 	});	
		 }
	});

	
	//add a few comments
};


module.exports = seedDB;
