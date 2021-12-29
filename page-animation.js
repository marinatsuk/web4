$(function() {
	let config = {
		colorSquare: {
			square1: "red",
			square2: "green"
		},
		sizeSquare: 10,
		buttonsTitle: {
			play: "Play",
			close: "Close",
			reload: "Resume",
			start: "Start anim",
			stop: "Stop anim"
		}
	};
	let size = 10;
	let step1 = 1;
	let step2 = 1;
	
	let directionTo = ['left', 'up', 'right', 'down'];
	let directionFrom = ['right', 'down', 'left', 'up'];

	let length1 = 1;
	let directionIndex1 = 0;
	let direction1 = directionTo;

	let length2 = 1;
	let directionIndex2 = 0;
	let direction2 = directionTo;

	let stopPressed = false;
	let intersectionFlag = false;

	let logIndex = 0;
	let storage = window.localStorage;
	const logList = document.getElementById("log");

	const animationBlock = document.getElementById("animation");
	let blockWidth = 0;
	let blockHeight = 0;
	
	//blockContent_3

	function getProperties() {
		$.ajax({
			url: "get-properties.php"
		})
		.done(function(data){
			config = data;
			console.log(config);
		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			alert(textStatus);
		});		
	}
	

	function random(min,max){
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	function log(logMessage) {
		logIndex++;
		let message = `${logMessage} at ${new Date().toLocaleString()}`;
		storage.setItem(`${logIndex}`, message);	
		
		const li = document.createElement("li");
		li.innerText = message;
		logList.appendChild(li);
	}
	
	function initAnimationContainer() {
		let block = document.getElementById("block3");
		let width = parseInt(window.getComputedStyle(block)
		.getPropertyValue("width")
		.split("px")[0]);

		let height = parseInt(window.getComputedStyle(block)
		.getPropertyValue("min-height")
		.split("px")[0]);

		animationBlock.style.width = (width*1 - 10).toFixed() + 'px';
		animationBlock.style.height = (height*1 - 50).toFixed() + 'px';

		blockWidth = parseInt(window.getComputedStyle(animationBlock).getPropertyValue("width").split("px")[0])-10;
		blockHeight = parseInt(window.getComputedStyle(animationBlock).getPropertyValue("height").split("px")[0])-10;
	}
	function reportWindowSize() {
		initAnimationContainer();
	}	  
	window.addEventListener('resize', reportWindowSize);
	initAnimationContainer();

	function init() {
		getProperties();

		$("#start").val(config.buttonsTitle['start']);
		$("#stop").val(config.buttonsTitle['stop']);
		$("#reload").val(config.buttonsTitle['reload']);
		$("#play").val(config.buttonsTitle['play']);
		$("#close").val(config.buttonsTitle['close']);		
	}

	function initialSquare(name, color) {
		let el = document.getElementById(name);
		if (el == null) {
			el = document.createElement("div");
			el.id = name;
			el.style.width = config.sizeSquare + 'px';
			el.style.height = config.sizeSquare + 'px';
			el.style.backgroundColor = config.colorSquare[name];
		}		
		el.style.marginLeft = random(1, blockWidth) + 'px';
		el.style.marginTop = random(1, blockHeight) + 'px';		
		
		animationBlock.append(el);
	}

	function move() {
		setTimeout(() => {
			let topStr1 = window.getComputedStyle(document.getElementById("square1")).getPropertyValue('margin-top');
			let x1 = parseInt(topStr1.split("px")[0]);

			let topStr2 = window.getComputedStyle(document.getElementById("square2")).getPropertyValue('margin-top');
			let x2 = parseInt(topStr2.split("px")[0]);

			let leftStr1 = window.getComputedStyle(document.getElementById("square1")).getPropertyValue('margin-left');
			let y1 = parseInt(leftStr1.split("px")[0]);

			let leftStr2 = window.getComputedStyle(document.getElementById("square2")).getPropertyValue('margin-left');
			let y2 = parseInt(leftStr2.split("px")[0]);

			const dLeft = y1 - y2;
			const dTop = x1 - x2;
			const distance = Math.sqrt(dLeft * dLeft + dTop * dTop);			

			if (distance > size) intersectionFlag = false;

			if (distance <= size && !intersectionFlag) {
				intersectionFlag = true;
				log("Animation intersection.");
				stop();
				return 1;
			}
			
			let changeSquare2 = changeSquare1 = false;
			if (
				(y1 <= 0 || y1 >= blockWidth - size)
				||
				(x1 <= 0 || x1 >= blockHeight - size)
			 ) {
				direction1 = direction1[0] == directionTo[0] ? directionFrom : directionTo;
				length1 = 1;
				initialSquare('square1');
				changeSquare1 = true;
			}
			if (
				(y2 <= 0 || y2 >= blockWidth - size) 
				||
				(x2 <= 0 || x2 >= blockHeight - size)
			) {		
				direction2 = direction2[0] == directionTo[0] ? directionFrom : directionTo;
				length2 = 1;
				initialSquare('square2');
				changeSquare2 = true;		
			}	

			if (!changeSquare1 && !changeSquare2) {
				switch (direction1[directionIndex1]) {
					case 'left':
						y1 -= length1;					
						break;
	
					case 'right':
						y1 += length1;
						break;
	
					case 'up':
						x1 -= length1;
						break;
	
					case 'down':
						x1 += length1;
						break;
				}	
				
				switch (direction2[directionIndex2]) {
					case 'left':
						y2 -= length2;					
						break;
	
					case 'right':
						y2 += length2;
						break;
	
					case 'up':
						x2 -= length2;					
						break;
	
					case 'down':
						x2 += length2;
						break;
				}	
	
				x1 = x1 <= 0 ? 0 : x1;
				y1 = y1 <= 0 ? 0 : y1;
				x2 = x2 <= 0 ? 0 : x2;
				y2 = y2 <= 0 ? 0 : y2;
					
				length1 += step1;
				directionIndex1 = directionIndex1 >= direction1.length ? 0 : directionIndex1+1;
							
				length2 += step2;			
				directionIndex2 = directionIndex2 >= direction2.length ? 0 : directionIndex2+1;						
	
				document.getElementById("square1").style.marginLeft = y1 + "px";
				document.getElementById("square2").style.marginLeft = y2 + "px";
				document.getElementById("square1").style.marginTop = x1 + "px";
				document.getElementById("square2").style.marginTop = x2 + "px";
			}			

			if (!stopPressed) {
				move();
			}
		}, 25)
	}

	function initActions() {
		$("#start").css("display", '');
		$("#start").prop('disabled', '');	

		$("#reload").css("display", 'none');
	}

	function play() {
		$("#work").css("display", "");	
		$("#play").prop('disabled', 'disabled');

		initActions();
		initialSquare('square1', 'red');
		initialSquare('square2', 'green');
		log('Animation show');
	}

	function close() {
		stopPressed = true;
		log('Animation closed');
		
		$("#work").css("display", "none");
		$("#play").prop('disabled', '');
		
		let block = document.getElementById("blockContent_5");
		block.innerText = '';
		for (let i = 1; i <= logIndex; i++) {
			let p = document.createElement("p");
			p.innerHTML = storage.getItem(`${i}`);
			block.appendChild(p);
		}
		logIndex = 0;
		logList.innerHTML = '';
	}

	function start() {
		$("#start").prop('disabled', 'disabled');		

		log('Animation started');
		stopPressed = false;		
		move();
	}	

	function stop() {
		$("#start").css("display", "none");
		$("#reload").css("display", "");

		log("Animation stopped");
		stopPressed = true;		
	}

	function reload() {
		$("#reload").css("display", "none");		
		$("#start").css("display", '');
		$("#start").prop("disabled", '');

		log("Animation resumed");	
		
		initialSquare('square1', 'red');
		initialSquare('square2', 'green');		
	}	

	$('input[name="play"]').click(function(){
		play();		
	});

	$('input[name="close"]').click(function(){
		close();		
	});

	$('input[name="start"]').click(function(){
		start();		
	});

	$('input[name="reload"]').click(function(){
		reload();		
	});

	$('input[name="stop"]').click(function(){
		stop();		
	});	

	init();
});