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


Ext.define('Apps.mappanel',{
	extend:'GeoExt.panel.Map',
	alias:'Widget.mappanel',	
	title: "Philippine Geoportal - Infrastructure Status Reporting",   	
	id:'mappanel',
	layout:'border',	
	region:'center',
	tPanel:'',
	width:100,
	user:'',
	height:100,
	selLayer:'',	
	createStore:function(vectorLayer, params){
		
            Ext.Ajax.request({
				url:'./loadfeature',
				method:'POST',
				params:params,
				success:function(response){	
					vectorLayer.destroyFeatures();
					var rows=Ext.decode(response.responseText)
					var callback=rows;			
					
					featureCollection=callback
					for (var feature in featureCollection){
						var graphicHeight=25, graphicWidth=25;
						var row=featureCollection[feature]
						var feature;
						if (row.feature_type=='point'){
							var img='/apps2/infrastatusreporting/img/location48.png'
							switch(row.structure_type){
								case 'School':
									img='/apps2/infrastatusreporting/img/school.png'
									graphicHeight=16;
									graphicWidth=16;
									break;
								case 'Hospital':
									img='/apps2/infrastatusreporting/img/Hospital.png'
									graphicHeight=16;
									graphicWidth=16;
									break;
								case 'Building':
									img='/apps2/infrastatusreporting/img/bldg.png'
									graphicHeight=14;
									graphicWidth=17;
									break;
								case 'Pipe':
									img='/apps2/infrastatusreporting/img/pipe.png'
									graphicHeight=10;
									graphicWidth=15;
									break;
								case 'Manhole':
									img='/apps2/infrastatusreporting/img/manhole.png';
									graphicHeight=10;
									graphicWidth=12;
									//graphicHeight=18;
									//graphicWidth=25;
									break;
								case 'Bridge':
									img='/apps2/infrastatusreporting/img/Bridge.png';
									graphicHeight=10;
									graphicWidth=15;
									break;
									
								case 'Fire Hydrant':
									img='/apps2/infrastatusreporting/img/fire_hydrant.png'
									graphicHeight=14;
									graphicWidth=14;
									break;
								case 'Electric Post':
									img='/apps2/infrastatusreporting/img/electric_post.png'
									graphicHeight=10;
									graphicWidth=15;
									break;
							}
							
							
							feature = new OpenLayers.Feature.Vector(
								new OpenLayers.Geometry.Point(row.extent.geometry.coordinates[0], row.extent.geometry.coordinates[1]),
								{fid:row.feature_id, userid:row.user_id,user_name:row.name, feature_type:row.feature_type, feature_name:row.feature_name,description:row.description, structure_type:row.structure_type, email:row.email, status:row.status},
								{externalGraphic: img, graphicHeight: graphicHeight, graphicWidth: graphicWidth, graphicXOffset:-12.5, graphicYOffset:-12.5 }
								//{externalGraphic: img, graphicHeight: 25, graphicWidth: 20, graphicXOffset:-10, graphicYOffset:-12.5 }
							)
							//vectorLayer.addFeatures(feature);
							
						}else if(row.feature_type=='line'){
							
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
							
						}
						
						vectorLayer.addFeatures(feature);	
					}	
				}		
			})
			
			
	},
	loginUser:function(){
		
		
	},
	checkUser:function(){
		
		var me =this;	
		return
		
		Ext.Ajax.request({
			url:'./login',
			//params:{username:'', password:''},
			method:'POST',
			success:function(response){
				var res = Ext.decode(response.responseText);
				//console.log(res);
				if (res.success){
					this.user=JSON.parse(response.responseText);
					console.log(this.user);
					me.up().down('#mlogin').setText('Logout ' + user.username);
					me.up().down('#mRegister').hidden=true;
					
				}else{	
					
					me.up().down('#mlogin').setText('Login');
					me.up().down('#mRegister').hidden=false;
				}	
			},
			failure:function(response){
				Ext.Msg.alert('Message', 'Server Error');
			}
				
		})	
	},
	toggle: function(shape){
		var controls = this.controls;
		for(key in controls) {
			
			
			var control = controls[key];
			if(shape == key) {
				control.activate();
				this.activeControl = control;
			} else {
				control.deactivate();
			}
			
		}
	},
	gCode:function(addr, callback){	  
				var geocoder = new google.maps.Geocoder();					
				geocoder.geocode({ 'address': addr}, function (results, status) {
				
					console.log(results);
					if (status == google.maps.GeocoderStatus.OK) {		
						var xx=results[0].geometry.location.lng();			
						var yy=results[0].geometry.location.lat();		
						SourceDest={a:xx, b:yy};							
					}else{
						Ext.Msg.alert("Geocoding failed ", status); 
						//Ext.Msg.alert("Geocoding failed", "Please enter location")
					}				
					callback(SourceDest);	
				})		
	},
		
	buildItems:function(){
		
		var items = [];
		var me = this;
		var vectorLayer=map.getLayersByName('Features Layer')[0];	
		
			// zoom in
		items.push(
			Ext.create('Ext.button.Button', Ext.create('GeoExt.Action', {
				control: new OpenLayers.Control.ZoomBox(),
				id: 'btnZoomIn',
				map: map,
				iconCls: 'add',
				iconAlign: 'top',
				icon: '../../img/zoom_in.png',
				scale: 'large',
				width: 25, 
				height: 25,
				toggleGroup: 'navigation',
				allowDepress: false,
				tooltip: 'Zoom in',
				handler: function() {
				  if (navigator.appName == "Microsoft Internet Explorer") {
					me.body.applyStyles('cursor:url("img/zoom_in.cur")');
				  }
				  else {
					me.body.applyStyles('cursor:crosshair');
				  }
				}
			}))
		);
		
		
		// zoom out
		items.push(
			Ext.create('Ext.button.Button', Ext.create('GeoExt.Action', {
				control: new OpenLayers.Control.ZoomBox({out: true}),
				id: 'btnZoomOut',
				map: map,
				iconCls: 'add',
				iconAlign: 'top',
				icon: '../../img/zoom_out.png',
				toggleGroup: 'navigation',
				tooltip: 'Zoom out',
				scale: 'large',
				width: 25, 
				height: 25,
				handler: function() {					
				  if (navigator.appName == "Microsoft Internet Explorer") {
					me.body.applyStyles('cursor:url("img/zoom_in.cur")');
				  }
				  else {
					me.body.applyStyles('cursor:crosshair');
				  }
				}
			}))
		);
		
		// pan
		items.push(
			Ext.create('Ext.button.Button', Ext.create('GeoExt.Action', {
				control: new OpenLayers.Control.DragPan(),
				id: 'btnPan',
				map: map,
				iconCls: 'add',
				iconAlign: 'top',
				icon: '../../img/pan.png',
				scale: 'large',
				width: 25, 
				height: 25,
				toggleGroup: 'navigation',
				tooltip: 'Pan',
				pressed: true,
				handler: function() {					
					me.body.applyStyles('cursor:default');
					me.toggle('select');
					me.createStore(vectorLayer, {user_id:0, feature_type:''});	
				},
				listeners: {
					//toggle: function(e){
						
					//	if(e.pressed) {
							//info.activate();							
							//this.up('panel').pgsGetFeatureInfo.activate();
					//	} else {
							//info.deactivate();							
							//this.up('panel').pgsGetFeatureInfo.deactivate();							
					//	} 
					//}
				}
			}))
		);
		//search field
		items.push(
			{
				xtype:'textfield',									
				itemId:'Search',
				width:200,
				emptyText:'Location Search',
				listeners:{
					render:function(){
						console.log('RENDER');
					}
				}
			}
		);
		
		
		/* items.push(
			{
				xtype:'button',									
				itemId:'save',
				text:'save',
				width:200,
				handler:function(){
					var geoJSON= new OpenLayers.Format.GeoJSON();
					var featuresLayer=map.getLayersByName('Features Layer')[0].features;
					var json = geoJSON.write(featuresLayer);
					console.log(json);
				}
			}
		); */
		
		//Go button		
		items.push(
			{
				xtype:'button',
				text:'Go',
				itemId:'btnGo',
				//disabled:true,
				handler:function(){								
					var me=this.up();				
					var findThis = (me.getComponent('Search').getValue());	
					console.log(findThis);
					if (findThis){
						var me=this.up().up();					
						
						if  (map.getLayersByName('My Location').length > 0) {				
							map.getLayersByName('My Location')[0].destroy();					
						};	 				
						
						me.gCode(findThis, function(coord){					
							if  (map.getLayersByName('Gcode').length > 0) {				
								map.getLayersByName('Gcode')[0].destroy();					
							};		 				
							var currLoc = new OpenLayers.Geometry.Point(coord.a,coord.b).transform('EPSG:4326','EPSG:900913');
							var Location = new OpenLayers.Layer.Vector(	'Gcode', {
									 styleMap: new OpenLayers.StyleMap({'default':{										
											externalGraphic: "./img/marker.png",				
											graphicYOffset: -25,
											graphicHeight: 35,
											graphicWidth: 25,
											graphicTitle: findThis
									}}), 	
									displayInLayerSwitcher: false,	
									renderers: ["Canvas"]
							});							
							Location.addFeatures([new OpenLayers.Feature.Vector(currLoc)]);						
							map.addLayer(Location);						
							map.zoomToExtent(Location.getDataExtent());	
							
									
						})	
					}else{
						Ext.Msg.alert('Message', 'Please enter a location');
					}	
				}	
			}		
		
		);
		
		/*
		items.push({
			xtype:'button',
			text:'test',
			handler:function(){
				console.log('upload');
				var win = Ext.create('App.uploadPicture',{
					//height:500,
					width:300,
					anchor:'100%'
				});
				win.show();
				
			}
			
			
		})
		*/
		
		/*
		items.push(
			{			
				xtype:'button',
				tooltip:'Add picture',
				scale:'medium',
				width:25,
				height:25,
				handler:function(){
					var win = Ext.create('App.addPicture',{
						
					});
					win.showAt(380,110);
				}
			})	
		*/
		//full extent
		items.push(
			{			
				xtype:'button',
				tooltip:'Full extent',
				icon:'../../img/phil.png',
				scale:'medium',
				width:25,
				height:25,
				handler:function(){
					var me=this.up().up();									
					OthoExtent = new OpenLayers.Bounds(120.613472,14.295979, 121.550385,14.827789).transform('EPSG:4326','EPSG:900913')
					
					var lonlat = new OpenLayers.LonLat(121,14).transform(new OpenLayers.Projection("EPSG:4326"),new OpenLayers.Projection("EPSG:900913"));
					map.setCenter(lonlat);
					if (map.baseLayer.name=="BING Aerial Map")
						map.zoomTo(5);
					else if (map.baseLayer.name=="OpenStreetMap")					  
						map.zoomTo(6);
					else if (map.baseLayer.name=="Google Map - Satellite")
						map.zoomTo(6);
					else if (map.baseLayer.name=="ArcGIS Online - Imagery")
						map.zoomTo(6);		
					else if (map.baseLayer.name=="Ortho Image 2011 - Metro Manila")	
						map.zoomToExtent(OthoExtent);
					else
						map.zoomTo(6);
				}
			}
		);
		
		
			items.push(
		
				{
					xtype:'tbtext',
					itemId:'spacer',
					text: '         '
			
				}	
	
			)
		
		
		//edit feature
		
		items.push({
			xtype:'button',
			icon:'../../img/editFeature.png',
			toolTip:'Edit feature',
			iconAlign:'Bottom',
			scale:'medium',
			toggleGroup: 'navigation',
			handler:function(){
				if (me.user==''){
					console.log(me.user.ID);
					Ext.Msg.alert('Message', 'Please login or register a new account');
					return;			
				}else{
					me.createStore(vectorLayer, {user_id:me.user.ID, feature_type:''});					
				}	
			},
			menu:[
				{
					text:'Location',
					toggleGroup: 'navigation',
					handler:function(){
						me.toggle('drag');
					}
				},
				{
					text:'Details',
					toggleGroup: 'navigation',
					handler:function(){
						alertify.message('Please select a feature');
						me.toggle('edit')
					}
				},
			]
			
			
			
		})

		items.push(
			{
				xtype:'button',						
				tooltip:'',
				icon:'../../img/addFeature.png',
				tooltip:'Add feature',
				iconAlign:'top',
				height:27,
				//width:25,
				scale:'medium',
				toggleGroup: 'navigation',
				handler:function(){
					if (me.user==''){
						console.log(me.user);
						Ext.Msg.alert('Message', 'Please login or register a new account');
					}else{
						me.toggle('point');
					}
				}
				/*,
				menu:[
						{
							text: 'Point',
							toggleGroup: 'navigation',
							handler: function(){
								me.toggle('point');
							}
						},
						{
							text: 'Line',
							toggleGroup: 'navigation',
							handler: function(){
								me.toggle('line');
							}
						},
						{
							text: 'Polygon',
							toggleGroup: 'navigation',
							handler: function(){
								me.toggle('polygon');
							}
						},
						
				]
				*/
			}
		);
		
		
		
		items.push(
			{
				xtype:'button',
				tooltip:'Remove Feature',
				icon:'../../img/removeFeature.png',
				scale:'large',
				height:25,
				width:25,
				toggleGroup: 'navigation',
				handler:function(){
					
				},
				listeners: {
					toggle: function(e){
						console.log(e.pressed);
						if(e.pressed) {
							//me.toggle('remove');
							//me.createStore(vectorLayer, {user_id:me.user.ID, feature_type:''});
							//alertify.message('Click the feature you want to remove');	
							if (me.user==''){
								console.log(me.user.ID);
								Ext.Msg.alert('Message', 'Please login or register a new account');
								
							}else{
								me.toggle('remove');
								me.createStore(vectorLayer, {user_id:me.user.ID, feature_type:''});
								alertify.message('Select the feature you want to remove');						
							}
						} else {
							//info.deactivate();							
							//this.up('panel').pgsGetFeatureInfo.deactivate();		
							me.toggle('select');
							me.createStore(vectorLayer, {user_id:0, feature_type:''});		
						} 
					}	
				}
			});	
		

			items.push(
				{
					xtype:'tbtext',
					itemId:'spacer',
					text: '         '
				}
			);
			
		//
		
	 function loadlist2(){
		Ext.Ajax.request({
			url:'./getFeatureTypes/all',
			success:function(response){
				var obj = Ext.decode(response.responseText);
				var list = [];
				list.push('All');
				for(var item in obj){
					list.push(obj[item].feature_name);						
				}
				var combo  = me.down('#cboFeatures')
				combo.setValue('All');//clear struct type combo box
				combo.bindStore(list);
				combo.store.load();
				//console.log(list);
				//console.log(list)
				//return list;
			}
			
		})
		}	
		//		
		loadlist2();		
		items.push(
			{
				xtype:'combo',
				fieldLabel:'Features',
				labelWidth:50,
				itemId:'cboFeatures',
				value:'All',
				store:[],
				listeners:{
					select:function(){
						me.toggle('select');
						var feature_type=this.getValue();
						console.log(feature_type);
						if (this.getValue()=='All'){
							feature_type='';
						}
						//me.createStore(vectorLayer, {user_id:me.user.ID, feature_type:feature_type})
						me.createStore(vectorLayer, {user_id:0, feature_type:feature_type})
							
					}
				}
			}
			
		);
		
		

		
		

		
		items.push(
			'->',
			{
				xtype:'tbtext',
				itemId:'basemapLabel',
				text: 'Basemap: NAMRIA Basemaps'
			
			},
			'->'
		)
		
		
		items.push(
			{
				xtype:'button',						
				tooltip:'User',
				icon:'../../img/user.png',
				scale:'large',
				height:30,
				width:40,
				
				
				menu:[
						{
							text: 'Login',
							itemId:'mlogin',
							handler: function(){
								
								if (this.text=='Login'){
									var login = Ext.create('Apps.UserLogin', {						
										mappanel:this,
										listeners:{
											login:function(user){
												//alert('login');
												me.user=user;
												console.log(me.user);
												console.log(me.user);
												me.up().down('#mlogin').setText('Logout ' + user.username)
												me.up().down().down('#mRegister').hidden=true;
												Ext.Msg.alert('Message', 'User: ' + user.username + ' successfully logged in');
											}
										}
									}).show();
								}else{
									var username=me.user.username
									Ext.Ajax.request({
										url:'./logout',
										success:function(){
											me.up().down('#mlogin').setText('Login')
											me.up().down().down('#mRegister').hidden=false;
											me.user='';
											Ext.Msg.alert('Logout', username + ' successfully logout');
											//alertify.alert(username + ' successfully logged out', function(){
												
											//});
										}
									})
									
								}	
								
							}
						},
						{
							text: 'Register',
							itemId:'mRegister',
							handler: function(){
								var register = Ext.create('Apps.RegisterwitheEmail', {						
											
								})		
								register.show();
							}
						},
						
						
				]
			}
		);
		
		
		
		/* var userLabel='Sign in'	
		items.push(
			Ext.create('Ext.Component', {
				html: '<a href="#">'+ userLabel +'</a>',
				listeners: {
					'click': function() {
						// do stuff
						
					},
					// name of the component property which refers to the element to add the listener to
					element: 'el',
					// css selector to filter the target element
					delegate: 'a'
				}
			})
		); */
		
		items.push(
			{
				xtype:'button',
				tooltip:'Download map',
				icon:'../../icons/download.png',
				scale:'large',
				height:25,
				width:25,
				handler:function(){
					
					var me = this.up('panel')
					console.log(me);
					
					Ext.MessageBox.show({
							msg:'Composing map please wait...',
							width:'300',
							height:'150',
							wait:true,
							//waitConfig:{interval:500}					
					});
					var viewport = me.map.viewPortDiv
					html2canvas(viewport, {
						//proxy:'http://202.90.149.231:3100',
						proxy:"/webapi/get.ashx",
						useCors:true,
						onrendered: function(canvas) {
			
							var downloadlink=canvas.toDataURL('image/png')	

							Ext.Msg.alert('Download link ready', 'Click this <a href="' + downloadlink + '" download="map.png">link</a> to download the map.');

						}
					});
				
				}	
			}
		);	
		
		
				//switch basemap
		items.push(					
			
			{
				xtype:'button',
				scale:'large',
				itemId:'btnSwitch',
				icon:'../../img/layers.png',				
				width:68,
				height:30,	
				tooltip:'Switch basemap',
				menu     : [
					{
						text: 'NAMRIA Basemaps',
						group: 'basemap',
						checked: true,
						handler: function(){
							
							map.setBaseLayer(map.getLayersByName('NAMRIA Basemaps')[0]);
							this.up('toolbar').getComponent('basemapLabel').setText('Basemap : ' + this.text);													
						}
					},
					{
						text: 'Ortho Image 2011 - Metro Manila',
						disable: true,
						group: 'basemap',
						checked: false,
						handler: function(){
							map.setBaseLayer(map.getLayersByName('Ortho Image 2011 - Metro Manila')[0]);
							this.up('toolbar').getComponent('basemapLabel').setText('Basemap : ' + this.text);
							
						}
					},
					{
						text: 'Bing Maps - Aerial',
						disable: true,
						group: 'basemap',
						checked: false,
						handler: function(){
							map.setBaseLayer(map.getLayersByName('Bing Maps - Aerial')[0]);
							this.up('toolbar').getComponent('basemapLabel').setText('Basemap : ' + this.text);
							
						}
					},
					{
						text: 'ArcGIS Online - Aerial',
						disable: true,
						group: 'basemap',
						checked: false,
						handler: function(){
							map.setBaseLayer(map.getLayersByName('ArcGIS Online - Aerial')[0]);
							this.up('toolbar').getComponent('basemapLabel').setText('Basemap : ' + this.text);
						}
					},
					{
						text: 'Open Street Map',
						group: 'basemap',
						checked: false,
						handler: function(){
							map.setBaseLayer(map.getLayersByName('Open Street Map')[0]);
							this.up('toolbar').getComponent('basemapLabel').setText('Basemap : ' + this.text);
						}
					},
					{
						text: 'Google Map - Satellite',
						group: 'basemap',
						checked: false,
						handler: function(){
							map.setBaseLayer(map.getLayersByName('Google Map - Satellite')[0]);
							this.up('toolbar').getComponent('basemapLabel').setText('Basemap : ' + this.text);
						}
					},
					
			   ]
				
			}
			
		)
	
	
		return items;
	},	
	initComponent:function(){		
	
		var popup, me=this 			
			
		
		//Map config
		var maxExtent = new OpenLayers.Bounds(-20037508.34,-20037508.34,20037508.34,20037508.34);
		//var layerMaxExtent = new OpenLayers.Bounds(11128623.5489416,-55718.7227285097,16484559.8541582,3072210.74548981);
		var layerMaxExtent = new OpenLayers.Bounds( 11516520.903064, 482870.29798867,  15821300.345956,  2448728.3963715);		
		var units = 'm';
		var resolutions = [ 3968.75793751588, 
							2645.83862501058, 
							1322.91931250529, 
							661.459656252646, 
							264.583862501058, 
							132.291931250529, 
							66.1459656252646, 
							26.4583862501058, 
							13.2291931250529, 
							6.61459656252646, 
							2.64583862501058, 
							1.32291931250529, 
							0.661459656252646 ];
		var tileSize = new OpenLayers.Size(256, 256);
		var projection = 'EPSG:900913';
		var tileOrigin = new OpenLayers.LonLat(-20037508.342787,20037508.342787);
		//
		
	var mousePositionControl = new OpenLayers.Control.MousePosition({displayProjection:'EPSG:4326'});
		map = new OpenLayers.Map(				
				{ 
				controls: [
					new OpenLayers.Control.Navigation(),								
					new OpenLayers.Control.MousePosition(),
					mousePositionControl,			
							
					
				],
				
				fallThrough: true,							
				projection: 'EPSG:900913',
				displayProjection:'EPSG:4326'
				
		});		
		        
      var pgp_basemap_cache = new OpenLayers.Layer.XYZ(					//Use NAMRIA Basemap Tiles
					'NAMRIA Basemaps',
					//'http://202.90.149.231/tiles/v2/PGP/${z}/${x}/${y}.png',
					  'http://202.90.149.251/tiles/v2/PGP/${z}/${x}/${y}.png',
					{
						isBaseLayer: true,						
						sphericalMercator:true,					
						transitionEffect: "resize",								
						tileOrigin: tileOrigin,
						displayInLayerSwitcher: false  
						
			
				}
			);
		
		//Ortho
		var pgp_ortho_mm_cache = new OpenLayers.Layer.ArcGISCache( "Ortho Image 2011 - Metro Manila",
			"http://202.90.149.252/ArcGIS/rest/services/Basemap/PGS_OrthoImage/MapServer", {
			//"http://202.90.149.252/ArcGIS/rest/services/Basemap/PGS_Basemap/MapServer", {
			isBaseLayer: true,

			//From layerInfo above                        
			resolutions: resolutions,                        
			tileSize: tileSize,
			tileOrigin: tileOrigin,
			maxExtent: layerMaxExtent, 
			projection: projection,
			displayInLayerSwitcher: false
		},
		{
			//additional options
			transitionEffect: "resize"
		});
			
		//Bing
		
		var bing_aerial = new OpenLayers.Layer.Bing({
			name: "Bing Maps - Aerial",
			key: 'AkRWcFAhv1-J1MxSfE5URc4jiUjoL96_frNidZic_5fLeQ54al4UqXcKKr04l2ud',
			type: "Aerial",
			displayInLayerSwitcher: false
			
		}, {
			isBaseLayer: true,
			visibility: false,
			transitionEffect: "resize"
		});
		
		//ArcGIS
		
		var arcgis_world_imagery = new OpenLayers.Layer.ArcGIS93Rest("ArcGIS Online - Aerial", 
		'http://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/export',
		{
			layers: 'show:0,1,2,3',
			format: 'png24'
		}, 
		{
			//additional options
			transitionEffect: "resize",
			isBaseLayer: true,
			displayInLayerSwitcher: false
		});
		
		//Open Street Map
		var osm  = new OpenLayers.Layer.OSM("Open Street Map","",
		{
			sphericalMercator: true,
			transitionEffect: "resize",
			isBaseLayer: true,
			displayInLayerSwitcher: false
		});	
		
			
	   //Google
	   var google_satellite = new OpenLayers.Layer.Google(
                "Google Map - Satellite",
                {
					type: google.maps.MapTypeId.SATELLITE, 
					numZoomLevels: 22,
					sphericalMercator: true,
					transitionEffect: "resize",
					isBaseLayer: true,
					displayInLayerSwitcher: false
				}
        );		
		//
		
		var Location = new OpenLayers.Layer.Vector('My Location', {
		 displayInLayerSwitcher: false,	
		 renderers: ["Canvas"]
		});	


		
		
		/* var eSchools = new OpenLayers.Layer.WMS( 
				'Public Elementary School',
				'http://localhost:8080/geoserver/geoportal/wms', 
				{
					layers: 'geoportal:depedpublices_updated_052014',
					transparent: true 
				},
				{
					isBaseLayer: false,
					opacity: 100
				}
			);
			
		map.addLayer(eSchools);	
		eSchools.setVisibility(false);	
		
		var hSchools = new OpenLayers.Layer.WMS( 
				'Public High School',
				'http://localhost:8080/geoserver/geoportal/wms', 
				{
					layers: 'geoportal:depedpublichs_updated_052014',
					transparent: true
				},
				{
					isBaseLayer: false,
					opacity: 100
				}
			);	
		map.addLayer(hSchools);
		hSchools.setVisibility(false); */
				
		//orig 7.17.16
		map.addLayers([pgp_basemap_cache, pgp_ortho_mm_cache,bing_aerial, arcgis_world_imagery, osm, google_satellite, Location]);		
		
		//map.addLayers([pgp_basemap_cache, pgp_ortho_mm_cache, Location]);		
		
		//map.zoomToMaxExtent();		
		map.events.register("mousemove", map, function (e) {            
//			console.log(pUser);
		}); 	
		
		
		//drag feature control
		
		this.map=map;
		
		
		var sketchSymbolizers = {
            "Point": {
                pointRadius: 1,
                graphicName: "square",
                fillColor: "white",
                fillOpacity: 0,
                strokeWidth: 1,
                strokeOpacity: 1,
                strokeColor: "#333333"
            },
            "Line": {
                strokeWidth: 5,
                strokeOpacity: 1,
                strokeColor: "#0000",
                strokeDashstyle: "solid"
            },
            "Polygon": {
                strokeWidth: 2,
                strokeOpacity: 1,
                strokeColor: "#666666",
                fillColor: "#FF8000",
                fillOpacity: 0.5
            }
        };
		
		
		
        var style = new OpenLayers.Style();
        style.addRules([
            new OpenLayers.Rule({symbolizer: sketchSymbolizers})
        ]);
        var styleMap = new OpenLayers.StyleMap({"default": style});
		
		//var selectControl = new OpenLayers.Control.SelectFeature(vectorLayer, { multiple: true});
		//var selectControl = new OpenLayers.Control.SelectFeature(vectorLayer, {clickFeature:createPopup2});
		
		/**
		function createPopup(feature){
			console.log(feature.geometry.id);
			var size = new OpenLayers.Size(200,70);
			data=feature.data;
			strHTML = '<b><div class="markerContent">Feature name :</b> ' + data.feature_name + '</div><div><b>Type :</b> '+ data.structure_type +'</div><div><b>Description :</b> '+ data.description +'</div><b><div>Reported by :</b> '+ data.user_name +'</div>'
				
				feature.popup = new OpenLayers.Popup.FramedCloud("pop",
					//feature.popup = new OpenLayers.Popup("pop",	
					  feature.geometry.getBounds().getCenterLonLat(),
					  size,
					  strHTML,
					  {'size':new OpenLayers.Size(0,0),'offset':new OpenLayers.Pixel(-1,5)},
					  true
					  //destroyPopup
					  //function() { controls['selector'].unselectAll(); }
				      );
				     //feature.popup.closeOnMove = true;
					 map.addPopup(feature.popup);
		}		
		*/
		
		function createPopup2(feature){
			console.log(feature.geometry.id);
			var size = new OpenLayers.Size(200,70);
			data=feature.data;
			//strHTML = '<b><div class="markerContent">Feature name :</b> ' + data.feature_name + '</div><div><b>Type :</b> '+ data.structure_type +'</div><div><b>Description :</b> '+ data.description +'</div><b><div>Reported by :</b> '+ data.user_name +'</div>'
			console.log(feature);
			
			var data={'Feature name':data.feature_name, 'Structure type':data.structure_type, 'Description': data.description, 'status':data.status, 'Reported by': data.user_name, 'E-mail':data.email}
			var grid=Ext.create('Ext.grid.property.Grid',{
						source:data,
						hideHeaders: false,
						sortableColumns: false,
			}); 		
					
			//var point= new OpenLayers.Pixel(feature.geometry.x, feature.geometry.y).transform(new OpenLayers.Projection("EPSG:4326"),new OpenLayers.Projection("EPSG:900913"));
			//console.log(feature);
			//var coordinate = new OpenLayers.LonLat(feature.geometry.x, feature.geometry.y);
			//var pixel = map.getPixelFromLonLat(coordinate);
			//console.log(mousePositionControl.lastXy.x, mousePositionControl.lastXy.y)
			coordinate=new OpenLayers.Pixel( mousePositionControl.lastXy.x, mousePositionControl.lastXy.y);
			//console.log(coordinate);
			//var lonLat=map.getPixelFromLonLat(coordinate);	
			
			
			//console.log(lonLat);
					
					var popup2 = Ext.create('GeoExt.window.Popup', {
						maximizable: false,
						collapsible: true,
						anchored:true,
						anchorPosition: 'top-left',
						//title: layer_config.title,
						maxHeight: 300,
						width: 300,
						layout: "fit",
						map: map,
						location: coordinate,
						items: grid,
						buttons:[
						{
							xtype:'button',
							text:'View image(s)',
							handler:function(){
								Ext.Ajax.request({
									url:'./getImages/'+ feature.data.fid,
									success:function(callback){
										//console.log(callback);
										var pictures=[];
										var obj=Ext.decode(callback.responseText);
										for (var item in obj){
											pictures.push(obj[item].picture);
										}
										
										if (obj==0){
											Ext.Msg.alert('Message', 'No image uploaded');
											return
										}
										//load imageviewer
										var image = Ext.create('Apps.ImageViewer', {
											//renderTo: Ext.getBody(),
											//src: '/lib/resources/images/image.jpeg',
											imageArray:pictures,
											height:600,
											width:700,
										});
										
										mapwin = Ext.create('Ext.window.Window', {
												//title: 'Crop Window',
												
												height:600,
												width:700,
												items:image
											});
											mapwin.show();
										
										
										
									}
									
								})
								return
								/*
								var image = Ext.create('App.ImageViewer', {
											//renderTo: Ext.getBody(),
											src: '/lib/resources/images/image.jpeg',
											height:300,
											width:400,
								});
								
								mapwin = Ext.create('Ext.window.Window', {
										title: 'Crop Window',
										width:500,
										height:400,
										layot:'auto',
										//border: false,
										//x: 150,
										//y: 60,
										items:image
									});
									mapwin.show();
								*/	
								
							}
						}	
							]
								
					});
					popup2.show();
				
		}
		
		
		  
		
		var renderer=["Canvas","SVG","VML"];
		
		var vectorLayer = new OpenLayers.Layer.Vector("Features Layer", {
			renderers: renderer,
			//styleMap: new OpenLayers.StyleMap({ 
			//	fillOpacity: 0,
			//	strokeColor: '#ff0000',
			//	pointRadius: 5
			//}),
			styleMap:styleMap,
			displayInLayerSwitcher: true
		});
		
		map.addLayer(vectorLayer);
		
		img='img/location48.png';
		me.createStore(vectorLayer,{user_id:0, feature_type:''});
		/*
		me.createStore(function(callback){
			//return
			featureCollection=callback
			for (var feature in featureCollection){
				var row=featureCollection[feature]
				var feature;
				if (row.feature_type=='point'){
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
						{fid:row.feature_id, userid:row.user_id,user_name:row.name, feature_type:row.feature_type, feature_name:row.feature_name,description:row.description, structure_type:row.structure_type},
						{externalGraphic: img, graphicHeight: 25, graphicWidth: 20, graphicXOffset:-12, graphicYOffset:-25 }
					)
					//vectorLayer.addFeatures(feature);
					
				}else if(row.feature_type=='line'){
					
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
				
				
			}	
		});
		*/
		
		
		
		//Control
		var controls = {
			point: new OpenLayers.Control.DrawFeature(vectorLayer,
						OpenLayers.Handler.Point, {
                        persist: true,
						featureAdded: function(feature){
							feature.style = {
								pointRadius: 2,
				                fillOpacity: 0.5,
								fillColor: '#ffffff',
								strokeColor: '#000000'
				            };
							//selectControl.select(feature);
							
							addFeature(feature, 'point');
							
						},
                        handlerOptions: {
                            layerOptions: {
                                renderers: renderer,
                                styleMap: styleMap
                            }
                        }}),
			line: new OpenLayers.Control.DrawFeature(vectorLayer,
						OpenLayers.Handler.Path, {
                        persist: true,
						featureAdded: function(feature){
							feature.style = {
								strokeColor: '#000000',
								strokeOpacity: 0.5,
								strokeDashstyle: 'dash'
				            };
							//selectControl.select(feature);
							addFeature(feature, 'line');
						},
                        handlerOptions: {
                            layerOptions: {
                                renderers: renderer,
                                styleMap: styleMap
                            }
                        }}),
			polygon: new OpenLayers.Control.DrawFeature(vectorLayer,
						OpenLayers.Handler.Polygon, {
                        persist: true,
						featureAdded: function(feature){
							feature.style = {
				                fillOpacity: 0.5,
								fillColor: '#ffffff',
								strokeColor: '#000000',
								strokeOpacity: 0.5,
								strokeDashstyle: 'dot'
				            };
							//selectControl.select(feature);
							addFeature(feature, 'polygon'); 
						},
                        handlerOptions: {
                            layerOptions: {
                                renderers: renderer,
                                styleMap: styleMap
                            }
                        }}),
			circle: new OpenLayers.Control.DrawFeature(vectorLayer,
						OpenLayers.Handler.RegularPolygon,
						{
							featureAdded: function(feature){
								feature.style = {
					                fillOpacity: 0.5,
									fillColor: '#ffffff',
									strokeColor: '#000000',
									strokeOpacity: 0.5,
									strokeDashstyle: 'dot'
					            };
								//selectControl.select(feature);
							},
							handlerOptions: {sides: 40}
						}),
			modify: new OpenLayers.Control.ModifyFeature(vectorLayer, {}),
			drag: new OpenLayers.Control.DragFeature(vectorLayer, {onStart:dragStart, onComplete:dragComplete}),
			
			//remove: new OpenLayers.Control.RemoveFeature(vectorLayer,{onDone:removeFeature()}),
			select:  new OpenLayers.Control.SelectFeature(vectorLayer, {multiple:true,clickFeature:createPopup2}),
			remove: new OpenLayers.Control.SelectFeature(vectorLayer, {clickFeature:deleteFeature}),
			edit: new OpenLayers.Control.SelectFeature(vectorLayer, {clickFeature:edit_feature})
		};
		
		function edit_feature(feature){
			console.log(feature.data.fid);
			
			loadList('POINT', function(callback){
				Ext.create('Apps.editFeature',{
					featureID:feature.data.fid,
					list:callback,
					listeners:{
						featureUpdated:function(){
							me.createStore(vectorLayer, {user_id:me.user.ID, feature_type:''});
						}
					}
				}).show();
			});
		}
		
		
		var feature_dragged;
		function dragStart(feature, pixel){
			feature_dragged=feature;
		}
		
		function dragComplete(feature, pixel){
			Ext.Msg.show({
			title:'Move feature',
			msg: 'Permanently move selected feature?',
			buttons: Ext.Msg.YESNO,
			animateTarget: 'elId',
			icon: Ext.window.MessageBox.QUESTION,
			fn: function(btn){
				   
				   
					if(btn === 'yes') {			
						var geoJSON= new OpenLayers.Format.GeoJSON();
						var json = geoJSON.write(feature);					
						Ext.Ajax.request({
							url: './updateFeatureLocation/' + feature.data.fid,
							method:'POST',
							params:{extent:json},
							success:function(res){
								//add user filter here
								me.createStore(vectorLayer, {user_id:0, feature_type:''});	
							}
						});
						
						
					}else{
						//add user filter here
						me.createStore(vectorLayer, {user_id:0, feature_type:''});	
						console.log('Nothing pressed');
					}
				}
			});
		}
		
		function deleteFeature(feature){
			console.log(feature);
			Ext.Msg.show({
			title:'Delete feature',
			msg: 'Permanently delete selected feature?',
			buttons: Ext.Msg.YESNO,
			animateTarget: 'elId',
			icon: Ext.window.MessageBox.QUESTION,
			fn: function(btn) {
					if(btn === 'yes') {
						
						
						Ext.Ajax.request({
							url: './deleteFeature/' + feature.data.fid,
							method:'DELETE',
							success:function(res){
								vectorLayer.removeFeatures(feature);
							}
						});
						
						
					}else{
						console.log('Nothing pressed');
					}
				}
			});	
		}

		for(var key in controls){
			this.map.addControl(controls[key]);
		}
	    
		controls.select.activate();
		/*
		map.events.register('click', map, function(e){	
			//alert('Click');
			var point = map.getLonLatFromPixel(this.events.getMousePosition(e) )     
			var pos = new OpenLayers.LonLat(point.lon,point.lat).transform('EPSG:900913', 'EPSG:4326');
			
		});  
		*/
		
		/*
		var revertFeature
		vectorLayer.events.on({
			'featuremodified':function(feature){
				
				vectorLayer.removeFeatures(feature)
				alert('feature removed?');
				return
				//save geometry here
			//	console.log('REV', revertFeature);
			//	console.log(feature);
				
			//confirm move?	
			Ext.Msg.show({
			title:'Modify Feature',
			msg: 'Permanently move selected feature?',
			buttons: Ext.Msg.YESNO,
			animateTarget: 'elId',
			icon: Ext.window.MessageBox.QUESTION,
			fn: function(btn) {
					if(btn === 'yes') {
						
					
						Ext.Ajax.request({
							url: './deleteFeature/' + feature.data.fid,
							method:'DELETE',
							success:function(res){
								//console.log(res);
								vectorLayer.removeFeatures(feature)
							}
						});
					
						
					}else{
						
						//console.log('Nothing pressed');
						console.log(feature);
						vectorLayer.removeFeatures(feature)
						//vectorLayer.addFeatures(revertFeature)
					}
				}
			});	
				
			},	
			'beforefeaturemodified':function(feature){
				revertFeature=feature;
				//alert('before');
			}
		});
		*/
	
		
		function loadList(type, callback){
			Ext.Ajax.request({
			url:'./getFeatureTypes/' + type.toUpperCase(), 
				success:function(res){
				console.log('RESSSS', res)
				var obj = Ext.decode(res.responseText);
				var list = [];
				for(var item in obj){
					console.log(obj[item].feature_name);
					list.push(obj[item].feature_name);
					
				}
				list.push('Others');
				
				callback(list);
				
			},
			failure:function(res){
				console.log('FAILED',res)
			}
		})
			
		}
		
		function addFeature(feature, type){
			var geoJSON= new OpenLayers.Format.GeoJSON();
			var json = geoJSON.write(feature);
			
			loadList(type, function(callback){
				var win = Ext.create('Apps.addFeatures', {	
				featureID:feature.id,
				list:callback,
				feature:json,
				feature_type:type,
				map:map,
				listeners:{
					featureAdded:function(f_id){
						
						me.createStore(vectorLayer, {user_id:0, feature_type:''});	
						console.log(f_id);
						
						
						//Upload pictures?
						Ext.Msg.show({
						title:'Message',
						msg: 'Feature successfully added! Would you like to upload picture?',
						buttons: Ext.Msg.YESNO,
						animateTarget: 'elId',
						icon: Ext.window.MessageBox.QUESTION,
						fn: function(btn) {
								if(btn === 'yes') {
									
									var win = Ext.create('Apps.addPicture',{
										f_id:f_id,
									});
									win.showAt(380,110);
									
									
								}else{
									console.log('Nothing pressed');
								}
							}
						});	
						
					}
				}
				})					
				win.show();		
				
			})
			
			
		}
		
		Ext.apply(this, {
			map:map,
			controls:controls,
			dockedItems: [
				{ xtype: 'toolbar',
				  dock: 'top',
				  items: this.buildItems(),
				}
			],
			center: new OpenLayers.LonLat(13610082.099764,1403622.1394924),
			zoom:6,
			listeners: {
				afterrender: function(){
					console.log('afterrender');
					me.checkUser();  		
				}
				
			}					
		});		
		
		this.callParent();   
    }
	
	
});


