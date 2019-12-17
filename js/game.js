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

	//Load sprite image
	const sprite = new Image();
	sprite.src = "./img/sprite.png"

	//Load Hatsne image
	const hatsne = new Image();
	hatsne.src = "./img/hatsne.png"

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
			console.log(this.x)
			this.oldx =x
			this.x = x
		},
		update: function() {
			if(state.current == state.getReady){
				this.y = 150
			} else {}
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

	// draw
	function draw() {
		ctx.fillStyle = "#fff";
		ctx.fillRect(0,0, cvs.width, cvs.height)

		fg.draw()
		player.draw()
		getReady.draw()
		gameOver.draw()
	}
	// update
	function update() {

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