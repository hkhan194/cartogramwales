
var colours = ["#DB70B8",
               "#FFAD33",
               "#FF4D4D",
               "#0099FF",
               "#33CC33",
               "grey"
               ];

var counties = ["Pembrokeshire",
                "Carmarthenshire",
                "Cardiganshire",
                "Breckockshire",
                "Montgomeryshire",
                "Flintshire",
                "Merionethshire",
                "Anglesey",
                "Caernarfonshire",
                "Glamorganshire",
                "Denbighshire",
                "Monmouthshire",
                ];

var columns = []; 

var data = {}; //data object

//variables
var highest = 1;
var lowest = null;

var xAngle = 1;
var yAngle = 1;

//random numbers
function generateColumns() {
	columns = [];
	$("#datatable thead input").each(function(element)  //iterting the data table 
	{
		var val = $(this).val();
		columns.push(val); //add new figures at the end of columns array
	});
}



function doData() {
	data = {}; 
	highest = 1;
	lowest = null;

	$(counties).each(function (i, county) 
	{
		var input = $('#'+county+'-data');
		
		//console.log(input);
		var total = 0;
		
		input.find("input").each(function(i) 
		{
			var val = parseFloat($(this).val());
			if (isNaN(val))
				val = 0;
			
			//data[columns[i]] = val;
			
			total += val;
		});
		
		if (total > highest)
			highest = total;
		if (lowest == null || total < lowest)
			lowest = total;
		data[county] = total;
	});
	
	render();
}



//algorithm for distortion

function render() {
	renderTimer = null;
	/*$.each(data, function(county, total) {
		var val = (total/highest)*(Math.abs(xAngle));
		
		$('#'+county).css({
			transform: 'translateZ('+val+'px)'
		});
	})*/
	
	for(var county in data) 
	{
		var total = data[county];
		var scaled = (total-lowest)/(highest-lowest);
		var val = scaled * 30 * (Math.abs(yAngle/80)+0.5);
		
		/*$('#'+county).css({
			transform: 'translateZ('+val+'px)'
		})*/
		
		var el = document.getElementById(county);
		if (el != null) {
			el.style.transform = 'translateZ('+val+'px)';
		}
	}
	
	//document.getElementById("Wales").style.opacity = xAngle % 1;
}




$(function() {
	
	var renderTimer = null;
	var RENDER_DELAY = 10;
	
	var ySlider = document.getElementById("ySlider");
	var yWrapper = document.getElementById("map-wrapper-y");
	var yFunc = function() {
		yWrapper.style.transform = 'rotateX('+this.value+'deg)';
		yAngle = this.value;
		if (renderTimer == null)
			setTimeout(render, RENDER_DELAY);
	} 
	
	ySlider.addEventListener('input', yFunc);
	ySlider.addEventListener('change', yFunc);
	
	var xSlider = document.getElementById("xSlider");
	var xWrapper = document.getElementById("map-wrapper-x");
	var xFunc = function() {
		xWrapper.style.transform = 'rotateY('+this.value+'deg)';
		xAngle = this.value;
		if (renderTimer == null)
			 setTimeout(render, RENDER_DELAY);
	} 
	
	xSlider.addEventListener('input', xFunc);
	xSlider.addEventListener('change', xFunc); 
	
	/*$("#ySlider").bind('input change', function() {
		$("#map-wrapper-y").css({
			transform: 'rotateX('+$(this).val()+'deg)'
		});
	});*/
		

	/*$("#xSlider").bind('input change', function() {
		$("#map-wrapper-x").css({
			transform: 'rotateY('+$(this).val()+'deg)'
		});
	});*/
	
	$("#datatable thead input").change(function() {
		generateColumns();
	});
	
	
	generateColumns(); //function call
	
	$(counties).each(function (i, val) 
	{
		$("#datatable").append('\
		<tr id="'+val+'-data">\
			<td>'+val+'</td>\
			<td><input type="text" value=""></td>\
			<td><input type="text" value=""></td>\
			<td><input type="text" value=""></td>\
			<td><input type="text" value=""></td>\
			<td><input type="text" value=""></td>\
		</tr>');
		$("#"+val+'-data').find("input").each(function() {
			$(this).val(Math.floor(Math.random()*100));
		});
	});

	$("#datatable input").bind('input change', function() {
		doData();
	});
	
	doData();
	
});
