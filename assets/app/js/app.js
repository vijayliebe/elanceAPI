angular.module('airline', ['airlineServices'])
	.config(airlineRouter);

function airlineRouter ($routeProvider) {
	$routeProvider
		.when('/', {templateUrl: 'partials/destinations.html',
		 controller: 'DestinationsCtrl'})
		.when('/airports/:airportCode', {
		 templateUrl: 'partials/airport.html',
		 controller: 'AirportCtrl'
		})
		.when('/flights', {
		 templateUrl: 'partials/flights.html',
		 controller: 'FlightsCtrl'})
		.when('/reservations', {
		 templateUrl: 'partials/reservations.html',
		 controller: 'ReservationsCtrl'});
}