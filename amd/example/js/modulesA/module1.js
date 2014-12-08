"use strict";

define( 'module1', [ /* there are no dependences */ ], function () {
	this.moduleName = 'Module1';
	this.getModuleName = function () {
		return this.moduleName;
	};
} );