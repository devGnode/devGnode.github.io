(function( slf, jno2 ){

var markdown = function( opts ){
return new markdown.init( opts );
};

markdown.extend = jno2.extend;
markdown.extend({
	
	
	replace:{
		1:"<i>",2:"<b>",3:"<i><b>",
		class:{
			1:"under",
			2:"stroke",
			3:"over"
		},
		bbc:{
			/*
			* put classcname like
			* baliseName:"className"
			*/
			v:"versus",
			code:"code",
			/*
			* ...
			*/			
		},
	},
	/*
	* all selector like \X
	* *,$,[,],:,%,|
	*/
	parser:{
	255:{
	h:"\255",c:"*",p:(/(\\\*)/g),r:(/(\255)/g),
	},
	254:{
	h:"\254",c:"$",p:(/(\\\$)/g),r:(/(\254)/g),
	},
	253:{
	h:"\253",c:"[",p:(/(\\\[)/g),r:(/(\253)/g),
	},
	252:{
	h:"\252",c:"]",p:(/(\\\])/g),r:(/(\252)/g),
	},
	251:{
	h:"\251",c:":",p:(/(\\\:)/g),r:(/(\251)/g),
	},
	250:{
	h:"\250",c:"%",p:(/(\\\%)/g),r:(/(\250)/g),
	},
	249:{
	h:"\249",c:"|",p:(/(\\\|)/g),r:(/(\249)/g),
	},
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

	/*explode text*/
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
		"span", new String(inner), 'class="'+classn+'"'
	);
	},

	/*parseVar %foo */
	parseVar:function( slf, __text__ ){ 
	return jno2.regexp( /\%([A-Z\_]+)/, __text__, function( slf ){
	return slf.link[ this[1] ] ? slf.link[ this[1] ] : "%"+this[1];
	}, slf );
	},	
	
	/*
	# parseBasic
	* text * = italic
	** text ** = bold
	*** text *** = italic bold

	$ text $ = underline
	$$ text $$$ = stroke
	$$$ text $$$ = overline
	#
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
			   this[3],
			   c.replace(/</g,"</") 
			) :  markdown.span( 
				markdown.replace.class[ markdown.overflow( this[5], 3 ) ],
				this[6] 
			) )+
			 ( this[4] || this[7] ).replace( a,b ).slice( 3,( this[4] || this[7] ).length ) );
		}, slf );
	},

	parseEmojis:function( slf, __text__ ){
		var a,b,c,t;
	return jno2.regexp( /\:([\w_]+)\:/, __text__, function( slf ){
		return markdown.span( 'emojis" style="background-image:url(\'./emojis/'+this[1]+'.png\');', "" );
		}, slf );
	},

	vscanf:function( argv ){
		jno2.each( argv, function( v, i ){
			argv[ i ] = /\d+/.test( v ) && !isNaN( parseInt( v ) ) ?
			parseFloat( v ) : v;
		});
	return jno2.vscanf.apply(
		null,
		argv
	);
	},
	/*
	* <test0<test0r152>testo12589>
	* |_____X_________X__________| OK
	*/
	resolveEntireBalise:function( data, off, b ){
		var tmp,n = 0,
		r = "";
		while( tmp = data[ off ] ){
			
			if( tmp === b[0] )
			n++;

			else if( tmp === b[1] )
			--n;
			
			r+= tmp;;

			if( tmp == b[1] && n == 0 || n == -1 ){
			// try to remove this part or improve it him
			// check if this balise as supp arguments
			data[off+1] && data[off+1] === "(" ?
			r+= markdown.resolveEntireBalise( data, off+1, "()" )  :void 0;			
			break;
			}
		off++;
		}
	return r;
	},
	parseBBc:function( slf, __text__ ){ 
	var k;
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
		k =  markdown.resolveEntireBalise( data, this.index, "[]" );
		k = k.reg(/^\[(\w+)\:(.+||)\](\((.*?)\)|)$/);
	
		this[0] = k[0];
		this[1] = k[1];
		this[3] = k[2];
		this[5] = k[4];
		
		k = null;
		switch( this[1] ){
		case "c": 
		return markdown.node(
			"span",this[3], 'style="color:'+(this[5]?this[5][0].trim( ):"")+'"'		
		);
		case "a":
		return '<a href="'+this[5]+'">'+this[3]+'</a>';
		break;
		case "img":
			if( this[5] && (this[5]=this[5].split(",")) )	
			k = this[5][0].reg(/(\s\d+\s|\d+|)\*(\s\d+\s|\d+|)/);;
			
		return  '<div class="pictnode"><div></div>'+ /*wrapper*/
			'<img src="'+this[3]+'" '+ 	    /*node*/
			'style="" onload="test0( this, '+( k && k[1].length > 0 ? "\'"+k[1].trim()+"\'" : null )+','+(  k && k[2].length > 0 ? "\'"+k[2].trim()+"\'" : null )+', '+( this[5] && this[5][0] ? 1 : 0 )+' )" >'+
			'</div>';
		break;
		/*simple balise*/
		case "sup":
		case "sub":
		case "tt" :
		return markdown.node( 
			this[1],
			this[3],
			this[5]
			);
		break;
		case "vscanf":
		return markdown.vscanf( [this[3]].concat( this[5].split(",") ) )
		break;
		/*balise with class*/
		case "v":
		case "code":
		case "atob":
		case "btoa":
	
		try{ this[1] == "atob" || this[1] == "btoa" ?
		this[3] = window[ this[1] == "atob" ? "atob" : "btoa" ]( this[ 3 ] ) : void 0; }catch(e){};
		return markdown.span( 
			markdown.replace.bbc[ this[1] ] ?
			markdown.replace.bbc[ this[1] ] : "",
			this[3]
			);
		break;
		default:
		return "";
		break;
		}
	}, slf );
	},
	
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
	/**/
	parseLine:function( ptr, line ){
		var tmp;
		/*link*/
		if( tmp = line.reg( /^\@([\w\_]+)\s+(.+)$/ ) ){
		ptr.link[ tmp[1] ] = tmp[2];
		return "";
		/*title*/
		}else if( tmp = line.reg( /^(\\sub|)(\#+){1,6}(.+)$/ ) ){
			var t = 
			markdown.node(  "span", 
					this.parseGlobalText( ptr, tmp[3] ),
					'id="'+btoa(tmp[2])+'" class="'+(tmp[1] ? "sub" :"")+'part tt'+tmp[2].length+'"'  
			);
		return tmp[1].length == 0 ? 
		'<a href="#'+btoa(tmp[3])+'">'+t+'</a>' : t;
		
		/*
		# prototype function
		*/	
		}else if( tmp = line.reg( /^\\prototype/ ) ){
		return markdown.makeproto( line.replace(/\\prototype/,"") );
		}else if( tmp = line.reg( /^\\hexdump/ ) ){ 
		return markdown.makeHexdump( line.replace(/^\\hexdump/,"") );
		/*
		# css #md .class{ ... }
		# class> text
		*/
		}else if( tmp = line.reg( /^(\w+)\>(.*)$/ ) )
		return markdown.node( "div", this.parseGlobalText( 
			ptr, markdown.parseLine( ptr, tmp[2] )
		), 'class="'+tmp[1]+'"' );
		/*basic text*/
		else if( line.length > 0 )
		return markdown.node( "p", this.parseGlobalText( 
			ptr, line 
		));;
	
	return "";
	},
	/*Private*/
	makeproto:function( line ){
		var tmp,t, r, u = "", i = 0;
		if( tmp = new String( line.replace(/\\prototype/, "" ) ).reg( /(\s+|)([\w _ ]+|)\s+([\w\_\.]+)(\(|\{)(.+)(\)|\})([\w \,\;\*]+|)/ ) ){
			
			r = this.parseBBc( {},
				'<ul class="proto"><li>[c:'+tmp[2]+'](#000080)&nbsp;&nbsp;&nbsp;&nbsp;[c:'+tmp[3]+'](#494949) '+
				tmp[4]+'</li>__RET__ <li>'+tmp[6]+'[c:'+tmp[7]+'](#000080)</li></ul>'
			);
			tmp = tmp[5].split(",");
			for(; i < tmp.length; i++ ){

				if( t = tmp[i].reg(/(.+)\s+(.+)/) )
				u += this.parseBBc( {},
				'<li style="margin-left:100px;">[c:'+t[1]+'](#d2d200)&nbsp;&nbsp;&nbsp;&nbsp;[c:'+t[2]+'](#494949)'
				);;
				
			}
			r= r.replace( "__RET__", u.replace(/(\255)/g,"<span style='color:#000080 !important'>\255</span>") );
		}
		tmp=t=u=i=null;
	return ( r || "" );
	},
	makeList:function( elts, i, j ){
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
			markdown.makeList( elts, i, j+1 ) :
			"<li>"+markdown.parseGlobalText( {}, o[2] )+"</li>";
					
		i.i++;
		}
		}catch(e){console.log(e);}		
		o=tmpi=j=null;
	return ( r.replace( "__RET__", t || "" )  || "" );
	},

	makeTable:function( elts ){
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
					markdown.parseGlobalText( {}, vl )+"</td>";
				}
			});
			t+="</tr>";
		});
	
	return ( r.replace( "__INNER__", t || "" ) || "" );
	},
	makeHexdump:function( frame, addr ){
		var i = 0,r,j;

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

function _ascii( byte ){
return byte === 0 || byte == 0x0d || byte == 0x0a ? "." : String.fromCharCode( byte );
}

markdown.init = function( opts ){
	this.reload( opts );
return this;
};
markdown.extend( markdown.init.prototype,{

	reload:function( opts ){

		this.link = {};
		this.opts = opts;

	return this.load( );
	},
	load:function(  ){
		var txt,__ = k ="", d = { break:0, l:[], n:null },
		 slf = this, tmp, i = 0;

		if( ( txt = markdown.explode(  this.opts.edit.val( ) ) ).length > 0 )
		txt.map( function( line, i ){
			
			
			line = markdown.parser.replace( line );

			/* list*/
			if( !d.break && line.reg(/^(\t+){1,}\*(.*)$/) ){
				d.break = true;
				d.l = [line];
			/*code*/
			}else if( ( tmp = line.reg( /^\\(\w+)$/ ) ) ){
				d.n = tmp[1];
				d.break = true;
				d.l = [];
			
			/*table*/
			}else if( !d.break && line.reg( /^\|(.*)\|$/ ) ){
				d.break = true;
				d.l = [line];
				d.n = "t";

			/*end table*/
			}else if( d.break && !line.reg( /^\|(.*)\|$/ ) && d.n == "t" ){

				k=markdown.makeTable( d.l );
				d.break = !1;
				d.n = null
			/*end code*/
			}else if( d.break && line.reg( /^\\\\$/ ) && d.n ){

				
				k="<div class='"+d.n+"'><div class='sh'>"+d.l.join("\r\n").replace(/</g,"&lt;").replace(/>/g,'&gt;')+"</div></div>";
				d.break = !1;
				d.n = null

			/*end list*/
			}else if( d.break && !line.reg(/^(\t+){1,}\*(.*)$/) && !d.n ){
				d.break = !1;
				k=markdown.makeList( d.l );
			/*stack line*/	
			}else if( d.break  )
			d.l.push( line );
			/*simple line*/
			else if( !d.break )
			k= ( tmp = markdown.parseLine( slf, line ) ).length > 0 ?
			"<section class='select' data-module='"+btoa( i++ )+"'>"+tmp+"</section>" : "";;
			
			__+= markdown.parser.replace( k, 1 );
			
		});;

		/* output */
		this.opts.input.val( 
			__
		);

	return this;
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
			
window.jmd = markdown;

})( window, jno2 );

