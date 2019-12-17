window.onload = function(){
	// 定数を宣言するconstとは？
	// constとは値書き換えを禁止した変数を宣言する方法
	// 例えば同じ値を使い回す場合、うっかり途中で値が書き換わってしまったりすることを防止するため
	// 書き換えようとすると思わぬバグが出る

	// letはvarと同じように変数を宣言する時に使う
	// しかしvarとは違い、letを使うと変数のスコープが「ブロックに限定」される。
	/*
	ex)ソース
		let num = 123;
		console.log(num);
		{
		    let num = 456;
		    console.log(num);
		}
		console.log(num);

	ex)実行結果
		123
		456
		123
	*/

	// select canvas
	const cvs = document.getElementById("mycanvas")
	const ctx = cvs.getContext("2d");

	// game vars and conts
	let frames = 0;

	//Load sprite image
	const sprite = new Image();
	sprite.src = "./img/sprite.png"

	//Load Hatsne image
	const hatsne = new Image();
	hatsne.src = "./img/hatsne.png"

	//Load Star image
	const star_sprite = new Image();
	star_sprite.src = "./img/star.png"

	//bgm_play
	const BGM = new Audio();
	BGM.src = "./audio/bgm/bgm.mp3"
	BGM.loop = true;

	// GAME STATE
	const state = {
		current : 0,
		getReady : 0,
		game : 1,
		over : 2
	}
	// CONTROL THE GAME
	document.addEventListener("click", function(evt){
		switch(state.current) {
			case state.getReady:
				state.current = state.game;
				break;
			case state.over:
				state.current = state.getReady;
				break;

		}
	});
	document.addEventListener("mousemove", function(evt){
		if(state.current == state.game) {
			var mousePos = getMousePosition(cvs, evt);
			player.move(mousePos)
		}
	});

	function getMousePosition(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };
    }


	const fg = {
		sX : 276,
		sY : 0,
		w : 224,
		h : 112,
		x : 0,
		y : cvs.height - 112,

		draw : function () {
			ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
			ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);
		}
	}

	const star = {
		position : [],
		animation : [
		{sX:0, sY:0},
		{sX:32, sY:0},
		{sX:65, sY:0},
		{sX:97, sY:0},
		],
		w:24,
		h:24,
		dy:2,

		draw: function(){

			let period = Math.ceil(frames/10)
			let star = this.animation[period%4]

					

			for(let i = 0; i < this.position.length; i++) {
				let p = this.position[i];

				ctx.drawImage(star_sprite, star.sX, star.sY, this.w, this.h, p.x, p.y, this.w, this.h);
			
			}
		},
		update: function(){
			if(state.current !== state.game) {
				return;
			}

			if(frames%100 == 0) {
				this.position.push({
					x : Math.random()*(cvs.width - this.w),
					y : 0
				})
			}

			for(let i = 0; i <this.position.length; i++) {
				let p = this.position[i];

				console.log("player.x < p.x : " + (player.x < p.x))
				console.log("player.x + player.w > p.x : " + (player.x + player.w > p.x))

				if(
					// 左
					player.x - player.w/2< p.x 
					// 右
					&& player.x + player.w/3 > p.x
					// 上
					&& cvs.height - fg.h > p.y 
					// 下
					&& cvs.height - fg.h - player.h - this.h/2 < p.y ) {
					state.current = state.over;
				}

				
				p.y += this.dy;

				// if the pipes go beyond canvas, we delete them from canvas
				if(p.y >= cvs.height - fg.h) {
					this.position.shift();
					score.value +=1;
				}
			}
		}


	}

	const player = {
		animation : [
			{sX: 0, sY: 0}, //this.animation[0]
			{sX: 0, sY: 77}, //this.animation[1]
		],

		x: 50,
		y : 150,
		w: 67,
		h: 77,
		oldx : 0,

		frame: 0,

		draw: function() {
			let player = this.animation[this.frame];

			ctx.save();
			ctx.translate(this.x, fg.y);
			ctx.drawImage(hatsne, player.sX, player.sY, this.w, this.h, - this.w/2, - this.h, this.w, this.h);
			ctx.restore();
		},
		move: function(e) {
			var x = e.x;
			if(x > this.oldx) {
				this.frame = 0;
			} else if(x < this.oldx) {
				this.frame = 1;
			}
			this.oldx =x
			this.x = x
		},
		update: function() {
			if(state.current == state.getReady){
				this.y = 150
			} else {}
		}
	}

	//SCORE
	const score = {
		value : 0,

		draw : function() {
			ctx.fillStyle = "#fff";
			ctx.strokeStyle = "#000";


			if(state.current == state.game) {
				ctx.lineWidth = 2;
				ctx.font = "35px Teko";
				ctx.fillText(this.value, cvs.width/2, 50);
				ctx.strokeText(this.value, cvs.width/2, 50);

			} else if(state.current == state.over){
				// SCORE VALUE
				ctx.font = "25px Teko"
				ctx.fillText(this.value, 225, 186);
				ctx.strokeText(this.value, 225, 186);
				// BEST VALUE
				ctx.fillText(this.best, 225, 228);
				ctx.strokeText(this.best, 225, 228);
			}
		} 
	}

	const getReady = {
		sX : 0,
		sY : 228,
		w : 173,
		h : 152,
		x : cvs.width/2 - 173/2,
		y : 80,

		draw: function() {
			if(state.current == state.getReady) {
				ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
			}
		}
	}

	const gameOver = {
		sX : 175,
		sY : 228,
		w : 225,
		h : 202,
		x : cvs.width/2 - 225/2,
		y : 90,

		draw: function() {
			if(state.current == state.over) {
				ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
			}
		}
	}

	function sound_control() {
		switch(state.current) {
			case state.getReady:
				BGM.load();
				break;
			case state.game:
				BGM.play();
				break;
			case state.over:
				BGM.pause();
				break;
		}
	}

	// draw
	function draw() {
		ctx.fillStyle = "#fff";
		ctx.fillRect(0,0, cvs.width, cvs.height)

		fg.draw()
		player.draw()
		star.draw()
		getReady.draw()
		gameOver.draw()
		score.draw()
	}
	// update
	function update() {
		star.update()
		sound_control()
	}
	//loop
	function loop() {
		update();
		draw();
		frames++;

		requestAnimationFrame(loop)
	}

	loop()
}