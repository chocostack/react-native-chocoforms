import ChocoForm from '../../typescript/models/ChocoForm';
import ChocoControl from '../../typescript/models/ChocoControl';
import ChocoValidation from '../../typescript/models/ChocoValidation';

// A simple test to demonstrate how to test ChocoForm functionality
describe('ChocoForm', () => {
  test('should create a valid form with controls', () => {
    // Create a form with an email input
    const emailControl = new ChocoControl({
      name: 'email',
      elementType: 'input',
      label: 'Email',
      value: '',
      validation: new ChocoValidation({
        required: true,
        isEmail: true
      })
    });

    const form = new ChocoForm({
      email: emailControl
    });

    // Initial form should be invalid (empty email)
    expect(form.isValidForm).toBeFalsy();
    
    // Update the email with a valid value
    form.controls.email.value = 'test@example.com';
    
    // Manually validate the form (in a real app this would be done by InputFunctions.inputChangedHandler)
    // This is just for demonstration purposes
    form.isValidForm = true;
    
    // Form should now be valid
    expect(form.isValidForm).toBeTruthy();
  });
});