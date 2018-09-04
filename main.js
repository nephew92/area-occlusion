function res_atm_VS_res_atm(data){
	var expensesByAt1 = d3.nest()
	  .key(function(d){ return d.residue_1; })
	  .key(function(d){ return d.residue_2; })
	  .key(function(d){ return d.atom_1; })
	  .key(function(d){ return d.atom_2; })
	  .rollup(function(v){
	  		ang = d3.mean(v, function(d) { 
	  				r1 = d.residue_1;
	  				r2 = d.residue_2;
	  				a1 = d.atom_1;
	  				a2 = d.atom_2;
	  				return parseFloat(d.angle); })
	  		return {	  			
	  			res1: r1,
	  			res2: r2,
	  			atom1: a1,
	  			atom2: a2,
	  			angle: ang
	  		}
	  	})
	  .map(data);
	  console.log(expensesByAt1);
}
function atm_VS_atm(data){
	atoms = ['CB','CD','CD1','CD2','CE','CE1','CE2','CE3','CG','CG1','CG2','CH2','CZ','CZ2','CZ3','N','ND1','ND2','NE','NE1','NE2','NH1','NH2','NZ','O','OD1','OD2','OE1','OE2','OG','OG1','OH','SD'];
	var expensesByAt1 = d3.nest()
	  .key(function(d){ return d.atom_1; })
	  .key(function(d){ return d.atom_2; })
	  .rollup(function(v){
	  	
	  		//r1,r2,a1,a2;
	  		ang = d3.mean(v, function(d) { 
	  				a1 = d.atom_1;
	  				a2 = d.atom_2;
	  				return parseFloat(d.angle); });
	  		return {	  			
	  			row: atoms.indexOf(a1)+1,
	  			col: atoms.indexOf(a2)+1,
	  			value: parseFloat(ang.toFixed(2))
	  		}
	  	})
	  .map(data);
	  console.log(expensesByAt1);
}
function test(data){
	var expensesByAt1 = d3.nest()
	  .key(function(d){ return d.residue_1  +"-"+d.residue_2+"-"+d.atom_1+"-"+d.atom_2; })
	  .rollup(function(v){
	  		ang = d3.mean(v, function(d) { 
	  				r1 = d.residue_1;
	  				r2 = d.residue_2;
	  				a1 = d.atom_1;
	  				a2 = d.atom_2;
	  				return parseFloat(d.angle); });
	  		return {	  			
	  			res1: r1,
	  			res2: r2,
	  			atom1: a1,
	  			atom2: a2,
	  			angle: parseFloat(ang.toFixed(2))
	  		}
	  	})
	  .entries(data).map(function(d){
	  	return d.values;
	  });
	  return expensesByAt1;
}
function draw_spheres(){

	var data = [
		{
		'atom': 'CD1',
		'radius': 35,
		'x': 50,
		'y': 50,
		'color': 'yellow'
		},
		{
		'atom': 'N',
		'radius': 25,
		'x': 300,
		'y': 300,
		'color': 'red'
		},
		{
		'atom': 'OG1',
		'radius': 45,
		'x': 500,
		'y': 50,
		'color': 'green'
		},
		{
		'atom': 'OG1_c',
		'radius': 45,
		'x': 500,
		'y': 50,
		'color': '#5db15d'
		}
	]

	var drager = d3.behavior.drag()
    		.on("drag", move);

	d3.select("body")
		.append("svg")
		.attr("width", 1024)
		.attr("height", 720)
		.call(svg=>{
			svg.append("polygon")
				.attr("style", "fill: steelblue; opacity: 0.5; transform-origin: center center;")
				;
			svg.selectAll(".atom")
				.data(data)
				.enter()
				.append("g")
				.attr("class","atom")
				.call(drager)
				.call(sel=>{
					sel.append("circle")
						.attr("id",d=> d.atom)
						.attr("cx",d=> d.x)
						.attr("cy",d=> d.y)
						.attr("r",d=> d.radius)
						.attr("style",d=> "fill: "+d.color+"; opacity: 0.5; transform-origin: center;")		
					sel.append("text").text(d=>d.atom)
						.attr("y",d=> d.y)
						.attr("x",d=> d.x)
						.style("transform",d=> "translate(-"+d.atom.length*5+"px,5px)")
					
				})
				
			
		})
		
	// d3.selectAll(".atom")
	//d3.select(d3.select("#OG1_c").node().parentNode).style("display","none");

	amarelo = d3.select("#CD1");
	verde = d3.select("#OG1");
	vermelho = d3.select("#N");
	
	d3.select("polygon")
		.attr("points", getPositionPolygon(amarelo,verde))
		;
	
	function getPositionPolygon(e1,e2){
		c_e1 = [e1.attr("cx"),e1.attr("cy")];
		c_e2 = [e2.attr("cx"),e2.attr("cy")];

		return getCoord(e1.attr("r"),getDirection(c_e1,c_e2)+90,c_e1)+" "+
			getCoord(e1.attr("r"),getDirection(c_e1,c_e2)-90,c_e1)+" "+
			getCoord(e2.attr("r"),getDirection(c_e2,c_e1)+90,c_e2)+" "+
			getCoord(e2.attr("r"),getDirection(c_e2,c_e1)-90,c_e2);
	}
   	function getCoord(dist, direct, origin){
   		origin = origin || [0,0];
   		return [
   			(+(dist * (Math.cos(toRadians(direct))))) + (+origin[0]),
   			(+(dist * (Math.sin(toRadians(direct))))) + (+origin[1])
   		];

   	}
   	function getDistance(point1, point2){   
   		return Math.sqrt(Math.pow(point2[1]-point1[1],2) + Math.pow(point2[0]-point1[0],2));
   	}
   	function getDirection(point1, point2){
   		return toDegree(Math.atan2((point2[1]-point1[1]),(point2[0]-point1[0])));
   	}
   	function move(){
		c = d3.mouse(this);
		d3.select(this)
			.select('circle')
			.attr("cx",c[0])
			.attr("cy",c[1])
			;	
		d3.select(this)
			.select("text")
			.attr("x",c[0])
			.attr("y",c[1])
			;
		
		

		//console.log(getDirection([amarelo.attr("cx"),amarelo.attr("cy")],[verde.attr("cx"),verde.attr("cy")]));	
		//console.log(getDistance([amarelo.attr("cx"),amarelo.attr("cy")],[verde.attr("cx"),verde.attr("cy")]));	
		y = [amarelo.attr("cx"),amarelo.attr("cy")];
		g = [verde.attr("cx"),verde.attr("cy")];
		r = [vermelho.attr("cx"),vermelho.attr("cy")];

		d3.select("#positions").text("y: "+y+"\ng: "+g+"\nr: "+r+"\n");

		oldDistanciaRG = getDistance(y,r);
		directionRY = getDirection(y,g);
		newCoordR = getCoord(oldDistanciaRG, directionRY,y);
		newDistanciaRG = getDistance(newCoordR, r);
		
		d3.select("#oldDistanciaRG")
			.text("oldDistanciaRG: "+oldDistanciaRG);
		d3.select("#directionRY")
			.text("directionRY: "+directionRY);
		d3.select("#newCoordR")
			.text("newCoordR: "+newCoordR);
		d3.select("#newDistanciaRG")
			.text("newDistanciaRG: "+newDistanciaRG);

		newRadius = (getDistance(y,newCoordR)*((+verde.attr("r")-amarelo.attr("r"))/getDistance(y,g)))+(+amarelo.attr("r"));

		d3.select("#OG1_c")
			.attr("cx", newCoordR[0])
			.attr("cy", newCoordR[1])
			.attr("r", newRadius)
			;
		console.log()

		d3.select("polygon")
			.attr("points", getPositionPolygon(amarelo,verde))
			.style("fill",newDistanciaRG<newRadius+(+vermelho.attr("r"))? "darksalmon":"steelblue")
			;
	} 

	function toRadians(x){
		return x * (Math.PI/180);
	}
	function toDegree(x){
		return x / (Math.PI/180);
	}
	
}
