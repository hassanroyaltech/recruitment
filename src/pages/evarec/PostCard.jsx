// React
import { connect } from 'react-redux';

/**
 * Not Yet Defined
 * @param props
 * @returns {null}
 * @constructor
 */
const PremiumCard = (props) => null;

/**
 * Map state to various props
 * @param state
 * @returns {{configs: *, account: *}}
 */
const mapStateToProps = (state) => ({
  account: state.Account,
  configs: state.Configs,
});

export default connect(mapStateToProps)(PremiumCard);
