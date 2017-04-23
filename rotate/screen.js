<html>

	<head>
		<script src="./data/screen.js"></script>

	</head>
	<style>
	body{ padding:0; margin:0; background:#cccccc; width:100%; height:100%; overflow:hidden; }
	
	</style>
		
		<center><canvas style="border:1px solid #cecece; margin:10px; cursor:cross;" width="480px" height="600px" id="screen"> </canvas></center>
		
<script>

var test = function( setting ){
	
	
	var monitor, gui = graphicalUserInterface( ( monitor = {
	
		width: 480, height:600,
		monitor: document.getElementById('screen'),
		
		charSize:[6,6], charMax: 80, lineMax:100,
	} ) ), sp= gui.tiles({ 
			
			// mod 
			mod:1, 

			// colors palette
			palette:[
			0xFFffffff,0x000000, // default
			0x555555, // border
			0x00aa00, // p1
			0x0000aa, // p2
			0xbbbbbb,
			0xaaaaaa,
			0x006666,
			0x2f4f4f // new reset
			],
			// size Tiles
			offsetTilesX:6,
			offsetTilesY:6,
			
			}),
	/*
	* sprite warriors 
	*/
	sprites = [
	// blink
	[0,0,0,0,0,2,0,0,0,0,0,2,0,0,0,0,0,2,0,0,0,0,0,2,0,0,0,0,0,2,2,2,2,2,2,2],
	// default 
	[1,1,1,1,1,1,1,6,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
	// p1 & p2
	[3,3,3,3,3,2,3,0,3,3,3,2,3,3,3,3,3,2,3,3,3,3,3,2,3,3,3,3,3,2,2,2,2,2,2,2],
	[4,4,4,4,4,2,4,6,4,4,4,2,4,4,4,4,4,2,4,4,4,4,4,2,4,4,4,4,4,2,2,2,2,2,2,2],
	//
	[0,5,5,5,5,2,5,5,5,5,5,2,5,5,5,5,5,2,5,5,5,5,5,2,5,5,5,5,5,2,2,2,2,2,2,2],
	[1,1,1,1,1,1,1,7,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
	[8,8,8,8,8,8,8,6,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8],
	[8,8,8,8,8,8,8,7,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8],
	
	];
	
	function light ( offset, nsprite ){
		
		sp.setTilesByOffset(
			offset,
			sprites[ nsprite ]
		);
		gui.refresh( );
	
	return true;
	}
	
return {

		blink: function( offset ){
			return light( 
				offset,
				0 
				);
		},
		setPlayer:function( offset, player ){
			return light( 
				offset,
				( player ? 2 : 3 ) 
				);
		},
		/*
		* clear Monitor
		*/
		reset:function( mem ){
			var x = y = 0;
			try{
			console.log( ( new Date() ).getTime( ) )
			for(; y < monitor.lineMax; y++ ){
				for( x= 0; x < monitor.charMax; x++ ){
					
					sp.setTiles( 
						x, y,
						sprites[ 
							mem != undefined && mem[ x+(y*80) ] > -1 ? 
							( !(x%10) || !(y%10) ? 6 : 7 ) : 
							( !(x%10) || !(y%10) ? 1 : 5 ) 
						]
					);
				}
			}
			gui.refresh( );
			
			}catch(e){};
		return 1;
		},
	};
}
/**/ 
var gm = test( );
	gm.reset( );
	
	var i = 0;
	setInterval( function( ){
			
			gm.setPlayer( i+parseInt(Math.random()*255),parseInt(Math.random()*2) );
			i+=5;
			i%=8000;
			
	},60 );
		
</script>

</html>
