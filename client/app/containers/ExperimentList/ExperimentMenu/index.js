/**
 *
 * Experiment Menu
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
import { Modal, Menu, Icon, Button, Transfer } from 'antd';
import { Link } from 'react-router-dom';
import {
  makeSelectExperimentMenuParameter,
  makeSelectExperimentMenuMetric,
  makeSelectTargetKeys,
  makeSelectTargetMetricKeys,
  makeSelectMenuKey,
  makeSelectDeleteVisible,
} from './selectors';
import reducer from './reducer';
import saga from './saga';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  loadMenuParameterAction,
  setTargetKeysAction,
  setMetricTargetKeysAction,
  onMenuSelectionAction,
  onDeleteClickAction,
} from './actions';

import { setExperimentColumnAction,
          clearDeleteExperimentsAction,
          submitDeleteExperimentsAction } from '../actions';
import {
  MENU_EXPERIMENT,
  MENU_SETTING,
  MENU_CUSTOMIZE_TABLE,
} from './constants';

class ExperimentMenu extends React.Component {
  state = {
    visible: false,
  };

  componentDidMount() {
    const { projectId } = this.props;
    this.props.getExperimentMenuParameterData(projectId);
  }

  handleClick = e => {
    const key = e.key === MENU_CUSTOMIZE_TABLE ? MENU_EXPERIMENT : e.key;

    this.props.onMenuSelection(key);
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = () => {
    this.setState({
      visible: false,
    });

    this.props.setExperimentColumn(
      this.props.targetKeys,
      this.props.targetMetricKeys,
      this.props.projectId,
    );
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  parseData = data => {
    const paramData = [];

    for (let i = 0; i < data.length; i += 1) {
      const result = {
        key: i.toString(),
        title: data[i].parameter,
        description: data[i].parameter,
        chosen: Math.random() * 2 > 1,
      };

      paramData.push(result);
    }

    return paramData;
  };

  handleParamChange = targetKeys => {
    this.props.setTargetKeys(targetKeys);
  };

  handleMetricChange = targetMetricKeys => {
    this.props.setTargetMetricKeys(targetMetricKeys);
  };

  handleDelete = () => {
    this.props.onDeleteClickAction();
    this.props.clearDeleteExperimentsAction();
  }

  handleRemoveSubmit = () => {
    this.props.submitDeleteExperimentsAction(this.props.projectId);
    this.props.clearDeleteExperimentsAction();
  }

  render() {
    return (
      <Menu
        className={this.props.className}
        onClick={this.handleClick}
        selectedKeys={[this.props.menuKey]}
        mode="horizontal"
        style={this.props.style}
      >
        <Menu.Item key={MENU_EXPERIMENT}>
          <Link to={`${this.props.url}`}>
            <Icon type="bars" /> Experiments
          </Link>
        </Menu.Item>
        <Menu.Item key={MENU_SETTING}>
          <Link to={`${this.props.url}/settings/details`}>
            <Icon type="setting" /> Settings
          </Link>
        </Menu.Item>

        {this.props.menuKey !== MENU_SETTING ? (
          <Menu.Item key={MENU_CUSTOMIZE_TABLE} style={{ float: 'right' }}>

            {
              this.props.deleteVisible ? <div>
              <Button type="primary" onClick={this.showModal}>
                <span>Customize Table</span>
              </Button>
              <Button type="danger" style={{left:'10px'}} onClick={this.handleDelete}>
                <FontAwesomeIcon icon="trash" />
              </Button>
              </div>
              : <div>
              <Button type="danger" onClick={this.handleRemoveSubmit}>
                <span>Remove</span>
              </Button>
              <Button type="primary" style={{left:'10px'}} onClick={this.handleDelete} >
                Cancel
              </Button>
              </div>
            }
            <Modal
              title="Columns"
              visible={this.state.visible}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
              style={{ textAlign: 'center' }}
            >
              <Section name="Metric" style={{ marginTop: '0px' }}>
                <Transfer
                  dataSource={this.props.menuMetric}
                  targetKeys={this.props.targetMetricKeys}
                  onChange={this.handleMetricChange}
                  render={item => item.title}
                />
              </Section>
              <Section name="Parameter">
                <Transfer
                  dataSource={this.props.menuParam}
                  targetKeys={this.props.targetKeys}
                  onChange={this.handleParamChange}
                  render={item => item.title}
                />
              </Section>
            </Modal>
          </Menu.Item>
        ) : null}
      </Menu>
    );
  }
}

ExperimentMenu.propTypes = {
  getExperimentMenuParameterData: PropTypes.func.isRequired,
  menuParam: PropTypes.array,
  menuMetric: PropTypes.array,
  targetKeys: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
  targetMetricKeys: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
  projectId: PropTypes.string,
  setExperimentColumn: PropTypes.func,
  setTargetKeys: PropTypes.func,
  setTargetMetricKeys: PropTypes.func,
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  style: PropTypes.object,
  onMenuSelection: PropTypes.func,
  menuKey: PropTypes.string,
  url: PropTypes.string,
};

const mapStateToProps = createStructuredSelector({
  menuParam: makeSelectExperimentMenuParameter(),
  menuMetric: makeSelectExperimentMenuMetric(),
  menuKey: makeSelectMenuKey(),
  targetKeys: makeSelectTargetKeys(),
  targetMetricKeys: makeSelectTargetMetricKeys(),
  deleteVisible: makeSelectDeleteVisible(),
});

function mapDispatchToProps(dispatch) {
  return {
    getExperimentMenuParameterData: projectId =>
      dispatch(loadMenuParameterAction(projectId)),
    setExperimentColumn: (columns, metricColumns, projectId) =>
      dispatch(setExperimentColumnAction(columns, metricColumns, projectId)),
    setTargetKeys: targetKeys => dispatch(setTargetKeysAction(targetKeys)),
    setTargetMetricKeys: targetMetricKeys =>
      dispatch(setMetricTargetKeysAction(targetMetricKeys)),
    onMenuSelection: menuKey => dispatch(onMenuSelectionAction(menuKey)),
    onDeleteClickAction: () => dispatch(onDeleteClickAction()),
    clearDeleteExperimentsAction: () => dispatch(clearDeleteExperimentsAction()),
    submitDeleteExperimentsAction: (projectId) => dispatch(submitDeleteExperimentsAction(projectId)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'experimentMenuParameter', reducer });
const withSaga = injectSaga({ key: 'experimentMenuParameter', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(ExperimentMenu);
