/*
 * 
 * reference : 
		var myContact = navigator.contacts.create({
		"displayName":null,
		"name":{"givenName":"Intellectual","formatted":"Intellectual Mollusc","middleName":null,"familyName":"Mollusc","honorificPrefix":null,"honorificSuffix":null},
		"nickname":null,
		"phoneNumbers":[{"type":"other","value":"00353 2345235","id":0,"pref":false},
						{"type":"mobile","value":" ","id":1,"pref":false}],
		"emails":[{"type":"home","value":"work@intellectualmollusc.net","id":0,"pref":false}],
		"addresses":[{"postalCode":"","type":"work","id":0,"locality":"cork","pref":"false","streetAddress":" ","region":" ","country":"Ireland"}],
		"ims":null,
		"organizations":[{"name":"School","title":"Student","type":null,"pref":"false","department":"Kitchen"}],
		"birthday":null,
		"note":"YourRefUniqueID:47831",
		"categories":null,
		"urls":[{"type":"other","value":"intellectualmollusc.net","id":0,"pref":false}]
	});
 * 
 */
var AppEngine = {
	a_counter: 1,
	init: function(){
		console.log('AppEngine : init : '+this.a_counter);
		//initialising properties
		//this.myAddressDB='';
		this.myAddressDB=Lawnchair('addressBook',function(e){
			console.log('Lawnchair is initialised.');
		});
		//saving the scope
		var that = this;
		//getting the stored data
		this.myAddressDB.get('counter',
				function(result){
					//check if we got the data
					if(result){
						var i = result.value;
						//console.log('Stored counter = '+i);
						//console.log('this.a_counter = '+that.a_counter);
						that.a_counter=i;
						//console.log('this.a_counter = '+that.a_counter);
					}else{
						//alert('No address stored yet !');//silently die. Lol
						console.log('No address stored yet !');
					};
				});
		//update the forms with the data
		this.checkForLocalDataAndFillTheForm();
		//add event handlers
		$("#save_address").on('tap',that,this.onSaveTapped);
		$("#clear_address").on('tap',that,this.onClearTapped);
		$("#get_address").on('tap',that,this.onGetAddressTapped);
		//
		$(".btnSave").on('tap',that,this.onSaveToContacts);
		//interactivity
		$("#a_total").on('swipeleft',that,this.onSwipeLeft);
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
	
	onSwipeLeft:function(event){
		event.preventDefault();
		var that = event.data;
		//console.log('AppEngine : onSwipeLeft : this.a_counter='+that.a_counter);
		//$("#a_total").animate({opacity: '-=0.10',height:'-=10px',left:'-=10px'});
		//$("#a_total").animate({left:'-=50px', height:'-=50px'}, 1000);
		/*
		var aName = $('#text-name').val();
		var aCountry = $('#text-country').val();
		var aState = $('#text-state').val();
		var aCity = $('#text-city').val();
		var aStreet1 = $('#text-street1').val();
		var aStreet2 = $('#text-street2').val();
		var aCode = $('#text-code').val();
		*/
		//
		var a = $("#a_total");
		TweenMax.to(a, 1,{x:'-1000px',ease:Linear.easeIn,onCompleteScope:that,onComplete:that.onSlideOutDone});
	},
	onSuccess:function(contact){
		console.log('SUCCESS');
	},
	onError:function(contactError){
		console.log('FAIL : '+contactError.code);
	},
	
	onSlideOutDone : function(){
		console.log('Done Animating : Out : this.a_counter='+this.a_counter);
		var that = this;
		//do the DB instertion stuff
		
		if(this.a_counter>=5){
			//alert('Max reached');
			this.a_counter=0;
		}
		this.a_counter++;//increase the storage index
		console.log('Done Animating : Out : this.a_counter='+this.a_counter);
		$('#text_counter').html(this.a_counter);
		//animate back in
		var a = $("#a_total");
		TweenMax.to(a, 1,{x:'0px',ease:Linear.easeOut,onCompleteScope:that,onComplete:that.onSlideInDone});
	},
	onSlideInDone:function(){
		console.log('Done Animating : In ');
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
		/*
		this.logIt(aName);
		this.logIt(aCountry);
		this.logIt(aState);
		this.logIt(aCity);
		this.logIt(aStreet1);
		this.logIt(aStreet2);
		this.logIt(aCode);
		*/
		//save it locally
		var that = this;
		console.log('AppEngine : saveDataLocally : saved : this.a_counter='+this.a_counter);
		//make the object to store
		var myAddress = {key:this.a_counter,address:{myName:aName,myCountry:aCountry,myState:aState,myCity:aCity,myStreet1:aStreet1,myStreet2:aStreet2,myCode:aCode}};
		//store the object in DB
		this.myAddressDB.save(myAddress,function(obj){
				console.log('AppEngine : saveDataLocally : saved : that.a_counter='+that.a_counter);
				var address = obj.address;
				for(var item in address){
					console.log(item+':'+address[item]);
				};
				that.checkForLocalDataAndFillTheForm();
			});
		//store the counter
		var c = {key:'counter',value:that.a_counter};
		this.myAddressDB.save(c,function(obj2){
			console.log('saved : counter='+obj2.value);
		});
		//navigator.notification.alert('The most needed address is saved for your future reference.', undefined, 'Yeeha.','OK');
		//animate the box color
		$("#a_total").hide().fadeIn('slow');
		//this.checkForLocalDataAndFillTheForm();
	},
	checkForLocalDataAndFillTheForm: function(){
		console.log('AppEngine : checkForLocalDataAndFillTheForm : this.a_counter='+this.a_counter);
		$('#text_counter').html(this.a_counter);
		//check for the data, if its previously stored
		this.myAddressDB.get(this.a_counter,
			function(result){
				//check if we got the data
				if(result){
					var theAddress = result.address;
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
		
		//update the address-only page details
		for(var i=1;i<=5;i++){
			var sID =("#a_"+i);
			var bsID=("#s_a_"+i);
			this.myAddressDB.get(i,
					function(result){
						//check if we got the data
						if(result){
							var theAddress = result.address;
							var s = theAddress.myName+',<br/>'+theAddress.myStreet1+',<br/>'+theAddress.myStreet2+',<br/>'+theAddress.myCity+', '+theAddress.myState+', '+theAddress.myCountry+',<br/>'+theAddress.myCode;
							
							$(bsID).show();
							$(sID).html(s);
						}else{
							$(sID).html('No Address stored yet !');
							$(bsID).hide();
						};
					}
			);
		};
		
	},
	
	
	onSaveToContacts:function(event){
		event.preventDefault();
		console.log('AppEngine : onSaveToContacts : ');
		var that = event.data;
		var o = event.target;
		console.log('id = '+o.id);//s_a_1
		//var iID = '#'+(o.id).substr(4);
		//console.log('iID='+iID);
		//console.log('notes='+$(iID).html());
		var i = (o.id).substr(4);
		console.log('i='+i);
		that.myAddressDB.get(i,
				function(result){
					//check if we got the data
					if(result){
						var theAddress = result.address;
						//var sa = theAddress.myName+',<br/>'+theAddress.myStreet1+',<br/>'+theAddress.myStreet2+',<br/>'+theAddress.myCity+', '+theAddress.myState+', '+theAddress.myCountry+',<br/>'+theAddress.myCode;
						//console.log(sa);
						// create a new contact object
						var myContact = navigator.contacts.create();
						myContact.displayName = theAddress.myName;
						myContact.nickname = theAddress.myName;       //specify both to support all devices
						
						var s = theAddress.myStreet1+','+theAddress.myStreet2+','+theAddress.myCity+','+theAddress.myState+','+theAddress.myCountry+','+theAddress.myCode;
						myContact.note=s;
						
						// save to device
						//Fix this, not sure why its giving error!!
						myContact.save(function(contact){
							console.log('saved to AddressBook.');
						},function(contactError){
							console.log('Error saving to AddressBook.'+contactError.code);//Fix this.
						});
						//myContact.save(that.onContactSaveSuccess,that.onContactSaveError);
						//TODO: Fix this
						//for the timebeing show success message to user
						navigator.notification.vibrate(1000);
						navigator.notification.alert('Address is added to the Contacts.', undefined, 'Success', 'Done');
						navigator.notification.beep(1);
						
					}else{
						console.log(' xxxxx ');
					};
				}
		);
		
		
		
		
		
		
	},
	
	/*
	// onSaveSuccess: Get a snapshot of the current contacts
	onContactSaveSuccess : function(contact) {
        alert("Save Success");
    },
    // onSaveError: Failed to get the contacts
	onContactSaveError : function(contactError) {
        alert("Error = " + contactError.code);
    },
    */

	logIt:function(message){
		console.log('AppEngine : logIt : '+message);
	},
	destroy: function(){
		console.log('AppEngine : destroy');
	}
};