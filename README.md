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

// Let's presume an object whose history needs to be tracked
const sampleAppState = {};

// The maximum number of states to be tracked
const maxLength = 10;

// A provider is a function which provides the required object in its current form to EasyUndo
const provider = (cb) => cb(JSON.stringify(sampleAppState));

// Lets instantiate EasyUndo
const history = new EasyUndo({ maxLength, provider });

// The stringified versions of the sampleAppState are saved, and managed by EasyUndo...
// whenever the `save` method is called on the EasyUndo instance, `history` (see `provider`)
sampleAppState.secret = "foo";
history.save();

sampleAppState.secret = 42;
history.save();

const undoCb = (prevState) => {
    sampleAppState = JSON.parse(prevState);
};
const redoCb = (nextState) => {
    sampleAppState = JSON.parse(nextState);
};

history.undo(undoCb);
// sampleAppState -> { secret: "foo" }

history.redo(redoCb);
// sampleAppState -> { secret: 42 }

```

## License
MIT © [Sai Kishore Komanduri](https://github.com/fatman-)
