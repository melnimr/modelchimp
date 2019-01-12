import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import HeaderWrapper from 'containers/HeaderWrapper';
import { Layout, Menu, Breadcrumb } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import IdBlock from 'components/IdBlock';
import Content from 'components/Content';
import { Link } from 'react-router-dom';
import saga from './saga';
import reducer from './reducer';
import {
  makeSelectExperimentDetail,
  makeSelectExperimentId,
  makeSelectShortExperimentId,
  makeSelectExperimentName,
} from './selectors';

import { loadExperimentDetailAction } from './actions';

const { Sider } = Layout;

/* eslint-disable react/prefer-stateless-function */
export class ExperimentDetail extends React.Component {
  componentDidMount() {
    const {modelId} = this.props;
    this.props.getExperimentMetaData(modelId);
  }

  render() {
    const selected = this.props.selectedKeys
      ? [this.props.selectedKeys]
      : ['1'];

    return (
      <Layout>
        <Helmet>
          <title>ExperimentDetail</title>
          <meta name="description" content="Description of ExperimentDetail" />
        </Helmet>
        <HeaderWrapper />
        <Layout>
          <Sider
            width={200}
            style={{
              background: '#fff',
              position: 'fixed',
              marginTop: 64,
              zIndex: 200,
              height: '100vh',
            }}
          >
            <Menu
              mode="inline"
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['sub1']}
              style={{ height: '100%', borderRight: 0 }}
              selectedKeys={selected}
            >
              <Menu.Item key="1">
                <Link to={`/experiment-detail/${this.props.modelId}`}>
                  <FontAwesomeIcon icon="greater-than-equal" /> Metrics
                </Link>
              </Menu.Item>
              <Menu.Item key="2">
                <Link to={`/experiment-detail/${this.props.modelId}/parameter`}>
                  <FontAwesomeIcon icon="list-ol" /> Parameters
                </Link>
              </Menu.Item>
              <Menu.Item key="3">
                <Link to={`/experiment-detail/${this.props.modelId}/code`}>
                  <FontAwesomeIcon icon="file-code" /> Code
                </Link>
              </Menu.Item>
              <Menu.Item key="4">
                <Link to={`/experiment-detail/${this.props.modelId}/chart`}>
                  <FontAwesomeIcon icon="chart-line" /> Charts
                </Link>
              </Menu.Item>
              <Menu.Item key="5">
                <Link to={`/experiment-detail/${this.props.modelId}/object`}>
                  <FontAwesomeIcon icon="grip-horizontal" /> Objects
                </Link>
              </Menu.Item>
              <Menu.Item key="6">
                <Link
                  to={`/experiment-detail/${this.props.modelId}/gridsearch`}
                >
                  <FontAwesomeIcon icon="grip-horizontal" /> Grid Search
                </Link>
              </Menu.Item>
            </Menu>
          </Sider>
          <Content style={{ marginLeft: 200 }}>
            <h1 />

            <div style={{ marginTop: '50px' }}>
              <Breadcrumb separator=">">
                <Breadcrumb.Item>
                  <Link to="/projects">Projects</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                  <Link
                    to={`/experiment-list/${this.props.experiment.project}`}
                  >
                    {this.props.experiment.project_name}
                  </Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                  <Link to={`/experiment-detail/${this.props.experiment.id}`}>
                    {this.props.experimentName}
                  </Link>
                </Breadcrumb.Item>
              </Breadcrumb>
              <div style={{ marginTop: '20px' }}>
                <h2>Experiment Name: {this.props.experimentName}</h2>
                <IdBlock
                  copy={this.props.experimentId}
                  display={this.props.shortExperimentId}
                />
                {this.props.children}
              </div>
            </div>
          </Content>
        </Layout>
      </Layout>
    );
  }
}

ExperimentDetail.propTypes = {
  experiment: PropTypes.object,
  getExperimentMetaData: PropTypes.func,
  experimentName: PropTypes.string,
  experimentId: PropTypes.string,
  modelId: PropTypes.string,
  selectedKeys: PropTypes.array,
  shortExperimentId: PropTypes.string,
  children: PropTypes.array,
};

const mapStateToProps = createStructuredSelector({
  experiment: makeSelectExperimentDetail(),
  experimentId: makeSelectExperimentId(),
  shortExperimentId: makeSelectShortExperimentId(),
  experimentName: makeSelectExperimentName(),
});

function mapDispatchToProps(dispatch) {
  return {
    getExperimentMetaData: modelId =>
      dispatch(loadExperimentDetailAction(modelId)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'experimentDetail', reducer });
const withSaga = injectSaga({ key: 'experimentDetail', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(ExperimentDetail);
