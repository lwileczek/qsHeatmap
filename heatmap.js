// JavaScript
define([
    "./d3.v5.min"
], function( d3 ) {

  function onlyUnique(value, index, self) {
    // only return unique values, used in a .filter function of an array
    return self.indexOf(value) === index;
  }
  
  const margin = {left: 45, top: 20, bottom: 70, right: 20};
  // all color palettes, easily callable form properties
  const palettes = {
      'blue': d3.schemeBlues,
	  'green': d3.schemeGreens,
	  'gray': d3.schemeGreys,
	  'orange': d3.schemeOranges,
	  'purple': d3.schemePurples,
	  'red': d3.schemeReds,
	  'BuGn': d3.schemeBuGn,
	  'BuPu': d3.schemeBuPu,
	  'GnBu': d3.schemeGnBu,
	  'OrRd': d3.schemeOrRd,
	  'PuBuGn': d3.schemePuBuGn,
	  'PuBu': d3.schemePuBu,
	  'PuRd': d3.schemePuRd,
	  'RdPu': d3.schemeRdPu,
	  'YlGnBu': d3.schemeYlGnBu,
	  'YlGn': d3.schemeYlGn,
	  'YlOrBr': d3.schemeYlOrBr,
	  'YlOrRd': d3.schemeYlOrRd,
	  'BrBG': d3.schemeBrBG,
	  'PRGn': d3.schemePRGn,
	  'PiYG': d3.schemePiYG,
	  'PuOr': d3.schemePuOr,
	  'RdBu': d3.schemeRdBu,
	  'RdGy': d3.schemeRdGy,
	  'RdYlBu': d3.schemeRdYlBu,
	  'RdYlGn': d3.schemeRdYlGn,
	  'Spectral': d3.schemeSpectral,
  };

  return {

    initHeat: function(data, props, h, w, elementID) {
	/* Initial creation of the heatmap SVG
	 * 
	 * INPUT:
	 *    data - an array of arrays of objects, e.g. [[{},{},{}],[{},{},{}]]
	 *           This will have all the rows of data, three columns. The first
	 *           two columns will be the dimensions with the last being the measure
	 *
	 *    props - array of the properties from the properties file. 
	 *
	 *    h - (num) height value
	 *    w - (num) width value
	 *    elementID - (str) the id of the element object/extention
	 *
	 * OUTPUT:
	 *    colorOutput - (array) if color persist is turned out then return the color palette
	 *                  to be used in the recoloring function
	 */
	  
	  let palette;
	  switch (props.colorScheme) {
	    case "diverging":
		  palette = palettes[props.dColor];
		  break;
		case "sequential": 
		  palette = palettes[props.sColor];
		  break;
		default: 
		  palette = palettes[props.mColor];
	  }
      // init margins and height/width to be used
      const width = w - margin.left - margin.right - 10,
          height = h - margin.top - margin.bottom - 10;
	
	  const tooltip = d3.select("#a" + elementID + " div.tooltip");

      // init svg size and positioning
      const svg = d3.select("#a" + elementID+ " svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
          .append("g")
              .attr("transform", 
                  "translate(" + margin.left + "," + margin.right + ")");

      // Grab unique dimension values for X & Y axes
      const dim0 = data.map(row => row[0].qText).filter(onlyUnique);
      const dim1 = data.map(row => row[1].qText).filter(onlyUnique);
      dim0.sort().reverse();
      dim1.sort().reverse();

      const yScale = d3.scaleBand() 
        .domain(dim0)
        .range([height, 0]);
      const xScale = d3.scaleBand()
        .domain(dim1)
        .range([0, width]);

      // use scales to create the axes
      svg.append("g")
	  	  .attr("class", 'yAxis')
          .call(d3.axisLeft(yScale).tickSize(0))
          .select(".domain").remove();
      svg.append("g")
	      .attr("class", 'xAxis')
          .attr("transform", `translate(0, ${height})`)
          .call(d3.axisBottom(xScale).tickSize(0))
          .select(".domain").remove();

      var myColor;
      if (props.bins) {
	    myColor = d3.scaleOrdinal()
		  .domain(props.bins.split(","));
	  } else {
	    myColor = d3.scaleQuantile()
          .domain([ 
            d3.min(data, (d) =>  d[2].qNum),
            d3.max(data, d => d[2].qNum)
          ]);
	  }
	  myColor.range(palette[props.colorCount]);
	  
      // Create the heatmap now by tiling rectangles
      const tiles = svg.selectAll(".tile")
          .data(data);
          
       tiles.enter()
          .append("rect")
		  .attr("class", "tile")
		  .attr("x", d => xScale(d[1].qText))
		  .attr("y", d => yScale(d[0].qText))
		  .attr("width", xScale.bandwidth() )
		  .attr("height", yScale.bandwidth() )
		  .style("stroke-width", 80)
		  .style("stroke", "none")
		  .style("fill", function(d) {
		    if (props.bins) {
			  const counts = props.bins.split(","),
			    goal = d[2].qNum;
			  const closest = counts.reduce(function(prev, curr) {
			    return (Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev);
			  });
			  return myColor(closest);
			}
		    return myColor(d[2].qNum);
		  })
		  .on("mouseover", function(d){
			tooltip.style("opacity", 0.9)
			  .style("left", xScale(d[1].qText) + xScale.bandwidth()/2 + "px")
			  .style("top", yScale(d[0].qText) + yScale.bandwidth() /2 + "px")
			  .html(d[0].qText + " & " + d[1].qText + "<br>" + d[2].qNum);

		  })
		  .on("mouseout", function(){
		  	d3.select(".tooltip").style("opacity", 0);
		  });
		  
	  const legendData = props.bins ? props.bins.split(",") : [0].concat(myColor.quantiles());	  
      // create a new legend with the new quantiles
      const legend = svg.selectAll(".legend")
            .data(legendData)
          .enter().append("g")
              .attr("class", "legend")
          .append("rect")
              .attr("x", function(d, i) { return width/10 * i; })
              .attr("y", height + 25)
              .attr("width", width / 10)
              .attr("height", 30)
              .style("fill", function(d, i) { return palette[props.colorCount][i]; });
			  
      svg.selectAll(".legend").append("text")
          .attr("class", "mono")
          .attr("transform", "translate(5, 35)")
          .attr("x", function(d, i) { return width/10 * i; })
          .attr("y", height + 35)
          .text(function(d) { return Math.round(d) + "≤"; });
     
	 const colorOutput = props.persist ? myColor : null;
	 
	 return colorOutput;
    },
    resizeChart: function(data, elementID, h, w) {
		
	  // Grab unique dimension values for X & Y axes
      const dim0 = data.map(row => row[0].qText).filter(onlyUnique);
      const dim1 = data.map(row => row[1].qText).filter(onlyUnique);
      dim0.sort().reverse();
      dim1.sort().reverse();
     
	 const tooltip = d3.select("#a" + elementID + " div.tooltip");
	 
	 const width = w - margin.left - margin.right - 10,
          height = h - margin.top - margin.bottom - 10;
		  
	 // select the svg and resize it, snaping the size (instantly change)
	 const svg = d3.select("#a" + elementID + " svg")
	     .attr("width", width + margin.left + margin.right)
         .attr("height", height + margin.top + margin.bottom)
	   .select("g");
	   
	 const yScale = d3.scaleBand() 
        .domain(dim0)
        .range([height, 0]);
     const xScale = d3.scaleBand()
        .domain(dim1)
        .range([0, width]);
	
	 // use new scales to update the axes
      svg.select('.yAxis')
          .call(d3.axisLeft(yScale).tickSize(0))
          .select(".domain").remove();
      svg.select('.xAxis')
          .attr("transform", `translate(0, ${height})`)
          .call(d3.axisBottom(xScale).tickSize(0))
          .select(".domain").remove();
		
	  // update the size and position of the heat tiles
	  const tiles = svg.selectAll(".tile")
	    .data(data);
	  
	  // if new tiles are added
	  tiles.enter()
        .append("rect")
        .attr("class", "tile")
		.attr("x", d => xScale(d[1].qText))
		.attr("y", d => yScale(d[0].qText))
		.attr("width", xScale.bandwidth() )
		.attr("height", yScale.bandwidth() )
		.style("stroke-width", 80)
		.style("stroke", "none")
		.style("fill", "white")
		.on("mouseover", function(d){
			tooltip.style("opacity", 0.9)
			  .style("left", xScale(d[1].qText) + 15 + "px")
			  .style("top", yScale(d[0].qText) + 15 + "px")
			  .html(d[0].qText + " & " + d[1].qText + "<br>" + d[2].qNum);

		  })
		  .on("mouseout", function(){
		  	d3.select(".tooltip").style("opacity", 0);
		  });
		
	  // update the new tiles
	  tiles.attr("x", d => xScale(d[1].qText))
        .attr("y", d => yScale(d[0].qText))
		.attr("width", xScale.bandwidth() )
        .attr("height", yScale.bandwidth())
		.on("mouseover", function(d){
			tooltip.style("opacity", 0.9)
			  .style("left", xScale(d[1].qText) + 15 + "px")
			  .style("top", yScale(d[0].qText) + 15 + "px")
			  .html(d[0].qText + " & " + d[1].qText + "<br>" + d[2].qNum);

		  });
	  
	  // remove tiles we no longer need
	  tiles.exit().remove(); 
	
	  // Update the size and position of the legend
	  svg.selectAll(".legend rect")
        .attr("x", function(d, i) { return width/10 * i; })
        .attr("y", height + 25)
        .attr("width", width/10)
        .attr("height", 30);

       svg.selectAll(".legend text")
         .attr("x", function(d, i) { return width/10 * i; })
         .attr("y", height + 35);
		  
    },
	reColorChart: function(data, props, elementID, h, w, c) {
	  
      const width = w - margin.left - margin.right - 10,
           height = h - margin.top - margin.bottom - 10;
      // used for transitions later in the update and exit phases
      const t = d3.transition()
        .duration(750);
       
      const svg = d3.select("#a" + elementID + " svg").select("g");
      let palette;
	  switch (props.colorScheme) {
	    case "diverging":
	      palette = palettes[props.dColor];
	      break;
		case "sequential": 
		  palette = palettes[props.sColor];
		  break;
		default: 
		  palette = palettes[props.mColor];
	  }
	  if (c === null) {
       // Compute the color quantiles
       var myColor = d3.scaleQuantile()
         .domain([ 
             d3.min(data, function (d) { return d[2].qNum; }),
             d3.max(data, function (d) { return d[2].qNum; })
             ]
          )
		  .range(palette[props.colorCount]);
	  } else {
	    var myColor = c;
	  }
     // Create the heatmap now by tiling rectangles
     const tiles = svg.selectAll(".tile")
       .data(data);
          
     // Update the heatmap now by tiling rectangles
	 /*
     tiles.transition(t)
       .style("fill", function(d) { 
         return myColor(d[2].qNum);
       });
	 */
	 tiles.transition(t)
       .style("fill", function(d) {
	     if (props.bins) {
		   const counts = props.bins.split(","),
		     goal = d[2].qNum;
		   const closest = counts.reduce(function(prev, curr) {
		     return (Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev);
		   });
		   return myColor(closest);
		 }
		 return myColor(d[2].qNum);
	  });
     
	 // create a new legend with the new quantiles
	 svg.selectAll(".legend")
	   .data([0].concat(myColor.quantiles()), (d,i) => i)
	   .join(
		 enter => enter.append("g")
			.attr("class", "legend")
			.append("rect")
			.attr("x", function(d, i) { return width/10 * i; })
			.attr("y", height + 25)
			.attr("width", width / 10)
			.attr("height", 30)
			.style("fill", function(d, i) { return palette[props.colorCount][i]; }),
		 update => update.select("rect")
			.transition(t)
			.style("fill", function(d, i) { return palette[props.colorCount][i]; })
	   );

	 svg.selectAll(".legend text").remove();
	 svg.selectAll(".legend").append("text")
	   .attr("class", "mono")
	   .attr("transform", "translate(5, 35)")
	   .attr("x", function(d, i) { return width/10 * i; })
	   .attr("y", height + 35)
	   .text(function(d) { return Math.round(d) + "≤"; });
     
	// end recolor
	}
  
  // end options
  }
})

