/**
* @name     NESCode jsApp - nescode.js
* @project  NESCode
* @author <codes>      mediaHACK - http://mediahack.com
* @date         2010.12.09
* @version      101209
*
* @licence  New BSD License.
* @licence  Creative-Commons BY
* 
* This jsApp will embed NES style cheat code into your pages.
*
**/
function NESCode( settings ){ 
	
	this.scriptHost = "http://nescode.googlecode.com/files/nescode.min.js";
	this.settings = settings;
	this.debug = false;
	this.input = "";
	this.selectKey = 16; // Shift
	this.startKey = 13; // Enter
	this.cheats = {
		"contra": { "code": [38,38,40,40,37,39,37,39,66,65,16,13], "callback": "_30lives" }				
	};
	
	this.customCheats = null;
	
	this.snifferSpeed = 250;
	this.timeout = null;
	this.timer = 3000;
	
	NESCode.currentIndex = NESCode.currentIndex || 0;    
	this.index = NESCode.currentIndex++;
	
	/**
	* Initilization of our NES Code Object
	**/
	this.init = function()
	{	
		var nes = this;
		
		nes.config();				
		
		if( document.addEventListener )
			document.addEventListener('keyup', function(e){ nes.keyUp(e); }, false);
		else if( document.attachEvent )
			document.attachEvent('onkeyup', function(e){ nes.keyUp(e); });
		
		setInterval( function(){ nes.codeSniffer(); }, nes.snifferSpeed );
	}; // this.init = function()
	
	/**
	*
	**/
	this.config = function()
	{
		
		// If we don't have any settings, lets just go with what we got!
		if( this.settings != null )
		{ 				
			// loop thru our provided settings 
			for( var x in this.settings){ 
				this[ x ] = this.settings[ x ];						
			} // for( var x in this.settings)
		} // if( this.settings != null )
		
		if( this.customCheats != null && typeof this.customCheats == "object" )
		{				
			for( var x in this.customCheats ){			
				if( this.cheats[ x ] != undefined )
					for(var y in this.customCheats[ x ] )
						this.cheats[ x ][ y ] = this.customCheats[ x ][ y ];
				else
					this.cheats[ x ] = this.customCheats[ x ];
			}
		} // if( this.customCheats != null && typeof this.customCheats == "object" )
		
	}; // this.config = function()
	
	/**
	* Function that monitors for codes. Polling based. Sorry.
	**/
	this.codeSniffer = function()
	{
		var nes = this;
		
		for( var x in nes.cheats ){
			var input = nes.input;
			var code = nes.cheats[x].code.join("");
			var doIt = nes.cheats[x].callback || nes.myCheat; 
			var reg = RegExp( code );					
			
			if( reg.test(input) && input.length > 0 && input.length >= code.length )
			{ 
				
				if( nes.debug ) console.log("found " + x );
				
				// reset our input buffer
				nes.resetInputBuffer(); 
				
				// Try to run our cheat
				// Looks within the window object for a function with the cheat name provided. We
				// start here because we want to accept user overrides from outside this class first.
				if( typeof window[ doIt ] == "function" )														
					window[ doIt ]();					
				// Checks if the cheat is an anonymous function. This is second in preference because
				// we want to provide preference to anon functions
				else if( typeof doIt == "function" )
					doIt();
				// Looks within this class for a function with the cheat name provided
				else if( typeof this[ doIt ] == "function" )
					this[ doIt ]();
				// Erm we don't have anything. However this SHOULD be caught by above assignment and do the default
				else if( doIt == undefined )
					if( console && nes.debug ) console.log( "erm, you didn't specify a cheat to perform on this code!" );
				// Super fail. Don't konw what to do.
				else
					if( console && nes.debug ) console.log( "I don't know how to use this cheat!" );
			} // if( reg.test(code) && input.length > 0 && input.length >= code.length )
			
		} // for( var x in c.cheats )
		
	}; // this.stringer = function()
				
	/**
	* Clears the input buffer
	**/
	this.resetInputBuffer = function()
	{
		if( this.debug ) console.log( "clearing input array");
		this.input = "";
	}; // this.clearInput = function()
	
	/**
	* Event listener function for on key up. Adds the current released key to the input 
	* buffer then sets a timeout for the length of the timer. Timer default is 5 seconds.
	**/
	this.keyUp = function(e)
	{					
		var nes = this;
		nes.input += e.keyCode; 
		
		if( nes.debug ) console.log( e.keyCode );
		if( nes.debug ) console.log( "current input: " + nes.input );
		
		
		if( nes.timeout != null ) clearTimeout( nes.timeout );	
		nes.timeout = setTimeout( function(){ nes.resetInputBuffer(); }, nes.timer );
	}; // this.keyUp = function(e)
	
	/**
	* Default Cheat Code. Doesn't do anything but impersonate Palpatine.
	**/
	this.myCheat = function()
	{
		var message = "ULTIMATE POWER!";
		if( console && console != undefined ) console.log( message );
		else alert( message );
	}; // this.myCheat = function()
	
	/**
	* Default Cheat Code. Doesn't do anything but impersonate Palpatine.
	**/
	this._30lives = function()
	{ 
		var nes = this;
		var body = document.getElementsByTagName("body")[0];
		var audio = document.getElementById("_30lives") || document.createElement("embed");				
		
		audio.id = "_30lives";
		//audio.start = nes.scriptHost + "audio/Contra_G_Probotector_StageComplete.mid";
		audio.src = "http://nescode.googlecode.com/files/Contra_G_Probotector_StageComplete.mp3";
		audio.autostart = true; 
		audio.hidden = true; 
        audio.type = "audio/mpeg";
		
		document.getElementsByTagName('body')[0].appendChild( audio );				
		
	}; // this.myCheat = function()
	
	this.init();
}
