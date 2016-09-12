"use strict";
angular.module('smartBusiness')
    .controller('CategoryCtrl', ['$scope', 'CategoryService', CategoryCtrl]);

function CategoryCtrl($scope, CategoryService) {
	updateCategories();

	$scope.addCategory = function() {
		var data = {
			name: $scope.categoryName,
			description: $scope.description
		};

		CategoryService.post(data).then(function(success) {
			if(success) {
				$scope.categoryName = "";
				$scope.description = "";
				updateCategories();
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