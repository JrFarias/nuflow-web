(function () {
    'use strict';
    angular
        .module('app')
        .controller('EventController', EventController);

    EventController.$inject = ['$state', 'Events'];

    function EventController($state, Events) {
        var vm = this;
        vm.event = {
            name: null,
            type: null,
            dateEvent: new Date(),
            price: null,
            description: null,
            artists: null,
            banner: null,
            checkIn: null,
            file: null,
            id: null,
        };
        vm.showEvent = true;
        vm.showBanner = false;

        var days = 15;
        vm.date = {
            month: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
            monthShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
            weekdaysFull: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sabado'],
            weekdaysLetter: ['D', 'S', 'T', 'Q', 'QU', 'SE', 'Sab'],
            disable: [false, 1, 7],
            today: 'Hoje',
            clear: 'Limpar',
            close: 'Fechar',
            minDate: (new Date(vm.event.dateEvent.getTime() - (1000 * 60 * 60 * 24 * days))).toISOString(),
            maxDate: (new Date(vm.event.dateEvent.getTime() + (1000 * 60 * 60 * 24 * days))).toISOString(),
        };

        vm.onStart = function () {};
        vm.onRender = function () {};
        vm.onOpen = function () {};
        vm.onClose = function () {};
        vm.onSet = function () {};
        vm.onStop = function () {};

        vm.getEvent = getEvent;
        vm.createEvent = createEvent;
        vm.updateEvent = updateEvent;
        vm.uploadBanner = uploadBanner;

        // getEvent();

        function createEvent() {
            Events.createEvent(vm.event).then(event => {
                if (event.data.token === null) {
                    $state.go('main.event');
                } else {
                    vm.event.id = event.data.eventId;
                    vm.showEvent = false;
                    vm.showBanner = true;
                }
            });
        }

        function getEvent() {
            Events.getEvent().then(event => {
                vm.event.name = event.data.name;
                vm.event.type = event.data.type;
                vm.event.dateEvent = event.data.dateEvent;
                vm.event.price = event.data.price;
                vm.event.description = event.data.description;
                vm.event.artists = event.data.artists;
                vm.event.checkIn = event.data.checkIn;
                Events.getBanner().then(banner => {
                    vm.event.banner = banner;
                });
            });
        };

        function updateEvent() {
            if (vm.event.banner != null) {
                vm.event.banner = null;
                vm.event.file = null;
            }
            Events.updateEvent(vm.event).then((result) => {
                    Materialize.toast(result.message, 3000);
                },
                (err) => {
                    Materialize.toast(err.message, 3000);
                });
        };

        function uploadBanner() {
            Events.uploadBanner(vm.event.id, vm.event.file).then(() => {
                Events.getBanner(vm.event.id).then(banner => {
                    vm.event.banner = banner.data;
                });
                Materialize.toast('Banner Atualizado com sucesso', 3000);
            });
        }

    }
})();