import React, { useState } from 'react';
import Axios from 'axios';
import AsyncCreatableSelect from 'react-select/async-creatable/dist/react-select.esm';
import urls from 'api/urls';
import { generateHeaders } from 'api/headers';

export function AddCandidate(props) {
  const [loading, setLoading] = useState(true);

  const [state, setState] = useState({
    user: JSON.parse(localStorage.getItem('user'))?.results,
    pageIndex: 1,
    maxPerPage: 50,
    candidates:
      props.candidates && (props.candidates.first_name || props.candidates.title)
        ? {
          label: props.candidates?.first_name
            ? `${props.candidates?.first_name} ${props.candidates.last_name}`
            : props.candidates?.title,
          value: props.candidates.uuid,
        }
        : [],
  });
  const handleInputChange = (newValue) => {
    props.handleChange(newValue);
  };
  const getOptions = (inputValue, callback) => {
    if (!inputValue) return callback([]);

    const { user } = state;
    Axios.get(`${urls.evassess.CANDIDATE_SEARCH}`, {
      headers: generateHeaders(),
      params: {
        r: inputValue,
      },
    }).then((data) => {
      setState((prevState) => ({
        ...prevState,
        dropdownoptions: data.data.results
          ? data.data.results.map((user) => ({
            label: `${user?.first_name} ${user.last_name}`,
            value: user.uuid,
          }))
          : [],
      }));
      setLoading(false);
      callback(
        data.data.results
          ? data.data.results.map((user) => ({
            label: `${user?.first_name} ${user.last_name}`,
            value: user.uuid,
          }))
          : [],
      );
    });
  };
  return (
    <React.Fragment>
      <div className="form-group">
        <AsyncCreatableSelect
          cacheOptions
          isDisabled={state.candidates.label || state.candidates.length > 0}
          defaultValue={state.candidates}
          placeholder="Enter candidate name "
          defaultOptions={state.dropdownoptions}
          loadOptions={getOptions}
          onChange={handleInputChange}
        />
      </div>
    </React.Fragment>
  );
}
