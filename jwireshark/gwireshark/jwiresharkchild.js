_export("GwiresharkAboutFile",["LGwireshark"],function( req, def, o, libw ){

return function( _, parent, name ){
	// window structure
	this.title  = "Wireshark - About";
	this.width  = 400;
	this.height = 345;
	this.top    = this.left = 350;
	this.swind.close = ( this.swind.hide = 0 )+1;
	
	this.swind.icon   = "./img/Apps-Wireshark-icon.png";
	this.swind.parent = parent;
	this.swind.free = 1;

	this.output={
	
	__sectionTxt:("<section data-module='about' class='_w_box'></section><section data-module='dump' class='_w_box'></section>"),
	__main:function(  ){
		var p = this.getParent(),
		    slf = this;

		if( p.data && p.enabled ){
			this.title( p.fd.name );
			this.getModule("about").val(
		'<div class="elt"><tt>File Type : </tt> <span class="val">'+(p.fd.ext || "unknow" )+'</span> </div>'+
		'<div class="elt"><tt>Frame Captured :</tt> <span class="val">'+(p.data.framelen || "0" )+'</span> </div>'+
		'<div class="elt"><tt>Captured Lenth :</tt> <span class="val">'+(p.data.capturedlen || "0" )+'</span> <tt>Byte(s)</tt></div>'
			);
			
			if( p.data.idb ){
				this.hMain.app( jno2('<section class="_w_box">').data("module","idb") );

				jno2.each( p.data.idb._opts, function( v, k ){
					slf.getModule("idb").val(
						'<div class="elt"><tt>'+libpcap.idbOpts[k]+' : </tt> <span class="val">'+(v.opts_payload)+'</span> </div>',1
					);
				return 1;
				});
			}
			if( p.data.shb ){
				this.hMain.app( jno2('<section class="_w_box">').data("module","shb") );

				jno2.each( p.data.shb.opts, function( v, k ){
					slf.getModule("shb").val(
						'<div class="elt"><tt>'+libpcap.shbOpts[k]+' : </tt> <span class="val">'+(v.opts_payload)+'</span> </div>',1
					);
				return 1;
				});
				/**/
			}
			/**/
			this.hMain.val("<section data-module='btn'></section>",1);
			jno2( this.newButton("btn", "", "Close","",function( ){
				this.close( );
			}) ).rmClass("button").Class("down");

			/*dump opts*/
			this.getModule("dump").val(
			'<label for="b16"><input type="checkbox" id="b16" checked>Dump16</label><label for="b32"><input type="checkbox" id="b32" >Dump32</label>'
			).child("input").on("change",function( e ){
				var tmp = jno2( e.currentTarget );
				
				if( tmp.checked( ) ){
					
					this.eq( tmp.id( ) == "b32" ? 0 : 1 ).checked( !1 );
					libw.updateHexdump( 
						p.data.frame[ p.selected ].packet,
					        p.opts.dump = tmp.id( ) == "b32" ? 32 : 16
					);
				}
			});
			
		}else
		(this.close( ),req("LprocessManager").createProcess(
			"msgbox",
			p.token,
			{ title:"Wireshark", msg: "No information available !" },
			0x100 | 0x80 | 0x0c
		));;
		// KeyBoardInterrpt shortcut
		this.on('keyboardInterrupt',function( _ ){
			if( ( _.ctrl || _.alt ) && _.uint8 == 81 ){
				slf.close( );
			}
		}).handle.height("auto");
		//
	return this;
	},
	
	};
return 1;
};
});
_export("GwiresharkStaticIPv",[],function( req, def, o ){
	
return function( _, parent, d, i  ){
	
	if( !parent )
	return 0;;

	// window structure
	this.title  = "Wireshark - Source and Destination Addresses";
	this.width  = 800;
	this.height = 600
	this.top    = this.left = 350;
	this.swind.close = ( this.swind.hide = 0 )+1;
	
	this.swind.parent = parent;
	this.swind.free = 1;
	

	this.output={
	
	__sectionTxt:("<section class='_w_box'>Source<div id='idf_'><div id='idf' ></div></div></section>"+
		      "<section class='_w_box'>Destination<div id='idf_'><div id='idf'></div></div></section>"),
		
	__main:function( _, parent, type  ){
		var slf = this,
		p   = this.getParent( ), tmp, i=k=0;
		
		this.hMain.css("fontFamily","systemL");
		this.find("section").css({ margin:0,padding:0});
		this.find("#idf").css({background:"#fff" });

		this.items_src = contenerResize( 
			[{ name:'Topic / Item', width:"400" },{ name:'Count', width:"20" },{ name:'Perc' }],
			this.find("#idf").eq(0) 
		);
		this.items_src.click =function( hdl ){
			this.select( hdl );
		};
		this.items_dst = contenerResize( 
			[{ name:'Topic / Item', width:"400" },{ name:'Count', width:"20" },{ name:'Perc' }],
			this.find("#idf").eq(1) 
		);
		this.items_dst.click =function( hdl ){
			this.select( hdl );
		};

		jno2.each( p.stat[type]._src, function( v ){
			k+=v;
		return 1;
		});
		this.items_src.add(["Source "+type+" Addresses",""+k,"100%"],i );
		while( ( tmp = p.stat[type].src[ i ] ) ){
			this.items_src.add(
				[ 
					type == "ipv4" ?
					net.ipToStr( p.stat.ipv4.src[ i ]) :
					net.ipv6AddrToStr( p.stat.ipv6.src[ i ]),

					p.stat[type]._src[i], (Math.round( ( (p.stat[type]._src[i]/k)*100 )*100 )/100)+"%"
				],i+1
			);
		i++;
		}
		

		i=k=0;
		jno2.each( p.stat[type]._dst, function( v ){
			k+=v;
		return 1;
		});
		this.items_dst.add(["Destination "+type+" Addresses",""+k,"100%"],i );
		while( ( tmp = p.stat[type].dst[ i ] ) ){
			this.items_dst.add(
				[ 
					type == "ipv4" ?
					net.ipToStr( p.stat.ipv4.dst[ i ]) :
					net.ipv6AddrToStr( p.stat.ipv6.dst[ i ] ),

					p.stat[type]._dst[i], (Math.round( ( (p.stat[type]._dst[i]/k)*100 )*100 )/100)+"%"
				],i+1
			);
		i++;
		}

		// KeyBoardInterrpt shortcut
		this.on('keyboardInterrupt',function( _ ){
			if( ( _.ctrl || _.alt ) && _.uint8 == 66 ){
				this.close( );
			}
		});
		//
	return this;
	},
	
	};
return 1;
};
});
_export("GwiresharkHexdump",["LGwireshark"],function( req, def, o, libw ){
	
return function( _, parent, d, i  ){
	// window structure
	this.title  = "Wireshark - frame [ "+i+" ]";
	this.width  = 800;
	this.height = 500
	this.top    = this.left = 350;
	this.swind.close = ( this.swind.hide = 0 )+1;
	
	this.swind.parent = parent;
	this.swind.free = 1;

	this.output={
	
	__sectionTxt:("<section class='_w_box'></section><section class='_w_box'><div id='idf_'><div id='idf' class='dump_w_'></div></div></section>"),
		
	__main:function( _, parent, __data__  ){
		var slf = this,
		p   = this.getParent( ),
		s = (p.opts.dump == 16 ? 1 : 0),
		pcm = { };
		
		pcm = {
			proto:[
				["null:Hexdump x16:"+s+":1:Alt+b"],["null:Hexdump x32:"+(!(s)*1)+":1:Alt+b"]
			],
			t:this.hMain.child(".dump_w_")
		};
		req("LcontextMenu").contextMenu( pcm, pcm.t, pcm.proto );
		pcm.contextMenu.click = function( ){
			
			this.proto[0][0] = "null:Hexdump x16:"+((p.opts.dump == 16 ? 1 : 0))+":1:Alt+b";
			this.proto[1][0] = "null:Hexdump x32:"+((p.opts.dump == 32 ? 1 : 0))+":1:Alt+b";
		};
		pcm.contextMenu.event = function(_,s){
				
			libw.updateHexdump( 
				p.data.frame[ p.selected ].packet,
				( p.opts.dump = s == "0:0" ? 16 : 32 )
			);
		};

	
		libw.hexdump(
			this.hMain.child(".dump_w_"),
			__data__,
			this.getParent( ).opts.dump
		);
		// KeyBoardInterrpt shortcut
		this.on('keyboardInterrupt',function( _ ){
			if( ( _.ctrl || _.alt ) && _.uint8 == 66 ){
				
				libw.updateHexdump( 
					p.data.frame[ p.selected ].packet,
					( p.opts.dump = p.opts.dump == 32 ? 16 : 32 )
				);
			}
		});
		//
	return this;
	},
	
	};
return 1;
};
});
