$(document).ready(function() {

	var searchList; //content side search list

	chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

		if( request.message === "start-search" ) { //if a search was requested
				searchList = JSON.parse(request.data);
				var context = new Mark(document.querySelector('*'));
				context.unmark();

				var i;
				var word;
				var options;

				for(i =0; i< searchList.length; i++){ //for each word
					options = {
				    	element: "span",
			    		className: (searchList[i].id),  //so we can remember which words correspond to which search-word - trying to add two classes
				    	exclude: [
				       		".search-word" //exclude the search word tiles created through user input
				   		]
					};

					word = searchList[i].word;
					context.mark(word, options); //mark my words
					$(document).find('.'+searchList[i].id).attr('id', 'found_'+searchList[i].color) //append the color to actually highlight it in that color based off of the ID assigned to it
				}
        }

        else if( request.message === "delete" ) {
			//Clear the page of any highlights with the given id (request.id) which is the id from the corresponding tile that was just removed
			var classSearch = request.id;
			var unHighlightList = document.getElementsByClassName(classSearch);
			var ab;
			var i;
			console.log(unHighlightList);

			$(unHighlightList).each(function(){
				console.log('unhighlighting words...');
				$(this).attr('id', 'NA'); //reset - disconnect the wrapped word from the button associated with it
				$(this).attr('class', 'NA'); //the span holding these will be deleted anyways upon re-searching (unmark)
			});

		}


	});


});