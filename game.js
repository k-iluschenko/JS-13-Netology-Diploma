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
      throw new Error(`Vector: Можно прибавлять к вектору только вектор типа Vector`);
    }
<<<<<<< HEAD
    const addX = this.x + vector.x;
    const addY = this.y + vector.y;
=======
    // значение переменной присваивается один раз, почему let?
    let addX = this.x + vector.x;
    let addY = this.y + vector.y;
>>>>>>> 54743d15fec64f3ba61e7d2a0835e96bf3af8041
    return new Vector(addX, addY); //Создает и возвращает новый объект типа Vector, с новыми координатами
  }

  times(factor) {
<<<<<<< HEAD
    const addX = this.x * factor;
    const addY = this.y * factor;
=======
    // значение переменной присваивается один раз, почему let?
    let addX = this.x * factor;
    let addY = this.y * factor;
>>>>>>> 54743d15fec64f3ba61e7d2a0835e96bf3af8041
    return new Vector(addX, addY); //Создает и возвращает новый объект типа Vector, с новыми координатами
  }
}

//класс Actor, который позволит контролировать все движущиеся объекты на игровом поле 
//и контролировать их пересечение.
class Actor {
  // лучше не использовать конструктор Vector без параметров
  // кто-то может его изменить и всё сломается
  constructor(position = new Vector(), size = new Vector(1, 1), speed = new Vector()) {
    if (!(position instanceof Vector) ||
      !(size instanceof Vector) ||
      !(speed instanceof Vector)) {
      throw new Error(`Actor: не объект типа Vector`);
    }
    // зачем комментарии ниже?
    this.pos = position; //расположение
    this.size = size; //размер
    this.speed = speed; //скорость
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
      throw new Error(`Actor:isIntersect: не объект типа Actor`);
    }
    if (this === otherActor) { // если равен самому себе
      return false;
    }
    // здесь можно убрать if и написать просто return this.right > ...
    if (this.right > otherActor.left && //проверяем, пересекается ли текущий объект с переданным объектом
      this.left < otherActor.right &&
      this.top < otherActor.bottom &&
      this.bottom > otherActor.top) {
      return true; //пересекается
    }
    return false; //не пересекается
  }
}

class Level {
  // можно задать значение по-умолчанию для параметров
  constructor(grid, actors) { //grid[][] - сетка игрового поля, actors- список движущихся объектов игрового поля
    // если будет передан не массив то работаь ничего не будет, может быть не стоит обрабатывать такой вариант?
    if (Array.isArray(grid)) {
      this.grid = grid.slice();  //копия массива
      this.height = this.grid.length; // высота = длине массива
      if (this.grid.some((el) => Array.isArray(el))) { //Проверяем, элементы массива по условию, заданному в передаваемой функции. el - массив
        // здесь лучше использовать reduce или Math.max + map
        this.width = this.grid.sort(function (a, b) {
          return b.length - a.length;
        })[0].length;
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
      throw new Error(`Level:actorAt: не объект типа Actor`);
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
      // из сообщение об ошибке непонятно что не так
      throw new Error(`Level:obstacleAt: не объект типа Vector`);
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
    // если if заканчивается на return, то else не нужен
    } else if (borderBottom > this.height) {
      return 'lava';
    }
    for (let y = borderTop; y < borderBottom; y++) {
      for (let x = borderLeft; x < borderRight; x++) {
        // this.grid[y][x] лучше сохранить в переменную
        if (this.grid[y][x]) {
          return this.grid[y][x];
        }
      }
    }
  }

  removeActor(actor) { // удаляет переданный объект с игрового поля
    const actorIndex = this.actors.indexOf(actor); //возвращает индекс объекта
    // а если не нашли?
    this.actors.splice(actorIndex, 1); //удаляем один элемент с найденного индекса.
  }

  noMoreActors(type) { //Определяет, остались ли еще объекты переданного типа на игровом поле
    // проверка лишняя, лучше использовать метод some
    if (Array.isArray(this.actors)) {
      return (!this.actors.find((actor) => actor.type === type));
    }
    return true;
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
    // typeof letter !== 'string' - если убрать эту проверку, то ничего не изменится
    if (typeof letter !== 'string' || !this.letterDictionary) {
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
    // зачем эта строчка?
    return undefined;
  }

  createGrid(plan) {// Принимает массив строк и преобразует его в массив массивов
    // зачем эта проверка?
    if (plan instanceof Actor) { //
      return;
    }
<<<<<<< HEAD
    const grid = [];
=======

    // тут можно использовать метод map
    let grid = [];
>>>>>>> 54743d15fec64f3ba61e7d2a0835e96bf3af8041
    for (const line of plan) {
      const rez = [];
      [...line].forEach((letters) => rez.push(this.obstacleFromSymbol(letters)))
      grid.push(rez);
    }
    return grid;
  }

  createActors(plan) { //Принимает массив строк и преобразует его в массив движущихся объектов
    // лишняя проверка
    if (!Array.isArray(plan)) {
      return;
    }
<<<<<<< HEAD
    const actor = [];
=======
    // значение присваивается переменной один раз, почему let?
    let actor = [];
    // здесь можно использовать reduce
>>>>>>> 54743d15fec64f3ba61e7d2a0835e96bf3af8041
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
    // можно переменную не создавать
    const level = new Level(this.createGrid(plan), this.createActors(plan));
    return level;
  }
}

class Fireball extends Actor {
  constructor(pos = new Vector(0, 0), speed = new Vector(0, 0)) {
    // второй аргумент неправильный
    super(pos, undefined, speed);
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
  // можно доабвить значение по-умолчанию
  constructor(pos) {
    super(pos, new Vector(2, 0));
  }
}

class VerticalFireball extends Fireball {
  // можно доабвить значение по-умолчанию
  constructor(pos) {
    super(pos, new Vector(0, 2));
  }
}

class FireRain extends Fireball {
  // можно доабвить значение по-умолчанию
  constructor(pos) {
    super(pos, new Vector(0, 3));
    this.startPos = this.pos;
  }

  handleObstacle() {
    this.pos = this.startPos;
  }
}

class Coin extends Actor {
  constructor(pos = new Vector(0, 0)) {
    super(pos, new Vector(0.6, 0.6));
    this.pos = this.pos.plus(new Vector(0.2, 0.1));
    this.spring = Math.random() * (Math.PI * 2);
    this.springSpeed = 8;
    this.springDist = 0.07;
    // можно просто = pos
    this.startPos = Object.assign(this.pos);
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
  // можно доабвить значение по-умолчанию
  constructor(pos) {
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

} // точку с запятой можно поставить :)
const parser = new LevelParser(actorDict);

loadLevels()
  .then((res) => {
    runGame(JSON.parse(res), parser, DOMDisplay)
      .then(() => alert('Вы выиграли!'))
  });
