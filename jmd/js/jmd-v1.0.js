/*
 little API Markdown interpretor in Javascript
 language, he translate markdown language to
 html text.

 just put this id name 
 <div id="md"></div>

 this code is under licence GPL
 write   : мародер потока
 version : 1.00.0
 last up : 2017-01

*/
(function( slf, jno2 ){
/*
 opts{
  edit: node
  text: input text
  output: node
 }
*/
var markdown = function( opts ){
return new markdown.init( opts );
};
var ii=0;
markdown.extend = jno2.extend;
markdown.extend({
	
	
	replace:{
		// pvt
		1:"<i>",2:"<b>",3:"<i><b>",
		class:{
			1:"under",
			2:"stroke",
			3:"over"
		},
		// can be extenced
		bbc:{
			attr:{
				/*
				 command:"style %c ..." 
				 %c -> argumen receive by markdown parsing 
				*/
				c:"color:%c;",
				size:"font-size:%c;display:inline-block;",
			},
			/*
			 simple tag like <%c> %c <%c>
			*/
			html:["sup","sub","tt"],
			class:{
				/*
				 ut classcname like
				 baliseName:"className"
				*/
				v:"versus",
				code:"code",
				/*
				 ...
				*/
			},
			callback:{
				img:0,vscanf:0,
				atob:0,btoa:0,
				a:function( ){
				return '<a href="'+this[5]+'" target="1">'+this[3]+'</a>';
				},
				time:function( ){
				var d = new Date( ),o;
				return ( this[3] && this[3].length > 0 ? this[3] : "\x9ba" ).replace(
					/\x9bh/, d.getHours( )
					).replace( /\x9bm/,  (o=d.getMinutes( )).length == 1 ? "0"+o : o
					).replace( /\x9bs/, (o=d.getSeconds( )).length == 1 ? "0"+o : o
					).replace(/\x9aa/, (o=d.getTime( )).length == 1 ? "0"+o : o
				);	 
				},
				lang:function( ){
				return markdown.parseTextElements( {},
					markdown.parseBBc( {},
					"[size:**\("+this[3].toLowerCase().slice(0,2)+"\)**](10)"
				) );
				},
			},		
		},
		/*
		 className Box
		*/
		box:[
			"box","silver" //...
		],
		code:["shell","msdos"],
		jcsript:{

		/*
		 if jcscript is loaded to js 
		 you must indicate languages names  
		 ...here
		*/	/*default*/
			raw:true,js:true,c:true,cpp:true,css:true
		},
		module:["prototype","hexdump"],
	},

	extendReplace:function( a, b,c ){
		argumennts.length == 2 && jno2.isArray( b ) ?
		jno2.extend( this.replace.bbc[a] , b ):
		this.replace.bbc[a][ b ] = c;
	return this;
	},
	/*
	* reolace all them selector into string like this \x
	  selector : *,$,[,],:,%,|,(,),&,%,',"
	 sometimes you have need to use some special characters
	 who're used by jcscript as tag, so for use this character
	 '\' who would be put down in front of each one of them for
	 be display correctly and do not minged with a tag.
	*/
	parser:{
	255:{h:"\255",c:"*",p:(/(\\\*)/g),r:(/(\255)/g),},
	254:{h:"\254",c:"$",p:(/(\\\$)/g),r:(/(\254)/g),},
	253:{h:"\253",c:"[",p:(/(\\\[)/g),r:(/(\253)/g),},
	252:{h:"\252",c:"]",p:(/(\\\])/g),r:(/(\252)/g),},
	251:{h:"\251",c:":",p:(/(\\\:)/g),r:(/(\251)/g),},
	250:{h:"\250",c:"%",p:(/(\\\%)/g),r:(/(\250)/g),},
	249:{h:"\249",c:"|",p:(/(\\\|)/g),r:(/(\249)/g),},
	/*
	i've lost... so for avoid any trouble
	i've start again to 203 ^^
	*/
	230:{h:"\230",c:"(",p:(/(\\\()/g),r:(/(\230)/g),},
	231:{h:"\231",c:")",p:(/(\\\))/g),r:(/(\231)/g),},
	232:{h:"\232",c:"&",p:(/(\\\&)/g),r:(/(\232)/g),},
	233:{h:"\233",c:"%",p:(/(\\\%)/g),r:(/(\233)/g),},
	234:{h:"\234",c:"\"",p:(/(\\\")/g),r:(/(\234)/g),},
	235:{h:"\235",c:"\'",p:(/(\\\')/g),r:(/(\235)/g),},
	/*
	 replace all elements
	 string __data__ to parser
	 bool type 0 -> \* -> \xxx
	 bool type 1 -> \xx -> \*
	 @return string data 
	*/
	replace:function( __data__, type ){
	jno2.each( this, function( h ){
		if( jno2.isArray(  h ) ){
			__data__ = __data__.replace(
				type ? h.r : h.p,
				type ? h.c : h.h
			);
		}
	});
	return __data__;
	}
	},
	
	/*explode some text*/
	explode:function( __asm__ ){
	return __asm__.split( /(\n)+/.test( __asm__ ) ?
			"\n" : /(\r\n)+/.test( __asm__ ) ? 
			"\r\n" : "\r"
		);
	},

	/*retur overflow*/
	overflow:function( char, size ){
	return char.length > size ? ( char.length % size ) == 0 ? 
	size : ( char.length % size ) : char.length;
	},
	/*create TEXTHTML*/
	node:function( balise, inner, attr ){
	inner = new String( inner ).toString( );
	return jno2.vscanf(
		"<%c"+(attr?" %c":"")+">%c</%c>",
		balise,
		attr || inner,
		attr ? inner : balise,
		attr ? balise : undefined
	);
	},
	span:function( classn, inner ){
	return markdown.node(
		"span",inner, 'class="'+classn+'"'
	);
	},

	/*parseVar %foo */
	parseVar:function( slf, __text__ ){ 
	return jno2.regexp( /\%([A-Z\_]+)/, __text__, function( slf ){
	return slf.link[ this[1] ] ? slf.link[ this[1] ] : "\233"+this[1]; // ? \233 or %
	}, slf );
	},
	/* parse :emojis:*/
	parseEmojis:function( slf, __text__ ){
		var a,b,c,t;
	return jno2.regexp( /\:([\w_\+\-]+)\:/, __text__, function(  ){
		return markdown.span( 'emojis" style="background-image:url(\'./'+(slf.emojis?slf.emojis:'emojis')+'/'+this[1]+'.png\');', "" );
		} );
	},

	/*
	* <test0<test0r152>testo12589>
	* |____ok________ok__________| 
	*/
	findSub:function( data, off, b ){
		var tmp,n = 0,
		r = "", toff = off;
		while( tmp = data[ toff ] ){
			
			if( tmp === b[0] && toff > off )
			n++,r="";

			else if( tmp === b[1] ){
				r+= tmp;
				data[toff+1] && data[toff+1] === "(" ?
				r+= markdown.resolveEntireTag( data, toff+1, "()" )  : void 0;
				break;
			}
			
			if( n > 0 )
			r+= tmp;;

		toff++;
		}
	console.log( r,"--8888--" );
	return r.length > 0 ? r :  data;
	},
	/*
	* <test0<test0r152>testo12589>
	* |_____X_________X__________| OK
	*/
	resolveEntireTag:function( data, off, b ){
		var tmp,n = 0,
		r = "", max = 0,rtmp ="";
		while( tmp = data[ off ] ){
			
			if( tmp === b[0] )
			n++, rtmp="",max++;

			else if( tmp === b[1] )
			--n;
			
			r+= tmp; 
			rtmp += n > 1 ? tmp : "";
 
			if( tmp == b[1] && n == 0 || n == -1 ){
			// try to remove this part or improve it him
			// check if this balise as supp arguments
			data[off+1] && data[off+1] === "(" ?
			r+= markdown.resolveEntireTag( data, off+1, "()" )  :void 0;			
			break;
			}
		off++;
		} console.log( rtmp, " ------------ " );
	return  r;max > 1 ? this.findSub( r, 0, b ) : r;
	},
	
	parseBBc:function( slf, __text__ ){ 
	var k;
	/*
		 **
	         /\
		/  \
	       /.   \
	      /.     \
	     /.  ||   \ 
	    /.   ||    \
	   /.    ..     \
	  /.     ..      \
	 /..............  \
	 *================*
	       |    |
	*/
	// parsor deprecated
	// he just used as index indicator
	// when he going to find the selector
	// this  parsor make this :
	//     parsor [xx: yy [xx:yy](15)]
	//            |_____________|----| 
	// 			    | part missing !
	//	
	// if you use just one line with multiples selector BBC 
	// without '?' into parsor like : from \:(.*?) to \:(.*)
	// [xx: yy [xx:yy](15)] and an other selector [xx:yy]
	// |________________________________________________|
	//
	// he will take on everythings and if parsor contain "?".
	// finnally he'll missing a part.
	return jno2.regexp( /\[(\w+)(\:(.*?)|)\](\((.+?)\)|)/, __text__, function( slf, data, d ){
		/*
		* {
			1:balise [XX:yy](zz)
			3:argv   [xx:YY](zz)
			5:argv++ [xx:yy](ZZ)
		* }
		*/
		// try to define true selector entire
		// but try to define a new RegExp
		// new parsor [xx: yy [xx:yy](15)]
		//            |__________________|
		// 
	//console.log( markdown.findSub( data, this.index, "[]" ) );
		if( (k=markdown.resolveEntireTag( data, this.index, "[]" ).reg(/^\[(\w+)\:(.+||)\](\((.*?)\)|)$/) ) || (k=[,,,,]) );;

		this[0] = k[0];
		this[1] = k[1];
		this[3] = k[2];
		this[5] = k[4];
		

		k = null;
		/*attribut*/
		if( ( k  = markdown.replace.bbc.attr[ this[1] ] ) )
		return markdown.node(
			"span",								// NodeName
			new String( this[3] ).toString( ), 				// inner
		 	'style="'+jno2.vscanf( k, (this[5]?this[5].trim( ):"") )+'"'	// attributStyle
		
		); // html simple balise
		else if( ( k  = markdown.replace.bbc.html.indexOf( this[1] ) ) > -1 )
		return markdown.node( 
			markdown.replace.bbc.html[k],
			new String( this[3] ).toString( ),
			this[5]
		);
		else if( ( k  = markdown.replace.bbc.class[ this[1] ] ) )
		return markdown.span( 
			k,
			this[3]
		);
		else if( typeof ( k  = markdown.replace.bbc.callback[ this[1] ] ) == "function" ){
			var _t;
			//this[3].replace(/(\<(.+?)\>)/g,"");
		return ( _t = k.call( this ) ) && _t.length > 0 ? _t : "";
		}else ;
		return "";

		/*
		* unnknow tag this[1] at line : slf.line
		*/

	}, slf );
	},

	/*
	 selector * and #
	*/
	parseTextElements:function( slf, __text__ ){
		var a,b,c,t;
	return jno2.regexp( /((\*+)(.*?)(\*+)|(\$+)(.*?)(\$+))/, __text__, function( slf ){

		a = this[2] ? /\*/g : /\$/g;
		b = this[2] ? "\255":"\254";
		

		return ( ( this[2] || this[5] ).replace( a,b ).slice( 3,( this[2] || this[5] ).length )+
			 (this[2] ? 
			  jno2.vscanf(
			   "%c%c%c", 
			   ( c = markdown.replace[ markdown.overflow( this[2], 3 ) ] ),
			   new String( this[3] ).toString( ),
			   c.replace(/</g,"</") 
			) :  markdown.span( 
				markdown.replace.class[ markdown.overflow( this[5], 3 ) ],
				this[6] 
			) )+
			 ( this[4] || this[7] ).replace( a,b ).slice( 3,( this[4] || this[7] ).length ) );
		}, slf );
	},

	/*
	 pparse global : var, bbcode, emojis selector, text selector
	 @return string __text__
	*/
	parseGlobalText:function( ptr, __text__ ){
	return markdown.parseTextElements( ptr, 
		markdown.parseEmojis( ptr, 
			markdown.parseBBc( ptr,
			markdown.parseVar( ptr,
					__text__
				)
			)
		)		
	);
	},
	
	parseLine:function( ptr, line ){
		var tmp;
		
		/*maybe open a new tag items list*/
		if( !ptr.break && line.reg(/^(\t+){1,}\*(.*)$/) ){
			ptr.break = true;
			ptr.stack = [line];
		/*maybe open a new tag code*/
		}else if( ( tmp = line.reg( /^\\(\w+)$/ ) ) ){
			ptr.break = true;
			ptr.stack = [];
			ptr.code  = tmp[1];
		/* open new a new tag table*/
		}else if( !ptr.break && line.reg( /^\|(.*)\|$/ ) ){
			ptr.break = true;
			ptr.stack = [line];
			ptr.code  = 2;
	
		/*end table*/
		}else if( ptr.break && !line.reg( /^\|(.*)\|$/ ) && ptr.code == 2 ){
			ptr.break = !1;
			ptr.code = null;
		return markdown.view.makeTable( 
			ptr,
			ptr.stack
		);
		
		
		}else if( ptr.break && line.reg( /^\\\\$/ ) && ptr.code ){
			var tp, k = "fdf";
			

			if( ( tp = markdown.replace.code ).indexOf( ptr.code ) > -1 )
			k="<div class='"+ptr.code+"'><div class='sh'>"+ptr.stack.join("\r\n").replace(/</g,"&lt;").replace(/>/g,'&gt;')+"</div></div>";
			else if( markdown.replace.jcsript[ ptr.code ] )		
			k = '<div class="cscript"><div class="sh">'+ cscript(  ptr.stack.join("\r"), ptr.code ) +'</div></div>';;
			

			ptr.break = !1;
			ptr.code = null

		return ( k  );
		/*end list*/
		}else if( ptr.break && !line.reg(/^(\t+){1,}\*(.*)$/) && !ptr.code ){
				ptr.break = !1;
		return markdown.view.makeList( 
			ptr,
			ptr.stack
		);
		/*push line into stack*/
		}else if( ptr.break )
		ptr.stack.push( line );
		else if( !ptr.break ){

		/*%var*/
		if( tmp = line.reg( /^\@([\w\_]+)\s+(.+)$/ ) ){
		ptr.link[ tmp[1] ] = tmp[2];
		return "";
		/*title & subtitle*/
		}else if( tmp = line.reg( /^(\\sub|)(\#+){1,6}(.+)$/ ) ){
			var t = 
			markdown.node(  "span", 
					this.parseGlobalText( ptr, tmp[3] ),
					'id="'+btoa(tmp[2])+'" class="'+(tmp[1] ? "sub" :"")+'part tt'+tmp[2].length+'"'  
			);
		return tmp[1].length == 0 ? 
		'<a href="#'+btoa(tmp[3])+'" id="'+btoa(tmp[2])+'">'+t+'</a>' : t;
		
		/*
		 moduleLoad
		*/
		}else if( tmp = line.reg( /^\\(\w+ )(.+)$/ ) ){ 
		return markdown.module[ "m"+tmp[1].trim( ) ] ? markdown.module[ "m"+tmp[1].trim( ) ](
				line.slice( tmp[1].length+1, line.length )
			) : "";
		/*
		 pointer to markdown.reple.box
		 class> text
		*/
		}else if( tmp = line.reg( /^(\w+)\>(.*)$/ ) ){
		return markdown.node( "div", this.parseGlobalText( 
			ptr, markdown.parseLine( ptr, tmp[2] )
		), 'class="'+( markdown.replace.box.indexOf( tmp[1] ) > -1 ? tmp[1] : "" )+'"' );

		/*basic some text*/
		}else if( line.length > 0 )
		return markdown.node( "p", this.parseGlobalText( 
			ptr, line 
		));;
	
	}

	return "";
	},
	
});

markdown.init = function( opts ){
	this.reload( opts );
return this;
};
markdown.extend( markdown.init.prototype,{

	reload:function( opts ){
		/**/
		this.link = {};
		this.opts = opts;
		this.break = !1;
		this.stack = [];
		this.code  = null;
		this.i     = 0;
		// directory emojis
		this.emojis  = opts.emojis || null;
	return this;
	},
	load:function(  ){
		var txt,__ = "",
		 slf = this, tmp;

		if( ( txt = markdown.explode( ( this.opts.txt || this.opts.edit.val( ) ) ) ).length > 0 )
		txt.map( function( line, i ){
			
			/*
			 i've prefer to apply this function here,
			 rather to apply it  above,  that's allow
			 to parse each line by slice, for avoid any
			 parsing error, or analyzing of oversize string.
			*/
			line = markdown.parser.replace( line );

			/*
			 replace special each characters
			*/
			__+= markdown.parser.replace( 
				( tmp = markdown.parseLine( slf, line ) ).length > 0 && !slf.break ?
				"<section class='select' data-module='"+btoa( this.i++ )+"'>"+tmp+"</section>" : "",
				 1 
			);
			
		});;

		/* output */
		this.opts.input.val( 
			__
		);
	// return alls nodes jno2
	return jno2("#md").child("section.select");;
	},
	
	parseOneLine:function( lineno, id ){
	var tmp = markdown.parser.replace( typeof lineo == "number" && tmp[ lineo ] ? tmp[ lineo ] : lineo );

	return markdown.parser.replace( 
		( tmp = markdown.parseLine( this, tmp ) ).length > 0 && !this.break ?
		tmp : "",
		1
	);
	},
	parseGlobalText:function( __text__ ){
	return markdown.parseGlobalText(
		this, __text__
	);
	},
	parseTextElements:function( __text__ ){
	return markdown.parseTextElements(
		this, __text__
	);
	},
	parseBBc:function( __text__ ){
	return markdown.parseBBc(
		this, __text__
	);
	},
	parseVar:function( __text__ ){
	return markdown.parseVar(
		this, __text__
	);
	},
	
});

markdown.extend( ( markdown.view = {} ), {
	makeList:function( ptr, elts, i, j ){
		var r,t = "", o,tmp;
		
		if( !i )i={i:0};;

		i.i = i.i || 0;
		j= j || 1;
		
		r = markdown.node( "ul", "__RET__", 'class="list"' );
		try{
		while( tmp = elts[ i.i ] ){
			o = tmp.reg(/^(\t+){1,}\*(.*)$/);

			if( j > 1 && o[1].length < j ){
			--i.i;
			break;
			}

			t += o[1].length > j ? 
			markdown.view.makeList( ptr, elts, i, j+1 ) :
			"<li>"+markdown.parseGlobalText( ptr, o[2] )+"</li>";
					
		i.i++;
		}
		}catch(e){console.log(e);}		
		o=tmpi=j=null;
	return ( r.replace( "__RET__", t || "" )  || "" );
	},
	makeTable:function( ptr, elts ){
		var r,a,z,t = "",tmp;
		
		r = markdown.node( "table", "__INNER__" );
		jno2.each( elts, function( v, i ){
			t+="<tr>";
			jno2.each( v.split("|"), function( vl, j ){
				
				if( vl.length > 0){
					
					a = (z=vl.reg(/^\:(.*?)\:$/)) ? "center" :
					(z=vl.reg(/^\:(.*)$/)) ? "left" :
					(z=vl.reg(/^(.*)\:$/)) ? "right" : "right";
					
					vl = z ? z[1] : vl;
					if( i == 0 )
					vl = "**"+vl+"**";;
				
					t+= "<td style='text-align:"+a+"' class='"+( i == 0 ? "peert" : !(i%2) && i != 0 ? "peertd" : "" )+"'>"+
					markdown.parseGlobalText( ptr, vl )+"</td>";
				}
			});
			t+="</tr>";
		});
	return ( r.replace( "__INNER__", t || "" ) || "" );
	},
}); 
/*
 MODULE
 Set a new module 
 extend markdown.module.yourModule = function( elts ){
	eltsText == raw text no parsing into markdown
	\code Elements
 };
 markdown.replae.module.push( "yourModule" );


*/
function _ascii( byte ){
return byte === 0 || byte == 0x0d || byte == 0x0a ? "." : String.fromCharCode( byte );
}
markdown.extend( ( markdown.module = {} ), { 

	mprototype:function( line ){
	var tmp,t, r, u = "", i = 0;
	if( tmp = line.reg( /(\s+|)([\w _ ]+|)\s+([\w\_\.]+)(\(|\{)(.+)(\)|\})([\w \,\;\*]+|)/ ) ){
			
		r = markdown.parseBBc( {},
			'<ul class="proto"><li>[c:'+tmp[2]+'](#000080)&nbsp;&nbsp;&nbsp;&nbsp;[c:'+tmp[3]+'](#494949) '+
			tmp[4]+'</li>__RET__ <li>'+tmp[6]+'[c:'+tmp[7]+'](#000080)</li></ul>'
		);
		tmp = tmp[5].split(",");
		for(; i < tmp.length; i++ ){
		if( t = tmp[i].reg(/(.+)\s+(.+)/) )
			u += markdown.parseBBc( {},
			'<li style="margin-left:100px;">[c:'+t[1]+'](#d2d200)&nbsp;&nbsp;&nbsp;&nbsp;[c:'+t[2]+'](#494949)'
			);;
				
		}
		r= r.replace( "__RET__", u.replace(/(\255)/g,"<span style='color:#000080 !important'>\255</span>") );
	}
	tmp=t=u=i=null;
	return ( r || "" );
	},
	mhexdump:function( frame, addr ){
		var i = 0,r,j;
		//console.log( frame );
		try{ frame = atob( frame ); }catch(e){ frame = "" };

		r = "<table id='hexdump'><tr><td class='addr'><tt>"+
		base.dec2hext( i, 2 ) +"</tt></td>";
		
		for(; i < (frame.length )+( (addr || 0x10)-frame.length%(addr || 0x10) ); i++ ){
			if( !( i%( addr || 0x10 ) ) && i != 0 ){
	
				// ASCII 
				for( j = i-( addr || 0x10 ); j < i; j++ ){
					r +=  "<td class='ascii a_"+j+"'>"+ 
					_ascii( frame.charCodeAt( j ) )+ 
					"</td>";
				}
				r += "</tr><tr><td class='addr'><tt>"+
				base.dec2hext( i, 2 )+"</tt></td>";
			}
			r += "<td style='' class='h o_"+i+"'>"+
			base.dec2hext( frame.charCodeAt( i ), 1 ) +"</td>";
		}
		// ASCII
		for( j = i-( addr || 0x10 ); j < i; j++ ){
			r +=  "<td class='ascii a_"+j+"'>"+ 
			_ascii( frame.charCodeAt( j ) )+ 
			"</td>";
		}
	return r+"</tr></table>";
	},

});

/*
 **
# callback to markdown.replace.calback
 ***
*/
markdown.replace.bbc.callback.img = function( ){
	var kk,s = "";

	// attribut
	if( this[5] && (this[5]=this[5].split(",")) )	
	kk = this[5][0].reg(/(\s\d+\s|\d+|)\*(\s\d+\s|\d+|)/);
	
return  '<div class="pictnode"><div></div>'+ /*wrapper*/
	'<img src="'+this[3]+'" '+ 	    /*node*/
	' onload="jmd.img( this, '+( kk && kk[1].length > 0 ? "\'"+kk[1].trim()+"\'" : null )+','+
	(  kk && kk[2].length > 0 ? "\'"+kk[2].trim()+"\'" : null )+', '+( this[5] && this[5][0] ? 1 : 0 )+' )" >'+
	'</div>';
}; 
markdown.replace.bbc.callback.vscanf = function( ){
	var argv = [];
	jno2.each( ( [this[3]].concat( this[5].split(",") ) )  , function( v, i ){
			argv[ i ] = /\d+/.test( v ) && !isNaN( parseInt( v ) ) ?
			parseFloat( v ) : v;
	});
return jno2.vscanf.apply(
		null,
		argv
	);
}; var i = 0;
markdown.replace.bbc.callback.atob = markdown.replace.bbc.callback.btoa = function( ){
return markdown.span( 
	"",
	window[ this[1] == "atob" ? "atob" : "btoa" ]( this[ 3 ].replace(/(\<.+?\>)/g,"") )
	);
}; 			
/*
# end
*/
/* Attach jsript pointer to markdown*/
markdown.jcscript = null;
markdown.img = function( _, w, h, a ){
	
	jno2( _ ).getParent( ).css({ 
		width:( w || _.width | "auto" ),
		height:( h || _.height || "auto" ),
		margin:( a ? "auto" : "" ), display:"block" 
	});
	jno2( _ ).css({width:"100%",height:"100%"});
};

window.jmd = markdown;

})( window, jno2 );
