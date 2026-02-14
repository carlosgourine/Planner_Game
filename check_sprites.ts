import { playerIdle1, playerIdle2 } from './src/components/PlayerSprites';

console.log('Player Idle 1:', playerIdle1.length, 'rows', 'x', playerIdle1[0].length, 'cols');
console.log('Player Idle 2:', playerIdle2.length, 'rows', 'x', playerIdle2[0].length, 'cols');

const checkRows = (sprite, name) => {
    let consistent = true;
    sprite.forEach((row, i) => {
        if (row.length !== 48) {
            console.log(`${name} Row ${i} length:`, row.length);
            consistent = false;
        }
    });
    if (consistent) console.log(`${name} all rows are 48 cols.`);
};

checkRows(playerIdle1, 'Idle1');
checkRows(playerIdle2, 'Idle2');
