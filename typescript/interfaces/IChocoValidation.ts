interface IChocoValidation {
    required: boolean
    isEmail: boolean //Basic validation for an email format aaaa@bbb.cc
    isPhone: boolean // 10 digit number validation
    isEmailOrPhone: boolean // If it's either an email or a phone it's valid
    limitAllowedCharacters: boolean // Characters used must be one of these: ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz.1234567890
    isPassword: boolean // Checks for a min length of 6 characters, an uppercase and a number
    minLength: number | null | undefined // Minimun length of characters for the input to be valid
    maxLength: number | null | undefined // Max length of characters for the input to be valid
    min: number | null | undefined // Min numerical value
    max: number | null | undefined // Max numerical value
    equalsTo: string // Validates that this input has the same value as another input in the controls part of the configuration
    isUrl: boolean // Regex validation for an url
}

export default IChocoValidation;
