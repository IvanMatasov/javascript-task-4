'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы or и and
 */
exports.isStar = false;

var functionPriority = {
    select: 1,
    filterIn: 0,
    sortBy: 0,
    limit: 2,
    format: 2
};

function sortByPriority(a, b) {
    return functionPriority[a.name] - functionPriority[b.name];
}

/**
 * Запрос к коллекции
 * @param {Array} collection
 * @params {...Function} – Функции для запроса
 * @returns {Array}
 */
exports.query = function (collection) {
    var func = [].slice.call(arguments, 1);
    func.sort(sortByPriority);

    if (func.length === 0) {
        return collection;
    }

    var duplicateCollection = collection.map(function (objectValue) {
        return Object.assign({}, objectValue);
    });


    for (var i = 0; i < func.length; i++) {
        duplicateCollection = func[i](duplicateCollection);
    }

    return duplicateCollection;
};

/**
 * Выбор полей
 * @params {...String}
 * @returns {Object}
 */
exports.select = function () {
    var args = [].slice.call(arguments);

    return function select(collection) {
        return collection.map(function (objectValue) {
            return args.filter(function (value) {

                return value in objectValue;

            }).reduce(function (prev, value) {
                prev[value] = objectValue[value];

                return prev;
            }, {});
        });
    };

};

/**
 * Фильтрация поля по массиву значений
 * @param {String} property – Свойство для фильтрации
 * @param {Array} values – Доступные значения
 * @returns {Array}
 */
exports.filterIn = function (property, values) {
    return function filterIn(collection) {
        return collection.filter(function (objectValues) {

            return values.indexOf(objectValues[property]) !== -1;

        });
    };
};

/**
 * Сортировка коллекции по полю
 * @param {String} property – Свойство для фильтрации
 * @param {String} order – Порядок сортировки (asc - по возрастанию; desc – по убыванию)
 * @returns {Array}
 */
exports.sortBy = function (property, order) {
    return function sortBy(collection) {
        if (order === 'asc') {
            return collection.sort(function (a, b) {
                return a[property] - b[property];
            });
        }
        if (order === 'desc') {
            return collection.sort(function (a, b) {
                return b[property] - a[property];
            });
        }
    };
};

/**
 * Форматирование поля
 * @param {String} property – Свойство для фильтрации
 * @param {Function} formatter – Функция для форматирования
 * @returns {Object}
 */
exports.format = function (property, formatter) {
    return function format(collection) {
        var duplicateCollection = Object.assign(collection);

        return duplicateCollection.map(function (objectValue) {

            if (objectValue.hasOwnProperty(property)) {

                objectValue[property] = formatter(objectValue[property]);
            }

            return objectValue;
        });
    };
};

/**
 * Ограничение количества элементов в коллекции
 * @param {Number} count – Максимальное количество элементов
 * @returns {Array}
 */
exports.limit = function (count) {
    return function limit(collection) {
        return collection.slice(0, count);
    };

};

if (exports.isStar) {

    /**
     * Фильтрация, объединяющая фильтрующие функции
     * @star
     * @params {...Function} – Фильтрующие функции
     */
    exports.or = function () {
        return;
    };

    /**
     * Фильтрация, пересекающая фильтрующие функции
     * @star
     * @params {...Function} – Фильтрующие функции
     */
    exports.and = function () {
        return;
    };
}
