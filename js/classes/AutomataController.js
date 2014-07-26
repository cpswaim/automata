/*****

Automata application controller
Handles interaction between the DOM (view)
and the Automata class.

****/

var AutomataController = function(cfg){
	var me = this;

	//DOM references
	me.startButton = $('#startButton'),
	me.stopButton = $('#stopButton'),
	me.resetButton = $('#resetButton'),
	me.settingsButton = $('#settingsButton'),
	me.clearSettingsButton = $('#clearSettingsButton'),
	me.moreSettingsPanel = $('#moreSettings'),
	me.initialRowInput = $('#initialRowInput'),
	me.animationDelayInput = $('#animationDelayInput'),
	me.ruleInput = $('#ruleInput'),
	me.messageLog = $('#messageLog');

	//Default Values
	me.automata = me.rule = me.evolvingFunction = null;

	me.view = new AutomataView({
		initialState:"Please make your selections above.",
		stateMap:{
			"0":"&#xf096;",
			"1":"&#xf0c8;"
		}
		// stateMap:{
		// 	"0":"<span class=\"dead-cell\">&nbsp;</span>",
		// 	"1":"<span class=\"alive-cell\">&nbsp;</span>"
		// }
	});

	///Attach handlers to DOM elements
	me.attachToDOM();
} 

///Attach handlers to application buttons
AutomataController.prototype.attachToDOM = function(){
	var me = this,
		startButton = me.startButton,
		stopButton = me.stopButton,
		resetButton = me.resetButton,
		settingsButton = me.settingsButton,
		moreSettingsPanel = me.moreSettingsPanel,
		clearSettingsButton = me.clearSettingsButton,
		view = me.view;

	startButton.click(function(){
		if(!me.automata){ 
			me.createAutomata();
		}
		else if(!me.evolvingFunction){
			me.animationDelay = (me.animationDelay = $(animationDelayInput).val()) ? me.animationDelay : 100;
			
			me.evolvingFunction = setInterval(function(){
					me.evolve();
			}, me.animationDelay);
		}

		if(me.automata){
			startButton.attr('disabled', true);
			stopButton.attr('disabled', false);
			resetButton.attr('disabled', false);
		}
	});

	stopButton.click(function(){
		clearInterval(me.evolvingFunction);
		me.evolvingFunction = null;

		startButton.attr('disabled', false);
		stopButton.attr('disabled', true);
		resetButton.attr('disabled', false);
	});

	settingsButton.click(function(){
		moreSettingsPanel.slideToggle(200);
	});

	resetButton.click(function(){
		me.resetAutomata();
		me.resetButtonsState();
		view.reset();
	});

	clearSettingsButton.click(function(){
		$(ruleInput).val("");
		$(initialRowInput).val("");
		$(animationDelayInput).val("");
	});

	return true;
}

///Reset buttons to starting state
AutomataController.prototype.resetButtonsState = function(){
	var me = this,
	startButton = me.startButton,
	stopButton = me.stopButton,
	resetButton = me.resetButton;

	startButton.attr('disabled', false);
	stopButton.attr('disabled', true);
	resetButton.attr('disabled', true);

	return true;
}

///Fire automaton engine evolve, update view with new row
AutomataController.prototype.evolve = function(){
	var me = this,
		newRow = me.automata.evolve(),
		view = me.view;

	view.addRow(newRow);
}

///Create a new automata and begin evolution
AutomataController.prototype.createAutomata = function(){

	var me = this,
		states = "01",
		view = me.view,
		initialRow = (initialRow = me.initialRowInput.val()) ? initialRow : "1",
		ruleNumber = parseInt((ruleNumber = me.ruleInput.val()) ? ruleNumber : "30"),
		cell = null;

	me.animationDelay = parseInt((animationDelay = me.animationDelayInput.val()) ? animationDelay : 100);

	///Validate Input
	for(var i = 0; i < initialRow.length; i++){
		cell = initialRow[i]
		if( states.indexOf(cell) === -1 ){
			me.logError("Initial row must be in binary form (eg. 1, 111, or 10001)");
			me.resetButtonsState();
			return false;
		}
	}

	if(!ruleNumber || ruleNumber < 0 || ruleNumber > 255){
		me.logError("Rule must be between 0 and 255");
		me.resetButtonsState();
		return false;
	}

	if(!me.animationDelay || me.animationDelay < 0 || me.animationDelay > 10000){
		me.logError("Animation delay must be between 0 and 10000 ms");
		me.resetButtonsState();
		return false;
	}

	//Create binary rule
	rule = ruleNumber.toString(2); //Convert to binary
	rule = "0".repeat(8-rule.length)+rule;

	///Create automata engine
	me.automata = new Automata({
		ruleSet : rule,
		states : states,
		initialRow : initialRow,
		delayRender : true
	});

	//Put first row in view
	view.setState("");
	view.addRow(initialRow);

	///Start evolution animation
	me.evolvingFunction = setInterval(function(){
		me.evolve()
	}, me.animationDelay);

	return true;
}

///Stop evolution and delete automata
AutomataController.prototype.resetAutomata = function(){
	var me = this;

	///Stop evolution timer function
	if(me.evolvingFunction) clearInterval(me.evolvingFunction);

	//Destroy automata
	if(me.automata){
		me.automata.destroy();
		me.automata = null;
	} 
}

// Log to message box. 
//    types allowed (from bootstrap): default, primary, success, info, warning, danger
AutomataController.prototype.logMessage = function(message, type, hideDelay){
	var me = this,
		messageLog = $(me.messageLog),
		type = type || "default",
		hideDelay = hideDelay || 3000,
		html = "<span class=\"label label-"+type+"\">"+message+"</span>";

		messageLog.show(100);
		messageLog.html(html);
		setTimeout(function(){
			messageLog.slideUp(100, function(){
				messageLog.html("");
			});
		}, hideDelay)
}

AutomataController.prototype.logError = function(error){
	this.logMessage("Error: "+ error, "danger");
}

AutomataController.prototype.logInfo = function(error){
	this.logMessage("Info: "+error, "info");
}