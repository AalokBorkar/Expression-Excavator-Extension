$(document).ready(function() {
	var searchList = []; //content side search list
	chrome.storage.local.set({'localSearchList': JSON.stringify(searchList)}, function(){ //init the localsearch list
		console.log('searchList created');
	});


	chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

		if( request.message === "start-search" ) { //search for the words the user has inputted in the searchList: user will think its only updating the search to include latest word
				searchList = JSON.parse(request.data);
				chrome.storage.local.set({'localSearchList': JSON.stringify(searchList)}, function(){
					console.log('local storage searchList updated');
				});
				chrome.storage.local.get('localSearchList', function (query) {
					console.log('The current local storage searchList copy: ' + query.localSearchList);
				});

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

        else if( request.message === "delete" ) { //delete specific highlights based off of user click
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

		else if( request.message === "clear" ){ //clear all highlights
			var context = new Mark(document.querySelector('*'));
			context.unmark();
		}

		else if( request.message === "fetch-local-storage" ){ //popup is reopening and fetching data cached in local storage

			console.log('Booting up popup...');
			var responseData;
			chrome.storage.local.get('localSearchList', function(query){ //returns string of the data
        		responseData = query.localSearchList;
      			console.log('The data being sent over via the content.js pipeline: ' + typeof responseData + "  ===  " + responseData);
			    sendResponse({message: "local-storage-data", data: responseData}); // <- pass responseData to then()
    		}); //fetch the local storage data 

		}

		return true;
	});

});