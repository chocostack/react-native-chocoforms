# ChocoFormTS Example App

This is an example Expo app that demonstrates all the input types and validation options available in the ChocoFormTS library.

## Getting Started

Follow these instructions to run the example app:

### Prerequisites

- Node.js (v12 or later)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)

### Installation

1. Navigate to the example directory:
   ```bash
   cd node_modules/react-native-chocoforms/example
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Expo development server:
   ```bash
   npm start
   ```

4. Follow the instructions in the terminal to open the app on your device or emulator:
   - Scan the QR code with the Expo Go app on your phone
   - Press 'a' to open on an Android emulator
   - Press 'i' to open on an iOS simulator

## What This Example Demonstrates

This example app showcases all the input types supported by ChocoFormTS:

1. **Text Input** - Standard text input with email validation
2. **Password Input** - Input with password validation (requires uppercase, number, min length)
3. **Currency Input** - Input formatted for currency values
4. **Date Input** - Date picker with date validation
5. **Select Dropdown** - Dropdown selection with options
6. **Checkbox** - Boolean checkbox input
7. **Slider** - Slider input for numeric ranges
8. **Score/Rating** - Rating input for user feedback
9. **Phone Input** - Input with phone number validation

The app also demonstrates:
- Form validation
- Form submission
- Form reset
- Display of submitted form data

## How It Works

The example uses the following components from the ChocoFormTS library:

- `ChocoFormTS` - The main form component
- `ChocoForm` - The form model
- `ChocoControl` - The control model for each input
- `ChocoValidation` - The validation model for each control
- `ChocoOption` - The option model for select inputs

## Customizing the Example

Feel free to modify the example to test different configurations:

- Add or remove form controls
- Change validation rules
- Modify styling
- Test different input types

## Learn More

For more information about ChocoFormTS, check out the [main README](../README.md) or visit the [GitHub repository](https://github.com/chocostack/react-native-chocoforms).