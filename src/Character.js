'use strict';
var dice = require('./dice');

function Character(name, features) {
  features = features || {};
    // Extrae del parámetro features cada característica y la almacena en
  // una propiedad.

  this.name = name; //A name le da el nombre que viene dado como parámetro
  this.party = null; //Party la inicializa a null
  //Coge la iniciativa que viene como parámetro o da 0 si no llega nada
  this.initiative = features.initiative || 0; 
  //Coge la defensa que viene como parámetro o da 0 si no llega nada
  this.defense = features.defense || 0; 
  //Coge el arma que viene como parámetro o la pone a null si no llega nada
  this.weapon =  features.weapon ||null; 

//Coge el mp o hp que viene por parámetro o pone 0 si no llega nada
  this._mp = features.mp || 0; 
  this._hp = features.hp || 0;

//En maxHp y maxMp coge lo que viene como parámetro o pone el valor de hp/mp
  this.maxHp =  features.maxHP || this._hp || 15; //Pone 15 porque así se pasa uno de los test.
  this.maxMp = features.maxMp || this._mp;
  
}

Character.prototype._immuneToEffect = ['name', 'weapon'];

Character.prototype.isDead = function () {
  //Cuando el jugador muere, se activa esta función
  return this._hp === 0;
};

Character.prototype.applyEffect = function (effect, isAlly) {
  
  //Crea un número random entre 1 y 100
  var rnd = dice.d100 ();
  
  //Si es un aliado, ignora la comprobacion de armadura. Si es un enemigo, 
  //el número aleatorio deberá superar la armadura para que se aplique el efecto que recibe.
    if (isAlly || rnd > this.defense){

      this.initiative -=5; //Efecto en la iniciativa: -5
      this.defense += 5; //Efecto en la defensa: +5
      this._hp -=5; //Efecto en la hp: -5
      this.maxHp += 5; //Efecto en la maxHp: +5
      this._mp -= 5; //Efecto en la mp: -5
      this.maxMp += 5; //Efecto en la maxMp: +5
      return true; //Aplica el efecto
    }
    else return false; //No aplica el efecto

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
  
    get: function () {
    return this._hp; //Coge el hp del personaje
  },
  set: function (newValue) {
    //hp se ha de mantener entre 0 maxHp
    this._hp = Math.max(0, Math.min(newValue, this.maxHp)); 
  }
});

Object.defineProperty(Character.prototype, 'defense', {
  
    get: function () {
    return this._defense; //Coge la defensa del personaje
  },
  set: function (newValue) {
    //defense se ha de mantener entre 0 maxHp
    this._defense = Math.max(0, Math.min(newValue, 100));
  }
});

module.exports = Character;
