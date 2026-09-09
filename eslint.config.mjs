// eslint-config-next 16 ships a native flat-config array (dist/index.js -
// `module.exports = [...]`) - importing it directly rather than routing
// through @eslint/eslintrc's FlatCompat("next/core-web-vitals") shim, which
// crashes on this exact package version ("Converting circular structure to
// JSON" inside config-validator.js, a known FlatCompat/eslint-plugin-react
// incompatibility on eslint 9.39.x - confirmed live, not assumed).
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = [...nextCoreWebVitals];

export default eslintConfig;
