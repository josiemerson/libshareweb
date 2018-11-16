angular
    .module('libshareApp')
    .constant('DateUtilsConstants', {
        DEFAULT_DATETIME_FORMAT: 'DD/MM/YYYY HH:mm:ss',
        DEFAULT_DATETIME_FORMAT_IGNORE_SECONDS: 'DD/MM/YYYY HH:mm',
        DEFAULT_DATE_FORMAT: 'DD/MM/YYYY',
        DEFAULT_TIME_FORMAT: 'HH:mm:ss',
        MOMENT_LANG_PT_BR: {
            months: 'Janeiro_Fevereiro_Março_Abril_Maio_Junho_Julho_Agosto_Setembro_Outubro_Novembro_Dezembro'.split('_'),
            monthsShort: 'Jan_Fev_Mar_Abr_Mai_Jun_Jul_Ago_Set_Out_Nov_Dez'.split('_'),
            weekdays: 'Domingo_Segunda-Feira_Terça-Feira_Quarta-Feira_Quinta-Feira_Sexta-Feira_Sábado'.split('_'),
            weekdaysShort: 'Dom_Seg_Ter_Qua_Qui_Sex_Sáb'.split('_'),
            weekdaysMin: 'Dom_2ª_3ª_4ª_5ª_6ª_Sáb'.split('_'),
            longDateFormat: {
                LT: 'HH:mm',
                LTS: 'LT:ss',
                L: 'DD/MM/YYYY',
                LL: 'D [de] MMMM [de] YYYY',
                LLL: 'D [de] MMMM [de] YYYY [Ã s] LT',
                LLLL: 'dddd, D [de] MMMM [de] YYYY [Ã s] LT'
            },
            calendar: {
                sameDay: '[Hoje Ã s] LT',
                nextDay: '[Amanhã Ã s] LT',
                nextWeek: 'dddd [Ã s] LT',
                lastDay: '[Ontem Ã s] LT',
                lastWeek: function () {
                    return (this.day() === 0 || this.day() === 6) ?
                        '[Último] dddd [Ã s] LT' : // Saturday + Sunday
                        '[Última] dddd [Ã s] LT'; // Monday - Friday
                },
                sameElse: 'L'
            },
            relativeTime: {
                future: 'em %s',
                past: '%s atrás',
                s: 'segundos',
                m: 'um minuto',
                mm: '%d minutos',
                h: 'uma hora',
                hh: '%d horas',
                d: 'um dia',
                dd: '%d dias',
                M: 'um mês',
                MM: '%d meses',
                y: 'um ano',
                yy: '%d anos'
            },
            ordinalParse: /\d{1,2}º/,
            ordinal: '%dº'
        }
    });