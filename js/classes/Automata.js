/***

Automata class that contains the logic for
an elementary cellular automaton. It defaults to 
values for rule 30.

***/

var Automata = function(cfg){
	var me = this;
	me.states = (cfg.states) ? cfg.states : "01";
	me.ruleSet = (cfg.ruleSet) ? cfg.ruleSet : "00011110";
	me.initialRow = (cfg.initialRow) ? cfg.initialRow : "1";

	var initialSteps = cfg.initialSteps;

	///If false or blank, by default will calculate the set number of steps (default 20)
	me.map = (cfg.delayRender) ? [me.initialRow] : me.buildMap(initialSteps);
}

Automata.prototype.setRules = function(rules){
	if(rules.length === 8){
		this.ruleSet = rules;
		return true;
	}
	return false;
}

Automata.prototype.getRules = function(){
	return this.ruleSet;
}

///Get Map (current state of the automaton)
Automata.prototype.getMap = function(){
	return this.map;
}

//Check that a cell state is valid for the automaton
Automata.prototype.isValidState = function(value){
	return this.states.indexOf(value) !== -1;
}

///Get the selected rule from the rules set
Automata.prototype.getRuleValue = function(rule){
	return this.ruleSet[rule];
}

Automata.prototype.calculateCellValue = function(firstValue, secondValue, thirdValue){

	var me = this,
		ruleSet = me.ruleSet,
		value = rule = null;

	if(!ruleSet || ruleSet.length < 8) return false;

	rule = me.getState(firstValue, secondValue, thirdValue);

	return me.getRuleValue(rule);
}

///state machine for elementary cellular automaton
Automata.prototype.getState = function(firstValue, secondValue, thirdValue){
	var state = null;

	if (firstValue === "1"){
		if(secondValue === "1"){
			if(thirdValue === "1"){
				state = 0;
			}
			else if (thirdValue === "0"){
				state = 1;
			}
		}
		else if (secondValue === "0"){
			if(thirdValue === "1"){
				state = 2;
			}
			else if (thirdValue === "0"){
				state = 3;
			}
		}
	} 
	else if(firstValue === "0"){
		if(secondValue === "1"){
			if(thirdValue === "1"){
				state = 4;
			}
			else if (thirdValue === "0"){
				state = 5;
			}
		}
		else if (secondValue === "0"){
			if(thirdValue === "1"){
				state = 6;
			}
			else if (thirdValue === "0"){
				state = 7;
			}
		}
	}

	return state;

}

///Evolve to the next generation based on the parent row
Automata.prototype.evolve = function(parentRow){
	var me = this,
		childRow = "",
		firstValue = secondValue = thirdValue = null,
		tempParent = null,
		width = null;

	if(!parentRow) parentRow = me.map[me.map.length-1]

	tempParent = "0"+parentRow+"0";

	width = tempParent.length;

	for(var i = 0; i < width; i++){
		firstValue = (i !== 0) ? tempParent[i-1] : "0";
		secondValue = tempParent[i];
		thirdValue = (i < width - 1) ? tempParent[i+1] : "0";

		cell = this.calculateCellValue(firstValue, secondValue, thirdValue);
		childRow += cell;
	}

	me.map.push(childRow);

	return childRow;
}

///Evolve for a certain number of steps from the initial row
Automata.prototype.buildMap = function(steps){
	var me = this,
		generation = 0,
		steps = (steps) ? steps : 20,
		childRow = "",
		parentRow = comparisonRow = null;

	me.map = [me.initialRow];

	for(;generation < steps; generation++){
		this.evolve();
	}	

	return me.map;
}

///Clear references for the automaton
Automata.prototype.destroy = function(){
	var me = this;

	me.states = null;
	me.map = null;
	me.ruleSet = null;
	me.initialRow = null;
	
}