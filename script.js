/*
* Для  полного соответствия современному стандарту - use strict.
* не поддерживается IE9
* */
'use strict';
let ObgMAtrix = {
    n: 3,          //размер матрицы
    arrCell: [],    //координаты начала и конца
    arrAllCell: [], //координаты всех ячеек
    element: null,  //Объект с отслеживаемыми событиями
}

const KEY_CODE = {
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40
};

let Snake = {
    arrBody: [],        //координаты тела змеи
    sizePlace: 0,       //размер свободного места
    cellGrow: null,     //ячейка роста змеи

    arrPlace: [],       //координаты тела змеи
}

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

    let x = ObgMAtrix.n;
    let y = ObgMAtrix.n;
    let borderSize = 4;
    let matrix = document.getElementById('matrix');
    ObgMAtrix.element = matrix;
    let sizeMatrix = minOrMax(widthClient(matrix), heightClient());
    matrix.style.width = sizeMatrix + "px";
    matrix.style.height = sizeMatrix + "px";
    let sizeCell = (sizeMatrix - borderSize * 2) / ObgMAtrix.n;


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
        ObgMAtrix.arrCell.push(idElement);
        if (!alternation) {
            target.className = 'cell-begin';
            alternation = true;
        } else {
            target.className = 'cell-end';
            alternation = false;
        }
        ++countCell;
    };

    divEvent.onmouseup = function (event) {
        let target = event.target;

        if (countCell === 1) {
            target.style.background = '';
            divEvent.onmouseover = null;
            divEvent.onmouseout = null;
            divEvent.onmousedown = null;

        }
    }
}


//Разность массивов
function arrDiff(a1, a2) {
    let a = [], diff = [];
    for (let i = 0; i < a1.length; i++) {
        a[a1[i]] = true;
    }

    for (let i = 0; i < a2.length; i++) {
        if (a[a2[i]]) {
            delete a[a2[i]];
        } else {
            a[a2[i]] = true;
        }
    }
    for (let k in a) {
        diff.push(k);
    }
    return diff;
}

//Рандомный выбор следующей ячейки роста
function rundomCell() {
    let arr = null;
    let idCell = null;
    arr = arrDiff(ObgMAtrix.arrAllCell, Snake.arrBody);
    idCell = arr[Math.floor(Math.random() * arr.length)];
    Snake.sizePlace = arr.length;
    return idCell;
}

//Рост змеи
function growSnake(str) {
    Snake.arrBody.push(str);
    let div = document.getElementById(str);
    div.className = 'snake';

    //Проверка достижения конца
    if (Snake.sizePlace === 1) {
        window.removeEventListener('keydown', handler);
        endGame();

    } else {
        //TRUE - рост; FALSE - размер прежний
        if (Snake.cellGrow === str) {
            Snake.cellGrow = rundomCell();
            document.getElementById(Snake.cellGrow).className = 'snake-grow';

        } else {
            div = document.getElementById(Snake.arrBody[0]);
            div.className = 'cell';
            Snake.arrBody.shift();
        }
    }


}


//Достижение конца игры
function endGame() {
    let alternation = false;
    let classColor;
    let bool = true;
    let countIter = 0;
    let interval = setInterval(function () {
            if (countIter > 30) {
                clearInterval(interval);
                alert("Победа");
            }
            ++countIter;
            if (!alternation) {
                classColor = 'snake-victory-1';
                alternation = true;
            } else {
                classColor = 'snake-victory-2';
                alternation = false;
            }

            for (let i = 0; i < Snake.arrBody.length; i++) {
                let div = document.getElementById(Snake.arrBody[i]);
                div.className = classColor;
            }
        },
        100
    );
}


//Переход на следующую клетку
function pathSnake(keyCode) {
    let arrPathLength = Snake.arrBody.length;
    let cell = Snake.arrBody[arrPathLength - 1];
    let arrCoordinates = cell.split('_');
    let x = arrCoordinates[0];
    let y = arrCoordinates[1];
    let n = ObgMAtrix.n;


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
    let boolCell = false; //переменная для разрешения двигаться дальше

    //Проверка будущей клетки(можно ли зайти)
    if ((x >= 0 && x < n) && (y >= 0 && y < n)) {
        for (let i = 0; i < arrPathLength; i++) {
            if (Snake.arrBody[i] !== str) {
                boolCell = true;
            } else {
                boolCell = false;
                break;
            }
        }
    } else {
        boolCell = false;
    }
    // Положительно двежение дальше
    if (boolCell) {
        growSnake(str);
    } else {// Отрицательно двежение дальше
        window.removeEventListener('keydown', handler);
        alert("Проигрыш");
    }
}

function handler(event) {
    switch (event.keyCode) {
        case KEY_CODE.RIGHT:
            pathSnake(KEY_CODE.RIGHT);
            break;
        case KEY_CODE.LEFT:
            pathSnake(KEY_CODE.LEFT);
            break;
        case KEY_CODE.UP:
            pathSnake(KEY_CODE.UP);
            break;
        case KEY_CODE.DOWN:
            pathSnake(KEY_CODE.DOWN);
            break;
    }
}


function game() {
    console.log("game run");

    // инициализация массива координат свободных ячеек
    if (ObgMAtrix.arrAllCell.length === 0) {
        let x = ObgMAtrix.n;
        let y = ObgMAtrix.n;
        let strId = null;
        for (let iRow = 0; iRow < y; iRow++) {
            for (let iCol = 0; iCol < x; iCol++) {
                strId = iCol + "_" + iRow;
                ObgMAtrix.arrAllCell.push(strId);
            }
        }
    }
    // инициализация массива тела змеи координатами начала пути
    if (Snake.arrBody.length === 0) {
        Snake.arrBody.push(rundomCell());
        document.getElementById(Snake.arrBody[0]).className = 'snake';

    }
    // инициализация первой клетки увеличения змеи
    if (Snake.cellGrow === null) {
        Snake.cellGrow = rundomCell();
        document.getElementById(Snake.cellGrow).className = 'snake-grow';

    }

    window.addEventListener('keydown', handler);
}


// Точка входа
window.onload = function () {
    createMatrix();
    game();
}


