<<<<<<< HEAD
/*!
 * jQuery JavaScript Library v1.9.1
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2012 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-2-4
 */
(function( window, undefined ) {

// Can't do this because several apps including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
// Support: Firefox 18+
//"use strict";
var
	// The deferred used on DOM ready
	readyList,

	// A central reference to the root jQuery(document)
	rootjQuery,

	// Support: IE<9
	// For `typeof node.method` instead of `node.method !== undefined`
	core_strundefined = typeof undefined,

	// Use the correct document accordingly with window argument (sandbox)
	document = window.document,
	location = window.location,

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// [[Class]] -> type pairs
	class2type = {},

	// List of deleted data cache ids, so we can reuse them
	core_deletedIds = [],

	core_version = "1.9.1",

	// Save a reference to some core methods
	core_concat = core_deletedIds.concat,
	core_push = core_deletedIds.push,
	core_slice = core_deletedIds.slice,
	core_indexOf = core_deletedIds.indexOf,
	core_toString = class2type.toString,
	core_hasOwn = class2type.hasOwnProperty,
	core_trim = core_version.trim,

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context, rootjQuery );
	},

	// Used for matching numbers
	core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,

	// Used for splitting on whitespace
	core_rnotwhite = /\S+/g,

	// Make sure we trim BOM and NBSP (here's looking at you, Safari 5.0 and IE)
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	rquickExpr = /^(?:(<[\w\W]+>)[^>]*|#([\w-]*))$/,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,

	// JSON RegExp
	rvalidchars = /^[\],:{}\s]*$/,
	rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,
	rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
	rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	},

	// The ready event handler
	completed = function( event ) {

		// readyState === "complete" is good enough for us to call the dom ready in oldIE
		if ( document.addEventListener || event.type === "load" || document.readyState === "complete" ) {
			detach();
			jQuery.ready();
		}
	},
	// Clean-up method for dom ready events
	detach = function() {
		if ( document.addEventListener ) {
			document.removeEventListener( "DOMContentLoaded", completed, false );
			window.removeEventListener( "load", completed, false );

		} else {
			document.detachEvent( "onreadystatechange", completed );
			window.detachEvent( "onload", completed );
		}
	};

jQuery.fn = jQuery.prototype = {
	// The current version of jQuery being used
	jquery: core_version,

	constructor: jQuery,
	init: function( selector, context, rootjQuery ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;

					// scripts is true for back-compat
					jQuery.merge( this, jQuery.parseHTML(
						match[1],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {
							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The default length of a jQuery object is 0
	length: 0,

	// The number of elements contained in the matched element set
	size: function() {
		return this.length;
	},

	toArray: function() {
		return core_slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this[ this.length + num ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;
		ret.context = this.context;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	ready: function( fn ) {
		// Add the callback
		jQuery.ready.promise().done( fn );

		return this;
	},

	slice: function() {
		return this.pushStack( core_slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[j] ] : [] );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: core_push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	var src, copyIsArray, copy, name, options, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	noConflict: function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		if ( !document.body ) {
			return setTimeout( jQuery.ready );
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );

		// Trigger any bound ready events
		if ( jQuery.fn.trigger ) {
			jQuery( document ).trigger("ready").off("ready");
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type(obj) === "array";
	},

	isWindow: function( obj ) {
		return obj != null && obj == obj.window;
	},

	isNumeric: function( obj ) {
		return !isNaN( parseFloat(obj) ) && isFinite( obj );
	},

	type: function( obj ) {
		if ( obj == null ) {
			return String( obj );
		}
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ core_toString.call(obj) ] || "object" :
			typeof obj;
	},

	isPlainObject: function( obj ) {
		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		try {
			// Not own constructor property must be Object
			if ( obj.constructor &&
				!core_hasOwn.call(obj, "constructor") &&
				!core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
				return false;
			}
		} catch ( e ) {
			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.

		var key;
		for ( key in obj ) {}

		return key === undefined || core_hasOwn.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	error: function( msg ) {
		throw new Error( msg );
	},

	// data: string of html
	// context (optional): If specified, the fragment will be created in this context, defaults to document
	// keepScripts (optional): If true, will include scripts passed in the html string
	parseHTML: function( data, context, keepScripts ) {
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		if ( typeof context === "boolean" ) {
			keepScripts = context;
			context = false;
		}
		context = context || document;

		var parsed = rsingleTag.exec( data ),
			scripts = !keepScripts && [];

		// Single tag
		if ( parsed ) {
			return [ context.createElement( parsed[1] ) ];
		}

		parsed = jQuery.buildFragment( [ data ], context, scripts );
		if ( scripts ) {
			jQuery( scripts ).remove();
		}
		return jQuery.merge( [], parsed.childNodes );
	},

	parseJSON: function( data ) {
		// Attempt to parse using the native JSON parser first
		if ( window.JSON && window.JSON.parse ) {
			return window.JSON.parse( data );
		}

		if ( data === null ) {
			return data;
		}

		if ( typeof data === "string" ) {

			// Make sure leading/trailing whitespace is removed (IE can't handle it)
			data = jQuery.trim( data );

			if ( data ) {
				// Make sure the incoming data is actual JSON
				// Logic borrowed from http://json.org/json2.js
				if ( rvalidchars.test( data.replace( rvalidescape, "@" )
					.replace( rvalidtokens, "]" )
					.replace( rvalidbraces, "")) ) {

					return ( new Function( "return " + data ) )();
				}
			}
		}

		jQuery.error( "Invalid JSON: " + data );
	},

	// Cross-browser xml parsing
	parseXML: function( data ) {
		var xml, tmp;
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		try {
			if ( window.DOMParser ) { // Standard
				tmp = new DOMParser();
				xml = tmp.parseFromString( data , "text/xml" );
			} else { // IE
				xml = new ActiveXObject( "Microsoft.XMLDOM" );
				xml.async = "false";
				xml.loadXML( data );
			}
		} catch( e ) {
			xml = undefined;
		}
		if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	},

	noop: function() {},

	// Evaluates a script in a global context
	// Workarounds based on findings by Jim Driscoll
	// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
	globalEval: function( data ) {
		if ( data && jQuery.trim( data ) ) {
			// We use execScript on Internet Explorer
			// We use an anonymous function so that context is window
			// rather than jQuery in Firefox
			( window.execScript || function( data ) {
				window[ "eval" ].call( window, data );
			} )( data );
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	// args is for internal usage only
	each: function( obj, callback, args ) {
		var value,
			i = 0,
			length = obj.length,
			isArray = isArraylike( obj );

		if ( args ) {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			}
		}

		return obj;
	},

	// Use native String.trim function wherever possible
	trim: core_trim && !core_trim.call("\uFEFF\xA0") ?
		function( text ) {
			return text == null ?
				"" :
				core_trim.call( text );
		} :

		// Otherwise use our own trimming functionality
		function( text ) {
			return text == null ?
				"" :
				( text + "" ).replace( rtrim, "" );
		},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArraylike( Object(arr) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				core_push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		var len;

		if ( arr ) {
			if ( core_indexOf ) {
				return core_indexOf.call( arr, elem, i );
			}

			len = arr.length;
			i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

			for ( ; i < len; i++ ) {
				// Skip accessing in sparse arrays
				if ( i in arr && arr[ i ] === elem ) {
					return i;
				}
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var l = second.length,
			i = first.length,
			j = 0;

		if ( typeof l === "number" ) {
			for ( ; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}
		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var retVal,
			ret = [],
			i = 0,
			length = elems.length;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value,
			i = 0,
			length = elems.length,
			isArray = isArraylike( elems ),
			ret = [];

		// Go through the array, translating each of the items to their
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}
		}

		// Flatten any nested arrays
		return core_concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var args, proxy, tmp;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = core_slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( core_slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	// Multifunctional method to get and set values of a collection
	// The value/s can optionally be executed if it's a function
	access: function( elems, fn, key, value, chainable, emptyGet, raw ) {
		var i = 0,
			length = elems.length,
			bulk = key == null;

		// Sets many values
		if ( jQuery.type( key ) === "object" ) {
			chainable = true;
			for ( i in key ) {
				jQuery.access( elems, fn, i, key[i], true, emptyGet, raw );
			}

		// Sets one value
		} else if ( value !== undefined ) {
			chainable = true;

			if ( !jQuery.isFunction( value ) ) {
				raw = true;
			}

			if ( bulk ) {
				// Bulk operations run against the entire set
				if ( raw ) {
					fn.call( elems, value );
					fn = null;

				// ...except when executing function values
				} else {
					bulk = fn;
					fn = function( elem, key, value ) {
						return bulk.call( jQuery( elem ), value );
					};
				}
			}

			if ( fn ) {
				for ( ; i < length; i++ ) {
					fn( elems[i], key, raw ? value : value.call( elems[i], i, fn( elems[i], key ) ) );
				}
			}
		}

		return chainable ?
			elems :

			// Gets
			bulk ?
				fn.call( elems ) :
				length ? fn( elems[0], key ) : emptyGet;
	},

	now: function() {
		return ( new Date() ).getTime();
	}
});

jQuery.ready.promise = function( obj ) {
	if ( !readyList ) {

		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called after the browser event has already occurred.
		// we once tried to use readyState "interactive" here, but it caused issues like the one
		// discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			setTimeout( jQuery.ready );

		// Standards-based browsers support DOMContentLoaded
		} else if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", completed, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", completed, false );

		// If IE event model is used
		} else {
			// Ensure firing before onload, maybe late but safe also for iframes
			document.attachEvent( "onreadystatechange", completed );

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", completed );

			// If IE and not a frame
			// continually check to see if the document is ready
			var top = false;

			try {
				top = window.frameElement == null && document.documentElement;
			} catch(e) {}

			if ( top && top.doScroll ) {
				(function doScrollCheck() {
					if ( !jQuery.isReady ) {

						try {
							// Use the trick by Diego Perini
							// http://javascript.nwbox.com/IEContentLoaded/
							top.doScroll("left");
						} catch(e) {
							return setTimeout( doScrollCheck, 50 );
						}

						// detach all dom ready events
						detach();

						// and execute any waiting functions
						jQuery.ready();
					}
				})();
			}
		}
	}
	return readyList.promise( obj );
};

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

function isArraylike( obj ) {
	var length = obj.length,
		type = jQuery.type( obj );

	if ( jQuery.isWindow( obj ) ) {
		return false;
	}

	if ( obj.nodeType === 1 && length ) {
		return true;
	}

	return type === "array" || type !== "function" &&
		( length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj );
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);
// String to Object options format cache
var optionsCache = {};

// Convert String-formatted options into Object-formatted ones and store in cache
function createOptions( options ) {
	var object = optionsCache[ options ] = {};
	jQuery.each( options.match( core_rnotwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	});
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		( optionsCache[ options ] || createOptions( options ) ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,
		// Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list was already fired
		fired,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = !options.once && [],
		// Fire callbacks
		fire = function( data ) {
			memory = options.memory && data;
			fired = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			firing = true;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
					memory = false; // To prevent further calls using add
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( stack ) {
					if ( stack.length ) {
						fire( stack.shift() );
					}
				} else if ( memory ) {
					list = [];
				} else {
					self.disable();
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					// First, we save the current length
					var start = list.length;
					(function add( args ) {
						jQuery.each( args, function( _, arg ) {
							var type = jQuery.type( arg );
							if ( type === "function" ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && type !== "string" ) {
								// Inspect recursively
								add( arg );
							}
						});
					})( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away
					} else if ( memory ) {
						firingStart = start;
						fire( memory );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					jQuery.each( arguments, function( _, arg ) {
						var index;
						while( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
							list.splice( index, 1 );
							// Handle firing indexes
							if ( firing ) {
								if ( index <= firingLength ) {
									firingLength--;
								}
								if ( index <= firingIndex ) {
									firingIndex--;
								}
							}
						}
					});
				}
				return this;
			},
			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ? jQuery.inArray( fn, list ) > -1 : !!( list && list.length );
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				args = args || [];
				args = [ context, args.slice ? args.slice() : args ];
				if ( list && ( !fired || stack ) ) {
					if ( firing ) {
						stack.push( args );
					} else {
						fire( args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};
jQuery.extend({

	Deferred: function( func ) {
		var tuples = [
				// action, add listener, listener list, final state
				[ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks("memory") ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var action = tuple[ 0 ],
								fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];
							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[1] ](function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.done( newDefer.resolve )
										.fail( newDefer.reject )
										.progress( newDefer.notify );
								} else {
									newDefer[ action + "With" ]( this === promise ? newDefer.promise() : this, fn ? [ returned ] : arguments );
								}
							});
						});
						fns = null;
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 3 ];

			// promise[ done | fail | progress ] = list.add
			promise[ tuple[1] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(function() {
					// state = [ resolved | rejected ]
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			// deferred[ resolve | reject | notify ]
			deferred[ tuple[0] ] = function() {
				deferred[ tuple[0] + "With" ]( this === deferred ? promise : this, arguments );
				return this;
			};
			deferred[ tuple[0] + "With" ] = list.fireWith;
		});

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
			resolveValues = core_slice.call( arguments ),
			length = resolveValues.length,

			// the count of uncompleted subordinates
			remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred. If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? core_slice.call( arguments ) : value;
					if( values === progressValues ) {
						deferred.notifyWith( contexts, values );
					} else if ( !( --remaining ) ) {
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						.fail( deferred.reject )
						.progress( updateFunc( i, progressContexts, progressValues ) );
				} else {
					--remaining;
				}
			}
		}

		// if we're not waiting on anything, resolve the master
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		return deferred.promise();
	}
});
jQuery.support = (function() {

	var support, all, a,
		input, select, fragment,
		opt, eventName, isSupported, i,
		div = document.createElement("div");

	// Setup
	div.setAttribute( "className", "t" );
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";

	// Support tests won't run in some limited or non-browser environments
	all = div.getElementsByTagName("*");
	a = div.getElementsByTagName("a")[ 0 ];
	if ( !all || !a || !all.length ) {
		return {};
	}

	// First batch of tests
	select = document.createElement("select");
	opt = select.appendChild( document.createElement("option") );
	input = div.getElementsByTagName("input")[ 0 ];

	a.style.cssText = "top:1px;float:left;opacity:.5";
	support = {
		// Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
		getSetAttribute: div.className !== "t",

		// IE strips leading whitespace when .innerHTML is used
		leadingWhitespace: div.firstChild.nodeType === 3,

		// Make sure that tbody elements aren't automatically inserted
		// IE will insert them into empty tables
		tbody: !div.getElementsByTagName("tbody").length,

		// Make sure that link elements get serialized correctly by innerHTML
		// This requires a wrapper element in IE
		htmlSerialize: !!div.getElementsByTagName("link").length,

		// Get the style information from getAttribute
		// (IE uses .cssText instead)
		style: /top/.test( a.getAttribute("style") ),

		// Make sure that URLs aren't manipulated
		// (IE normalizes it by default)
		hrefNormalized: a.getAttribute("href") === "/a",

		// Make sure that element opacity exists
		// (IE uses filter instead)
		// Use a regex to work around a WebKit issue. See #5145
		opacity: /^0.5/.test( a.style.opacity ),

		// Verify style float existence
		// (IE uses styleFloat instead of cssFloat)
		cssFloat: !!a.style.cssFloat,

		// Check the default checkbox/radio value ("" on WebKit; "on" elsewhere)
		checkOn: !!input.value,

		// Make sure that a selected-by-default option has a working selected property.
		// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
		optSelected: opt.selected,

		// Tests for enctype support on a form (#6743)
		enctype: !!document.createElement("form").enctype,

		// Makes sure cloning an html5 element does not cause problems
		// Where outerHTML is undefined, this still works
		html5Clone: document.createElement("nav").cloneNode( true ).outerHTML !== "<:nav></:nav>",

		// jQuery.support.boxModel DEPRECATED in 1.8 since we don't support Quirks Mode
		boxModel: document.compatMode === "CSS1Compat",

		// Will be defined later
		deleteExpando: true,
		noCloneEvent: true,
		inlineBlockNeedsLayout: false,
		shrinkWrapBlocks: false,
		reliableMarginRight: true,
		boxSizingReliable: true,
		pixelPosition: false
	};

	// Make sure checked status is properly cloned
	input.checked = true;
	support.noCloneChecked = input.cloneNode( true ).checked;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Support: IE<9
	try {
		delete div.test;
	} catch( e ) {
		support.deleteExpando = false;
	}

	// Check if we can trust getAttribute("value")
	input = document.createElement("input");
	input.setAttribute( "value", "" );
	support.input = input.getAttribute( "value" ) === "";

	// Check if an input maintains its value after becoming a radio
	input.value = "t";
	input.setAttribute( "type", "radio" );
	support.radioValue = input.value === "t";

	// #11217 - WebKit loses check when the name is after the checked attribute
	input.setAttribute( "checked", "t" );
	input.setAttribute( "name", "t" );

	fragment = document.createDocumentFragment();
	fragment.appendChild( input );

	// Check if a disconnected checkbox will retain its checked
	// value of true after appended to the DOM (IE6/7)
	support.appendChecked = input.checked;

	// WebKit doesn't clone checked state correctly in fragments
	support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE<9
	// Opera does not clone events (and typeof div.attachEvent === undefined).
	// IE9-10 clones events bound via attachEvent, but they don't trigger with .click()
	if ( div.attachEvent ) {
		div.attachEvent( "onclick", function() {
			support.noCloneEvent = false;
		});

		div.cloneNode( true ).click();
	}

	// Support: IE<9 (lack submit/change bubble), Firefox 17+ (lack focusin event)
	// Beware of CSP restrictions (https://developer.mozilla.org/en/Security/CSP), test/csp.php
	for ( i in { submit: true, change: true, focusin: true }) {
		div.setAttribute( eventName = "on" + i, "t" );

		support[ i + "Bubbles" ] = eventName in window || div.attributes[ eventName ].expando === false;
	}

	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	// Run tests that need a body at doc ready
	jQuery(function() {
		var container, marginDiv, tds,
			divReset = "padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;",
			body = document.getElementsByTagName("body")[0];

		if ( !body ) {
			// Return for frameset docs that don't have a body
			return;
		}

		container = document.createElement("div");
		container.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px";

		body.appendChild( container ).appendChild( div );

		// Support: IE8
		// Check if table cells still have offsetWidth/Height when they are set
		// to display:none and there are still other visible table cells in a
		// table row; if so, offsetWidth/Height are not reliable for use when
		// determining if an element has been hidden directly using
		// display:none (it is still safe to use offsets if a parent element is
		// hidden; don safety goggles and see bug #4512 for more information).
		div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
		tds = div.getElementsByTagName("td");
		tds[ 0 ].style.cssText = "padding:0;margin:0;border:0;display:none";
		isSupported = ( tds[ 0 ].offsetHeight === 0 );

		tds[ 0 ].style.display = "";
		tds[ 1 ].style.display = "none";

		// Support: IE8
		// Check if empty table cells still have offsetWidth/Height
		support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );

		// Check box-sizing and margin behavior
		div.innerHTML = "";
		div.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;";
		support.boxSizing = ( div.offsetWidth === 4 );
		support.doesNotIncludeMarginInBodyOffset = ( body.offsetTop !== 1 );

		// Use window.getComputedStyle because jsdom on node.js will break without it.
		if ( window.getComputedStyle ) {
			support.pixelPosition = ( window.getComputedStyle( div, null ) || {} ).top !== "1%";
			support.boxSizingReliable = ( window.getComputedStyle( div, null ) || { width: "4px" } ).width === "4px";

			// Check if div with explicit width and no margin-right incorrectly
			// gets computed margin-right based on width of container. (#3333)
			// Fails in WebKit before Feb 2011 nightlies
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			marginDiv = div.appendChild( document.createElement("div") );
			marginDiv.style.cssText = div.style.cssText = divReset;
			marginDiv.style.marginRight = marginDiv.style.width = "0";
			div.style.width = "1px";

			support.reliableMarginRight =
				!parseFloat( ( window.getComputedStyle( marginDiv, null ) || {} ).marginRight );
		}

		if ( typeof div.style.zoom !== core_strundefined ) {
			// Support: IE<8
			// Check if natively block-level elements act like inline-block
			// elements when setting their display to 'inline' and giving
			// them layout
			div.innerHTML = "";
			div.style.cssText = divReset + "width:1px;padding:1px;display:inline;zoom:1";
			support.inlineBlockNeedsLayout = ( div.offsetWidth === 3 );

			// Support: IE6
			// Check if elements with layout shrink-wrap their children
			div.style.display = "block";
			div.innerHTML = "<div></div>";
			div.firstChild.style.width = "5px";
			support.shrinkWrapBlocks = ( div.offsetWidth !== 3 );

			if ( support.inlineBlockNeedsLayout ) {
				// Prevent IE 6 from affecting layout for positioned elements #11048
				// Prevent IE from shrinking the body in IE 7 mode #12869
				// Support: IE<8
				body.style.zoom = 1;
			}
		}

		body.removeChild( container );

		// Null elements to avoid leaks in IE
		container = div = tds = marginDiv = null;
	});

	// Null elements to avoid leaks in IE
	all = select = fragment = opt = a = input = null;

	return support;
})();

var rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
	rmultiDash = /([A-Z])/g;

function internalData( elem, name, data, pvt /* Internal Use Only */ ){
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var thisCache, ret,
		internalKey = jQuery.expando,
		getByName = typeof name === "string",

		// We have to handle DOM nodes and JS objects differently because IE6-7
		// can't GC object references properly across the DOM-JS boundary
		isNode = elem.nodeType,

		// Only DOM nodes need the global jQuery cache; JS object data is
		// attached directly to the object so GC can occur automatically
		cache = isNode ? jQuery.cache : elem,

		// Only defining an ID for JS objects if its cache already exists allows
		// the code to shortcut on the same path as a DOM node with no cache
		id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey;

	// Avoid doing any more work than we need to when trying to get data on an
	// object that has no data at all
	if ( (!id || !cache[id] || (!pvt && !cache[id].data)) && getByName && data === undefined ) {
		return;
	}

	if ( !id ) {
		// Only DOM nodes need a new unique ID for each element since their data
		// ends up in the global cache
		if ( isNode ) {
			elem[ internalKey ] = id = core_deletedIds.pop() || jQuery.guid++;
		} else {
			id = internalKey;
		}
	}

	if ( !cache[ id ] ) {
		cache[ id ] = {};

		// Avoids exposing jQuery metadata on plain JS objects when the object
		// is serialized using JSON.stringify
		if ( !isNode ) {
			cache[ id ].toJSON = jQuery.noop;
		}
	}

	// An object can be passed to jQuery.data instead of a key/value pair; this gets
	// shallow copied over onto the existing cache
	if ( typeof name === "object" || typeof name === "function" ) {
		if ( pvt ) {
			cache[ id ] = jQuery.extend( cache[ id ], name );
		} else {
			cache[ id ].data = jQuery.extend( cache[ id ].data, name );
		}
	}

	thisCache = cache[ id ];

	// jQuery data() is stored in a separate object inside the object's internal data
	// cache in order to avoid key collisions between internal data and user-defined
	// data.
	if ( !pvt ) {
		if ( !thisCache.data ) {
			thisCache.data = {};
		}

		thisCache = thisCache.data;
	}

	if ( data !== undefined ) {
		thisCache[ jQuery.camelCase( name ) ] = data;
	}

	// Check for both converted-to-camel and non-converted data property names
	// If a data property was specified
	if ( getByName ) {

		// First Try to find as-is property data
		ret = thisCache[ name ];

		// Test for null|undefined property data
		if ( ret == null ) {

			// Try to find the camelCased property
			ret = thisCache[ jQuery.camelCase( name ) ];
		}
	} else {
		ret = thisCache;
	}

	return ret;
}

function internalRemoveData( elem, name, pvt ) {
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var i, l, thisCache,
		isNode = elem.nodeType,

		// See jQuery.data for more information
		cache = isNode ? jQuery.cache : elem,
		id = isNode ? elem[ jQuery.expando ] : jQuery.expando;

	// If there is already no cache entry for this object, there is no
	// purpose in continuing
	if ( !cache[ id ] ) {
		return;
	}

	if ( name ) {

		thisCache = pvt ? cache[ id ] : cache[ id ].data;

		if ( thisCache ) {

			// Support array or space separated string names for data keys
			if ( !jQuery.isArray( name ) ) {

				// try the string as a key before any manipulation
				if ( name in thisCache ) {
					name = [ name ];
				} else {

					// split the camel cased version by spaces unless a key with the spaces exists
					name = jQuery.camelCase( name );
					if ( name in thisCache ) {
						name = [ name ];
					} else {
						name = name.split(" ");
					}
				}
			} else {
				// If "name" is an array of keys...
				// When data is initially created, via ("key", "val") signature,
				// keys will be converted to camelCase.
				// Since there is no way to tell _how_ a key was added, remove
				// both plain key and camelCase key. #12786
				// This will only penalize the array argument path.
				name = name.concat( jQuery.map( name, jQuery.camelCase ) );
			}

			for ( i = 0, l = name.length; i < l; i++ ) {
				delete thisCache[ name[i] ];
			}

			// If there is no data left in the cache, we want to continue
			// and let the cache object itself get destroyed
			if ( !( pvt ? isEmptyDataObject : jQuery.isEmptyObject )( thisCache ) ) {
				return;
			}
		}
	}

	// See jQuery.data for more information
	if ( !pvt ) {
		delete cache[ id ].data;

		// Don't destroy the parent cache unless the internal data object
		// had been the only thing left in it
		if ( !isEmptyDataObject( cache[ id ] ) ) {
			return;
		}
	}

	// Destroy the cache
	if ( isNode ) {
		jQuery.cleanData( [ elem ], true );

	// Use delete when supported for expandos or `cache` is not a window per isWindow (#10080)
	} else if ( jQuery.support.deleteExpando || cache != cache.window ) {
		delete cache[ id ];

	// When all else fails, null
	} else {
		cache[ id ] = null;
	}
}

jQuery.extend({
	cache: {},

	// Unique for each copy of jQuery on the page
	// Non-digits removed to match rinlinejQuery
	expando: "jQuery" + ( core_version + Math.random() ).replace( /\D/g, "" ),

	// The following elements throw uncatchable exceptions if you
	// attempt to add expando properties to them.
	noData: {
		"embed": true,
		// Ban all objects except for Flash (which handle expandos)
		"object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
		"applet": true
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];
		return !!elem && !isEmptyDataObject( elem );
	},

	data: function( elem, name, data ) {
		return internalData( elem, name, data );
	},

	removeData: function( elem, name ) {
		return internalRemoveData( elem, name );
	},

	// For internal use only.
	_data: function( elem, name, data ) {
		return internalData( elem, name, data, true );
	},

	_removeData: function( elem, name ) {
		return internalRemoveData( elem, name, true );
	},

	// A method for determining if a DOM node can handle the data expando
	acceptData: function( elem ) {
		// Do not set data on non-element because it will not be cleared (#8335).
		if ( elem.nodeType && elem.nodeType !== 1 && elem.nodeType !== 9 ) {
			return false;
		}

		var noData = elem.nodeName && jQuery.noData[ elem.nodeName.toLowerCase() ];

		// nodes accept data unless otherwise specified; rejection can be conditional
		return !noData || noData !== true && elem.getAttribute("classid") === noData;
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var attrs, name,
			elem = this[0],
			i = 0,
			data = null;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = jQuery.data( elem );

				if ( elem.nodeType === 1 && !jQuery._data( elem, "parsedAttrs" ) ) {
					attrs = elem.attributes;
					for ( ; i < attrs.length; i++ ) {
						name = attrs[i].name;

						if ( !name.indexOf( "data-" ) ) {
							name = jQuery.camelCase( name.slice(5) );

							dataAttr( elem, name, data[ name ] );
						}
					}
					jQuery._data( elem, "parsedAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each(function() {
				jQuery.data( this, key );
			});
		}

		return jQuery.access( this, function( value ) {

			if ( value === undefined ) {
				// Try to fetch any internally stored data first
				return elem ? dataAttr( elem, key, jQuery.data( elem, key ) ) : null;
			}

			this.each(function() {
				jQuery.data( this, key, value );
			});
		}, null, value, arguments.length > 1, null, true );
	},

	removeData: function( key ) {
		return this.each(function() {
			jQuery.removeData( this, key );
		});
	}
});

function dataAttr( elem, key, data ) {
	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {

		var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
					data === "false" ? false :
					data === "null" ? null :
					// Only convert to a number if it doesn't change the string
					+data + "" === data ? +data :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
						data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}

// checks a cache object for emptiness
function isEmptyDataObject( obj ) {
	var name;
	for ( name in obj ) {

		// if the public data object is empty, the private is still empty
		if ( name === "data" && jQuery.isEmptyObject( obj[name] ) ) {
			continue;
		}
		if ( name !== "toJSON" ) {
			return false;
		}
	}

	return true;
}
jQuery.extend({
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = jQuery._data( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || jQuery.isArray(data) ) {
					queue = jQuery._data( elem, type, jQuery.makeArray(data) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		hooks.cur = fn;
		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// not intended for public consumption - generates a queueHooks object, or returns the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return jQuery._data( elem, key ) || jQuery._data( elem, key, {
			empty: jQuery.Callbacks("once memory").add(function() {
				jQuery._removeData( elem, type + "queue" );
				jQuery._removeData( elem, key );
			})
		});
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[0], type );
		}

		return data === undefined ?
			this :
			this.each(function() {
				var queue = jQuery.queue( this, type, data );

				// ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[0] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";

		return this.queue( type, function( next, hooks ) {
			var timeout = setTimeout( next, time );
			hooks.stop = function() {
				clearTimeout( timeout );
			};
		});
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while( i-- ) {
			tmp = jQuery._data( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
});
var nodeHook, boolHook,
	rclass = /[\t\r\n]/g,
	rreturn = /\r/g,
	rfocusable = /^(?:input|select|textarea|button|object)$/i,
	rclickable = /^(?:a|area)$/i,
	rboolean = /^(?:checked|selected|autofocus|autoplay|async|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped)$/i,
	ruseDefault = /^(?:checked|selected)$/i,
	getSetAttribute = jQuery.support.getSetAttribute,
	getSetInput = jQuery.support.input;

jQuery.fn.extend({
	attr: function( name, value ) {
		return jQuery.access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	},

	prop: function( name, value ) {
		return jQuery.access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		name = jQuery.propFix[ name ] || name;
		return this.each(function() {
			// try/catch handles cases where IE balks (such as removing a property on window)
			try {
				this[ name ] = undefined;
				delete this[ name ];
			} catch( e ) {}
		});
	},

	addClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call( this, j, this.className ) );
			});
		}

		if ( proceed ) {
			// The disjunction here is for better compressibility (see removeClass)
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					" "
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}
					elem.className = jQuery.trim( cur );

				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = arguments.length === 0 || typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call( this, j, this.className ) );
			});
		}
		if ( proceed ) {
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					""
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) >= 0 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}
					elem.className = value ? jQuery.trim( cur ) : "";
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value,
			isBool = typeof stateVal === "boolean";

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					state = stateVal,
					classNames = value.match( core_rnotwhite ) || [];

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space separated list
					state = isBool ? state : !self.hasClass( className );
					self[ state ? "addClass" : "removeClass" ]( className );
				}

			// Toggle whole class name
			} else if ( type === core_strundefined || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					jQuery._data( this, "__className__", this.className );
				}

				// If the element has a class name or if we're passed "false",
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		var ret, hooks, isFunction,
			elem = this[0];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?
					// handle most common string cases
					ret.replace(rreturn, "") :
					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var val,
				self = jQuery(this);

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, self.val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map(val, function ( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				// attributes.value is undefined in Blackberry 4.7 but
				// uses .value. See #6932
				var val = elem.attributes.value;
				return !val || val.specified ? elem.value : elem.text;
			}
		},
		select: {
			get: function( elem ) {
				var value, option,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one" || index < 0,
					values = one ? null : [],
					max = one ? index + 1 : options.length,
					i = index < 0 ?
						max :
						one ? index : 0;

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// oldIE doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&
							// Don't return options that are disabled or in a disabled optgroup
							( jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null ) &&
							( !option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var values = jQuery.makeArray( value );

				jQuery(elem).find("option").each(function() {
					this.selected = jQuery.inArray( jQuery(this).val(), values ) >= 0;
				});

				if ( !values.length ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	},

	attr: function( elem, name, value ) {
		var hooks, notxml, ret,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === core_strundefined ) {
			return jQuery.prop( elem, name, value );
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( notxml ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] || ( rboolean.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );

			} else if ( hooks && notxml && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, value + "" );
				return value;
			}

		} else if ( hooks && notxml && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {

			// In IE9+, Flash objects don't have .getAttribute (#12945)
			// Support: IE9+
			if ( typeof elem.getAttribute !== core_strundefined ) {
				ret =  elem.getAttribute( name );
			}

			// Non-existent attributes return null, we normalize to undefined
			return ret == null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, value ) {
		var name, propName,
			i = 0,
			attrNames = value && value.match( core_rnotwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( (name = attrNames[i++]) ) {
				propName = jQuery.propFix[ name ] || name;

				// Boolean attributes get special treatment (#10870)
				if ( rboolean.test( name ) ) {
					// Set corresponding property to false for boolean attributes
					// Also clear defaultChecked/defaultSelected (if appropriate) for IE<8
					if ( !getSetAttribute && ruseDefault.test( name ) ) {
						elem[ jQuery.camelCase( "default-" + name ) ] =
							elem[ propName ] = false;
					} else {
						elem[ propName ] = false;
					}

				// See #9699 for explanation of this approach (setting first, then removal)
				} else {
					jQuery.attr( elem, name, "" );
				}

				elem.removeAttribute( getSetAttribute ? name : propName );
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to default in case type is set after value during creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	propFix: {
		tabindex: "tabIndex",
		readonly: "readOnly",
		"for": "htmlFor",
		"class": "className",
		maxlength: "maxLength",
		cellspacing: "cellSpacing",
		cellpadding: "cellPadding",
		rowspan: "rowSpan",
		colspan: "colSpan",
		usemap: "useMap",
		frameborder: "frameBorder",
		contenteditable: "contentEditable"
	},

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				return ( elem[ name ] = value );
			}

		} else {
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
				return ret;

			} else {
				return elem[ name ];
			}
		}
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {
				// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				var attributeNode = elem.getAttributeNode("tabindex");

				return attributeNode && attributeNode.specified ?
					parseInt( attributeNode.value, 10 ) :
					rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
						0 :
						undefined;
			}
		}
	}
});

// Hook for boolean attributes
boolHook = {
	get: function( elem, name ) {
		var
			// Use .prop to determine if this attribute is understood as boolean
			prop = jQuery.prop( elem, name ),

			// Fetch it accordingly
			attr = typeof prop === "boolean" && elem.getAttribute( name ),
			detail = typeof prop === "boolean" ?

				getSetInput && getSetAttribute ?
					attr != null :
					// oldIE fabricates an empty string for missing boolean attributes
					// and conflates checked/selected into attroperties
					ruseDefault.test( name ) ?
						elem[ jQuery.camelCase( "default-" + name ) ] :
						!!attr :

				// fetch an attribute node for properties not recognized as boolean
				elem.getAttributeNode( name );

		return detail && detail.value !== false ?
			name.toLowerCase() :
			undefined;
	},
	set: function( elem, value, name ) {
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
			// IE<8 needs the *property* name
			elem.setAttribute( !getSetAttribute && jQuery.propFix[ name ] || name, name );

		// Use defaultChecked and defaultSelected for oldIE
		} else {
			elem[ jQuery.camelCase( "default-" + name ) ] = elem[ name ] = true;
		}

		return name;
	}
};

// fix oldIE value attroperty
if ( !getSetInput || !getSetAttribute ) {
	jQuery.attrHooks.value = {
		get: function( elem, name ) {
			var ret = elem.getAttributeNode( name );
			return jQuery.nodeName( elem, "input" ) ?

				// Ignore the value *property* by using defaultValue
				elem.defaultValue :

				ret && ret.specified ? ret.value : undefined;
		},
		set: function( elem, value, name ) {
			if ( jQuery.nodeName( elem, "input" ) ) {
				// Does not return so that setAttribute is also used
				elem.defaultValue = value;
			} else {
				// Use nodeHook if defined (#1954); otherwise setAttribute is fine
				return nodeHook && nodeHook.set( elem, value, name );
			}
		}
	};
}

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !getSetAttribute ) {

	// Use this for any attribute in IE6/7
	// This fixes almost every IE6/7 issue
	nodeHook = jQuery.valHooks.button = {
		get: function( elem, name ) {
			var ret = elem.getAttributeNode( name );
			return ret && ( name === "id" || name === "name" || name === "coords" ? ret.value !== "" : ret.specified ) ?
				ret.value :
				undefined;
		},
		set: function( elem, value, name ) {
			// Set the existing or create a new attribute node
			var ret = elem.getAttributeNode( name );
			if ( !ret ) {
				elem.setAttributeNode(
					(ret = elem.ownerDocument.createAttribute( name ))
				);
			}

			ret.value = value += "";

			// Break association with cloned elements by also using setAttribute (#9646)
			return name === "value" || value === elem.getAttribute( name ) ?
				value :
				undefined;
		}
	};

	// Set contenteditable to false on removals(#10429)
	// Setting to empty string throws an error as an invalid value
	jQuery.attrHooks.contenteditable = {
		get: nodeHook.get,
		set: function( elem, value, name ) {
			nodeHook.set( elem, value === "" ? false : value, name );
		}
	};

	// Set width and height to auto instead of 0 on empty string( Bug #8150 )
	// This is for removals
	jQuery.each([ "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
			set: function( elem, value ) {
				if ( value === "" ) {
					elem.setAttribute( name, "auto" );
					return value;
				}
			}
		});
	});
}


// Some attributes require a special call on IE
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !jQuery.support.hrefNormalized ) {
	jQuery.each([ "href", "src", "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
			get: function( elem ) {
				var ret = elem.getAttribute( name, 2 );
				return ret == null ? undefined : ret;
			}
		});
	});

	// href/src property should get the full normalized URL (#10299/#12915)
	jQuery.each([ "href", "src" ], function( i, name ) {
		jQuery.propHooks[ name ] = {
			get: function( elem ) {
				return elem.getAttribute( name, 4 );
			}
		};
	});
}

if ( !jQuery.support.style ) {
	jQuery.attrHooks.style = {
		get: function( elem ) {
			// Return undefined in the case of empty string
			// Note: IE uppercases css property names, but if we were to .toLowerCase()
			// .cssText, that would destroy case senstitivity in URL's, like in "background"
			return elem.style.cssText || undefined;
		},
		set: function( elem, value ) {
			return ( elem.style.cssText = value + "" );
		}
	};
}

// Safari mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
if ( !jQuery.support.optSelected ) {
	jQuery.propHooks.selected = jQuery.extend( jQuery.propHooks.selected, {
		get: function( elem ) {
			var parent = elem.parentNode;

			if ( parent ) {
				parent.selectedIndex;

				// Make sure that it also works with optgroups, see #5701
				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
			return null;
		}
	});
}

// IE6/7 call enctype encoding
if ( !jQuery.support.enctype ) {
	jQuery.propFix.enctype = "encoding";
}

// Radios and checkboxes getter/setter
if ( !jQuery.support.checkOn ) {
	jQuery.each([ "radio", "checkbox" ], function() {
		jQuery.valHooks[ this ] = {
			get: function( elem ) {
				// Handle the case where in Webkit "" is returned instead of "on" if a value isn't specified
				return elem.getAttribute("value") === null ? "on" : elem.value;
			}
		};
	});
}
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = jQuery.extend( jQuery.valHooks[ this ], {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	});
});
var rformElems = /^(?:input|select|textarea)$/i,
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {
		var tmp, events, t, handleObjIn,
			special, eventHandle, handleObj,
			handlers, type, namespaces, origType,
			elemData = jQuery._data( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !(events = elemData.events) ) {
			events = elemData.events = {};
		}
		if ( !(eventHandle = elemData.handle) ) {
			eventHandle = elemData.handle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== core_strundefined && (!e || jQuery.event.triggered !== e.type) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};
			// Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
		// jQuery(...).bind("mouseover mouseout", fn);
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend({
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join(".")
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !(handlers = events[ type ]) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener/attachEvent if the special events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {
		var j, handleObj, tmp,
			origCount, t, events,
			special, handlers, type,
			namespaces, origType,
			elemData = jQuery.hasData( elem ) && jQuery._data( elem );

		if ( !elemData || !(events = elemData.events) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[2] && new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			delete elemData.handle;

			// removeData also checks for emptiness and clears the expando if empty
			// so use it instead of delete
			jQuery._removeData( elem, "events" );
		}
	},

	trigger: function( event, data, elem, onlyHandlers ) {
		var handle, ontype, cur,
			bubbleType, special, tmp, i,
			eventPath = [ elem || document ],
			type = core_hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = core_hasOwn.call( event, "namespace" ) ? event.namespace.split(".") : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf(".") >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf(":") < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		event.isTrigger = true;
		event.namespace = namespaces.join(".");
		event.namespace_re = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === (elem.ownerDocument || document) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( (cur = eventPath[i++]) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] && jQuery._data( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && jQuery.acceptData( cur ) && handle.apply && handle.apply( cur, data ) === false ) {
				event.preventDefault();
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.apply( elem.ownerDocument, data ) === false) &&
				!(type === "click" && jQuery.nodeName( elem, "a" )) && jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Can't use an .isFunction() check here because IE6/7 fails that test.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && elem[ type ] && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					try {
						elem[ type ]();
					} catch ( e ) {
						// IE<9 dies on focus/blur to hidden element (#1486,#12518)
						// only reproducible on winXP IE8 native, not IE9 in IE8 mode
					}
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event );

		var i, ret, handleObj, matched, j,
			handlerQueue = [],
			args = core_slice.call( arguments ),
			handlers = ( jQuery._data( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( (matched = handlerQueue[ i++ ]) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( (handleObj = matched.handlers[ j++ ]) && !event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or
				// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.namespace_re || event.namespace_re.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( (event.result = ret) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var sel, handleObj, matches, i,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		// Black-hole SVG <use> instance trees (#13180)
		// Avoid non-left-click bubbling in Firefox (#3861)
		if ( delegateCount && cur.nodeType && (!event.button || event.type !== "click") ) {

			for ( ; cur != this; cur = cur.parentNode || this ) {

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && (cur.disabled !== true || event.type !== "click") ) {
					matches = [];
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matches[ sel ] === undefined ) {
							matches[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) >= 0 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matches[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push({ elem: cur, handlers: matches });
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( delegateCount < handlers.length ) {
			handlerQueue.push({ elem: this, handlers: handlers.slice( delegateCount ) });
		}

		return handlerQueue;
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop, copy,
			type = event.type,
			originalEvent = event,
			fixHook = this.fixHooks[ type ];

		if ( !fixHook ) {
			this.fixHooks[ type ] = fixHook =
				rmouseEvent.test( type ) ? this.mouseHooks :
				rkeyEvent.test( type ) ? this.keyHooks :
				{};
		}
		copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = new jQuery.Event( originalEvent );

		i = copy.length;
		while ( i-- ) {
			prop = copy[ i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Support: IE<9
		// Fix target property (#1925)
		if ( !event.target ) {
			event.target = originalEvent.srcElement || document;
		}

		// Support: Chrome 23+, Safari?
		// Target should not be a text node (#504, #13143)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// Support: IE<9
		// For mouse/key events, metaKey==false if it's undefined (#3368, #11328)
		event.metaKey = !!event.metaKey;

		return fixHook.filter ? fixHook.filter( event, originalEvent ) : event;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		filter: function( event, original ) {
			var body, eventDoc, doc,
				button = original.button,
				fromElement = original.fromElement;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add relatedTarget, if necessary
			if ( !event.relatedTarget && fromElement ) {
				event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	special: {
		load: {
			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		click: {
			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( jQuery.nodeName( this, "input" ) && this.type === "checkbox" && this.click ) {
					this.click();
					return false;
				}
			}
		},
		focus: {
			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== document.activeElement && this.focus ) {
					try {
						this.focus();
						return false;
					} catch ( e ) {
						// Support: IE<9
						// If we error on focus to hidden element (#1486, #12518),
						// let .trigger() run the handlers
					}
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === document.activeElement && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Even when returnValue equals to undefined Firefox will still show alert
				if ( event.result !== undefined ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	},

	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{ type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle, false );
		}
	} :
	function( elem, type, handle ) {
		var name = "on" + type;

		if ( elem.detachEvent ) {

			// #8545, #7054, preventing memory leaks for custom events in IE6-8
			// detachEvent needed property on element, by name of that event, to properly expose it to GC
			if ( typeof elem[ name ] === core_strundefined ) {
				elem[ name ] = null;
			}

			elem.detachEvent( name, handle );
		}
	};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = ( src.defaultPrevented || src.returnValue === false ||
			src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;
		if ( !e ) {
			return;
		}

		// If preventDefault exists, run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// Support: IE
		// Otherwise set the returnValue property of the original event to false
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;
		if ( !e ) {
			return;
		}
		// If stopPropagation exists, run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}

		// Support: IE
		// Set the cancelBubble property of the original event to true
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	}
};

// Create mouseenter/leave events using mouseover/out and event-time checks
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
});

// IE submit delegation
if ( !jQuery.support.submitBubbles ) {

	jQuery.event.special.submit = {
		setup: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Lazy-add a submit handler when a descendant form may potentially be submitted
			jQuery.event.add( this, "click._submit keypress._submit", function( e ) {
				// Node name check avoids a VML-related crash in IE (#9807)
				var elem = e.target,
					form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ? elem.form : undefined;
				if ( form && !jQuery._data( form, "submitBubbles" ) ) {
					jQuery.event.add( form, "submit._submit", function( event ) {
						event._submit_bubble = true;
					});
					jQuery._data( form, "submitBubbles", true );
				}
			});
			// return undefined since we don't need an event listener
		},

		postDispatch: function( event ) {
			// If form was submitted by the user, bubble the event up the tree
			if ( event._submit_bubble ) {
				delete event._submit_bubble;
				if ( this.parentNode && !event.isTrigger ) {
					jQuery.event.simulate( "submit", this.parentNode, event, true );
				}
			}
		},

		teardown: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Remove delegated handlers; cleanData eventually reaps submit handlers attached above
			jQuery.event.remove( this, "._submit" );
		}
	};
}

// IE change delegation and checkbox/radio fix
if ( !jQuery.support.changeBubbles ) {

	jQuery.event.special.change = {

		setup: function() {

			if ( rformElems.test( this.nodeName ) ) {
				// IE doesn't fire change on a check/radio until blur; trigger it on click
				// after a propertychange. Eat the blur-change in special.change.handle.
				// This still fires onchange a second time for check/radio after blur.
				if ( this.type === "checkbox" || this.type === "radio" ) {
					jQuery.event.add( this, "propertychange._change", function( event ) {
						if ( event.originalEvent.propertyName === "checked" ) {
							this._just_changed = true;
						}
					});
					jQuery.event.add( this, "click._change", function( event ) {
						if ( this._just_changed && !event.isTrigger ) {
							this._just_changed = false;
						}
						// Allow triggered, simulated change events (#11500)
						jQuery.event.simulate( "change", this, event, true );
					});
				}
				return false;
			}
			// Delegated event; lazy-add a change handler on descendant inputs
			jQuery.event.add( this, "beforeactivate._change", function( e ) {
				var elem = e.target;

				if ( rformElems.test( elem.nodeName ) && !jQuery._data( elem, "changeBubbles" ) ) {
					jQuery.event.add( elem, "change._change", function( event ) {
						if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
							jQuery.event.simulate( "change", this.parentNode, event, true );
						}
					});
					jQuery._data( elem, "changeBubbles", true );
				}
			});
		},

		handle: function( event ) {
			var elem = event.target;

			// Swallow native change events from checkbox/radio, we already triggered them above
			if ( this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox") ) {
				return event.handleObj.handler.apply( this, arguments );
			}
		},

		teardown: function() {
			jQuery.event.remove( this, "._change" );

			return !rformElems.test( this.nodeName );
		}
	};
}

// Create "bubbling" focus and blur events
if ( !jQuery.support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler while someone wants focusin/focusout
		var attaches = 0,
			handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				if ( attaches++ === 0 ) {
					document.addEventListener( orig, handler, true );
				}
			},
			teardown: function() {
				if ( --attaches === 0 ) {
					document.removeEventListener( orig, handler, true );
				}
			}
		};
	});
}

jQuery.fn.extend({

	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var type, origFn;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) {
				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
		}

		if ( data == null && fn == null ) {
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return this;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on( types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {
			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {
			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	triggerHandler: function( type, data ) {
		var elem = this[0];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
});
/*!
 * Sizzle CSS Selector Engine
 * Copyright 2012 jQuery Foundation and other contributors
 * Released under the MIT license
 * http://sizzlejs.com/
 */
(function( window, undefined ) {

var i,
	cachedruns,
	Expr,
	getText,
	isXML,
	compile,
	hasDuplicate,
	outermostContext,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsXML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,
	sortOrder,

	// Instance-specific data
	expando = "sizzle" + -(new Date()),
	preferredDoc = window.document,
	support = {},
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),

	// General-purpose constants
	strundefined = typeof undefined,
	MAX_NEGATIVE = 1 << 31,

	// Array methods
	arr = [],
	pop = arr.pop,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf if we can't use a native one
	indexOf = arr.indexOf || function( elem ) {
		var i = 0,
			len = this.length;
		for ( ; i < len; i++ ) {
			if ( this[i] === elem ) {
				return i;
			}
		}
		return -1;
	},


	// Regular expressions

	// Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",
	// http://www.w3.org/TR/css3-syntax/#characters
	characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

	// Loosely modeled on CSS identifier characters
	// An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
	// Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = characterEncoding.replace( "w", "w#" ),

	// Acceptable operators http://www.w3.org/TR/selectors/#attribute-selectors
	operators = "([*^$|!~]?=)",
	attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace +
		"*(?:" + operators + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]",

	// Prefer arguments quoted,
	//   then not containing pseudos/brackets,
	//   then attribute selectors/non-parenthetical expressions,
	//   then anything else
	// These preferences are here to reduce the number of selectors
	//   needing tokenize in the PSEUDO preFilter
	pseudos = ":(" + characterEncoding + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + attributes.replace( 3, 8 ) + ")*)|.*)\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([\\x20\\t\\r\\n\\f>+~])" + whitespace + "*" ),
	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + characterEncoding + ")" ),
		"CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
		"NAME": new RegExp( "^\\[name=['\"]?(" + characterEncoding + ")['\"]?\\]" ),
		"TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rsibling = /[\x20\t\r\n\f]*[+~]/,

	rnative = /^[^{]+\{\s*\[native code/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rescape = /'|\\/g,
	rattributeQuotes = /\=[\x20\t\r\n\f]*([^'"\]]*)[\x20\t\r\n\f]*\]/g,

	// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = /\\([\da-fA-F]{1,6}[\x20\t\r\n\f]?|.)/g,
	funescape = function( _, escaped ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		return high !== high ?
			escaped :
			// BMP codepoint
			high < 0 ?
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	};

// Use a stripped-down slice if we can't use a native one
try {
	slice.call( preferredDoc.documentElement.childNodes, 0 )[0].nodeType;
} catch ( e ) {
	slice = function( i ) {
		var elem,
			results = [];
		while ( (elem = this[i++]) ) {
			results.push( elem );
		}
		return results;
	};
}

/**
 * For feature detection
 * @param {Function} fn The function to test for native support
 */
function isNative( fn ) {
	return rnative.test( fn + "" );
}

/**
 * Create key-value caches of limited size
 * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var cache,
		keys = [];

	return (cache = function( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key += " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key ] = value);
	});
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */
function assert( fn ) {
	var div = document.createElement("div");

	try {
		return fn( div );
	} catch (e) {
		return false;
	} finally {
		// release memory in IE
		div = null;
	}
}

function Sizzle( selector, context, results, seed ) {
	var match, elem, m, nodeType,
		// QSA vars
		i, groups, old, nid, newContext, newSelector;

	if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
		setDocument( context );
	}

	context = context || document;
	results = results || [];

	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	if ( (nodeType = context.nodeType) !== 1 && nodeType !== 9 ) {
		return [];
	}

	if ( !documentIsXML && !seed ) {

		// Shortcuts
		if ( (match = rquickExpr.exec( selector )) ) {
			// Speed-up: Sizzle("#ID")
			if ( (m = match[1]) ) {
				if ( nodeType === 9 ) {
					elem = context.getElementById( m );
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE, Opera, and Webkit return items
						// by name instead of ID
						if ( elem.id === m ) {
							results.push( elem );
							return results;
						}
					} else {
						return results;
					}
				} else {
					// Context is not a document
					if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
						contains( context, elem ) && elem.id === m ) {
						results.push( elem );
						return results;
					}
				}

			// Speed-up: Sizzle("TAG")
			} else if ( match[2] ) {
				push.apply( results, slice.call(context.getElementsByTagName( selector ), 0) );
				return results;

			// Speed-up: Sizzle(".CLASS")
			} else if ( (m = match[3]) && support.getByClassName && context.getElementsByClassName ) {
				push.apply( results, slice.call(context.getElementsByClassName( m ), 0) );
				return results;
			}
		}

		// QSA path
		if ( support.qsa && !rbuggyQSA.test(selector) ) {
			old = true;
			nid = expando;
			newContext = context;
			newSelector = nodeType === 9 && selector;

			// qSA works strangely on Element-rooted queries
			// We can work around this by specifying an extra ID on the root
			// and working up from there (Thanks to Andrew Dupont for the technique)
			// IE 8 doesn't work on object elements
			if ( nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
				groups = tokenize( selector );

				if ( (old = context.getAttribute("id")) ) {
					nid = old.replace( rescape, "\\$&" );
				} else {
					context.setAttribute( "id", nid );
				}
				nid = "[id='" + nid + "'] ";

				i = groups.length;
				while ( i-- ) {
					groups[i] = nid + toSelector( groups[i] );
				}
				newContext = rsibling.test( selector ) && context.parentNode || context;
				newSelector = groups.join(",");
			}

			if ( newSelector ) {
				try {
					push.apply( results, slice.call( newContext.querySelectorAll(
						newSelector
					), 0 ) );
					return results;
				} catch(qsaError) {
				} finally {
					if ( !old ) {
						context.removeAttribute("id");
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Detect xml
 * @param {Element|Object} elem An element or a document
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var doc = node ? node.ownerDocument || node : preferredDoc;

	// If no document and documentElement is available, return
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Set our document
	document = doc;
	docElem = doc.documentElement;

	// Support tests
	documentIsXML = isXML( doc );

	// Check if getElementsByTagName("*") returns only elements
	support.tagNameNoComments = assert(function( div ) {
		div.appendChild( doc.createComment("") );
		return !div.getElementsByTagName("*").length;
	});

	// Check if attributes should be retrieved by attribute nodes
	support.attributes = assert(function( div ) {
		div.innerHTML = "<select></select>";
		var type = typeof div.lastChild.getAttribute("multiple");
		// IE8 returns a string for some attributes even when not present
		return type !== "boolean" && type !== "string";
	});

	// Check if getElementsByClassName can be trusted
	support.getByClassName = assert(function( div ) {
		// Opera can't find a second classname (in 9.6)
		div.innerHTML = "<div class='hidden e'></div><div class='hidden'></div>";
		if ( !div.getElementsByClassName || !div.getElementsByClassName("e").length ) {
			return false;
		}

		// Safari 3.2 caches class attributes and doesn't catch changes
		div.lastChild.className = "e";
		return div.getElementsByClassName("e").length === 2;
	});

	// Check if getElementById returns elements by name
	// Check if getElementsByName privileges form controls or returns elements by ID
	support.getByName = assert(function( div ) {
		// Inject content
		div.id = expando + 0;
		div.innerHTML = "<a name='" + expando + "'></a><div name='" + expando + "'></div>";
		docElem.insertBefore( div, docElem.firstChild );

		// Test
		var pass = doc.getElementsByName &&
			// buggy browsers will return fewer than the correct 2
			doc.getElementsByName( expando ).length === 2 +
			// buggy browsers will return more than the correct 0
			doc.getElementsByName( expando + 0 ).length;
		support.getIdNotName = !doc.getElementById( expando );

		// Cleanup
		docElem.removeChild( div );

		return pass;
	});

	// IE6/7 return modified attributes
	Expr.attrHandle = assert(function( div ) {
		div.innerHTML = "<a href='#'></a>";
		return div.firstChild && typeof div.firstChild.getAttribute !== strundefined &&
			div.firstChild.getAttribute("href") === "#";
	}) ?
		{} :
		{
			"href": function( elem ) {
				return elem.getAttribute( "href", 2 );
			},
			"type": function( elem ) {
				return elem.getAttribute("type");
			}
		};

	// ID find and filter
	if ( support.getIdNotName ) {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== strundefined && !documentIsXML ) {
				var m = context.getElementById( id );
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [m] : [];
			}
		};
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
	} else {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== strundefined && !documentIsXML ) {
				var m = context.getElementById( id );

				return m ?
					m.id === id || typeof m.getAttributeNode !== strundefined && m.getAttributeNode("id").value === id ?
						[m] :
						undefined :
					[];
			}
		};
		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};
	}

	// Tag
	Expr.find["TAG"] = support.tagNameNoComments ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== strundefined ) {
				return context.getElementsByTagName( tag );
			}
		} :
		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Name
	Expr.find["NAME"] = support.getByName && function( tag, context ) {
		if ( typeof context.getElementsByName !== strundefined ) {
			return context.getElementsByName( name );
		}
	};

	// Class
	Expr.find["CLASS"] = support.getByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== strundefined && !documentIsXML ) {
			return context.getElementsByClassName( className );
		}
	};

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21),
	// no need to also add to buggyMatches since matches checks buggyQSA
	// A support test would require too much code (would include document ready)
	rbuggyQSA = [ ":focus" ];

	if ( (support.qsa = isNative(doc.querySelectorAll)) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( div ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explictly
			// setting a boolean content attribute,
			// since its presence should be enough
			// http://bugs.jquery.com/ticket/12359
			div.innerHTML = "<select><option selected=''></option></select>";

			// IE8 - Some boolean attributes are not treated correctly
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:checked|disabled|ismap|multiple|readonly|selected|value)" );
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}
		});

		assert(function( div ) {

			// Opera 10-12/IE8 - ^= $= *= and empty values
			// Should not select anything
			div.innerHTML = "<input type='hidden' i=''/>";
			if ( div.querySelectorAll("[i^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:\"\"|'')" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":enabled").length ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			div.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = isNative( (matches = docElem.matchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.webkitMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( div ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( div, "div" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( div, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = new RegExp( rbuggyMatches.join("|") );

	// Element contains another
	// Purposefully does not implement inclusive descendent
	// As in, an element does not contain itself
	contains = isNative(docElem.contains) || docElem.compareDocumentPosition ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	// Document order sorting
	sortOrder = docElem.compareDocumentPosition ?
	function( a, b ) {
		var compare;

		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		if ( (compare = b.compareDocumentPosition && a.compareDocumentPosition && a.compareDocumentPosition( b )) ) {
			if ( compare & 1 || a.parentNode && a.parentNode.nodeType === 11 ) {
				if ( a === doc || contains( preferredDoc, a ) ) {
					return -1;
				}
				if ( b === doc || contains( preferredDoc, b ) ) {
					return 1;
				}
				return 0;
			}
			return compare & 4 ? -1 : 1;
		}

		return a.compareDocumentPosition ? -1 : 1;
	} :
	function( a, b ) {
		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// Parentless nodes are either documents or disconnected
		} else if ( !aup || !bup ) {
			return a === doc ? -1 :
				b === doc ? 1 :
				aup ? -1 :
				bup ? 1 :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	// Always assume the presence of duplicates if sort doesn't
	// pass them to our comparison function (as in Google Chrome).
	hasDuplicate = false;
	[0, 0].sort( sortOrder );
	support.detectDuplicates = hasDuplicate;

	return document;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	// rbuggyQSA always contains :focus, so no need for an existence check
	if ( support.matchesSelector && !documentIsXML && (!rbuggyMatches || !rbuggyMatches.test(expr)) && !rbuggyQSA.test(expr) ) {
		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch(e) {}
	}

	return Sizzle( expr, document, null, [elem] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	var val;

	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	if ( !documentIsXML ) {
		name = name.toLowerCase();
	}
	if ( (val = Expr.attrHandle[ name ]) ) {
		return val( elem );
	}
	if ( documentIsXML || support.attributes ) {
		return elem.getAttribute( name );
	}
	return ( (val = elem.getAttributeNode( name )) || elem.getAttribute( name ) ) && elem[ name ] === true ?
		name :
		val && val.specified ? val.value : null;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

// Document sorting and removing duplicates
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		i = 1,
		j = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		for ( ; (elem = results[i]); i++ ) {
			if ( elem === results[ i - 1 ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	return results;
};

function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && ( ~b.sourceIndex || MAX_NEGATIVE ) - ( ~a.sourceIndex || MAX_NEGATIVE );

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

// Returns a function to use in pseudos for input types
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

// Returns a function to use in pseudos for buttons
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

// Returns a function to use in pseudos for positionals
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		for ( ; (node = elem[i]); i++ ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (see #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[5] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[4] ) {
				match[2] = match[4];

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeName ) {
			if ( nodeName === "*" ) {
				return function() { return true; };
			}

			nodeName = nodeName.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
			};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( elem.className || (typeof elem.getAttribute !== strundefined && elem.getAttribute("class")) || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, outerCache, node, diff, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) {
										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {
							// Seek `elem` from a previously-cached index
							outerCache = parent[ expando ] || (parent[ expando ] = {});
							cache = outerCache[ type ] || [];
							nodeIndex = cache[0] === dirruns && cache[1];
							diff = cache[0] === dirruns && cache[2];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									outerCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						// Use previously-cached element index if available
						} else if ( useCache && (cache = (elem[ expando ] || (elem[ expando ] = {}))[ type ]) && cache[0] === dirruns ) {
							diff = cache[1];

						// xml :nth-child(...) or :nth-last-child(...) or :nth(-last)?-of-type(...)
						} else {
							// Use the same loop as above to seek `elem` from the start
							while ( (node = ++nodeIndex && node && node[ dir ] ||
								(diff = nodeIndex = 0) || start.pop()) ) {

								if ( ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) && ++diff ) {
									// Cache the index of each encountered element
									if ( useCache ) {
										(node[ expando ] || (node[ expando ] = {}))[ type ] = [ dirruns, diff ];
									}

									if ( node === elem ) {
										break;
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf.call( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifider
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsXML ?
						elem.getAttribute("xml:lang") || elem.getAttribute("lang") :
						elem.lang) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": function( elem ) {
			return elem.disabled === false;
		},

		"disabled": function( elem ) {
			return elem.disabled === true;
		},

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is only affected by element nodes and content nodes(including text(3), cdata(4)),
			//   not comment, processing instructions, or others
			// Thanks to Diego Perini for the nodeName shortcut
			//   Greater than "@" means alpha characters (specifically not starting with "#" or "?")
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeName > "@" || elem.nodeType === 3 || elem.nodeType === 4 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
			// use getAttribute instead to test this case
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === elem.type );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

function tokenize( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( tokens = [] );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push( {
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			} );
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push( {
					value: matched,
					type: type,
					matches: match
				} );
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
}

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		checkNonElements = base && dir === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var data, cache, outerCache,
				dirkey = dirruns + " " + doneName;

			// We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});
						if ( (cache = outerCache[ dir ]) && cache[0] === dirkey ) {
							if ( (data = cache[1]) === true || data === cachedruns ) {
								return data === true;
							}
						} else {
							cache = outerCache[ dir ] = [ dirkey ];
							cache[1] = matcher( elem, context, xml ) || cachedruns;
							if ( cache[1] === true ) {
								return true;
							}
						}
					}
				}
			}
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf.call( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf.call( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			return ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector( tokens.slice( 0, i - 1 ) ).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	// A counter to specify which element is currently being matched
	var matcherCachedRuns = 0,
		bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, expandContext ) {
			var elem, j, matcher,
				setMatched = [],
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				outermost = expandContext != null,
				contextBackup = outermostContext,
				// We must always have either seed elements or context
				elems = seed || byElement && Expr.find["TAG"]( "*", expandContext && context.parentNode || context ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1);

			if ( outermost ) {
				outermostContext = context !== document && context;
				cachedruns = matcherCachedRuns;
			}

			// Add elements passing elementMatchers directly to results
			// Keep `i` a string if there are no elements so `matchedCount` will be "00" below
			for ( ; (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context, xml ) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
						cachedruns = ++matcherCachedRuns;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// Apply set filters to unmatched elements
			matchedCount += i;
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, group /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !group ) {
			group = tokenize( selector );
		}
		i = group.length;
		while ( i-- ) {
			cached = matcherFromTokens( group[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );
	}
	return cached;
};

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function select( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		match = tokenize( selector );

	if ( !seed ) {
		// Try to minimize operations if there is only one group
		if ( match.length === 1 ) {

			// Take a shortcut and set the context if the root selector is an ID
			tokens = match[0] = match[0].slice( 0 );
			if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
					context.nodeType === 9 && !documentIsXML &&
					Expr.relative[ tokens[1].type ] ) {

				context = Expr.find["ID"]( token.matches[0].replace( runescape, funescape ), context )[0];
				if ( !context ) {
					return results;
				}

				selector = selector.slice( tokens.shift().value.length );
			}

			// Fetch a seed set for right-to-left matching
			i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
			while ( i-- ) {
				token = tokens[i];

				// Abort if we hit a combinator
				if ( Expr.relative[ (type = token.type) ] ) {
					break;
				}
				if ( (find = Expr.find[ type ]) ) {
					// Search, expanding context for leading sibling combinators
					if ( (seed = find(
						token.matches[0].replace( runescape, funescape ),
						rsibling.test( tokens[0].type ) && context.parentNode || context
					)) ) {

						// If seed is empty or no tokens remain, we can return early
						tokens.splice( i, 1 );
						selector = seed.length && toSelector( tokens );
						if ( !selector ) {
							push.apply( results, slice.call( seed, 0 ) );
							return results;
						}

						break;
					}
				}
			}
		}
	}

	// Compile and execute a filtering function
	// Provide `match` to avoid retokenization if we modified the selector above
	compile( selector, match )(
		seed,
		context,
		documentIsXML,
		results,
		rsibling.test( selector )
	);
	return results;
}

// Deprecated
Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Easy API for creating new setFilters
function setFilters() {}
Expr.filters = setFilters.prototype = Expr.pseudos;
Expr.setFilters = new setFilters();

// Initialize with the default document
setDocument();

// Override sizzle attribute retrieval
Sizzle.attr = jQuery.attr;
jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.pseudos;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})( window );
var runtil = /Until$/,
	rparentsprev = /^(?:parents|prev(?:Until|All))/,
	isSimple = /^.[^:#\[\.,]*$/,
	rneedsContext = jQuery.expr.match.needsContext,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend({
	find: function( selector ) {
		var i, ret, self,
			len = this.length;

		if ( typeof selector !== "string" ) {
			self = this;
			return this.pushStack( jQuery( selector ).filter(function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			}) );
		}

		ret = [];
		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, this[ i ], ret );
		}

		// Needed because $( selector, context ) becomes $( context ).find( selector )
		ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
		ret.selector = ( this.selector ? this.selector + " " : "" ) + selector;
		return ret;
	},

	has: function( target ) {
		var i,
			targets = jQuery( target, this ),
			len = targets.length;

		return this.filter(function() {
			for ( i = 0; i < len; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	not: function( selector ) {
		return this.pushStack( winnow(this, selector, false) );
	},

	filter: function( selector ) {
		return this.pushStack( winnow(this, selector, true) );
	},

	is: function( selector ) {
		return !!selector && (
			typeof selector === "string" ?
				// If this is a positional/relative selector, check membership in the returned set
				// so $("p:first").is("p:last") won't return true for a doc with two "p".
				rneedsContext.test( selector ) ?
					jQuery( selector, this.context ).index( this[0] ) >= 0 :
					jQuery.filter( selector, this ).length > 0 :
				this.filter( selector ).length > 0 );
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			ret = [],
			pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( ; i < l; i++ ) {
			cur = this[i];

			while ( cur && cur.ownerDocument && cur !== context && cur.nodeType !== 11 ) {
				if ( pos ? pos.index(cur) > -1 : jQuery.find.matchesSelector(cur, selectors) ) {
					ret.push( cur );
					break;
				}
				cur = cur.parentNode;
			}
		}

		return this.pushStack( ret.length > 1 ? jQuery.unique( ret ) : ret );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[0] && this[0].parentNode ) ? this.first().prevAll().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return jQuery.inArray( this[0], jQuery( elem ) );
		}

		// Locate the position of the desired element
		return jQuery.inArray(
			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[0] : elem, this );
	},

	add: function( selector, context ) {
		var set = typeof selector === "string" ?
				jQuery( selector, context ) :
				jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
			all = jQuery.merge( this.get(), set );

		return this.pushStack( jQuery.unique(all) );
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter(selector)
		);
	}
});

jQuery.fn.andSelf = jQuery.fn.addBack;

function sibling( cur, dir ) {
	do {
		cur = cur[ dir ];
	} while ( cur && cur.nodeType !== 1 );

	return cur;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until );

		if ( !runtil.test( name ) ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		ret = this.length > 1 && !guaranteedUnique[ name ] ? jQuery.unique( ret ) : ret;

		if ( this.length > 1 && rparentsprev.test( name ) ) {
			ret = ret.reverse();
		}

		return this.pushStack( ret );
	};
});

jQuery.extend({
	filter: function( expr, elems, not ) {
		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 ?
			jQuery.find.matchesSelector(elems[0], expr) ? [ elems[0] ] : [] :
			jQuery.find.matches(expr, elems);
	},

	dir: function( elem, dir, until ) {
		var matched = [],
			cur = elem[ dir ];

		while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
			if ( cur.nodeType === 1 ) {
				matched.push( cur );
			}
			cur = cur[dir];
		}
		return matched;
	},

	sibling: function( n, elem ) {
		var r = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				r.push( n );
			}
		}

		return r;
	}
});

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, keep ) {

	// Can't pass null or undefined to indexOf in Firefox 4
	// Set to 0 to skip string check
	qualifier = qualifier || 0;

	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep(elements, function( elem, i ) {
			var retVal = !!qualifier.call( elem, i, elem );
			return retVal === keep;
		});

	} else if ( qualifier.nodeType ) {
		return jQuery.grep(elements, function( elem ) {
			return ( elem === qualifier ) === keep;
		});

	} else if ( typeof qualifier === "string" ) {
		var filtered = jQuery.grep(elements, function( elem ) {
			return elem.nodeType === 1;
		});

		if ( isSimple.test( qualifier ) ) {
			return jQuery.filter(qualifier, filtered, !keep);
		} else {
			qualifier = jQuery.filter( qualifier, filtered );
		}
	}

	return jQuery.grep(elements, function( elem ) {
		return ( jQuery.inArray( elem, qualifier ) >= 0 ) === keep;
	});
}
function createSafeFragment( document ) {
	var list = nodeNames.split( "|" ),
		safeFrag = document.createDocumentFragment();

	if ( safeFrag.createElement ) {
		while ( list.length ) {
			safeFrag.createElement(
				list.pop()
			);
		}
	}
	return safeFrag;
}

var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|" +
		"header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
	rinlinejQuery = / jQuery\d+="(?:null|\d+)"/g,
	rnoshimcache = new RegExp("<(?:" + nodeNames + ")[\\s/>]", "i"),
	rleadingWhitespace = /^\s+/,
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
	rtagName = /<([\w:]+)/,
	rtbody = /<tbody/i,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style|link)/i,
	manipulation_rcheckableType = /^(?:checkbox|radio)$/i,
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /^$|\/(?:java|ecma)script/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,

	// We have to close these tags to support XHTML (#13200)
	wrapMap = {
		option: [ 1, "<select multiple='multiple'>", "</select>" ],
		legend: [ 1, "<fieldset>", "</fieldset>" ],
		area: [ 1, "<map>", "</map>" ],
		param: [ 1, "<object>", "</object>" ],
		thead: [ 1, "<table>", "</table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

		// IE6-8 can't serialize link, script, style, or any html5 (NoScope) tags,
		// unless wrapped in a div with non-breaking characters in front of it.
		_default: jQuery.support.htmlSerialize ? [ 0, "", "" ] : [ 1, "X<div>", "</div>"  ]
	},
	safeFragment = createSafeFragment( document ),
	fragmentDiv = safeFragment.appendChild( document.createElement("div") );

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

jQuery.fn.extend({
	text: function( value ) {
		return jQuery.access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().append( ( this[0] && this[0].ownerDocument || document ).createTextNode( value ) );
		}, null, value, arguments.length );
	},

	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapAll( html.call(this, i) );
			});
		}

		if ( this[0] ) {
			// The elements to wrap the target around
			var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

			if ( this[0].parentNode ) {
				wrap.insertBefore( this[0] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each(function(i) {
			jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	},

	append: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				this.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				this.insertBefore( elem, this.firstChild );
			}
		});
	},

	before: function() {
		return this.domManip( arguments, false, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		});
	},

	after: function() {
		return this.domManip( arguments, false, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		});
	},

	// keepData is for internal use only--do not document
	remove: function( selector, keepData ) {
		var elem,
			i = 0;

		for ( ; (elem = this[i]) != null; i++ ) {
			if ( !selector || jQuery.filter( selector, [ elem ] ).length > 0 ) {
				if ( !keepData && elem.nodeType === 1 ) {
					jQuery.cleanData( getAll( elem ) );
				}

				if ( elem.parentNode ) {
					if ( keepData && jQuery.contains( elem.ownerDocument, elem ) ) {
						setGlobalEval( getAll( elem, "script" ) );
					}
					elem.parentNode.removeChild( elem );
				}
			}
		}

		return this;
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; (elem = this[i]) != null; i++ ) {
			// Remove element nodes and prevent memory leaks
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem, false ) );
			}

			// Remove any remaining nodes
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}

			// If this is a select, ensure that it displays empty (#12336)
			// Support: IE<9
			if ( elem.options && jQuery.nodeName( elem, "select" ) ) {
				elem.options.length = 0;
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function () {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		return jQuery.access( this, function( value ) {
			var elem = this[0] || {},
				i = 0,
				l = this.length;

			if ( value === undefined ) {
				return elem.nodeType === 1 ?
					elem.innerHTML.replace( rinlinejQuery, "" ) :
					undefined;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				( jQuery.support.htmlSerialize || !rnoshimcache.test( value )  ) &&
				( jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value ) ) &&
				!wrapMap[ ( rtagName.exec( value ) || ["", ""] )[1].toLowerCase() ] ) {

				value = value.replace( rxhtmlTag, "<$1></$2>" );

				try {
					for (; i < l; i++ ) {
						// Remove element nodes and prevent memory leaks
						elem = this[i] || {};
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch(e) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function( value ) {
		var isFunc = jQuery.isFunction( value );

		// Make sure that the elements are removed from the DOM before they are inserted
		// this can help fix replacing a parent with child elements
		if ( !isFunc && typeof value !== "string" ) {
			value = jQuery( value ).not( this ).detach();
		}

		return this.domManip( [ value ], true, function( elem ) {
			var next = this.nextSibling,
				parent = this.parentNode;

			if ( parent ) {
				jQuery( this ).remove();
				parent.insertBefore( elem, next );
			}
		});
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, table, callback ) {

		// Flatten any nested arrays
		args = core_concat.apply( [], args );

		var first, node, hasScripts,
			scripts, doc, fragment,
			i = 0,
			l = this.length,
			set = this,
			iNoClone = l - 1,
			value = args[0],
			isFunction = jQuery.isFunction( value );

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( isFunction || !( l <= 1 || typeof value !== "string" || jQuery.support.checkClone || !rchecked.test( value ) ) ) {
			return this.each(function( index ) {
				var self = set.eq( index );
				if ( isFunction ) {
					args[0] = value.call( this, index, table ? self.html() : undefined );
				}
				self.domManip( args, table, callback );
			});
		}

		if ( l ) {
			fragment = jQuery.buildFragment( args, this[ 0 ].ownerDocument, false, this );
			first = fragment.firstChild;

			if ( fragment.childNodes.length === 1 ) {
				fragment = first;
			}

			if ( first ) {
				table = table && jQuery.nodeName( first, "tr" );
				scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
				hasScripts = scripts.length;

				// Use the original fragment for the last item instead of the first because it can end up
				// being emptied incorrectly in certain situations (#8070).
				for ( ; i < l; i++ ) {
					node = fragment;

					if ( i !== iNoClone ) {
						node = jQuery.clone( node, true, true );

						// Keep references to cloned scripts for later restoration
						if ( hasScripts ) {
							jQuery.merge( scripts, getAll( node, "script" ) );
						}
					}

					callback.call(
						table && jQuery.nodeName( this[i], "table" ) ?
							findOrAppend( this[i], "tbody" ) :
							this[i],
						node,
						i
					);
				}

				if ( hasScripts ) {
					doc = scripts[ scripts.length - 1 ].ownerDocument;

					// Reenable scripts
					jQuery.map( scripts, restoreScript );

					// Evaluate executable scripts on first document insertion
					for ( i = 0; i < hasScripts; i++ ) {
						node = scripts[ i ];
						if ( rscriptType.test( node.type || "" ) &&
							!jQuery._data( node, "globalEval" ) && jQuery.contains( doc, node ) ) {

							if ( node.src ) {
								// Hope ajax is available...
								jQuery.ajax({
									url: node.src,
									type: "GET",
									dataType: "script",
									async: false,
									global: false,
									"throws": true
								});
							} else {
								jQuery.globalEval( ( node.text || node.textContent || node.innerHTML || "" ).replace( rcleanScript, "" ) );
							}
						}
					}
				}

				// Fix #11809: Avoid leaking memory
				fragment = first = null;
			}
		}

		return this;
	}
});

function findOrAppend( elem, tag ) {
	return elem.getElementsByTagName( tag )[0] || elem.appendChild( elem.ownerDocument.createElement( tag ) );
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	var attr = elem.getAttributeNode("type");
	elem.type = ( attr && attr.specified ) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );
	if ( match ) {
		elem.type = match[1];
	} else {
		elem.removeAttribute("type");
	}
	return elem;
}

// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var elem,
		i = 0;
	for ( ; (elem = elems[i]) != null; i++ ) {
		jQuery._data( elem, "globalEval", !refElements || jQuery._data( refElements[i], "globalEval" ) );
	}
}

function cloneCopyEvent( src, dest ) {

	if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
		return;
	}

	var type, i, l,
		oldData = jQuery._data( src ),
		curData = jQuery._data( dest, oldData ),
		events = oldData.events;

	if ( events ) {
		delete curData.handle;
		curData.events = {};

		for ( type in events ) {
			for ( i = 0, l = events[ type ].length; i < l; i++ ) {
				jQuery.event.add( dest, type, events[ type ][ i ] );
			}
		}
	}

	// make the cloned public data object a copy from the original
	if ( curData.data ) {
		curData.data = jQuery.extend( {}, curData.data );
	}
}

function fixCloneNodeIssues( src, dest ) {
	var nodeName, e, data;

	// We do not need to do anything for non-Elements
	if ( dest.nodeType !== 1 ) {
		return;
	}

	nodeName = dest.nodeName.toLowerCase();

	// IE6-8 copies events bound via attachEvent when using cloneNode.
	if ( !jQuery.support.noCloneEvent && dest[ jQuery.expando ] ) {
		data = jQuery._data( dest );

		for ( e in data.events ) {
			jQuery.removeEvent( dest, e, data.handle );
		}

		// Event data gets referenced instead of copied if the expando gets copied too
		dest.removeAttribute( jQuery.expando );
	}

	// IE blanks contents when cloning scripts, and tries to evaluate newly-set text
	if ( nodeName === "script" && dest.text !== src.text ) {
		disableScript( dest ).text = src.text;
		restoreScript( dest );

	// IE6-10 improperly clones children of object elements using classid.
	// IE10 throws NoModificationAllowedError if parent is null, #12132.
	} else if ( nodeName === "object" ) {
		if ( dest.parentNode ) {
			dest.outerHTML = src.outerHTML;
		}

		// This path appears unavoidable for IE9. When cloning an object
		// element in IE9, the outerHTML strategy above is not sufficient.
		// If the src has innerHTML and the destination does not,
		// copy the src.innerHTML into the dest.innerHTML. #10324
		if ( jQuery.support.html5Clone && ( src.innerHTML && !jQuery.trim(dest.innerHTML) ) ) {
			dest.innerHTML = src.innerHTML;
		}

	} else if ( nodeName === "input" && manipulation_rcheckableType.test( src.type ) ) {
		// IE6-8 fails to persist the checked state of a cloned checkbox
		// or radio button. Worse, IE6-7 fail to give the cloned element
		// a checked appearance if the defaultChecked value isn't also set

		dest.defaultChecked = dest.checked = src.checked;

		// IE6-7 get confused and end up setting the value of a cloned
		// checkbox/radio button to an empty string instead of "on"
		if ( dest.value !== src.value ) {
			dest.value = src.value;
		}

	// IE6-8 fails to return the selected option to the default selected
	// state when cloning options
	} else if ( nodeName === "option" ) {
		dest.defaultSelected = dest.selected = src.defaultSelected;

	// IE6-8 fails to set the defaultValue to the correct value when
	// cloning other types of input fields
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			i = 0,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone(true);
			jQuery( insert[i] )[ original ]( elems );

			// Modern browsers can apply jQuery collections as arrays, but oldIE needs a .get()
			core_push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
});

function getAll( context, tag ) {
	var elems, elem,
		i = 0,
		found = typeof context.getElementsByTagName !== core_strundefined ? context.getElementsByTagName( tag || "*" ) :
			typeof context.querySelectorAll !== core_strundefined ? context.querySelectorAll( tag || "*" ) :
			undefined;

	if ( !found ) {
		for ( found = [], elems = context.childNodes || context; (elem = elems[i]) != null; i++ ) {
			if ( !tag || jQuery.nodeName( elem, tag ) ) {
				found.push( elem );
			} else {
				jQuery.merge( found, getAll( elem, tag ) );
			}
		}
	}

	return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
		jQuery.merge( [ context ], found ) :
		found;
}

// Used in buildFragment, fixes the defaultChecked property
function fixDefaultChecked( elem ) {
	if ( manipulation_rcheckableType.test( elem.type ) ) {
		elem.defaultChecked = elem.checked;
	}
}

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var destElements, node, clone, i, srcElements,
			inPage = jQuery.contains( elem.ownerDocument, elem );

		if ( jQuery.support.html5Clone || jQuery.isXMLDoc(elem) || !rnoshimcache.test( "<" + elem.nodeName + ">" ) ) {
			clone = elem.cloneNode( true );

		// IE<=8 does not properly clone detached, unknown element nodes
		} else {
			fragmentDiv.innerHTML = elem.outerHTML;
			fragmentDiv.removeChild( clone = fragmentDiv.firstChild );
		}

		if ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
				(elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {

			// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			// Fix all IE cloning issues
			for ( i = 0; (node = srcElements[i]) != null; ++i ) {
				// Ensure that the destination node is not null; Fixes #9587
				if ( destElements[i] ) {
					fixCloneNodeIssues( node, destElements[i] );
				}
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0; (node = srcElements[i]) != null; i++ ) {
					cloneCopyEvent( node, destElements[i] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		destElements = srcElements = node = null;

		// Return the cloned set
		return clone;
	},

	buildFragment: function( elems, context, scripts, selection ) {
		var j, elem, contains,
			tmp, tag, tbody, wrap,
			l = elems.length,

			// Ensure a safe fragment
			safe = createSafeFragment( context ),

			nodes = [],
			i = 0;

		for ( ; i < l; i++ ) {
			elem = elems[ i ];

			if ( elem || elem === 0 ) {

				// Add nodes directly
				if ( jQuery.type( elem ) === "object" ) {
					jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

				// Convert non-html into a text node
				} else if ( !rhtml.test( elem ) ) {
					nodes.push( context.createTextNode( elem ) );

				// Convert html into DOM nodes
				} else {
					tmp = tmp || safe.appendChild( context.createElement("div") );

					// Deserialize a standard representation
					tag = ( rtagName.exec( elem ) || ["", ""] )[1].toLowerCase();
					wrap = wrapMap[ tag ] || wrapMap._default;

					tmp.innerHTML = wrap[1] + elem.replace( rxhtmlTag, "<$1></$2>" ) + wrap[2];

					// Descend through wrappers to the right content
					j = wrap[0];
					while ( j-- ) {
						tmp = tmp.lastChild;
					}

					// Manually add leading whitespace removed by IE
					if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
						nodes.push( context.createTextNode( rleadingWhitespace.exec( elem )[0] ) );
					}

					// Remove IE's autoinserted <tbody> from table fragments
					if ( !jQuery.support.tbody ) {

						// String was a <table>, *may* have spurious <tbody>
						elem = tag === "table" && !rtbody.test( elem ) ?
							tmp.firstChild :

							// String was a bare <thead> or <tfoot>
							wrap[1] === "<table>" && !rtbody.test( elem ) ?
								tmp :
								0;

						j = elem && elem.childNodes.length;
						while ( j-- ) {
							if ( jQuery.nodeName( (tbody = elem.childNodes[j]), "tbody" ) && !tbody.childNodes.length ) {
								elem.removeChild( tbody );
							}
						}
					}

					jQuery.merge( nodes, tmp.childNodes );

					// Fix #12392 for WebKit and IE > 9
					tmp.textContent = "";

					// Fix #12392 for oldIE
					while ( tmp.firstChild ) {
						tmp.removeChild( tmp.firstChild );
					}

					// Remember the top-level container for proper cleanup
					tmp = safe.lastChild;
				}
			}
		}

		// Fix #11356: Clear elements from fragment
		if ( tmp ) {
			safe.removeChild( tmp );
		}

		// Reset defaultChecked for any radios and checkboxes
		// about to be appended to the DOM in IE 6/7 (#8060)
		if ( !jQuery.support.appendChecked ) {
			jQuery.grep( getAll( nodes, "input" ), fixDefaultChecked );
		}

		i = 0;
		while ( (elem = nodes[ i++ ]) ) {

			// #4087 - If origin and destination elements are the same, and this is
			// that element, do not do anything
			if ( selection && jQuery.inArray( elem, selection ) !== -1 ) {
				continue;
			}

			contains = jQuery.contains( elem.ownerDocument, elem );

			// Append to fragment
			tmp = getAll( safe.appendChild( elem ), "script" );

			// Preserve script evaluation history
			if ( contains ) {
				setGlobalEval( tmp );
			}

			// Capture executables
			if ( scripts ) {
				j = 0;
				while ( (elem = tmp[ j++ ]) ) {
					if ( rscriptType.test( elem.type || "" ) ) {
						scripts.push( elem );
					}
				}
			}
		}

		tmp = null;

		return safe;
	},

	cleanData: function( elems, /* internal */ acceptData ) {
		var elem, type, id, data,
			i = 0,
			internalKey = jQuery.expando,
			cache = jQuery.cache,
			deleteExpando = jQuery.support.deleteExpando,
			special = jQuery.event.special;

		for ( ; (elem = elems[i]) != null; i++ ) {

			if ( acceptData || jQuery.acceptData( elem ) ) {

				id = elem[ internalKey ];
				data = id && cache[ id ];

				if ( data ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Remove cache only if it was not already removed by jQuery.event.remove
					if ( cache[ id ] ) {

						delete cache[ id ];

						// IE does not allow us to delete expando properties from nodes,
						// nor does it have a removeAttribute function on Document nodes;
						// we must handle all of these cases
						if ( deleteExpando ) {
							delete elem[ internalKey ];

						} else if ( typeof elem.removeAttribute !== core_strundefined ) {
							elem.removeAttribute( internalKey );

						} else {
							elem[ internalKey ] = null;
						}

						core_deletedIds.push( id );
					}
				}
			}
		}
	}
});
var iframe, getStyles, curCSS,
	ralpha = /alpha\([^)]*\)/i,
	ropacity = /opacity\s*=\s*([^)]*)/,
	rposition = /^(top|right|bottom|left)$/,
	// swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
	// see here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rmargin = /^margin/,
	rnumsplit = new RegExp( "^(" + core_pnum + ")(.*)$", "i" ),
	rnumnonpx = new RegExp( "^(" + core_pnum + ")(?!px)[a-z%]+$", "i" ),
	rrelNum = new RegExp( "^([+-])=(" + core_pnum + ")", "i" ),
	elemdisplay = { BODY: "block" },

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: 0,
		fontWeight: 400
	},

	cssExpand = [ "Top", "Right", "Bottom", "Left" ],
	cssPrefixes = [ "Webkit", "O", "Moz", "ms" ];

// return a css property mapped to a potentially vendor prefixed property
function vendorPropName( style, name ) {

	// shortcut for names that are not vendor prefixed
	if ( name in style ) {
		return name;
	}

	// check for vendor prefixed names
	var capName = name.charAt(0).toUpperCase() + name.slice(1),
		origName = name,
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in style ) {
			return name;
		}
	}

	return origName;
}

function isHidden( elem, el ) {
	// isHidden might be called from jQuery#filter function;
	// in that case, element will be second argument
	elem = el || elem;
	return jQuery.css( elem, "display" ) === "none" || !jQuery.contains( elem.ownerDocument, elem );
}

function showHide( elements, show ) {
	var display, elem, hidden,
		values = [],
		index = 0,
		length = elements.length;

	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		values[ index ] = jQuery._data( elem, "olddisplay" );
		display = elem.style.display;
		if ( show ) {
			// Reset the inline display of this element to learn if it is
			// being hidden by cascaded rules or not
			if ( !values[ index ] && display === "none" ) {
				elem.style.display = "";
			}

			// Set elements which have been overridden with display: none
			// in a stylesheet to whatever the default browser style is
			// for such an element
			if ( elem.style.display === "" && isHidden( elem ) ) {
				values[ index ] = jQuery._data( elem, "olddisplay", css_defaultDisplay(elem.nodeName) );
			}
		} else {

			if ( !values[ index ] ) {
				hidden = isHidden( elem );

				if ( display && display !== "none" || !hidden ) {
					jQuery._data( elem, "olddisplay", hidden ? display : jQuery.css( elem, "display" ) );
				}
			}
		}
	}

	// Set the display of most of the elements in a second loop
	// to avoid the constant reflow
	for ( index = 0; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
			elem.style.display = show ? values[ index ] || "" : "none";
		}
	}

	return elements;
}

jQuery.fn.extend({
	css: function( name, value ) {
		return jQuery.access( this, function( elem, name, value ) {
			var len, styles,
				map = {},
				i = 0;

			if ( jQuery.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	},
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		var bool = typeof state === "boolean";

		return this.each(function() {
			if ( bool ? state : isHidden( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		});
	}
});

jQuery.extend({
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Exclude the following css properties to add px
	cssNumber: {
		"columnCount": true,
		"fillOpacity": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		// normalize float css property
		"float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			style = elem.style;

		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// convert relative number strings (+= or -=) to relative numbers. #7345
			if ( type === "string" && (ret = rrelNum.exec( value )) ) {
				value = ( ret[1] + 1 ) * ret[2] + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				type = "number";
			}

			// Make sure that NaN and null values aren't set. See: #7116
			if ( value == null || type === "number" && isNaN( value ) ) {
				return;
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// Fixes #8908, it can be done more correctly by specifing setters in cssHooks,
			// but it would mean to define eight (for every problematic property) identical functions
			if ( !jQuery.support.clearCloneStyle && value === "" && name.indexOf("background") === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value, extra )) !== undefined ) {

				// Wrapped to prevent IE from throwing errors when 'invalid' values are provided
				// Fixes bug #5509
				try {
					style[ name ] = value;
				} catch(e) {}
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var num, val, hooks,
			origName = jQuery.camelCase( name );

		// Make sure that we're working with the right name
		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( elem.style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		//convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Return, converting to number if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || jQuery.isNumeric( num ) ? num || 0 : val;
		}
		return val;
	},

	// A method for quickly swapping in/out CSS properties to get correct calculations
	swap: function( elem, options, callback, args ) {
		var ret, name,
			old = {};

		// Remember the old values, and insert the new ones
		for ( name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		ret = callback.apply( elem, args || [] );

		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}

		return ret;
	}
});

// NOTE: we've included the "window" in window.getComputedStyle
// because jsdom on node.js will break without it.
if ( window.getComputedStyle ) {
	getStyles = function( elem ) {
		return window.getComputedStyle( elem, null );
	};

	curCSS = function( elem, name, _computed ) {
		var width, minWidth, maxWidth,
			computed = _computed || getStyles( elem ),

			// getPropertyValue is only needed for .css('filter') in IE9, see #12537
			ret = computed ? computed.getPropertyValue( name ) || computed[ name ] : undefined,
			style = elem.style;

		if ( computed ) {

			if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
				ret = jQuery.style( elem, name );
			}

			// A tribute to the "awesome hack by Dean Edwards"
			// Chrome < 17 and Safari 5.0 uses "computed value" instead of "used value" for margin-right
			// Safari 5.1.7 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
			// this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
			if ( rnumnonpx.test( ret ) && rmargin.test( name ) ) {

				// Remember the original values
				width = style.width;
				minWidth = style.minWidth;
				maxWidth = style.maxWidth;

				// Put in the new values to get a computed value out
				style.minWidth = style.maxWidth = style.width = ret;
				ret = computed.width;

				// Revert the changed values
				style.width = width;
				style.minWidth = minWidth;
				style.maxWidth = maxWidth;
			}
		}

		return ret;
	};
} else if ( document.documentElement.currentStyle ) {
	getStyles = function( elem ) {
		return elem.currentStyle;
	};

	curCSS = function( elem, name, _computed ) {
		var left, rs, rsLeft,
			computed = _computed || getStyles( elem ),
			ret = computed ? computed[ name ] : undefined,
			style = elem.style;

		// Avoid setting ret to empty string here
		// so we don't default to auto
		if ( ret == null && style && style[ name ] ) {
			ret = style[ name ];
		}

		// From the awesome hack by Dean Edwards
		// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

		// If we're not dealing with a regular pixel number
		// but a number that has a weird ending, we need to convert it to pixels
		// but not position css attributes, as those are proportional to the parent element instead
		// and we can't measure the parent instead because it might trigger a "stacking dolls" problem
		if ( rnumnonpx.test( ret ) && !rposition.test( name ) ) {

			// Remember the original values
			left = style.left;
			rs = elem.runtimeStyle;
			rsLeft = rs && rs.left;

			// Put in the new values to get a computed value out
			if ( rsLeft ) {
				rs.left = elem.currentStyle.left;
			}
			style.left = name === "fontSize" ? "1em" : ret;
			ret = style.pixelLeft + "px";

			// Revert the changed values
			style.left = left;
			if ( rsLeft ) {
				rs.left = rsLeft;
			}
		}

		return ret === "" ? "auto" : ret;
	};
}

function setPositiveNumber( elem, value, subtract ) {
	var matches = rnumsplit.exec( value );
	return matches ?
		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i = extra === ( isBorderBox ? "border" : "content" ) ?
		// If we already have the right measurement, avoid augmentation
		4 :
		// Otherwise initialize for horizontal or vertical properties
		name === "width" ? 1 : 0,

		val = 0;

	for ( ; i < 4; i += 2 ) {
		// both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {
			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// at this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {
			// at this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// at this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property, which is equivalent to the border-box value
	var valueIsBorderBox = true,
		val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		styles = getStyles( elem ),
		isBorderBox = jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// some non-html elements return undefined for offsetWidth, so check for null/undefined
	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
	if ( val <= 0 || val == null ) {
		// Fall back to computed then uncomputed css if necessary
		val = curCSS( elem, name, styles );
		if ( val < 0 || val == null ) {
			val = elem.style[ name ];
		}

		// Computed unit is not pixels. Stop here and return.
		if ( rnumnonpx.test(val) ) {
			return val;
		}

		// we need the check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox && ( jQuery.support.boxSizingReliable || val === elem.style[ name ] );

		// Normalize "", auto, and prepare for extra
		val = parseFloat( val ) || 0;
	}

	// use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

// Try to determine the default display value of an element
function css_defaultDisplay( nodeName ) {
	var doc = document,
		display = elemdisplay[ nodeName ];

	if ( !display ) {
		display = actualDisplay( nodeName, doc );

		// If the simple way fails, read from inside an iframe
		if ( display === "none" || !display ) {
			// Use the already-created iframe if possible
			iframe = ( iframe ||
				jQuery("<iframe frameborder='0' width='0' height='0'/>")
				.css( "cssText", "display:block !important" )
			).appendTo( doc.documentElement );

			// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
			doc = ( iframe[0].contentWindow || iframe[0].contentDocument ).document;
			doc.write("<!doctype html><html><body>");
			doc.close();

			display = actualDisplay( nodeName, doc );
			iframe.detach();
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return display;
}

// Called ONLY from within css_defaultDisplay
function actualDisplay( name, doc ) {
	var elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),
		display = jQuery.css( elem[0], "display" );
	elem.remove();
	return display;
}

jQuery.each([ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {
				// certain elements can have dimension info if we invisibly show them
				// however, it must have a current display style that would benefit from this
				return elem.offsetWidth === 0 && rdisplayswap.test( jQuery.css( elem, "display" ) ) ?
					jQuery.swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, name, extra );
					}) :
					getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var styles = extra && getStyles( elem );
			return setPositiveNumber( elem, value, extra ?
				augmentWidthOrHeight(
					elem,
					name,
					extra,
					jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				) : 0
			);
		}
	};
});

if ( !jQuery.support.opacity ) {
	jQuery.cssHooks.opacity = {
		get: function( elem, computed ) {
			// IE uses filters for opacity
			return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
				( 0.01 * parseFloat( RegExp.$1 ) ) + "" :
				computed ? "1" : "";
		},

		set: function( elem, value ) {
			var style = elem.style,
				currentStyle = elem.currentStyle,
				opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
				filter = currentStyle && currentStyle.filter || style.filter || "";

			// IE has trouble with opacity if it does not have layout
			// Force it by setting the zoom level
			style.zoom = 1;

			// if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
			// if value === "", then remove inline opacity #12685
			if ( ( value >= 1 || value === "" ) &&
					jQuery.trim( filter.replace( ralpha, "" ) ) === "" &&
					style.removeAttribute ) {

				// Setting style.filter to null, "" & " " still leave "filter:" in the cssText
				// if "filter:" is present at all, clearType is disabled, we want to avoid this
				// style.removeAttribute is IE Only, but so apparently is this code path...
				style.removeAttribute( "filter" );

				// if there is no filter style applied in a css rule or unset inline opacity, we are done
				if ( value === "" || currentStyle && !currentStyle.filter ) {
					return;
				}
			}

			// otherwise, set new filter values
			style.filter = ralpha.test( filter ) ?
				filter.replace( ralpha, opacity ) :
				filter + " " + opacity;
		}
	};
}

// These hooks cannot be added until DOM ready because the support test
// for it is not run until after DOM ready
jQuery(function() {
	if ( !jQuery.support.reliableMarginRight ) {
		jQuery.cssHooks.marginRight = {
			get: function( elem, computed ) {
				if ( computed ) {
					// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
					// Work around by temporarily setting element display to inline-block
					return jQuery.swap( elem, { "display": "inline-block" },
						curCSS, [ elem, "marginRight" ] );
				}
			}
		};
	}

	// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
	// getComputedStyle returns percent when specified for top/left/bottom/right
	// rather than make the css module depend on the offset module, we just check for it here
	if ( !jQuery.support.pixelPosition && jQuery.fn.position ) {
		jQuery.each( [ "top", "left" ], function( i, prop ) {
			jQuery.cssHooks[ prop ] = {
				get: function( elem, computed ) {
					if ( computed ) {
						computed = curCSS( elem, prop );
						// if curCSS returns percentage, fallback to offset
						return rnumnonpx.test( computed ) ?
							jQuery( elem ).position()[ prop ] + "px" :
							computed;
					}
				}
			};
		});
	}

});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.hidden = function( elem ) {
		// Support: Opera <= 12.12
		// Opera reports offsetWidths and offsetHeights less than zero on some elements
		return elem.offsetWidth <= 0 && elem.offsetHeight <= 0 ||
			(!jQuery.support.reliableHiddenOffsets && ((elem.style && elem.style.display) || jQuery.css( elem, "display" )) === "none");
	};

	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};
}

// These hooks are used by animate to expand properties
jQuery.each({
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// assumes a single number if not a string
				parts = typeof value === "string" ? value.split(" ") : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
});
var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

jQuery.fn.extend({
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map(function(){
			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		})
		.filter(function(){
			var type = this.type;
			// Use .is(":disabled") so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !manipulation_rcheckableType.test( type ) );
		})
		.map(function( i, elem ){
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val ){
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});

//Serialize an array of form elements or a set of
//key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, value ) {
			// If value is a function, invoke it and return its value
			value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
		};

	// Set traditional to true for jQuery <= 1.3.2 behavior.
	if ( traditional === undefined ) {
		traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		});

	} else {
		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" ).replace( r20, "+" );
};

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// Item is non-scalar (array or object), encode its numeric index.
				buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {
		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}
jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
});

jQuery.fn.hover = function( fnOver, fnOut ) {
	return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
};
var
	// Document location
	ajaxLocParts,
	ajaxLocation,
	ajax_nonce = jQuery.now(),

	ajax_rquery = /\?/,
	rhash = /#.*$/,
	rts = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rurl = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,

	// Keep a copy of the old load method
	_load = jQuery.fn.load,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat("*");

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
	ajaxLocation = location.href;
} catch( e ) {
	// Use the href attribute of an A element
	// since IE will modify it given document.location
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( core_rnotwhite ) || [];

		if ( jQuery.isFunction( func ) ) {
			// For each dataType in the dataTypeExpression
			while ( (dataType = dataTypes[i++]) ) {
				// Prepend if requested
				if ( dataType[0] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					(structure[ dataType ] = structure[ dataType ] || []).unshift( func );

				// Otherwise append
				} else {
					(structure[ dataType ] = structure[ dataType ] || []).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if( typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[ dataTypeOrTransport ] ) {
				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		});
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var deep, key,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || (deep = {}) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

jQuery.fn.load = function( url, params, callback ) {
	if ( typeof url !== "string" && _load ) {
		return _load.apply( this, arguments );
	}

	var selector, response, type,
		self = this,
		off = url.indexOf(" ");

	if ( off >= 0 ) {
		selector = url.slice( off, url.length );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax({
			url: url,

			// if "type" variable is undefined, then "GET" method will be used
			type: type,
			dataType: "html",
			data: params
		}).done(function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery("<div>").append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		}).complete( callback && function( jqXHR, status ) {
			self.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );
		});
	}

	return this;
};

// Attach a bunch of functions for handling common AJAX events
jQuery.each( [ "ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend" ], function( i, type ){
	jQuery.fn[ type ] = function( fn ){
		return this.on( type, fn );
	};
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		});
	};
});

jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: ajaxLocation,
		type: "GET",
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": window.String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var // Cross-domain detection vars
			parts,
			// Loop variable
			i,
			// URL without anti-cache param
			cacheURL,
			// Response headers as string
			responseHeadersString,
			// timeout handle
			timeoutTimer,

			// To know if global events are to be dispatched
			fireGlobals,

			transport,
			// Response headers
			responseHeaders,
			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context && ( callbackContext.nodeType || callbackContext.jquery ) ?
				jQuery( callbackContext ) :
				jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks("once memory"),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// The jqXHR state
			state = 0,
			// Default abort message
			strAbort = "canceled",
			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( (match = rheaders.exec( responseHeadersString )) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					var lname = name.toLowerCase();
					if ( !state ) {
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( state < 2 ) {
							for ( code in map ) {
								// Lazy-add the new callback in a way that preserves old ones
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						} else {
							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR ).complete = completeDeferred.add;
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || ajaxLocation ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( core_rnotwhite ) || [""];

		// A cross-domain request is in order when we have a protocol:host:port mismatch
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? 80 : 443 ) ) !=
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? 80 : 443 ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( state === 2 ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		fireGlobals = s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger("ajaxStart");
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		cacheURL = s.url;

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL = ( s.url += ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + s.data );
				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add anti-cache in url if needed
			if ( s.cache === false ) {
				s.url = rts.test( cacheURL ) ?

					// If there is already a '_' parameter, set its value
					cacheURL.replace( rts, "$1_=" + ajax_nonce++ ) :

					// Otherwise add one to the end
					cacheURL + ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ajax_nonce++;
			}
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
			// Abort if not done already and return
			return jqXHR.abort();
		}

		// aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout(function() {
					jqXHR.abort("timeout");
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch ( e ) {
				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// If successful, handle type chaining
			if ( status >= 200 && status < 300 || status === 304 ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader("Last-Modified");
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader("etag");
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 ) {
					isSuccess = true;
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					isSuccess = true;
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					isSuccess = ajaxConvert( s, response );
					statusText = isSuccess.state;
					success = isSuccess.data;
					error = isSuccess.error;
					isSuccess = !error;
				}
			} else {
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger("ajaxStop");
				}
			}
		}

		return jqXHR;
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	}
});

/* Handles responses to an ajax request:
 * - sets all responseXXX fields accordingly
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {
	var firstDataType, ct, finalDataType, type,
		contents = s.contents,
		dataTypes = s.dataTypes,
		responseFields = s.responseFields;

	// Fill responseXXX fields
	for ( type in responseFields ) {
		if ( type in responses ) {
			jqXHR[ responseFields[type] ] = responses[ type ];
		}
	}

	// Remove auto dataType and get content-type in the process
	while( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

// Chain conversions given the request and the original response
function ajaxConvert( s, response ) {
	var conv2, current, conv, tmp,
		converters = {},
		i = 0,
		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice(),
		prev = dataTypes[ 0 ];

	// Apply the dataFilter if provided
	if ( s.dataFilter ) {
		response = s.dataFilter( response, s.dataType );
	}

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	// Convert to each sequential dataType, tolerating list modification
	for ( ; (current = dataTypes[++i]); ) {

		// There's only work to do if current dataType is non-auto
		if ( current !== "*" ) {

			// Convert response if prev dataType is non-auto and differs from current
			if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split(" ");
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {
								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.splice( i--, 0, current );
								}

								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s["throws"] ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
						}
					}
				}
			}

			// Update prev for next iteration
			prev = current;
		}
	}

	return { state: "success", data: response };
}
// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /(?:java|ecma)script/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
		s.global = false;
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function(s) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {

		var script,
			head = document.head || jQuery("head")[0] || document.documentElement;

		return {

			send: function( _, callback ) {

				script = document.createElement("script");

				script.async = true;

				if ( s.scriptCharset ) {
					script.charset = s.scriptCharset;
				}

				script.src = s.url;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function( _, isAbort ) {

					if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;

						// Remove the script
						if ( script.parentNode ) {
							script.parentNode.removeChild( script );
						}

						// Dereference the script
						script = null;

						// Callback if not abort
						if ( !isAbort ) {
							callback( 200, "success" );
						}
					}
				};

				// Circumvent IE6 bugs with base elements (#2709 and #4378) by prepending
				// Use native DOM manipulation to avoid our domManip AJAX trickery
				head.insertBefore( script, head.firstChild );
			},

			abort: function() {
				if ( script ) {
					script.onload( undefined, true );
				}
			}
		};
	}
});
var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( ajax_nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" && !( s.contentType || "" ).indexOf("application/x-www-form-urlencoded") && rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( ajax_rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always(function() {
			// Restore preexisting value
			window[ callbackName ] = overwritten;

			// Save back as free
			if ( s[ callbackName ] ) {
				// make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		});

		// Delegate to script
		return "script";
	}
});
var xhrCallbacks, xhrSupported,
	xhrId = 0,
	// #5280: Internet Explorer will keep connections alive if we don't abort on unload
	xhrOnUnloadAbort = window.ActiveXObject && function() {
		// Abort all pending requests
		var key;
		for ( key in xhrCallbacks ) {
			xhrCallbacks[ key ]( undefined, true );
		}
	};

// Functions to create xhrs
function createStandardXHR() {
	try {
		return new window.XMLHttpRequest();
	} catch( e ) {}
}

function createActiveXHR() {
	try {
		return new window.ActiveXObject("Microsoft.XMLHTTP");
	} catch( e ) {}
}

// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject ?
	/* Microsoft failed to properly
	 * implement the XMLHttpRequest in IE7 (can't request local files),
	 * so we use the ActiveXObject when it is available
	 * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
	 * we need a fallback.
	 */
	function() {
		return !this.isLocal && createStandardXHR() || createActiveXHR();
	} :
	// For all other browsers, use the standard XMLHttpRequest object
	createStandardXHR;

// Determine support properties
xhrSupported = jQuery.ajaxSettings.xhr();
jQuery.support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
xhrSupported = jQuery.support.ajax = !!xhrSupported;

// Create transport if the browser can provide an xhr
if ( xhrSupported ) {

	jQuery.ajaxTransport(function( s ) {
		// Cross domain only allowed if supported through XMLHttpRequest
		if ( !s.crossDomain || jQuery.support.cors ) {

			var callback;

			return {
				send: function( headers, complete ) {

					// Get a new xhr
					var handle, i,
						xhr = s.xhr();

					// Open the socket
					// Passing null username, generates a login popup on Opera (#2865)
					if ( s.username ) {
						xhr.open( s.type, s.url, s.async, s.username, s.password );
					} else {
						xhr.open( s.type, s.url, s.async );
					}

					// Apply custom fields if provided
					if ( s.xhrFields ) {
						for ( i in s.xhrFields ) {
							xhr[ i ] = s.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( s.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( s.mimeType );
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !s.crossDomain && !headers["X-Requested-With"] ) {
						headers["X-Requested-With"] = "XMLHttpRequest";
					}

					// Need an extra try/catch for cross domain requests in Firefox 3
					try {
						for ( i in headers ) {
							xhr.setRequestHeader( i, headers[ i ] );
						}
					} catch( err ) {}

					// Do send the request
					// This may raise an exception which is actually
					// handled in jQuery.ajax (so no try/catch here)
					xhr.send( ( s.hasContent && s.data ) || null );

					// Listener
					callback = function( _, isAbort ) {
						var status, responseHeaders, statusText, responses;

						// Firefox throws exceptions when accessing properties
						// of an xhr when a network error occurred
						// http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
						try {

							// Was never called and is aborted or complete
							if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

								// Only called once
								callback = undefined;

								// Do not keep as active anymore
								if ( handle ) {
									xhr.onreadystatechange = jQuery.noop;
									if ( xhrOnUnloadAbort ) {
										delete xhrCallbacks[ handle ];
									}
								}

								// If it's an abort
								if ( isAbort ) {
									// Abort it manually if needed
									if ( xhr.readyState !== 4 ) {
										xhr.abort();
									}
								} else {
									responses = {};
									status = xhr.status;
									responseHeaders = xhr.getAllResponseHeaders();

									// When requesting binary data, IE6-9 will throw an exception
									// on any attempt to access responseText (#11426)
									if ( typeof xhr.responseText === "string" ) {
										responses.text = xhr.responseText;
									}

									// Firefox throws an exception when accessing
									// statusText for faulty cross-domain requests
									try {
										statusText = xhr.statusText;
									} catch( e ) {
										// We normalize with Webkit giving an empty statusText
										statusText = "";
									}

									// Filter status for non standard behaviors

									// If the request is local and we have data: assume a success
									// (success with no data won't get notified, that's the best we
									// can do given current implementations)
									if ( !status && s.isLocal && !s.crossDomain ) {
										status = responses.text ? 200 : 404;
									// IE - #1450: sometimes returns 1223 when it should be 204
									} else if ( status === 1223 ) {
										status = 204;
									}
								}
							}
						} catch( firefoxAccessException ) {
							if ( !isAbort ) {
								complete( -1, firefoxAccessException );
							}
						}

						// Call complete if needed
						if ( responses ) {
							complete( status, statusText, responses, responseHeaders );
						}
					};

					if ( !s.async ) {
						// if we're in sync mode we fire the callback
						callback();
					} else if ( xhr.readyState === 4 ) {
						// (IE6 & IE7) if it's in cache and has been
						// retrieved directly we need to fire the callback
						setTimeout( callback );
					} else {
						handle = ++xhrId;
						if ( xhrOnUnloadAbort ) {
							// Create the active xhrs callbacks list if needed
							// and attach the unload handler
							if ( !xhrCallbacks ) {
								xhrCallbacks = {};
								jQuery( window ).unload( xhrOnUnloadAbort );
							}
							// Add to list of active xhrs callbacks
							xhrCallbacks[ handle ] = callback;
						}
						xhr.onreadystatechange = callback;
					}
				},

				abort: function() {
					if ( callback ) {
						callback( undefined, true );
					}
				}
			};
		}
	});
}
var fxNow, timerId,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = new RegExp( "^(?:([+-])=|)(" + core_pnum + ")([a-z%]*)$", "i" ),
	rrun = /queueHooks$/,
	animationPrefilters = [ defaultPrefilter ],
	tweeners = {
		"*": [function( prop, value ) {
			var end, unit,
				tween = this.createTween( prop, value ),
				parts = rfxnum.exec( value ),
				target = tween.cur(),
				start = +target || 0,
				scale = 1,
				maxIterations = 20;

			if ( parts ) {
				end = +parts[2];
				unit = parts[3] || ( jQuery.cssNumber[ prop ] ? "" : "px" );

				// We need to compute starting value
				if ( unit !== "px" && start ) {
					// Iteratively approximate from a nonzero starting point
					// Prefer the current property, because this process will be trivial if it uses the same units
					// Fallback to end or a simple constant
					start = jQuery.css( tween.elem, prop, true ) || end || 1;

					do {
						// If previous iteration zeroed out, double until we get *something*
						// Use a string for doubling factor so we don't accidentally see scale as unchanged below
						scale = scale || ".5";

						// Adjust and apply
						start = start / scale;
						jQuery.style( tween.elem, prop, start + unit );

					// Update scale, tolerating zero or NaN from tween.cur()
					// And breaking the loop if scale is unchanged or perfect, or if we've just had enough
					} while ( scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations );
				}

				tween.unit = unit;
				tween.start = start;
				// If a +=/-= token was provided, we're doing a relative animation
				tween.end = parts[1] ? start + ( parts[1] + 1 ) * end : end;
			}
			return tween;
		}]
	};

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout(function() {
		fxNow = undefined;
	});
	return ( fxNow = jQuery.now() );
}

function createTweens( animation, props ) {
	jQuery.each( props, function( prop, value ) {
		var collection = ( tweeners[ prop ] || [] ).concat( tweeners[ "*" ] ),
			index = 0,
			length = collection.length;
		for ( ; index < length; index++ ) {
			if ( collection[ index ].call( animation, prop, value ) ) {

				// we're done with this property
				return;
			}
		}
	});
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = animationPrefilters.length,
		deferred = jQuery.Deferred().always( function() {
			// don't match elem in the :animated selector
			delete tick.elem;
		}),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
				// archaic crash bug won't allow us to use 1 - ( 0.5 || 0 ) (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length ; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ]);

			if ( percent < 1 && length ) {
				return remaining;
			} else {
				deferred.resolveWith( elem, [ animation ] );
				return false;
			}
		},
		animation = deferred.promise({
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, { specialEasing: {} }, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,
					// if we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// resolve when we played the last frame
				// otherwise, reject
				if ( gotoEnd ) {
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		}),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length ; index++ ) {
		result = animationPrefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			return result;
		}
	}

	createTweens( animation, props );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		})
	);

	// attach callbacks from options
	return animation.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );
}

function propFilter( props, specialEasing ) {
	var value, name, index, easing, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( jQuery.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// not quite $.extend, this wont overwrite keys already present.
			// also - reusing 'index' from above because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

jQuery.Animation = jQuery.extend( Animation, {

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.split(" ");
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length ; index++ ) {
			prop = props[ index ];
			tweeners[ prop ] = tweeners[ prop ] || [];
			tweeners[ prop ].unshift( callback );
		}
	},

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			animationPrefilters.unshift( callback );
		} else {
			animationPrefilters.push( callback );
		}
	}
});

function defaultPrefilter( elem, props, opts ) {
	/*jshint validthis:true */
	var prop, index, length,
		value, dataShow, toggle,
		tween, hooks, oldfire,
		anim = this,
		style = elem.style,
		orig = {},
		handled = [],
		hidden = elem.nodeType && isHidden( elem );

	// handle queue: false promises
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always(function() {
			// doing this makes sure that the complete handler will be called
			// before this completes
			anim.always(function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			});
		});
	}

	// height/width overflow pass
	if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
		// Make sure that nothing sneaks out
		// Record all 3 overflow attributes because IE does not
		// change the overflow attribute when overflowX and
		// overflowY are set to the same value
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Set display property to inline-block for height/width
		// animations on inline elements that are having width/height animated
		if ( jQuery.css( elem, "display" ) === "inline" &&
				jQuery.css( elem, "float" ) === "none" ) {

			// inline-level elements accept inline-block;
			// block-level elements need to be inline with layout
			if ( !jQuery.support.inlineBlockNeedsLayout || css_defaultDisplay( elem.nodeName ) === "inline" ) {
				style.display = "inline-block";

			} else {
				style.zoom = 1;
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		if ( !jQuery.support.shrinkWrapBlocks ) {
			anim.always(function() {
				style.overflow = opts.overflow[ 0 ];
				style.overflowX = opts.overflow[ 1 ];
				style.overflowY = opts.overflow[ 2 ];
			});
		}
	}


	// show/hide pass
	for ( index in props ) {
		value = props[ index ];
		if ( rfxtypes.exec( value ) ) {
			delete props[ index ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {
				continue;
			}
			handled.push( index );
		}
	}

	length = handled.length;
	if ( length ) {
		dataShow = jQuery._data( elem, "fxshow" ) || jQuery._data( elem, "fxshow", {} );
		if ( "hidden" in dataShow ) {
			hidden = dataShow.hidden;
		}

		// store state if its toggle - enables .stop().toggle() to "reverse"
		if ( toggle ) {
			dataShow.hidden = !hidden;
		}
		if ( hidden ) {
			jQuery( elem ).show();
		} else {
			anim.done(function() {
				jQuery( elem ).hide();
			});
		}
		anim.done(function() {
			var prop;
			jQuery._removeData( elem, "fxshow" );
			for ( prop in orig ) {
				jQuery.style( elem, prop, orig[ prop ] );
			}
		});
		for ( index = 0 ; index < length ; index++ ) {
			prop = handled[ index ];
			tween = anim.createTween( prop, hidden ? dataShow[ prop ] : 0 );
			orig[ prop ] = dataShow[ prop ] || jQuery.style( elem, prop );

			if ( !( prop in dataShow ) ) {
				dataShow[ prop ] = tween.start;
				if ( hidden ) {
					tween.end = tween.start;
					tween.start = prop === "width" || prop === "height" ? 1 : 0;
				}
			}
		}
	}
}

function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || "swing";
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			if ( tween.elem[ tween.prop ] != null &&
				(!tween.elem.style || tween.elem.style[ tween.prop ] == null) ) {
				return tween.elem[ tween.prop ];
			}

			// passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails
			// so, simple values such as "10px" are parsed to Float.
			// complex values such as "rotate(1rad)" are returned as is.
			result = jQuery.css( tween.elem, tween.prop, "" );
			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {
			// use step hook for back compat - use cssHook if its there - use .style if its
			// available and use plain properties where available
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.style && ( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null || jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Remove in 2.0 - this supports IE8's panic based approach
// to setting things on disconnected nodes

Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.each([ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
});

jQuery.fn.extend({
	fadeTo: function( speed, to, easing, callback ) {

		// show any hidden elements after setting opacity to 0
		return this.filter( isHidden ).css( "opacity", 0 ).show()

			// animate to the value specified
			.end().animate({ opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {
				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );
				doAnimation.finish = function() {
					anim.stop( true );
				};
				// Empty animations, or finishing resolves immediately
				if ( empty || jQuery._data( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each(function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = jQuery._data( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each(function() {
			var index,
				data = jQuery._data( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// enable finishing flag on private data
			data.finish = true;

			// empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.cur && hooks.cur.finish ) {
				hooks.cur.finish.call( this );
			}

			// look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// turn off finishing flag
			delete data.finish;
		});
	}
});

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		attrs = { height: type },
		i = 0;

	// if we include width, step value is 1 to do all cssExpand values,
	// if we don't include width, step value is 2 to skip over Left and Right
	includeWidth = includeWidth? 1 : 0;
	for( ; i < 4 ; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx("show"),
	slideUp: genFx("hide"),
	slideToggle: genFx("toggle"),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
		opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

	// normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p*Math.PI ) / 2;
	}
};

jQuery.timers = [];
jQuery.fx = Tween.prototype.init;
jQuery.fx.tick = function() {
	var timer,
		timers = jQuery.timers,
		i = 0;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];
		// Checks the timer has not already been removed
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	if ( timer() && jQuery.timers.push( timer ) ) {
		jQuery.fx.start();
	}
};

jQuery.fx.interval = 13;

jQuery.fx.start = function() {
	if ( !timerId ) {
		timerId = setInterval( jQuery.fx.tick, jQuery.fx.interval );
	}
};

jQuery.fx.stop = function() {
	clearInterval( timerId );
	timerId = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,
	// Default speed
	_default: 400
};

// Back Compat <1.8 extension point
jQuery.fx.step = {};

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};
}
jQuery.fn.offset = function( options ) {
	if ( arguments.length ) {
		return options === undefined ?
			this :
			this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
	}

	var docElem, win,
		box = { top: 0, left: 0 },
		elem = this[ 0 ],
		doc = elem && elem.ownerDocument;

	if ( !doc ) {
		return;
	}

	docElem = doc.documentElement;

	// Make sure it's not a disconnected DOM node
	if ( !jQuery.contains( docElem, elem ) ) {
		return box;
	}

	// If we don't have gBCR, just use 0,0 rather than error
	// BlackBerry 5, iOS 3 (original iPhone)
	if ( typeof elem.getBoundingClientRect !== core_strundefined ) {
		box = elem.getBoundingClientRect();
	}
	win = getWindow( doc );
	return {
		top: box.top  + ( win.pageYOffset || docElem.scrollTop )  - ( docElem.clientTop  || 0 ),
		left: box.left + ( win.pageXOffset || docElem.scrollLeft ) - ( docElem.clientLeft || 0 )
	};
};

jQuery.offset = {

	setOffset: function( elem, options, i ) {
		var position = jQuery.css( elem, "position" );

		// set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		var curElem = jQuery( elem ),
			curOffset = curElem.offset(),
			curCSSTop = jQuery.css( elem, "top" ),
			curCSSLeft = jQuery.css( elem, "left" ),
			calculatePosition = ( position === "absolute" || position === "fixed" ) && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
			props = {}, curPosition = {}, curTop, curLeft;

		// need to be able to calculate position if either top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;
		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};


jQuery.fn.extend({

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			parentOffset = { top: 0, left: 0 },
			elem = this[ 0 ];

		// fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is it's only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {
			// we assume that getBoundingClientRect is available when computed position is fixed
			offset = elem.getBoundingClientRect();
		} else {
			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset.top  += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
			parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
		}

		// Subtract parent offsets and element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		return {
			top:  offset.top  - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true)
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || document.documentElement;
			while ( offsetParent && ( !jQuery.nodeName( offsetParent, "html" ) && jQuery.css( offsetParent, "position") === "static" ) ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent || document.documentElement;
		});
	}
});


// Create scrollLeft and scrollTop methods
jQuery.each( {scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function( method, prop ) {
	var top = /Y/.test( prop );

	jQuery.fn[ method ] = function( val ) {
		return jQuery.access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? (prop in win) ? win[ prop ] :
					win.document.documentElement[ method ] :
					elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : jQuery( win ).scrollLeft(),
					top ? val : jQuery( win ).scrollTop()
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length, null );
	};
});

function getWindow( elem ) {
	return jQuery.isWindow( elem ) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}
// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name }, function( defaultExtra, funcName ) {
		// margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return jQuery.access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {
					// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
					// isn't a whole lot we can do. See pull request at this URL for discussion:
					// https://github.com/jquery/jquery/pull/764
					return elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height], whichever is greatest
					// unfortunately, this causes bug #3838 in IE6/8 only, but there is currently no good, small way to fix it.
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?
					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable, null );
		};
	});
});
// Limit scope pollution from any deprecated API
// (function() {

// })();
// Expose jQuery to the global object
window.jQuery = window.$ = jQuery;

// Expose jQuery as an AMD module, but only for AMD loaders that
// understand the issues with loading multiple versions of jQuery
// in a page that all might call define(). The loader will indicate
// they have special allowances for multiple jQuery versions by
// specifying define.amd.jQuery = true. Register as a named module,
// since jQuery can be concatenated with other files that may use define,
// but not use a proper concatenation script that understands anonymous
// AMD modules. A named AMD is safest and most robust way to register.
// Lowercase jquery is used because AMD module names are derived from
// file names, and jQuery is normally delivered in a lowercase file name.
// Do this after creating the global so that if an AMD module wants to call
// noConflict to hide this version of jQuery, it will work.
if ( typeof define === "function" && define.amd && define.amd.jQuery ) {
	define( "jquery", [], function () { return jQuery; } );
}

})( window );

/**
 * jQuery Once Plugin v1.2
 * http://plugins.jquery.com/project/once
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */

(function ($) {
  var cache = {}, uuid = 0;

  /**
   * Filters elements by whether they have not yet been processed.
   *
   * @param id
   *   (Optional) If this is a string, then it will be used as the CSS class
   *   name that is applied to the elements for determining whether it has
   *   already been processed. The elements will get a class in the form of
   *   "id-processed".
   *
   *   If the id parameter is a function, it will be passed off to the fn
   *   parameter and the id will become a unique identifier, represented as a
   *   number.
   *
   *   When the id is neither a string or a function, it becomes a unique
   *   identifier, depicted as a number. The element's class will then be
   *   represented in the form of "jquery-once-#-processed".
   *
   *   Take note that the id must be valid for usage as an element's class name.
   * @param fn
   *   (Optional) If given, this function will be called for each element that
   *   has not yet been processed. The function's return value follows the same
   *   logic as $.each(). Returning true will continue to the next matched
   *   element in the set, while returning false will entirely break the
   *   iteration.
   */
  $.fn.once = function (id, fn) {
    if (typeof id != 'string') {
      // Generate a numeric ID if the id passed can't be used as a CSS class.
      if (!(id in cache)) {
        cache[id] = ++uuid;
      }
      // When the fn parameter is not passed, we interpret it from the id.
      if (!fn) {
        fn = id;
      }
      id = 'jquery-once-' + cache[id];
    }
    // Remove elements from the set that have already been processed.
    var name = id + '-processed';
    var elements = this.not('.' + name).addClass(name);

    return $.isFunction(fn) ? elements.each(fn) : elements;
  };

  /**
   * Filters elements that have been processed once already.
   *
   * @param id
   *   A required string representing the name of the class which should be used
   *   when filtering the elements. This only filters elements that have already
   *   been processed by the once function. The id should be the same id that
   *   was originally passed to the once() function.
   * @param fn
   *   (Optional) If given, this function will be called for each element that
   *   has not yet been processed. The function's return value follows the same
   *   logic as $.each(). Returning true will continue to the next matched
   *   element in the set, while returning false will entirely break the
   *   iteration.
   */
  $.fn.removeOnce = function (id, fn) {
    var name = id + '-processed';
    var elements = this.filter('.' + name).removeClass(name);

    return $.isFunction(fn) ? elements.each(fn) : elements;
  };
})(jQuery);


var Drupal = Drupal || { 'settings': {}, 'behaviors': {}, 'locale': {} };

// Allow other JavaScript libraries to use $.
jQuery.noConflict();

(function ($) {

/**
 * Override jQuery.fn.init to guard against XSS attacks.
 *
 * See http://bugs.jquery.com/ticket/9521
 */
var jquery_init = $.fn.init;
$.fn.init = function (selector, context, rootjQuery) {
  // If the string contains a "#" before a "<", treat it as invalid HTML.
  if (selector && typeof selector === 'string') {
    var hash_position = selector.indexOf('#');
    if (hash_position >= 0) {
      var bracket_position = selector.indexOf('<');
      if (bracket_position > hash_position) {
        throw 'Syntax error, unrecognized expression: ' + selector;
      }
    }
  }
  return jquery_init.call(this, selector, context, rootjQuery);
};
$.fn.init.prototype = jquery_init.prototype;

/**
 * Attach all registered behaviors to a page element.
 *
 * Behaviors are event-triggered actions that attach to page elements, enhancing
 * default non-JavaScript UIs. Behaviors are registered in the Drupal.behaviors
 * object using the method 'attach' and optionally also 'detach' as follows:
 * @code
 *    Drupal.behaviors.behaviorName = {
 *      attach: function (context, settings) {
 *        ...
 *      },
 *      detach: function (context, settings, trigger) {
 *        ...
 *      }
 *    };
 * @endcode
 *
 * Drupal.attachBehaviors is added below to the jQuery ready event and so
 * runs on initial page load. Developers implementing AHAH/Ajax in their
 * solutions should also call this function after new page content has been
 * loaded, feeding in an element to be processed, in order to attach all
 * behaviors to the new content.
 *
 * Behaviors should use
 * @code
 *   $(selector).once('behavior-name', function () {
 *     ...
 *   });
 * @endcode
 * to ensure the behavior is attached only once to a given element. (Doing so
 * enables the reprocessing of given elements, which may be needed on occasion
 * despite the ability to limit behavior attachment to a particular element.)
 *
 * @param context
 *   An element to attach behaviors to. If none is given, the document element
 *   is used.
 * @param settings
 *   An object containing settings for the current context. If none given, the
 *   global Drupal.settings object is used.
 */
Drupal.attachBehaviors = function (context, settings) {
  context = context || document;
  settings = settings || Drupal.settings;
  // Execute all of them.
  $.each(Drupal.behaviors, function () {
    if ($.isFunction(this.attach)) {
      this.attach(context, settings);
    }
  });
};

/**
 * Detach registered behaviors from a page element.
 *
 * Developers implementing AHAH/Ajax in their solutions should call this
 * function before page content is about to be removed, feeding in an element
 * to be processed, in order to allow special behaviors to detach from the
 * content.
 *
 * Such implementations should look for the class name that was added in their
 * corresponding Drupal.behaviors.behaviorName.attach implementation, i.e.
 * behaviorName-processed, to ensure the behavior is detached only from
 * previously processed elements.
 *
 * @param context
 *   An element to detach behaviors from. If none is given, the document element
 *   is used.
 * @param settings
 *   An object containing settings for the current context. If none given, the
 *   global Drupal.settings object is used.
 * @param trigger
 *   A string containing what's causing the behaviors to be detached. The
 *   possible triggers are:
 *   - unload: (default) The context element is being removed from the DOM.
 *   - move: The element is about to be moved within the DOM (for example,
 *     during a tabledrag row swap). After the move is completed,
 *     Drupal.attachBehaviors() is called, so that the behavior can undo
 *     whatever it did in response to the move. Many behaviors won't need to
 *     do anything simply in response to the element being moved, but because
 *     IFRAME elements reload their "src" when being moved within the DOM,
 *     behaviors bound to IFRAME elements (like WYSIWYG editors) may need to
 *     take some action.
 *   - serialize: When an Ajax form is submitted, this is called with the
 *     form as the context. This provides every behavior within the form an
 *     opportunity to ensure that the field elements have correct content
 *     in them before the form is serialized. The canonical use-case is so
 *     that WYSIWYG editors can update the hidden textarea to which they are
 *     bound.
 *
 * @see Drupal.attachBehaviors
 */
Drupal.detachBehaviors = function (context, settings, trigger) {
  context = context || document;
  settings = settings || Drupal.settings;
  trigger = trigger || 'unload';
  // Execute all of them.
  $.each(Drupal.behaviors, function () {
    if ($.isFunction(this.detach)) {
      this.detach(context, settings, trigger);
    }
  });
};

/**
 * Encode special characters in a plain-text string for display as HTML.
 *
 * @ingroup sanitization
 */
Drupal.checkPlain = function (str) {
  var character, regex,
      replace = { '&': '&amp;', '"': '&quot;', '<': '&lt;', '>': '&gt;' };
  str = String(str);
  for (character in replace) {
    if (replace.hasOwnProperty(character)) {
      regex = new RegExp(character, 'g');
      str = str.replace(regex, replace[character]);
    }
  }
  return str;
};

/**
 * Replace placeholders with sanitized values in a string.
 *
 * @param str
 *   A string with placeholders.
 * @param args
 *   An object of replacements pairs to make. Incidences of any key in this
 *   array are replaced with the corresponding value. Based on the first
 *   character of the key, the value is escaped and/or themed:
 *    - !variable: inserted as is
 *    - @variable: escape plain text to HTML (Drupal.checkPlain)
 *    - %variable: escape text and theme as a placeholder for user-submitted
 *      content (checkPlain + Drupal.theme('placeholder'))
 *
 * @see Drupal.t()
 * @ingroup sanitization
 */
Drupal.formatString = function(str, args) {
  // Transform arguments before inserting them.
  for (var key in args) {
    switch (key.charAt(0)) {
      // Escaped only.
      case '@':
        args[key] = Drupal.checkPlain(args[key]);
      break;
      // Pass-through.
      case '!':
        break;
      // Escaped and placeholder.
      case '%':
      default:
        args[key] = Drupal.theme('placeholder', args[key]);
        break;
    }
    str = str.replace(key, args[key]);
  }
  return str;
};

/**
 * Translate strings to the page language or a given language.
 *
 * See the documentation of the server-side t() function for further details.
 *
 * @param str
 *   A string containing the English string to translate.
 * @param args
 *   An object of replacements pairs to make after translation. Incidences
 *   of any key in this array are replaced with the corresponding value.
 *   See Drupal.formatString().
 *
 * @param options
 *   - 'context' (defaults to the empty context): The context the source string
 *     belongs to.
 *
 * @return
 *   The translated string.
 */
Drupal.t = function (str, args, options) {
  options = options || {};
  options.context = options.context || '';

  // Fetch the localized version of the string.
  if (Drupal.locale.strings && Drupal.locale.strings[options.context] && Drupal.locale.strings[options.context][str]) {
    str = Drupal.locale.strings[options.context][str];
  }

  if (args) {
    str = Drupal.formatString(str, args);
  }
  return str;
};

/**
 * Format a string containing a count of items.
 *
 * This function ensures that the string is pluralized correctly. Since Drupal.t() is
 * called by this function, make sure not to pass already-localized strings to it.
 *
 * See the documentation of the server-side format_plural() function for further details.
 *
 * @param count
 *   The item count to display.
 * @param singular
 *   The string for the singular case. Please make sure it is clear this is
 *   singular, to ease translation (e.g. use "1 new comment" instead of "1 new").
 *   Do not use @count in the singular string.
 * @param plural
 *   The string for the plural case. Please make sure it is clear this is plural,
 *   to ease translation. Use @count in place of the item count, as in "@count
 *   new comments".
 * @param args
 *   An object of replacements pairs to make after translation. Incidences
 *   of any key in this array are replaced with the corresponding value.
 *   See Drupal.formatString().
 *   Note that you do not need to include @count in this array.
 *   This replacement is done automatically for the plural case.
 * @param options
 *   The options to pass to the Drupal.t() function.
 * @return
 *   A translated string.
 */
Drupal.formatPlural = function (count, singular, plural, args, options) {
  var args = args || {};
  args['@count'] = count;
  // Determine the index of the plural form.
  var index = Drupal.locale.pluralFormula ? Drupal.locale.pluralFormula(args['@count']) : ((args['@count'] == 1) ? 0 : 1);

  if (index == 0) {
    return Drupal.t(singular, args, options);
  }
  else if (index == 1) {
    return Drupal.t(plural, args, options);
  }
  else {
    args['@count[' + index + ']'] = args['@count'];
    delete args['@count'];
    return Drupal.t(plural.replace('@count', '@count[' + index + ']'), args, options);
  }
};

/**
 * Generate the themed representation of a Drupal object.
 *
 * All requests for themed output must go through this function. It examines
 * the request and routes it to the appropriate theme function. If the current
 * theme does not provide an override function, the generic theme function is
 * called.
 *
 * For example, to retrieve the HTML for text that should be emphasized and
 * displayed as a placeholder inside a sentence, call
 * Drupal.theme('placeholder', text).
 *
 * @param func
 *   The name of the theme function to call.
 * @param ...
 *   Additional arguments to pass along to the theme function.
 * @return
 *   Any data the theme function returns. This could be a plain HTML string,
 *   but also a complex object.
 */
Drupal.theme = function (func) {
  var args = Array.prototype.slice.apply(arguments, [1]);

  return (Drupal.theme[func] || Drupal.theme.prototype[func]).apply(this, args);
};

/**
 * Freeze the current body height (as minimum height). Used to prevent
 * unnecessary upwards scrolling when doing DOM manipulations.
 */
Drupal.freezeHeight = function () {
  Drupal.unfreezeHeight();
  $('<div id="freeze-height"></div>').css({
    position: 'absolute',
    top: '0px',
    left: '0px',
    width: '1px',
    height: $('body').css('height')
  }).appendTo('body');
};

/**
 * Unfreeze the body height.
 */
Drupal.unfreezeHeight = function () {
  $('#freeze-height').remove();
};

/**
 * Encodes a Drupal path for use in a URL.
 *
 * For aesthetic reasons slashes are not escaped.
 */
Drupal.encodePath = function (item, uri) {
  uri = uri || location.href;
  return encodeURIComponent(item).replace(/%2F/g, '/');
};

/**
 * Get the text selection in a textarea.
 */
Drupal.getSelection = function (element) {
  if (typeof element.selectionStart != 'number' && document.selection) {
    // The current selection.
    var range1 = document.selection.createRange();
    var range2 = range1.duplicate();
    // Select all text.
    range2.moveToElementText(element);
    // Now move 'dummy' end point to end point of original range.
    range2.setEndPoint('EndToEnd', range1);
    // Now we can calculate start and end points.
    var start = range2.text.length - range1.text.length;
    var end = start + range1.text.length;
    return { 'start': start, 'end': end };
  }
  return { 'start': element.selectionStart, 'end': element.selectionEnd };
};

/**
 * Build an error message from an Ajax response.
 */
Drupal.ajaxError = function (xmlhttp, uri) {
  var statusCode, statusText, pathText, responseText, readyStateText, message;
  if (xmlhttp.status) {
    statusCode = "\n" + Drupal.t("An AJAX HTTP error occurred.") +  "\n" + Drupal.t("HTTP Result Code: !status", {'!status': xmlhttp.status});
  }
  else {
    statusCode = "\n" + Drupal.t("An AJAX HTTP request terminated abnormally.");
  }
  statusCode += "\n" + Drupal.t("Debugging information follows.");
  pathText = "\n" + Drupal.t("Path: !uri", {'!uri': uri} );
  statusText = '';
  // In some cases, when statusCode == 0, xmlhttp.statusText may not be defined.
  // Unfortunately, testing for it with typeof, etc, doesn't seem to catch that
  // and the test causes an exception. So we need to catch the exception here.
  try {
    statusText = "\n" + Drupal.t("StatusText: !statusText", {'!statusText': $.trim(xmlhttp.statusText)});
  }
  catch (e) {}

  responseText = '';
  // Again, we don't have a way to know for sure whether accessing
  // xmlhttp.responseText is going to throw an exception. So we'll catch it.
  try {
    responseText = "\n" + Drupal.t("ResponseText: !responseText", {'!responseText': $.trim(xmlhttp.responseText) } );
  } catch (e) {}

  // Make the responseText more readable by stripping HTML tags and newlines.
  responseText = responseText.replace(/<("[^"]*"|'[^']*'|[^'">])*>/gi,"");
  responseText = responseText.replace(/[\n]+\s+/g,"\n");

  // We don't need readyState except for status == 0.
  readyStateText = xmlhttp.status == 0 ? ("\n" + Drupal.t("ReadyState: !readyState", {'!readyState': xmlhttp.readyState})) : "";

  message = statusCode + pathText + statusText + responseText + readyStateText;
  return message;
};

// Class indicating that JS is enabled; used for styling purpose.
$('html').addClass('js');

// 'js enabled' cookie.
document.cookie = 'has_js=1; path=/';

/**
 * Additions to jQuery.support.
 */
$(function () {
  /**
   * Boolean indicating whether or not position:fixed is supported.
   */
  if (jQuery.support.positionFixed === undefined) {
    var el = $('<div style="position:fixed; top:10px" />').appendTo(document.body);
    jQuery.support.positionFixed = el[0].offsetTop === 10;
    el.remove();
  }
});

//Attach all behaviors.
$(function () {
  Drupal.attachBehaviors(document, Drupal.settings);
});

/**
 * The default themes.
 */
Drupal.theme.prototype = {

  /**
   * Formats text for emphasized display in a placeholder inside a sentence.
   *
   * @param str
   *   The text to format (plain-text).
   * @return
   *   The formatted text (html).
   */
  placeholder: function (str) {
    return '<em class="placeholder">' + Drupal.checkPlain(str) + '</em>';
  }
};

})(jQuery);

(function ($) {

/**
 * Provides Ajax page updating via jQuery $.ajax (Asynchronous JavaScript and XML).
 *
 * Ajax is a method of making a request via JavaScript while viewing an HTML
 * page. The request returns an array of commands encoded in JSON, which is
 * then executed to make any changes that are necessary to the page.
 *
 * Drupal uses this file to enhance form elements with #ajax['path'] and
 * #ajax['wrapper'] properties. If set, this file will automatically be included
 * to provide Ajax capabilities.
 */

Drupal.ajax = Drupal.ajax || {};

/**
 * Attaches the Ajax behavior to each Ajax form element.
 */
Drupal.behaviors.AJAX = {
  attach: function (context, settings) {
    // Load all Ajax behaviors specified in the settings.
    for (var base in settings.ajax) {
      if (!$('#' + base + '.ajax-processed').length) {
        var element_settings = settings.ajax[base];

        if (typeof element_settings.selector == 'undefined') {
          element_settings.selector = '#' + base;
        }
        $(element_settings.selector).each(function () {
          element_settings.element = this;
          Drupal.ajax[base] = new Drupal.ajax(base, this, element_settings);
        });

        $('#' + base).addClass('ajax-processed');
      }
    }

    // Bind Ajax behaviors to all items showing the class.
    $('.use-ajax:not(.ajax-processed)').addClass('ajax-processed').each(function () {
      var element_settings = {};
      // Clicked links look better with the throbber than the progress bar.
      element_settings.progress = { 'type': 'throbber' };

      // For anchor tags, these will go to the target of the anchor rather
      // than the usual location.
      if ($(this).attr('href')) {
        element_settings.url = $(this).attr('href');
        element_settings.event = 'click';
      }
      var base = $(this).attr('id');
      Drupal.ajax[base] = new Drupal.ajax(base, this, element_settings);
    });

    // This class means to submit the form to the action using Ajax.
    $('.use-ajax-submit:not(.ajax-processed)').addClass('ajax-processed').each(function () {
      var element_settings = {};

      // Ajax submits specified in this manner automatically submit to the
      // normal form action.
      element_settings.url = $(this.form).attr('action');
      // Form submit button clicks need to tell the form what was clicked so
      // it gets passed in the POST request.
      element_settings.setClick = true;
      // Form buttons use the 'click' event rather than mousedown.
      element_settings.event = 'click';
      // Clicked form buttons look better with the throbber than the progress bar.
      element_settings.progress = { 'type': 'throbber' };

      var base = $(this).attr('id');
      Drupal.ajax[base] = new Drupal.ajax(base, this, element_settings);
    });
  }
};

/**
 * Ajax object.
 *
 * All Ajax objects on a page are accessible through the global Drupal.ajax
 * object and are keyed by the submit button's ID. You can access them from
 * your module's JavaScript file to override properties or functions.
 *
 * For example, if your Ajax enabled button has the ID 'edit-submit', you can
 * redefine the function that is called to insert the new content like this
 * (inside a Drupal.behaviors attach block):
 * @code
 *    Drupal.behaviors.myCustomAJAXStuff = {
 *      attach: function (context, settings) {
 *        Drupal.ajax['edit-submit'].commands.insert = function (ajax, response, status) {
 *          new_content = $(response.data);
 *          $('#my-wrapper').append(new_content);
 *          alert('New content was appended to #my-wrapper');
 *        }
 *      }
 *    };
 * @endcode
 */
Drupal.ajax = function (base, element, element_settings) {
  var defaults = {
    url: 'system/ajax',
    event: 'mousedown',
    keypress: true,
    selector: '#' + base,
    effect: 'none',
    speed: 'none',
    method: 'replaceWith',
    progress: {
      type: 'throbber',
      message: Drupal.t('Please wait...')
    },
    submit: {
      'js': true
    }
  };

  $.extend(this, defaults, element_settings);

  this.element = element;
  this.element_settings = element_settings;

  // Replacing 'nojs' with 'ajax' in the URL allows for an easy method to let
  // the server detect when it needs to degrade gracefully.
  // There are five scenarios to check for:
  // 1. /nojs/
  // 2. /nojs$ - The end of a URL string.
  // 3. /nojs? - Followed by a query (with clean URLs enabled).
  //      E.g.: path/nojs?destination=foobar
  // 4. /nojs& - Followed by a query (without clean URLs enabled).
  //      E.g.: ?q=path/nojs&destination=foobar
  // 5. /nojs# - Followed by a fragment.
  //      E.g.: path/nojs#myfragment
  this.url = element_settings.url.replace(/\/nojs(\/|$|\?|&|#)/g, '/ajax$1');
  this.wrapper = '#' + element_settings.wrapper;

  // If there isn't a form, jQuery.ajax() will be used instead, allowing us to
  // bind Ajax to links as well.
  if (this.element.form) {
    this.form = $(this.element.form);
  }

  // Set the options for the ajaxSubmit function.
  // The 'this' variable will not persist inside of the options object.
  var ajax = this;
  ajax.options = {
    url: ajax.url,
    data: ajax.submit,
    beforeSerialize: function (element_settings, options) {
      return ajax.beforeSerialize(element_settings, options);
    },
    beforeSubmit: function (form_values, element_settings, options) {
      ajax.ajaxing = true;
      return ajax.beforeSubmit(form_values, element_settings, options);
    },
    beforeSend: function (xmlhttprequest, options) {
      ajax.ajaxing = true;
      return ajax.beforeSend(xmlhttprequest, options);
    },
    success: function (response, status) {
      // Sanity check for browser support (object expected).
      // When using iFrame uploads, responses must be returned as a string.
      if (typeof response == 'string') {
        response = $.parseJSON(response);
      }
      return ajax.success(response, status);
    },
    complete: function (response, status) {
      ajax.ajaxing = false;
      if (status == 'error' || status == 'parsererror') {
        return ajax.error(response, ajax.url);
      }
    },
    dataType: 'json',
    type: 'POST'
  };

  // Bind the ajaxSubmit function to the element event.
  $(ajax.element).bind(element_settings.event, function (event) {
    return ajax.eventResponse(this, event);
  });

  // If necessary, enable keyboard submission so that Ajax behaviors
  // can be triggered through keyboard input as well as e.g. a mousedown
  // action.
  if (element_settings.keypress) {
    $(ajax.element).keypress(function (event) {
      return ajax.keypressResponse(this, event);
    });
  }

  // If necessary, prevent the browser default action of an additional event.
  // For example, prevent the browser default action of a click, even if the
  // AJAX behavior binds to mousedown.
  if (element_settings.prevent) {
    $(ajax.element).bind(element_settings.prevent, false);
  }
};

/**
 * Handle a key press.
 *
 * The Ajax object will, if instructed, bind to a key press response. This
 * will test to see if the key press is valid to trigger this event and
 * if it is, trigger it for us and prevent other keypresses from triggering.
 * In this case we're handling RETURN and SPACEBAR keypresses (event codes 13
 * and 32. RETURN is often used to submit a form when in a textfield, and 
 * SPACE is often used to activate an element without submitting. 
 */
Drupal.ajax.prototype.keypressResponse = function (element, event) {
  // Create a synonym for this to reduce code confusion.
  var ajax = this;

  // Detect enter key and space bar and allow the standard response for them,
  // except for form elements of type 'text' and 'textarea', where the 
  // spacebar activation causes inappropriate activation if #ajax['keypress'] is 
  // TRUE. On a text-type widget a space should always be a space.
  if (event.which == 13 || (event.which == 32 && element.type != 'text' && element.type != 'textarea')) {
    $(ajax.element_settings.element).trigger(ajax.element_settings.event);
    return false;
  }
};

/**
 * Handle an event that triggers an Ajax response.
 *
 * When an event that triggers an Ajax response happens, this method will
 * perform the actual Ajax call. It is bound to the event using
 * bind() in the constructor, and it uses the options specified on the
 * ajax object.
 */
Drupal.ajax.prototype.eventResponse = function (element, event) {
  // Create a synonym for this to reduce code confusion.
  var ajax = this;

  // Do not perform another ajax command if one is already in progress.
  if (ajax.ajaxing) {
    return false;
  }

  try {
    if (ajax.form) {
      // If setClick is set, we must set this to ensure that the button's
      // value is passed.
      if (ajax.setClick) {
        // Mark the clicked button. 'form.clk' is a special variable for
        // ajaxSubmit that tells the system which element got clicked to
        // trigger the submit. Without it there would be no 'op' or
        // equivalent.
        element.form.clk = element;
      }

      ajax.form.ajaxSubmit(ajax.options);
    }
    else {
      ajax.beforeSerialize(ajax.element, ajax.options);
      $.ajax(ajax.options);
    }
  }
  catch (e) {
    // Unset the ajax.ajaxing flag here because it won't be unset during
    // the complete response.
    ajax.ajaxing = false;
    alert("An error occurred while attempting to process " + ajax.options.url + ": " + e.message);
  }

  // For radio/checkbox, allow the default event. On IE, this means letting
  // it actually check the box.
  if (typeof element.type != 'undefined' && (element.type == 'checkbox' || element.type == 'radio')) {
    return true;
  }
  else {
    return false;
  }

};

/**
 * Handler for the form serialization.
 *
 * Runs before the beforeSend() handler (see below), and unlike that one, runs
 * before field data is collected.
 */
Drupal.ajax.prototype.beforeSerialize = function (element, options) {
  // Allow detaching behaviors to update field values before collecting them.
  // This is only needed when field values are added to the POST data, so only
  // when there is a form such that this.form.ajaxSubmit() is used instead of
  // $.ajax(). When there is no form and $.ajax() is used, beforeSerialize()
  // isn't called, but don't rely on that: explicitly check this.form.
  if (this.form) {
    var settings = this.settings || Drupal.settings;
    Drupal.detachBehaviors(this.form, settings, 'serialize');
  }

  // Prevent duplicate HTML ids in the returned markup.
  // @see drupal_html_id()
  options.data['ajax_html_ids[]'] = [];
  $('[id]').each(function () {
    options.data['ajax_html_ids[]'].push(this.id);
  });

  // Allow Drupal to return new JavaScript and CSS files to load without
  // returning the ones already loaded.
  // @see ajax_base_page_theme()
  // @see drupal_get_css()
  // @see drupal_get_js()
  options.data['ajax_page_state[theme]'] = Drupal.settings.ajaxPageState.theme;
  options.data['ajax_page_state[theme_token]'] = Drupal.settings.ajaxPageState.theme_token;
  for (var key in Drupal.settings.ajaxPageState.css) {
    options.data['ajax_page_state[css][' + key + ']'] = 1;
  }
  for (var key in Drupal.settings.ajaxPageState.js) {
    options.data['ajax_page_state[js][' + key + ']'] = 1;
  }
};

/**
 * Modify form values prior to form submission.
 */
Drupal.ajax.prototype.beforeSubmit = function (form_values, element, options) {
  // This function is left empty to make it simple to override for modules
  // that wish to add functionality here.
};

/**
 * Prepare the Ajax request before it is sent.
 */
Drupal.ajax.prototype.beforeSend = function (xmlhttprequest, options) {
  // For forms without file inputs, the jQuery Form plugin serializes the form
  // values, and then calls jQuery's $.ajax() function, which invokes this
  // handler. In this circumstance, options.extraData is never used. For forms
  // with file inputs, the jQuery Form plugin uses the browser's normal form
  // submission mechanism, but captures the response in a hidden IFRAME. In this
  // circumstance, it calls this handler first, and then appends hidden fields
  // to the form to submit the values in options.extraData. There is no simple
  // way to know which submission mechanism will be used, so we add to extraData
  // regardless, and allow it to be ignored in the former case.
  if (this.form) {
    options.extraData = options.extraData || {};

    // Let the server know when the IFRAME submission mechanism is used. The
    // server can use this information to wrap the JSON response in a TEXTAREA,
    // as per http://jquery.malsup.com/form/#file-upload.
    options.extraData.ajax_iframe_upload = '1';

    // The triggering element is about to be disabled (see below), but if it
    // contains a value (e.g., a checkbox, textfield, select, etc.), ensure that
    // value is included in the submission. As per above, submissions that use
    // $.ajax() are already serialized prior to the element being disabled, so
    // this is only needed for IFRAME submissions.
    var v = $.fieldValue(this.element);
    if (v !== null) {
      options.extraData[this.element.name] = Drupal.checkPlain(v);
    }
  }

  // Disable the element that received the change to prevent user interface
  // interaction while the Ajax request is in progress. ajax.ajaxing prevents
  // the element from triggering a new request, but does not prevent the user
  // from changing its value.
  $(this.element).addClass('progress-disabled').attr('disabled', true);

  // Insert progressbar or throbber.
  if (this.progress.type == 'bar') {
    var progressBar = new Drupal.progressBar('ajax-progress-' + this.element.id, eval(this.progress.update_callback), this.progress.method, eval(this.progress.error_callback));
    if (this.progress.message) {
      progressBar.setProgress(-1, this.progress.message);
    }
    if (this.progress.url) {
      progressBar.startMonitoring(this.progress.url, this.progress.interval || 1500);
    }
    this.progress.element = $(progressBar.element).addClass('ajax-progress ajax-progress-bar');
    this.progress.object = progressBar;
    $(this.element).after(this.progress.element);
  }
  else if (this.progress.type == 'throbber') {
    this.progress.element = $('<div class="ajax-progress ajax-progress-throbber"><div class="throbber">&nbsp;</div></div>');
    if (this.progress.message) {
      $('.throbber', this.progress.element).after('<div class="message">' + this.progress.message + '</div>');
    }
    $(this.element).after(this.progress.element);
  }
};

/**
 * Handler for the form redirection completion.
 */
Drupal.ajax.prototype.success = function (response, status) {
  // Remove the progress element.
  if (this.progress.element) {
    $(this.progress.element).remove();
  }
  if (this.progress.object) {
    this.progress.object.stopMonitoring();
  }
  $(this.element).removeClass('progress-disabled').removeAttr('disabled');

  Drupal.freezeHeight();

  for (var i in response) {
    if (response.hasOwnProperty(i) && response[i]['command'] && this.commands[response[i]['command']]) {
      this.commands[response[i]['command']](this, response[i], status);
    }
  }

  // Reattach behaviors, if they were detached in beforeSerialize(). The
  // attachBehaviors() called on the new content from processing the response
  // commands is not sufficient, because behaviors from the entire form need
  // to be reattached.
  if (this.form) {
    var settings = this.settings || Drupal.settings;
    Drupal.attachBehaviors(this.form, settings);
  }

  Drupal.unfreezeHeight();

  // Remove any response-specific settings so they don't get used on the next
  // call by mistake.
  this.settings = null;
};

/**
 * Build an effect object which tells us how to apply the effect when adding new HTML.
 */
Drupal.ajax.prototype.getEffect = function (response) {
  var type = response.effect || this.effect;
  var speed = response.speed || this.speed;

  var effect = {};
  if (type == 'none') {
    effect.showEffect = 'show';
    effect.hideEffect = 'hide';
    effect.showSpeed = '';
  }
  else if (type == 'fade') {
    effect.showEffect = 'fadeIn';
    effect.hideEffect = 'fadeOut';
    effect.showSpeed = speed;
  }
  else {
    effect.showEffect = type + 'Toggle';
    effect.hideEffect = type + 'Toggle';
    effect.showSpeed = speed;
  }

  return effect;
};

/**
 * Handler for the form redirection error.
 */
Drupal.ajax.prototype.error = function (response, uri) {
  alert(Drupal.ajaxError(response, uri));
  // Remove the progress element.
  if (this.progress.element) {
    $(this.progress.element).remove();
  }
  if (this.progress.object) {
    this.progress.object.stopMonitoring();
  }
  // Undo hide.
  $(this.wrapper).show();
  // Re-enable the element.
  $(this.element).removeClass('progress-disabled').removeAttr('disabled');
  // Reattach behaviors, if they were detached in beforeSerialize().
  if (this.form) {
    var settings = response.settings || this.settings || Drupal.settings;
    Drupal.attachBehaviors(this.form, settings);
  }
};

/**
 * Provide a series of commands that the server can request the client perform.
 */
Drupal.ajax.prototype.commands = {
  /**
   * Command to insert new content into the DOM.
   */
  insert: function (ajax, response, status) {
    // Get information from the response. If it is not there, default to
    // our presets.
    var wrapper = response.selector ? $(response.selector) : $(ajax.wrapper);
    var method = response.method || ajax.method;
    var effect = ajax.getEffect(response);

    // We don't know what response.data contains: it might be a string of text
    // without HTML, so don't rely on jQuery correctly iterpreting
    // $(response.data) as new HTML rather than a CSS selector. Also, if
    // response.data contains top-level text nodes, they get lost with either
    // $(response.data) or $('<div></div>').replaceWith(response.data).
    var new_content_wrapped = $('<div></div>').html(response.data);
    var new_content = new_content_wrapped.contents();

    // For legacy reasons, the effects processing code assumes that new_content
    // consists of a single top-level element. Also, it has not been
    // sufficiently tested whether attachBehaviors() can be successfully called
    // with a context object that includes top-level text nodes. However, to
    // give developers full control of the HTML appearing in the page, and to
    // enable Ajax content to be inserted in places where DIV elements are not
    // allowed (e.g., within TABLE, TR, and SPAN parents), we check if the new
    // content satisfies the requirement of a single top-level element, and
    // only use the container DIV created above when it doesn't. For more
    // information, please see http://drupal.org/node/736066.
    if (new_content.length != 1 || new_content.get(0).nodeType != 1) {
      new_content = new_content_wrapped;
    }

    // If removing content from the wrapper, detach behaviors first.
    switch (method) {
      case 'html':
      case 'replaceWith':
      case 'replaceAll':
      case 'empty':
      case 'remove':
        var settings = response.settings || ajax.settings || Drupal.settings;
        Drupal.detachBehaviors(wrapper, settings);
    }

    // Add the new content to the page.
    wrapper[method](new_content);

    // Immediately hide the new content if we're using any effects.
    if (effect.showEffect != 'show') {
      new_content.hide();
    }

    // Determine which effect to use and what content will receive the
    // effect, then show the new content.
    if ($('.ajax-new-content', new_content).length > 0) {
      $('.ajax-new-content', new_content).hide();
      new_content.show();
      $('.ajax-new-content', new_content)[effect.showEffect](effect.showSpeed);
    }
    else if (effect.showEffect != 'show') {
      new_content[effect.showEffect](effect.showSpeed);
    }

    // Attach all JavaScript behaviors to the new content, if it was successfully
    // added to the page, this if statement allows #ajax['wrapper'] to be
    // optional.
    if (new_content.parents('html').length > 0) {
      // Apply any settings from the returned JSON if available.
      var settings = response.settings || ajax.settings || Drupal.settings;
      Drupal.attachBehaviors(new_content, settings);
    }
  },

  /**
   * Command to remove a chunk from the page.
   */
  remove: function (ajax, response, status) {
    var settings = response.settings || ajax.settings || Drupal.settings;
    Drupal.detachBehaviors($(response.selector), settings);
    $(response.selector).remove();
  },

  /**
   * Command to mark a chunk changed.
   */
  changed: function (ajax, response, status) {
    if (!$(response.selector).hasClass('ajax-changed')) {
      $(response.selector).addClass('ajax-changed');
      if (response.asterisk) {
        $(response.selector).find(response.asterisk).append(' <span class="ajax-changed">*</span> ');
      }
    }
  },

  /**
   * Command to provide an alert.
   */
  alert: function (ajax, response, status) {
    alert(response.text, response.title);
  },

  /**
   * Command to provide the jQuery css() function.
   */
  css: function (ajax, response, status) {
    $(response.selector).css(response.argument);
  },

  /**
   * Command to set the settings that will be used for other commands in this response.
   */
  settings: function (ajax, response, status) {
    if (response.merge) {
      $.extend(true, Drupal.settings, response.settings);
    }
    else {
      ajax.settings = response.settings;
    }
  },

  /**
   * Command to attach data using jQuery's data API.
   */
  data: function (ajax, response, status) {
    $(response.selector).data(response.name, response.value);
  },

  /**
   * Command to apply a jQuery method.
   */
  invoke: function (ajax, response, status) {
    var $element = $(response.selector);
    $element[response.method].apply($element, response.arguments);
  },

  /**
   * Command to restripe a table.
   */
  restripe: function (ajax, response, status) {
    // :even and :odd are reversed because jQuery counts from 0 and
    // we count from 1, so we're out of sync.
    // Match immediate children of the parent element to allow nesting.
    $('> tbody > tr:visible, > tr:visible', $(response.selector))
      .removeClass('odd even')
      .filter(':even').addClass('odd').end()
      .filter(':odd').addClass('even');
  },

  /**
   * Command to add css.
   *
   * Uses the proprietary addImport method if available as browsers which
   * support that method ignore @import statements in dynamically added
   * stylesheets.
   */
  add_css: function (ajax, response, status) {
    // Add the styles in the normal way.
    $('head').prepend(response.data);
    // Add imports in the styles using the addImport method if available.
    var match, importMatch = /^@import url\("(.*)"\);$/igm;
    if (document.styleSheets[0].addImport && importMatch.test(response.data)) {
      importMatch.lastIndex = 0;
      while (match = importMatch.exec(response.data)) {
        document.styleSheets[0].addImport(match[1]);
      }
    }
  },

  /**
   * Command to update a form's build ID.
   */
  updateBuildId: function(ajax, response, status) {
    $('input[name="form_build_id"][value="' + response['old'] + '"]').val(response['new']);
  }
};

})(jQuery);

(function ($) {

/**
 * Attaches the autocomplete behavior to all required fields.
 */
Drupal.behaviors.autocomplete = {
  attach: function (context, settings) {
    var acdb = [];
    $('input.autocomplete', context).once('autocomplete', function () {
      var uri = this.value;
      if (!acdb[uri]) {
        acdb[uri] = new Drupal.ACDB(uri);
      }
      var $input = $('#' + this.id.substr(0, this.id.length - 13))
        .attr('autocomplete', 'OFF')
        .attr('aria-autocomplete', 'list');
      $($input[0].form).submit(Drupal.autocompleteSubmit);
      $input.parent()
        .attr('role', 'application')
        .append($('<span class="element-invisible" aria-live="assertive"></span>')
          .attr('id', $input.attr('id') + '-autocomplete-aria-live')
        );
      new Drupal.jsAC($input, acdb[uri]);
    });
  }
};

/**
 * Prevents the form from submitting if the suggestions popup is open
 * and closes the suggestions popup when doing so.
 */
Drupal.autocompleteSubmit = function () {
  return $('#autocomplete').each(function () {
    this.owner.hidePopup();
  }).length == 0;
};

/**
 * An AutoComplete object.
 */
Drupal.jsAC = function ($input, db) {
  var ac = this;
  this.input = $input[0];
  this.ariaLive = $('#' + this.input.id + '-autocomplete-aria-live');
  this.db = db;

  $input
    .keydown(function (event) { return ac.onkeydown(this, event); })
    .keyup(function (event) { ac.onkeyup(this, event); })
    .blur(function () { ac.hidePopup(); ac.db.cancel(); });

};

/**
 * Handler for the "keydown" event.
 */
Drupal.jsAC.prototype.onkeydown = function (input, e) {
  if (!e) {
    e = window.event;
  }
  switch (e.keyCode) {
    case 40: // down arrow.
      this.selectDown();
      return false;
    case 38: // up arrow.
      this.selectUp();
      return false;
    default: // All other keys.
      return true;
  }
};

/**
 * Handler for the "keyup" event.
 */
Drupal.jsAC.prototype.onkeyup = function (input, e) {
  if (!e) {
    e = window.event;
  }
  switch (e.keyCode) {
    case 16: // Shift.
    case 17: // Ctrl.
    case 18: // Alt.
    case 20: // Caps lock.
    case 33: // Page up.
    case 34: // Page down.
    case 35: // End.
    case 36: // Home.
    case 37: // Left arrow.
    case 38: // Up arrow.
    case 39: // Right arrow.
    case 40: // Down arrow.
      return true;

    case 9:  // Tab.
    case 13: // Enter.
    case 27: // Esc.
      this.hidePopup(e.keyCode);
      return true;

    default: // All other keys.
      if (input.value.length > 0 && !input.readOnly) {
        this.populatePopup();
      }
      else {
        this.hidePopup(e.keyCode);
      }
      return true;
  }
};

/**
 * Puts the currently highlighted suggestion into the autocomplete field.
 */
Drupal.jsAC.prototype.select = function (node) {
  this.input.value = $(node).data('autocompleteValue');
};

/**
 * Highlights the next suggestion.
 */
Drupal.jsAC.prototype.selectDown = function () {
  if (this.selected && this.selected.nextSibling) {
    this.highlight(this.selected.nextSibling);
  }
  else if (this.popup) {
    var lis = $('li', this.popup);
    if (lis.length > 0) {
      this.highlight(lis.get(0));
    }
  }
};

/**
 * Highlights the previous suggestion.
 */
Drupal.jsAC.prototype.selectUp = function () {
  if (this.selected && this.selected.previousSibling) {
    this.highlight(this.selected.previousSibling);
  }
};

/**
 * Highlights a suggestion.
 */
Drupal.jsAC.prototype.highlight = function (node) {
  if (this.selected) {
    $(this.selected).removeClass('selected');
  }
  $(node).addClass('selected');
  this.selected = node;
  $(this.ariaLive).html($(this.selected).html());
};

/**
 * Unhighlights a suggestion.
 */
Drupal.jsAC.prototype.unhighlight = function (node) {
  $(node).removeClass('selected');
  this.selected = false;
  $(this.ariaLive).empty();
};

/**
 * Hides the autocomplete suggestions.
 */
Drupal.jsAC.prototype.hidePopup = function (keycode) {
  // Select item if the right key or mousebutton was pressed.
  if (this.selected && ((keycode && keycode != 46 && keycode != 8 && keycode != 27) || !keycode)) {
    this.input.value = $(this.selected).data('autocompleteValue');
  }
  // Hide popup.
  var popup = this.popup;
  if (popup) {
    this.popup = null;
    $(popup).fadeOut('fast', function () { $(popup).remove(); });
  }
  this.selected = false;
  $(this.ariaLive).empty();
};

/**
 * Positions the suggestions popup and starts a search.
 */
Drupal.jsAC.prototype.populatePopup = function () {
  var $input = $(this.input);
  var position = $input.position();
  // Show popup.
  if (this.popup) {
    $(this.popup).remove();
  }
  this.selected = false;
  this.popup = $('<div id="autocomplete"></div>')[0];
  this.popup.owner = this;
  $(this.popup).css({
    top: parseInt(position.top + this.input.offsetHeight, 10) + 'px',
    left: parseInt(position.left, 10) + 'px',
    width: $input.innerWidth() + 'px',
    display: 'none'
  });
  $input.before(this.popup);

  // Do search.
  this.db.owner = this;
  this.db.search(this.input.value);
};

/**
 * Fills the suggestion popup with any matches received.
 */
Drupal.jsAC.prototype.found = function (matches) {
  // If no value in the textfield, do not show the popup.
  if (!this.input.value.length) {
    return false;
  }

  // Prepare matches.
  var ul = $('<ul></ul>');
  var ac = this;
  for (key in matches) {
    $('<li></li>')
      .html($('<div></div>').html(matches[key]))
      .mousedown(function () { ac.select(this); })
      .mouseover(function () { ac.highlight(this); })
      .mouseout(function () { ac.unhighlight(this); })
      .data('autocompleteValue', key)
      .appendTo(ul);
  }

  // Show popup with matches, if any.
  if (this.popup) {
    if (ul.children().length) {
      $(this.popup).empty().append(ul).show();
      $(this.ariaLive).html(Drupal.t('Autocomplete popup'));
    }
    else {
      $(this.popup).css({ visibility: 'hidden' });
      this.hidePopup();
    }
  }
};

Drupal.jsAC.prototype.setStatus = function (status) {
  switch (status) {
    case 'begin':
      $(this.input).addClass('throbbing');
      $(this.ariaLive).html(Drupal.t('Searching for matches...'));
      break;
    case 'cancel':
    case 'error':
    case 'found':
      $(this.input).removeClass('throbbing');
      break;
  }
};

/**
 * An AutoComplete DataBase object.
 */
Drupal.ACDB = function (uri) {
  this.uri = uri;
  this.delay = 300;
  this.cache = {};
};

/**
 * Performs a cached and delayed search.
 */
Drupal.ACDB.prototype.search = function (searchString) {
  var db = this;
  this.searchString = searchString;

  // See if this string needs to be searched for anyway.
  searchString = searchString.replace(/^\s+|\s+$/, '');
  if (searchString.length <= 0 ||
    searchString.charAt(searchString.length - 1) == ',') {
    return;
  }

  // See if this key has been searched for before.
  if (this.cache[searchString]) {
    return this.owner.found(this.cache[searchString]);
  }

  // Initiate delayed search.
  if (this.timer) {
    clearTimeout(this.timer);
  }
  this.timer = setTimeout(function () {
    db.owner.setStatus('begin');

    // Ajax GET request for autocompletion. We use Drupal.encodePath instead of
    // encodeURIComponent to allow autocomplete search terms to contain slashes.
    $.ajax({
      type: 'GET',
      url: db.uri + '/' + Drupal.encodePath(searchString),
      dataType: 'json',
      success: function (matches) {
        if (typeof matches.status == 'undefined' || matches.status != 0) {
          db.cache[searchString] = matches;
          // Verify if these are still the matches the user wants to see.
          if (db.searchString == searchString) {
            db.owner.found(matches);
          }
          db.owner.setStatus('found');
        }
      },
      error: function (xmlhttp) {
        alert(Drupal.ajaxError(xmlhttp, db.uri));
      }
    });
  }, this.delay);
};

/**
 * Cancels the current autocomplete request.
 */
Drupal.ACDB.prototype.cancel = function () {
  if (this.owner) this.owner.setStatus('cancel');
  if (this.timer) clearTimeout(this.timer);
  this.searchString = '';
};

})(jQuery);

(function ($) {

/**
 * Toggle the visibility of a fieldset using smooth animations.
 */
Drupal.toggleFieldset = function (fieldset) {
  var $fieldset = $(fieldset);
  if ($fieldset.is('.collapsed')) {
    var $content = $('> .fieldset-wrapper', fieldset).hide();
    $fieldset
      .removeClass('collapsed')
      .trigger({ type: 'collapsed', value: false })
      .find('> legend span.fieldset-legend-prefix').html(Drupal.t('Hide'));
    $content.slideDown({
      duration: 'fast',
      easing: 'linear',
      complete: function () {
        Drupal.collapseScrollIntoView(fieldset);
        fieldset.animating = false;
      },
      step: function () {
        // Scroll the fieldset into view.
        Drupal.collapseScrollIntoView(fieldset);
      }
    });
  }
  else {
    $fieldset.trigger({ type: 'collapsed', value: true });
    $('> .fieldset-wrapper', fieldset).slideUp('fast', function () {
      $fieldset
        .addClass('collapsed')
        .find('> legend span.fieldset-legend-prefix').html(Drupal.t('Show'));
      fieldset.animating = false;
    });
  }
};

/**
 * Scroll a given fieldset into view as much as possible.
 */
Drupal.collapseScrollIntoView = function (node) {
  var h = document.documentElement.clientHeight || document.body.clientHeight || 0;
  var offset = document.documentElement.scrollTop || document.body.scrollTop || 0;
  var posY = $(node).offset().top;
  var fudge = 55;
  if (posY + node.offsetHeight + fudge > h + offset) {
    if (node.offsetHeight > h) {
      window.scrollTo(0, posY);
    }
    else {
      window.scrollTo(0, posY + node.offsetHeight - h + fudge);
    }
  }
};

Drupal.behaviors.collapse = {
  attach: function (context, settings) {
    $('fieldset.collapsible', context).once('collapse', function () {
      var $fieldset = $(this);
      // Expand fieldset if there are errors inside, or if it contains an
      // element that is targeted by the URI fragment identifier.
      var anchor = location.hash && location.hash != '#' ? ', ' + location.hash : '';
      if ($fieldset.find('.error' + anchor).length) {
        $fieldset.removeClass('collapsed');
      }

      var summary = $('<span class="summary"></span>');
      $fieldset.
        bind('summaryUpdated', function () {
          var text = $.trim($fieldset.drupalGetSummary());
          summary.html(text ? ' (' + text + ')' : '');
        })
        .trigger('summaryUpdated');

      // Turn the legend into a clickable link, but retain span.fieldset-legend
      // for CSS positioning.
      var $legend = $('> legend .fieldset-legend', this);

      $('<span class="fieldset-legend-prefix element-invisible"></span>')
        .append($fieldset.hasClass('collapsed') ? Drupal.t('Show') : Drupal.t('Hide'))
        .prependTo($legend)
        .after(' ');

      // .wrapInner() does not retain bound events.
      var $link = $('<a class="fieldset-title" href="#"></a>')
        .prepend($legend.contents())
        .appendTo($legend)
        .click(function () {
          var fieldset = $fieldset.get(0);
          // Don't animate multiple times.
          if (!fieldset.animating) {
            fieldset.animating = true;
            Drupal.toggleFieldset(fieldset);
          }
          return false;
        });

      $legend.append(summary);
    });
  }
};

})(jQuery);

// This jQuery plugin is only for Drupal admin interface.
// We deactivated on purpose, since only caring about the frontend and not the backoffice of Drupal.

/*
 * jQuery BBQ: Back Button & Query Library - v1.2.1 - 2/17/2010
 * http://benalman.com/projects/jquery-bbq-plugin/
 *
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */
// (function($,p){var i,m=Array.prototype.slice,r=decodeURIComponent,a=$.param,c,l,v,b=$.bbq=$.bbq||{},q,u,j,e=$.event.special,d="hashchange",A="querystring",D="fragment",y="elemUrlAttr",g="location",k="href",t="src",x=/^.*\?|#.*$/g,w=/^.*\#/,h,C={};function E(F){return typeof F==="string"}function B(G){var F=m.call(arguments,1);return function(){return G.apply(this,F.concat(m.call(arguments)))}}function n(F){return F.replace(/^[^#]*#?(.*)$/,"$1")}function o(F){return F.replace(/(?:^[^?#]*\?([^#]*).*$)?.*/,"$1")}function f(H,M,F,I,G){var O,L,K,N,J;if(I!==i){K=F.match(H?/^([^#]*)\#?(.*)$/:/^([^#?]*)\??([^#]*)(#?.*)/);J=K[3]||"";if(G===2&&E(I)){L=I.replace(H?w:x,"")}else{N=l(K[2]);I=E(I)?l[H?D:A](I):I;L=G===2?I:G===1?$.extend({},I,N):$.extend({},N,I);L=a(L);if(H){L=L.replace(h,r)}}O=K[1]+(H?"#":L||!K[1]?"?":"")+L+J}else{O=M(F!==i?F:p[g][k])}return O}a[A]=B(f,0,o);a[D]=c=B(f,1,n);c.noEscape=function(G){G=G||"";var F=$.map(G.split(""),encodeURIComponent);h=new RegExp(F.join("|"),"g")};c.noEscape(",/");$.deparam=l=function(I,F){var H={},G={"true":!0,"false":!1,"null":null};$.each(I.replace(/\+/g," ").split("&"),function(L,Q){var K=Q.split("="),P=r(K[0]),J,O=H,M=0,R=P.split("]["),N=R.length-1;if(/\[/.test(R[0])&&/\]$/.test(R[N])){R[N]=R[N].replace(/\]$/,"");R=R.shift().split("[").concat(R);N=R.length-1}else{N=0}if(K.length===2){J=r(K[1]);if(F){J=J&&!isNaN(J)?+J:J==="undefined"?i:G[J]!==i?G[J]:J}if(N){for(;M<=N;M++){P=R[M]===""?O.length:R[M];O=O[P]=M<N?O[P]||(R[M+1]&&isNaN(R[M+1])?{}:[]):J}}else{if($.isArray(H[P])){H[P].push(J)}else{if(H[P]!==i){H[P]=[H[P],J]}else{H[P]=J}}}}else{if(P){H[P]=F?i:""}}});return H};function z(H,F,G){if(F===i||typeof F==="boolean"){G=F;F=a[H?D:A]()}else{F=E(F)?F.replace(H?w:x,""):F}return l(F,G)}l[A]=B(z,0);l[D]=v=B(z,1);$[y]||($[y]=function(F){return $.extend(C,F)})({a:k,base:k,iframe:t,img:t,input:t,form:"action",link:k,script:t});j=$[y];function s(I,G,H,F){if(!E(H)&&typeof H!=="object"){F=H;H=G;G=i}return this.each(function(){var L=$(this),J=G||j()[(this.nodeName||"").toLowerCase()]||"",K=J&&L.attr(J)||"";L.attr(J,a[I](K,H,F))})}$.fn[A]=B(s,A);$.fn[D]=B(s,D);b.pushState=q=function(I,F){if(E(I)&&/^#/.test(I)&&F===i){F=2}var H=I!==i,G=c(p[g][k],H?I:{},H?F:2);p[g][k]=G+(/#/.test(G)?"":"#")};b.getState=u=function(F,G){return F===i||typeof F==="boolean"?v(F):v(G)[F]};b.removeState=function(F){var G={};if(F!==i){G=u();$.each($.isArray(F)?F:arguments,function(I,H){delete G[H]})}q(G,2)};e[d]=$.extend(e[d],{add:function(F){var H;function G(J){var I=J[D]=c();J.getState=function(K,L){return K===i||typeof K==="boolean"?l(I,K):l(I,L)[K]};H.apply(this,arguments)}if($.isFunction(F)){H=F;return G}else{H=F.handler;F.handler=G}}})})(jQuery,this);
/*
 * jQuery hashchange event - v1.2 - 2/11/2010
 * http://benalman.com/projects/jquery-hashchange-plugin/
 *
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */
// (function($,i,b){var j,k=$.event.special,c="location",d="hashchange",l="href",f=$.browser,g=document.documentMode,h=f.msie&&(g===b||g<8),e="on"+d in i&&!h;function a(m){m=m||i[c][l];return m.replace(/^[^#]*#?(.*)$/,"$1")}$[d+"Delay"]=100;k[d]=$.extend(k[d],{setup:function(){if(e){return false}$(j.start)},teardown:function(){if(e){return false}$(j.stop)}});j=(function(){var m={},r,n,o,q;function p(){o=q=function(s){return s};if(h){n=$('<iframe src="javascript:0"/>').hide().insertAfter("body")[0].contentWindow;q=function(){return a(n.document[c][l])};o=function(u,s){if(u!==s){var t=n.document;t.open().close();t[c].hash="#"+u}};o(a())}}m.start=function(){if(r){return}var t=a();o||p();(function s(){var v=a(),u=q(t);if(v!==t){o(t=v,u);$(i).trigger(d)}else{if(u!==t){i[c][l]=i[c][l].replace(/#.*/,"")+"#"+u}}r=setTimeout(s,$[d+"Delay"])})()};m.stop=function(){if(!n){r&&clearTimeout(r);r=0}};return m})()})(jQuery,this);


/**
 * Cookie plugin 1.0
 *
 * Copyright (c) 2006 Klaus Hartl (stilbuero.de)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */
jQuery.cookie=function(b,j,m){if(typeof j!="undefined"){m=m||{};if(j===null){j="";m.expires=-1}var e="";if(m.expires&&(typeof m.expires=="number"||m.expires.toUTCString)){var f;if(typeof m.expires=="number"){f=new Date();f.setTime(f.getTime()+(m.expires*24*60*60*1000))}else{f=m.expires}e="; expires="+f.toUTCString()}var l=m.path?"; path="+(m.path):"";var g=m.domain?"; domain="+(m.domain):"";var a=m.secure?"; secure":"";document.cookie=[b,"=",encodeURIComponent(j),e,l,g,a].join("")}else{var d=null;if(document.cookie&&document.cookie!=""){var k=document.cookie.split(";");for(var h=0;h<k.length;h++){var c=jQuery.trim(k[h]);if(c.substring(0,b.length+1)==(b+"=")){d=decodeURIComponent(c.substring(b.length+1));break}}}return d}};

/*!
 * jQuery Form Plugin
 * version: 2.69 (06-APR-2011)
 * @requires jQuery v1.3.2 or later
 *
 * Examples and documentation at: http://malsup.com/jquery/form/
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */
;(function($) {

/*
	Usage Note:
	-----------
	Do not use both ajaxSubmit and ajaxForm on the same form.  These
	functions are intended to be exclusive.  Use ajaxSubmit if you want
	to bind your own submit handler to the form.  For example,

	$(document).ready(function() {
		$('#myForm').bind('submit', function(e) {
			e.preventDefault(); // <-- important
			$(this).ajaxSubmit({
				target: '#output'
			});
		});
	});

	Use ajaxForm when you want the plugin to manage all the event binding
	for you.  For example,

	$(document).ready(function() {
		$('#myForm').ajaxForm({
			target: '#output'
		});
	});

	When using ajaxForm, the ajaxSubmit function will be invoked for you
	at the appropriate time.
*/

/**
 * ajaxSubmit() provides a mechanism for immediately submitting
 * an HTML form using AJAX.
 */
$.fn.ajaxSubmit = function(options) {
	// fast fail if nothing selected (http://dev.jquery.com/ticket/2752)
	if (!this.length) {
		log('ajaxSubmit: skipping submit process - no element selected');
		return this;
	}

	if (typeof options == 'function') {
		options = { success: options };
	}

	var action = this.attr('action');
	var url = (typeof action === 'string') ? $.trim(action) : '';
	if (url) {
		// clean url (don't include hash vaue)
		url = (url.match(/^([^#]+)/)||[])[1];
	}
	url = url || window.location.href || '';

	options = $.extend(true, {
		url:  url,
		success: $.ajaxSettings.success,
		type: this[0].getAttribute('method') || 'GET', // IE7 massage (see issue 57)
		iframeSrc: /^https/i.test(window.location.href || '') ? 'javascript:false' : 'about:blank'
	}, options);

	// hook for manipulating the form data before it is extracted;
	// convenient for use with rich editors like tinyMCE or FCKEditor
	var veto = {};
	this.trigger('form-pre-serialize', [this, options, veto]);
	if (veto.veto) {
		log('ajaxSubmit: submit vetoed via form-pre-serialize trigger');
		return this;
	}

	// provide opportunity to alter form data before it is serialized
	if (options.beforeSerialize && options.beforeSerialize(this, options) === false) {
		log('ajaxSubmit: submit aborted via beforeSerialize callback');
		return this;
	}

	var n,v,a = this.formToArray(options.semantic);
	if (options.data) {
		options.extraData = options.data;
		for (n in options.data) {
			if(options.data[n] instanceof Array) {
				for (var k in options.data[n]) {
					a.push( { name: n, value: options.data[n][k] } );
				}
			}
			else {
				v = options.data[n];
				v = $.isFunction(v) ? v() : v; // if value is fn, invoke it
				a.push( { name: n, value: v } );
			}
		}
	}

	// give pre-submit callback an opportunity to abort the submit
	if (options.beforeSubmit && options.beforeSubmit(a, this, options) === false) {
		log('ajaxSubmit: submit aborted via beforeSubmit callback');
		return this;
	}

	// fire vetoable 'validate' event
	this.trigger('form-submit-validate', [a, this, options, veto]);
	if (veto.veto) {
		log('ajaxSubmit: submit vetoed via form-submit-validate trigger');
		return this;
	}

	var q = $.param(a);

	if (options.type.toUpperCase() == 'GET') {
		options.url += (options.url.indexOf('?') >= 0 ? '&' : '?') + q;
		options.data = null;  // data is null for 'get'
	}
	else {
		options.data = q; // data is the query string for 'post'
	}

	var $form = this, callbacks = [];
	if (options.resetForm) {
		callbacks.push(function() { $form.resetForm(); });
	}
	if (options.clearForm) {
		callbacks.push(function() { $form.clearForm(); });
	}

	// perform a load on the target only if dataType is not provided
	if (!options.dataType && options.target) {
		var oldSuccess = options.success || function(){};
		callbacks.push(function(data) {
			var fn = options.replaceTarget ? 'replaceWith' : 'html';
			$(options.target)[fn](data).each(oldSuccess, arguments);
		});
	}
	else if (options.success) {
		callbacks.push(options.success);
	}

	options.success = function(data, status, xhr) { // jQuery 1.4+ passes xhr as 3rd arg
		var context = options.context || options;   // jQuery 1.4+ supports scope context 
		for (var i=0, max=callbacks.length; i < max; i++) {
			callbacks[i].apply(context, [data, status, xhr || $form, $form]);
		}
	};

	// are there files to upload?
	var fileInputs = $('input:file', this).length > 0;
	var mp = 'multipart/form-data';
	var multipart = ($form.attr('enctype') == mp || $form.attr('encoding') == mp);

	// options.iframe allows user to force iframe mode
	// 06-NOV-09: now defaulting to iframe mode if file input is detected
   if (options.iframe !== false && (fileInputs || options.iframe || multipart)) {
	   // hack to fix Safari hang (thanks to Tim Molendijk for this)
	   // see:  http://groups.google.com/group/jquery-dev/browse_thread/thread/36395b7ab510dd5d
	   if (options.closeKeepAlive) {
		   $.get(options.closeKeepAlive, fileUpload);
		}
	   else {
		   fileUpload();
		}
   }
   else {
		$.ajax(options);
   }

	// fire 'notify' event
	this.trigger('form-submit-notify', [this, options]);
	return this;


	// private function for handling file uploads (hat tip to YAHOO!)
	function fileUpload() {
		var form = $form[0];

		if ($(':input[name=submit],:input[id=submit]', form).length) {
			// if there is an input with a name or id of 'submit' then we won't be
			// able to invoke the submit fn on the form (at least not x-browser)
			alert('Error: Form elements must not have name or id of "submit".');
			return;
		}
		
		var s = $.extend(true, {}, $.ajaxSettings, options);
		s.context = s.context || s;
		var id = 'jqFormIO' + (new Date().getTime()), fn = '_'+id;
		var $io = $('<iframe id="' + id + '" name="' + id + '" src="'+ s.iframeSrc +'" />');
		var io = $io[0];

		$io.css({ position: 'absolute', top: '-1000px', left: '-1000px' });

		var xhr = { // mock object
			aborted: 0,
			responseText: null,
			responseXML: null,
			status: 0,
			statusText: 'n/a',
			getAllResponseHeaders: function() {},
			getResponseHeader: function() {},
			setRequestHeader: function() {},
			abort: function() {
				log('aborting upload...');
				var e = 'aborted';
				this.aborted = 1;
				$io.attr('src', s.iframeSrc); // abort op in progress
				xhr.error = e;
				s.error && s.error.call(s.context, xhr, 'error', e);
				g && $.event.trigger("ajaxError", [xhr, s, e]);
				s.complete && s.complete.call(s.context, xhr, 'error');
			}
		};

		var g = s.global;
		// trigger ajax global events so that activity/block indicators work like normal
		if (g && ! $.active++) {
			$.event.trigger("ajaxStart");
		}
		if (g) {
			$.event.trigger("ajaxSend", [xhr, s]);
		}

		if (s.beforeSend && s.beforeSend.call(s.context, xhr, s) === false) {
			if (s.global) { 
				$.active--;
			}
			return;
		}
		if (xhr.aborted) {
			return;
		}

		var timedOut = 0;

		// add submitting element to data if we know it
		var sub = form.clk;
		if (sub) {
			var n = sub.name;
			if (n && !sub.disabled) {
				s.extraData = s.extraData || {};
				s.extraData[n] = sub.value;
				if (sub.type == "image") {
					s.extraData[n+'.x'] = form.clk_x;
					s.extraData[n+'.y'] = form.clk_y;
				}
			}
		}

		// take a breath so that pending repaints get some cpu time before the upload starts
		function doSubmit() {
			// make sure form attrs are set
			var t = $form.attr('target'), a = $form.attr('action');

			// update form attrs in IE friendly way
			form.setAttribute('target',id);
			if (form.getAttribute('method') != 'POST') {
				form.setAttribute('method', 'POST');
			}
			if (form.getAttribute('action') != s.url) {
				form.setAttribute('action', s.url);
			}

			// ie borks in some cases when setting encoding
			if (! s.skipEncodingOverride) {
				$form.attr({
					encoding: 'multipart/form-data',
					enctype:  'multipart/form-data'
				});
			}

			// support timout
			if (s.timeout) {
				setTimeout(function() { timedOut = true; cb(); }, s.timeout);
			}

			// add "extra" data to form if provided in options
			var extraInputs = [];
			try {
				if (s.extraData) {
					for (var n in s.extraData) {
						extraInputs.push(
							$('<input type="hidden" name="'+n+'" value="'+s.extraData[n]+'" />')
								.appendTo(form)[0]);
					}
				}

				// add iframe to doc and submit the form
				$io.appendTo('body');
                io.attachEvent ? io.attachEvent('onload', cb) : io.addEventListener('load', cb, false);
				form.submit();
			}
			finally {
				// reset attrs and remove "extra" input elements
				form.setAttribute('action',a);
				if(t) {
					form.setAttribute('target', t);
				} else {
					$form.removeAttr('target');
				}
				$(extraInputs).remove();
			}
		}

		if (s.forceSync) {
			doSubmit();
		}
		else {
			setTimeout(doSubmit, 10); // this lets dom updates render
		}
	
		var data, doc, domCheckCount = 50;

		function cb() {
			if (xhr.aborted) {
				return;
			}
			
			var doc = io.contentWindow ? io.contentWindow.document : io.contentDocument ? io.contentDocument : io.document;
			if (!doc || doc.location.href == s.iframeSrc) {
				// response not received yet
				if (!timedOut)
					return;
			}
            io.detachEvent ? io.detachEvent('onload', cb) : io.removeEventListener('load', cb, false);

			var ok = true;
			try {
				if (timedOut) {
					throw 'timeout';
				}

				var isXml = s.dataType == 'xml' || doc.XMLDocument || $.isXMLDoc(doc);
				log('isXml='+isXml);
				if (!isXml && window.opera && (doc.body == null || doc.body.innerHTML == '')) {
					if (--domCheckCount) {
						// in some browsers (Opera) the iframe DOM is not always traversable when
						// the onload callback fires, so we loop a bit to accommodate
						log('requeing onLoad callback, DOM not available');
						setTimeout(cb, 250);
						return;
					}
					// let this fall through because server response could be an empty document
					//log('Could not access iframe DOM after mutiple tries.');
					//throw 'DOMException: not available';
				}

				//log('response detected');
				xhr.responseText = doc.body ? doc.body.innerHTML : doc.documentElement ? doc.documentElement.innerHTML : null; 
				xhr.responseXML = doc.XMLDocument ? doc.XMLDocument : doc;
				xhr.getResponseHeader = function(header){
					var headers = {'content-type': s.dataType};
					return headers[header];
				};

				var scr = /(json|script)/.test(s.dataType);
				if (scr || s.textarea) {
					// see if user embedded response in textarea
					var ta = doc.getElementsByTagName('textarea')[0];
					if (ta) {
						xhr.responseText = ta.value;
					}
					else if (scr) {
						// account for browsers injecting pre around json response
						var pre = doc.getElementsByTagName('pre')[0];
						var b = doc.getElementsByTagName('body')[0];
						if (pre) {
							xhr.responseText = pre.textContent;
						}
						else if (b) {
							xhr.responseText = b.innerHTML;
						}
					}			  
				}
				else if (s.dataType == 'xml' && !xhr.responseXML && xhr.responseText != null) {
					xhr.responseXML = toXml(xhr.responseText);
				}
				
				data = httpData(xhr, s.dataType, s);
			}
			catch(e){
				log('error caught:',e);
				ok = false;
				xhr.error = e;
				s.error && s.error.call(s.context, xhr, 'error', e);
				g && $.event.trigger("ajaxError", [xhr, s, e]);
			}
			
			if (xhr.aborted) {
				log('upload aborted');
				ok = false;
			}

			// ordering of these callbacks/triggers is odd, but that's how $.ajax does it
			if (ok) {
				s.success && s.success.call(s.context, data, 'success', xhr);
				g && $.event.trigger("ajaxSuccess", [xhr, s]);
			}
			
			g && $.event.trigger("ajaxComplete", [xhr, s]);

			if (g && ! --$.active) {
				$.event.trigger("ajaxStop");
			}
			
			s.complete && s.complete.call(s.context, xhr, ok ? 'success' : 'error');

			// clean up
			setTimeout(function() {
				$io.removeData('form-plugin-onload');
				$io.remove();
				xhr.responseXML = null;
			}, 100);
		}

		var toXml = $.parseXML || function(s, doc) { // use parseXML if available (jQuery 1.5+)
			if (window.ActiveXObject) {
				doc = new ActiveXObject('Microsoft.XMLDOM');
				doc.async = 'false';
				doc.loadXML(s);
			}
			else {
				doc = (new DOMParser()).parseFromString(s, 'text/xml');
			}
			return (doc && doc.documentElement && doc.documentElement.nodeName != 'parsererror') ? doc : null;
		};
		var parseJSON = $.parseJSON || function(s) {
			return window['eval']('(' + s + ')');
		};
		
		var httpData = function( xhr, type, s ) { // mostly lifted from jq1.4.4
			var ct = xhr.getResponseHeader('content-type') || '',
				xml = type === 'xml' || !type && ct.indexOf('xml') >= 0,
				data = xml ? xhr.responseXML : xhr.responseText;

			if (xml && data.documentElement.nodeName === 'parsererror') {
				$.error && $.error('parsererror');
			}
			if (s && s.dataFilter) {
				data = s.dataFilter(data, type);
			}
			if (typeof data === 'string') {
				if (type === 'json' || !type && ct.indexOf('json') >= 0) {
					data = parseJSON(data);
				} else if (type === "script" || !type && ct.indexOf("javascript") >= 0) {
					$.globalEval(data);
				}
			}
			return data;
		};
	}
};

/**
 * ajaxForm() provides a mechanism for fully automating form submission.
 *
 * The advantages of using this method instead of ajaxSubmit() are:
 *
 * 1: This method will include coordinates for <input type="image" /> elements (if the element
 *	is used to submit the form).
 * 2. This method will include the submit element's name/value data (for the element that was
 *	used to submit the form).
 * 3. This method binds the submit() method to the form for you.
 *
 * The options argument for ajaxForm works exactly as it does for ajaxSubmit.  ajaxForm merely
 * passes the options argument along after properly binding events for submit elements and
 * the form itself.
 */
$.fn.ajaxForm = function(options) {
	// in jQuery 1.3+ we can fix mistakes with the ready state
	if (this.length === 0) {
		var o = { s: this.selector, c: this.context };
		if (!$.isReady && o.s) {
			log('DOM not ready, queuing ajaxForm');
			$(function() {
				$(o.s,o.c).ajaxForm(options);
			});
			return this;
		}
		// is your DOM ready?  http://docs.jquery.com/Tutorials:Introducing_$(document).ready()
		log('terminating; zero elements found by selector' + ($.isReady ? '' : ' (DOM not ready)'));
		return this;
	}
	
	return this.ajaxFormUnbind().bind('submit.form-plugin', function(e) {
		if (!e.isDefaultPrevented()) { // if event has been canceled, don't proceed
			e.preventDefault();
			$(this).ajaxSubmit(options);
		}
	}).bind('click.form-plugin', function(e) {
		var target = e.target;
		var $el = $(target);
		if (!($el.is(":submit,input:image"))) {
			// is this a child element of the submit el?  (ex: a span within a button)
			var t = $el.closest(':submit');
			if (t.length == 0) {
				return;
			}
			target = t[0];
		}
		var form = this;
		form.clk = target;
		if (target.type == 'image') {
			if (e.offsetX != undefined) {
				form.clk_x = e.offsetX;
				form.clk_y = e.offsetY;
			} else if (typeof $.fn.offset == 'function') { // try to use dimensions plugin
				var offset = $el.offset();
				form.clk_x = e.pageX - offset.left;
				form.clk_y = e.pageY - offset.top;
			} else {
				form.clk_x = e.pageX - target.offsetLeft;
				form.clk_y = e.pageY - target.offsetTop;
			}
		}
		// clear form vars
		setTimeout(function() { form.clk = form.clk_x = form.clk_y = null; }, 100);
	});
};

// ajaxFormUnbind unbinds the event handlers that were bound by ajaxForm
$.fn.ajaxFormUnbind = function() {
	return this.unbind('submit.form-plugin click.form-plugin');
};

/**
 * formToArray() gathers form element data into an array of objects that can
 * be passed to any of the following ajax functions: $.get, $.post, or load.
 * Each object in the array has both a 'name' and 'value' property.  An example of
 * an array for a simple login form might be:
 *
 * [ { name: 'username', value: 'jresig' }, { name: 'password', value: 'secret' } ]
 *
 * It is this array that is passed to pre-submit callback functions provided to the
 * ajaxSubmit() and ajaxForm() methods.
 */
$.fn.formToArray = function(semantic) {
	var a = [];
	if (this.length === 0) {
		return a;
	}

	var form = this[0];
	var els = semantic ? form.getElementsByTagName('*') : form.elements;
	if (!els) {
		return a;
	}
	
	var i,j,n,v,el,max,jmax;
	for(i=0, max=els.length; i < max; i++) {
		el = els[i];
		n = el.name;
		if (!n) {
			continue;
		}

		if (semantic && form.clk && el.type == "image") {
			// handle image inputs on the fly when semantic == true
			if(!el.disabled && form.clk == el) {
				a.push({name: n, value: $(el).val()});
				a.push({name: n+'.x', value: form.clk_x}, {name: n+'.y', value: form.clk_y});
			}
			continue;
		}

		v = $.fieldValue(el, true);
		if (v && v.constructor == Array) {
			for(j=0, jmax=v.length; j < jmax; j++) {
				a.push({name: n, value: v[j]});
			}
		}
		else if (v !== null && typeof v != 'undefined') {
			a.push({name: n, value: v});
		}
	}

	if (!semantic && form.clk) {
		// input type=='image' are not found in elements array! handle it here
		var $input = $(form.clk), input = $input[0];
		n = input.name;
		if (n && !input.disabled && input.type == 'image') {
			a.push({name: n, value: $input.val()});
			a.push({name: n+'.x', value: form.clk_x}, {name: n+'.y', value: form.clk_y});
		}
	}
	return a;
};

/**
 * Serializes form data into a 'submittable' string. This method will return a string
 * in the format: name1=value1&amp;name2=value2
 */
$.fn.formSerialize = function(semantic) {
	//hand off to jQuery.param for proper encoding
	return $.param(this.formToArray(semantic));
};

/**
 * Serializes all field elements in the jQuery object into a query string.
 * This method will return a string in the format: name1=value1&amp;name2=value2
 */
$.fn.fieldSerialize = function(successful) {
	var a = [];
	this.each(function() {
		var n = this.name;
		if (!n) {
			return;
		}
		var v = $.fieldValue(this, successful);
		if (v && v.constructor == Array) {
			for (var i=0,max=v.length; i < max; i++) {
				a.push({name: n, value: v[i]});
			}
		}
		else if (v !== null && typeof v != 'undefined') {
			a.push({name: this.name, value: v});
		}
	});
	//hand off to jQuery.param for proper encoding
	return $.param(a);
};

/**
 * Returns the value(s) of the element in the matched set.  For example, consider the following form:
 *
 *  <form><fieldset>
 *	  <input name="A" type="text" />
 *	  <input name="A" type="text" />
 *	  <input name="B" type="checkbox" value="B1" />
 *	  <input name="B" type="checkbox" value="B2"/>
 *	  <input name="C" type="radio" value="C1" />
 *	  <input name="C" type="radio" value="C2" />
 *  </fieldset></form>
 *
 *  var v = $(':text').fieldValue();
 *  // if no values are entered into the text inputs
 *  v == ['','']
 *  // if values entered into the text inputs are 'foo' and 'bar'
 *  v == ['foo','bar']
 *
 *  var v = $(':checkbox').fieldValue();
 *  // if neither checkbox is checked
 *  v === undefined
 *  // if both checkboxes are checked
 *  v == ['B1', 'B2']
 *
 *  var v = $(':radio').fieldValue();
 *  // if neither radio is checked
 *  v === undefined
 *  // if first radio is checked
 *  v == ['C1']
 *
 * The successful argument controls whether or not the field element must be 'successful'
 * (per http://www.w3.org/TR/html4/interact/forms.html#successful-controls).
 * The default value of the successful argument is true.  If this value is false the value(s)
 * for each element is returned.
 *
 * Note: This method *always* returns an array.  If no valid value can be determined the
 *	   array will be empty, otherwise it will contain one or more values.
 */
$.fn.fieldValue = function(successful) {
	for (var val=[], i=0, max=this.length; i < max; i++) {
		var el = this[i];
		var v = $.fieldValue(el, successful);
		if (v === null || typeof v == 'undefined' || (v.constructor == Array && !v.length)) {
			continue;
		}
		v.constructor == Array ? $.merge(val, v) : val.push(v);
	}
	return val;
};

/**
 * Returns the value of the field element.
 */
$.fieldValue = function(el, successful) {
	var n = el.name, t = el.type, tag = el.tagName.toLowerCase();
	if (successful === undefined) {
		successful = true;
	}

	if (successful && (!n || el.disabled || t == 'reset' || t == 'button' ||
		(t == 'checkbox' || t == 'radio') && !el.checked ||
		(t == 'submit' || t == 'image') && el.form && el.form.clk != el ||
		tag == 'select' && el.selectedIndex == -1)) {
			return null;
	}

	if (tag == 'select') {
		var index = el.selectedIndex;
		if (index < 0) {
			return null;
		}
		var a = [], ops = el.options;
		var one = (t == 'select-one');
		var max = (one ? index+1 : ops.length);
		for(var i=(one ? index : 0); i < max; i++) {
			var op = ops[i];
			if (op.selected) {
				var v = op.value;
				if (!v) { // extra pain for IE...
					v = (op.attributes && op.attributes['value'] && !(op.attributes['value'].specified)) ? op.text : op.value;
				}
				if (one) {
					return v;
				}
				a.push(v);
			}
		}
		return a;
	}
	return $(el).val();
};

/**
 * Clears the form data.  Takes the following actions on the form's input fields:
 *  - input text fields will have their 'value' property set to the empty string
 *  - select elements will have their 'selectedIndex' property set to -1
 *  - checkbox and radio inputs will have their 'checked' property set to false
 *  - inputs of type submit, button, reset, and hidden will *not* be effected
 *  - button elements will *not* be effected
 */
$.fn.clearForm = function() {
	return this.each(function() {
		$('input,select,textarea', this).clearFields();
	});
};

/**
 * Clears the selected form elements.
 */
$.fn.clearFields = $.fn.clearInputs = function() {
	return this.each(function() {
		var t = this.type, tag = this.tagName.toLowerCase();
		if (t == 'text' || t == 'password' || tag == 'textarea') {
			this.value = '';
		}
		else if (t == 'checkbox' || t == 'radio') {
			this.checked = false;
		}
		else if (tag == 'select') {
			this.selectedIndex = -1;
		}
	});
};

/**
 * Resets the form data.  Causes all form elements to be reset to their original value.
 */
$.fn.resetForm = function() {
	return this.each(function() {
		// guard against an input with the name of 'reset'
		// note that IE reports the reset function as an 'object'
		if (typeof this.reset == 'function' || (typeof this.reset == 'object' && !this.reset.nodeType)) {
			this.reset();
		}
	});
};

/**
 * Enables or disables any matching elements.
 */
$.fn.enable = function(b) {
	if (b === undefined) {
		b = true;
	}
	return this.each(function() {
		this.disabled = !b;
	});
};

/**
 * Checks/unchecks any matching checkboxes or radio buttons and
 * selects/deselects and matching option elements.
 */
$.fn.selected = function(select) {
	if (select === undefined) {
		select = true;
	}
	return this.each(function() {
		var t = this.type;
		if (t == 'checkbox' || t == 'radio') {
			this.checked = select;
		}
		else if (this.tagName.toLowerCase() == 'option') {
			var $sel = $(this).parent('select');
			if (select && $sel[0] && $sel[0].type == 'select-one') {
				// deselect all other options
				$sel.find('option').selected(false);
			}
			this.selected = select;
		}
	});
};

// helper fn for console logging
// set $.fn.ajaxSubmit.debug to true to enable debug logging
function log() {
	if ($.fn.ajaxSubmit.debug) {
		var msg = '[jquery.form] ' + Array.prototype.join.call(arguments,'');
		if (window.console && window.console.log) {
			window.console.log(msg);
		}
		else if (window.opera && window.opera.postError) {
			window.opera.postError(msg);
		}
	}
};

})(jQuery);

(function ($) {

/**
 * A progressbar object. Initialized with the given id. Must be inserted into
 * the DOM afterwards through progressBar.element.
 *
 * method is the function which will perform the HTTP request to get the
 * progress bar state. Either "GET" or "POST".
 *
 * e.g. pb = new progressBar('myProgressBar');
 *      some_element.appendChild(pb.element);
 */
Drupal.progressBar = function (id, updateCallback, method, errorCallback) {
  var pb = this;
  this.id = id;
  this.method = method || 'GET';
  this.updateCallback = updateCallback;
  this.errorCallback = errorCallback;

  // The WAI-ARIA setting aria-live="polite" will announce changes after users
  // have completed their current activity and not interrupt the screen reader.
  this.element = $('<div class="progress" aria-live="polite"></div>').attr('id', id);
  this.element.html('<div class="bar"><div class="filled"></div></div>' +
                    '<div class="percentage"></div>' +
                    '<div class="message">&nbsp;</div>');
};

/**
 * Set the percentage and status message for the progressbar.
 */
Drupal.progressBar.prototype.setProgress = function (percentage, message) {
  if (percentage >= 0 && percentage <= 100) {
    $('div.filled', this.element).css('width', percentage + '%');
    $('div.percentage', this.element).html(percentage + '%');
  }
  $('div.message', this.element).html(message);
  if (this.updateCallback) {
    this.updateCallback(percentage, message, this);
  }
};

/**
 * Start monitoring progress via Ajax.
 */
Drupal.progressBar.prototype.startMonitoring = function (uri, delay) {
  this.delay = delay;
  this.uri = uri;
  this.sendPing();
};

/**
 * Stop monitoring progress via Ajax.
 */
Drupal.progressBar.prototype.stopMonitoring = function () {
  clearTimeout(this.timer);
  // This allows monitoring to be stopped from within the callback.
  this.uri = null;
};

/**
 * Request progress data from server.
 */
Drupal.progressBar.prototype.sendPing = function () {
  if (this.timer) {
    clearTimeout(this.timer);
  }
  if (this.uri) {
    var pb = this;
    // When doing a post request, you need non-null data. Otherwise a
    // HTTP 411 or HTTP 406 (with Apache mod_security) error may result.
    $.ajax({
      type: this.method,
      url: this.uri,
      data: '',
      dataType: 'json',
      success: function (progress) {
        // Display errors.
        if (progress.status == 0) {
          pb.displayError(progress.data);
          return;
        }
        // Update display.
        pb.setProgress(progress.percentage, progress.message);
        // Schedule next timer.
        pb.timer = setTimeout(function () { pb.sendPing(); }, pb.delay);
      },
      error: function (xmlhttp) {
        pb.displayError(Drupal.ajaxError(xmlhttp, pb.uri));
      }
    });
  }
};

/**
 * Display errors on the page.
 */
Drupal.progressBar.prototype.displayError = function (string) {
  var error = $('<div class="messages error"></div>').html(string);
  $(this.element).before(error).hide();

  if (this.errorCallback) {
    this.errorCallback(this);
  }
};

})(jQuery);

(function ($) {

/**
 * The base States namespace.
 *
 * Having the local states variable allows us to use the States namespace
 * without having to always declare "Drupal.states".
 */
var states = Drupal.states = {
  // An array of functions that should be postponed.
  postponed: []
};

/**
 * Attaches the states.
 */
Drupal.behaviors.states = {
  attach: function (context, settings) {
    for (var selector in settings.states) {
      for (var state in settings.states[selector]) {
        new states.Dependent({
          element: $(selector),
          state: states.State.sanitize(state),
          dependees: settings.states[selector][state]
        });
      }
    }

    // Execute all postponed functions now.
    while (states.postponed.length) {
      (states.postponed.shift())();
    }
  }
};

/**
 * Object representing an element that depends on other elements.
 *
 * @param args
 *   Object with the following keys (all of which are required):
 *   - element: A jQuery object of the dependent element
 *   - state: A State object describing the state that is dependent
 *   - dependees: An object with dependency specifications. Lists all elements
 *     that this element depends on.
 */
states.Dependent = function (args) {
  $.extend(this, { values: {}, oldValue: undefined }, args);

  for (var selector in this.dependees) {
    this.initializeDependee(selector, this.dependees[selector]);
  }
};

/**
 * Comparison functions for comparing the value of an element with the
 * specification from the dependency settings. If the object type can't be
 * found in this list, the === operator is used by default.
 */
states.Dependent.comparisons = {
  'RegExp': function (reference, value) {
    return reference.test(value);
  },
  'Function': function (reference, value) {
    // The "reference" variable is a comparison function.
    return reference(value);
  },
  'Number': function (reference, value) {
    // If "reference" is a number and "value" is a string, then cast reference
    // as a string before applying the strict comparison in compare(). Otherwise
    // numeric keys in the form's #states array fail to match string values
    // returned from jQuery's val().
    return (value.constructor.name === 'String') ? compare(String(reference), value) : compare(reference, value);
  }
};

states.Dependent.prototype = {
  /**
   * Initializes one of the elements this dependent depends on.
   *
   * @param selector
   *   The CSS selector describing the dependee.
   * @param dependeeStates
   *   The list of states that have to be monitored for tracking the
   *   dependee's compliance status.
   */
  initializeDependee: function (selector, dependeeStates) {
    var self = this;

    // Cache for the states of this dependee.
    self.values[selector] = {};

    $.each(dependeeStates, function (state, value) {
      state = states.State.sanitize(state);

      // Initialize the value of this state.
      self.values[selector][state.pristine] = undefined;

      // Monitor state changes of the specified state for this dependee.
      $(selector).bind('state:' + state, function (e) {
        var complies = self.compare(value, e.value);
        self.update(selector, state, complies);
      });

      // Make sure the event we just bound ourselves to is actually fired.
      new states.Trigger({ selector: selector, state: state });
    });
  },

  /**
   * Compares a value with a reference value.
   *
   * @param reference
   *   The value used for reference.
   * @param value
   *   The value to compare with the reference value.
   * @return
   *   true, undefined or false.
   */
  compare: function (reference, value) {
    if (reference.constructor.name in states.Dependent.comparisons) {
      // Use a custom compare function for certain reference value types.
      return states.Dependent.comparisons[reference.constructor.name](reference, value);
    }
    else {
      // Do a plain comparison otherwise.
      return compare(reference, value);
    }
  },

  /**
   * Update the value of a dependee's state.
   *
   * @param selector
   *   CSS selector describing the dependee.
   * @param state
   *   A State object describing the dependee's updated state.
   * @param value
   *   The new value for the dependee's updated state.
   */
  update: function (selector, state, value) {
    // Only act when the 'new' value is actually new.
    if (value !== this.values[selector][state.pristine]) {
      this.values[selector][state.pristine] = value;
      this.reevaluate();
    }
  },

  /**
   * Triggers change events in case a state changed.
   */
  reevaluate: function () {
    var value = undefined;

    // Merge all individual values to find out whether this dependee complies.
    for (var selector in this.values) {
      for (var state in this.values[selector]) {
        state = states.State.sanitize(state);
        var complies = this.values[selector][state.pristine];
        value = ternary(value, invert(complies, state.invert));
      }
    }

    // Only invoke a state change event when the value actually changed.
    if (value !== this.oldValue) {
      // Store the new value so that we can compare later whether the value
      // actually changed.
      this.oldValue = value;

      // Normalize the value to match the normalized state name.
      value = invert(value, this.state.invert);

      // By adding "trigger: true", we ensure that state changes don't go into
      // infinite loops.
      this.element.trigger({ type: 'state:' + this.state, value: value, trigger: true });
    }
  }
};

states.Trigger = function (args) {
  $.extend(this, args);

  if (this.state in states.Trigger.states) {
    this.element = $(this.selector);

    // Only call the trigger initializer when it wasn't yet attached to this
    // element. Otherwise we'd end up with duplicate events.
    if (!this.element.data('trigger:' + this.state)) {
      this.initialize();
    }
  }
};

states.Trigger.prototype = {
  initialize: function () {
    var self = this;
    var trigger = states.Trigger.states[this.state];

    if (typeof trigger == 'function') {
      // We have a custom trigger initialization function.
      trigger.call(window, this.element);
    }
    else {
      $.each(trigger, function (event, valueFn) {
        self.defaultTrigger(event, valueFn);
      });
    }

    // Mark this trigger as initialized for this element.
    this.element.data('trigger:' + this.state, true);
  },

  defaultTrigger: function (event, valueFn) {
    var self = this;
    var oldValue = valueFn.call(this.element);

    // Attach the event callback.
    this.element.bind(event, function (e) {
      var value = valueFn.call(self.element, e);
      // Only trigger the event if the value has actually changed.
      if (oldValue !== value) {
        self.element.trigger({ type: 'state:' + self.state, value: value, oldValue: oldValue });
        oldValue = value;
      }
    });

    states.postponed.push(function () {
      // Trigger the event once for initialization purposes.
      self.element.trigger({ type: 'state:' + self.state, value: oldValue, oldValue: undefined });
    });
  }
};

/**
 * This list of states contains functions that are used to monitor the state
 * of an element. Whenever an element depends on the state of another element,
 * one of these trigger functions is added to the dependee so that the
 * dependent element can be updated.
 */
states.Trigger.states = {
  // 'empty' describes the state to be monitored
  empty: {
    // 'keyup' is the (native DOM) event that we watch for.
    'keyup': function () {
      // The function associated to that trigger returns the new value for the
      // state.
      return this.val() == '';
    }
  },

  checked: {
    'change': function () {
      return this.prop('checked');
    }
  },

  // For radio buttons, only return the value if the radio button is selected.
  value: {
    'keyup': function () {
      // Radio buttons share the same :input[name="key"] selector.
      if (this.length > 1) {
        // Initial checked value of radios is undefined, so we return false.
        return this.filter(':checked').val() || false;
      }
      return this.val();
    },
    'change': function () {
      // Radio buttons share the same :input[name="key"] selector.
      if (this.length > 1) {
        // Initial checked value of radios is undefined, so we return false.
        return this.filter(':checked').val() || false;
      }
      return this.val();
    }
  },

  collapsed: {
    'collapsed': function(e) {
      return (e !== undefined && 'value' in e) ? e.value : this.is('.collapsed');
    }
  }
};


/**
 * A state object is used for describing the state and performing aliasing.
 */
states.State = function(state) {
  // We may need the original unresolved name later.
  this.pristine = this.name = state;

  // Normalize the state name.
  while (true) {
    // Iteratively remove exclamation marks and invert the value.
    while (this.name.charAt(0) == '!') {
      this.name = this.name.substring(1);
      this.invert = !this.invert;
    }

    // Replace the state with its normalized name.
    if (this.name in states.State.aliases) {
      this.name = states.State.aliases[this.name];
    }
    else {
      break;
    }
  }
};

/**
 * Create a new State object by sanitizing the passed value.
 */
states.State.sanitize = function (state) {
  if (state instanceof states.State) {
    return state;
  }
  else {
    return new states.State(state);
  }
};

/**
 * This list of aliases is used to normalize states and associates negated names
 * with their respective inverse state.
 */
states.State.aliases = {
  'enabled': '!disabled',
  'invisible': '!visible',
  'invalid': '!valid',
  'untouched': '!touched',
  'optional': '!required',
  'filled': '!empty',
  'unchecked': '!checked',
  'irrelevant': '!relevant',
  'expanded': '!collapsed',
  'readwrite': '!readonly'
};

states.State.prototype = {
  invert: false,

  /**
   * Ensures that just using the state object returns the name.
   */
  toString: function() {
    return this.name;
  }
};

/**
 * Global state change handlers. These are bound to "document" to cover all
 * elements whose state changes. Events sent to elements within the page
 * bubble up to these handlers. We use this system so that themes and modules
 * can override these state change handlers for particular parts of a page.
 */
{
  $(document).bind('state:disabled', function(e) {
    // Only act when this change was triggered by a dependency and not by the
    // element monitoring itself.
    if (e.trigger) {
      $(e.target)
        .attr('disabled', e.value)
        .filter('.form-element')
          .closest('.form-item, .form-submit, .form-wrapper')[e.value ? 'addClass' : 'removeClass']('form-disabled');

      // Note: WebKit nightlies don't reflect that change correctly.
      // See https://bugs.webkit.org/show_bug.cgi?id=23789
    }
  });

  $(document).bind('state:required', function(e) {
    if (e.trigger) {
      if (e.value) {
        $(e.target).closest('.form-item, .form-wrapper').find('label').append('<span class="form-required">*</span>');
      }
      else {
        $(e.target).closest('.form-item, .form-wrapper').find('label .form-required').remove();
      }
    }
  });

  $(document).bind('state:visible', function(e) {
    if (e.trigger) {
      $(e.target).closest('.form-item, .form-submit, .form-wrapper')[e.value ? 'show' : 'hide']();
    }
  });

  $(document).bind('state:checked', function(e) {
    if (e.trigger) {
      $(e.target).prop('checked', e.value);
    }
  });

  $(document).bind('state:collapsed', function(e) {
    if (e.trigger) {
      if ($(e.target).is('.collapsed') !== e.value) {
        $('> legend a', e.target).click();
      }
    }
  });
}

/**
 * These are helper functions implementing addition "operators" and don't
 * implement any logic that is particular to states.
 */
{
  // Bitwise AND with a third undefined state.
  function ternary (a, b) {
    return a === undefined ? b : (b === undefined ? a : a && b);
  };

  // Inverts a (if it's not undefined) when invert is true.
  function invert (a, invert) {
    return (invert && a !== undefined) ? !a : a;
  };

  // Compares two values while ignoring undefined values.
  function compare (a, b) {
    return (a === b) ? (a === undefined ? a : true) : (a === undefined || b === undefined);
  }
}

})(jQuery);

(function ($) {

/**
 * Drag and drop table rows with field manipulation.
 *
 * Using the drupal_add_tabledrag() function, any table with weights or parent
 * relationships may be made into draggable tables. Columns containing a field
 * may optionally be hidden, providing a better user experience.
 *
 * Created tableDrag instances may be modified with custom behaviors by
 * overriding the .onDrag, .onDrop, .row.onSwap, and .row.onIndent methods.
 * See blocks.js for an example of adding additional functionality to tableDrag.
 */
Drupal.behaviors.tableDrag = {
  attach: function (context, settings) {
    for (var base in settings.tableDrag) {
      $('#' + base, context).once('tabledrag', function () {
        // Create the new tableDrag instance. Save in the Drupal variable
        // to allow other scripts access to the object.
        Drupal.tableDrag[base] = new Drupal.tableDrag(this, settings.tableDrag[base]);
      });
    }
  }
};

/**
 * Constructor for the tableDrag object. Provides table and field manipulation.
 *
 * @param table
 *   DOM object for the table to be made draggable.
 * @param tableSettings
 *   Settings for the table added via drupal_add_dragtable().
 */
Drupal.tableDrag = function (table, tableSettings) {
  var self = this;

  // Required object variables.
  this.table = table;
  this.tableSettings = tableSettings;
  this.dragObject = null; // Used to hold information about a current drag operation.
  this.rowObject = null; // Provides operations for row manipulation.
  this.oldRowElement = null; // Remember the previous element.
  this.oldY = 0; // Used to determine up or down direction from last mouse move.
  this.changed = false; // Whether anything in the entire table has changed.
  this.maxDepth = 0; // Maximum amount of allowed parenting.
  this.rtl = $(this.table).css('direction') == 'rtl' ? -1 : 1; // Direction of the table.

  // Configure the scroll settings.
  this.scrollSettings = { amount: 4, interval: 50, trigger: 70 };
  this.scrollInterval = null;
  this.scrollY = 0;
  this.windowHeight = 0;

  // Check this table's settings to see if there are parent relationships in
  // this table. For efficiency, large sections of code can be skipped if we
  // don't need to track horizontal movement and indentations.
  this.indentEnabled = false;
  for (var group in tableSettings) {
    for (var n in tableSettings[group]) {
      if (tableSettings[group][n].relationship == 'parent') {
        this.indentEnabled = true;
      }
      if (tableSettings[group][n].limit > 0) {
        this.maxDepth = tableSettings[group][n].limit;
      }
    }
  }
  if (this.indentEnabled) {
    this.indentCount = 1; // Total width of indents, set in makeDraggable.
    // Find the width of indentations to measure mouse movements against.
    // Because the table doesn't need to start with any indentations, we
    // manually append 2 indentations in the first draggable row, measure
    // the offset, then remove.
    var indent = Drupal.theme('tableDragIndentation');
    var testRow = $('<tr/>').addClass('draggable').appendTo(table);
    var testCell = $('<td/>').appendTo(testRow).prepend(indent).prepend(indent);
    this.indentAmount = $('.indentation', testCell).get(1).offsetLeft - $('.indentation', testCell).get(0).offsetLeft;
    testRow.remove();
  }

  // Make each applicable row draggable.
  // Match immediate children of the parent element to allow nesting.
  $('> tr.draggable, > tbody > tr.draggable', table).each(function () { self.makeDraggable(this); });

  // Add a link before the table for users to show or hide weight columns.
  $(table).before($('<a href="#" class="tabledrag-toggle-weight"></a>')
    .attr('title', Drupal.t('Re-order rows by numerical weight instead of dragging.'))
    .click(function () {
      if ($.cookie('Drupal.tableDrag.showWeight') == 1) {
        self.hideColumns();
      }
      else {
        self.showColumns();
      }
      return false;
    })
    .wrap('<div class="tabledrag-toggle-weight-wrapper"></div>')
    .parent()
  );

  // Initialize the specified columns (for example, weight or parent columns)
  // to show or hide according to user preference. This aids accessibility
  // so that, e.g., screen reader users can choose to enter weight values and
  // manipulate form elements directly, rather than using drag-and-drop..
  self.initColumns();

  // Add mouse bindings to the document. The self variable is passed along
  // as event handlers do not have direct access to the tableDrag object.
  $(document).bind('mousemove', function (event) { return self.dragRow(event, self); });
  $(document).bind('mouseup', function (event) { return self.dropRow(event, self); });
};

/**
 * Initialize columns containing form elements to be hidden by default,
 * according to the settings for this tableDrag instance.
 *
 * Identify and mark each cell with a CSS class so we can easily toggle
 * show/hide it. Finally, hide columns if user does not have a
 * 'Drupal.tableDrag.showWeight' cookie.
 */
Drupal.tableDrag.prototype.initColumns = function () {
  for (var group in this.tableSettings) {
    // Find the first field in this group.
    for (var d in this.tableSettings[group]) {
      var field = $('.' + this.tableSettings[group][d].target + ':first', this.table);
      if (field.length && this.tableSettings[group][d].hidden) {
        var hidden = this.tableSettings[group][d].hidden;
        var cell = field.closest('td');
        break;
      }
    }

    // Mark the column containing this field so it can be hidden.
    if (hidden && cell[0]) {
      // Add 1 to our indexes. The nth-child selector is 1 based, not 0 based.
      // Match immediate children of the parent element to allow nesting.
      var columnIndex = $('> td', cell.parent()).index(cell.get(0)) + 1;
      $('> thead > tr, > tbody > tr, > tr', this.table).each(function () {
        // Get the columnIndex and adjust for any colspans in this row.
        var index = columnIndex;
        var cells = $(this).children();
        cells.each(function (n) {
          if (n < index && this.colSpan && this.colSpan > 1) {
            index -= this.colSpan - 1;
          }
        });
        if (index > 0) {
          cell = cells.filter(':nth-child(' + index + ')');
          if (cell[0].colSpan && cell[0].colSpan > 1) {
            // If this cell has a colspan, mark it so we can reduce the colspan.
            cell.addClass('tabledrag-has-colspan');
          }
          else {
            // Mark this cell so we can hide it.
            cell.addClass('tabledrag-hide');
          }
        }
      });
    }
  }

  // Now hide cells and reduce colspans unless cookie indicates previous choice.
  // Set a cookie if it is not already present.
  if ($.cookie('Drupal.tableDrag.showWeight') === null) {
    $.cookie('Drupal.tableDrag.showWeight', 0, {
      path: Drupal.settings.basePath,
      // The cookie expires in one year.
      expires: 365
    });
    this.hideColumns();
  }
  // Check cookie value and show/hide weight columns accordingly.
  else {
    if ($.cookie('Drupal.tableDrag.showWeight') == 1) {
      this.showColumns();
    }
    else {
      this.hideColumns();
    }
  }
};

/**
 * Hide the columns containing weight/parent form elements.
 * Undo showColumns().
 */
Drupal.tableDrag.prototype.hideColumns = function () {
  // Hide weight/parent cells and headers.
  $('.tabledrag-hide', 'table.tabledrag-processed').css('display', 'none');
  // Show TableDrag handles.
  $('.tabledrag-handle', 'table.tabledrag-processed').css('display', '');
  // Reduce the colspan of any effected multi-span columns.
  $('.tabledrag-has-colspan', 'table.tabledrag-processed').each(function () {
    this.colSpan = this.colSpan - 1;
  });
  // Change link text.
  $('.tabledrag-toggle-weight').text(Drupal.t('Show row weights'));
  // Change cookie.
  $.cookie('Drupal.tableDrag.showWeight', 0, {
    path: Drupal.settings.basePath,
    // The cookie expires in one year.
    expires: 365
  });
  // Trigger an event to allow other scripts to react to this display change.
  $('table.tabledrag-processed').trigger('columnschange', 'hide');
};

/**
 * Show the columns containing weight/parent form elements
 * Undo hideColumns().
 */
Drupal.tableDrag.prototype.showColumns = function () {
  // Show weight/parent cells and headers.
  $('.tabledrag-hide', 'table.tabledrag-processed').css('display', '');
  // Hide TableDrag handles.
  $('.tabledrag-handle', 'table.tabledrag-processed').css('display', 'none');
  // Increase the colspan for any columns where it was previously reduced.
  $('.tabledrag-has-colspan', 'table.tabledrag-processed').each(function () {
    this.colSpan = this.colSpan + 1;
  });
  // Change link text.
  $('.tabledrag-toggle-weight').text(Drupal.t('Hide row weights'));
  // Change cookie.
  $.cookie('Drupal.tableDrag.showWeight', 1, {
    path: Drupal.settings.basePath,
    // The cookie expires in one year.
    expires: 365
  });
  // Trigger an event to allow other scripts to react to this display change.
  $('table.tabledrag-processed').trigger('columnschange', 'show');
};

/**
 * Find the target used within a particular row and group.
 */
Drupal.tableDrag.prototype.rowSettings = function (group, row) {
  var field = $('.' + group, row);
  for (var delta in this.tableSettings[group]) {
    var targetClass = this.tableSettings[group][delta].target;
    if (field.is('.' + targetClass)) {
      // Return a copy of the row settings.
      var rowSettings = {};
      for (var n in this.tableSettings[group][delta]) {
        rowSettings[n] = this.tableSettings[group][delta][n];
      }
      return rowSettings;
    }
  }
};

/**
 * Take an item and add event handlers to make it become draggable.
 */
Drupal.tableDrag.prototype.makeDraggable = function (item) {
  var self = this;

  // Create the handle.
  var handle = $('<a href="#" class="tabledrag-handle"><div class="handle">&nbsp;</div></a>').attr('title', Drupal.t('Drag to re-order'));
  // Insert the handle after indentations (if any).
  if ($('td:first .indentation:last', item).length) {
    $('td:first .indentation:last', item).after(handle);
    // Update the total width of indentation in this entire table.
    self.indentCount = Math.max($('.indentation', item).length, self.indentCount);
  }
  else {
    $('td:first', item).prepend(handle);
  }

  // Add hover action for the handle.
  handle.hover(function () {
    self.dragObject == null ? $(this).addClass('tabledrag-handle-hover') : null;
  }, function () {
    self.dragObject == null ? $(this).removeClass('tabledrag-handle-hover') : null;
  });

  // Add the mousedown action for the handle.
  handle.mousedown(function (event) {
    // Create a new dragObject recording the event information.
    self.dragObject = {};
    self.dragObject.initMouseOffset = self.getMouseOffset(item, event);
    self.dragObject.initMouseCoords = self.mouseCoords(event);
    if (self.indentEnabled) {
      self.dragObject.indentMousePos = self.dragObject.initMouseCoords;
    }

    // If there's a lingering row object from the keyboard, remove its focus.
    if (self.rowObject) {
      $('a.tabledrag-handle', self.rowObject.element).blur();
    }

    // Create a new rowObject for manipulation of this row.
    self.rowObject = new self.row(item, 'mouse', self.indentEnabled, self.maxDepth, true);

    // Save the position of the table.
    self.table.topY = $(self.table).offset().top;
    self.table.bottomY = self.table.topY + self.table.offsetHeight;

    // Add classes to the handle and row.
    $(this).addClass('tabledrag-handle-hover');
    $(item).addClass('drag');

    // Set the document to use the move cursor during drag.
    $('body').addClass('drag');
    if (self.oldRowElement) {
      $(self.oldRowElement).removeClass('drag-previous');
    }

    // Hack for IE6 that flickers uncontrollably if select lists are moved.
    if (navigator.userAgent.indexOf('MSIE 6.') != -1) {
      $('select', this.table).css('display', 'none');
    }

    // Hack for Konqueror, prevent the blur handler from firing.
    // Konqueror always gives links focus, even after returning false on mousedown.
    self.safeBlur = false;

    // Call optional placeholder function.
    self.onDrag();
    return false;
  });

  // Prevent the anchor tag from jumping us to the top of the page.
  handle.click(function () {
    return false;
  });

  // Similar to the hover event, add a class when the handle is focused.
  handle.focus(function () {
    $(this).addClass('tabledrag-handle-hover');
    self.safeBlur = true;
  });

  // Remove the handle class on blur and fire the same function as a mouseup.
  handle.blur(function (event) {
    $(this).removeClass('tabledrag-handle-hover');
    if (self.rowObject && self.safeBlur) {
      self.dropRow(event, self);
    }
  });

  // Add arrow-key support to the handle.
  handle.keydown(function (event) {
    // If a rowObject doesn't yet exist and this isn't the tab key.
    if (event.keyCode != 9 && !self.rowObject) {
      self.rowObject = new self.row(item, 'keyboard', self.indentEnabled, self.maxDepth, true);
    }

    var keyChange = false;
    switch (event.keyCode) {
      case 37: // Left arrow.
      case 63234: // Safari left arrow.
        keyChange = true;
        self.rowObject.indent(-1 * self.rtl);
        break;
      case 38: // Up arrow.
      case 63232: // Safari up arrow.
        var previousRow = $(self.rowObject.element).prev('tr').get(0);
        while (previousRow && $(previousRow).is(':hidden')) {
          previousRow = $(previousRow).prev('tr').get(0);
        }
        if (previousRow) {
          self.safeBlur = false; // Do not allow the onBlur cleanup.
          self.rowObject.direction = 'up';
          keyChange = true;

          if ($(item).is('.tabledrag-root')) {
            // Swap with the previous top-level row.
            var groupHeight = 0;
            while (previousRow && $('.indentation', previousRow).length) {
              previousRow = $(previousRow).prev('tr').get(0);
              groupHeight += $(previousRow).is(':hidden') ? 0 : previousRow.offsetHeight;
            }
            if (previousRow) {
              self.rowObject.swap('before', previousRow);
              // No need to check for indentation, 0 is the only valid one.
              window.scrollBy(0, -groupHeight);
            }
          }
          else if (self.table.tBodies[0].rows[0] != previousRow || $(previousRow).is('.draggable')) {
            // Swap with the previous row (unless previous row is the first one
            // and undraggable).
            self.rowObject.swap('before', previousRow);
            self.rowObject.interval = null;
            self.rowObject.indent(0);
            window.scrollBy(0, -parseInt(item.offsetHeight, 10));
          }
          handle.get(0).focus(); // Regain focus after the DOM manipulation.
        }
        break;
      case 39: // Right arrow.
      case 63235: // Safari right arrow.
        keyChange = true;
        self.rowObject.indent(1 * self.rtl);
        break;
      case 40: // Down arrow.
      case 63233: // Safari down arrow.
        var nextRow = $(self.rowObject.group).filter(':last').next('tr').get(0);
        while (nextRow && $(nextRow).is(':hidden')) {
          nextRow = $(nextRow).next('tr').get(0);
        }
        if (nextRow) {
          self.safeBlur = false; // Do not allow the onBlur cleanup.
          self.rowObject.direction = 'down';
          keyChange = true;

          if ($(item).is('.tabledrag-root')) {
            // Swap with the next group (necessarily a top-level one).
            var groupHeight = 0;
            var nextGroup = new self.row(nextRow, 'keyboard', self.indentEnabled, self.maxDepth, false);
            if (nextGroup) {
              $(nextGroup.group).each(function () {
                groupHeight += $(this).is(':hidden') ? 0 : this.offsetHeight;
              });
              var nextGroupRow = $(nextGroup.group).filter(':last').get(0);
              self.rowObject.swap('after', nextGroupRow);
              // No need to check for indentation, 0 is the only valid one.
              window.scrollBy(0, parseInt(groupHeight, 10));
            }
          }
          else {
            // Swap with the next row.
            self.rowObject.swap('after', nextRow);
            self.rowObject.interval = null;
            self.rowObject.indent(0);
            window.scrollBy(0, parseInt(item.offsetHeight, 10));
          }
          handle.get(0).focus(); // Regain focus after the DOM manipulation.
        }
        break;
    }

    if (self.rowObject && self.rowObject.changed == true) {
      $(item).addClass('drag');
      if (self.oldRowElement) {
        $(self.oldRowElement).removeClass('drag-previous');
      }
      self.oldRowElement = item;
      self.restripeTable();
      self.onDrag();
    }

    // Returning false if we have an arrow key to prevent scrolling.
    if (keyChange) {
      return false;
    }
  });

  // Compatibility addition, return false on keypress to prevent unwanted scrolling.
  // IE and Safari will suppress scrolling on keydown, but all other browsers
  // need to return false on keypress. http://www.quirksmode.org/js/keys.html
  handle.keypress(function (event) {
    switch (event.keyCode) {
      case 37: // Left arrow.
      case 38: // Up arrow.
      case 39: // Right arrow.
      case 40: // Down arrow.
        return false;
    }
  });
};

/**
 * Mousemove event handler, bound to document.
 */
Drupal.tableDrag.prototype.dragRow = function (event, self) {
  if (self.dragObject) {
    self.currentMouseCoords = self.mouseCoords(event);

    var y = self.currentMouseCoords.y - self.dragObject.initMouseOffset.y;
    var x = self.currentMouseCoords.x - self.dragObject.initMouseOffset.x;

    // Check for row swapping and vertical scrolling.
    if (y != self.oldY) {
      self.rowObject.direction = y > self.oldY ? 'down' : 'up';
      self.oldY = y; // Update the old value.

      // Check if the window should be scrolled (and how fast).
      var scrollAmount = self.checkScroll(self.currentMouseCoords.y);
      // Stop any current scrolling.
      clearInterval(self.scrollInterval);
      // Continue scrolling if the mouse has moved in the scroll direction.
      if (scrollAmount > 0 && self.rowObject.direction == 'down' || scrollAmount < 0 && self.rowObject.direction == 'up') {
        self.setScroll(scrollAmount);
      }

      // If we have a valid target, perform the swap and restripe the table.
      var currentRow = self.findDropTargetRow(x, y);
      if (currentRow) {
        if (self.rowObject.direction == 'down') {
          self.rowObject.swap('after', currentRow, self);
        }
        else {
          self.rowObject.swap('before', currentRow, self);
        }
        self.restripeTable();
      }
    }

    // Similar to row swapping, handle indentations.
    if (self.indentEnabled) {
      var xDiff = self.currentMouseCoords.x - self.dragObject.indentMousePos.x;
      // Set the number of indentations the mouse has been moved left or right.
      var indentDiff = Math.round(xDiff / self.indentAmount * self.rtl);
      // Indent the row with our estimated diff, which may be further
      // restricted according to the rows around this row.
      var indentChange = self.rowObject.indent(indentDiff);
      // Update table and mouse indentations.
      self.dragObject.indentMousePos.x += self.indentAmount * indentChange * self.rtl;
      self.indentCount = Math.max(self.indentCount, self.rowObject.indents);
    }

    return false;
  }
};

/**
 * Mouseup event handler, bound to document.
 * Blur event handler, bound to drag handle for keyboard support.
 */
Drupal.tableDrag.prototype.dropRow = function (event, self) {
  // Drop row functionality shared between mouseup and blur events.
  if (self.rowObject != null) {
    var droppedRow = self.rowObject.element;
    // The row is already in the right place so we just release it.
    if (self.rowObject.changed == true) {
      // Update the fields in the dropped row.
      self.updateFields(droppedRow);

      // If a setting exists for affecting the entire group, update all the
      // fields in the entire dragged group.
      for (var group in self.tableSettings) {
        var rowSettings = self.rowSettings(group, droppedRow);
        if (rowSettings.relationship == 'group') {
          for (var n in self.rowObject.children) {
            self.updateField(self.rowObject.children[n], group);
          }
        }
      }

      self.rowObject.markChanged();
      if (self.changed == false) {
        $(Drupal.theme('tableDragChangedWarning')).insertBefore(self.table).hide().fadeIn('slow');
        self.changed = true;
      }
    }

    if (self.indentEnabled) {
      self.rowObject.removeIndentClasses();
    }
    if (self.oldRowElement) {
      $(self.oldRowElement).removeClass('drag-previous');
    }
    $(droppedRow).removeClass('drag').addClass('drag-previous');
    self.oldRowElement = droppedRow;
    self.onDrop();
    self.rowObject = null;
  }

  // Functionality specific only to mouseup event.
  if (self.dragObject != null) {
    $('.tabledrag-handle', droppedRow).removeClass('tabledrag-handle-hover');

    self.dragObject = null;
    $('body').removeClass('drag');
    clearInterval(self.scrollInterval);

    // Hack for IE6 that flickers uncontrollably if select lists are moved.
    if (navigator.userAgent.indexOf('MSIE 6.') != -1) {
      $('select', this.table).css('display', 'block');
    }
  }
};

/**
 * Get the mouse coordinates from the event (allowing for browser differences).
 */
Drupal.tableDrag.prototype.mouseCoords = function (event) {
  if (event.pageX || event.pageY) {
    return { x: event.pageX, y: event.pageY };
  }
  return {
    x: event.clientX + document.body.scrollLeft - document.body.clientLeft,
    y: event.clientY + document.body.scrollTop  - document.body.clientTop
  };
};

/**
 * Given a target element and a mouse event, get the mouse offset from that
 * element. To do this we need the element's position and the mouse position.
 */
Drupal.tableDrag.prototype.getMouseOffset = function (target, event) {
  var docPos   = $(target).offset();
  var mousePos = this.mouseCoords(event);
  return { x: mousePos.x - docPos.left, y: mousePos.y - docPos.top };
};

/**
 * Find the row the mouse is currently over. This row is then taken and swapped
 * with the one being dragged.
 *
 * @param x
 *   The x coordinate of the mouse on the page (not the screen).
 * @param y
 *   The y coordinate of the mouse on the page (not the screen).
 */
Drupal.tableDrag.prototype.findDropTargetRow = function (x, y) {
  var rows = $(this.table.tBodies[0].rows).not(':hidden');
  for (var n = 0; n < rows.length; n++) {
    var row = rows[n];
    var indentDiff = 0;
    var rowY = $(row).offset().top;
    // Because Safari does not report offsetHeight on table rows, but does on
    // table cells, grab the firstChild of the row and use that instead.
    // http://jacob.peargrove.com/blog/2006/technical/table-row-offsettop-bug-in-safari.
    if (row.offsetHeight == 0) {
      var rowHeight = parseInt(row.firstChild.offsetHeight, 10) / 2;
    }
    // Other browsers.
    else {
      var rowHeight = parseInt(row.offsetHeight, 10) / 2;
    }

    // Because we always insert before, we need to offset the height a bit.
    if ((y > (rowY - rowHeight)) && (y < (rowY + rowHeight))) {
      if (this.indentEnabled) {
        // Check that this row is not a child of the row being dragged.
        for (var n in this.rowObject.group) {
          if (this.rowObject.group[n] == row) {
            return null;
          }
        }
      }
      else {
        // Do not allow a row to be swapped with itself.
        if (row == this.rowObject.element) {
          return null;
        }
      }

      // Check that swapping with this row is allowed.
      if (!this.rowObject.isValidSwap(row)) {
        return null;
      }

      // We may have found the row the mouse just passed over, but it doesn't
      // take into account hidden rows. Skip backwards until we find a draggable
      // row.
      while ($(row).is(':hidden') && $(row).prev('tr').is(':hidden')) {
        row = $(row).prev('tr').get(0);
      }
      return row;
    }
  }
  return null;
};

/**
 * After the row is dropped, update the table fields according to the settings
 * set for this table.
 *
 * @param changedRow
 *   DOM object for the row that was just dropped.
 */
Drupal.tableDrag.prototype.updateFields = function (changedRow) {
  for (var group in this.tableSettings) {
    // Each group may have a different setting for relationship, so we find
    // the source rows for each separately.
    this.updateField(changedRow, group);
  }
};

/**
 * After the row is dropped, update a single table field according to specific
 * settings.
 *
 * @param changedRow
 *   DOM object for the row that was just dropped.
 * @param group
 *   The settings group on which field updates will occur.
 */
Drupal.tableDrag.prototype.updateField = function (changedRow, group) {
  var rowSettings = this.rowSettings(group, changedRow);

  // Set the row as its own target.
  if (rowSettings.relationship == 'self' || rowSettings.relationship == 'group') {
    var sourceRow = changedRow;
  }
  // Siblings are easy, check previous and next rows.
  else if (rowSettings.relationship == 'sibling') {
    var previousRow = $(changedRow).prev('tr').get(0);
    var nextRow = $(changedRow).next('tr').get(0);
    var sourceRow = changedRow;
    if ($(previousRow).is('.draggable') && $('.' + group, previousRow).length) {
      if (this.indentEnabled) {
        if ($('.indentations', previousRow).length == $('.indentations', changedRow)) {
          sourceRow = previousRow;
        }
      }
      else {
        sourceRow = previousRow;
      }
    }
    else if ($(nextRow).is('.draggable') && $('.' + group, nextRow).length) {
      if (this.indentEnabled) {
        if ($('.indentations', nextRow).length == $('.indentations', changedRow)) {
          sourceRow = nextRow;
        }
      }
      else {
        sourceRow = nextRow;
      }
    }
  }
  // Parents, look up the tree until we find a field not in this group.
  // Go up as many parents as indentations in the changed row.
  else if (rowSettings.relationship == 'parent') {
    var previousRow = $(changedRow).prev('tr');
    while (previousRow.length && $('.indentation', previousRow).length >= this.rowObject.indents) {
      previousRow = previousRow.prev('tr');
    }
    // If we found a row.
    if (previousRow.length) {
      sourceRow = previousRow[0];
    }
    // Otherwise we went all the way to the left of the table without finding
    // a parent, meaning this item has been placed at the root level.
    else {
      // Use the first row in the table as source, because it's guaranteed to
      // be at the root level. Find the first item, then compare this row
      // against it as a sibling.
      sourceRow = $(this.table).find('tr.draggable:first').get(0);
      if (sourceRow == this.rowObject.element) {
        sourceRow = $(this.rowObject.group[this.rowObject.group.length - 1]).next('tr.draggable').get(0);
      }
      var useSibling = true;
    }
  }

  // Because we may have moved the row from one category to another,
  // take a look at our sibling and borrow its sources and targets.
  this.copyDragClasses(sourceRow, changedRow, group);
  rowSettings = this.rowSettings(group, changedRow);

  // In the case that we're looking for a parent, but the row is at the top
  // of the tree, copy our sibling's values.
  if (useSibling) {
    rowSettings.relationship = 'sibling';
    rowSettings.source = rowSettings.target;
  }

  var targetClass = '.' + rowSettings.target;
  var targetElement = $(targetClass, changedRow).get(0);

  // Check if a target element exists in this row.
  if (targetElement) {
    var sourceClass = '.' + rowSettings.source;
    var sourceElement = $(sourceClass, sourceRow).get(0);
    switch (rowSettings.action) {
      case 'depth':
        // Get the depth of the target row.
        targetElement.value = $('.indentation', $(sourceElement).closest('tr')).length;
        break;
      case 'match':
        // Update the value.
        targetElement.value = sourceElement.value;
        break;
      case 'order':
        var siblings = this.rowObject.findSiblings(rowSettings);
        if ($(targetElement).is('select')) {
          // Get a list of acceptable values.
          var values = [];
          $('option', targetElement).each(function () {
            values.push(this.value);
          });
          var maxVal = values[values.length - 1];
          // Populate the values in the siblings.
          $(targetClass, siblings).each(function () {
            // If there are more items than possible values, assign the maximum value to the row.
            if (values.length > 0) {
              this.value = values.shift();
            }
            else {
              this.value = maxVal;
            }
          });
        }
        else {
          // Assume a numeric input field.
          var weight = parseInt($(targetClass, siblings[0]).val(), 10) || 0;
          $(targetClass, siblings).each(function () {
            this.value = weight;
            weight++;
          });
        }
        break;
    }
  }
};

/**
 * Copy all special tableDrag classes from one row's form elements to a
 * different one, removing any special classes that the destination row
 * may have had.
 */
Drupal.tableDrag.prototype.copyDragClasses = function (sourceRow, targetRow, group) {
  var sourceElement = $('.' + group, sourceRow);
  var targetElement = $('.' + group, targetRow);
  if (sourceElement.length && targetElement.length) {
    targetElement[0].className = sourceElement[0].className;
  }
};

Drupal.tableDrag.prototype.checkScroll = function (cursorY) {
  var de  = document.documentElement;
  var b  = document.body;

  var windowHeight = this.windowHeight = window.innerHeight || (de.clientHeight && de.clientWidth != 0 ? de.clientHeight : b.offsetHeight);
  var scrollY = this.scrollY = (document.all ? (!de.scrollTop ? b.scrollTop : de.scrollTop) : (window.pageYOffset ? window.pageYOffset : window.scrollY));
  var trigger = this.scrollSettings.trigger;
  var delta = 0;

  // Return a scroll speed relative to the edge of the screen.
  if (cursorY - scrollY > windowHeight - trigger) {
    delta = trigger / (windowHeight + scrollY - cursorY);
    delta = (delta > 0 && delta < trigger) ? delta : trigger;
    return delta * this.scrollSettings.amount;
  }
  else if (cursorY - scrollY < trigger) {
    delta = trigger / (cursorY - scrollY);
    delta = (delta > 0 && delta < trigger) ? delta : trigger;
    return -delta * this.scrollSettings.amount;
  }
};

Drupal.tableDrag.prototype.setScroll = function (scrollAmount) {
  var self = this;

  this.scrollInterval = setInterval(function () {
    // Update the scroll values stored in the object.
    self.checkScroll(self.currentMouseCoords.y);
    var aboveTable = self.scrollY > self.table.topY;
    var belowTable = self.scrollY + self.windowHeight < self.table.bottomY;
    if (scrollAmount > 0 && belowTable || scrollAmount < 0 && aboveTable) {
      window.scrollBy(0, scrollAmount);
    }
  }, this.scrollSettings.interval);
};

Drupal.tableDrag.prototype.restripeTable = function () {
  // :even and :odd are reversed because jQuery counts from 0 and
  // we count from 1, so we're out of sync.
  // Match immediate children of the parent element to allow nesting.
  $('> tbody > tr.draggable:visible, > tr.draggable:visible', this.table)
    .removeClass('odd even')
    .filter(':odd').addClass('even').end()
    .filter(':even').addClass('odd');
};

/**
 * Stub function. Allows a custom handler when a row begins dragging.
 */
Drupal.tableDrag.prototype.onDrag = function () {
  return null;
};

/**
 * Stub function. Allows a custom handler when a row is dropped.
 */
Drupal.tableDrag.prototype.onDrop = function () {
  return null;
};

/**
 * Constructor to make a new object to manipulate a table row.
 *
 * @param tableRow
 *   The DOM element for the table row we will be manipulating.
 * @param method
 *   The method in which this row is being moved. Either 'keyboard' or 'mouse'.
 * @param indentEnabled
 *   Whether the containing table uses indentations. Used for optimizations.
 * @param maxDepth
 *   The maximum amount of indentations this row may contain.
 * @param addClasses
 *   Whether we want to add classes to this row to indicate child relationships.
 */
Drupal.tableDrag.prototype.row = function (tableRow, method, indentEnabled, maxDepth, addClasses) {
  this.element = tableRow;
  this.method = method;
  this.group = [tableRow];
  this.groupDepth = $('.indentation', tableRow).length;
  this.changed = false;
  this.table = $(tableRow).closest('table').get(0);
  this.indentEnabled = indentEnabled;
  this.maxDepth = maxDepth;
  this.direction = ''; // Direction the row is being moved.

  if (this.indentEnabled) {
    this.indents = $('.indentation', tableRow).length;
    this.children = this.findChildren(addClasses);
    this.group = $.merge(this.group, this.children);
    // Find the depth of this entire group.
    for (var n = 0; n < this.group.length; n++) {
      this.groupDepth = Math.max($('.indentation', this.group[n]).length, this.groupDepth);
    }
  }
};

/**
 * Find all children of rowObject by indentation.
 *
 * @param addClasses
 *   Whether we want to add classes to this row to indicate child relationships.
 */
Drupal.tableDrag.prototype.row.prototype.findChildren = function (addClasses) {
  var parentIndentation = this.indents;
  var currentRow = $(this.element, this.table).next('tr.draggable');
  var rows = [];
  var child = 0;
  while (currentRow.length) {
    var rowIndentation = $('.indentation', currentRow).length;
    // A greater indentation indicates this is a child.
    if (rowIndentation > parentIndentation) {
      child++;
      rows.push(currentRow[0]);
      if (addClasses) {
        $('.indentation', currentRow).each(function (indentNum) {
          if (child == 1 && (indentNum == parentIndentation)) {
            $(this).addClass('tree-child-first');
          }
          if (indentNum == parentIndentation) {
            $(this).addClass('tree-child');
          }
          else if (indentNum > parentIndentation) {
            $(this).addClass('tree-child-horizontal');
          }
        });
      }
    }
    else {
      break;
    }
    currentRow = currentRow.next('tr.draggable');
  }
  if (addClasses && rows.length) {
    $('.indentation:nth-child(' + (parentIndentation + 1) + ')', rows[rows.length - 1]).addClass('tree-child-last');
  }
  return rows;
};

/**
 * Ensure that two rows are allowed to be swapped.
 *
 * @param row
 *   DOM object for the row being considered for swapping.
 */
Drupal.tableDrag.prototype.row.prototype.isValidSwap = function (row) {
  if (this.indentEnabled) {
    var prevRow, nextRow;
    if (this.direction == 'down') {
      prevRow = row;
      nextRow = $(row).next('tr').get(0);
    }
    else {
      prevRow = $(row).prev('tr').get(0);
      nextRow = row;
    }
    this.interval = this.validIndentInterval(prevRow, nextRow);

    // We have an invalid swap if the valid indentations interval is empty.
    if (this.interval.min > this.interval.max) {
      return false;
    }
  }

  // Do not let an un-draggable first row have anything put before it.
  if (this.table.tBodies[0].rows[0] == row && $(row).is(':not(.draggable)')) {
    return false;
  }

  return true;
};

/**
 * Perform the swap between two rows.
 *
 * @param position
 *   Whether the swap will occur 'before' or 'after' the given row.
 * @param row
 *   DOM element what will be swapped with the row group.
 */
Drupal.tableDrag.prototype.row.prototype.swap = function (position, row) {
  Drupal.detachBehaviors(this.group, Drupal.settings, 'move');
  $(row)[position](this.group);
  Drupal.attachBehaviors(this.group, Drupal.settings);
  this.changed = true;
  this.onSwap(row);
};

/**
 * Determine the valid indentations interval for the row at a given position
 * in the table.
 *
 * @param prevRow
 *   DOM object for the row before the tested position
 *   (or null for first position in the table).
 * @param nextRow
 *   DOM object for the row after the tested position
 *   (or null for last position in the table).
 */
Drupal.tableDrag.prototype.row.prototype.validIndentInterval = function (prevRow, nextRow) {
  var minIndent, maxIndent;

  // Minimum indentation:
  // Do not orphan the next row.
  minIndent = nextRow ? $('.indentation', nextRow).length : 0;

  // Maximum indentation:
  if (!prevRow || $(prevRow).is(':not(.draggable)') || $(this.element).is('.tabledrag-root')) {
    // Do not indent:
    // - the first row in the table,
    // - rows dragged below a non-draggable row,
    // - 'root' rows.
    maxIndent = 0;
  }
  else {
    // Do not go deeper than as a child of the previous row.
    maxIndent = $('.indentation', prevRow).length + ($(prevRow).is('.tabledrag-leaf') ? 0 : 1);
    // Limit by the maximum allowed depth for the table.
    if (this.maxDepth) {
      maxIndent = Math.min(maxIndent, this.maxDepth - (this.groupDepth - this.indents));
    }
  }

  return { 'min': minIndent, 'max': maxIndent };
};

/**
 * Indent a row within the legal bounds of the table.
 *
 * @param indentDiff
 *   The number of additional indentations proposed for the row (can be
 *   positive or negative). This number will be adjusted to nearest valid
 *   indentation level for the row.
 */
Drupal.tableDrag.prototype.row.prototype.indent = function (indentDiff) {
  // Determine the valid indentations interval if not available yet.
  if (!this.interval) {
    var prevRow = $(this.element).prev('tr').get(0);
    var nextRow = $(this.group).filter(':last').next('tr').get(0);
    this.interval = this.validIndentInterval(prevRow, nextRow);
  }

  // Adjust to the nearest valid indentation.
  var indent = this.indents + indentDiff;
  indent = Math.max(indent, this.interval.min);
  indent = Math.min(indent, this.interval.max);
  indentDiff = indent - this.indents;

  for (var n = 1; n <= Math.abs(indentDiff); n++) {
    // Add or remove indentations.
    if (indentDiff < 0) {
      $('.indentation:first', this.group).remove();
      this.indents--;
    }
    else {
      $('td:first', this.group).prepend(Drupal.theme('tableDragIndentation'));
      this.indents++;
    }
  }
  if (indentDiff) {
    // Update indentation for this row.
    this.changed = true;
    this.groupDepth += indentDiff;
    this.onIndent();
  }

  return indentDiff;
};

/**
 * Find all siblings for a row, either according to its subgroup or indentation.
 * Note that the passed-in row is included in the list of siblings.
 *
 * @param settings
 *   The field settings we're using to identify what constitutes a sibling.
 */
Drupal.tableDrag.prototype.row.prototype.findSiblings = function (rowSettings) {
  var siblings = [];
  var directions = ['prev', 'next'];
  var rowIndentation = this.indents;
  for (var d = 0; d < directions.length; d++) {
    var checkRow = $(this.element)[directions[d]]();
    while (checkRow.length) {
      // Check that the sibling contains a similar target field.
      if ($('.' + rowSettings.target, checkRow)) {
        // Either add immediately if this is a flat table, or check to ensure
        // that this row has the same level of indentation.
        if (this.indentEnabled) {
          var checkRowIndentation = $('.indentation', checkRow).length;
        }

        if (!(this.indentEnabled) || (checkRowIndentation == rowIndentation)) {
          siblings.push(checkRow[0]);
        }
        else if (checkRowIndentation < rowIndentation) {
          // No need to keep looking for siblings when we get to a parent.
          break;
        }
      }
      else {
        break;
      }
      checkRow = $(checkRow)[directions[d]]();
    }
    // Since siblings are added in reverse order for previous, reverse the
    // completed list of previous siblings. Add the current row and continue.
    if (directions[d] == 'prev') {
      siblings.reverse();
      siblings.push(this.element);
    }
  }
  return siblings;
};

/**
 * Remove indentation helper classes from the current row group.
 */
Drupal.tableDrag.prototype.row.prototype.removeIndentClasses = function () {
  for (var n in this.children) {
    $('.indentation', this.children[n])
      .removeClass('tree-child')
      .removeClass('tree-child-first')
      .removeClass('tree-child-last')
      .removeClass('tree-child-horizontal');
  }
};

/**
 * Add an asterisk or other marker to the changed row.
 */
Drupal.tableDrag.prototype.row.prototype.markChanged = function () {
  var marker = Drupal.theme('tableDragChangedMarker');
  var cell = $('td:first', this.element);
  if ($('span.tabledrag-changed', cell).length == 0) {
    cell.append(marker);
  }
};

/**
 * Stub function. Allows a custom handler when a row is indented.
 */
Drupal.tableDrag.prototype.row.prototype.onIndent = function () {
  return null;
};

/**
 * Stub function. Allows a custom handler when a row is swapped.
 */
Drupal.tableDrag.prototype.row.prototype.onSwap = function (swappedRow) {
  return null;
};

Drupal.theme.prototype.tableDragChangedMarker = function () {
  return '<span class="warning tabledrag-changed">*</span>';
};

Drupal.theme.prototype.tableDragIndentation = function () {
  return '<div class="indentation">&nbsp;</div>';
};

Drupal.theme.prototype.tableDragChangedWarning = function () {
  return '<div class="tabledrag-changed-warning messages warning">' + Drupal.theme('tableDragChangedMarker') + ' ' + Drupal.t('Changes made in this table will not be saved until the form is submitted.') + '</div>';
};

})(jQuery);

(function ($) {

/**
 * Attaches sticky table headers.
 */
Drupal.behaviors.tableHeader = {
  attach: function (context, settings) {
    if (!$.support.positionFixed) {
      return;
    }

    $('table.sticky-enabled', context).once('tableheader', function () {
      $(this).data("drupal-tableheader", new Drupal.tableHeader(this));
    });
  }
};

/**
 * Constructor for the tableHeader object. Provides sticky table headers.
 *
 * @param table
 *   DOM object for the table to add a sticky header to.
 */
Drupal.tableHeader = function (table) {
  var self = this;

  this.originalTable = $(table);
  this.originalHeader = $(table).children('thead');
  this.originalHeaderCells = this.originalHeader.find('> tr > th');
  this.displayWeight = null;

  // React to columns change to avoid making checks in the scroll callback.
  this.originalTable.bind('columnschange', function (e, display) {
    // This will force header size to be calculated on scroll.
    self.widthCalculated = (self.displayWeight !== null && self.displayWeight === display);
    self.displayWeight = display;
  });

  // Clone the table header so it inherits original jQuery properties. Hide
  // the table to avoid a flash of the header clone upon page load.
  this.stickyTable = $('<table class="sticky-header"/>')
    .insertBefore(this.originalTable)
    .css({ position: 'fixed', top: '0px' });
  this.stickyHeader = this.originalHeader.clone(true)
    .hide()
    .appendTo(this.stickyTable);
  this.stickyHeaderCells = this.stickyHeader.find('> tr > th');

  this.originalTable.addClass('sticky-table');
  $(window)
    .bind('scroll.drupal-tableheader', $.proxy(this, 'eventhandlerRecalculateStickyHeader'))
    .bind('resize.drupal-tableheader', { calculateWidth: true }, $.proxy(this, 'eventhandlerRecalculateStickyHeader'))
    // Make sure the anchor being scrolled into view is not hidden beneath the
    // sticky table header. Adjust the scrollTop if it does.
    .bind('drupalDisplaceAnchor.drupal-tableheader', function () {
      window.scrollBy(0, -self.stickyTable.outerHeight());
    })
    // Make sure the element being focused is not hidden beneath the sticky
    // table header. Adjust the scrollTop if it does.
    .bind('drupalDisplaceFocus.drupal-tableheader', function (event) {
      if (self.stickyVisible && event.clientY < (self.stickyOffsetTop + self.stickyTable.outerHeight()) && event.$target.closest('sticky-header').length === 0) {
        window.scrollBy(0, -self.stickyTable.outerHeight());
      }
    })
    .triggerHandler('resize.drupal-tableheader');

  // We hid the header to avoid it showing up erroneously on page load;
  // we need to unhide it now so that it will show up when expected.
  this.stickyHeader.show();
};

/**
 * Event handler: recalculates position of the sticky table header.
 *
 * @param event
 *   Event being triggered.
 */
Drupal.tableHeader.prototype.eventhandlerRecalculateStickyHeader = function (event) {
  var self = this;
  var calculateWidth = event.data && event.data.calculateWidth;

  // Reset top position of sticky table headers to the current top offset.
  this.stickyOffsetTop = Drupal.settings.tableHeaderOffset ? eval(Drupal.settings.tableHeaderOffset + '()') : 0;
  this.stickyTable.css('top', this.stickyOffsetTop + 'px');

  // Save positioning data.
  var viewHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
  if (calculateWidth || this.viewHeight !== viewHeight) {
    this.viewHeight = viewHeight;
    this.vPosition = this.originalTable.offset().top - 4 - this.stickyOffsetTop;
    this.hPosition = this.originalTable.offset().left;
    this.vLength = this.originalTable[0].clientHeight - 100;
    calculateWidth = true;
  }

  // Track horizontal positioning relative to the viewport and set visibility.
  var hScroll = document.documentElement.scrollLeft || document.body.scrollLeft;
  var vOffset = (document.documentElement.scrollTop || document.body.scrollTop) - this.vPosition;
  this.stickyVisible = vOffset > 0 && vOffset < this.vLength;
  this.stickyTable.css({ left: (-hScroll + this.hPosition) + 'px', visibility: this.stickyVisible ? 'visible' : 'hidden' });

  // Only perform expensive calculations if the sticky header is actually
  // visible or when forced.
  if (this.stickyVisible && (calculateWidth || !this.widthCalculated)) {
    this.widthCalculated = true;
    var $that = null;
    var $stickyCell = null;
    var display = null;
    var cellWidth = null;
    // Resize header and its cell widths.
    // Only apply width to visible table cells. This prevents the header from
    // displaying incorrectly when the sticky header is no longer visible.
    for (var i = 0, il = this.originalHeaderCells.length; i < il; i += 1) {
      $that = $(this.originalHeaderCells[i]);
      $stickyCell = this.stickyHeaderCells.eq($that.index());
      display = $that.css('display');
      if (display !== 'none') {
        cellWidth = $that.css('width');
        // Exception for IE7.
        if (cellWidth === 'auto') {
          cellWidth = $that[0].clientWidth + 'px';
        }
        $stickyCell.css({'width': cellWidth, 'display': display});
      }
      else {
        $stickyCell.css('display', 'none');
      }
    }
    this.stickyTable.css('width', this.originalTable.outerWidth());
  }
};

})(jQuery);

(function ($) {

Drupal.behaviors.tableSelect = {
  attach: function (context, settings) {
    // Select the inner-most table in case of nested tables.
    $('th.select-all', context).closest('table').once('table-select', Drupal.tableSelect);
  }
};

Drupal.tableSelect = function () {
  // Do not add a "Select all" checkbox if there are no rows with checkboxes in the table
  if ($('td input:checkbox', this).length == 0) {
    return;
  }

  // Keep track of the table, which checkbox is checked and alias the settings.
  var table = this, checkboxes, lastChecked;
  var strings = { 'selectAll': Drupal.t('Select all rows in this table'), 'selectNone': Drupal.t('Deselect all rows in this table') };
  var updateSelectAll = function (state) {
    // Update table's select-all checkbox (and sticky header's if available).
    $(table).prev('table.sticky-header').andSelf().find('th.select-all input:checkbox').each(function() {
      $(this).attr('title', state ? strings.selectNone : strings.selectAll);
      this.checked = state;
    });
  };

  // Find all <th> with class select-all, and insert the check all checkbox.
  $('th.select-all', table).prepend($('<input type="checkbox" class="form-checkbox" />').attr('title', strings.selectAll)).click(function (event) {
    if ($(event.target).is('input:checkbox')) {
      // Loop through all checkboxes and set their state to the select all checkbox' state.
      checkboxes.each(function () {
        this.checked = event.target.checked;
        // Either add or remove the selected class based on the state of the check all checkbox.
        $(this).closest('tr').toggleClass('selected', this.checked);
      });
      // Update the title and the state of the check all box.
      updateSelectAll(event.target.checked);
    }
  });

  // For each of the checkboxes within the table that are not disabled.
  checkboxes = $('td input:checkbox:enabled', table).click(function (e) {
    // Either add or remove the selected class based on the state of the check all checkbox.
    $(this).closest('tr').toggleClass('selected', this.checked);

    // If this is a shift click, we need to highlight everything in the range.
    // Also make sure that we are actually checking checkboxes over a range and
    // that a checkbox has been checked or unchecked before.
    if (e.shiftKey && lastChecked && lastChecked != e.target) {
      // We use the checkbox's parent TR to do our range searching.
      Drupal.tableSelectRange($(e.target).closest('tr')[0], $(lastChecked).closest('tr')[0], e.target.checked);
    }

    // If all checkboxes are checked, make sure the select-all one is checked too, otherwise keep unchecked.
    updateSelectAll((checkboxes.length == $(checkboxes).filter(':checked').length));

    // Keep track of the last checked checkbox.
    lastChecked = e.target;
  });
};

Drupal.tableSelectRange = function (from, to, state) {
  // We determine the looping mode based on the the order of from and to.
  var mode = from.rowIndex > to.rowIndex ? 'previousSibling' : 'nextSibling';

  // Traverse through the sibling nodes.
  for (var i = from[mode]; i; i = i[mode]) {
    // Make sure that we're only dealing with elements.
    if (i.nodeType != 1) {
      continue;
    }

    // Either add or remove the selected class based on the state of the target checkbox.
    $(i).toggleClass('selected', state);
    $('input:checkbox', i).each(function () {
      this.checked = state;
    });

    if (to.nodeType) {
      // If we are at the end of the range, stop.
      if (i == to) {
        break;
      }
    }
    // A faster alternative to doing $(i).filter(to).length.
    else if ($.filter(to, [i]).r.length) {
      break;
    }
  }
};

})(jQuery);

(function ($) {

Drupal.behaviors.textarea = {
  attach: function (context, settings) {
    $('.form-textarea-wrapper.resizable', context).once('textarea', function () {
      var staticOffset = null;
      var textarea = $(this).addClass('resizable-textarea').find('textarea');
      var grippie = $('<div class="grippie"></div>').mousedown(startDrag);

      grippie.insertAfter(textarea);

      function startDrag(e) {
        staticOffset = textarea.height() - e.pageY;
        textarea.css('opacity', 0.25);
        $(document).mousemove(performDrag).mouseup(endDrag);
        return false;
      }

      function performDrag(e) {
        textarea.height(Math.max(32, staticOffset + e.pageY) + 'px');
        return false;
      }

      function endDrag(e) {
        $(document).unbind('mousemove', performDrag).unbind('mouseup', endDrag);
        textarea.css('opacity', 1);
      }
    });
  }
};

})(jQuery);

(function ($) {

/**
 * Set the client's system time zone as default values of form fields.
 */
Drupal.behaviors.setTimezone = {
  attach: function (context, settings) {
    $('select.timezone-detect', context).once('timezone', function () {
      var dateString = Date();
      // In some client environments, date strings include a time zone
      // abbreviation, between 3 and 5 letters enclosed in parentheses,
      // which can be interpreted by PHP.
      var matches = dateString.match(/\(([A-Z]{3,5})\)/);
      var abbreviation = matches ? matches[1] : 0;

      // For all other client environments, the abbreviation is set to "0"
      // and the current offset from UTC and daylight saving time status are
      // used to guess the time zone.
      var dateNow = new Date();
      var offsetNow = dateNow.getTimezoneOffset() * -60;

      // Use January 1 and July 1 as test dates for determining daylight
      // saving time status by comparing their offsets.
      var dateJan = new Date(dateNow.getFullYear(), 0, 1, 12, 0, 0, 0);
      var dateJul = new Date(dateNow.getFullYear(), 6, 1, 12, 0, 0, 0);
      var offsetJan = dateJan.getTimezoneOffset() * -60;
      var offsetJul = dateJul.getTimezoneOffset() * -60;

      var isDaylightSavingTime;
      // If the offset from UTC is identical on January 1 and July 1,
      // assume daylight saving time is not used in this time zone.
      if (offsetJan == offsetJul) {
        isDaylightSavingTime = '';
      }
      // If the maximum annual offset is equivalent to the current offset,
      // assume daylight saving time is in effect.
      else if (Math.max(offsetJan, offsetJul) == offsetNow) {
        isDaylightSavingTime = 1;
      }
      // Otherwise, assume daylight saving time is not in effect.
      else {
        isDaylightSavingTime = 0;
      }

      // Submit request to the system/timezone callback and set the form field
      // to the response time zone. The client date is passed to the callback
      // for debugging purposes. Submit a synchronous request to avoid database
      // errors associated with concurrent requests during install.
      var path = 'system/timezone/' + abbreviation + '/' + offsetNow + '/' + isDaylightSavingTime;
      var element = this;
      $.ajax({
        async: false,
        url: settings.basePath,
        data: { q: path, date: dateString },
        dataType: 'json',
        success: function (data) {
          if (data) {
            $(element).val(data);
          }
        }
      });
    });
  }
};

})(jQuery);


(function ($) {

/**
 * This script transforms a set of fieldsets into a stack of vertical
 * tabs. Another tab pane can be selected by clicking on the respective
 * tab.
 *
 * Each tab may have a summary which can be updated by another
 * script. For that to work, each fieldset has an associated
 * 'verticalTabCallback' (with jQuery.data() attached to the fieldset),
 * which is called every time the user performs an update to a form
 * element inside the tab pane.
 */
Drupal.behaviors.verticalTabs = {
  attach: function (context) {
    $('.vertical-tabs-panes', context).once('vertical-tabs', function () {
      var focusID = $(':hidden.vertical-tabs-active-tab', this).val();
      var tab_focus;

      // Check if there are some fieldsets that can be converted to vertical-tabs
      var $fieldsets = $('> fieldset', this);
      if ($fieldsets.length == 0) {
        return;
      }

      // Create the tab column.
      var tab_list = $('<ul class="vertical-tabs-list"></ul>');
      $(this).wrap('<div class="vertical-tabs clearfix"></div>').before(tab_list);

      // Transform each fieldset into a tab.
      $fieldsets.each(function () {
        var vertical_tab = new Drupal.verticalTab({
          title: $('> legend', this).text(),
          fieldset: $(this)
        });
        tab_list.append(vertical_tab.item);
        $(this)
          .removeClass('collapsible collapsed')
          .addClass('vertical-tabs-pane')
          .data('verticalTab', vertical_tab);
        if (this.id == focusID) {
          tab_focus = $(this);
        }
      });

      $('> li:first', tab_list).addClass('first');
      $('> li:last', tab_list).addClass('last');

      if (!tab_focus) {
        // If the current URL has a fragment and one of the tabs contains an
        // element that matches the URL fragment, activate that tab.
        if (window.location.hash && $(this).find(window.location.hash).length) {
          tab_focus = $(this).find(window.location.hash).closest('.vertical-tabs-pane');
        }
        else {
          tab_focus = $('> .vertical-tabs-pane:first', this);
        }
      }
      if (tab_focus.length) {
        tab_focus.data('verticalTab').focus();
      }
    });
  }
};

/**
 * The vertical tab object represents a single tab within a tab group.
 *
 * @param settings
 *   An object with the following keys:
 *   - title: The name of the tab.
 *   - fieldset: The jQuery object of the fieldset that is the tab pane.
 */
Drupal.verticalTab = function (settings) {
  var self = this;
  $.extend(this, settings, Drupal.theme('verticalTab', settings));

  this.link.click(function () {
    self.focus();
    return false;
  });

  // Keyboard events added:
  // Pressing the Enter key will open the tab pane.
  this.link.keydown(function(event) {
    if (event.keyCode == 13) {
      self.focus();
      // Set focus on the first input field of the visible fieldset/tab pane.
      $("fieldset.vertical-tabs-pane :input:visible:enabled:first").focus();
      return false;
    }
  });

  this.fieldset
    .bind('summaryUpdated', function () {
      self.updateSummary();
    })
    .trigger('summaryUpdated');
};

Drupal.verticalTab.prototype = {
  /**
   * Displays the tab's content pane.
   */
  focus: function () {
    this.fieldset
      .siblings('fieldset.vertical-tabs-pane')
        .each(function () {
          var tab = $(this).data('verticalTab');
          tab.fieldset.hide();
          tab.item.removeClass('selected');
        })
        .end()
      .show()
      .siblings(':hidden.vertical-tabs-active-tab')
        .val(this.fieldset.attr('id'));
    this.item.addClass('selected');
    // Mark the active tab for screen readers.
    $('#active-vertical-tab').remove();
    this.link.append('<span id="active-vertical-tab" class="element-invisible">' + Drupal.t('(active tab)') + '</span>');
  },

  /**
   * Updates the tab's summary.
   */
  updateSummary: function () {
    this.summary.html(this.fieldset.drupalGetSummary());
  },

  /**
   * Shows a vertical tab pane.
   */
  tabShow: function () {
    // Display the tab.
    this.item.show();
    // Update .first marker for items. We need recurse from parent to retain the
    // actual DOM element order as jQuery implements sortOrder, but not as public
    // method.
    this.item.parent().children('.vertical-tab-button').removeClass('first')
      .filter(':visible:first').addClass('first');
    // Display the fieldset.
    this.fieldset.removeClass('vertical-tab-hidden').show();
    // Focus this tab.
    this.focus();
    return this;
  },

  /**
   * Hides a vertical tab pane.
   */
  tabHide: function () {
    // Hide this tab.
    this.item.hide();
    // Update .first marker for items. We need recurse from parent to retain the
    // actual DOM element order as jQuery implements sortOrder, but not as public
    // method.
    this.item.parent().children('.vertical-tab-button').removeClass('first')
      .filter(':visible:first').addClass('first');
    // Hide the fieldset.
    this.fieldset.addClass('vertical-tab-hidden').hide();
    // Focus the first visible tab (if there is one).
    var $firstTab = this.fieldset.siblings('.vertical-tabs-pane:not(.vertical-tab-hidden):first');
    if ($firstTab.length) {
      $firstTab.data('verticalTab').focus();
    }
    return this;
  }
};

/**
 * Theme function for a vertical tab.
 *
 * @param settings
 *   An object with the following keys:
 *   - title: The name of the tab.
 * @return
 *   This function has to return an object with at least these keys:
 *   - item: The root tab jQuery element
 *   - link: The anchor tag that acts as the clickable area of the tab
 *       (jQuery version)
 *   - summary: The jQuery element that contains the tab summary
 */
Drupal.theme.prototype.verticalTab = function (settings) {
  var tab = {};
  tab.item = $('<li class="vertical-tab-button" tabindex="-1"></li>')
    .append(tab.link = $('<a href="#"></a>')
      .append(tab.title = $('<strong></strong>').text(settings.title))
      .append(tab.summary = $('<span class="summary"></span>')
    )
  );
  return tab;
};

})(jQuery);

/**
 * Demo Settings for eu_cookie_compliance Drupal module
 * @param  {[type]} $ [description]
 * @return {[type]}   [description]
 */
(function($) {
  'use strict';

  $.extend(Drupal.settings, {
    eu_cookie_compliance: {
      popup_enabled: 1,
      popup_agreed_enabled: 0,
      popup_hide_agreed: 0,
      popup_clicking_confirmation: 0,
      popup_html_info: '<div>\n  <div class ="popup-content info">\n    <div id="popup-text">\n      <div class="cookie-opt-in"><a class="btn-close" href="javascript:void(0);" id="no-thankx">sluiten</a>\n<p>Aegon maakt gebruik van cookies voor een goede werking van de site, voor <strong>tracking</strong> en voor het bijhouden van de <strong>statistieken</strong>. Gaat u verder op de site? Dan stemt u er in toe dat wij cookies voor plaatsen. Wilt u niet alle cookies accepteren, wijzig dan uw keuze via <a class="find-more-button" href="javascript:void(0);">instellingen</a>. Voor meer informatie verwijzen wij u naar het <a href="/overaegon/privacy/">privacy en cookiebestand</a>.</p>\n</div>\n<div id="popup-wrapper" style="position: fixed;top: -9999px;"> </div>\n    </div>\n    <div id="popup-buttons">\n      <button type="button" class="agree-button">cookies toestaan</button>\n      <button type="button" class="find-more-button">instellingen</button>\n    </div>\n  </div>\n</div>\n',
      popup_height: "auto",
      popup_width: "100%",
      popup_delay: 1e3,
      popup_link: "/aegon.nl/privacy.html",
      popup_link_new_window: 1,
      popup_position: 1,
      popup_language: "en",
      domain: "aegon.loc"
    }
  });

})(jQuery);

/*!
 * jQuery Browser Plugin 0.0.7
 * https://github.com/gabceb/jquery-browser-plugin
 *
 * Original jquery-browser code Copyright 2005, 2015 jQuery Foundation, Inc. and other contributors
 * http://jquery.org/license
 *
 * Modifications Copyright 2015 Gabriel Cebrian
 * https://github.com/gabceb
 *
 * Released under the MIT license
 *
 * Date: 19-05-2015
 */
/*global window: false */

(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery'], function($) {
      factory($);
    });
  } else if (typeof module === 'object' && typeof module.exports === 'object') {
    // Node-like environment
    module.exports = factory(require('jquery'));
  } else {
    // Browser globals
    factory(window.jQuery);
  }
}(function(jQuery) {
  "use strict";

  function uaMatch( ua ) {
    // If an UA is not provided, default to the current browser UA.
    if ( ua === undefined ) {
      ua = window.navigator.userAgent;
    }
    ua = ua.toLowerCase();

    var match = /(edge)\/([\w.]+)/.exec( ua ) ||
        /(opr)[\/]([\w.]+)/.exec( ua ) ||
        /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
        /(version)(applewebkit)[ \/]([\w.]+).*(safari)[ \/]([\w.]+)/.exec( ua ) ||
        /(webkit)[ \/]([\w.]+).*(version)[ \/]([\w.]+).*(safari)[ \/]([\w.]+)/.exec( ua ) ||
        /(webkit)[ \/]([\w.]+)/.exec( ua ) ||
        /(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
        /(msie) ([\w.]+)/.exec( ua ) ||
        ua.indexOf("trident") >= 0 && /(rv)(?::| )([\w.]+)/.exec( ua ) ||
        ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
        [];

    var platform_match = /(ipad)/.exec( ua ) ||
        /(ipod)/.exec( ua ) ||
        /(iphone)/.exec( ua ) ||
        /(kindle)/.exec( ua ) ||
        /(silk)/.exec( ua ) ||
        /(android)/.exec( ua ) ||
        /(windows phone)/.exec( ua ) ||
        /(win)/.exec( ua ) ||
        /(mac)/.exec( ua ) ||
        /(linux)/.exec( ua ) ||
        /(cros)/.exec( ua ) ||
        /(playbook)/.exec( ua ) ||
        /(bb)/.exec( ua ) ||
        /(blackberry)/.exec( ua ) ||
        [];

    var browser = {},
        matched = {
          browser: match[ 5 ] || match[ 3 ] || match[ 1 ] || "",
          version: match[ 2 ] || match[ 4 ] || "0",
          versionNumber: match[ 4 ] || match[ 2 ] || "0",
          platform: platform_match[ 0 ] || ""
        };

    if ( matched.browser ) {
      browser[ matched.browser ] = true;
      browser.version = matched.version;
      browser.versionNumber = parseInt(matched.versionNumber, 10);
    }

    if ( matched.platform ) {
      browser[ matched.platform ] = true;
    }

    // These are all considered mobile platforms, meaning they run a mobile browser
    if ( browser.android || browser.bb || browser.blackberry || browser.ipad || browser.iphone ||
      browser.ipod || browser.kindle || browser.playbook || browser.silk || browser[ "windows phone" ]) {
      browser.mobile = true;
    }

    // These are all considered desktop platforms, meaning they run a desktop browser
    if ( browser.cros || browser.mac || browser.linux || browser.win ) {
      browser.desktop = true;
    }

    // Chrome, Opera 15+ and Safari are webkit based browsers
    if ( browser.chrome || browser.opr || browser.safari ) {
      browser.webkit = true;
    }

    // IE11 has a new token so we will assign it msie to avoid breaking changes
    // IE12 disguises itself as Chrome, but adds a new Edge token.
    if ( browser.rv || browser.edge ) {
      var ie = "msie";

      matched.browser = ie;
      browser[ie] = true;
    }

    // Blackberry browsers are marked as Safari on BlackBerry
    if ( browser.safari && browser.blackberry ) {
      var blackberry = "blackberry";

      matched.browser = blackberry;
      browser[blackberry] = true;
    }

    // Playbook browsers are marked as Safari on Playbook
    if ( browser.safari && browser.playbook ) {
      var playbook = "playbook";

      matched.browser = playbook;
      browser[playbook] = true;
    }

    // BB10 is a newer OS version of BlackBerry
    if ( browser.bb ) {
      var bb = "blackberry";

      matched.browser = bb;
      browser[bb] = true;
    }

    // Opera 15+ are identified as opr
    if ( browser.opr ) {
      var opera = "opera";

      matched.browser = opera;
      browser[opera] = true;
    }

    // Stock Android browsers are marked as Safari on Android.
    if ( browser.safari && browser.android ) {
      var android = "android";

      matched.browser = android;
      browser[android] = true;
    }

    // Kindle browsers are marked as Safari on Kindle
    if ( browser.safari && browser.kindle ) {
      var kindle = "kindle";

      matched.browser = kindle;
      browser[kindle] = true;
    }

     // Kindle Silk browsers are marked as Safari on Kindle
    if ( browser.safari && browser.silk ) {
      var silk = "silk";

      matched.browser = silk;
      browser[silk] = true;
    }

    // Assign the name and platform variable
    browser.name = matched.browser;
    browser.platform = matched.platform;
    return browser;
  }

  // Run the matching process, also assign the function to the returned object
  // for manual, jQuery-free use if desired
  window.jQBrowser = uaMatch( window.navigator.userAgent );
  window.jQBrowser.uaMatch = uaMatch;

  // Only assign to jQuery.browser if jQuery is loaded
  if ( jQuery ) {
    jQuery.browser = window.jQBrowser;
  }

  return window.jQBrowser;
}));

/*!
 * jQuery Cookie Plugin v1.4.1
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2006, 2014 Klaus Hartl
 * Released under the MIT license
 */
(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD (Register as an anonymous module)
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    // Node/CommonJS
    module.exports = factory(require('jquery'));
  } else {
    // Browser globals
    factory(jQuery);
  }
}(function ($) {

  var pluses = /\+/g;

  function encode(s) {
    return config.raw ? s : encodeURIComponent(s);
  }

  function decode(s) {
    return config.raw ? s : decodeURIComponent(s);
  }

  function stringifyCookieValue(value) {
    return encode(config.json ? JSON.stringify(value) : String(value));
  }

  function parseCookieValue(s) {
    if (s.indexOf('"') === 0) {
      // This is a quoted cookie as according to RFC2068, unescape...
      s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
    }

    try {
      // Replace server-side written pluses with spaces.
      // If we can't decode the cookie, ignore it, it's unusable.
      // If we can't parse the cookie, ignore it, it's unusable.
      s = decodeURIComponent(s.replace(pluses, ' '));
      return config.json ? JSON.parse(s) : s;
    } catch(e) {}
  }

  function read(s, converter) {
    var value = config.raw ? s : parseCookieValue(s);
    return $.isFunction(converter) ? converter(value) : value;
  }

  var config = $.cookie = function (key, value, options) {

    // Write

    if (arguments.length > 1 && !$.isFunction(value)) {
      options = $.extend({}, config.defaults, options);

      if (typeof options.expires === 'number') {
        var days = options.expires, t = options.expires = new Date();
        t.setMilliseconds(t.getMilliseconds() + days * 864e+5);
      }

      return (document.cookie = [
        encode(key), '=', stringifyCookieValue(value),
        options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
        options.path    ? '; path=' + options.path : '',
        options.domain  ? '; domain=' + options.domain : '',
        options.secure  ? '; secure' : ''
      ].join(''));
    }

    // Read

    var result = key ? undefined : {},
      // To prevent the for loop in the first place assign an empty array
      // in case there are no cookies at all. Also prevents odd result when
      // calling $.cookie().
      cookies = document.cookie ? document.cookie.split('; ') : [],
      i = 0,
      l = cookies.length;

    for (; i < l; i++) {
      var parts = cookies[i].split('='),
        name = decode(parts.shift()),
        cookie = parts.join('=');

      if (key === name) {
        // If second argument (value) is a function it's a converter...
        result = read(cookie, value);
        break;
      }

      // Prevent storing a cookie that we couldn't decode.
      if (!key && (cookie = read(cookie)) !== undefined) {
        result[name] = cookie;
      }
    }

    return result;
  };

  config.defaults = {};

  $.removeCookie = function (key, options) {
    // Must not alter options, thus extending a fresh object...
    $.cookie(key, '', $.extend({}, options, { expires: -1 }));
    return !$.cookie(key);
  };

}));

// MSDropDown - jquery.dd.js
// author: Marghoob Suleman - http://www.marghoobsuleman.com/
// Date: 10 Nov, 2012 
// Version: 3.5.2
// Revision: 27
// web: www.marghoobsuleman.com
/*
// msDropDown is free jQuery Plugin: you can redistribute it and/or modify
// it under the terms of the either the MIT License or the Gnu General Public License (GPL) Version 2
*/ 
var msBeautify = msBeautify || {};
(function ($) {
	msBeautify = {
	version: {msDropdown:'3.5.2'},
	author: "Marghoob Suleman",
	counter: 20,
	debug: function (v) {
		if (v !== false) {
			$(".ddOutOfVision").css({height: 'auto', position: 'relative'});
		} else {
			$(".ddOutOfVision").css({height: '0px', position: 'absolute'});
		}
	},
	oldDiv: '',
	create: function (id, settings, type) {
		type = type || "dropdown";
		var data;
		switch (type.toLowerCase()) {
		case "dropdown":
		case "select":
			data = $(id).msDropdown(settings).data("dd");
			break;
		}
		return data;
	}
};

$.msDropDown = {}; //Legacy
$.msDropdown = {}; //camelCaps
$.extend(true, $.msDropDown, msBeautify);
$.extend(true, $.msDropdown, msBeautify);
// make compatibiliy with old and new jquery
if ($.fn.prop === undefined) {$.fn.prop = $.fn.attr;}
if ($.fn.on === undefined) {$.fn.on = $.fn.bind;$.fn.off = $.fn.unbind;}
if (typeof $.expr.createPseudo === 'function') {
	//jQuery 1.8  or greater
	$.expr[':'].Contains = $.expr.createPseudo(function (arg) {return function (elem) { return $(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0; }; });
} else {
	//lower version
	$.expr[':'].Contains = function (a, i, m) {return $(a).text().toUpperCase().indexOf(m[3].toUpperCase()) >= 0; };
}
//dropdown class
function dd(element, settings) {
	var settings = $.extend(true,
		{byJson: {data: null, selectedIndex: 0, name: null, size: 0, multiple: false, width: 250},
		mainCSS: 'dd',
		height: 120, //not using currently
		visibleRows: 7,
		rowHeight: 0,
		showIcon: true,
		zIndex: 9999,
		useSprite: false,
		animStyle: 'slideDown',
		event:'click',
		openDirection: 'auto', //auto || alwaysUp || alwaysDown
		jsonTitle: true,
		style: '',
		disabledOpacity: 0.7,
		disabledOptionEvents: true,
		childWidth:0,
		enableCheckbox:false, //this needs to multiple or it will set element to multiple
		checkboxNameSuffix:'_mscheck',
		append:'',
		prepend:'',
		reverseMode:true, //it will update the msdropdown UI/value if you update the original dropdown - will be usefull if are using knockout.js or playing with original dropdown
		roundedCorner:true,
		enableAutoFilter:true,
		on: {create: null,open: null,close: null,add: null,remove: null,change: null,blur: null,click: null,dblclick: null,mousemove: null,mouseover: null,mouseout: null,focus: null,mousedown: null,mouseup: null}
		}, settings);								  
	var $this = this; //this class	 
	var holderId = {postElementHolder: '_msddHolder', postID: '_msdd', postTitleID: '_title',postTitleTextID: '_titleText', postChildID: '_child'};
	var css = {dd:settings.mainCSS, ddTitle: 'ddTitle', arrow: 'ddArrow arrowoff', ddChild: 'ddChild', ddTitleText: 'ddTitleText',disabled: 'disabled', enabled: 'enabled', ddOutOfVision: 'ddOutOfVision', borderTop: 'borderTop', noBorderTop: 'noBorderTop', selected: 'selected', divider: 'divider', optgroup: "optgroup", optgroupTitle: "optgroupTitle", description: "description", label: "ddlabel",hover: 'hover',disabledAll: 'disabledAll'};
	var css_i = {li: '_msddli_',borderRadiusTp: 'borderRadiusTp',ddChildMore: 'border shadow',fnone: "fnone"};
	var isList = false, isMultiple=false,isDisabled=false, cacheElement = {}, element, orginial = {}, isOpen=false;
	var DOWN_ARROW = 40, UP_ARROW = 38, LEFT_ARROW=37, RIGHT_ARROW=39, ESCAPE = 27, ENTER = 13, ALPHABETS_START = 47, SHIFT=16, CONTROL = 17, BACKSPACE=8, DELETE=46;
	var shiftHolded=false, controlHolded=false,lastTarget=null,forcedTrigger=false, oldSelected, isCreated = false;
	var doc = document, ua = window.navigator.userAgent, isIE = ua.match(/msie/i);
	settings.reverseMode = settings.reverseMode.toString();
	settings.roundedCorner = settings.roundedCorner.toString();
	var isArray = function(obj) {
		return (Object.prototype.toString.call(obj)=="[object Array]") ? true : false;
	};
	var msieversion = function()
   	{      
      var msie = ua.indexOf("MSIE");
      if ( msie > 0 ) {      // If Internet Explorer, return version number
         return parseInt (ua.substring (msie+5, ua.indexOf (".", msie)));
	  } else {                // If another browser, return 0
         return 0;
	  };
   	};
	var checkDataSetting = function() {
		settings.mainCSS = $("#"+element).data("maincss") || settings.mainCSS;
		settings.visibleRows = $("#"+element).data("visiblerows") || settings.visibleRows;
		if($("#"+element).data("showicon")==false) {settings.showIcon = $("#"+element).data("showicon");};
		settings.useSprite = $("#"+element).data("usesprite") || settings.useSprite;
		settings.animStyle = $("#"+element).data("animstyle") || settings.animStyle;
		settings.event = $("#"+element).data("event") || settings.event;
		settings.openDirection = $("#"+element).data("opendirection") || settings.openDirection;
		settings.jsonTitle = $("#"+element).data("jsontitle") || settings.jsonTitle;
		settings.disabledOpacity = $("#"+element).data("disabledopacity") || settings.disabledOpacity;
		settings.childWidth = $("#"+element).data("childwidth") || settings.childWidth;
		settings.enableCheckbox = $("#"+element).data("enablecheckbox") || settings.enableCheckbox;
		settings.checkboxNameSuffix = $("#"+element).data("checkboxnamesuffix") || settings.checkboxNameSuffix;
		settings.append = $("#"+element).data("append") || settings.append;
		settings.prepend = $("#"+element).data("prepend") || settings.prepend;
		settings.reverseMode = $("#"+element).data("reversemode") || settings.reverseMode;
		settings.roundedCorner = $("#"+element).data("roundedcorner") || settings.roundedCorner;
		settings.enableAutoFilter = $("#"+element).data("enableautofilter") || settings.enableAutoFilter;
		
		//make string
		settings.reverseMode = settings.reverseMode.toString();
		settings.roundedCorner = settings.roundedCorner.toString();
		settings.enableAutoFilter = settings.enableAutoFilter.toString();
	};	
	var getElement = function(ele) {
		if (cacheElement[ele] === undefined) {
			cacheElement[ele] = doc.getElementById(ele);
		}
		return cacheElement[ele];
	}; 	
	var getIndex = function(opt) {
		var childid = getPostID("postChildID"); 
		return $("#"+childid + " li."+css_i.li).index(opt);
	};
	var createByJson = function() {
		if (settings.byJson.data) {
				var validData = ["description","image","title"];
				try {
					if (!element.id) {
						element.id = "dropdown"+msBeautify.counter;
					};
					settings.byJson.data = eval(settings.byJson.data);
					//change element
					var id = "msdropdown"+(msBeautify.counter++);
					var obj = {};
					obj.id = id;
					obj.name = settings.byJson.name || element.id; //its name
					if (settings.byJson.size>0) {
						obj.size = settings.byJson.size;
					};
					obj.multiple = settings.byJson.multiple;
					var oSelect = createElement("select", obj);
					for(var i=0;i<settings.byJson.data.length;i++) {
						var current = settings.byJson.data[i];
						var opt = new Option(current.text, current.value);
						for(var p in current) { 
							if (p.toLowerCase() != 'text') { 
								var key = ($.inArray(p.toLowerCase(), validData)!=-1) ? "data-" : "";
								opt.setAttribute(key+p, current[p]);
							};
						};
						oSelect.options[i] = opt;
					};
					getElement(element.id).appendChild(oSelect);
					oSelect.selectedIndex = settings.byJson.selectedIndex;
					$(oSelect).css({width: settings.byJson.width+'px'});
					//now change element for access other things
					element = oSelect;
				} catch(e) {
					throw "There is an error in json data.";
				};
		};			
	};
	var init = function() {		
		 //set properties
		 createByJson();
		if (!element.id) {
			element.id = "msdrpdd"+(msBeautify.counter++);
		};						
		element = element.id;
		$this.element = element;
		checkDataSetting();		
		isDisabled = getElement(element).disabled;
		var useCheckbox = settings.enableCheckbox;
		if(useCheckbox.toString()==="true") {
			getElement(element).multiple = true;
			settings.enableCheckbox = true;
		};
		isList = (getElement(element).size>1 || getElement(element).multiple==true) ? true : false;
		//trace("isList "+isList);
		if (isList) {isMultiple = getElement(element).multiple;};			
		mergeAllProp();		
		//create layout
		createLayout();		
		//set ui prop
		updateProp("uiData", getDataAndUI());
		updateProp("selectedOptions", $("#"+element +" option:selected"));
		var childid = getPostID("postChildID");
		oldSelected = $("#" + childid + " li." + css.selected);
		
		if(settings.reverseMode==="true") {
			$("#"+element).on("change", function() {
				setValue(this.selectedIndex);
			});
		};
		//add refresh method
		getElement(element).refresh = function(e) {
			 $("#"+element).msDropdown().data("dd").refresh();
		};

	 };	
	 /********************************************************************************************/	
	var getPostID = function (id) {
		return element+holderId[id];
	};
	var getInternalStyle = function(ele) {		 
		 var s = (ele.style === undefined) ? "" : ele.style.cssText;
		 return s;
	};
	var parseOption = function(opt) {
		var imagePath = '', title ='', description='', value=-1, text='', className='', imagecss = '', index;
		if (opt !== undefined) {
			var attrTitle = opt.title || "";
			//data-title
			if (attrTitle!="") {
				var reg = /^\{.*\}$/;
				var isJson = reg.test(attrTitle);
				if (isJson && settings.jsonTitle) {
					var obj =  eval("["+attrTitle+"]");	
				};				 
				title = (isJson && settings.jsonTitle) ? obj[0].title : title;
				description = (isJson && settings.jsonTitle) ? obj[0].description : description;
				imagePath = (isJson && settings.jsonTitle) ? obj[0].image : attrTitle;
				imagecss = (isJson && settings.jsonTitle) ? obj[0].imagecss : imagecss;
				index = opt.index;
			};

			text = opt.text || '';
			value = opt.value || '';
			className = opt.className || "";
			//ignore title attribute if playing with data tags
			title = $(opt).prop("data-title") || $(opt).data("title") || (title || "");
			description = $(opt).prop("data-description") || $(opt).data("description") || (description || "");
			imagePath = $(opt).prop("data-image") || $(opt).data("image") || (imagePath || "");
			imagecss = $(opt).prop("data-imagecss") || $(opt).data("imagecss") || (imagecss || "");
			index = $(opt).index();
		};
		var o = {image: imagePath, title: title, description: description, value: value, text: text, className: className, imagecss:imagecss, index:index};
		return o;
	};	 
	var createElement = function(nm, attr, html) {
		var tag = doc.createElement(nm);
		if (attr) {
		 for(var i in attr) {
			 switch(i) {
				 case "style":
					tag.style.cssText = attr[i];
				 break;
				 default:
					tag[i]  = attr[i];
				 break;
			 };	
		 };
		};
		if (html) {
		 tag.innerHTML = html;
		};
		return tag;
	};
	 /********************************************************************************************/
	  /*********************** <layout> *************************************/
	var hideOriginal = function() {
		var hidid = getPostID("postElementHolder");
		if ($("#"+hidid).length==0) {			 
			var obj = {style: 'height: 0px;overflow: hidden;position: absolute;',className: css.ddOutOfVision};	
			obj.id = hidid;
			var oDiv = createElement("div", obj);	
			$("#"+element).after(oDiv);
			$("#"+element).appendTo($("#"+hidid));
		} else {
			$("#"+hidid).css({height: 0,overflow: 'hidden',position: 'absolute'});
		};
		getElement(element).tabIndex = -1;
	};
	var createWrapper = function () {
		var brdRds = (settings.roundedCorner == "true") ? " borderRadius" : "";
		var obj = {
			className: css.dd + " ddcommon"+brdRds
		};
		var intcss = getInternalStyle(getElement(element));
		var w = $("#" + element).outerWidth();
		obj.style = "width: " + w + "px;";
		if (intcss.length > 0) {
			obj.style = obj.style + "" + intcss;
		};
		obj.id = getPostID("postID");
		obj.tabIndex = getElement(element).tabIndex;
		var oDiv = createElement("div", obj);
		return oDiv;
	};
	var createTitle = function () {
		var selectedOption;
		if(getElement(element).selectedIndex>=0) {
			selectedOption = getElement(element).options[getElement(element).selectedIndex];
		} else {
			selectedOption = {value:'', text:''};
		}
		var spriteClass = "", selectedClass = "";
		//check sprite
		var useSprite = $("#"+element).data("usesprite");
		if(useSprite) { settings.useSprite = useSprite; };
		if (settings.useSprite != false) {
			spriteClass = " " + settings.useSprite;
			selectedClass = " " + selectedOption.className;
		};
		var brdRdsTp = (settings.roundedCorner == "true") ? " "+css_i.borderRadiusTp : "" ;
		var oTitle = createElement("div", {className: css.ddTitle + spriteClass + brdRdsTp});
		//divider
		var oDivider = createElement("span", {className: css.divider});
		//arrow
		var oArrow = createElement("span", {className: css.arrow});
		//title Text
		var titleid = getPostID("postTitleID");
		var oTitleText = createElement("span", {className: css.ddTitleText + selectedClass, id: titleid});
	
		var parsed = parseOption(selectedOption);
		var arrowPath = parsed.image;
		var sText = parsed.text || "";		
		if (arrowPath != "" && settings.showIcon) {
			var oIcon = createElement("img");
			oIcon.src = arrowPath;
			if(parsed.imagecss!="") {
				oIcon.className = parsed.imagecss+" ";
			};
		};
		var oTitleText_in = createElement("span", {className: css.label}, sText);
		oTitle.appendChild(oDivider);
		oTitle.appendChild(oArrow);
		if (oIcon) {
			oTitleText.appendChild(oIcon);
		};
		oTitleText.appendChild(oTitleText_in);
		oTitle.appendChild(oTitleText);
		var oDescription = createElement("span", {className: css.description}, parsed.description);
		oTitleText.appendChild(oDescription);
		return oTitle;
	};
	var createFilterBox = function () {
		var tid = getPostID("postTitleTextID");
		var brdRds = (settings.roundedCorner == "true") ? "borderRadius" : "";
		var sText = createElement("input", {id: tid, type: 'text', value: '', autocomplete: 'off', className: 'text shadow '+brdRds, style: 'display: none'});
		return sText;
	};
	var createChild = function (opt) {
		var obj = {};
		var intcss = getInternalStyle(opt);
		if (intcss.length > 0) {obj.style = intcss; };
		var css2 = (opt.disabled) ? css.disabled : css.enabled;
		css2 = (opt.selected) ? (css2 + " " + css.selected) : css2;
		css2 = css2 + " " + css_i.li;
		obj.className = css2;
		if (settings.useSprite != false) {
			obj.className = css2 + " " + opt.className;
		};
		var li = createElement("li", obj);
		var parsed = parseOption(opt);
		if (parsed.title != "") {
			li.title = parsed.title;
		};
		var arrowPath = parsed.image;
		if (arrowPath != "" && settings.showIcon) {
			var oIcon = createElement("img");
			oIcon.src = arrowPath;
			if(parsed.imagecss!="") {
				oIcon.className = parsed.imagecss+" ";
			};
		};
		if (parsed.description != "") {
			var oDescription = createElement("span", {
				className: css.description
			}, parsed.description);
		};
		var sText = opt.text || "";
		var oTitleText = createElement("span", {
			className: css.label
		}, sText);
		//checkbox
		if(settings.enableCheckbox===true) {
			var chkbox = createElement("input", {
			type: 'checkbox', name:element+settings.checkboxNameSuffix+'[]', value:opt.value||"", className:"checkbox"}); //this can be used for future
			li.appendChild(chkbox);
			if(settings.enableCheckbox===true) {
				chkbox.checked = (opt.selected) ? true : false;
			};
		};
		if (oIcon) {
			li.appendChild(oIcon);
		};
		li.appendChild(oTitleText);
		if (oDescription) {
			li.appendChild(oDescription);
		} else {
			if (oIcon) {
				oIcon.className = oIcon.className+css_i.fnone;
			};
		};
		var oClear = createElement("div", {className: 'clear'});
		li.appendChild(oClear);
		return li;
	};
	var createChildren = function () {
		var childid = getPostID("postChildID");
		var obj = {className: css.ddChild + " ddchild_ " + css_i.ddChildMore, id: childid};
		if (isList == false) {
			obj.style = "z-index: " + settings.zIndex;
		} else {
			obj.style = "z-index:1";
		};
		var childWidth = $("#"+element).data("childwidth") || settings.childWidth;
		if(childWidth) {
			obj.style =  (obj.style || "") + ";width:"+childWidth;
		};		
		var oDiv = createElement("div", obj);
		var ul = createElement("ul");
		if (settings.useSprite != false) {
			ul.className = settings.useSprite;
		};
		var allOptions = getElement(element).children;
		for (var i = 0; i < allOptions.length; i++) {
			var current = allOptions[i];
			var li;
			if (current.nodeName.toLowerCase() == "optgroup") {
				//create ul
				li = createElement("li", {className: css.optgroup});
				var span = createElement("span", {className: css.optgroupTitle}, current.label);
				li.appendChild(span);
				var optChildren = current.children;
				var optul = createElement("ul");
				for (var j = 0; j < optChildren.length; j++) {
					var opt_li = createChild(optChildren[j]);
					optul.appendChild(opt_li);
				};
				li.appendChild(optul);
			} else {
				li = createChild(current);
			};
			ul.appendChild(li);
		};
		oDiv.appendChild(ul);		
		return oDiv;
	};
	var childHeight = function (val) {
		var childid = getPostID("postChildID");
		if (val) {
			if (val == -1) { //auto
				$("#"+childid).css({height: "auto", overflow: "auto"});
			} else {				
				$("#"+childid).css("height", val+"px");
			};
			return false;
		};
		//else return height
		var iHeight;
		var totalOptions = getElement(element).options.length;
		if (totalOptions > settings.visibleRows || settings.visibleRows) {
			var firstLI = $("#" + childid + " li:first");
			var margin = parseInt(firstLI.css("padding-bottom")) + parseInt(firstLI.css("padding-top"));
			if(settings.rowHeight===0) {
				$("#" + childid).css({visibility:'hidden',display:'block'}); //hack for first child
				settings.rowHeight = Math.ceil(firstLI.height());
				$("#" + childid).css({visibility:'visible'});
				if(!isList || settings.enableCheckbox===true) {
					$("#" + childid).css({display:'none'});
				};
			};
			iHeight = ((settings.rowHeight + margin) * Math.min(settings.visibleRows,totalOptions)) + 3;
		} else if (isList) {
			iHeight = $("#" + element).height(); //get height from original element
		};		
		return iHeight;
	};
	var applyChildEvents = function () {
		var childid = getPostID("postChildID");
		$("#" + childid).on("click", function (e) {
			if (isDisabled === true) return false;
			//prevent body click
			e.preventDefault();
			e.stopPropagation();
			if (isList) {
				bind_on_events();
			};
		});
		$("#" + childid + " li." + css.enabled).on("click", function (e) {
			if(e.target.nodeName.toLowerCase() !== "input") {
				close(this);
			};
		});
		$("#" + childid + " li." + css.enabled).on("mousedown", function (e) {
			if (isDisabled === true) return false;
			oldSelected = $("#" + childid + " li." + css.selected);
			lastTarget = this;
			e.preventDefault();
			e.stopPropagation();
			//select current input
			if(settings.enableCheckbox===true) {
				if(e.target.nodeName.toLowerCase() === "input") {
					controlHolded = true;
				};	
			};
			if (isList === true) {
				if (isMultiple) {					
					if (shiftHolded === true) {
						$(this).addClass(css.selected);
						var selected = $("#" + childid + " li." + css.selected);
						var lastIndex = getIndex(this);
						if (selected.length > 1) {
							var items = $("#" + childid + " li." + css_i.li);
							var ind1 = getIndex(selected[0]);
							var ind2 = getIndex(selected[1]);
							if (lastIndex > ind2) {
								ind1 = (lastIndex);
								ind2 = ind2 + 1;
							};
							for (var i = Math.min(ind1, ind2); i <= Math.max(ind1, ind2); i++) {
								var current = items[i];
								if ($(current).hasClass(css.enabled)) {
									$(current).addClass(css.selected);
								};
							};
						};
					} else if (controlHolded === true) {
						$(this).toggleClass(css.selected); //toggle
						if(settings.enableCheckbox===true) {
							var checkbox = this.childNodes[0];
							checkbox.checked = !checkbox.checked; //toggle
						};
					} else {
						$("#" + childid + " li." + css.selected).removeClass(css.selected);
						$("#" + childid + " input:checkbox").prop("checked", false);
						$(this).addClass(css.selected);
						if(settings.enableCheckbox===true) {
							this.childNodes[0].checked = true;
						};
					};					
				} else {
					$("#" + childid + " li." + css.selected).removeClass(css.selected);
					$(this).addClass(css.selected);
				};
				//fire event on mouseup
			} else {
				$("#" + childid + " li." + css.selected).removeClass(css.selected);
				$(this).addClass(css.selected);
			};		
		});
		$("#" + childid + " li." + css.enabled).on("mouseenter", function (e) {
			if (isDisabled === true) return false;
			e.preventDefault();
			e.stopPropagation();
			if (lastTarget != null) {
				if (isMultiple) {
					$(this).addClass(css.selected);
					if(settings.enableCheckbox===true) {
						this.childNodes[0].checked = true;
					};
				};
			};
		});
	
		$("#" + childid + " li." + css.enabled).on("mouseover", function (e) {
			if (isDisabled === true) return false;
			$(this).addClass(css.hover);
		});
		$("#" + childid + " li." + css.enabled).on("mouseout", function (e) {
			if (isDisabled === true) return false;
			$("#" + childid + " li." + css.hover).removeClass(css.hover);
		});
	
		$("#" + childid + " li." + css.enabled).on("mouseup", function (e) {
			if (isDisabled === true) return false;
			e.preventDefault();
			e.stopPropagation();
			if(settings.enableCheckbox===true) {
				controlHolded = false;
			};
			var selected = $("#" + childid + " li." + css.selected).length;			
			forcedTrigger = (oldSelected.length != selected || selected == 0) ? true : false;	
			fireAfterItemClicked();
			unbind_on_events(); //remove old one
			bind_on_events();
			lastTarget = null;
		});
	
		/* options events */
		if (settings.disabledOptionEvents == false) {
			$("#" + childid + " li." + css_i.li).on("click", function (e) {
				if (isDisabled === true) return false;
				fireOptionEventIfExist(this, "click");
			});
			$("#" + childid + " li." + css_i.li).on("mouseenter", function (e) {
				if (isDisabled === true) return false;
				fireOptionEventIfExist(this, "mouseenter");
			});
			$("#" + childid + " li." + css_i.li).on("mouseover", function (e) {
				if (isDisabled === true) return false;
				fireOptionEventIfExist(this, "mouseover");
			});
			$("#" + childid + " li." + css_i.li).on("mouseout", function (e) {
				if (isDisabled === true) return false;
				fireOptionEventIfExist(this, "mouseout");
			});
			$("#" + childid + " li." + css_i.li).on("mousedown", function (e) {
				if (isDisabled === true) return false;
				fireOptionEventIfExist(this, "mousedown");
			});
			$("#" + childid + " li." + css_i.li).on("mouseup", function (e) {
				if (isDisabled === true) return false;
				fireOptionEventIfExist(this, "mouseup");
			});
		};
	};
	var removeChildEvents = function () {
		var childid = getPostID("postChildID");
		$("#" + childid).off("click");
		$("#" + childid + " li." + css.enabled).off("mouseenter");
		$("#" + childid + " li." + css.enabled).off("click");
		$("#" + childid + " li." + css.enabled).off("mouseover");
		$("#" + childid + " li." + css.enabled).off("mouseout");
		$("#" + childid + " li." + css.enabled).off("mousedown");
		$("#" + childid + " li." + css.enabled).off("mouseup");
	};
	var triggerBypassingHandler = function (id, evt_n, handler) {
		$("#" + id).off(evt_n, handler);
		$("#" + id).trigger(evt_n);
		$("#" + id).on(evt_n, handler);
	};
	var applyEvents = function () {
		var id = getPostID("postID");
		var tid = getPostID("postTitleTextID");
		var childid = getPostID("postChildID");		
		$("#" + id).on(settings.event, function (e) {			
			if (isDisabled === true) return false;
			fireEventIfExist(settings.event);
			//prevent body click
			e.preventDefault();
			e.stopPropagation();
			open(e);
		});
		$("#" + id).on("keydown", function (e) {
			var k = e.which;
			if (!isOpen && (k == ENTER || k == UP_ARROW || k == DOWN_ARROW ||
				k == LEFT_ARROW || k == RIGHT_ARROW ||
				(k >= ALPHABETS_START && !isList))) {
				open(e);
				if (k >= ALPHABETS_START) {
					showFilterBox();
				} else {
					e.preventDefault();
					e.stopImmediatePropagation();
				};
			};
		});
		$("#" + id).on("focus", wrapperFocusHandler);
		$("#" + id).on("blur", wrapperBlurHandler);
		$("#" + tid).on("blur", function (e) {
			//return focus to the wrapper without triggering the handler
			triggerBypassingHandler(id, "focus", wrapperFocusHandler);
		});
		applyChildEvents();		
		$("#" + id).on("dblclick", on_dblclick);
		$("#" + id).on("mousemove", on_mousemove);
		$("#" + id).on("mouseenter", on_mouseover);
		$("#" + id).on("mouseleave", on_mouseout);
		$("#" + id).on("mousedown", on_mousedown);
		$("#" + id).on("mouseup", on_mouseup);
	};
	var wrapperFocusHandler = function (e) {
		fireEventIfExist("focus");
	};
	var wrapperBlurHandler = function (e) {
		fireEventIfExist("blur");
	};
	//after create
	var fixedForList = function () {
		var id = getPostID("postID");
		var childid = getPostID("postChildID");		
		if (isList === true && settings.enableCheckbox===false) {
			$("#" + id + " ." + css.ddTitle).hide();
			$("#" + childid).css({display: 'block', position: 'relative'});	
			//open();
		} else {
			if(settings.enableCheckbox===false) {
				isMultiple = false; //set multiple off if this is not a list
			};
			$("#" + id + " ." + css.ddTitle).show();
			$("#" + childid).css({display: 'none', position: 'absolute'});
			//set value
			var first = $("#" + childid + " li." + css.selected)[0];
			$("#" + childid + " li." + css.selected).removeClass(css.selected);
			var index = getIndex($(first).addClass(css.selected));
			setValue(index);
		};
		childHeight(childHeight()); //get and set height 
	};
	var fixedForDisabled = function () {
		var id = getPostID("postID");
		var opc = (isDisabled == true) ? settings.disabledOpacity : 1;
		if (isDisabled === true) {
			$("#" + id).addClass(css.disabledAll);
		} else {
			$("#" + id).removeClass(css.disabledAll);
		};
	};
	var fixedSomeUI = function () {
		//auto filter
		var tid = getPostID("postTitleTextID");
		if(settings.enableAutoFilter=="true") {
			$("#" + tid).on("keyup", applyFilters);
		};
		//if is list
		fixedForList();
		fixedForDisabled();
	};
	var createLayout = function () {		
		var oDiv = createWrapper();
		var oTitle = createTitle();
		oDiv.appendChild(oTitle);
		//auto filter box
		var oFilterBox = createFilterBox();
		oDiv.appendChild(oFilterBox);
	
		var oChildren = createChildren();
		oDiv.appendChild(oChildren);
		$("#" + element).after(oDiv);
		hideOriginal(); //hideOriginal
		fixedSomeUI();
		applyEvents();
		
		var childid = getPostID("postChildID");
		//append
		if(settings.append!='') {
			$("#" + childid).append(settings.append);
		};
		//prepend
		if(settings.prepend!='') {
			$("#" + childid).prepend(settings.prepend);
		};		
		if (typeof settings.on.create == "function") {
			settings.on.create.apply($this, arguments);
		};
	};
	var selectUI_LI = function(indexes) {
		var childid = getPostID("postChildID");
		$("#" + childid + " li." + css_i.li).removeClass(css.selected);
		if(settings.enableCheckbox===true) {
			$("#" + childid + " li." + css_i.li + " input.checkbox").prop("checked", false);
		};
		if(isArray(indexes)===true) {
			for(var i=0;i<indexes.length;i++) {
				updateNow(indexes[i]);
			};
		} else {
			updateNow(indexes);
		};
		function updateNow(index) {
			$($("#" + childid + " li." + css_i.li)[index]).addClass(css.selected);
			if(settings.enableCheckbox===true) {
				$($("#" + childid + " li." + css_i.li)[index]).find("input.checkbox").prop("checked", "checked");
			};
			
		};
	};
	var selectMutipleOptions = function (bySelected, useIndexes) {
		var childid = getPostID("postChildID");
		var selected = bySelected || $("#" + childid + " li." + css.selected); //bySelected or by argument
		for (var i = 0; i < selected.length; i++) {
			var ind = (useIndexes===true) ? selected[i]  : getIndex(selected[i]);
			getElement(element).options[ind].selected = "selected";
		};
		setValue(selected);
	};
	var fireAfterItemClicked = function () {
		//console.log("fireAfterItemClicked")
		var childid = getPostID("postChildID");
		var selected = $("#" + childid + " li." + css.selected);		
		if (isMultiple && (shiftHolded || controlHolded) || forcedTrigger) {
			getElement(element).selectedIndex = -1; //reset old
		};
		var index;
		if (selected.length == 0) {
			index = -1;
		} else if (selected.length > 1) {
			//selected multiple
			selectMutipleOptions(selected);
		} else {
			//if one selected
			index = getIndex($("#" + childid + " li." + css.selected));
		};		
		if ((getElement(element).selectedIndex != index || forcedTrigger) && selected.length<=1) {			
			forcedTrigger = false;			
			var evt = has_handler("change");
			getElement(element).selectedIndex = index;	
			setValue(index);
			//local
			if (typeof settings.on.change == "function") {
				var d = getDataAndUI();
				settings.on.change(d.data, d.ui);
			};			
			$("#" + element).trigger("change");			
		};
	};
	var setValue = function (index, byvalue) {
		if (index !== undefined) {
			var selectedIndex, value, selectedText;
			if (index == -1) {
				selectedIndex = -1;
				value = "";
				selectedText = "";
				updateTitleUI(-1);
			} else {
				//by index or byvalue
				if (typeof index != "object") {
					var opt = getElement(element).options[index];
					getElement(element).selectedIndex = index;
					selectedIndex = index;
					value = parseOption(opt);
					selectedText = (index >= 0) ? getElement(element).options[index].text : "";
					updateTitleUI(undefined, value);
					value = value.value; //for bottom
				} else {
					//this is multiple or by option
					selectedIndex = (byvalue && byvalue.index) || getElement(element).selectedIndex;
					value = (byvalue && byvalue.value) || getElement(element).value;
					selectedText = (byvalue && byvalue.text) || getElement(element).options[getElement(element).selectedIndex].text || "";
					updateTitleUI(selectedIndex);
					//check if this is multiple checkbox					
				};
			};			
			updateProp("selectedIndex", selectedIndex);
			updateProp("value", value);
			updateProp("selectedText", selectedText);
			updateProp("children", getElement(element).children);
			updateProp("uiData", getDataAndUI());
			updateProp("selectedOptions", $("#" + element + " option:selected"));
		};
	};
	var has_handler = function (name) {
		//True if a handler has been added in the html.
		var evt = {byElement: false, byJQuery: false, hasEvent: false};
		var obj = $("#" + element);
		//console.log(name)
		try {
			//console.log(obj.prop("on" + name) + " "+name);
			if (obj.prop("on" + name) !== null) {
				evt.hasEvent = true;
				evt.byElement = true;
			};
		} catch(e) {
			//console.log(e.message);
		}
		// True if a handler has been added using jQuery.
		var evs;
		if (typeof $._data == "function") { //1.8
			evs = $._data(obj[0], "events");
		} else {
			evs = obj.data("events");
		};
		if (evs && evs[name]) {
			evt.hasEvent = true;
			evt.byJQuery = true;
		};
		return evt;
	};
	var bind_on_events = function () {
		unbind_on_events();
		$("body").on("click", close);
		//bind more events		 
		$(document).on("keydown", on_keydown);
		$(document).on("keyup", on_keyup);
		//focus will work on this	 		 
	};
	var unbind_on_events = function () {
		$("body").off("click", close);
		//bind more events
		$(document).off("keydown", on_keydown);
		$(document).off("keyup", on_keyup);
	};
	var applyFilters = function (e) {
		if(e.keyCode < ALPHABETS_START && e.keyCode!=BACKSPACE && e.keyCode!=DELETE) {
			return false;
		};
		var childid = getPostID("postChildID");
		var tid = getPostID("postTitleTextID");
		var sText = getElement(tid).value;
		if (sText.length == 0) {
			$("#" + childid + " li:hidden").show(); //show if hidden
			childHeight(childHeight());
		} else {
			$("#" + childid + " li").hide();
			var items = $("#" + childid + " li:Contains('" + sText + "')").show();
			if ($("#" + childid + " li:visible").length <= settings.visibleRows) {
				childHeight(-1); //set autoheight
			};
			if (items.length > 0 && !isList || !isMultiple) {
				$("#" + childid + " ." + css.selected).removeClass(css.selected);
				$(items[0]).addClass(css.selected);
			};	
		};		
		if (!isList) {
			adjustOpen();
		};
	};
	var showFilterBox = function () {
		if(settings.enableAutoFilter=="true") {
			var id = getPostID("postID");
			var tid = getPostID("postTitleTextID");
			if ($("#" + tid + ":hidden").length > 0 && controlHolded == false) {
				$("#" + tid + ":hidden").show().val("");
				//blur the wrapper without triggering the handler
				triggerBypassingHandler(id, "blur", wrapperBlurHandler);
				getElement(tid).focus();
			};
		};
	};
	var hideFilterBox = function () {
		var tid = getPostID("postTitleTextID");
		if ($("#" + tid + ":visible").length > 0) {
			$("#" + tid + ":visible").hide();
			getElement(tid).blur();
		};
	};
	var on_keydown = function (evt) {
		var tid = getPostID("postTitleTextID");
		var childid = getPostID("postChildID");
		switch (evt.keyCode) {
			case DOWN_ARROW:
			case RIGHT_ARROW:
				evt.preventDefault();
				evt.stopPropagation();
				//hideFilterBox();
				next();
				break;
			case UP_ARROW:
			case LEFT_ARROW:
				evt.preventDefault();
				evt.stopPropagation();
				//hideFilterBox();
				previous();
				break;
			case ESCAPE:
			case ENTER:
				evt.preventDefault();
				evt.stopPropagation();
				close();
				var selected = $("#" + childid + " li." + css.selected).length;	
				forcedTrigger = (oldSelected.length != selected || selected == 0) ? true : false;				
				fireAfterItemClicked();
				unbind_on_events(); //remove old one				
				lastTarget = null;			
				break;
			case SHIFT:
				shiftHolded = true;
				break;
			case CONTROL:
				controlHolded = true;
				break;
			default:
				if (evt.keyCode >= ALPHABETS_START && isList === false) {
					showFilterBox();
				};
				break;
		};
		if (isDisabled === true) return false;
		fireEventIfExist("keydown");
	};
	var on_keyup = function (evt) {
		switch (evt.keyCode) {
			case SHIFT:
				shiftHolded = false;
				break;
			case CONTROL:
				controlHolded = false;
				break;
		};
		if (isDisabled === true) return false;
		fireEventIfExist("keyup");
	};
	var on_dblclick = function (evt) {
		if (isDisabled === true) return false;
		fireEventIfExist("dblclick");
	};
	var on_mousemove = function (evt) {
		if (isDisabled === true) return false;
		fireEventIfExist("mousemove");
	};
	
	var on_mouseover = function (evt) {
		if (isDisabled === true) return false;
		evt.preventDefault();
		fireEventIfExist("mouseover");
	};
	var on_mouseout = function (evt) {
		if (isDisabled === true) return false;
		evt.preventDefault();
		fireEventIfExist("mouseout");
	};
	var on_mousedown = function (evt) {
		if (isDisabled === true) return false;
		fireEventIfExist("mousedown");
	};
	var on_mouseup = function (evt) {
		if (isDisabled === true) return false;
		fireEventIfExist("mouseup");
	};
	var option_has_handler = function (opt, name) {
		//True if a handler has been added in the html.
		var evt = {byElement: false, byJQuery: false, hasEvent: false};
		if ($(opt).prop("on" + name) != undefined) {
			evt.hasEvent = true;
			evt.byElement = true;
		};
		// True if a handler has been added using jQuery.
		var evs = $(opt).data("events");
		if (evs && evs[name]) {
			evt.hasEvent = true;
			evt.byJQuery = true;
		};
		return evt;
	};
	var fireOptionEventIfExist = function (li, evt_n) {
		if (settings.disabledOptionEvents == false) {
			var opt = getElement(element).options[getIndex(li)];
			//check if original has some
			if (option_has_handler(opt, evt_n).hasEvent === true) {
				if (option_has_handler(opt, evt_n).byElement === true) {
					opt["on" + evt_n]();
				};
				if (option_has_handler(opt, evt_n).byJQuery === true) {
					switch (evt_n) {
						case "keydown":
						case "keyup":
							//key down/up will check later
							break;
						default:
							$(opt).trigger(evt_n);
							break;
					};
				};
				return false;
			};
		};
	};
	var fireEventIfExist = function (evt_n) {
		//local
		if (typeof settings.on[evt_n] == "function") {
			settings.on[evt_n].apply(this, arguments);
		};
		//check if original has some
		if (has_handler(evt_n).hasEvent === true) {
			if (has_handler(evt_n).byElement === true) {
				getElement(element)["on" + evt_n]();
			} else if (has_handler(evt_n).byJQuery === true) {
				switch (evt_n) {
					case "keydown":
					case "keyup":
						//key down/up will check later
						break;
					default:
						$("#" + element).triggerHandler(evt_n);
						break;
				};
			};
			return false;
		};
	};
	/******************************* navigation **********************************************/
	var scrollToIfNeeded = function (opt) {
		var childid = getPostID("postChildID");
		//if scroll is needed
		opt = (opt !== undefined) ? opt : $("#" + childid + " li." + css.selected);
		if (opt.length > 0) {
			var pos = parseInt(($(opt).position().top));
			var ch = parseInt($("#" + childid).height());
			if (pos > ch) {
				var top = pos + $("#" + childid).scrollTop() - (ch/2);
				$("#" + childid).animate({scrollTop:top}, 500);
			};
		};
	};
	var next = function () {
		var childid = getPostID("postChildID");
		var items = $("#" + childid + " li:visible." + css_i.li);
		var selected = $("#" + childid + " li:visible." + css.selected);
		selected = (selected.length==0) ? items[0] : selected;
		var index = $("#" + childid + " li:visible." + css_i.li).index(selected);
		if ((index < items.length - 1)) {
			index = getNext(index);
			if (index < items.length) { //check again - hack for last disabled 
				if (!shiftHolded || !isList || !isMultiple) {
					$("#" + childid + " ." + css.selected).removeClass(css.selected);
				};
				$(items[index]).addClass(css.selected);
				updateTitleUI(index);
				if (isList == true) {
					fireAfterItemClicked();
				};
				scrollToIfNeeded($(items[index]));
			};
			if (!isList) {
				adjustOpen();
			};
		};	
		function getNext(ind) {
			ind = ind + 1;
			if (ind > items.length) {
				return ind;
			};
			if ($(items[ind]).hasClass(css.enabled) === true) {
				return ind;
			};
			return ind = getNext(ind);
		};
	};
	var previous = function () {
		var childid = getPostID("postChildID");
		var selected = $("#" + childid + " li:visible." + css.selected);
		var items = $("#" + childid + " li:visible." + css_i.li);
		var index = $("#" + childid + " li:visible." + css_i.li).index(selected[0]);
		if (index >= 0) {
			index = getPrev(index);
			if (index >= 0) { //check again - hack for disabled 
				if (!shiftHolded || !isList || !isMultiple) {
					$("#" + childid + " ." + css.selected).removeClass(css.selected);
				};
				$(items[index]).addClass(css.selected);
				updateTitleUI(index);
				if (isList == true) {
					fireAfterItemClicked();
				};
				if (parseInt(($(items[index]).position().top + $(items[index]).height())) <= 0) {
					var top = ($("#" + childid).scrollTop() - $("#" + childid).height()) - $(items[index]).height();
					$("#" + childid).animate({scrollTop: top}, 500);
				};
			};
			if (!isList) {
				adjustOpen();
			};
		};
	
		function getPrev(ind) {
			ind = ind - 1;
			if (ind < 0) {
				return ind;
			};
			if ($(items[ind]).hasClass(css.enabled) === true) {
				return ind;
			};
			return ind = getPrev(ind);
		};
	};
	var adjustOpen = function () {
		var id = getPostID("postID");
		var childid = getPostID("postChildID");
		var pos = $("#" + id).offset();
		var mH = $("#" + id).height();
		var wH = $(window).height();
		var st = $(window).scrollTop();
		var cH = $("#" + childid).height();
		var top = $("#" + id).height(); //this close so its title height
		var direction = settings.openDirection.toLowerCase();
		if (((wH + st) < Math.floor(cH + mH + pos.top) || direction == 'alwaysup') && direction != 'alwaysdown') {
			top = cH;
			$("#" + childid).css({top: "-" + top + "px", display: 'block', zIndex: settings.zIndex});			
			if(settings.roundedCorner == "true") {
				$("#" + id).removeClass("borderRadius borderRadiusTp").addClass("borderRadiusBtm");
			};
			var top = $("#" + childid).offset().top;
			if (top < -10) {
				$("#" + childid).css({top: (parseInt($("#" + childid).css("top")) - top + 20 + st) + "px", zIndex: settings.zIndex});
				if(settings.roundedCorner == "true") {
					$("#" + id).removeClass("borderRadiusBtm borderRadiusTp").addClass("borderRadius");
				};
			};
		} else {
			$("#" + childid).css({top: top + "px", zIndex: settings.zIndex});			
			if(settings.roundedCorner == "true") {
				$("#" + id).removeClass("borderRadius borderRadiusBtm").addClass("borderRadiusTp");
			};
		};
		//hack for ie zindex
		//i hate ie :D
		if(isIE) {
			if(msieversion()<=7) {
				$('div.ddcommon').css("zIndex", settings.zIndex-10);
				$("#" + id).css("zIndex", settings.zIndex+5);
			};
		};		
	};
	var open = function (e) {
		if (isDisabled === true) return false;
		var id = getPostID("postID");
		var childid = getPostID("postChildID");
		if (!isOpen) {
			isOpen = true;
			if (msBeautify.oldDiv != '') {
				$("#" + msBeautify.oldDiv).css({display: "none"}); //hide all 
			};
			msBeautify.oldDiv = childid;
			$("#" + childid + " li:hidden").show(); //show if hidden
			adjustOpen();
			var animStyle = settings.animStyle;
			if(animStyle=="" || animStyle=="none") {
				$("#" + childid).css({display:"block"});
				scrollToIfNeeded();
				if (typeof settings.on.open == "function") {
					var d = getDataAndUI();
					settings.on.open(d.data, d.ui);
				};
			} else {				
				$("#" + childid)[animStyle]("fast", function () {
					scrollToIfNeeded();
					if (typeof settings.on.open == "function") {
						var d = getDataAndUI();
						settings.on.open(d.data, d.ui);
					};
				});
			};
			bind_on_events();
		} else {
			if(settings.event!=='mouseover') {
				close();
			};
		};
	};
	var close = function (e) {
		isOpen = false;
		var id = getPostID("postID");
		var childid = getPostID("postChildID");
		if (isList === false || settings.enableCheckbox===true) {
			$("#" + childid).css({display: "none"});			
			if(settings.roundedCorner == "true") {
				$("#" + id).removeClass("borderRadiusTp borderRadiusBtm").addClass("borderRadius");
			};
		};
		unbind_on_events();
		if (typeof settings.on.close == "function") {
			var d = getDataAndUI();
			settings.on.close(d.data, d.ui);
		};
		//rest some old stuff
		hideFilterBox();
		childHeight(childHeight()); //its needed after filter applied
		$("#" + childid).css({zIndex:1});
		//update the title in case the user clicked outside
		updateTitleUI(getElement(element).selectedIndex);
	};
	/*********************** </layout> *************************************/	
	var mergeAllProp = function () {
		try {
			orginial = $.extend(true, {}, getElement(element));
			for (var i in orginial) {
				if (typeof orginial[i] != "function") {				
					$this[i] = orginial[i]; //properties
				};
			};
		} catch(e) {
			//silent
		};
		$this.selectedText = (getElement(element).selectedIndex >= 0) ? getElement(element).options[getElement(element).selectedIndex].text : "";		
		$this.version = msBeautify.version.msDropdown;
		$this.author = msBeautify.author;
	};
	var getDataAndUIByOption = function (opt) {
		if (opt != null && typeof opt != "undefined") {
			var childid = getPostID("postChildID");
			var data = parseOption(opt);
			var ui = $("#" + childid + " li." + css_i.li + ":eq(" + (opt.index) + ")");
			return {data: data, ui: ui, option: opt, index: opt.index};
		};
		return null;
	};
	var getDataAndUI = function () {
		var childid = getPostID("postChildID");
		var ele = getElement(element);
		var data, ui, option, index;
		if (ele.selectedIndex == -1) {
			data = null;
			ui = null;
			option = null;
			index = -1;
		} else {
			ui = $("#" + childid + " li." + css.selected);
			if (ui.length > 1) {
				var d = [], op = [], ind = [];
				for (var i = 0; i < ui.length; i++) {
					var pd = getIndex(ui[i]);
					d.push(pd);
					op.push(ele.options[pd]);
				};
				data = d;
				option = op;
				index = d;
			} else {
				option = ele.options[ele.selectedIndex];
				data = parseOption(option);
				index = ele.selectedIndex;
			};
		};
		return {data: data, ui: ui, index: index, option: option};
	};
	var updateTitleUI = function (index, byvalue) {
		var titleid = getPostID("postTitleID");
		var value = {};
		if (index == -1) {
			value.text = "&nbsp;";
			value.className = "";
			value.description = "";
			value.image = "";
		} else if (typeof index != "undefined") {
			var opt = getElement(element).options[index];
			value = parseOption(opt);
		} else {
			value = byvalue;
		};
		//update title and current
//trying to fix a problem that arises when ids contain rare characters, such as .:[] ; however, this is not the only point at which this causes problems, so find out the others before fully implementing it
//titleid = titleid.replace( /(:|\.|\[|\]|,)/g, "\\$1" );
//console.log("titleid: " + titleid);
//jquery Selector needs . and : escaped, document.getElementById doesn't (and that's what getElement() is using)
		$("#" + titleid).find("." + css.label).html(value.text);
//console.dir($("#" + titleid).find("." + css.label));
		getElement(titleid).className = css.ddTitleText + " " + value.className;
		//update desction
		if (value.description != "") {
			$("#" + titleid).find("." + css.description).html(value.description).show();
		} else {
			$("#" + titleid).find("." + css.description).html("").hide();
		};
		//update icon
		var img = $("#" + titleid).find("img");
		if (img.length > 0) {
			$(img).remove();
		};
		if (value.image != "" && settings.showIcon) {
			img = createElement("img", {src: value.image});
			$("#" + titleid).prepend(img);
			if(value.imagecss!="") {
				img.className = value.imagecss+" ";
			};
			if (value.description == "") {
				img.className = img.className+css_i.fnone;
			};
		};
	};
	var updateProp = function (p, v) {
		$this[p] = v;
	};
	var updateUI = function (a, opt, i) { //action, index, opt
		var childid = getPostID("postChildID");
		var wasSelected = false;
		switch (a) {
			case "add":
				var li = createChild(opt || getElement(element).options[i]);				
				var index;
				if (arguments.length == 3) {
					index = i;
				} else {
					index = $("#" + childid + " li." + css_i.li).length - 1;
				};				
				if (index < 0 || !index) {
					$("#" + childid + " ul").append(li);
				} else {
					var at = $("#" + childid + " li." + css_i.li)[index];
					$(at).before(li);
				};
				removeChildEvents();
				applyChildEvents();
				if (settings.on.add != null) {
					settings.on.add.apply(this, arguments);
				};
				break;
			case "remove":
				wasSelected = $($("#" + childid + " li." + css_i.li)[i]).hasClass(css.selected);
				$("#" + childid + " li." + css_i.li + ":eq(" + i + ")").remove();
				var items = $("#" + childid + " li." + css.enabled);
				if (wasSelected == true) {
					if (items.length > 0) {
						$(items[0]).addClass(css.selected);
						var ind = $("#" + childid + " li." + css_i.li).index(items[0]);
						setValue(ind);
					};
				};
				if (items.length == 0) {
					setValue(-1);
				};
				if ($("#" + childid + " li." + css_i.li).length < settings.visibleRows && !isList) {
					childHeight(-1); //set autoheight
				};
				if (settings.on.remove != null) {
					settings.on.remove.apply(this, arguments);
				};
				break;
		};	
	};
	/************************** public methods/events **********************/
	this.act = function () {
		var action = arguments[0];
		Array.prototype.shift.call(arguments);
		switch (action) {
			case "add":
				$this.add.apply(this, arguments);
				break;
			case "remove":
				$this.remove.apply(this, arguments);
				break;
			default:
				try {
					getElement(element)[action].apply(getElement(element), arguments);
				} catch (e) {
					//there is some error.
				};
				break;
		};
	};
	
	this.add = function () {
		var text, value, title, image, description;
		var obj = arguments[0];		
		if (typeof obj == "string") {
			text = obj;
			value = text;
			opt = new Option(text, value);
		} else {
			text = obj.text || '';
			value = obj.value || text;
			title = obj.title || '';
			image = obj.image || '';
			description = obj.description || '';
			//image:imagePath, title:title, description:description, value:opt.value, text:opt.text, className:opt.className||""
			opt = new Option(text, value);
			$(opt).data("description", description);
			$(opt).data("image", image);
			$(opt).data("title", title);
		};
		arguments[0] = opt; //this option
		getElement(element).add.apply(getElement(element), arguments);
		updateProp("children", getElement(element)["children"]);
		updateProp("length", getElement(element).length);
		updateUI("add", opt, arguments[1]);
	};
	this.remove = function (i) {
		getElement(element).remove(i);
		updateProp("children", getElement(element)["children"]);
		updateProp("length", getElement(element).length);
		updateUI("remove", undefined, i);
	};
	this.set = function (prop, val) {
		if (typeof prop == "undefined" || typeof val == "undefined") return false;
		prop = prop.toString();
		try {
			updateProp(prop, val);
		} catch (e) {/*this is ready only */};
		switch (prop) {
			case "size":
				getElement(element)[prop] = val;
				if (val == 0) {
					getElement(element).multiple = false; //if size is zero multiple should be false
				};
				isList = (getElement(element).size > 1 || getElement(element).multiple == true) ? true : false;
				fixedForList();
				break;
			case "multiple":
				getElement(element)[prop] = val;
				isList = (getElement(element).size > 1 || getElement(element).multiple == true) ? true : false;
				isMultiple = getElement(element).multiple;
				fixedForList();
				updateProp(prop, val);
				break;
			case "disabled":
				getElement(element)[prop] = val;
				isDisabled = val;
				fixedForDisabled();
				break;
			case "selectedIndex":
			case "value":				
				if(prop=="selectedIndex" && isArray(val)===true) {
					$("#"+element +" option").prop("selected", false);
					selectMutipleOptions(val, true);
					selectUI_LI(val); //setValue is being called from selectMutipleOptions
				} else {
					getElement(element)[prop] = val;					
					selectUI_LI(getElement(element).selectedIndex);
					setValue(getElement(element).selectedIndex);
				};
				break;
			case "length":
				var childid = getPostID("postChildID");
				if (val < getElement(element).length) {
					getElement(element)[prop] = val;
					if (val == 0) {
						$("#" + childid + " li." + css_i.li).remove();
						setValue(-1);
					} else {
						$("#" + childid + " li." + css_i.li + ":gt(" + (val - 1) + ")").remove();
						if ($("#" + childid + " li." + css.selected).length == 0) {
							$("#" + childid + " li." + css.enabled + ":eq(0)").addClass(css.selected);
						};
					};
					updateProp(prop, val);
					updateProp("children", getElement(element)["children"]);
				};
				break;
			case "id":
				//please i need this. so preventing to change it. will work on this later
				break;
			default:
				//check if this is not a readonly properties
				try {
					getElement(element)[prop] = val;
					updateProp(prop, val);
				} catch (e) {
					//silent
				};
				break;
		};
	};
	this.get = function (prop) {
		return $this[prop] || getElement(element)[prop]; //return if local else from original
	};
	this.visible = function (val) {
		var id = getPostID("postID");		
		if (val === true) {
			$("#" + id).show();
		} else if (val === false) {
			$("#" + id).hide();
		} else {
			return ($("#" + id).css("display")=="none") ? false : true;
		};
	};
	this.debug = function (v) {
		msBeautify.debug(v);
	};
	this.close = function () {
		close();
	};
	this.open = function () {		
		open();
	};
	this.showRows = function (r) {
		if (typeof r == "undefined" || r == 0) {
			return false;
		};
		settings.visibleRows = r;
		childHeight(childHeight());
	};
	this.visibleRows = this.showRows;
	this.on = function (type, fn) {
		$("#" + element).on(type, fn);
	};
	this.off = function (type, fn) {
		$("#" + element).off(type, fn);
	};
	this.addMyEvent = this.on;
	this.getData = function () {
		return getDataAndUI()
	};
	this.namedItem = function () {
		var opt = getElement(element).namedItem.apply(getElement(element), arguments);
		return getDataAndUIByOption(opt);
	};
	this.item = function () {
		var opt = getElement(element).item.apply(getElement(element), arguments);
		return getDataAndUIByOption(opt);
	};	
	//v 3.2
	this.setIndexByValue = function(val) {
		this.set("value", val);
	};
	this.destroy = function () {
		var hidid = getPostID("postElementHolder");
		var id = getPostID("postID");
		$("#" + id + ", #" + id + " *").off();
		getElement(element).tabIndex = getElement(id).tabIndex;
		$("#" + id).remove();
		$("#" + element).parent().replaceWith($("#" + element));		
		$("#" + element).data("dd", null);
	};
	this.refresh = function() {
		setValue(getElement(element).selectedIndex);
	};
	//Create msDropDown	
	init();
};
//bind in jquery
$.fn.extend({
			msDropDown: function(settings)
			{
				return this.each(function()
				{
					if (!$(this).data('dd')){
						var mydropdown = new dd(this, settings);
						$(this).data('dd', mydropdown);
					};
				});
			}
});
$.fn.msDropdown = $.fn.msDropDown; //make a copy
})(jQuery);
(function ($) {

  'use strict';

  /**
   * Container for the resizeend timeout.
   */
  var resizeTimeout;

  /**
   * Throttled resize event. Fires only once after the resize ended.
   */
  var event = $.event.special.resizeend = {
    setup: function () {
      $(this).bind('resize', event.handler);
    },

    teardown: function () {
      $(this).unbind('resize', event.handler);
    },

    handler: function (e) {
      var context = this;
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }

      resizeTimeout = setTimeout(function () {
        // Set correct event type
        e.type = 'resizeend';
        $(context).trigger(e);
      }, 150);
    }
  };

  /**
   * Wrapper for the resizeend event.
   */
  $.fn.resizeend = function (handler) {
    return $(this).bind('resizeend', handler);
  };

})(jQuery);

;(function($) {
  'use strict';

  var pluginName = 'selectric',
      classList = 'Input Items Open Disabled TempShow HideSelect Wrapper Hover Responsive Above Scroll Group GroupLabel',
      bindSufix = '.sl',
      defaults = {
        onChange: function(elm) { $(elm).change(); },
        maxHeight: 300,
        keySearchTimeout: 500,
        arrowButtonMarkup: '<b class="button">&#x25be;</b>',
        disableOnMobile: true,
        openOnHover: false,
        hoverIntentTimeout: 500,
        expandToItemText: false,
        responsive: false,
        preventWindowScroll: true,
        inheritOriginalWidth: false,
        allowWrap: true,
        customClass: {
          prefix: pluginName,
          postfixes: classList,
          camelCase: true,
          overwrite: true
        },
        optionsItemBuilder: '{text}' // function(itemData, element, index)
      },
      hooks = {
        add: function(callbackName, hookName, fn) {
          if ( !this[callbackName] )
            this[callbackName] = {};

          this[callbackName][hookName] = fn;
        },
        remove: function(callbackName, hookName) {
          delete this[callbackName][hookName];
        }
      },
      _utils = {
        // Replace diacritics
        replaceDiacritics: function(s) {
          // /[\340-\346]/g, // a
          // /[\350-\353]/g, // e
          // /[\354-\357]/g, // i
          // /[\362-\370]/g, // o
          // /[\371-\374]/g, // u
          // /[\361]/g,      // n
          // /[\347]/g,      // c
          // /[\377]/g       // y
          var d = '40-46 50-53 54-57 62-70 71-74 61 47 77'.replace(/\d+/g, '\\3$&').split(' '),
              k = d.length;

          while (k--)
            s = s.toLowerCase().replace(RegExp('[' + d[k] + ']', 'g'), 'aeiouncy'.charAt(k));

          return s;
        },
        // https://gist.github.com/atesgoral/984375
        format: function(f) {var a=arguments;return(""+f).replace(/{(\d+|(\w+))}/g,function(s,i,p) {return p&&a[1]?a[1][p]:a[i]})},
        nextEnabledItem: function(selectItems, selected) {
          while ( selectItems[ selected = (selected + 1) % selectItems.length ].disabled ) {}
          return selected;
        },
        previousEnabledItem: function(selectItems, selected) {
          while ( selectItems[ selected = (selected > 0 ? selected : selectItems.length) - 1 ].disabled ) {}
          return selected;
        },
        toDash: function(str) {
          return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
        },
        triggerCallback: function(fn, scope) {
          var elm = scope.element,
              func = scope.options['on' + fn];

          if ( $.isFunction(func) )
            func.call(elm, elm, scope);

          if ( hooks[fn] ) {
            $.each(hooks[fn], function() {
              this.call(elm, elm, scope);
            });
          }

          $(elm).trigger(pluginName + '-' + _utils.toDash(fn), scope);
        }
      },
      $doc = $(document),
      $win = $(window),
      Selectric = function(element, opts) {
        var _this = this,
            $original = $(element),
            $input, $items, $itemsScroll, $wrapper, $label, $outerWrapper, $li,
            isOpen = false,
            isEnabled = false,
            selected,
            currValue,
            itemsHeight,
            itemsInnerHeight,
            finalWidth,
            optionsLength,
            eventTriggers,
            isMobile = /android|ip(hone|od|ad)/i.test(navigator.userAgent),
            tabindex = $original.prop('tabindex');

        function _init(opts) {
          _this.options = $.extend(true, {}, defaults, _this.options, opts);
          _this.classes = {};
          _this.element = element;

          _utils.triggerCallback('BeforeInit', _this);

          // Disable on mobile browsers
          if ( _this.options.disableOnMobile && isMobile ) {
            _this.disableOnMobile = true;
            return;
          }

          // Preserve data
          _destroy(true);

          // Generate classNames for elements
          var customClass   = _this.options.customClass,
              postfixes     = customClass.postfixes.split(' '),
              originalWidth = $original.width();

          $.each(classList.split(' '), function(i, elm) {
            var c = customClass.prefix + postfixes[i];
            _this.classes[elm.toLowerCase()] = customClass.camelCase ? c : _utils.toDash(c);
          });

          $input        = $('<input/>', { 'class': _this.classes.input, 'readonly': isMobile });
          $items        = $('<div/>',   { 'class': _this.classes.items, 'tabindex': -1 });
          $itemsScroll  = $('<div/>',   { 'class': _this.classes.scroll });
          $wrapper      = $('<div/>',   { 'class': customClass.prefix, 'html': _this.options.arrowButtonMarkup });
          $label        = $('<p class="label"/>');
          $outerWrapper = $original.wrap('<div>').parent().append($wrapper.prepend($label), $items, $input);

          eventTriggers = {
            open    : _open,
            close   : _close,
            destroy : _destroy,
            refresh : _refresh,
            init    : _init
          };

          $original.on(eventTriggers).wrap('<div class="' + _this.classes.hideselect + '">');
          $.extend(_this, eventTriggers);

          if ( _this.options.inheritOriginalWidth && originalWidth > 0 )
            $outerWrapper.width(originalWidth);

          _populate();
        }

        // Generate options markup and event binds
        function _populate() {
          _this.items = [];

          var $options = $original.children(),
              _$li = '<ul>',
              selectedIndex = $options.filter(':selected').index(),
              currIndex = 0;

          currValue = (selected = ~selectedIndex ? selectedIndex : 0);

          if ( optionsLength = $options.length ) {
            // Build options markup
            $options.each(function() {
              var $elm = $(this);

              if ( $elm.is('optgroup') ) {
                var groupDisabled = $elm.prop('disabled'),
                    $children = $elm.children();

                _$li += _utils.format('<ul class="{1}"><li class="{2}">{3}</li>',
                  $.trim([_this.classes.group, groupDisabled ? 'disabled' : '', $elm.prop('class')].join(' ')),
                  _this.classes.grouplabel,
                  $elm.prop('label')
                );

                if ( groupDisabled ) {
                  $children.prop('disabled', true);
                }

                $children.each(buildOption);

                _$li += '</ul>';
              } else {
                buildOption.call($elm);
              }

              function buildOption() {
                var $elm = $(this),
                    optionText = $elm.html(),
                    selectDisabled = $elm.prop('disabled'),
                    itemBuilder = _this.options.optionsItemBuilder;

                _this.items[currIndex] = {
                  element  : $elm,
                  value    : $elm.val(),
                  text     : optionText,
                  slug     : _utils.replaceDiacritics(optionText),
                  disabled : selectDisabled
                };

                _$li += _utils.format('<li data-index="{1}" class="{2}">{3}</li>',
                  currIndex,
                  $.trim([currIndex == currValue ? 'selected' : '', currIndex == optionsLength - 1 ? 'last' : '', selectDisabled ? 'disabled' : ''].join(' ')),
                  $.isFunction(itemBuilder) ? itemBuilder(_this.items[currIndex], $elm, currIndex) : _utils.format(itemBuilder, _this.items[currIndex])
                );

                currIndex++;
              }
            });

            $items.append( $itemsScroll.html(_$li + '</ul>') );

            $label.html(_this.items[currValue].text);
          }

          $wrapper.add($original).add($outerWrapper).add($input).off(bindSufix);

          $outerWrapper.prop('class', [
            _this.classes.wrapper,
            _this.options.customClass.overwrite ?
              $original.prop('class').replace(/\S+/g, _this.options.customClass.prefix + '-$&') :
              $original.prop('class'),
            _this.options.responsive ? _this.classes.responsive : ''
          ].join(' '));

          if ( !$original.prop('disabled') ) {
            isEnabled = true;

            // Not disabled, so... Removing disabled class and bind hover
            $outerWrapper.removeClass(_this.classes.disabled).on('mouseenter' + bindSufix + ' mouseleave' + bindSufix, function(e) {
              $(this).toggleClass(_this.classes.hover);

              // Delay close effect when openOnHover is true
              if ( _this.options.openOnHover ) {
                clearTimeout(_this.closeTimer);
                e.type == 'mouseleave' ? _this.closeTimer = setTimeout(_close, _this.options.hoverIntentTimeout) : _open();
              }
            });

            // Toggle open/close
            $wrapper.on('click' + bindSufix, function(e) {
              isOpen ? _close() : _open(e);
            });

            $input
              .prop({
                tabindex: tabindex,
                disabled: false
              })
              .on('keypress' + bindSufix, _handleSystemKeys)
              .on('keydown' + bindSufix, function(e) {
                _handleSystemKeys(e);

                // Clear search
                clearTimeout(_this.resetStr);
                _this.resetStr = setTimeout(function() {
                  $input.val('');
                }, _this.options.keySearchTimeout);

                var key = e.keyCode || e.which;

                // If it's a directional key
                // 37 => Left
                // 38 => Up
                // 39 => Right
                // 40 => Down
                if ( key > 36 && key < 41 ) {
                  if ( !_this.options.allowWrap ) {
                    if ( (key < 39 && selected == 0) || (key > 38 && (selected + 1) == _this.items.length) ) {
                      return;
                    }
                  }

                  _select(_utils[(key < 39 ? 'previous' : 'next') + 'EnabledItem'](_this.items, selected));
                }
              })
              .on('focusin' + bindSufix, function(e) {
                // Stupid, but necessary... Prevent the flicker when
                // focusing out and back again in the browser window
                $input.one('blur', function() {
                  $input.blur();
                });

                isOpen || _open(e);
              })
              .on('oninput' in $input[0] ? 'input' : 'keyup', function() {
                if ( $input.val().length ) {
                  // Search in select options
                  $.each(_this.items, function(i, elm) {
                    if ( RegExp('^' + $input.val(), 'i').test(elm.slug) && !elm.disabled ) {
                      _select(i);
                      return false;
                    }
                  });
                }
              });

            $original.prop('tabindex', false);

            // Remove styles from items box
            // Fix incorrect height when refreshed is triggered with fewer options
            $li = $('li', $items.removeAttr('style')).on({
              // Prevent <input> blur on Chrome
              mousedown: function(e) {
                e.preventDefault();
                e.stopPropagation();
              },
              click: function() {
                // The second parameter is to close the box after click
                _select($(this).data('index'), true);

                // Chrome doesn't close options box if select is wrapped with a label
                // We need to 'return false' to avoid that
                return false;
              }
            }).filter('[data-index]');
          } else {
            $outerWrapper.addClass(_this.classes.disabled);
            $input.prop('disabled', true);
          }

          _utils.triggerCallback('Init', _this);
        }

        function _refresh() {
          _utils.triggerCallback('Refresh', _this);
          _populate();
        }

        // Behavior when system keys is pressed
        function _handleSystemKeys(e) {
          var key = e.keyCode || e.which;

          if ( key == 13 ) {
            e.preventDefault();
          }

          // Tab / Enter / ESC
          if ( /^(9|13|27)$/.test(key) ) {
            e.stopPropagation();
            _select(selected, true);
          }
        }

        // Set options box width/height
        function _calculateOptionsDimensions() {
          var visibleParent = $items.closest(':visible').children(':hidden'),
              maxHeight = _this.options.maxHeight;

          // Calculate options box height
          // Set a temporary class on the hidden parent of the element
          visibleParent.addClass(_this.classes.tempshow);

          var itemsWidth = $items.outerWidth(),
              wrapperWidth = $wrapper.outerWidth() - (itemsWidth - $items.width());

          // Set the dimensions, minimum is wrapper width, expand for long items if option is true
          if ( !_this.options.expandToItemText || wrapperWidth > itemsWidth )
            finalWidth = wrapperWidth;
          else {
            // Make sure the scrollbar width is included
            $items.css('overflow', 'scroll');

            // Set a really long width for $outerWrapper
            $outerWrapper.width(9e4);
            finalWidth = $items.width();
            // Set scroll bar to auto
            $items.css('overflow', '');
            $outerWrapper.width('');
          }

          $items.width(finalWidth).height() > maxHeight && $items.height(maxHeight);

          // Remove the temporary class
          visibleParent.removeClass(_this.classes.tempshow);
        }

        // Open the select options box
        function _open(e) {
          _utils.triggerCallback('BeforeOpen', _this);

          if ( e ) {
            e.preventDefault();
            e.stopPropagation();
          }

          if ( isEnabled ) {
            _calculateOptionsDimensions();

            // Find any other opened instances of select and close it
            $('.' + _this.classes.hideselect, '.' + _this.classes.open).children()[pluginName]('close');

            isOpen = true;
            itemsHeight = $items.outerHeight();
            itemsInnerHeight = $items.height();

            // Give dummy input focus
            $input.val('').is(':focus') || $input.focus();

            $doc.on('click' + bindSufix, _close).on('scroll' + bindSufix, _isInViewport);
            _isInViewport();

            // Prevent window scroll when using mouse wheel inside items box
            if ( _this.options.preventWindowScroll ) {
              $doc.on('mousewheel' + bindSufix + ' DOMMouseScroll' + bindSufix, '.' + _this.classes.scroll, function(e) {
                var orgEvent = e.originalEvent,
                    scrollTop = $(this).scrollTop(),
                    deltaY = 0;

                if ( 'detail'      in orgEvent ) { deltaY = orgEvent.detail * -1; }
                if ( 'wheelDelta'  in orgEvent ) { deltaY = orgEvent.wheelDelta;  }
                if ( 'wheelDeltaY' in orgEvent ) { deltaY = orgEvent.wheelDeltaY; }
                if ( 'deltaY'      in orgEvent ) { deltaY = orgEvent.deltaY * -1; }

                if ( scrollTop == (this.scrollHeight - itemsInnerHeight) && deltaY < 0 || scrollTop == 0 && deltaY > 0 ) {
                  e.preventDefault();
                }
              });
            }

            // Toggle options box visibility
            $outerWrapper.addClass(_this.classes.open);
            _detectItemVisibility(selected);

            _utils.triggerCallback('Open', _this);
          }
        }

        // Detect is the options box is inside the window
        function _isInViewport() {
          _calculateOptionsDimensions();
          $outerWrapper.toggleClass(_this.classes.above, $outerWrapper.offset().top + $outerWrapper.outerHeight() + itemsHeight > $win.scrollTop() + $win.height());
        }

        // Close the select options box
        function _close() {
          _utils.triggerCallback('BeforeClose', _this);

          if ( currValue != selected ) {
            _utils.triggerCallback('BeforeChange', _this);

            var text = _this.items[selected].text;

            // Apply changed value to original select
            $original
              .prop('selectedIndex', currValue = selected)
              .data('value', text);

            // Change label text
            $label.html(text);

            _utils.triggerCallback('Change', _this);
          }

          // Remove custom events on document
          $doc.off(bindSufix);

          // Remove visible class to hide options box
          $outerWrapper.removeClass(_this.classes.open);

          isOpen = false;

          _utils.triggerCallback('Close', _this);
        }

        // Select option
        function _select(index, close) {
          // Parameter index is required
          if ( index == undefined ) {
            return;
          }

          // If element is disabled, can't select it
          if ( !_this.items[index].disabled ) {
            // If 'close' is false (default), the options box won't close after
            // each selected item, this is necessary for keyboard navigation
            $li
              .removeClass('selected')
              .eq(selected = index)
              .addClass('selected');

            _detectItemVisibility(index);
            close && _close();
          }
        }

        // Detect if currently selected option is visible and scroll the options box to show it
        function _detectItemVisibility(index) {
          var liHeight = $li.eq(index).outerHeight(),
              liTop = $li[index].offsetTop,
              itemsScrollTop = $itemsScroll.scrollTop(),
              scrollT = liTop + liHeight * 2;

          $itemsScroll.scrollTop(
            scrollT > itemsScrollTop + itemsHeight ? scrollT - itemsHeight :
              liTop - liHeight < itemsScrollTop ? liTop - liHeight :
                itemsScrollTop
          );
        }

        // Unbind and remove
        function _destroy(preserveData) {
          if ( isEnabled ) {
            $items.add($wrapper).add($input).remove();
            !preserveData && $original.removeData(pluginName).removeData('value');
            $original.prop('tabindex', tabindex).off(bindSufix).off(eventTriggers).unwrap().unwrap();
            isEnabled = false;
          }
        }

        _init(opts);
      };

  // A really lightweight plugin wrapper around the constructor,
  // preventing against multiple instantiations
  $.fn[pluginName] = function(args) {
    return this.each(function() {
      var data = $.data(this, pluginName);

      if ( data && !data.disableOnMobile )
        (''+args === args && data[args]) ? data[args]() : data.init(args);
      else
        $.data(this, pluginName, new Selectric(this, args));
    });
  };

  $.fn[pluginName].hooks = hooks;
}(jQuery));
/*!
 * jQuery Smart Banner
 * Copyright (c) 2012 Arnold Daniels <arnold@jasny.net>
 * Based on 'jQuery Smart Web App Banner' by Kurt Zenisek @ kzeni.com
 */
!function ($) {
    var SmartBanner = function (options) {
        this.origHtmlMargin = parseFloat($('html').css('margin-top')) // Get the original margin-top of the HTML element so we can take that into account
        this.options = $.extend({}, $.smartbanner.defaults, options)

        var standalone = navigator.standalone // Check if it's already a standalone web app or running within a webui view of an app (not mobile safari)
          , UA = navigator.userAgent

        // Detect banner type (iOS or Android)
        if (this.options.force) {
            this.type = this.options.force
        } else if (UA.match(/Windows Phone 8/i) != null && UA.match(/Touch/i) !== null) {
            this.type = 'windows'
        } else if (UA.match(/iPhone|iPod/i) != null || (UA.match(/iPad/) && this.options.iOSUniversalApp)) {
            if (UA.match(/Safari/i) != null &&
               (UA.match(/CriOS/i) != null ||
               window.Number(UA.substr(UA.indexOf('OS ') + 3, 3).replace('_', '.')) < 6)) this.type = 'ios' // Check webview and native smart banner support (iOS 6+)
        } else if (UA.match(/\bSilk\/(.*\bMobile Safari\b)?/) || UA.match(/\bKF\w/) || UA.match('Kindle Fire')) {
            this.type = 'kindle'
        } else if (UA.match(/Android/i) != null) {
            this.type = 'android'
        }

        // Don't show banner if device isn't iOS or Android, website is loaded in app or user dismissed banner
        if (!this.type || standalone || this.getCookie('sb-closed') || this.getCookie('sb-installed')) {
            return
        }

        // Calculate scale
        this.scale = this.options.scale == 'auto' ? $(window).width() / window.screen.width : this.options.scale
        if (this.scale < 1) this.scale = 1

        // Get info from meta data
        var meta = $(this.type == 'android' ? 'meta[name="google-play-app"]' :
            this.type == 'ios' ? 'meta[name="apple-itunes-app"]' :
            this.type == 'kindle' ? 'meta[name="kindle-fire-app"]' : 'meta[name="msApplication-ID"]');
        if (meta.length == 0) return

        // For Windows Store apps, get the PackageFamilyName for protocol launch
        if (this.type == 'windows') {
            this.appId = $('meta[name="msApplication-PackageFamilyName"]').attr('content');
        } else {
            // Try to pull the appId out of the meta tag and store the result
            var parsedMetaContent = /app-id=([^\s,]+)/.exec(meta.attr('content'));

            if(parsedMetaContent) {
              this.appId = parsedMetaContent[1];
            } else {
              return;
            }
        }

        this.title = this.options.title ? this.options.title : meta.data('title') || $('title').text().replace(/\s*[|\-·].*$/, '')
        this.author = this.options.author ? this.options.author : meta.data('author') || ($('meta[name="author"]').length ? $('meta[name="author"]').attr('content') : window.location.hostname)
        this.iconUrl = meta.data('icon-url');
        this.price = meta.data('price');

        // Create banner
        this.create()
        this.show()
        this.listen()
    }

    SmartBanner.prototype = {

        constructor: SmartBanner

      , create: function() {
            var iconURL
              , link=(this.options.url ? this.options.url : (this.type == 'windows' ? 'ms-windows-store:navigate?appid=' : (this.type == 'android' ? 'market://details?id=' : (this.type == 'kindle' ? 'amzn://apps/android?asin=' : 'https://itunes.apple.com/' + this.options.appStoreLanguage + '/app/id'))) + this.appId)
              , price = this.price || this.options.price
              , inStore=price ? price + ' - ' + (this.type == 'android' ? this.options.inGooglePlay : this.type == 'kindle' ? this.options.inAmazonAppStore : this.type == 'ios' ? this.options.inAppStore : this.options.inWindowsStore) : ''
              , gloss=this.options.iconGloss === null ? (this.type=='ios') : this.options.iconGloss

            if (this.type == 'android' && this.options.GooglePlayParams) {
              link = link + '&referrer=' + this.options.GooglePlayParams;
            }

            var banner = '<div id="smartbanner" class="'+this.type+'"><div class="sb-container"><a href="#" class="sb-close">&times;</a><span class="sb-icon"></span><div class="sb-info"><strong>'+this.title+'</strong><span>'+this.author+'</span><span>'+inStore+'</span></div><a href="'+link+'" class="sb-button"><span>'+this.options.button+'</span></a></div></div>';
            (this.options.layer) ? $(this.options.appendToSelector).append(banner) : $(this.options.appendToSelector).prepend(banner);

            if (this.options.icon) {
                iconURL = this.options.icon
            } else if(this.iconUrl) {
                iconURL = this.iconUrl;
            } else if ($('link[rel="apple-touch-icon-precomposed"]').length > 0) {
                iconURL = $('link[rel="apple-touch-icon-precomposed"]').attr('href')
                if (this.options.iconGloss === null) gloss = false
            } else if ($('link[rel="apple-touch-icon"]').length > 0) {
                iconURL = $('link[rel="apple-touch-icon"]').attr('href')
            } else if ($('meta[name="msApplication-TileImage"]').length > 0) {
              iconURL = $('meta[name="msApplication-TileImage"]').attr('content')
            } else if ($('meta[name="msapplication-TileImage"]').length > 0) { /* redundant because ms docs show two case usages */
              iconURL = $('meta[name="msapplication-TileImage"]').attr('content')
            }

            if (iconURL) {
                $('#smartbanner .sb-icon').css('background-image','url('+iconURL+')')
                if (gloss) $('#smartbanner .sb-icon').addClass('gloss')
            } else{
                $('#smartbanner').addClass('no-icon')
            }

            this.bannerHeight = $('#smartbanner').outerHeight() + 2

            if (this.scale > 1) {
                $('#smartbanner')
                    .css('top', parseFloat($('#smartbanner').css('top')) * this.scale)
                    .css('height', parseFloat($('#smartbanner').css('height')) * this.scale)
                    .hide()
                $('#smartbanner .sb-container')
                    .css('-webkit-transform', 'scale('+this.scale+')')
                    .css('-msie-transform', 'scale('+this.scale+')')
                    .css('-moz-transform', 'scale('+this.scale+')')
                    .css('width', $(window).width() / this.scale)
            }
            $('#smartbanner').css('position', (this.options.layer) ? 'absolute' : 'static')
        }

      , listen: function () {
            $('#smartbanner .sb-close').on('click',$.proxy(this.close, this))
            $('#smartbanner .sb-button').on('click',$.proxy(this.install, this))
        }

      , show: function(callback) {
            var banner = $('#smartbanner');
            banner.stop();

            if (this.options.layer) {
                banner.animate({top: 0, display: 'block'}, this.options.speedIn).addClass('shown').show();
                $(this.pushSelector).animate({paddingTop: this.origHtmlMargin + (this.bannerHeight * this.scale)}, this.options.speedIn, 'swing', callback);
            } else {
                if ($.support.transition) {
                    banner.animate({top:0},this.options.speedIn).addClass('shown');
                    var transitionCallback = function() {
                        $('html').removeClass('sb-animation');
                        if (callback) {
                            callback();
                        }
                    };
                    $(this.pushSelector).addClass('sb-animation').one($.support.transition.end, transitionCallback).emulateTransitionEnd(this.options.speedIn).css('margin-top', this.origHtmlMargin+(this.bannerHeight*this.scale));
                } else {
                    banner.slideDown(this.options.speedIn).addClass('shown');
                }
            }
        }

      , hide: function(callback) {
            var banner = $('#smartbanner');
            banner.stop();

            if (this.options.layer) {
                banner.animate({top: -1 * this.bannerHeight * this.scale, display: 'block'}, this.options.speedIn).removeClass('shown');
                $(this.pushSelector).animate({paddingTop: this.origHtmlMargin}, this.options.speedIn, 'swing', callback);
            } else {
                if ($.support.transition) {
                    if ( this.type !== 'android' )
                      banner.css('top', -1*this.bannerHeight*this.scale).removeClass('shown');
                    else
                      banner.css({display:'none'}).removeClass('shown');
                    var transitionCallback = function() {
                        $('html').removeClass('sb-animation');
                        if (callback) {
                            callback();
                        }
                    };
                    $(this.pushSelector).addClass('sb-animation').one($.support.transition.end, transitionCallback).emulateTransitionEnd(this.options.speedOut).css('margin-top', this.origHtmlMargin);
                } else {
                    banner.slideUp(this.options.speedOut).removeClass('shown');
                }
            }
        }

      , close: function(e) {
            e.preventDefault()
            this.hide()
            this.setCookie('sb-closed','true',this.options.daysHidden);
        }

      , install: function(e) {
            if (this.options.hideOnInstall) {
                this.hide()
            }
            this.setCookie('sb-installed','true',this.options.daysReminder)
        }

      , setCookie: function(name, value, exdays) {
            var exdate = new Date()
            exdate.setDate(exdate.getDate()+exdays)
            value=encodeURI(value)+((exdays==null)?'':'; expires='+exdate.toUTCString())
            document.cookie=name+'='+value+'; path=/;'
        }

      , getCookie: function(name) {
            var i,x,y,ARRcookies = document.cookie.split(";")
            for(i=0;i<ARRcookies.length;i++) {
                x = ARRcookies[i].substr(0,ARRcookies[i].indexOf("="))
                y = ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1)
                x = x.replace(/^\s+|\s+$/g,"")
                if (x==name) {
                    return decodeURI(y)
                }
            }
            return null
        }

      // Demo only
      , switchType: function() {
          var that = this

          this.hide(function () {
              that.type = that.type == 'android' ? 'ios' : 'android'
              var meta = $(that.type == 'android' ? 'meta[name="google-play-app"]' : 'meta[name="apple-itunes-app"]').attr('content')
              that.appId = /app-id=([^\s,]+)/.exec(meta)[1]

              $('#smartbanner').detach()
              that.create()
              that.show()
          })
      }
    }

    $.smartbanner = function (option) {
        var $window = $(window)
        , data = $window.data('smartbanner')
        , options = typeof option == 'object' && option
        if (!data) $window.data('smartbanner', (data = new SmartBanner(options)))
        if (typeof option == 'string') data[option]()
    }

    // override these globally if you like (they are all optional)
    $.smartbanner.defaults = {
        title: null, // What the title of the app should be in the banner (defaults to <title>)
        author: null, // What the author of the app should be in the banner (defaults to <meta name="author"> or hostname)
        price: 'FREE', // Price of the app
        appStoreLanguage: 'us', // Language code for App Store
        inAppStore: 'On the App Store', // Text of price for iOS
        inGooglePlay: 'In Google Play', // Text of price for Android
        inAmazonAppStore: 'In the Amazon Appstore',
        inWindowsStore: 'In the Windows Store', //Text of price for Windows
        GooglePlayParams: null, // Aditional parameters for the market
        icon: null, // The URL of the icon (defaults to <meta name="apple-touch-icon">)
        iconGloss: null, // Force gloss effect for iOS even for precomposed
        button: 'VIEW', // Text for the install button
        url: null, // The URL for the button. Keep null if you want the button to link to the app store.
        scale: 'auto', // Scale based on viewport size (set to 1 to disable)
        speedIn: 300, // Show animation speed of the banner
        speedOut: 400, // Close animation speed of the banner
        daysHidden: 15, // Duration to hide the banner after being closed (0 = always show banner)
        daysReminder: 90, // Duration to hide the banner after "VIEW" is clicked *separate from when the close button is clicked* (0 = always show banner)
        force: null, // Choose 'ios', 'android' or 'windows'. Don't do a browser check, just always show this banner
        hideOnInstall: true, // Hide the banner after "VIEW" is clicked.
        layer: false, // Display as overlay layer or slide down the page
        iOSUniversalApp: true, // If the iOS App is a universal app for both iPad and iPhone, display Smart Banner to iPad users, too.
        appendToSelector: 'body', //Append the banner to a specific selector
        pushSelector: 'html' // What element is going to push the site content down; this is where the banner append animation will start.
    }

    $.smartbanner.Constructor = SmartBanner;


    // ============================================================
    // Bootstrap transition
    // Copyright 2011-2014 Twitter, Inc.
    // Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)

    function transitionEnd() {
        var el = document.createElement('smartbanner')

        var transEndEventNames = {
            WebkitTransition: 'webkitTransitionEnd',
            MozTransition: 'transitionend',
            OTransition: 'oTransitionEnd otransitionend',
            transition: 'transitionend'
        }

        for (var name in transEndEventNames) {
            if (el.style[name] !== undefined) {
                return {end: transEndEventNames[name]}
            }
        }

        return false // explicit for ie8 (  ._.)
    }

    if ($.support.transition !== undefined)
        return  // Prevent conflict with Twitter Bootstrap

    // http://blog.alexmaccaw.com/css-transitions
    $.fn.emulateTransitionEnd = function(duration) {
        var called = false, $el = this
        $(this).one($.support.transition.end, function() {
            called = true
        })
        var callback = function() {
            if (!called) $($el).trigger($.support.transition.end)
        }
        setTimeout(callback, duration)
        return this
    }

    $(function() {
        $.support.transition = transitionEnd()
    })
    // ============================================================

}(window.jQuery);

/*	
 *	jQuery validVal version 4.4.0
 *	demo's and documentation:
 *	validval.frebsite.nl
 *
 *	Copyright (c) 2013 Fred Heusschen
 *	www.frebsite.nl
 *
 *	Dual licensed under the MIT and GPL licenses.
 *	http://en.wikipedia.org/wiki/MIT_License
 *	http://en.wikipedia.org/wiki/GNU_General_Public_License
 */


(function(a){function c(b,c,d,e){if(!c||!e||!e[3])return!1;var f=q(a(c),b);return f.length?f==e[3]:!1}function d(a){return p(a,"placeholder")}function e(a){return x(a.val())==q(a,"placeholder-value")?!0:!1}function f(a){if(d(a)&&e(a)&&!a.is("select")&&(a.val(""),a.removeClass(w("inactive")),p(a,"passwordplaceholder")))try{a[0].type="password"}catch(b){}}function g(a){if(d(a)&&""==x(a.val())&&!a.is("select")&&(a.val(q(a,"placeholder-value")),a.addClass(w("inactive")),p(a,"passwordplaceholder")))try{a[0].type="text"}catch(b){}}function h(a){return p(a,"corresponding")}function i(a){return p(a,"validationgroup")}function j(c,d){if(i(c)){var e=q(c,"validationgroup");e.length&&a(b).filter(":vv-validationgroup("+e+")").not(c).each(function(){a(this).trigger("isValid.vv",[d,!0])})}}function k(a,b,c){"function"==typeof c.fields.onValid&&c.fields.onValid.call(a[0],b,c.language)}function l(a,b,c){"function"==typeof c.fields.onInvalid&&c.fields.onInvalid.call(a[0],b,c.language)}function m(a,b){return a.attr(b)===void 0?!1:"false"===a.attr(b)||a.attr(b)===!1?!1:!0}function n(a,b){if(a.attr("type")==b)return!0;if(a.is('input[type="'+b+'"]'))return!0;var c=v(a);return-1!=c.indexOf('type="'+b+'"')||-1!=c.indexOf("type='"+b+"'")||-1!=c.indexOf("type="+b)?!0:!1}function o(b,c){var d=b.attr("class"),e=b.attr("alt");e&&e.length>0&&!b.hasClass("pattern")&&(b.hasClass("corresponding")&&(a.fn.validVal.deprecated('name in "alt"-attribute','class="corresponding:name"'),b.removeClass("corresponding"),b.removeAttr("alt"),c.supportHtml5?b.data("vv-corresponding",e):b.addClass("corresponding:"+e)),b.hasClass("required")&&(a.fn.validVal.deprecated('grouping required elements in the "alt"-attribute','class="requiredgroup:name"'),b.removeClass("required"),b.removeAttr("alt"),c.supportHtml5?b.data("vv-requiredgroup",e):b.addClass("requiredgroup:"+e))),d&&-1!=d.indexOf("required:")&&a.fn.validVal.deprecated('grouping required elements with class="required:name"','class="requiredgroup:name"');var f=[],g=t(b,c);if(c.supportHtml5){var h=q(b,"validations");h.length&&f.push(h),m(b,"placeholder")&&b.attr("placeholder").length>0&&(a.fn.validVal.support.placeholder&&-1!=a.inArray("placeholder",c.keepAttributes)||b.data("vv-placeholder-value",b.attr("placeholder")));var i=q(b,"placeholder-value");i.length&&(r(b,"placeholder",c),f.push("placeholder")),m(b,"pattern")&&b.attr("pattern").length>0&&(b.data("vv-pattern",b.attr("pattern")),r(b,"pattern",c),f.push("pattern"));for(var j=["corresponding","requiredgroup","validationgroup"],k=0,l=j.length;l>k;k++)q(b,j[k]).length&&f.push(j[k]);for(var o=["required","autofocus"],p=0,l=o.length;l>p;p++)m(b,o[p])&&(f.push(o[p]),r(b,o[p],c));for(var v=["number","email","url"],w=0,l=v.length;l>w;w++)n(b,v[w])&&f.push(v[w])}var d=b.attr("class");if(d&&d.length){b.hasClass("placeholder")&&(s(b,"placeholder",c),b.data("vv-placeholder-value",g),f.push("placeholder"),g="");var x="corresponding:",y=d.indexOf(x);if(-1!=y){var z=d.substr(y).split(" ")[0],A=z.substr(x.length);A.length&&(b.removeClass(z),b.data("vv-corresponding",A),f.push("corresponding"))}b.hasClass("pattern")&&(s(b,"pattern",c),b.data("vv-pattern",u(b,"alt")),r(b,"alt",c),f.push("pattern"));for(var B=["requiredgroup","validationgroup"],C=0,l=B.length;l>C;C++){var D=B[C]+":",y=d.indexOf(D);if(-1!=y){var E=d.substr(y).split(" ")[0],F=E.substr(D.length);F.length&&(b.removeClass(E),b.data("vv-"+B[C],F),f.push(B[C]))}}}if(b.is('[type="password"]')){var k=" "+f.join(" ")+" ";-1!=k.indexOf(" placeholder ")&&f.push("passwordplaceholder")}var d=b.attr("class");d&&d.length&&f.push(d),b.data("vv-validations",f.join(" ")),b.data("vv-original-value",g)}function p(a,b){var c=" "+q(a,"validations")+" ";return-1!=c.indexOf(" "+b+" ")}function q(a,b){var c=a.data("vv-"+b);return c===void 0&&(c=""),c}function r(b,c,d){-1==a.inArray(c,d.keepAttributes)&&b.removeAttr(c)}function s(b,c,d){-1==a.inArray(c,d.keepClasses)&&b.removeClass(c)}function t(b,c){var d=v(b);if(b.is("select")){var e=0,f=q(b,"placeholder-number");return f.length?e=f:"number"==typeof c.selectPlaceholder?e=c.selectPlaceholder:b.find("> option").each(function(b){d=v(a(this));var c=d.split("'").join('"').split('"').join("");c=c.substr(0,c.indexOf(">")),c.indexOf("selected=selected")>-1&&(e=b)}),b.data("vv-placeholder-number",e),u(b.find("> option:nth("+e+")"))}return b.is("textarea")?(d=d.substr(d.indexOf(">")+1),d=d.substr(0,d.indexOf("</textarea"))):u(b)}function u(a,b){b===void 0&&(b="value");var c=v(a),d=c.toLowerCase();if(d.indexOf(b+"=")>-1){c=c.substr(d.indexOf(b+"=")+(b.length+1));var e=c.substr(0,1);return'"'==e||"'"==e?(c=c.substr(1),c=c.substr(0,c.indexOf(e))):c=c.substr(0,c.indexOf(" ")),c}return""}function v(b){return a("<div></div>").append(b.clone()).html()}function w(a){return"undefined"!=typeof clss&&clss[a]!==void 0?clss[a]:a}function x(a){if(null===a)return"";if("object"==typeof a){var b=[];for(var c in a)b[c]=x(a[c]);return b}return"string"!=typeof a?"":0==a.length?"":a.replace(/^\s\s*/,"").replace(/\s\s*$/,"")}function y(a){if(null===a)return"";if("object"==typeof a){for(var b in a)a[b]=y(a[b]);return a}if("string"!=typeof a)return"";if(0==a.length)return"";a=x(a);for(var c=[" ","-","+","(",")","/","\\"],d=0,e=c.length;e>d;d++)a=a.split(c[d]).join("");return a}function z(a){switch(a){case 9:case 13:case 16:case 17:case 18:case 37:case 38:case 39:case 40:case 224:return!0;default:return!1}}if(!a.fn.validVal){var b='textarea, select, input:not( [type="button"], [type="submit"], [type="reset"] )';a.fn.validVal=a.fn.validval=function(c,i,m){if(this.length>1)return this.each(function(){a(this).validVal(c,i,m)});"boolean"==typeof c?(m=c,c=null):"boolean"==typeof i&&(m=i,i=null);var n=this,r=a.extend(!0,{},a.fn.validVal.defaults,c);return a.extend(!0,{},a.fn.validVal.classes,i),"function"==typeof r.invalidFormFunc&&(a.fn.validVal.deprecated('callback function "invalidFormFunc"','"form.onInvalid"'),r.form.onInvalid=r.invalidFormFunc),"function"==typeof r.onSubmit&&(a.fn.validVal.deprecated('callback function "onSubmit"','"form.onValid"'),r.form.onValid=r.onSubmit),"function"==typeof r.onReset&&(a.fn.validVal.deprecated('callback function "onReset"','"form.onReset"'),r.form.onReset=r.onReset),"function"==typeof r.validFieldFunc&&(a.fn.validVal.deprecated('callback function "validFieldFunc"','"fields.onValid"'),r.fields.onValid=r.validFieldFunc),"function"==typeof r.invalidFieldFunc&&(a.fn.validVal.deprecated('callback function "invalidFieldFunc"','"fields.onInvalid"'),r.fields.onInvalid=r.invalidFieldFunc),"boolean"==typeof r.validate.hiddenFields&&(a.fn.validVal.deprecated('option "validate.hiddenFields"','"validate.fields.hidden"'),r.validate.fields.hidden=r.validate.hiddenFields),"boolean"==typeof r.validate.disabledFields&&(a.fn.validVal.deprecated('option "validate.disabledFields"','"validate.fields.disabled"'),r.validate.fields.disabled=r.validate.disabledFields),q(n,"isValidVal")&&n.trigger("destroy.vv"),n.data("vv-isValidVal",!0),r.validations={},a.fn.validVal.customValidations&&(r.validations=a.extend(r.validations,a.fn.validVal.customValidations)),r.customValidations&&(r.validations=a.extend(r.validations,r.customValidations)),r.validations=a.extend(r.validations,a.fn.validVal.defaultValidations),n.bind("addField.vv",function(c,i){c.stopPropagation();var s=a(i);if(q(s,"isValidVal")&&s.trigger("destroy.vv"),s.data("vv-isValidVal",!0),o(s,r),s.bind("focus.vv",function(){f(s),s.addClass(w("focus"))}),s.bind("blur.vv",function(){s.removeClass(w("focus")),s.trigger("validate.vv",[r.validate.onBlur])}),s.bind("keyup.vv",function(a){z(a.keyCode)||s.trigger("validate.vv",[r.validate.onKeyup,!1])}),s.bind("validate.vv",function(b,c,d){if(b.stopPropagation(),c!==!1&&("boolean"!=typeof d&&(d=!0),s.data("vv-isValid","valid"),!(s.is(":hidden")&&!r.validate.fields.hidden||s.is(":disabled")&&!r.validate.fields.disabled))){d&&f(s),"function"==typeof r.fields.onValidate&&r.fields.onValidate.call(s[0],n,r.language);var e=!1,h=x(s.val());for(var i in r.validations){var k=r.validations[i];if(p(s,i)&&"function"==typeof k&&!k.call(s[0],h)){e=i;break}}var l=e?!1:!0,o=l?"invalid"!==c:"valid"!==c;return s.trigger("isValid.vv",[l,o,e]),j(s,l),d&&g(s),m&&e&&a.fn.validVal.debug("invalid validation: "+e),l}}),s.bind("isValid.vv",function(a,b,c){return a.stopPropagation(),"boolean"!=typeof b?"valid"==q(s,"isValid"):(b?(s.data("vv-isValid","valid"),c&&k(s,n,r)):(s.data("vv-isValid","NOT"),c&&l(s,n,r)),void 0)}),s.bind("validations.vv",function(a,b){return a.stopPropagation(),b===void 0?q(s,"validations").split(" "):(b instanceof Array&&(b=b.join(" ")),"string"==typeof b&&s.data("vv-validations",b),void 0)}),s.bind("addValidation.vv",function(a,b){a.stopPropagation();var c=q(s,"validations").split(" ");c.push(b),s.data("vv-validations",c.join(" "))}),s.bind("removeValidation.vv",function(a,b){a.stopPropagation();var c=" "+q(s,"validations")+" ";c=c.split(" "+b+" "),s.data("vv-validations",c.join(" "))}),s.bind("destroy.vv",function(a){a.stopPropagation(),s.unbind(".vv"),s.data("vv-isValidVal",!1)}),d(s)){if(""==s.val()&&s.val(q(s,"placeholder-value")),p(s,"passwordplaceholder")&&e(s))try{s[0].type="text"}catch(t){}e(s)&&s.addClass(w("inactive")),s.is("select")&&(s.find("option:eq("+q(s,"placeholder-number")+")").addClass(w("inactive")),s.bind("change.vv",function(){e(s)?s.addClass(w("inactive")):s.removeClass(w("inactive"))}))}if(h(s)&&a(b).filter('[name="'+s.data("vv-corresponding")+'"]').bind("blur.vv",function(){s.trigger("validate.vv",[r.validate.onBlur])}).bind("keyup.vv",function(a){z(a.keyCode)||s.trigger("validate.vv",[r.validate.onKeyup,!1])}),p(s,"autotab")){var u=s.attr("maxlength"),v=s.attr("tabindex"),y=a(b).filter('[tabindex="'+(parseInt(v)+1)+'"]');s.is("select")?v&&s.bind("change.vv",function(){y.length&&y.focus()}):u&&v&&s.bind("keyup.vv",function(a){s.val().length==u&&(z(a.keyCode)||(s.trigger("blur"),y.length&&y.focus()))})}p(s,"autofocus")&&!s.is(":disabled")&&s.focus()}),r.validate.fields.filter(a(b,n)).each(function(){n.trigger("addField.vv",[a(this)])}).filter('select, input[type="checkbox"], input[type="radio"]').bind("change.vv",function(){a(this).trigger("blur.vv")}),n.bind("destroy.vv",function(c){c.stopPropagation(),n.unbind(".vv"),r.validate.fields.filter(a(b,n)).trigger("destroy.vv"),n.data("vv-isValidVal",!1)}),n.bind("validate.vv",function(c,d,e){c.stopPropagation(),d===void 0?(d=n,e=!0):"boolean"!=typeof e&&(e=!1),"function"==typeof r.form.onValidate&&r.form.onValidate.call(n[0],r.language);var f=a(),g={};return r.validate.fields.filter(a(b,d)).each(function(){var b=a(this);if(q(b,"isValidVal")){b.trigger("validate.vv",[r.validate.onSubmit]);var c=b.val();"valid"==q(b,"isValid")?((b.is('[type="radio"]')||b.is('[type="checkbox"]'))&&(b.is(":checked")||(c="")),(c===void 0||null==c)&&(c=""),c.length>0&&(g[b.attr("name")]=c)):r.validate.onSubmit!==!1&&(f=f.add(b))}}),f.length>0?("function"==typeof r.form.onInvalid&&e&&r.form.onInvalid.call(n[0],f,r.language),!1):("function"==typeof r.form.onValid&&e&&r.form.onValid.call(n[0],r.language),g)}),n.bind("submitForm.vv",function(c){c.stopPropagation();var d=n.triggerHandler("validate.vv");return d&&r.validate.fields.filter(a(b,n)).each(function(){f(a(this))}),d}),n.bind("resetForm.vv",function(c){return c.stopPropagation(),"function"==typeof r.form.onReset&&r.form.onReset.call(n[0],r.language),r.validate.fields.filter(a(b,n)).each(function(){var b=a(this);d(b)?(b.addClass(w("inactive")),b.val(q(b,"placeholder-value"))):b.val(q(b,"original-value")),b.trigger("isValid.vv",[!0,!0])}),!1}),n.bind("options.vv",function(b,c){return b.stopPropagation(),"object"==typeof c&&(r=a.extend(r,c)),r}),n.is("form")&&(n.attr("novalidate","novalidate"),n.bind("submit.vv",function(){return n.triggerHandler("submitForm.vv")}),n.bind("reset.vv",function(){return n.triggerHandler("resetForm.vv")})),n},a.fn.validVal.version=[4,4,0],a.fn.validVal.defaults={selectPlaceholder:0,supportHtml5:!0,language:"en",customValidations:{},validate:{onBlur:!0,onSubmit:!0,onKeyup:!1,fields:{hidden:!1,disabled:!1,filter:function(a){return a}}},fields:{onValidate:null,onValid:function(){var b=a(this);b.add(b.parent()).removeClass(w("invalid"))},onInvalid:function(){var b=a(this);b.add(b.parent()).addClass(w("invalid"))}},form:{onReset:null,onValidate:null,onValid:null,onInvalid:function(a,b){switch(b){case"nl":msg="Let op, niet alle velden zijn correct ingevuld.";break;case"de":msg="Achtung, nicht alle Felder sind korrekt ausgefuellt.";break;case"es":msg="Atenci\u00f3n, no se han completado todos los campos correctamente.";break;case"en":default:msg="Attention, not all fields have been filled out correctly."}alert(msg),a.first().focus()}},keepClasses:["required"],keepAttributes:["pattern"]},a.fn.validVal.defaultValidations={required:function(b){var c=a(this);if(c.is('[type="radio"]')||c.is('[type="checkbox"]')){if(c.is('[type="radio"]')){var f=c.attr("name");f&&f.length>0&&(c=a('input[name="'+f+'"]'))}if(!c.is(":checked"))return!1}else if(c.is("select")){if(d(c)){if(e(c))return!1}else if(0==b.length)return!1}else if(0==b.length)return!1;return!0},Required:function(b){return a.fn.validVal.defaultValidations.required.call(this,b)},requiredgroup:function(){var d=a(this),e=q(d,"requiredgroup");e.length&&(d=a(b).filter(":vv-requiredgroup("+e+")"));var f=!1;return d.each(function(){var b=this;a.fn.validVal.defaultValidations.required.call(b,x(a(b).val()))&&(f=!0)}),f},corresponding:function(c){var d=a(b).filter('[name="'+q(a(this),"corresponding")+'"]');f(d);var e=x(d.val());return g(d),c==e},number:function(a){return a=y(a),0==a.length?!0:isNaN(a)?!1:!0},email:function(a){if(0==a.length)return!0;var b=/^([a-zA-Z0-9_\.\-+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;return b.test(a)},url:function(a){return 0==a.length?!0:(a.match(/^www\./)&&(a="http://"+a),a.match(/^(http\:\/\/|https\:\/\/)(.{4,})$/))},pattern:function(b){if(0==b.length)return!0;var c=a(this),d=q(c,"pattern");return"/"==d.substr(0,1)&&(d=d.substr(1)),"/"==d.substr(d.length-1)&&(d=d.substr(0,d.length-1)),RegExp(d).test(b)}},a.fn.validVal.classes={focus:"focus",invalid:"invalid",inactive:"inactive"},a.fn.validVal.debug=function(a){"undefined"!=typeof console&&console.log!==void 0&&console.log("validVal: "+a)},a.fn.validVal.deprecated=function(a,b){"undefined"!=typeof console&&console.error!==void 0&&console.error(a+" is DEPRECATED, use "+b+" instead.")},a.fn.validVal.support={touch:function(){return"ontouchstart"in document.documentElement}(),placeholder:function(){return"placeholder"in document.createElement("input")}()},a.expr[":"]["vv-requiredgroup"]=function(a,b,d){return c("requiredgroup",a,b,d)},a.expr[":"]["vv-validationgroup"]=function(a,b,d){return c("validationgroup",a,b,d)}}})(jQuery);
/* Modernizr 2.8.3 (Custom Build) | MIT & BSD
 * Build: http://modernizr.com/download/#-fontface-backgroundsize-borderradius-boxshadow-opacity-rgba-textshadow-cssanimations-csscolumns-generatedcontent-cssgradients-cssreflections-csstransforms-csstransforms3d-csstransitions-touch-cssclasses-addtest-prefixed-teststyles-testprop-testallprops-hasevent-prefixes-domprefixes
 */
;



window.Modernizr = (function( window, document, undefined ) {

    var version = '2.8.3',

    Modernizr = {},

    enableClasses = true,

    docElement = document.documentElement,

    mod = 'modernizr',
    modElem = document.createElement(mod),
    mStyle = modElem.style,

    inputElem  ,

    smile = ':)',

    toString = {}.toString,

    prefixes = ' -webkit- -moz- -o- -ms- '.split(' '),



    omPrefixes = 'Webkit Moz O ms',

    cssomPrefixes = omPrefixes.split(' '),

    domPrefixes = omPrefixes.toLowerCase().split(' '),


    tests = {},
    inputs = {},
    attrs = {},

    classes = [],

    slice = classes.slice,

    featureName, 


    injectElementWithStyles = function( rule, callback, nodes, testnames ) {

      var style, ret, node, docOverflow,
          div = document.createElement('div'),
                body = document.body,
                fakeBody = body || document.createElement('body');

      if ( parseInt(nodes, 10) ) {
                      while ( nodes-- ) {
              node = document.createElement('div');
              node.id = testnames ? testnames[nodes] : mod + (nodes + 1);
              div.appendChild(node);
          }
      }

                style = ['&#173;','<style id="s', mod, '">', rule, '</style>'].join('');
      div.id = mod;
          (body ? div : fakeBody).innerHTML += style;
      fakeBody.appendChild(div);
      if ( !body ) {
                fakeBody.style.background = '';
                fakeBody.style.overflow = 'hidden';
          docOverflow = docElement.style.overflow;
          docElement.style.overflow = 'hidden';
          docElement.appendChild(fakeBody);
      }

      ret = callback(div, rule);
        if ( !body ) {
          fakeBody.parentNode.removeChild(fakeBody);
          docElement.style.overflow = docOverflow;
      } else {
          div.parentNode.removeChild(div);
      }

      return !!ret;

    },



    isEventSupported = (function() {

      var TAGNAMES = {
        'select': 'input', 'change': 'input',
        'submit': 'form', 'reset': 'form',
        'error': 'img', 'load': 'img', 'abort': 'img'
      };

      function isEventSupported( eventName, element ) {

        element = element || document.createElement(TAGNAMES[eventName] || 'div');
        eventName = 'on' + eventName;

            var isSupported = eventName in element;

        if ( !isSupported ) {
                if ( !element.setAttribute ) {
            element = document.createElement('div');
          }
          if ( element.setAttribute && element.removeAttribute ) {
            element.setAttribute(eventName, '');
            isSupported = is(element[eventName], 'function');

                    if ( !is(element[eventName], 'undefined') ) {
              element[eventName] = undefined;
            }
            element.removeAttribute(eventName);
          }
        }

        element = null;
        return isSupported;
      }
      return isEventSupported;
    })(),


    _hasOwnProperty = ({}).hasOwnProperty, hasOwnProp;

    if ( !is(_hasOwnProperty, 'undefined') && !is(_hasOwnProperty.call, 'undefined') ) {
      hasOwnProp = function (object, property) {
        return _hasOwnProperty.call(object, property);
      };
    }
    else {
      hasOwnProp = function (object, property) { 
        return ((property in object) && is(object.constructor.prototype[property], 'undefined'));
      };
    }


    if (!Function.prototype.bind) {
      Function.prototype.bind = function bind(that) {

        var target = this;

        if (typeof target != "function") {
            throw new TypeError();
        }

        var args = slice.call(arguments, 1),
            bound = function () {

            if (this instanceof bound) {

              var F = function(){};
              F.prototype = target.prototype;
              var self = new F();

              var result = target.apply(
                  self,
                  args.concat(slice.call(arguments))
              );
              if (Object(result) === result) {
                  return result;
              }
              return self;

            } else {

              return target.apply(
                  that,
                  args.concat(slice.call(arguments))
              );

            }

        };

        return bound;
      };
    }

    function setCss( str ) {
        mStyle.cssText = str;
    }

    function setCssAll( str1, str2 ) {
        return setCss(prefixes.join(str1 + ';') + ( str2 || '' ));
    }

    function is( obj, type ) {
        return typeof obj === type;
    }

    function contains( str, substr ) {
        return !!~('' + str).indexOf(substr);
    }

    function testProps( props, prefixed ) {
        for ( var i in props ) {
            var prop = props[i];
            if ( !contains(prop, "-") && mStyle[prop] !== undefined ) {
                return prefixed == 'pfx' ? prop : true;
            }
        }
        return false;
    }

    function testDOMProps( props, obj, elem ) {
        for ( var i in props ) {
            var item = obj[props[i]];
            if ( item !== undefined) {

                            if (elem === false) return props[i];

                            if (is(item, 'function')){
                                return item.bind(elem || obj);
                }

                            return item;
            }
        }
        return false;
    }

    function testPropsAll( prop, prefixed, elem ) {

        var ucProp  = prop.charAt(0).toUpperCase() + prop.slice(1),
            props   = (prop + ' ' + cssomPrefixes.join(ucProp + ' ') + ucProp).split(' ');

            if(is(prefixed, "string") || is(prefixed, "undefined")) {
          return testProps(props, prefixed);

            } else {
          props = (prop + ' ' + (domPrefixes).join(ucProp + ' ') + ucProp).split(' ');
          return testDOMProps(props, prefixed, elem);
        }
    }    tests['touch'] = function() {
        var bool;

        if(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
          bool = true;
        } else {
          injectElementWithStyles(['@media (',prefixes.join('touch-enabled),('),mod,')','{#modernizr{top:9px;position:absolute}}'].join(''), function( node ) {
            bool = node.offsetTop === 9;
          });
        }

        return bool;
    };    tests['rgba'] = function() {
        setCss('background-color:rgba(150,255,150,.5)');

        return contains(mStyle.backgroundColor, 'rgba');
    };

    tests['backgroundsize'] = function() {
        return testPropsAll('backgroundSize');
    };    tests['borderradius'] = function() {
        return testPropsAll('borderRadius');
    };

    tests['boxshadow'] = function() {
        return testPropsAll('boxShadow');
    };

    tests['textshadow'] = function() {
        return document.createElement('div').style.textShadow === '';
    };


    tests['opacity'] = function() {
                setCssAll('opacity:.55');

                    return (/^0.55$/).test(mStyle.opacity);
    };


    tests['cssanimations'] = function() {
        return testPropsAll('animationName');
    };


    tests['csscolumns'] = function() {
        return testPropsAll('columnCount');
    };


    tests['cssgradients'] = function() {
        var str1 = 'background-image:',
            str2 = 'gradient(linear,left top,right bottom,from(#9f9),to(white));',
            str3 = 'linear-gradient(left top,#9f9, white);';

        setCss(
                       (str1 + '-webkit- '.split(' ').join(str2 + str1) +
                       prefixes.join(str3 + str1)).slice(0, -str1.length)
        );

        return contains(mStyle.backgroundImage, 'gradient');
    };


    tests['cssreflections'] = function() {
        return testPropsAll('boxReflect');
    };


    tests['csstransforms'] = function() {
        return !!testPropsAll('transform');
    };


    tests['csstransforms3d'] = function() {

        var ret = !!testPropsAll('perspective');

                        if ( ret && 'webkitPerspective' in docElement.style ) {

                      injectElementWithStyles('@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:3px;}}', function( node, rule ) {
            ret = node.offsetLeft === 9 && node.offsetHeight === 3;
          });
        }
        return ret;
    };


    tests['csstransitions'] = function() {
        return testPropsAll('transition');
    };



    tests['fontface'] = function() {
        var bool;

        injectElementWithStyles('@font-face {font-family:"font";src:url("https://")}', function( node, rule ) {
          var style = document.getElementById('smodernizr'),
              sheet = style.sheet || style.styleSheet,
              cssText = sheet ? (sheet.cssRules && sheet.cssRules[0] ? sheet.cssRules[0].cssText : sheet.cssText || '') : '';

          bool = /src/i.test(cssText) && cssText.indexOf(rule.split(' ')[0]) === 0;
        });

        return bool;
    };

    tests['generatedcontent'] = function() {
        var bool;

        injectElementWithStyles(['#',mod,'{font:0/0 a}#',mod,':after{content:"',smile,'";visibility:hidden;font:3px/1 a}'].join(''), function( node ) {
          bool = node.offsetHeight >= 3;
        });

        return bool;
    };
    for ( var feature in tests ) {
        if ( hasOwnProp(tests, feature) ) {
                                    featureName  = feature.toLowerCase();
            Modernizr[featureName] = tests[feature]();

            classes.push((Modernizr[featureName] ? '' : 'no-') + featureName);
        }
    }



     Modernizr.addTest = function ( feature, test ) {
       if ( typeof feature == 'object' ) {
         for ( var key in feature ) {
           if ( hasOwnProp( feature, key ) ) {
             Modernizr.addTest( key, feature[ key ] );
           }
         }
       } else {

         feature = feature.toLowerCase();

         if ( Modernizr[feature] !== undefined ) {
                                              return Modernizr;
         }

         test = typeof test == 'function' ? test() : test;

         if (typeof enableClasses !== "undefined" && enableClasses) {
           docElement.className += ' ' + (test ? '' : 'no-') + feature;
         }
         Modernizr[feature] = test;

       }

       return Modernizr; 
     };


    setCss('');
    modElem = inputElem = null;


    Modernizr._version      = version;

    Modernizr._prefixes     = prefixes;
    Modernizr._domPrefixes  = domPrefixes;
    Modernizr._cssomPrefixes  = cssomPrefixes;


    Modernizr.hasEvent      = isEventSupported;

    Modernizr.testProp      = function(prop){
        return testProps([prop]);
    };

    Modernizr.testAllProps  = testPropsAll;


    Modernizr.testStyles    = injectElementWithStyles;
    Modernizr.prefixed      = function(prop, obj, elem){
      if(!obj) {
        return testPropsAll(prop, 'pfx');
      } else {
            return testPropsAll(prop, obj, elem);
      }
    };


    docElement.className = docElement.className.replace(/(^|\s)no-js(\s|$)/, '$1$2') +

                                                    (enableClasses ? ' js ' + classes.join(' ') : '');

    return Modernizr;

})(this, this.document);
;
/*
 * Pointer Events Polyfill: Adds support for the style attribute "pointer-events: none" to browsers without this feature (namely, IE).
 * (c) 2013, Kent Mewhort, licensed under BSD. See LICENSE.txt for details.
 * Website: https://github.com/kmewhort/pointer_events_polyfill
 */

// constructor
function PointerEventsPolyfill(options){
    // set defaults
    this.options = {
        selector: '*',
        mouseEvents: ['click','dblclick','mousedown','mouseup'],
        usePolyfillIf: function(){
            if(navigator.appName == 'Microsoft Internet Explorer')
            {
                var agent = navigator.userAgent;
                if (agent.match(/MSIE ([0-9]{1,}[\.0-9]{0,})/) != null){
                    var version = parseFloat( RegExp.$1 );
                    if(version < 11)
                      return true;
                }
            }
            return false;
        }
    };
    if(options){
        var obj = this;
        $.each(options, function(k,v){
          obj.options[k] = v;
        });
    }

    if(this.options.usePolyfillIf())
      this.register_mouse_events();
}

// singleton initializer
PointerEventsPolyfill.initialize = function(options){
    if(PointerEventsPolyfill.singleton == null)
      PointerEventsPolyfill.singleton = new PointerEventsPolyfill(options);
    return PointerEventsPolyfill.singleton;
};

// handle mouse events w/ support for pointer-events: none
PointerEventsPolyfill.prototype.register_mouse_events = function(){
    // register on all elements (and all future elements) matching the selector
    $(document).on(this.options.mouseEvents.join(" "), this.options.selector, function(e){
       if($(this).css('pointer-events') == 'none'){
             // peak at the element below
             var origDisplayAttribute = $(this).css('display');
             $(this).css('display','none');

             var underneathElem = document.elementFromPoint(e.clientX, e.clientY);

            if(origDisplayAttribute)
                $(this)
                    .css('display', origDisplayAttribute);
            else
                $(this).css('display','');

             // fire the mouse event on the element below
            e.target = underneathElem;
            $(underneathElem).trigger(e);

            return false;
        }
        return true;
    });
};
/**
 * Example JavaScript component
 */
// Closure with jQuery support
(function($) {
  'use strict';

  // Add new item to public Drupal object
  Drupal.behaviors.checkbox = {
    attach: function () {
    	var visited = function () {  //this is to implement a different error behaviour between when the form is loaded and once an element has been visited
//console.log("checkbox init");
        $(this).addClass("visited");
      };
      $("span.checkbox").focus(visited);
      $("span.checkbox").click(visited);
    }
  };
})(jQuery);

/**
 * Example JavaScript component
 */

// Closure with jQuery support
// (function($) {
//   'use strict';
// 
//   // Add new item to public Drupal object
//   Drupal.behaviors.example = {
//     attach: function () {
// 
//       var button_var = {};
// 
//       return button_var;
//     }
//   };
// 
//   // You could add additional behaviors here.
//   Drupal.behaviors.myModuleMagic = {
//     attach: function (context, settings) { },
//     detach: function (context, settings) { }
//   };
// 
// })(jQuery);

/**
 * Example JavaScript component
 */
// Closure with jQuery support
(function($) {
  'use strict';

  // Add new item to public Drupal object
  Drupal.behaviors.radio = {
    attach: function () {
    	var visited = function () {  //this is to implement a different error behaviour between when the form is loaded and once an element has been visited
//console.log("radio init");
        $(this).addClass("visited");
      };
      $("span.radio").focus(visited);
      $("span.radio").click(visited);
    }
  };
})(jQuery);

/**
 * Example JavaScript component
 */
// Closure with jQuery support
(function($) {
  'use strict';

  // Add new item to public Drupal object
  Drupal.behaviors.select = {
    attach: function () {
      $("select").msDropDown();
      //console.log("initializing msDD");
      //$(".lhfs_widget select").msDropDown();

      //transfer classes from select to root object of msDropDown (conserve .half, for example)
      $(".ddOutOfVision > select").each(function() {
        $(this).parent().next().addClass(this.className);
      });

      //put all selects treat by msDropDown into the .dd container, and out of the .ddOutOfVision containter, so that frontend error marking has a chance (so far, tests show this does not affect the functionality of the dd)
      var $select = $(".ddOutOfVision select").detach();
      var $dd = $(".dd");
      //move select into the .dd container
      $select.each(function (i) {
        this.style.display = "none";
        $($dd[i].firstChild).before(this);
      });
      //move the selects' errorText to the end of the .dd container
      var $ETs = $(".dd + .errorText");
      $ETs.each(function () {
        var $dd = $(this).prev();
        $dd.find("select").after(this);
      });
    }
  };
})(jQuery);

/**
 * Example JavaScript component
 */
// Closure with jQuery support
(function($) {
  'use strict';

  // Add new item to public Drupal object
  Drupal.behaviors["text-input"] = {
    attach: function () {
    	var visited = function () {  //this is to implement a different error behaviour between when the form is loaded and once an element has been visited
        // console.log("text-input init");
    		if ($(this).is(".dd")) {
    			$(this).find("select").addClass("visited");
    		}
    		else {
        		$(this).addClass("visited");
        	}
        };
      $("input, textarea").focus(visited);
      $("input, select, textarea, div.dd, span.checkbox").click(visited); //strictly speaking, this line with only the checkbox selector should be put into checkbox.js as well, but accompanied by all the previous lines this seems to be an awful lot of baggage just to maintain the appearance of modularity
    }
  };
})(jQuery);

/**
 * Aegon Faq script
 */

// Closure with jQuery support
(function($) {
  'use strict';

  // Add new item to public Drupal object
  Drupal.behaviors.aegonFaq = {
    attach: function () {

      // Little refactor for deprecated use of $('selector').click
      $(".faq .title").on('click', function (evt) {
        evt.stopPropagation();
        var radio = $("input[name=show]", this.parentNode)[0];
        if (radio.checked) {
          radio.checked = false;
          return false; //prevents, together with .stopPropagation, bubbling, which could keep the radio button checked, instead of having it set to false here
        }
      });
    }
  };

})(jQuery);

(function(Drupal, $) {

  'use strict';

  /**
   * JS code for Aegon Menu
   * Dependencies: $.browser
   */
  Drupal.behaviors.aegonMenu = {

    /**
     * Istructions for Menu Global.
     * (Desktop and other devices, apart mobile with screen below < 640 pixels)
     */
    menuDesktop: function (menu) {

      // Click on backdrop or a#close
      menu.find('.nav-backdrop').add('a.close').on('click', function () {
        $('body').removeClass('pushmenu-to-right');
        menu.removeClass('open');
        menu.find('.level-2-item').removeClass('item-open');
      });

      // Push menu instructions
      menu.find("#showLeftPush").click(function () {

        $('body').toggleClass('pushmenu-to-right');

        if (menu.hasClass('open') && !$('body').hasClass('pushmenu-to-right')) {

          menu.removeClass('open');

        } else {

          menu.addClass('open');
        }

        menu.find('.level-2-item').removeClass('item-open');
      });

      // Clicks on .level-2-item
      menu.find('.level-2-item').on('click', function (e) {

        var isSubmenu = $(e.target).is('ul') || $(e.target).is('li');

        // Stop propagation if not .close
        if ($(e.target).hasClass('close') || isSubmenu) { return; }

        $('body').removeClass('pushmenu-to-right');

        if ($(this).hasClass('item-open')) {

          // Remove class .open to hide backdrop
          menu.removeClass('open');

        } else {

          // Add class .open to show backdrop
          menu.addClass('open');
        }

        // Remove all .item-open apart this
        menu.find('.level-2-item').not(this).removeClass('item-open');

        // Toggle .item-open only for this
        $(this).toggleClass('item-open');

        // Position fixed is not used anymore. But to be sure, I leave this
        // source code here.
        // Fix for Safari on Mac with wrong position fixed support.
        // if ($.browser.safari === true) {
        //   var layoutHeaderHeight = $('header.header').height();
        //   var newTop = $(this).position().top + layoutHeaderHeight;
        //   $(this).children("ul").css("top", -newTop + "px");
        // }
      });

      return this;
    },

    /**
     * Istructions for Menu Mobile.
     * (All screens below < 640 pixels)
     */
    menuMobile: function (menu) {

      // Mobile navigation
      $('#openmenu').on('click', function() {

        $('body').toggleClass('pushmenu-to-right');

        if (menu.hasClass('open') && !$('body').hasClass('pushmenu-to-right')) {

          menu.removeClass('open');

        } else {

          menu.addClass('open');
        }
      });

      // All clicks on #scroll div
      $('#scroll').on('mousedown touchmove', function (e) {

        if (e.target.id === 'openmenu') { return; }

        if ($('body').hasClass('pushmenu-to-right')) {

          $('body').removeClass('pushmenu-to-right');
        }
      });

      // Menu back links
      menu.find('.mm-back').on('click', function() {

        if ($(this).hasClass('menu')) {
          menu.find('nav').addClass('slide-to-left').removeClass('slide-to-right');
          return;
        }

        menu.find('nav').removeClass('slide-to-left slide-to-right');
      });

      // Links in mobile-level2
      menu.find('.mobile-level2 a[class*="menu-"]').on('click', function (e) {

        // Local scope vars
        var targetLevel3Class, level3;

        targetLevel3Class = e.target.className.split(' ')[0];

        level3 = menu.find('.mobile-level3.' + targetLevel3Class);

        // If the related level3 is present do stuff and block the normal 
        // behaviour of the link
        if (level3.length > 0) {

          menu.find('nav').addClass('slide-to-right');

          level3.addClass('show').siblings('.mobile-level3')
            .removeClass('show');

          e.preventDefault();
        }
      });

      // Exception in case there is only one mobile-level.
      // Slide the nav menu to left
      var mobileLevel2sCount = menu.find('.mobile-level2').length;

      if (mobileLevel2sCount < 1) {
        menu.find('nav').addClass('slide-to-left');
      }

      return this;
    },

    /**
     * Drupal's attach method
     */
    attach: function() {

      // Register DOMs of aside menus
      var menuDesktopDOM = $('aside.desktop'),
          menuMobileDOM = $('aside.mobile');

      // Run all instructions for different breakpoints
      this.menuDesktop(menuDesktopDOM).menuMobile(menuMobileDOM);
    }
  };

}(this.Drupal, this.jQuery));
(function ($) {

  'use strict';

  /**
   * Smart banner implementation
   * Dependency: $.smartbanner
   * @type {Object}
   */
  Drupal.behaviors.smartBanner = {

    attach: function () {

      $.smartbanner({
        // days to hide banner after close button is clicked (defaults to 15)
        daysHidden: 15,
        // days to hide banner after "VIEW" button is clicked (defaults to 90)
        daysReminder: 90,
        // language code for the App Store (defaults to us)
        appStoreLanguage: 'nl',
        title: 'Mijn Aegon',
        author: 'AEGON Nederland N.V.',
        button: 'Bekijk',
        store: {
          ios: 'On the App Store',
          android: 'In Google Play'
        },
        price: 'Gratis'
        // , force: 'android' // Uncomment for platform emulation
      });
    }
  };

})(jQuery);

(function ($) {
  'use strict';
  $('html').removeClass('no-js');
})(jQuery);

(function ($, Drupal, win, doc) {

  'use strict';

  /**
   * Sliding cookie popup implementation.
   * Dependency: Drupal.settings.eu_cookie_compliance object
   * @type {Object}
   */
  Drupal.behaviors.slidingCookiePopup = {

    getEuCookieDomain: function() {

      // Return EU Cookie Domain set in Drupal eu_cookie_compliance module
      return Drupal.settings.eu_cookie_compliance.domain;
    },

    attach: function () {

      // TEMP: stop everything in case we are under vps-rhino-1 (cx-dev)
      if (doc.domain === '10.120.32.22') { return; }

      // For localhost env, overwrite the module eu_cookie_compliance.domain
      if (doc.domain === 'localhost') {
        Drupal.settings.eu_cookie_compliance.domain = 'localhost';
      }

      // Local scope variables
      var ext_cookie_val = this.getCookie('AEGON.CookieOptIn.setting'),
          runCreatePopup = $('body.logged-in').length < 1 &&
                           $('body.imce').length < 1 &&
                           ext_cookie_val === 'nocookie';

      // Avoid to load sliding popup for admin
      if (!!Drupal.admin) { return; }

      // Run createPopup
      if (runCreatePopup) {

        // Create and append the popup div
        this.createPopup(Drupal.settings.eu_cookie_compliance.popup_html_info);
      }
    },

    createPopup: function (html) {
      var height;
      var popup = $(html)
        .attr({"id": "sliding-popup"})
        .height(Drupal.settings.eu_cookie_compliance.popup_height)
        .width(Drupal.settings.eu_cookie_compliance.popup_width)
        .hide();

      popup.prependTo("body");
      height = popup.height();
      popup.show()
        .attr({"class": "sliding-popup-top"})
        .css({"top": -1 * height})
        .animate({top: 0}, Drupal.settings.eu_cookie_compliance.popup_delay);

      // In the end attach events
      this.attachEvents();
    },

    getCookie: function(name) {
      var search = name + '=';
      var returnValue, offset;

      if (document.cookie.length > 0) {
        offset = document.cookie.indexOf(search);
        if (offset !== -1) {
          offset += search.length;
          var end = document.cookie.indexOf(';', offset);
          if (end === -1) {
            end = document.cookie.length;
          }
          returnValue = decodeURIComponent(document.cookie.substring(offset, end).replace(/\+/g, '%20'));
        } else {
          returnValue = 'nocookie';
        }
      }

      return returnValue;
    },

    getCurrentStatus: function () {
      var name = 'cookie-agreed';
      return this.getCookie(name);
    },

    setStatus: function (status) {
      var date = new Date();
      date.setDate(date.getDate() + 100);
      var cookie = "cookie-agreed=" + status + ";expires=" +
                   date.toUTCString() + ";path=" + Drupal.settings.basePath;
      if (this.getEuCookieDomain() && this.getEuCookieDomain() !== 'localhost') {
        cookie += ";domain="+Drupal.settings.eu_cookie_compliance.domain;
      }
      document.cookie = cookie;
    },

    changeStatus: function (value) {
      var that = this;
      var status = that.getCurrentStatus();
      if (status === value) { return; }

      // Memorize sliding popup
      var SlidingPopup = $('#sliding-popup');

      // Animate sliding popup
      SlidingPopup.animate({top: SlidingPopup.height() * -1}, Drupal.settings.eu_cookie_compliance.popup_delay, function () {
        if(status === 0) {
          SlidingPopup.html(Drupal.settings.eu_cookie_compliance.popup_html_agreed).animate({top: 0}, Drupal.settings.eu_cookie_compliance.popup_delay);
          that.attachEvents();
        }
        if(status === 1) {
          SlidingPopup.remove();
        }
      });

      that.setStatus(value);
    },

    attachEvents: function () {

      var that = this;

      // Retrieve CookieOptIn setting
      var ext_cookie_val = this.getCookie('AEGON.CookieOptIn.setting'),
          loc_cookie_val = this.getCurrentStatus();

      // Social hiding based on cookie's privacy preference
      that.socialShowHide(ext_cookie_val);

      // Launch offclick to unbind multiple clicks after saving cookie
      var offClicks = function () {

        $('#no-thankx')
          .add('a')
          .not('.find-more-button')
          .not('.level-2-item a, .home-tap a')
          .add('.level-2-item .level3 a')
          .add('.level-2-item a:first-child')
          .add('.custom-menu-dropdown a')
          .off('click');
      };

      // Function to save cookie on the client
      var saveCookieOptIn = function (selVal) {

        var cookie, date;

        date = new Date();
        date.setTime(date.getTime() + 100 * 24 * 60 * 60 * 1e3);
        date.setDate(date.getDate() + 100);
        cookie  = 'AEGON.CookieOptIn.setting = ' + selVal + ';';
        cookie += 'expires=' + date.toUTCString() + '; path=/';
        if (that.getEuCookieDomain() && that.getEuCookieDomain() !== 'localhost') {
          cookie += ';domain=' + Drupal.settings.eu_cookie_compliance.domain;
        }

        // Memorize it
        doc.cookie = cookie;
      };

      // Save cookie's preference on backend
      var savePreference = function (e, preference, newLocation) {

        var cookieOpslaan, cookieType, dataVal, popupWrapper, req, selVal,
            statusVal;

        // Unbind clicks on all links
        offClicks();

        // Set to false newLocation if undefined or null
        newLocation = newLocation || false;

        // Cache #popup-wrapper
        popupWrapper = $('#popup-wrapper');

        // Force selVal as 'preference' parameter or get the choice of user
        selVal = preference || $('input[name=optIn]:radio:checked').val();

        // Prepare vars
        if (selVal === 'external') {
          cookieType = 'extern|instellingen';
          cookieOpslaan = 'extern cookie opslaan';
          dataVal = 'E';
          statusVal = 2;
        } else if (selVal === 'visit') {
          cookieType = 'statistiek|bezoek';
          cookieOpslaan = 'statistiek cookie opslaan';
          dataVal = 'S';
          statusVal = 'nocookie';
        } else {
          cookieType = 'statistiek|instellingen';
          cookieOpslaan = 'statistiek cookie opslaan';
          dataVal = 'S';
          statusVal = 1;
        }

        // Save third part cookie if different from 'visit'
        if (statusVal !== 'nocookie') { saveCookieOptIn(selVal); }

        // Save local cookie
        that.setStatus(statusVal);

        // Run socialShowHide
        if (dataVal === 'E') { that.socialShowHide('external'); }

        // Save in the backend if is not the first visit
        if (selVal !== 'visit') {
          req = $.ajax({
            type: 'GET',
            dataType: 'text',
            global: false,
            url: '/lpa/CookieVoorkeur',
            data: 'ans=' + dataVal,
            success: function () {

              // Close jquery ui dialog only if #popup-wrapper exist
              if (popupWrapper.hasClass('ui-dialog-content')) {
                popupWrapper.dialog('close');
              }
            }
          });
        }

        // Trigger tealium to record 'cookie settings changed' event
        if (typeof win.utag === 'object') {
          win.utag.view({
            page_cat_1_type: 'cookie',
            page_cat_2_name: cookieOpslaan,
            page_cat_3_section: 'cookie',
            page_cat_6_businessline: 'algemeen',
            cookie_type: cookieType,
            event: 'cookie_accepted'
          }, function() {

            // Stop if no newLocation passed
            if (!newLocation) { return; }

            // Wait until the previous ajax end
            req.always(function () {

              // Navigate to new location
              win.location.href = newLocation;
            });
          });

          // Stop everything here
          return;
        }

        // If we are passing an href as parameter make a check on ajax end
        if (newLocation && selVal !== 'visit') {

          // Wait until the previous ajax end
          req.always(function () {

            // Navigate to new location
            win.location.href = newLocation;
          });
        }
      };

      // No thanks behavoiur
      var noThanksPreference = function (e) {

        // Check if target is a link with a proper href
        var newLocation = e.target.href || null;

        // Change status of main cookie and hide the sliding cookie popup
        that.changeStatus(2);

        // Trigger to save preference in backend
        savePreference(null, 'external', newLocation);

        // Only if no-thankx
        if (e.target.id === 'no-thankx') {

          // Trigger tealium call to record 'cookie pop up closed' event
          if (typeof win.utag === 'object') {
            win.utag.view({
              page_cat_1_type: 'cookie',
              page_cat_2_name: 'cookiemelding sluiten',
              page_cat_3_section: 'cookie',
              page_cat_4_productgroup: '',
              page_cat_5_product: '',
              page_cat_6_businessline: 'algemeen',
              cookie_type: 'statistiek|melding',
              event: 'cookie_accepted'
            });
          }

        } else {

          // IMPORTANT:
          // Since we are hooking all links, prevent to go further till when the
          // next AJAX calls in savePreference() is not completed
          e.preventDefault();
        }
      };

      var findMore = function () {
        $(this).off('click');
        $(this).removeClass('find-more-button');
        $.ajax({
          type: 'GET',
          dataType: 'text',
          global: false,
          url: '/lpa/getconfirm',
          success: function (data) {

            // Trigger tealium to record 'cookies settings screen viewed' event
            if (typeof win.utag === 'object') {
              win.utag.view({
                page_cat_1_type: 'cookie',
                page_cat_2_name: 'cookie instellingen',
                page_cat_3_section: 'cookie',
                page_cat_6_businessline: 'algemeen'
              });
            }

            // Cache #popup-wrapper
            var popupWrapper = $('#popup-wrapper');

            // Remove style attribute and append data
            popupWrapper.removeAttr('style').append(data);

            // Open jQuery UI Dialog
            popupWrapper.dialog({
              closeOnEscape: false,
              open: function () {
                $('.ui-dialog-titlebar-close').hide();
              },
              width: 'auto',
              maxWidth: 600,
              height: 'auto',
              modal: true,
              fluid: true,
              resizable: false
            });

            // Hide title
            $('.ui-dialog-titlebar').hide();

            // Remove SlidingPopup DOM
            SlidingPopup.remove();
          },
          error: function () {
            // Adding back the class and binding
            $(this).addClass('find-more-button').on('click');
          }
        });
      };

      // Handling in best way the aspect of sidemenu and EU compliance popup.
      // Memorize sliding popup
      var SlidingPopup = $('#sliding-popup');

      // Check if exist the version for top of page
      if (SlidingPopup.is('.sliding-popup-top')) {

        var StickyML = $('aside.stickleft'),
            StickySL = $('#cbp-spmenu-s1'),
            StickyIR = $('#scroll .inpage-navigation'),
            SIRTopPosOrig = (StickyIR.length > 0) && 
              Number(StickyIR.css('top').replace('px', ''));

        // Add .wrapper class to div wrapper
        $('#sliding-popup > div').addClass('wrapper');

        // Hook resize/scroll event of window to set properly css of elements
        $(win).on('resize scroll', function () {

          // Make some calculation for proper top position of side menu
          var spH = SlidingPopup.height(),
              scrollYval = win.navigator.userAgent.indexOf('MSIE') !== -1 ? 
                doc.documentElement.scrollTop : win.scrollY;
              // checkPos = scrollYval + spH;

          // Update the position of side menu
          StickyML.css({'top': scrollYval >= spH ? 0 : spH - scrollYval});
          StickySL.css({'top': scrollYval >= spH ? 0 : spH - scrollYval});

          // Check if StickyIR exist
          if (StickyIR.length > 0) {

            // Update the position of inpage navigation
            StickyIR.css({
              'top': scrollYval >= spH ? 
                SIRTopPosOrig : SIRTopPosOrig + (spH - scrollYval)
            });
          }

        }).resize();

        $('body').on('click', '#no-thankx, #cookie-opt-in-save', function () {

          // Remove #sliding-popup and css style from aside.stickleft in the end
          // of CSS transition of sliding popup eu_cookie_compliance
          SlidingPopup.css({'position': 'absolute'});
          StickyML.removeAttr('style');
          StickySL.removeAttr('style');
          StickyIR.removeAttr('style');

          // Remove events binding
          $('body').off('click', '#no-thankx, #cookie-opt-in-save');
          $(win).off('resize scroll');
        });
      }

      if ($('body.logged-in').length < 1 && $('body.imce').length < 1 && ext_cookie_val === 'nocookie') {

        if (ext_cookie_val === 'external') {

          that.changeStatus(2);

        } else if (ext_cookie_val === 'analytics') {

          that.changeStatus(1);

        } else if (loc_cookie_val === 'nocookie' && ext_cookie_val === 'nocookie') {

          // If local cookie 'cookie-agreed' is not set to zero yet, and
          // external cookie is not set, then trigger telium by default
          savePreference(null, 'visit');
        }

        // Check if sliding popup is loaded or not
        if (SlidingPopup.is('.sliding-popup-top')) {

          // Cookie pop up
          $('.find-more-button').off('click').on('click', findMore);

          // Save cookie's preferences on click
          $(doc).on('click', '#cookie-opt-in-save', savePreference);

          // Cookie no-thanks close button.
          // Any click on links to hook navigation on any other pages
          $('#no-thankx')
            .add('a')
            .not('.find-more-button')
            .not('.level-2-item a, .home-tap a')
            .add('.level-2-item .level3 a')
            .add('.level-2-item a:first-child')
            .add('.custom-menu-dropdown a')
            .on('click', noThanksPreference);
        }
      }
    },

    socialShowHide: function (value) {

      var newsSocial = $('#news-social');

      if (newsSocial.length > 0) {

        if (value === 'external') {
          newsSocial.show();
        } else {
          newsSocial.hide();
        }
      }
    }
  };

})(jQuery, Drupal, this, this.document);
/* global PointerEventsPolyfill:false */
(function ($, win) {

  'use strict';

  /**
   * JS code for UI Elements
   * @type {Object}
   */
  Drupal.behaviors.uiElements = {

    attach: function () {

      // Run all UI helper functions
      this.globals()
        .backTop()
        .pointerEventsPolyfillInit();
    },

    globals: function () {

      // Copy jQuery to $ as item of window public object
      win.$ = $;

      return this;
    },

    backTop: function () {

      // Back to top for mobile
      if ($(win).scrollTop() === 0) {
        $('#back-top a').hide();
      }

      $('#back-top a').click(function() {
        $('body,html').animate({
          scrollTop: 0
        }, 600);
        if ($(win).scrollTop() === 0) {
          $('#back-top a').hide();
        }
        return false;
      });

      $(win).scroll(function() {
        if ($(win).scrollTop() > 100) {
          $('#back-top a').show();
        } else {
          $('#back-top a').hide();
        }
        clearTimeout($.data(this, 'scrollTimer'));
        $.data(this, 'scrollTimer', setTimeout(function() {
          // do something
          $('#back-top a').hide();
        }, 4e3));
      });

      return this;
    },

    pointerEventsPolyfillInit: function () {

      // Initialize polyfill for "pointer-events: none"
      PointerEventsPolyfill.initialize();

      return this;
    }
  };
  
})(jQuery, this);

/*jshint multistr: true */
/**
 * User details script
 * Dependencies:
 * - vendors/jquery.cookie.js (Cookie jQuery handlers)
 * - modernizr.custom.js (Proper cross-browser style)
 *
 * Events trigger on window object: shwUserLogout, shwUserLoggedIn.
 * Usage:
 * $(window).on('shwUserLoggedIn', function() {
 *   // Do whatever you want here
 * });
 */

(function(doc, win, $, Drupal) {

  'use strict';

  /**
   * Register or retrieve the public container for our shw widgets.
   * Purpose of this window global object is for register some public functions.
   * Need to be initialized on top of each widgets.
   */
  win.shwGlobal = win.shwGlobal || {};

  /**
   * User widget's configuration
   */

  // Path links handled by the script below for templating. (no initial slash)
  var logoutPathLink = 'pkmslogout?filename=WSBLogout.html';
  var mijnaegonPathLink = 'mijnaegon/';

  // This is the template of user_detail_widget wrapper taken from Aegon
  // Technical Design Library and converted in JavaScript string.
  // back to including the html via template file; separation of concerns is still a thing and debugging the layout is a lot easier this way
  // var template = '<div id="user_detail_widget" class="user_detail_widget">\n<div class="inplace">\n<button class="btn-login-loggedin">Ingelogd</button>\n<div class="dropdown">\n<div class="highlight mobile">\n<div class="text">\n<p class="welcome">\n<strong>Welcome <span class="user_detail_widget_name">username</span>.</strong> <span class="last_access_wrapper">Uw vorige bezoek was op <span class="user_detail_widget_last_access">00-00-0000 om 00:00 uur</span></span></p>\n</div>\n</div>\n<div class="text">\n<p class="name"><span class="user_detail_widget_name">username</span></p>\n<p class="log">Uw vorige bezoek was op <span class="user_detail_widget_last_access">00-00-0000 om 00:00 uur</span></p>\n<p class="action">\n<a href="#" class="user_detail_widget_logout_link button arrow">Uitloggen</a>\n<a href="#" class="user_detail_widget_mijnaegon_link button white myaegon">Mijn Overzicht</a>\n</p>\n</div>\n</div>\n</div>\n<div class="text">\n<p class="name"><span class="user_detail_widget_name">username</span></p>\n</div>\n<div class="highlight desktop">\n<div class="text">\n<p class="welcome">Welcome <span class="user_detail_widget_name">username</span>.</p>\n<p class="log">Uw vorige bezoek was op <span class="user_detail_widget_last_access">00-00-0000 om 00:00 uur</span></p>\n</div>\n</div>\n</div>';

  // User widget JSON endpoint (hostname is declared in
  // Drupal.settings.onlineAegonNl.hostname object's item).
  var realEndpoint = '/mijnservices/US_RestGatewayWeb/rest/requestResponse/BS_PARTIJ_03/retrieve';

  // ID string where the user widget will be appended
  var appendUserWidgetTo = '#shw-user-details';

  // MijnAegon cookie's name
  var mijnAegonCookieLoggedInName = 'mijn_last_login';

  // Set the seconds to force not showing the green bar animated
  var secondsForProcessedStatus = 15;

  // Boolean to check if not on local or DEV environemnt
  var notLocalOrDev = true;

  /**
   * User widget's Drupal script.
   * Add new item to public Drupal object
   */
  Drupal.behaviors.userDetailWidget = {

    // Initial container for data object
    shwData: null,

    // Initial container for entire raw json object
    shwRawData: null,

    attach: function (context, settings) {
      // Run before real initialization
      this.setup(settings);
//only for development: simulate the cookie that is set by ASSO; keep this as long as the UDW is not entirely out of the deep water, comment out if required
/*
var cookieRawBak = $.cookie.raw;
$.cookie.raw = true;
$.cookie(mijnAegonCookieLoggedInName, '"2015-12-11 12:34:56"');
$.cookie.raw = cookieRawBak;
*/
      // Register a public method for deinitialize
      win.shwGlobal.userLogout = (function(onlyLocal) {
        return this.deinitialize(onlyLocal);
      }).bind(this);

      // Register a public method for loggedin
      win.shwGlobal.userLoggedIn = (function() {
        return this.userLoggedIn();
      }).bind(this);

      // Register a public method for getRelNumByType
      win.shwGlobal.getRelNumByType = (function(type) {
        return this.getRelNumByType(type);
      }).bind(this);
    },

    setup: function (settings) {

<<<<<<< HEAD
      // Check if current website is not local or DEV environment
      var notLocalOrDev = (
        settings.onlineAegonNl.hostname !== 'local' &&
        win.location.hostname.search('www.dev.') !== -1
=======
      // Check if current website is not local or DEV environemnt
      notLocalOrDev = (
        settings.onlineAegonNl.hostname == undefined ||
        (settings.onlineAegonNl.hostname !== 'local' && win.location.hostname.search('www.dev.') !== -1)
>>>>>>> 1b9795b4e2a5faeff3807a9b013ad6dbb433c986
      );

      // Try to avoid multiple requests to the backend environment, if the
      // browser never ever had a logged session. Implement the block only for
      // Testing, UAT and Production environments.
      if (notLocalOrDev) {
        if (!this.lastLogin()) {
          //return;
        }
      }

      // Set url API for local and real environments
      if (!notLocalOrDev) {
        this.apiUrl = '/file/example/user_detail_bs.json';
      } else {
        this.apiUrl = realEndpoint;
      }

      // Update path links
      logoutPathLink = settings.basePath + logoutPathLink;
      mijnaegonPathLink = settings.basePath + mijnaegonPathLink;

      // Start retrieving data
      this.getData();
    },

    getData: function () {

      // Local variables
      var that = this,
          jsonPayload,
          retreiveBSPartij,
          checkSanityOfJson;

      // Payload for JSONP
      jsonPayload = {
        'retrieveRequest': {
          'AILHEADER': {
            'CLIENTID': 'MijnAegonUserWidget',
            'CORRELATIONID': '##UAT##'
          }
        }
      };

      checkSanityOfJson = function (jsonObject) {

        // Check for retrieveResponse in the passed object
        if ('retrieveResponse' in jsonObject) {
          return true;
        }

        // Return false by default
        return false;
      };

      // AJAX Success function
      retreiveBSPartij = function (json) {

        // Local variables
        var isString, parseJSON, data, isLogged;

        // Check is json is string that need to be parsed
        isString = typeof json === 'string';

        // Parse the JSON if needed
        parseJSON = isString ? $.parseJSON(json) : json;

        // Check if container and output of JSON is properly setup
        if (!checkSanityOfJson(parseJSON)) {

          return;

        } else {

          // Register raw json data if OK
          that.shwRawData = parseJSON.retrieveResponse;
        }

        // Boolean to declare and check is user is logged in
        isLogged = (parseJSON.retrieveResponse.PROCES.STATUS === '00000');

        // Data ready to be passed to initialize() below
        data = {

          // Set flag for user logged in
          'loggedIn': isLogged,

          // Get user's name from json object
          'userName': parseJSON.retrieveResponse.PARTIJ._AE_PERSOON._AE_SAMNAAM || "n.a.",

          // Get last login time from cookie or give false
          'lastAccess': that.lastLogin()
        };
        // Activate the widget
        that.initialize(data);
      };

      // Load AJAX request
      $.ajax({
        timeout: 10000,
        type: 'GET',
        encoding:"UTF-8",
        url: this.apiUrl,
        data: jsonPayload,
        dataType: 'json',
        success: retreiveBSPartij,
        error: this.clearLastLogin
      });
    },

    initialize: function (data) {

      // Local variables
      var that = this;

      // Update the global shwData
      this.shwData = data;

      // Callback to prevent appendTo before correct end of parseWidget()
      var callback = function (domWidget) {

        // Append the template and cache it
        that.widget = domWidget;  //$(domWidget).appendTo(appendUserWidgetTo);
      };

      // Check if is logged and go ahead
      if (data.loggedIn) {

        // Parse the DOM before appendTo
        this.parseWidget(data, callback);

        // Load events
        this.events();
      }
    },

    parseWidget: function (data, callback) {
      // Vars for local scope
      var $template, dateFormatted;

      // Convert template in jQuery DOM
      $template = $(".user_detail_widget"); //$(template);

      // Templating data
      $template.find('span.user_detail_widget_name').text(data.userName);
      $template.find('a.user_detail_widget_logout_link').attr(
        'href', logoutPathLink);
      $template.find('a.user_detail_widget_mijnaegon_link').attr(
        'href', mijnaegonPathLink);
      // Exception in case data.lastAccess is empty
      if (data.lastAccess === false) {

        // Remove span.last_access_wrapper and mobile p.log
        $template.find('span.last_access_wrapper').remove();
        $template.find('p.log').remove();

      } else {

        // Convert lastAcess in formatted date
        dateFormatted = this.formatDatetime(data.lastAccess);
        $template.find(".user_detail_widget_last_access").text(dateFormatted);
      }

      // Launch also the function to append the user name in menu
      this.shwUserDetailsInmenu(data.userName);

      // Trigger an event
      $(win).trigger('shwUserLoggedIn');

      // Show/hide logged's items
      $('body').addClass('shw-widgets-logged-in');

      // Cross-browser implementation to provide workaround for no CSS animation
      if ( $('html').hasClass('no-cssanimations') && !$.cookie("hasBeenShown") ) {

        $template.find('.btn-login-loggedin').addClass('ieChangeColors');

        // For desktop
        $template.find('.highlight.desktop').delay(3000)
          .animate({'margin-top': '-500px', 'bottom': '500px'},
            250,
            'linear',
            function () {
              $template.find('.btn-login-loggedin')
                .removeClass('ieChangeColors');
            }
          );

        // For mobile
        $template.find('.highlight.mobile').delay(3000).slideUp(500);
      }

      if ( $.cookie("hasBeenShown") ) {
        $template.find(".highlight").addClass("has-been-shown");
      }
      // Compare datetime with mijnaegon last login and add .processed class
      if (this.expiredTimeFromLogin() || $.cookie("hasBeenShown")) { $template.addClass('processed'); }

      // cookie to make sure that the next time this template is shown,
      // the welcome animation is off
      $.cookie("hasBeenShown", "1");

      // Finally run the callback to append all our shw-DOM in the proper
      // shw place
      if (typeof callback === 'function') { callback($template); }
    },

    expiredTimeFromLogin: function () {

      var timeCookie = this.lastLogin();
      // Stop execution an return false if no mijnaegon cookie registered
      if (!timeCookie) { return false; }

      // If is not the first time after login, don't show the animation by
      // adding the .processed class.
      var futureTMS = this.formatDatetime(timeCookie, true) +
                      (secondsForProcessedStatus * 1000);
      return ($.now() > futureTMS) && true;
    },

    shwUserDetailsInmenu: function (name) {

      // Create DOM for the link
      var linkDesktop = $('<a />', {'class': 'icon-user-link'});
      var linkMobile = $('<a />', {'class': 'icon-user-link'});

      // Set the text with user's name passed
      linkDesktop.text(name).attr('href', mijnaegonPathLink);
      linkMobile.text(name).attr('href', mijnaegonPathLink);

      // Append the DOM for the link just created and remove old login link
      $('li[data-id="shw-user-details-inmenu"]').append(linkDesktop)
        .find('.login-link-inv').remove();
      $('li[data-id="shw-mob-user-details-inmenu"]').append(linkMobile)
        .find('.login-link-inv').remove();
    },

    events: function (switchOff) {

      // Stop execution if this.widget is empty
      if(typeof this.widget === 'undefined') { return; }

      // Cache the button in local variable
      var btnLoggedIn = this.widget.find('button.btn-login-loggedin');

      // Local functions
      var Fn = {

        isMobile: function () {
          return doc.documentElement.offsetWidth <= 640;
        },

        mobileTapPresent: function () {
          return $('body').hasClass("mobile-tap");
        },

        isTapped: function () {
          return btnLoggedIn.hasClass('tap');
        }
      };

      // Bind window resize
      var windowResize = function () {

        if (Fn.isMobile() && !Fn.mobileTapPresent() && !Fn.isTapped()) {

          $('body').toggleClass("mobile-tap");

        } else if (!Fn.isMobile()) {

          $('body').removeClass("mobile-tap");
        }
      };

      // Action for Hover on login button
      var loginButtonHover = function() {

        // Add class off and deinitialize the mouseenter event
        $(this).addClass( "off" ).off('mouseenter');
      };

      // Action for Click on login button
      var loginButtonClick = function() {

        // Toggle only if is not already present and mobile
        if (Fn.isMobile() && !Fn.mobileTapPresent()) {
          $('body').toggleClass("mobile-tap");
        } else {
          $('body').removeClass("mobile-tap");
        }

        $(this).toggleClass("tap");
      };

      // Action on click of section.content to handle properly .tap on
      // buttonlink and class mobile-tap on body in case is on mobile view
      var sectionContentClick = function() {
        if ($('body').hasClass('mobile-tap')) {
          $('body').removeClass('mobile-tap');
          btnLoggedIn.addClass('tap');
        }
      };

      // Switch all OFF
      if (switchOff) {

        $(window).off('resize', windowResize);
        this.widget.find('button.btn-login-loggedin')
          .off('mouseenter', loginButtonHover);
        this.widget.find('button.btn-login-loggedin')
          .off('click', loginButtonClick);

        // Stop here
        return;
      }

      // Bind resize window to add/remove body class .mobile-tap
      $(window).on('resize', windowResize).resize();

      // Hover on button login set class .off on itself and unbind
      btnLoggedIn.on('mouseenter', loginButtonHover);

      // Click on button login toggle class .tap on itself
      btnLoggedIn.on('click', loginButtonClick);

      // Bind click on section.content to remove the dark overlay related to
      // body.mobile-tap and run the logic
      $('section.content').on('click', sectionContentClick);

      // In the end of animation of .highlight div, add class .processed to
      // widget's container to hide itself
      this.widget.find('.highlight').one('webkitAnimationEnd oanimationend \
        msAnimationEnd animationend', function() {
          $(this).parents('.user_detail_widget').addClass('processed');
      });
    },

    formatDatetime: function (date, timestamp) {

      // Local variables
      var dateFormatted, day, month, year, hours, minutes;
      //AESSO writes the cookie value surrounded by double quotes; the following RegEx will take care of that, but it also won't break if that error is corrected
      if (date) {
        var dp = date.match(/(\d+)/g);
        //the expected format of the date string is YYYY-MM-DD HH:MM:SS, indices in dp start with 0
        //we convert the date to English format, aka MM/DD/YYYY HH:MM:SS
        //this is drop-dead-ugly, but it does the job
        date = dp[1] + "/" + dp[2] + "/" + dp[0] + " " + dp[3] + ":" + dp[4] + ":" + dp[5] + " UTC";
      }
      // Convert string into Date object
      date = new Date(date);
      // Return the timestamp if true is passed as param
      if (timestamp) { return date.getTime(); }

      // Extraxt single date elements
      day = date.getDate();
      month = date.getMonth() + 1;
      year = date.getFullYear();
      hours = date.getHours();
      minutes = date.getMinutes();

      // Convert time elements with proper zero prefix
      month = String(month).length < 2 && '0'+month || month;
      hours = String(hours).length < 2 && '0'+hours || hours;
      minutes = String(minutes).length < 2 && '0'+minutes || minutes;

      // Generate right format in Dutch
      dateFormatted = day+'-'+month+'-'+year+' om '+hours+':'+minutes+' uur';

      return dateFormatted;
    },

    lastLogin: function () {

      // Return cookie value or FALSE
      return $.cookie(mijnAegonCookieLoggedInName) || false;
    },

    clearLastLogin: function (response) {

      // Remove mijn_last_login's cookie as first
      $.removeCookie(mijnAegonCookieLoggedInName);

      // Then throw an error in console
      if (response && !notLocalOrDev) { throw response.responseText; }
    },

    /**
     * Method to logout an user
     * @param  {boolean} onlyLocal  Pass true if you want destroy only local session
     * @return {boolean} wrapper for this.userLoggedIn()
     */
    deinitialize: function (onlyLocal) {

      // Remove classes to hide logged's items
      $('body').removeClass('shw-widgets-logged-in mobile-tap');

      // Remove mijn_last_login's cookie
      this.clearLastLogin();
      
      // remove the cookie that determines if the green bar is shown
      $.removeCookie("hasBeenShown");

      // Switch off all events
      this.events(true);

      // Set loggedIn to false
      this.shwData.loggedIn = false;

      // Trigger an event
      $(win).trigger('shwUserLogout');

      // Logout also remotely
      if (!onlyLocal) { location.href = logoutPathLink; }

      // Return current status
      return this.userLoggedIn();
    },

    /**
     * Check if the user is loggen in or not
     * @return {boolean} true or false if user is logged or not
     */
    userLoggedIn: function () {

      // Return loggedIn value or false if not existent
      return this.shwData.loggedIn || false;
    },

    /**
     * This method permit to retrieve all elements associated with
     * _AE_RELNUM_TYPE present in json data, retrieved from remote API.
     *
     * @param  {string} type   Pass a string af filter parameter
     * @return {string|array}  Return a numeric string or array collection
     */
    getRelNumByType: function (type) {

      // Force to uppercase
      type = type.toUpperCase();

      // Return null if no _AE_PARTIJ_IDENTIFICATIE
      if (this.shwRawData && this.shwRawData.PARTIJ &&
        !this.shwRawData.PARTIJ._AE_PARTIJ_IDENTIFICATIE) { return null; }

      // Create a local variable with identificatie array
      var arrIdentifications = this.shwRawData.PARTIJ._AE_PARTIJ_IDENTIFICATIE;

      // If no type param, return the whole array
      if (!type) { return arrIdentifications; }

      // Filter the array based on type param passed
      var arrFiltered = arrIdentifications.filter(function(obj){
        return obj._AE_RELNUM_TYPE === type ? true : false;
      });

      // Create empty values array
      var values = [];

      // Populate values array with all values present in the filtered array
      arrFiltered.forEach(function(value){
        values.push(value.RELNUM);
      });

      // Return single value or multiple values as array
      return values.length <= 1 ? values[0] : values;
    }
  };

})(this.document, this, this.jQuery, this.Drupal);

/**
 * LHFS script
 */

// Closure with jQuery support
(function($) {
  'use strict';

  // Add new item to public Drupal object
  Drupal.behaviors.lhfs_widget = {
    attach: function () {

      // Check if div#lhfs_widget exist
      if ($('.lhfs_widget').length > 0) {
        $("#lhfs_widget .tip").addClass("visible");
        $("#lhfs_widget li.product ul.horizontal").removeClass("visible");
        $("#lhfs_widget li.product ul.horizontal").addClass("visible");
        $("#lhfs_widget li.product ul.horizontal.error").removeClass("visible");

        $(".success")
          .appendTo("body") //move .success to the body, so that it can be centered and fixed to the screen
          .css("top", (($(window).height() - $(".success").height()) / 2) + "px");  //center .success vertically
        $(".lightbox")
          .appendTo("body"); //move .lightbox to the body & after .success so that the visible style for .success still applies


        $(".help").mouseover(function () {
          if (this.title > " ") { //the temporary content has 2B " ", since "" will set display to "none" according to stylesheet definition, 
            //alert(this.title);
            $(".dialog.help").remove();
            var dialog = document.createElement("DIV");
            dialog.className = "help dialog";
            dialog.innerHTML = this.title;
            this.title = " ";
            $("#lhfs_widget").append(dialog); //this has 2 happen b4 measurements of dialog are taken, otherwise they won't be initialized
            var offset = $(this).offset();
            offset.top = offset.top + $(this).height() + 10;
            offset.left = offset.left - $(dialog).width() / 2 - 18;
            $(dialog).offset(offset);
            var that = this;
            $(document).click(function () {
              $(dialog).remove();
              that.title = dialog.innerHTML;
            });
          }
        });

      }
    }
  };

})(jQuery);

/*jshint multistr: true */
/**
 * Mijn Documenten widget script
 * Dependencies: null
 */
(function(doc, win, $, Drupal) {

  'use strict';

  /**
   * MyDocuments's Drupal script.
   * Add new item to public Drupal object
   */
  Drupal.behaviors.myDocumentsWidget = {

    attach: function () {

      $('.my_documents_widget article h2').on('click', function () {
        $(this).parent('article').toggleClass('open')
          .siblings().removeClass('open');
      });
    }
  };

})(this.document, this, this.jQuery, this.Drupal);

/*jshint multistr: true */
=======
>>>>>>> b119f29b7b5e8b74ffb16e95e3c414b03f19975f
/**
 * aegon-technical-design-library
 * @description The library will host the HTML CSS & JS resources required for cXstudio and third parties to implement in projects.
 * @version v0.0.1
 * @link https://www.aegon.nl
 * @repo https://bitbucket.org/cxstudio/aegon-technical-design-library.git
 * @license no license
 */
<<<<<<< HEAD
(function(doc, win, $, Drupal) {

  'use strict';

  var testSelector = function (selector) {
    document.querySelector('*');  //checks if querySelector is implemented and raises an error if not
    try {document.querySelector(selector)} catch (e) {return false}
    return true;
  }

  /**
   * MyPersonalDetails's Drupal script.
   * Add new item to public Drupal object
   */
  Drupal.behaviors.personalDetailsWidget = {
    validation: {  //  this is part of the form validation routine; when it is working correctly, this should be bumped to a general level
      zip: "^d+\w*$",
    },

    attach: function () {
      $("form[name=personal_details_form]").validVal({
        validate: {
          onKeyup: true,
        },
        //  configuration goes here
      });

      $("input[name=ra_NL]").click( function () {
        var NL = parseInt($(this).val()) > 0;
        $(".address .residential .NL").toggleClass("visible", NL);
        $(".address .residential .world").toggleClass("visible", !NL);
      });
      $("input[name=ra_NL]:checked").click();

      $("input[name=ca_NL]").click( function () {
        var NL = parseInt($(this).val()) > 0;
        $(".address .correspondential .NL").toggleClass("visible", NL);
        $(".address .correspondential .world").toggleClass("visible", !NL);
      });
      $("input[name=ca_NL]:checked").click();
    }
  };
=======
function PointerEventsPolyfill(e){if(this.options={selector:"*",mouseEvents:["click","dblclick","mousedown","mouseup"],usePolyfillIf:function(){if("Microsoft Internet Explorer"==navigator.appName){var e=navigator.userAgent;if(null!=e.match(/MSIE ([0-9]{1,}[\.0-9]{0,})/)){var t=parseFloat(RegExp.$1);if(11>t)return!0}}return!1}},e){var t=this;$.each(e,function(e,n){t.options[e]=n})}this.options.usePolyfillIf()&&this.register_mouse_events()}!function(e,t){function n(e){var t=e.length,n=le.type(e);return le.isWindow(e)?!1:1===e.nodeType&&t?!0:"array"===n||"function"!==n&&(0===t||"number"==typeof t&&t>0&&t-1 in e)}function i(e){var t=Ce[e]={};return le.each(e.match(ue)||[],function(e,n){t[n]=!0}),t}function s(e,n,i,s){if(le.acceptData(e)){var r,o,a=le.expando,l="string"==typeof n,c=e.nodeType,u=c?le.cache:e,d=c?e[a]:e[a]&&a;if(d&&u[d]&&(s||u[d].data)||!l||i!==t)return d||(c?e[a]=d=Z.pop()||le.guid++:d=a),u[d]||(u[d]={},c||(u[d].toJSON=le.noop)),("object"==typeof n||"function"==typeof n)&&(s?u[d]=le.extend(u[d],n):u[d].data=le.extend(u[d].data,n)),r=u[d],s||(r.data||(r.data={}),r=r.data),i!==t&&(r[le.camelCase(n)]=i),l?(o=r[n],null==o&&(o=r[le.camelCase(n)])):o=r,o}}function r(e,t,n){if(le.acceptData(e)){var i,s,r,o=e.nodeType,l=o?le.cache:e,c=o?e[le.expando]:le.expando;if(l[c]){if(t&&(r=n?l[c]:l[c].data)){le.isArray(t)?t=t.concat(le.map(t,le.camelCase)):t in r?t=[t]:(t=le.camelCase(t),t=t in r?[t]:t.split(" "));for(i=0,s=t.length;s>i;i++)delete r[t[i]];if(!(n?a:le.isEmptyObject)(r))return}(n||(delete l[c].data,a(l[c])))&&(o?le.cleanData([e],!0):le.support.deleteExpando||l!=l.window?delete l[c]:l[c]=null)}}}function o(e,n,i){if(i===t&&1===e.nodeType){var s="data-"+n.replace(Te,"-$1").toLowerCase();if(i=e.getAttribute(s),"string"==typeof i){try{i="true"===i?!0:"false"===i?!1:"null"===i?null:+i+""===i?+i:De.test(i)?le.parseJSON(i):i}catch(r){}le.data(e,n,i)}else i=t}return i}function a(e){var t;for(t in e)if(("data"!==t||!le.isEmptyObject(e[t]))&&"toJSON"!==t)return!1;return!0}function l(){return!0}function c(){return!1}function u(e,t){do e=e[t];while(e&&1!==e.nodeType);return e}function d(e,t,n){if(t=t||0,le.isFunction(t))return le.grep(e,function(e,i){var s=!!t.call(e,i,e);return s===n});if(t.nodeType)return le.grep(e,function(e){return e===t===n});if("string"==typeof t){var i=le.grep(e,function(e){return 1===e.nodeType});if(qe.test(t))return le.filter(t,i,!n);t=le.filter(t,i)}return le.grep(e,function(e){return le.inArray(e,t)>=0===n})}function p(e){var t=Ue.split("|"),n=e.createDocumentFragment();if(n.createElement)for(;t.length;)n.createElement(t.pop());return n}function f(e,t){return e.getElementsByTagName(t)[0]||e.appendChild(e.ownerDocument.createElement(t))}function h(e){var t=e.getAttributeNode("type");return e.type=(t&&t.specified)+"/"+e.type,e}function g(e){var t=st.exec(e.type);return t?e.type=t[1]:e.removeAttribute("type"),e}function m(e,t){for(var n,i=0;null!=(n=e[i]);i++)le._data(n,"globalEval",!t||le._data(t[i],"globalEval"))}function v(e,t){if(1===t.nodeType&&le.hasData(e)){var n,i,s,r=le._data(e),o=le._data(t,r),a=r.events;if(a){delete o.handle,o.events={};for(n in a)for(i=0,s=a[n].length;s>i;i++)le.event.add(t,n,a[n][i])}o.data&&(o.data=le.extend({},o.data))}}function b(e,t){var n,i,s;if(1===t.nodeType){if(n=t.nodeName.toLowerCase(),!le.support.noCloneEvent&&t[le.expando]){s=le._data(t);for(i in s.events)le.removeEvent(t,i,s.handle);t.removeAttribute(le.expando)}"script"===n&&t.text!==e.text?(h(t).text=e.text,g(t)):"object"===n?(t.parentNode&&(t.outerHTML=e.outerHTML),le.support.html5Clone&&e.innerHTML&&!le.trim(t.innerHTML)&&(t.innerHTML=e.innerHTML)):"input"===n&&tt.test(e.type)?(t.defaultChecked=t.checked=e.checked,t.value!==e.value&&(t.value=e.value)):"option"===n?t.defaultSelected=t.selected=e.defaultSelected:("input"===n||"textarea"===n)&&(t.defaultValue=e.defaultValue)}}function y(e,n){var i,s,r=0,o=typeof e.getElementsByTagName!==X?e.getElementsByTagName(n||"*"):typeof e.querySelectorAll!==X?e.querySelectorAll(n||"*"):t;if(!o)for(o=[],i=e.childNodes||e;null!=(s=i[r]);r++)!n||le.nodeName(s,n)?o.push(s):le.merge(o,y(s,n));return n===t||n&&le.nodeName(e,n)?le.merge([e],o):o}function x(e){tt.test(e.type)&&(e.defaultChecked=e.checked)}function w(e,t){if(t in e)return t;for(var n=t.charAt(0).toUpperCase()+t.slice(1),i=t,s=Dt.length;s--;)if(t=Dt[s]+n,t in e)return t;return i}function k(e,t){return e=t||e,"none"===le.css(e,"display")||!le.contains(e.ownerDocument,e)}function C(e,t){for(var n,i,s,r=[],o=0,a=e.length;a>o;o++)i=e[o],i.style&&(r[o]=le._data(i,"olddisplay"),n=i.style.display,t?(r[o]||"none"!==n||(i.style.display=""),""===i.style.display&&k(i)&&(r[o]=le._data(i,"olddisplay",S(i.nodeName)))):r[o]||(s=k(i),(n&&"none"!==n||!s)&&le._data(i,"olddisplay",s?n:le.css(i,"display"))));for(o=0;a>o;o++)i=e[o],i.style&&(t&&"none"!==i.style.display&&""!==i.style.display||(i.style.display=t?r[o]||"":"none"));return e}function D(e,t,n){var i=vt.exec(t);return i?Math.max(0,i[1]-(n||0))+(i[2]||"px"):t}function T(e,t,n,i,s){for(var r=n===(i?"border":"content")?4:"width"===t?1:0,o=0;4>r;r+=2)"margin"===n&&(o+=le.css(e,n+Ct[r],!0,s)),i?("content"===n&&(o-=le.css(e,"padding"+Ct[r],!0,s)),"margin"!==n&&(o-=le.css(e,"border"+Ct[r]+"Width",!0,s))):(o+=le.css(e,"padding"+Ct[r],!0,s),"padding"!==n&&(o+=le.css(e,"border"+Ct[r]+"Width",!0,s)));return o}function E(e,t,n){var i=!0,s="width"===t?e.offsetWidth:e.offsetHeight,r=ut(e),o=le.support.boxSizing&&"border-box"===le.css(e,"boxSizing",!1,r);if(0>=s||null==s){if(s=dt(e,t,r),(0>s||null==s)&&(s=e.style[t]),bt.test(s))return s;i=o&&(le.support.boxSizingReliable||s===e.style[t]),s=parseFloat(s)||0}return s+T(e,t,n||(o?"border":"content"),i,r)+"px"}function S(e){var t=Q,n=xt[e];return n||(n=j(e,t),"none"!==n&&n||(ct=(ct||le("<iframe frameborder='0' width='0' height='0'/>").css("cssText","display:block !important")).appendTo(t.documentElement),t=(ct[0].contentWindow||ct[0].contentDocument).document,t.write("<!doctype html><html><body>"),t.close(),n=j(e,t),ct.detach()),xt[e]=n),n}function j(e,t){var n=le(t.createElement(e)).appendTo(t.body),i=le.css(n[0],"display");return n.remove(),i}function I(e,t,n,i){var s;if(le.isArray(t))le.each(t,function(t,s){n||Et.test(e)?i(e,s):I(e+"["+("object"==typeof s?t:"")+"]",s,n,i)});else if(n||"object"!==le.type(t))i(e,t);else for(s in t)I(e+"["+s+"]",t[s],n,i)}function $(e){return function(t,n){"string"!=typeof t&&(n=t,t="*");var i,s=0,r=t.toLowerCase().match(ue)||[];if(le.isFunction(n))for(;i=r[s++];)"+"===i[0]?(i=i.slice(1)||"*",(e[i]=e[i]||[]).unshift(n)):(e[i]=e[i]||[]).push(n)}}function _(e,t,n,i){function s(a){var l;return r[a]=!0,le.each(e[a]||[],function(e,a){var c=a(t,n,i);return"string"!=typeof c||o||r[c]?o?!(l=c):void 0:(t.dataTypes.unshift(c),s(c),!1)}),l}var r={},o=e===qt;return s(t.dataTypes[0])||!r["*"]&&s("*")}function A(e,n){var i,s,r=le.ajaxSettings.flatOptions||{};for(s in n)n[s]!==t&&((r[s]?e:i||(i={}))[s]=n[s]);return i&&le.extend(!0,e,i),e}function N(e,n,i){var s,r,o,a,l=e.contents,c=e.dataTypes,u=e.responseFields;for(a in u)a in i&&(n[u[a]]=i[a]);for(;"*"===c[0];)c.shift(),r===t&&(r=e.mimeType||n.getResponseHeader("Content-Type"));if(r)for(a in l)if(l[a]&&l[a].test(r)){c.unshift(a);break}if(c[0]in i)o=c[0];else{for(a in i){if(!c[0]||e.converters[a+" "+c[0]]){o=a;break}s||(s=a)}o=o||s}return o?(o!==c[0]&&c.unshift(o),i[o]):void 0}function O(e,t){var n,i,s,r,o={},a=0,l=e.dataTypes.slice(),c=l[0];if(e.dataFilter&&(t=e.dataFilter(t,e.dataType)),l[1])for(s in e.converters)o[s.toLowerCase()]=e.converters[s];for(;i=l[++a];)if("*"!==i){if("*"!==c&&c!==i){if(s=o[c+" "+i]||o["* "+i],!s)for(n in o)if(r=n.split(" "),r[1]===i&&(s=o[c+" "+r[0]]||o["* "+r[0]])){s===!0?s=o[n]:o[n]!==!0&&(i=r[0],l.splice(a--,0,i));break}if(s!==!0)if(s&&e["throws"])t=s(t);else try{t=s(t)}catch(u){return{state:"parsererror",error:s?u:"No conversion from "+c+" to "+i}}}c=i}return{state:"success",data:t}}function P(){try{return new e.XMLHttpRequest}catch(t){}}function H(){try{return new e.ActiveXObject("Microsoft.XMLHTTP")}catch(t){}}function L(){return setTimeout(function(){Kt=t}),Kt=le.now()}function R(e,t){le.each(t,function(t,n){for(var i=(rn[t]||[]).concat(rn["*"]),s=0,r=i.length;r>s;s++)if(i[s].call(e,t,n))return})}function M(e,t,n){var i,s,r=0,o=sn.length,a=le.Deferred().always(function(){delete l.elem}),l=function(){if(s)return!1;for(var t=Kt||L(),n=Math.max(0,c.startTime+c.duration-t),i=n/c.duration||0,r=1-i,o=0,l=c.tweens.length;l>o;o++)c.tweens[o].run(r);return a.notifyWith(e,[c,r,n]),1>r&&l?n:(a.resolveWith(e,[c]),!1)},c=a.promise({elem:e,props:le.extend({},t),opts:le.extend(!0,{specialEasing:{}},n),originalProperties:t,originalOptions:n,startTime:Kt||L(),duration:n.duration,tweens:[],createTween:function(t,n){var i=le.Tween(e,c.opts,t,n,c.opts.specialEasing[t]||c.opts.easing);return c.tweens.push(i),i},stop:function(t){var n=0,i=t?c.tweens.length:0;if(s)return this;for(s=!0;i>n;n++)c.tweens[n].run(1);return t?a.resolveWith(e,[c,t]):a.rejectWith(e,[c,t]),this}}),u=c.props;for(F(u,c.opts.specialEasing);o>r;r++)if(i=sn[r].call(c,e,u,c.opts))return i;return R(c,u),le.isFunction(c.opts.start)&&c.opts.start.call(e,c),le.fx.timer(le.extend(l,{elem:e,anim:c,queue:c.opts.queue})),c.progress(c.opts.progress).done(c.opts.done,c.opts.complete).fail(c.opts.fail).always(c.opts.always)}function F(e,t){var n,i,s,r,o;for(s in e)if(i=le.camelCase(s),r=t[i],n=e[s],le.isArray(n)&&(r=n[1],n=e[s]=n[0]),s!==i&&(e[i]=n,delete e[s]),o=le.cssHooks[i],o&&"expand"in o){n=o.expand(n),delete e[i];for(s in n)s in e||(e[s]=n[s],t[s]=r)}else t[i]=r}function B(e,t,n){var i,s,r,o,a,l,c,u,d,p=this,f=e.style,h={},g=[],m=e.nodeType&&k(e);n.queue||(u=le._queueHooks(e,"fx"),null==u.unqueued&&(u.unqueued=0,d=u.empty.fire,u.empty.fire=function(){u.unqueued||d()}),u.unqueued++,p.always(function(){p.always(function(){u.unqueued--,le.queue(e,"fx").length||u.empty.fire()})})),1===e.nodeType&&("height"in t||"width"in t)&&(n.overflow=[f.overflow,f.overflowX,f.overflowY],"inline"===le.css(e,"display")&&"none"===le.css(e,"float")&&(le.support.inlineBlockNeedsLayout&&"inline"!==S(e.nodeName)?f.zoom=1:f.display="inline-block")),n.overflow&&(f.overflow="hidden",le.support.shrinkWrapBlocks||p.always(function(){f.overflow=n.overflow[0],f.overflowX=n.overflow[1],f.overflowY=n.overflow[2]}));for(s in t)if(o=t[s],en.exec(o)){if(delete t[s],l=l||"toggle"===o,o===(m?"hide":"show"))continue;g.push(s)}if(r=g.length){a=le._data(e,"fxshow")||le._data(e,"fxshow",{}),"hidden"in a&&(m=a.hidden),l&&(a.hidden=!m),m?le(e).show():p.done(function(){le(e).hide()}),p.done(function(){var t;le._removeData(e,"fxshow");for(t in h)le.style(e,t,h[t])});for(s=0;r>s;s++)i=g[s],c=p.createTween(i,m?a[i]:0),h[i]=a[i]||le.style(e,i),i in a||(a[i]=c.start,m&&(c.end=c.start,c.start="width"===i||"height"===i?1:0))}}function z(e,t,n,i,s){return new z.prototype.init(e,t,n,i,s)}function q(e,t){var n,i={height:e},s=0;for(t=t?1:0;4>s;s+=2-t)n=Ct[s],i["margin"+n]=i["padding"+n]=e;return t&&(i.opacity=i.width=e),i}function W(e){return le.isWindow(e)?e:9===e.nodeType?e.defaultView||e.parentWindow:!1}var V,U,X=typeof t,Q=e.document,J=e.location,Y=e.jQuery,G=e.$,K={},Z=[],ee="1.9.1",te=Z.concat,ne=Z.push,ie=Z.slice,se=Z.indexOf,re=K.toString,oe=K.hasOwnProperty,ae=ee.trim,le=function(e,t){return new le.fn.init(e,t,U)},ce=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,ue=/\S+/g,de=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,pe=/^(?:(<[\w\W]+>)[^>]*|#([\w-]*))$/,fe=/^<(\w+)\s*\/?>(?:<\/\1>|)$/,he=/^[\],:{}\s]*$/,ge=/(?:^|:|,)(?:\s*\[)+/g,me=/\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,ve=/"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g,be=/^-ms-/,ye=/-([\da-z])/gi,xe=function(e,t){return t.toUpperCase()},we=function(e){(Q.addEventListener||"load"===e.type||"complete"===Q.readyState)&&(ke(),le.ready())},ke=function(){Q.addEventListener?(Q.removeEventListener("DOMContentLoaded",we,!1),e.removeEventListener("load",we,!1)):(Q.detachEvent("onreadystatechange",we),e.detachEvent("onload",we))};le.fn=le.prototype={jquery:ee,constructor:le,init:function(e,n,i){var s,r;if(!e)return this;if("string"==typeof e){if(s="<"===e.charAt(0)&&">"===e.charAt(e.length-1)&&e.length>=3?[null,e,null]:pe.exec(e),!s||!s[1]&&n)return!n||n.jquery?(n||i).find(e):this.constructor(n).find(e);if(s[1]){if(n=n instanceof le?n[0]:n,le.merge(this,le.parseHTML(s[1],n&&n.nodeType?n.ownerDocument||n:Q,!0)),fe.test(s[1])&&le.isPlainObject(n))for(s in n)le.isFunction(this[s])?this[s](n[s]):this.attr(s,n[s]);return this}if(r=Q.getElementById(s[2]),r&&r.parentNode){if(r.id!==s[2])return i.find(e);this.length=1,this[0]=r}return this.context=Q,this.selector=e,this}return e.nodeType?(this.context=this[0]=e,this.length=1,this):le.isFunction(e)?i.ready(e):(e.selector!==t&&(this.selector=e.selector,this.context=e.context),le.makeArray(e,this))},selector:"",length:0,size:function(){return this.length},toArray:function(){return ie.call(this)},get:function(e){return null==e?this.toArray():0>e?this[this.length+e]:this[e]},pushStack:function(e){var t=le.merge(this.constructor(),e);return t.prevObject=this,t.context=this.context,t},each:function(e,t){return le.each(this,e,t)},ready:function(e){return le.ready.promise().done(e),this},slice:function(){return this.pushStack(ie.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},eq:function(e){var t=this.length,n=+e+(0>e?t:0);return this.pushStack(n>=0&&t>n?[this[n]]:[])},map:function(e){return this.pushStack(le.map(this,function(t,n){return e.call(t,n,t)}))},end:function(){return this.prevObject||this.constructor(null)},push:ne,sort:[].sort,splice:[].splice},le.fn.init.prototype=le.fn,le.extend=le.fn.extend=function(){var e,n,i,s,r,o,a=arguments[0]||{},l=1,c=arguments.length,u=!1;for("boolean"==typeof a&&(u=a,a=arguments[1]||{},l=2),"object"==typeof a||le.isFunction(a)||(a={}),c===l&&(a=this,--l);c>l;l++)if(null!=(r=arguments[l]))for(s in r)e=a[s],i=r[s],a!==i&&(u&&i&&(le.isPlainObject(i)||(n=le.isArray(i)))?(n?(n=!1,o=e&&le.isArray(e)?e:[]):o=e&&le.isPlainObject(e)?e:{},a[s]=le.extend(u,o,i)):i!==t&&(a[s]=i));return a},le.extend({noConflict:function(t){return e.$===le&&(e.$=G),t&&e.jQuery===le&&(e.jQuery=Y),le},isReady:!1,readyWait:1,holdReady:function(e){e?le.readyWait++:le.ready(!0)},ready:function(e){if(e===!0?!--le.readyWait:!le.isReady){if(!Q.body)return setTimeout(le.ready);le.isReady=!0,e!==!0&&--le.readyWait>0||(V.resolveWith(Q,[le]),le.fn.trigger&&le(Q).trigger("ready").off("ready"))}},isFunction:function(e){return"function"===le.type(e)},isArray:Array.isArray||function(e){return"array"===le.type(e)},isWindow:function(e){return null!=e&&e==e.window},isNumeric:function(e){return!isNaN(parseFloat(e))&&isFinite(e)},type:function(e){return null==e?String(e):"object"==typeof e||"function"==typeof e?K[re.call(e)]||"object":typeof e},isPlainObject:function(e){if(!e||"object"!==le.type(e)||e.nodeType||le.isWindow(e))return!1;try{if(e.constructor&&!oe.call(e,"constructor")&&!oe.call(e.constructor.prototype,"isPrototypeOf"))return!1}catch(n){return!1}var i;for(i in e);return i===t||oe.call(e,i)},isEmptyObject:function(e){var t;for(t in e)return!1;return!0},error:function(e){throw new Error(e)},parseHTML:function(e,t,n){if(!e||"string"!=typeof e)return null;"boolean"==typeof t&&(n=t,t=!1),t=t||Q;var i=fe.exec(e),s=!n&&[];return i?[t.createElement(i[1])]:(i=le.buildFragment([e],t,s),s&&le(s).remove(),le.merge([],i.childNodes))},parseJSON:function(t){return e.JSON&&e.JSON.parse?e.JSON.parse(t):null===t?t:"string"==typeof t&&(t=le.trim(t),t&&he.test(t.replace(me,"@").replace(ve,"]").replace(ge,"")))?new Function("return "+t)():void le.error("Invalid JSON: "+t)},parseXML:function(n){var i,s;if(!n||"string"!=typeof n)return null;try{e.DOMParser?(s=new DOMParser,i=s.parseFromString(n,"text/xml")):(i=new ActiveXObject("Microsoft.XMLDOM"),i.async="false",i.loadXML(n))}catch(r){i=t}return i&&i.documentElement&&!i.getElementsByTagName("parsererror").length||le.error("Invalid XML: "+n),i},noop:function(){},globalEval:function(t){t&&le.trim(t)&&(e.execScript||function(t){e.eval.call(e,t)})(t)},camelCase:function(e){return e.replace(be,"ms-").replace(ye,xe)},nodeName:function(e,t){return e.nodeName&&e.nodeName.toLowerCase()===t.toLowerCase()},each:function(e,t,i){var s,r=0,o=e.length,a=n(e);if(i){if(a)for(;o>r&&(s=t.apply(e[r],i),s!==!1);r++);else for(r in e)if(s=t.apply(e[r],i),s===!1)break}else if(a)for(;o>r&&(s=t.call(e[r],r,e[r]),s!==!1);r++);else for(r in e)if(s=t.call(e[r],r,e[r]),s===!1)break;return e},trim:ae&&!ae.call("\ufeff ")?function(e){return null==e?"":ae.call(e)}:function(e){return null==e?"":(e+"").replace(de,"")},makeArray:function(e,t){var i=t||[];return null!=e&&(n(Object(e))?le.merge(i,"string"==typeof e?[e]:e):ne.call(i,e)),i},inArray:function(e,t,n){var i;if(t){if(se)return se.call(t,e,n);for(i=t.length,n=n?0>n?Math.max(0,i+n):n:0;i>n;n++)if(n in t&&t[n]===e)return n}return-1},merge:function(e,n){var i=n.length,s=e.length,r=0;if("number"==typeof i)for(;i>r;r++)e[s++]=n[r];else for(;n[r]!==t;)e[s++]=n[r++];return e.length=s,e},grep:function(e,t,n){var i,s=[],r=0,o=e.length;for(n=!!n;o>r;r++)i=!!t(e[r],r),n!==i&&s.push(e[r]);return s},map:function(e,t,i){var s,r=0,o=e.length,a=n(e),l=[];if(a)for(;o>r;r++)s=t(e[r],r,i),null!=s&&(l[l.length]=s);else for(r in e)s=t(e[r],r,i),null!=s&&(l[l.length]=s);return te.apply([],l)},guid:1,proxy:function(e,n){var i,s,r;return"string"==typeof n&&(r=e[n],n=e,e=r),le.isFunction(e)?(i=ie.call(arguments,2),s=function(){return e.apply(n||this,i.concat(ie.call(arguments)))},s.guid=e.guid=e.guid||le.guid++,s):t},access:function(e,n,i,s,r,o,a){var l=0,c=e.length,u=null==i;if("object"===le.type(i)){r=!0;for(l in i)le.access(e,n,l,i[l],!0,o,a)}else if(s!==t&&(r=!0,le.isFunction(s)||(a=!0),u&&(a?(n.call(e,s),n=null):(u=n,n=function(e,t,n){return u.call(le(e),n)})),n))for(;c>l;l++)n(e[l],i,a?s:s.call(e[l],l,n(e[l],i)));return r?e:u?n.call(e):c?n(e[0],i):o},now:function(){return(new Date).getTime()}}),le.ready.promise=function(t){if(!V)if(V=le.Deferred(),"complete"===Q.readyState)setTimeout(le.ready);else if(Q.addEventListener)Q.addEventListener("DOMContentLoaded",we,!1),e.addEventListener("load",we,!1);else{Q.attachEvent("onreadystatechange",we),e.attachEvent("onload",we);var n=!1;try{n=null==e.frameElement&&Q.documentElement}catch(i){}n&&n.doScroll&&!function s(){if(!le.isReady){try{n.doScroll("left")}catch(e){return setTimeout(s,50)}ke(),le.ready()}}()}return V.promise(t)},le.each("Boolean Number String Function Array Date RegExp Object Error".split(" "),function(e,t){K["[object "+t+"]"]=t.toLowerCase()}),U=le(Q);var Ce={};le.Callbacks=function(e){e="string"==typeof e?Ce[e]||i(e):le.extend({},e);var n,s,r,o,a,l,c=[],u=!e.once&&[],d=function(t){for(s=e.memory&&t,r=!0,a=l||0,l=0,o=c.length,n=!0;c&&o>a;a++)if(c[a].apply(t[0],t[1])===!1&&e.stopOnFalse){s=!1;break}n=!1,c&&(u?u.length&&d(u.shift()):s?c=[]:p.disable())},p={add:function(){if(c){var t=c.length;!function i(t){le.each(t,function(t,n){var s=le.type(n);"function"===s?e.unique&&p.has(n)||c.push(n):n&&n.length&&"string"!==s&&i(n)})}(arguments),n?o=c.length:s&&(l=t,d(s))}return this},remove:function(){return c&&le.each(arguments,function(e,t){for(var i;(i=le.inArray(t,c,i))>-1;)c.splice(i,1),n&&(o>=i&&o--,a>=i&&a--)}),this},has:function(e){return e?le.inArray(e,c)>-1:!(!c||!c.length)},empty:function(){return c=[],this},disable:function(){return c=u=s=t,this},disabled:function(){return!c},lock:function(){return u=t,s||p.disable(),this},locked:function(){return!u},fireWith:function(e,t){return t=t||[],t=[e,t.slice?t.slice():t],!c||r&&!u||(n?u.push(t):d(t)),this},fire:function(){return p.fireWith(this,arguments),this},fired:function(){return!!r}};return p},le.extend({Deferred:function(e){var t=[["resolve","done",le.Callbacks("once memory"),"resolved"],["reject","fail",le.Callbacks("once memory"),"rejected"],["notify","progress",le.Callbacks("memory")]],n="pending",i={state:function(){return n},always:function(){return s.done(arguments).fail(arguments),this},then:function(){var e=arguments;return le.Deferred(function(n){le.each(t,function(t,r){var o=r[0],a=le.isFunction(e[t])&&e[t];s[r[1]](function(){var e=a&&a.apply(this,arguments);e&&le.isFunction(e.promise)?e.promise().done(n.resolve).fail(n.reject).progress(n.notify):n[o+"With"](this===i?n.promise():this,a?[e]:arguments)})}),e=null}).promise()},promise:function(e){return null!=e?le.extend(e,i):i}},s={};return i.pipe=i.then,le.each(t,function(e,r){var o=r[2],a=r[3];i[r[1]]=o.add,a&&o.add(function(){n=a},t[1^e][2].disable,t[2][2].lock),s[r[0]]=function(){return s[r[0]+"With"](this===s?i:this,arguments),this},s[r[0]+"With"]=o.fireWith}),i.promise(s),e&&e.call(s,s),s},when:function(e){var t,n,i,s=0,r=ie.call(arguments),o=r.length,a=1!==o||e&&le.isFunction(e.promise)?o:0,l=1===a?e:le.Deferred(),c=function(e,n,i){return function(s){n[e]=this,i[e]=arguments.length>1?ie.call(arguments):s,i===t?l.notifyWith(n,i):--a||l.resolveWith(n,i)}};if(o>1)for(t=new Array(o),n=new Array(o),i=new Array(o);o>s;s++)r[s]&&le.isFunction(r[s].promise)?r[s].promise().done(c(s,i,r)).fail(l.reject).progress(c(s,n,t)):--a;return a||l.resolveWith(i,r),l.promise()}}),le.support=function(){var t,n,i,s,r,o,a,l,c,u,d=Q.createElement("div");if(d.setAttribute("className","t"),d.innerHTML="  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>",n=d.getElementsByTagName("*"),i=d.getElementsByTagName("a")[0],!n||!i||!n.length)return{};r=Q.createElement("select"),a=r.appendChild(Q.createElement("option")),s=d.getElementsByTagName("input")[0],i.style.cssText="top:1px;float:left;opacity:.5",t={getSetAttribute:"t"!==d.className,leadingWhitespace:3===d.firstChild.nodeType,tbody:!d.getElementsByTagName("tbody").length,htmlSerialize:!!d.getElementsByTagName("link").length,style:/top/.test(i.getAttribute("style")),hrefNormalized:"/a"===i.getAttribute("href"),opacity:/^0.5/.test(i.style.opacity),cssFloat:!!i.style.cssFloat,checkOn:!!s.value,optSelected:a.selected,enctype:!!Q.createElement("form").enctype,html5Clone:"<:nav></:nav>"!==Q.createElement("nav").cloneNode(!0).outerHTML,boxModel:"CSS1Compat"===Q.compatMode,deleteExpando:!0,noCloneEvent:!0,inlineBlockNeedsLayout:!1,shrinkWrapBlocks:!1,reliableMarginRight:!0,boxSizingReliable:!0,pixelPosition:!1},s.checked=!0,t.noCloneChecked=s.cloneNode(!0).checked,r.disabled=!0,t.optDisabled=!a.disabled;try{delete d.test}catch(p){t.deleteExpando=!1}s=Q.createElement("input"),s.setAttribute("value",""),t.input=""===s.getAttribute("value"),s.value="t",s.setAttribute("type","radio"),t.radioValue="t"===s.value,s.setAttribute("checked","t"),s.setAttribute("name","t"),o=Q.createDocumentFragment(),o.appendChild(s),t.appendChecked=s.checked,t.checkClone=o.cloneNode(!0).cloneNode(!0).lastChild.checked,d.attachEvent&&(d.attachEvent("onclick",function(){t.noCloneEvent=!1}),d.cloneNode(!0).click());for(u in{submit:!0,change:!0,focusin:!0})d.setAttribute(l="on"+u,"t"),t[u+"Bubbles"]=l in e||d.attributes[l].expando===!1;return d.style.backgroundClip="content-box",d.cloneNode(!0).style.backgroundClip="",t.clearCloneStyle="content-box"===d.style.backgroundClip,le(function(){var n,i,s,r="padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;",o=Q.getElementsByTagName("body")[0];o&&(n=Q.createElement("div"),n.style.cssText="border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px",o.appendChild(n).appendChild(d),d.innerHTML="<table><tr><td></td><td>t</td></tr></table>",s=d.getElementsByTagName("td"),s[0].style.cssText="padding:0;margin:0;border:0;display:none",c=0===s[0].offsetHeight,s[0].style.display="",s[1].style.display="none",t.reliableHiddenOffsets=c&&0===s[0].offsetHeight,d.innerHTML="",d.style.cssText="box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;",t.boxSizing=4===d.offsetWidth,t.doesNotIncludeMarginInBodyOffset=1!==o.offsetTop,e.getComputedStyle&&(t.pixelPosition="1%"!==(e.getComputedStyle(d,null)||{}).top,t.boxSizingReliable="4px"===(e.getComputedStyle(d,null)||{width:"4px"}).width,i=d.appendChild(Q.createElement("div")),i.style.cssText=d.style.cssText=r,i.style.marginRight=i.style.width="0",d.style.width="1px",t.reliableMarginRight=!parseFloat((e.getComputedStyle(i,null)||{}).marginRight)),typeof d.style.zoom!==X&&(d.innerHTML="",d.style.cssText=r+"width:1px;padding:1px;display:inline;zoom:1",t.inlineBlockNeedsLayout=3===d.offsetWidth,d.style.display="block",d.innerHTML="<div></div>",d.firstChild.style.width="5px",t.shrinkWrapBlocks=3!==d.offsetWidth,t.inlineBlockNeedsLayout&&(o.style.zoom=1)),o.removeChild(n),n=d=s=i=null)}),n=r=o=a=i=s=null,t}();var De=/(?:\{[\s\S]*\}|\[[\s\S]*\])$/,Te=/([A-Z])/g;le.extend({cache:{},expando:"jQuery"+(ee+Math.random()).replace(/\D/g,""),noData:{embed:!0,object:"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",applet:!0},hasData:function(e){return e=e.nodeType?le.cache[e[le.expando]]:e[le.expando],!!e&&!a(e)},data:function(e,t,n){return s(e,t,n)},removeData:function(e,t){return r(e,t)},_data:function(e,t,n){return s(e,t,n,!0)},_removeData:function(e,t){return r(e,t,!0)},acceptData:function(e){if(e.nodeType&&1!==e.nodeType&&9!==e.nodeType)return!1;var t=e.nodeName&&le.noData[e.nodeName.toLowerCase()];return!t||t!==!0&&e.getAttribute("classid")===t}}),le.fn.extend({data:function(e,n){var i,s,r=this[0],a=0,l=null;if(e===t){if(this.length&&(l=le.data(r),1===r.nodeType&&!le._data(r,"parsedAttrs"))){for(i=r.attributes;a<i.length;a++)s=i[a].name,s.indexOf("data-")||(s=le.camelCase(s.slice(5)),o(r,s,l[s]));le._data(r,"parsedAttrs",!0)}return l}return"object"==typeof e?this.each(function(){le.data(this,e)}):le.access(this,function(n){return n===t?r?o(r,e,le.data(r,e)):null:void this.each(function(){le.data(this,e,n)})},null,n,arguments.length>1,null,!0)},removeData:function(e){return this.each(function(){le.removeData(this,e)})}}),le.extend({queue:function(e,t,n){var i;return e?(t=(t||"fx")+"queue",i=le._data(e,t),n&&(!i||le.isArray(n)?i=le._data(e,t,le.makeArray(n)):i.push(n)),i||[]):void 0},dequeue:function(e,t){t=t||"fx";var n=le.queue(e,t),i=n.length,s=n.shift(),r=le._queueHooks(e,t),o=function(){le.dequeue(e,t)};"inprogress"===s&&(s=n.shift(),i--),r.cur=s,s&&("fx"===t&&n.unshift("inprogress"),delete r.stop,s.call(e,o,r)),!i&&r&&r.empty.fire()},_queueHooks:function(e,t){var n=t+"queueHooks";return le._data(e,n)||le._data(e,n,{empty:le.Callbacks("once memory").add(function(){le._removeData(e,t+"queue"),le._removeData(e,n)})})}}),le.fn.extend({queue:function(e,n){var i=2;return"string"!=typeof e&&(n=e,e="fx",i--),arguments.length<i?le.queue(this[0],e):n===t?this:this.each(function(){var t=le.queue(this,e,n);le._queueHooks(this,e),"fx"===e&&"inprogress"!==t[0]&&le.dequeue(this,e)})},dequeue:function(e){return this.each(function(){le.dequeue(this,e)})},delay:function(e,t){return e=le.fx?le.fx.speeds[e]||e:e,t=t||"fx",this.queue(t,function(t,n){var i=setTimeout(t,e);n.stop=function(){clearTimeout(i)}})},clearQueue:function(e){return this.queue(e||"fx",[])},promise:function(e,n){var i,s=1,r=le.Deferred(),o=this,a=this.length,l=function(){--s||r.resolveWith(o,[o])};for("string"!=typeof e&&(n=e,e=t),e=e||"fx";a--;)i=le._data(o[a],e+"queueHooks"),i&&i.empty&&(s++,i.empty.add(l));return l(),r.promise(n)}});var Ee,Se,je=/[\t\r\n]/g,Ie=/\r/g,$e=/^(?:input|select|textarea|button|object)$/i,_e=/^(?:a|area)$/i,Ae=/^(?:checked|selected|autofocus|autoplay|async|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped)$/i,Ne=/^(?:checked|selected)$/i,Oe=le.support.getSetAttribute,Pe=le.support.input;le.fn.extend({attr:function(e,t){return le.access(this,le.attr,e,t,arguments.length>1)},removeAttr:function(e){return this.each(function(){le.removeAttr(this,e)})},prop:function(e,t){return le.access(this,le.prop,e,t,arguments.length>1)},removeProp:function(e){return e=le.propFix[e]||e,this.each(function(){try{this[e]=t,delete this[e]}catch(n){}})},addClass:function(e){var t,n,i,s,r,o=0,a=this.length,l="string"==typeof e&&e;if(le.isFunction(e))return this.each(function(t){le(this).addClass(e.call(this,t,this.className))});if(l)for(t=(e||"").match(ue)||[];a>o;o++)if(n=this[o],i=1===n.nodeType&&(n.className?(" "+n.className+" ").replace(je," "):" ")){for(r=0;s=t[r++];)i.indexOf(" "+s+" ")<0&&(i+=s+" ");n.className=le.trim(i)}return this},removeClass:function(e){var t,n,i,s,r,o=0,a=this.length,l=0===arguments.length||"string"==typeof e&&e;if(le.isFunction(e))return this.each(function(t){le(this).removeClass(e.call(this,t,this.className))});if(l)for(t=(e||"").match(ue)||[];a>o;o++)if(n=this[o],i=1===n.nodeType&&(n.className?(" "+n.className+" ").replace(je," "):"")){for(r=0;s=t[r++];)for(;i.indexOf(" "+s+" ")>=0;)i=i.replace(" "+s+" "," ");n.className=e?le.trim(i):""}return this},toggleClass:function(e,t){var n=typeof e,i="boolean"==typeof t;return this.each(le.isFunction(e)?function(n){le(this).toggleClass(e.call(this,n,this.className,t),t)}:function(){if("string"===n)for(var s,r=0,o=le(this),a=t,l=e.match(ue)||[];s=l[r++];)a=i?a:!o.hasClass(s),o[a?"addClass":"removeClass"](s);else(n===X||"boolean"===n)&&(this.className&&le._data(this,"__className__",this.className),this.className=this.className||e===!1?"":le._data(this,"__className__")||"")})},hasClass:function(e){for(var t=" "+e+" ",n=0,i=this.length;i>n;n++)if(1===this[n].nodeType&&(" "+this[n].className+" ").replace(je," ").indexOf(t)>=0)return!0;return!1},val:function(e){var n,i,s,r=this[0];{if(arguments.length)return s=le.isFunction(e),this.each(function(n){var r,o=le(this);1===this.nodeType&&(r=s?e.call(this,n,o.val()):e,null==r?r="":"number"==typeof r?r+="":le.isArray(r)&&(r=le.map(r,function(e){return null==e?"":e+""})),i=le.valHooks[this.type]||le.valHooks[this.nodeName.toLowerCase()],i&&"set"in i&&i.set(this,r,"value")!==t||(this.value=r))});if(r)return i=le.valHooks[r.type]||le.valHooks[r.nodeName.toLowerCase()],i&&"get"in i&&(n=i.get(r,"value"))!==t?n:(n=r.value,"string"==typeof n?n.replace(Ie,""):null==n?"":n)}}}),le.extend({valHooks:{option:{get:function(e){var t=e.attributes.value;return!t||t.specified?e.value:e.text}},select:{get:function(e){for(var t,n,i=e.options,s=e.selectedIndex,r="select-one"===e.type||0>s,o=r?null:[],a=r?s+1:i.length,l=0>s?a:r?s:0;a>l;l++)if(n=i[l],!(!n.selected&&l!==s||(le.support.optDisabled?n.disabled:null!==n.getAttribute("disabled"))||n.parentNode.disabled&&le.nodeName(n.parentNode,"optgroup"))){if(t=le(n).val(),r)return t;o.push(t)}return o},set:function(e,t){var n=le.makeArray(t);return le(e).find("option").each(function(){this.selected=le.inArray(le(this).val(),n)>=0}),n.length||(e.selectedIndex=-1),n}}},attr:function(e,n,i){var s,r,o,a=e.nodeType;if(e&&3!==a&&8!==a&&2!==a)return typeof e.getAttribute===X?le.prop(e,n,i):(r=1!==a||!le.isXMLDoc(e),r&&(n=n.toLowerCase(),s=le.attrHooks[n]||(Ae.test(n)?Se:Ee)),i===t?s&&r&&"get"in s&&null!==(o=s.get(e,n))?o:(typeof e.getAttribute!==X&&(o=e.getAttribute(n)),null==o?t:o):null!==i?s&&r&&"set"in s&&(o=s.set(e,i,n))!==t?o:(e.setAttribute(n,i+""),i):void le.removeAttr(e,n))},removeAttr:function(e,t){var n,i,s=0,r=t&&t.match(ue);if(r&&1===e.nodeType)for(;n=r[s++];)i=le.propFix[n]||n,Ae.test(n)?!Oe&&Ne.test(n)?e[le.camelCase("default-"+n)]=e[i]=!1:e[i]=!1:le.attr(e,n,""),e.removeAttribute(Oe?n:i)},attrHooks:{type:{set:function(e,t){if(!le.support.radioValue&&"radio"===t&&le.nodeName(e,"input")){var n=e.value;return e.setAttribute("type",t),n&&(e.value=n),t}}}},propFix:{tabindex:"tabIndex",readonly:"readOnly","for":"htmlFor","class":"className",maxlength:"maxLength",cellspacing:"cellSpacing",cellpadding:"cellPadding",rowspan:"rowSpan",colspan:"colSpan",usemap:"useMap",frameborder:"frameBorder",contenteditable:"contentEditable"},prop:function(e,n,i){var s,r,o,a=e.nodeType;if(e&&3!==a&&8!==a&&2!==a)return o=1!==a||!le.isXMLDoc(e),o&&(n=le.propFix[n]||n,r=le.propHooks[n]),i!==t?r&&"set"in r&&(s=r.set(e,i,n))!==t?s:e[n]=i:r&&"get"in r&&null!==(s=r.get(e,n))?s:e[n];

},propHooks:{tabIndex:{get:function(e){var n=e.getAttributeNode("tabindex");return n&&n.specified?parseInt(n.value,10):$e.test(e.nodeName)||_e.test(e.nodeName)&&e.href?0:t}}}}),Se={get:function(e,n){var i=le.prop(e,n),s="boolean"==typeof i&&e.getAttribute(n),r="boolean"==typeof i?Pe&&Oe?null!=s:Ne.test(n)?e[le.camelCase("default-"+n)]:!!s:e.getAttributeNode(n);return r&&r.value!==!1?n.toLowerCase():t},set:function(e,t,n){return t===!1?le.removeAttr(e,n):Pe&&Oe||!Ne.test(n)?e.setAttribute(!Oe&&le.propFix[n]||n,n):e[le.camelCase("default-"+n)]=e[n]=!0,n}},Pe&&Oe||(le.attrHooks.value={get:function(e,n){var i=e.getAttributeNode(n);return le.nodeName(e,"input")?e.defaultValue:i&&i.specified?i.value:t},set:function(e,t,n){return le.nodeName(e,"input")?void(e.defaultValue=t):Ee&&Ee.set(e,t,n)}}),Oe||(Ee=le.valHooks.button={get:function(e,n){var i=e.getAttributeNode(n);return i&&("id"===n||"name"===n||"coords"===n?""!==i.value:i.specified)?i.value:t},set:function(e,n,i){var s=e.getAttributeNode(i);return s||e.setAttributeNode(s=e.ownerDocument.createAttribute(i)),s.value=n+="","value"===i||n===e.getAttribute(i)?n:t}},le.attrHooks.contenteditable={get:Ee.get,set:function(e,t,n){Ee.set(e,""===t?!1:t,n)}},le.each(["width","height"],function(e,t){le.attrHooks[t]=le.extend(le.attrHooks[t],{set:function(e,n){return""===n?(e.setAttribute(t,"auto"),n):void 0}})})),le.support.hrefNormalized||(le.each(["href","src","width","height"],function(e,n){le.attrHooks[n]=le.extend(le.attrHooks[n],{get:function(e){var i=e.getAttribute(n,2);return null==i?t:i}})}),le.each(["href","src"],function(e,t){le.propHooks[t]={get:function(e){return e.getAttribute(t,4)}}})),le.support.style||(le.attrHooks.style={get:function(e){return e.style.cssText||t},set:function(e,t){return e.style.cssText=t+""}}),le.support.optSelected||(le.propHooks.selected=le.extend(le.propHooks.selected,{get:function(e){var t=e.parentNode;return t&&(t.selectedIndex,t.parentNode&&t.parentNode.selectedIndex),null}})),le.support.enctype||(le.propFix.enctype="encoding"),le.support.checkOn||le.each(["radio","checkbox"],function(){le.valHooks[this]={get:function(e){return null===e.getAttribute("value")?"on":e.value}}}),le.each(["radio","checkbox"],function(){le.valHooks[this]=le.extend(le.valHooks[this],{set:function(e,t){return le.isArray(t)?e.checked=le.inArray(le(e).val(),t)>=0:void 0}})});var He=/^(?:input|select|textarea)$/i,Le=/^key/,Re=/^(?:mouse|contextmenu)|click/,Me=/^(?:focusinfocus|focusoutblur)$/,Fe=/^([^.]*)(?:\.(.+)|)$/;le.event={global:{},add:function(e,n,i,s,r){var o,a,l,c,u,d,p,f,h,g,m,v=le._data(e);if(v){for(i.handler&&(c=i,i=c.handler,r=c.selector),i.guid||(i.guid=le.guid++),(a=v.events)||(a=v.events={}),(d=v.handle)||(d=v.handle=function(e){return typeof le===X||e&&le.event.triggered===e.type?t:le.event.dispatch.apply(d.elem,arguments)},d.elem=e),n=(n||"").match(ue)||[""],l=n.length;l--;)o=Fe.exec(n[l])||[],h=m=o[1],g=(o[2]||"").split(".").sort(),u=le.event.special[h]||{},h=(r?u.delegateType:u.bindType)||h,u=le.event.special[h]||{},p=le.extend({type:h,origType:m,data:s,handler:i,guid:i.guid,selector:r,needsContext:r&&le.expr.match.needsContext.test(r),namespace:g.join(".")},c),(f=a[h])||(f=a[h]=[],f.delegateCount=0,u.setup&&u.setup.call(e,s,g,d)!==!1||(e.addEventListener?e.addEventListener(h,d,!1):e.attachEvent&&e.attachEvent("on"+h,d))),u.add&&(u.add.call(e,p),p.handler.guid||(p.handler.guid=i.guid)),r?f.splice(f.delegateCount++,0,p):f.push(p),le.event.global[h]=!0;e=null}},remove:function(e,t,n,i,s){var r,o,a,l,c,u,d,p,f,h,g,m=le.hasData(e)&&le._data(e);if(m&&(u=m.events)){for(t=(t||"").match(ue)||[""],c=t.length;c--;)if(a=Fe.exec(t[c])||[],f=g=a[1],h=(a[2]||"").split(".").sort(),f){for(d=le.event.special[f]||{},f=(i?d.delegateType:d.bindType)||f,p=u[f]||[],a=a[2]&&new RegExp("(^|\\.)"+h.join("\\.(?:.*\\.|)")+"(\\.|$)"),l=r=p.length;r--;)o=p[r],!s&&g!==o.origType||n&&n.guid!==o.guid||a&&!a.test(o.namespace)||i&&i!==o.selector&&("**"!==i||!o.selector)||(p.splice(r,1),o.selector&&p.delegateCount--,d.remove&&d.remove.call(e,o));l&&!p.length&&(d.teardown&&d.teardown.call(e,h,m.handle)!==!1||le.removeEvent(e,f,m.handle),delete u[f])}else for(f in u)le.event.remove(e,f+t[c],n,i,!0);le.isEmptyObject(u)&&(delete m.handle,le._removeData(e,"events"))}},trigger:function(n,i,s,r){var o,a,l,c,u,d,p,f=[s||Q],h=oe.call(n,"type")?n.type:n,g=oe.call(n,"namespace")?n.namespace.split("."):[];if(l=d=s=s||Q,3!==s.nodeType&&8!==s.nodeType&&!Me.test(h+le.event.triggered)&&(h.indexOf(".")>=0&&(g=h.split("."),h=g.shift(),g.sort()),a=h.indexOf(":")<0&&"on"+h,n=n[le.expando]?n:new le.Event(h,"object"==typeof n&&n),n.isTrigger=!0,n.namespace=g.join("."),n.namespace_re=n.namespace?new RegExp("(^|\\.)"+g.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,n.result=t,n.target||(n.target=s),i=null==i?[n]:le.makeArray(i,[n]),u=le.event.special[h]||{},r||!u.trigger||u.trigger.apply(s,i)!==!1)){if(!r&&!u.noBubble&&!le.isWindow(s)){for(c=u.delegateType||h,Me.test(c+h)||(l=l.parentNode);l;l=l.parentNode)f.push(l),d=l;d===(s.ownerDocument||Q)&&f.push(d.defaultView||d.parentWindow||e)}for(p=0;(l=f[p++])&&!n.isPropagationStopped();)n.type=p>1?c:u.bindType||h,o=(le._data(l,"events")||{})[n.type]&&le._data(l,"handle"),o&&o.apply(l,i),o=a&&l[a],o&&le.acceptData(l)&&o.apply&&o.apply(l,i)===!1&&n.preventDefault();if(n.type=h,!(r||n.isDefaultPrevented()||u._default&&u._default.apply(s.ownerDocument,i)!==!1||"click"===h&&le.nodeName(s,"a")||!le.acceptData(s)||!a||!s[h]||le.isWindow(s))){d=s[a],d&&(s[a]=null),le.event.triggered=h;try{s[h]()}catch(m){}le.event.triggered=t,d&&(s[a]=d)}return n.result}},dispatch:function(e){e=le.event.fix(e);var n,i,s,r,o,a=[],l=ie.call(arguments),c=(le._data(this,"events")||{})[e.type]||[],u=le.event.special[e.type]||{};if(l[0]=e,e.delegateTarget=this,!u.preDispatch||u.preDispatch.call(this,e)!==!1){for(a=le.event.handlers.call(this,e,c),n=0;(r=a[n++])&&!e.isPropagationStopped();)for(e.currentTarget=r.elem,o=0;(s=r.handlers[o++])&&!e.isImmediatePropagationStopped();)(!e.namespace_re||e.namespace_re.test(s.namespace))&&(e.handleObj=s,e.data=s.data,i=((le.event.special[s.origType]||{}).handle||s.handler).apply(r.elem,l),i!==t&&(e.result=i)===!1&&(e.preventDefault(),e.stopPropagation()));return u.postDispatch&&u.postDispatch.call(this,e),e.result}},handlers:function(e,n){var i,s,r,o,a=[],l=n.delegateCount,c=e.target;if(l&&c.nodeType&&(!e.button||"click"!==e.type))for(;c!=this;c=c.parentNode||this)if(1===c.nodeType&&(c.disabled!==!0||"click"!==e.type)){for(r=[],o=0;l>o;o++)s=n[o],i=s.selector+" ",r[i]===t&&(r[i]=s.needsContext?le(i,this).index(c)>=0:le.find(i,this,null,[c]).length),r[i]&&r.push(s);r.length&&a.push({elem:c,handlers:r})}return l<n.length&&a.push({elem:this,handlers:n.slice(l)}),a},fix:function(e){if(e[le.expando])return e;var t,n,i,s=e.type,r=e,o=this.fixHooks[s];for(o||(this.fixHooks[s]=o=Re.test(s)?this.mouseHooks:Le.test(s)?this.keyHooks:{}),i=o.props?this.props.concat(o.props):this.props,e=new le.Event(r),t=i.length;t--;)n=i[t],e[n]=r[n];return e.target||(e.target=r.srcElement||Q),3===e.target.nodeType&&(e.target=e.target.parentNode),e.metaKey=!!e.metaKey,o.filter?o.filter(e,r):e},props:"altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks:{},keyHooks:{props:"char charCode key keyCode".split(" "),filter:function(e,t){return null==e.which&&(e.which=null!=t.charCode?t.charCode:t.keyCode),e}},mouseHooks:{props:"button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),filter:function(e,n){var i,s,r,o=n.button,a=n.fromElement;return null==e.pageX&&null!=n.clientX&&(s=e.target.ownerDocument||Q,r=s.documentElement,i=s.body,e.pageX=n.clientX+(r&&r.scrollLeft||i&&i.scrollLeft||0)-(r&&r.clientLeft||i&&i.clientLeft||0),e.pageY=n.clientY+(r&&r.scrollTop||i&&i.scrollTop||0)-(r&&r.clientTop||i&&i.clientTop||0)),!e.relatedTarget&&a&&(e.relatedTarget=a===e.target?n.toElement:a),e.which||o===t||(e.which=1&o?1:2&o?3:4&o?2:0),e}},special:{load:{noBubble:!0},click:{trigger:function(){return le.nodeName(this,"input")&&"checkbox"===this.type&&this.click?(this.click(),!1):void 0}},focus:{trigger:function(){if(this!==Q.activeElement&&this.focus)try{return this.focus(),!1}catch(e){}},delegateType:"focusin"},blur:{trigger:function(){return this===Q.activeElement&&this.blur?(this.blur(),!1):void 0},delegateType:"focusout"},beforeunload:{postDispatch:function(e){e.result!==t&&(e.originalEvent.returnValue=e.result)}}},simulate:function(e,t,n,i){var s=le.extend(new le.Event,n,{type:e,isSimulated:!0,originalEvent:{}});i?le.event.trigger(s,null,t):le.event.dispatch.call(t,s),s.isDefaultPrevented()&&n.preventDefault()}},le.removeEvent=Q.removeEventListener?function(e,t,n){e.removeEventListener&&e.removeEventListener(t,n,!1)}:function(e,t,n){var i="on"+t;e.detachEvent&&(typeof e[i]===X&&(e[i]=null),e.detachEvent(i,n))},le.Event=function(e,t){return this instanceof le.Event?(e&&e.type?(this.originalEvent=e,this.type=e.type,this.isDefaultPrevented=e.defaultPrevented||e.returnValue===!1||e.getPreventDefault&&e.getPreventDefault()?l:c):this.type=e,t&&le.extend(this,t),this.timeStamp=e&&e.timeStamp||le.now(),void(this[le.expando]=!0)):new le.Event(e,t)},le.Event.prototype={isDefaultPrevented:c,isPropagationStopped:c,isImmediatePropagationStopped:c,preventDefault:function(){var e=this.originalEvent;this.isDefaultPrevented=l,e&&(e.preventDefault?e.preventDefault():e.returnValue=!1)},stopPropagation:function(){var e=this.originalEvent;this.isPropagationStopped=l,e&&(e.stopPropagation&&e.stopPropagation(),e.cancelBubble=!0)},stopImmediatePropagation:function(){this.isImmediatePropagationStopped=l,this.stopPropagation()}},le.each({mouseenter:"mouseover",mouseleave:"mouseout"},function(e,t){le.event.special[e]={delegateType:t,bindType:t,handle:function(e){var n,i=this,s=e.relatedTarget,r=e.handleObj;return(!s||s!==i&&!le.contains(i,s))&&(e.type=r.origType,n=r.handler.apply(this,arguments),e.type=t),n}}}),le.support.submitBubbles||(le.event.special.submit={setup:function(){return le.nodeName(this,"form")?!1:void le.event.add(this,"click._submit keypress._submit",function(e){var n=e.target,i=le.nodeName(n,"input")||le.nodeName(n,"button")?n.form:t;i&&!le._data(i,"submitBubbles")&&(le.event.add(i,"submit._submit",function(e){e._submit_bubble=!0}),le._data(i,"submitBubbles",!0))})},postDispatch:function(e){e._submit_bubble&&(delete e._submit_bubble,this.parentNode&&!e.isTrigger&&le.event.simulate("submit",this.parentNode,e,!0))},teardown:function(){return le.nodeName(this,"form")?!1:void le.event.remove(this,"._submit")}}),le.support.changeBubbles||(le.event.special.change={setup:function(){return He.test(this.nodeName)?(("checkbox"===this.type||"radio"===this.type)&&(le.event.add(this,"propertychange._change",function(e){"checked"===e.originalEvent.propertyName&&(this._just_changed=!0)}),le.event.add(this,"click._change",function(e){this._just_changed&&!e.isTrigger&&(this._just_changed=!1),le.event.simulate("change",this,e,!0)})),!1):void le.event.add(this,"beforeactivate._change",function(e){var t=e.target;He.test(t.nodeName)&&!le._data(t,"changeBubbles")&&(le.event.add(t,"change._change",function(e){!this.parentNode||e.isSimulated||e.isTrigger||le.event.simulate("change",this.parentNode,e,!0)}),le._data(t,"changeBubbles",!0))})},handle:function(e){var t=e.target;return this!==t||e.isSimulated||e.isTrigger||"radio"!==t.type&&"checkbox"!==t.type?e.handleObj.handler.apply(this,arguments):void 0},teardown:function(){return le.event.remove(this,"._change"),!He.test(this.nodeName)}}),le.support.focusinBubbles||le.each({focus:"focusin",blur:"focusout"},function(e,t){var n=0,i=function(e){le.event.simulate(t,e.target,le.event.fix(e),!0)};le.event.special[t]={setup:function(){0===n++&&Q.addEventListener(e,i,!0)},teardown:function(){0===--n&&Q.removeEventListener(e,i,!0)}}}),le.fn.extend({on:function(e,n,i,s,r){var o,a;if("object"==typeof e){"string"!=typeof n&&(i=i||n,n=t);for(o in e)this.on(o,n,i,e[o],r);return this}if(null==i&&null==s?(s=n,i=n=t):null==s&&("string"==typeof n?(s=i,i=t):(s=i,i=n,n=t)),s===!1)s=c;else if(!s)return this;return 1===r&&(a=s,s=function(e){return le().off(e),a.apply(this,arguments)},s.guid=a.guid||(a.guid=le.guid++)),this.each(function(){le.event.add(this,e,s,i,n)})},one:function(e,t,n,i){return this.on(e,t,n,i,1)},off:function(e,n,i){var s,r;if(e&&e.preventDefault&&e.handleObj)return s=e.handleObj,le(e.delegateTarget).off(s.namespace?s.origType+"."+s.namespace:s.origType,s.selector,s.handler),this;if("object"==typeof e){for(r in e)this.off(r,n,e[r]);return this}return(n===!1||"function"==typeof n)&&(i=n,n=t),i===!1&&(i=c),this.each(function(){le.event.remove(this,e,i,n)})},bind:function(e,t,n){return this.on(e,null,t,n)},unbind:function(e,t){return this.off(e,null,t)},delegate:function(e,t,n,i){return this.on(t,e,n,i)},undelegate:function(e,t,n){return 1===arguments.length?this.off(e,"**"):this.off(t,e||"**",n)},trigger:function(e,t){return this.each(function(){le.event.trigger(e,t,this)})},triggerHandler:function(e,t){var n=this[0];return n?le.event.trigger(e,t,n,!0):void 0}}),function(e,t){function n(e){return he.test(e+"")}function i(){var e,t=[];return e=function(n,i){return t.push(n+=" ")>D.cacheLength&&delete e[t.shift()],e[n]=i}}function s(e){return e[M]=!0,e}function r(e){var t=_.createElement("div");try{return e(t)}catch(n){return!1}finally{t=null}}function o(e,t,n,i){var s,r,o,a,l,c,u,f,h,g;if((t?t.ownerDocument||t:F)!==_&&$(t),t=t||_,n=n||[],!e||"string"!=typeof e)return n;if(1!==(a=t.nodeType)&&9!==a)return[];if(!N&&!i){if(s=ge.exec(e))if(o=s[1]){if(9===a){if(r=t.getElementById(o),!r||!r.parentNode)return n;if(r.id===o)return n.push(r),n}else if(t.ownerDocument&&(r=t.ownerDocument.getElementById(o))&&L(t,r)&&r.id===o)return n.push(r),n}else{if(s[2])return G.apply(n,K.call(t.getElementsByTagName(e),0)),n;if((o=s[3])&&B.getByClassName&&t.getElementsByClassName)return G.apply(n,K.call(t.getElementsByClassName(o),0)),n}if(B.qsa&&!O.test(e)){if(u=!0,f=M,h=t,g=9===a&&e,1===a&&"object"!==t.nodeName.toLowerCase()){for(c=d(e),(u=t.getAttribute("id"))?f=u.replace(be,"\\$&"):t.setAttribute("id",f),f="[id='"+f+"'] ",l=c.length;l--;)c[l]=f+p(c[l]);h=fe.test(e)&&t.parentNode||t,g=c.join(",")}if(g)try{return G.apply(n,K.call(h.querySelectorAll(g),0)),n}catch(m){}finally{u||t.removeAttribute("id")}}}return x(e.replace(oe,"$1"),t,n,i)}function a(e,t){var n=t&&e,i=n&&(~t.sourceIndex||Q)-(~e.sourceIndex||Q);if(i)return i;if(n)for(;n=n.nextSibling;)if(n===t)return-1;return e?1:-1}function l(e){return function(t){var n=t.nodeName.toLowerCase();return"input"===n&&t.type===e}}function c(e){return function(t){var n=t.nodeName.toLowerCase();return("input"===n||"button"===n)&&t.type===e}}function u(e){return s(function(t){return t=+t,s(function(n,i){for(var s,r=e([],n.length,t),o=r.length;o--;)n[s=r[o]]&&(n[s]=!(i[s]=n[s]))})})}function d(e,t){var n,i,s,r,a,l,c,u=V[e+" "];if(u)return t?0:u.slice(0);for(a=e,l=[],c=D.preFilter;a;){(!n||(i=ae.exec(a)))&&(i&&(a=a.slice(i[0].length)||a),l.push(s=[])),n=!1,(i=ce.exec(a))&&(n=i.shift(),s.push({value:n,type:i[0].replace(oe," ")}),a=a.slice(n.length));for(r in D.filter)!(i=pe[r].exec(a))||c[r]&&!(i=c[r](i))||(n=i.shift(),s.push({value:n,type:r,matches:i}),a=a.slice(n.length));if(!n)break}return t?a.length:a?o.error(e):V(e,l).slice(0)}function p(e){for(var t=0,n=e.length,i="";n>t;t++)i+=e[t].value;return i}function f(e,t,n){var i=t.dir,s=n&&"parentNode"===i,r=q++;return t.first?function(t,n,r){for(;t=t[i];)if(1===t.nodeType||s)return e(t,n,r)}:function(t,n,o){var a,l,c,u=z+" "+r;if(o){for(;t=t[i];)if((1===t.nodeType||s)&&e(t,n,o))return!0}else for(;t=t[i];)if(1===t.nodeType||s)if(c=t[M]||(t[M]={}),(l=c[i])&&l[0]===u){if((a=l[1])===!0||a===C)return a===!0}else if(l=c[i]=[u],l[1]=e(t,n,o)||C,l[1]===!0)return!0}}function h(e){return e.length>1?function(t,n,i){for(var s=e.length;s--;)if(!e[s](t,n,i))return!1;return!0}:e[0]}function g(e,t,n,i,s){for(var r,o=[],a=0,l=e.length,c=null!=t;l>a;a++)(r=e[a])&&(!n||n(r,i,s))&&(o.push(r),c&&t.push(a));return o}function m(e,t,n,i,r,o){return i&&!i[M]&&(i=m(i)),r&&!r[M]&&(r=m(r,o)),s(function(s,o,a,l){var c,u,d,p=[],f=[],h=o.length,m=s||y(t||"*",a.nodeType?[a]:a,[]),v=!e||!s&&t?m:g(m,p,e,a,l),b=n?r||(s?e:h||i)?[]:o:v;if(n&&n(v,b,a,l),i)for(c=g(b,f),i(c,[],a,l),u=c.length;u--;)(d=c[u])&&(b[f[u]]=!(v[f[u]]=d));if(s){if(r||e){if(r){for(c=[],u=b.length;u--;)(d=b[u])&&c.push(v[u]=d);r(null,b=[],c,l)}for(u=b.length;u--;)(d=b[u])&&(c=r?Z.call(s,d):p[u])>-1&&(s[c]=!(o[c]=d))}}else b=g(b===o?b.splice(h,b.length):b),r?r(null,o,b,l):G.apply(o,b)})}function v(e){for(var t,n,i,s=e.length,r=D.relative[e[0].type],o=r||D.relative[" "],a=r?1:0,l=f(function(e){return e===t},o,!0),c=f(function(e){return Z.call(t,e)>-1},o,!0),u=[function(e,n,i){return!r&&(i||n!==I)||((t=n).nodeType?l(e,n,i):c(e,n,i))}];s>a;a++)if(n=D.relative[e[a].type])u=[f(h(u),n)];else{if(n=D.filter[e[a].type].apply(null,e[a].matches),n[M]){for(i=++a;s>i&&!D.relative[e[i].type];i++);return m(a>1&&h(u),a>1&&p(e.slice(0,a-1)).replace(oe,"$1"),n,i>a&&v(e.slice(a,i)),s>i&&v(e=e.slice(i)),s>i&&p(e))}u.push(n)}return h(u)}function b(e,t){var n=0,i=t.length>0,r=e.length>0,a=function(s,a,l,c,u){var d,p,f,h=[],m=0,v="0",b=s&&[],y=null!=u,x=I,w=s||r&&D.find.TAG("*",u&&a.parentNode||a),k=z+=null==x?1:Math.random()||.1;for(y&&(I=a!==_&&a,C=n);null!=(d=w[v]);v++){if(r&&d){for(p=0;f=e[p++];)if(f(d,a,l)){c.push(d);break}y&&(z=k,C=++n)}i&&((d=!f&&d)&&m--,s&&b.push(d))}if(m+=v,i&&v!==m){for(p=0;f=t[p++];)f(b,h,a,l);if(s){if(m>0)for(;v--;)b[v]||h[v]||(h[v]=Y.call(c));h=g(h)}G.apply(c,h),y&&!s&&h.length>0&&m+t.length>1&&o.uniqueSort(c)}return y&&(z=k,I=x),b};return i?s(a):a}function y(e,t,n){for(var i=0,s=t.length;s>i;i++)o(e,t[i],n);return n}function x(e,t,n,i){var s,r,o,a,l,c=d(e);if(!i&&1===c.length){if(r=c[0]=c[0].slice(0),r.length>2&&"ID"===(o=r[0]).type&&9===t.nodeType&&!N&&D.relative[r[1].type]){if(t=D.find.ID(o.matches[0].replace(xe,we),t)[0],!t)return n;e=e.slice(r.shift().value.length)}for(s=pe.needsContext.test(e)?0:r.length;s--&&(o=r[s],!D.relative[a=o.type]);)if((l=D.find[a])&&(i=l(o.matches[0].replace(xe,we),fe.test(r[0].type)&&t.parentNode||t))){if(r.splice(s,1),e=i.length&&p(r),!e)return G.apply(n,K.call(i,0)),n;break}}return S(e,c)(i,t,N,n,fe.test(e)),n}function w(){}var k,C,D,T,E,S,j,I,$,_,A,N,O,P,H,L,R,M="sizzle"+-new Date,F=e.document,B={},z=0,q=0,W=i(),V=i(),U=i(),X=typeof t,Q=1<<31,J=[],Y=J.pop,G=J.push,K=J.slice,Z=J.indexOf||function(e){for(var t=0,n=this.length;n>t;t++)if(this[t]===e)return t;return-1},ee="[\\x20\\t\\r\\n\\f]",te="(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",ne=te.replace("w","w#"),ie="([*^$|!~]?=)",se="\\["+ee+"*("+te+")"+ee+"*(?:"+ie+ee+"*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|("+ne+")|)|)"+ee+"*\\]",re=":("+te+")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|"+se.replace(3,8)+")*)|.*)\\)|)",oe=new RegExp("^"+ee+"+|((?:^|[^\\\\])(?:\\\\.)*)"+ee+"+$","g"),ae=new RegExp("^"+ee+"*,"+ee+"*"),ce=new RegExp("^"+ee+"*([\\x20\\t\\r\\n\\f>+~])"+ee+"*"),ue=new RegExp(re),de=new RegExp("^"+ne+"$"),pe={ID:new RegExp("^#("+te+")"),CLASS:new RegExp("^\\.("+te+")"),NAME:new RegExp("^\\[name=['\"]?("+te+")['\"]?\\]"),TAG:new RegExp("^("+te.replace("w","w*")+")"),ATTR:new RegExp("^"+se),PSEUDO:new RegExp("^"+re),CHILD:new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+ee+"*(even|odd|(([+-]|)(\\d*)n|)"+ee+"*(?:([+-]|)"+ee+"*(\\d+)|))"+ee+"*\\)|)","i"),needsContext:new RegExp("^"+ee+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+ee+"*((?:-\\d)?\\d*)"+ee+"*\\)|)(?=[^-]|$)","i")},fe=/[\x20\t\r\n\f]*[+~]/,he=/^[^{]+\{\s*\[native code/,ge=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,me=/^(?:input|select|textarea|button)$/i,ve=/^h\d$/i,be=/'|\\/g,ye=/\=[\x20\t\r\n\f]*([^'"\]]*)[\x20\t\r\n\f]*\]/g,xe=/\\([\da-fA-F]{1,6}[\x20\t\r\n\f]?|.)/g,we=function(e,t){var n="0x"+t-65536;return n!==n?t:0>n?String.fromCharCode(n+65536):String.fromCharCode(n>>10|55296,1023&n|56320)};try{K.call(F.documentElement.childNodes,0)[0].nodeType}catch(ke){K=function(e){for(var t,n=[];t=this[e++];)n.push(t);return n}}E=o.isXML=function(e){var t=e&&(e.ownerDocument||e).documentElement;return t?"HTML"!==t.nodeName:!1},$=o.setDocument=function(e){var i=e?e.ownerDocument||e:F;return i!==_&&9===i.nodeType&&i.documentElement?(_=i,A=i.documentElement,N=E(i),B.tagNameNoComments=r(function(e){return e.appendChild(i.createComment("")),!e.getElementsByTagName("*").length}),B.attributes=r(function(e){e.innerHTML="<select></select>";var t=typeof e.lastChild.getAttribute("multiple");return"boolean"!==t&&"string"!==t}),B.getByClassName=r(function(e){return e.innerHTML="<div class='hidden e'></div><div class='hidden'></div>",e.getElementsByClassName&&e.getElementsByClassName("e").length?(e.lastChild.className="e",2===e.getElementsByClassName("e").length):!1}),B.getByName=r(function(e){e.id=M+0,e.innerHTML="<a name='"+M+"'></a><div name='"+M+"'></div>",A.insertBefore(e,A.firstChild);var t=i.getElementsByName&&i.getElementsByName(M).length===2+i.getElementsByName(M+0).length;return B.getIdNotName=!i.getElementById(M),A.removeChild(e),t}),D.attrHandle=r(function(e){return e.innerHTML="<a href='#'></a>",e.firstChild&&typeof e.firstChild.getAttribute!==X&&"#"===e.firstChild.getAttribute("href")})?{}:{href:function(e){return e.getAttribute("href",2)},type:function(e){return e.getAttribute("type")}},B.getIdNotName?(D.find.ID=function(e,t){if(typeof t.getElementById!==X&&!N){var n=t.getElementById(e);return n&&n.parentNode?[n]:[]}},D.filter.ID=function(e){var t=e.replace(xe,we);return function(e){return e.getAttribute("id")===t}}):(D.find.ID=function(e,n){if(typeof n.getElementById!==X&&!N){var i=n.getElementById(e);return i?i.id===e||typeof i.getAttributeNode!==X&&i.getAttributeNode("id").value===e?[i]:t:[]}},D.filter.ID=function(e){var t=e.replace(xe,we);return function(e){var n=typeof e.getAttributeNode!==X&&e.getAttributeNode("id");return n&&n.value===t}}),D.find.TAG=B.tagNameNoComments?function(e,t){return typeof t.getElementsByTagName!==X?t.getElementsByTagName(e):void 0}:function(e,t){var n,i=[],s=0,r=t.getElementsByTagName(e);if("*"===e){for(;n=r[s++];)1===n.nodeType&&i.push(n);return i}return r},D.find.NAME=B.getByName&&function(e,t){return typeof t.getElementsByName!==X?t.getElementsByName(name):void 0},D.find.CLASS=B.getByClassName&&function(e,t){return typeof t.getElementsByClassName===X||N?void 0:t.getElementsByClassName(e)},P=[],O=[":focus"],(B.qsa=n(i.querySelectorAll))&&(r(function(e){e.innerHTML="<select><option selected=''></option></select>",e.querySelectorAll("[selected]").length||O.push("\\["+ee+"*(?:checked|disabled|ismap|multiple|readonly|selected|value)"),e.querySelectorAll(":checked").length||O.push(":checked")}),r(function(e){e.innerHTML="<input type='hidden' i=''/>",e.querySelectorAll("[i^='']").length&&O.push("[*^$]="+ee+"*(?:\"\"|'')"),e.querySelectorAll(":enabled").length||O.push(":enabled",":disabled"),e.querySelectorAll("*,:x"),O.push(",.*:")})),(B.matchesSelector=n(H=A.matchesSelector||A.mozMatchesSelector||A.webkitMatchesSelector||A.oMatchesSelector||A.msMatchesSelector))&&r(function(e){B.disconnectedMatch=H.call(e,"div"),H.call(e,"[s!='']:x"),P.push("!=",re)}),O=new RegExp(O.join("|")),P=new RegExp(P.join("|")),L=n(A.contains)||A.compareDocumentPosition?function(e,t){var n=9===e.nodeType?e.documentElement:e,i=t&&t.parentNode;return e===i||!(!i||1!==i.nodeType||!(n.contains?n.contains(i):e.compareDocumentPosition&&16&e.compareDocumentPosition(i)))}:function(e,t){if(t)for(;t=t.parentNode;)if(t===e)return!0;return!1},R=A.compareDocumentPosition?function(e,t){var n;return e===t?(j=!0,0):(n=t.compareDocumentPosition&&e.compareDocumentPosition&&e.compareDocumentPosition(t))?1&n||e.parentNode&&11===e.parentNode.nodeType?e===i||L(F,e)?-1:t===i||L(F,t)?1:0:4&n?-1:1:e.compareDocumentPosition?-1:1}:function(e,t){var n,s=0,r=e.parentNode,o=t.parentNode,l=[e],c=[t];if(e===t)return j=!0,0;if(!r||!o)return e===i?-1:t===i?1:r?-1:o?1:0;if(r===o)return a(e,t);for(n=e;n=n.parentNode;)l.unshift(n);for(n=t;n=n.parentNode;)c.unshift(n);for(;l[s]===c[s];)s++;return s?a(l[s],c[s]):l[s]===F?-1:c[s]===F?1:0},j=!1,[0,0].sort(R),B.detectDuplicates=j,_):_},o.matches=function(e,t){return o(e,null,null,t)},o.matchesSelector=function(e,t){if((e.ownerDocument||e)!==_&&$(e),t=t.replace(ye,"='$1']"),!(!B.matchesSelector||N||P&&P.test(t)||O.test(t)))try{var n=H.call(e,t);if(n||B.disconnectedMatch||e.document&&11!==e.document.nodeType)return n}catch(i){}return o(t,_,null,[e]).length>0},o.contains=function(e,t){return(e.ownerDocument||e)!==_&&$(e),L(e,t)},o.attr=function(e,t){var n;return(e.ownerDocument||e)!==_&&$(e),N||(t=t.toLowerCase()),(n=D.attrHandle[t])?n(e):N||B.attributes?e.getAttribute(t):((n=e.getAttributeNode(t))||e.getAttribute(t))&&e[t]===!0?t:n&&n.specified?n.value:null},o.error=function(e){throw new Error("Syntax error, unrecognized expression: "+e)},o.uniqueSort=function(e){var t,n=[],i=1,s=0;if(j=!B.detectDuplicates,e.sort(R),j){for(;t=e[i];i++)t===e[i-1]&&(s=n.push(i));for(;s--;)e.splice(n[s],1)}return e},T=o.getText=function(e){var t,n="",i=0,s=e.nodeType;if(s){if(1===s||9===s||11===s){if("string"==typeof e.textContent)return e.textContent;for(e=e.firstChild;e;e=e.nextSibling)n+=T(e)}else if(3===s||4===s)return e.nodeValue}else for(;t=e[i];i++)n+=T(t);return n},D=o.selectors={cacheLength:50,createPseudo:s,match:pe,find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(e){return e[1]=e[1].replace(xe,we),e[3]=(e[4]||e[5]||"").replace(xe,we),"~="===e[2]&&(e[3]=" "+e[3]+" "),e.slice(0,4)},CHILD:function(e){return e[1]=e[1].toLowerCase(),"nth"===e[1].slice(0,3)?(e[3]||o.error(e[0]),e[4]=+(e[4]?e[5]+(e[6]||1):2*("even"===e[3]||"odd"===e[3])),e[5]=+(e[7]+e[8]||"odd"===e[3])):e[3]&&o.error(e[0]),e},PSEUDO:function(e){var t,n=!e[5]&&e[2];return pe.CHILD.test(e[0])?null:(e[4]?e[2]=e[4]:n&&ue.test(n)&&(t=d(n,!0))&&(t=n.indexOf(")",n.length-t)-n.length)&&(e[0]=e[0].slice(0,t),e[2]=n.slice(0,t)),e.slice(0,3))}},filter:{TAG:function(e){return"*"===e?function(){return!0}:(e=e.replace(xe,we).toLowerCase(),function(t){return t.nodeName&&t.nodeName.toLowerCase()===e})},CLASS:function(e){var t=W[e+" "];return t||(t=new RegExp("(^|"+ee+")"+e+"("+ee+"|$)"))&&W(e,function(e){return t.test(e.className||typeof e.getAttribute!==X&&e.getAttribute("class")||"")})},ATTR:function(e,t,n){return function(i){var s=o.attr(i,e);return null==s?"!="===t:t?(s+="","="===t?s===n:"!="===t?s!==n:"^="===t?n&&0===s.indexOf(n):"*="===t?n&&s.indexOf(n)>-1:"$="===t?n&&s.slice(-n.length)===n:"~="===t?(" "+s+" ").indexOf(n)>-1:"|="===t?s===n||s.slice(0,n.length+1)===n+"-":!1):!0}},CHILD:function(e,t,n,i,s){var r="nth"!==e.slice(0,3),o="last"!==e.slice(-4),a="of-type"===t;return 1===i&&0===s?function(e){return!!e.parentNode}:function(t,n,l){var c,u,d,p,f,h,g=r!==o?"nextSibling":"previousSibling",m=t.parentNode,v=a&&t.nodeName.toLowerCase(),b=!l&&!a;if(m){if(r){for(;g;){for(d=t;d=d[g];)if(a?d.nodeName.toLowerCase()===v:1===d.nodeType)return!1;h=g="only"===e&&!h&&"nextSibling"}return!0}if(h=[o?m.firstChild:m.lastChild],o&&b){for(u=m[M]||(m[M]={}),c=u[e]||[],f=c[0]===z&&c[1],p=c[0]===z&&c[2],d=f&&m.childNodes[f];d=++f&&d&&d[g]||(p=f=0)||h.pop();)if(1===d.nodeType&&++p&&d===t){u[e]=[z,f,p];break}}else if(b&&(c=(t[M]||(t[M]={}))[e])&&c[0]===z)p=c[1];else for(;(d=++f&&d&&d[g]||(p=f=0)||h.pop())&&((a?d.nodeName.toLowerCase()!==v:1!==d.nodeType)||!++p||(b&&((d[M]||(d[M]={}))[e]=[z,p]),d!==t)););return p-=s,p===i||p%i===0&&p/i>=0}}},PSEUDO:function(e,t){var n,i=D.pseudos[e]||D.setFilters[e.toLowerCase()]||o.error("unsupported pseudo: "+e);return i[M]?i(t):i.length>1?(n=[e,e,"",t],D.setFilters.hasOwnProperty(e.toLowerCase())?s(function(e,n){for(var s,r=i(e,t),o=r.length;o--;)s=Z.call(e,r[o]),e[s]=!(n[s]=r[o])}):function(e){return i(e,0,n)}):i}},pseudos:{not:s(function(e){var t=[],n=[],i=S(e.replace(oe,"$1"));return i[M]?s(function(e,t,n,s){for(var r,o=i(e,null,s,[]),a=e.length;a--;)(r=o[a])&&(e[a]=!(t[a]=r))}):function(e,s,r){return t[0]=e,i(t,null,r,n),!n.pop()}}),has:s(function(e){return function(t){return o(e,t).length>0}}),contains:s(function(e){return function(t){return(t.textContent||t.innerText||T(t)).indexOf(e)>-1}}),lang:s(function(e){return de.test(e||"")||o.error("unsupported lang: "+e),e=e.replace(xe,we).toLowerCase(),function(t){var n;do if(n=N?t.getAttribute("xml:lang")||t.getAttribute("lang"):t.lang)return n=n.toLowerCase(),n===e||0===n.indexOf(e+"-");while((t=t.parentNode)&&1===t.nodeType);return!1}}),target:function(t){var n=e.location&&e.location.hash;return n&&n.slice(1)===t.id},root:function(e){return e===A},focus:function(e){return e===_.activeElement&&(!_.hasFocus||_.hasFocus())&&!!(e.type||e.href||~e.tabIndex)},enabled:function(e){return e.disabled===!1},disabled:function(e){return e.disabled===!0},checked:function(e){var t=e.nodeName.toLowerCase();return"input"===t&&!!e.checked||"option"===t&&!!e.selected},selected:function(e){return e.parentNode&&e.parentNode.selectedIndex,e.selected===!0},empty:function(e){for(e=e.firstChild;e;e=e.nextSibling)if(e.nodeName>"@"||3===e.nodeType||4===e.nodeType)return!1;return!0},parent:function(e){return!D.pseudos.empty(e)},header:function(e){return ve.test(e.nodeName)},input:function(e){return me.test(e.nodeName)},button:function(e){var t=e.nodeName.toLowerCase();return"input"===t&&"button"===e.type||"button"===t},text:function(e){var t;return"input"===e.nodeName.toLowerCase()&&"text"===e.type&&(null==(t=e.getAttribute("type"))||t.toLowerCase()===e.type)},first:u(function(){return[0]}),last:u(function(e,t){return[t-1]}),eq:u(function(e,t,n){return[0>n?n+t:n]}),even:u(function(e,t){for(var n=0;t>n;n+=2)e.push(n);return e}),odd:u(function(e,t){for(var n=1;t>n;n+=2)e.push(n);return e}),lt:u(function(e,t,n){for(var i=0>n?n+t:n;--i>=0;)e.push(i);return e}),gt:u(function(e,t,n){for(var i=0>n?n+t:n;++i<t;)e.push(i);return e})}};for(k in{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})D.pseudos[k]=l(k);for(k in{submit:!0,reset:!0})D.pseudos[k]=c(k);S=o.compile=function(e,t){var n,i=[],s=[],r=U[e+" "];if(!r){for(t||(t=d(e)),n=t.length;n--;)r=v(t[n]),r[M]?i.push(r):s.push(r);r=U(e,b(s,i))}return r},D.pseudos.nth=D.pseudos.eq,D.filters=w.prototype=D.pseudos,D.setFilters=new w,$(),o.attr=le.attr,le.find=o,le.expr=o.selectors,le.expr[":"]=le.expr.pseudos,le.unique=o.uniqueSort,le.text=o.getText,le.isXMLDoc=o.isXML,le.contains=o.contains}(e);var Be=/Until$/,ze=/^(?:parents|prev(?:Until|All))/,qe=/^.[^:#\[\.,]*$/,We=le.expr.match.needsContext,Ve={children:!0,contents:!0,next:!0,prev:!0};le.fn.extend({find:function(e){var t,n,i,s=this.length;if("string"!=typeof e)return i=this,this.pushStack(le(e).filter(function(){for(t=0;s>t;t++)if(le.contains(i[t],this))return!0}));for(n=[],t=0;s>t;t++)le.find(e,this[t],n);return n=this.pushStack(s>1?le.unique(n):n),n.selector=(this.selector?this.selector+" ":"")+e,n},has:function(e){var t,n=le(e,this),i=n.length;return this.filter(function(){for(t=0;i>t;t++)if(le.contains(this,n[t]))return!0})},not:function(e){return this.pushStack(d(this,e,!1))},filter:function(e){return this.pushStack(d(this,e,!0))},is:function(e){return!!e&&("string"==typeof e?We.test(e)?le(e,this.context).index(this[0])>=0:le.filter(e,this).length>0:this.filter(e).length>0)},closest:function(e,t){for(var n,i=0,s=this.length,r=[],o=We.test(e)||"string"!=typeof e?le(e,t||this.context):0;s>i;i++)for(n=this[i];n&&n.ownerDocument&&n!==t&&11!==n.nodeType;){if(o?o.index(n)>-1:le.find.matchesSelector(n,e)){r.push(n);break}n=n.parentNode}return this.pushStack(r.length>1?le.unique(r):r)},index:function(e){return e?"string"==typeof e?le.inArray(this[0],le(e)):le.inArray(e.jquery?e[0]:e,this):this[0]&&this[0].parentNode?this.first().prevAll().length:-1},add:function(e,t){var n="string"==typeof e?le(e,t):le.makeArray(e&&e.nodeType?[e]:e),i=le.merge(this.get(),n);
>>>>>>> b119f29b7b5e8b74ffb16e95e3c414b03f19975f

return this.pushStack(le.unique(i))},addBack:function(e){return this.add(null==e?this.prevObject:this.prevObject.filter(e))}}),le.fn.andSelf=le.fn.addBack,le.each({parent:function(e){var t=e.parentNode;return t&&11!==t.nodeType?t:null},parents:function(e){return le.dir(e,"parentNode")},parentsUntil:function(e,t,n){return le.dir(e,"parentNode",n)},next:function(e){return u(e,"nextSibling")},prev:function(e){return u(e,"previousSibling")},nextAll:function(e){return le.dir(e,"nextSibling")},prevAll:function(e){return le.dir(e,"previousSibling")},nextUntil:function(e,t,n){return le.dir(e,"nextSibling",n)},prevUntil:function(e,t,n){return le.dir(e,"previousSibling",n)},siblings:function(e){return le.sibling((e.parentNode||{}).firstChild,e)},children:function(e){return le.sibling(e.firstChild)},contents:function(e){return le.nodeName(e,"iframe")?e.contentDocument||e.contentWindow.document:le.merge([],e.childNodes)}},function(e,t){le.fn[e]=function(n,i){var s=le.map(this,t,n);return Be.test(e)||(i=n),i&&"string"==typeof i&&(s=le.filter(i,s)),s=this.length>1&&!Ve[e]?le.unique(s):s,this.length>1&&ze.test(e)&&(s=s.reverse()),this.pushStack(s)}}),le.extend({filter:function(e,t,n){return n&&(e=":not("+e+")"),1===t.length?le.find.matchesSelector(t[0],e)?[t[0]]:[]:le.find.matches(e,t)},dir:function(e,n,i){for(var s=[],r=e[n];r&&9!==r.nodeType&&(i===t||1!==r.nodeType||!le(r).is(i));)1===r.nodeType&&s.push(r),r=r[n];return s},sibling:function(e,t){for(var n=[];e;e=e.nextSibling)1===e.nodeType&&e!==t&&n.push(e);return n}});var Ue="abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",Xe=/ jQuery\d+="(?:null|\d+)"/g,Qe=new RegExp("<(?:"+Ue+")[\\s/>]","i"),Je=/^\s+/,Ye=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,Ge=/<([\w:]+)/,Ke=/<tbody/i,Ze=/<|&#?\w+;/,et=/<(?:script|style|link)/i,tt=/^(?:checkbox|radio)$/i,nt=/checked\s*(?:[^=]|=\s*.checked.)/i,it=/^$|\/(?:java|ecma)script/i,st=/^true\/(.*)/,rt=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,ot={option:[1,"<select multiple='multiple'>","</select>"],legend:[1,"<fieldset>","</fieldset>"],area:[1,"<map>","</map>"],param:[1,"<object>","</object>"],thead:[1,"<table>","</table>"],tr:[2,"<table><tbody>","</tbody></table>"],col:[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:le.support.htmlSerialize?[0,"",""]:[1,"X<div>","</div>"]},at=p(Q),lt=at.appendChild(Q.createElement("div"));ot.optgroup=ot.option,ot.tbody=ot.tfoot=ot.colgroup=ot.caption=ot.thead,ot.th=ot.td,le.fn.extend({text:function(e){return le.access(this,function(e){return e===t?le.text(this):this.empty().append((this[0]&&this[0].ownerDocument||Q).createTextNode(e))},null,e,arguments.length)},wrapAll:function(e){if(le.isFunction(e))return this.each(function(t){le(this).wrapAll(e.call(this,t))});if(this[0]){var t=le(e,this[0].ownerDocument).eq(0).clone(!0);this[0].parentNode&&t.insertBefore(this[0]),t.map(function(){for(var e=this;e.firstChild&&1===e.firstChild.nodeType;)e=e.firstChild;return e}).append(this)}return this},wrapInner:function(e){return this.each(le.isFunction(e)?function(t){le(this).wrapInner(e.call(this,t))}:function(){var t=le(this),n=t.contents();n.length?n.wrapAll(e):t.append(e)})},wrap:function(e){var t=le.isFunction(e);return this.each(function(n){le(this).wrapAll(t?e.call(this,n):e)})},unwrap:function(){return this.parent().each(function(){le.nodeName(this,"body")||le(this).replaceWith(this.childNodes)}).end()},append:function(){return this.domManip(arguments,!0,function(e){(1===this.nodeType||11===this.nodeType||9===this.nodeType)&&this.appendChild(e)})},prepend:function(){return this.domManip(arguments,!0,function(e){(1===this.nodeType||11===this.nodeType||9===this.nodeType)&&this.insertBefore(e,this.firstChild)})},before:function(){return this.domManip(arguments,!1,function(e){this.parentNode&&this.parentNode.insertBefore(e,this)})},after:function(){return this.domManip(arguments,!1,function(e){this.parentNode&&this.parentNode.insertBefore(e,this.nextSibling)})},remove:function(e,t){for(var n,i=0;null!=(n=this[i]);i++)(!e||le.filter(e,[n]).length>0)&&(t||1!==n.nodeType||le.cleanData(y(n)),n.parentNode&&(t&&le.contains(n.ownerDocument,n)&&m(y(n,"script")),n.parentNode.removeChild(n)));return this},empty:function(){for(var e,t=0;null!=(e=this[t]);t++){for(1===e.nodeType&&le.cleanData(y(e,!1));e.firstChild;)e.removeChild(e.firstChild);e.options&&le.nodeName(e,"select")&&(e.options.length=0)}return this},clone:function(e,t){return e=null==e?!1:e,t=null==t?e:t,this.map(function(){return le.clone(this,e,t)})},html:function(e){return le.access(this,function(e){var n=this[0]||{},i=0,s=this.length;if(e===t)return 1===n.nodeType?n.innerHTML.replace(Xe,""):t;if(!("string"!=typeof e||et.test(e)||!le.support.htmlSerialize&&Qe.test(e)||!le.support.leadingWhitespace&&Je.test(e)||ot[(Ge.exec(e)||["",""])[1].toLowerCase()])){e=e.replace(Ye,"<$1></$2>");try{for(;s>i;i++)n=this[i]||{},1===n.nodeType&&(le.cleanData(y(n,!1)),n.innerHTML=e);n=0}catch(r){}}n&&this.empty().append(e)},null,e,arguments.length)},replaceWith:function(e){var t=le.isFunction(e);return t||"string"==typeof e||(e=le(e).not(this).detach()),this.domManip([e],!0,function(e){var t=this.nextSibling,n=this.parentNode;n&&(le(this).remove(),n.insertBefore(e,t))})},detach:function(e){return this.remove(e,!0)},domManip:function(e,n,i){e=te.apply([],e);var s,r,o,a,l,c,u=0,d=this.length,p=this,m=d-1,v=e[0],b=le.isFunction(v);if(b||!(1>=d||"string"!=typeof v||le.support.checkClone)&&nt.test(v))return this.each(function(s){var r=p.eq(s);b&&(e[0]=v.call(this,s,n?r.html():t)),r.domManip(e,n,i)});if(d&&(c=le.buildFragment(e,this[0].ownerDocument,!1,this),s=c.firstChild,1===c.childNodes.length&&(c=s),s)){for(n=n&&le.nodeName(s,"tr"),a=le.map(y(c,"script"),h),o=a.length;d>u;u++)r=c,u!==m&&(r=le.clone(r,!0,!0),o&&le.merge(a,y(r,"script"))),i.call(n&&le.nodeName(this[u],"table")?f(this[u],"tbody"):this[u],r,u);if(o)for(l=a[a.length-1].ownerDocument,le.map(a,g),u=0;o>u;u++)r=a[u],it.test(r.type||"")&&!le._data(r,"globalEval")&&le.contains(l,r)&&(r.src?le.ajax({url:r.src,type:"GET",dataType:"script",async:!1,global:!1,"throws":!0}):le.globalEval((r.text||r.textContent||r.innerHTML||"").replace(rt,"")));c=s=null}return this}}),le.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(e,t){le.fn[e]=function(e){for(var n,i=0,s=[],r=le(e),o=r.length-1;o>=i;i++)n=i===o?this:this.clone(!0),le(r[i])[t](n),ne.apply(s,n.get());return this.pushStack(s)}}),le.extend({clone:function(e,t,n){var i,s,r,o,a,l=le.contains(e.ownerDocument,e);if(le.support.html5Clone||le.isXMLDoc(e)||!Qe.test("<"+e.nodeName+">")?r=e.cloneNode(!0):(lt.innerHTML=e.outerHTML,lt.removeChild(r=lt.firstChild)),!(le.support.noCloneEvent&&le.support.noCloneChecked||1!==e.nodeType&&11!==e.nodeType||le.isXMLDoc(e)))for(i=y(r),a=y(e),o=0;null!=(s=a[o]);++o)i[o]&&b(s,i[o]);if(t)if(n)for(a=a||y(e),i=i||y(r),o=0;null!=(s=a[o]);o++)v(s,i[o]);else v(e,r);return i=y(r,"script"),i.length>0&&m(i,!l&&y(e,"script")),i=a=s=null,r},buildFragment:function(e,t,n,i){for(var s,r,o,a,l,c,u,d=e.length,f=p(t),h=[],g=0;d>g;g++)if(r=e[g],r||0===r)if("object"===le.type(r))le.merge(h,r.nodeType?[r]:r);else if(Ze.test(r)){for(a=a||f.appendChild(t.createElement("div")),l=(Ge.exec(r)||["",""])[1].toLowerCase(),u=ot[l]||ot._default,a.innerHTML=u[1]+r.replace(Ye,"<$1></$2>")+u[2],s=u[0];s--;)a=a.lastChild;if(!le.support.leadingWhitespace&&Je.test(r)&&h.push(t.createTextNode(Je.exec(r)[0])),!le.support.tbody)for(r="table"!==l||Ke.test(r)?"<table>"!==u[1]||Ke.test(r)?0:a:a.firstChild,s=r&&r.childNodes.length;s--;)le.nodeName(c=r.childNodes[s],"tbody")&&!c.childNodes.length&&r.removeChild(c);for(le.merge(h,a.childNodes),a.textContent="";a.firstChild;)a.removeChild(a.firstChild);a=f.lastChild}else h.push(t.createTextNode(r));for(a&&f.removeChild(a),le.support.appendChecked||le.grep(y(h,"input"),x),g=0;r=h[g++];)if((!i||-1===le.inArray(r,i))&&(o=le.contains(r.ownerDocument,r),a=y(f.appendChild(r),"script"),o&&m(a),n))for(s=0;r=a[s++];)it.test(r.type||"")&&n.push(r);return a=null,f},cleanData:function(e,t){for(var n,i,s,r,o=0,a=le.expando,l=le.cache,c=le.support.deleteExpando,u=le.event.special;null!=(n=e[o]);o++)if((t||le.acceptData(n))&&(s=n[a],r=s&&l[s])){if(r.events)for(i in r.events)u[i]?le.event.remove(n,i):le.removeEvent(n,i,r.handle);l[s]&&(delete l[s],c?delete n[a]:typeof n.removeAttribute!==X?n.removeAttribute(a):n[a]=null,Z.push(s))}}});var ct,ut,dt,pt=/alpha\([^)]*\)/i,ft=/opacity\s*=\s*([^)]*)/,ht=/^(top|right|bottom|left)$/,gt=/^(none|table(?!-c[ea]).+)/,mt=/^margin/,vt=new RegExp("^("+ce+")(.*)$","i"),bt=new RegExp("^("+ce+")(?!px)[a-z%]+$","i"),yt=new RegExp("^([+-])=("+ce+")","i"),xt={BODY:"block"},wt={position:"absolute",visibility:"hidden",display:"block"},kt={letterSpacing:0,fontWeight:400},Ct=["Top","Right","Bottom","Left"],Dt=["Webkit","O","Moz","ms"];le.fn.extend({css:function(e,n){return le.access(this,function(e,n,i){var s,r,o={},a=0;if(le.isArray(n)){for(r=ut(e),s=n.length;s>a;a++)o[n[a]]=le.css(e,n[a],!1,r);return o}return i!==t?le.style(e,n,i):le.css(e,n)},e,n,arguments.length>1)},show:function(){return C(this,!0)},hide:function(){return C(this)},toggle:function(e){var t="boolean"==typeof e;return this.each(function(){(t?e:k(this))?le(this).show():le(this).hide()})}}),le.extend({cssHooks:{opacity:{get:function(e,t){if(t){var n=dt(e,"opacity");return""===n?"1":n}}}},cssNumber:{columnCount:!0,fillOpacity:!0,fontWeight:!0,lineHeight:!0,opacity:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{"float":le.support.cssFloat?"cssFloat":"styleFloat"},style:function(e,n,i,s){if(e&&3!==e.nodeType&&8!==e.nodeType&&e.style){var r,o,a,l=le.camelCase(n),c=e.style;if(n=le.cssProps[l]||(le.cssProps[l]=w(c,l)),a=le.cssHooks[n]||le.cssHooks[l],i===t)return a&&"get"in a&&(r=a.get(e,!1,s))!==t?r:c[n];if(o=typeof i,"string"===o&&(r=yt.exec(i))&&(i=(r[1]+1)*r[2]+parseFloat(le.css(e,n)),o="number"),!(null==i||"number"===o&&isNaN(i)||("number"!==o||le.cssNumber[l]||(i+="px"),le.support.clearCloneStyle||""!==i||0!==n.indexOf("background")||(c[n]="inherit"),a&&"set"in a&&(i=a.set(e,i,s))===t)))try{c[n]=i}catch(u){}}},css:function(e,n,i,s){var r,o,a,l=le.camelCase(n);return n=le.cssProps[l]||(le.cssProps[l]=w(e.style,l)),a=le.cssHooks[n]||le.cssHooks[l],a&&"get"in a&&(o=a.get(e,!0,i)),o===t&&(o=dt(e,n,s)),"normal"===o&&n in kt&&(o=kt[n]),""===i||i?(r=parseFloat(o),i===!0||le.isNumeric(r)?r||0:o):o},swap:function(e,t,n,i){var s,r,o={};for(r in t)o[r]=e.style[r],e.style[r]=t[r];s=n.apply(e,i||[]);for(r in t)e.style[r]=o[r];return s}}),e.getComputedStyle?(ut=function(t){return e.getComputedStyle(t,null)},dt=function(e,n,i){var s,r,o,a=i||ut(e),l=a?a.getPropertyValue(n)||a[n]:t,c=e.style;return a&&(""!==l||le.contains(e.ownerDocument,e)||(l=le.style(e,n)),bt.test(l)&&mt.test(n)&&(s=c.width,r=c.minWidth,o=c.maxWidth,c.minWidth=c.maxWidth=c.width=l,l=a.width,c.width=s,c.minWidth=r,c.maxWidth=o)),l}):Q.documentElement.currentStyle&&(ut=function(e){return e.currentStyle},dt=function(e,n,i){var s,r,o,a=i||ut(e),l=a?a[n]:t,c=e.style;return null==l&&c&&c[n]&&(l=c[n]),bt.test(l)&&!ht.test(n)&&(s=c.left,r=e.runtimeStyle,o=r&&r.left,o&&(r.left=e.currentStyle.left),c.left="fontSize"===n?"1em":l,l=c.pixelLeft+"px",c.left=s,o&&(r.left=o)),""===l?"auto":l}),le.each(["height","width"],function(e,t){le.cssHooks[t]={get:function(e,n,i){return n?0===e.offsetWidth&&gt.test(le.css(e,"display"))?le.swap(e,wt,function(){return E(e,t,i)}):E(e,t,i):void 0},set:function(e,n,i){var s=i&&ut(e);return D(e,n,i?T(e,t,i,le.support.boxSizing&&"border-box"===le.css(e,"boxSizing",!1,s),s):0)}}}),le.support.opacity||(le.cssHooks.opacity={get:function(e,t){return ft.test((t&&e.currentStyle?e.currentStyle.filter:e.style.filter)||"")?.01*parseFloat(RegExp.$1)+"":t?"1":""},set:function(e,t){var n=e.style,i=e.currentStyle,s=le.isNumeric(t)?"alpha(opacity="+100*t+")":"",r=i&&i.filter||n.filter||"";n.zoom=1,(t>=1||""===t)&&""===le.trim(r.replace(pt,""))&&n.removeAttribute&&(n.removeAttribute("filter"),""===t||i&&!i.filter)||(n.filter=pt.test(r)?r.replace(pt,s):r+" "+s)}}),le(function(){le.support.reliableMarginRight||(le.cssHooks.marginRight={get:function(e,t){return t?le.swap(e,{display:"inline-block"},dt,[e,"marginRight"]):void 0}}),!le.support.pixelPosition&&le.fn.position&&le.each(["top","left"],function(e,t){le.cssHooks[t]={get:function(e,n){return n?(n=dt(e,t),bt.test(n)?le(e).position()[t]+"px":n):void 0}}})}),le.expr&&le.expr.filters&&(le.expr.filters.hidden=function(e){return e.offsetWidth<=0&&e.offsetHeight<=0||!le.support.reliableHiddenOffsets&&"none"===(e.style&&e.style.display||le.css(e,"display"))},le.expr.filters.visible=function(e){return!le.expr.filters.hidden(e)}),le.each({margin:"",padding:"",border:"Width"},function(e,t){le.cssHooks[e+t]={expand:function(n){for(var i=0,s={},r="string"==typeof n?n.split(" "):[n];4>i;i++)s[e+Ct[i]+t]=r[i]||r[i-2]||r[0];return s}},mt.test(e)||(le.cssHooks[e+t].set=D)});var Tt=/%20/g,Et=/\[\]$/,St=/\r?\n/g,jt=/^(?:submit|button|image|reset|file)$/i,It=/^(?:input|select|textarea|keygen)/i;le.fn.extend({serialize:function(){return le.param(this.serializeArray())},serializeArray:function(){return this.map(function(){var e=le.prop(this,"elements");return e?le.makeArray(e):this}).filter(function(){var e=this.type;return this.name&&!le(this).is(":disabled")&&It.test(this.nodeName)&&!jt.test(e)&&(this.checked||!tt.test(e))}).map(function(e,t){var n=le(this).val();return null==n?null:le.isArray(n)?le.map(n,function(e){return{name:t.name,value:e.replace(St,"\r\n")}}):{name:t.name,value:n.replace(St,"\r\n")}}).get()}}),le.param=function(e,n){var i,s=[],r=function(e,t){t=le.isFunction(t)?t():null==t?"":t,s[s.length]=encodeURIComponent(e)+"="+encodeURIComponent(t)};if(n===t&&(n=le.ajaxSettings&&le.ajaxSettings.traditional),le.isArray(e)||e.jquery&&!le.isPlainObject(e))le.each(e,function(){r(this.name,this.value)});else for(i in e)I(i,e[i],n,r);return s.join("&").replace(Tt,"+")},le.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),function(e,t){le.fn[t]=function(e,n){return arguments.length>0?this.on(t,null,e,n):this.trigger(t)}}),le.fn.hover=function(e,t){return this.mouseenter(e).mouseleave(t||e)};var $t,_t,At=le.now(),Nt=/\?/,Ot=/#.*$/,Pt=/([?&])_=[^&]*/,Ht=/^(.*?):[ \t]*([^\r\n]*)\r?$/gm,Lt=/^(?:about|app|app-storage|.+-extension|file|res|widget):$/,Rt=/^(?:GET|HEAD)$/,Mt=/^\/\//,Ft=/^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,Bt=le.fn.load,zt={},qt={},Wt="*/".concat("*");try{_t=J.href}catch(Vt){_t=Q.createElement("a"),_t.href="",_t=_t.href}$t=Ft.exec(_t.toLowerCase())||[],le.fn.load=function(e,n,i){if("string"!=typeof e&&Bt)return Bt.apply(this,arguments);var s,r,o,a=this,l=e.indexOf(" ");return l>=0&&(s=e.slice(l,e.length),e=e.slice(0,l)),le.isFunction(n)?(i=n,n=t):n&&"object"==typeof n&&(o="POST"),a.length>0&&le.ajax({url:e,type:o,dataType:"html",data:n}).done(function(e){r=arguments,a.html(s?le("<div>").append(le.parseHTML(e)).find(s):e)}).complete(i&&function(e,t){a.each(i,r||[e.responseText,t,e])}),this},le.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(e,t){le.fn[t]=function(e){return this.on(t,e)}}),le.each(["get","post"],function(e,n){le[n]=function(e,i,s,r){return le.isFunction(i)&&(r=r||s,s=i,i=t),le.ajax({url:e,type:n,dataType:r,data:i,success:s})}}),le.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:_t,type:"GET",isLocal:Lt.test($t[1]),global:!0,processData:!0,async:!0,contentType:"application/x-www-form-urlencoded; charset=UTF-8",accepts:{"*":Wt,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/xml/,html:/html/,json:/json/},responseFields:{xml:"responseXML",text:"responseText"},converters:{"* text":e.String,"text html":!0,"text json":le.parseJSON,"text xml":le.parseXML},flatOptions:{url:!0,context:!0}},ajaxSetup:function(e,t){return t?A(A(e,le.ajaxSettings),t):A(le.ajaxSettings,e)},ajaxPrefilter:$(zt),ajaxTransport:$(qt),ajax:function(e,n){function i(e,n,i,s){var r,d,b,y,w,C=n;2!==x&&(x=2,l&&clearTimeout(l),u=t,a=s||"",k.readyState=e>0?4:0,i&&(y=N(p,k,i)),e>=200&&300>e||304===e?(p.ifModified&&(w=k.getResponseHeader("Last-Modified"),w&&(le.lastModified[o]=w),w=k.getResponseHeader("etag"),w&&(le.etag[o]=w)),204===e?(r=!0,C="nocontent"):304===e?(r=!0,C="notmodified"):(r=O(p,y),C=r.state,d=r.data,b=r.error,r=!b)):(b=C,(e||!C)&&(C="error",0>e&&(e=0))),k.status=e,k.statusText=(n||C)+"",r?g.resolveWith(f,[d,C,k]):g.rejectWith(f,[k,C,b]),k.statusCode(v),v=t,c&&h.trigger(r?"ajaxSuccess":"ajaxError",[k,p,r?d:b]),m.fireWith(f,[k,C]),c&&(h.trigger("ajaxComplete",[k,p]),--le.active||le.event.trigger("ajaxStop")))}"object"==typeof e&&(n=e,e=t),n=n||{};var s,r,o,a,l,c,u,d,p=le.ajaxSetup({},n),f=p.context||p,h=p.context&&(f.nodeType||f.jquery)?le(f):le.event,g=le.Deferred(),m=le.Callbacks("once memory"),v=p.statusCode||{},b={},y={},x=0,w="canceled",k={readyState:0,getResponseHeader:function(e){var t;if(2===x){if(!d)for(d={};t=Ht.exec(a);)d[t[1].toLowerCase()]=t[2];t=d[e.toLowerCase()]}return null==t?null:t},getAllResponseHeaders:function(){return 2===x?a:null},setRequestHeader:function(e,t){var n=e.toLowerCase();return x||(e=y[n]=y[n]||e,b[e]=t),this},overrideMimeType:function(e){return x||(p.mimeType=e),this},statusCode:function(e){var t;if(e)if(2>x)for(t in e)v[t]=[v[t],e[t]];else k.always(e[k.status]);return this},abort:function(e){var t=e||w;return u&&u.abort(t),i(0,t),this}};if(g.promise(k).complete=m.add,k.success=k.done,k.error=k.fail,p.url=((e||p.url||_t)+"").replace(Ot,"").replace(Mt,$t[1]+"//"),p.type=n.method||n.type||p.method||p.type,p.dataTypes=le.trim(p.dataType||"*").toLowerCase().match(ue)||[""],null==p.crossDomain&&(s=Ft.exec(p.url.toLowerCase()),p.crossDomain=!(!s||s[1]===$t[1]&&s[2]===$t[2]&&(s[3]||("http:"===s[1]?80:443))==($t[3]||("http:"===$t[1]?80:443)))),p.data&&p.processData&&"string"!=typeof p.data&&(p.data=le.param(p.data,p.traditional)),_(zt,p,n,k),2===x)return k;c=p.global,c&&0===le.active++&&le.event.trigger("ajaxStart"),p.type=p.type.toUpperCase(),p.hasContent=!Rt.test(p.type),o=p.url,p.hasContent||(p.data&&(o=p.url+=(Nt.test(o)?"&":"?")+p.data,delete p.data),p.cache===!1&&(p.url=Pt.test(o)?o.replace(Pt,"$1_="+At++):o+(Nt.test(o)?"&":"?")+"_="+At++)),p.ifModified&&(le.lastModified[o]&&k.setRequestHeader("If-Modified-Since",le.lastModified[o]),le.etag[o]&&k.setRequestHeader("If-None-Match",le.etag[o])),(p.data&&p.hasContent&&p.contentType!==!1||n.contentType)&&k.setRequestHeader("Content-Type",p.contentType),k.setRequestHeader("Accept",p.dataTypes[0]&&p.accepts[p.dataTypes[0]]?p.accepts[p.dataTypes[0]]+("*"!==p.dataTypes[0]?", "+Wt+"; q=0.01":""):p.accepts["*"]);for(r in p.headers)k.setRequestHeader(r,p.headers[r]);if(p.beforeSend&&(p.beforeSend.call(f,k,p)===!1||2===x))return k.abort();w="abort";for(r in{success:1,error:1,complete:1})k[r](p[r]);if(u=_(qt,p,n,k)){k.readyState=1,c&&h.trigger("ajaxSend",[k,p]),p.async&&p.timeout>0&&(l=setTimeout(function(){k.abort("timeout")},p.timeout));try{x=1,u.send(b,i)}catch(C){if(!(2>x))throw C;i(-1,C)}}else i(-1,"No Transport");return k},getScript:function(e,n){return le.get(e,t,n,"script")},getJSON:function(e,t,n){return le.get(e,t,n,"json")}}),le.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/(?:java|ecma)script/},converters:{"text script":function(e){return le.globalEval(e),e}}}),le.ajaxPrefilter("script",function(e){e.cache===t&&(e.cache=!1),e.crossDomain&&(e.type="GET",e.global=!1)}),le.ajaxTransport("script",function(e){if(e.crossDomain){var n,i=Q.head||le("head")[0]||Q.documentElement;return{send:function(t,s){n=Q.createElement("script"),n.async=!0,e.scriptCharset&&(n.charset=e.scriptCharset),n.src=e.url,n.onload=n.onreadystatechange=function(e,t){(t||!n.readyState||/loaded|complete/.test(n.readyState))&&(n.onload=n.onreadystatechange=null,n.parentNode&&n.parentNode.removeChild(n),n=null,t||s(200,"success"))},i.insertBefore(n,i.firstChild)},abort:function(){n&&n.onload(t,!0)}}}});var Ut=[],Xt=/(=)\?(?=&|$)|\?\?/;le.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var e=Ut.pop()||le.expando+"_"+At++;return this[e]=!0,e}}),le.ajaxPrefilter("json jsonp",function(n,i,s){var r,o,a,l=n.jsonp!==!1&&(Xt.test(n.url)?"url":"string"==typeof n.data&&!(n.contentType||"").indexOf("application/x-www-form-urlencoded")&&Xt.test(n.data)&&"data");return l||"jsonp"===n.dataTypes[0]?(r=n.jsonpCallback=le.isFunction(n.jsonpCallback)?n.jsonpCallback():n.jsonpCallback,l?n[l]=n[l].replace(Xt,"$1"+r):n.jsonp!==!1&&(n.url+=(Nt.test(n.url)?"&":"?")+n.jsonp+"="+r),n.converters["script json"]=function(){return a||le.error(r+" was not called"),a[0]},n.dataTypes[0]="json",o=e[r],e[r]=function(){a=arguments},s.always(function(){e[r]=o,n[r]&&(n.jsonpCallback=i.jsonpCallback,Ut.push(r)),a&&le.isFunction(o)&&o(a[0]),a=o=t}),"script"):void 0});var Qt,Jt,Yt=0,Gt=e.ActiveXObject&&function(){var e;for(e in Qt)Qt[e](t,!0)};le.ajaxSettings.xhr=e.ActiveXObject?function(){return!this.isLocal&&P()||H()}:P,Jt=le.ajaxSettings.xhr(),le.support.cors=!!Jt&&"withCredentials"in Jt,Jt=le.support.ajax=!!Jt,Jt&&le.ajaxTransport(function(n){if(!n.crossDomain||le.support.cors){var i;return{send:function(s,r){var o,a,l=n.xhr();if(n.username?l.open(n.type,n.url,n.async,n.username,n.password):l.open(n.type,n.url,n.async),n.xhrFields)for(a in n.xhrFields)l[a]=n.xhrFields[a];n.mimeType&&l.overrideMimeType&&l.overrideMimeType(n.mimeType),n.crossDomain||s["X-Requested-With"]||(s["X-Requested-With"]="XMLHttpRequest");try{for(a in s)l.setRequestHeader(a,s[a])}catch(c){}l.send(n.hasContent&&n.data||null),i=function(e,s){var a,c,u,d;try{if(i&&(s||4===l.readyState))if(i=t,o&&(l.onreadystatechange=le.noop,Gt&&delete Qt[o]),s)4!==l.readyState&&l.abort();else{d={},a=l.status,c=l.getAllResponseHeaders(),"string"==typeof l.responseText&&(d.text=l.responseText);try{u=l.statusText}catch(p){u=""}a||!n.isLocal||n.crossDomain?1223===a&&(a=204):a=d.text?200:404}}catch(f){s||r(-1,f)}d&&r(a,u,d,c)},n.async?4===l.readyState?setTimeout(i):(o=++Yt,Gt&&(Qt||(Qt={},le(e).unload(Gt)),Qt[o]=i),l.onreadystatechange=i):i()},abort:function(){i&&i(t,!0)}}}});var Kt,Zt,en=/^(?:toggle|show|hide)$/,tn=new RegExp("^(?:([+-])=|)("+ce+")([a-z%]*)$","i"),nn=/queueHooks$/,sn=[B],rn={"*":[function(e,t){var n,i,s=this.createTween(e,t),r=tn.exec(t),o=s.cur(),a=+o||0,l=1,c=20;if(r){if(n=+r[2],i=r[3]||(le.cssNumber[e]?"":"px"),"px"!==i&&a){a=le.css(s.elem,e,!0)||n||1;do l=l||".5",a/=l,le.style(s.elem,e,a+i);while(l!==(l=s.cur()/o)&&1!==l&&--c)}s.unit=i,s.start=a,s.end=r[1]?a+(r[1]+1)*n:n}return s}]};le.Animation=le.extend(M,{tweener:function(e,t){le.isFunction(e)?(t=e,e=["*"]):e=e.split(" ");for(var n,i=0,s=e.length;s>i;i++)n=e[i],rn[n]=rn[n]||[],rn[n].unshift(t)},prefilter:function(e,t){t?sn.unshift(e):sn.push(e)}}),le.Tween=z,z.prototype={constructor:z,init:function(e,t,n,i,s,r){this.elem=e,this.prop=n,this.easing=s||"swing",this.options=t,this.start=this.now=this.cur(),this.end=i,this.unit=r||(le.cssNumber[n]?"":"px")},cur:function(){var e=z.propHooks[this.prop];return e&&e.get?e.get(this):z.propHooks._default.get(this)},run:function(e){var t,n=z.propHooks[this.prop];return this.pos=t=this.options.duration?le.easing[this.easing](e,this.options.duration*e,0,1,this.options.duration):e,this.now=(this.end-this.start)*t+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),n&&n.set?n.set(this):z.propHooks._default.set(this),this}},z.prototype.init.prototype=z.prototype,z.propHooks={_default:{get:function(e){var t;return null==e.elem[e.prop]||e.elem.style&&null!=e.elem.style[e.prop]?(t=le.css(e.elem,e.prop,""),t&&"auto"!==t?t:0):e.elem[e.prop]},set:function(e){le.fx.step[e.prop]?le.fx.step[e.prop](e):e.elem.style&&(null!=e.elem.style[le.cssProps[e.prop]]||le.cssHooks[e.prop])?le.style(e.elem,e.prop,e.now+e.unit):e.elem[e.prop]=e.now}}},z.propHooks.scrollTop=z.propHooks.scrollLeft={set:function(e){e.elem.nodeType&&e.elem.parentNode&&(e.elem[e.prop]=e.now)}},le.each(["toggle","show","hide"],function(e,t){var n=le.fn[t];le.fn[t]=function(e,i,s){return null==e||"boolean"==typeof e?n.apply(this,arguments):this.animate(q(t,!0),e,i,s)}}),le.fn.extend({fadeTo:function(e,t,n,i){return this.filter(k).css("opacity",0).show().end().animate({opacity:t},e,n,i)},animate:function(e,t,n,i){var s=le.isEmptyObject(e),r=le.speed(t,n,i),o=function(){var t=M(this,le.extend({},e),r);o.finish=function(){t.stop(!0)},(s||le._data(this,"finish"))&&t.stop(!0)};return o.finish=o,s||r.queue===!1?this.each(o):this.queue(r.queue,o)},stop:function(e,n,i){var s=function(e){var t=e.stop;delete e.stop,t(i)};return"string"!=typeof e&&(i=n,n=e,e=t),n&&e!==!1&&this.queue(e||"fx",[]),this.each(function(){var t=!0,n=null!=e&&e+"queueHooks",r=le.timers,o=le._data(this);if(n)o[n]&&o[n].stop&&s(o[n]);else for(n in o)o[n]&&o[n].stop&&nn.test(n)&&s(o[n]);for(n=r.length;n--;)r[n].elem!==this||null!=e&&r[n].queue!==e||(r[n].anim.stop(i),t=!1,r.splice(n,1));(t||!i)&&le.dequeue(this,e)})},finish:function(e){return e!==!1&&(e=e||"fx"),this.each(function(){var t,n=le._data(this),i=n[e+"queue"],s=n[e+"queueHooks"],r=le.timers,o=i?i.length:0;for(n.finish=!0,le.queue(this,e,[]),s&&s.cur&&s.cur.finish&&s.cur.finish.call(this),t=r.length;t--;)r[t].elem===this&&r[t].queue===e&&(r[t].anim.stop(!0),r.splice(t,1));for(t=0;o>t;t++)i[t]&&i[t].finish&&i[t].finish.call(this);delete n.finish})}}),le.each({slideDown:q("show"),slideUp:q("hide"),slideToggle:q("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(e,t){le.fn[e]=function(e,n,i){return this.animate(t,e,n,i)}}),le.speed=function(e,t,n){var i=e&&"object"==typeof e?le.extend({},e):{complete:n||!n&&t||le.isFunction(e)&&e,duration:e,easing:n&&t||t&&!le.isFunction(t)&&t};return i.duration=le.fx.off?0:"number"==typeof i.duration?i.duration:i.duration in le.fx.speeds?le.fx.speeds[i.duration]:le.fx.speeds._default,(null==i.queue||i.queue===!0)&&(i.queue="fx"),i.old=i.complete,i.complete=function(){le.isFunction(i.old)&&i.old.call(this),i.queue&&le.dequeue(this,i.queue)},i},le.easing={linear:function(e){return e},swing:function(e){return.5-Math.cos(e*Math.PI)/2}},le.timers=[],le.fx=z.prototype.init,le.fx.tick=function(){var e,n=le.timers,i=0;for(Kt=le.now();i<n.length;i++)e=n[i],e()||n[i]!==e||n.splice(i--,1);n.length||le.fx.stop(),Kt=t},le.fx.timer=function(e){e()&&le.timers.push(e)&&le.fx.start()},le.fx.interval=13,le.fx.start=function(){Zt||(Zt=setInterval(le.fx.tick,le.fx.interval))},le.fx.stop=function(){clearInterval(Zt),Zt=null},le.fx.speeds={slow:600,fast:200,_default:400},le.fx.step={},le.expr&&le.expr.filters&&(le.expr.filters.animated=function(e){return le.grep(le.timers,function(t){return e===t.elem}).length}),le.fn.offset=function(e){if(arguments.length)return e===t?this:this.each(function(t){le.offset.setOffset(this,e,t)});var n,i,s={top:0,left:0},r=this[0],o=r&&r.ownerDocument;if(o)return n=o.documentElement,le.contains(n,r)?(typeof r.getBoundingClientRect!==X&&(s=r.getBoundingClientRect()),i=W(o),{top:s.top+(i.pageYOffset||n.scrollTop)-(n.clientTop||0),left:s.left+(i.pageXOffset||n.scrollLeft)-(n.clientLeft||0)}):s},le.offset={setOffset:function(e,t,n){var i=le.css(e,"position");"static"===i&&(e.style.position="relative");var s,r,o=le(e),a=o.offset(),l=le.css(e,"top"),c=le.css(e,"left"),u=("absolute"===i||"fixed"===i)&&le.inArray("auto",[l,c])>-1,d={},p={};u?(p=o.position(),s=p.top,r=p.left):(s=parseFloat(l)||0,r=parseFloat(c)||0),le.isFunction(t)&&(t=t.call(e,n,a)),null!=t.top&&(d.top=t.top-a.top+s),null!=t.left&&(d.left=t.left-a.left+r),"using"in t?t.using.call(e,d):o.css(d)}},le.fn.extend({position:function(){if(this[0]){var e,t,n={top:0,left:0},i=this[0];return"fixed"===le.css(i,"position")?t=i.getBoundingClientRect():(e=this.offsetParent(),t=this.offset(),le.nodeName(e[0],"html")||(n=e.offset()),n.top+=le.css(e[0],"borderTopWidth",!0),n.left+=le.css(e[0],"borderLeftWidth",!0)),{top:t.top-n.top-le.css(i,"marginTop",!0),left:t.left-n.left-le.css(i,"marginLeft",!0)}}},offsetParent:function(){return this.map(function(){for(var e=this.offsetParent||Q.documentElement;e&&!le.nodeName(e,"html")&&"static"===le.css(e,"position");)e=e.offsetParent;return e||Q.documentElement})}}),le.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(e,n){var i=/Y/.test(n);le.fn[e]=function(s){return le.access(this,function(e,s,r){var o=W(e);return r===t?o?n in o?o[n]:o.document.documentElement[s]:e[s]:void(o?o.scrollTo(i?le(o).scrollLeft():r,i?r:le(o).scrollTop()):e[s]=r)},e,s,arguments.length,null)}}),le.each({Height:"height",Width:"width"},function(e,n){le.each({padding:"inner"+e,content:n,"":"outer"+e},function(i,s){le.fn[s]=function(s,r){var o=arguments.length&&(i||"boolean"!=typeof s),a=i||(s===!0||r===!0?"margin":"border");return le.access(this,function(n,i,s){var r;return le.isWindow(n)?n.document.documentElement["client"+e]:9===n.nodeType?(r=n.documentElement,Math.max(n.body["scroll"+e],r["scroll"+e],n.body["offset"+e],r["offset"+e],r["client"+e])):s===t?le.css(n,i,a):le.style(n,i,s,a)},n,o?s:t,o,null)}})}),e.jQuery=e.$=le,"function"==typeof define&&define.amd&&define.amd.jQuery&&define("jquery",[],function(){return le})}(window),function(e){var t={},n=0;e.fn.once=function(i,s){"string"!=typeof i&&(i in t||(t[i]=++n),s||(s=i),i="jquery-once-"+t[i]);var r=i+"-processed",o=this.not("."+r).addClass(r);return e.isFunction(s)?o.each(s):o},e.fn.removeOnce=function(t,n){var i=t+"-processed",s=this.filter("."+i).removeClass(i);return e.isFunction(n)?s.each(n):s}}(jQuery);var Drupal=Drupal||{settings:{},behaviors:{},locale:{}};jQuery.noConflict(),function(e){var t=e.fn.init;e.fn.init=function(e,n,i){if(e&&"string"==typeof e){var s=e.indexOf("#");if(s>=0){var r=e.indexOf("<");if(r>s)throw"Syntax error, unrecognized expression: "+e}}return t.call(this,e,n,i)},e.fn.init.prototype=t.prototype,Drupal.attachBehaviors=function(t,n){t=t||document,n=n||Drupal.settings,e.each(Drupal.behaviors,function(){e.isFunction(this.attach)&&this.attach(t,n)})},Drupal.detachBehaviors=function(t,n,i){t=t||document,n=n||Drupal.settings,i=i||"unload",e.each(Drupal.behaviors,function(){e.isFunction(this.detach)&&this.detach(t,n,i)})},Drupal.checkPlain=function(e){var t,n,i={"&":"&amp;",'"':"&quot;","<":"&lt;",">":"&gt;"};e=String(e);for(t in i)i.hasOwnProperty(t)&&(n=new RegExp(t,"g"),e=e.replace(n,i[t]));return e},Drupal.formatString=function(e,t){for(var n in t){switch(n.charAt(0)){case"@":t[n]=Drupal.checkPlain(t[n]);break;case"!":break;case"%":default:t[n]=Drupal.theme("placeholder",t[n])}e=e.replace(n,t[n])}return e},Drupal.t=function(e,t,n){return n=n||{},n.context=n.context||"",Drupal.locale.strings&&Drupal.locale.strings[n.context]&&Drupal.locale.strings[n.context][e]&&(e=Drupal.locale.strings[n.context][e]),t&&(e=Drupal.formatString(e,t)),e},Drupal.formatPlural=function(e,t,n,i,s){var i=i||{};i["@count"]=e;var r=Drupal.locale.pluralFormula?Drupal.locale.pluralFormula(i["@count"]):1==i["@count"]?0:1;return 0==r?Drupal.t(t,i,s):1==r?Drupal.t(n,i,s):(i["@count["+r+"]"]=i["@count"],delete i["@count"],Drupal.t(n.replace("@count","@count["+r+"]"),i,s))},Drupal.theme=function(e){var t=Array.prototype.slice.apply(arguments,[1]);return(Drupal.theme[e]||Drupal.theme.prototype[e]).apply(this,t)},Drupal.freezeHeight=function(){Drupal.unfreezeHeight(),e('<div id="freeze-height"></div>').css({position:"absolute",top:"0px",left:"0px",width:"1px",height:e("body").css("height")}).appendTo("body")},Drupal.unfreezeHeight=function(){e("#freeze-height").remove()},Drupal.encodePath=function(e,t){
return t=t||location.href,encodeURIComponent(e).replace(/%2F/g,"/")},Drupal.getSelection=function(e){if("number"!=typeof e.selectionStart&&document.selection){var t=document.selection.createRange(),n=t.duplicate();n.moveToElementText(e),n.setEndPoint("EndToEnd",t);var i=n.text.length-t.text.length,s=i+t.text.length;return{start:i,end:s}}return{start:e.selectionStart,end:e.selectionEnd}},Drupal.ajaxError=function(t,n){var i,s,r,o,a,l;i=t.status?"\n"+Drupal.t("An AJAX HTTP error occurred.")+"\n"+Drupal.t("HTTP Result Code: !status",{"!status":t.status}):"\n"+Drupal.t("An AJAX HTTP request terminated abnormally."),i+="\n"+Drupal.t("Debugging information follows."),r="\n"+Drupal.t("Path: !uri",{"!uri":n}),s="";try{s="\n"+Drupal.t("StatusText: !statusText",{"!statusText":e.trim(t.statusText)})}catch(c){}o="";try{o="\n"+Drupal.t("ResponseText: !responseText",{"!responseText":e.trim(t.responseText)})}catch(c){}return o=o.replace(/<("[^"]*"|'[^']*'|[^'">])*>/gi,""),o=o.replace(/[\n]+\s+/g,"\n"),a=0==t.status?"\n"+Drupal.t("ReadyState: !readyState",{"!readyState":t.readyState}):"",l=i+r+s+o+a},e("html").addClass("js"),document.cookie="has_js=1; path=/",e(function(){if(void 0===jQuery.support.positionFixed){var t=e('<div style="position:fixed; top:10px" />').appendTo(document.body);jQuery.support.positionFixed=10===t[0].offsetTop,t.remove()}}),e(function(){Drupal.attachBehaviors(document,Drupal.settings)}),Drupal.theme.prototype={placeholder:function(e){return'<em class="placeholder">'+Drupal.checkPlain(e)+"</em>"}}}(jQuery),function($){Drupal.ajax=Drupal.ajax||{},Drupal.behaviors.AJAX={attach:function(e,t){for(var n in t.ajax)if(!$("#"+n+".ajax-processed").length){var i=t.ajax[n];"undefined"==typeof i.selector&&(i.selector="#"+n),$(i.selector).each(function(){i.element=this,Drupal.ajax[n]=new Drupal.ajax(n,this,i)}),$("#"+n).addClass("ajax-processed")}$(".use-ajax:not(.ajax-processed)").addClass("ajax-processed").each(function(){var e={};e.progress={type:"throbber"},$(this).attr("href")&&(e.url=$(this).attr("href"),e.event="click");var t=$(this).attr("id");Drupal.ajax[t]=new Drupal.ajax(t,this,e)}),$(".use-ajax-submit:not(.ajax-processed)").addClass("ajax-processed").each(function(){var e={};e.url=$(this.form).attr("action"),e.setClick=!0,e.event="click",e.progress={type:"throbber"};var t=$(this).attr("id");Drupal.ajax[t]=new Drupal.ajax(t,this,e)})}},Drupal.ajax=function(e,t,n){var i={url:"system/ajax",event:"mousedown",keypress:!0,selector:"#"+e,effect:"none",speed:"none",method:"replaceWith",progress:{type:"throbber",message:Drupal.t("Please wait...")},submit:{js:!0}};$.extend(this,i,n),this.element=t,this.element_settings=n,this.url=n.url.replace(/\/nojs(\/|$|\?|&|#)/g,"/ajax$1"),this.wrapper="#"+n.wrapper,this.element.form&&(this.form=$(this.element.form));var s=this;s.options={url:s.url,data:s.submit,beforeSerialize:function(e,t){return s.beforeSerialize(e,t)},beforeSubmit:function(e,t,n){return s.ajaxing=!0,s.beforeSubmit(e,t,n)},beforeSend:function(e,t){return s.ajaxing=!0,s.beforeSend(e,t)},success:function(e,t){return"string"==typeof e&&(e=$.parseJSON(e)),s.success(e,t)},complete:function(e,t){return s.ajaxing=!1,"error"==t||"parsererror"==t?s.error(e,s.url):void 0},dataType:"json",type:"POST"},$(s.element).bind(n.event,function(e){return s.eventResponse(this,e)}),n.keypress&&$(s.element).keypress(function(e){return s.keypressResponse(this,e)}),n.prevent&&$(s.element).bind(n.prevent,!1)},Drupal.ajax.prototype.keypressResponse=function(e,t){var n=this;return 13==t.which||32==t.which&&"text"!=e.type&&"textarea"!=e.type?($(n.element_settings.element).trigger(n.element_settings.event),!1):void 0},Drupal.ajax.prototype.eventResponse=function(e,t){var n=this;if(n.ajaxing)return!1;try{n.form?(n.setClick&&(e.form.clk=e),n.form.ajaxSubmit(n.options)):(n.beforeSerialize(n.element,n.options),$.ajax(n.options))}catch(i){n.ajaxing=!1,alert("An error occurred while attempting to process "+n.options.url+": "+i.message)}return"undefined"==typeof e.type||"checkbox"!=e.type&&"radio"!=e.type?!1:!0},Drupal.ajax.prototype.beforeSerialize=function(e,t){if(this.form){var n=this.settings||Drupal.settings;Drupal.detachBehaviors(this.form,n,"serialize")}t.data["ajax_html_ids[]"]=[],$("[id]").each(function(){t.data["ajax_html_ids[]"].push(this.id)}),t.data["ajax_page_state[theme]"]=Drupal.settings.ajaxPageState.theme,t.data["ajax_page_state[theme_token]"]=Drupal.settings.ajaxPageState.theme_token;for(var i in Drupal.settings.ajaxPageState.css)t.data["ajax_page_state[css]["+i+"]"]=1;for(var i in Drupal.settings.ajaxPageState.js)t.data["ajax_page_state[js]["+i+"]"]=1},Drupal.ajax.prototype.beforeSubmit=function(e,t,n){},Drupal.ajax.prototype.beforeSend=function(xmlhttprequest,options){if(this.form){options.extraData=options.extraData||{},options.extraData.ajax_iframe_upload="1";var v=$.fieldValue(this.element);null!==v&&(options.extraData[this.element.name]=Drupal.checkPlain(v))}if($(this.element).addClass("progress-disabled").attr("disabled",!0),"bar"==this.progress.type){var progressBar=new Drupal.progressBar("ajax-progress-"+this.element.id,eval(this.progress.update_callback),this.progress.method,eval(this.progress.error_callback));this.progress.message&&progressBar.setProgress(-1,this.progress.message),this.progress.url&&progressBar.startMonitoring(this.progress.url,this.progress.interval||1500),this.progress.element=$(progressBar.element).addClass("ajax-progress ajax-progress-bar"),this.progress.object=progressBar,$(this.element).after(this.progress.element)}else"throbber"==this.progress.type&&(this.progress.element=$('<div class="ajax-progress ajax-progress-throbber"><div class="throbber">&nbsp;</div></div>'),this.progress.message&&$(".throbber",this.progress.element).after('<div class="message">'+this.progress.message+"</div>"),$(this.element).after(this.progress.element))},Drupal.ajax.prototype.success=function(e,t){this.progress.element&&$(this.progress.element).remove(),this.progress.object&&this.progress.object.stopMonitoring(),$(this.element).removeClass("progress-disabled").removeAttr("disabled"),Drupal.freezeHeight();for(var n in e)e.hasOwnProperty(n)&&e[n].command&&this.commands[e[n].command]&&this.commands[e[n].command](this,e[n],t);if(this.form){var i=this.settings||Drupal.settings;Drupal.attachBehaviors(this.form,i)}Drupal.unfreezeHeight(),this.settings=null},Drupal.ajax.prototype.getEffect=function(e){var t=e.effect||this.effect,n=e.speed||this.speed,i={};return"none"==t?(i.showEffect="show",i.hideEffect="hide",i.showSpeed=""):"fade"==t?(i.showEffect="fadeIn",i.hideEffect="fadeOut",i.showSpeed=n):(i.showEffect=t+"Toggle",i.hideEffect=t+"Toggle",i.showSpeed=n),i},Drupal.ajax.prototype.error=function(e,t){if(alert(Drupal.ajaxError(e,t)),this.progress.element&&$(this.progress.element).remove(),this.progress.object&&this.progress.object.stopMonitoring(),$(this.wrapper).show(),$(this.element).removeClass("progress-disabled").removeAttr("disabled"),this.form){var n=e.settings||this.settings||Drupal.settings;Drupal.attachBehaviors(this.form,n)}},Drupal.ajax.prototype.commands={insert:function(e,t,n){var i=$(t.selector?t.selector:e.wrapper),s=t.method||e.method,r=e.getEffect(t),o=$("<div></div>").html(t.data),a=o.contents();switch((1!=a.length||1!=a.get(0).nodeType)&&(a=o),s){case"html":case"replaceWith":case"replaceAll":case"empty":case"remove":var l=t.settings||e.settings||Drupal.settings;Drupal.detachBehaviors(i,l)}if(i[s](a),"show"!=r.showEffect&&a.hide(),$(".ajax-new-content",a).length>0?($(".ajax-new-content",a).hide(),a.show(),$(".ajax-new-content",a)[r.showEffect](r.showSpeed)):"show"!=r.showEffect&&a[r.showEffect](r.showSpeed),a.parents("html").length>0){var l=t.settings||e.settings||Drupal.settings;Drupal.attachBehaviors(a,l)}},remove:function(e,t,n){var i=t.settings||e.settings||Drupal.settings;Drupal.detachBehaviors($(t.selector),i),$(t.selector).remove()},changed:function(e,t,n){$(t.selector).hasClass("ajax-changed")||($(t.selector).addClass("ajax-changed"),t.asterisk&&$(t.selector).find(t.asterisk).append(' <span class="ajax-changed">*</span> '))},alert:function(e,t,n){alert(t.text,t.title)},css:function(e,t,n){$(t.selector).css(t.argument)},settings:function(e,t,n){t.merge?$.extend(!0,Drupal.settings,t.settings):e.settings=t.settings},data:function(e,t,n){$(t.selector).data(t.name,t.value)},invoke:function(e,t,n){var i=$(t.selector);i[t.method].apply(i,t.arguments)},restripe:function(e,t,n){$("> tbody > tr:visible, > tr:visible",$(t.selector)).removeClass("odd even").filter(":even").addClass("odd").end().filter(":odd").addClass("even")},add_css:function(e,t,n){$("head").prepend(t.data);var i,s=/^@import url\("(.*)"\);$/gim;if(document.styleSheets[0].addImport&&s.test(t.data))for(s.lastIndex=0;i=s.exec(t.data);)document.styleSheets[0].addImport(i[1])},updateBuildId:function(e,t,n){$('input[name="form_build_id"][value="'+t.old+'"]').val(t["new"])}}}(jQuery),function(e){Drupal.behaviors.autocomplete={attach:function(t,n){var i=[];e("input.autocomplete",t).once("autocomplete",function(){var t=this.value;i[t]||(i[t]=new Drupal.ACDB(t));var n=e("#"+this.id.substr(0,this.id.length-13)).attr("autocomplete","OFF").attr("aria-autocomplete","list");e(n[0].form).submit(Drupal.autocompleteSubmit),n.parent().attr("role","application").append(e('<span class="element-invisible" aria-live="assertive"></span>').attr("id",n.attr("id")+"-autocomplete-aria-live")),new Drupal.jsAC(n,i[t])})}},Drupal.autocompleteSubmit=function(){return 0==e("#autocomplete").each(function(){this.owner.hidePopup()}).length},Drupal.jsAC=function(t,n){var i=this;this.input=t[0],this.ariaLive=e("#"+this.input.id+"-autocomplete-aria-live"),this.db=n,t.keydown(function(e){return i.onkeydown(this,e)}).keyup(function(e){i.onkeyup(this,e)}).blur(function(){i.hidePopup(),i.db.cancel()})},Drupal.jsAC.prototype.onkeydown=function(e,t){switch(t||(t=window.event),t.keyCode){case 40:return this.selectDown(),!1;case 38:return this.selectUp(),!1;default:return!0}},Drupal.jsAC.prototype.onkeyup=function(e,t){switch(t||(t=window.event),t.keyCode){case 16:case 17:case 18:case 20:case 33:case 34:case 35:case 36:case 37:case 38:case 39:case 40:return!0;case 9:case 13:case 27:return this.hidePopup(t.keyCode),!0;default:return e.value.length>0&&!e.readOnly?this.populatePopup():this.hidePopup(t.keyCode),!0}},Drupal.jsAC.prototype.select=function(t){this.input.value=e(t).data("autocompleteValue")},Drupal.jsAC.prototype.selectDown=function(){if(this.selected&&this.selected.nextSibling)this.highlight(this.selected.nextSibling);else if(this.popup){var t=e("li",this.popup);t.length>0&&this.highlight(t.get(0))}},Drupal.jsAC.prototype.selectUp=function(){this.selected&&this.selected.previousSibling&&this.highlight(this.selected.previousSibling)},Drupal.jsAC.prototype.highlight=function(t){this.selected&&e(this.selected).removeClass("selected"),e(t).addClass("selected"),this.selected=t,e(this.ariaLive).html(e(this.selected).html())},Drupal.jsAC.prototype.unhighlight=function(t){e(t).removeClass("selected"),this.selected=!1,e(this.ariaLive).empty()},Drupal.jsAC.prototype.hidePopup=function(t){this.selected&&(t&&46!=t&&8!=t&&27!=t||!t)&&(this.input.value=e(this.selected).data("autocompleteValue"));var n=this.popup;n&&(this.popup=null,e(n).fadeOut("fast",function(){e(n).remove()})),this.selected=!1,e(this.ariaLive).empty()},Drupal.jsAC.prototype.populatePopup=function(){var t=e(this.input),n=t.position();this.popup&&e(this.popup).remove(),this.selected=!1,this.popup=e('<div id="autocomplete"></div>')[0],this.popup.owner=this,e(this.popup).css({top:parseInt(n.top+this.input.offsetHeight,10)+"px",left:parseInt(n.left,10)+"px",width:t.innerWidth()+"px",display:"none"}),t.before(this.popup),this.db.owner=this,this.db.search(this.input.value)},Drupal.jsAC.prototype.found=function(t){if(!this.input.value.length)return!1;var n=e("<ul></ul>"),i=this;for(key in t)e("<li></li>").html(e("<div></div>").html(t[key])).mousedown(function(){i.select(this)}).mouseover(function(){i.highlight(this)}).mouseout(function(){i.unhighlight(this)}).data("autocompleteValue",key).appendTo(n);this.popup&&(n.children().length?(e(this.popup).empty().append(n).show(),e(this.ariaLive).html(Drupal.t("Autocomplete popup"))):(e(this.popup).css({visibility:"hidden"}),this.hidePopup()))},Drupal.jsAC.prototype.setStatus=function(t){switch(t){case"begin":e(this.input).addClass("throbbing"),e(this.ariaLive).html(Drupal.t("Searching for matches..."));break;case"cancel":case"error":case"found":e(this.input).removeClass("throbbing")}},Drupal.ACDB=function(e){this.uri=e,this.delay=300,this.cache={}},Drupal.ACDB.prototype.search=function(t){var n=this;if(this.searchString=t,t=t.replace(/^\s+|\s+$/,""),!(t.length<=0||","==t.charAt(t.length-1))){if(this.cache[t])return this.owner.found(this.cache[t]);this.timer&&clearTimeout(this.timer),this.timer=setTimeout(function(){n.owner.setStatus("begin"),e.ajax({type:"GET",url:n.uri+"/"+Drupal.encodePath(t),dataType:"json",success:function(e){("undefined"==typeof e.status||0!=e.status)&&(n.cache[t]=e,n.searchString==t&&n.owner.found(e),n.owner.setStatus("found"))},error:function(e){alert(Drupal.ajaxError(e,n.uri))}})},this.delay)}},Drupal.ACDB.prototype.cancel=function(){this.owner&&this.owner.setStatus("cancel"),this.timer&&clearTimeout(this.timer),this.searchString=""}}(jQuery),function(e){Drupal.toggleFieldset=function(t){var n=e(t);if(n.is(".collapsed")){var i=e("> .fieldset-wrapper",t).hide();n.removeClass("collapsed").trigger({type:"collapsed",value:!1}).find("> legend span.fieldset-legend-prefix").html(Drupal.t("Hide")),i.slideDown({duration:"fast",easing:"linear",complete:function(){Drupal.collapseScrollIntoView(t),t.animating=!1},step:function(){Drupal.collapseScrollIntoView(t)}})}else n.trigger({type:"collapsed",value:!0}),e("> .fieldset-wrapper",t).slideUp("fast",function(){n.addClass("collapsed").find("> legend span.fieldset-legend-prefix").html(Drupal.t("Show")),t.animating=!1})},Drupal.collapseScrollIntoView=function(t){var n=document.documentElement.clientHeight||document.body.clientHeight||0,i=document.documentElement.scrollTop||document.body.scrollTop||0,s=e(t).offset().top,r=55;s+t.offsetHeight+r>n+i&&(t.offsetHeight>n?window.scrollTo(0,s):window.scrollTo(0,s+t.offsetHeight-n+r))},Drupal.behaviors.collapse={attach:function(t,n){e("fieldset.collapsible",t).once("collapse",function(){var t=e(this),n=location.hash&&"#"!=location.hash?", "+location.hash:"";t.find(".error"+n).length&&t.removeClass("collapsed");var i=e('<span class="summary"></span>');t.bind("summaryUpdated",function(){var n=e.trim(t.drupalGetSummary());i.html(n?" ("+n+")":"")}).trigger("summaryUpdated");var s=e("> legend .fieldset-legend",this);e('<span class="fieldset-legend-prefix element-invisible"></span>').append(Drupal.t(t.hasClass("collapsed")?"Show":"Hide")).prependTo(s).after(" ");e('<a class="fieldset-title" href="#"></a>').prepend(s.contents()).appendTo(s).click(function(){var e=t.get(0);return e.animating||(e.animating=!0,Drupal.toggleFieldset(e)),!1});s.append(i)})}}}(jQuery),jQuery.cookie=function(e,t,n){if("undefined"==typeof t){var i=null;if(document.cookie&&""!=document.cookie)for(var s=document.cookie.split(";"),r=0;r<s.length;r++){var o=jQuery.trim(s[r]);if(o.substring(0,e.length+1)==e+"="){i=decodeURIComponent(o.substring(e.length+1));break}}return i}n=n||{},null===t&&(t="",n.expires=-1);var a="";if(n.expires&&("number"==typeof n.expires||n.expires.toUTCString)){var l;"number"==typeof n.expires?(l=new Date,l.setTime(l.getTime()+24*n.expires*60*60*1e3)):l=n.expires,a="; expires="+l.toUTCString()}var c=n.path?"; path="+n.path:"",u=n.domain?"; domain="+n.domain:"",d=n.secure?"; secure":"";document.cookie=[e,"=",encodeURIComponent(t),a,c,u,d].join("")},function(e){function t(){if(e.fn.ajaxSubmit.debug){var t="[jquery.form] "+Array.prototype.join.call(arguments,"");window.console&&window.console.log?window.console.log(t):window.opera&&window.opera.postError&&window.opera.postError(t)}}e.fn.ajaxSubmit=function(n){function i(){function i(){var t=p.attr("target"),n=p.attr("action");r.setAttribute("target",a),"POST"!=r.getAttribute("method")&&r.setAttribute("method","POST"),r.getAttribute("action")!=o.url&&r.setAttribute("action",o.url),o.skipEncodingOverride||p.attr({encoding:"multipart/form-data",enctype:"multipart/form-data"}),o.timeout&&setTimeout(function(){f=!0,s()},o.timeout);var i=[];try{if(o.extraData)for(var u in o.extraData)i.push(e('<input type="hidden" name="'+u+'" value="'+o.extraData[u]+'" />').appendTo(r)[0]);l.appendTo("body"),c.attachEvent?c.attachEvent("onload",s):c.addEventListener("load",s,!1),r.submit()}finally{r.setAttribute("action",n),t?r.setAttribute("target",t):p.removeAttr("target"),e(i).remove()}}function s(){if(!u.aborted){var n=c.contentWindow?c.contentWindow.document:c.contentDocument?c.contentDocument:c.document;if(n&&n.location.href!=o.iframeSrc||f){c.detachEvent?c.detachEvent("onload",s):c.removeEventListener("load",s,!1);var i=!0;try{if(f)throw"timeout";var r="xml"==o.dataType||n.XMLDocument||e.isXMLDoc(n);if(t("isXml="+r),!r&&window.opera&&(null==n.body||""==n.body.innerHTML)&&--v)return t("requeing onLoad callback, DOM not available"),void setTimeout(s,250);u.responseText=n.body?n.body.innerHTML:n.documentElement?n.documentElement.innerHTML:null,u.responseXML=n.XMLDocument?n.XMLDocument:n,u.getResponseHeader=function(e){var t={"content-type":o.dataType};return t[e]};var a=/(json|script)/.test(o.dataType);if(a||o.textarea){var p=n.getElementsByTagName("textarea")[0];if(p)u.responseText=p.value;else if(a){var h=n.getElementsByTagName("pre")[0],g=n.getElementsByTagName("body")[0];h?u.responseText=h.textContent:g&&(u.responseText=g.innerHTML)}}else"xml"!=o.dataType||u.responseXML||null==u.responseText||(u.responseXML=b(u.responseText));m=x(u,o.dataType,o)}catch(y){t("error caught:",y),i=!1,u.error=y,o.error&&o.error.call(o.context,u,"error",y),d&&e.event.trigger("ajaxError",[u,o,y])}u.aborted&&(t("upload aborted"),i=!1),i&&(o.success&&o.success.call(o.context,m,"success",u),d&&e.event.trigger("ajaxSuccess",[u,o])),d&&e.event.trigger("ajaxComplete",[u,o]),d&&!--e.active&&e.event.trigger("ajaxStop"),o.complete&&o.complete.call(o.context,u,i?"success":"error"),setTimeout(function(){l.removeData("form-plugin-onload"),l.remove(),u.responseXML=null},100)}}}var r=p[0];if(e(":input[name=submit],:input[id=submit]",r).length)return void alert('Error: Form elements must not have name or id of "submit".');var o=e.extend(!0,{},e.ajaxSettings,n);o.context=o.context||o;var a="jqFormIO"+(new Date).getTime(),l=e('<iframe id="'+a+'" name="'+a+'" src="'+o.iframeSrc+'" />'),c=l[0];l.css({position:"absolute",top:"-1000px",left:"-1000px"});var u={aborted:0,responseText:null,responseXML:null,status:0,statusText:"n/a",getAllResponseHeaders:function(){},getResponseHeader:function(){},setRequestHeader:function(){},abort:function(){t("aborting upload...");var n="aborted";this.aborted=1,l.attr("src",o.iframeSrc),u.error=n,o.error&&o.error.call(o.context,u,"error",n),d&&e.event.trigger("ajaxError",[u,o,n]),o.complete&&o.complete.call(o.context,u,"error")}},d=o.global;if(d&&!e.active++&&e.event.trigger("ajaxStart"),d&&e.event.trigger("ajaxSend",[u,o]),o.beforeSend&&o.beforeSend.call(o.context,u,o)===!1)return void(o.global&&e.active--);if(!u.aborted){var f=0,h=r.clk;if(h){var g=h.name;g&&!h.disabled&&(o.extraData=o.extraData||{},o.extraData[g]=h.value,"image"==h.type&&(o.extraData[g+".x"]=r.clk_x,o.extraData[g+".y"]=r.clk_y))}o.forceSync?i():setTimeout(i,10);var m,v=50,b=e.parseXML||function(e,t){return window.ActiveXObject?(t=new ActiveXObject("Microsoft.XMLDOM"),t.async="false",t.loadXML(e)):t=(new DOMParser).parseFromString(e,"text/xml"),t&&t.documentElement&&"parsererror"!=t.documentElement.nodeName?t:null},y=e.parseJSON||function(e){return window.eval("("+e+")")},x=function(t,n,i){var s=t.getResponseHeader("content-type")||"",r="xml"===n||!n&&s.indexOf("xml")>=0,o=r?t.responseXML:t.responseText;return r&&"parsererror"===o.documentElement.nodeName&&e.error&&e.error("parsererror"),i&&i.dataFilter&&(o=i.dataFilter(o,n)),"string"==typeof o&&("json"===n||!n&&s.indexOf("json")>=0?o=y(o):("script"===n||!n&&s.indexOf("javascript")>=0)&&e.globalEval(o)),o}}}if(!this.length)return t("ajaxSubmit: skipping submit process - no element selected"),this;"function"==typeof n&&(n={success:n});var s=this.attr("action"),r="string"==typeof s?e.trim(s):"";r&&(r=(r.match(/^([^#]+)/)||[])[1]),r=r||window.location.href||"",n=e.extend(!0,{url:r,success:e.ajaxSettings.success,type:this[0].getAttribute("method")||"GET",iframeSrc:/^https/i.test(window.location.href||"")?"javascript:false":"about:blank"},n);var o={};if(this.trigger("form-pre-serialize",[this,n,o]),o.veto)return t("ajaxSubmit: submit vetoed via form-pre-serialize trigger"),this;if(n.beforeSerialize&&n.beforeSerialize(this,n)===!1)return t("ajaxSubmit: submit aborted via beforeSerialize callback"),this;var a,l,c=this.formToArray(n.semantic);if(n.data){n.extraData=n.data;for(a in n.data)if(n.data[a]instanceof Array)for(var u in n.data[a])c.push({name:a,value:n.data[a][u]});else l=n.data[a],l=e.isFunction(l)?l():l,c.push({name:a,value:l})}if(n.beforeSubmit&&n.beforeSubmit(c,this,n)===!1)return t("ajaxSubmit: submit aborted via beforeSubmit callback"),this;if(this.trigger("form-submit-validate",[c,this,n,o]),o.veto)return t("ajaxSubmit: submit vetoed via form-submit-validate trigger"),this;var d=e.param(c);"GET"==n.type.toUpperCase()?(n.url+=(n.url.indexOf("?")>=0?"&":"?")+d,n.data=null):n.data=d;var p=this,f=[];if(n.resetForm&&f.push(function(){p.resetForm()}),n.clearForm&&f.push(function(){p.clearForm()}),!n.dataType&&n.target){var h=n.success||function(){};f.push(function(t){var i=n.replaceTarget?"replaceWith":"html";e(n.target)[i](t).each(h,arguments)})}else n.success&&f.push(n.success);n.success=function(e,t,i){for(var s=n.context||n,r=0,o=f.length;o>r;r++)f[r].apply(s,[e,t,i||p,p])};var g=e("input:file",this).length>0,m="multipart/form-data",v=p.attr("enctype")==m||p.attr("encoding")==m;return n.iframe!==!1&&(g||n.iframe||v)?n.closeKeepAlive?e.get(n.closeKeepAlive,i):i():e.ajax(n),this.trigger("form-submit-notify",[this,n]),this},e.fn.ajaxForm=function(n){if(0===this.length){var i={s:this.selector,c:this.context};return!e.isReady&&i.s?(t("DOM not ready, queuing ajaxForm"),e(function(){e(i.s,i.c).ajaxForm(n)}),this):(t("terminating; zero elements found by selector"+(e.isReady?"":" (DOM not ready)")),this)}return this.ajaxFormUnbind().bind("submit.form-plugin",function(t){t.isDefaultPrevented()||(t.preventDefault(),e(this).ajaxSubmit(n))}).bind("click.form-plugin",function(t){var n=t.target,i=e(n);if(!i.is(":submit,input:image")){var s=i.closest(":submit");if(0==s.length)return;n=s[0]}var r=this;if(r.clk=n,"image"==n.type)if(void 0!=t.offsetX)r.clk_x=t.offsetX,r.clk_y=t.offsetY;else if("function"==typeof e.fn.offset){var o=i.offset();r.clk_x=t.pageX-o.left,r.clk_y=t.pageY-o.top}else r.clk_x=t.pageX-n.offsetLeft,r.clk_y=t.pageY-n.offsetTop;setTimeout(function(){r.clk=r.clk_x=r.clk_y=null},100)})},e.fn.ajaxFormUnbind=function(){return this.unbind("submit.form-plugin click.form-plugin")},e.fn.formToArray=function(t){var n=[];if(0===this.length)return n;var i=this[0],s=t?i.getElementsByTagName("*"):i.elements;if(!s)return n;var r,o,a,l,c,u,d;for(r=0,u=s.length;u>r;r++)if(c=s[r],a=c.name)if(t&&i.clk&&"image"==c.type)c.disabled||i.clk!=c||(n.push({name:a,value:e(c).val()}),n.push({name:a+".x",value:i.clk_x},{name:a+".y",value:i.clk_y}));else if(l=e.fieldValue(c,!0),l&&l.constructor==Array)for(o=0,d=l.length;d>o;o++)n.push({name:a,value:l[o]});else null!==l&&"undefined"!=typeof l&&n.push({name:a,value:l});if(!t&&i.clk){var p=e(i.clk),f=p[0];a=f.name,a&&!f.disabled&&"image"==f.type&&(n.push({name:a,value:p.val()}),n.push({name:a+".x",value:i.clk_x},{name:a+".y",value:i.clk_y}))}return n},e.fn.formSerialize=function(t){return e.param(this.formToArray(t))},e.fn.fieldSerialize=function(t){var n=[];return this.each(function(){var i=this.name;if(i){var s=e.fieldValue(this,t);if(s&&s.constructor==Array)for(var r=0,o=s.length;o>r;r++)n.push({name:i,value:s[r]});else null!==s&&"undefined"!=typeof s&&n.push({name:this.name,value:s})}}),e.param(n)},e.fn.fieldValue=function(t){for(var n=[],i=0,s=this.length;s>i;i++){var r=this[i],o=e.fieldValue(r,t);null===o||"undefined"==typeof o||o.constructor==Array&&!o.length||(o.constructor==Array?e.merge(n,o):n.push(o))}return n},e.fieldValue=function(t,n){var i=t.name,s=t.type,r=t.tagName.toLowerCase();if(void 0===n&&(n=!0),n&&(!i||t.disabled||"reset"==s||"button"==s||("checkbox"==s||"radio"==s)&&!t.checked||("submit"==s||"image"==s)&&t.form&&t.form.clk!=t||"select"==r&&-1==t.selectedIndex))return null;if("select"==r){var o=t.selectedIndex;if(0>o)return null;for(var a=[],l=t.options,c="select-one"==s,u=c?o+1:l.length,d=c?o:0;u>d;d++){var p=l[d];if(p.selected){var f=p.value;if(f||(f=p.attributes&&p.attributes.value&&!p.attributes.value.specified?p.text:p.value),c)return f;a.push(f)}}return a}return e(t).val()},e.fn.clearForm=function(){return this.each(function(){e("input,select,textarea",this).clearFields()})},e.fn.clearFields=e.fn.clearInputs=function(){return this.each(function(){var e=this.type,t=this.tagName.toLowerCase();"text"==e||"password"==e||"textarea"==t?this.value="":"checkbox"==e||"radio"==e?this.checked=!1:"select"==t&&(this.selectedIndex=-1)})},e.fn.resetForm=function(){return this.each(function(){("function"==typeof this.reset||"object"==typeof this.reset&&!this.reset.nodeType)&&this.reset()})},e.fn.enable=function(e){return void 0===e&&(e=!0),this.each(function(){this.disabled=!e})},e.fn.selected=function(t){return void 0===t&&(t=!0),this.each(function(){var n=this.type;if("checkbox"==n||"radio"==n)this.checked=t;else if("option"==this.tagName.toLowerCase()){var i=e(this).parent("select");t&&i[0]&&"select-one"==i[0].type&&i.find("option").selected(!1),this.selected=t}})}}(jQuery),function(e){Drupal.progressBar=function(t,n,i,s){this.id=t,this.method=i||"GET",this.updateCallback=n,this.errorCallback=s,this.element=e('<div class="progress" aria-live="polite"></div>').attr("id",t),this.element.html('<div class="bar"><div class="filled"></div></div><div class="percentage"></div><div class="message">&nbsp;</div>')},Drupal.progressBar.prototype.setProgress=function(t,n){t>=0&&100>=t&&(e("div.filled",this.element).css("width",t+"%"),e("div.percentage",this.element).html(t+"%")),e("div.message",this.element).html(n),this.updateCallback&&this.updateCallback(t,n,this)},Drupal.progressBar.prototype.startMonitoring=function(e,t){this.delay=t,this.uri=e,this.sendPing()},Drupal.progressBar.prototype.stopMonitoring=function(){clearTimeout(this.timer),this.uri=null},Drupal.progressBar.prototype.sendPing=function(){if(this.timer&&clearTimeout(this.timer),this.uri){var t=this;e.ajax({type:this.method,url:this.uri,data:"",dataType:"json",success:function(e){return 0==e.status?void t.displayError(e.data):(t.setProgress(e.percentage,e.message),void(t.timer=setTimeout(function(){t.sendPing()},t.delay)))},error:function(e){t.displayError(Drupal.ajaxError(e,t.uri))}})}},Drupal.progressBar.prototype.displayError=function(t){var n=e('<div class="messages error"></div>').html(t);e(this.element).before(n).hide(),this.errorCallback&&this.errorCallback(this)}}(jQuery),function(e){function t(e,t){return void 0===e?t:void 0===t?e:e&&t}function n(e,t){return t&&void 0!==e?!e:e}function i(e,t){return e===t?void 0===e?e:!0:void 0===e||void 0===t}var s=Drupal.states={postponed:[]};Drupal.behaviors.states={attach:function(t,n){for(var i in n.states)for(var r in n.states[i])new s.Dependent({element:e(i),state:s.State.sanitize(r),dependees:n.states[i][r]});for(;s.postponed.length;)s.postponed.shift()()}},s.Dependent=function(t){e.extend(this,{values:{},oldValue:void 0},t);for(var n in this.dependees)this.initializeDependee(n,this.dependees[n])},s.Dependent.comparisons={RegExp:function(e,t){return e.test(t)},Function:function(e,t){return e(t)},Number:function(e,t){return"String"===t.constructor.name?i(String(e),t):i(e,t)}},s.Dependent.prototype={initializeDependee:function(t,n){var i=this;i.values[t]={},e.each(n,function(n,r){n=s.State.sanitize(n),i.values[t][n.pristine]=void 0,e(t).bind("state:"+n,function(e){var s=i.compare(r,e.value);i.update(t,n,s)}),new s.Trigger({selector:t,state:n})})},compare:function(e,t){return e.constructor.name in s.Dependent.comparisons?s.Dependent.comparisons[e.constructor.name](e,t):i(e,t)},update:function(e,t,n){n!==this.values[e][t.pristine]&&(this.values[e][t.pristine]=n,this.reevaluate())},reevaluate:function(){var e=void 0;for(var i in this.values)for(var r in this.values[i]){r=s.State.sanitize(r);var o=this.values[i][r.pristine];e=t(e,n(o,r.invert))}e!==this.oldValue&&(this.oldValue=e,e=n(e,this.state.invert),this.element.trigger({type:"state:"+this.state,value:e,trigger:!0}))}},s.Trigger=function(t){e.extend(this,t),this.state in s.Trigger.states&&(this.element=e(this.selector),this.element.data("trigger:"+this.state)||this.initialize())},s.Trigger.prototype={initialize:function(){var t=this,n=s.Trigger.states[this.state];"function"==typeof n?n.call(window,this.element):e.each(n,function(e,n){t.defaultTrigger(e,n)}),this.element.data("trigger:"+this.state,!0)},defaultTrigger:function(e,t){var n=this,i=t.call(this.element);this.element.bind(e,function(e){var s=t.call(n.element,e);i!==s&&(n.element.trigger({type:"state:"+n.state,value:s,oldValue:i}),i=s)}),s.postponed.push(function(){n.element.trigger({type:"state:"+n.state,value:i,oldValue:void 0})})}},s.Trigger.states={empty:{keyup:function(){return""==this.val()}},checked:{change:function(){return this.prop("checked")}},value:{keyup:function(){return this.length>1?this.filter(":checked").val()||!1:this.val()},change:function(){return this.length>1?this.filter(":checked").val()||!1:this.val()}},collapsed:{collapsed:function(e){return void 0!==e&&"value"in e?e.value:this.is(".collapsed")}}},s.State=function(e){for(this.pristine=this.name=e;;){for(;"!"==this.name.charAt(0);)this.name=this.name.substring(1),this.invert=!this.invert;if(!(this.name in s.State.aliases))break;this.name=s.State.aliases[this.name]}},s.State.sanitize=function(e){return e instanceof s.State?e:new s.State(e)},s.State.aliases={enabled:"!disabled",invisible:"!visible",invalid:"!valid",untouched:"!touched",optional:"!required",filled:"!empty",unchecked:"!checked",irrelevant:"!relevant",expanded:"!collapsed",readwrite:"!readonly"},s.State.prototype={invert:!1,toString:function(){return this.name}},e(document).bind("state:disabled",function(t){t.trigger&&e(t.target).attr("disabled",t.value).filter(".form-element").closest(".form-item, .form-submit, .form-wrapper")[t.value?"addClass":"removeClass"]("form-disabled")}),e(document).bind("state:required",function(t){t.trigger&&(t.value?e(t.target).closest(".form-item, .form-wrapper").find("label").append('<span class="form-required">*</span>'):e(t.target).closest(".form-item, .form-wrapper").find("label .form-required").remove())}),e(document).bind("state:visible",function(t){t.trigger&&e(t.target).closest(".form-item, .form-submit, .form-wrapper")[t.value?"show":"hide"]()}),e(document).bind("state:checked",function(t){t.trigger&&e(t.target).prop("checked",t.value)}),e(document).bind("state:collapsed",function(t){t.trigger&&e(t.target).is(".collapsed")!==t.value&&e("> legend a",t.target).click()})}(jQuery),function(e){Drupal.behaviors.tableDrag={attach:function(t,n){for(var i in n.tableDrag)e("#"+i,t).once("tabledrag",function(){Drupal.tableDrag[i]=new Drupal.tableDrag(this,n.tableDrag[i])})}},Drupal.tableDrag=function(t,n){var i=this;this.table=t,this.tableSettings=n,this.dragObject=null,this.rowObject=null,this.oldRowElement=null,this.oldY=0,this.changed=!1,this.maxDepth=0,this.rtl="rtl"==e(this.table).css("direction")?-1:1,this.scrollSettings={amount:4,interval:50,trigger:70},this.scrollInterval=null,this.scrollY=0,this.windowHeight=0,
this.indentEnabled=!1;for(var s in n)for(var r in n[s])"parent"==n[s][r].relationship&&(this.indentEnabled=!0),n[s][r].limit>0&&(this.maxDepth=n[s][r].limit);if(this.indentEnabled){this.indentCount=1;var o=Drupal.theme("tableDragIndentation"),a=e("<tr/>").addClass("draggable").appendTo(t),l=e("<td/>").appendTo(a).prepend(o).prepend(o);this.indentAmount=e(".indentation",l).get(1).offsetLeft-e(".indentation",l).get(0).offsetLeft,a.remove()}e("> tr.draggable, > tbody > tr.draggable",t).each(function(){i.makeDraggable(this)}),e(t).before(e('<a href="#" class="tabledrag-toggle-weight"></a>').attr("title",Drupal.t("Re-order rows by numerical weight instead of dragging.")).click(function(){return 1==e.cookie("Drupal.tableDrag.showWeight")?i.hideColumns():i.showColumns(),!1}).wrap('<div class="tabledrag-toggle-weight-wrapper"></div>').parent()),i.initColumns(),e(document).bind("mousemove",function(e){return i.dragRow(e,i)}),e(document).bind("mouseup",function(e){return i.dropRow(e,i)})},Drupal.tableDrag.prototype.initColumns=function(){for(var t in this.tableSettings){for(var n in this.tableSettings[t]){var i=e("."+this.tableSettings[t][n].target+":first",this.table);if(i.length&&this.tableSettings[t][n].hidden){var s=this.tableSettings[t][n].hidden,r=i.closest("td");break}}if(s&&r[0]){var o=e("> td",r.parent()).index(r.get(0))+1;e("> thead > tr, > tbody > tr, > tr",this.table).each(function(){var t=o,n=e(this).children();n.each(function(e){t>e&&this.colSpan&&this.colSpan>1&&(t-=this.colSpan-1)}),t>0&&(r=n.filter(":nth-child("+t+")"),r.addClass(r[0].colSpan&&r[0].colSpan>1?"tabledrag-has-colspan":"tabledrag-hide"))})}}null===e.cookie("Drupal.tableDrag.showWeight")?(e.cookie("Drupal.tableDrag.showWeight",0,{path:Drupal.settings.basePath,expires:365}),this.hideColumns()):1==e.cookie("Drupal.tableDrag.showWeight")?this.showColumns():this.hideColumns()},Drupal.tableDrag.prototype.hideColumns=function(){e(".tabledrag-hide","table.tabledrag-processed").css("display","none"),e(".tabledrag-handle","table.tabledrag-processed").css("display",""),e(".tabledrag-has-colspan","table.tabledrag-processed").each(function(){this.colSpan=this.colSpan-1}),e(".tabledrag-toggle-weight").text(Drupal.t("Show row weights")),e.cookie("Drupal.tableDrag.showWeight",0,{path:Drupal.settings.basePath,expires:365}),e("table.tabledrag-processed").trigger("columnschange","hide")},Drupal.tableDrag.prototype.showColumns=function(){e(".tabledrag-hide","table.tabledrag-processed").css("display",""),e(".tabledrag-handle","table.tabledrag-processed").css("display","none"),e(".tabledrag-has-colspan","table.tabledrag-processed").each(function(){this.colSpan=this.colSpan+1}),e(".tabledrag-toggle-weight").text(Drupal.t("Hide row weights")),e.cookie("Drupal.tableDrag.showWeight",1,{path:Drupal.settings.basePath,expires:365}),e("table.tabledrag-processed").trigger("columnschange","show")},Drupal.tableDrag.prototype.rowSettings=function(t,n){var i=e("."+t,n);for(var s in this.tableSettings[t]){var r=this.tableSettings[t][s].target;if(i.is("."+r)){var o={};for(var a in this.tableSettings[t][s])o[a]=this.tableSettings[t][s][a];return o}}},Drupal.tableDrag.prototype.makeDraggable=function(t){var n=this,i=e('<a href="#" class="tabledrag-handle"><div class="handle">&nbsp;</div></a>').attr("title",Drupal.t("Drag to re-order"));e("td:first .indentation:last",t).length?(e("td:first .indentation:last",t).after(i),n.indentCount=Math.max(e(".indentation",t).length,n.indentCount)):e("td:first",t).prepend(i),i.hover(function(){null==n.dragObject?e(this).addClass("tabledrag-handle-hover"):null},function(){null==n.dragObject?e(this).removeClass("tabledrag-handle-hover"):null}),i.mousedown(function(i){return n.dragObject={},n.dragObject.initMouseOffset=n.getMouseOffset(t,i),n.dragObject.initMouseCoords=n.mouseCoords(i),n.indentEnabled&&(n.dragObject.indentMousePos=n.dragObject.initMouseCoords),n.rowObject&&e("a.tabledrag-handle",n.rowObject.element).blur(),n.rowObject=new n.row(t,"mouse",n.indentEnabled,n.maxDepth,!0),n.table.topY=e(n.table).offset().top,n.table.bottomY=n.table.topY+n.table.offsetHeight,e(this).addClass("tabledrag-handle-hover"),e(t).addClass("drag"),e("body").addClass("drag"),n.oldRowElement&&e(n.oldRowElement).removeClass("drag-previous"),-1!=navigator.userAgent.indexOf("MSIE 6.")&&e("select",this.table).css("display","none"),n.safeBlur=!1,n.onDrag(),!1}),i.click(function(){return!1}),i.focus(function(){e(this).addClass("tabledrag-handle-hover"),n.safeBlur=!0}),i.blur(function(t){e(this).removeClass("tabledrag-handle-hover"),n.rowObject&&n.safeBlur&&n.dropRow(t,n)}),i.keydown(function(s){9==s.keyCode||n.rowObject||(n.rowObject=new n.row(t,"keyboard",n.indentEnabled,n.maxDepth,!0));var r=!1;switch(s.keyCode){case 37:case 63234:r=!0,n.rowObject.indent(-1*n.rtl);break;case 38:case 63232:for(var o=e(n.rowObject.element).prev("tr").get(0);o&&e(o).is(":hidden");)o=e(o).prev("tr").get(0);if(o){if(n.safeBlur=!1,n.rowObject.direction="up",r=!0,e(t).is(".tabledrag-root")){for(var a=0;o&&e(".indentation",o).length;)o=e(o).prev("tr").get(0),a+=e(o).is(":hidden")?0:o.offsetHeight;o&&(n.rowObject.swap("before",o),window.scrollBy(0,-a))}else(n.table.tBodies[0].rows[0]!=o||e(o).is(".draggable"))&&(n.rowObject.swap("before",o),n.rowObject.interval=null,n.rowObject.indent(0),window.scrollBy(0,-parseInt(t.offsetHeight,10)));i.get(0).focus()}break;case 39:case 63235:r=!0,n.rowObject.indent(1*n.rtl);break;case 40:case 63233:for(var l=e(n.rowObject.group).filter(":last").next("tr").get(0);l&&e(l).is(":hidden");)l=e(l).next("tr").get(0);if(l){if(n.safeBlur=!1,n.rowObject.direction="down",r=!0,e(t).is(".tabledrag-root")){var a=0,c=new n.row(l,"keyboard",n.indentEnabled,n.maxDepth,!1);if(c){e(c.group).each(function(){a+=e(this).is(":hidden")?0:this.offsetHeight});var u=e(c.group).filter(":last").get(0);n.rowObject.swap("after",u),window.scrollBy(0,parseInt(a,10))}}else n.rowObject.swap("after",l),n.rowObject.interval=null,n.rowObject.indent(0),window.scrollBy(0,parseInt(t.offsetHeight,10));i.get(0).focus()}}return n.rowObject&&1==n.rowObject.changed&&(e(t).addClass("drag"),n.oldRowElement&&e(n.oldRowElement).removeClass("drag-previous"),n.oldRowElement=t,n.restripeTable(),n.onDrag()),r?!1:void 0}),i.keypress(function(e){switch(e.keyCode){case 37:case 38:case 39:case 40:return!1}})},Drupal.tableDrag.prototype.dragRow=function(e,t){if(t.dragObject){t.currentMouseCoords=t.mouseCoords(e);var n=t.currentMouseCoords.y-t.dragObject.initMouseOffset.y,i=t.currentMouseCoords.x-t.dragObject.initMouseOffset.x;if(n!=t.oldY){t.rowObject.direction=n>t.oldY?"down":"up",t.oldY=n;var s=t.checkScroll(t.currentMouseCoords.y);clearInterval(t.scrollInterval),(s>0&&"down"==t.rowObject.direction||0>s&&"up"==t.rowObject.direction)&&t.setScroll(s);var r=t.findDropTargetRow(i,n);r&&("down"==t.rowObject.direction?t.rowObject.swap("after",r,t):t.rowObject.swap("before",r,t),t.restripeTable())}if(t.indentEnabled){var o=t.currentMouseCoords.x-t.dragObject.indentMousePos.x,a=Math.round(o/t.indentAmount*t.rtl),l=t.rowObject.indent(a);t.dragObject.indentMousePos.x+=t.indentAmount*l*t.rtl,t.indentCount=Math.max(t.indentCount,t.rowObject.indents)}return!1}},Drupal.tableDrag.prototype.dropRow=function(t,n){if(null!=n.rowObject){var i=n.rowObject.element;if(1==n.rowObject.changed){n.updateFields(i);for(var s in n.tableSettings){var r=n.rowSettings(s,i);if("group"==r.relationship)for(var o in n.rowObject.children)n.updateField(n.rowObject.children[o],s)}n.rowObject.markChanged(),0==n.changed&&(e(Drupal.theme("tableDragChangedWarning")).insertBefore(n.table).hide().fadeIn("slow"),n.changed=!0)}n.indentEnabled&&n.rowObject.removeIndentClasses(),n.oldRowElement&&e(n.oldRowElement).removeClass("drag-previous"),e(i).removeClass("drag").addClass("drag-previous"),n.oldRowElement=i,n.onDrop(),n.rowObject=null}null!=n.dragObject&&(e(".tabledrag-handle",i).removeClass("tabledrag-handle-hover"),n.dragObject=null,e("body").removeClass("drag"),clearInterval(n.scrollInterval),-1!=navigator.userAgent.indexOf("MSIE 6.")&&e("select",this.table).css("display","block"))},Drupal.tableDrag.prototype.mouseCoords=function(e){return e.pageX||e.pageY?{x:e.pageX,y:e.pageY}:{x:e.clientX+document.body.scrollLeft-document.body.clientLeft,y:e.clientY+document.body.scrollTop-document.body.clientTop}},Drupal.tableDrag.prototype.getMouseOffset=function(t,n){var i=e(t).offset(),s=this.mouseCoords(n);return{x:s.x-i.left,y:s.y-i.top}},Drupal.tableDrag.prototype.findDropTargetRow=function(t,n){for(var i=e(this.table.tBodies[0].rows).not(":hidden"),s=0;s<i.length;s++){var r=i[s],o=e(r).offset().top;if(0==r.offsetHeight)var a=parseInt(r.firstChild.offsetHeight,10)/2;else var a=parseInt(r.offsetHeight,10)/2;if(n>o-a&&o+a>n){if(this.indentEnabled){for(var s in this.rowObject.group)if(this.rowObject.group[s]==r)return null}else if(r==this.rowObject.element)return null;if(!this.rowObject.isValidSwap(r))return null;for(;e(r).is(":hidden")&&e(r).prev("tr").is(":hidden");)r=e(r).prev("tr").get(0);return r}}return null},Drupal.tableDrag.prototype.updateFields=function(e){for(var t in this.tableSettings)this.updateField(e,t)},Drupal.tableDrag.prototype.updateField=function(t,n){var i=this.rowSettings(n,t);if("self"==i.relationship||"group"==i.relationship)var s=t;else if("sibling"==i.relationship){var r=e(t).prev("tr").get(0),o=e(t).next("tr").get(0),s=t;e(r).is(".draggable")&&e("."+n,r).length?this.indentEnabled?e(".indentations",r).length==e(".indentations",t)&&(s=r):s=r:e(o).is(".draggable")&&e("."+n,o).length&&(this.indentEnabled?e(".indentations",o).length==e(".indentations",t)&&(s=o):s=o)}else if("parent"==i.relationship){for(var r=e(t).prev("tr");r.length&&e(".indentation",r).length>=this.rowObject.indents;)r=r.prev("tr");if(r.length)s=r[0];else{s=e(this.table).find("tr.draggable:first").get(0),s==this.rowObject.element&&(s=e(this.rowObject.group[this.rowObject.group.length-1]).next("tr.draggable").get(0));var a=!0}}this.copyDragClasses(s,t,n),i=this.rowSettings(n,t),a&&(i.relationship="sibling",i.source=i.target);var l="."+i.target,c=e(l,t).get(0);if(c){var u="."+i.source,d=e(u,s).get(0);switch(i.action){case"depth":c.value=e(".indentation",e(d).closest("tr")).length;break;case"match":c.value=d.value;break;case"order":var p=this.rowObject.findSiblings(i);if(e(c).is("select")){var f=[];e("option",c).each(function(){f.push(this.value)});var h=f[f.length-1];e(l,p).each(function(){this.value=f.length>0?f.shift():h})}else{var g=parseInt(e(l,p[0]).val(),10)||0;e(l,p).each(function(){this.value=g,g++})}}}},Drupal.tableDrag.prototype.copyDragClasses=function(t,n,i){var s=e("."+i,t),r=e("."+i,n);s.length&&r.length&&(r[0].className=s[0].className)},Drupal.tableDrag.prototype.checkScroll=function(e){var t=document.documentElement,n=document.body,i=this.windowHeight=window.innerHeight||(t.clientHeight&&0!=t.clientWidth?t.clientHeight:n.offsetHeight),s=this.scrollY=document.all?t.scrollTop?t.scrollTop:n.scrollTop:window.pageYOffset?window.pageYOffset:window.scrollY,r=this.scrollSettings.trigger,o=0;return e-s>i-r?(o=r/(i+s-e),o=o>0&&r>o?o:r,o*this.scrollSettings.amount):r>e-s?(o=r/(e-s),o=o>0&&r>o?o:r,-o*this.scrollSettings.amount):void 0},Drupal.tableDrag.prototype.setScroll=function(e){var t=this;this.scrollInterval=setInterval(function(){t.checkScroll(t.currentMouseCoords.y);var n=t.scrollY>t.table.topY,i=t.scrollY+t.windowHeight<t.table.bottomY;(e>0&&i||0>e&&n)&&window.scrollBy(0,e)},this.scrollSettings.interval)},Drupal.tableDrag.prototype.restripeTable=function(){e("> tbody > tr.draggable:visible, > tr.draggable:visible",this.table).removeClass("odd even").filter(":odd").addClass("even").end().filter(":even").addClass("odd")},Drupal.tableDrag.prototype.onDrag=function(){return null},Drupal.tableDrag.prototype.onDrop=function(){return null},Drupal.tableDrag.prototype.row=function(t,n,i,s,r){if(this.element=t,this.method=n,this.group=[t],this.groupDepth=e(".indentation",t).length,this.changed=!1,this.table=e(t).closest("table").get(0),this.indentEnabled=i,this.maxDepth=s,this.direction="",this.indentEnabled){this.indents=e(".indentation",t).length,this.children=this.findChildren(r),this.group=e.merge(this.group,this.children);for(var o=0;o<this.group.length;o++)this.groupDepth=Math.max(e(".indentation",this.group[o]).length,this.groupDepth)}},Drupal.tableDrag.prototype.row.prototype.findChildren=function(t){for(var n=this.indents,i=e(this.element,this.table).next("tr.draggable"),s=[],r=0;i.length;){var o=e(".indentation",i).length;if(!(o>n))break;r++,s.push(i[0]),t&&e(".indentation",i).each(function(t){1==r&&t==n&&e(this).addClass("tree-child-first"),t==n?e(this).addClass("tree-child"):t>n&&e(this).addClass("tree-child-horizontal")}),i=i.next("tr.draggable")}return t&&s.length&&e(".indentation:nth-child("+(n+1)+")",s[s.length-1]).addClass("tree-child-last"),s},Drupal.tableDrag.prototype.row.prototype.isValidSwap=function(t){if(this.indentEnabled){var n,i;if("down"==this.direction?(n=t,i=e(t).next("tr").get(0)):(n=e(t).prev("tr").get(0),i=t),this.interval=this.validIndentInterval(n,i),this.interval.min>this.interval.max)return!1}return this.table.tBodies[0].rows[0]==t&&e(t).is(":not(.draggable)")?!1:!0},Drupal.tableDrag.prototype.row.prototype.swap=function(t,n){Drupal.detachBehaviors(this.group,Drupal.settings,"move"),e(n)[t](this.group),Drupal.attachBehaviors(this.group,Drupal.settings),this.changed=!0,this.onSwap(n)},Drupal.tableDrag.prototype.row.prototype.validIndentInterval=function(t,n){var i,s;return i=n?e(".indentation",n).length:0,!t||e(t).is(":not(.draggable)")||e(this.element).is(".tabledrag-root")?s=0:(s=e(".indentation",t).length+(e(t).is(".tabledrag-leaf")?0:1),this.maxDepth&&(s=Math.min(s,this.maxDepth-(this.groupDepth-this.indents)))),{min:i,max:s}},Drupal.tableDrag.prototype.row.prototype.indent=function(t){if(!this.interval){var n=e(this.element).prev("tr").get(0),i=e(this.group).filter(":last").next("tr").get(0);this.interval=this.validIndentInterval(n,i)}var s=this.indents+t;s=Math.max(s,this.interval.min),s=Math.min(s,this.interval.max),t=s-this.indents;for(var r=1;r<=Math.abs(t);r++)0>t?(e(".indentation:first",this.group).remove(),this.indents--):(e("td:first",this.group).prepend(Drupal.theme("tableDragIndentation")),this.indents++);return t&&(this.changed=!0,this.groupDepth+=t,this.onIndent()),t},Drupal.tableDrag.prototype.row.prototype.findSiblings=function(t){for(var n=[],i=["prev","next"],s=this.indents,r=0;r<i.length;r++){for(var o=e(this.element)[i[r]]();o.length&&e("."+t.target,o);){if(this.indentEnabled)var a=e(".indentation",o).length;if(this.indentEnabled&&a!=s){if(s>a)break}else n.push(o[0]);o=e(o)[i[r]]()}"prev"==i[r]&&(n.reverse(),n.push(this.element))}return n},Drupal.tableDrag.prototype.row.prototype.removeIndentClasses=function(){for(var t in this.children)e(".indentation",this.children[t]).removeClass("tree-child").removeClass("tree-child-first").removeClass("tree-child-last").removeClass("tree-child-horizontal")},Drupal.tableDrag.prototype.row.prototype.markChanged=function(){var t=Drupal.theme("tableDragChangedMarker"),n=e("td:first",this.element);0==e("span.tabledrag-changed",n).length&&n.append(t)},Drupal.tableDrag.prototype.row.prototype.onIndent=function(){return null},Drupal.tableDrag.prototype.row.prototype.onSwap=function(e){return null},Drupal.theme.prototype.tableDragChangedMarker=function(){return'<span class="warning tabledrag-changed">*</span>'},Drupal.theme.prototype.tableDragIndentation=function(){return'<div class="indentation">&nbsp;</div>'},Drupal.theme.prototype.tableDragChangedWarning=function(){return'<div class="tabledrag-changed-warning messages warning">'+Drupal.theme("tableDragChangedMarker")+" "+Drupal.t("Changes made in this table will not be saved until the form is submitted.")+"</div>"}}(jQuery),function($){Drupal.behaviors.tableHeader={attach:function(e,t){$.support.positionFixed&&$("table.sticky-enabled",e).once("tableheader",function(){$(this).data("drupal-tableheader",new Drupal.tableHeader(this))})}},Drupal.tableHeader=function(e){var t=this;this.originalTable=$(e),this.originalHeader=$(e).children("thead"),this.originalHeaderCells=this.originalHeader.find("> tr > th"),this.displayWeight=null,this.originalTable.bind("columnschange",function(e,n){t.widthCalculated=null!==t.displayWeight&&t.displayWeight===n,t.displayWeight=n}),this.stickyTable=$('<table class="sticky-header"/>').insertBefore(this.originalTable).css({position:"fixed",top:"0px"}),this.stickyHeader=this.originalHeader.clone(!0).hide().appendTo(this.stickyTable),this.stickyHeaderCells=this.stickyHeader.find("> tr > th"),this.originalTable.addClass("sticky-table"),$(window).bind("scroll.drupal-tableheader",$.proxy(this,"eventhandlerRecalculateStickyHeader")).bind("resize.drupal-tableheader",{calculateWidth:!0},$.proxy(this,"eventhandlerRecalculateStickyHeader")).bind("drupalDisplaceAnchor.drupal-tableheader",function(){window.scrollBy(0,-t.stickyTable.outerHeight())}).bind("drupalDisplaceFocus.drupal-tableheader",function(e){t.stickyVisible&&e.clientY<t.stickyOffsetTop+t.stickyTable.outerHeight()&&0===e.$target.closest("sticky-header").length&&window.scrollBy(0,-t.stickyTable.outerHeight())}).triggerHandler("resize.drupal-tableheader"),this.stickyHeader.show()},Drupal.tableHeader.prototype.eventhandlerRecalculateStickyHeader=function(event){var self=this,calculateWidth=event.data&&event.data.calculateWidth;this.stickyOffsetTop=Drupal.settings.tableHeaderOffset?eval(Drupal.settings.tableHeaderOffset+"()"):0,this.stickyTable.css("top",this.stickyOffsetTop+"px");var viewHeight=document.documentElement.scrollHeight||document.body.scrollHeight;(calculateWidth||this.viewHeight!==viewHeight)&&(this.viewHeight=viewHeight,this.vPosition=this.originalTable.offset().top-4-this.stickyOffsetTop,this.hPosition=this.originalTable.offset().left,this.vLength=this.originalTable[0].clientHeight-100,calculateWidth=!0);var hScroll=document.documentElement.scrollLeft||document.body.scrollLeft,vOffset=(document.documentElement.scrollTop||document.body.scrollTop)-this.vPosition;if(this.stickyVisible=vOffset>0&&vOffset<this.vLength,this.stickyTable.css({left:-hScroll+this.hPosition+"px",visibility:this.stickyVisible?"visible":"hidden"}),this.stickyVisible&&(calculateWidth||!this.widthCalculated)){this.widthCalculated=!0;for(var $that=null,$stickyCell=null,display=null,cellWidth=null,i=0,il=this.originalHeaderCells.length;il>i;i+=1)$that=$(this.originalHeaderCells[i]),$stickyCell=this.stickyHeaderCells.eq($that.index()),display=$that.css("display"),"none"!==display?(cellWidth=$that.css("width"),"auto"===cellWidth&&(cellWidth=$that[0].clientWidth+"px"),$stickyCell.css({width:cellWidth,display:display})):$stickyCell.css("display","none");this.stickyTable.css("width",this.originalTable.outerWidth())}}}(jQuery),function(e){Drupal.behaviors.tableSelect={attach:function(t,n){e("th.select-all",t).closest("table").once("table-select",Drupal.tableSelect)}},Drupal.tableSelect=function(){if(0!=e("td input:checkbox",this).length){var t,n,i=this,s={selectAll:Drupal.t("Select all rows in this table"),selectNone:Drupal.t("Deselect all rows in this table")},r=function(t){e(i).prev("table.sticky-header").andSelf().find("th.select-all input:checkbox").each(function(){e(this).attr("title",t?s.selectNone:s.selectAll),this.checked=t})};e("th.select-all",i).prepend(e('<input type="checkbox" class="form-checkbox" />').attr("title",s.selectAll)).click(function(n){e(n.target).is("input:checkbox")&&(t.each(function(){this.checked=n.target.checked,e(this).closest("tr").toggleClass("selected",this.checked)}),r(n.target.checked))}),t=e("td input:checkbox:enabled",i).click(function(i){e(this).closest("tr").toggleClass("selected",this.checked),i.shiftKey&&n&&n!=i.target&&Drupal.tableSelectRange(e(i.target).closest("tr")[0],e(n).closest("tr")[0],i.target.checked),r(t.length==e(t).filter(":checked").length),n=i.target})}},Drupal.tableSelectRange=function(t,n,i){for(var s=t.rowIndex>n.rowIndex?"previousSibling":"nextSibling",r=t[s];r;r=r[s])if(1==r.nodeType)if(e(r).toggleClass("selected",i),e("input:checkbox",r).each(function(){this.checked=i}),n.nodeType){if(r==n)break}else if(e.filter(n,[r]).r.length)break}}(jQuery),function(e){Drupal.behaviors.textarea={attach:function(t,n){e(".form-textarea-wrapper.resizable",t).once("textarea",function(){function t(t){return s=r.height()-t.pageY,r.css("opacity",.25),e(document).mousemove(n).mouseup(i),!1}function n(e){return r.height(Math.max(32,s+e.pageY)+"px"),!1}function i(t){e(document).unbind("mousemove",n).unbind("mouseup",i),r.css("opacity",1)}var s=null,r=e(this).addClass("resizable-textarea").find("textarea"),o=e('<div class="grippie"></div>').mousedown(t);o.insertAfter(r)})}}}(jQuery),function(e){Drupal.behaviors.setTimezone={attach:function(t,n){e("select.timezone-detect",t).once("timezone",function(){var t,i=Date(),s=i.match(/\(([A-Z]{3,5})\)/),r=s?s[1]:0,o=new Date,a=-60*o.getTimezoneOffset(),l=new Date(o.getFullYear(),0,1,12,0,0,0),c=new Date(o.getFullYear(),6,1,12,0,0,0),u=-60*l.getTimezoneOffset(),d=-60*c.getTimezoneOffset();t=u==d?"":Math.max(u,d)==a?1:0;var p="system/timezone/"+r+"/"+a+"/"+t,f=this;e.ajax({async:!1,url:n.basePath,data:{q:p,date:i},dataType:"json",success:function(t){t&&e(f).val(t)}})})}}}(jQuery),function(e){Drupal.behaviors.verticalTabs={attach:function(t){e(".vertical-tabs-panes",t).once("vertical-tabs",function(){var t,n=e(":hidden.vertical-tabs-active-tab",this).val(),i=e("> fieldset",this);if(0!=i.length){var s=e('<ul class="vertical-tabs-list"></ul>');e(this).wrap('<div class="vertical-tabs clearfix"></div>').before(s),i.each(function(){var i=new Drupal.verticalTab({title:e("> legend",this).text(),fieldset:e(this)});s.append(i.item),e(this).removeClass("collapsible collapsed").addClass("vertical-tabs-pane").data("verticalTab",i),this.id==n&&(t=e(this))}),e("> li:first",s).addClass("first"),e("> li:last",s).addClass("last"),t||(t=window.location.hash&&e(this).find(window.location.hash).length?e(this).find(window.location.hash).closest(".vertical-tabs-pane"):e("> .vertical-tabs-pane:first",this)),t.length&&t.data("verticalTab").focus()}})}},Drupal.verticalTab=function(t){var n=this;e.extend(this,t,Drupal.theme("verticalTab",t)),this.link.click(function(){return n.focus(),!1}),this.link.keydown(function(t){return 13==t.keyCode?(n.focus(),e("fieldset.vertical-tabs-pane :input:visible:enabled:first").focus(),!1):void 0}),this.fieldset.bind("summaryUpdated",function(){n.updateSummary()}).trigger("summaryUpdated")},Drupal.verticalTab.prototype={focus:function(){this.fieldset.siblings("fieldset.vertical-tabs-pane").each(function(){var t=e(this).data("verticalTab");t.fieldset.hide(),t.item.removeClass("selected")}).end().show().siblings(":hidden.vertical-tabs-active-tab").val(this.fieldset.attr("id")),this.item.addClass("selected"),e("#active-vertical-tab").remove(),this.link.append('<span id="active-vertical-tab" class="element-invisible">'+Drupal.t("(active tab)")+"</span>")},updateSummary:function(){this.summary.html(this.fieldset.drupalGetSummary())},tabShow:function(){return this.item.show(),this.item.parent().children(".vertical-tab-button").removeClass("first").filter(":visible:first").addClass("first"),this.fieldset.removeClass("vertical-tab-hidden").show(),this.focus(),this},tabHide:function(){this.item.hide(),this.item.parent().children(".vertical-tab-button").removeClass("first").filter(":visible:first").addClass("first"),this.fieldset.addClass("vertical-tab-hidden").hide();var e=this.fieldset.siblings(".vertical-tabs-pane:not(.vertical-tab-hidden):first");return e.length&&e.data("verticalTab").focus(),this}},Drupal.theme.prototype.verticalTab=function(t){var n={};return n.item=e('<li class="vertical-tab-button" tabindex="-1"></li>').append(n.link=e('<a href="#"></a>').append(n.title=e("<strong></strong>").text(t.title)).append(n.summary=e('<span class="summary"></span>'))),n}}(jQuery),function(e){"use strict";e.extend(Drupal.settings,{eu_cookie_compliance:{popup_enabled:1,popup_agreed_enabled:0,popup_hide_agreed:0,popup_clicking_confirmation:0,popup_html_info:'<div>\n  <div class ="popup-content info">\n    <div id="popup-text">\n      <div class="cookie-opt-in"><a class="btn-close" href="javascript:void(0);" id="no-thankx">sluiten</a>\n<p>Aegon maakt gebruik van cookies voor een goede werking van de site, voor <strong>tracking</strong> en voor het bijhouden van de <strong>statistieken</strong>. Gaat u verder op de site? Dan stemt u er in toe dat wij cookies voor plaatsen. Wilt u niet alle cookies accepteren, wijzig dan uw keuze via <a class="find-more-button" href="javascript:void(0);">instellingen</a>. Voor meer informatie verwijzen wij u naar het <a href="/overaegon/privacy/">privacy en cookiebestand</a>.</p>\n</div>\n<div id="popup-wrapper" style="position: fixed;top: -9999px;"> </div>\n    </div>\n    <div id="popup-buttons">\n      <button type="button" class="agree-button">cookies toestaan</button>\n      <button type="button" class="find-more-button">instellingen</button>\n    </div>\n  </div>\n</div>\n',popup_height:"auto",popup_width:"100%",popup_delay:1e3,popup_link:"/aegon.nl/privacy.html",popup_link_new_window:1,popup_position:1,popup_language:"en",domain:"aegon.loc"}})}(jQuery),function(e){"function"==typeof define&&define.amd?define(["jquery"],function(t){e(t)}):"object"==typeof module&&"object"==typeof module.exports?module.exports=e(require("jquery")):e(window.jQuery)}(function(e){"use strict";function t(e){void 0===e&&(e=window.navigator.userAgent),e=e.toLowerCase();var t=/(edge)\/([\w.]+)/.exec(e)||/(opr)[\/]([\w.]+)/.exec(e)||/(chrome)[ \/]([\w.]+)/.exec(e)||/(version)(applewebkit)[ \/]([\w.]+).*(safari)[ \/]([\w.]+)/.exec(e)||/(webkit)[ \/]([\w.]+).*(version)[ \/]([\w.]+).*(safari)[ \/]([\w.]+)/.exec(e)||/(webkit)[ \/]([\w.]+)/.exec(e)||/(opera)(?:.*version|)[ \/]([\w.]+)/.exec(e)||/(msie) ([\w.]+)/.exec(e)||e.indexOf("trident")>=0&&/(rv)(?::| )([\w.]+)/.exec(e)||e.indexOf("compatible")<0&&/(mozilla)(?:.*? rv:([\w.]+)|)/.exec(e)||[],n=/(ipad)/.exec(e)||/(ipod)/.exec(e)||/(iphone)/.exec(e)||/(kindle)/.exec(e)||/(silk)/.exec(e)||/(android)/.exec(e)||/(windows phone)/.exec(e)||/(win)/.exec(e)||/(mac)/.exec(e)||/(linux)/.exec(e)||/(cros)/.exec(e)||/(playbook)/.exec(e)||/(bb)/.exec(e)||/(blackberry)/.exec(e)||[],i={},s={browser:t[5]||t[3]||t[1]||"",version:t[2]||t[4]||"0",versionNumber:t[4]||t[2]||"0",platform:n[0]||""};if(s.browser&&(i[s.browser]=!0,i.version=s.version,i.versionNumber=parseInt(s.versionNumber,10)),s.platform&&(i[s.platform]=!0),(i.android||i.bb||i.blackberry||i.ipad||i.iphone||i.ipod||i.kindle||i.playbook||i.silk||i["windows phone"])&&(i.mobile=!0),(i.cros||i.mac||i.linux||i.win)&&(i.desktop=!0),(i.chrome||i.opr||i.safari)&&(i.webkit=!0),i.rv||i.edge){var r="msie";s.browser=r,i[r]=!0}if(i.safari&&i.blackberry){var o="blackberry";s.browser=o,i[o]=!0}if(i.safari&&i.playbook){var a="playbook";s.browser=a,i[a]=!0}if(i.bb){var l="blackberry";s.browser=l,i[l]=!0}if(i.opr){var c="opera";s.browser=c,i[c]=!0}if(i.safari&&i.android){var u="android";s.browser=u,i[u]=!0}if(i.safari&&i.kindle){var d="kindle";s.browser=d,i[d]=!0}if(i.safari&&i.silk){var p="silk";s.browser=p,i[p]=!0}return i.name=s.browser,i.platform=s.platform,i}return window.jQBrowser=t(window.navigator.userAgent),window.jQBrowser.uaMatch=t,e&&(e.browser=window.jQBrowser),window.jQBrowser}),function(e){"function"==typeof define&&define.amd?define(["jquery"],e):"object"==typeof exports?module.exports=e(require("jquery")):e(jQuery)}(function(e){function t(e){return a.raw?e:encodeURIComponent(e)}function n(e){return a.raw?e:decodeURIComponent(e)}function i(e){return t(a.json?JSON.stringify(e):String(e))}function s(e){0===e.indexOf('"')&&(e=e.slice(1,-1).replace(/\\"/g,'"').replace(/\\\\/g,"\\"));try{return e=decodeURIComponent(e.replace(o," ")),a.json?JSON.parse(e):e}catch(t){}}function r(t,n){var i=a.raw?t:s(t);return e.isFunction(n)?n(i):i}var o=/\+/g,a=e.cookie=function(s,o,l){if(arguments.length>1&&!e.isFunction(o)){if(l=e.extend({},a.defaults,l),"number"==typeof l.expires){var c=l.expires,u=l.expires=new Date;u.setMilliseconds(u.getMilliseconds()+864e5*c)}return document.cookie=[t(s),"=",i(o),l.expires?"; expires="+l.expires.toUTCString():"",l.path?"; path="+l.path:"",l.domain?"; domain="+l.domain:"",l.secure?"; secure":""].join("")}for(var d=s?void 0:{},p=document.cookie?document.cookie.split("; "):[],f=0,h=p.length;h>f;f++){var g=p[f].split("="),m=n(g.shift()),v=g.join("=");if(s===m){d=r(v,o);break}s||void 0===(v=r(v))||(d[m]=v)}return d};a.defaults={},e.removeCookie=function(t,n){return e.cookie(t,"",e.extend({},n,{expires:-1})),!e.cookie(t)}});var msBeautify=msBeautify||{};!function($){function dd(element,settings){var settings=$.extend(!0,{byJson:{data:null,selectedIndex:0,name:null,size:0,multiple:!1,width:250},mainCSS:"dd",height:120,visibleRows:7,rowHeight:0,showIcon:!0,zIndex:9999,useSprite:!1,animStyle:"slideDown",event:"click",openDirection:"auto",jsonTitle:!0,style:"",disabledOpacity:.7,disabledOptionEvents:!0,childWidth:0,enableCheckbox:!1,checkboxNameSuffix:"_mscheck",append:"",prepend:"",reverseMode:!0,roundedCorner:!0,enableAutoFilter:!0,on:{create:null,open:null,close:null,add:null,remove:null,change:null,blur:null,click:null,dblclick:null,mousemove:null,mouseover:null,mouseout:null,focus:null,mousedown:null,mouseup:null}},settings),$this=this,holderId={postElementHolder:"_msddHolder",postID:"_msdd",postTitleID:"_title",postTitleTextID:"_titleText",postChildID:"_child"},css={dd:settings.mainCSS,ddTitle:"ddTitle",arrow:"ddArrow arrowoff",ddChild:"ddChild",ddTitleText:"ddTitleText",disabled:"disabled",enabled:"enabled",ddOutOfVision:"ddOutOfVision",borderTop:"borderTop",noBorderTop:"noBorderTop",selected:"selected",divider:"divider",optgroup:"optgroup",optgroupTitle:"optgroupTitle",description:"description",label:"ddlabel",hover:"hover",disabledAll:"disabledAll"},css_i={li:"_msddli_",borderRadiusTp:"borderRadiusTp",ddChildMore:"border shadow",fnone:"fnone"},isList=!1,isMultiple=!1,isDisabled=!1,cacheElement={},element,orginial={},isOpen=!1,DOWN_ARROW=40,UP_ARROW=38,LEFT_ARROW=37,RIGHT_ARROW=39,ESCAPE=27,ENTER=13,ALPHABETS_START=47,SHIFT=16,CONTROL=17,BACKSPACE=8,DELETE=46,shiftHolded=!1,controlHolded=!1,lastTarget=null,forcedTrigger=!1,oldSelected,isCreated=!1,doc=document,ua=window.navigator.userAgent,isIE=ua.match(/msie/i);settings.reverseMode=settings.reverseMode.toString(),settings.roundedCorner=settings.roundedCorner.toString();var isArray=function(e){return"[object Array]"==Object.prototype.toString.call(e)?!0:!1},msieversion=function(){var e=ua.indexOf("MSIE");return e>0?parseInt(ua.substring(e+5,ua.indexOf(".",e))):0},checkDataSetting=function(){settings.mainCSS=$("#"+element).data("maincss")||settings.mainCSS,settings.visibleRows=$("#"+element).data("visiblerows")||settings.visibleRows,0==$("#"+element).data("showicon")&&(settings.showIcon=$("#"+element).data("showicon")),settings.useSprite=$("#"+element).data("usesprite")||settings.useSprite,settings.animStyle=$("#"+element).data("animstyle")||settings.animStyle,settings.event=$("#"+element).data("event")||settings.event,settings.openDirection=$("#"+element).data("opendirection")||settings.openDirection,settings.jsonTitle=$("#"+element).data("jsontitle")||settings.jsonTitle,settings.disabledOpacity=$("#"+element).data("disabledopacity")||settings.disabledOpacity,settings.childWidth=$("#"+element).data("childwidth")||settings.childWidth,settings.enableCheckbox=$("#"+element).data("enablecheckbox")||settings.enableCheckbox,settings.checkboxNameSuffix=$("#"+element).data("checkboxnamesuffix")||settings.checkboxNameSuffix,settings.append=$("#"+element).data("append")||settings.append,settings.prepend=$("#"+element).data("prepend")||settings.prepend,settings.reverseMode=$("#"+element).data("reversemode")||settings.reverseMode,settings.roundedCorner=$("#"+element).data("roundedcorner")||settings.roundedCorner,settings.enableAutoFilter=$("#"+element).data("enableautofilter")||settings.enableAutoFilter,
settings.reverseMode=settings.reverseMode.toString(),settings.roundedCorner=settings.roundedCorner.toString(),settings.enableAutoFilter=settings.enableAutoFilter.toString()},getElement=function(e){return void 0===cacheElement[e]&&(cacheElement[e]=doc.getElementById(e)),cacheElement[e]},getIndex=function(e){var t=getPostID("postChildID");return $("#"+t+" li."+css_i.li).index(e)},createByJson=function(){if(settings.byJson.data){var validData=["description","image","title"];try{element.id||(element.id="dropdown"+msBeautify.counter),settings.byJson.data=eval(settings.byJson.data);var id="msdropdown"+msBeautify.counter++,obj={};obj.id=id,obj.name=settings.byJson.name||element.id,settings.byJson.size>0&&(obj.size=settings.byJson.size),obj.multiple=settings.byJson.multiple;for(var oSelect=createElement("select",obj),i=0;i<settings.byJson.data.length;i++){var current=settings.byJson.data[i],opt=new Option(current.text,current.value);for(var p in current)if("text"!=p.toLowerCase()){var key=-1!=$.inArray(p.toLowerCase(),validData)?"data-":"";opt.setAttribute(key+p,current[p])}oSelect.options[i]=opt}getElement(element.id).appendChild(oSelect),oSelect.selectedIndex=settings.byJson.selectedIndex,$(oSelect).css({width:settings.byJson.width+"px"}),element=oSelect}catch(e){throw"There is an error in json data."}}},init=function(){createByJson(),element.id||(element.id="msdrpdd"+msBeautify.counter++),element=element.id,$this.element=element,checkDataSetting(),isDisabled=getElement(element).disabled;var e=settings.enableCheckbox;"true"===e.toString()&&(getElement(element).multiple=!0,settings.enableCheckbox=!0),isList=getElement(element).size>1||1==getElement(element).multiple?!0:!1,isList&&(isMultiple=getElement(element).multiple),mergeAllProp(),createLayout(),updateProp("uiData",getDataAndUI()),updateProp("selectedOptions",$("#"+element+" option:selected"));var t=getPostID("postChildID");oldSelected=$("#"+t+" li."+css.selected),"true"===settings.reverseMode&&$("#"+element).on("change",function(){setValue(this.selectedIndex)}),getElement(element).refresh=function(e){$("#"+element).msDropdown().data("dd").refresh()}},getPostID=function(e){return element+holderId[e]},getInternalStyle=function(e){var t=void 0===e.style?"":e.style.cssText;return t},parseOption=function(opt){var imagePath="",title="",description="",value=-1,text="",className="",imagecss="",index;if(void 0!==opt){var attrTitle=opt.title||"";if(""!=attrTitle){var reg=/^\{.*\}$/,isJson=reg.test(attrTitle);if(isJson&&settings.jsonTitle)var obj=eval("["+attrTitle+"]");title=isJson&&settings.jsonTitle?obj[0].title:title,description=isJson&&settings.jsonTitle?obj[0].description:description,imagePath=isJson&&settings.jsonTitle?obj[0].image:attrTitle,imagecss=isJson&&settings.jsonTitle?obj[0].imagecss:imagecss,index=opt.index}text=opt.text||"",value=opt.value||"",className=opt.className||"",title=$(opt).prop("data-title")||$(opt).data("title")||title||"",description=$(opt).prop("data-description")||$(opt).data("description")||description||"",imagePath=$(opt).prop("data-image")||$(opt).data("image")||imagePath||"",imagecss=$(opt).prop("data-imagecss")||$(opt).data("imagecss")||imagecss||"",index=$(opt).index()}var o={image:imagePath,title:title,description:description,value:value,text:text,className:className,imagecss:imagecss,index:index};return o},createElement=function(e,t,n){var i=doc.createElement(e);if(t)for(var s in t)switch(s){case"style":i.style.cssText=t[s];break;default:i[s]=t[s]}return n&&(i.innerHTML=n),i},hideOriginal=function(){var e=getPostID("postElementHolder");if(0==$("#"+e).length){var t={style:"height: 0px;overflow: hidden;position: absolute;",className:css.ddOutOfVision};t.id=e;var n=createElement("div",t);$("#"+element).after(n),$("#"+element).appendTo($("#"+e))}else $("#"+e).css({height:0,overflow:"hidden",position:"absolute"});getElement(element).tabIndex=-1},createWrapper=function(){var e="true"==settings.roundedCorner?" borderRadius":"",t={className:css.dd+" ddcommon"+e},n=getInternalStyle(getElement(element)),i=$("#"+element).outerWidth();t.style="width: "+i+"px;",n.length>0&&(t.style=t.style+""+n),t.id=getPostID("postID"),t.tabIndex=getElement(element).tabIndex;var s=createElement("div",t);return s},createTitle=function(){var e;e=getElement(element).selectedIndex>=0?getElement(element).options[getElement(element).selectedIndex]:{value:"",text:""};var t="",n="",i=$("#"+element).data("usesprite");i&&(settings.useSprite=i),0!=settings.useSprite&&(t=" "+settings.useSprite,n=" "+e.className);var s="true"==settings.roundedCorner?" "+css_i.borderRadiusTp:"",r=createElement("div",{className:css.ddTitle+t+s}),o=createElement("span",{className:css.divider}),a=createElement("span",{className:css.arrow}),l=getPostID("postTitleID"),c=createElement("span",{className:css.ddTitleText+n,id:l}),u=parseOption(e),d=u.image,p=u.text||"";if(""!=d&&settings.showIcon){var f=createElement("img");f.src=d,""!=u.imagecss&&(f.className=u.imagecss+" ")}var h=createElement("span",{className:css.label},p);r.appendChild(o),r.appendChild(a),f&&c.appendChild(f),c.appendChild(h),r.appendChild(c);var g=createElement("span",{className:css.description},u.description);return c.appendChild(g),r},createFilterBox=function(){var e=getPostID("postTitleTextID"),t="true"==settings.roundedCorner?"borderRadius":"",n=createElement("input",{id:e,type:"text",value:"",autocomplete:"off",className:"text shadow "+t,style:"display: none"});return n},createChild=function(e){var t={},n=getInternalStyle(e);n.length>0&&(t.style=n);var i=e.disabled?css.disabled:css.enabled;i=e.selected?i+" "+css.selected:i,i=i+" "+css_i.li,t.className=i,0!=settings.useSprite&&(t.className=i+" "+e.className);var s=createElement("li",t),r=parseOption(e);""!=r.title&&(s.title=r.title);var o=r.image;if(""!=o&&settings.showIcon){var a=createElement("img");a.src=o,""!=r.imagecss&&(a.className=r.imagecss+" ")}if(""!=r.description)var l=createElement("span",{className:css.description},r.description);var c=e.text||"",u=createElement("span",{className:css.label},c);if(settings.enableCheckbox===!0){var d=createElement("input",{type:"checkbox",name:element+settings.checkboxNameSuffix+"[]",value:e.value||"",className:"checkbox"});s.appendChild(d),settings.enableCheckbox===!0&&(d.checked=e.selected?!0:!1)}a&&s.appendChild(a),s.appendChild(u),l?s.appendChild(l):a&&(a.className=a.className+css_i.fnone);var p=createElement("div",{className:"clear"});return s.appendChild(p),s},createChildren=function(){var e=getPostID("postChildID"),t={className:css.ddChild+" ddchild_ "+css_i.ddChildMore,id:e};t.style=0==isList?"z-index: "+settings.zIndex:"z-index:1";var n=$("#"+element).data("childwidth")||settings.childWidth;n&&(t.style=(t.style||"")+";width:"+n);var i=createElement("div",t),s=createElement("ul");0!=settings.useSprite&&(s.className=settings.useSprite);for(var r=getElement(element).children,o=0;o<r.length;o++){var a,l=r[o];if("optgroup"==l.nodeName.toLowerCase()){a=createElement("li",{className:css.optgroup});var c=createElement("span",{className:css.optgroupTitle},l.label);a.appendChild(c);for(var u=l.children,d=createElement("ul"),p=0;p<u.length;p++){var f=createChild(u[p]);d.appendChild(f)}a.appendChild(d)}else a=createChild(l);s.appendChild(a)}return i.appendChild(s),i},childHeight=function(e){var t=getPostID("postChildID");if(e)return-1==e?$("#"+t).css({height:"auto",overflow:"auto"}):$("#"+t).css("height",e+"px"),!1;var n,i=getElement(element).options.length;if(i>settings.visibleRows||settings.visibleRows){var s=$("#"+t+" li:first"),r=parseInt(s.css("padding-bottom"))+parseInt(s.css("padding-top"));0===settings.rowHeight&&($("#"+t).css({visibility:"hidden",display:"block"}),settings.rowHeight=Math.ceil(s.height()),$("#"+t).css({visibility:"visible"}),isList&&settings.enableCheckbox!==!0||$("#"+t).css({display:"none"})),n=(settings.rowHeight+r)*Math.min(settings.visibleRows,i)+3}else isList&&(n=$("#"+element).height());return n},applyChildEvents=function(){var e=getPostID("postChildID");$("#"+e).on("click",function(e){return isDisabled===!0?!1:(e.preventDefault(),e.stopPropagation(),void(isList&&bind_on_events()))}),$("#"+e+" li."+css.enabled).on("click",function(e){"input"!==e.target.nodeName.toLowerCase()&&close(this)}),$("#"+e+" li."+css.enabled).on("mousedown",function(t){if(isDisabled===!0)return!1;if(oldSelected=$("#"+e+" li."+css.selected),lastTarget=this,t.preventDefault(),t.stopPropagation(),settings.enableCheckbox===!0&&"input"===t.target.nodeName.toLowerCase()&&(controlHolded=!0),isList===!0)if(isMultiple)if(shiftHolded===!0){$(this).addClass(css.selected);var n=$("#"+e+" li."+css.selected),i=getIndex(this);if(n.length>1){var s=$("#"+e+" li."+css_i.li),r=getIndex(n[0]),o=getIndex(n[1]);i>o&&(r=i,o+=1);for(var a=Math.min(r,o);a<=Math.max(r,o);a++){var l=s[a];$(l).hasClass(css.enabled)&&$(l).addClass(css.selected)}}}else if(controlHolded===!0){if($(this).toggleClass(css.selected),settings.enableCheckbox===!0){var c=this.childNodes[0];c.checked=!c.checked}}else $("#"+e+" li."+css.selected).removeClass(css.selected),$("#"+e+" input:checkbox").prop("checked",!1),$(this).addClass(css.selected),settings.enableCheckbox===!0&&(this.childNodes[0].checked=!0);else $("#"+e+" li."+css.selected).removeClass(css.selected),$(this).addClass(css.selected);else $("#"+e+" li."+css.selected).removeClass(css.selected),$(this).addClass(css.selected)}),$("#"+e+" li."+css.enabled).on("mouseenter",function(e){return isDisabled===!0?!1:(e.preventDefault(),e.stopPropagation(),void(null!=lastTarget&&isMultiple&&($(this).addClass(css.selected),settings.enableCheckbox===!0&&(this.childNodes[0].checked=!0))))}),$("#"+e+" li."+css.enabled).on("mouseover",function(e){return isDisabled===!0?!1:void $(this).addClass(css.hover)}),$("#"+e+" li."+css.enabled).on("mouseout",function(t){return isDisabled===!0?!1:void $("#"+e+" li."+css.hover).removeClass(css.hover)}),$("#"+e+" li."+css.enabled).on("mouseup",function(t){if(isDisabled===!0)return!1;t.preventDefault(),t.stopPropagation(),settings.enableCheckbox===!0&&(controlHolded=!1);var n=$("#"+e+" li."+css.selected).length;forcedTrigger=oldSelected.length!=n||0==n?!0:!1,fireAfterItemClicked(),unbind_on_events(),bind_on_events(),lastTarget=null}),0==settings.disabledOptionEvents&&($("#"+e+" li."+css_i.li).on("click",function(e){return isDisabled===!0?!1:void fireOptionEventIfExist(this,"click")}),$("#"+e+" li."+css_i.li).on("mouseenter",function(e){return isDisabled===!0?!1:void fireOptionEventIfExist(this,"mouseenter")}),$("#"+e+" li."+css_i.li).on("mouseover",function(e){return isDisabled===!0?!1:void fireOptionEventIfExist(this,"mouseover")}),$("#"+e+" li."+css_i.li).on("mouseout",function(e){return isDisabled===!0?!1:void fireOptionEventIfExist(this,"mouseout")}),$("#"+e+" li."+css_i.li).on("mousedown",function(e){return isDisabled===!0?!1:void fireOptionEventIfExist(this,"mousedown")}),$("#"+e+" li."+css_i.li).on("mouseup",function(e){return isDisabled===!0?!1:void fireOptionEventIfExist(this,"mouseup")}))},removeChildEvents=function(){var e=getPostID("postChildID");$("#"+e).off("click"),$("#"+e+" li."+css.enabled).off("mouseenter"),$("#"+e+" li."+css.enabled).off("click"),$("#"+e+" li."+css.enabled).off("mouseover"),$("#"+e+" li."+css.enabled).off("mouseout"),$("#"+e+" li."+css.enabled).off("mousedown"),$("#"+e+" li."+css.enabled).off("mouseup")},triggerBypassingHandler=function(e,t,n){$("#"+e).off(t,n),$("#"+e).trigger(t),$("#"+e).on(t,n)},applyEvents=function(){{var e=getPostID("postID"),t=getPostID("postTitleTextID");getPostID("postChildID")}$("#"+e).on(settings.event,function(e){return isDisabled===!0?!1:(fireEventIfExist(settings.event),e.preventDefault(),e.stopPropagation(),void open(e))}),$("#"+e).on("keydown",function(e){var t=e.which;!isOpen&&(t==ENTER||t==UP_ARROW||t==DOWN_ARROW||t==LEFT_ARROW||t==RIGHT_ARROW||t>=ALPHABETS_START&&!isList)&&(open(e),t>=ALPHABETS_START?showFilterBox():(e.preventDefault(),e.stopImmediatePropagation()))}),$("#"+e).on("focus",wrapperFocusHandler),$("#"+e).on("blur",wrapperBlurHandler),$("#"+t).on("blur",function(t){triggerBypassingHandler(e,"focus",wrapperFocusHandler)}),applyChildEvents(),$("#"+e).on("dblclick",on_dblclick),$("#"+e).on("mousemove",on_mousemove),$("#"+e).on("mouseenter",on_mouseover),$("#"+e).on("mouseleave",on_mouseout),$("#"+e).on("mousedown",on_mousedown),$("#"+e).on("mouseup",on_mouseup)},wrapperFocusHandler=function(e){fireEventIfExist("focus")},wrapperBlurHandler=function(e){fireEventIfExist("blur")},fixedForList=function(){var e=getPostID("postID"),t=getPostID("postChildID");if(isList===!0&&settings.enableCheckbox===!1)$("#"+e+" ."+css.ddTitle).hide(),$("#"+t).css({display:"block",position:"relative"});else{settings.enableCheckbox===!1&&(isMultiple=!1),$("#"+e+" ."+css.ddTitle).show(),$("#"+t).css({display:"none",position:"absolute"});var n=$("#"+t+" li."+css.selected)[0];$("#"+t+" li."+css.selected).removeClass(css.selected);var i=getIndex($(n).addClass(css.selected));setValue(i)}childHeight(childHeight())},fixedForDisabled=function(){{var e=getPostID("postID");1==isDisabled?settings.disabledOpacity:1}isDisabled===!0?$("#"+e).addClass(css.disabledAll):$("#"+e).removeClass(css.disabledAll)},fixedSomeUI=function(){var e=getPostID("postTitleTextID");"true"==settings.enableAutoFilter&&$("#"+e).on("keyup",applyFilters),fixedForList(),fixedForDisabled()},createLayout=function(){var e=createWrapper(),t=createTitle();e.appendChild(t);var n=createFilterBox();e.appendChild(n);var i=createChildren();e.appendChild(i),$("#"+element).after(e),hideOriginal(),fixedSomeUI(),applyEvents();var s=getPostID("postChildID");""!=settings.append&&$("#"+s).append(settings.append),""!=settings.prepend&&$("#"+s).prepend(settings.prepend),"function"==typeof settings.on.create&&settings.on.create.apply($this,arguments)},selectUI_LI=function(e){function t(e){$($("#"+n+" li."+css_i.li)[e]).addClass(css.selected),settings.enableCheckbox===!0&&$($("#"+n+" li."+css_i.li)[e]).find("input.checkbox").prop("checked","checked")}var n=getPostID("postChildID");if($("#"+n+" li."+css_i.li).removeClass(css.selected),settings.enableCheckbox===!0&&$("#"+n+" li."+css_i.li+" input.checkbox").prop("checked",!1),isArray(e)===!0)for(var i=0;i<e.length;i++)t(e[i]);else t(e)},selectMutipleOptions=function(e,t){for(var n=getPostID("postChildID"),i=e||$("#"+n+" li."+css.selected),s=0;s<i.length;s++){var r=t===!0?i[s]:getIndex(i[s]);getElement(element).options[r].selected="selected"}setValue(i)},fireAfterItemClicked=function(){var e=getPostID("postChildID"),t=$("#"+e+" li."+css.selected);(isMultiple&&(shiftHolded||controlHolded)||forcedTrigger)&&(getElement(element).selectedIndex=-1);var n;if(0==t.length?n=-1:t.length>1?selectMutipleOptions(t):n=getIndex($("#"+e+" li."+css.selected)),(getElement(element).selectedIndex!=n||forcedTrigger)&&t.length<=1){forcedTrigger=!1;{has_handler("change")}if(getElement(element).selectedIndex=n,setValue(n),"function"==typeof settings.on.change){var i=getDataAndUI();settings.on.change(i.data,i.ui)}$("#"+element).trigger("change")}},setValue=function(e,t){if(void 0!==e){var n,i,s;if(-1==e)n=-1,i="",s="",updateTitleUI(-1);else if("object"!=typeof e){var r=getElement(element).options[e];getElement(element).selectedIndex=e,n=e,i=parseOption(r),s=e>=0?getElement(element).options[e].text:"",updateTitleUI(void 0,i),i=i.value}else n=t&&t.index||getElement(element).selectedIndex,i=t&&t.value||getElement(element).value,s=t&&t.text||getElement(element).options[getElement(element).selectedIndex].text||"",updateTitleUI(n);updateProp("selectedIndex",n),updateProp("value",i),updateProp("selectedText",s),updateProp("children",getElement(element).children),updateProp("uiData",getDataAndUI()),updateProp("selectedOptions",$("#"+element+" option:selected"))}},has_handler=function(e){var t={byElement:!1,byJQuery:!1,hasEvent:!1},n=$("#"+element);try{null!==n.prop("on"+e)&&(t.hasEvent=!0,t.byElement=!0)}catch(i){}var s;return s="function"==typeof $._data?$._data(n[0],"events"):n.data("events"),s&&s[e]&&(t.hasEvent=!0,t.byJQuery=!0),t},bind_on_events=function(){unbind_on_events(),$("body").on("click",close),$(document).on("keydown",on_keydown),$(document).on("keyup",on_keyup)},unbind_on_events=function(){$("body").off("click",close),$(document).off("keydown",on_keydown),$(document).off("keyup",on_keyup)},applyFilters=function(e){if(e.keyCode<ALPHABETS_START&&e.keyCode!=BACKSPACE&&e.keyCode!=DELETE)return!1;var t=getPostID("postChildID"),n=getPostID("postTitleTextID"),i=getElement(n).value;if(0==i.length)$("#"+t+" li:hidden").show(),childHeight(childHeight());else{$("#"+t+" li").hide();var s=$("#"+t+" li:Contains('"+i+"')").show();$("#"+t+" li:visible").length<=settings.visibleRows&&childHeight(-1),(s.length>0&&!isList||!isMultiple)&&($("#"+t+" ."+css.selected).removeClass(css.selected),$(s[0]).addClass(css.selected))}isList||adjustOpen()},showFilterBox=function(){if("true"==settings.enableAutoFilter){var e=getPostID("postID"),t=getPostID("postTitleTextID");$("#"+t+":hidden").length>0&&0==controlHolded&&($("#"+t+":hidden").show().val(""),triggerBypassingHandler(e,"blur",wrapperBlurHandler),getElement(t).focus())}},hideFilterBox=function(){var e=getPostID("postTitleTextID");$("#"+e+":visible").length>0&&($("#"+e+":visible").hide(),getElement(e).blur())},on_keydown=function(e){var t=(getPostID("postTitleTextID"),getPostID("postChildID"));switch(e.keyCode){case DOWN_ARROW:case RIGHT_ARROW:e.preventDefault(),e.stopPropagation(),next();break;case UP_ARROW:case LEFT_ARROW:e.preventDefault(),e.stopPropagation(),previous();break;case ESCAPE:case ENTER:e.preventDefault(),e.stopPropagation(),close();var n=$("#"+t+" li."+css.selected).length;forcedTrigger=oldSelected.length!=n||0==n?!0:!1,fireAfterItemClicked(),unbind_on_events(),lastTarget=null;break;case SHIFT:shiftHolded=!0;break;case CONTROL:controlHolded=!0;break;default:e.keyCode>=ALPHABETS_START&&isList===!1&&showFilterBox()}return isDisabled===!0?!1:void fireEventIfExist("keydown")},on_keyup=function(e){switch(e.keyCode){case SHIFT:shiftHolded=!1;break;case CONTROL:controlHolded=!1}return isDisabled===!0?!1:void fireEventIfExist("keyup")},on_dblclick=function(e){return isDisabled===!0?!1:void fireEventIfExist("dblclick")},on_mousemove=function(e){return isDisabled===!0?!1:void fireEventIfExist("mousemove")},on_mouseover=function(e){return isDisabled===!0?!1:(e.preventDefault(),void fireEventIfExist("mouseover"))},on_mouseout=function(e){return isDisabled===!0?!1:(e.preventDefault(),void fireEventIfExist("mouseout"))},on_mousedown=function(e){return isDisabled===!0?!1:void fireEventIfExist("mousedown")},on_mouseup=function(e){return isDisabled===!0?!1:void fireEventIfExist("mouseup")},option_has_handler=function(e,t){var n={byElement:!1,byJQuery:!1,hasEvent:!1};void 0!=$(e).prop("on"+t)&&(n.hasEvent=!0,n.byElement=!0);var i=$(e).data("events");return i&&i[t]&&(n.hasEvent=!0,n.byJQuery=!0),n},fireOptionEventIfExist=function(e,t){if(0==settings.disabledOptionEvents){var n=getElement(element).options[getIndex(e)];if(option_has_handler(n,t).hasEvent===!0){if(option_has_handler(n,t).byElement===!0&&n["on"+t](),option_has_handler(n,t).byJQuery===!0)switch(t){case"keydown":case"keyup":break;default:$(n).trigger(t)}return!1}}},fireEventIfExist=function(e){if("function"==typeof settings.on[e]&&settings.on[e].apply(this,arguments),has_handler(e).hasEvent===!0){if(has_handler(e).byElement===!0)getElement(element)["on"+e]();else if(has_handler(e).byJQuery===!0)switch(e){case"keydown":case"keyup":break;default:$("#"+element).triggerHandler(e)}return!1}},scrollToIfNeeded=function(e){var t=getPostID("postChildID");if(e=void 0!==e?e:$("#"+t+" li."+css.selected),e.length>0){var n=parseInt($(e).position().top),i=parseInt($("#"+t).height());if(n>i){var s=n+$("#"+t).scrollTop()-i/2;$("#"+t).animate({scrollTop:s},500)}}},next=function(){function e(t){return t+=1,t>n.length?t:$(n[t]).hasClass(css.enabled)===!0?t:t=e(t)}var t=getPostID("postChildID"),n=$("#"+t+" li:visible."+css_i.li),i=$("#"+t+" li:visible."+css.selected);i=0==i.length?n[0]:i;var s=$("#"+t+" li:visible."+css_i.li).index(i);s<n.length-1&&(s=e(s),s<n.length&&(shiftHolded&&isList&&isMultiple||$("#"+t+" ."+css.selected).removeClass(css.selected),$(n[s]).addClass(css.selected),updateTitleUI(s),1==isList&&fireAfterItemClicked(),scrollToIfNeeded($(n[s]))),isList||adjustOpen())},previous=function(){function e(t){return t-=1,0>t?t:$(i[t]).hasClass(css.enabled)===!0?t:t=e(t)}var t=getPostID("postChildID"),n=$("#"+t+" li:visible."+css.selected),i=$("#"+t+" li:visible."+css_i.li),s=$("#"+t+" li:visible."+css_i.li).index(n[0]);if(s>=0){if(s=e(s),s>=0&&(shiftHolded&&isList&&isMultiple||$("#"+t+" ."+css.selected).removeClass(css.selected),$(i[s]).addClass(css.selected),updateTitleUI(s),1==isList&&fireAfterItemClicked(),parseInt($(i[s]).position().top+$(i[s]).height())<=0)){var r=$("#"+t).scrollTop()-$("#"+t).height()-$(i[s]).height();$("#"+t).animate({scrollTop:r},500)}isList||adjustOpen()}},adjustOpen=function(){var e=getPostID("postID"),t=getPostID("postChildID"),n=$("#"+e).offset(),i=$("#"+e).height(),s=$(window).height(),r=$(window).scrollTop(),o=$("#"+t).height(),a=$("#"+e).height(),l=settings.openDirection.toLowerCase();if((s+r<Math.floor(o+i+n.top)||"alwaysup"==l)&&"alwaysdown"!=l){a=o,$("#"+t).css({top:"-"+a+"px",display:"block",zIndex:settings.zIndex}),"true"==settings.roundedCorner&&$("#"+e).removeClass("borderRadius borderRadiusTp").addClass("borderRadiusBtm");var a=$("#"+t).offset().top;-10>a&&($("#"+t).css({top:parseInt($("#"+t).css("top"))-a+20+r+"px",zIndex:settings.zIndex}),"true"==settings.roundedCorner&&$("#"+e).removeClass("borderRadiusBtm borderRadiusTp").addClass("borderRadius"))}else $("#"+t).css({top:a+"px",zIndex:settings.zIndex}),"true"==settings.roundedCorner&&$("#"+e).removeClass("borderRadius borderRadiusBtm").addClass("borderRadiusTp");isIE&&msieversion()<=7&&($("div.ddcommon").css("zIndex",settings.zIndex-10),$("#"+e).css("zIndex",settings.zIndex+5))},open=function(e){if(isDisabled===!0)return!1;var t=(getPostID("postID"),getPostID("postChildID"));if(isOpen)"mouseover"!==settings.event&&close();else{isOpen=!0,""!=msBeautify.oldDiv&&$("#"+msBeautify.oldDiv).css({display:"none"}),msBeautify.oldDiv=t,$("#"+t+" li:hidden").show(),adjustOpen();var n=settings.animStyle;if(""==n||"none"==n){if($("#"+t).css({display:"block"}),scrollToIfNeeded(),"function"==typeof settings.on.open){var i=getDataAndUI();settings.on.open(i.data,i.ui)}}else $("#"+t)[n]("fast",function(){if(scrollToIfNeeded(),"function"==typeof settings.on.open){var e=getDataAndUI();settings.on.open(e.data,e.ui)}});bind_on_events()}},close=function(e){isOpen=!1;var t=getPostID("postID"),n=getPostID("postChildID");if((isList===!1||settings.enableCheckbox===!0)&&($("#"+n).css({display:"none"}),"true"==settings.roundedCorner&&$("#"+t).removeClass("borderRadiusTp borderRadiusBtm").addClass("borderRadius")),unbind_on_events(),"function"==typeof settings.on.close){var i=getDataAndUI();settings.on.close(i.data,i.ui)}hideFilterBox(),childHeight(childHeight()),$("#"+n).css({zIndex:1}),updateTitleUI(getElement(element).selectedIndex)},mergeAllProp=function(){try{orginial=$.extend(!0,{},getElement(element));for(var e in orginial)"function"!=typeof orginial[e]&&($this[e]=orginial[e])}catch(t){}$this.selectedText=getElement(element).selectedIndex>=0?getElement(element).options[getElement(element).selectedIndex].text:"",$this.version=msBeautify.version.msDropdown,$this.author=msBeautify.author},getDataAndUIByOption=function(e){if(null!=e&&"undefined"!=typeof e){var t=getPostID("postChildID"),n=parseOption(e),i=$("#"+t+" li."+css_i.li+":eq("+e.index+")");return{data:n,ui:i,option:e,index:e.index}}return null},getDataAndUI=function(){var e,t,n,i,s=getPostID("postChildID"),r=getElement(element);if(-1==r.selectedIndex)e=null,t=null,n=null,i=-1;else if(t=$("#"+s+" li."+css.selected),t.length>1){for(var o=[],a=[],l=0;l<t.length;l++){var c=getIndex(t[l]);o.push(c),a.push(r.options[c])}e=o,n=a,i=o}else n=r.options[r.selectedIndex],e=parseOption(n),i=r.selectedIndex;return{data:e,ui:t,index:i,option:n}},updateTitleUI=function(e,t){var n=getPostID("postTitleID"),i={};if(-1==e)i.text="&nbsp;",i.className="",i.description="",i.image="";else if("undefined"!=typeof e){var s=getElement(element).options[e];i=parseOption(s)}else i=t;$("#"+n).find("."+css.label).html(i.text),getElement(n).className=css.ddTitleText+" "+i.className,""!=i.description?$("#"+n).find("."+css.description).html(i.description).show():$("#"+n).find("."+css.description).html("").hide();var r=$("#"+n).find("img");r.length>0&&$(r).remove(),""!=i.image&&settings.showIcon&&(r=createElement("img",{src:i.image}),$("#"+n).prepend(r),""!=i.imagecss&&(r.className=i.imagecss+" "),""==i.description&&(r.className=r.className+css_i.fnone))},updateProp=function(e,t){$this[e]=t},updateUI=function(e,t,n){var i=getPostID("postChildID"),s=!1;switch(e){case"add":var r,o=createChild(t||getElement(element).options[n]);if(r=3==arguments.length?n:$("#"+i+" li."+css_i.li).length-1,0>r||!r)$("#"+i+" ul").append(o);else{var a=$("#"+i+" li."+css_i.li)[r];$(a).before(o)}removeChildEvents(),applyChildEvents(),null!=settings.on.add&&settings.on.add.apply(this,arguments);break;case"remove":s=$($("#"+i+" li."+css_i.li)[n]).hasClass(css.selected),$("#"+i+" li."+css_i.li+":eq("+n+")").remove();var l=$("#"+i+" li."+css.enabled);if(1==s&&l.length>0){$(l[0]).addClass(css.selected);var c=$("#"+i+" li."+css_i.li).index(l[0]);setValue(c)}0==l.length&&setValue(-1),$("#"+i+" li."+css_i.li).length<settings.visibleRows&&!isList&&childHeight(-1),null!=settings.on.remove&&settings.on.remove.apply(this,arguments)}};this.act=function(){var e=arguments[0];switch(Array.prototype.shift.call(arguments),e){case"add":$this.add.apply(this,arguments);break;case"remove":$this.remove.apply(this,arguments);break;default:try{getElement(element)[e].apply(getElement(element),arguments)}catch(t){}}},this.add=function(){var e,t,n,i,s,r=arguments[0];"string"==typeof r?(e=r,t=e,opt=new Option(e,t)):(e=r.text||"",t=r.value||e,n=r.title||"",i=r.image||"",s=r.description||"",opt=new Option(e,t),$(opt).data("description",s),$(opt).data("image",i),$(opt).data("title",n)),arguments[0]=opt,getElement(element).add.apply(getElement(element),arguments),updateProp("children",getElement(element).children),updateProp("length",getElement(element).length),updateUI("add",opt,arguments[1])},this.remove=function(e){getElement(element).remove(e),updateProp("children",getElement(element).children),updateProp("length",getElement(element).length),updateUI("remove",void 0,e)},this.set=function(e,t){if("undefined"==typeof e||"undefined"==typeof t)return!1;e=e.toString();try{updateProp(e,t)}catch(n){}switch(e){case"size":getElement(element)[e]=t,0==t&&(getElement(element).multiple=!1),isList=getElement(element).size>1||1==getElement(element).multiple?!0:!1,fixedForList();break;case"multiple":getElement(element)[e]=t,isList=getElement(element).size>1||1==getElement(element).multiple?!0:!1,isMultiple=getElement(element).multiple,fixedForList(),updateProp(e,t);break;case"disabled":getElement(element)[e]=t,isDisabled=t,fixedForDisabled();break;case"selectedIndex":case"value":"selectedIndex"==e&&isArray(t)===!0?($("#"+element+" option").prop("selected",!1),selectMutipleOptions(t,!0),selectUI_LI(t)):(getElement(element)[e]=t,selectUI_LI(getElement(element).selectedIndex),setValue(getElement(element).selectedIndex));break;case"length":var i=getPostID("postChildID");t<getElement(element).length&&(getElement(element)[e]=t,0==t?($("#"+i+" li."+css_i.li).remove(),setValue(-1)):($("#"+i+" li."+css_i.li+":gt("+(t-1)+")").remove(),0==$("#"+i+" li."+css.selected).length&&$("#"+i+" li."+css.enabled+":eq(0)").addClass(css.selected)),updateProp(e,t),updateProp("children",getElement(element).children));break;case"id":break;default:try{getElement(element)[e]=t,updateProp(e,t)}catch(n){}}},this.get=function(e){return $this[e]||getElement(element)[e]},this.visible=function(e){var t=getPostID("postID");if(e===!0)$("#"+t).show();else{if(e!==!1)return"none"==$("#"+t).css("display")?!1:!0;$("#"+t).hide()}},this.debug=function(e){msBeautify.debug(e)},this.close=function(){close()},this.open=function(){open()},this.showRows=function(e){return"undefined"==typeof e||0==e?!1:(settings.visibleRows=e,void childHeight(childHeight()))},this.visibleRows=this.showRows,this.on=function(e,t){$("#"+element).on(e,t)},this.off=function(e,t){$("#"+element).off(e,t)},this.addMyEvent=this.on,this.getData=function(){return getDataAndUI()},this.namedItem=function(){var e=getElement(element).namedItem.apply(getElement(element),arguments);return getDataAndUIByOption(e)},this.item=function(){var e=getElement(element).item.apply(getElement(element),arguments);return getDataAndUIByOption(e)},this.setIndexByValue=function(e){this.set("value",e)},this.destroy=function(){var e=(getPostID("postElementHolder"),getPostID("postID"));$("#"+e+", #"+e+" *").off(),getElement(element).tabIndex=getElement(e).tabIndex,$("#"+e).remove(),$("#"+element).parent().replaceWith($("#"+element)),$("#"+element).data("dd",null)},this.refresh=function(){setValue(getElement(element).selectedIndex)},init()}msBeautify={version:{msDropdown:"3.5.2"},author:"Marghoob Suleman",counter:20,debug:function(e){$(".ddOutOfVision").css(e!==!1?{height:"auto",position:"relative"}:{height:"0px",position:"absolute"})},oldDiv:"",create:function(e,t,n){n=n||"dropdown";var i;switch(n.toLowerCase()){case"dropdown":case"select":i=$(e).msDropdown(t).data("dd")}return i}},$.msDropDown={},$.msDropdown={},$.extend(!0,$.msDropDown,msBeautify),$.extend(!0,$.msDropdown,msBeautify),void 0===$.fn.prop&&($.fn.prop=$.fn.attr),void 0===$.fn.on&&($.fn.on=$.fn.bind,$.fn.off=$.fn.unbind),$.expr[":"].Contains="function"==typeof $.expr.createPseudo?$.expr.createPseudo(function(e){return function(t){return $(t).text().toUpperCase().indexOf(e.toUpperCase())>=0}}):function(e,t,n){return $(e).text().toUpperCase().indexOf(n[3].toUpperCase())>=0},$.fn.extend({msDropDown:function(e){return this.each(function(){if(!$(this).data("dd")){var t=new dd(this,e);$(this).data("dd",t)}})}}),$.fn.msDropdown=$.fn.msDropDown}(jQuery),function(e){"use strict";var t,n=e.event.special.resizeend={setup:function(){e(this).bind("resize",n.handler)},teardown:function(){e(this).unbind("resize",n.handler)},handler:function(n){var i=this;t&&clearTimeout(t),t=setTimeout(function(){n.type="resizeend",e(i).trigger(n)},150)}};e.fn.resizeend=function(t){return e(this).bind("resizeend",t)}}(jQuery),function(e){"use strict";var t="selectric",n="Input Items Open Disabled TempShow HideSelect Wrapper Hover Responsive Above Scroll Group GroupLabel",i=".sl",s={onChange:function(t){e(t).change()},maxHeight:300,keySearchTimeout:500,arrowButtonMarkup:'<b class="button">&#x25be;</b>',disableOnMobile:!0,openOnHover:!1,hoverIntentTimeout:500,expandToItemText:!1,responsive:!1,preventWindowScroll:!0,inheritOriginalWidth:!1,allowWrap:!0,customClass:{prefix:t,postfixes:n,camelCase:!0,overwrite:!0},optionsItemBuilder:"{text}"},r={add:function(e,t,n){this[e]||(this[e]={}),this[e][t]=n},remove:function(e,t){delete this[e][t]}},o={replaceDiacritics:function(e){for(var t="40-46 50-53 54-57 62-70 71-74 61 47 77".replace(/\d+/g,"\\3$&").split(" "),n=t.length;n--;)e=e.toLowerCase().replace(RegExp("["+t[n]+"]","g"),"aeiouncy".charAt(n));return e},format:function(e){var t=arguments;return(""+e).replace(/{(\d+|(\w+))}/g,function(e,n,i){return i&&t[1]?t[1][i]:t[n]})},nextEnabledItem:function(e,t){for(;e[t=(t+1)%e.length].disabled;);return t},previousEnabledItem:function(e,t){for(;e[t=(t>0?t:e.length)-1].disabled;);return t},toDash:function(e){return e.replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase()},triggerCallback:function(n,i){var s=i.element,a=i.options["on"+n];e.isFunction(a)&&a.call(s,s,i),r[n]&&e.each(r[n],function(){this.call(s,s,i)}),e(s).trigger(t+"-"+o.toDash(n),i)}},a=e(document),l=e(window),c=function(r,c){function u(t){
if(P.options=e.extend(!0,{},s,P.options,t),P.classes={},P.element=r,o.triggerCallback("BeforeInit",P),P.options.disableOnMobile&&M)return void(P.disableOnMobile=!0);x(!0);var i=P.options.customClass,a=i.postfixes.split(" "),l=H.width();e.each(n.split(" "),function(e,t){var n=i.prefix+a[e];P.classes[t.toLowerCase()]=i.camelCase?n:o.toDash(n)}),w=e("<input/>",{"class":P.classes.input,readonly:M}),k=e("<div/>",{"class":P.classes.items,tabindex:-1}),C=e("<div/>",{"class":P.classes.scroll}),D=e("<div/>",{"class":i.prefix,html:P.options.arrowButtonMarkup}),T=e('<p class="label"/>'),E=H.wrap("<div>").parent().append(D.prepend(T),k,w),O={open:g,close:v,destroy:x,refresh:p,init:u},H.on(O).wrap('<div class="'+P.classes.hideselect+'">'),e.extend(P,O),P.options.inheritOriginalWidth&&l>0&&E.width(l),d()}function d(){P.items=[];var t=H.children(),n="<ul>",s=t.filter(":selected").index(),r=0;I=j=~s?s:0,(N=t.length)&&(t.each(function(){function t(){var t=e(this),i=t.html(),s=t.prop("disabled"),a=P.options.optionsItemBuilder;P.items[r]={element:t,value:t.val(),text:i,slug:o.replaceDiacritics(i),disabled:s},n+=o.format('<li data-index="{1}" class="{2}">{3}</li>',r,e.trim([r==I?"selected":"",r==N-1?"last":"",s?"disabled":""].join(" ")),e.isFunction(a)?a(P.items[r],t,r):o.format(a,P.items[r])),r++}var i=e(this);if(i.is("optgroup")){var s=i.prop("disabled"),a=i.children();n+=o.format('<ul class="{1}"><li class="{2}">{3}</li>',e.trim([P.classes.group,s?"disabled":"",i.prop("class")].join(" ")),P.classes.grouplabel,i.prop("label")),s&&a.prop("disabled",!0),a.each(t),n+="</ul>"}else t.call(i)}),k.append(C.html(n+"</ul>")),T.html(P.items[I].text)),D.add(H).add(E).add(w).off(i),E.prop("class",[P.classes.wrapper,P.options.customClass.overwrite?H.prop("class").replace(/\S+/g,P.options.customClass.prefix+"-$&"):H.prop("class"),P.options.responsive?P.classes.responsive:""].join(" ")),H.prop("disabled")?(E.addClass(P.classes.disabled),w.prop("disabled",!0)):(R=!0,E.removeClass(P.classes.disabled).on("mouseenter"+i+" mouseleave"+i,function(t){e(this).toggleClass(P.classes.hover),P.options.openOnHover&&(clearTimeout(P.closeTimer),"mouseleave"==t.type?P.closeTimer=setTimeout(v,P.options.hoverIntentTimeout):g())}),D.on("click"+i,function(e){L?v():g(e)}),w.prop({tabindex:F,disabled:!1}).on("keypress"+i,f).on("keydown"+i,function(e){f(e),clearTimeout(P.resetStr),P.resetStr=setTimeout(function(){w.val("")},P.options.keySearchTimeout);var t=e.keyCode||e.which;if(t>36&&41>t){if(!P.options.allowWrap&&(39>t&&0==j||t>38&&j+1==P.items.length))return;b(o[(39>t?"previous":"next")+"EnabledItem"](P.items,j))}}).on("focusin"+i,function(e){w.one("blur",function(){w.blur()}),L||g(e)}).on("oninput"in w[0]?"input":"keyup",function(){w.val().length&&e.each(P.items,function(e,t){return RegExp("^"+w.val(),"i").test(t.slug)&&!t.disabled?(b(e),!1):void 0})}),H.prop("tabindex",!1),S=e("li",k.removeAttr("style")).on({mousedown:function(e){e.preventDefault(),e.stopPropagation()},click:function(){return b(e(this).data("index"),!0),!1}}).filter("[data-index]")),o.triggerCallback("Init",P)}function p(){o.triggerCallback("Refresh",P),d()}function f(e){var t=e.keyCode||e.which;13==t&&e.preventDefault(),/^(9|13|27)$/.test(t)&&(e.stopPropagation(),b(j,!0))}function h(){var e=k.closest(":visible").children(":hidden"),t=P.options.maxHeight;e.addClass(P.classes.tempshow);var n=k.outerWidth(),i=D.outerWidth()-(n-k.width());!P.options.expandToItemText||i>n?A=i:(k.css("overflow","scroll"),E.width(9e4),A=k.width(),k.css("overflow",""),E.width("")),k.width(A).height()>t&&k.height(t),e.removeClass(P.classes.tempshow)}function g(n){o.triggerCallback("BeforeOpen",P),n&&(n.preventDefault(),n.stopPropagation()),R&&(h(),e("."+P.classes.hideselect,"."+P.classes.open).children()[t]("close"),L=!0,$=k.outerHeight(),_=k.height(),w.val("").is(":focus")||w.focus(),a.on("click"+i,v).on("scroll"+i,m),m(),P.options.preventWindowScroll&&a.on("mousewheel"+i+" DOMMouseScroll"+i,"."+P.classes.scroll,function(t){var n=t.originalEvent,i=e(this).scrollTop(),s=0;"detail"in n&&(s=-1*n.detail),"wheelDelta"in n&&(s=n.wheelDelta),"wheelDeltaY"in n&&(s=n.wheelDeltaY),"deltaY"in n&&(s=-1*n.deltaY),(i==this.scrollHeight-_&&0>s||0==i&&s>0)&&t.preventDefault()}),E.addClass(P.classes.open),y(j),o.triggerCallback("Open",P))}function m(){h(),E.toggleClass(P.classes.above,E.offset().top+E.outerHeight()+$>l.scrollTop()+l.height())}function v(){if(o.triggerCallback("BeforeClose",P),I!=j){o.triggerCallback("BeforeChange",P);var e=P.items[j].text;H.prop("selectedIndex",I=j).data("value",e),T.html(e),o.triggerCallback("Change",P)}a.off(i),E.removeClass(P.classes.open),L=!1,o.triggerCallback("Close",P)}function b(e,t){void 0!=e&&(P.items[e].disabled||(S.removeClass("selected").eq(j=e).addClass("selected"),y(e),t&&v()))}function y(e){var t=S.eq(e).outerHeight(),n=S[e].offsetTop,i=C.scrollTop(),s=n+2*t;C.scrollTop(s>i+$?s-$:i>n-t?n-t:i)}function x(e){R&&(k.add(D).add(w).remove(),!e&&H.removeData(t).removeData("value"),H.prop("tabindex",F).off(i).off(O).unwrap().unwrap(),R=!1)}var w,k,C,D,T,E,S,j,I,$,_,A,N,O,P=this,H=e(r),L=!1,R=!1,M=/android|ip(hone|od|ad)/i.test(navigator.userAgent),F=H.prop("tabindex");u(c)};e.fn[t]=function(n){return this.each(function(){var i=e.data(this,t);i&&!i.disableOnMobile?""+n===n&&i[n]?i[n]():i.init(n):e.data(this,t,new c(this,n))})},e.fn[t].hooks=r}(jQuery),!function(e){function t(){var e=document.createElement("smartbanner"),t={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd otransitionend",transition:"transitionend"};for(var n in t)if(void 0!==e.style[n])return{end:t[n]};return!1}var n=function(t){this.origHtmlMargin=parseFloat(e("html").css("margin-top")),this.options=e.extend({},e.smartbanner.defaults,t);var n=navigator.standalone,i=navigator.userAgent;if(this.options.force?this.type=this.options.force:null!=i.match(/Windows Phone 8/i)&&null!==i.match(/Touch/i)?this.type="windows":null!=i.match(/iPhone|iPod/i)||i.match(/iPad/)&&this.options.iOSUniversalApp?null!=i.match(/Safari/i)&&(null!=i.match(/CriOS/i)||window.Number(i.substr(i.indexOf("OS ")+3,3).replace("_","."))<6)&&(this.type="ios"):i.match(/\bSilk\/(.*\bMobile Safari\b)?/)||i.match(/\bKF\w/)||i.match("Kindle Fire")?this.type="kindle":null!=i.match(/Android/i)&&(this.type="android"),this.type&&!n&&!this.getCookie("sb-closed")&&!this.getCookie("sb-installed")){this.scale="auto"==this.options.scale?e(window).width()/window.screen.width:this.options.scale,this.scale<1&&(this.scale=1);var s=e("android"==this.type?'meta[name="google-play-app"]':"ios"==this.type?'meta[name="apple-itunes-app"]':"kindle"==this.type?'meta[name="kindle-fire-app"]':'meta[name="msApplication-ID"]');if(0!=s.length){if("windows"==this.type)this.appId=e('meta[name="msApplication-PackageFamilyName"]').attr("content");else{var r=/app-id=([^\s,]+)/.exec(s.attr("content"));if(!r)return;this.appId=r[1]}this.title=this.options.title?this.options.title:s.data("title")||e("title").text().replace(/\s*[|\-·].*$/,""),this.author=this.options.author?this.options.author:s.data("author")||(e('meta[name="author"]').length?e('meta[name="author"]').attr("content"):window.location.hostname),this.iconUrl=s.data("icon-url"),this.price=s.data("price"),this.create(),this.show(),this.listen()}}};n.prototype={constructor:n,create:function(){var t,n=this.options.url?this.options.url:("windows"==this.type?"ms-windows-store:navigate?appid=":"android"==this.type?"market://details?id=":"kindle"==this.type?"amzn://apps/android?asin=":"https://itunes.apple.com/"+this.options.appStoreLanguage+"/app/id")+this.appId,i=this.price||this.options.price,s=i?i+" - "+("android"==this.type?this.options.inGooglePlay:"kindle"==this.type?this.options.inAmazonAppStore:"ios"==this.type?this.options.inAppStore:this.options.inWindowsStore):"",r=null===this.options.iconGloss?"ios"==this.type:this.options.iconGloss;"android"==this.type&&this.options.GooglePlayParams&&(n=n+"&referrer="+this.options.GooglePlayParams);var o='<div id="smartbanner" class="'+this.type+'"><div class="sb-container"><a href="#" class="sb-close">&times;</a><span class="sb-icon"></span><div class="sb-info"><strong>'+this.title+"</strong><span>"+this.author+"</span><span>"+s+'</span></div><a href="'+n+'" class="sb-button"><span>'+this.options.button+"</span></a></div></div>";this.options.layer?e(this.options.appendToSelector).append(o):e(this.options.appendToSelector).prepend(o),this.options.icon?t=this.options.icon:this.iconUrl?t=this.iconUrl:e('link[rel="apple-touch-icon-precomposed"]').length>0?(t=e('link[rel="apple-touch-icon-precomposed"]').attr("href"),null===this.options.iconGloss&&(r=!1)):e('link[rel="apple-touch-icon"]').length>0?t=e('link[rel="apple-touch-icon"]').attr("href"):e('meta[name="msApplication-TileImage"]').length>0?t=e('meta[name="msApplication-TileImage"]').attr("content"):e('meta[name="msapplication-TileImage"]').length>0&&(t=e('meta[name="msapplication-TileImage"]').attr("content")),t?(e("#smartbanner .sb-icon").css("background-image","url("+t+")"),r&&e("#smartbanner .sb-icon").addClass("gloss")):e("#smartbanner").addClass("no-icon"),this.bannerHeight=e("#smartbanner").outerHeight()+2,this.scale>1&&(e("#smartbanner").css("top",parseFloat(e("#smartbanner").css("top"))*this.scale).css("height",parseFloat(e("#smartbanner").css("height"))*this.scale).hide(),e("#smartbanner .sb-container").css("-webkit-transform","scale("+this.scale+")").css("-msie-transform","scale("+this.scale+")").css("-moz-transform","scale("+this.scale+")").css("width",e(window).width()/this.scale)),e("#smartbanner").css("position",this.options.layer?"absolute":"static")},listen:function(){e("#smartbanner .sb-close").on("click",e.proxy(this.close,this)),e("#smartbanner .sb-button").on("click",e.proxy(this.install,this))},show:function(t){var n=e("#smartbanner");if(n.stop(),this.options.layer)n.animate({top:0,display:"block"},this.options.speedIn).addClass("shown").show(),e(this.pushSelector).animate({paddingTop:this.origHtmlMargin+this.bannerHeight*this.scale},this.options.speedIn,"swing",t);else if(e.support.transition){n.animate({top:0},this.options.speedIn).addClass("shown");var i=function(){e("html").removeClass("sb-animation"),t&&t()};e(this.pushSelector).addClass("sb-animation").one(e.support.transition.end,i).emulateTransitionEnd(this.options.speedIn).css("margin-top",this.origHtmlMargin+this.bannerHeight*this.scale)}else n.slideDown(this.options.speedIn).addClass("shown")},hide:function(t){var n=e("#smartbanner");if(n.stop(),this.options.layer)n.animate({top:-1*this.bannerHeight*this.scale,display:"block"},this.options.speedIn).removeClass("shown"),e(this.pushSelector).animate({paddingTop:this.origHtmlMargin},this.options.speedIn,"swing",t);else if(e.support.transition){"android"!==this.type?n.css("top",-1*this.bannerHeight*this.scale).removeClass("shown"):n.css({display:"none"}).removeClass("shown");var i=function(){e("html").removeClass("sb-animation"),t&&t()};e(this.pushSelector).addClass("sb-animation").one(e.support.transition.end,i).emulateTransitionEnd(this.options.speedOut).css("margin-top",this.origHtmlMargin)}else n.slideUp(this.options.speedOut).removeClass("shown")},close:function(e){e.preventDefault(),this.hide(),this.setCookie("sb-closed","true",this.options.daysHidden)},install:function(e){this.options.hideOnInstall&&this.hide(),this.setCookie("sb-installed","true",this.options.daysReminder)},setCookie:function(e,t,n){var i=new Date;i.setDate(i.getDate()+n),t=encodeURI(t)+(null==n?"":"; expires="+i.toUTCString()),document.cookie=e+"="+t+"; path=/;"},getCookie:function(e){var t,n,i,s=document.cookie.split(";");for(t=0;t<s.length;t++)if(n=s[t].substr(0,s[t].indexOf("=")),i=s[t].substr(s[t].indexOf("=")+1),n=n.replace(/^\s+|\s+$/g,""),n==e)return decodeURI(i);return null},switchType:function(){var t=this;this.hide(function(){t.type="android"==t.type?"ios":"android";var n=e("android"==t.type?'meta[name="google-play-app"]':'meta[name="apple-itunes-app"]').attr("content");t.appId=/app-id=([^\s,]+)/.exec(n)[1],e("#smartbanner").detach(),t.create(),t.show()})}},e.smartbanner=function(t){var i=e(window),s=i.data("smartbanner"),r="object"==typeof t&&t;s||i.data("smartbanner",s=new n(r)),"string"==typeof t&&s[t]()},e.smartbanner.defaults={title:null,author:null,price:"FREE",appStoreLanguage:"us",inAppStore:"On the App Store",inGooglePlay:"In Google Play",inAmazonAppStore:"In the Amazon Appstore",inWindowsStore:"In the Windows Store",GooglePlayParams:null,icon:null,iconGloss:null,button:"VIEW",url:null,scale:"auto",speedIn:300,speedOut:400,daysHidden:15,daysReminder:90,force:null,hideOnInstall:!0,layer:!1,iOSUniversalApp:!0,appendToSelector:"body",pushSelector:"html"},e.smartbanner.Constructor=n,void 0===e.support.transition&&(e.fn.emulateTransitionEnd=function(t){var n=!1,i=this;e(this).one(e.support.transition.end,function(){n=!0});var s=function(){n||e(i).trigger(e.support.transition.end)};return setTimeout(s,t),this},e(function(){e.support.transition=t()}))}(window.jQuery),function(e){function t(t,n,i,s){if(!n||!s||!s[3])return!1;var r=g(e(n),t);return r.length?r==s[3]:!1}function n(e){return h(e,"placeholder")}function i(e){return k(e.val())==g(e,"placeholder-value")?!0:!1}function s(e){if(n(e)&&i(e)&&!e.is("select")&&(e.val(""),e.removeClass(w("inactive")),h(e,"passwordplaceholder")))try{e[0].type="password"}catch(t){}}function r(e){if(n(e)&&""==k(e.val())&&!e.is("select")&&(e.val(g(e,"placeholder-value")),e.addClass(w("inactive")),h(e,"passwordplaceholder")))try{e[0].type="text"}catch(t){}}function o(e){return h(e,"corresponding")}function a(e){return h(e,"validationgroup")}function l(t,n){if(a(t)){var i=g(t,"validationgroup");i.length&&e(T).filter(":vv-validationgroup("+i+")").not(t).each(function(){e(this).trigger("isValid.vv",[n,!0])})}}function c(e,t,n){"function"==typeof n.fields.onValid&&n.fields.onValid.call(e[0],t,n.language)}function u(e,t,n){"function"==typeof n.fields.onInvalid&&n.fields.onInvalid.call(e[0],t,n.language)}function d(e,t){return void 0===e.attr(t)?!1:"false"===e.attr(t)||e.attr(t)===!1?!1:!0}function p(e,t){if(e.attr("type")==t)return!0;if(e.is('input[type="'+t+'"]'))return!0;var n=x(e);return-1!=n.indexOf('type="'+t+'"')||-1!=n.indexOf("type='"+t+"'")||-1!=n.indexOf("type="+t)?!0:!1}function f(t,n){var i=t.attr("class"),s=t.attr("alt");s&&s.length>0&&!t.hasClass("pattern")&&(t.hasClass("corresponding")&&(e.fn.validVal.deprecated('name in "alt"-attribute','class="corresponding:name"'),t.removeClass("corresponding"),t.removeAttr("alt"),n.supportHtml5?t.data("vv-corresponding",s):t.addClass("corresponding:"+s)),t.hasClass("required")&&(e.fn.validVal.deprecated('grouping required elements in the "alt"-attribute','class="requiredgroup:name"'),t.removeClass("required"),t.removeAttr("alt"),n.supportHtml5?t.data("vv-requiredgroup",s):t.addClass("requiredgroup:"+s))),i&&-1!=i.indexOf("required:")&&e.fn.validVal.deprecated('grouping required elements with class="required:name"','class="requiredgroup:name"');var r=[],o=b(t,n);if(n.supportHtml5){var a=g(t,"validations");a.length&&r.push(a),d(t,"placeholder")&&t.attr("placeholder").length>0&&(e.fn.validVal.support.placeholder&&-1!=e.inArray("placeholder",n.keepAttributes)||t.data("vv-placeholder-value",t.attr("placeholder")));var l=g(t,"placeholder-value");l.length&&(m(t,"placeholder",n),r.push("placeholder")),d(t,"pattern")&&t.attr("pattern").length>0&&(t.data("vv-pattern",t.attr("pattern")),m(t,"pattern",n),r.push("pattern"));for(var c=["corresponding","requiredgroup","validationgroup"],u=0,f=c.length;f>u;u++)g(t,c[u]).length&&r.push(c[u]);for(var h=["required","autofocus"],x=0,f=h.length;f>x;x++)d(t,h[x])&&(r.push(h[x]),m(t,h[x],n));for(var w=["number","email","url"],k=0,f=w.length;f>k;k++)p(t,w[k])&&r.push(w[k])}var i=t.attr("class");if(i&&i.length){t.hasClass("placeholder")&&(v(t,"placeholder",n),t.data("vv-placeholder-value",o),r.push("placeholder"),o="");var C="corresponding:",D=i.indexOf(C);if(-1!=D){var T=i.substr(D).split(" ")[0],E=T.substr(C.length);E.length&&(t.removeClass(T),t.data("vv-corresponding",E),r.push("corresponding"))}t.hasClass("pattern")&&(v(t,"pattern",n),t.data("vv-pattern",y(t,"alt")),m(t,"alt",n),r.push("pattern"));for(var S=["requiredgroup","validationgroup"],j=0,f=S.length;f>j;j++){var I=S[j]+":",D=i.indexOf(I);if(-1!=D){var $=i.substr(D).split(" ")[0],_=$.substr(I.length);_.length&&(t.removeClass($),t.data("vv-"+S[j],_),r.push(S[j]))}}}if(t.is('[type="password"]')){var u=" "+r.join(" ")+" ";-1!=u.indexOf(" placeholder ")&&r.push("passwordplaceholder")}var i=t.attr("class");i&&i.length&&r.push(i),t.data("vv-validations",r.join(" ")),t.data("vv-original-value",o)}function h(e,t){var n=" "+g(e,"validations")+" ";return-1!=n.indexOf(" "+t+" ")}function g(e,t){var n=e.data("vv-"+t);return void 0===n&&(n=""),n}function m(t,n,i){-1==e.inArray(n,i.keepAttributes)&&t.removeAttr(n)}function v(t,n,i){-1==e.inArray(n,i.keepClasses)&&t.removeClass(n)}function b(t,n){var i=x(t);if(t.is("select")){var s=0,r=g(t,"placeholder-number");return r.length?s=r:"number"==typeof n.selectPlaceholder?s=n.selectPlaceholder:t.find("> option").each(function(t){i=x(e(this));var n=i.split("'").join('"').split('"').join("");n=n.substr(0,n.indexOf(">")),n.indexOf("selected=selected")>-1&&(s=t)}),t.data("vv-placeholder-number",s),y(t.find("> option:nth("+s+")"))}return t.is("textarea")?(i=i.substr(i.indexOf(">")+1),i=i.substr(0,i.indexOf("</textarea"))):y(t)}function y(e,t){void 0===t&&(t="value");var n=x(e),i=n.toLowerCase();if(i.indexOf(t+"=")>-1){n=n.substr(i.indexOf(t+"=")+(t.length+1));var s=n.substr(0,1);return'"'==s||"'"==s?(n=n.substr(1),n=n.substr(0,n.indexOf(s))):n=n.substr(0,n.indexOf(" ")),n}return""}function x(t){return e("<div></div>").append(t.clone()).html()}function w(e){return"undefined"!=typeof clss&&void 0!==clss[e]?clss[e]:e}function k(e){if(null===e)return"";if("object"==typeof e){var t=[];for(var n in e)t[n]=k(e[n]);return t}return"string"!=typeof e?"":0==e.length?"":e.replace(/^\s\s*/,"").replace(/\s\s*$/,"")}function C(e){if(null===e)return"";if("object"==typeof e){for(var t in e)e[t]=C(e[t]);return e}if("string"!=typeof e)return"";if(0==e.length)return"";e=k(e);for(var n=[" ","-","+","(",")","/","\\"],i=0,s=n.length;s>i;i++)e=e.split(n[i]).join("");return e}function D(e){switch(e){case 9:case 13:case 16:case 17:case 18:case 37:case 38:case 39:case 40:case 224:return!0;default:return!1}}if(!e.fn.validVal){var T='textarea, select, input:not( [type="button"], [type="submit"], [type="reset"] )';e.fn.validVal=e.fn.validval=function(t,a,d){if(this.length>1)return this.each(function(){e(this).validVal(t,a,d)});"boolean"==typeof t?(d=t,t=null):"boolean"==typeof a&&(d=a,a=null);var p=this,m=e.extend(!0,{},e.fn.validVal.defaults,t);return e.extend(!0,{},e.fn.validVal.classes,a),"function"==typeof m.invalidFormFunc&&(e.fn.validVal.deprecated('callback function "invalidFormFunc"','"form.onInvalid"'),m.form.onInvalid=m.invalidFormFunc),"function"==typeof m.onSubmit&&(e.fn.validVal.deprecated('callback function "onSubmit"','"form.onValid"'),m.form.onValid=m.onSubmit),"function"==typeof m.onReset&&(e.fn.validVal.deprecated('callback function "onReset"','"form.onReset"'),m.form.onReset=m.onReset),"function"==typeof m.validFieldFunc&&(e.fn.validVal.deprecated('callback function "validFieldFunc"','"fields.onValid"'),m.fields.onValid=m.validFieldFunc),"function"==typeof m.invalidFieldFunc&&(e.fn.validVal.deprecated('callback function "invalidFieldFunc"','"fields.onInvalid"'),m.fields.onInvalid=m.invalidFieldFunc),"boolean"==typeof m.validate.hiddenFields&&(e.fn.validVal.deprecated('option "validate.hiddenFields"','"validate.fields.hidden"'),m.validate.fields.hidden=m.validate.hiddenFields),"boolean"==typeof m.validate.disabledFields&&(e.fn.validVal.deprecated('option "validate.disabledFields"','"validate.fields.disabled"'),m.validate.fields.disabled=m.validate.disabledFields),g(p,"isValidVal")&&p.trigger("destroy.vv"),p.data("vv-isValidVal",!0),m.validations={},e.fn.validVal.customValidations&&(m.validations=e.extend(m.validations,e.fn.validVal.customValidations)),m.customValidations&&(m.validations=e.extend(m.validations,m.customValidations)),m.validations=e.extend(m.validations,e.fn.validVal.defaultValidations),p.bind("addField.vv",function(t,a){t.stopPropagation();var v=e(a);if(g(v,"isValidVal")&&v.trigger("destroy.vv"),v.data("vv-isValidVal",!0),f(v,m),v.bind("focus.vv",function(){s(v),v.addClass(w("focus"))}),v.bind("blur.vv",function(){v.removeClass(w("focus")),v.trigger("validate.vv",[m.validate.onBlur])}),v.bind("keyup.vv",function(e){D(e.keyCode)||v.trigger("validate.vv",[m.validate.onKeyup,!1])}),v.bind("validate.vv",function(t,n,i){if(t.stopPropagation(),n!==!1&&("boolean"!=typeof i&&(i=!0),v.data("vv-isValid","valid"),!(v.is(":hidden")&&!m.validate.fields.hidden||v.is(":disabled")&&!m.validate.fields.disabled))){i&&s(v),"function"==typeof m.fields.onValidate&&m.fields.onValidate.call(v[0],p,m.language);var o=!1,a=k(v.val());for(var c in m.validations){var u=m.validations[c];if(h(v,c)&&"function"==typeof u&&!u.call(v[0],a)){o=c;break}}var f=o?!1:!0,g=f?"invalid"!==n:"valid"!==n;return v.trigger("isValid.vv",[f,g,o]),l(v,f),i&&r(v),d&&o&&e.fn.validVal.debug("invalid validation: "+o),f}}),v.bind("isValid.vv",function(e,t,n){return e.stopPropagation(),"boolean"!=typeof t?"valid"==g(v,"isValid"):void(t?(v.data("vv-isValid","valid"),n&&c(v,p,m)):(v.data("vv-isValid","NOT"),n&&u(v,p,m)))}),v.bind("validations.vv",function(e,t){return e.stopPropagation(),void 0===t?g(v,"validations").split(" "):(t instanceof Array&&(t=t.join(" ")),void("string"==typeof t&&v.data("vv-validations",t)))}),v.bind("addValidation.vv",function(e,t){e.stopPropagation();var n=g(v,"validations").split(" ");n.push(t),v.data("vv-validations",n.join(" "))}),v.bind("removeValidation.vv",function(e,t){e.stopPropagation();var n=" "+g(v,"validations")+" ";n=n.split(" "+t+" "),v.data("vv-validations",n.join(" "))}),v.bind("destroy.vv",function(e){e.stopPropagation(),v.unbind(".vv"),v.data("vv-isValidVal",!1)}),n(v)){if(""==v.val()&&v.val(g(v,"placeholder-value")),h(v,"passwordplaceholder")&&i(v))try{v[0].type="text"}catch(b){}i(v)&&v.addClass(w("inactive")),v.is("select")&&(v.find("option:eq("+g(v,"placeholder-number")+")").addClass(w("inactive")),v.bind("change.vv",function(){i(v)?v.addClass(w("inactive")):v.removeClass(w("inactive"))}))}if(o(v)&&e(T).filter('[name="'+v.data("vv-corresponding")+'"]').bind("blur.vv",function(){v.trigger("validate.vv",[m.validate.onBlur])}).bind("keyup.vv",function(e){D(e.keyCode)||v.trigger("validate.vv",[m.validate.onKeyup,!1])}),h(v,"autotab")){var y=v.attr("maxlength"),x=v.attr("tabindex"),C=e(T).filter('[tabindex="'+(parseInt(x)+1)+'"]');v.is("select")?x&&v.bind("change.vv",function(){C.length&&C.focus()}):y&&x&&v.bind("keyup.vv",function(e){v.val().length==y&&(D(e.keyCode)||(v.trigger("blur"),C.length&&C.focus()))})}h(v,"autofocus")&&!v.is(":disabled")&&v.focus()}),m.validate.fields.filter(e(T,p)).each(function(){p.trigger("addField.vv",[e(this)])}).filter('select, input[type="checkbox"], input[type="radio"]').bind("change.vv",function(){e(this).trigger("blur.vv")}),p.bind("destroy.vv",function(t){t.stopPropagation(),p.unbind(".vv"),m.validate.fields.filter(e(T,p)).trigger("destroy.vv"),p.data("vv-isValidVal",!1)}),p.bind("validate.vv",function(t,n,i){t.stopPropagation(),void 0===n?(n=p,i=!0):"boolean"!=typeof i&&(i=!1),"function"==typeof m.form.onValidate&&m.form.onValidate.call(p[0],m.language);var s=e(),r={};return m.validate.fields.filter(e(T,n)).each(function(){var t=e(this);if(g(t,"isValidVal")){t.trigger("validate.vv",[m.validate.onSubmit]);var n=t.val();"valid"==g(t,"isValid")?((t.is('[type="radio"]')||t.is('[type="checkbox"]'))&&(t.is(":checked")||(n="")),(void 0===n||null==n)&&(n=""),n.length>0&&(r[t.attr("name")]=n)):m.validate.onSubmit!==!1&&(s=s.add(t))}}),s.length>0?("function"==typeof m.form.onInvalid&&i&&m.form.onInvalid.call(p[0],s,m.language),!1):("function"==typeof m.form.onValid&&i&&m.form.onValid.call(p[0],m.language),r)}),p.bind("submitForm.vv",function(t){t.stopPropagation();var n=p.triggerHandler("validate.vv");return n&&m.validate.fields.filter(e(T,p)).each(function(){s(e(this))}),n}),p.bind("resetForm.vv",function(t){return t.stopPropagation(),"function"==typeof m.form.onReset&&m.form.onReset.call(p[0],m.language),m.validate.fields.filter(e(T,p)).each(function(){var t=e(this);n(t)?(t.addClass(w("inactive")),t.val(g(t,"placeholder-value"))):t.val(g(t,"original-value")),t.trigger("isValid.vv",[!0,!0])}),!1}),p.bind("options.vv",function(t,n){return t.stopPropagation(),"object"==typeof n&&(m=e.extend(m,n)),m}),p.is("form")&&(p.attr("novalidate","novalidate"),p.bind("submit.vv",function(){return p.triggerHandler("submitForm.vv")}),p.bind("reset.vv",function(){return p.triggerHandler("resetForm.vv")})),p},e.fn.validVal.version=[4,4,0],e.fn.validVal.defaults={selectPlaceholder:0,supportHtml5:!0,language:"en",customValidations:{},validate:{onBlur:!0,onSubmit:!0,onKeyup:!1,fields:{hidden:!1,disabled:!1,filter:function(e){return e}}},fields:{onValidate:null,onValid:function(){var t=e(this);t.add(t.parent()).removeClass(w("invalid"))},onInvalid:function(){var t=e(this);t.add(t.parent()).addClass(w("invalid"))}},form:{onReset:null,onValidate:null,onValid:null,onInvalid:function(e,t){switch(t){case"nl":msg="Let op, niet alle velden zijn correct ingevuld.";break;case"de":msg="Achtung, nicht alle Felder sind korrekt ausgefuellt.";break;case"es":msg="Atención, no se han completado todos los campos correctamente.";break;case"en":default:msg="Attention, not all fields have been filled out correctly."}alert(msg),e.first().focus()}},keepClasses:["required"],keepAttributes:["pattern"]},e.fn.validVal.defaultValidations={required:function(t){var s=e(this);if(s.is('[type="radio"]')||s.is('[type="checkbox"]')){if(s.is('[type="radio"]')){var r=s.attr("name");r&&r.length>0&&(s=e('input[name="'+r+'"]'))}if(!s.is(":checked"))return!1}else if(s.is("select")){if(n(s)){if(i(s))return!1}else if(0==t.length)return!1}else if(0==t.length)return!1;return!0},Required:function(t){return e.fn.validVal.defaultValidations.required.call(this,t)},requiredgroup:function(){var t=e(this),n=g(t,"requiredgroup");n.length&&(t=e(T).filter(":vv-requiredgroup("+n+")"));var i=!1;return t.each(function(){var t=this;e.fn.validVal.defaultValidations.required.call(t,k(e(t).val()))&&(i=!0)}),i},corresponding:function(t){var n=e(T).filter('[name="'+g(e(this),"corresponding")+'"]');s(n);var i=k(n.val());return r(n),t==i},number:function(e){return e=C(e),0==e.length?!0:isNaN(e)?!1:!0},email:function(e){if(0==e.length)return!0;var t=/^([a-zA-Z0-9_\.\-+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;return t.test(e)},url:function(e){return 0==e.length?!0:(e.match(/^www\./)&&(e="http://"+e),e.match(/^(http\:\/\/|https\:\/\/)(.{4,})$/))},pattern:function(t){if(0==t.length)return!0;var n=e(this),i=g(n,"pattern");return"/"==i.substr(0,1)&&(i=i.substr(1)),"/"==i.substr(i.length-1)&&(i=i.substr(0,i.length-1)),RegExp(i).test(t)}},e.fn.validVal.classes={focus:"focus",invalid:"invalid",inactive:"inactive"},e.fn.validVal.debug=function(e){"undefined"!=typeof console&&void 0!==console.log&&console.log("validVal: "+e)},e.fn.validVal.deprecated=function(e,t){"undefined"!=typeof console&&void 0!==console.error&&console.error(e+" is DEPRECATED, use "+t+" instead.")},e.fn.validVal.support={touch:function(){return"ontouchstart"in document.documentElement}(),placeholder:function(){return"placeholder"in document.createElement("input")}()},e.expr[":"]["vv-requiredgroup"]=function(e,n,i){return t("requiredgroup",e,n,i)},e.expr[":"]["vv-validationgroup"]=function(e,n,i){return t("validationgroup",e,n,i)}}}(jQuery),window.Modernizr=function(e,t,n){function i(e){y.cssText=e}function s(e,t){return i(w.join(e+";")+(t||""))}function r(e,t){return typeof e===t}function o(e,t){return!!~(""+e).indexOf(t)}function a(e,t){for(var i in e){var s=e[i];if(!o(s,"-")&&y[s]!==n)return"pfx"==t?s:!0}return!1}function l(e,t,i){for(var s in e){var o=t[e[s]];if(o!==n)return i===!1?e[s]:r(o,"function")?o.bind(i||t):o}return!1}function c(e,t,n){var i=e.charAt(0).toUpperCase()+e.slice(1),s=(e+" "+C.join(i+" ")+i).split(" ");return r(t,"string")||r(t,"undefined")?a(s,t):(s=(e+" "+D.join(i+" ")+i).split(" "),l(s,t,n))}var u,d,p,f="2.8.3",h={},g=!0,m=t.documentElement,v="modernizr",b=t.createElement(v),y=b.style,x=":)",w=({}.toString," -webkit- -moz- -o- -ms- ".split(" ")),k="Webkit Moz O ms",C=k.split(" "),D=k.toLowerCase().split(" "),T={},E=[],S=E.slice,j=function(e,n,i,s){var r,o,a,l,c=t.createElement("div"),u=t.body,d=u||t.createElement("body");if(parseInt(i,10))for(;i--;)a=t.createElement("div"),a.id=s?s[i]:v+(i+1),c.appendChild(a);return r=["&#173;",'<style id="s',v,'">',e,"</style>"].join(""),c.id=v,(u?c:d).innerHTML+=r,d.appendChild(c),u||(d.style.background="",d.style.overflow="hidden",l=m.style.overflow,m.style.overflow="hidden",m.appendChild(d)),o=n(c,e),u?c.parentNode.removeChild(c):(d.parentNode.removeChild(d),m.style.overflow=l),!!o},I=function(){function e(e,s){s=s||t.createElement(i[e]||"div"),e="on"+e;var o=e in s;return o||(s.setAttribute||(s=t.createElement("div")),s.setAttribute&&s.removeAttribute&&(s.setAttribute(e,""),o=r(s[e],"function"),r(s[e],"undefined")||(s[e]=n),s.removeAttribute(e))),s=null,o}var i={select:"input",change:"input",submit:"form",reset:"form",error:"img",load:"img",abort:"img"};return e}(),$={}.hasOwnProperty;p=r($,"undefined")||r($.call,"undefined")?function(e,t){return t in e&&r(e.constructor.prototype[t],"undefined")}:function(e,t){return $.call(e,t)},Function.prototype.bind||(Function.prototype.bind=function(e){var t=this;if("function"!=typeof t)throw new TypeError;var n=S.call(arguments,1),i=function(){if(this instanceof i){var s=function(){};s.prototype=t.prototype;var r=new s,o=t.apply(r,n.concat(S.call(arguments)));return Object(o)===o?o:r}return t.apply(e,n.concat(S.call(arguments)))};return i}),T.touch=function(){var n;return"ontouchstart"in e||e.DocumentTouch&&t instanceof DocumentTouch?n=!0:j(["@media (",w.join("touch-enabled),("),v,")","{#modernizr{top:9px;position:absolute}}"].join(""),function(e){n=9===e.offsetTop}),n},T.rgba=function(){return i("background-color:rgba(150,255,150,.5)"),o(y.backgroundColor,"rgba")},T.backgroundsize=function(){return c("backgroundSize")},T.borderradius=function(){return c("borderRadius")},T.boxshadow=function(){return c("boxShadow")},T.textshadow=function(){return""===t.createElement("div").style.textShadow},T.opacity=function(){return s("opacity:.55"),/^0.55$/.test(y.opacity)},T.cssanimations=function(){return c("animationName")},T.csscolumns=function(){return c("columnCount")},T.cssgradients=function(){var e="background-image:",t="gradient(linear,left top,right bottom,from(#9f9),to(white));",n="linear-gradient(left top,#9f9, white);";return i((e+"-webkit- ".split(" ").join(t+e)+w.join(n+e)).slice(0,-e.length)),o(y.backgroundImage,"gradient")},T.cssreflections=function(){return c("boxReflect")},T.csstransforms=function(){return!!c("transform")},T.csstransforms3d=function(){var e=!!c("perspective");return e&&"webkitPerspective"in m.style&&j("@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:3px;}}",function(t,n){e=9===t.offsetLeft&&3===t.offsetHeight}),e},T.csstransitions=function(){return c("transition")},T.fontface=function(){var e;return j('@font-face {font-family:"font";src:url("https://")}',function(n,i){var s=t.getElementById("smodernizr"),r=s.sheet||s.styleSheet,o=r?r.cssRules&&r.cssRules[0]?r.cssRules[0].cssText:r.cssText||"":"";e=/src/i.test(o)&&0===o.indexOf(i.split(" ")[0])}),e},T.generatedcontent=function(){var e;return j(["#",v,"{font:0/0 a}#",v,':after{content:"',x,'";visibility:hidden;font:3px/1 a}'].join(""),function(t){e=t.offsetHeight>=3}),e};for(var _ in T)p(T,_)&&(d=_.toLowerCase(),h[d]=T[_](),E.push((h[d]?"":"no-")+d));return h.addTest=function(e,t){
if("object"==typeof e)for(var i in e)p(e,i)&&h.addTest(i,e[i]);else{if(e=e.toLowerCase(),h[e]!==n)return h;t="function"==typeof t?t():t,"undefined"!=typeof g&&g&&(m.className+=" "+(t?"":"no-")+e),h[e]=t}return h},i(""),b=u=null,h._version=f,h._prefixes=w,h._domPrefixes=D,h._cssomPrefixes=C,h.hasEvent=I,h.testProp=function(e){return a([e])},h.testAllProps=c,h.testStyles=j,h.prefixed=function(e,t,n){return t?c(e,t,n):c(e,"pfx")},m.className=m.className.replace(/(^|\s)no-js(\s|$)/,"$1$2")+(g?" js "+E.join(" "):""),h}(this,this.document),PointerEventsPolyfill.initialize=function(e){return null==PointerEventsPolyfill.singleton&&(PointerEventsPolyfill.singleton=new PointerEventsPolyfill(e)),PointerEventsPolyfill.singleton},PointerEventsPolyfill.prototype.register_mouse_events=function(){$(document).on(this.options.mouseEvents.join(" "),this.options.selector,function(e){if("none"==$(this).css("pointer-events")){var t=$(this).css("display");$(this).css("display","none");var n=document.elementFromPoint(e.clientX,e.clientY);return t?$(this).css("display",t):$(this).css("display",""),e.target=n,$(n).trigger(e),!1}return!0})},function(e){"use strict";Drupal.behaviors.checkbox={attach:function(){var t=function(){e(this).addClass("visited")};e("span.checkbox").focus(t),e("span.checkbox").click(t)}}}(jQuery),function(e){"use strict";Drupal.behaviors.radio={attach:function(){var t=function(){e(this).addClass("visited")};e("span.radio").focus(t),e("span.radio").click(t)}}}(jQuery),function(e){"use strict";Drupal.behaviors.select={attach:function(){e("select").msDropDown(),e(".ddOutOfVision > select").each(function(){e(this).parent().next().addClass(this.className)});var t=e(".ddOutOfVision select").detach(),n=e(".dd");t.each(function(t){this.style.display="none",e(n[t].firstChild).before(this)});var i=e(".dd + .errorText");i.each(function(){var t=e(this).prev();t.find("select").after(this)})}}}(jQuery),function(e){"use strict";Drupal.behaviors["text-input"]={attach:function(){var t=function(){e(this).is(".dd")?e(this).find("select").addClass("visited"):e(this).addClass("visited")};e("input, textarea").focus(t),e("input, select, textarea, div.dd, span.checkbox").click(t)}}}(jQuery),function(e){"use strict";Drupal.behaviors.aegonFaq={attach:function(){e(".faq .title").on("click",function(t){t.stopPropagation();var n=e("input[name=show]",this.parentNode)[0];return n.checked?(n.checked=!1,!1):void 0})}}}(jQuery),function(e,t){"use strict";e.behaviors.aegonMenu={menuDesktop:function(e){return e.find(".nav-backdrop").add("a.close").on("click",function(){t("body").removeClass("pushmenu-to-right"),e.removeClass("open"),e.find(".level-2-item").removeClass("item-open")}),e.find("#showLeftPush").click(function(){t("body").toggleClass("pushmenu-to-right"),e.hasClass("open")&&!t("body").hasClass("pushmenu-to-right")?e.removeClass("open"):e.addClass("open"),e.find(".level-2-item").removeClass("item-open")}),e.find(".level-2-item").on("click",function(n){var i=t(n.target).is("ul")||t(n.target).is("li");t(n.target).hasClass("close")||i||(t("body").removeClass("pushmenu-to-right"),t(this).hasClass("item-open")?e.removeClass("open"):e.addClass("open"),e.find(".level-2-item").not(this).removeClass("item-open"),t(this).toggleClass("item-open"))}),this},menuMobile:function(e){t("#openmenu").on("click",function(){t("body").toggleClass("pushmenu-to-right"),e.hasClass("open")&&!t("body").hasClass("pushmenu-to-right")?e.removeClass("open"):e.addClass("open")}),t("#scroll").on("mousedown touchmove",function(e){"openmenu"!==e.target.id&&t("body").hasClass("pushmenu-to-right")&&t("body").removeClass("pushmenu-to-right")}),e.find(".mm-back").on("click",function(){return t(this).hasClass("menu")?void e.find("nav").addClass("slide-to-left").removeClass("slide-to-right"):void e.find("nav").removeClass("slide-to-left slide-to-right")}),e.find('.mobile-level2 a[class*="menu-"]').on("click",function(t){var n,i;n=t.target.className.split(" ")[0],i=e.find(".mobile-level3."+n),i.length>0&&(e.find("nav").addClass("slide-to-right"),i.addClass("show").siblings(".mobile-level3").removeClass("show"),t.preventDefault())});var n=e.find(".mobile-level2").length;return 1>n&&e.find("nav").addClass("slide-to-left"),this},attach:function(){var e=t("aside.desktop"),n=t("aside.mobile");this.menuDesktop(e).menuMobile(n)}}}(this.Drupal,this.jQuery),function(e){"use strict";Drupal.behaviors.smartBanner={attach:function(){e.smartbanner({daysHidden:15,daysReminder:90,appStoreLanguage:"nl",title:"Mijn Aegon",author:"AEGON Nederland N.V.",button:"Bekijk",store:{ios:"On the App Store",android:"In Google Play"},price:"Gratis"})}}}(jQuery),function(e){"use strict";e("html").removeClass("no-js")}(jQuery),function(e,t,n,i){"use strict";t.behaviors.slidingCookiePopup={getEuCookieDomain:function(){return t.settings.eu_cookie_compliance.domain},attach:function(){if("10.120.32.22"!==i.domain){"localhost"===i.domain&&(t.settings.eu_cookie_compliance.domain="localhost");var n=this.getCookie("AEGON.CookieOptIn.setting"),s=e("body.logged-in").length<1&&e("body.imce").length<1&&"nocookie"===n;t.admin||s&&this.createPopup(t.settings.eu_cookie_compliance.popup_html_info)}},createPopup:function(n){var i,s=e(n).attr({id:"sliding-popup"}).height(t.settings.eu_cookie_compliance.popup_height).width(t.settings.eu_cookie_compliance.popup_width).hide();s.prependTo("body"),i=s.height(),s.show().attr({"class":"sliding-popup-top"}).css({top:-1*i}).animate({top:0},t.settings.eu_cookie_compliance.popup_delay),this.attachEvents()},getCookie:function(e){var t,n,i=e+"=";if(document.cookie.length>0)if(n=document.cookie.indexOf(i),-1!==n){n+=i.length;var s=document.cookie.indexOf(";",n);-1===s&&(s=document.cookie.length),t=decodeURIComponent(document.cookie.substring(n,s).replace(/\+/g,"%20"))}else t="nocookie";return t},getCurrentStatus:function(){var e="cookie-agreed";return this.getCookie(e)},setStatus:function(e){var n=new Date;n.setDate(n.getDate()+100);var i="cookie-agreed="+e+";expires="+n.toUTCString()+";path="+t.settings.basePath;this.getEuCookieDomain()&&"localhost"!==this.getEuCookieDomain()&&(i+=";domain="+t.settings.eu_cookie_compliance.domain),document.cookie=i},changeStatus:function(n){var i=this,s=i.getCurrentStatus();if(s!==n){var r=e("#sliding-popup");r.animate({top:-1*r.height()},t.settings.eu_cookie_compliance.popup_delay,function(){0===s&&(r.html(t.settings.eu_cookie_compliance.popup_html_agreed).animate({top:0},t.settings.eu_cookie_compliance.popup_delay),i.attachEvents()),1===s&&r.remove()}),i.setStatus(n)}},attachEvents:function(){var s=this,r=this.getCookie("AEGON.CookieOptIn.setting"),o=this.getCurrentStatus();s.socialShowHide(r);var a=function(){e("#no-thankx").add("a").not(".find-more-button").not(".level-2-item a, .home-tap a").add(".level-2-item .level3 a").add(".level-2-item a:first-child").add(".custom-menu-dropdown a").off("click")},l=function(e){var n,r;r=new Date,r.setTime(r.getTime()+864e7),r.setDate(r.getDate()+100),n="AEGON.CookieOptIn.setting = "+e+";",n+="expires="+r.toUTCString()+"; path=/",s.getEuCookieDomain()&&"localhost"!==s.getEuCookieDomain()&&(n+=";domain="+t.settings.eu_cookie_compliance.domain),i.cookie=n},c=function(t,i,r){var o,c,u,d,p,f,h;return a(),r=r||!1,d=e("#popup-wrapper"),f=i||e("input[name=optIn]:radio:checked").val(),"external"===f?(c="extern|instellingen",o="extern cookie opslaan",u="E",h=2):"visit"===f?(c="statistiek|bezoek",o="statistiek cookie opslaan",u="S",h="nocookie"):(c="statistiek|instellingen",o="statistiek cookie opslaan",u="S",h=1),"nocookie"!==h&&l(f),s.setStatus(h),"E"===u&&s.socialShowHide("external"),"visit"!==f&&(p=e.ajax({type:"GET",dataType:"text",global:!1,url:"/lpa/CookieVoorkeur",data:"ans="+u,success:function(){d.hasClass("ui-dialog-content")&&d.dialog("close")}})),"object"==typeof n.utag?void n.utag.view({page_cat_1_type:"cookie",page_cat_2_name:o,page_cat_3_section:"cookie",page_cat_6_businessline:"algemeen",cookie_type:c,event:"cookie_accepted"},function(){r&&p.always(function(){n.location.href=r})}):void(r&&"visit"!==f&&p.always(function(){n.location.href=r}))},u=function(e){var t=e.target.href||null;s.changeStatus(2),c(null,"external",t),"no-thankx"===e.target.id?"object"==typeof n.utag&&n.utag.view({page_cat_1_type:"cookie",page_cat_2_name:"cookiemelding sluiten",page_cat_3_section:"cookie",page_cat_4_productgroup:"",page_cat_5_product:"",page_cat_6_businessline:"algemeen",cookie_type:"statistiek|melding",event:"cookie_accepted"}):e.preventDefault()},d=function(){e(this).off("click"),e(this).removeClass("find-more-button"),e.ajax({type:"GET",dataType:"text",global:!1,url:"/lpa/getconfirm",success:function(t){"object"==typeof n.utag&&n.utag.view({page_cat_1_type:"cookie",page_cat_2_name:"cookie instellingen",page_cat_3_section:"cookie",page_cat_6_businessline:"algemeen"});var i=e("#popup-wrapper");i.removeAttr("style").append(t),i.dialog({closeOnEscape:!1,open:function(){e(".ui-dialog-titlebar-close").hide()},width:"auto",maxWidth:600,height:"auto",modal:!0,fluid:!0,resizable:!1}),e(".ui-dialog-titlebar").hide(),p.remove()},error:function(){e(this).addClass("find-more-button").on("click")}})},p=e("#sliding-popup");if(p.is(".sliding-popup-top")){var f=e("aside.stickleft"),h=e("#cbp-spmenu-s1"),g=e("#scroll .inpage-navigation"),m=g.length>0&&Number(g.css("top").replace("px",""));e("#sliding-popup > div").addClass("wrapper"),e(n).on("resize scroll",function(){var e=p.height(),t=-1!==n.navigator.userAgent.indexOf("MSIE")?i.documentElement.scrollTop:n.scrollY;f.css({top:t>=e?0:e-t}),h.css({top:t>=e?0:e-t}),g.length>0&&g.css({top:t>=e?m:m+(e-t)})}).resize(),e("body").on("click","#no-thankx, #cookie-opt-in-save",function(){p.css({position:"absolute"}),f.removeAttr("style"),h.removeAttr("style"),g.removeAttr("style"),e("body").off("click","#no-thankx, #cookie-opt-in-save"),e(n).off("resize scroll")})}e("body.logged-in").length<1&&e("body.imce").length<1&&"nocookie"===r&&("external"===r?s.changeStatus(2):"analytics"===r?s.changeStatus(1):"nocookie"===o&&"nocookie"===r&&c(null,"visit"),p.is(".sliding-popup-top")&&(e(".find-more-button").off("click").on("click",d),e(i).on("click","#cookie-opt-in-save",c),e("#no-thankx").add("a").not(".find-more-button").not(".level-2-item a, .home-tap a").add(".level-2-item .level3 a").add(".level-2-item a:first-child").add(".custom-menu-dropdown a").on("click",u)))},socialShowHide:function(t){var n=e("#news-social");n.length>0&&("external"===t?n.show():n.hide())}}}(jQuery,Drupal,this,this.document),function(e,t){"use strict";Drupal.behaviors.uiElements={attach:function(){this.globals().backTop().pointerEventsPolyfillInit()},globals:function(){return t.$=e,this},backTop:function(){return 0===e(t).scrollTop()&&e("#back-top a").hide(),e("#back-top a").click(function(){return e("body,html").animate({scrollTop:0},600),0===e(t).scrollTop()&&e("#back-top a").hide(),!1}),e(t).scroll(function(){e(t).scrollTop()>100?e("#back-top a").show():e("#back-top a").hide(),clearTimeout(e.data(this,"scrollTimer")),e.data(this,"scrollTimer",setTimeout(function(){e("#back-top a").hide()},4e3))}),this},pointerEventsPolyfillInit:function(){return PointerEventsPolyfill.initialize(),this}}}(jQuery,this),function(e,t,n,i){"use strict";t.shwGlobal=t.shwGlobal||{};var s="pkmslogout?filename=WSBLogout.html",r="mijnaegon/",o="/mijnservices/US_RestGatewayWeb/rest/requestResponse/BS_PARTIJ_03/retrieve",a="mijn_last_login",l=15;i.behaviors.userDetailWidget={shwData:null,shwRawData:null,attach:function(e,n){this.setup(n),t.shwGlobal.userLogout=function(e){return this.deinitialize(e)}.bind(this),t.shwGlobal.userLoggedIn=function(){return this.userLoggedIn()}.bind(this),t.shwGlobal.getRelNumByType=function(e){return this.getRelNumByType(e)}.bind(this)},setup:function(e){var n="local"!==e.onlineAegonNl.hostname&&-1!==t.location.hostname.search("www.dev.");n&&!this.lastLogin(),this.apiUrl="local"===e.onlineAegonNl.hostname?"/file/example/user_detail_bs.json":o,s=e.basePath+s,r=e.basePath+r,this.getData()},getData:function(){var e,t,i,s=this;e={retrieveRequest:{AILHEADER:{CLIENTID:"MijnAegonUserWidget",CORRELATIONID:"##UAT##"}}},i=function(e){return"retrieveResponse"in e?!0:!1},t=function(e){var t,r,o,a;t="string"==typeof e,r=t?n.parseJSON(e):e,i(r)&&(s.shwRawData=r.retrieveResponse,a="00000"===r.retrieveResponse.PROCES.STATUS,o={loggedIn:a,userName:r.retrieveResponse.PARTIJ._AE_PERSOON._AE_SAMNAAM||"n.a.",lastAccess:s.lastLogin()},s.initialize(o))},n.ajax({timeout:1e4,type:"GET",encoding:"UTF-8",url:this.apiUrl,data:e,dataType:"json",success:t,error:this.clearLastLogin})},initialize:function(e){var t=this;this.shwData=e;var n=function(e){t.widget=e};e.loggedIn&&(this.parseWidget(e,n),this.events())},parseWidget:function(e,i){var o,a;o=n(".user_detail_widget"),o.find("span.user_detail_widget_name").text(e.userName),o.find("a.user_detail_widget_logout_link").attr("href",s),o.find("a.user_detail_widget_mijnaegon_link").attr("href",r),e.lastAccess===!1?(o.find("span.last_access_wrapper").remove(),o.find("p.log").remove()):(a=this.formatDatetime(e.lastAccess),o.find(".user_detail_widget_last_access").text(a)),this.shwUserDetailsInmenu(e.userName),n(t).trigger("shwUserLoggedIn"),n("body").addClass("shw-widgets-logged-in"),n("html").hasClass("no-cssanimations")&&!n.cookie("hasBeenShown")&&(o.find(".btn-login-loggedin").addClass("ieChangeColors"),o.find(".highlight.desktop").delay(3e3).animate({"margin-top":"-500px",bottom:"500px"},250,"linear",function(){o.find(".btn-login-loggedin").removeClass("ieChangeColors")}),o.find(".highlight.mobile").delay(3e3).slideUp(500)),n.cookie("hasBeenShown")&&o.find(".highlight").addClass("has-been-shown"),(this.expiredTimeFromLogin()||n.cookie("hasBeenShown"))&&o.addClass("processed"),n.cookie("hasBeenShown","1"),"function"==typeof i&&i(o)},expiredTimeFromLogin:function(){var e=this.lastLogin();if(!e)return!1;var t=this.formatDatetime(e,!0)+1e3*l;return n.now()>t&&!0},shwUserDetailsInmenu:function(e){var t=n("<a />",{"class":"icon-user-link"}),i=n("<a />",{"class":"icon-user-link"});t.text(e).attr("href",r),i.text(e).attr("href",r),n('li[data-id="shw-user-details-inmenu"]').append(t).find(".login-link-inv").remove(),n('li[data-id="shw-mob-user-details-inmenu"]').append(i).find(".login-link-inv").remove()},events:function(t){if("undefined"!=typeof this.widget){var i=this.widget.find("button.btn-login-loggedin"),s={isMobile:function(){return e.documentElement.offsetWidth<=640},mobileTapPresent:function(){return n("body").hasClass("mobile-tap")},isTapped:function(){return i.hasClass("tap")}},r=function(){!s.isMobile()||s.mobileTapPresent()||s.isTapped()?s.isMobile()||n("body").removeClass("mobile-tap"):n("body").toggleClass("mobile-tap")},o=function(){n(this).addClass("off").off("mouseenter")},a=function(){s.isMobile()&&!s.mobileTapPresent()?n("body").toggleClass("mobile-tap"):n("body").removeClass("mobile-tap"),n(this).toggleClass("tap")},l=function(){n("body").hasClass("mobile-tap")&&(n("body").removeClass("mobile-tap"),i.addClass("tap"))};if(t)return n(window).off("resize",r),this.widget.find("button.btn-login-loggedin").off("mouseenter",o),void this.widget.find("button.btn-login-loggedin").off("click",a);n(window).on("resize",r).resize(),i.on("mouseenter",o),i.on("click",a),n("section.content").on("click",l),this.widget.find(".highlight").one("webkitAnimationEnd oanimationend         msAnimationEnd animationend",function(){n(this).parents(".user_detail_widget").addClass("processed")})}},formatDatetime:function(e,t){var n,i,s,r,o,a;if(e){var l=e.match(/(\d+)/g);e=l[1]+"/"+l[2]+"/"+l[0]+" "+l[3]+":"+l[4]+":"+l[5]+" UTC"}return e=new Date(e),t?e.getTime():(i=e.getDate(),s=e.getMonth()+1,r=e.getFullYear(),o=e.getHours(),a=e.getMinutes(),s=String(s).length<2&&"0"+s||s,o=String(o).length<2&&"0"+o||o,a=String(a).length<2&&"0"+a||a,n=i+"-"+s+"-"+r+" om "+o+":"+a+" uur")},lastLogin:function(){return n.cookie(a)||!1},clearLastLogin:function(e){n.removeCookie(a)},deinitialize:function(e){return n("body").removeClass("shw-widgets-logged-in mobile-tap"),this.clearLastLogin(),n.removeCookie("hasBeenShown"),this.events(!0),this.shwData.loggedIn=!1,n(t).trigger("shwUserLogout"),e||(location.href=s),this.userLoggedIn()},userLoggedIn:function(){return this.shwData.loggedIn||!1},getRelNumByType:function(e){if(e=e.toUpperCase(),this.shwRawData&&this.shwRawData.PARTIJ&&!this.shwRawData.PARTIJ._AE_PARTIJ_IDENTIFICATIE)return null;var t=this.shwRawData.PARTIJ._AE_PARTIJ_IDENTIFICATIE;if(!e)return t;var n=t.filter(function(t){return t._AE_RELNUM_TYPE===e?!0:!1}),i=[];return n.forEach(function(e){i.push(e.RELNUM)}),i.length<=1?i[0]:i}}}(this.document,this,this.jQuery,this.Drupal),function(e){"use strict";Drupal.behaviors.lhfs_widget={attach:function(){e(".lhfs_widget").length>0&&(e("#lhfs_widget .tip").addClass("visible"),e("#lhfs_widget li.product ul.horizontal").removeClass("visible"),e("#lhfs_widget li.product ul.horizontal").addClass("visible"),e("#lhfs_widget li.product ul.horizontal.error").removeClass("visible"),e(".success").appendTo("body").css("top",(e(window).height()-e(".success").height())/2+"px"),e(".lightbox").appendTo("body"),e(".help").mouseover(function(){if(this.title>" "){e(".dialog.help").remove();var t=document.createElement("DIV");t.className="help dialog",t.innerHTML=this.title,this.title=" ",e("#lhfs_widget").append(t);var n=e(this).offset();n.top=n.top+e(this).height()+10,n.left=n.left-e(t).width()/2-18,e(t).offset(n);var i=this;e(document).click(function(){e(t).remove(),i.title=t.innerHTML})}}))}}}(jQuery),function(e,t,n,i){"use strict";i.behaviors.myDocumentsWidget={attach:function(){n(".my_documents_widget article h2").on("click",function(){n(this).parent("article").toggleClass("open").siblings().removeClass("open")})}}}(this.document,this,this.jQuery,this.Drupal),function(e,t,n,i){"use strict";i.behaviors.personalDetailsWidget={validation:{zip:"^d+w*$"},attach:function(){n("form[name=personal_details_form]").validVal({validate:{onKeyup:!0}}),n("input[name=ra_NL]").click(function(){var e=parseInt(n(this).val())>0;n(".address .residential .NL").toggleClass("visible",e),n(".address .residential .world").toggleClass("visible",!e)}),n("input[name=ra_NL]:checked").click(),n("input[name=ca_NL]").click(function(){var e=parseInt(n(this).val())>0;n(".address .correspondential .NL").toggleClass("visible",e),n(".address .correspondential .world").toggleClass("visible",!e)}),n("input[name=ca_NL]:checked").click()}}}(this.document,this,this.jQuery,this.Drupal);
