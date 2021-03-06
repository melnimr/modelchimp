/**
 *
 * ExperimentDetailObjectPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import Section from 'components/Section';
import { Table } from 'antd';
import IdBlock from 'components/IdBlock';
import makeSelectExperimentDetailObjectPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import { loadExperimentObjectAction } from './actions';

import { EXPERIMENT_TAB_OBJECTS } from '../ExperimentDetail/constants';
import { onExperimentTabSelect } from '../ExperimentDetail/actions';

/* eslint-disable react/prefer-stateless-function */
export class ExperimentDetailObjectPage extends React.Component {
  componentDidMount() {
    this.modelId = this.props.match.params.modelId;
    this.columns = [
      {
        title: 'Object Name',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Id',
        dataIndex: 'custom_object_id',
        key: 'custom_object_id',
        render: text => <IdBlock copy={text} display={text} />,
      },
    ];

    this.props.onExperimentTabSelect(EXPERIMENT_TAB_OBJECTS);
    this.props.getExperimentObjectData(this.modelId);
  }

  render() {
    return (
      <Section name="Objects"
        description="Store Python objects from an experiment which can be reused later"
        >
        <Table
          columns={this.columns}
          dataSource={this.props.objectData}
          rowKey="id"
        />
      </Section>
    );
  }
}

ExperimentDetailObjectPage.propTypes = {
  getExperimentObjectData: PropTypes.func.isRequired,
  objectData: PropTypes.array,
  match: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  objectData: makeSelectExperimentDetailObjectPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    getExperimentObjectData: modelId =>
      dispatch(loadExperimentObjectAction(modelId)),
    onExperimentTabSelect: tabKey =>
      dispatch(onExperimentTabSelect(tabKey)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({
  key: 'experimentDetailObjectPage',
  reducer,
});
const withSaga = injectSaga({ key: 'experimentDetailObjectPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(ExperimentDetailObjectPage);
