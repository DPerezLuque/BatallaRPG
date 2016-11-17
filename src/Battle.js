'use strict';

var EventEmitter = require('events').EventEmitter;
var CharactersView = require('./CharactersView');
var OptionsStack = require('./OptionsStack');
var TurnList = require('./TurnList');
var Effect = require('./items').Effect;

var utils = require('./utils');
var listToMap = utils.listToMap;
var mapValues = utils.mapValues;

function Battle() {
  EventEmitter.call(this);
  this._grimoires = {};
  this._charactersById = {};
  this._turns = new TurnList();

  this.options = new OptionsStack();
  this.characters = new CharactersView();
}
Battle.prototype = Object.create(EventEmitter.prototype);
Battle.prototype.constructor = Battle;

Object.defineProperty(Battle.prototype, 'turnList', {
  get: function () {
    return this._turns ? this._turns.list : null;
  }
});

Battle.prototype.setup = function (parties) {
  this._grimoires = this._extractGrimoiresByParty(parties);
  this._charactersById = this._extractCharactersById(parties);
  this._states = this._resetStates(this._charactersById);
  this._turns.reset(this._charactersById);

  this.characters.set(this._charactersById);
  this.options.clear();
};

Battle.prototype.start = function () {
  this._inProgressAction = null;
  this._stopped = false;
  this.emit('start', this._getCharIdsByParty());
  this._nextTurn();
};

Battle.prototype.stop = function () {
  this._stopped = true;
};

Object.defineProperty(Battle.prototype, '_activeCharacter', {
  get: function () {
    return this._charactersById[this._turns.activeCharacterId];
  }
});

Battle.prototype._extractGrimoiresByParty = function (parties) {
  var grimoires = {};
  var partyIds = Object.keys(parties);
  partyIds.forEach(function (partyId) {
    var partyGrimoire = parties[partyId].grimoire || [];
    grimoires[partyId] = listToMap(partyGrimoire, useName);
  });
  return grimoires;

  function useName(scroll) {
    return scroll.name;
  }
};

Battle.prototype._extractCharactersById = function (parties) {
  var idCounters = {};
  var characters = [];
  var partyIds = Object.keys(parties);
  partyIds.forEach(function (partyId) {
    var members = parties[partyId].members;
    assignParty(members, partyId);
    characters = characters.concat(members);
  });
  return listToMap(characters, useUniqueName);

  function assignParty(characters, party) {
    // Cambia la party de todos los personajes a la pasada como parámetro.
    for (var person in characters){
      characters[person].party = party;
    }
  }

  function useUniqueName(character) {
    //Asigna nombres únicos a cada uno de los pesonajes, según un histograma de nombres. 
    //En caso de que haya dos personajes que se llamen igual, estos serán identificados por un número al lado de su nombre
    //Siendo estos números únicos para cada entidad.
   //El histogranma de nombres está en idCounters.

   if (!idCounters.hasOwnProperty(character.name)) {
      idCounters[character.name] = 1;
      //console.log (character.name); //Herramienta para debugear el nombre de los personajes
      return (character.name);
    }
    else{

      idCounters[character.name]++;
      //Herramienta para debugear un personaje cuyo nombre ya ha sido utilizado.
      //console.log (character.name + ' ' + (idCounters[character.name]));
      return (character.name + ' ' + (idCounters[character.name]));
    } 
  } 

};

Battle.prototype._resetStates = function (charactersById) {
  return Object.keys(charactersById).reduce(function (map, charId) {
    map[charId] = {};
    return map;
  }, {});
};

Battle.prototype._getCharIdsByParty = function () {
  var charIdsByParty = {};
  var charactersById = this._charactersById;
  Object.keys(charactersById).forEach(function (charId) {
    var party = charactersById[charId].party;
    if (!charIdsByParty[party]) {
      charIdsByParty[party] = [];
    }
    charIdsByParty[party].push(charId);
  });
  return charIdsByParty;
};

Battle.prototype._nextTurn = function () {
  if (this._stopped) { return; }
  setTimeout(function () {
    var endOfBattle = this._checkEndOfBattle();
    if (endOfBattle) {
      this.emit('end', endOfBattle);
    } else {
      var turn = this._turns.next();
      this._showActions();
      this.emit('turn', turn);
    }
  }.bind(this), 0);
};

Battle.prototype._checkEndOfBattle = function () {
  var allCharacters = mapValues(this._charactersById);
  var aliveCharacters = allCharacters.filter(isAlive);
  var commonParty = getCommonParty(aliveCharacters);
  return commonParty ? { winner: commonParty } : null;

  function isAlive(character) {
    // Devuelve true si el personaje está vivo, cuando tenga puntos de vida positivos.
    return (character.hp > 0);
  }

  function getCommonParty(characters) {
    // Este método toma una party de inicio y comprueba si el resto de entidades comparten esa party.
    //En caso afirmativo, esa party habrá ganado la batalla y será vencedora.
    //Desde que encuentre una entidad de distinto bando, devolverá que el ganador es null.

   /* var partyToCheck = characters.party;
    var i = 1;
    while (partyToCheck !== this.charactersById[i].party 
      && i<this.charactersById.length){
      i++;
    }

      
    if (i === this.charactersById.length){
     return partyToCheck;
    }
    else {
      return null;
    }
  
*/
  }
};

Battle.prototype._showActions = function () {
  this.options.current = {
    'attack': true,
    'defend': true,
    'cast': true
  };
  this.options.current.on('chose', this._onAction.bind(this));
};

Battle.prototype._onAction = function (action) {
  this._action = {
    action: action,
    activeCharacterId: this._turns.activeCharacterId
  };
  // LLama al método que corresponda según la action que le llegue al método:
  // defend -> _defend; attack -> _attack; cast -> _cast

  if (action === 'attack')
    return _attack();
  else if (action === 'defense')
    return _defend();
  else if (action === 'cast')
    return _cast();
};

Battle.prototype._defend = function () {
  var activeCharacterId = this._action.activeCharacterId;
  var newDefense = this._improveDefense(activeCharacterId);
  this._action.targetId = this._action.activeCharacterId;
  this._action.newDefense = newDefense;
  this._executeAction();
};

//Mejora la defensa del personaje, cuando éste se defiende, aumentando
//su defensa en un 10%.
Battle.prototype._improveDefense = function (targetId) {
  var states = this._states[targetId];
  var expectedDefense = this._charactersById[targerId]._defense;
  this._charactersById[targetId]._defense = Math.ceil(expectedDefense * 1.1);
  
  return this._charactersById[targetId]._defense;
};
//Este método devuelve la defensa a sus valores iniciales, guardados en "states".
Battle.prototype._restoreDefense = function (targetId) {
  // Restaura la defensa del personaje a cómo estaba antes de mejorarla.
  // Puedes utilizar el atributo this._states[targetId] para llevar tracking
  // de las defensas originales.
  return this._charactersById[targetId]._defense = this._states[targetId];
};

//Este método transmite el ataque a el objetivo, informandole se que ha sido atacado.
Battle.prototype._attack = function () {
  var self = this;
  self._showTargets(function onTarget(targetId) {
    // Implementa lo que pasa cuando se ha seleccionado el objetivo.
    self._executeAction();
    self._restoreDefense(targetId);
  });
};

//Método que lanza un hechizo, restando los puntos de maná necesarios e informando
//a un enemigo que ha sido dañado, o a un aliado que ha sido curado.
Battle.prototype._cast = function () {
  var self = this;
  self._showScrolls(function onScroll(scrollId, scroll) {
    // Implementa lo que pasa cuando se ha seleccionado el hechizo.
  });
};

Battle.prototype._executeAction = function () {
  var action = this._action;
  var effect = this._action.effect || new Effect({});
  var activeCharacter = this._charactersById[action.activeCharacterId];
  var targetCharacter = this._charactersById[action.targetId];
  var areAllies = activeCharacter.party === targetCharacter.party;

  var wasSuccessful = targetCharacter.applyEffect(effect, areAllies);
  this._action.success = wasSuccessful;

  this._informAction();
  this._nextTurn();
};

Battle.prototype._informAction = function () {
  this.emit('info', this._action);
};

Battle.prototype._showTargets = function (onSelection) {
  // Toma ejemplo de la función ._showActions() para mostrar los identificadores
  // de los objetivos.

  this.options.current.on('chose', onSelection);
};

Battle.prototype._showScrolls = function (onSelection) {
  // Toma ejemplo de la función anterior para mostrar los hechizos. Estudia
  // bien qué parámetros se envían a los listener del evento chose.
  this.options.current.on('chose', onSelection);
};

module.exports = Battle;

