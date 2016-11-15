'use strict';

function TurnList() {}

TurnList.prototype.reset = function (charactersById) {
  this._charactersById = charactersById;

  this._turnIndex = -1;
  this.turnNumber =  0;
  this.activeCharacterId = null;
  this.list = this._sortByInitiative(); // = ['c', 'b','a']
};

TurnList.prototype.next = function () {
  // Haz que calcule el siguiente turno y devuelva el resultado
  // según la especificación. Recuerda que debe saltar los personajes
  // muertos.
  //Aumentamos el turno actual
  this.turnNumber++;
  console.log (this.turnNumber); //Debug del turno

  //for (var party in this.list)
  //this.activeCharacterId = 


};

TurnList.prototype._sortByInitiative = function () {
  // Utiliza la función Array.sort(). ¡No te implementes tu propia
  // función de ordenación!
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
