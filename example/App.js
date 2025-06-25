import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Text, Button } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ChocoFormTS from '../typescript/ChocoFormTS';
import ChocoForm from '../typescript/models/ChocoForm';
import ChocoControl from '../typescript/models/ChocoControl';
import ChocoValidation from '../typescript/models/ChocoValidation';
import ChocoOption from '../typescript/models/ChocoOption';

export default function App() {
  // Create initial form with all input types
  const initialForm = new ChocoForm({
    // Standard text input with email validation
    email: new ChocoControl({
      name: 'email',
      elementType: 'input',
      elementConfig: {
        placeholder: 'Enter your email',
        autoCapitalize: 'none',
      },
      label: 'Email*',
      value: '',
      validation: new ChocoValidation({
        required: true,
        isEmail: true,
      }),
    }),
    
    // Password input with password validation
    password: new ChocoControl({
      name: 'password',
      elementType: 'input',
      elementConfig: {
        placeholder: 'Enter your password',
        autoCapitalize: 'none',
        secureTextEntry: true,
      },
      label: 'Password*',
      value: '',
      validation: new ChocoValidation({
        required: true,
        isPassword: true,
      }),
    }),
    
    // Currency input
    amount: new ChocoControl({
      name: 'amount',
      elementType: 'currency',
      elementConfig: {
        placeholder: 'Enter amount',
      },
      label: 'Amount ($)',
      value: '',
      validation: new ChocoValidation({
        required: true,
      }),
    }),
    
    // Date input
    birthdate: new ChocoControl({
      name: 'birthdate',
      elementType: 'date',
      elementConfig: {
        placeholder: 'Select your birthdate',
      },
      label: 'Birth Date',
      value: '',
      validation: new ChocoValidation({
        required: true,
        isDate: true,
      }),
    }),
    
    // Select dropdown
    country: new ChocoControl({
      name: 'country',
      elementType: 'select',
      elementConfig: {
        placeholder: 'Select your country',
      },
      label: 'Country*',
      value: '',
      text: '',
      options: [
        new ChocoOption({ id: 'us', text: 'United States' }),
        new ChocoOption({ id: 'ca', text: 'Canada' }),
        new ChocoOption({ id: 'mx', text: 'Mexico' }),
        new ChocoOption({ id: 'uk', text: 'United Kingdom' }),
      ],
      validation: new ChocoValidation({
        required: true,
      }),
    }),
    
    // Checkbox input
    termsAccepted: new ChocoControl({
      name: 'termsAccepted',
      elementType: 'checkbox',
      elementConfig: {},
      label: 'I accept the terms and conditions',
      value: false,
      validation: new ChocoValidation({
        required: true,
      }),
    }),
    
    // Slider input
    satisfaction: new ChocoControl({
      name: 'satisfaction',
      elementType: 'slider',
      elementConfig: {
        minimumValue: 0,
        maximumValue: 10,
        step: 1,
      },
      label: 'Satisfaction Level (0-10)',
      value: 5,
      validation: new ChocoValidation({}),
    }),
    
    // Score/rating input
    rating: new ChocoControl({
      name: 'rating',
      elementType: 'score',
      elementConfig: {
        maxScore: 5,
      },
      label: 'Rating',
      value: 0,
      validation: new ChocoValidation({
        required: true,
      }),
    }),
    
    // Phone input with phone validation
    phone: new ChocoControl({
      name: 'phone',
      elementType: 'input',
      elementConfig: {
        placeholder: 'Enter your phone number',
        keyboardType: 'phone-pad',
      },
      label: 'Phone Number*',
      value: '',
      validation: new ChocoValidation({
        required: true,
        isPhone: true,
      }),
    }),
  });

  const [form, setForm] = useState(initialForm);
  const [formData, setFormData] = useState({});

  const handleFormChange = (updatedForm) => {
    setForm(updatedForm);
  };

  const handleSubmit = () => {
    if (form.isValidForm) {
      const data = {};
      Object.keys(form.controls).forEach(key => {
        data[key] = form.controls[key].value;
      });
      setFormData(data);
      alert('Form submitted successfully!');
    } else {
      alert('Please fix the errors in the form before submitting.');
    }
  };

  const resetForm = () => {
    setForm(initialForm);
    setFormData({});
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.title}>ChocoFormTS Example</Text>
      <Text style={styles.subtitle}>Demonstrating all input types</Text>
      
      <ScrollView style={styles.formContainer}>
        <ChocoFormTS
          form={form}
          onFormChange={handleFormChange}
          lang="en"
          inputStyle={styles.input}
          inputStyleTouched={styles.inputTouched}
          inputStyleBlured={styles.inputBlured}
        />
        
        <View style={styles.buttonContainer}>
          <Button title="Submit Form" onPress={handleSubmit} disabled={!form.isValidForm} />
          <Button title="Reset Form" onPress={resetForm} color="#888" />
        </View>
        
        {Object.keys(formData).length > 0 && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>Form Data:</Text>
            {Object.keys(formData).map(key => (
              <Text key={key} style={styles.resultText}>
                {key}: {typeof formData[key] === 'boolean' 
                  ? formData[key] ? 'Yes' : 'No' 
                  : String(formData[key])}
              </Text>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  formContainer: {
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  inputTouched: {
    borderColor: '#007bff',
  },
  inputBlured: {
    borderColor: '#ddd',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  resultContainer: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  resultText: {
    fontSize: 14,
    marginBottom: 5,
  },
});