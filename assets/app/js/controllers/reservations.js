function ReservationsCtrl ($scope, Reservations, Flights) {
	$scope.setActive('reservations');

	$scope.reservations = Reservations.query();
	$scope.flights = Flights.query();

	$scope.reserveFlight = function  () {
		Reservations.save($scope.reserve, function (data) {
			$scope.reserve.origin = '';
			$scope.reserve.destination = '';

			$scope.reservations.push(data);
		});
	}
}