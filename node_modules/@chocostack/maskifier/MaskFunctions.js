
export function maskMoney(value) {
    if (!value || value == 0)
        return '$ ';

    let maskedValue = '';
    let maskArray = ('' + value).split('.');
    let intMask = maskArray[0];

    let commaCounter = 0;

    for (let i = intMask.length - 1; i >= 0; i--) {
        if (commaCounter == 3) {
            maskedValue = ',' + maskedValue;

            commaCounter = 0;
        }

        maskedValue = intMask[i] + maskedValue;

        commaCounter++;
    }

    if (maskArray.length == 2) {
        let decimalMask = maskArray[1];

        if (decimalMask.length > 2) {
            decimalMask = decimalMask.slice(0, 2);
        }

        maskedValue += '.' + decimalMask;
    }

    maskedValue = '$ ' + maskedValue;

    return maskedValue;
}

export function unMaskMoney(value) {
    if (!value)
        return value;

    let unMaskedValue = value.replace(/,/g, '');

    unMaskedValue = unMaskedValue.replace(/ /g, '');

    unMaskedValue = unMaskedValue.replace('$', '');

    unMaskedValue = unMaskedValue.replace('-', '');

    return unMaskedValue;
}

export function maskTime(value) {
    if (!value)
        return '';

    let maskedValue = '';
    let mask = ('' + value).replace(':', '');

    let colonCounter = 0;

    for (let i = 0; i < mask.length; i++) {
        let digit = mask[i];

        switch (i) {
            case 0:
                if (digit > 2) {
                    digit = 2;
                }
                break;
            case 1:
                if (mask[0] == 2) {
                    if (digit > 3) {
                        digit = 3;
                    }
                } else {
                    if (digit > 9) {
                        digit = 9;
                    }
                }
                break;
            case 2:
                if (digit > 5) {
                    digit = 5;
                }
                break;
            case 3:
                if (digit > 9) {
                    digit = 9;
                }
                break;
        }

        if (colonCounter == 2) {
            maskedValue = maskedValue + ':';

            colonCounter = 0;
        }

        maskedValue = maskedValue + digit;

        colonCounter++;
    }

    if (maskedValue.length > 5) {
        maskedValue = maskedValue.slice(0, 5);
    }

    return maskedValue;
}

export function unMaskTime(value) {
    if (!value)
        return value;

    let unMaskedValue = value.replace(':', '');

    unMaskedValue = unMaskedValue.replace(/ /g, '');

    unMaskedValue = unMaskedValue.replace('-', '');

    return unMaskedValue;
}

export function maskDate(value) {
    if (!value)
        return '';

    let maskedValue = '';
    let mask = ('' + value).replace(':', '');

    let dashCounter = 0;

    for (let i = 0; i < mask.length; i++) {
        let digit = mask[i];

        if (isNaN(digit)) {
            digit = 0;
        }

        switch (i) {
            case 0:
                if (digit > 3) {
                    digit = 3;
                }
                break;
            case 1:
                if (mask[0] == 3) {
                    if (digit > 1) {
                        digit = 1;
                    }
                } else if (mask[0] == 0) {
                    if (digit = 0) {
                        digit = 1;
                    }
                }
                break;
            case 2:
                if (digit > 1) {
                    digit = 1;
                }
                break;
            case 3:
                if (mask[2] == 1) {
                    if (digit > 2) {
                        digit = 2;
                    }
                } else if (mask[2] == 0) {
                    if (digit == 0) {
                        digit = 1;
                    }
                }
                break;
            case 4:
                if (digit > 2) {
                    digit = 2;
                }
                break;
            //TODO: DELETE FROM HERE
            case 5:
                if (mask[4] == 2) {
                    if (digit > 0) {
                        digit = 0;
                    }
                }
                break;
            case 6:
                if (mask[4] == 2) {
                    if (digit > 0) {
                        digit = 0;
                    }
                }
                break;
            case 7:
                if (mask[4] == 2) {
                    if (digit > 6) {
                        digit = 6;
                    }
                }
                break;
        }

        if (dashCounter == 2 || dashCounter == 4) {
            maskedValue = maskedValue + '-';
        }

        maskedValue = maskedValue + digit;

        dashCounter++;
    }

    if (maskedValue.length > 10) {
        maskedValue = maskedValue.slice(0, 10);
    }

    return maskedValue;
}

export function unMaskDate(value) {
    if (!value)
        return value;

    let unMaskedValue = '' + value.replace(/-/g, '');

    unMaskedValue = unMaskedValue.replace(/ /g, '');

    return unMaskedValue;
}