
module.exports = {

	shuffle: function (a) {
		for (let i = a.length - 1; i > 0; i--) {
			let j = Math.floor(Math.random() * (i + 1));
			let x = a[i];
			a[i] = a[j];
			a[j] = x;
		}
	},

	randomstr: function (length) {
		let str = '';
		for(let i = 0; i < length; i++){
			let rand = Math.floor(Math.random() * 62);
			if(rand >= 0 && rand <= 25){
				rand += 0x41;
			}else if(rand <= 51){
				rand -= 26;
				rand += 0x61;
			}else{
				rand -= 52;
				rand += 0x30;
			}
			str += String.fromCharCode(rand);
		}

		return str;
	},

};
