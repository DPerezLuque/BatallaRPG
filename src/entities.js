'use strict';
var items = require('./items');
var Character = require('./Character');

var Effect = items.Effect;


var lib = module.exports = {
  Item: items.Item,
  Weapon: items.Weapon,
  Scroll: items.Scroll,
  Effect: Effect,
  Character: Character,

//Las armas de las que disponen tanto los héroes como los monstruos, así como el efecto que estas tienen.
//El primer número es el daño que inflingen en un golpe acertado, y el segundo es el efecto extra
//que determinadas armas poseen.
  weapons: {
     get sword() {
      return new items.Weapon('sword', 25);
    },
      get wand() {
      return new items.Weapon('wand', 5);
    },
      get pseudopode() {
      return new items.Weapon('pseudopode', 5, new Effect ({mp : -5}));
    },
      get fangs() {
      return new items.Weapon('fangs', 10);
    },

  },
//Los distintos personajes que participan en esta batalla.
//Poseen caracteristicas de salud, iniciativa y similares, así como el arma que poseen y como se llaman.
//Los maxHP y maxMP están comentados porque a la hora de iniciarse, los hp y mp toman esos valores automáticamente.
//Por lo que están ahí por pura referencia.
  characters: {

    get heroTank() {
      return new Character('Tank', {
        initiative: 10,
        weapon: lib.weapons.sword, 
        defense: 70,
        hp: 80,
       //maxHp: 80,
        mp: 30,
        //maxMp: 30
      });
    },

     get heroWizard() {
      return new Character('Wizard', {
        initiative: 4,
        weapon: lib.weapons.wand, 
        defense: 50,
        hp: 40,
       //maxHp: 40,
        mp: 100,
        //maxMp: 100
      });
    },

    get monsterSkeleton() {
      return new Character('Skeleton', {
        initiative: 9,
        defense: 50,
        weapon: lib.weapons.sword,
        hp: 100,
        mp: 0
      });
    },

     get monsterSlime() {
      return new Character('Slime', {
        initiative: 2,
        defense: 40,
        weapon: lib.weapons.pseudopode,
        hp: 40,
        mp: 50
      });
    },
     get monsterBat() {
      return new Character('Bat', {
        initiative: 30,
        defense: 80,
        weapon: lib.weapons.fangs,
        hp: 5,
        mp: 0
      });
    },


  },

  //Pergaminos mágicos que se pueden utilizar a cambio de unos puntos de maná que se sustraen
  //del ususario. Tienen varios efectos.
  scrolls: {
    //Este hechizo cura a la unidad seleccionada 25 hp, a cambio de 10 puntos de maná
    get health() {
      return new items.Scroll('health', 10, new Effect({ hp: 25 }));
    },

    // Este hechizo inflinge daño, 25 puntos a la vida, a cambio de 30 puntos de maná
    get fireball() {
      return new items.Scroll('fireball', 30, new Effect({ hp: -25 }));
    },
  }
};
