import { connect } from 'react-redux';
import Fixture from '../pages/Fixture';

const mapStateToProps = (state, ownProps) => {

  return {

  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
  };
};

const FixtureContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Fixture);

export default FixtureContainer;