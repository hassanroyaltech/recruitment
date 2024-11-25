import React, { useEffect, useState } from 'react';
import { Col, Row } from 'reactstrap';
import { useFormik } from 'formik';
import Axios from 'axios';
import AsyncCreatableSelect from 'react-select/async-creatable/dist/react-select.esm';
import urls from 'api/urls';
import { generateHeaders } from 'api/headers';

export function AddRecruiter(props) {
  const [Options, setOption] = useState([]);
  const [loading, setLoading] = useState(true);

  const [state, setState] = useState({
    user: JSON.parse(localStorage.getItem('user'))?.results,
    pageIndex: 1,
    maxPerPage: 50,
    recruiters: props.recruiters
      ? props.recruiters.map((user) => ({
        label: `${user?.first_name} ${user.last_name}`,
        value: user.uuid,
      }))
      : [],
  });
  const formik = useFormik({
    initialValues: {
      team: [],
    },
    onSubmit: () => {},
  });

  const { values, setFieldValue } = formik;
  const getInfo = async (newValue) => {
    const { user } = state;
    const getOptions = await Axios.get(`${urls.evassess.TEAM_SEARCH}`, {
      headers: generateHeaders(),
      params: {
        name: newValue,
      },
    });
    if (getOptions.status === 200) {
      setOption(getOptions.data.results);
      setLoading(false);
    }
  };

  useEffect(() => {
    getInfo('');
  }, []);

  const handleInputChange = (newValue) => {
    props.handleChange(newValue);
  };

  const filterUsers = (inputValue: string) => state.options.filter((i) => i.label.toLowerCase().includes(inputValue.toLowerCase()));

  const promiseOptions = (inputValue) => new Promise((resolve) => {
    setTimeout(() => {
      resolve(filterUsers(inputValue));
    }, 1000);
  });
  return (
    <React.Fragment>
      {loading ? (
        <React.Fragment>
          <Row>
            <Col xl={12} xs={12} md={12}>
              <i className="fas fa-circle-notch fa-spin mr-2" />
              <span>loading members...</span>
            </Col>
          </Row>
        </React.Fragment>
      ) : (
        <div className="form-group">
          <AsyncCreatableSelect
            isMulti
            placeholder="Enter team/member name "
            defaultOptions={Options}
            defaultValue={state.recruiters}
            loadOptions={promiseOptions}
            onChange={handleInputChange}
          />
        </div>
      )}
    </React.Fragment>
  );
}
