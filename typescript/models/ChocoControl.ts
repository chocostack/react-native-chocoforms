import IChocoControl from "../interfaces/IChocoControl";
import ChocoValidation from "./ChocoValidation";
import ChocoOption from "./ChocoOption";

class ChocoControl {
    name: string | null | undefined
    className: string | null | undefined = ''
    elementType: string = "input" // what kind of input should it render (input, currency, time, date, select, score)
    elementConfig: any
    label: string | null | undefined // Label descriptive of the input
    instructions: string | null | undefined // Extra info or instructions of the input
    value: string | number = ''
    step: number | undefined
    options: Array<ChocoOption> | null  | undefined
    errorMessage: string // Error message of this specific input, managed by the component
    validation: ChocoValidation = new ChocoValidation()
    style: any | null  | undefined
    labelStyle: any | null  | undefined
    metaData: any
    valuesAreFonts: boolean = false



    constructor(validation?: Partial<IChocoControl>) {
        if (validation) {
            Object.assign(this, validation);
        }
    }


    /*constructor(
        elementType: string,
        label: string,
        value: string | number,
        validation: ChocoValidation
    )
    constructor(
        elementType: string,
        label: string,
        value: string | number,
        validation: ChocoValidation,
        className: string
    )
    constructor(
        elementType: string,
        label: string,
        value: string | number,
        validation: ChocoValidation,
        className: string,
        elementConfig: any,
        instructions: string
    )

    constructor(
        elementType: string,
        label: string,
        value: string | number,
        validation: ChocoValidation,
        className?: string,
        elementConfig?: any,
        instructions?: string
    ) {
        this.elementType = elementType;
        this.label = label;
        this.value = value;
        this.validation = validation

        if(className)
            this.className = className

        if(elementConfig)
            this.elementConfig = elementConfig

        if(instructions)
            this.instructions = instructions
    }*/
}

export default ChocoControl;