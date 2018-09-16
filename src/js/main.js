'use strict';

let crossZero = document.getElementById('cross-zero');
let reboot = document.getElementsByClassName('reboot')[0];

// Создаём игровое поле, состоящее из 9 блоков
for (let i = 0; i < 9; i++) {
  let cell = document.createElement('div');
  cell.className = 'cell';
  cell.id = i;
  crossZero.appendChild(cell);
}

let cell = crossZero.getElementsByClassName('cell');// создаем указатель на ячейку
let eventTarget;
let step = 0;//счётчик, сколько раз мы нажали на игровое поле
let win = 0, draw = 0;// win - если равен 1 - победа; draw - если возникла ничья - равен 1;
let arrayElement = ['012', '345', '678', '036', '147', '258', '048', '246'];// комбинации победных вариантов
let arrayX = [], array0 = [];// массивы, в которые сохраняем индексы поля, где находятся X и 0 соответственно

//функция события onclick по форме, ставим Х, то есть функция хода игрока
function checkCell(event) {
  eventTarget = event.target;// сохраняем указатель на ячейку, на которой произолшо событие onclick
  if (eventTarget.className === 'cell') {
    if (eventTarget.innerText !== '') {
      return false;//чтобы не происходил клик по занятым ячейкам
    } else if (eventTarget.innerText !== '0') {
      if (win === 1) {
        return; //после того как произошел выйгрыш одной из сторон, ничего не присходило дальше
      }
      step++;
      arrayX.push(Number(eventTarget.id));// заполняем массив индексами полей, на которые нажали
      eventTarget.innerText = 'X'; //ставим на нажатую ячейку Х
      if (!(win === 1)) { //провереям каждый раз счётчик победы, и актвируем функцию проверки победы WinPlayer с 3 щелчка(step++)
        if (step === 3 || step === 4 || step === 5) {
          winPlayer(arrayX);
        }
      }//если еще не было победы игрока, то ходит компьютер
      if (!(win === 1)) {
        checkComputer();
      }
    }
  }
}

let arrayBlock = Array.from(crossZero.getElementsByClassName('cell'));
let freeBlocks = arrayBlock.map((el, i) => {//заполняем массив freeblocks изначльным расположением элементов, так как их изначальное расположение равно их индексу
  return el[i] = i;
});
let freeIndex;
let findElement;
let save0;

//функция хода компьютера
function checkComputer() {
  if (!(arrayBlock.length === 1)) {//когда остался 1 элемент в масииве, чтобы не было на самом последнем шаге выполнение нижеследющих действий, иначе возникнет ошибка
    freeIndex = arrayBlock.find((el) => {//находим элемент, где стоит Х
      return el.innerText === 'X';
    });
    let id = freeIndex.id;//из этого элемента нам нужен только его id, который закреплён за ним изначально и всегда
    findElement = freeBlocks.findIndex((el) => {//находим индекс id совпадающего элемента в массиве freeBlocks, так как значения массива равны id( el == id)
      return el == id;
    });
    arrayBlock.splice(findElement, 1);//исключаем найденный элемент из arrayBlock
    freeBlocks.splice(findElement, 1);//исключаем найденный элемент из freeBlocks
    let index = Math.floor(Math.random() * (freeBlocks.length));//ниходим случайный элемент из оставшихся свободных! элементов
    cell[freeBlocks[index]].innerText = '0';// ставим на случайное место 0
    cell[freeBlocks[index]].classList.add('zero');
    arrayBlock.splice(index, 1);//также исключаем этот случайный элемент из выборки, так как он уже занят 0
    save0 = freeBlocks.splice(index, 1);//сохраняем и  исключаем этот случайный элемент из выборки, так как он уже занят 0
    array0.push(Number(save0));//сохранённый индекс помещем в массив array0
  }
  if (array0.length === 3 || array0.length === 4) {//если занято уже 3 или 4 блока, запускаем функцию прерки победы winPlayer
    winPlayer(array0);
  }
}

let sameElement, saveElement, arraySameElement = [];

//функция проверки победы
function winPlayer(array) {
  if (array.length === 3) {//изачальный массив будет в нашем случае из 3 элементов, иначе дальше будут другие комбинации
    array.sort((a, b) => {//сортируем массив по возрастанию, так как выборка в массиве написана по возрастанию
      return a - b;
    });
    sameElement = array.join('');//преобразуем массив в строку и сохраняем в sameElement
    for (let i = 0; i < arrayElement.length; i++) {//проходмся по массиву выборки arrayElement
      if (sameElement === arrayElement[i]) {//проверяем равенство
        if (array === arrayX) {
          win++;
          return alert('Победили крестики');
        }
        if (array === array0) {
          win++;
          return alert('Пoбедили нолики');
        }
      }
    }
  } else if (array.length === 4 || array.length === 5) {//если будет 4 или 5 элементов в массивах, нам всегда нужно будет выбраить только 3 значения из них и проверять с выборкой
    array.sort((a, b) => {
      return a - b;
    });
    for (let i = 0; i < arrayElement.length; i++) {
      saveElement = arrayElement[i].split('').map((el) => {//на каждой итерации каждый элемент выборки arrayElement преобразуем в массив и преобразуем каждый элемент массива в число, сохраняем в saveElement
        return parseInt(el, 10);
      });
      arraySameElement = saveElement.filter((el) => {//c помощью filter и indexOf находим совпадающие элементы, преобразуем их в строку,и сохраняем их в arraySameElement
        return array.indexOf(el) >= 0;
      }).join('');
      if (arrayElement[i] === arraySameElement) {//проверяем равенство
        if (array === arrayX) {
          win++;
          return alert('Победили крестики');
        } else if (array === array0) {
          win++;
          return alert('Победили нолики');
        }
      }
    }
  }
  if (arrayX.length === 5 && array0.length === 4 && win === 0) {//если заняты все клетки и не было выигрышной комбинации, то это будет ничья
    draw++;
    if (draw === 1) {
      return alert('Ничья!!!');
    }
  }
}

crossZero.addEventListener('click', checkCell);
reboot.addEventListener('click', () => {//перезагрузка страницы
  location.reload();
});
