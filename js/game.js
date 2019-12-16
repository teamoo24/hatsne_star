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

	const player = {
		sX: 35,
		sY: 10,
		w: 70,
		h: 80,
		x: 70,
		y : cvs.height - 112,

		draw: function() {
			ctx.drawImage(hatsne, this.sX, this.sY, this.w, this.h, - this.w/2, - this.h/2, this.w, this.h);
		}

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

	// draw
	function draw() {
		ctx.fillStyle = "#70c5ce";
		ctx.fillRect(0,0, cvs.width, cvs.height)

		player.draw()
		fg.draw()
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