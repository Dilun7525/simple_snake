/*
* Для  полного соответствия современному стандарту - use strict.
* не поддерживается IE9
* */
'use strict';
let obgMAtrix = {
    n: 20,          //размер матрицы
    arrCell: [],    //координаты начала и конца
    arrPath: [],    //координаты пути
    element: null,  //Объект с отслеживаемыми событиями
}

const KEY_CODE = {
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40
};

//Ширина браузера
function widthClient(element) {
    var widthVar = element.clientWidth; //размер с padding & border
    return widthVar;
}

//Высота браузера
function heightClient() {
    return window.innerHeight
        || document.documentElement.clientHeight
        || document.body.clientHeight;
}

//Min or Max
function minOrMax(a, b, operator) {
    operator = operator || 'min';
    operator = operator.toLowerCase();
    //проверяем на правильность введённёх параметров
    if (typeof a === "number" &&
        typeof b === "number" &&
        (operator === "min" || operator === "max" )) {

        //возврат либо min, либо max
        if (operator === "min") {
            return ((a < b) ? a : b);
        } else {
            return ((a < b) ? b : a);
        }
    } else {
        alert("Неверные параметры: \n" +
            "Первые два - это числа \n" +
            "Третья это min или max \n" +
            "(если оставить пустым, то будет min)");
        return "Неверные параметры: a = " + a +
            " b = " + b + " operator = " + operator;
    }
}

// Создание матрицы.
function createMatrix() {

    let x = obgMAtrix.n;
    let y = obgMAtrix.n;
    let borderSize = 4;
    let matrix = document.getElementById('matrix');
    obgMAtrix.element = matrix;
    let sizeMatrix = minOrMax(widthClient(matrix), heightClient());
    matrix.style.width = sizeMatrix + "px";
    matrix.style.height = sizeMatrix + "px";
    let sizeCell = (sizeMatrix - borderSize * 2) / obgMAtrix.n;


    for (let iRow = 0; iRow < y; iRow++) {
        let yDiv = document.createElement('div');
        yDiv.className = 'row ';
        yDiv.id = "y" + iRow;
        yDiv.style.margin = 0;
        matrix.appendChild(yDiv);

        for (let iCol = 0; iCol < x; iCol++) {
            let xDiv = document.createElement('Div');
            xDiv.style.width = sizeCell + "px";
            xDiv.style.height = sizeCell + "px";
            xDiv.className = 'cell';
            xDiv.id = iCol + '_' + iRow;
            yDiv.appendChild(xDiv);
        }
    }

    return matrix;
}

//Установка начальной и конечной ячейки
function cellBeginEnd(divEvent) {
    let idElement;

    divEvent.onmouseover = function (event) {
        let target = event.target;

        target.style.background = 'black';
    };

    divEvent.onmouseout = function (event) {
        let target = event.target;

        target.style.background = '';
    };

    let alternation = false;    //переменная для чередования цвета ячеек
    let countCell = 0;          //переменная выделенных ячеек
    divEvent.onmousedown = function (event) {
        let target = event.target;
        idElement = target.id;
        obgMAtrix.arrCell.push(idElement);
        if (!alternation) {
            target.className = 'cell-begin';
            alternation = true;
            ++countCell;
        } else {
            target.className = 'cell-end';
            alternation = false;
            ++countCell;
        }
    };

    divEvent.onmouseup = function (event) {
        let target = event.target;

        if (countCell === 2) {
            target.style.background = '';
            divEvent.onmouseover = null;
            divEvent.onmouseout = null;
            divEvent.onmousedown = null;

        }
    }
}

//Обнуление действий на мыше
function resetOption() {
    let matrix = document.getElementById('matrix');
    matrix.onmouseover = null;
    matrix.onmouseout = null;
    matrix.onmousedown = null;
    matrix.onmouseup = null;
}


function game() {
    console.log("game run");

    //Достижение конца игры
    function endGame() {
        let alternation = false;
        let classColor;
        let bool = true;
        console.log('boolN= ' + bool);
        let countIter = 0;
        let interval = setInterval(function () {
                if (countIter > 10) {
                    clearInterval(interval);
                    alert("Победа");
                }
                ++countIter;
                // через 0.5 сек
                console.log('boolW= ' + bool);
                console.log('countIter= ' + countIter);

                if (!alternation) {
                    classColor = 'snake-victory-1';
                    alternation = true;
                } else {
                    classColor = 'snake-victory-2';
                    alternation = false;
                }
                console.log('alternation= ' + alternation);
                for (let i = 0; i < obgMAtrix.arrPath.length; i++) {
                    let div = document.getElementById(obgMAtrix.arrPath[i]);
                    div.className = classColor;
                }
            },
            500
        );
    }


//Переход на следующую клетку
    function pathSurk(keyCode) {
        let arrPathLength = obgMAtrix.arrPath.length;
        let cell = obgMAtrix.arrPath[arrPathLength - 1];
        let arrCoordinates = cell.split('_');
        let x = arrCoordinates[0];
        let y = arrCoordinates[1];
        let n = obgMAtrix.n;


        //Получение координат будующей клетки
        switch (keyCode) {
            case KEY_CODE.RIGHT:
                ++x;
                break;
            case KEY_CODE.LEFT:
                --x;
                break;
            case KEY_CODE.UP:
                --y;
                break;
            case KEY_CODE.DOWN:
                ++y;
                break;
        }

        let str = x + "_" + y;

        //Проверка достижения конца
        if (obgMAtrix.arrCell[1] === str) {
            obgMAtrix.arrPath.push(str);
            window.removeEventListener('keydown', handler);
            endGame();
        }
        let boolCell = false; //переменная для разрешения двигаться дальше
        //Проверка будущей клетки(можно ли зайти)
        if ((x >= 0 && x < n) && (y >= 0 && y < n)) {
            for (let i = 0; i < arrPathLength; i++) {
                if (obgMAtrix.arrPath[i] !== str) {
                    boolCell = true;
                } else {
                    boolCell = false;
                    break;
                }
            }
        }

        if (boolCell) {
            obgMAtrix.arrPath.push(str);
            let div = document.getElementById(str);
            div.className = 'snake';
        }
    }

    function handler(event) {

// инициализация массива Пути координатами начала пути
        if (obgMAtrix.arrPath.length == 0) {
            obgMAtrix.arrPath.push(obgMAtrix.arrCell[0]);
        }

        switch (event.keyCode) {
            case KEY_CODE.RIGHT:
                pathSurk(KEY_CODE.RIGHT);
                break;
            case KEY_CODE.LEFT:
                pathSurk(KEY_CODE.LEFT);
                break;
            case KEY_CODE.UP:
                pathSurk(KEY_CODE.UP);
                break;
            case KEY_CODE.DOWN:
                pathSurk(KEY_CODE.DOWN);
                break;
        }

    }

    window.addEventListener('keydown', handler);
}


// Точка входа
window.onload = function () {
    let divEvent = createMatrix();
    cellBeginEnd(divEvent);
    game();


};

function beginGame() {
    resetOption();
    if (obgMAtrix.arrCell.length === 2) {
        console.log('arrCell = ' + obgMAtrix.arrCell);
    }
}

function reset() {

}

