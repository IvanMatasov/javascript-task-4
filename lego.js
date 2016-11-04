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

function comparator(a, b, prop) {
    if (a[prop] > b[prop]) {
        return 1;
    }
    if (a[prop] < b[prop]) {
        return -1;
    }

    return 0;
}

/**
 * Запрос к коллекции
 * @param {Array} collection
 * @params {...Function} – Функции для запроса
 * @returns {Array}
 */
exports.query = function (collection) {
    var func = [].slice.call(arguments);
    func.sort(sortByPriority);

    if (!func.length) {
        return collection;
    }

    var duplicateCollection = JSON.parse(JSON.stringify(collection));

    func.reduce(function (prev, value) {
        duplicateCollection = value(duplicateCollection);

        return duplicateCollection;
    });

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
        var record;

        return collection.map(function (objectValue) {
            record = objectValue;

            return args.filter(function (value) {
                return value in record;
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
        return collection.sort(function (a, b) {
            var compare = comparator(a, b, property);
            var result = order === 'asc' ? compare : -compare;

            return result;
        });
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
        return collection.map(function (objectValue) {
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
