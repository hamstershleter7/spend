let { MacroError, createMacro } = require("babel-plugin-macros");
let dedent = require("./dist/dedent.js").default;

module.exports = createMacro(prevalMacros);

function prevalMacros({ babel, references, state }) {
	references.default.forEach((referencePath) => {
		if (referencePath.parentPath.type === "TaggedTemplateExpression") {
			asTag(referencePath.parentPath.get("quasi"), state, babel);
		} else if (referencePath.parentPath.type === "CallExpression") {
			asFunction(referencePath.parentPath.get("arguments"), state, babel);
		} else {
			throw new MacroError(
				`dedent.macro can only be used as tagged template expression or function call. You tried ${referencePath.parentPath.type}.`,
			);
		}
	});
}

function asTag(quasiPath, _, babel) {
	let string = quasiPath.parentPath.get("quasi").evaluate().value;
	let { types: t } = babel;

	quasiPath.parentPath.replaceWith(t.stringLiteral(dedent(string)));
}

function asFunction(argumentsPaths, _, babel) {
	let string = argumentsPaths[0].evaluate().value;
	let { types: t } = babel;

	argumentsPaths[0].parentPath.replaceWith(t.stringLiteral(dedent(string)));
}
