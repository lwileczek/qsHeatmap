// JavaScript
define( [], function () {
	'use strict';
	
	// Copying properties from: https://plot.ly/javascript/reference/
	
	/* ---------------------------------------------------------------------------
	 * Reusing Some standard properties  
	 * --------------------------------------------------------------------------*/
	
	var appearanceSection = {
	    uses: "settings",
	};
	var measures = {
		uses: "measures",
		min: 1,
		max: 1
	}
	var sorting =  {
		uses: "sorting"
	};
	var dimensions = {
		uses: "dimensions",
		min: 2,
		max: 2
	};
	
	/* ----------------------------------------------------------------------------
	 * Color Options
	 *----------------------------------------------------------------------------*/
	 
	var colorScheme = {
		type: "string",
		component: "dropdown",
		label: "Color Scheme",
		ref: "props.colorScheme",
		defaultValue: "Diverging",
		options: [{
			value: "diverging",
			label: "Diverging"
		}, {
			value: "sequential",
			label: "Sequential (Single-Hue)"
		}, {
			value: "multi",
			label: "Sequential (Multi-Hue)"
		}]
	};
	
	var categoryCount = {
		type: "integer",
		label: "Number or Levels",
		ref: "props.colorCount",
		defaultValue: "8",
		min: "3",
		max: function(data) {
			return data.props.colorScheme == "diverging" ? 11 : 9;
		}
	};
	
	var categoryCountText =  {
		label:"Min of three colors and Max of 11 if divergent or 9 if sequential",
		component: "text"
	};
	
	var colorbrewer = {
		label:"Color Palettes taken from ColorBrewer",
		component: "link",
		url:"http://colorbrewer2.org/#type=sequential&scheme=BuGn&n=3"
	};
	
	var d3Colors = {
		label:"May also be viewed from source",
		component: "link",
		url:"https://github.com/d3/d3-scale-chromatic#diverging"
	};
	
	var colorPaletteDiverget = {
		type: "string",
		component: "dropdown",
		label: "Color Palette",
		ref: "props.dColor",
		defaultValue: "RdYlGn",
		options: [{
			value: "BrBG",
			label: "Brown to Green"
		}, {
			value: "PRGn",
			label: "Purple to Green"
		}, {
			value: "PiYG",
			label: "Pink to Green"
		}, {
			value: "PiYG",
			label: "Pink to Green"
		}, {
			value: "PuOr",
			label: "Purple to Orange"
		}, {
			value: "RdBu",
			label: "Red to Blue"
		}, {
			value: "RdGy",
			label: "Red to Gray"
		}, {
			value: "RdYlBu",
			label: "Red Yellow Blue"
		}, {
			value: "RdYlGn",
			label: "Red Yellow Green"
		}, {
			value: "Spectral",
			label: "Rainbow"
		}],
		show: function(data) {
			return data.props.colorScheme == "diverging";
		}
	};
	
	var colorPaletteSingle = {
		type: "string",
		component: "dropdown",
		label: "Color Palette",
		ref: "props.sColor",
		defaultValue: "blue",
		options: [{
			value: "blue",
			label: "Blue"
		}, {
			value: "green",
			label: "Green"
		}, {
			value: "gray",
			label: "Gray"
		}, {
			value: "orange",
			label: "Orange"
		}, {
			value: "purple",
			label: "Purple"
		}, {
			value: "red",
			label: "Red"
		}],
		show: function(data) {
			return data.props.colorScheme == "sequential";
		}
	};
	
	var colorPaletteMulti = {
		type: "string",
		component: "dropdown",
		label: "Color Palette",
		ref: "props.mColor",
		defaultValue: "BuGn",
		options: [{
			value: "BuGn",
			label: "Blue to Green"
		}, {
			value: "BuPu",
			label: "Blue to Purple"
		}, {
			value: "GnBu",
			label: "Green to Blue"
		}, {
			value: "OrRd",
			label: "Orange to Red"
		}, {
			value: "PuBuGn",
			label: "Purple Blue Green"
		}, {
			value: "PuBu",
			label: "Purple to Blue"
		}, {
			value: "PuRd",
			label: "Purple/Pink to Red"
		}, {
			value: "RdPu",
			label: "White/Pink to Purple"
		}, {
			value: "YlGnBu",
			label: "Yellow Green Blue"
		}, {
			value: "YlGn",
			label: "Yellow to Green"
		}, {
			value: "YlOrBr",
			label: "Yellow Orange Brown"
		}, {
			value: "YlOrRd",
			label: "Yellow Orange Red"
		}],
		show: function(data) {
			return data.props.colorScheme == "multi";
		}
	};
	
	/* ----------------------------------------------------------------------------
	 * Custom properties
	 *----------------------------------------------------------------------------*/	
	
	var persistance = {
		type: "boolean",
		component: "switch",
		label: "Persist Legend/bins",
		ref: "props.persist",
		options: [{
			value: true,
			label: "Persist"
		}, {
			value: false,
			label: "Dynamic"
		}],
		defaultValue: false
	}
	
	var persistanceText =  {
		label:"If persistance is on, the legend will render when the screen loads and will not update until the page is reloaded." + 
		"If a filter is applied when the page loads, that will be the default legend bucketing.",
		component: "text"
	};
	
	var showNumbers = {
		type: "boolean",
		component: "switch",
		label: "Show Numbers in Cell",
		ref: "props.show",
		options: [{
			value: true,
			label: "Show"
		}, {
			value: false,
			label: "Hide"
		}],
		defaultValue: false
	}
	
	var bins = {
		ref: "props.bins",
		label: "Custom Bins (comma seperated)",
		type: "string",
		defaultValue: ""
	}

	// Putting them all together
	var myCustomProps = {
		component: "expandable-items",
		label: "Custom Heatmap Options",
		items: {
			tab0: {
			    type: "items",
				label: "Color Options",
				items: {
					header0_item0: colorScheme,
					header0_item1: categoryCount,
					header0_item2: categoryCountText,
					header0_item3: colorPaletteDiverget,
					header0_item4: colorPaletteSingle,
					header0_item5: colorPaletteMulti,
					header0_item6: colorbrewer,
					header0_item7: d3Colors
				}
			},
			
			tab1: {
				type: "items",
				label: "Custom Options",
				items: {
					header1_item0: persistance,
					header1_item1: persistanceText,
					header1_item2: bins,
					//header1_item3: showNumbers
				}
			}
		}
	};

	/* ----------------------------------------------------------------------------
	 * Credits
	 *----------------------------------------------------------------------------*/
	 var credits = {
	     label: "Credits",
		    items: {
				leadDeveloper: {
					label:"Devloped by Luke Wileczek",
					component: "text"
				},
				help: {
					label:"For help or questions, reach out to" +
                    "lwileczek@protonmail.com",
					component: "text"
				}
	    }
    };

	return {
		type: "items",
		component: "accordion",
		items: {
			dimensions: dimensions,
			measures: measures,
			sorting: sorting,
			appearance: appearanceSection,
			customSection: myCustomProps,
			chartCredits: credits
		}
	};
});
