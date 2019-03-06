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
 

Ext.define('Apps.addFeatures',{
	extend: 'Ext.window.Window',	
	title: 'Add Feature',	
	alias: 'widget.addFeatures',
	anchor:'100%',
	//height: 190,
	width:380,	
	featureID:'',
	//layout:'vbox',
	map:'',
	feature:'',
	modal:true,
	loadStore:function(ftype){
		var me = this;
		Ext.Ajax.request({
			url:'./getFeatureTypes/' + ftype, 
				success:function(res){
				console.log('RESSSS', res)
				var obj = Ext.decode(res.responseText);
				
				var list = [];
				for(var item in obj){
					console.log(obj[item].feature_name);
					list.push(obj[item].feature_name);
					
				}
				console.log(list);
				list.push('Others')
				me.down('#attribute').bindStore(list);
				//console.log(list);
				//return list;
				
				
			},
			failure:function(res){
				console.log('FAILED',res)
			}
		})
		//grid.getStore().loadData(me.loadGrid())
	},
	loadFeature:function(row){
				var vectorLayer=map.getLayersByName('Features Layer')[0];				
				var feature;
				if (row.structure_type=='point'){
					switch(row.structure_type){
						case 'School':
							img='img/school.png'
							break;
						case 'Hospital':
							img='img/Hospital.png'
							break;
					}
					
					
					feature = new OpenLayers.Feature.Vector(
						new OpenLayers.Geometry.Point(row.extent.geometry.coordinates[0], row.extent.geometry.coordinates[1]),
						{userid:row.user_id, feature_type:row.structure_type, feature_name:row.structure_name,description:row.description},
						{externalGraphic: img, graphicHeight: 25, graphicWidth: 20, graphicXOffset:-12, graphicYOffset:-25 }
					)
					//vectorLayer.addFeatures(feature);
					
				}else if(row.structure_type=='line'){
					
					//create points array
					var row_coordinates=row.extent.geometry.coordinates;
					var line = new OpenLayers.Geometry.LineString();
					for(var rec in row_coordinates){
						var point= new OpenLayers.Geometry.Point(row_coordinates[rec][0], row_coordinates[rec][1])
						line.addPoint(point);
					}
					
					feature = new OpenLayers.Feature.Vector(
						line,{fid:row.feature_id, user:row.user_id,user_name:row.name, feature_type:row.feature_type, feature_name:row.feature_name,description:row.description, structure_type:row.structure_type}
					);
					//vectorLayer.addFeatures(feature)		
					
				}else{
			
					//create points array
					
					var row_coordinates=row.extent.geometry.coordinates[0];
					
					var points=[];
					for(var rec in row_coordinates){
						var point= new OpenLayers.Geometry.Point(row_coordinates[rec][0], row_coordinates[rec][1])
						points.push(point);
						
					}
					
					var ring = new OpenLayers.Geometry.LinearRing(points);
					var polygon = new OpenLayers.Geometry.Polygon([ring]);

					feature = new OpenLayers.Feature.Vector(
						polygon, {fid:row.feature_id, user:row.user_id,user_name:row.name, feature_type:row.feature_type, feature_name:row.feature_name,description:row.description, structure_type:row.structure_type}
					);
					
					//vectorLayer.addFeatures(feature);
				}
				
				vectorLayer.addFeatures(feature);
			//}	
				
		//}
				

	},
	feature_type:'',
	initComponent: function(){
		
	var me = this;
	var feature=this.feature;
	var userID=Ext.getCmp('mappanel').user.ID;
	//alert(userID);
	
	feature_type=this.feature_type;
	Ext.apply(me,{
		items: {
			xtype: 'form',
			url: './SaveFeature',
			frame:true,
			width: 370,
			//bodyPadding: '20 20 20 20',
			//params:{test:'this is a test'},
			//defaultType: 'textfield',
			defaults: {
				anchor: '96%',
				//margin: '0 0 15 0',	
			},	
			items: [
				/*
				{
					xtype:'textfield',
					allowBlank: false,
					fieldLabel: 'Structure Type',
					name: 'structure_type',
					emptyText: 'user name'
				},
				*/
				
				/**
				{
					//allowBlank:false,
					xtype: 'combo',
					name: 'structure_type',
					fieldLabel: 'Feature Type',
					store: me.loadStore(),
					displayField: 'type',
					//valueField: 'feature_name',
					id:'cmbFeature_Type',
					//editable: false
				},
				**/
				//combo test
				{
							xtype: 'combo',
							itemId: 'attribute',
							store: me.list,
							fieldLabel: 'Structure Type',
							editable: false,
							name: 'structure_type',
							listeners: {
								select: function(){
									if (this.getValue()=='Others'){
										this.select(this.getStore().getAt(-1)); //set item index
										var dlg = Ext.MessageBox.prompt('Input', 'Please enter Structure type:', function(btn, text){
										if (btn == 'ok'){
											Ext.Ajax.request({
												url:'./addStructure_type',
												method:'POST',
												params:{feature_type:me.feature_type.toUpperCase(), feature_name:text},
												success:function(res){
													me.loadStore(me.feature_type.toUpperCase());
												}
												
											})
										}
									});

									}
								}
							}
						},
						//end comb
				
				{
					xtype:'textfield',
					allowBlank: false,
					fieldLabel: 'Structure Name',
					name: 'structure_name',
					emptyText: 'Structure name'
				},
				{
					xtype:'textarea',
					allowBlank: false,
					fieldLabel: 'Description',
					name: 'description',
					emptyText: 'Description',
					
				},
				{
					xtype:'textarea',
					allowBlank: false,
					fieldLabel: 'Status',
					name: 'status',
					emptyText: 'status',
					
				},
				{
					xtype:'textarea',
					allowBlank: false,
					fieldLabel: 'extent',
					id:'extent',
					name: 'extent',
					emptyText: 'Description',
					hidden:true,
					
				},
				/*
				{
					xtype:'imageuploadfield',
					itemId:'imageupload',
				},
				*/
				{
					xtype:'textfield',
					allowBlank: false,
					fieldLabel: 'User ID',
					id:'user_id',
					name: 'user_id',
					emptyText: 'User ID',
					hidden:true,
					
				},
				{
					xtype:'textfield',
					allowBlank: false,
					fieldLabel: 'Feature Type',
					name: 'feature_type',
					id: 'feature_type',
					hidden:true,
					emptyText: 'feature_type'
				}
			],
			buttons:[	
				{ 
					xtype:'button',
					//left:10,
					//width:100,
					text:'Ok',
					handler: function() {
						var img = me.down('#imageupload');
						
						var form = this.up('form').getForm();
						if (form.isValid()) {
							form.submit({
								success:function(form, action) {
									//Ext.Msg.alert('Success', action.result.msg);
									//this.loadFeature(form.getValues)
									me.fireEvent('featureAdded',action.result.f_id);
									me.close();
									
										
										
								},
								failure: function(form, action) {
									console.log(action);
									Ext.Msg.alert('Failed', action.result.msg);
									
								}
							});
						}
					}
					
				},
				
				{
					xtype: 'button',
					//width:100,
					text:'Close',
					handler: function(){
						var vectorLayer=map.getLayersByName('Features Layer')[0]
						vectorLayer.removeFeatures(vectorLayer.getFeatureById(me.featureID))
						me.close();				
					}
					
				},
				/*
				{
					xtype:'label',
					text:'Login existing account or register to download datasets in machine-processable format'
				},
				*/
			],
			listeners: {
				afterrender: function(){	
			
					Ext.getCmp('extent').setValue(feature);
					Ext.getCmp('feature_type').setValue(feature_type);
					Ext.getCmp('user_id').setValue(userID);
					
					//console.log('XXXXXXXXXXXXXX', me.loadStore());
					//alert(me.extent);
				},
			}			
			
		}
		
	
	
	
	

	
	
	
	})
	this.callParent();
	
	}

})


