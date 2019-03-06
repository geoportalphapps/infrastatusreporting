/*
This file is part of PG Infrastructure Status Reporting

Copyright (c) 2013 National Mapping and Resource Information Authority

PG Infrastructure Status Reporting is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

PG Infrastructure Status Reporting is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with PG Infrastructure Status Reporting.  If not, see <http://www.gnu.org/licenses/>.
*/
 

Ext.define('Apps.RegisterUser',{
	extend: 'Ext.window.Window',	
	title: 'Register User',
	alias: 'widget.RegisterUser',
	height: 360,
	width:370,	
	//layout:'vbox',
	initComponent: function(){
	
	var me = this;
	
	Ext.apply(me,{
	items:{
		xtype: 'form',
		itemId:'regForm',
		url: './register',
		width: 360,
		//height:460,
		bodyPadding: 10,
		frame:true,
		//defaultType: 'textfield',
		defaults: {
			anchor: '100%'
		},
		items: [
			{
				xtype:'textfield',
				allowBlank: false,
				fieldLabel: 'Username',	
				emptyText:'Username',
				name: 'username',
				width: '95%'									
			},
			{
				xtype:'textfield',
				allowBlank: false,
				fieldLabel: 'password',
				name: 'password',
				id:'password',
				emptyText: 'password',
				inputType: 'password'
			},											
			{
				xtype:'textfield',
				allowBlank: false,
				fieldLabel: 'Confirm password',
				id:'confirmPassword',
				name: 'confirmPassword',
				emptyText: 'Confirm password',
				inputType: 'password'
			},
			/*
			{
				xtype:'textfield',
				allowBlank: false,
				fieldLabel: 'Address',
				name: 'address',
				emptyText: 'address'
			
			},*/
			{
				xtype:'textfield',
				allowBlank: false,
				fieldLabel: 'Last name',
				name: 'lastname',
				emptyText: 'Last name',
			},{
				xtype:'textfield',
				allowBlank: false,
				fieldLabel: 'First name',
				name: 'firstname',
				emptyText: 'First name',
			},
			{
				xtype:'textfield',
				allowBlank: false,
				fieldLabel: 'Middle name',
				name: 'middlename',
				emptyText: 'Middle name',
			},
			{
				xtype:'textfield',
				allowBlank: false,
				fieldLabel: 'Contact No',
				name: 'contactno',
				emptyText: 'Contact number',
			},
			{	
				xtype:'textfield',
				allowBlank: false,
				fieldLabel: 'E-mail',
				name: 'email',
				id:'email',
				emptyText: 'E-mail',
			},
			{	
				xtype:'textfield',
				allowBlank: false,
				fieldLabel: 'Affiliation',
				name: 'affiliation',
				id:'affiliation',
				emptyText: 'Affiliation',
			},
			{	
				xtype:'textfield',
				allowBlank: false,
				fieldLabel: 'Occupation',
				name: 'occupation',
				id:'occupation',
				emptyText: 'Occupation',
			}
		],
		buttons: [
			{ 
				text:'Save',
				handler: function() {
				
					
					var me = this.up().up(); 
					var passcode= me.down('#password').getValue();
					var passLen = (passcode.length);
					var confirmPasscode = me.down('#confirmPassword').getValue();
					// Check if passcode = confirm passcode	
					if (passcode != confirmPasscode){
						Ext.Msg.alert('Registration', " Passcode does not match the confirm passcode");														
					}else if (passLen < 6){ 
						Ext.Msg.alert('Registration', 'Passcode must be at least 6 characters');
					
					}else{							
				
						var form = this.up('#regForm').getForm();
					
						var formData=form.getFieldValues();
						form.params=formData;
						console.log(formData);
						if (form.isValid()) {
							form.submit({
								success: function(form, action) {
									//console.log(action, form)
									Ext.MessageBox.show({
										title:'Register user',
										msg:action.result.msg,
										buttons: Ext.MessageBox.OK,
										icon: Ext.Msg.INFORMATION,
										fn: function(btn) {
											
											if(btn === 'ok'){
												location.href='./'
											}else{
												console.log('Nothing pressed');
											}
										}
									});	
								},
								failure: function(form, action) {
									
									Ext.Msg.alert('Failed', action.result.msg);
									
								}
							});
							
						}
					}	
				}
				
			},
			{
				text:'Cancel',
				handler:function(){
					me.close();
					
					
				}	
			}
		]
		
	
	}
	
	})
	this.callParent();
	
	}

})


