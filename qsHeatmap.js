define([
    "qlik", 
	"./heatmap",
	"./properties",
	"text!./template.html",
	"css!./style.css"
],
	function ( qlik, heatmap, props, template ) {

		return {
		    initialProperties: {
                qHyperCubeDef: {
                    qDimensions: [],
                    qMeasures: [],
                    qInitialDataFetch: [{
                        qWidth: 3,     // 2 dimensions and 1 measure
                        qHeight: 3333  // 3333 * 3 = 9,999. You may only pull 10,000 with initial fetch
                    }],
                    listItems: []
                }
            },
            definition: props,
			template: template,
			support: {
				snapshot: true,
				export: true,
				exportData: false
			},
			paint: function ( $element ) {
				return qlik.Promise.resolve();
			},
			controller: ['$scope', '$element', function ( $scope, $element ) {
				
				// provide an id to our object so we can have multiple charts on same sheet
				$element.find(".heatmap-extension").attr("id", "a"+$scope.layout.qInfo.qId);
				
				// Create our inital rendering of the heatmap
			    const initColor = heatmap.initHeat(
				  $scope.layout.qHyperCube.qDataPages[0].qMatrix, 
				  $scope.layout.props, 
				  $element.height(),
				  $element.width(),
				  $scope.layout.qInfo.qId
				);
				// Watch for the element to be resized
				$scope.$watch(function(){
					return $element.height() + "," + $element.width();
				}, function(newValue, oldValue) {
				  if(newValue != oldValue) {
					const heightAndWidth = newValue.split(",");
					const newHeight = +heightAndWidth[0];
					const newWidth = +heightAndWidth[1];
					
					heatmap.resizeChart(
					  $scope.layout.qHyperCube.qDataPages[0].qMatrix, 
					  $scope.layout.qInfo.qId,
					  newHeight,
					  newWidth
					 );
				  }
				});
				// watch for data to change
				$scope.component.model.Validated.bind( function () {
						// the data changed so resize to fix axis, legend and num of cols/rows
						heatmap.resizeChart(
						  $scope.layout.qHyperCube.qDataPages[0].qMatrix, 
						  $scope.layout.qInfo.qId,
						  $element.height(),
						  $element.width()
						);
                        
						// recolor the tiles and legend, change legend text
						heatmap.reColorChart(
						  $scope.layout.qHyperCube.qDataPages[0].qMatrix, 
						  $scope.layout.props, 
						  $scope.layout.qInfo.qId,
						  $element.height(),
						  $element.width(),
						  initColor
						);
				} ); // end data update
				
			}]
		};

	} );

