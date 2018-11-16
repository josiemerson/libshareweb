/**
 * @ngdoc service
 * @name lib.core.utils:DateBuilder
 *
 * @description
 * Builder de datas do framework.
 * Pode receber como parâmetro um objeto de data, que será a data inicial, 
 * caso não fornecido, será considerado a data atual.
 * 
 * @example
     <example module="appDateBuilder">
         <file name="appDateBuilder.html">
            <div ng-controller="TesteController">
                <p>Segunda passada: <span ng-bind="previousMonday | date:'medium'"></span></p>
                <p>Final do dia corrente: <span ng-bind="dayEnd | date:'medium'"></span></p>
            </div>
         </file>
         <file name="appDateBuilder.js">
            angular
                .module('appDateBuilder', ['snk'])
                .controller('TesteController', function ($scope, DateBuilder){
                    $scope.previousMonday = DateBuilder().weekStart().addDays(-6).toDate();
                    $scope.dayEnd = DateBuilder().dayEnd().toDate();
                });
         </file>
     </example>
 *
 */

angular
    .module("lib.core.utils")
    .provider('DateBuilder', [function () {
        this.$get = ['FluidBuilder', 'DateUtilsConstants', function (FluidBuilder, DateUtilsConstants) {
            return function (startDate) {
                return FluidBuilder(undefined, moment(startDate))
                    .fnImpl('toString', toString)

                    //Start/End
                    .fnImpl('dayStart', dayStart)
                    .fnImpl('dayEnd', dayEnd)
                    .fnImpl('weekStart', weekStart)
                    .fnImpl('weekEnd', weekEnd)
                    .fnImpl('monthStart', monthStart)
                    .fnImpl('monthEnd', monthEnd)

                    //Adds
                    .fnImpl('addDays', addDays)
                    .fnImpl('addMonths', addMonths)
                    .fnImpl('addYears', addYears)

                    //BuilderFn
                    .buildFn(function (variables, options, workingObj) {
                        return workingObj.toDate();
                    }, 'toDate');
            };

            /**
            * 
            * @ngdoc
            * @name lib.core.utils:DateBuilder#toString
            * @methodOf lib.core.utils:DateBuilder
            * @description
            *  Formata em string a data que está contextualizada.
            * @param {string} [format=DateUtilsConstants.DEFAULT_DATE_FORMAT] Formato de saída da data.
            * @example 
            *      <pre>builder.toString()</pre>
            * 
            */
            function toString(data) {
                return data.workingObj.format(data.args[0] || DateUtilsConstants.DEFAULT_DATE_FORMAT);
            }

            /**
            * @ngdoc
            * @name lib.core.utils:DateBuilder#dayStart
            * @methodOf lib.core.utils:DateBuilder
            * @description
            *  Volta a data para o início do dia da data que está contextualizada.
            * @example 
            *      <pre>builder.dayStart()</pre>
            */
            function dayStart(data) {
                data.workingObj.startOf('day');
            }

            /**
            * @ngdoc
            * @name lib.core.utils:DateBuilder#dayEnd
            * @methodOf lib.core.utils:DateBuilder
            * @description
            *  Incrementa a data para o final do dia da data que está contextualizada.
            * @example 
            *      <pre>builder.dayEnd()</pre>
            */
            function dayEnd(data) {
                data.workingObj.endOf('day');
            }

            /**
            * @ngdoc
            * @name lib.core.utils:DateBuilder#weekStart
            * @methodOf lib.core.utils:DateBuilder
            * @description
            *  Volta a data para o início da semana da data que está contextualizada.
            * @example 
            *      <pre>builder.weekStart()</pre>
            */
            function weekStart(data) {
                data.workingObj.startOf('week');
            }

            /**
            * @ngdoc
            * @name lib.core.utils:DateBuilder#weekEnd
            * @methodOf lib.core.utils:DateBuilder
            * @description
            *  Incrementa a data para o final da semana da data que está contextualizada.
            * @example 
            *      <pre>builder.weekEnd()</pre>
            */
            function weekEnd(data) {
                data.workingObj.endOf('week');
            }

            /**
            * @ngdoc
            * @name lib.core.utils:DateBuilder#monthStart
            * @methodOf lib.core.utils:DateBuilder
            * @description
            *  Volta a data para o início do mês da data que está contextualizada.
            * @example 
            *      <pre>builder.monthStart()</pre>
            */
            function monthStart(data) {
                data.workingObj.startOf('month');
            }

            /**
            * @ngdoc
            * @name lib.core.utils:DateBuilder#monthEnd
            * @methodOf lib.core.utils:DateBuilder
            * @description
            *  Incrementa a data para o final do mês da data que está contextualizada.
            * @example 
            *      <pre>builder.monthEnd()</pre>
            */
            function monthEnd(data) {
                data.workingObj.endOf('month');
            }

            /**
            * @ngdoc
            * @name lib.core.utils:DateBuilder#addDays
            * @methodOf lib.core.utils:DateBuilder
            * @description
            *  Adiciona ou subtrai X dias da data que está contextualizada.
            * @param {Number} days Quantidade de dias a sererem subtraídos. Caso negativo, será subtraído.
            * @example 
            *   <pre>
                    builder.addDays(6)
                    builder.addDays(-6)
                </pre>
            */
            function addDays(data) {
                data.workingObj.add(data.args[0], 'days');
            }

            /**
            * @ngdoc
            * @name lib.core.utils:DateBuilder#addMonths
            * @methodOf lib.core.utils:DateBuilder
            * @description
            *  Adiciona ou subtrai X meses da data que está contextualizada.
            * @param {Number} months Quantidade de meses a sererem subtraídos. Caso negativo, será subtraído.
            * @example 
            *   <pre>
                    builder.addMonths(1)
                    builder.addMonths(-1)
                </pre>
            */
            function addMonths(data) {
                data.workingObj.subtract(data.args[0], 'days');
            }

            /**
            * @ngdoc
            * @name lib.core.utils:DateBuilder#addYears
            * @methodOf lib.core.utils:DateBuilder
            * @description
            *  Adiciona ou subtrai X anos da data que está contextualizada.
            * @param {Number} years Quantidade de anos a sererem subtraídos. Caso negativo, será subtraído.
            * @example 
            *   <pre>
                    builder.addYears(1)
                    builder.addYears(-1)
                </pre>
            */
            function addYears(data) {
                data.workingObj.subtract(data.args[0], 'years');
            }
        }];
    }]);