'use strict';

function CharactersView() {
  this._views = {};
}

CharactersView.prototype._visibleFeatures = [
  'name',
  'party',
  'initiative',
  'defense',
  'hp',
  'mp',
  'maxHp',
  'maxMp'
];

CharactersView.prototype.all = function () {
  return Object.keys(this._views).reduce(function (copy, id) {
    copy[id] = this._views[id];
    return copy;
  }.bind(this), {});
};

CharactersView.prototype.allFrom = function (party) {
  return Object.keys(this._views).reduce(function (copy, id) {
    if (this._views[id].party === party) {
      copy[id] = this._views[id];
    }
    return copy;
  }.bind(this), {});
};

CharactersView.prototype.get = function (id) {
  return this._views[id] || null;
};

CharactersView.prototype.set = function (characters) {
  this._views = Object.keys(characters).reduce(function (views, id) {
    views[id] = this._getViewFor(characters[id]);
    return views;
  }.bind(this), {});
};

//Este método toma la lista de características visibles, y no modificables, 
//Y devuelve un objeto con todas esas variables. 
//Se trata de un bucle for each, que recorre cada una de las "features" y las asigna al 
//lugar correspondiente. 
CharactersView.prototype._getViewFor = function (character) {
  var view = {};

  this._visibleFeatures.forEach( function (feature){
  Object.defineProperty(view, feature, {
    get: function () {
      // Toma el valor del feature correspondiente del personaje
      return character [feature];
    },
    set: function (value) {
      // Asigna al espacio correspondiente la caracteristica que el personaje tenga. 
      //Ejemplo, el nombre con el nombre que debería tener.
      character[feature] = character[feature];
    },
    enumerable: true
  });
});
  //Devolvemos el objeto 
  return view;
};

module.exports = CharactersView;
