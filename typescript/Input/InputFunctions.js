import TInputFunctions from './TInputFunctions';

import ChocoConfig from '../../ChocoConfig';

const emailSpecialChars = "._-+";
const numberChars = "0123456789";

export function validateInput(value, validations, controls = false) {

    let Response = {
        Validated: true,
        Msg: ""
    }

    if (validations.tos) {
        if (!value) {
            Response.Validated = false;
            Response.Msg = TInputFunctions[ChocoConfig.lang].TOS_REQUIRED;
        }
    } else if (validations.isDate) {
        if (validations.required) {
            if (value == "") {
                Response.Validated = false;
                Response.Msg = TInputFunctions[ChocoConfig.lang].INPUT_REQUIRED;
                return Response;
            }
        }

        // If value is not empty, validate it's a proper date format (MM/DD/YYYY)
        if (value && value !== "") {
            const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
            if (!dateRegex.test(value)) {
                Response.Validated = false;
                Response.Msg = TInputFunctions[ChocoConfig.lang].INVALID_DATE_FORMAT;
                return Response;
            }

            // Check if it's a valid date (e.g., not 02/31/2023)
            const parts = value.split('/');
            const month = parseInt(parts[0], 10);
            const day = parseInt(parts[1], 10);
            const year = parseInt(parts[2], 10);

            const date = new Date(year, month - 1, day);
            if (
                date.getFullYear() !== year || 
                date.getMonth() !== month - 1 || 
                date.getDate() !== day
            ) {
                Response.Validated = false;
                Response.Msg = TInputFunctions[ChocoConfig.lang].INVALID_DATE;
                return Response;
            }

            // Check min/max date if specified
            if (validations.minDate) {
                const minDate = new Date(validations.minDate);
                if (date < minDate) {
                    Response.Validated = false;
                    Response.Msg = TInputFunctions[ChocoConfig.lang].DATE_AFTER.replace('@', getFormattedDate(minDate));
                    return Response;
                }
            }

            if (validations.maxDate) {
                const maxDate = new Date(validations.maxDate);
                if (date > maxDate) {
                    Response.Validated = false;
                    Response.Msg = TInputFunctions[ChocoConfig.lang].DATE_BEFORE.replace('@', getFormattedDate(maxDate));
                    return Response;
                }
            }
        }
    } else {
        if (isNaN(value) && !value)
            value = "";

        value = ('' + value).trim();

        if (validations.required) {
            if (value == "") {
                Response.Validated = false;
                Response.Msg = TInputFunctions[ChocoConfig.lang].INPUT_REQUIRED;
            }
        }

        if (validations.isEmail) {
            Response = validateEmail(value);
        }

        if (validations.isPhone) {
            Response = validatePhoneNumber(value);
        }

        if (validations.isEmailOrPhone) {
            Response = validateEmail(value);

            if (!Response.Validated) {
                Response = validatePhoneNumber(value);

                if (!Response.Validated) {
                    Response.Msg = TInputFunctions[ChocoConfig.lang].INVALID_EMAIL_OR_PHONE;
                }
            }
        }

        if (validations.limitAllowedCharacters) {
            const AllowedCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz.1234567890";

            for (let i = 0; i < value.length; i++) {
                const strChar = value.charAt(i);
                if (AllowedCharacters.indexOf(strChar) == -1) {
                    Response.Validated = false;
                    Response.Msg = TInputFunctions[ChocoConfig.lang].ALLOWED_CHARACTERS;
                }
            }
        }

        if (validations.isPassword) {
            const Uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            const Number = "1234567890";

            let hasUppercase = false;
            let hasNumber = false;

            for (let i = 0; i < value.length; i++) {
                const strChar = value.charAt(i);
                if (Uppercase.indexOf(strChar) > -1) {
                    hasUppercase = true;
                }
                if (Number.indexOf(strChar) > -1) {
                    hasNumber = true;
                }
            }

            if (!hasUppercase || !hasNumber) {
                Response.Validated = false;
                Response.Msg = TInputFunctions[ChocoConfig.lang].PASSWORD;
            }

        }

        if (validations.minLength != undefined) {
            if (value.length < validations.minLength) {
                Response.Validated = false;
                Response.Msg = TInputFunctions[ChocoConfig.lang].MINIMUN_CHARACTERS.replace("@", validations.minLength);
            }
        }

        if (validations.maxLength != undefined) {
            if (value.length > validations.maxLength) {
                Response.Validated = false;
                Response.Msg = TInputFunctions[ChocoConfig.lang].MAXIMUN_CHARACTERS.replace("@", validations.maxLength);
            }
        }

        if (validations.equalsTo && controls) {
            if (value !== controls[validations.equalsTo].value) {
                Response.Validated = false;
                Response.Msg = TInputFunctions[ChocoConfig.lang].EQUALS_TO.replace("@", validations.equalsToLabel);
            }
        }

        if (validations.isUrl) {
            const expression =
                /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;

            const regex = new RegExp(expression);

            if (!value.match(regex)) {
                Response.Validated = false;
                Response.Msg = TInputFunctions[ChocoConfig.lang].INVALID_URL;
            }
        }
    }

    return Response;
}

// Format a date as MM/DD/YYYY
function getFormattedDate(date) {
    if (!date) return "";
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}/${year}`;
}

export function inputChangedHandler(form, event, inputIdentifier){
    let errorMsg = "";
    let isValid = true;
    const updatedForm = { ...form };
    const updatedControls = { ...updatedForm.controls };

    const updatedControlElement = {
        ...updatedControls[inputIdentifier]
    }
    if (updatedControlElement.validation && updatedControlElement.validation.tos) {
        updatedControlElement.value = (!updatedControlElement.value);
    } else if (updatedControlElement.elementType == 'checkbox') {
        updatedControlElement.value = (!updatedControlElement.value);
    } else if (updatedControlElement.elementType == 'date') {
        updatedControlElement.dateObject = event;

        updatedControlElement.value = getFormattedDate(updatedControlElement.dateObject);
    } else if (updatedControlElement.elementType == 'currency') {
        updatedControlElement.value = event.unMaskedValue;
    } else if (updatedControlElement.elementType == 'select') {
        updatedControlElement.value = event.value;
    } else if (updatedControlElement.elementType == 'slider') {
        updatedControlElement.value = event;
    } else if (updatedControlElement.elementType == 'query') {
        updatedControlElement.value = event.value;
    } else if (updatedControlElement.elementType == 'score') {
        updatedControlElement.value = event.value;
    } else {
        updatedControlElement.value = event.nativeEvent.text;
    }


    const Response = validateInput(updatedControlElement.value, updatedControlElement.validation, updatedControls);

    if (!Response.Validated) {
        errorMsg = Response.Msg;
    }

    updatedControlElement.errorMessage = errorMsg;

    updatedControls[inputIdentifier] = updatedControlElement;


    for (let key in updatedControls) {
        const r = validateInput(updatedControls[key].value, updatedControls[key].validation);

        if (!r.Validated) {
            isValid = false;
        }
    }

    updatedForm.controls = updatedControls;
    updatedForm.edited = true;
    updatedForm.isValidForm = isValid;

    return updatedForm;
}

/************************************************************************
 * EMAIL VALIDATION
 ************************************************************************/

function validateEmail(value) {

    let Response = {
        Validated: true,
        Msg: ""
    }

    const emailArray = value.split('@');

    if (emailArray.length < 2) {
        Response.Validated = false;
    } else {
        const domain = emailArray[1];
        const domainArray = domain.split('.');

        if (domainArray < 2) {
            Response.Validated = false;
        } else {
            const recipient = emailArray[0];
            const domain = domainArray[0];
            const topLevelDomain = domainArray[domainArray.length - 1];

            Response = validateEmailRecipient(recipient);

            if (Response.Validated) {
                Response = validateEmailDomain(domain);

                if (Response.Validated) {
                    Response = validateEmailTopDomain(topLevelDomain);
                }
            }
        }

    }

    if (!Response.Validated) {
        Response.Msg = TInputFunctions[ChocoConfig.lang].INVALID_EMAIL;
    }

    return Response;
}

function validateEmailRecipient(recipient) {
    const Response = {
        Validated: true,
        Msg: ""
    }

    if (recipient.trim() == "") {
        Response.Validated = false;
    } else {
        if (recipient.length > 64) {
            Response.Validated = false;
        } else {
            const FirstChar = recipient.charAt(0);
            const LastChar = recipient.charAt(recipient.length - 1);

            if (emailSpecialChars.includes(FirstChar) || emailSpecialChars.includes(LastChar)) {
                Response.Validated = false;
            } else {
                let aux = "";

                for (let i = 0; i < recipient.length; i++) {
                    if (emailSpecialChars.includes(recipient[i]) && recipient[i] == aux) {
                        Response.Validated = false;

                        break;
                    }


                    aux = recipient[i];
                }
            }
        }
    }

    return Response;
}

function validateEmailDomain(domain) {
    const Response = {
        Validated: true,
        Msg: ""
    }

    if (domain.trim() == "") {
        Response.Validated = false;
    } else {
        if (domain.length > 253) {
            Response.Validated = false;
        } else {

        }
    }

    return Response;
}

function validateEmailTopDomain(topLevelDomain) {
    const Response = {
        Validated: true,
        Msg: ""
    }

    if (topLevelDomain.trim() == "") {
        Response.Validated = false;
    } else {

    }

    return Response;
}

/************************************************************************
 * END EMAIL VALIDATION
 ************************************************************************/






/************************************************************************
 * PHONE VALIDATION
 ************************************************************************/

function validatePhoneNumber(value) {

    let Response = {
        Validated: true,
        Msg: ""
    }

    if (value.length != 10) {
        Response.Validated = false;
    } else {
        for (let i = 0; i < value.length; i++) {
            if (!numberChars.includes(value[i])) {
                Response.Validated = false;

                break;
            }
        }
    }

    if (!Response.Validated) {
        Response.Msg = TInputFunctions[ChocoConfig.lang].INVALID_PHONE_NUMBER;
    }

    return Response;
}

/************************************************************************
 * END EMAIL VALIDATION
 ************************************************************************/
