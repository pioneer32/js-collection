"use strict";

define( 'module2', [ /* there are no dependences too */ ], function () {
	this.moduleName = 'Module2';
	this.getModuleName = function () {
		return this.moduleName;
	};
} );