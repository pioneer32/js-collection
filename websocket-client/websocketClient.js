"use strict";

if ( 'WebSocket' in window ) {
	window.WebSocketConnection = function ( url ) {
		return new ( function () {
			var
				_isConnected = false,
				_pool = [],
				ws = null,
				_ondisconnect = function( ev ) {
					_isConnected = false;
					ws.onopen = null;
					ws.onmessage = null;
					ws.onerror = ws.onclose = null;
					try {
						ws.close();
						ws = null;
					} catch ( e ) { }
					setTimeout( function(){
						ws = newWsInstance();
					}, 5000 );
				},
				_onmessage = function ( ev ) {
					if ( this.onmessage ) this.onmessage( ev.data );
				}.bind( this ),
				_onopen = function ( ev ) {
					_isConnected = true;
					for ( var i = 0; i < _pool.length; i++ ) {
						ws.send( _pool[ i ].msg );
						if ( _pool[ i ].cb ) _pool[ i ].cb();
					}
					_pool = [];
				},
				newWsInstance = function () {
					var ws = new WebSocket( url );
					ws.onopen = _onopen;
					ws.onmessage = _onmessage;
					ws.onerror = ws.onclose = _ondisconnect;
					return ws;
				};

			this.send = function ( message, callBack ) {
				if ( _isConnected ) {
					ws.send( message );
					if ( callBack ) callBack();
				} else {
					_pool[ _pool.length ] = {
						msg : message,
						cb : callBack
					}
				}
			};
			ws = newWsInstance();
		} );
	}
} else {
	throw new Error( 'WebSockets not supported' );
}
