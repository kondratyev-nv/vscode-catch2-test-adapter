// -----------------------------------------------------------------------------
// vscode-catch2-test-adapter was written by Mate Pek, and is placed in the
// public domain. The author hereby disclaims copyright to this source code.

import * as path from 'path';
import * as assert from 'assert';
import { TestAdapter, Imitation, settings } from './TestCommon';

///

describe(path.basename(__filename), function () {
	this.slow(500);

	let imitation: Imitation;
	let adapter: TestAdapter;

	before(function () {
		imitation = new Imitation();
	})

	beforeEach(function () {
		adapter = new TestAdapter();
	})

	afterEach(function () {
		imitation.resetToCallThrough();
		return adapter.waitAndDispose(this);
	})

	after(function () {
		imitation.sinonSandbox.restore();
	})

	specify('empty config', async function () {
		await adapter.load();
		assert.equal(adapter.root.children.length, 0);
	})

	specify('../a/first', async function () {
		await settings.updateConfig('executables', '../a/first');
		const withArgs = imitation.vsFindFilesStub.withArgs(imitation.createVscodeRelativePatternMatcher('first'));
		const count = withArgs.callCount;
		await adapter.load();
		assert.strictEqual(withArgs.callCount, count);
	})

	specify('../<workspaceFolder>/second', async function () {
		await settings.updateConfig('executables', '../' + path.basename(settings.workspaceFolderUri.fsPath) + '/second');
		const withArgs = imitation.vsFindFilesStub.withArgs(imitation.createVscodeRelativePatternMatcher('second'));
		const count = withArgs.callCount;
		await adapter.load();
		assert.strictEqual(withArgs.callCount, count + 1);
	})

	specify('./third', async function () {
		await settings.updateConfig('executables', './third');
		const withArgs = imitation.vsFindFilesStub.withArgs(imitation.createVscodeRelativePatternMatcher('third'));
		const count = withArgs.callCount;
		await adapter.load();
		assert.strictEqual(withArgs.callCount, count + 1);
	})

	specify('./a/b/../../fourth', async function () {
		await settings.updateConfig('executables', './a/b/../../fourth');
		const withArgs = imitation.vsFindFilesStub.withArgs(imitation.createVscodeRelativePatternMatcher('fourth'));
		const count = withArgs.callCount;
		await adapter.load();
		assert.strictEqual(withArgs.callCount, count + 1);
	})

	specify('cpp/{build,Build,BUILD,out,Out,OUT}/**/*suite[0-9]*', async function () {
		await settings.updateConfig('executables', 'cpp/{build,Build,BUILD,out,Out,OUT}/**/*suite[0-9]*');
		const withArgs = imitation.vsFindFilesStub.withArgs(imitation.createVscodeRelativePatternMatcher('cpp/{build,Build,BUILD,out,Out,OUT}/**/*suite[0-9]*'));
		const count = withArgs.callCount;
		await adapter.load();
		assert.strictEqual(withArgs.callCount, count + 1);
	})
})