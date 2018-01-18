'use strict';

class Vector {
	constructor(x = 0, y = 0){
		this.x = x;
		this.y = y;
	}
	plus(vector){
	  if (!(vector instanceof Vector)){
	    throw new Error (`Можно прибавлять к вектору только вектор типа Vector`);
	  }
	  let addX = this.x + vector.x;
	  let addY = this.y + vector.y;
	  return new Vector (addX, addY);
	}
	times (factor){
	  let addX = this.x * factor;
	  let addY = this.y * factor;
	  return new Vector (addX, addY);
	}
}

class Actor {
	constructor(position = new Vector(), size = new Vector (1, 1), speed = new Vector()){
		if (!(position instanceof Vector) ||
			!(size instanceof Vector)||
			!(speed instanceof Vector) ){
			 	throw new Error (`не объект типа Vector`);
		}
		this.pos = position;
		this.size = size;
		this.speed = speed;
	}
	act (){}
	get type(){return  'actor';}
	get left(){return this.pos.x;}
	get right(){return this.pos.x + this.size.x;}
	get top(){return this.pos.y;}
	get bottom(){return this.pos.y + this.size.y}
	isIntersect (otherActor){
		if (!(otherActor instanceof Actor)){
	    	throw new Error (`не объект типа Actor`);
	  	}
	 	if (this === otherActor){return false}
		if (this.right > otherActor.left &&
			this.left < otherActor.right &&
			this.top < otherActor.bottom &&
			this.bottom > otherActor.top){
			return true;
		}
		return false;
	}	
}

