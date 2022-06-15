
# react-native-chocoforms

A package that aims to automate form generation in react native. Doing so by passing a 
single configuration object to the component.




## props

#### Component props


| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `form` | `object` | **Required**. Your form configuration object, details below |
| `onFormChange` | `function` | **Required**. Callback function that receives the updated form as a parameter |
| `lang` | `enUS/esMX` | **Required**. Language in which the validation messages will be shown |
| `inputStyle` | `object` | Optional. Style applied to each input in the form before interacted |
| `inputStyleTouched` | `object` | Optional. Style applied to each input in the form when it is touched |
| `inputStyleBlured` | `object` | Optional. Style applied to each input in the form when it is blurred |

## Example of the configuration object

```javascript
this.state= {
    form: {
        controls: {
            UserName: {
                elementType: 'input', // what kind of input should it render (input, currency, time, date, select)
                elementConfig: { // Everything here will be copied to the input directly
                    placeholder: 'Username',
                    autoCapitalize: 'words'
                },
                label: 'Username*', // Label descriptive of the input
                value: '',
                errorMessage: '', // Error message of this specific input, managed by the component
                validation: { // All validations
                    required: true,
                    isEmail: true, //Basic validation for an email format aaaa@bbb.cc
                    isPhone: false, // 10 digit number validation
                    isEmailOrPhone: false, // If it's either an email or a phone it's valid
                    limitAllowedCharacters: true, // Characters used must be one of these: ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz.1234567890
                    isPassword: false, // Checks for a min length of 6 characters, an uppercase and a number
                    minLength: false, // Minimun length of characters for the input to be valid
                    maxLength: false, // Max length of characters for the input to be valid
                    equalsTo: 'NameOfSomeOtherControlInTheConfiguration', // Validates that this input has the same value as another input in the controls part of the configuration
                    isUrl: false // Regex validation for an url
                },
            },
            RoleID: {
                elementType: 'select',
                elementConfig: {
                    placeholder: 'Role',
                },
                label: 'Role*',
                value: '',
                text: '', // For 'select' only
                options: [{   // For 'select' only
                    id: 1,
                    text: 'example'
                },{
                    id: 2,
                    text: 'example 2'
                }],
                errorMessage: '',
                validation: {
                    required: true
                },
            },
            Password: {
                elementType: 'input',
                elementConfig: {
                    placeholder: 'Password',
                    autoCapitalize: 'none'
                },
                label: 'Password*',
                value: '',
                errorMessage: '',
                validation: {
                    required: true,
                    isPassword: true
                },
            },
        },
        isValidForm: false, // Will determine if the form is inline with the validations in the config object.
        generalError:{
            show: true,
            text: 'Some custom error you want to show'
        }
    }
}
```


## Badges

[![MIT License](https://img.shields.io/apm/l/atomic-design-ui.svg?)](https://github.com/tterb/atomic-design-ui/blob/master/LICENSEs)