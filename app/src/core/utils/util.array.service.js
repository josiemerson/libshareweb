angular
    .module("libshareApp")
    .service("ArrayUtils", ['StringUtils', '$injector', function (StringUtils, $injector) {
        var self = this;

        self.sorter = function() {
            return new ArraySorter();
        };

        self.pushAll = pushAll;
        self.normalizeArray = normalizeArray;
        self.insertAtIndex = insertAtIndex;
        self.removeAtIndex = removeAtIndex;
        self.removeReference = removeReference;
        self.sortByProperty = sortByProperty;
        self.sortByStringProperty = sortByStringProperty;
        self.sortByNumberProperty = sortByNumberProperty;
        self.findWhere = findWhere;
        self.indexOf = indexOf;
        self.forEach = forEach;
        self.sortArrayFromArray = sortArrayFromArray;
        self.reverse = reverse;
        self.toArray = toArray;
        self.isNotEmpty = isNotEmpty;
        self.isIn = isIn;
        self.copy = copy;
        self.find = find;
        self.callEachFunctionWith = callEachFunctionWith;
        self.pushIfNotFound = pushIfNotFound;
        self.arrayToString = arrayToString;

        function pushAll(src, items) {
            toArray(items).forEach(function(item) {
                src.push(item);
            });
        }

        function isNotEmpty(arr){
            if (angular.isArray(arr)){
                return arr.length > 0;
            } else {
                return false;
            }
        }

        function sortArrayFromArray(array, orderArray, valueGetter) {
            var existentOnOrder = {};
            var notExistentOnOrder = [];

            array.forEach(function(arrValue) {
                var value = valueGetter ? valueGetter(arrValue) : arrValue;

                if (orderArray.indexOf(value) > -1) {
                    existentOnOrder[value] = arrValue;
                } else {
                    notExistentOnOrder.push(arrValue);
                }
            });

            array.splice(0, array.length); //limpa o array

            orderArray.forEach(function(key) {
                array.push(existentOnOrder[key]);
            });

            array.push.apply(array, notExistentOnOrder);

            return array;
        }

        function isIn(arr, obj) {
            return indexOf(arr, obj) > -1;
        }

        function indexOf(arr, obj, forceRemove){
            var index = -1;
            if (angular.isArray(arr)) {
                if(!forceRemove) {
                    return arr.indexOf(obj);
                }

                find(arr, function(item, i) {
                    index = i;
                    return equals(obj, item);
                });
            }

            return index;
        }

        function copy(arr, deep) {
            if (deep) {
                return angular.copy(arr);
            } else {
                return arr.map(angular.identity);
            }
        }

        function findWhere(array, whereObj){
            for (var key in array){
                var value = array[key];

                for (var whereKey in whereKey){
                    var whereValue = whereObj[whereKey];

                    if (value.hasOwnProperty(whereKey) && whereValue == value){
                        return value;
                    }
                }
            }
        }

        function forEach(arr, fn) {
            for (var i = 0, len = arr.length; i < len; i++) {
                var continueFor = fn(arr[i], i);

                if (continueFor === false) {
                    break;
                }
            }
        }

        function toArray(arr) {
            if (angular.isUndefined(arr)){
                return [];
            } else if (angular.isArray(arr)) {
                return arr;
            } else if (angular.isString(arr)) {
                return arr.split(',');
            } else {
                return [arr];
            }
        }

        function normalizeArray(array) {
            var newArray = undefined;

            if (angular.isDefined(array)) {
                if (angular.isArray(array)) {
                    newArray = array;
                } else {
                    newArray = [];

                    angular.forEach(array, function (value) {
                        newArray.push(value);
                    });
                }
            }

            return newArray;
        }

        function insertAtIndex(array, index, value) {
            array.splice(index, 0, value);
        }

        function removeAtIndex(array, index) {
            if (index >= 0 && index < array.length) {
                return array.splice(index, 1)[0];
            }
        }

        function removeReference(array, obj, forceRemove) {
            var index = indexOf(array, obj, forceRemove);

            return self.removeAtIndex(array, index);
        }

        //Útil no caso em que se tem um array de objetos e deseja-se ordenar o array por alguma propriedade
        function sortByProperty(array, property, sortFn) {
            var ObjectUtils = $injector.get("ObjectUtils");
            
            return array.sort(function(obj1, obj2) {

                var v1 = ObjectUtils.getProperty(obj1, property);
                var v2 = ObjectUtils.getProperty(obj2, property);

                if (angular.isDefined(v1) && angular.isDefined(v2)) {
                    return sortFn(v1, v2);
                } else if (angular.isUndefined(v2)) {
                    return 1;
                } else {
                    return 0;
                }
            });
        }

        function sortByNumberProperty(array, property) {
            return sortByProperty(array, property, function(v1, v2){
                return v1 - v2;
            });
        }

        function sortByStringProperty(array, property) {
            return sortByProperty(array, property, function(v1, v2){
                return v1 === v2 ? 0 : (v1 < v2 ? -1 : 1);
            });
        }

        function reverse(originalList) {
            var newList = [];
            for(var i = originalList.length - 1; i >= 0; i--) {
                newList.push(originalList[i]);
            }
            return newList;
        }

        function find(arr, checkerFn) {
            if (arr) {
                for (var i = 0, length = arr.length; i < length; i++) {
                    if (checkerFn(arr[i], i, arr)) {
                        return arr[i];
                    }
                }
            } else {
                return undefined;
            }
        }

        function callEachFunctionWith(arr) {
            if (angular.isArray(arr)) {
                var args = Array.prototype.slice.call(arguments, 1);

               for (i=0, j=arr.length; i < j; i++) {
                    var func = arr[i];

                   func.apply(this, args);
                }
            }
        }

        function equals(obj1, obj2) {
            return JSON.stringify(obj1) === JSON.stringify(obj2);
        }

        function ArraySorter() {
            var _sorter = this;

            var _sorterFields = [];

            _sorter.field = function addSortField(names, type, descending, options) {
            	toArray(names).forEach(function(name) {
            		_sorterFields.push({
                        name: name,
                        type: type || 'S',
                        descending: descending == true,
                        options: options
                    });
            	});
                
                return _sorter;
            };

            _sorter.sort = function sortArray(arrToSort) {
                return arrToSort.sort(function(itemA, itemB) {
                    var nulls = handleNulls(itemA, itemB);

                    if (nulls !== null) {
                        return nulls;
                    }

                    var compare = 0;

                    forEach(_sorterFields, function(sortField) {
                        var valueA = itemA[sortField.name];
                        var valueB = itemB[sortField.name];

                        var sortFn = getSortFn(sortField);

                        compare = sortFn(valueA, valueB, sortField.options);

                        if (compare != 0) {
                            if (sortField.descending) {
                                compare = 0 - compare;
                            }

                            return false;
                        }
                    });

                    return compare;
                });
            };

            function getSortFn(sortField) {
                switch (sortField.type) {
                    case "N":
                        return sortNumber;
                    case "S":
                        return sortAlpha;
                    case "D":
                    case "H":
                        return sortDate;
                    default:
                        throw new Error('No sorting function found for type:' + sortField.type);
                }
            }

            function handleNulls(a, b) {
                // We want to allow zero values and false values to be evaluated in the sort function
                if ((!a && a !== 0 && a !== false) || (!b && b !== 0 && b !== false)) {
                    // We want to force nulls and such to the bottom when we sort... which effectively is "greater than"
                    if ((!a && a !== 0 && a !== false) && (!b && b !== 0 && b !== false)) {
                        return 0;
                    }
                    else if (!a && a !== 0 && a !== false) {
                        return -1;
                    }
                    else if (!b && b !== 0 && b !== false) {
                        return 1;
                    }
                }

                return null;
            }

            function sortNumber(a, b) {
                var nulls = handleNulls(a, b);

                if (nulls !== null) {
                    return nulls;
                } else {
                    return a - b;
                }
            }

            function sortAlpha(a, b, options) {
                var nulls = handleNulls(a, b);

                if (nulls !== null) {
                    return nulls;
                } else {
                    var strA = a.toString();
                        strB = b.toString();
                    
                    if (options && options.insensitive) {
                    	strA = strA.toLowerCase();
                    	strB = strB.toLowerCase();
                    }

                    return strA === strB ? 0 : (strA < strB ? -1 : 1);
                }
            }

            function sortDate(a, b) {
                var nulls = handleNulls(a, b);

                if (nulls !== null) {
                    return nulls;
                } else {
                    var timeA = a.getTime(),
                        timeB = b.getTime();

                    return timeA === timeB ? 0 : (timeA < timeB ? -1 : 1);
                }
            }
        }

        function pushIfNotFound(arr, obj, checkerFn) {
            var testFn;

            if (angular.isFunction(checkerFn)) {
                testFn = checkerFn;
            } else {
                testFn = function (toTest) {
                    return toTest == obj;
                };
            }


            if (!find(arr, testFn)) {
                arr.push(obj);
            }
        }

        function arrayToString(array) {
            var result = "";

            if (array != undefined) {
                array.forEach(function (element) {
                     if (StringUtils.emptyAsUndefined(result) != undefined) {
                         result += ",";
                     }

                    result += element;
                });
            }

            return result;
        }

    }]);