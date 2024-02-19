
const CONFIG = {
    FOR_LOOP_REGEX: /(([a-zA-Z_-]+)\sin\s[.a-zA-Z_]+|([a-zA-Z_]+=[+-/*'0-9a-zA-Z_]+))/gi,
    DISABLED_ELEMENTS: ['FORM', 'BUTTON', 'INPUT'],
    MODIFIERS_REGEX: /([a-zA-Z_]+:[a-zA-Z_]+)/gi,
    HTAML_REGEX: /(h|ht|hta|htaml)-(\w*):(\w*)/,
    H_SCRIPT: 'HSCRIPT'

}
export default CONFIG
