(function( self ){
	var exportable 		 = {},
		notexportable    = {},
		 i = 0;
	
	function throwError( e ){
		console.log( 
		str_format.apply( this, e ) //**********************
		);
	}
	
	function __get( a, b ){
		var tmp, dep, i = 0, 
			__exportable,
			argv = [];
	
		if( ( tmp = exportable[ a ] ) ){
			if( tmp.mount && typeof tmp.mount === "function" ){
				
				try{
					while( ( dep = tmp.dependency[ i ] )  ){
						
						argv.push(
							dep == "export" ? (__exportable = {})  :
							__get.call( 
								null,
								dep,
								tmp
							)
						);
						i++;
					}				
				}catch(e){
					throwError(
						["Denepence %c don't existing. parent mdoule : %c",
						dep,
						btoa( tmp.module )
						]
					);
				}
				tmp.returned = ( tmp.returned = tmp.mount.apply( 
					 tmp._w_,	// _w_
					 argv
					) ) === undefined || tmp.returned === null ? __exportable : tmp.returned;
				delete tmp.mount;
				
			}else if( tmp.mount ){
				tmp.returned = tmp.mount;
				delete tmp.mount;
			}else;
			
		return tmp.returned;
		}else{
		throwError(
			["Warning module :: %c :: wanted did not defined from %c",
			a,
			b ? b.guid : "unknow"
			]
			);
		}
	return null;
	}
	/* import new*/
	function __add( a, b, c, d  ){
		var ptr;
		
		if( !exportable[ a ] ){
			
			/*import module*/
			exportable[ a ] = ({
			
				module 	   : "__module__" + btoa( a ),
				mount  	   : c,
				dependency : b,
				// proc id
				guid	   : btoa( "__module["+i+"]__" + btoa( a ) ),
				_w_		   : {},
				
			});
			
			i++;
		}else{
	console.log( exportable );
			throwError(
			["Warning %c created is a duplicate module. enum dependency : [ %c ]",
			"__module__ [ " +  a +" ]/"+ i,
			b.join(", ")
			]
			);
		}
	return !0;
	}
	
	function inmodule( a, b ){ exportable[ a ] = { module: "__module__"+ btoa( a ), returned: b, access: 3 }; }
	
	// import
	function __import( a,b,c,d ){
		return __add( a, ["def","req","export"].concat( b ), c, d );
	}
	function __req( a ){
	return  __get( a );
	}
	
	inmodule("def", __req );
	inmodule("req", __import );
	
	/**/
	self.define = self._export = __import;
	self.req    = self._import = __req;
	
})( self === window ? self : window );
/*
	 jsWindow :
	 
		limitX : bool 
		limitY : bool 
		
		window : str name int show int x int y int w int h [, swind Object ] @return newWindowObject
		
		process : void @return process Object
	
	object can be returned
	
	swind
		parent: int
		free        : bool
		detachClose : callback
		focus       : callback
		hide        : bool btnhide
		close       : bool btnclose
	  
	 process
		first : void 		@return bool 
		next  : void Object @return snapProcess Object
		free  : void 		@return void
	
	snapProcess
		name: str,
		pid: int,
		token: int,
		child: bool,
		handle: gnode Object
		
	 newWindowObject :
		private
		...
		public
	 event:
		handle : gnode Object
		hMain  : gnode Object
		token  : DWORD token
		
		method
			close : void  @return bool
			focus : void  @return bool
			getParent : void @return newWindowObject event
			hasChild  : void @return bool
			sizeChid  : void @return uint size
			getChild  : int child   @return newWindowObject event
			moveTo    : int x int y @return void 
			title     : str title [,int align ] @return void
			opacity   : int perc [, bool noanimate ] @return void
			show      : void [, bool show ] @return bool
			
*/

( function( jo2 ){
	
	/*inlocal*/
	var jswindow = function(  n, s, x, y, w, h, z ){
		return new jswindow.window( 
			 n, s, x, y, w, h, z
		);
	}, free;

/**/
jswindow.merge = merge;
jswindow.convoke = function( handler, callback, argv ){ 
	var len  = arguments.length;
		
return ( len <= 2 && typeof handler == 'function' ? handler : callback ).apply(
		( len <= 2 ? this : handler ),
		( len <= 2 && !argv ? ( callback || [] ) : ( argv || [] ) )
		);
};
/**/

/*
// lib private func 
// no-export
*/
jswindow.merge({
	
	wtoken: 0x3E8,
	otoken: 0x3E8,
	wfocus: null,
	
	oncreate:null,
	onclose :null,
	
	/* base58 */
	uidB58:function( uid ){
	return jno2.base.ibase( uid ,58,function(a,b){
		return a += ("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLNMOPQRSTUVWXYZ0123456789")[b];
		});
	},
	/* freedom memory a object */
	free:( free = function( obj, key ){
		var tmp;
		try{
		if( !key ){
			for( tmp in obj ){
				delete obj[ tmp ];
			}
		return void 0;
		}else{
			obj[ key ] ? ( delete obj[key] ) : 0; 
		}
		}catch(e){};
	return obj;
	}),
	/*
	// return @newDescriptorHeader
	*/
	descriptorHeader:function( x,y,w,h,z,p,u,c, b ){
		return {
			style:{
				top:	y+"px", 
				left:	x+"px", 
				width:	w+"px", 
				height:	h+"px",
				zIndex:	z 
			}, 
			dataset:{ 
				pid:p,
				uid:u,
				show:"true",
				busy:( b ||false ),
			},
			className: c
		};
	},
	/* token _w_ */
	newToken:function( ){
		this.wtoken == 0 ? ( this.wtoken = 0x3E8, this.wtoken-- ) : 0;
		this.otoken == 0 ? ( this.otoken = 0x3E8 ) : 0;
	return ( ( this.wtoken-- << 20 ) |
			 ( this.otoken << 8 )    |
			 Math.floor( Math.random( )*0x0ff )
			);
	},
	
	/* getPid( jswindow.newToken( ) ) */
	getPid:function( token ){
		var a = ( token&0xfff00000 ) >> 0x14,
			b =( token&0x000fff00 ) >> 0x08,
			r = b > a ? 0x01 : 0xff;
	return ( ( r == 1 ? b-a : a-b ) << 16 | ( token&0xff << 8 ) | r )
	},
	/**/
	
	getWindow:function( token ){
		return this._window[ this.getPid( token ) ] ?
			   this._window[ this.getPid( token ) ] :
			   null;
	},
	
});

jswindow.merge({
	
	disable:function( bool ){
		this.css("pointerEvents", bool ? "none" : "" );
	return bool;
	},
	busy:function( bool, cursor ){
		
		jswindow.disable.call( this.events.hMain, bool );
		if( cursor ){
			this.events
				.handle
				.css("cursor", bool ? "wait" : "" );
		}
	return ( this.busy = bool );
	},
	
	canShow:function( ){
		var tmp, _w_;
		return this.hasChild( ) && ( tmp = jswindow.getWindow( this.token ) ) ? 
			!tmp.enumChild( function( child ){
				
				if( ( _w_ = jswindow.getWindow( child.token ) ) && !_w_.free ){
					
					child.focus( );
					child.show( !0 );
					/* --> jswindow.wizz(  ); */
					_w_ = null;
					
				return false;
				}
				
			return !0;			
			} ) : !1;
	},
	
	
	/* gestion event window */
	rawMove:function( x, y ){
		x != undefined  ?
			this.css( "left", x+"px" ) : 0;
		y != undefined ? 
			this.css( "top", y+"px" ) : 0;
	return ( x || y );
	},
	/*
	// resize add 23/04/2016
	// v3.0
	*/
	resize:function( x, y  ){
		x != undefined && ( ! resize.enabled || ( resize.enabled && !resize.status ) )  ?
			this.css( "width", x+"px" ) : 0;
		y != undefined && ( ! resize.enabled || ( resize.enabled && !resize.status ) )  ? 
			this.css( "height", y+"px" ) : 0;
	return ( x || y );
	},
	
	/* this == newWindowObject */
	move:function( event ){
		var self = this;
		
		/* destroy window */
		if( this === window ){
			return 0xBAD0FF01;
		}
		if( ( this.resize.enabled && this.resize.status ) || this.locked ){
			return 0xBAD00004;
		}
		

		/* haschild **/
		if( this.events.hasChild( ) ){
			
			if( this.enumChild( function( child ){
				var tmp;
				if( ( tmp = jswindow.getWindow( child.token ) ) && !tmp.free ){		
				return false;
				}
				
			return true;
			}) ){
				event.preventDefault( );
				/*
				// not possible to move
				// window because a children 
				// is opening
				*/
				return 0xBAD00001;
			}
		}
		if( this.busy ){
		//	return 0xBAD00003;
		}
		
		/* not focus */
		if( this.focus != 0x3E8 ){
			jswindow.focus.call( this, 0x00 /*system focus*/ );
		}
		
		/* effect */
		if( !this.events.hMain.isClass("op0") ){
			this.events.hMain.Class("op0");
		}
		console.log( event );
		var offsetX = event.clientX - this.target.offset("left"),
			offsetY = event.clientY - this.target.offset("top");
			
		event.preventDefault( );
		var self = this;
		/* must addlistenMistener */
		window.onmouseout = window.onmousemove = function( mouse ){
			
			if( self.minwin ){
				
				self.minwin.css({
					left: ( ( ( ( mouse.clientX - offsetX ) / window.screen.width )*100) * 300) /100,
					top: ( ( ( ( mouse.clientY - offsetY ) / window.screen.height )*100) * 200) /100,
				})
			}
			
			/* move window */
			jswindow.rawMove.call( self.target, 
				( mouse.clientX - offsetX <= jswindow.exports.limitX && jswindow.exports.limitX != null  ) ? null : mouse.clientX - offsetX, 
				( mouse.clientY - offsetY <= jswindow.exports.limitY && jswindow.exports.limitY != null  ) ? null : mouse.clientY - offsetY  
			);	
			mouse.preventDefault( );
		};
		/* must addlistenMistener */
		window.onblur = window.onmouseup = function( mouse ){
			
			this.onblur = this.onmouseup = this.onmousemove =  this.onmouseout = "";
			self.events.hMain.rmClass("op0");
			mouse.preventDefault( );
		};	
		/* END MOVE */
		
	return true;
	},
	focus:function( calling ){
		var base = 0x3E8,
			nf,tmp;
		
		/* bad call */
		if( !( this instanceof jswindow.newWindowObject ) ){
			return 0xBAD0FF01;
		}
		
		if( this.focus == base ){
			return;
		}
		
		/* add 12/4/2016
		// Allow the child to do the focus on his parent
		*/
		if( this.events.getParent( ) ){
			
			jswindow.focus.call( 
				/*
				//	@handle parent
				*/
				jswindow.getWindow( this.events.getParent( ).token ),
				/*
				// pass in parameters the window token,
				//when a window has a parent the function going
				//give focus it, but like the parent has for child
				//the window which made the call of this one, the
				//function gonna fall in recursive boucle when she  
				//will to appeal to focus for these children
				*/
				this.token 
			);

		}
		/**/
				
		/* give new window index */
		try{
			for( tmp in jswindow._window ){
				if( tmp != jswindow.getPid( this.token ) && jswindow._window[ tmp ].focus > this.focus  ){
	
					jswindow._window[ tmp ].target.css(
						"zIndex",
						jswindow._window[ tmp ].focus = ( nf = ( base - ( ( base - jswindow._window[ tmp ].focus )+1 ) ) )
						);
						
					if( jswindow._window[ tmp ].minwin ){
						jswindow._window[ tmp ].minwin.css({ zIndex: nf, border: '1px dotted #c0c0c0', background: "" });
					}
				}
			}
		}catch(e){};
		
		/**/
		this.target.css("zIndex", ( this.focus = base ) );
		jswindow.exports.focus = this.events.pid;
		
		
		if( this.minwin ){
			this.minwin.css({ zIndex: base, border: '1px solid #000', background: "#f0f0f0" });
		}
		
		if( jswindow.exports.setKBTarget )
		jswindow.exports.setKBTarget( this.events );;
		
		/* other */
		if( this.children.length > 0 ){
			var tmp;
			this.enumChild( function( child ){ 
				
				/*
				// variable (calling) allows to avert of fall in recursive boucle
				//  _w_ token = 1
				//													 			 ---\/----------------------------------
				// 		_w_ token = 2 parent 1						 hasparent	 |	... child -> 3 focus --> hasParent |
				//			_w_ token = 3 parent 2 --> clickFcous -> hasParent --|-------------------------------------/
				*/
				if( ( tmp = jswindow.getWindow( child.token ) ) && !child.free || ( calling && calling != child.token ) ){
					
					child.show( true );
					child.focus( );
					
				}
			return 1;
			});
			
		}else{
			
			//
			if( this.events.onfocus && typeof this.events.onfocus == "function"){
				/**/
				this.events.onfocus.call( 
					this.events
				);
			}
				
			/*
			
			*/
		}
		
					
	return true;
	},
	close:function( ){
		var token = this.token,
			tmp;
		
		/* bad call */
		if( !( this instanceof jswindow.newWindowObject ) ){
			return 0xBAD0FF01;
		}
		
		/* is child openning */
		if( this.events.hasChild( ) ){
			this.enumChild( function( child ){
				
				child.show( true );
				child.focus( );
			
			return true;
			});
			
		return 0xBAD00001;
		}
		/**/
		
		if( ( tmp = this.events.getParent( ) ) && ( tmp = jswindow._window[ jswindow.getPid( tmp.token ) ] )  ){
			
			if( this.parentTmp ){
				delete tmp.events
						  .childTmp[ this.parentTmp ];
			}
			if( !this.free ){
				
				/* cursor */
				tmp.target.rmClass("curun");
				/* busy  */
				if( tmp.busy ){
					jswindow.busy.call( tmp, false )
				}
			}
			/* pop-children to parent */
			tmp.enumChild( function( child, i ){
				if( child.token == token ){
					this.children = this.children.splice( 0, i ).concat( this.children.splice( i+1, this.children.length ) );
				return false;
				}
			return true;
			});
		}
		/*RemoveWindow*/
		this.target
			.css({ border:"0px solid transparent" })

			/*2018*/
			.Class("eff_close").del( );
			/*.anime({ opacity:"0.5:",
					top:"-100px",left:"-100px",
					borderRadius:":180px", MozBorderRadius:":180px",
					borderWidth:":100px", speed:50 },
					function( ){
						/*remove DomElement
						this.del( );				
					}
			) */;
		
		/*
		// add 
		// 13/04/2016
		*/
		for( tmp in jswindow._window ){
			if( jswindow._window[ tmp ].focus == 999 ){
				jswindow._window[ tmp ].events.focus( );
				break;
			}
		}
		/**/
		
		/**/
		if( jswindow.onclose && jswindow.getWindow( jswindow.onclose ) ){
			jswindow.getWindow( jswindow.onclose )
					.fork.call( 
						jswindow.getWindow( jswindow.onclose ).events,
						this.token, this.events.pid
					);
		}
		/**/
		
		if( this.minwin ){
			this.minwin.del( );
		}
		
		/* freedom memory */
		jswindow.free( jswindow._window, jswindow.getPid( this.token ) );
		jswindow.free( this );
		
	return true;
	},
	
	/*
	// to sOptsWind.resize = true 
	// when _w_.resize.enabled -> true
	// event 
	*/
	mize:function( bool ){
		var resize = this.resize,
			screen = jswindow.exports.fullscreen,
			t,l,w,h;
		/*
		// resize is enabled 
		// for the window
		*/
		if( resize.enabled ){
			
			/*
			// return old pos
			*/
			if( resize.status || ( resize.status && !bool ) ){
				
				t = resize.top;
				l = resize.left;
				w = resize.width;
				h = resize.height;
				
				resize.top = resize.left = resize.width =  resize.height = null;
				
			}else if( !resize.status || ( bool && !resize.status ) ){
				
				jswindow.merge( resize, {
					top: this.target.top( ),
					left: this.target.left( ),
					width: this.target.Width( ),
					height: this.target.Height( ),
				});
				
				t = screen.top;
				l = screen.left;
				w = screen.width;
				h = screen.height;
			
			}else{
				t = this.target.top( );
				l = this.target.left( );
				w = this.target.Width( );
				h = this.target.Height( );
			}
			/*
			// appy pos
			*/
			this.target.css({
				top : t+"px",
				left: l+"px",
				width : w,
				height: h,
			});
			t=l=w=h= null;
			
		return ( resize.status = !resize.status );
		}
	return -1;
	},
	
	
});

/*
// output to window
// @access window
*/
jswindow.merge( (jswindow.exports ={ }), {
	
	
	/* all version */
	limitX: null,
	limitY: 0,
	
	/*
	// v3.0
	*/
	fullscreen:{
		
		top:30,
		left:0,
		
		width:"100%",
		height:"100%",
	},
	
	/* contructor outsider */
	window:function(  n, s, x, y, w, h, z ){
		return new jswindow.window( 
			 n, s, x, y, w, h, z 
		);
	},
	
	/* get Snap process */
	process:function( ){
		var tmp, i = 0,
			pid = [], 
			snap =( new Date( ) ).getTime( );
			
		/*snap*/
		try{
			for( tmp in jswindow._window ){
				pid.push( tmp );
			}
		}catch(e){}
		
	return{
			first:function( ){
				return !( i > pid.length );
			},
			next:function( _w_ ){
				_w_ = _w_||{}; 	
				if( ( tmp = jswindow._window[ pid[ i ] ] ) ){
					
					_w_.token     = tmp.token;
					_w_.name      = tmp.name;
					_w_.pid       = tmp.events.pid;
					_w_.handle 	  = tmp.target;
					_w_.child     = tmp.events.hasChild( );
					_w_.busy	  = tmp.busy;
					_w_.parent	  = tmp.parent;
					_w_.snapTime  = snap;
					
				}else{
					_w_.snapTime =_w_.pid=_w_.token =_w_.name = _w_.handle = 0;
				}
				i++;
			return _w_;
			},
			free:function( ){
				free( pid  );
				free( this );
			},
		};
	},
	
	deletePipe:function( _w_ ){
			delete _w_.fork;
	},
	createWindowPipe:function( _w_, pid, token, read, callback ){
		var handle;
		
		//console.log(  jswindow.getWindow( _w_.token ) )
		if( jswindow.getWindow( _w_.token ) && ( handle = jswindow.getWindow( _w_.token ) )
			&& ( handle && handle.events.pid == pid ) ){
				
				
				
				
		}else if( ( handle =  jswindow.getWindow( _w_.token ) ) && !pid && !token && jswindow[ "on"+read ] == null ){
			
			jswindow[ "on"+read  ] = handle.token;
			handle.fork = callback;
			console.log( jswindow[ "on"+read  ] )
		}	
		
	return -1;	
	},
});
/**/

/**/
jswindow.merge({
	/*
	// all _w_
	*/
	_window:{},
	wfocus :0,
	
	/*
	// tmp all window object
	// new Obejct
	*/
	newWindowObject:function( handle, token ){
			
		this.focus    = 0;
		this.children = [];
		this.target   = handle;
		this.parent   = null;
		this.token    = token;
		this.busy     = null;
		this.free     = false;
		
		this.events   = false;
		
		this.locked = false;
		this.resize  = {
			enabled: false,
			status: false,
			
			top:  null,
			left: null,
			width:null,
			height: null
			
		};
	},
	
	/* constructor export */
	window:function( n, s, x, y, w, h, z ){
		var handle   	 = jo2("<div>"),
			token 	 = jswindow.newToken( ),
			pid  	 = jswindow.getPid( token ),
			z		 = z || {}, nwo, self = this;
			
		jswindow._window[ pid ] = nwo  = new jswindow.newWindowObject( handle, token );
		
		nwo.events = this;
		/* isChildren window */
		if( z.parent &&  z.parent > 0 ){
			var tmp;
			/* check existing window parent */
			if( ( tmp = jswindow.getWindow( z.parent ) ) ){
				
				/* size */
				x= ( tmp.target.offset("left") || 200 ) + 50;
				y= ( tmp.target.offset("top") || 200 ) + 50;
				
				
				if( !( nwo.free = !!( z.free ) ) ){
					
					tmp.target.Class("curun");
					jswindow.busy.call( tmp,  true  );
				}
				
				/* childTmp */
				if( z.childName ){
					tmp.events.childTmp[ z.childName ] = nwo.events; 
					nwo.parentTmp    = z.childName;
				}
				
				/*  push children */
				tmp.children.push( this )
				nwo.parent = z.parent;
				this.__proto__.parent = tmp.events;
			}
			
		}
		/**/
		
		
		
		/* button */
		var button = ( z.close || z.close == undefined  ? '<a href="#" class="btn_s close" data-element="close" style="padding:1" ></a>' : '' )+	
					 ( z.hide  || z.hide  == undefined  ? '<a href="#" class="btn_s hide" data-element="hide" style="padding:1" ></a>' : '' )+
					 ( z.resize ? '<a href="#" data-element="resize" class="btn_s rsz" style="padding:1" ></a>'  : '' );
		/**/
		
		/*mount*/
		handle.made( 
			jswindow.descriptorHeader( x, y, w, h, 0, pid,  jswindow.uidB58( token ), "br2 _wind"  ) 
		).app( 
			jo2( "<div>" )
			.made({ className:"sub_wind rad3" })
			.app( jo2( "<div>" ).addClass("_wind_b")
			.app( 
				jo2("<div>").addClass("_wind_b_").val( button ).id("snow")
			)
			.app(
				jo2( "<div>" ).addClass("_wind_b_mv").val( 
				( z.icon ? "<div class='wind_icon' style=\"background-image:url('"+ z.icon +"'); \">&nbsp;</div>" : "" )
				  +'<div class="title" style="width:100%; padding:8px; letter-spacing:1px;">'+n+'</div>'
				)
				) 
			).app( 
				jo2( "<div>" ).id("_wind_main") 
			)
		)
		/*
		// ###USERS_EVENT##
		// FOCUS EVENT
		*/
		.on("click",function( ){
			
			jswindow.focus.call( nwo );
		
		/* BUTTON EVENT */
		}).child("div._wind_b_mv").on("mousedown", function( event ){
			
			jswindow.move.call( 
				jswindow.getWindow( nwo.token ),
				event 
			);
			
		/*dblclick events	*/
		}).on("dblclick", z.resize ? function( ){
			self.mize( );
		} : function(){} );
		
		handle.child("div._wind_b_").any("a", function( hdl ){
		
			/*button*/
			jo2( hdl ).on("click" , function( e ){ 
			
				( hdl =jno2( this ) ).data("element") == "close" ?
				self.close( ) : 0;
				hdl.data("element") == "hide" ? 
				self.show( ) : 0;
				hdl.data("element") == "resize" ? 
				 self.mize(  ) : 0;
				
				e.preventDefault( );
			});
			/**/
		});
		( document.body || document ).appendChild( handle[0] );
		
		/*
		// v1.0
		*/
		nwo.name        		 = n || "";
		nwo.detachClose 		 = z.detachClose;
		nwo.focused    			 = z.focus;
		nwo.resize.enabled	     	 = z.resize;
		nwo.locked			 = ( z.locked || 0 );
		
		/*
		// v2.0
		// add 10/25/2015
		// calcul la taille height de la header
		// if y == 	auto
		*/
		var bH = ( handle.get(0).get(0).height( ) || 30 )+5;
		if( handle.height( ) > 1 && h !== "auto" ){
			handle.get(0).get(1).css("height",( 100*(  handle.height( ) - bH )/ handle.height( )  )+"%");
		}
		/**/
		
		
		/**/
		jswindow.focus.call( nwo );
		
		/**/
		if( jswindow.oncreate && jswindow.getWindow( jswindow.oncreate ) ){
			jswindow.getWindow( jswindow.oncreate )
					.fork.call( 
						jswindow.getWindow( jswindow.oncreate ).events,
						token, n, pid,  !1, !1, nwo.busy, z.parent ? z.parent : null
					);
		}
		/**/
		jo2("#minDesk").app( 
				//<div style='width:56.5px; height:67.38px; display:block; background:blue; top: 50.42px; left:25px; position:absolute;' ></div>
			( nwo.minwin = jo2('<div>').css({
				top: ( ( (handle.top( )/window.screen.height )*100 ) * 30 /100 )+"px",
				left: ( ( (handle.left( )/ window.screen.width )*100 ) * 75 /100 )+"px",
				height: ( (( (handle.height( )/window.screen.height )*100 ) * 75 )/100 )+"px",
				width: (( ( (handle.width( )/window.screen.width)*100 ) * 75 ) /100 )+"px",
				zIndex:"1001",
				position:"absolute",
				display:"block",
				background:"#f0f0f0",
				border:"1px solid blue"
				
			}).val( z.icon ? "<div class='wind_icon' style=\" width:100%; height:100%; background-size:50% 50%; background-position: center; background-image:url('"+ z.icon +"'); \">&nbsp;</div>" : nwo.name ).on("click", function( ){
				
				self.focus( );
			}) )
		
		)
			
		
	return jswindow.merge( this, {
			pid: pid,token : token, handle: handle, 
			hMain: handle.child("div#_wind_main"),
			childTmp:{},
		});
	},
	
});
jswindow.merge( jswindow.newWindowObject.prototype, { 	
	enumChild:function( callback ){
		var __ret__,iteration;
		try{
			for( iteration in this.children ){
				if( !( __ret__ = callback.call( this, this.children[ iteration ], iteration ) === false ) ){
					break;
				}
			}
		}catch(e){};
	return __ret__;
	},	
});

jswindow.merge( jswindow.window.prototype, {
	constructor: jswindow.window,
	
	onfocus 	:null,
	onblur  	:null,
	onbeforeClose 	 :null,
	onkeyboardInterrupt:null,
	
	on:function( listen, callback ){
	return "focus,blur,beforeClose,keyboardInterrupt".split(',').indexOf( listen ) > -1 ? ( this[ "on"+ listen ] = function( ){
			callback.apply( this, arguments );
		}, this ) : null;
	},
	
	close:function( ){
		
		if( !( tmp = jswindow._window[ this.pid ] ) )
			return;
	
		// callback beforeClose
		// new v3.0
		if( this.onbeforeClose ){
			this.onbeforeClose( );
			this.onbeforeClose = null;
		}
		
		var hcc;
		if( ( hcc = tmp.detachClose && !this.hasChild( ) ? ( typeof tmp.detachClose  === "function" ? 1 : -1   ) : -1 ) > 0 ){
			hcc = tmp.detachClose.apply( tmp, [ tmp.token, this.pid, tmp.events ] );
		}
						
		if( ( hcc === -1 || hcc == true || hcc == 1 ) ){
			if( jswindow.close.call( tmp ) != 0xBAD00001 ){
				
				//jswindow.free( this.__proto__ );
				jswindow.free( this );
				this.void = 1;
				return true;
			 }
		}
	
	return !1;
	},
	
	parent:null,
	getParent:function( ){
			
			//console.log( this.token+" Here pass to ")
	return ( tmp = jswindow._window[this.pid] ) && ( tmp.parent != null && jswindow._window[ jswindow.getPid( tmp.parent ) ] ) ? 
			( this.parent = jswindow._window[ jswindow.getPid( tmp.parent ) ].events ) :
			null;
	},
	/* children */
	hasChild:function(  ){
		return ( this.sizeChild( ) > 0 );
	},
	sizeChild:function(  ){
		return (jswindow._window[ this.pid ]).children.length;
	},
	getChild:function( iteration ){
		var tmp, _w_;

		if( ( tmp = jswindow._window[ this.pid ] ) && this.sizeChild( ) >= iteration ){
			return tmp.children[ iteration ] != undefined ? 
				   tmp.children[ iteration ] : null;
		}
	return null;
	},	
	getChildByToken:function( token ){
		var tmp, _w_;
		if( ( tmp = jswindow._window[ this.pid ] ) ){
			tmp.enumChild( function( child ){
				if( child.token === token ){
					_w_ = child;
				return false;
				}		
			return true;
			});
		}
	return _w_;
	},
	/**/
	
	moveTo:function( x, y ){
		var tmp;
		if( ( tmp = jswindow._window[ this.pid ] ) ){
			return this.convoke( 
				this.handle, 
				jswindow.rawMove,
				[x,y]
				);	
		}
	return -1;
	},
	opacity:function( perc, noanimate ){
		!noanimate ? this.handle.anime({ 
			opacity: this.handle.css("opacity")+":"+( 1 / 100 )*perc, 
			speed:50 
		}) : this.handle.css( "opacity", ( 1 / 100 )*perc );
	},
	title:function( title, align ){
		var node = this.handle.child("div.title").eq(0);
		if( title && node ){
			node.css("textAlign", align == 0x02 ? "center" : align == 0x03 ? "right" : "left" ).val( title );
		return this;
		}		
	return ( node ? node.val( ) : "" );
	},
	
	focus:function( ){
		var tmp;
		if( ( tmp = jswindow.getWindow( this.token ) ) ){
			return jswindow.focus.call( tmp );
		}
	return false;
	},

	busy:function( bool ){
		var tmp;
		if( ( tmp = jswindow._window[ this.pid ] ) ){
			return bool != undefined ?
				( jswindow.busy.call( tmp, bool, true ) )
			: !!( tmp.busy );				
		}
	return 0xBAD00002;
	},
	
	resize:function( x, y ){ 
		var tmp;
		if( ( tmp = jswindow._window[ this.pid ] ) ){
			return jswindow.resize.call( 
				tmp, 
				x, y
			);			
		}
	return 0xBAD00002;
	},
	mize:function( bool ){ 
		var tmp;
		if( ( tmp = jswindow._window[ this.pid ] ) ){
			jswindow.mize.call( tmp, bool );			
		}
	},
	find:function( selector, callback ){
		var self = this, ret = 1;
		typeof callback === "function" ? 
			this.hMain.any( selector, function(  ){
					callback.apply( self, arguments );
			}) :( ret= this.hMain.child( selector ) );
	return ret;
	},
	showE:function( ){
		
	},
	show:function( bool ){
		
		/*this.handle.isClass("hi2") ?
			this.handle.rmClass("hi2") :
			this.handle.Class("hi2");*/
	},
	/*
	// extends and convoke
	// new 3.0
	*/
	convoke: jswindow.convoke,
	extend : jswindow.merge,

});

/*
// keyboardInterrupt
// 
*/
jswindow.merge( jswindow.minDesktop, {

	
});

 window.jsWindow =  window.libWind = jswindow.exports;

})( ( jno2 || gnode ) );
