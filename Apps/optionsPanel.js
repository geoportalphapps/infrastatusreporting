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
 

Ext.define('Apps.optionsPanel',{
	extend: 'Ext.panel.Panel',	
	title: 'Filter',	
	alias: 'widget.UserLogin',
	//height: 170,
	width:270,	
	applyFilter:function(){
	
		var mappanel  = Ext.getCmp('mappanel');
		var structure_type=this.down('#cmbStructure_type').getValue();
		var vectorLayer = mappanel.map.getLayersByName('Features Layer')[0];
		mappanel.createStore(vectorLayer, {user_id:mappanel.user.ID, feature_type:structure_type});
		
		
			
	},
	initComponent: function(){
	
		var me = this;
		Ext.apply(me,{
			items:[
				{
					xtype:'combo',
					fieldLabel:'Feature type',
					itemId:'cmbFeaturetype',
					padding:5, 
					store:['All', 'Point', 'Line', 'Polygon'],
					listeners:{
						select:function(){
							console.log(this.getValue());
							Ext.Ajax.request({
								url:'/getFeatureTypes/' + this.getValue().toUpperCase(),
								success:function(response){
									var obj = Ext.decode(response.responseText);
									var list = [];
									for(var item in obj){
										console.log(obj[item].feature_name);
										list.push(obj[item].feature_name);
										
									}
									var combo  = me.down('#cmbStructure_type')
									combo.setValue('');//clear struct type combo box
									combo.bindStore(list);
									combo.store.load();
									console.log(list);
								}
								
							})
							
						}
					}
					
				},
				{
					xtype:'combo',
					padding:5,
					fieldLabel:'Structure type',
					itemId:'cmbStructure_type',
					//store:[],
					
					
				}
				
			],
			buttons:[
				{
					text:'Apply filter',
					handler:function(){
						var feature_type=me.down('#cmbFeaturetype').getValue();
						var structure_type=me.down('#cmbStructure_type').getValue();
						
						console.log(feature_type);		
						if (feature_type !=null && feature_type!='' && structure_type!=null && structure_type!='' || feature_type=='All'){
							me.applyFilter()
						}else{
							Ext.Msg.alert('Message','All fields required!');
						}	
					}	
					
				}
			]
			
		
		
		
		

		
		
		
		})
		this.callParent();
	
	}

})


