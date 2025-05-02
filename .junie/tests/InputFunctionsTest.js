import { validateInput } from '../../typescript/Input/InputFunctions';
import ChocoValidation from '../../typescript/models/ChocoValidation';

// Mock the TInputFunctions and ChocoConfig
jest.mock('../../typescript/Input/TInputFunctions', () => ({
  en: {
    INPUT_REQUIRED: 'This field is required',
    INVALID_EMAIL: 'Invalid email format',
    INVALID_PHONE_NUMBER: 'Invalid phone number'
  }
}));

jest.mock('../../ChocoConfig', () => ({
  lang: 'en'
}));

describe('InputFunctions', () => {
  describe('validateInput', () => {
    test('should validate required fields', () => {
      const validation = new ChocoValidation({
        required: true
      });
      
      // Empty value should fail validation
      const emptyResult = validateInput('', validation);
      expect(emptyResult.Validated).toBeFalsy();
      expect(emptyResult.Msg).toBe('This field is required');
      
      // Non-empty value should pass validation
      const validResult = validateInput('test', validation);
      expect(validResult.Validated).toBeTruthy();
    });
    
    test('should validate email format', () => {
      const validation = new ChocoValidation({
        isEmail: true
      });
      
      // Invalid email should fail validation
      const invalidResult = validateInput('notanemail', validation);
      expect(invalidResult.Validated).toBeFalsy();
      expect(invalidResult.Msg).toBe('Invalid email format');
      
      // Valid email should pass validation
      const validResult = validateInput('test@example.com', validation);
      expect(validResult.Validated).toBeTruthy();
    });
    
    test('should validate phone numbers', () => {
      const validation = new ChocoValidation({
        isPhone: true
      });
      
      // Invalid phone should fail validation
      const invalidResult = validateInput('123', validation);
      expect(invalidResult.Validated).toBeFalsy();
      expect(invalidResult.Msg).toBe('Invalid phone number');
      
      // Valid phone should pass validation
      const validResult = validateInput('1234567890', validation);
      expect(validResult.Validated).toBeTruthy();
    });
  });
});