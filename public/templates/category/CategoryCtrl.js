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
	};

	$scope.editCategory = function(id) {
		$('.mark-up .views-content .category-form #create-category').hide();
		$('.mark-up .views-content .category-form #save-category').show();

		var query = {
			_id: id
		};

		CategoryService.getById(query).then(function(data) {
			if(data) {
				mvNotifier.notify('Categoría cargada en el formulario.');
				$scope.categoryName = data.name;
				$scope.description = data.description;
				$scope.id = data._id;
			}
		});
	};

	$scope.saveCategory = function() {
		var data = {};
		var query = {
			_id: $scope.id
		};

		if(!$scope.categoryForm.categoryName.$pristine)
			data.name = $scope.categoryName;
		if(!$scope.categoryForm.description.$pristine)
			data.description = $scope.description;

		if(!$scope.categoryForm.$pristine) {
			CategoryService.put(query, data).then(function(success) {
				if(success) {
					$scope.id = "";
					$scope.categoryName = "";
					$scope.description = "";
					mvNotifier.notify('Categoría actualizada correctamente.');
					updateCategories();
				} else
					mvNotifier.error('No se pudo actualizar la categoría.');
			});
		} else
			mvNotifier.error('Modifica la categoría para poder actualizarla.');
	};

	function updateCategories() {
		CategoryService.get().then(function(data) {
			if(data) {
				$scope.categories = data;
			}
		});
	};
}