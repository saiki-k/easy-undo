# easy-undo

A simple JavaScript undo/redo interface; for easy management of 'state' histories in an application.

This is a modern JS rewrite of the awesome [simple-undo](https://github.com/mattjmattj/simple-undo) project.

## Installation

```bash
$ npm install --save easy-undo
```

## Example

```javascript
import EasyUndo from 'easy-undo';

// Let's assume there's an object whose history needs to be tracked
const sampleAppState = {};

// The maximum number of states to be tracked
const maxLength = 10;

// We need a function which provides the required object in its "current" form
// to the EasyUndo instance, via a callback function:
const provider = (cb) => cb(JSON.stringify(sampleAppState));

// Let's instantiate EasyUndo
const history = new EasyUndo({ maxLength, provider });

// The stringified version of the `sampleAppState` is saved, and managed by EasyUndo
// when the `save` method is called on the EasyUndo instance (see `provider`)
sampleAppState.secret = "foo";
history.save();

sampleAppState.secret = 42;
history.save();

// We need to specify the corresponding callback functions for the undo/redo
// operations on the EasyUndo instance.
const undoCb = (prevState) => {
    sampleAppState = JSON.parse(prevState);
};
const redoCb = (nextState) => {
    sampleAppState = JSON.parse(nextState);
};
// As you can see, these functions have access to the corresponding states.


history.undo(undoCb);
// sampleAppState -> { secret: "foo" }

history.redo(redoCb);
// sampleAppState -> { secret: 42 }


// That's it! It's Easy! Have fun! :-)
```

## License
MIT © [Sai Kishore Komanduri](https://github.com/fatman-)
