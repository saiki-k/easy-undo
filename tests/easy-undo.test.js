import EasyUndo from '../src/easy-undo';

/* eslint-disable no-undef */
describe('EasyUndo', () => {
	test('should require a provider', () => {
		var history = new EasyUndo();
		expect(history.save).toThrow();
	});

	test('should contain up to maxLength items', () => {
		var count;
		var state = 0;
		var provider = fn => fn(state++);
		var history = new EasyUndo({ provider, maxLength: 3 });
		history.initialize('initial');

		history.save(); // state at current position: 0
		count = history.getLastIndex() + 1;
		expect(count).toEqual(2);

		history.save(); // state at current position: 1
		count = history.getLastIndex() + 1;
		expect(count).toEqual(3);

		history.save(); // state at current position: 2
		count = history.getLastIndex() + 1;
		expect(count).toEqual(4);

		// We've reached the limit
		history.save(); // state at current position: 3
		count = history.getLastIndex() + 1;
		expect(count).toEqual(4);

		history.save(); // state at current position: 4
		count = history.getLastIndex() + 1;
		expect(count).toEqual(4);

		history.undo(); // state at current position: 3
		history.undo(); // state at current position: 2
		history.undo(value => expect(value).toEqual(1));
	});

	test('should undo and redo', () => {
		var state = 0;
		var provider = fn => fn(state++);
		var history = new EasyUndo({ provider, maxLength: 3 });

		history.initialize('initial');
		expect(history.canUndo()).toEqual(false);
		expect(history.canRedo()).toEqual(false);

		history.save(); // state at current position: 0
		expect(history.canUndo()).toEqual(true);
		expect(history.canRedo()).toEqual(false);

		history.undo(value => expect(value).toEqual('initial'));
		expect(history.canUndo()).toEqual(false);
		expect(history.canRedo()).toEqual(true);

		history.save(); // state at current position: 1
		expect(history.canUndo()).toEqual(true);
		expect(history.canRedo()).toEqual(false);

		history.save(); // state at current position: 2
		expect(history.canUndo()).toEqual(true);
		expect(history.canRedo()).toEqual(false);

		history.undo(value => expect(value).toEqual(1));
		expect(history.canUndo()).toEqual(true);
		expect(history.canRedo()).toEqual(true);

		history.redo(value => expect(value).toEqual(2));
		expect(history.canUndo()).toEqual(true);
		expect(history.canRedo()).toEqual(false);
	});

	test('should call the registered onUpdate callback', () => {
		var provider = fn => fn(Math.random());
		var callCount = 0;
		var onUpdate = () => callCount++;

		var history = new EasyUndo({ provider, onUpdate });
		expect(callCount).toEqual(0);

		history.save();
		expect(callCount).toEqual(1);

		history.undo();
		expect(callCount).toEqual(2);

		history.redo();
		expect(callCount).toEqual(3);

		history.clear();
		expect(callCount).toEqual(4);
	});

	test('should reset when cleared', () => {
		var provider = fn => fn(Math.random());
		var history = new EasyUndo({ provider, maxLength: 3 });

		history.initialize('initial');
		history.save();
		history.save();
		history.undo();
		history.save();
		history.undo();
		history.redo();

		history.clear();
		expect(history.getLastIndex()).toEqual(0);

		history.save();
		history.undo(value => expect(value).toEqual('initial'));
	});
});
