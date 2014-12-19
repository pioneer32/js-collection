"use strict";
/**
 * @author Vladislav Churakov <pioneer32@mail.ru>
 * @link https://github.com/pioneer32/js-collection/tree/master/amd
 */
( function ( window ) {
	var
		options = {
			DEBUG : {},
			cacheProtection : false,
			urlPrefix : 'scripts/',
			modules : {}
		},

		working = false,

		scrRegexp = new RegExp( 'scripts/(.+?)/([^/]+?)]\\.js$', 'i' ),
		definedCnt = 0,
		creators = {},
		scripts = {},
		dependencies = {},

		_noop = function () {},

		_isFunc = function ( subj ) {
			return subj && Object.prototype.toString.call( subj ) === '[object Function]';
		},

		_isArray = function ( subj ) {
			return subj && Object.prototype.toString.call( subj ) === '[object Array]';
		},

		_getScriptPrefix = function( n ) {
			// Idea was found at http://www.eriwen.com/javascript/js-stack-trace/
			// This is not cross-browser, possible...
			var ss = ( ( new Error ).stack.split( '\n' ) ), m, i;
			for ( i = ss.length; i--; ) if ( ( m = ss[ i ].match( scrRegexp ) ) && m[ 2 ] === n ) break;
			return m ? m[ 1 ] + '/' : '';
		},
		_getDeps = function ( deps ) {
			var r = [], i = 0, il, m;
			if ( _isArray( deps ) ) for ( il = deps.length; m = options.modules[ deps[ i ] ], r[ i ] = m, i < il; i++ ) if ( !m ) throw new TypeError( 'Module ' + deps[ i ] + ' not available' );
			return r;
		},
		_dependencyRiched = function ( name ) {
			var a, d = dependencies[ name ], i;
			for ( a in dependencies ) {
				if ( dependencies.hasOwnProperty( a ) ) {
					if ( ( i = dependencies[ a ].indexOf( name ) ) !== -1 ) {
						dependencies[ a ].splice( i, 1 );
						if ( !dependencies[ a ].length ) creators[ a ]();
					}
				}
			}
		},
		_scriptLoaded = function ( res, name ) {
			if ( !res ) throw new TypeError( 'Module ' + name + ' not loaded' );
			if ( scripts[ name ] === true ) return;
			if ( scripts[ name ] ) clearTimeout( scripts[ name ] );
			scripts[ name ] = true;
		},
		_loadScript = function ( name, url ) {
			var prefix = name.split( '/' ), s;
			prefix.pop();
			s = document.createElement( "script" );
			if ( prefix.length ) s.__prefix = prefix.join( '/' ) + '/';
			s.type = 'text/javascript';
			s.async = true;
			s.src = url || ( options.urlPrefix + name + '.js' + ( options.cacheProtection ? '?_=' + ( new Date ).getTime() : '' ) );
			scripts[ name ] = setTimeout( function () {
				// TODO Timeout (... Trying to re-request is a good idea
				/*
				 _scriptLoaded( false, name );
				 s.onload = s.onerror = null;
				 */
			}, 45000 ); // TODO Move to some 'constant' in head of file
			s.onerror = function () {
				// TODO Throw error, module can't be loaded
				_scriptLoaded( false, name );
				s.onload = s.onerror = null;
			};
			( document.getElementsByTagName( "body" )[ 0 ] || document.getElementsByTagName( "head" )[ 0 ] ).appendChild( s );
		},
		_registerModule = function ( name, module ) {
			options.modules[ name ] = module || true;
			delete creators[ name ];
			delete dependencies[ name ];
			setTimeout( ( function ( a ) {
				return function () {
					_dependencyRiched( a );
				}
			} ) ( name ), 0 );
		},
		_initModule = function ( name, deps, creator ) {
			var dep = [], i;
			if ( _isArray( deps ) ) {
				for ( i = deps.length; i--; ) {
					if ( !options.modules[ deps[ i ] ] ) {
						dep[ dep.length ] = deps[ i ];
						if ( scripts[ deps[ i ] ] ) continue;
						_loadScript( deps[ i ] );
					}
				}
			}
			if ( !dep.length ) {
				creator();
			} else {
				// TODO Add cross-dependencies check
				creators[ name ] = creator;
				dependencies[ name ] = dep;
			}
		};

	window.define = function ( mod, deps, factory ) { // or just define( mod ) or define( mod, factory )
		working = true;
		if ( typeof mod !== "string" && mod.__moduleName  ) {
			_registerModule( mod.__moduleName, mod );
		} else {
			if ( !mod ) throw new TypeError( 'Empty module name' );
			mod = _getScriptPrefix( mod ) + mod;
			_scriptLoaded( true, mod );
			if ( options.modules[ mod ] ) throw new TypeError( 'Module ' + mod + ' already defined' );
			if ( !deps && !factory ) {
				_registerModule( mod, true );
			} else {
				if ( _isFunc( deps ) ) factory = deps;
				_initModule( mod, deps, function () {
					var t = { __moduleName : mod, DEBUG : options.DEBUG[ mod ] };
					_registerModule( mod, factory ? ( factory.apply( t, _getDeps( deps ) ) || t ) : true );
				} );
			}
		}
	};

	window.define.options = function ( opts ) {
		var a;
		if ( working ) throw new TypeError( 'Can\'t apply new options (... ' );
		for ( a in opts ) if ( opts.hasOwnProperty( a ) ) options[ a ] = opts[ a ];
		if ( options.urlPrefix !== '' ) options.urlPrefix += '/';
		// TODO Possibly escaping of options.urlPrefix needed
		scrRegexp = new RegExp( options.urlPrefix + '(.+?)/([^/]+?)\\.js', 'i' );
		options.DEBUG || ( options.DEBUG = {} );
	};

	window.expect = function ( mod, deps, factory ) { // or just expect( mod, factory )
		working = true;
		if ( typeof mod !== "string" ) throw new TypeError( 'For direct module define you should use define(...)' );
		if ( !mod ) throw new TypeError( 'Empty module name' );
		mod = _getScriptPrefix( mod ) + mod;
		_scriptLoaded( true, mod );
		if ( options.modules[ mod ] ) throw new TypeError( 'Module ' + mod + ' already defined' );
		if ( _isFunc( deps ) ) factory = deps;
		if ( !_isFunc( factory ) ) throw new TypeError( 'Factory must be a Function' );
		_initModule( mod, deps, function () {
			factory.apply( { __moduleName : mod, DEBUG : options.DEBUG[ mod ] }, _getDeps( deps ) );
		} );
	};

	window.require = function ( modules, callBack ) { // or just require( modules )
		working = true;
		if ( _isArray( modules ) && modules.length ) {
			_initModule( '__' + ( definedCnt++ ), modules, _isFunc( callBack ) ? function () {
				callBack.apply( {}, _getDeps( modules ) );
			} : _noop );
		} else {
			throw new TypeError( 'Required list of modules is empty' );
		}
	};

} )( window );
