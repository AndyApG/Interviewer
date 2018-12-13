import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withHandlers, compose, withState } from 'recompose';
import PropTypes from 'prop-types';
import withPrompt from '../../behaviours/withPrompt';
import {
  PromptObstacle,
  ButtonObstacle,
} from '../../containers/Canvas';
import { ConcentricCircles } from '../../components/Canvas';
import { actionCreators as resetActions } from '../../ducks/modules/reset';

const withConnectFrom = withState('connectFrom', 'setConnectFrom', null);

const withConnectFromHandler = withHandlers({
  handleConnectFrom: ({ setConnectFrom }) =>
    id => setConnectFrom(id),
  handleResetConnectFrom: ({ setConnectFrom }) =>
    () => setConnectFrom(null),
});

const withResetInterfaceHandler = withHandlers({
  handleResetInterface: ({
    handleResetConnectFrom,
    resetPropertyForAllNodes,
    resetEdgesOfType,
    stage,
  }) => () => {
    handleResetConnectFrom();
    stage.prompts.forEach((prompt) => {
      resetPropertyForAllNodes(prompt.layout.layoutVariable);
      if (prompt.edges) {
        resetEdgesOfType(prompt.edges.creates);
      }
    });
  },
});

/**
  * Sociogram Interface
  * @extends Component
  */
const Sociogram = ({
  promptForward,
  promptBackward,
  prompt,
  stage,
  handleResetInterface,
  connectFrom,
  handleConnectFrom,
}) => {
  const subject = prompt.subject;
  const layoutVariable = prompt.layout && prompt.layout.layoutVariable;
  const highlight = prompt.highlight && prompt.highlight.variable;
  const allowHighlight = prompt.highlight && prompt.highlight.allowHighlight;
  const createEdge = prompt.edges && prompt.edges.create;
  const allowPositioning = prompt.layout && prompt.layout.allowPositioning;
  const displayEdges = (prompt.edges && prompt.edges.display) || [];
  const backgroundImage = prompt.background && prompt.background.image;
  const concentricCircles = prompt.background && prompt.background.concentricCircles;
  const skewedTowardCenter = prompt.background && prompt.background.skewedTowardCenter;
  const sortOrder = prompt.sortOrder;
  return (
    <div className="sociogram-interface">
      <PromptObstacle
        id="PROMPTS_OBSTACLE"
        className="sociogram-interface__prompts"
        forward={promptForward}
        backward={promptBackward}
        prompts={stage.prompts}
        prompt={prompt}
        floating
        minimizable
      />
      <div className="sociogram-interface__concentric-circles">
        <ConcentricCircles
          subject={subject}
          layoutVariable={layoutVariable}
          highlight={highlight}
          allowHighlight={allowHighlight}
          createEdge={createEdge}
          allowPositioning={allowPositioning}
          displayEdges={displayEdges}
          backgroundImage={backgroundImage}
          concentricCircles={concentricCircles}
          skewedTowardCenter={skewedTowardCenter}
          sortOrder={sortOrder}
          connectFrom={connectFrom}
          updateLinkFrom={handleConnectFrom}
          key={prompt.id}
        />
      </div>
      <div style={{ position: 'absolute', right: '3rem', bottom: '3rem' }}>
        <ButtonObstacle
          id="RESET_BUTTON_OBSTACLE"
          label="RESET"
          size="small"
          onClick={handleResetInterface}
        />
      </div>
    </div>
  );
};

Sociogram.propTypes = {
  stage: PropTypes.object.isRequired,
  prompt: PropTypes.object.isRequired,
  promptForward: PropTypes.func.isRequired,
  promptBackward: PropTypes.func.isRequired,
  handleResetInterface: PropTypes.func.isRequired,
  connectFrom: PropTypes.string,
  handleConnectFrom: PropTypes.func.isRequired,
};

Sociogram.defaultProps = {
  connectFrom: null,
};

const mapDispatchToProps = dispatch => ({
  resetEdgesOfType: bindActionCreators(resetActions.resetEdgesOfType, dispatch),
  resetPropertyForAllNodes: bindActionCreators(resetActions.resetPropertyForAllNodes, dispatch),
});

export default compose(
  connect(null, mapDispatchToProps),
  withConnectFrom,
  withConnectFromHandler,
  withResetInterfaceHandler,
  withPrompt,
)(Sociogram);
