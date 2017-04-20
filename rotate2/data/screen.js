//graphicalUserInterface
/*
* @LUpdate 17/04/2017
* @VErsion 1.3
*/
var graphicalUserInterface = function( setting, _self ){
		var self = _self || {};
		var rawMonitor = setting.monitor,
			ctxMonitor = rawMonitor.getContext("2d"),
			
			screen_x   = setting.width  || rawMonitor.width,
			screen_y   = setting.height || rawMonitor.height,
			screen_d   = ctxMonitor.createImageData( screen_x, screen_y ),
			screen_len = screen_d.data.length;
			
			rawMonitor.width  = screen_x;
			rawMonitor.height = screen_y;
			
			
	["x","y"].map( function( val ){
			self["screen_"+val ] = val == "x" ? screen_x : screen_y;
 	});
	self.drawImage = function( imgNode ){
		ctxMonitor.drawImage( imgNode, 0,0 );
		screen_d = ctxMonitor.getImageData( 0,0, screen_x, screen_y );
	};
	// reset Monitor
	self.resetScreen = function( color ){
		var h = 0;
		while( h <= screen_y ){
			this.setLine( h, color );
			h++;
		}
		this.refresh( );
	return this;
	};
	// resize Monitor
	self.resize = function( x, y ){
		rawMonitor.width  = self.screen_x = screen_x = x;
		rawMonitor.height = self.screen_y = screen_y = y;
		screen_d = ctxMonitor.createImageData( x, y );
	};
	["get","set"].map( function( val ){
		// get & set RawPixel
		// By offset
		self[ val+"RawPixel" ] = function( offset, color ){
			if( val == "set" ){
				
				screen_d.data[ offset+0x00 ] = ( color >> 0x10 )&0xff;	// R
				screen_d.data[ offset+0x01 ] = ( color >> 0x08 )&0xff;	// G
				screen_d.data[ offset+0x02 ] = ( color )&0xff;		   // B
				screen_d.data[ offset+0x03 ] = setting.rgba ? ( color >> 0x18 )&0xff : 255; // A
				
			}else{
			return ( screen_d.data[ offset+0x00 ] << 0x10 |
					 screen_d.data[ offset+0x01 ] << 0x08 |
					 screen_d.data[ offset+0x02 ] | 
					( setting.rgba ? screen_d.data[ offset+0x03 ]  : 0 ) << 0x18 );
			}
		};
		// get & set Line
		self[ val+"Line" ] = function( y, color, returnColorInt ){
			var addr = ( y * screen_x *0x04 )+0,
				base = ( addr + screen_x * 0x04 ),
				colors = [], cnt = 0;
				
				try{
					while( addr < base ){
						val == "get" ? ( colors[ ( returnColorInt ? colors.length : addr/0x04 )] = self.getRawPixel( addr ) ) :
							typeof color == "function" ? 
							color.call( self, addr/0x04 ) : 
							self.setRawPixel( addr, typeof color == "number" ? color : color[ returnColorInt ? (cnt++) : addr/0x04 ] );
						
						addr+= 0x04;
					}
				}catch( e ){ console.log( e ); };
				
		return ( val == "get" ? colors : 1 );
		};
		// set & get Pixel
		// bY point destination x,y
		self[ val+"Pixel" ] = function( x, y, color ){
			// ( LineY * screen_x + offset ) * bpp 
			return self[ val+"RawPixel"].call( self, ( ( ( y * screen_x ) + x )*0x04 ), color );
		};
	});
	
	self.snapshot = function( ){
		return rawMonitor.toDataURL( );
	};
	// refresh monitor
	self.refresh = function( ){
		ctxMonitor.putImageData( screen_d, 0,0 );
	};
	// convert int to RRGGBB
	var intToRgb = self.intToRgb = window.intToRgb = function( color ){
	return { r:(( color >> 0x10 )&0xff),
			 g:(( color >> 0x08 )&0xff),
			 b:( color&0xff) 
		};
	};
	
return self;
};