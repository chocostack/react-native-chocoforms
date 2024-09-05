import ChocoFormMessage from "./ChocoFormMessage";
import ChocoControl from "./ChocoControl";

class ChocoForm {
    controls: { [key: string]: ChocoControl } | Array<ChocoControl>
    isValidForm: boolean = false
    edited: boolean = false
    generalError: ChocoFormMessage
    msg: ChocoFormMessage


    //DECLARATION
    constructor();
    constructor(controls: { [key: string]: ChocoControl } | Array<ChocoControl>);

    //IMPLEMENTATION
    constructor(controls?: { [key: string]: ChocoControl } | Array<ChocoControl>) {
        if(controls)
            this.controls = controls;
    }
}

export default ChocoForm;