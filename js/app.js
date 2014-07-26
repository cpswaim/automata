String.prototype.repeat = function( num )
{
    return new Array( num + 1 ).join( this );
}

String.prototype.replaceAll = function(value, replace){
  return this.replace(new RegExp(value, 'g'), replace);
}

getKeys = function(obj){
	var keys = [];
	for(var k in obj) keys.push(k);
	return keys;
}

$(document).ready(function() {

	///Initialize Controller
	var app = new AutomataController();

});
