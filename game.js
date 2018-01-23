'use strict';

class Vector{
	constructor(x = 0, y = 0){ //координаты по оси X и по оси Y
		this.x = x;
		this.y = y;
	}
	plus(vector){
	  if (!(vector instanceof Vector)){
	    throw new Error (`Vector: Можно прибавлять к вектору только вектор типа Vector`);
	  }
	  let addX = this.x + vector.x;
	  let addY = this.y + vector.y;
	  return new Vector (addX, addY); //Создает и возвращает новый объект типа Vector, с новыми координатами
	}
	times(factor){
	  let addX = this.x * factor;
	  let addY = this.y * factor;
	   return new Vector (addX, addY); //Создает и возвращает новый объект типа Vector, с новыми координатами
	}
}

class Actor{
	constructor(position = new Vector(), size = new Vector (1, 1), speed = new Vector()){
		if (!(position instanceof Vector) ||
			!(size instanceof Vector)||
			!(speed instanceof Vector) ){
			 	throw new Error (`Actor: не объект типа Vector`);
		}
		this.pos = position;
		this.size = size;
		this.speed = speed;
	}
	act(){}
	get type(){return 'actor';}
	get left(){return this.pos.x;} //границы объекта по осям
	get right(){return this.pos.x + this.size.x;} //границы объекта по осям
	get top(){return this.pos.y;} //границы объекта по осям
	get bottom(){return this.pos.y + this.size.y} //границы объекта по осям
	isIntersect (otherActor){ //Метод проверяет, пересекается ли текущий объект с переданным объектом.
		if (!(otherActor instanceof Actor)){
	    	throw new Error (`Actor:isIntersect: не объект типа Actor`);
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

class Level{
	constructor(grid, actors){
		if (Array.isArray(grid)){
			this.grid = grid.slice();  //копия массива
			this.height = this.grid.length; // высота = длине массива
			if(this.grid.some((el) => Array.isArray(el))){ //Проверяем, элементы массива поусловию, заданному в передаваемой функции.
				this.width = this.grid.sort(function(a, b) {return b.length - a.length;})[0].length;
			}else {
				this.width = 1;
			}
		}else{
			this.height = 0;
			this.width = 0;
		}		
		this.status = null;
		this.finishDelay = 1;
		this.actors = actors;
		if (this.actors) {
            this.player = this.actors.find(function (actor) {
                return actor.type === 'player';
            });
        }
	}
	isFinished(){
		return this.status !== null && this.finishDelay < 0;
	}
	actorAt(actor){
		if (!(actor instanceof Actor)){
	    	throw new Error (`Level:actorAt: не объект типа Actor`);
	  	}else if (this.actors === undefined){
	  		return undefined;
	  	}
	    for (let actorEl of this.actors) {
            if (actorEl.isIntersect(actor)) {
                return actorEl;
            }
        }
	}
	obstacleAt(position, size){
		if (!(position instanceof Vector) ||
			!(size instanceof Vector)){
			 	throw new Error (`Level:obstacleAt: не объект типа Vector`);
		}

		const borderLeft = Math.floor(position.x);
		const borderRight = Math.ceil(position.x + size.x);
		const borderTop = Math.floor(position.y);
		const borderBottom = Math.ceil(position.y + size.y);

		if (borderLeft < 0 || borderRight > this.width || borderTop < 0) {
			return 'wall';
        } else if (borderBottom > this.height) {
            return 'lava';
        }
    
        for (let y = borderTop; y < borderBottom; y++)
        	for (let x = borderLeft; x < borderRight; x++)
        		if (this.grid[y][x])
        			return this.grid[y][x];

	}
	removeActor(actor){
		 let actorIndex = this.actors.indexOf(actor);
		 this.actors.splice(actorIndex, 1);
	}
	noMoreActors(type){
		if (Array.isArray(this.actors)){
			return (!this.actors.find(actor => actor.type === type));
		}
		return true;

	}
	playerTouched(touchedType, actor){
		if (this.status === null){
			if(['lava', 'fireball'].some((el) => el === touchedType)){
                this.status = 'lost';
            } else if (touchedType === 'coin' && actor.type === 'coin')  {
            	this.removeActor(actor);
            	if (this.noMoreActors('coin')){
            		this.status = 'won'
            	}
            }
         
        }
    }
}




class LevelParser {
	constructor(letterDictionary){
		this.letterDictionary = letterDictionary;
	}
	actorFromSymbol(letter){
		if (typeof letter !== 'string' || !this.letterDictionary){
			return undefined;
		}
		return this.letterDictionary[letter];

	}
	obstacleFromSymbol(letter){
		if (letter === 'x'){return 'wall'}
		if (letter === '!'){return 'lava'}

	}
	createGrid(plan){
		if (plan instanceof Actor){
			return;
		}

		let grid = [];
		for (let line of plan){
			let rez = [];
			[...line].forEach((letters) => rez.push(this.obstacleFromSymbol(letters)))
			grid.push(rez);
		}
		return grid;

	}
	createActors(plan){
		if (!Array.isArray(plan)){
			return ;
		}


	}
	parse(){

	}

}

class Fireball extends Actor{
	constructor(position = new Vector(0, 0), speed = new Vector(0, 0)){
		super(position, undefined, speed)

	}
	get type(){return 'fireball';}

	getNextPosition(){

	}
	handleObstacle(){

	}
	act(){

	}

}

class HorizontalFireball extends Fireball{
	constructor(pos){

	}

}

class VerticalFireball  extends Fireball{

}

class FireRain  extends Fireball{

}

class Coin extends Actor{
	constructor(){

	}
	get type(){return 'coin';}
	updateSpring(){

	}
	getSpringVector(){

	}
	getNextPosition(){

	}
	act(){

	}

}

class Player extends Actor{
	constructor(pos){

	}
	get type() {return 'player';}

}
 
 
const actorDict = {
  '@': Player,
  'v': FireRain,
  'o': Coin,
  '=': HorizontalFireball,
  '|': VerticalFireball

}

