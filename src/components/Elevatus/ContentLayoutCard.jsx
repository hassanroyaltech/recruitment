import React from 'react';

export function ContentLayoutCard(props) {
  return (
    <li className="border mt-2 mb-2 p-3 rounded move_cursor" id={props.id}>
      <i className="fas fa-arrows-alt  mr-1 ml-1" />
      <span className="ml-2">{props.name}</span>
      <i
        className={
          props.visible
            ? 'Cursor fa  float-lg-right fa-eye'
            : ' Cursor fa  float-lg-right fa-eye-slash'
        }
        onClick={(e) => props.onClick(e)}
      />

      <input
        type="hidden"
        name="general_section_status"
        id="general_section_status"
        value="1"
      />
    </li>
  );
}
