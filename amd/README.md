# js-collection

## Simple implementation of AMD (Advanced module Definition)
=============

Just add follow line to your &lt;HEAD&gt; section:<br/>
```html
<script type="text/javascript" src="pathToCheckboxGroupsFile/amd.js"></script>
```

Also you can redefine some options, in your &lt;HEAD&gt; section (or before your first define(...) using):
```html
<script type="text/javascript">
    define.options( {
        urlPrefix : "scripts", /* prefix for scripts URLs, all modules must be placed in urlPrefix + moduleName + '.js' */
        modules : {} /* if you nedd to store all modules in some place then add this "host" object and all loaded modules will be inside ) */
		DEBUG : {
			module3 : true /* enable debug mode for module3, see example for more details */
		},
		cacheProtection : false /* this is default option, but you can enable it and all request will be js/*.js?_=*milliseconds* */
    } );
</script>
```

Sample usage:

File `scripts/module1.js`
```js
define( 'module1', [ /* there are no dependences */ ], function () {
    this.moduleName = 'Module1';
    this.getModuleName = function () {
        return this.moduleName;
    };
} );
```

File `scripts/test/module2.js`
```js
define( 'module2', [ /* there are no dependences too */ ], function () {
    this.moduleName = 'Module2';
    this.getModuleName = function () {
        return this.moduleName;
    };
} );
```

File `scripts/module3.js`
```js
define( 'module3', [ 'module1' ], function ( module1 ) {
    this.moduleName = 'Module3';
    this.getModuleName = function () {
        return this.moduleName + ' [' + module1.getModuleName() + ']';
    };
} );
```

File `main.html`
```html
...
<script type="text/javascript">
    document.addEventListener( "DOMContentLoaded", function () {
        defined( [ 'test/module2', 'module3' ], function ( module2, module3 ) {
            /* this code will run after modules module1, module2 and module3 will be loaded */
            console.log( module2.getModuleName(), module3.getModuleName() );
        } );
    } );
</script>
```

Console output:
`Module2, Module3 [Module1]`
