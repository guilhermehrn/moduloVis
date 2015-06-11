/**
 * 
 * @param d
 * @returns
 */

function zoomed(g) {
  g.style("stroke-width", 1.5 / d3.event.scale + "px");
  g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}

function clicked(d) {
	if (active.node() === this) return reset();
	active.classed("active", false);
	active = d3.select(this).classed("active", true);

	var path  = createPath(createProjecao(700, 1000, 200));
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

/**
 * Funcão que cria o SVG para fazer a rederização dos mapas
 * @param largura
 * @param altura
 * @returns
 */
function createSvg(largura, altura) {
	var svg = d3.select("#map").append("svg").attr("width", largura).attr(
			"height", altura).attr("id", "plotsvg");
	return svg;
}

/**
 * Funcão que cria uma projecão a apartir de uma escala.
 * @param scala
 * @param largura
 * @param altura
 * @returns
 */
function createProjecao(scala, largura, altura) {

	var projection = d3.geo.mercator().scale(scala).translate([ largura, altura ]);
	return projection;
}

/**
 * Funcão que cria o path apartir do mapa
 * @param projection
 * @returns
 */
function createPath(projection){
	var path = d3.geo.path().projection(projection); 
	return path;
}

/**
 * Funcão que vaz o mapa svg  a partir do geodata.
 * @param svg
 * @param projecao
 * @param cor
 * @param id
 * @param geoDataPath
 * @param path
 * @returns
 */
function createMap(svg, projecao, cor, id, geoDataPath, path){
	var g = svg.append("g").attr("id",id);
	
	d3.json(geoDataPath, function(data) {
	    g.selectAll("path")
	    .data(data.features)
	    .enter()
	    .append("path")
	    .attr("d", path)
	    .attr("class", "feature").attr('fill', cor).on("click", clicked);
	    
	   /* g.append("path")
		.datum(topojson.mesh(data, data.features, function(a, b) { return a !== b; }))
		.attr("class", "mesh")
		.attr("d", path);*/
	  });
	
	return g;
}

function createVisualizacao(){
	active = d3.select(null);
	
	width  = 1000;
	height = 650;
	svg = createSvg(1000, 650);
	
	var projecao = createProjecao(700, 1000, 200);
	var path  = createPath(projecao);
	var geoDataPath = "./jsons/dit.json";
	
    var vis = createMap(svg, projecao, '#542437', "fu", geoDataPath, path);	
    return vis;
  
}

var zoom = d3.behavior.zoom().translate([0, 0]).scale(1).scaleExtent([1, 8]).on("zoom", zoomed);


call= createVisualizacao();

svg.call(zoom).call(zoom.event);