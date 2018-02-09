'use strict';

//класс Vector, который позволяет контролировать расположение объектов в двумерном пространстве 
//и управлять их размером и перемещением.

class Vector {
  constructor(x = 0, y = 0) { //координаты по оси X и по оси Y
    this.x = x;
    this.y = y;
  }

  plus(vector) {
    if (!(vector instanceof Vector)) {
      throw new Error(`В метод plus передан не вектор`);
    }
    const addX = this.x + vector.x;
    const addY = this.y + vector.y;
    return new Vector(addX, addY); //Создает и возвращает новый объект типа Vector, с новыми координатами
  }

  times(factor) {
    const addX = this.x * factor;
    const addY = this.y * factor;
    return new Vector(addX, addY); //Создает и возвращает новый объект типа Vector, с новыми координатами
  }
}

//класс Actor, который позволит контролировать все движущиеся объекты на игровом поле и контролировать их пересечение.
class Actor {
   constructor(position = new Vector(0, 0), size = new Vector(1, 1), speed = new Vector(0, 0)) {
    if (!(position instanceof Vector) ||
      !(size instanceof Vector) ||
      !(speed instanceof Vector)) {
      throw new Error(`В конструктор класса Actor передан не вектор`);
    }
    this.pos = position;
    this.size = size;
    this.speed = speed;
  }

  act() {
  }

  get type() {
    return 'actor';
  }

  get left() {//границы объекта по X
    return this.pos.x;
  }

  get right() {//границы объекта по X + размер
    return this.pos.x + this.size.x;
  }

  get top() { //границы объекта по Y
    return this.pos.y;
  }

  get bottom() { //границы объекта по Y + размер
    return this.pos.y + this.size.y
  }

  isIntersect(otherActor) { //Метод проверяет, пересекается ли текущий объект с переданным объектом.
    if (!(otherActor instanceof Actor)) {
      throw new Error(`В метод isIntersect не передан движущийся объект типа Actor`);
    }
    if (this === otherActor) { // если равен самому себе
      return false;
    }   
    //проверяем, пересекается ли текущий объект с переданным объектом
    return this.right > otherActor.left && 
           this.left < otherActor.right && 
           this.top < otherActor.bottom && 
           this.bottom > otherActor.top;
  }
}

class Level {
  constructor(grid = [0][0], actors = []) { //grid[][] - сетка игрового поля, actors- список движущихся объектов игрового поля
    



    
    // если будет передан не массив то работаь ничего не будет, может быть не стоит обрабатывать такой вариант?
    if (Array.isArray(grid)) {
      this.grid = grid.slice();  //копия массива
      this.height = this.grid.length; // высота = длине массива
      if (this.grid.some((el) => Array.isArray(el))) { //Проверяем, элементы массива по условию, заданному в передаваемой функции. el - массив
        // здесь лучше использовать reduce или Math.max + map 
        // Использовал reduce уровень распарсился немного по другому. Скорее всего даже правильно, по сравнению со старым вариантом
        this.width = this.grid.reduce(function (rez, item) {
          if (rez > item.length) {
            return rez;
          } else {
            return item.length;
          }
        }, 0);
      //---------------------- Math.max + map ----------------------------------//
      //   this.width = Math.max.apply(Math, this.grid.map(function(item) {     //
      //      return item.length;}))                                            //
      //------------------------------------------------------------------------//    
      } else {
        this.width = 1;
      }
    } else {
      this.height = 0;
      this.width = 0;
    }
    this.status = null; // состояние прохождения уровня
    this.finishDelay = 1; //таймаут после окончания игры,


    // лучше создать копию массива
    // делаю копию массива через slice. Все ломается. Тесты не проходит
    this.actors = actors;
    if (this.actors) {
      this.player = this.actors.find(function (actor) { //в списке движущихся объектов ищем player
        return actor.type === 'player';
      });
    }
  }

  isFinished() { //Определяет, завершен ли уровень
    return this.status !== null && this.finishDelay < 0;
  }

  actorAt(actor) { //Определяет, расположен ли какой-то другой движущийся объект в переданной позиции
    if (!(actor instanceof Actor)) {
      throw new Error(`В метод actorAt не передан движущийся объект типа Actor`);
    } else if (this.actors === undefined) { //нет движущихся объектов

      // лучше проверить этот кейс в конструкторе, а не во всех методах, которые используют this.actors
      return undefined;
    }
    




    // тут лучше использовать find
    for (const actorEl of this.actors) {
      if (actorEl.isIntersect(actor)) {
        return actorEl;
      }
    }
  }

  obstacleAt(position, size) { //определяет, нет ли препятствия в указанном месте.
    if (!(position instanceof Vector) ||
      !(size instanceof Vector)) {
      throw new Error(`В метод obstacleAt передан не вектор`);
    }

    const borderLeft = Math.floor(position.x);
    const borderRight = Math.ceil(position.x + size.x);
    const borderTop = Math.floor(position.y);
    const borderBottom = Math.ceil(position.y + size.y);

//Если описанная двумя векторами область выходит за пределы игрового поля, 
//то метод вернет строку lava, если область выступает снизу. 
//И вернет wall в остальных случаях. Будем считать, что игровое поле слева, 
//сверху и справа огорожено стеной и снизу у него смертельная лава.

    if (borderLeft < 0 || borderRight > this.width || borderTop < 0) {
      return 'wall';
    } 
    if (borderBottom > this.height) {
      return 'lava';
    }
    for (let y = borderTop; y < borderBottom; y++) {
      for (let x = borderLeft; x < borderRight; x++) {
        const gridArray = this.grid[y][x];
        if (gridArray) {
          return gridArray;
        }
      }
    }
  }

  removeActor(actor) { // удаляет переданный объект с игрового поля
    const actorIndex = this.actors.indexOf(actor); //возвращает индекс объекта
    if (actorIndex !== -1) {
      this.actors.splice(actorIndex, 1); //удаляем один элемент с найденного индекса.
    }
  }

  noMoreActors(type) { //Определяет, остались ли еще объекты переданного типа на игровом поле
    return !this.actors.some((actor) => actor.type === type)
  }

  //playerTouched - Меняет состояние игрового поля при касании игроком каких-либо объектов или препятствий.
  playerTouched(touchedType, actor) {//Тип препятствия или объекта, движущийся объект
    






    // лучше обратить условие и написать return чтобы уменьшить вложенность
    if (this.status === null) {
      if (['lava', 'fireball'].some((el) => el === touchedType)) { //если коснулись lava или fireball
        this.status = 'lost'; // проиграли
      } else if (touchedType === 'coin' && actor.type === 'coin') { //если коснулись монеты
        this.removeActor(actor); //удаляем ее
        if (this.noMoreActors('coin')) { //если монет больше нет
          this.status = 'won' // выиграли
        }
      }
    }
  }
}

class LevelParser {
  // можно добавить значение по-умолчанию
  constructor(letterDictionary) { //letterDictionary - словарь движущихся объектов игрового поля
    // лучше создать копию обхекта
    this.letterDictionary = letterDictionary;
  }

  actorFromSymbol(letter) {//Возвращает конструктор объекта по его символу, используя словарь
    // проверять в каждом мтеоде целостность объекта не очень хорошо
    if (!this.letterDictionary) {
      return undefined;
    }
    return this.letterDictionary[letter];
  }

  obstacleFromSymbol(letter) { // Возвращает строку, соответствующую символу препятствия.
    if (letter === 'x') {
      return 'wall'
    }
    if (letter === '!') {
      return 'lava'
    }
  }

  createGrid(plan) {// Принимает массив строк и преобразует его в массив массивов
    let obstacleFromSymbol = this.obstacleFromSymbol;
    let grid = plan.map(function(line) {
      const rez = [];
      [...line].forEach((letters) => rez.push(obstacleFromSymbol(letters)));
      return rez;
    });
    return grid;
  }

  createActors(plan) { //Принимает массив строк и преобразует его в массив движущихся объектов




    const actor = [];
    // здесь можно использовать reduce
    plan.forEach((itemY, y) => {
      [...itemY].forEach((itemX, x) => {
        const constructor = this.actorFromSymbol(itemX);
        let rez;
        if (typeof constructor === 'function') {
          rez = new constructor(new Vector(x, y));
        }
        if (rez instanceof Actor) {
          actor.push(rez);
        }
      });
    });







    return actor;
  }

  parse(plan) {
    return new Level(this.createGrid(plan), this.createActors(plan));
  }
}

class Fireball extends Actor {
  constructor(pos = new Vector(0, 0), speed = new Vector(0, 0)) {
    super(pos, speed);
    this.pos = pos;
    this.speed = speed;
    this.size = new Vector(1, 1);
  }

  get type() {
    return 'fireball';
  }

  getNextPosition(time = 1) {
    return this.pos.plus(this.speed.times(time));
  }

  handleObstacle() {
    this.speed = this.speed.times(-1);
  }

  act(time, level) {
    const nextPos = this.getNextPosition(time);
    if (level.obstacleAt(nextPos, this.size)) {
      this.handleObstacle();
    } else {
      this.pos = nextPos
    }
  }
}

class HorizontalFireball extends Fireball {
  constructor(pos = new Vector(3, 3)) {
    super(pos, new Vector(2, 0));
  }
}

class VerticalFireball extends Fireball {
  constructor(pos = new Vector(5, 4)) {
    super(pos, new Vector(0, 2));
  }
}

class FireRain extends Fireball {
  constructor(pos = new Vector(0, 3)) {
    super(pos, new Vector(0, 3));
    this.startPos = this.pos;
  }

  handleObstacle() {
    this.pos = this.startPos;
  }
}

class Coin extends Actor {
  constructor(pos = new Vector(2, 2)) {
    super(pos, new Vector(0.6, 0.6));
    this.pos = this.pos.plus(new Vector(0.2, 0.1));
    this.spring = Math.random() * (Math.PI * 2);
    this.springSpeed = 8;
    this.springDist = 0.07;
    this.startPos = this.pos;
  }

  get type() {
    return 'coin';
  }

  updateSpring(time = 1) {
    this.spring += this.springSpeed * time;
  }

  getSpringVector() {
    return new Vector(0, Math.sin(this.spring) * this.springDist)
  }

  getNextPosition(time = 1) {
    this.updateSpring(time);
    return this.startPos.plus(this.getSpringVector());
  }

  act(time) {
    this.pos = this.getNextPosition(time);
  }
}

class Player extends Actor {
  constructor(pos = new Vector(1, 1)) {
    super(pos, new Vector(0.8, 1.5));
    this.pos = this.pos.plus(new Vector(0, -0.5));
  }

  get type() {
    return 'player';
  }
}

const actorDict = {
  '@': Player,
  'v': FireRain,
  'o': Coin,
  '=': HorizontalFireball,
  '|': VerticalFireball

};
const parser = new LevelParser(actorDict);

loadLevels()
  .then((res) => {
    runGame(JSON.parse(res), parser, DOMDisplay)
      .then(() => alert('Вы выиграли!'))
  });
