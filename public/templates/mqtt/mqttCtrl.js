/**
 * Created by Mordekaiser on 20/06/16.
 */
"use strict";
angular.module('smartBusiness')
    .controller('mqttCtrl', ['$scope', 'mqttService', mqttCtrl]);

function mqttCtrl($scope, mqttService) {
	var data = [];
	var socket = io();

	socket.on('current', function (data) {
		console.log(data);
        //$('#current').append('<li><b></b> ' + data.message + '</li>');
        graphicData(data.message);
    });

    $scope.switchToggle = function (status) {
        console.log('toggle status: ' + status);
        mqttService.post({status: status}).then(function (success) {
            if(success) {
                console.log('Success');
            }
        })
    };

    function graphicData(current) {
    	data.push(current);

    	var x = d3.scale.linear()
    	.domain([0, d3.max(data)])
    	.range([0, 420]);

    	d3.select(".chart")
    	.selectAll("div")
    	.data(data)
    	.enter().append("div")
    	.style("width", function(d) { return x(d) + "px"; })
    	.text(function(d) { return d; });
    }
}