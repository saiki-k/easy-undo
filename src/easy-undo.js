/**
* A helper funtion which truncates a given stack (array) as per the given limit
*
* @param {Array} stack
*
* @param {Number} limit Maximum number of items allowed in the `stack` array
*
* @returns {Object} The truncated stack
*/
const truncate = (stack, limit) => {
	while (limit !== 0 && stack.length > limit) {
		stack.shift();
	}
};

/**
* A simple JavaScript undo/redo interface; for easy management of 'state' histories in any application
*/
export default class EasyUndo {
	/**
	* Construct a EasyUndo instance
	*
	* @param {Object} options Props. needed to construct a EasyUndo instance
	*
	* @param {Function} options.provider A required property, which accepts a
	* 	function argument, which inturn accepts the 'current' state of the application.
	* 	For example: `const provider = (fn) => fn(currentState)`.
	* 	It is required at instantiation, because it is used internally
	* 	in the `save` method, for accessing the latest state
	*
	* @param {Number} options.maxLength Maximum number of states that can
	* 	be added to the history stack (not including the initial state).
	* 	Default value is 0 (infinite)
	*
	* @param {Function} options.onUpdate A function for notifying an update
	* 	to the history stack; called on `save`, `undo`, `redo`, and `clear`
	*/
	constructor(options = {}) {
		const defaults = {
			provider: () => { throw new Error('No provider!'); },
			maxLength: 0,
			onUpdate: () => {},
		};

		/**
		* A class property which is assigned the appropriate 'provider' property
		*/
		this.provider = options.provider || defaults.provider;

		/**
		* A class property which is assigned the appropriaite 'maxLength' property
		*/
		this.maxLength = options.maxLength || defaults.maxLength;

		/**
		* A class property which is assigned the appropriaite 'onUpdate' property
		*/
		this.onUpdate = options.onUpdate || defaults.onUpdate;

		/**
		* A class property for storing the initial item in the history
		*/
		this.initialItem = null;

		/**
		* A class property for storing the position in a stack, for a proper undo/redo journey
		*/
		this.position = 0;

		/**
		* A class property for managing the states [of an application] over time
		*/
		this.stack = [this.initialItem];
	}

	/**
	* Initializes the stack with a given item
	*
	* @param {Any} initialItem The first item in the history stack
	*/
	initialize = initialItem => {
		this.initialItem = initialItem;
		this.stack[0] = initialItem;
	};

	/**
	* Clears the history stack, and sets it to an initial state
	*/
	clear = () => {
		this.stack = [this.initialItem];
		this.position = 0;
		this.onUpdate();
	};

	/**
	* Saves the latest state — as per the `provider` — to the history stack
	*/
	save = () => {
		this.provider((currentState) => {
			truncate(this.stack, this.maxLength);
			this.position = Math.min(this.position, this.stack.length - 1);

			this.stack = this.stack.slice(0, this.position + 1);
			this.stack.push(currentState);

			this.position++;
			this.onUpdate();
		});
	};

	/**
	* Fetches the last position (zero-based index) in the history stack
	*
	* @returns {Number} One minus the total no of items in the history stack
	*/
	getLastIndex = () => this.stack.length - 1;

	/**
	* Returns a truthy value if an undo operation is possible
	*
	* @returns {Boolean}
	*/
	canUndo = () => this.position > 0;

	/**
	* Returns a truthy value if a redo operation is possible
	*
	* @returns {Boolean}
	*/
	canRedo = () => this.position < this.getLastIndex();

	/**
	* Tracks back to the previous-to-current item in the stack
	*
	* @param {Function} fn A function which accepts the previous-to-current
	* 	item in the stack, as an argument.
	*/
	undo = (fn) => {
		if (!this.canUndo()) {
			return;
		}

		const item =  this.stack[--this.position];
		this.onUpdate();
		fn && fn(item);
	};

	/**
	* Tracks forward to the next-to-current item in the stack
	*
	* @param {Function} fn A function which accepts the next-to-current
	* item in the stack, as an argument.
	*/
	redo = (fn) => {
		if (!this.canRedo()) {
			return;
		}

		const item =  this.stack[++this.position];
		this.onUpdate();
		fn && fn(item);
	};
}
