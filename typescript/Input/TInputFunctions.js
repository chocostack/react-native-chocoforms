const TInputFunctions = {
    // English
    "enUS": {
        'INPUT_REQUIRED': 'This input is required',
        'INVALID_EMAIL': 'Invalid Email',
        'INVALID_PHONE_NUMBER': 'Invalid Phone Number',
        'INVALID_EMAIL_OR_PHONE': 'Invalid email or phone number',
        'ALLOWED_CHARACTERS': 'You can only use letters, numbers and dots',
        'PASSWORD': 'Your password must have an uppercase and a number',
        'MINIMUN_CHARACTERS': 'This input needs a minimun of @ characters',
        'MAXIMUN_CHARACTERS': 'This input has a limit of @ characters',
        'EQUALS_TO': 'Must be the same as @',
        'INVALID_URL': 'Invalid url',
        'TOS_REQUIRED': 'You must accept the terms of service',
    },
    // Spanish
    "esMX": {
        'INPUT_REQUIRED': 'Campo obligatorio',
        'INVALID_EMAIL': 'Correo inválido',
        'INVALID_PHONE_NUMBER': 'Número de teléfono inválido',
        'INVALID_EMAIL_OR_PHONE': 'Correo o número de teléfono inválido',
        'ALLOWED_CHARACTERS': 'Solo puedes usar letras, números y puntos',
        'PASSWORD': 'Tu contraseña debe tener al menos una mayúscula y un número',
        'MINIMUN_CHARACTERS': 'Este campo requiere un mínimo de @ caracteres',
        'MAXIMUN_CHARACTERS': 'Este campo tiene un límite de  @ caracteres',
        'EQUALS_TO': 'Debe ser igual a @',
        'INVALID_URL': 'Enlace inválido',
        'TOS_REQUIRED': 'Debes de acceptar los terminos de uso y servicio',
    }
}

TInputFunctions["en-US"] = TInputFunctions["enUS"];
TInputFunctions["es-MX"] = TInputFunctions["esMX"];

export default TInputFunctions;