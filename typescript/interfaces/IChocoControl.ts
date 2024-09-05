import ChocoValidation from "../models/ChocoValidation";
import ChocoOption from "../models/ChocoOption";

interface IChocoControl {
    name: string | null | undefined
    className: string | null | undefined
    elementType: string // what kind of input should it render (input, currency, time, date, select, score)
    elementConfig: any
    label: string | null | undefined // Label descriptive of the input
    instructions: string | null | undefined // Extra info or instructions of the input
    value: string | number
    step: number | undefined
    options: Array<ChocoOption> | null  | undefined
    errorMessage: string // Error message of this specific input, managed by the component
    validation: ChocoValidation,
    style: any | null  | undefined
    labelStyle: any | null  | undefined
    metaData: any
    valuesAreFonts: boolean



}

export default IChocoControl;