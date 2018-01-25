// asm parsor
// OP A,B
// /(\s|)(\w+)\s(.*?)\,([^\s]+)(\s|)/

//OP A
// /(\s|)(\w+)\s([^\s]+)(\s|)/

// label
// /(\s|)(\w+)\:(\s|)/

// section
// /(\s|)(\w+)\s\.(\w+)(\s|)/

// comz
// /(\s|)\;(.*)/

// chiffre et 0x
// /(0\x[a-fA-F0-9]+)|(\d+)/

// rules css 
// /([\w\-]+)\:(.*?)\;/
// hex intpx int%
// /(\#[a-zA-z0-9]{3,6})|(\d+px)|(\d+\%)/

var parseCss = function( ){
	this.color = {	
		id:"#fff",
		class:"#00ff55",
		id:"#6A5ACD",		
		number:"#ff6666",
		sstr:"#ceecec",
		string:"grey",		
	};
};
parseCss.prototype.multiParse = function( parser, data, callback ){
	var mv=[], r={ push:null, data:null };	
	jno2.regexp( parser, data, function( v ){
		
		typeof callback == "function" ?
		callback.call( this, r={ push:null,data:null } ) : void 0;
 
		mv.push( 
			r.push
		);
		
		data = data.replace(
			( r.data || this[0] ),
			"$"+(mv.length-1)+""
		);
	return "";
	});
	// repplace good Key
	jno2.each( mv, function( v, i ){
		data = data.replace(
			"$"+i+"",
			v
		);
	});
return data;
};
parseCss.prototype.defineType = function( data ){
	var slf = this,

	 p = [], s = [], j = 0;
	data = jno2.regexp( /((\#[a-zA-z0-9]{3,6})|([\d\.]+px)|([\d\.]+\250)|([\d\.]+em)|\d+)/, data, function( ){
		p.push("[c:"+( this[1] ||  this[2] ||  this[3] || "" )+"]("+slf.color.number+")");
	return "\xFB";
	});
	data = jno2.regexp( /([\w\_]+)/, data, function( ){
		s.push("[c:"+( this[1] ||  this[2] ||  this[3] || "" )+"]("+slf.color.sstr+")");
	return "\xFA";
	});

	j = 0;
	data = jno2.regexp( /(\xFB)/, data, function( ){
	return p[ j++ ];
	});
	j = 0;
	data = jno2.regexp( /(\xFA)/, data, function( ){
	return s[ j++ ];
	});
	
return data;
};
parseCss.prototype.parseLine = function( line, opts ){
	var tmp, s = [], n = [], selector=[], slf = this;
/*Commentaire*/
if( line.reg( /(\s|)\/\255/ ) && !line.reg( /(.*?)\255\/(\s|)/ ) )opts.comment=1;;
if( !opts.comment ){

	line = this.multiParse( /(\/\255(.*?)\255\/)|(\/\/.*)/, line, function( ret ){
		s.push("[c:**"+(this[0])+"**](green)");		
		ret.push = "\xAC";
	});
	while( (tmp = line.reg(/(\'(.*?)\')/)) || ( tmp = line.reg(/(\"(.*?)\")/)) )
	s.push( "[c:**"+tmp[1]+"**]("+slf.color.string+")" ),
	line = line.replace(
		tmp[0],
		"\xAC"
	);;

	//xx:yy;
	line = jno2.regexp( /([\w\-\s]+)\251(.*?)\;/, line, function( ){
		n.push( "[c:**"+this[1]+"**](#fff):"+slf.defineType(this[2])+";" );
	return "\xAE";
	});
	line = jno2.regexp(/((\s|)(\#[\w+_]*)|(\s|)(\.[\w+_]*))/, line, function( ){ console.log( this);
		selector.push( "[c:**"+(this[1])+"**]("+(this[5]!=undefined?slf.color.class : slf.color.id )+")" );
	return "\xAF";
	});

	var i = 0;
	line = jno2.regexp( /(\xAE)/, line,function( ){
	return n[i++];
	});
	i = 0;
	line = jno2.regexp( /(\xAF)/, line,function( ){
	return selector[i++];
	});
	i = 0;
	line = jno2.regexp( /(\xAC)/, line,function( ){
	return s[i++];
	});
}else
s.push( "[c:"+line+"](green)" );;
	
if( tmp = line.reg( /((\s|)\255\/(\s|))/ ) )opts.comment=0;;	
	
return line;
};

var parseasm = function( ){
 	this.color ={
		comment:"#00cc44",
		string:"grey",
		number:"#00ff55",
	};
};
parseasm.prototype.multiParse = function( parser, data, callback ){
	var mv=[], r={ push:null, data:null };	
	jno2.regexp( parser, data, function( v ){
		
		typeof callback == "function" ?
		callback.call( this, r={ push:null,data:null } ) : void 0;
 
		mv.push( 
			r.push
		);
		
		data = data.replace(
			( r.data || this[0] ),
			"$"+(mv.length-1)+""
		);
	return "";
	});
	// repplace good Key
	jno2.each( mv, function( v, i ){
		data = data.replace(
			"$"+i+"",
			v
		);
	});
return data;
}; 

parseasm.prototype.parseLine = function( line ){
	var tmp, c = [], s = [], slf = this;
	
	// comment
	if( tmp = line.reg( /(\s|)(\;(.*))/) )
	c.push( "[c:"+tmp[2]+"]("+slf.color.comment+") " ),
	line = line.replace(
		tmp[0],
		"\xAA"
	);; //string
	if( (tmp = line.reg(/(\'(.*?)\')/)) || ( tmp = line.reg(/(\"(.*?)\")/)) )
	s.push( "[c:**"+tmp[1]+"**]("+slf.color.string+") " ),
	line = line.replace(
		tmp[0],
		"\xAC"
	);;
	console.log( this );
	/*hexa&number*/
	line = this.multiParse( /(0\x[a-fA-F0-9]+)|(\d+)/, line, function( ret ){
		ret.push = "[c:**"+( ret.data = ( this[1] || this[2] ) )+"**]("+slf.color.number+")";
	});
	
	/*
	* op a b && op a
	*/
	if( tmp =  line.reg(/(\s|)(\w+)\s(.*?)\,(\s|)([^\s]+)(\s|)|(\s|)(\w+)\s(.*)/) ){
		console.log( "--------------------------*" , tmp );
		var r = ( tmp[2] || tmp[8] ),c;
		
		r = this.multiParse( /(mov|dec|inc|ret|add|pop|push|jump|jg|jnle|jne|leave|call|lea|xor|jmp|je|cmp|jz|int|call)/, ( tmp[2] || tmp[8] ).toLowerCase(), function( ret ){
		ret.push = "[c:**"+( ret.data = ( this[1] ) )+"**](#6699ff)";
		});
		line = line.replace( ( tmp[2] || tmp[8] ),r );
		/*hexa&number*/
		r = this.multiParse( /(db|dw|dd|byte|BYTE|word|WORD|dword|DWORD|qword|QWORD|define)/, ( tmp[8] || tmp[2] ).toLowerCase(), function( ret ){
		ret.push = "[c:**"+( ret.data = ( this[1] ) )+"**](#ff0000)";
		});
		line = line.replace( ( tmp[8] || tmp[2] ),r );
		console.log( "--------------ffffffff------------*" , r );
	}else{

	
	if( r= line.reg(/(\xab)/) )
	line = this.multiParse( /(\w+\xab)/, line, function( ret ){
		ret.push = "[c:"+( ret.data = ( this[1] ) )+"](#fff)";
	});
	else
	/*hexa&number*/
	line = this.multiParse( /(cs|ds|ss|es|ax|ah|al|eax|cx|ch|cl|ecx|dx|dh|dl|edx|bx|bh|bl|ebx|sp|esp|bp|ebp|eip|si|esi|di|edi|fs|(\s\.\w+))/, line, function( ret ){
		ret.push = "[c:"+( ret.data = ( this[1] || this[2] ) )+"](#fff)";
	});
	/*hexa&number*/
	line = this.multiParse( /(\sdb\s|\sdw\s|\sdd\s|byte|BYTE|word|WORD|dword|DWORD|qword|QWORD|define)/, line, function( ret ){
		ret.push = "[c:**"+( ret.data = ( this[1] ) )+"**](#ff0000)";
	});
	/*hexa&number*/
	/*line = this.multiParse( /(mov|dec|inc|ret|add|pop|push|jump|jg|jnle|jne|leave|call|lea|xor|jmp|je|cmp|jz|int|call)/, line, function( ret ){
		ret.push = "[c:**"+( ret.data = ( this[1] ) )+"**](#6699ff)";
	});*/
	}

	/*hexa&number*/
	line = this.multiParse( /(section|define)/, line, function( ret ){
		ret.push = "[c:**"+( ret.data = ( this[1] || this[2] ) )+"**](grey)";
	});
	

	// replace comment
	var i =0;
	jno2.regexp( /(\xAA)/, line,function( ){
		line = line.replace(
			this[0],
			c[i]
		);
		i++;
	});
	i = 0;
	jno2.regexp( /(\xAC)/, line,function( ){
		line = line.replace(
			this[0],
			s[i]
		);
		i++;
	});
	//

return line;
};

parsecpp = function( ){
	this.color={
		string:"grey",
		number:"#00ff55",
	};
};
parsecpp.prototype.multiParse = parseasm.prototype.multiParse;
parsecpp.prototype.parseLine = function( line, opts ){
	var tmp, s = [], slf = this;
	
	
/*Commentaire*/
if( line.reg( /(\s|)\/\255/ ) && !line.reg( /(.*?)\255\/(\s|)/ ) )opts.comment=1;;
if( !opts.comment ){
	

	line = this.multiParse( /(\/\255(.*?)\255\/)|(\/\/.*)/, line, function( ret ){
		s.push("[c:**"+(this[0])+"**](green)");		
		ret.push = "\xAC";
	});
	// string 
	while( (tmp = line.reg(/(\'(.*?)\')/)) || ( tmp = line.reg(/(\"(.*?)\")/)) )
	s.push( "[c:**"+tmp[1]+"**]("+this.color.string+")" ),
	line = line.replace(
		tmp[0],
		"\xAC"
	);;
	/*hexa&number*/
	console.log( line.reg(/(0\x[a-fA-F0-9]+)|(?:^\w+$)/) );
	line = this.multiParse( /(0\x[a-fA-F0-9]+)|(([\,\; \231\230\253\252\=]{1})\d+([\,\; \230\231\253\252\=]{1}))/, line, function( ret ){
		
		ret.push = "[c:**"+( this[1] || this[2] )+"**]("+slf.color.number+")";
		
	});
	
	/*
	* var xxx (;|=)
	*/
	line = this.multiParse( /(([A-Za-z\_]+)\s([\w\_]+)(\s|)(\;|\=|\=))/, line, function( ret ){
		ret.push = "[c:**"+this[2]+"**](#9370DB) [c:"+this[3]+"](#fff)"+this[4]+this[5];
	});

	line = this.multiParse( /(\w+)\230/, line, function( ret ){
		ret.push = "[c:**"+(this[1])+"**](#f0f0f0)\230";
	});
	line = this.multiParse( /(\&lt;([\w+\.\_]+)\&gt;)/, line, function( ret ){ console.log(this);
		ret.push = "&lt;[c:**"+(this[2])+"**](grey)&gt;";
	});
	line = this.multiParse( /(bool|BOOL|short|SHORT|int|INT|signed|SIGNED|unsigned|UNSIGNED|long|LONG|HANDLE|\255|word|WORD|dword|DWORD|qword|QWORD|byte|BYTE|void|VOID|char|string|STRING|w_char_t|char16_t|char32_t|double|DOUBLE|const|CONST|STR|LPCSTR|LPSTR|string|STRING|TCHAR)/, line, function( ret ){
		ret.push = "[c:**"+(this[1])+"**](#9370DB)";
	});
	line = this.multiParse( /(else|\&\&|\|\||\=\=|\!\=|\=|\&gt;|\&lt;|\-\&gt;|\230|\231|\{|\}|\,|\;|\.|\251)/, line, function( ret ){
		ret.push = "[c:**"+(this[1])+"**](#fff)";
	});
	line = this.multiParse( /(false|true|null|NULL|\!)/, line, function( ret ){
		ret.push = "[c:**"+(this[1])+"**](#ff6666)";
	});
	line = this.multiParse( /(break|case|return|struct|\#define|\#include|typedef|using|const|static|extern|class|private|protected|public|this|template|switch|try|catch|typename|union|throw|\snot\s|\snew\s|\sxor\s|\sand\s|\sor\s)/, line, function( ret ){
		ret.push = "[tt:[c:**"+(this[1])+"**](#E6E6FA)]";
	});
	line = this.multiParse( /(([A-Za-z\_]+)\s([\w\_]+)(\s|)(\;|\=|\=))/, line, function( ret ){
		ret.push = "[c:**"+this[2]+"**](#9370DB) [c:"+this[3]+"](#fff)"+this[4]+this[5];
	});
	
	var i = 0;
	line = jno2.regexp( /(\xAC)/, line,function( ){
	return s[i++];
	});
}else
line = "[c:"+line+"](green)";	
if( tmp = line.reg( /(\s|)\255\/(\s|)/ ) )opts.comment=0;;
	

return line;
};

var cscript = asmSpec = function( a, b ){
return cscript.make( a, b );
};


cscript.language = asmSpec.language = {
	
	css:function( ){
	return new parseCss( );
	},
	asm:function( ){
	return new parseasm( );
	},
	cpp:function( ){
	return new parsecpp( );
	},
	c:function( ){
	return new parsecpp( );
	},

	js:0,
	all:0,
};


/**/

cscript.make = asmSpec.make = function( __text__, type ){
	var tmp, ret = [], ptr = (asmSpec.language[ type ] ? asmSpec.language[ type ] : asmSpec.language.cpp)( ), opts = { comment:false};
	console.log( type,"*-*--*-" );
	__text__ = __text__.replace( /\</g, "&lt;" ).replace( /\>/g, "&gt;" ).replace( /\%/g, "\\%" ).replace( /(\[)/g, "\\[" ).replace( /(\])/g, "\\]" ).replace( /\(/g, "\\(" ).replace( /(\))/g, "\\)" ).replace( /(\*)/g, "\\*" ).replace(/[$]/g,"\\$").replace(/(\:)/g,"\\:");
	__text__ = jmd.parser.replace( __text__ );
	if( ( tmp = jmd.explode( __text__ ) ).length > 0 )
	tmp.map( function( line ){

		ret.push(
			 ptr.parseLine( line, opts )
		);

	});;
//console.log(ret.join("\r\n"));
//tmp =jmd.parseGlobalText( {}, ret.join("\r\n") ).replace(/(\xab)/g,":");//.replace( /(\xff)/g, "[" ).replace( /(\xfe)/g, "]" ).replace(/(\xfd)/,":");
//console.log( k = tmp.replace( /(\xff)/g, "[" ) )
return jmd.parser.replace( 
		jmd.parseGlobalText( {}, ret.join("\r\n") ),//.replace(/(\xab)/g,":"),
		1 
	);
};


/*
 extend a basic output without 
 any string parsing.
*/
(function( codeSpec ){
var parseraw = function(){ this.color={}; };
parseraw.prototype.parseLine = function( line ){
return line;
};
/*constructor*/
codeSpec.default = codeSpec.raw = function( ){
return new parseraw( );
};

})( asmSpec.language );
/*css*/
(function( codeSpec ){
var parsor = {
	strQ0:/(\'(.*?)\')/,
	strQ1:/(\"(.*?)\")/,
};
var parseraw = function(){
	this.color = {

	};
	this.break   = !1;
	this.comment = !1;

};
parseraw.prototype.parseLine = function( line ){


return line;
};
/*constructor*/
codeSpec._css = function( ){
return new pasrseraw( );
};

})( asmSpec.language );
