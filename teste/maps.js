/**
 * 
 */

//var altura = 900;
//var largura = 900;

//var progecao = d3.geo.mercator();


	var largura = 1000;
	var altura = 650;

	var projection = d3.geo.mercator().scale(700).translate([largura,200]);
	
	var path = d3.geo.path().projection(projection); 
	
	var svg = d3.select("#map").append("svg")
				.attr("width", largura).attr("height", altura).attr("id", "plotsvg");
	
	var zoom = d3.behavior.zoom()
    .translate([0, 0])
    .scale(1)
    .scaleExtent([1, 8])
    .on("zoom", zoomed);
	
	active = d3.select(null);
	
	var color = d3.scale.category20b();
	var g = svg.append("g"); 
	d3.json("./jsons/dit.json", function(data) {
	    g.selectAll("path")
	    .data(data.features)
	    .enter()
	    .append("path")
	    .attr("d", path)
	    .attr("class", "feature").attr('fill', '#15630C').on("click", clicked);
	    
	    g.append("path")
		.datum(topojson.mesh(data, data.features, function(a, b) { return a !== b; }))
		.attr("class", "mesh")
		.attr("d", path);
	  });
	
svg.call(zoom) // delete this line to disable free zooming
    .call(zoom.event);

function clicked(d) {
	if (active.node() === this) return reset();
	active.classed("active", false);
	active = d3.select(this).classed("active", true);

	var bounds = path.bounds(d),
	dx = bounds[1][0] - bounds[0][0],
	dy = bounds[1][1] - bounds[0][1],
	x = (bounds[0][0] + bounds[1][0]) / 2,
	y = (bounds[0][1] + bounds[1][1]) / 2;
	scale = .9 / Math.max(dx / width, dy / height),
	translate = [width / 2 - scale * x, height / 2 - scale * y];

	svg.transition()
	.duration(750)
	.call(zoom.translate(translate).scale(scale).event);
}

function zoomed() {
  g.style("stroke-width", 1.5 / d3.event.scale + "px");
  g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}
