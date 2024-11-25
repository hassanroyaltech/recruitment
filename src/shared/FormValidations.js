import * as Yup from 'yup';
import React from 'react';

// <!- Yup Local ->
Yup.setLocale({
  mixed: {
    required: 'Required',
  },
  string: {
    email: 'Enter a valid email',
  },
});
// <!- Yup Local ->

// <- Users Forms ->

export const UserModalSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(3, 'First name must be at least 3 characters!')
    .max(50, 'First name must be at most 50 characters!')
    .required(),
  lastName: Yup.string()
    .min(3, 'Last name must be at least 3 characters!')
    .max(50, 'Last name must be at most 50 characters!')
    .required(),
  email: Yup.string().email().required(),
  permission: Yup.string().required(),
});

// <- Users Forms ->

// <- Questionnaire Forms ->

export const QuestionnaireModalSchema = Yup.object().shape({
  questionnaireName: Yup.string()
    .min(3, 'Questionnaire name must be at least 3 characters!')
    .max(50, 'Questionnaire name must be at most 50 characters!')
    .required(),
  questionnaireLanguage: Yup.string().required(),
  pipeline: Yup.string().required(),
  emailTemplate: Yup.string(),
  emailSubject: Yup.string().required(),
  emailBody: Yup.string().required(),
});

// <- Questionnaire Forms ->

export const ErrorWrapper = ({ children }) => (
  <div className="invalid-feedback">{children}</div>
);

// <- Offer Forms ->

export const OfferModalSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, 'Offer name must be at least 3 characters!')
    .max(50, 'Offer name must be at most 50 characters!')
    .required(),
  reference_number: Yup.string().nullable(),
});

// <- Offer Forms ->
