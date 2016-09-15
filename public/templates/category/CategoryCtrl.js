"use strict";
angular.module('smartBusiness')
    .controller('CategoryCtrl', ['$scope', 'CategoryService', 'mvNotifier', CategoryCtrl]);

function CategoryCtrl($scope, CategoryService, mvNotifier) {
	updateCategories();

	$scope.addCategory = function() {
		var data = {
			name: $scope.categoryName,
			description: $scope.description
		};

		CategoryService.post(data).then(function(success) {
			if(success) {
				mvNotifier.notify('Categoría creada correctamente.');
				$scope.categoryName = "";
				$scope.description = "";
				updateCategories();
			} else {
				mvNotifier.error('No se pudo crear la categoría');
			}
		});
	}

	function updateCategories() {
		CategoryService.get().then(function(data) {
			if(data) {
				$scope.categories = data;
			}
		});
	};
}