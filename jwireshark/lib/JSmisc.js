String.prototype.repeat = function( v, i ){
	var ret = "";
	for(var j = 0; j < i; j++ ){
		ret+=v;
	}
return ret;
};
var base = jno2.base;

var string ={
	info:{

		arp:{
			0x01:"Who has %c? Tell %c",
			0x02:"%c is at %c"
		},
		homeplug:{
			0x88E1:"MAC Management, Get Bridge Informations Request",
			0x887b:"Vendor specific"
		},
		tcp:{
			0x00:"%i &rarr; %i [%c] Seq=%i Ack=%i Win=%i Len=%i",
			flag:function( tcp ){
				 var c = [];
				tcp.flag.psh ?
				 c.push( "PUSH" ) : void 0;
				tcp.flag.rst ?
				 c.push( "RST" ) : void 0;
				tcp.flag.syn ?
				 c.push( "SYN" ) : void 0;
				tcp.flag.fin ?
				 c.push( "FIN" ) : void 0;
				tcp.flag.ack ?
				 c.push( "ACK" ) : void 0;
			return c.join(", ");	 
			},	
		},
		dns:{
			0x00:"Standard query %c 0x%x02 %c"
		},
	}	
};
