"use strict";

( function ( window ) {
	var
		options = {
			DEBUG : {},
			cacheProtection : false,
			urlPrefix : 'scripts/',
			modules : {}
		},

		scrRegexp = new RegExp( 'scripts/(.+?)/([^/]+?)]\\.js$', 'i' ),
		definedCnt = 0,
		factories = {},
		scripts = {},
		dependencies = {},

		_getScriptPrefix = function( n ) {
			// Idea was found at http://www.eriwen.com/javascript/js-stack-trace/
			// This is not cross-browser, possible...
			var ss = ( ( new Error ).stack.split( '\n' ) ), m, i;
			for ( i = ss.length; i--; ) if ( ( m = ss[ i ].match( scrRegexp ) ) && m[ 2 ] === n ) break;
			return m ? m[ 1 ] + '/' : '';
		},
		_getDeps = function ( deps ) {
			var r = [], il = deps.length, i = 0, m;
			for ( ; m = options.modules[ deps[ i ] ], r[ i ] = m, i < il; i++ ) if ( !m ) throw new TypeError( 'Module ' + deps[ i ] + ' not available' );
			return r;
		},
		_dependencyRiched = function ( name ) {
			var a, d = dependencies[ name ], i;
			for ( a in dependencies ) {
				if ( dependencies.hasOwnProperty( a ) ) {
					if ( ( i = dependencies[ a ].indexOf( name ) ) !== -1 ) dependencies[ a ].splice( i, 1 );
					if ( !dependencies[ a ].length ) {
						options.modules[ a ] = factories[ a ]();
						delete dependencies[ a ];
						setTimeout( ( function ( a ) {
							return function () {
								_dependencyRiched( a );
							}
						} ) ( a ), 0 );
					}
				}
			}
		},
		_scriptLoaded = function ( res, name ) {
			if ( !res ) throw new TypeError( 'Module ' + name + ' not loaded' );
			if ( !scripts[ name ] || scripts[ name ] === true ) return;
			clearTimeout( scripts[ name ] );
			scripts[ name ] = true;
		},
		_loadScript = function ( name, url ) {
			var prefix = name.split( '/' ), s;
			if ( options.modules[ name ] ) throw new TypeError( 'Script with module ' + name + ' already loaded' );
			if ( scripts[ name ] ) return;
			prefix.pop();
			s = document.createElement( "script" );
			if ( prefix.length ) s.__prefix = prefix.join( '/' ) + '/';
			s.type = 'text/javascript';
			s.async = true;
			s.src = url || ( options.urlPrefix + name + '.js' + ( options.cacheProtection ? '?_=' + ( new Date ).getTime() : '' ) );
			scripts[ name ] = setTimeout( function () {
				// TODO Timeout (... Trying to re-request is a good idea
				_scriptLoaded( false, name );
				s.onload = s.onerror = null;
			}, 45000 ); // TODO Move to some 'constant' in head of file
			s.onerror = function () {
				// TODO Throw error, module can't be loaded
				_scriptLoaded( false, name );
				s.onload = s.onerror = null;
			};
			( document.getElementsByTagName( "body" )[ 0 ] || document.getElementsByTagName( "head" )[ 0 ] ).appendChild( s );
		};

	window.define = function ( name, deps, factory, skipSat ) {
		var
			creator = function () {
				var t = { _moduleName : name, DEBUG : options.DEBUG[ name ] };
				return factory ? ( factory.apply( t, deps ? _getDeps( deps ) : [] ) || t ) : true;
			},
			dep = [], i;

		if ( !name ) throw new TypeError( 'Empty module name' );
		name = _getScriptPrefix( name ) + name;
		skipSat || _scriptLoaded( true, name );
		if ( options.modules[ name ] ) throw new TypeError( 'Module ' + name + ' already defined' );
		if ( deps && deps.length ) {
			for ( i = deps.length; i--; ) {
				if ( !options.modules[ deps[ i ] ] ) {
					dep[ dep.length ] = deps[ i ];
					_loadScript( deps[ i ] );
				}
			}
		}
		if ( !dep.length ) {
			options.modules[ name ] = creator();
			_dependencyRiched( name );
		} else {
			// TODO Add cross-dependencies check
			factories[ name ] = creator;
			dependencies[ name ] = dep;
		}
	};

	window.define.options = function ( opts ) {
		var a;
		for ( a in opts ) if ( opts.hasOwnProperty( a ) ) options[ a ] = opts[ a ];
		if ( options.urlPrefix !== '' ) options.urlPrefix += '/';
		// TODO Possibly escaping of options.urlPrefix needed
		scrRegexp = new RegExp( options.urlPrefix + '(.+?)/([^/]+?)\\.js', 'i' );
		options.DEBUG || ( options.DEBUG = {} );
	};

	window.require = function ( modules, callBack ) {
		if ( modules && modules.length ) {
			window.define( '__' + ( definedCnt++ ), modules, callBack, true );
		} else {
			callBack();
		}
	};

	/*
	 window.require = function ( name ) {
	 if ( !options.modules[ name ] ) throw new TypeError( 'Module ' + name + ' not defined' );
	 return options.modules[ name ];
	 }
	 */

} )( window );