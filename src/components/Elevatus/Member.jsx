import React from 'react';

export const Member = ({ itemData: { title, first_name, last_name } }) => (
  <li className="list-group-item px-0">
    <div className="row align-items-center">
      <div className="col-auto">
        <div className="avatar rounded-circle">{`${first_name[0].toUpperCase()}${last_name[0].toUpperCase()}`}</div>
      </div>
      <div className="col ml--2">
        <h4 className="mb-0">{title}</h4>
      </div>
    </div>
  </li>
);
