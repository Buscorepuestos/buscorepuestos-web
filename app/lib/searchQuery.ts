const REFERENCE_SEPARATORS = /[\s._\-/]+/g;
const DIACRITICS = /[\u0300-\u036f]/g;

function normalizeTextSearch(term: string): string {
    return term
        .normalize('NFD')
        .replace(DIACRITICS, '')
        .toLocaleLowerCase('es-ES')
        .replace(/[_/\\-]+/g, ' ')
        .replace(/[^a-z0-9.\s]+/g, ' ')
        .split(/\s+/)
        .map(token => /[a-z]/.test(token) ? token.replace(/\./g, '') : token)
        .map(token => token.replace(/^\.+|\.+$/g, ''))
        .filter(Boolean)
        .join(' ');
}

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
        const mixedPrefixWithNumbers =
            /^[a-z0-9]+$/i.test(tokens[0]) &&
            /[a-z]/i.test(tokens[0]) &&
            /\d/.test(tokens[0]) &&
            tokens.slice(1).every(token => /^\d+$/.test(token));

        return allNumeric || shortLetterPrefixWithNumbers || mixedPrefixWithNumbers;
    }

    const digitCount = (compact.match(/\d/g) || []).length;
    return /[a-z]/i.test(compact) && digitCount / compact.length >= 0.3;
}

/**
 * Normaliza únicamente la consulta enviada al buscador. El valor visible en el
 * input se conserva para no modificar lo que escribió el usuario.
 */
export function normalizeSearchQuery(term: string): string {
    const trimmed = term.trim();
    return isReferenceSearch(trimmed)
        ? trimmed.replace(REFERENCE_SEPARATORS, '').toUpperCase()
        : normalizeTextSearch(trimmed);
}
