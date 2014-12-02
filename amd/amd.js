"use strict";

( function ( window ) {
	var
		options = {
			urlPrefix : 'scripts/',
			modules : {}
		},
		definedCnt = 0,
		scripts = {},
		dependences = {},
		_getDeps = function ( deps ) {
			var r = [], il = deps.length, i = 0, m;
			for ( ; m = options.modules[ deps[ i ] ], r[ i ] = m, i < il; i++ ) if ( !m ) return false;
			return r;
		},
		_testSatisfaction = function ( name ) {
			var d = dependences[ name ], i;
			if ( d ) {
				if ( i = d.length ) for ( ; i--;  ) if ( d[ i ]() ) d.splice( i, 1 );
				if ( !d.length ) delete dependences[ name ];
			}
		},
		_scriptLoaded = function ( res, name ) {
			if ( !scripts[ name ] ) return;
			clearTimeout( scripts[ name ] );
			delete scripts[ name ];
		},
		_loadScript = function ( name, url ) {
			var s;
			if ( scripts[ name ] ) return;
			s = document.createElement( "script" );
			s.type = 'text/javascript';
			s.async = true;
			s.src = url || ( options.urlPrefix + name + '.js' );
			scripts[ name ] = setTimeout( function () {
				// TODO Timeout (... Trying to re-request is a good idea
				_scriptLoaded( false, name );
				s.onload = s.onerror = null;
			}, 30000 );
			s.onerror = function () {
				// TODO Throw error, module not available
				_scriptLoaded( false, name );
				s.onload = s.onerror = null;
			};
			( document.getElementsByTagName( "body" )[ 0 ] || document.getElementsByTagName( "head" )[ 0 ] ).appendChild( s );
		};

	window.define = function ( name, deps, factory, skipSat ) {
		var al = true, t = {}, i, dep, cb;
		skipSat || _scriptLoaded( true, name );
		if ( options.modules[ name ] ) throw new TypeError( 'Module ' + name + ' already defined' );
		if ( deps && deps.length ) {
			cb = function () {
				var d = _getDeps( deps ), t = {};
				if ( d ) {
					options.modules[ name ] = factory.apply( t, d ) || t;
					skipSat || _testSatisfaction( name );
					return true;
				}
			};
			for ( i = deps.length; i--; ) {
				dep = deps[ i ];
				if ( !options.modules[ deps[ i ] ] ) {
					al = false;
					( dependences[ dep ] || ( dependences[ dep ] = [] ) ).push( cb );
					_loadScript( dep );
				}
			}
		}
		if ( al ) {
			options.modules[ name ] = factory.apply( t, deps ? _getDeps( deps ) : [] ) || t;
			_testSatisfaction( name );
		}
	};

	window.define.options = function ( opts ) {
		var a;
		for ( a in opts ) if ( opts.hasOwnProperty( a ) ) options[ a ] = opts[ a ];
		if ( options.urlPrefix !== '' ) options.urlPrefix += '/';
	};

	window.defined = function ( deps, callBack ) {
		if ( deps && deps.length ) {
			window.define( '__' + ( definedCnt++ ), deps, callBack, true );
		} else {
			callBack();
		}
	};
} )( window );