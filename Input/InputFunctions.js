import TInputFunctions from './TInputFunctions';

import ChocoConfig from '../ChocoConfig';

const emailSpecialChars = "._-+";
const numberChars = "0123456789";

export function validateInput(value, validations, controls = false) {

    let Response = {
        Validated: true,
        Msg: ""
    }
    
    if (validations.isDate) {
        if (validations.required) {
            if (value == "") {
                Response.Validated = false;
                Response.Msg = TInputFunctions[ChocoConfig.lang].INPUT_REQUIRED;
            }
        }
    } else {
        if (!value)
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

export function inputChangedHandler(form, event, inputIdentifier){
    let errorMsg = "";
    let isValid = true;
    const updatedForm = { ...form };
    const updatedControls = { ...updatedForm.controls };

    const updatedControlElement = {
        ...updatedControls[inputIdentifier]
    }

    if (updatedControlElement.validation.tos) {
        updatedControlElement.value = (!updatedControlElement.value);
    } else if (updatedControlElement.elementType == 'date') {
        updatedControlElement.dateObject = event;

        updatedControlElement.value = GeneralFunctions.getFormatedDate(updatedControlElement.dateObject);
    } else if (updatedControlElement.elementType == 'currency') {
        updatedControlElement.value = event.unMaskedValue;
    } else if (updatedControlElement.elementType == 'select') {
        updatedControlElement.value = event.nativeEvent.id;
        updatedControlElement.text = event.nativeEvent.text;
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