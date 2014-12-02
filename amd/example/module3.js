"use strict";

define( 'module3', [ 'module1' ], function ( module1 ) {
	this.moduleName = 'Module3';
	this.getModuleName = function () {
		return this.moduleName + ' [' + module1.getModuleName() + ']';
	};
} );