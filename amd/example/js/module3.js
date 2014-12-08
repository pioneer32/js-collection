"use strict";

define( 'module3', [ 'modulesA/module1', 'modulesB/module1' ], function ( moduleA1 ) {
	if ( this.DEBUG ) console.log( 'Module 3 in debug mode' );
	this.moduleName = 'Module3';
	this.getModuleName = function () {
		return this.moduleName + ' [modulesA/' + moduleA1.getModuleName() + ']';
	};
	console.log( window.module1 );
} );