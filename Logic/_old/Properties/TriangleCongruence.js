'use strict';

function TriangleCongruence() {
	this.congruences = [];
	this.searchCongruences = function(obj1, obj2) {
		for (var c = 0; c < this.congruences.length; c += 1) {
			var cong = this.congruences[c];
			if ((cong[0] === obj1 && cong[1] === obj2) ||
				(cong[0] === obj2 && cong[1] === obj1)) {
				return true;
			};
		};
		return false;
	};
	this.addSSSCongruence = function(tri1, tri2, sides1, sides2) {
		if (!this.searchCongruences(tri1, tri2)) {
			this.congruences.push([tri1, tri2, sides1, sides2, 'SSS']);
		};
	};
	/*this.addASACongruences(tri1,tri2,sides1,sides2){
		if(!this.searchCongruences(tri1,tri2)) {
			this.congruences.push([])
		}
	}
	*/
	this.addSASCongruence = function(tri1,tri2,sides1,sides2){
		if(!this.searchCongruences(tri1,tri2)){
			this.congruences.push([tri1,tri2,sides1,sides2,'SAS']);
		}
	}
};

define(function() {
	return TriangleCongruence;
});
