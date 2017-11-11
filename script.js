/*
* Для  полного соответствия современному стандарту - use strict.
* не поддерживается IE9
* */
'use strict';

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
    if (typeof a == "number" &&
        typeof b == "number" &&
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
            "(если оставить пустым, то будет min)")
        return "Неверные параметры: a = " + a +
            " b = " + b + " operator = " + operator;
    }
}

// Создание матрицы.
function createMatrix() {

    var n = 20;
    var x = n;
    var y = n;
    var borderSize = 4;
    var matrix = document.getElementById('matrix');
    var sizeMatrix = minOrMax(widthClient(matrix), heightClient());
    matrix.style.width = sizeMatrix + "px";
    matrix.style.height = sizeMatrix + "px";
    var sizeCell = (sizeMatrix - borderSize * 2) / n;


    for (var iRow = 0; iRow < y; iRow++) {
        var yDiv = document.createElement('div');
        yDiv.className = 'row ';
        yDiv.id = "y" + iRow;
        yDiv.style.margin = 0;
        matrix.appendChild(yDiv);

        for (var iCol = 0; iCol < x; iCol++) {
            var xDiv = document.createElement('Div');
            xDiv.style.width = sizeCell + "px";
            xDiv.style.height = sizeCell + "px";
            xDiv.className = 'cell';
            xDiv.id = 'yx' + iRow + '_' + iCol;
            yDiv.appendChild(xDiv);
        }
    }

    return matrix;
}

//Установка начальной и конечной ячейки
function cellBeginEnd(divEvent, arr) {
    var idElement;

    divEvent.onmouseover = function (event) {
        var target = event.target;

        target.style.background = 'black';
    };

    divEvent.onmouseout = function (event) {
        var target = event.target;

        target.style.background = '';
    };

    var alternation = false;    //переменная для чередования цвета ячеек
    var countCell = 0;          //переменная выделенных ячеек
    divEvent.onmousedown = function (event) {
        var target = event.target;
        idElement = target.id;
        if (!alternation) {
            target.className = 'cell-begin';
            alternation = true;
            ++countCell;
            arr.push(idElement);
        } else {
            target.className = 'cell-end';
            alternation = false;
            ++countCell;
            arr.push(idElement);
        }
        console.log('arr = ' + arr);
    }

    divEvent.onmouseup = function (event) {
        var target = event.target;

        if (countCell == 2) {
            target.style.background = '';
            divEvent.onmouseover = null;
            divEvent.onmouseout = null;
            divEvent.onmousedown = null;
        }
    }
}

//Обнуление действий на мыше
function resetOption() {
    var matrix = document.getElementById('matrix');
    matrix.onmouseover =null;
    matrix.onmouseout =null;
    matrix.onmousedown =null;
    matrix.onmouseup =null;
}

// Чтение ячейки матрицы.
function getCell(row, col) {
    // Функция принимает координаты ячейки
    // должна вернуть true, если она закрашена,
    // false, если не закрашена.
}

// Установка ячейки матрицы.
function setCell(row, col, val) {

    // Функция принимает координаты ячейки
    // если val == true, закрашивает ячейку,
    // иначе убирает закраску.
}

// Точка входа
window.onload = function () {
    var divEvent = createMatrix();
    var arrCell = [];
    var idElement = cellBeginEnd(divEvent, arrCell);

    if (arrCell.length == 2) {
        console.log('arrCell = ' + arrCell);
    }

    setCell(1, 1, true);

}

function beginGame() {
    resetOption();
}

function reset() {
    
}

