/*
* Для  полного соответствия современному стандарту - use strict.
* не поддерживается IE9
* */
'use strict';
//region Aria variable
const KEY_CODE = {
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40
};
const ROT_HEAD = {
    LEFT: 'snake-head snake-tr-h',
    UP: 'snake-head snake-tr-r270',
    RIGHT: 'snake-head snake-tr-r0',
    DOWN: 'snake-head snake-tr-r90'
};
const ROT_NECK = {
    RIGHT: 0,
    LEFT: 1,
    UP: 2,
    DOWN: 3,
    R_U: 'snake-neck snake-tr-r0',
    R_D: 'snake-neck snake-tr-v',
    L_U: 'snake-neck snake-tr-h',
    L_D: 'snake-neck snake-tr-r180',
    U_R: 'snake-neck snake-tr-r180',
    U_L: 'snake-neck snake-tr-r270',
    D_R: 'snake-neck snake-tr-h',
    D_L: 'snake-neck snake-tr-r0',
};
const ROT_BODY = {
    LEFT: 'snake-body snake-tr-h',
    UP: 'snake-body snake-tr-r270',
    RIGHT: 'snake-body snake-tr-r0',
    DOWN: 'snake-body snake-tr-r90',
};
const COMPLEX = {
    EASY: 'легкая',
    MIDDLE: 'средняя',
    HARD: 'сложная',
    VHARD: 'очень сложная',
};

let idDiv = {
    sizeMatrix: null,
    complexity: null,
    pointVictory: null,
    speed: null,
};
let ObgMatrix = {
    n: 10,          //размер матрицы
    arrCell: [],    //координаты начала и конца
    arrAllCell: [], //координаты всех ячеек
    element: null   //Объект с отслеживаемыми событиями
};

let dateGame = {
    point: 0,
    addPoint: 5,
    limitPoint: 50,
    complexity: COMPLEX.MIDDLE,
    speedEasy:500,
    addSpeedEasy:50,
    speedMiddle:400,
    addSpeedMiddle:40,
    speedHard:300,
    addSpeedHard:30,
    speedVHard:200,
    addSpeedVHard:20,

};

let Snake = {
    arrBody: [],        //координаты тела змеи
    sizePlace: 0,       //размер свободного места
    cellGrow: null,     //ячейка роста змеи
    speed: 200,         //Скорость змея
    addSpeed: 50,       //Прирост скорости змея
    intervalMove: null, //относится к скорости
    rot: {              //повороты
        head: ROT_HEAD.RIGHT,
        neck: ROT_NECK.R_U,
        neckBefore: ROT_NECK.RIGHT,
        neckAfter: ROT_NECK.RIGHT,
        body: ROT_BODY.RIGHT,
        bool: false,
    }
};

//endregion

//region Create game field
//Ширина браузера
function widthClient(element) {
    return element.clientWidth;
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

    let x = ObgMatrix.n;
    let y = ObgMatrix.n;
    let borderSize = 4;
    let matrix = document.getElementById('matrix');
    ObgMatrix.element = matrix;
    let sizeMatrix = minOrMax(widthClient(matrix), heightClient());
    matrix.style.width = sizeMatrix + "px";
    matrix.style.height = sizeMatrix + "px";
    let sizeCell = (sizeMatrix - borderSize * 2) / ObgMatrix.n;


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
        ObgMatrix.arrCell.push(idElement);
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

//endregion

//region Game logic
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
    arr = arrDiff(ObgMatrix.arrAllCell, Snake.arrBody);
    idCell = arr[Math.floor(Math.random() * arr.length)];
    Snake.sizePlace = arr.length;
    return idCell;
}

//Функция поворота тела
function twistNeck() {
    if (Snake.rot.neckBefore !== Snake.rot.neckAfter) {
        switch (Snake.rot.neckBefore) {
            case ROT_NECK.RIGHT:
                if (Snake.rot.neckAfter === ROT_NECK.UP) {
                    Snake.rot.neck = ROT_NECK.R_U;
                }
                if (Snake.rot.neckAfter === ROT_NECK.DOWN) {
                    Snake.rot.neck = ROT_NECK.R_D;
                }
                break;
            case ROT_NECK.LEFT:
                if (Snake.rot.neckAfter === ROT_NECK.UP) {
                    Snake.rot.neck = ROT_NECK.L_U;
                }
                if (Snake.rot.neckAfter === ROT_NECK.DOWN) {
                    Snake.rot.neck = ROT_NECK.L_D;
                }
                break;
            case ROT_NECK.UP:
                if (Snake.rot.neckAfter === ROT_NECK.LEFT) {
                    Snake.rot.neck = ROT_NECK.U_L;
                }
                if (Snake.rot.neckAfter === ROT_NECK.RIGHT) {
                    Snake.rot.neck = ROT_NECK.U_R;
                }
                break;
            case ROT_NECK.DOWN:
                if (Snake.rot.neckAfter === ROT_NECK.LEFT) {
                    Snake.rot.neck = ROT_NECK.D_L;
                }
                if (Snake.rot.neckAfter === ROT_NECK.RIGHT) {
                    Snake.rot.neck = ROT_NECK.D_R;
                }
                break;
        }
    }
    Snake.rot.neckBefore = Snake.rot.neckAfter;
}

//Рост змеи
function growSnake(str) {


    let div;
    //Формирование головы
    let head = Snake.arrBody.length - 1;
    div = document.getElementById(Snake.arrBody[head]);
    //Произошел поворот
    if (Snake.rot.bool) {
        Snake.rot.bool = false;
        twistNeck();
        div.className = Snake.rot.neck;

    } else {
        div.className = Snake.rot.body;
    }

    Snake.arrBody.push(str);
    div = document.getElementById(Snake.arrBody[head + 1]);
    div.className = Snake.rot.head;


    //Проверка достижения конца
    if (Snake.sizePlace === 1) {
        window.removeEventListener('keydown', handler);
        endGame();

    } else {
        //TRUE - рост; FALSE - размер прежний
        if (Snake.cellGrow === str) {
            Snake.cellGrow = rundomCell();
            document.getElementById(Snake.cellGrow).className = 'snake-grow';
            //механизм подсчета очков и скорости
            dateGame.point += dateGame.addPoint;
            (idDiv.pointVictory).value = dateGame.point;
            if (dateGame.point % dateGame.limitPoint === 0) {
                Snake.speed -=Snake.addSpeed;
            }
            idDiv.speed.value = Snake.speed;


        } else {
            div = document.getElementById(Snake.arrBody[0]);
            div.className = 'cell';
            Snake.arrBody.shift();
        }
    }


}

function printGame() {
    alert("Вы заработали= "+ dateGame.point + "\n"+
        "на сложности: "+ dateGame.complexity);
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
    let n = ObgMatrix.n;

    if (Snake.intervalMove !== null) {
        clearInterval(Snake.intervalMove);
    }

    Snake.intervalMove = setInterval(function () {


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
            // Положительно движение дальше
            if (boolCell) {
                growSnake(str);
            } else {// Отрицательно двежение дальше
                clearInterval(Snake.intervalMove);
                window.removeEventListener('keydown', handler);
                printGame();
            }

        },
        Snake.speed
    );


}

//Обработчик к слушателю кнопок
function handler(event) {

    switch (event.keyCode) {
        case KEY_CODE.RIGHT:
            Snake.rot.head = ROT_HEAD.RIGHT;
            Snake.rot.neckAfter = ROT_NECK.RIGHT;
            Snake.rot.body = ROT_BODY.RIGHT;
            Snake.rot.bool = true;
            pathSnake(KEY_CODE.RIGHT);
            break;
        case KEY_CODE.LEFT:
            Snake.rot['head'] = ROT_HEAD.LEFT;
            Snake.rot.neckAfter = ROT_NECK.LEFT;
            Snake.rot.body = ROT_BODY.LEFT;
            Snake.rot.bool = true;
            pathSnake(KEY_CODE.LEFT);
            break;
        case KEY_CODE.UP:
            Snake.rot['head'] = ROT_HEAD.UP;
            Snake.rot.neckAfter = ROT_NECK.UP;
            Snake.rot.body = ROT_BODY.UP;
            Snake.rot.bool = true;
            pathSnake(KEY_CODE.UP);
            break;
        case KEY_CODE.DOWN:
            Snake.rot['head'] = ROT_HEAD.DOWN;
            Snake.rot.neckAfter = ROT_NECK.DOWN;
            Snake.rot.body = ROT_BODY.DOWN;
            Snake.rot.bool = true;
            pathSnake(KEY_CODE.DOWN);
            break;
    }
}

function initialization() {
    let div;
    //id Elements
    idDiv.complexity = document.getElementById('complexity');
    idDiv.sizeMatrix = document.getElementById('sizeMatrix');
    idDiv.pointVictory = document.getElementById('pointVictory');
    idDiv.speed = document.getElementById('speed');

    //initialization
    dateGame.complexity = (idDiv.complexity).value;
    ObgMatrix.n = parseInt((idDiv.sizeMatrix).value);
    switch (dateGame.complexity) {
        case COMPLEX.EASY:
            Snake.speed = dateGame.speedEasy;
            Snake.addSpeed = dateGame.addSpeedEasy;
            break;
        case COMPLEX.MIDDLE:
            Snake.speed = dateGame.speedMiddle;
            Snake.addSpeed = dateGame.addSpeedMiddle;
            break;
        case COMPLEX.HARD:
            Snake.speed = dateGame.speedHard;
            Snake.addSpeed = dateGame.addSpeedHard;
            break;
        case COMPLEX.VHARD:
            Snake.speed = dateGame.speedVHard;
            Snake.addSpeed = dateGame.addSpeedVHard;
            break;
    }
    idDiv.pointVictory.value = 0;
    idDiv.speed.value = Snake.speed;
}

function game() {
    console.log("game run");

    // инициализация массива координат свободных ячеек
    if (ObgMatrix.arrAllCell.length === 0) {
        let x = ObgMatrix.n;
        let y = ObgMatrix.n;
        let strId = null;
        for (let iRow = 0; iRow < y; iRow++) {
            for (let iCol = 0; iCol < x; iCol++) {
                strId = iCol + "_" + iRow;
                ObgMatrix.arrAllCell.push(strId);
            }
        }
    }
    // инициализация массива тела змеи координатами начала пути
    if (Snake.arrBody.length === 0) {
        Snake.arrBody.push(rundomCell());
        document.getElementById(Snake.arrBody[0]).className = ROT_HEAD.RIGHT;

    }
    // инициализация первой клетки увеличения змеи
    if (Snake.cellGrow === null) {
        Snake.cellGrow = rundomCell();
        document.getElementById(Snake.cellGrow).className = 'snake-grow';

    }

    window.addEventListener('keydown', handler);
}

function beginGame(){
    initialization();
    createMatrix();
    game();
}

function reload() {
location.reload();
}

//endregion
// Точка входа
window.onload = function () {
    initialization();

}



