
'use strict';

function Item(name, effect) {
  this.name = name;
  this.effect = effect;
}

//Le da las propiedades al arma. Nombre, el daño que causa y el efecto que hace
function Weapon(name, damage, extraEffect) {

//Puede tener un efecto normal que resta vida o con más efectos
  extraEffect = extraEffect || new Effect({});
  this.damage = damage;
  extraEffect.hp -= damage;
  Item.apply(this, [name, extraEffect]);
}

  //Llamamos al constructor de Item para que Weapon sea un subtipo de este
  Weapon.prototype = Object.create(Item.prototype);
  Weapon.prototype.constructor = Weapon;

//Le da las propiedades de cada hechizo a cada pergamino. Nombre,
//coste de puntos mágicos y el efecto que causa
function Scroll(name, cost, effect) {
   Item.call(this, name, effect);
  this.cost = cost;
  effect = effect || new Effect ({});
  //Revisa si se pude utilizar porque el personaje tenga suficintes puntos mágicos
  var canBeUsed = Scroll.prototype.canBeUsed ()
  if (canBeUsed) Item.apply(this, [name, effect]);
}

//Llamamos al constructor de Item para que el prototype de scroll sea el mismo
Scroll.prototype = Object.create(Item.prototype);
Scroll.prototype.constructor = Scroll;

Scroll.prototype.canBeUsed = function (mp) {
  // El pergamino puede usarse si los puntos de maná son superiores o iguales
  // al coste del hechizo.
  if(mp >= this.cost){
  return true;
  }
  else return false;
};

function Effect(variations) {

//Cogemos cada propiedad del personaje y la igualamos al nuevo valor que venga dado
//Sino llega nada se le pondrá el valor 0 por defecto
this.initiative = variations.initiative || 0;
this.defense = variations.defense || 0;
this.hp = variations.hp || 0;
this.mp = variations.mp || 0;
this.maxMp = variations.maxMp || 0;
this.maxHp = variations.maxHp || 0;

}

module.exports = {
  Item: Item,
  Weapon: Weapon,
  Scroll: Scroll,
  Effect: Effect
};
