// React and reactstrap
import React from 'react';

/**
 * Due to the way this was built, it was an empy modal with nothing in there used
 * as a placeholder for the 'Recent Openings' section which is not editable.
 *
 * So I deleted everything and returned an empty <React.Fragment /> because
 * otherwise the functionality will break.
 *
 * @returns {JSX.Element}
 * @constructor
 */
const RecentOpeningsModal = () => <React.Fragment />;

export default RecentOpeningsModal;
