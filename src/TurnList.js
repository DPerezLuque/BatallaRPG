'use strict';

function TurnList() {}

TurnList.prototype.reset = function (charactersById) {
  this._charactersById = charactersById;

  this._turnIndex = -1;
  this.turnNumber =  0;
  this.activeCharacterId = null;
  this.list = this._sortByInitiative(); 
};

TurnList.prototype.next = function () {
  // Haz que calcule el siguiente turno y devuelva el resultado
  // según la especificación. Recuerda que debe saltar los personajes
  // muertos.
  //Creamos un objeto contenedor de la persona que va a atacar después
  var turn = [];

  //Aumentamos el turno actual
  this.turnNumber++;
  //console.log (this.turnNumber); //Debug del turno
  turn.number = this.turnNumber;

  this._turnIndex = 0;
  this.activeCharacterId = this.list[this._turnIndex];
  turn.activeCharacterId = this.activeCharacterId;

  while (this._turnIndex < this.list.length  
    &&  this._charactersById[turn.activeCharacterId]._isDead){
      //console.log (this._charactersById[turn.activeCharacterId]._isDead);
      this.activeCharacterId = this.list[this._turnIndex];
      turn.activeCharacterId = this.activeCharacterId;
      this._turnIndex++;
    }
  
  //Rellenamos el objeto una vez sale del bucle
  turn.activeCharacterId = this.activeCharacterId;
  turn.party = this._charactersById[turn.activeCharacterId].party;
  
  //console.log (turn); //debug del turno

return turn;

};

TurnList.prototype._sortByInitiative = function () {

  var initiatives = []; //Los nombres de las personas, una vez se ordenen.
  var characters = []; //Array de "estructuras", que guarda tanto el nombre como la iniciativa
  for (var characterName in this._charactersById)
    characters.push ({ name: characterName, 
      Initiative: this._charactersById[characterName].initiative});

  //Ahora, ordenamos las estructuras en función de su iniciativa.
  characters.sort (function (a , b){
    if(a !== null && b !== null){
    if (a.Initiative > b.Initiative) return -1;
    else if (a.Initiative < b.Initiative) return 1;
    else return 0;
    }
  });
  //console.log(characters);   //Empleado para debugear, y comprobar que se ordena correctamente

  //Aislamos el nombre de la estructura que forman los personajes, una vez estan ordenados 
  //por iniciativa
  for (var charName in characters){
    initiatives.push(characters[charName].name);
  }
   //Devolvermos los nombres, ordenador por initiative
return initiatives;
};

module.exports = TurnList;
