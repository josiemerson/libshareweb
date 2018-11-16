angular
    .module("lib.core.utils")
    .config(function (DateUtilsConstants) {
        moment.defineLocale('pt-br', DateUtilsConstants.MOMENT_LANG_PT_BR);
        moment.locale('pt-br');
    });