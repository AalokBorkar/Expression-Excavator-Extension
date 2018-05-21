$(document).ready(function() {
	var placementId = 0;
	var searchList = [];

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

			$('.display-array').append(newWord); //append the child to the DOM

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


// == S E A R C H I N G    F O R    W O R D S   
	$('.search').click(function(){ //when the search button is clicked
		//message content.js to innit the search and begin highlighting
		console.log(searchList);
		chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
			var aa;
	  		var activeTab = tabs[0];

	  		var jsonSearchList = JSON.stringify(searchList);
			chrome.tabs.sendMessage(activeTab.id, {message: "start-search", data: jsonSearchList});
		});
	});


// == H O V E R    O V E R    W O R D - S E A R C H    T I L E   
	$('.search-word').mouseover(function(){
		null;

	});

});