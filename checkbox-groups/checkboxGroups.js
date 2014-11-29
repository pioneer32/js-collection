"use strict";
document.addEventListener( "DOMContentLoaded", function _initCheckboxGroups () {
	var
		GROUP_PREFIX = 'chkbx-gr',
		UNDEFINED_CLASS = 'undef',
		d = document,
		fe = d.createEventObject ? function ( el, oe ) {
			var evt = d.createEventObject();
			evt.__forwardedEvent = oe;
			return el.fireEvent( 'on' + oe.type, evt );
		} : function ( el, oe ) {
			var evt = d.createEvent( "HTMLEvents" );
			evt.__forwardedEvent = oe;
			evt.initEvent( oe.type, true, true );
			return !el.dispatchEvent( evt );
		},
		geh = function ( m, is ) {
			return function ( ev ) {
				if ( ev.__forwardedEvent ) return;
				console.log( this.checked, ev );
				var s, i;
				if ( this === m  ) {
					if ( this.classList.contains( UNDEFINED_CLASS ) ) {
						s = false;
						m.classList.remove( UNDEFINED_CLASS );
					} else {
						s = this.checked;
					}
					for ( i = is.length; i--; ) {
						if ( is[ i ].checked !== s ) {
							is[ i ].checked = s;
							if ( is[ i ] !== this ) fe( is[ i ], ev );
						}
					}
				} else {
					for ( s =  m.classList.contains( UNDEFINED_CLASS ), i = is.length; i--; ) {
						if ( is[ i ].checked !== this.checked && is[ i ] !== m ) {
							m.checked = false;
							if ( !this.checked && !s ) fe( m, ev );
							m.classList.add( UNDEFINED_CLASS );
							return;
						}
					}
					if ( m.checked != this.checked ) {
						m.checked = this.checked;
						fe( m, ev );
					}
					m.classList.remove( UNDEFINED_CLASS );
				}
			}
		},
		cms = d.querySelectorAll( 'input.' + GROUP_PREFIX + '-master' ),
		cm, cis, cbs, i, j, r;
	d.removeEventListener( "DOMContentLoaded", _initCheckboxGroups, false );
	for ( i = cms.length; i-- ; ) {
		cm = cms[ i ];
		for ( r = new RegExp( GROUP_PREFIX + '-[a-z0-9A-Z]' ), cis = d.querySelectorAll( 'input.' + cm.className.match( r ) ), cbs = geh( cm, cis ), j = cis.length; j--; ) cis[ j ].addEventListener( 'change', cbs, false );
	}
}, false );

