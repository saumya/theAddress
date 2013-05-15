var AppEngine = {
	init: function(){
		console.log('AppEngine : init');
		//initialising properties
		//this.myAddressDB='';
		this.myAddressDB=Lawnchair('addressBook',function(e){
			console.log('Lawnchair is initialised.');
		});
		this.checkForLocalDataAndFillTheForm();
		//saving the scope
		var that = this;
		//add event handlers
		$("#save_address").on('tap',that,this.onSaveTapped);
		$("#clear_address").on('tap',that,this.onClearTapped);
		$("#get_address").on('tap',that,this.onGetAddressTapped);
		//orientation change
		$(window).on( "orientationchange",function(event){
			console.log('AppEngine : onOrientationChange : '+event.orientation);//portrait,landscape
			if(event.orientation==='portrait'){
				that.onPortraitMode();
			}else{
				that.onLandscapeMode();
			}
		});
	},
	
	onLandscapeMode:function(){
		console.log('AppEngine : onLandscapeMode : ');
		//hide the form. Only show the list
		$.mobile.navigate( "#page_L");
	},
	onPortraitMode:function(){
		console.log('AppEngine : onPortraitMode : ');
		$.mobile.navigate( "#page_1");
	},
	
	onSaveTapped: function(event){
		event.preventDefault();
		console.log('AppEngine : onSaveTapped : '+event.data);
		var that = event.data;
		that.saveDataLocally();
	},
	onClearTapped: function(event){
		event.preventDefault();
		console.log('AppEngine : onClearTapped : ');
		var that= event.data;
		//clear all the fields
		$('#text-name').val('');
		$('#text-country').val('');
		$('#text-state').val('');
		$('#text-city').val('');
		$('#text-street1').val('');
		$('#text-street2').val('');
		$('#text-code').val('');
	},
	onGetAddressTapped: function(event){
		event.preventDefault();
		console.log('AppEngine : onGetAddressTapped : ');
		var that = event.data;
		that.checkForLocalDataAndFillTheForm();
	},
	saveDataLocally: function(){
		console.log('AppEngine : saveDataLocally : ');
		//var dbShell = window.openDatabase(database_name, database_version, database_displayname, database_size);
		//var db = window.openDatabase("myAddress","1.0","My Address",1000000);
		//console.log(this.myAddressDB);
		var aName = $('#text-name').val();
		var aCountry = $('#text-country').val();
		var aState = $('#text-state').val();
		var aCity = $('#text-city').val();
		var aStreet1 = $('#text-street1').val();
		var aStreet2 = $('#text-street2').val();
		var aCode = $('#text-code').val();
		this.logIt(aName);
		this.logIt(aCountry);
		this.logIt(aState);
		this.logIt(aCity);
		this.logIt(aStreet1);
		this.logIt(aStreet2);
		this.logIt(aCode);
		//save it locally
		//make the object to store
		var myAddress = {key:'address',myName:aName,myCountry:aCountry,myState:aState,myCity:aCity,myStreet1:aStreet1,myStreet2:aStreet2,myCode:aCode};
		//store the object in DB
		this.myAddressDB.save(myAddress);
		//navigator.notification.alert('The most needed address is saved for your future reference.', undefined, 'Yeeha.','OK');
		//animate the box color
		$("#a_total").hide().fadeIn('slow');
		//
		this.checkForLocalDataAndFillTheForm();
	},
	checkForLocalDataAndFillTheForm: function(){
		console.log('AppEngine : checkForLocalDataAndFillTheForm : ');
		//check for the data, if its previously stored
		this.myAddressDB.get('address',
			function(theAddress){
				//check if we got the data
				if(theAddress){
					$('#text-name').val(theAddress.myName);
					$('#text-country').val(theAddress.myCountry);
					$('#text-state').val(theAddress.myState);
					$('#text-city').val(theAddress.myCity);
					$('#text-street1').val(theAddress.myStreet1);
					$('#text-street2').val(theAddress.myStreet2);
					$('#text-code').val(theAddress.myCode);
					//
					var s = theAddress.myName+',<br/>'+theAddress.myStreet1+',<br/>'+theAddress.myStreet2+',<br/>'+theAddress.myCity+', '+theAddress.myState+', '+theAddress.myCountry+',<br/>'+theAddress.myCode;
					$("#total_address").html(s);
				}else{
					//alert('No address stored yet !');
					//navigator.notification.alert(message, alertCallback, [title], [buttonName])
					//navigator.notification.alert('Save the one address, which you need most now.', undefined, 'Get Started.','OK');
					var s1 = "Save the one address, which you need most now.";
					$("#total_address").html(s1);
				};
			}
		);
	},

	logIt:function(message){
		console.log('AppEngine : logIt : '+message);
	},
	destroy: function(){
		console.log('AppEngine : destroy');
	}
};