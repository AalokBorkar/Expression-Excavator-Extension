$(document).ready(function() {
	var placementId = 0;
	var searchList = [];


//initial bootup == if there is local data: retrieve from local storage
	function bootup(){
		chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
			var activeTab = tabs[0];
			chrome.tabs.sendMessage(activeTab.id, {message: "fetch-local-storage"}, function(response){ //callback function upon recieving message from content.js 
				if(response.message === "local-storage-data"){ //initialize our searchList with what he have in local storage
					console.log('Reading the data from local storage (via content.js pipeline)...');
					console.log(response.data);
					//searchList = localData;           //assign the popup's searchList to be the last archived data from local storage (upon first bootup this will be blank / the same as initializing)
				}// NOTE: content.js does not need to get an updated copy of this searchList b/c it will just auto update (replace) itself with popup's searchList upon searching for words 

			});
		});

	}
	bootup(); //do this once at the start


// == S E A R C H I N G    T O    A D D    W O R D S    T O    S E A R C H   L I S T
	function addWord(userWord, userColor){ //append new word 
		var wordAndColorPair = {
			word: userWord,
			color: userColor,
			id: placementId.toString() //keep it as a string so it can be used for highlighted word's class
		}
		searchList.push(wordAndColorPair);
	}

// == C L I C K    T O    A D D    N E W    W O R D    C O L O R    P A I R 
	$('.color-element').click(function(){ //adding new word-color pairs
		var userInput = $('#input-word').val();
		if(userInput !== ''){ //only if user enteres text:
			var newWord = document.createElement("span"); //create a new search word tile

			newWord.classList.add('search-word'); //add the class search-word to it

			var wordTextNode = document.createTextNode(userInput);
			var deleteTextNode = document.createElement('span');
			$(deleteTextNode).attr("class", 'delete');
			deleteTextNode.textContent = 'x';

			newWord.append(wordTextNode);//make its text (node) equal to the user input
			newWord.append(deleteTextNode);

			var colorId = $(this).attr('id'); //set its bacckground color to a copy of the button clicked
			$(newWord).css("background-color", colorId);

			$(newWord).attr('id', placementId); //set this new elements unique ID for delection purposes aalokb

			$('.display-array').append(newWord); //append the child to the DOM (display-array container)

			addWord(userInput, colorId.toString()); //add the word to the search list - increment placementId for future words
			placementId ++;

			$('#input-word').val(''); //reset the input field

			chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
				var aa;
		  		var activeTab = tabs[0];

		  		var jsonSearchList = JSON.stringify(searchList);
				chrome.tabs.sendMessage(activeTab.id, {message: "start-search", data: jsonSearchList});
			});

		}
		else{
			return;
		}
	});


// == D E L E T I N G    W O R D S   
	$(document).on('click', '.search-word', function(){//deleting word-color pairs
		//if clicked on:
		var i;
		for(i =0; i< searchList.length; i++){           //remove element (word-color pair) from search array
			if(searchList[i].id == $(this).attr('id')){
				searchList.splice(i, 1);
			}
		}
		var send_id = $(this).attr('id').toString(); //this buttons' id as a string
		chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
			var aa;
	  		var activeTab = tabs[0];
	  		//alert(send_id);
			chrome.tabs.sendMessage(activeTab.id, {message: "delete", id: send_id});
		});

		$(this).remove(); //remove the actual tile
	});


// == C L E A R   A L L   W O R D S   T O   H I G H L I G H T
	$('.clearAll').click(function(){ //when the search button is clicked
		//clear all highlights from the screen
		chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
			var aa;
	  		var activeTab = tabs[0];
	  		//alert(send_id);
			chrome.tabs.sendMessage(activeTab.id, {message: "clear"});
		});

		//clear all the tiles from the popup
			$(".search-word").remove();


		//clear the array
		searchList = [];
	});


// == H O V E R    O V E R    W O R D - S E A R C H    T I L E   
	/*$('.search-word').mouseover(function(){
		$(this).css('opacity', '0.1');

	});*/

});