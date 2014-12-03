# js-collection

## Simple implementation of AMD (Advanced module Definition)
=============

Just add follow line to your &ltHEAD&gt section:<br/>
```html
<script type="text/javascript" src="pathToCheckboxGroupsFile/amd.js"></script>
```

Also you can redefine some options, in your &ltHEAD&gt section (or before your first define(...) using):
```html
<script type="text/javascript">
    define.options( {
        urlPrefix : "scripts", /* prefix for scripts URLs, all modules must be placed in urlPrefix + moduleName + '.js' */
        modules : {} /* this is "host" object for all loaded modules */
    } );
</script>
```

Sample usage:

File `module1.js`
```js
define( 'module1', [ /* there are no dependences */ ], function () {
    this.moduleName = 'Module1';
    this.getModuleName = function () {
        return this.moduleName;
    };
} );
```

File `module2.js`
```js
define( 'module2', [ /* there are no dependences too */ ], function () {
    this.moduleName = 'Module2';
    this.getModuleName = function () {
        return this.moduleName;
    };
} );
```

File `module3.js`
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
        defined( [ 'module2', 'module3' ], function ( module2, module3 ) {
            /* this code will run after modules module1, module2 and module3 will be loaded */
            console.log( module2.getModuleName(), module3.getModuleName() );
        } );
    } );
</script>
```

Console output:
`Module2, Module3 [Module1]`
