import * as yup from 'yup';

yup.setLocale({
  mixed: {
    required: () => ({ value: 'formValidation.required' }),
  },
  string: {
    email: () => ({ value: 'formValidation.email' }),
    min: ({ min }) => ({ value: 'formValidation.stringMin', args: { min } }),
    max: ({ max }) => ({ value: 'formValidation.stringMax', args: { max } }),
  },
  date: {
    min: ({ min }) => ({ value: 'formValidation.dateMin', args: { min } }),
    max: ({ max }) => ({ value: 'formValidation.dateMax', args: { max } }),
  },
  number: {
    positive: () => ({ value: 'formValidation.numberPositive' }),
    integer: () => ({ value: 'formValidation.numberInteger' }),
    min: ({ min }) => ({ value: 'formValidation.numberMin', args: { min } }),
    max: ({ max }) => ({ value: 'formValidation.numberMax', args: { max } }),
  },
  array: {
    min: ({ min }) => ({ value: 'formValidation.arrayMin', args: { min } }),
    max: ({ max }) => ({ value: 'formValidation.arrayMax', args: { max } }),
  },
});

export * from 'yup';
