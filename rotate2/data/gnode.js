/*=*
*	@source: http://dev.gnode.free.fr/gnode/version2.0/gnode.js
*	
*	@licstart  The following is the entire license notice for the 
*   JavaScript code in this page.
*
	Copyright (C) 2014  looterOfFlux

    The JavaScript code in this page is free software: you can
    redistribute it and/or modify it under the terms of the GNU
    General Public License (GNU GPL) as published by the Free Software
    Foundation, either version 3 of the License, or (at your option)
    any later version.  The code is distributed WITHOUT ANY WARRANTY;
    without even the implied warranty of MERCHANTABILITY or FITNESS
    FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.

    As additional permission under GNU GPL version 3 section 7, you
    may distribute non-source (e.g., minimized or compacted) forms of
    that code without the copy of the GNU GPL normally required by
    section 4, provided you include this license notice and a URL
    through which recipients can access the Corresponding Source.

*
*	@licend  The above is the entire license notice
*   for the JavaScript code in this page.2
*
* 	written by looterOfFlux 
*	contact looterofflux@gmail.com
*	last update : 06-27-2014
*	info http://dev.gnode.free.fr
*
*	 <http://www.gnu.org/licenses/>
*
*=*/
var SUCCESS = 1,
	ERRORNO = !SUCCESS,
	
	__WIND__ = window,
	_BODY_  = ( document.body || document );

function convert(){
	/*
	 base 
	*/
	function base(a,b,f){
	var ret = {r:""},
		i = t = 0;
		
		while( Math.floor(a) > 0)
		{
			t = Math.floor(a%b);
			a /= b;
			
			f(ret,t);
			}
		
		i = ret.r.length-1;
		t = "";
		
		for(;i>-1;--i)
			t += ""+ret.r[i];;	
		
	return (ret.r = t);
	}
		
return {
	dechex:function(a){
		var alpha = "abcdef";
		return base(a,16,function(a,b){
				a.r += ""+(b < 10 ? b : alpha[b-10]);
			});
	},
	decbin:function(a){
		return base(a,2,function(a,b){
			a.r += ""+b;
			});
	},
	ibase:function(a,b){
		return base(a,(b > 0 ? b : 1),( !arguments[2] ? function(a,b){
				a.r += ""+b;
			} : arguments[2]));			
	},
	strhex:function(a){
		var ret = "", i = 0 , t;

		while( a[ i ] != undefined){
				
			ret += ""+this.dechex(a.charCodeAt(i));;	
			i++;
		}
					
	return ret;
	},
};
}
/**/
/*
*	allows string_format
*
*	the first parameter is an string 
*	%c = character 
*	%d = decimal ( string and decimal )
*	%b = binary ( just for the interger )
*	%h = hexa ( string or int )
*
*	(" hello %d %d 0x%h %h %b",100,"A",255,"A",255) 
*	output 
*	hello 100 97 0xff 61 1111
*/
var scanf = str_format = function(){
		var argv = arguments,
		s = argv[0],l = argv.length,
		i = 1,tmp,mv;
			
	while( 1 ){
		if( /(%)([bcdh]{1})/.test(s) ){
			var cvrt = convert();
				
			tmp = /(%)([bcdh]{1})/.exec(s);
			mv  = argv[i];
			
			if( tmp[2] == "d" && typeof mv == "string"){
					
				mv = mv.charCode();
					
			}else if( tmp[2] == "h" ){
					
				if(  typeof mv == "number" )
					mv = cvrt.dechex(mv);
				else if( typeof mv == "string" )
					mv = cvrt.strhex(mv);;
					
			}else if( tmp[2] == "b" && typeof mv == "number"  ){
				
				mv = cvrt.decbin(mv);
			}

		s = s.replace(tmp[0],mv);
			
		i++;
		}else
			break;;
	}
		
return s;
}

/*
* ptr alert format
*/
function printf(){
var l = arguments.length;
	alert( l == 1 ? arguments[0] : str_format.apply( this , arguments ) );	
return RET_SUCCESS;
}
	
(function( _w_ ){
	
	if( __WIND__.gnode )
		return false;;
		
	/*function to export*/
    var _exportFn = {},
		nodeCall = { get:{ id:"getElementById", className:"getElementsByClassName", tag:"getElementsByTagName" },
					set:{ _ce:"createElement", _ap:"appendChild",_rm:"removeChild"} };
	/*ctrl*/
	function isVoid( a ){ return !a || ( a == null || undefined ) || a === 0 || a === "" ? true : false; }
	function isDOM( a ){ return !isVoid( a ) && ( a.nodeType && a.nodeType === 1 ) ? true : false;	}
	function isObj( a ){ return !isVoid( a ) && ( typeof a == "array" || typeof a == "object" ) ? true : false;}
	function isNum( a ) {return typeof a === "number" && ( a <= Number.POSITIVE_INFINITY && a>= Number.NEGATIVE_INFINITY ) ? true : false; }
	function neg( a ){ return a > 0 ? -a : a; }
	function abs( a ){ return a >=0 ? a : -a; }
	/**/
	/*basic*/
	function get(a,b,c,d){
		var d = d || document, c = c || {};
	return ( c.node = nodeCall.get[a] && typeof b === "string" && d[ nodeCall.get[a] ] && d[ nodeCall.get[a] ]( b ) ? d[ nodeCall.get[a] ]( b ) : null ); 
	}
	function _ce( a,b ){
		var b = b || {};
	return ( b.node = document[ nodeCall.set._ce ]( a ) );
	}
	function _ap(a,b,c){
		var b = b || _BODY_ || document,c = c || {};
	return ( c.node = b[ nodeCall.set._ap ] ? b[ nodeCall.set._ap ]( a ) : null )
	}
	function _rmv(a,b){
		var e = b || -1;
	return ( e || e > -1 ) && e[nodeCall.set._rm] ? e[nodeCall.set._rm](a) : false;
	}
	/**/
	String.prototype.upper = function(){
		var j = 0,i,l,t;
		
		if( arguments.length > 0 && this[ ( i = arguments[0] ) ] ){
			
			l = this.length,t = "";
			while( j<l ){
				t += ""+( i == j ? this[j].toUpperCase( ) : this[j] );
				j++;
			}
			
		return t;
		}else if( arguments.length == 0 )
			return this.toUpperCase( );;
	
	return this;
	};
	/*String*/
	/*shortcut of the function codeCharAt*/
	String.prototype.charCode = function( ){
	
		var r = "",
			s = this,
			i = 0,l = this.length;

		for(; i<l;i++)
			r+=""+s.charCodeAt(i);;

	return r;
	};
	/* warning some time she returned 
	an error ns_error_xpc_security_manager_veto*/
    function made(a,b){
	var i,k;
		
	try{
		for( i in b ){
			if( isObj( b[i] ) ){
			
				for( k in b[i] )
					a[i][k] = b[i][k];;		
			}else
				a[i] = b[i];;	
		}
	}catch(e){};
	
	return (a.gnode ? a.gnode : a);
	}
	
	var merge = ( window.merge = function ( handle, element ){
		var tmp, i;
		
		if( arguments.length == 1 && this != window ){
			element = handle;
			handle  = this;
		}else if( arguments.length == 1 && this == window )
			return;;
		
		try{
		for( tmp in element ){
			handle[ tmp ] = element[ tmp ];
		}
		}catch(e){};
		
	return handle;
	} );
	
	/*get*/
	function shortcut( a,b,c,d ){
		var cll = ["id","className","tag"],
			t,k = -1, r = null;
				
		if( arguments.length === 1 && !isDOM( a ) ){	
			if( ( t = /^([#.$]{1})([\w+\d+ _ ]*)$/.exec( isObj( a )  ? a[0] : a ) ) ){
				r = {};
				r.call = cll[ ("#,.,$").split(",").indexOf( t[1] ) ];
				r.key = isObj( a ) && a[1] ? abs( a[1] ) : r.call === "id" ? k : k+1;
				r.name = t[2];
			}
		}else if( a && b && !isDom( a ) ){			
			if( ( k = cll.indexOf( a ) ) > -1  ){	
				r = [];
				r.push( (k == 0 ? "#" : k == 1 ? "." : "$" )+""+b );
				c ? r.push( abs( c ) ) : 0;	
			}
		}
		
	return r;
	}
	/*__*/
_exportFn._import = function(a,b,c,d){
	var out = {},target,e;
		
	if(typeof a == "string" && (typeof b == "function" || isObj(b) ) )
		target = this;
			
	else if( isObj( a ) && a.toString( ) == "[object Object]" ){
	
		target = a;
		a = b;
		b = c;
		e = d;
	}
	
	if( target &&  target[a] )
		return false;;
		
	b = b && isObj( b ) &&  b.length !== 0 && b[0] ? b : ["[*]"] ;
		
	out.mount  = e || c;
	out.owns   = b;
		
	target[a] = out;
	
return out;
};
	
	function _gc(a){	
		return a && a.length == 0 ? null :  a;
	}
	function _gn(a){
		var shc;
		if( (typeof a === "string" || isObj( a ) ) && !isDOM( a ) ){
			
			if( ( shc = shortcut( a ) ) ){

				if( shc.key == -1 )
					return  _gc( get( shc.call , shc.name  ) );
				else
					return _gc( get( shc.call , shc.name )[ shc.key ] );;
			}
		}
	return null;
	}
	/*child.prototype.shortcut*/
	/*gnode contructor*/
	function _g( a, b){
		var e = { },n,node;

		// if gnode 
		if( a && a.node )
			return a;

		// isDOM not gnode
		else if( isDOM( a ) && !a.gnode )
			node = e.node = a;
		else if( isDOM( a ) && a.gnode )
			return a.gnode;
		else if( ( tmp = /^\<(.+)\>$/.exec( a ) ) )
			node = e.node = _g.DOM( tmp[1] );
		// shortcut get
		else{
			node = e.node =  _gn( a );;
		}
		
		// recheck DOM have yet gnode
		if( node && node.gnode )
			return node.gnode;
			
		else if( node ){
		try{
			for( n in _exportFn ){
				
			//	alert(( _exportFn[ n ].owns.indexOf( nd.toString( ) ) > -1 ) )
				if( _exportFn[ n ].mount && typeof _exportFn[ n ].mount == "function"  ){
					_exportFn[ n ].mount.apply( e , [ e ] );
					merge( node , e,  true);
					//node.height ="";	
					}
			}
			
		}catch(er){  };
		
		e.node.gnode = node.gnode = e;
		}
		
	return (e.node ? e : null );
	}

	_g.fillup = _g.prototype.fillup = function( handle, element, key ){
		var tmp;
		if( typeof handle == "object" && typeof element == "object" ){
			try{
				for( tmp in element ){
					handle[ tmp ] = element[ tmp ];
				}
			}catch(e){};
		}else if( typeof handle == "object" && typeof element == "function" ){
			handle[ key ] = element;
		}
	return handle;
	};
	_g.DOM = _g.prototype.DOM = function( element ){
		return _ce( element );
	};
	
/*extend Node class since v2*/
_exportFn._import("define",[], function( slf ){ 
		
	slf.define = function( a,b ){
		
		_exportFn._import.call( this, a ,[] , b );
		this[a].mount( this );
		delete this[a];
	
	return slf; 
	};

return slf;
});

// Mount DOM elements
// ( parentNode , { module:[ nodeName [ , "$|.|# id or ClassName" ] ],Attrib,child: []}
var iii = 0;
function osx_dom(p,o,c){
	var o = o || {},tnode,
		n,i = 0,shc;
		
	if( isObj( o ) && !isDOM( o ) ){
		
		for( n in o ){
			
			if( n == "module" && o.module && isObj( o.module ) ){
				
				// create moduleNode
				if( !isDOM( ( tnode = _ce( o.module[0] ) ) ) )
					return null;;
				
				try{
				
				i = 1;
				while( ( o.module[ i ] != undefined ) ){
				
					// Add attribute id or className
					if( (shc = shortcut( o.module[i] ) ) )
						tnode[ shc.call ] =  shc.name;;
				i++;
				}
			
				}catch(e){};
			// General attrib
			}else if( n == "made" && isObj( o[n] ) ){
				
					made( tnode, o.made );

			// Children
			}else if( n == "child" && isObj( o.child ) ){
				
				i = 0;
				while( o.child[ i ] != undefined ){
					(function( a ){
					c ? osx_dom( tnode, o.child[a], c ) : osx_dom( tnode, o.child[a] );
					})( i );
				i++;
				}
			// 1 <
			}else if( n === "_import" && o._import && isObj( o._import ) ){
	
			o._import = false;
			}		
		}
		
	// yet Mount DOM
	}else if( isDOM( o ) )
		tnode = o;;
	
	
return ( !tnode ? p : p.appendChild( tnode ) ); 
}

/*Basic*/  
function impasse(a){ var r = {}; r[a]= null; return r; }
function solveChild(a,b){
	var shc,i,k = 0,t = this.node.children;
	
	if( (shc = shortcut(a)) ){
		try{
			t = shc.call == "tag" ? this.node[ nodeCall.get.tag ]( shc.name ) : t;
			
			for( i in t ){
				if( isDOM( t[i] ) ){
				
					if( shc.call === "id" && t[i][ shc.call ] && t[i].id === shc.name )
						if( b )
							b.call( this , ( !t[i].gnode ? _g( t[i] ) : t[i].gnode ) );
						else
							return !t[i].gnode ? _g( t[i] ) : t[i].gnode;
						
					else if( shc.call === "tag" && shc.name.upper() === t[i].nodeName ){
						
						if( typeof b == "function" )
							b.call( this , ( !t[i].gnode ? _g( t[i] ) : t[i].gnode ) );
						
						else if( k == shc.key && !b )
							return !t[i].gnode ? _g( t[i] ) : t[i].gnode;
						else 
							k++;;
					}
					
				}
			}
		if( shc.call === "className" )
			return  ( ( i = (  _gc( get( shc.call, shc.name, null, this.node ) ) || impasse( shc.key ) )[ shc.key ] ) ? !i.gnode ? _g( i ) : i.gnode : null );;
			
		}catch(e){};		
	}
	
return null;	
}
_exportFn._import("basic",[],function( slf ){
		
		var items = 0; 
		function child_dom( a ){
			var ret = false;
				
				// exist items
				if( ( ret = this.node.children[ items ] ) && ( a == "prev" || a == "next" ) ){
					a == "next" ? items++ : --items;
					
				}else if( !ret && ( a == "prev" || a == "next" ) ){
					items = a == "next" ? null : this.node.children.length;
					ret = this.node.children[ items ];
				}
				
				if( typeof a == "number" ){
					ret = this.node.children[ a ] ? this.node.children[ a ] : false; 
				}
				
		return _g( ret );
		}

	slf.prev = function( ){
		return child_dom.call( this, "prev" );
	};
	slf.next = function( ){
		return child_dom.call( this, "next" );
	};
	slf.first = function( ){
		return child_dom.call( this,  0 );
	};
	slf.get = function( k ){
		return child_dom.call( this,  k );
	};
	
	slf.getParent = function( ){
		return !this.node.parentNode.gnode ? _g(this.node.parentNode) : this.node.parentNode.gnode;
	};
	
	slf.rmv = function(a){
		if( this.node[ nodeCall.set._rm ] )
			_rm( a, this.node );
	return slf;
	};
	slf.app = function(a){
		
		// isDom
		if( isDOM( a ) ){
			_ap( a, this.node );
		// osx_Dom
		}else if( isObj( a ) ){
			slf.appmod (a );
	// gnode
	}else if( a.node ) 
		slf.content( a.content( ), 1);;
			
	return slf;
	};
	// self erase DOM
	slf.del = function(/*void*/){
		var n;
			// detach event
			if( (n = this.node.parentNode) )
				_rmv( this.node , n );
	return void 0;
	};	
	slf.appmod = function(a){
		return osx_dom( this.node , isObj( a ) ? a : {} );
	};
	slf.clone = function( ){
		return slf.node.cloneNode( true );
	};
	//
	slf.child = function( selector, callback ){
		var tmp = /^(\w+)(((\.)(\w+))|((\#)(\w))|)/.exec( selector );
		return  solveChild.call( this , selector, callback );
	};
	
	slf.forGet = function( callb ){
		
		
	};
	
	slf.insertB = function(a,b){
		var n = solveChild.call( slf, a);
	
	return n ? ( this.node.insertBefore( n.node , b  ) ) : slf;
	};
	
	slf.map = function( selector, callback ){
		if( ( tag = /^(\w+)(\.\w+|\#\w)/.exec( selector ) ) ||
			( attrib = /^(.+?)\[(.+)\=\'(.+)\'\]((.|#|%)(.+)*|)$/.exec( selector ) ) ||
			( shc = shortcut( selector ) ) ){
				
				
				
			}
	return node;
	};
	slf.any = function( a, b ){
		var _shc,r,t,i = 0,shc = -1,tmp, attrib;
		
		// neg alert( /^(.+?)\!([a-zA-Z0-9_$.#]*)$/.exec( a ) );
		// multi
		if( ( _shc = /^(\w+)(((\.)(\w+))|((\#)(\w)))/.exec( a ) ) ||
			( ( r = /^([a-zA-Z]*)(\:(.+?)|)$/.exec(a)  ) ||
			( attrib = /^(.+?)\[(.+)\=\'(.+)\'\]((.|#|%)(.+)*|)$/.exec(a) ) || 
			( shc = shortcut( a ) ) ) ){
			
			
			if( r && r[3] && !isVoid( r[3] ) && shc == -1 )
				shc = shortcut( r[3] );;
			if( attrib ){
				
				r = [null,attrib[1]]
			
				if( !attrib[5] ){
					shc =  shortcut("$n");
					shc.name = undefined;
					shc.call = undefined;
				}else{
					shc =  shortcut(attrib[4]);
				}
				shc.value  = attrib[3];
				shc.attrib = attrib[2];
				
			}
			if( _shc ){
				shc = shortcut("$n");
				r = [null,_shc[1]];
				shc.name = _shc[5];
				shc.call = _shc[4] == "." ? "className" : "id";
			}
			if( shc && r ){
				// tagName
				//alert( slf.node.getElementsByTagName( r[1] ).length+" "+slf.node.children.length );
				try{
				while( i < this.node[ nodeCall.get.tag ]( r[1] ).length ){
					
					tmp = solveChild.call( slf, [ "$"+r[1] , i ] );
				//	tmp.node = tmp.node;
				
					if( shc.attrib &&( ( tmp.node[ shc.attrib ] == shc.value && !shc.call ) || ( tmp.node[ shc.attrib ] == shc.value && tmp.node[ shc.call ] == shc.name ) )  ){
						b.call( this , tmp, i );
					}else if( ( ( shc || tmp.node[ shc.call ] == shc.name  ) || shc == -1 ) && !shc.attrib && typeof b === "function" ){
						
						if( ( shc.call == "className" && tmp.isClass( shc.name  )  ) ||  shc.call != "className" )
							b.call( this , tmp, i );
					
					}else if( ( ( shc && tmp.node[ shc.call ] == shc.name ) || shc == -1 ) && typeof b !== "function" ){
						return tmp;
					}
				i++;
				}
				}catch(e){};
			
			// simply id and ClassName && tag
			}else if( shc && !r && typeof b === "function" ){
				solveChild.call( slf, [ a ] ,function( h ){
					
					// callback any
					b.call( this , h, i );
					i++;
				});
				
			}
		}
		
	return slf;
	};
	
});
/*property Class allows extend or reduce a node's class */
_exportFn._import("propertyClass",[],function( slf ){
	var node = slf.node;
		
	function _c(){
	var e;
		if( node.className && ( e = node.className.split(" ") ).length > 0 )
				return e;	
	return false;
	}
	/*output*/
	slf.Class = function( a,b ){
		var cl,tcl,i = 0,
			b = b ? b : 0;

		if( ( cl = _c( ) ) ){
			if( ( tcl = cl.indexOf( a ) ) > -1 && b ){
				// del	
				a = "";
				cl[ tcl ] = "";
				
				var z,ctmp =[];
				for( z in cl ){

					if( !isNaN( cl[z].charCodeAt(0) ) )
						ctmp[ ctmp.length ] = cl[z];;	
				}
				cl = ctmp;

				node.className = cl.join("#").trim( ).replace(/(##{2})/g,"").replace(/#/g," ");
			
			// add
			}else if(  !( ( tcl = cl.indexOf( a ) ) > -1 ) && !b && arguments.length !=0 )
				node.className += " "+a+" ";
			// get
			else if( arguments.length == 0 )
				return node.className;
			
			else;;

		//create className
		}else if( arguments.length === 1 )
			node.className += ""+a;;
		
	return slf;
	};
	slf.isClass = function( a ){
		var t;
	return ( t = _c(  ) ) ? ( t.indexOf( a ) > -1 )  ? true : false : false;  
	};	
	slf.rmClass = function( a ){
		return this.Class( a , 1 );
	};
	slf.Id = function( a, b ){
		
		if( a && b == undefined || b )
			slf.node.id = a;
		else if( !a && !b )
			slf.node.id = "";
	
	return slf;
	};
	
});

function sheet(){
	var ssheet = document.getElementsByTagName("style");
			
	function solve(a,b){
		var i = j = ii = 0,t = b || ssheet,tmp;
		
		try{
		// all stylesheet
		while( t[i]!= undefined ){
						
		// find id, class, tag
			tmp = t[i].sheet.cssRules;
			j 	= tmp.length;
			
			tmp = tmp;
			for(; ii< j ;ii++){
				if( tmp[ii].selectorText == a )
					return tmp[ii].style;;
			}	
		i++;
		}
		
		}catch(e){};
		
	return null;
	}	
		
return solve;
}

//var rr = sheet( )(".close:hover, .down:hover");
//alert( rr );

_exportFn._import("propertyCss",[],function( slf ){
	var node = this.node.style,
		parse = { _int:parseInt, _float:parseFloat};
	
	// get rule css
	slf.getRule = function(a,b){
		return node[a] ? ( b == "int" || b == "float" ? parse["_"+b]( node[a].replace(/(px|%|em)/g,"") ) : node[a] ):  false;
	};
	// get attrib
	slf.attrib = function(a,b){
		if( a && !b ){
			if( typeof a == "string" ){
				return this.node[ a ] ? this.node[ a ] : undefined;
			}
			
		}
		if( typeof a == "string" &&  typeof b == "string" ){
			this.node[ a ] = b;
			return slf;
		}
	return slf.made( a );;
	}
	// get dataset
	slf.data = function(a,b){
		if( typeof a === "object" && !b ){
			var val, value ="";
			try{
				for( val in a ){
					switch( typeof a[ val ] ){
						case "boolean":
							value = a[ val ] ?  "true" : "false";
						break;
						default:
							value = a[ val ];
					};
					this.data( val, value );
				}
			}catch(e){};
		}
		if( b != undefined	){
			slf.node.dataset[a] = b;
		}else
			return !isVoid( slf.node.dataset[a] ) ? slf.node.dataset[a] : !1;;
			
	return slf;
	}
	slf.dataInt = function( dataName ){
		return parseInt( slf.data( dataName ) );
	};
	
	// made attribute object
	slf.made = function( a ){
		return typeof a === "array" ||
			   typeof a === "object" ?  made( this.node , a ) 
			   : slf;
	};
	slf.css = function( ){
		var i = arguments.length;
		
		if( isObj( arguments[0] ) )
			this.made({ style:arguments[0] });
		else if( i === 1 )
			return node[ arguments[0] ];
		else if( i == 2 )
			node[ arguments[0] ] = arguments[1];;
	
	return slf;
	};
	
});
_exportFn._import("content",["[*]","![HTMLTextAreaElement]","![HTMLInputElement]"],function( ){
	var node = this.node;
	
	// content Contener
	this.content = function(/*void[, str , bool ]*/){
		var l = arguments.length,tmp,isAdd;
		
		if( !isDOM( this.node ) && !this.node )
			return false;
			
		if( l != 0 ){
		
		// Is Gnode v>1
		if( isObj( arguments[0] ) && arguments[0].node ){
			tmp = arguments[0].node.val( );
			isAdd = arguments[1];
		// Is format text 	
		}else if( isObj( arguments[1] ) ){
			tmp = str_format.apply( null, ( [].concat( arguments[0] ) ).concat( arguments[1] ) );
			isAdd	=	arguments[2];
		// simple text
		}else{
			tmp		= 	arguments[0];
			isAdd	=	arguments[1];
		}
		
		if( isAdd )
			node.innerHTML += tmp;
		else
			node.innerHTML  = tmp;;
		
		return this;
		}
		
	return node.innerHTML;		
	};
	
	this.outer = function( ){
		return this.node.outerHTML;
	};
	this.valText = function( text, add ){
		return node.textContent && !text ? node.textContent : 
			   node.textContent && text  ? add ? (  node.textContent += text ) :
			   ( node.textContent = text ) :
			   this.content( );
	};
	
	function val( val, bool  ){
		if( typeof val === "object" )
			val = val.val( );;
		node.value = bool ? node.value+val : val; 
	return self;
	}
	/*Value*/
	this.val = function( ){
	return node.value == undefined ? 
			this.content
				.apply( this, arguments ) :
			( arguments.length > 0 ? val( arguments[0], arguments[1] ) : node.value );
	};
	
	this.valInt = function( ){
		return parseInt( this.val( ) );
	};
	
return this;
});

_exportFn._import("size",[],function( slf ){
	var prs = /([0-9]*)(px|%|em|)/,
		node = this.node;
		
	function _g( a,b ){
		var w = -1;
			
			if( !b ){
				if( (w = ( slf.getRule(a) || node["offset"+a.upper(0) ] || -1 ) ) )
					w = parseInt( prs.exec( w )[1] );;
			return w === "NaN" ? 0 : w;
			}else
				return slf.css( a,b );;			
	return w;
	}
	
	
	if( ( this.node.nodeName != "IMG" ) && ( this.node.nodeName != "IFRAME" ) ){
	
	/*node.forEach(["width","height","top","left"],function( k, val ){
		
		slf[ val ] = function( ){
			return _g.apply( null, [val].concat( arguments[0] || null ) )
		};
			
	});*/
	
	slf.Width = function( ){		
		return _g.apply( null ,["width"].concat( arguments[0] || null ) );
	};
	slf.Height = function( ){		
		return _g.apply( null ,["height"].concat( arguments[0] || null ) );
	};
	slf.top = function( ){		
		return _g.apply( null ,["top"].concat( arguments[0] || null ) );
	};
	slf.left = function( ){		
		return _g.apply( null ,["left"].concat( arguments[0] || null ) );
	};
	slf.offset = function( a ){
		if( a ){
			return node["offset"+a.upper( 0 ) ] ? node["offset"+a.upper( 0 ) ] : null; 
		}else{
			return {
				width: node.offsetWidth,
				height: node.offsetHeight,
			};
		}
	};	
		slf.offPos = function(){
			
		};
		
	}	
});
// Display mode
_exportFn._import("display",[],function ( slf ){
		// by default every display element is show 
	var show = true,node = slf.node,
		_disp = {
			show:"block",
			none:"none",
		},_clss = {};
	
	// proc
	// @return bool show
	function solve( ){
		return ( ( node.dataset.show === "false" && ( !node.style.display || node.style.display === "none" ) ) || node.style.display === "none" ? false : true );
	}
	
	// Solve Display mode
	// dataset.show is inc css display mode
	// or else check if the value attibute display  is true.
	_disp.hide = node.dataset.show === "false" ? "" : "none",
	_disp.show = node.dataset.show === "false" ? "block" : "";;
		
	// check if style display exist with a 
	// other attribute block that _disp.show
	// or void and fix flag
	_disp.show = node.style.display && ( node.style.display != "none" && node.style.display != "block") && node.style.display != _disp.show ? node.style.display : _disp.show; 
	show = solve( );
 	
	// Apply
	function _s(a,d){
		var s,b = d ? "show" : "hide";
		
		if( solve( ) != show )
			show = solve( );;

		// no-repeat
		if( ( d && show ) || ( !d && !show ) )
			return slf;;
	
		// add or remove class
		if( ( s = ( _clss["hide"] || _clss["show"] ) ) ){
			
			var	p = !d && s ? [] : [1];
			slf.Class.apply( slf, [ s ].concat( p ) );
		
		// basic mode
		}else{
			a = a && ( ( b && _disp.show != a ) || ( !b && _disp.hide != a ) ) ? a : b === "show" ? _disp.show : _disp.hide;
			slf.made( { style:{ display: a  } } );
		}
		// flag dataset
		show = node.dataset.show = d;
		
	return slf;
	}
	
	slf.show = function( a ){
		return (!show ? _s(a,true) : slf );
	};
	slf.hide = function( a ){
		return ( show ? _s(a,false) : slf );
	};
	slf.token = function( a ){
		return show && (  node.dataset.show || node.dataset.show == "true" ) ? this.hide( a ) : this.show( a );
	};

	slf.setDisOption = function( a ){
		var r,t;
		
		if( ( r = /([\g+\w+\d+ -_]*|)[|]{1}([\g+\w+\d+ -_]*|)/.exec( a ) )  ){
		//1 - 2
			t = isVoid( r[1] ) ? "hide" : "show";
			
			_clss[t] = r[2];
			if( slf.isClass( r[2] ) ) 
				show = node.dataset.show = false;;
		}
		// display mode
		if( ( r = /^([\g+\w+\d+ -_]*)(\:)([\g+\w+\d+ -_]*)$/.exec( a ) )  ){
			if( r[1] ) 
				_disp.show = r[1];
			if( r[2] ) 
				_disp.hide = r[2];
		}	
		
	return this;
	};
	
});	

var _gradient = {
	_default_ir_:255,
	hxtrgb:function(a){ var a = a.replace(/#/,""), i = 0,t="",r=[]; while( a[i] != undefined ){ if( i%2 == 0 && t.length == 2){ r.push( parseInt( t, 16) ); t = ""; }  t += ""+a[i]; i++; } r.push( parseInt( t, 16) ); return r; },
	rgbthx:function(a){ var t = convert( ).dechex( ( a[0] << 16 ) | ( a[1] << 8 ) | a[2] ),i = 0,c; if( t.length < 6 ){ c = ""; i = (6-(t.length%6) );while( i>0 ){ c+="0"; --i; } } return "#"+( c ? c : "" )+t; },
		
	crgb:function(a){ return (a[0] >= 0 || a[0] <= 255) && (a[1] >= 0 || a[1] <= 255) && (a[2] >=0 || a[2] <= 255) ? true : false; },
	clcRat:function(a,b,c,d,e,f,g){ return{ r:(a-d)/g, g:(b-e)/g, b:(c-f)/g}; },
	getRGB:function(a){ var b; if( isObj( a ) && this.crgb(a) ) return a; else if(typeof a === "string" && this.crgb( ( b = this.hxtrgb( a ) ) ) ) return b; else false;; },
	floor:function(a){ return Math.floor(a); }
};
var convertGrad = new (function(){
	this.hexToRgb = _gradient.hxtrgb;
	this.rgbToHex = _gradient.rgbthx;
})( );	
_exportFn._import("gradiant",[],function( slf ){
	var irr,node = this.node,k = 0,
		w = _gradient;
	
	irr = w._default_ir_;
	
	slf.convertGrad = convertGrad;
	slf.grad = function(a,b,c,d,e){
		var cs = [0,0,0],ce = [0,0,0],clr,tm, pk = ( k++ ),
			irr = ir = d ? d : w._default_ir_;

		/*if( tm )
			clearTimeout( tm );;*/
			
		/*repport error*/
		if( !( cs = w.getRGB(b) ) || !(ce = w.getRGB(a) ) )
			return slf;
		
		clr = w.clcRat(ce[0],ce[1],ce[2],cs[0],cs[1],cs[2],irr);
		
		if(typeof e === "function" && c == null ){
			var i = 0;
			
			try{
				while( ir > 0 ){
					e.call( slf, w.floor( ce[0] -= clr.r ), w.floor( ce[1] -= clr.g ), w.floor( ce[2] -= clr.b ) );
				--ir;				
				}
			}catch(er){};
		}else{
			function _l(){
				
				// callback & and
				if( pk+1 != k )
					return;
				else if( ir == 0 && typeof e == "function" ){
					e.call( slf );
					return;
				}
				
				ce[0] -= clr.r,ce[1] -= clr.g,ce[2] -= clr.b;
				
				slf.css("backgroundColor","rgb("+ w.floor( ce[0] )+","+ w.floor( ce[1] )+","+ w.floor( ce[2] )+")");
			--ir;
			
			//ir != 0 && pk+1 == k ?  ( tm = setTimeout( _l, c ? c : 5 ) ) : 0;
			}		
			
			try{
				var itr = 0, sp = irr;
				while( itr < sp+1 ){
						
					setTimeout( _l,  ( itr/4)*( c ? c : 10 )  );
					
				itr++;
				}
			}catch(e){};
			
		}
		
	return slf;
	};

});
_exportFn._import("events",[],function( slf ){
	var nd = this.node,
		t = "dblclick,click,mousemove,mouseout,mousedown,mouseup,mouseover,keypress,keydown,keyup,"+
			"blur,focus,resize,submit,load,unload,drag,dragstart,dragover,dragleave,drop,scroll,change,"+
			"contextmenu".split(","),
		c = {},on = nd.addEventListener ? "" : "on";
		
	function keyHook( ){
		var interrupt = arguments[0].split(","),
			callback = arguments[1], i = len = 0;
			
			len = interrupt.length;
			for(; i < len; i++ ){
				if( interrupt[ i ].length > 0 ){
					interrupt[ i ] = parseInt( interrupt[ i ] );
				}
			}	
	return function( event ){
			if( interrupt.indexOf( ( event.keyCode ? event.keyCode : event.charCode ) ) > -1 ){
				callback.call( this, event, ( event.keyCode ? event.keyCode : event.charCode ), event.target.value );
			}
		};
	}
	
	/*AttachEvent*/
	slf.on = function(a,f,n){
		var tmp, ctmp;
		
		if( !c[n] )
			c[n] = f;;
		
		// keypress or down
		if( tmp = /^(key(up|down|press))\[(.+)\]$/.exec( a ) ){
			a = tmp[1];
			ctmp = ( keyHook )( tmp[3], f );
		}else{
			ctmp = f;
		}
		
		if(t.indexOf(a) != -1&&nd.addEventListener)
			nd.addEventListener(a,ctmp,true);
			
		else if(t.indexOf(a) != -1&&nd.attachEvent)
			nd.attachEvent(on+""+a,ctmp,true);;
					
	return slf;
	};
	/*DetachEvent*/
	slf.unon = function(a,n){
		if( c[n] ){
			this.node.removeEventListener(a,c[n],true);
			delete c[n];
		}
	return slf;
	};	
});
_exportFn._import("fade",[],function( slf ){
	var s_fade= function(a,b){
		return { start:a,end:b,speed:1500,endblock:true }; },
		isOkFor = 0,token  = 0,
			
		clb = true;
			
	function _pf(a,b,c){ c === isOkFor-1 ? slf.css("opacity",a) : 0;  return 1; }
	function _b(a,b,c){ return c ? (a<=b) : (a>=b);  }
	function _d(a,r){ if(a<0||a>1) return r; return a; }
	function _c(r,a,b,t){ 
		var s = s_fade(a,b),auto;
				
		merge( s , r ,  true );
				
		s.start = _d( s.start , token ? 0 : 1 );
		s.end   = _d( s.end , token ? 1 : 0 );
		
		// auto detect
		if( s.start === "*" )
			s.start = ( ( auto = slf.getRule("opacity") ) ?  auto*1 : token ? 0 : 1 );;
		
		var tmp;
		if(t){
				
			if( s.start > s.end )
				tmp = s.start , s.start = s.end , s.end = tmp;
		}else
			if( s.start < s.end )
				tmp = s.start , s.start = s.end , s.end = tmp;;;
				
		clb = s.endblock;			
	return s; 
	}
	/*proc*/
	function _fio( a , fb ){
		var s = a.start, 
			e = a.end,
			t,time = 0;
				 
		 if( !fb )
			t = -((s/a.speed));
		else
			t = (e/a.speed);
		
		try{
			
			if( (!clb && fb) || slf.data("show") === "false" )
				slf.show( );;
				
			if( s == e )
				return false;;
	
			while( _b( s , e , fb ) ){
								
				setTimeout((function(a,b,c){
						
					return function(){ _pf(a,b,c) };
						
				})( s , ( t > 0 ? t : -t ) , a.flag ) , time*a.speed );
						
			time += ( t > 0 ? t : -t ); 	
			s += t;
			}
			
			//alert( ( !clb && !fb ) || !fb);
			if( ( !clb && !fb ) )
				setTimeout(function(){
						
					return isOkFor-1 == a.flag ? slf.hide( ) : 0;
							
				},time*a.speed+500);;
						
					
		}catch(e){ };
			
	return void 0;
	}
		
	/*object Ouput*/
	slf.fin = function(a){
		var argv,
			c = isOkFor++,t;
				
		token = true;
		
		argv = _c( a||{} , 0,1 , token );
		argv.flag = c;	
				
		_fio( argv ,token);
				
		token = !token;
			
	return slf;
	};
	slf.fout = function(a){
		var argv,
			c = isOkFor++;
				
		token = false;
				
		argv = _c( a||{} , 1,0 , token );
		argv.flag = c;
		_fio( argv ,token);
				
		token = !token;
				
	return slf;
	};
	slf.ftoken = function(a){
		var c = isOkFor++,b;
		
		/*Solve*/
		if( !token && a.iend )
			a.start = a.oend,a.end = a.iend;
			
		else if( token && a.oend )
			a.start = a.iend,a.end = a.oend;;
			
		delete iend;
		delete oiend;
		
		b = !token ? _c(a||{},1,0 , false ) : _c(a||{},0,1 , true);
		b.flag = c;
	
		_fio( b , token );
		token = !token;
				
	return slf;	
	};
	
});


var _damine = {
	
	speed:["low","hight"],
	
	hide:[{ width:"*:0", height:"*:0", opacity:"*:0", speed:"*" },function( a ){
			a ? this.hide() : 0;
		}],
	show:[function( a ){
			a ? this.show() : 0;
		},{ width:"0:*", height:"0:*", speed:"*" }],
};
_exportFn._import("_danime",[],function( slf ){
	var hinst  = "",tok = 0,
		/*slide*/
		wait = false,stack = [];
	
	function solve(a){if( ["width","height","top","left"].indexOf(a) > -1 ) return slf[ a == "height" || a == "width" ? a.upper( 0 ) : a ]( ); else return slf.getRule(a);  };
	function s_rule(a,b,c,d){ return{ mode:a, start:b, end:c, ratio:d, size:"" };}
	function _clc( a ){
		var i,out = { style:{} };
		
		try{
			for( i in a ){	
				a[i].start += a[i].ratio;
				out.style[i] = ( a[i].start  > 0 ? a[i].start : 0)+( a[i].size ? a[i].size : "" );
				
			}
		}catch(a){};
	
	return out;
	}
	function _p(a,b){
		var out = { speed:500, token:b||a.token , rule:{} },
			i,j,r,tmp,imax = max = 0,f = false;
		
		/*speed*/
		out.speed = a.speed || out.speed;
		delete a.speed;
		delete a.token;
		
		try{
			/*options >1*/
			delete a.rtime;
			
			// parse rules css
			for( i in a ){
				/*options >1*/
				if( i == "mod" );
				/*rules*/
				else{
					
					if( !out.rule[i] ){
						
						/*>1*/
						tmp = s_rule(0,0,0,0);
						if( (r = /^([0-9.*]*)\:([0-9.+-]*)((px|%|em|)|)$/.exec( a[i] ) ) ){
						
							tmp.start = isVoid( r[1] ) ? 0 : r[1] === "*" ? solve( i ) : parseFloat( r[1] );
							tmp.end   = isVoid( r[2] ) ? 0 : (/\-([0-9 .]*)/.test(r[2])) ? tmp.start-parseFloat(/\-([0-9 .]*)/.exec(r[2])[1]) : parseFloat( r[2] );
						
						}else if( ( r = /([0-9 .\-\+]*)((px|%|em|)|)$/.exec( a[i] ) ) ){
							
							//console.log( r[3] +" //////// " + solve( i )+" widow scree "+ window.screen );
							//console.log( r[3] === "%" && i == "width" ? ( parseFloat( solve( i ) ) / window.screen.availWidth ) *100 : 23  )
							
							// add 27/04
							if( solve( i ) !== false ){
								
								tmp.start =  r[3] === "%" && i == "width" || i == "height" ? ( parseFloat( solve( i ) ) / window.screen[ 'avail'+i.upper(0) ] ) *100 : parseFloat( solve( i ) );
								tmp.end   = r[1];
								//console.log( tmp.end  - tmp.start )
								
							}else{
							
							// solve start
							// if s50 - e100 = -50 around at 0
								tmp.start =  parseFloat( solve( i ) );
								tmp.end   = ( tmp.end   =  tmp.start + parseFloat( r[1] ) ) > 0 ? tmp.end : 0;			
								//console.log(  tmp.start+" ----- "+ tmp.end );
							}
						}
						if( r ){
							/*more or less*/
							tmp.mode  = tmp.start - tmp.end > 0 ? false : true;
							imax =  abs( ( tmp.ratio = ( tmp.mode ? abs( tmp.start - tmp.end ) : neg( tmp.start - tmp.end ) ) /out.speed )*out.speed );
							
							/*max*/
							if( imax > max )
								max = out.max = i;;

							/*size*/
							if( r[3] )
								tmp.size = isVoid( r[3] ) ? r[4] : r[3];
	
						out.rule[i] = tmp;
						}
						/*export*/
					}	
				}
			}
		}catch(a){};
	
	return out;
	}
	
	// here we'll manage 
	// stack and callback
	// @return void 0
	function _cs(a){
		var t;
		if( stack.length > 0 ){
			if( isObj( ( t = stack.shift( ) ) ) )
				_a( _p( t , a ) );
			/*fct callback*/
			else{
				t.call(slf, null );
			return _cs( );
			}
		}else
			wait = wait ? !wait : wait;;
			
	return void 0;
	}
	// play anime
	// @return self
	function _a( a ){
		var i = 0,j = a.speed;

		while( i<j ){
			setTimeout((function( itr , s , module, token ){
		
				return function(){
					if( token == tok ){
						
						slf.made(  module );
					/*check stack*/
					itr+1 == s ?  _cs( ) : 0;
					}
				};
				
			})( i ,a.speed ,_clc( a.rule ) , a.token  ),(i*j*0.5 ));		
		
		i++;
		}
		delete a;
		
	return slf;
	}
	//
	
	slf.animeClear = function( ){
		tok == 0 ?  0 : (tok++,(stack = []));
	return tok;
	};
	slf.anime = function(/*_[ _, _]*/){
		var argv = [],t,
			i,j = arguments;
			
		t = this.animeClear()+1;
		tok++;
		try{
			// push in stack 
			for( i in j ){
				
				if(typeof j[i] === "function" )
					argv.push( j[i] );
				
				else if( isObj( j[i] ) ){
					j[i].token = t;
					argv.push( j[i] );
				}
			}
			stack = argv;
		}catch(e){};
		_cs( t );
		
	return slf;
	};
	
	var h = 0,wd = 0;
	slf.slider = function(a,b,c){
		var t = "down.up.left.right.token".split("."),
			w = wait,
			i,out={};
		
		if( i>0 || ( i = t.indexOf(a) ) > -1 ){
		
			if(  i == 0 )
				out = { height:( h || ( h = this.height( ) ) )+":px", speed:(b||50) };
			else if( i == 1 )
				out = { height:":"+(h||this.height( ))+"px", speed:(b||50) };
			else if(  i == 2 )
				out = { width:( wd = this.width( ) )+":", speed:(b||50) };
			else if( i == 3 )
				out = { width:"0:100", speed:(b||50) };;
			
			if( w ){
				out.token = tok,stack.push( out );
			}else
				this.anime( out );
				
		}
		
		/*Callback*/
		if( c ){
			stack.push( c );
		}
		
		wait = w = true;
		
	return slf;
	};
	
	slf.Q = function( a, b ){
		
		a.token = tok;
		stack.push( a );
	
	
	};
	
});


_exportFn._import("FormQuery",[""],function( slf ){
	
	slf.queryForm = function( ){
	
	
	};

return self;
});

	// github AzqfdS6e7Z5se
	/*export to output*/
	_w_.gnode = _g;
	_w_._ce = _w_.newDOM = _ce;
	
	// remove
	_w_.osx_dom = osx_dom;
	
})( self );