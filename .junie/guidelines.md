# React Native ChocoForms Development Guidelines

This document provides guidelines and information for developing and maintaining the React Native ChocoForms library.

## Build/Configuration Instructions

### Project Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/chocostack/react-native-chocoforms.git
   cd react-native-chocoforms
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. TypeScript Configuration:
   - The project uses TypeScript with ES5 as the target.
   - JSX is set to React mode.
   - Configuration is in `tsconfig.json`.

### Dependency Management

The project uses React 19.0.0 for development and testing:

- The package.json includes:
  - React 19.0.0 as a dev dependency
  - react-test-renderer 19.0.0 for testing
  - peerDependencies to specify compatible React (>=16.0.0) and react-native (>=0.59) versions
  - resolutions to force npm to use React 19.0.0 for testing

If you encounter dependency conflicts when running `npm install`, you can use one of these options:
```bash
# Option 1: Use the resolutions in package.json (recommended)
npm install

# Option 2: Use legacy peer deps flag
npm install --legacy-peer-deps

# Option 3: Force installation (not recommended for production)
npm install --force
```

### Project Structure

- `typescript/` - Main source code directory
  - `ChocoFormTS.tsx` - Main entry point component
  - `Input/` - Input components and functions
  - `Radio/` - Radio button components
  - `models/` - Data models (ChocoForm, ChocoControl, etc.)
  - `interfaces/` - TypeScript interfaces

- `legacy/` - Legacy code (maintained for backward compatibility)

## Testing Information

### Test Configuration

The project uses Jest for testing. The configuration is in `jest.config.js`.

### Running Tests

First, make sure you have installed the development dependencies:
```bash
npm install
```

Then you can run the tests:

- Run all tests:
  ```bash
  npm test
  ```

- Run tests in watch mode (for development):
  ```bash
  npm run test:watch
  ```

- Generate test coverage report:
  ```bash
  npm run test:coverage
  ```

### Writing Tests

Tests are located in the `.junie/tests` directory. Here's how to write tests for different components:

#### Testing Models

Example test for ChocoForm model:

```javascript
import ChocoForm from '../../typescript/models/ChocoForm';
import ChocoControl from '../../typescript/models/ChocoControl';
import ChocoValidation from '../../typescript/models/ChocoValidation';

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

    // Manually validate the form
    form.isValidForm = true;

    // Form should now be valid
    expect(form.isValidForm).toBeTruthy();
  });
});
```

#### Testing Validation Functions

Example test for InputFunctions:

```javascript
import { validateInput } from '../../typescript/Input/InputFunctions';
import ChocoValidation from '../../typescript/models/ChocoValidation';

// Mock dependencies
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

      // Non-empty value should pass validation
      const validResult = validateInput('test', validation);
      expect(validResult.Validated).toBeTruthy();
    });
  });
});
```

### Adding New Tests

1. Create a new test file in the `.junie/tests` directory with a name ending in `.test.js` or `.spec.js`.
2. Import the components or functions you want to test.
3. Write your test cases using Jest's `describe` and `test` functions.
4. Mock any dependencies as needed.
5. Run the tests to verify they pass.

## Additional Development Information

### Form Creation

To create a form, you need to:

1. Create ChocoControl instances for each input field
2. Create a ChocoForm instance with these controls
3. Use the ChocoFormTS component to render the form

Example:

```jsx
import ChocoForm from './typescript/models/ChocoForm';
import ChocoControl from './typescript/models/ChocoControl';
import ChocoValidation from './typescript/models/ChocoValidation';
import ChocoFormTS from './typescript/ChocoFormTS';

// Create form controls
const nameControl = new ChocoControl({
  name: 'name',
  elementType: 'input',
  label: 'Name',
  value: '',
  validation: new ChocoValidation({
    required: true,
    minLength: 2
  })
});

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

// Create form
const form = new ChocoForm({
  name: nameControl,
  email: emailControl
});

// Render form
function MyForm() {
  const [formState, setFormState] = useState(form);

  return (
    <ChocoFormTS
      form={formState}
      onFormChange={setFormState}
    />
  );
}
```

### Validation Types

The library supports various validation types:

- `required` - Field must not be empty
- `isEmail` - Field must be a valid email
- `isPhone` - Field must be a valid 10-digit phone number
- `isEmailOrPhone` - Field must be either a valid email or phone number
- `isPassword` - Field must have at least 6 characters, an uppercase letter, and a number
- `minLength` - Field must have at least the specified number of characters
- `maxLength` - Field must have at most the specified number of characters
- `equalsTo` - Field must match the value of another field (e.g., for password confirmation)
- `isUrl` - Field must be a valid URL

### Input Types

The library supports various input types:

- `input` - Standard text input
- `currency` - Currency input with formatting
- `date` - Date picker
- `select` - Dropdown select
- `checkbox` - Checkbox input
- `slider` - Slider input
- `score` - Rating/score input

### Localization

The library supports localization through the `ChocoConfig.lang` property. Error messages are defined in `TInputFunctions.js`.

### Code Style

- Use TypeScript for new code
- Follow React functional component patterns
- Use interfaces for type definitions
- Keep validation logic in separate functions
