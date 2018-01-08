/*
*
*/
Array.prototype.sum = function( ){
	var i =  sum = 0,
		len = this.length;
	try{
		for(; i < len; i++ )
		sum += typeof parseInt( this[ i ] ) === "number" ?
		parseInt( this[ i ] )  : 0;;
	}catch(e){};
return sum;
};

function makeQword( low, hight ){
return ( Math.pow( 2, 32 ) * hight + low );
}

function LittleEndian( _32b, size ){
return size == 8  ? _32b&0xff :
	   size == 16 ? ( _32b&0xff ) << 8 | ( ( _32b >> 8 )&0xff )&0xffff :
	   size == 32 ? ( (_32b&0xff ) << 24 | ( ( _32b >> 8 )&0xff ) << 16 | ( ( _32b >> 16 )&0xff ) << 8 | (_32b>>24)&0xff )&0xffffffff :
	   LittleEndian( _32b, 32 );
}

var BYTE  = uint8  = 0x01,
	WORD  = uint16 = 0x02,
	DWORD = uint32 = 0x04,
	QWORD = uint64 = 0x08,
	int8  = 0x11,
	int16 = 0x12,
	int32 = 0x14,
	int64 = 0x18;
	
function _sizeof( $__number__ ){
return $__number__ <= 0xFF ? BYTE : 
	   $__number__ > 0xFF && $__number__ <= 0xFFFF ? WORD :
	   $__number__ > 0xFFFF && $__number__ <= 0xFFFFFFFF ? DWORD :
	   $__number__ > 0xFFFFFFFF && $__number__ <= 0xFFFFFFFFFFFFFFFF ? QWORD
	   : -1;
}


define("error",[],function(a,b,c ){
return{
	astr:["overflow memory","Critical error report :","BAD TYPE *&rarr;"],
	errorno:0,
	error:!1,
	str  :"",
	getStrError:function(){
		return ( this.error != 0 ? this.astr[ this.errorno-1 ]+
			   " "+this.str : "0" );
	},
};
});


define("struct",["error"],function(a,b,c, error ){

return{
		
	// buffer 
	// offset 
	// ulen 1, 2, 4, 8, len 17, 18, 20, 24
	// max 32 bits
	//@return integer
	__chr2int:function( buffer, off, len, endian ){
		var buffer = ( buffer || "" ),
			rol	   = len*8, ret = signed = 0,
			end	   = off+(len&0x0f);
			
			signed = (len&0x10) >> 4;
		try{
			for(; off < end; off++ ){
		
				buffer[ off ] ?
					// review ret |= method
					( ret += ( 1 << (rol-=8) ) * buffer.charCodeAt( off ) )
					// nop
					: 0; 
			}
			ret = ( endian || 0 ) ? LittleEndian( 
					ret,
					len*8
					) : ret; 
		}catch(e){
			error.errorno = 0x02;
			error.str	  = e.stack;
			return !( error.error = 1 )		
		}
		//
		if( !signed && ret < 0 ) ret = parseInt( base.dec2hext( ret, 4 ), 16 );;
	return signed ? ( ret << 24 ) >> 24 : ret;
	},   
	
	// int2chr
	// max uint32
	__int2chr:function( val, sizeof ){
		var __trame__ = "",
			signed    = 0,
			ror		  =  ( !sizeof ?
						_sizeof( val ) : sizeof ) * 8;
		try{
			if( val > Math.pow( 2 , ror )  ){
				error.errorno = 0x01; 
				error.str	= " use only "+(ror/8)+" byte(s) in memory ";
				return !( error.error = 1 );
			}
			while( ror > 0 ){
				__trame__ += String.fromCharCode(
					( val >> (ror-=0x08) )&0xff
				);	
			}
		}catch(e){
			error.errorno = 0x02;
			error.str 	 = e.stack; 
			return !( error.error = 1 );
		}
	return __trame__;
	},
	// 
	// buffer = > "ÿ", off => 0, size => { fb:3, sb:1, tb:2, ef:2 } or
	// buffer => "oÿ", off => 1, size =>....
	// @return { fb:7, sb:1, tb:3, eb:3 } 
	__chr2bit:function( buffer, off, size ){
		var len = i = rol = 0, tmp,
			sizeof = [], data;
			
			size = ( size || {} );
			try{
				// look for size of 
				// bit element
				for( tmp in size ){
					sizeof.push(
						size[ tmp ]
					);
					len += size[ tmp ];
				}
				
				// get buffer 
				len += (len%2);
				data = this.__chr2int( 
					buffer.substr( 
						off,
						 parseInt( len/8 ) == 0 ? 1 : parseInt( len/8 )
					),
					0, parseInt( len/8 ) == 0 ? 1 : parseInt( len/8 )
				);
				// parse
				for( tmp in size){
				
					rol = sizeof.slice( i+1 )
								.sum( );
					size[ tmp ] = ( data >> rol )&(Math.pow( 2, size[ tmp ] )-1);
					i++;
				}
			len = i = tmp = sizeof = data = null;
			}catch(e){
				error.errorno = 0x02;
				error.str	  = e.stack;
			return !( error.error   = 1 );
			}
	return size;
	},
	// 
	// val => { fb:7, sb:1, tb:3, eb:3 } , size => { fb:3, sb:1, tb:2, ef:2 }
	// @return "ÿ" 
	__bit2chr:function( val, size ){
		var __trame__ = "",tmp,
		n = ntmp = 0;
		try{
			for( tmp in size ){
			
				if( typeof val[ tmp ] === "string" ){
					error.errorno = 0x03
					error.str     = tmp+" invalid assignment from integer variable";
					error.error   = 1;
					break;
				}
				// check if exist
				val[ tmp ] = val[ tmp ] ?
				val[ tmp ] : 0;
				
				if( val[ tmp ] >= 0 && val[ tmp ] < Math.pow( 2, ( size[ tmp ] ) ) ){
					
					// overflow int 32 bit QWORD not supported
					//alert( Math.pow( 2, ntmp += size[ tmp ] ) +" "+ Math.pow(2, DWORD * 8));
					if( Math.pow( 2, ( ntmp += size[ tmp ] ) ) >= Math.pow( 2, DWORD * 8 ) ){
					
						__trame__ += this.__int2chr(
							n,
							DWORD
						);
						ntmp = n = 0;
					}
					
					n = ( n > 0 ) ? ( n << size[ tmp ] ) | val[ tmp ] : val[ tmp ];
				}else{
					n = 0;
					error.errorno = 0x01;
					error.str	  = "use only "+size[ tmp ]+" bit(s) in memory ";
					error.error   = 1;
					break;
				}
				
			}
			__trame__  += this.__int2chr( 
				n
			);
		}catch(e){
			n = 0;
			error.errorno = 0x02;
			error.str    = e.stack;
			return !( error.error = 1 );
		}
	return __trame__;
	},
	
	// buffer data
	// struct
	// offet of starting
	buffer2struct:function( buffer, struct, off, endian ){
		var off = ( off || 0 ),
			buffer = ( buffer ||"" ),
			toff,tmp, i,j;
		try{
			for( tmp in struct ){
				
				toff = 0;
				
				typeof struct[ tmp ] === "number" ?
					(struct[ tmp ] = this.__chr2int(
						buffer,			// buffer
						off,		   // offset
						( toff += struct[ tmp ] ), // len
						endian || 0
					), toff &=0x0f ) : void 0;
				
				
				if( typeof struct[ tmp ] == "object"  &&
					struct[ tmp ] !== null ){
					
					toff = this.sizeof( struct[ tmp ], 1 );
//console.log( "************************************************");
//console.log(  struct[ tmp ]  );
//console.log( this.sizeof( struct[ tmp ] ) );
//console.log( this.sizeof( { version: 4, class: 8, label: 20 },1) );
//console.log(  toff );
//console.log( "************************************************");
					struct[ tmp ] = this.__chr2bit( 
						buffer,		// buffer
						off,		// offset
						struct[ tmp ]	// void * struct
					);
				}
				
				// const char 
				if( typeof struct[ tmp ] === "string" ){
					var a,t,b,_off=0;
					
					// ptr text len
					if( ( t = (/^\*([\d\w_]+)(\-\>(dword|DWORD)|)$/).exec( struct[ tmp ] ) ) ){
						//console.log( t );
						b = parseInt( struct[ t[1] ] );
					}else
						b = parseInt( struct[ tmp ] );;

					i = off, j = isNaN( b ) ? -1 : 0,
					a  = !isNaN( b ) ? b : 0 ;
					struct[ tmp ] = "";
					
					while( buffer[ i ] ){
						
						if( ( buffer[i].charCodeAt(0) == 0x00 && j == -1 ) /* || ( j >= a ) */ ){
							_off = buffer[i].charCodeAt(0) == 0x00 ? 1 : 0;
							break;
						}
						 if( j >= a ) 
							break;;
						
						struct[ tmp ] += buffer[ i ];
						j > -1 ? (j+=1) : void 0;
						i++;
					}
					
					if( t && t[3] && t[3].toUpperCase( ) === "DWORD" ){
						struct[ t[1] ] += (_off += (struct[ tmp ].length%4) > 0 ? 4-(struct[ tmp ].length%4) : 0 );
					}
					toff = ( struct[ tmp ].length+_off );				
				}
				
				if( error.error ){
					struct = false;
					break;
				}
				
				off += toff; //console.log( base.dec2hex( off ) );
			}
		}catch(e){
			error.errorno = 0x02;
			error.str = e.stack;
			console.log(e);
		return !( error.error = 1 );
		}
	return struct;
	},
	
	// _s : Structure complete
	// _ptrs : void * Structure 
	// buffer
	struct2buffer:function( _s, _ptrs, buffer ){
		var tmp,
		buffer = ( buffer || "" );
		try{
			for( tmp in _s ){
				
				typeof _s[ tmp ] === "number" ?
				buffer += this.__int2chr( 
					_s[tmp],
					_ptrs[ tmp ]
				) : void 0;
				
				typeof _s[ tmp ] === "string" ?
				buffer += _s[ tmp ] : void 0;
				
				typeof _s[ tmp ] === "object" &&
				_s[ tmp ] !== null ?
				buffer += this.__bit2chr( 
					_s[tmp],
					_ptrs[tmp]
				) : void 0;
				
				if( error.error ){
					error.errorno == 1 || error.errorno == 3 ?
					error.str = "*->"+tmp+" "+error.str
					: void 0; 
					buffer = false;
					break;
				}
			}
		}catch(e){
			 error.errorno = 0x02;
			 error.str 	 = e.stack; 
			return !( error.error = 1 );
		}
	
	return buffer;
	},
	
	// void struct
	// sizeof struct
	sizeof:function( struct, deep ){
		var tmp,size = 0;
		try{
			for( tmp in struct ){
			
				size += typeof struct[ tmp ] === "object" ?
					this.sizeof(
						struct[ tmp ],
						1
					) : 
					typeof struct[ tmp ] === "number" && !deep ?
						struct[ tmp ]&0x0f : 
						struct[ tmp ] === "number" && deep ?
						struct[ tmp ] :
						!isNaN( parseInt( struct[ tmp ] ) ) ? parseInt( struct[ tmp ] )
					  : 0;			
			}
		}catch(e){};

	return ( deep ? size > 8 ? size/8 : 1 : size );
	},
	};
});
/*
Example :

=-------------------------=
	TYPE
=-------------------------=
"\xff \xff \x00\x01 \x00\x01 \x02\x02\x02\x02"
foo = {
	bar_0:	uint8,
	bar_1:	int8,
	bar_3:	uint16,
	bar_4:	int16,
	bar_5:	uint32,
	bar_6:	int32	
}; -> 	

bar_0:	255,
bar_1:	-1,
bar_3:	1,
bar_4:	1
bar_5:	33686018

=-------------------------=
	TEXT POINTER
=-------------------------=
\x00\x04 \x61\x61\x61\x61\x00
foo = {
	len:		WORD,
	payload:	""
}; -> 

len:		4,
payload:	"aaaa" + byte NULL \x00

=-------------------------=
	TEXT Struct
=-------------------------=
\x00\x04\x61\x61\x61\x61
foo = {
	len:		WORD,
	payload:	"*len"
}; -> 

len:		4,
payload:	"aaaa"

=-------------------------=
	TEXT Struct 32
=-------------------------=
\x00\x04 \x61\x61\x61\x61 \x62\xff\xff\xff \x03
foo = {
	len:		WORD,
	payload:	"*len->dword",
	
	end:		BYTE
}; -> 

len:		5,
payload:	"aaaabÿÿÿ",
end:		3

=-------------------------=
	BITS
=-------------------------=
\x00\x04 \x61\x61\x61\x61 \x62\xff\xff\xff \x03 \x6A
foo = {
	len:		WORD,
	payload:	"*len->dword",
	
	end:		BYTE,
	
	// 3+2+2+1 = 8 bits = 
	bit:{
		b0:3, b2:2, b3:2, b4:1
		}
}; -> 

len:		5,
payload:	"aaaabÿÿÿ",
end:		3
bit:		{ b0: 2, b2: 1, b3: 3, b4: 0 } 

*/
var struct = req("struct");
