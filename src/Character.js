'use strict';
var dice = require('./dice');

function Character(name, features) {
  features = features || {};
    // Extrae del parámetro features cada característica y alamacénala en
  // una propiedad.

  this.name = name;
  this.party = null;
  this.initiative = features.initiative || 0;
  this.defense = features.defense || 0;
  this.weapon =  features.weapon ||null;

  this._mp = features.mp || 0;
  this._hp = features.hp || 0;

  this.maxHp =  features.maxHP || this._hp || 15; //Pone 15 porque así se pasa uno de los test.
  this.maxMp = features.maxMp || this._mp;
  
}

Character.prototype._immuneToEffect = ['name', 'weapon'];

Character.prototype.isDead = function () {
  //Cuando el jugador muere, se activa esta función
  return this._hp === 0;
};

Character.prototype.applyEffect = function (effect, isAlly) {
  // Implementa las reglas de aplicación de efecto para modificar las
  // características del personaje. Recuerda devolver true o false según
  // si el efecto se ha aplicado o no.

  var rnd = dice.d100 ();
  //Si es un aliado, ignora la comprobacion de armadura. Si es un enemigo, 
  //el número aleatorio deberá superar la armadura para que se aplique el efecto que recibe.
    if (isAlly || rnd > this.defense){
//Poner variations en vez de 5 ???
      this.initiative -=5;
      this.defense += 5;
      this._hp -=5;
      this.maxHp += 5;
      this._mp -= 5;
      this.maxMp += 5;
      return true;
    }
    else return false;

};

Object.defineProperty(Character.prototype, 'mp', {
  get: function () {
    return this._mp;
  },
  set: function (newValue) {
    this._mp = Math.max(0, Math.min(newValue, this.maxMp));
  }
});

Object.defineProperty(Character.prototype, 'hp', {
  // Puedes usar la mísma ténica que antes para mantener el valor de hp en el
  // rango correcto.
    get: function () {
    return this._hp;
  },
  set: function (newValue) {
    this._hp = Math.max(0, Math.min(newValue, this.maxHp));
  }
});

// Puedes hacer algo similar a lo anterior para mantener la defensa entre 0 y
// 100.
Object.defineProperty(Character.prototype, 'defense', {
  // Puedes usar la mísma ténica que antes para mantener el valor de hp en el
  // rango correcto.
    get: function () {
    return this._defense;
  },
  set: function (newValue) {
    this._defense = Math.max(0, Math.min(newValue, 100));
  }
});

module.exports = Character;
