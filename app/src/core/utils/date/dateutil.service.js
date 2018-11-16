angular
    .module("libshareApp")
    .service("DateUtils", ['DateUtilsConstants', '$locale', 'orderByFilter', function (DateUtilsConstants, $locale, orderByFilter) {
        var self = this;

        self.DEFAULT_DATE_FORMAT = DateUtilsConstants.DEFAULT_DATE_FORMAT;
        self.DEFAULT_DATETIME_FORMAT = DateUtilsConstants.DEFAULT_DATETIME_FORMAT;
        self.UNIT = {
            DAYS: 'days',
            MONTHS: 'months',
            YEARS: 'years',
            MINUTES: 'minutes',
            HOURS: 'hours'
        };

        var SPECIAL_CHARACTERS_REGEXP = /[\\\^\$\*\+\?\|\[\]\(\)\.\{\}]/g;

        var formatCodeToRegex = {
            'yyyy': {
                regex: '\\d{4}',
                apply: function (value) {
                    self.year = +value;
                }
            },
            'yy': {
                regex: '\\d{2}',
                apply: function (value) {
                    self.year = +value + 2000;
                }
            },
            'y': {
                regex: '\\d{1,4}',
                apply: function (value) {
                    self.year = +value;
                }
            },
            'MMMM': {
                regex: $locale.DATETIME_FORMATS.MONTH.join('|'),
                apply: function (value) {
                    self.month = $locale.DATETIME_FORMATS.MONTH.indexOf(value);
                }
            },
            'MMM': {
                regex: $locale.DATETIME_FORMATS.SHORTMONTH.join('|'),
                apply: function (value) {
                    self.month = $locale.DATETIME_FORMATS.SHORTMONTH.indexOf(value);
                }
            },
            'MM': {
                regex: '0[1-9]|1[0-2]',
                apply: function (value) {
                    self.month = value - 1;
                }
            },
            'M': {
                regex: '[1-9]|1[0-2]',
                apply: function (value) {
                    self.month = value - 1;
                }
            },
            'dd': {
                regex: '[0-2][0-9]{1}|3[0-1]{1}',
                apply: function (value) {
                    self.date = +value;
                }
            },
            'd': {
                regex: '[1-2]?[0-9]{1}|3[0-1]{1}',
                apply: function (value) {
                    self.date = +value;
                }
            },
            'EEEE': {
                regex: $locale.DATETIME_FORMATS.DAY.join('|')
            },
            'EEE': {
                regex: $locale.DATETIME_FORMATS.SHORTDAY.join('|')
            },
            'HH': {
                regex: '(?:0|1)[0-9]|2[0-3]',
                apply: function (value) {
                    self.hours = +value;
                }
            },
            'H': {
                regex: '1?[0-9]|2[0-3]',
                apply: function (value) {
                    self.hours = +value;
                }
            },
            'mm': {
                regex: '[0-5][0-9]',
                apply: function (value) {
                    self.minutes = +value;
                }
            },
            'm': {
                regex: '[0-9]|[1-5][0-9]',
                apply: function (value) {
                    self.minutes = +value;
                }
            },
            'sss': {
                regex: '[0-9][0-9][0-9]',
                apply: function (value) {
                    self.milliseconds = +value;
                }
            },
            'ss': {
                regex: '[0-5][0-9]',
                apply: function (value) {
                    self.seconds = +value;
                }
            },
            's': {
                regex: '[0-9]|[1-5][0-9]',
                apply: function (value) {
                    self.seconds = +value;
                }
            }
        };

        self.parsers = {};
        self.stringToDate = stringToDate;
        self.strToDate = strToDate;
        self.buildDateFromTime = buildDateFromTime;
        self.formatDate = formatDate;
        self.getTimeExtraFormatter = getTimeExtraFormatter;
        self.getToday = getToday;
        self.clearTime = clearTime;
        self.clearSeconds = clearSeconds;
        self.parse = parse;
        self.extractTimeFromDate = extractTimeFromDate;
        self.subtract = subtract;
        self.add = add;
        self.getFirstDay = getFirstDay;
        self.getLastDay = getLastDay;
        self.timestampToDate = timestampToDate;
        self.getOneYearAgo = getOneYearAgo;
        self.dateToString = dateToString;
        self.diffDates = diffDates;
        self.diff = diff;
        self.diffWithToday = diffWithToday;
        self.getYear = getYear;


        function diffDates(data_1, data_2) {
            return Math.floor(Math.abs(((data_1.getTime() - data_2.getTime()) / (24 * 60 * 60 * 1000))));
        }

        function stringToDate(dateStr) {
            return moment(dateStr, DateUtilsConstants.DEFAULT_DATE_FORMAT).toDate();
        }

        function dateToString(date, formatOutput) {
            if (!angular.isDate(date)) {
                return undefined;
            }

            return moment(date).format(formatOutput || DateUtilsConstants.DEFAULT_DATE_FORMAT);
        }

        function strToDate(strValue, adjustDayLightSavingTime) {
            var splited = /^(3[01]|[1-2]\d|0[1-9]|[1-9])[^\d]?(1[0-2]|0[1-9]|[1-9])[^\d]?(\d{2}|\d{4})(?:\s(\d{1,2}):(\d{1,2}):?(\d{0,2}))?$/.exec(strValue);
            var date;

            if (splited) {
                var day = Number(splited[1]);
                var month = Number(splited[2]);
                var year = Number(splited[3]);
                var hour = Number(splited[4]) || 0;
                var min = Number(splited[5]) || 0;
                var sec = Number(splited[6]) || 0;

                if (year < 100) {
                    year += year < 30 ? 2000 : 1900;
                }

                date = new Date(year, month - 1, day, hour, min, sec);

                //Work around para corrigir o Bug do horário de verão.
                if (adjustDayLightSavingTime === true && hour == 0 && date.getHours() == 23) {
                    date.setHours(1, 0, 0, 0);
                    date.date += 1;
                }
            }

            return date;
        }

        function buildDateFromTime(strTime) {
            return moment(strTime, DateUtilsConstants.DEFAULT_TIME_FORMAT).toDate();
        }

        function extractTimeFromDate(date, unlimitedHour, minutesIsPriority){
            var strHora = formatDate(date, DateUtilsConstants.DEFAULT_TIME_FORMAT);

            return Time.parse(strHora, unlimitedHour, minutesIsPriority);
        }

        function formatDate(date, format, inputFormat) {
            if (angular.isUndefined(date)){
                return undefined;
            }

            return moment(date, inputFormat).format(format || DateUtilsConstants.DEFAULT_DATE_FORMAT);
        }

        function getTimeExtraFormatter(item) {
            if (angular.isUndefined(item)) {
                return '';
            }

            var hour = item.toString().replace(/\:/g, '');

            if (hour.length == 1) {
                hour = "00:0" + hour;
            }
            else if (hour.length == 2) {
                hour = "00:" + hour;
            }
            else if (hour.length == 3) {
                hour = "0" + hour.substring(0, 1) + ":" + hour.substring(1);
            }
            else if (hour.length == 4) {
                hour = hour.substring(0, 2) + ":" + hour.substring(2);
            }
            else if (hour.length == 5) {
                hour = "0" + hour.substring(0, 1) + ":" + hour.substring(1, 3) + ":" + hour.substring(3);
            }
            else if (hour.length == 6) {
                hour = hour.substring(0, 2) + ":" + hour.substring(2, 4) + ":" + hour.substring(4);
            }
            else if (hour.length > 6 && hour.indexOf(":") == -1) {
                hour = hour.substring(0, hour.length - 2) + ":" + hour.substring(hour.length - 2);
            }

            return hour;
        }

        function getToday(doClearTime){
            if (arguments.length == 0) {
              doClearTime = true;
            }

            if (doClearTime) {
              return clearTime();
            } else {
              return moment().toDate();
            }
        }

        function clearTime(date) {
            return moment(date).startOf('day').toDate()
        }

        function clearSeconds(date) {
            return moment(date).startOf('minutes').toDate()
        }

        function diff(date, date2, unit) {
            return moment(date).diff(moment(date2), unit || 'days');
        }

        function diffWithToday(date, unit) {
            return diff(date, getToday(), unit || 'days');
        }

        function createParser(format) {
            var map = [];
            var regex = format.split('');

            angular.forEach(formatCodeToRegex, function (data, code) {
                var index = format.indexOf(code);

                if (index > -1) {
                    format = format.split('');

                    regex[index] = '(' + data.regex + ')';

                    format[index] = '$'; // Custom symbol to define consumed part of format

                    for (var i = index + 1, n = index + code.length; i < n; i++) {
                        regex[i] = '';
                        format[i] = '$';
                    }

                    format = format.join('');

                    map.push({index: index, apply: data.apply});
                }
            });

            return {
                regex: new RegExp('^' + regex.join('') + '$'),
                map: orderByFilter(map, 'index')
            };
        }

        function isValid(year, month, date) {
            if (date < 1) {
                return false;
            }

            if (month === 1 && date > 28) {
                return date === 29 && ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0);
            }

            if (month === 3 || month === 5 || month === 8 || month === 10) {
                return date < 31;
            }

            return true;
        }

        function parse(input, format, baseDate) {
            var parser;
            var regex;
            var map;
            var results;

            if (!angular.isString(input) || !format) {
                return input;
            }

            format = $locale.DATETIME_FORMATS[format] || format;
            format = format.replace(SPECIAL_CHARACTERS_REGEXP, '\\$&');

            if (!self.parsers[format]) {
                self.parsers[format] = createParser(format);
            }

            parser = self.parsers[format];
            regex = parser.regex;
            map = parser.map;
            results = input.match(regex);

            if (results && results.length) {
                var fields;
                var dt;

                if (angular.isDate(baseDate) && !isNaN(baseDate.getTime())) {
                    fields = {
                        year: baseDate.getFullYear(),
                        month: baseDate.getMonth(),
                        date: baseDate.getDate(),
                        hours: baseDate.getHours(),
                        minutes: baseDate.getMinutes(),
                        seconds: baseDate.getSeconds(),
                        milliseconds: baseDate.getMilliseconds()
                    };
                } else {
                    fields = {year: 1900, month: 0, date: 1, hours: 0, minutes: 0, seconds: 0, milliseconds: 0};
                }

                for (var i = 1, n = results.length; i < n; i++) {
                    var mapper = map[i - 1];

                    if (mapper.apply) {
                        mapper.apply.call(fields, results[i]);
                    }
                }

                if (isValid(fields.year, fields.month, fields.date)) {
                    dt = new Date(fields.year, fields.month, fields.date, fields.hours, fields.minutes, fields.seconds, fields.milliseconds || 0);
                }

                return dt;
            }
        }

        function subtract(dt, days, unit) {
            if (!unit) {
                unit = self.UNIT.DAYS;
            }

            dt = moment(dt);

            return dt.subtract(days, unit).toDate();
        }

        function add(dt, days, unit) {
            if (!unit) {
                unit = self.UNIT.DAYS;
            }

            dt = moment(dt);

            return dt.add(days, unit).toDate();
        }

        function getFirstDay(dt){
            return moment(dt).startOf('month').toDate();
        }

        function getLastDay(dt){
            return moment(dt).endOf('month').toDate();
        }

        function getYear(){
            return getToday().getFullYear();
        }

        function timestampToDate(timestamp) {
            timestamp = parseInt(timestamp);

            if(isNaN(timestamp)) {
                return null;
            }

            return moment(timestamp).toDate();
        }

        function getOneYearAgo() {
            return subtract(getToday(), 1, self.UNIT.YEARS);
        }
    }]);

