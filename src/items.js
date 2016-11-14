
'use strict';

function Item(name, effect) {
  this.name = name;
  this.effect = effect;
}

function Weapon(name, damage, extraEffect) {

  extraEffect = extraEffect || new Effect({});
  this.damage = damage;
  extraEffect.hp -= damage;
  Item.apply(this, [name, extraEffect]);

  
  // Haz que Weapon sea subtipo de Item haciendo que llame al constructor de
  // de Item.
  
}
// Termina de implementar la herencia haciendo que la propiedad prototype de
// Item sea el prototipo de Weapon.prototype y recuerda ajustar el constructor.
  Weapon.prototype = Object.create(Item.prototype);
  Weapon.prototype.constructor = Weapon;

function Scroll(name, cost, effect) {
 
  this.cost = cost;
  effect = effect || new Effect ({});
  /*var canBeUsed = Scroll.prototype.canBeUsed ()
  if (canBeUsed) Item.call(this, name, effect);*/
}

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
  // Copia las propiedades que se encuentran en variations como propiedades de
  // este objeto.
  /*for (var name in variations){
    this[name] = variations[name];
  }
*/
this.hp = variations.hp || 0;
this.mp = variations.mp || 0;
}

module.exports = {
  Item: Item,
  Weapon: Weapon,
  Scroll: Scroll,
  Effect: Effect
};
