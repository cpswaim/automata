/****

View class for the Automata
Simple interface to display the 
calculated automata on the page

****/

var AutomataView = function(cfg){
	var me = this;

	me.initialState = (cfg.initialState) ? cfg.initialState : "";

	if(cfg.el) {
		me.el = cfg.el;
	} 
	else if (cfg.elId){
		me.el = document.getElementById(cfg.elId);
	}
	else{
		me.el = document.getElementById('view');
	}

	if(cfg.stateMap){
		me.stateMap = cfg.stateMap;
	} 
	else {
		me.stateMap = {
			"0":"0",
			"1":"1"
		}
	}

	me.setState(me.initialState);
}

///Overwrite state (html)
AutomataView.prototype.setState = function(html) {
	return $(this.el).html(html);
}

///Get current view state (html)
AutomataView.prototype.getState = function() {
	return $(this.el).html();
}

///Revert to initial state
AutomataView.prototype.reset = function() {
	return this.setState(this.initialState);
}

///Add a row to the Automata view
AutomataView.prototype.addRow = function(row){
	var me = this,
		el = $(me.el),
		stateMap = me.stateMap,
		state = null;

	for(state in getKeys(stateMap)){
		row = row.replaceAll(state, stateMap[state]);
	}

	el.html(el.html()+'<div>'+row+'</div>');

	return true;
}