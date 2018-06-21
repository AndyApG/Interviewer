import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'react-router-redux';
import { Link, matchPath } from 'react-router-dom';
import { isEmpty } from 'lodash';

import { actionCreators as sessionActions } from '../../ducks/modules/session';
import { actionCreators as sessionsActions } from '../../ducks/modules/sessions';
import { CardList } from '../../components';

const shortUid = uid => (uid || '').replace(/-.*/, '');

const displayDate = timestamp => timestamp && new Date(timestamp).toLocaleString();

const oneBasedIndex = i => parseInt(i || 0, 10) + 1;

const pathInfo = (sessionPath) => {
  const info = { path: sessionPath };
  const matchedPath = matchPath(sessionPath, { path: '/session/:sessionId/:protocolType/:protocolId/:stageIndex' });
  if (matchedPath) {
    info.sessionId = matchedPath.params.sessionId;
    info.protocol = matchedPath.params.protocolId;
    info.protocolType = matchedPath.params.protocolType;
    info.stageIndex = matchedPath.params.stageIndex;
  }
  return info;
};

const emptyView = (
  <div className="session-list--empty">
    <h1 className="session-list__header">No previous interviews found</h1>
    <p>
      To begin one, select a protocol from <Link to="/">Start new interview</Link>,
      or import a protocol from Network Canvas Server by using the
      button in the lower-right corner of this screen.
    </p>
  </div>
);

/**
  * Display stored sessions
  */
class SessionList extends Component {
  onClickLoadSession = (session) => {
    const pathname = this.props.getSessionPath(session.uid);
    this.props.setSession(session.uid);
    this.props.loadSession(pathname);
  }

  render() {
    const { removeSession, sessions } = this.props;

    if (isEmpty(sessions)) {
      return emptyView;
    }

    // Display most recent first
    const sessionList = Object.keys(sessions).map(key => ({ uid: key, value: sessions[key] }));
    sessionList.sort((a, b) => b.value.updatedAt - a.value.updatedAt);

    return (
      <React.Fragment>
        <CardList
          compact
          multiselect={false}
          onDeleteCard={(data) => {
            // eslint-disable-next-line no-alert
            if (confirm('Delete this interview?')) {
              removeSession(data.uid);
            }
          }}
          label={sessionInfo => shortUid(sessionInfo.uid)}
          nodes={sessionList}
          onToggleCard={this.onClickLoadSession}
          details={(sessionInfo) => {
            const info = pathInfo(sessionInfo.value.path);
            const exportedAt = sessionInfo.value.lastExportedAt;
            const exportedDisplay = exportedAt ? new Date(exportedAt).toLocaleString() : 'never';
            return [
              { Protocol: shortUid(info.protocol) },
              { 'Last Changed': displayDate(sessionInfo.value.updatedAt) },
              { Stage: oneBasedIndex(info.stageIndex) },
              { Prompt: oneBasedIndex(sessionInfo.value.promptIndex) },
              { 'Number of Nodes': sessionInfo.value.network.nodes.length },
              { 'Number of Edges': sessionInfo.value.network.edges.length },
              { Exported: exportedDisplay },
            ];
          }}
        />
      </React.Fragment>
    );
  }
}

SessionList.propTypes = {
  getSessionPath: PropTypes.func.isRequired,
  loadSession: PropTypes.func.isRequired,
  removeSession: PropTypes.func.isRequired,
  sessions: PropTypes.object.isRequired,
  setSession: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    getSessionPath: sessionId => state.sessions[sessionId].path,
    sessions: state.sessions,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadSession: path => dispatch(push(path)),
    removeSession: bindActionCreators(sessionsActions.removeSession, dispatch),
    setSession: bindActionCreators(sessionActions.setSession, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SessionList);
