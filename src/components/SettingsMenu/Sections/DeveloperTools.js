import React, { useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withHandlers, compose } from 'recompose';
import { push } from 'connected-react-router';
import { motion } from 'framer-motion';
import { Button } from '@codaco/ui/lib/components';
import { Number } from '@codaco/ui/lib/components/Fields';
import { actionCreators as importProtocolActions } from '../../../ducks/modules/importProtocol';
import { actionCreators as dialogsActions } from '../../../ducks/modules/dialogs';
import { actionCreators as mockActions } from '../../../ducks/modules/mock';
import { getAdditionalAttributesForCurrentPrompt, getNodeEntryForCurrentPrompt } from '../../../selectors/session';
import { DEVELOPMENT_PROTOCOL_URL } from '../../../config';
import TabItemVariants from './TabItemVariants';

const DeveloperTools = (props) => {
  const {
    installedProtocols,
    handleResetAppData,
    handleAddMockNodes,
    shouldShowMocksItem,
    importProtocolFromURI,
    generateMockSessions,
  } = props;

  const [sessionCount, setSessionCount] = useState(10);
  const [selectedProtocol, setSelectedProtocol] = useState('');

  return (
    <React.Fragment>
      <motion.article variants={TabItemVariants} className="settings-element">
        <div className="form-field-container">
          <div className="form-field">
            <Button
              id="reset-all-nc-data"
              color="neon-coral"
              onClick={handleResetAppData}
            >
              Reset data
            </Button>
          </div>
        </div>
        <div>
          <h2>Reset All App Data</h2>
          <p>
            Click the button above to reset all Network Canvas data. This will erase any
            in-progress interviews, and all application settings.
          </p>
        </div>
      </motion.article>
      {
        shouldShowMocksItem &&
        <motion.article variants={TabItemVariants} className="settings-element">
          <div className="form-field-container">
            <div className="form-field">
              <Button
                id="add-mock-nodes"
                onClick={handleAddMockNodes}
              >
                Add nodes
              </Button>
            </div>
          </div>
          <div>
            <h2>Add Mock Nodes</h2>
            <p>
              During an active interview session, clicking this button will create
              mock nodes for testing purposes.
            </p>
          </div>
        </motion.article>
      }
      <motion.article variants={TabItemVariants} className="settings-element">
        <div className="form-field-container">
          <div className="form-field">
            <Button
              onClick={() => importProtocolFromURI(DEVELOPMENT_PROTOCOL_URL)}
            >
              Import
            </Button>
          </div>
        </div>
        <div>
          <h2>Import Development Protocol</h2>
          <p>
            Clicking this button will import the latest development protocol for this
            version of Network Canvas.
          </p>
        </div>
      </motion.article>
      <motion.article variants={TabItemVariants} className="settings-element--sub-item">
        <div>
          <h2>Generate test sessions</h2>
          <p>
            This function creates dummy data for testing export code and device performance.
          </p>
        </div>
        <h4>Use protocol</h4>
        <div className="form-field-container">
          <div className="form-field">
            <select
              name="selectedProtocol"
              className="select-css"
              value={selectedProtocol}
              onChange={(e) => { setSelectedProtocol(e.target.value); }}
            >
              <option value="">-- Select a protocol ---</option>
              {
                Object.keys(installedProtocols).map(protocolId => (
                  <option
                    value={protocolId}
                    key={protocolId}
                  >
                    {installedProtocols[protocolId].name}
                  </option>
                ))
              }
            </select>
          </div>
        </div>
        <h4>Number of sessions</h4>
        <Number
          input={{
            value: sessionCount,
            onChange: e => setSessionCount(e),
            validation: {
              required: true,
              minValue: 1,
            },
          }}
          name="sessionCount"
        />
        <Button
          disabled={!selectedProtocol}
          onClick={() => {
            generateMockSessions(
              selectedProtocol,
              installedProtocols[selectedProtocol],
              sessionCount,
            );
          }}
        >
          Generate
        </Button>
      </motion.article>
    </React.Fragment>
  );
};

const developerToolsHandlers = withHandlers({
  handleAddMockNodes: props => () => {
    if (!props.nodeVariableEntry) {
      return;
    }
    const [typeKey, nodeDefinition] = props.nodeVariableEntry;
    props.generateMockNodes(nodeDefinition.variables, typeKey, 20, props.additionalMockAttributes);
    props.closeMenu();
  },
  handleResetAppData: props => () => {
    props.openDialog({
      type: 'Warning',
      title: 'Reset application data?',
      message: 'This will delete ALL data from Network Canvas, including interview data and settings. Do you wish to continue?',
      onConfirm: () => {
        props.resetState();
      },
      confirmLabel: 'Continue',
    });
  },
});

const mapDispatchToProps = dispatch => ({
  generateMockNodes: bindActionCreators(mockActions.generateMockNodes, dispatch),
  generateMockSessions: bindActionCreators(mockActions.generateMockSessions, dispatch),
  importProtocolFromURI: bindActionCreators(importProtocolActions.importProtocolFromURI, dispatch),
  openDialog: bindActionCreators(dialogsActions.openDialog, dispatch),
  resetState: () => dispatch(push('/reset')),
});

const mapStateToProps = state => ({
  installedProtocols: state.installedProtocols,
  nodeVariableEntry: getNodeEntryForCurrentPrompt(state),
  shouldShowMocksItem: !!getNodeEntryForCurrentPrompt(state),
  additionalMockAttributes: getAdditionalAttributesForCurrentPrompt(state),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  developerToolsHandlers,
)(DeveloperTools);
