import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import Select from 'react-select';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Row, Col, Container, Card, CardHeader, CardBody } from 'reactstrap';
import { Helmet } from 'react-helmet';
import urls from 'api/urls';
import { generateHeaders } from 'api/headers';
import { useSelector } from 'react-redux';
import TimelineHeader from '../../components/Elevatus/TimelineHeader';
import Loader from '../../components/Elevatus/Loader';
import Helpers from '../../utils/Helpers';

const ValidationSchema = Yup.object().shape({
  web_site: Yup.string().required('web_site'),
  country_id: Yup.string().required('country_id'),
  industry_id: Yup.string().required('industry_id'),
  company_size_id: Yup.string().required('company_size_id'),
  about_us_id: Yup.string().required('about_us_id'),
  city: Yup.string().required('city'),
  mobile: Yup.string().min(12).required('mobile'),
  company_name: Yup.string().required('company_name'),
});

const CompanyDetails = (props) => {
  const user = JSON.parse(localStorage.getItem('user'))?.results;
  const companyId = useSelector((state) => state?.companyIdReducer);
  const formik = useFormik({
    initialValues: {
      web_site: '',
      country_id: '',
      industry_id: '',
      company_size_id: '',
      about_us_id: '',
      city: '',
      mobile: '',
      company_name: '',
      errors: [],
    },
    onSubmit: () => handleSubmits(),
    validationSchema: ValidationSchema,
  });

  const { errors, touched, values, handleChange, handleSubmit, setFieldValue }
    = formik;

  const [state, setState] = useState({
    type: '',
    message: '',
    loadingSave: false,
    country: [],
    employees: [],
    industry: [],
    aboutUs: [],
    user,
  });

  useEffect(() => {
    getCountries(state.user);
    getEmpolyess(state.user);
    getIndustries(state.user);
  }, []);

  const getCountries = async (user) => {
    const finder = await Axios.all([
      Axios.get(`${Helpers.GET_COUNTRIES}`, {
        headers: generateHeaders(),
      }),
      Axios.get(`${Helpers.ABOUT_US}`, {
        headers: generateHeaders(),
      }),
    ]);
    if (finder[0].data.statusCode === 200 && finder[1].data.statusCode === 200)
      setState((prevState) => ({
        ...prevState,
        country: finder[0].data.results,
        aboutUs: finder[1].data.results,
      }));
  };

  const getEmpolyess = async (user) => {
    const employees = await Axios.get(`${Helpers.COMPANY_EMPLOYEES}`, {
      headers: generateHeaders(),
    });
    if (employees.data.statusCode === 200)
      setState((prevState) => ({
        ...prevState,
        employees: employees.data.results,
      }));
  };

  const getIndustries = async (user) => {
    const industry = await Axios.get(`${Helpers.INDUSTRY}`, {
      headers: generateHeaders(),
    });
    if (industry.data.statusCode === 200)
      setState((prevState) => ({
        ...prevState,
        industry: industry.data.results,
      }));
  };

  const handleSubmits = async () => {
    setState((prevState) => ({ ...prevState, loadingSave: true }));
    await Axios.post(
      urls.auth.SET_COMPANY_DETAILS,
      {
        ...values,
      },
      {
        headers: generateHeaders(),
      },
    )
      .then(({ data }) => {
        setState((prevState) => ({
          ...prevState,
          type: 'success',
          loadingSave: false,
          message: 'Welcome',
        }));
        user.list_company.push({
          id: companyId || localStorage.getItem('company_id'),
          name: values.company_name,
          url: values.web_site,
          company_user_status: true,
          status: true,
        });
        props.history.push('../recruiter/overview');
      })
      .catch((error) => {
        setState((prevState) => ({
          ...prevState,
          type: 'error',
          message: error.response.data.message,
          loadingSave: false,
          errors: error.response.data.errors,
        }));
      });
  };

  const TITLE = 'Company Details';
  return (
    <>
      <Helmet>
        <title>{TITLE}</title>
      </Helmet>
      <TimelineHeader name="Company Details" parentName="Company" />

      {state.loading ? (
        <Loader />
      ) : (
        <Container className=" m-t-5 pb-4 flex-mobile-row-reverse-2 mt--6">
          <Card>
            <CardHeader>
              <h3 className="font-16">Set Your Company Details</h3>
            </CardHeader>
            <CardBody>
              <Container>
                <div className="card-md-deck ">
                  {state.type === 'success' ? (
                    <div className="alert alert-success">{state.message}</div>
                  ) : state.type === 'error' ? (
                    <div className="alert alert-danger">Something went wrong</div>
                  ) : null}
                  <div className="row">
                    <div className="col">
                      <div className="form-group">
                        <div className="input-group input-group-merge input-group-alternative mb-3">
                          <div className="input-group-prepend">
                            <span className="input-group-text">
                              <i className="far fa-building" />
                            </span>
                          </div>
                          <input
                            className="form-control"
                            placeholder="Company Name"
                            type="text"
                            name="company_name"
                            value={values.company_name}
                            onChange={handleChange}
                          />
                        </div>
                        {errors.company_name && touched.company_name && (
                          <span className="font-12 text-danger">
                            Company required
                          </span>
                        )}
                        {state.errors && state.errors.company_name ? (
                          state.errors.company_name.length > 1 ? (
                            state.errors.company_name.map((error, key) => (
                              <p className="m-0 text-xs text-danger" key={key}>
                                {error}
                              </p>
                            ))
                          ) : (
                            <p className="m-o text-xs text-danger">
                              {state.errors.company_name}
                            </p>
                          )
                        ) : (
                          ''
                        )}
                      </div>
                    </div>
                    <div className="col">
                      <div className="form-group">
                        <div className="input-group input-group-merge input-group-alternative mb-3">
                          <div className="input-group-prepend">
                            <span className="input-group-text">
                              <i className="fas fa-phone" />
                            </span>
                          </div>
                          <input
                            className="form-control"
                            placeholder="Mobile"
                            type="text"
                            name="mobile"
                            value={values.mobile}
                            onChange={handleChange}
                          />
                        </div>
                        {errors.mobile && touched.mobile && (
                          <span className="font-12 text-danger">Mobile 962***</span>
                        )}
                        {state.errors && state.errors.mobile ? (
                          state.errors.mobile.length > 1 ? (
                            state.errors.mobile.map((error, key) => (
                              <p className="m-0 text-xs text-danger" key={key}>
                                {error}
                              </p>
                            ))
                          ) : (
                            <p className="m-o text-xs text-danger">
                              {state.errors.mobile}
                            </p>
                          )
                        ) : (
                          ''
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="input-group input-group-merge input-group-alternative mb-3">
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          <i className="ni ni-hat-3" />
                        </span>
                      </div>
                      <input
                        className="form-control"
                        placeholder="Web Site"
                        type="text"
                        name="web_site"
                        value={values.web_site}
                        onChange={handleChange}
                      />
                    </div>
                    {errors.web_site && touched.web_site && (
                      <span className="font-12 text-danger">Web site required</span>
                    )}
                    {state.errors && state.errors.web_site ? (
                      state.errors.web_site.length > 1 ? (
                        state.errors.web_site.map((error, key) => (
                          <p className="m-0 text-xs text-danger" key={key}>
                            {error}
                          </p>
                        ))
                      ) : (
                        <p className="m-o text-xs text-danger">
                          {state.errors.web_site}
                        </p>
                      )
                    ) : (
                      ''
                    )}
                  </div>
                  <Row>
                    <Col xl={6}>
                      <div className="form-group mt-2">
                        <Select
                          onChange={(e) => setFieldValue('country_id', e.value)}
                          defaultValue={values.country_id}
                          placeholder="Select Country ..."
                          options={state.country.map((country) => ({
                            label: country.name,
                            value: country.id,
                          }))}
                        />
                        {errors.country_id && touched.country_id && (
                          <span className="font-12 text-danger">
                            Country required
                          </span>
                        )}
                        {state.errors && state.errors.country_id ? (
                          state.errors.country_id.length > 1 ? (
                            state.errors.country_id.map((error, key) => (
                              <p className="m-0 text-xs text-danger" key={key}>
                                {error}
                              </p>
                            ))
                          ) : (
                            <p className="m-o text-xs text-danger">
                              {state.errors.country_id}
                            </p>
                          )
                        ) : (
                          ''
                        )}
                      </div>
                    </Col>
                    <Col xl={6}>
                      <div className="form-group mt-2">
                        <div className="input-group input-group-merge input-group-alternative mb-3">
                          <div className="input-group-prepend">
                            <span className="input-group-text">
                              <i className="fas fa-city" />
                            </span>
                          </div>
                          <input
                            className="form-control"
                            placeholder="City"
                            type="text"
                            name="city"
                            value={values.city}
                            onChange={handleChange}
                          />
                        </div>
                        {errors.city && touched.city && (
                          <span className="font-12 text-danger">City required</span>
                        )}
                        {state.errors && state.errors.city ? (
                          state.errors.city.length > 1 ? (
                            state.errors.city.map((error, key) => (
                              <p className="m-0 text-xs text-danger" key={key}>
                                {error}
                              </p>
                            ))
                          ) : (
                            <p className="m-o text-xs text-danger">
                              {state.errors.city}
                            </p>
                          )
                        ) : (
                          ''
                        )}
                      </div>
                    </Col>
                  </Row>

                  <Row>
                    <Col xl={6}>
                      <div className="form-group mt-2">
                        <Select
                          onChange={(e) => setFieldValue('company_size_id', e.value)}
                          placeholder="Select Number Of employees ..."
                          options={state.employees.map((employees) => ({
                            label: employees.title,
                            value: employees.id,
                          }))}
                        />
                        {errors.company_size_id && touched.company_size_id && (
                          <span className="font-12 text-danger">
                            Number of employees required
                          </span>
                        )}
                        {state.errors && state.errors.company_size_id ? (
                          state.errors.company_size_id.length > 1 ? (
                            state.errors.company_size_id.map((error, key) => (
                              <p className="m-0 text-xs text-danger" key={key}>
                                {error}
                              </p>
                            ))
                          ) : (
                            <p className="m-o text-xs text-danger">
                              {state.errors.company_size_id}
                            </p>
                          )
                        ) : (
                          ''
                        )}
                      </div>
                    </Col>
                    <Col xl={6}>
                      <div className="form-group mt-2">
                        <Select
                          onChange={(e) => setFieldValue('industry_id', e.value)}
                          placeholder="Select Industry ..."
                          options={state.industry.map((industry) => ({
                            label: industry.title,
                            value: industry.id,
                          }))}
                        />
                        {errors.industry_id && touched.industry_id && (
                          <span className="font-12 text-danger">
                            Industry required
                          </span>
                        )}
                        {state.errors && state.errors.industry_id ? (
                          state.errors.industry_id.length > 1 ? (
                            state.errors.industry_id.map((error, key) => (
                              <p className="m-0 text-xs text-danger" key={key}>
                                {error}
                              </p>
                            ))
                          ) : (
                            <p className="m-o text-xs text-danger">
                              {state.errors.industry_id}
                            </p>
                          )
                        ) : (
                          ''
                        )}
                      </div>
                    </Col>
                  </Row>

                  <div className="form-group mt-2">
                    <Select
                      onChange={(e) => setFieldValue('about_us_id', e.value)}
                      placeholder="How do you hear about us  ..."
                      options={state.aboutUs.map((aboutUs) => ({
                        label: aboutUs.title,
                        value: aboutUs.id,
                      }))}
                    />
                    {errors.about_us_id && touched.about_us_id && (
                      <span className="font-12 text-danger">About us required</span>
                    )}
                    {state.errors && state.errors.about_us_id ? (
                      state.errors.about_us_id.length > 1 ? (
                        state.errors.about_us_id.map((error, key) => (
                          <p className="m-0 text-xs text-danger" key={key}>
                            {error}
                          </p>
                        ))
                      ) : (
                        <p className="m-o text-xs text-danger">
                          {state.errors.about_us_id}
                        </p>
                      )
                    ) : (
                      ''
                    )}
                  </div>

                  <div className="row">
                    <div className="col text-left" />
                    <div className="col text-right">
                      <button
                        onClick={handleSubmit}
                        type="button"
                        className="btn btn-outline-default  btn-sm my-4"
                      >
                        {'Save '}
                        {state.loadingSave && (
                          <i className="fas fa-circle-notch fa-spin" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </Container>
            </CardBody>
          </Card>
        </Container>
      )}
    </>
  );
};

export default CompanyDetails;
