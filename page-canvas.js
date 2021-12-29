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

	let directionTo = ['left', 'up', 'right', 'down'];
	let directionFrom = ['right', 'down', 'left', 'up'];
	
	let stopPressed = false;

	let logIndex = 0;
	let storage = window.localStorage;
	const logList = document.getElementById("log");

	const canvas = document.getElementById("animation");
	const ctx = canvas.getContext('2d');
	const blockWidth = canvas.width;
	const blockHeight = canvas.height;
	const squares = [];

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
	
	function setRandomPlace(square) {
		square.x = random(1, blockWidth);
		square.y = random(1, blockHeight);
	};

	function Square(data) {
		setRandomPlace(this);
		this.color = data.color;
		this.width = data.width;
		this.height = data.height;

		this.direction = directionTo;
		this.directionIndex = 0;
		this.length = 1;
		this.step = 1;
	}

	function initialSquare(name) {
		return new Square({			
			width: config.sizeSquare/2,
			height: config.sizeSquare/2,
			color: config.colorSquare[name]
		});
	}	
	
	Square.prototype.draw = function () {
		ctx.beginPath();
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.width, this.height);
		ctx.fill();
	};

	Square.prototype.update = function () {			
		if (
			(this.y <= 0 || this.y >= blockWidth - this.width)
			||
			(this.x <= 0 || this.x >= blockHeight - this.height)
			) {
			this.direction = this.direction[0] == directionTo[0] ? directionFrom : directionTo;
			this.length = 1;

			setRandomPlace(this);					
		}

		switch (this.direction[this.directionIndex]) {
			case 'left':
				this.y -= this.length;					
				break;

			case 'right':
				this.y += this.length;
				break;

			case 'up':
				this.x -= this.length;
				break;

			case 'down':
				this.x += this.length;
				break;
		}	
		this.x = this.x <= 0 ? 0 : (this.x > blockHeight ? blockHeight : this.x);
		this.y = this.y <= 0 ? 0 : (this.y > blockWidth ? blockWidth : this.y);
			
		this.length += this.step;
		this.directionIndex = this.directionIndex >= this.direction.length ? 0 : this.directionIndex+1;				
	};

	Square.prototype.collisionDetect = function () {
		for (let j = 0; j < squares.length; j++) {
			if (!(this === squares[j])) {
				const dx = this.x - squares[j].x;
				const dy = this.y - squares[j].y;
				const distance = Math.sqrt(dx * dx + dy * dy);
				if (distance <= this.width) {
					log("Collision");
					stop();					
				}
			}
		}
	};	

	function move() {
		ctx.clearRect(0, 0, blockWidth, blockHeight);
		for (let i = 0; i < squares.length; i++) {
			squares[i].draw();
			console.log(stopPressed)
			if (!stopPressed) {
				squares[i].update();
				squares[i].collisionDetect();
			}
		}
		window.setTimeout(function() {
			requestAnimationFrame(move);
		}, 55);		
	}

	function init() {
		getProperties();

		squares.push(initialSquare('square1'));
		squares.push(initialSquare('square2'));
		for (let i = 0; i < squares.length; i++) {
			squares[i].draw();
		}	

		$("#start").val(config.buttonsTitle['start']);
		$("#stop").val(config.buttonsTitle['stop']);
		$("#reload").val(config.buttonsTitle['reload']);
		$("#play").val(config.buttonsTitle['play']);
		$("#close").val(config.buttonsTitle['close']);		
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
		for (let i = 0; i < squares.length; i++) {
			setRandomPlace(squares[i]);
		}
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
		
		for (let i = 0; i < squares.length; i++) {
			setRandomPlace(squares[i]);
		}		
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