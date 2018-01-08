/*
//	Base.js  
//	@Author : looter
//  @2015 
//  @v 3.0
*/
_export("__sysError__",[],function( req, def ){
return{
	system:{
		0xBAD00201:"Critical error : 0x%h %c &rarr; %c <br><br>%c <br><br> send a report ?",
		0xBAD00202:"This action has not been terminating correctly, the process id isn't  indexed into table of processes  __PS__ the pid is unknown",
		0xBAD00203:"Access refused ! maybe get more high privileges to perform this task as an administrator.",
		0xBAD00002:"Process manager crash __main report",
		0xBAD00004:"Process manager crash header report",
	},
	window:{
		// window
		0xBAD00001:"Cannot close this window, a child is open use attribute -f",
		0xBAD00003:"The window that you want move is busy !",
		0xBAD00004:"Minimize Me !",
		0xBAD00005:"This window cannot be resized Maxi",
		0xBAD0FF01:"deprecated object destroy",
		0xBAD00006:"This app '%c' doesn't exist. Check you've input a correct name, then try again",
		0xBAD00007:"You don't have right to exec this app",
	},

	};
});
_export("__ENV__",[],function( req, def ){
return {
	sysdir:"./wos",
};
});

_export("LSystemProcess",[],function( req, def ){
return {
	/*
	// @return array[] descriptorSnapProcess
	//	
	*/
	snapProcess:function( ){
			var snap = jsWindow.process( ),
				data = {}, output = [];
				
				try{
					while( snap.first( ) ){
					
						output.push( 
							merge(
								{}, 
								/*
								// return snapProcess
								*/
								snap.next(  ) 
							)
						);
						
					}		
					data = snap = snap.free( );
				}catch(e){
					/*
					// systemError
					// fail compilatorJs
					// send msg to admin system
					*/
				};
		return output;
		},
	/*
	// @return events Window if success
	//	
	*/
	createWindowPipe:function( descriptorPID ){
		return jsWindow.createPipe( descriptorPID );
	}
	
	
	};
	
},2);

_export("GMapDebugger",["msgBox","__kboard__"],function( req, def, o, msgbox, kbIO ){
	
return function( slf ){
	
	if( arguments.length < 2 ){
		return 0;
	}
	
	// window structure
	this.title = "MapDebugger [ ."+ arguments[2].split("_ptr_").join(".")+" ]";
	this.width = 350;
	this.height = 400;
	
	this.swind.hide   = 0;
	this.swind.parent = arguments[1];
	this.swind.childName = arguments[2];
	this.swind.icon = "./js/osx/icon/actions/configure.png";
	this.swind.free	  = 1; 
	this.left = 150;
	this.top = 300;
		
	this.output={
	
	__sectionTxt:("<section data-module='output' style='background:#fff; width:100%; height:auto; min-height:100%; '></section>"),
	
	loadPtr:function( ptr, type ){
		var tmp, i = 0,
			hdl;

		ptr = ptr.split("_ptr_");
		if( ( hdl = ( this.handle || req( ptr[0] ) ) ) ){

			for(; i < ptr.length; i++ )
			hdl = hdl[ ptr[i] ] ? hdl[ ptr[i] ] : null;;
		
		}
	return ( hdl != null && ( typeof hdl === type ) ) ?
			hdl : null;
	},
	pn:[],
	prev:function( ){
		
		if( this.pn[0] ){
			this.pn[1] = this.handle;
			this.handle= this.pn[0];
			this.pn[0] = null;
			this.contextMenu.proto[0][0] = "./js/osx/icon/actions/arrow-left.png:Prev:1:1:ctr+p";
			this.contextMenu.proto[0][1] = "./js/osx/icon/actions/arrow-right.png:Next:0:1:ctr+n";
			this.refresh( );
		}
	},
	next:function( ){
		
		if( this.pn[1] ){
			this.pn[0] = this.handle;
			this.handle= this.pn[1];
			this.pn[1] = null;
			this.contextMenu.proto[0][0] = "./js/osx/icon/actions/arrow-left.png:Prev:0:1:ctr+p";
			this.contextMenu.proto[0][1] = "./js/osx/icon/actions/arrow-right.png:Next:1:1:ctr+n";
			this.refresh( );
		}
	},
	handlerEvents:function( uid ){
		var tmp;
					
		switch( ( tmp = this.contener.get( uid, {a:0,b:0,c:0} ) ).b ){
					
			case "object":
				if(( tmp = this.loadPtr( uid, "object"  ) ) ){
					
				if( this.childTmp[ uid ] )
					this.childTmp[ uid ].focus( );
				else{
					this.pn[0] = this.handle;
					this.contextMenu.proto[0][0] = "./js/osx/icon/actions/arrow-left.png:Prev:0:1:ctr+p";
					this.handle=tmp;
					this.refresh( );
					/*req("LprocessManager").createProcess(
						"GMapDebugger",
						this.token, 
						uid,
						tmp
						);*/
					}
				}
			break;
			case "function":
						
				var _;
				if( ( _ = (/function\s+(\(.+\))\{/).exec( this.loadPtr( uid, "function"  ).toLocaleString( ) ) ) ){
							
					tmp.a = "function";
					tmp.c = _[1];
				}
				req("LprocessManager").createProcess(
					"Gedit",
					null,
					this.loadPtr( uid, "function"  ).toLocaleString( )
				);
					
			case "number":
			case "boolean":
			case "string":
			case "float":
						
				req("LprocessManager").createProcess(
					"DEPGappcLoadLibGview", 
					this.token,
					tmp.c, tmp.a 
				);
			break;
		}
		tmp=null;
	},
	full: function( lib ){
		var tmp,
			_w_ = this;
		
		this.handle = lib;
		for( tmp in lib ){
		
			this.contener.add([
				tmp,
				typeof lib[tmp],
				( typeof lib[tmp] == "function" || typeof lib[tmp] == "object" ? "*"  : 
				  typeof lib[tmp] == "string" ? lib[tmp].replace(/\</g,"&lt;") : lib[tmp]  )
				], tmp, null , function(){
					
					_w_.handlerEvents.call( 
						_w_,
						this.data("uid")
					);
					
				});
						
		}
		
	},
	refresh:function(  ){
		var _w_ = this;
		this.getModule("output").val("");
		this.contener = contenerResize(["Name","Type","Value"], this.getModule("output"), 
		{ 
			click:function( ){
				
				_w_.contener
				   .select( this,"#ff7f50");
			}
		} );
		this.full( this.handle );
	},
	__main:function( name, parent, name, obj ){
		var _w_ = this;
		
		this.hMain.Class("systemL");
		this.contener = contenerResize(["Name","Type","Value"], this.getModule("output"), 
		{ 
			click:function( ){
				_w_.contener
				   .select( this );
			}
		} );
		this.full( obj );
		
		req("LcontextMenu").contextMenu( _w_, _w_.hMain, [["./js/osx/icon/actions/arrow-left.png:Prev:1:1:ctr+p","./js/osx/icon/actions/arrow-right.png:next:1:1:ctr+n"],["null:Open into a new window:0:0","null:refresh:0:1:ctrl+r"],["null:close:0:1:ctr+c"]]);
		this.contextMenu.click  = function( h ){
			this.focus( );
			_w_.contener.select( h );
			this.contextMenu.proto[1][0] = this.contener.get( this.contener.line, {a:0,b:0,c:0} ).b != "object" ?
			"null:Open into a new window:1:0":  "null:Open into a new window:0:0";
		};
		this.contextMenu.event  = function(_,h ){
			var tmp;
			h == "0:0" ?
				this.prev( ) :
			h == "0:1" ?
				this.next( ) :
			h == "1:0" ?
				( ( tmp = this.contener.get( this.contener.line, {a:0,b:0,c:0} ) ).b == "object"  ? 
				req("LprocessManager").createProcess(
						"GMapDebugger",
						this.token, 
						this.contener.line,
						this.loadPtr( this.contener.line, "object"  )
						) : void 0) : 
			h == "1:1" ?
				this.refresh( ) :
			h == "2:0" ? 
				this.close( ) 
			: void 0;
		};
		console.log( " start "+ (new Date()).getTime());

		this.on('keyboardInterrupt',function( _ ){
			
			// 38 et 40
			if( kbIO.isArrowKey( _.uint8 ) ){
				
				//console.log(_.uint8);
				( _.uint8 === 40 ?
				  this.contener.next : this.contener.prev ).call( this.contener );

			} 
			
			_.uint8 == 13 ?
				this.handlerEvents( this.contener.line ) :
			_.uint8 === KeyEvent.DOM_VK_F5 ? 
				this.refresh() :
			_.ctrl && _.chr.toLowerCase( ) == "c" ?
				this.close( ) :
			void 0;
			
		});
	},
	
	};
	
return 1;
};
});

_export("DEPGappcLoadLib",["msgBox"],function( req, def, o, msgbox ){
	
return function( slf ){
	
	if( arguments.length < 2 ){
		return 0;
	}
	
	// window structure
	this.title = "visual js [ Map Library ]";
	this.width = 300;
	this.height = 100;
	
	this.swind.hide   = 0;
	this.swind.parent = arguments[1];
	this.swind.icon = "./js/osx/icon/actions/configure.png";
	
	this.left = 150;
	this.top = 300;
	
	this.output={
	
	__sectionTxt:("<section data-module='form' style='padding:10px;'></section>"),
	
	
	__main:function( ){
		var _w_ = this;

								
		this.input = this.newInput( "form", {
				type: "text", style:"height:25px; width:200px;",
				},"__sysError__", null,"looo : " ).on("keypress[13]",function( e, code, value ){
				
				var lib;
				if( lib = req(value) ){
					
					req("LprocessManager").createProcess("GMapDebugger", _w_.parent.token, value, lib );
					_w_.close( );
					
	
				}else
				msgbox( 
					null,
					"Warning library don't exist, check name and try again.",
					0x100 | 0x40 | 0x0C 
				), this.val("");
		});
			
	},
	
	};
	
return 1;
};
});

_export("DEPGappcLoadLibGview",[],function( req, def, o ){
	
return function( slf ){
	var data, i=0; 
	// window structure
	this.title = "vJS lLibrary map [ "+ arguments[3] +"]";
	this.width = 400;
	this.height = 240;
	
	this.swind.icon = "./js/osx/icon/actions/code-function.png";
	this.swind.parent = arguments[1];
	this.swind.hide = 0;
	this.left = 150;
	this.top = 300;
	
	this.output={
	
	__sectionTxt:("<section data-module='form' class='_w_box' style='text-align:center'></section><section data-module='btn' style='padding:10px; text-align:right'></section>"),
		
	__main:function( ){
		
		this.newInput( "form", {
			type: "text", style:"width:100%;",
		},arguments[3], null );
		
		this.newTextarea( "form", {
			style:"height:100px;resize:none;width:100%;vertical-align:top",
		},arguments[2], null );
		
		this.newButton( "btn", "apply", "Apply", null, null ).disabled( 1 );
		this.newButton( "btn", "cancel", "cancel", null, function(){
			this.close( );
		});
	},
	
	};
return 1;
};
});

_export("Gappc",[],function( req, def, o ){
	
return function( slf ){
	var data, i=0; 
	// window structure
	this.title = "visual js";
	this.width = 400;
	this.height = 200;
	
	this.swind.icon = "./icon/actions/project-development.png";
	this.swind.hide = 0;
	this.left = 150;
	this.top = 300;
	
	this.output={
	
	__sectionTxt:("<section data-module='form' style='padding:10px; text-align:center'></section>"),
	
	
	__main:function( ){
		
		var _w_ = this;
		this.input = this.newInput( "form", {
				type: "text", style:"height:25px; width:200px; vertical-align:top",
				},"Module Name", null ).on("keypress[13]",function( e, code, value ){
				
				req("LprocessManager").createProcess("DEPGappcLoadLib", _w_.token );
				
			}).on("keyup",function( e ){
				
				
			});
			
			//alert((new Date())
	},
	
	};
	
return 1;
};
});

_export("GGPeiD",["msgBox"],function( req, def, o, msgbox, file ){
function swind_hdr(){
return { 
		width:-1,height:-1, show:1,top: -1, left : -1, title: null, 
		swind:{ 
		hide:1, close:1, resize:false, parent: null, icon: null,
		detachClose: null, right:0, 
		}
	};
}
return function( slf, name ){
	
	// window structure
	this.title = "GPeiD [ "+( name || "undefined" )+" ]";
	this.width = 600;
	this.height = 400;
	
	this.swind.hide = 0;
	this.left = 150;
	this.top = 300;
	
	this.output={
	
	__sectionTxt:("<section data-module='header' class='_w_box'></section><section data-module='swind' class='_w_box'></section>"),
	
	__main:function( app, name ){
		var tmp,whdr, ret,
		
		w,h,s,r,t,l,tt,ic, stt;
		
		
		w = this.newInput("header",{ name:"wd", type:"text", style:"width:70px;" }, -1, null, "width : " );
		h=this.newInput("header",{ name:"hg", type:"text", style:"width:70px;" }, -1, null, "height : " );
		s=this.newInput("header",{ type:"text",  style:"width:70px;"  }, -1, null, "Show : " );
		r=this.newInput("header",{ type:"text",  style:"width:70px;" }, "null", null, "root : " );
		t=this.newInput("header",{ type:"text", style:"width:70px;" }, -1, null, "top : " );
		l=this.newInput("header",{ type:"text", style:"width:70px;" }, -1, null, "left : " );
		tt=this.newInput("header",{ type:"text",  }, "undefined", null, "title : " );
		
		ic=this.newInput("header",{ type:"text",style:"width:100%"  }, "null", null, "icon : " );
		
		stt=this.newTextarea("swind",{ style:"resize:none;width:100%;",  }, "", null );
		
		this.newForm();
		if( ( tmp = req( name ) ) ){
			
			ret = tmp.apply(
				( whdr = swind_hdr( ) )
			);	
		
		this.form.set("wd", whdr.width );
		this.form.set("hg", whdr.height );
		//w.val( whdr.width ); h.val( whdr.height );
		s.val( whdr.show ); r.val( whdr.ring0 );
		t.val( whdr.top ); l.val( whdr.left );
		//tt.val( whdr.title );
		//ic.val( whdr.swind.icon );
		stt.val( whdr.output.__sectionTxt );
	
		}
		
		
	}
	
	};
	
	return 1;
	};
});

_export("Gedit",["msgBox","__FILE__" ],function( req, def, o, msgbox, file ){
	
return function( slf, path ){
	
	// window structure
	this.title = "Gedit [ "+( path ? path : "new" )+" ]";
	this.width = 1100;
	this.height = 608;
	
	this.swind.hide = 0;
	this.left = 150;
	this.top = 300;
	
	cacahouete( );
	this.output={
	
	__sectionTxt:("<textarea class='text' style='width:100%;height:94%'></textarea>"
				 +"<section data-module='btn_' style='padding:10px; float:right;'></section>"),
				 
	load:function( path ){
		path  = file.getRealPath( path );
		this.get("text").val( 
			file.readFile( { path:path.path, file:path.file.join(".") }  )
		);
	},
	__main:function( app, path, data ){
		var _w_ = this;
		this.hMain.css("textAlign","center");
		
		if( path )
			this.load( path );;
		data ?
		this.get("text").val( data ) : void 0;
		this.newButton("btn_","send","send","height:15px; width:20px;",
		function( btn ){
				
				console.log("/*/**///////////*/*/**/*/*");
				console.log(file.readFile( { path: "/js", file:"base.js" }  ))
				this.get("text").val( 
					file.readFile( { path: "/js", file:"base.js" }  )
				);
				//this.close( );
			});
		this.get("text").on("keyup",function(){
			
			//_w_.title("*"+_w_.title() );
		});
		}
	};
	
	return 1;
	};
});
_export("Gsudo",["msgBox","__Authroot__" ],function( req, def, o, msgbox,root ){
	
return function( slf, callback, nameofapp ){
	
	if( root.getUserInfo().uid == 0 )
		return 0;
	
	// window structure
	this.title = "Gsudo";
	this.width = 400;
	this.height = "auto";
	
	this.swind.hide = 0;
	this.left = 150;
	this.top = 300;
	
	this.output={
	
	__sectionTxt:("<br>Enter your password to perform <br> Administrator ask"
				 +"<div style='font-size:13px; padding:10px; font-family:systemL;'> the application <b>'"+nameofapp+"'</b> has need more great privilege(s).</div>"
				 +"<div style='font-size:13px; font-family:systemL;'>Password : <section data-module='form' style='display:inline-block; vertical-align:15px;'> </section></div>"
				 +"<section data-module='btn_' style='padding:10px; float:right;'></section>"),
	
	
	__main:function( ){
		
		this.hMain.css("textAlign","center");
		this.input = this.newInput( "form", {
		type: "password", className:"iopath", style:"height:25px; vertical-align:top",
		},"/", null ).on("keypress[13]",function( e, code, value ){
		
			 
			
		});
		this.newButton("btn_","cancel","cancel","height:15px;",
		function( btn ){
				btn.disabled( 1 );
				this.close( );
			});
		this.newButton("btn_","send","ok","height:15px; width:20px;",
		function( btn ){
				
				if( this.input.val( ) != "root")
				msgbox( 
					null,
					{title: "Gsudo error", msg: req("__sysError__").window[0xBAD00007] },
					0x100 | 0x40 | 0x04 
				);
				
				callback.call( 
					{},
					this.input.val( ) == "root", 
					(new Date() ).getTime()+""+parseInt(Math.random()*65535) 
				);
				btn.disabled( 1 );
				this.close( );
			});
		}
	};
	
	return 1;
	};
});
_export("Gexec",["__sysError__","msgBox","LprocessManager"],function( req, def, output, error, _msgBox, process ){
	
	function __exec( _w_  ){
		//console.log(  _w_.input.val( ).split(" ") );
	return process.createProcess.apply(
			process,
			_w_.form.get("app").split(" ")
		);
	}

return function( _, parent ){
	
	// window structure
	this.title = "Run App";
	this.width = 325;
	this.height = 190;
	
	this.swind.hide = 0;
	this.left = 150;
	this.top = 300;
	this.swind.parent = parent;
	this.swind.free = 0;
	
	// don't allow to access root privilege
	this.ring0 = !1;
	
	this.output = {
		__sectionTxt:"<div style='width:85%; margin:auto;'><img src='./js/osx/icon/categories/applications-utilities.png' style='display:inline-block;'> <span style='vertical-align:20px;'>Enter the name of program</span> "
					+"<section data-module='form' style='padding:5px; display:inline-block; '><span style='vertical-align:-18px'> Run :</span></section><div > <input type='checkbox'  name='root' style='vertical-align:-3px'>"
					+"Open this program with root privilege. </div></div><section data-module='btn' style='float:right; padding:5px;'></section>",
		
		__main:function( ){
			var _w_ = this;
		
			this.hMain.Class("systemL").css({ fontSize:"12px",});
			this.input = this.newInput( "form", {
				name:"app",type: "text", style:"height:25px; width:200px; vertical-align:top",
				},"", null ).on("keypress[13]",function( e, code, value ){
					process.adjustTokenPrivilege = _w_.form.get("root");
					__exec( _w_ ),_w_.close( );;
				
			}).on("keyup",function( e ){
					
					if( ( e.srcElement || e.target ).val().length == 0 ){
						_w_.get("ok").disabled(1);
					}else if(_w_.get("ok") &&  _w_.get("ok").disabled( ) && ( e.srcElement || e.target ).val().length > 0 ){
						_w_.get("ok").disabled(0);
					}
			}).Focus( );
			
			
			this.newButton("btn","canceled","cancel","height:15px;",
			function( btn ){
				this.close( );
			});
			
			this.newButton("btn","ok","ok","height:15px;",
			function( btn ){
				
				process.adjustTokenPrivilege = this.form.get("root");
				__exec( this );
				btn.disabled( 1 );
				this.close( );
			}).disabled(1);
			this.newForm( );
		},
	};

return true;
};

});
_export("Gprocess" /*"GTaskManager"*/,["__kboard__","__sysError__","msgBox","LSystemProcess","LprocessManager"],function( req, def, output, kbIO, error, _msgBox, sysProc, process ){
return function( _, parent ){
	
	if( process.hgprocess( ) ){
		process.hgprocess( ).focus( );
		return 0;
	}
	
	this.title = "Task Manager";
	this.top   = 200;
	this.left  = 300;
	this.width = 450;
	this.height= 400;
	this.ring0 = !true;
	
	this.swind.close = 0;
	this.swind.icon = "./js/osx/icon/apps/utilities-system-monitor.png";
	
	this.output = {
		
		//<module name=''></m>
		__sectionTxt:'<section data-module="snap" class="snap"></section><section data-module="header"></section>',
		__main:function(  ){
			var _w_ = this,i = 0, data, child,snap;
			
			req("LcontextMenu").contextMenu( this, this.getModule("snap"),  [["./js/osx/icon/actions/process-stop.png:Kill:0:1:ctrl+k","./js/osx/icon/actions/configure.png:Debug Process:0:1:ctrl+d","null:Window Child:0:0"],
				["null:Properties:1:1:ctrl+p"]] );
			
			this.hMain.Class("systemL");
			this.contener = contener = contenerResize(["Name","PID","Status","Token","Parent"],
			this.get("snap").css({ height:"275px", overflowX:"hidden", background:"#fff" }) );
							 
				
			child = 1;
			snap = this.process = sysProc.snapProcess( );
			while( ( data = snap[ i ] ) ){
					
				if( ( ( !child && !data.parent ) || ( child && ( data.parent || !data.parent ) ) ) && data.token !=  0 ){
						
					contener.add([
						data.name,
						data.pid,
						!( data.busy ) ? "running" : "busy",
						data.token,
						data.parent
					], data.token, function( ){
						contener.select( this, "#ff7f50" );
						_w_.get("gtmkill").disabled( 0 );
						_w_.get("dbg").disabled( 0 );
					 }, function( ){
							_w_.focusit( _w_.contener.line );
					 });
				}
				
				i++;
			}
			
			this.newButton("header","exec","run","height:18px;",
			function( btn ){
				req("LprocessManager").createProcess("Gexec", this.token );
			});
			this.newButton("header","dbg","debugger","height:18px;",
			function( btn ){
				
				req("LprocessManager").dbg.call( 
					this,
					this.contener.get( this.contener.line,{ a:0,b:0,c:0,token:0,e:0 } ).token
				);
			
				
			}).disabled( 1 );
			this.newButton( "header", "gtmchild", 
				'window children','height:18px; vertical-align:top;',
			function( btn ){
				btn.selected( !btn.selected( ) )
				//this.getSnapProcess( );
			});
			this.newButton( "header", "gtmkill", 
				'kill process','height:18px; text-align:center; vertical-align:top;',
			function( btn ){
				var tmp,_tmp;
				if(( tmp = this.contener.get( this.contener.line,{ name:0,pid:0,busy:0,token:0,parent:0 } ) ).name != 0 /*&& this.token != tmp.token*/ ){
					if( ( _tmp = process.createRemoteProcess(
						tmp.pid,
						tmp.token,
						function( ){
							this.close( );
						return 1;
						},
						{}
					) ) == 1 )
					btn.disabled( 1 );
					else{
						_msgBox( null, { title:"process manager error ", msg: error.system[ _tmp ] },
						0x100 | 0x0C  );
						
					}
				}
				
			}).disabled( 1 );
			
			process.hgprocess(
				this
			);
			
			// contextMenu
			this.contextMenu.click =function(a){ 
				this.contener.select(gnode(a)); 
			};
			this.contextMenu.event = function(a,h){ 
				console.log( h )
					switch(h){
					case "0:0":
						this.kill(this.contener.line);
						break;
					case "0:1":
						req("LprocessManager").dbg.call( 
							this,
							this.contener.get( this.contener.line,{ a:0,b:0,c:0,token:0,e:0 } ).token
						); 
						break;
					}
			};
			// KeyboardInterrupt
			this.on('keyboardInterrupt',function( _ ){
				// 38 et 40
				if( kbIO.isArrowKey( _.uint8 ) ){
				
					( _.uint8 === 40 ?
					this.contener.next : this.contener.prev ).call( this.contener );
				} 
				
				// Getfocus
				( _.uint8 === 13 || ( _.ctrl &&_.uint8 === 70 ) ) && this.contener.line ?
					this.focusit( this.contener.line ) : 
				// OpenRun
				_.ctrl && _.uint8 === 82 ?	
					req("LprocessManager").createProcess("Gexec", this.token ) :
				// Kill Process
				_.ctrl && _.uint8 === 75 && this.contener.line ?
					this.kill(this.contener.line) :
				_.ctrl && _.uint8 === 68 && this.contener.line ?	
					req("LprocessManager").dbg.call( 
						this,
						this.contener.get( this.contener.line,{ a:0,b:0,c:0,token:0,e:0 } ).token
					) :
				// current Close
				_.ctrl && _.chr.toLowerCase( ) == "c" ?
					this.close( ) :
				void 0;
			
			});
		
		},	
		remote:function remote( token, events ){
			//if( token == this.token )
				//return;;
			try{
				var tmp, 
					hdm;	
				this.process = sysProc.snapProcess( );
				for( tmp in this.process ){
					if( this.process[tmp].token == token ){
						return process.createRemoteProcess(
								this.process[tmp].pid,
								this.process[tmp].token,
								function( ){
									this[events]( );
									return 1;
								},
								null
						);
					}						
				}
			}catch(e){}
		return 0;
		},
		focusit:function( token ){
		return this.remote(
				token,
				"focus"
			);
		},
		kill:function( token ){
			var _tmp;
			if( ( _tmp = this.remote(
				token,
				"close"
			) ) === 1 );
			else{
				_msgBox(
					null, 
					{ title:"process manager error ", msg: error.system[ _tmp ] },
					0x100 | ( _tmp == 0xBAD00202 ? 0x0C : 0x04 ) 
				);
				_tmp=null;
			}
		},
		addprocess:function( name, pid, busy, token, hparent ){
			_w_ = this;
			this.contener.add([
						name,
						pid,
						!( busy ) ? "running" : "busy",
						token,
						hparent
					], token, function( ){
						contener.select( this, "#ff7f50" );
						_w_.get("gtmkill").disabled( 0 );
					 }, function( ){
							_w_.focusit( _w_.contener.line );
					 });
		},
		removeProcess:function( token ){
			this.contener.rmLine( token );			
		},
	};
	
return 1;
};
});
_export("Gcrash",[],function( req, def, o ){
return function( slf, _1, _2, _3, title ){
	var data, i=0; 
	// window structure
	this.title = title;
	this.width = 450;
	this.height = 355;
	
	this.swind.icon = "./icon/actions/view-pim-tasks-pending.png";
	this.swind.hide = 0;
	this.left = 150;
	this.top = 350;
	
	this.output={
	
	__sectionTxt:("<div style='width:95%;margin:auto;padding:10px;'><img src='./icon/mimetypes/application-x-executable.png'>"+
				  "<span class='app systemL' style='padding:5px; vertical-align:18px;' ></span></div><div style='width:95%;margin:auto;'>"+
				  "<span class='emsg systemL' style='padding-left:15px; font-size:13px; vertical-align:18px;' ></span></div><section data-module='form' class='_w_box'></section><section data-module='btn' style='float:right;padding:10px'></section>"),
	
	
	__main:function( _, app, errorn, error ){
		console.log( arguments );
		this.get("emsg").val("repport : "+errorn);
		this.get("app").val( app+" has stopped working" );
		this.newTextarea("form", { style:"width:100%;height:150px;resize:none;"  }, error != undefined ? error.replace(/\<br\>/g,"\r\n") : error ,null );
		this.newButton("btn","send","send","", function(){
			
			
		});
		this.newButton("btn","ok","cancel","", function(){
			
			this.close( );
			
		});
		this.focus( );
	},
	
	};
	
return 1;
};
});
_export("__Authroot__",["__sysError__"],function( req, def, output, error ){
	
	/*Query userAccount*/

return{
	__hasRootToken:null,
	getUserInfo:function(){
	//console.log( req("__FILE__").readFile( { path:"/js/etc", file:"group" } ) );
	return {
			name:"root",
			uid:1, gid:1, currentPath:"/root",
			boot:"/bin/sh",
		};
	}
};
});

// LPM
// Library process manager
// r-x all
// rw- AdjustTokenPrivilege 
_export("LprocessManager",["__sysError__","__Authroot__","msgBox"],function( req, def, output, error, root, _msgBox ){

var view = req("__VIEW__"),
	msgbox = _msgBox,
	__ROOT__ = { }, __PS__ = {}, hgprocess,
	ee;
	
	root.__hasRootToken = function( _w_ ){
	return ( __ROOT__[ _w_.token ] && ( __ROOT__[ _w_.token ] == _w_.ring0  ));
	};
	
function swind_hdr(){
return { 
		width:-1,height:-1, show:1,top: -1, left : -1, title: null, 
		swind:{ 
		hide:1, close:1, resize:false, parent: null, icon: null,
		detachClose: null, right:0, 
		}
	};
}
function __process( app ){
	var _w_, whdr;
	
	if( !this.enabled ){
		req(app).apply( 
			( whdr = swind_hdr( ) ), arguments 
		);
		merge( 
			this,
			whdr
		);
	}
	this.swind.detachClose = function( token ){
		
		hgprocess && !hgprocess.void ?
		hgprocess.removeProcess(token) : void 0;
		
		req("__kboard__").freeKBHook( this );
		if( __ROOT__[ token ] ){
			delete __ROOT__[ token ];
		}
		delete __PS__[ token ];
			
	return 1;
	};

	this.output.loadview = function( ){
		
		this.hMain.val( this.__sectionTxt );
		delete this.__sectionTxt;
		
		delete this.newButton;
		delete this.newInput;
			
		delete this.loadview;
	return this;
	};
	
	// handle _w_
	( _w_ = jsWindow.window( 
	
		this.title+( this.root ? ' [root]' : ""),
		this.show,
		this.top,
		this.left,
		this.width,
		this.height,
		this.swind
		
	) ).extend( this.output )
	   .extend({ ring0: this.root })
	   .loadview( );
	 
	 view.extend( _w_ );
	// record rootToken
	if(  this.root  ){
		__ROOT__[ _w_.token ] = this.root;
		delete this.root;
	}
	__PS__[ _w_.token ] = _w_;
	
	hgprocess && !hgprocess.void ?
	hgprocess.addprocess( 
		app,
		_w_.pid,
		_w_.busy( ),
		_w_.token,
		 _w_.getParent()  ?  _w_.getParent().token : ""
	) : '';

try{ 
	return _w_.__main.apply( 
		_w_,
	   arguments
	);
}catch(e){ 
		_w_.close( );	
		console.log( ee );
		ee = e;
	// crash error		
	return 0xBAD00002;
};
};

return{
	v:"1.2",
	// exports to DEPGappc
	dbg:function( token ){
		
		__PS__[ token ] ?
		root.__hasRootToken( this ) ? 
		req("LprocessManager").createProcess("GMapDebugger", this.token, "p"+token, __PS__[ token ]  ) :
		( this.adjustTokenPrivilege = true, req("LprocessManager").createProcess("GMapDebugger", this.token, "p"+token, __PS__[ token ]  ) )
		/*_msgBox( this.token, { title:"process manager error ", msg: error.system[ 0xBAD00203 ] },
				0x100 | 0x04 ) */:
		_msgBox( this.token, { title:"process manager error ", msg: error.system[ 0xBAD00202 ] },
				0x100 | 0x0C );
	},
	//
	hgprocess:function( a ){
		return a ? ( hgprocess = a ) : hgprocess && !hgprocess.void ? hgprocess : null;
	},
	__gerror:true,
	adjustTokenPrivilege:false,
	createProcess:function( app ){
		var _w_, argv = arguments;
		var strucWind = swind_hdr( ),
			user = root.getUserInfo( ),
		tmp;
	
		try{
		// check existing
		if( !req(app) ){
			this.__gerror ?
			msgbox( 
				null,
				{title: "process manager", msg: jno2.vscanf( error.window[ 0xBAD00006 ], app ) },
				0x100 | 0x40 | 0x08 
			) : '';
			this.adjustTokenPrivilege = this.adjustTokenPrivilege ? 
			!this.adjustTokenPrivilege : this.adjustTokenPrivilege;
		return 0xBAD00006;
		}
		
		// read struct
		if( !( tmp= req(app).apply( strucWind, arguments ) ) ){
			this.adjustTokenPrivilege = this.adjustTokenPrivilege ? 
			!this.adjustTokenPrivilege : this.adjustTokenPrivilege;
			return tmp;
		}
		
		if( strucWind.swind.parent && __ROOT__[ strucWind.swind.parent ] && strucWind.ring0 ){
			strucWind.root = __ROOT__[ strucWind.swind.parent ];
			strucWind.ring0 = !strucWind.ring0;
		}
		
		// ask UAC
		if( ( strucWind.ring0 || this.adjustTokenPrivilege ) && user.uid != 0 ){
			__process.call(
				{ enabled: false },
				"Gsudo",
				function( returned, rootToken ){
					_w_ = returned ? 
					__process.apply(
						merge(
							strucWind,
							{ enabled: true,root: rootToken }
						),
					 argv
					) : 0xBAD00007;
				},
				app
			);
			this.adjustTokenPrivilege = this.adjustTokenPrivilege ? 
			!this.adjustTokenPrivilege : this.adjustTokenPrivilege;
		}else{
			strucWind.enabled = true;
			_w_ = __process.apply( 
				user.uid == 0 ? merge( strucWind,{ root: (new Date() ).getTime()+""+parseInt(Math.random()*65535) } ) : strucWind, 
				argv 
			);
		}
		
		}catch(e){
			this.adjustTokenPrivilege = this.adjustTokenPrivilege ? 
			!this.adjustTokenPrivilege : this.adjustTokenPrivilege;
			// crash report __header
			_w_ = 0xBAD00004;
			ee  = e;
		}
		// crash report
		if( _w_ == 0xBAD00002 || _w_ === 0xBAD00004)
			__process.call(
				{enabled:false},
				"Gcrash",
				app,
				ee.message,
				jno2.vscanf( error.system[ 0xBAD00201 ], 0xBAD00201, app, ee.message, ee.stack ),
				 error.system[ _w_ ]
				); ee = null;;
		
	return ( _w_ );
	},
	createRemoteProcess:function( pid, token, ptrhandle, ptr ){
		ptrhandle = ( ptrhandle || function(){} ),
		ptr = ( ptr || {});
		
		if( __PS__[ token ] && __PS__[ token ].pid == pid ){
		return ptrhandle.apply(
				__PS__[ token ],
				ptr ? ptr : void 0
			);
		}
	// ACCESS
	return ( !__PS__[ token ] ? 0xBAD00202 : 0xBAD00203 );
	},

	
	};
});




// getfocus on a element _w_
//
_export("__focus__",[], function( req, _, lib ){
		
	lib.focus = function( _w_ ){
		// extends _w_
		// focusit target
		_w_.focusit ={
			target:"",
		};
		_w_.find("section", function( h, i ){
			h.on("click", function( ){
				
				// call callbackBlur
				if( _w_.focusit[ _w_.focusit.target+"Blur" ] ){
					_w_.focusit[ _w_.focusit.target+"Blur" ].call( _w_ );
				}
				// bind callbackFocus
				if( _w_.focusit[ _w_.focusit.target+"Focus" ] ){
					_w_.focusit[ _w_.focusit.target+"Focus" ].call( _w_ );
				}
				
				_w_.focusit.target = h.data("module"); 
				
				
			});
		});		
	};
});

// keyboard lib
// allow get input keyboard to _w_
_export("__kboard__",[],function( req, _, lib ){
	var hook = { },target = null;
	
	//extends jsWindow
	window.jsWindow.setKBTarget = function( a ){
		target = a;
	};
	//
	
	lib.Upper = false;
	lib.KeyBoardHook  = function( _w_ ){
		hook[ _w_.token ] = true; 
	return _w_;
	}; 
	lib.freeKBHook = function( _w_ ){
		delete hook[ _w_.token ];
	return true;
	};
	lib.isArrowKey = function( code ){
		return (code == 37 || code == 38 || code == 39 || code == 40 );
	};
	
	
	lib.windowCtrlMove = false;
	// __init__
	// hook keypress
	//
	
	var kb = {
		
		16:false,
		17:false,
		18:false,
		20:false,
	};
	
	document.onkeyup = function( e ){
		
		switch( (k= e.keyCode ? e.keyCode : e.charCode) ){
			
			// shift
			// crtl
			case 16:
			case 17:
			case 18:
				kb[k] = !1;
			break;
		}

		e.upper = lib.Upper;
		if( e.charCode ? e.charCode : e.keyCode == 20 ){
			lib.Upper = !lib.Upper;
		}
	};
	
	
	document.onkeydown = function( e ){
		var k;
		
		switch( (k= e.keyCode ? e.keyCode : e.charCode) ){
			
			// shiff crtl alt caps 
			case 16:
			case 17:
			case 18:
			case 20:
				if( k != 20 && kb[k] ){
					e.preventDefault( );
					return;
				}
				kb[k] = k === 20 ? !kb[k] : true;
			break;
		}
		
		if( target && target.onkeyboardInterrupt ){
			
			// ret false
			e.preventDefault( );
			target.onkeyboardInterrupt.call(
				target,
				{
					shift: kb[16],
					ctrl : kb[17],
					alt  : kb[18],
					caps : kb[20],
					uint8: k,
					chr  : e.key,
					event: e
				}
			);
			
		}

	};
	
});
_import("__kboard__");
//




// msgBox prototype 
//
// First _w_ code 2011
// msgBox( uint tokenParent [ [, str message || { title: str title, msg: str message } ], uint type, proc callback, str imagePath ] )
// callback( bool response )
// for this time she's here
// may be moved to lib, we'll see later
// can be instable 
//@ version 1.0 2011 prototype
// rewrite 2018
_export("msgBox",[],function(a,b,c ){
return function( _, htoken, msg, typ, cllbck, img ){
return req("LprocessManager").createProcess("msgbox", _, htoken,  msg,typ,cllbck, img )
};		
});
// msgBox prototype 
//
// First _w_ code 2011
// msgBox( uint tokenParent [ [, str message || { title: str title, msg: str message } ], uint type, proc callback, str imagePath ] )
// callback( bool response )
// for this time she's here
// may be moved to lib, we'll see later
// can be instable 
//@ version 1.0 2011 prototype
/*Constructor*/
// MsgBox arguments
// UINT parentToken || null , TEXT msg [ , WORD typ, FUNCTION callback, TEXT imgSrc ]
// 4 bit 0x02 perso img, 0x04 warning img, 0x08 info img
// 4 bit 0x00 undysplay button hide default, 0x10 undisplay button hide, 0x20 free msgbox if parentToken 
// 2 bit 0x00 no button, 0x100 ok button,
//       0x200 Ok button cancal button + callbaclk( bool reply ), 
//		 0x300 yes button no button + callback( bool reply )
// 0x80 parentBusy free true
// 0x40 btn close
// return @UINT tokenID
_export("msgbox",[],function(a,b,c ){
return function( _, htoken, msg, typ  ){
	
	var type = {
		0x02:null,
		0x04:"/icon/status/task-attention.png",
		0x08:"/icon/status/dialog-information.png",
		0x0A:"/icon/status/user-busy.png",
		0x0C:"/icon/actions/process-stop.png"
		
	};

	this.top = this.left = 200;
	this.width = this.height = "auto";
	this.title = typeof msg == "object" ? msg.title : "";
	this.swind= {
		hide:0, close:!((typ&0x40)>>6),
		parent: ( htoken || null ),
		free: !( (typ&0x80) >> 7 )
	};

	this.output = {

	sectionTxt:"",
	__main:function( _, htoken, msg, typ, cllbck, img ){
		var title = msgr ="", slf = this;
		type[ 2 ] = img || null;	

		this.handle
		    .css("minWidth","350px")
		    .css("maxWidth","500px");

		if( typeof msg === "object" ){
			title = msg.title;
			msgr  = msg.msg;
		}else
		msgr = msg;;

		this.hMain.css("padding","15px").app( 
			jno2('<div id="msgBox" class="noselect systemL">') 
			.app( typ && type[ typ&0x3f ] ? jno2('<img>').attrib("src", req("__ENV__").sysdir+type[typ&0x3f] ) : false )
			.app( jno2('<div class="f_txt">').app( jno2('<div class="f_tt_f noselect">').val( msgr ) ) )		
		); 
		// btn
		if( ( typ = ( typ >> 8 )&0xff ) > 0 ){
			// cancel mod 
			// return false 
			// in the callback
			if( typ&0x02 || type&0x04){
				this.hMain.app( 
					jno2('<a href="#" class="down_not br2">').val(( !(typ^0x02) ? "cancel" : "no")).css("textAlign","right")
					.on("click",function( ){
						typeof cllbck == "function" ? ( cllbck.call( slf, false, slf ) ? slf.close( ) : 0 ) : slf.close( );
					})
				);
			}
			// ok mod
			// return true 
			// in the callbacks
			if( typ&0x01 || typ&0x03 )
			this.hMain.app( 
				jno2('<a href="#" class="down br2">').val(( !(typ^0x01) ? "ok" : "yes")).css("textAlign","right")
				.on("click",function( ){
					typeof cllbck == "function" ? ( cllbck.call( slf, true, slf ) ? slf.close( ) : 0 ) : slf.close( );
				})
			),this.hMain.child(".down").focus( );;
		}else
		this.on("keyboardInterrupt",function( _ ){
			if(  _.uint8 == 13 || _.uint8 == 32 ){
				this.close( );
			}
		});;

	return this;
	}
	};

return this;
}
});


_export("__VIEW__",[],function(req,b, output ){
	var _extends = new Object( );
	
	_extends.map = function( callback ){
			var tmp;
			try{
				for( tmp in this ){
					tmp != "map" ?
					callback.call( null, this[ tmp ], tmp ) :
					0;
				}				
			}catch(e){};
	};
	_extends.get = _extends.getButton = function( name ){
		return this.hMain.child( "."+ name );
	};
	
	function _disable( bool, name ){
	return ( bool == undefined ? this.isClass(name) :  
			 bool  ? this.Class(name) : 
			 !bool ? this.rmClass(name) :
			 this.isClass(name) );
	}
	_extends.button = function(  name, callback ){
		var node = ( typeof name === "string" ? this.getButton( name ) :
			   name )[0],_w_  = this;
		
		node.callback = ( callback || null );
		node.onclick = function( ){
			if( !node.disabled( ) && node.callback && typeof node.callback == "function" ){
				return node.callback.call( 
					_w_,
					jno2( this ),
					node.selected( ) 
				);
			}
		return false;
		};
		//
		node.selected = function( bool ){
			return _disable.call( jno2( this ), bool, "down_s" );
		};
		node.disabled = function( bool ){
			return _disable.call(  jno2( this ), bool, "disabled" );
		};	
		//
		
		node.call = function( ){
			return node.node.onclick( );
		};
		
	return node;
	};
	
	//
	_extends.getModule = function( module ){
		var j = null;	
		this.hMain.any("section", function( handle, i ){
			if( ( handle = jno2( handle ) ).data("module") == module ){
				  j = handle;
			}
		});
	return jno2( j );
	};
	//
	_extends.appModule = function( _w_, module, element  ){
		var j = false;	
		_w_.hMain.any("section", function( handle, i ){

			if( ( handle = jno2( handle ) ).data("module") == module ){
				  handle.app( element );
				j = true;
			}
		});
	return j;
	};
	
	_extends.newButton = function( module, name, value, style, callback  ){
		var newButton = jno2("<a>").attrib("href","#").made({
			className: "button "+name,
			style: style,
		}).val( value );
		
		!_extends.appModule( this, module, newButton ) ?
		 newButton.del( ) :
		 0;
		 
	return _extends.button.call( this, newButton, callback );
	};
	_extends.new      = function( element, append, attrib ){
		var handle = jno2( "<"+element+">" )
		
		this.hMain.any( append, function( hdl, i ){
				 hdl.app( handle );
		});
	return handle;
	};
	_extends.newInput = function( module, attrib, value, callback, label  ){
		var newInput = jno2("<input>")
				.made( attrib ),
			tmp;
		
		if( label ){
			( tmp = jno2("<span>") )
				.made( { innerHTML: label, style:{ display:"inline-block" } } )
				.app( newInput );
			tmp=tmp;
		}else{
			tmp = newInput
		}
		(tmp.pcm={
			proto:[ 
				["null:Cancel:0:0"],
				["null:Cut:0:0","null:Copy:0:1:ctrl+c","null:Paste:0:1:ctrl+v"],
				["null:Select All:1:1:ctrl+a"] 
			],
			t:tmp,
		});
		// contextMenu Input/Textarea
		req("LcontextMenu").contextMenu( tmp.pcm, tmp, tmp.pcm.proto );
		tmp.pcm.contextMenu.click = function(){
				this.proto[2][0]= ( this.t.len() > 0 ) ? 
				"null:Select All:0:1:ctrl+a" : "null:Select All:1:1:ctrl+a";
		};
		tmp.pcm.contextMenu.event = function(_,h){
		
			h == "0:0" ?
				_.val("") :
			h == "1:0" ?
				_.val(
					_.val( ).substring( 0, _.selectionStart )+""+_.val( ).substring( _.selectionEnd, _.len( ) )
				) :
			h == "1:1" ?
				( document.execCommand( 'copy' ), _.val( ).substring( _.selectionStart, _.selectionEnd ) ) :
			h == "1:2" ?
				(_.select(),document.execCommand( 'paste' )) :
			h == "2:0" ?
				_.select( ) 
			: void 0;
			
			_.Focus();
		};
		//
		
		!_extends.appModule( this, module, tmp ) ?
		 newInput.del( ) :
		 0;
		   tmp = null
		   newInput.val(value);
	return newInput;
	};
	_extends.newTextarea = function( module, attrib, value, callback  ){
		var newInput = jno2("<textarea >")
				.made( ( attrib || {} ) );

		!_extends.appModule( this, module, newInput ) ?
		 newInput.del( ) :
		 0;
	
		 newInput.val( value )
	return newInput;
	};
	//
	_extends.newForm = function(  ){
		var slf,ptr;
		slf = ( ptr = this ).form ={
			state:{},
		};
		slf.set = function( name, value ){
			ptr.hMain.any("input[name='"+name+"']",function(h){
					h.attrib('type') === "checkbox" ?
					slf.state[ h.node.name ] = h.node.checked = value :
					slf.state[ h.node.name ] = h.node.value = value;
			});
		};
		slf.get = function( name ){
		return slf.state[name] ? slf.state[name] :
			undefined;
		};
		//
		this.hMain.any("input",function(h){
			h.on("change",function( ){
				
				this.type === "checkbox" ?
					slf.state[ this.name ] = this.checked :
					slf.state[ this.name ] = this.value;

			});

			h.node.type === "checkbox" ?
				slf.state[ h.node.name ] = h.node.checked :
				slf.state[ h.node.name ] = h.val();
		});
		//
		console.log(slf )
	return this;
	};
	output.extend = function( _w_ ){
		try{
			_extends.map( function( val, key ){
				_w_[ key ] = val;
			});				
		}catch(e){};
	return _w_;
	};
});

// LcontextMenu
_export("LcontextMenu",[],function( req,def,o ){
	var __mount = function( proto, x, y, c ){		
		var t = jno2("<ul>").addClass("systemB"),
			i = 0;
		
		proto.map(function(val,k){
			var _ = jno2("<li>"),
			__ = jno2("<ul>");
			
			val.map(function(value,kk){
				v=value.split(":");
				
				__.app( jno2("<li>").app(
					jno2("<span>").Class(parseInt(v[2])?"sdisabled":"").made({
						innerHTML:(v[0] !== "null" ? "<div class='ico' style='flex:0 auto; background-image:url(\""+v[0]+"\");'></div>" : '<div class="ico"></div>')+
								  "<div style='flex:1;'>"+(parseInt(v[3])? "<u>"+v[1][0].upper(0)+"</u>"+v[1].slice(1,v[1].length) : v[1])+"</div>"+(v[4]?"<div>"+v[4]+"</div>":"")
					}).on("click",c || function(){} ).data("handle",k+":"+kk)
				) );
				
			});
			t.app( 
				_.app( __ )
			);
		});
		_=__=k=kk= null;
		
	return jno2("<nav>").made({
			id:"contextMenu", style:{ left: x+"px", top: y+"px" }
		}).app( t );
	}
	o.node  = null;
	o.state = false;
	// relaoad every times
	o.contextMenu = function( _w_, node, proto, callback ){
		
		_w_.contextMenu={
			proto:proto
		};
		// don't use addEventListener
		node[0].oncontextmenu = function( c ){
			
			o.state && o.node ?
			( o.node  = o.node.del( ) ) : void 0;
			( _w_.contextMenu.click || function(){}).call(_w_, c.target );
			jno2( document.body ).app( 
				( o.node = __mount( (_w_.contextMenu.proto || proto), c.clientX, c.clientY, function(){
						!this.isClass("sdisabled") && _w_.contextMenu.event ?
						( _w_.contextMenu.event.call( 
							_w_,	// this
							c.target, // DOM target
							this.data('handle')	// items selected
						),o.node.del( ) ) :void 0;	
				} ) )
			); 
			o.node.css({
				left:( (c.clientX+o.node.offset().width) > window.screen.width ) ?
				 c.clientX -( ( c.clientX +o.node.offset().width) - window.screen.width) : c.clientX,
				 top:( ( c.clientY +o.node.offset().height) > window.innerHeight ) ?
				 c.clientY-( ( c.clientY + o.node.offset().height) -window.innerHeight) : c.clientY,
			});
			o.state = 1;
		};
	return _w_;
	};
	
	
	document.onmousedown = function(e){
	 if( o.node || ( o.state && o.node ) ){
			var op;
			op = o.node.offset();
			( e.clientX < o.node.left( ) || e.clientX > (parseInt(o.node.left())+parseInt(op.width) ) ) ||
			( e.clientY < o.node.top( ) || e.clientY > (parseInt( o.node.top())+parseInt(op.height)) ) ?
			( o.node  = o.node.del( ) ) : void 0;
		}
		o.state = 0;
	};	
	if (document.addEventListener) {
        document.addEventListener('contextmenu', function(e) {
            e.preventDefault();
        }, false);
    } else {
        document.attachEvent('oncontextmenu', function(){
		window.event.returnValue = false;
        });
    }
});




