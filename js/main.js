$(function() {
	
	var blackScore = 0;
	var redScore = 0;
	var activeColour = 'unclaimed';
	var gameOn = false;
	var gameLength = 3600000;
	var gameComplete = 0;
	var muteState = 0;
	var scoreInterval = 20000; // number of milliseconds between each point

	// audio 
	var audioblackTakeover = document.createElement('audio');
    audioblackTakeover.setAttribute('src', 'audio/black-takeover.mp3');
    audioblackTakeover.setAttribute('preload', 'auto');

    var audioRedTakeover = document.createElement('audio');
    audioRedTakeover.setAttribute('src', 'audio/red-takeover.mp3');
    audioRedTakeover.setAttribute('preload', 'auto'); 

    var audioblackScore = document.createElement('audio');
    audioblackScore.setAttribute('src', 'audio/blackscore.mp3');
    audioblackScore.setAttribute('preload', 'auto');

    var audioRedScore = document.createElement('audio');
    audioRedScore.setAttribute('src', 'audio/redscore.mp3');
    audioRedScore.setAttribute('preload', 'auto');
 
    var audioGameOver = document.createElement('audio');
    audioGameOver.setAttribute('src', 'audio/gameover.mp3');
    audioGameOver.setAttribute('loop', true);
    audioGameOver.setAttribute('preload', 'auto');

    var audioClick = document.createElement('audio');
    audioClick.setAttribute('src', 'audio/click.mp3');
    audioClick.setAttribute('preload', 'auto');

    var audioCGameBegin = document.createElement('audio');
    audioCGameBegin.setAttribute('src', 'audio/gamebegin.mp3');
    audioCGameBegin.setAttribute('preload', 'auto');

	$("#black").click(function(){
		handleClick('black');
		audioblackTakeover.play();
	});

	$("#red").click(function(){
		handleClick('red');
		audioRedTakeover.play();
	});

	$(".reset").click(function(){
		audioGameOver.pause()
		muteState = 0;
		pauseOff()
		audioClick.play()
		gameOn = false;		
		gameComplete = 0;
		blackScore = 0;
		redScore = 0;
		activeColour = 'unclaimed';
		$('#gameOver').slideUp();
		$("#timer").html('');
		$("#lengthSet, #startTimer").slideDown();
		setLCD();
	});

	$('#mute').click(function(){
		
		muteState = 1;
		audioGameOver.pause();

	});

	$('#pause').click(function(){

		console.log(gameComplete)

		$(this).toggleClass('on');

		if (gameComplete == 0){
			pauseOn();
		} 
		else {
			pauseOff();
		}

		console.log(gameComplete)
	})

	function pauseOff(){
		gameComplete = 0;
		$('#pause').html('Pause: OFF')
		$('#pause').removeClass('on');
	}
	function pauseOn(){
		gameComplete = 1;
		$('#pause').html('Pause: ON')
		$('#pause').addClass('on');
	}


	$("#startTimer").click(function(){
		audioCGameBegin.play();
		gameOn = true;
		gameLength = $('#gameLength').val();		
		$("#lengthSet, #startTimer").slideUp();
	});

	$('#settingsBtn').click(function(){
		$('#settings').slideToggle();
		audioClick.play()
	})

	setInterval(assignPoints, scoreInterval);

	function handleClick(colour){
		activeColour = colour;
		setLCD( colour );
		cookieSet();
	}

	function assignPoints(){

		if(gameComplete !== 1){
			
			
			progress( (scoreInterval/1000), (scoreInterval/1000), $('#progressBar')); 
			
			if(activeColour == 'black'){
				blackScore = blackScore+1;
				audioblackScore.play();
				cookieSet();
			}
			else if(activeColour == 'red'){
				redScore = redScore+1;
				audioRedScore.play();
				cookieSet();
			}
			else {
				// do nothing
			}
			$("#red").html(redScore);
			$("#black").html(blackScore);			
			console.log(activeColour + " " +blackScore);
		}
	}

	function setLCD( team ){		
		$("#lcd").removeClass();
		if(team == null){
			$("#lcd").html('unclaimed');
			$("#progressBar div").removeClass("red");
			$("#progressBar div").removeClass("black");
		} else {
			$("#lcd").html(team);
			$("#progressBar div").removeClass("red");
			$("#progressBar div").removeClass("black");
			$("#progressBar div").addClass(team);
			$("#lcd").addClass(team);
		}
		
	}

	function cookieSet(){
		$.cookie("red", red);
		$.cookie("black", black);
		$.cookie("activeColour", activeColour);
	}

	// TIMED GAMES 

	// Update the count down every 1 second
	var x = setInterval(function() {

		if(gameOn){
				// Find the gameLength between now and the count down date

			  // Time calculations for days, hours, minutes and seconds	  
			  var hours = Math.floor((gameLength % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
			  var minutes = Math.floor((gameLength % (1000 * 60 * 60)) / (1000 * 60));
			  var seconds = Math.floor((gameLength % (1000 * 60)) / 1000);

			  // Output the result in an element with id="demo"
			  $("#timer").html(hours + "h " + minutes + "m " + seconds + "s ");

			   // GAME OVER
			  if (gameLength < 0) {
			  	//clearInterval(x); 	
			    $("#timer").html("Game Over");
			    if(muteState !==1){
			    	audioGameOver.play() 
			    }			    
			    $('#gameOver').slideDown();
			    gameComplete = 1;

			}

			gameLength = gameLength - 1000;

		}

	}, 1000);
	
	
	// Progressbar
	function progress(timeleft, timetotal, $element) {
		var progressBarWidth = timeleft * $element.width() / timetotal;
		
		if(timeleft !== 0){
			$element.find('div').animate({ width: progressBarWidth }, 200).html(Math.floor(timeleft/60) + ":"+ timeleft%60);
		}
		
		if(timeleft > 0) {
			setTimeout(function() {
				progress(timeleft - 1, timetotal, $element);
			}, 1000);
		}
	};

	

//end progress bar

	
});


