const REFERENCE_SEPARATORS = /[\s._\-/]+/g;

export function isReferenceSearch(term: string): boolean {
    const trimmed = term.trim();
    if (!trimmed) return false;

    const tokens = trimmed.split(/[\s._\-/]+/).filter(Boolean);
    const compact = trimmed.replace(REFERENCE_SEPARATORS, '');

    if (compact.length < 6 || !/^[a-z0-9]+$/i.test(compact)) return false;
    if (/^\d+$/.test(compact)) return true;

    if (tokens.length > 1) {
        const allNumeric = tokens.every(token => /^\d+$/.test(token));
        const shortLetterPrefixWithNumbers =
            /^[a-z]{1,4}$/i.test(tokens[0]) &&
            tokens.slice(1).every(token => /^\d+$/.test(token));

        return allNumeric || shortLetterPrefixWithNumbers;
    }

    const digitCount = (compact.match(/\d/g) || []).length;
    return /[a-z]/i.test(compact) && digitCount / compact.length >= 0.3;
}
