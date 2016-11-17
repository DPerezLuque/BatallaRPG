'use strict';

var EventEmitter = require('events').EventEmitter;

function Options(group) {
  EventEmitter.call(this);
  this._group = typeof group === 'object' ? group : {};
}
Options.prototype = Object.create(EventEmitter.prototype);
Options.prototype.constructor = Options;

Options.prototype.list = function () {
  return Object.keys(this._group);
};

Options.prototype.get = function (id) {
  return this._group[id];
};

 //Selecciona una opción, en función de la id, y emitirá un evento determinando
 //la opción elegida y la información de la misma, si esta existe.
 //Si, por el contrario, no existe, se informará mediante un mensaje 
 //de que dicha opción no existe.
Options.prototype.select = function (id) {
	
 var identificador = this.get(id); 
 if (identificador){
  this.emit ('chose', id, this._group[id]);
  }
else{
  this.emit ('choseError', 'option-does-not-exist', id);
  }
};

module.exports = Options;
