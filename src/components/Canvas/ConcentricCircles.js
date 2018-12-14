import React from 'react';
import PropTypes from 'prop-types';
import Canvas from './Canvas';
import NodeBucket from '../../containers/Canvas/NodeBucket';
import NodeLayout from '../../containers/Canvas/NodeLayout';
import EdgeLayout from '../../containers/Canvas/EdgeLayout';
import Background from '../../containers/Canvas/Background';
import ConvexHulls from '../../containers/Canvas/ConvexHulls';

const ConcentricCircles = ({
  subject,
  layoutVariable,
  highlightAttribute,
  allowHighlighting,
  createEdge,
  convexHulls,
  allowPositioning,
  displayEdges,
  backgroundImage,
  concentricCircles,
  skewedTowardCenter,
  sortOrder,
  connectFrom,
  updateLinkFrom,
}) => (
  <Canvas className="concentric-circles">
    <Background
      concentricCircles={concentricCircles}
      skewedTowardCenter={skewedTowardCenter}
      image={backgroundImage}
    />
    {
      convexHulls &&
      <ConvexHulls
        groupVariable={convexHulls}
        subject={subject}
        layoutVariable={layoutVariable}
      />
    }
    {
      displayEdges.length > 0 &&
      <EdgeLayout
        displayEdges={displayEdges}
        subject={subject}
        layoutVariable={layoutVariable}
      />
    }
    <NodeLayout
      id="NODE_LAYOUT"
      highlightAttribute={highlightAttribute}
      allowHighlighting={allowHighlighting && !createEdge}
      createEdge={createEdge}
      layoutVariable={layoutVariable}
      allowPositioning={allowPositioning}
      subject={subject}
      connectFrom={connectFrom}
      updateLinkFrom={updateLinkFrom}
    />
    <NodeBucket
      id="NODE_BUCKET"
      layoutVariable={layoutVariable}
      subject={subject}
      sortOrder={sortOrder}
    />
  </Canvas>
);

ConcentricCircles.propTypes = {
  subject: PropTypes.object.isRequired,
  layoutVariable: PropTypes.string.isRequired,
  highlightAttribute: PropTypes.string,
  allowHighlighting: PropTypes.bool,
  createEdge: PropTypes.string,
  allowPositioning: PropTypes.bool,
  displayEdges: PropTypes.array,
  convexHulls: PropTypes.string,
  backgroundImage: PropTypes.string,
  concentricCircles: PropTypes.number,
  skewedTowardCenter: PropTypes.bool,
  sortOrder: PropTypes.array,
  connectFrom: PropTypes.string,
  updateLinkFrom: PropTypes.func,
};

ConcentricCircles.defaultProps = {
  highlightAttribute: null,
  allowHighlighting: false,
  createEdge: null,
  allowPositioning: true,
  displayEdges: [],
  convexHulls: null,
  backgroundImage: null,
  concentricCircles: null,
  skewedTowardCenter: null,
  sortOrder: [],
  connectFrom: null,
  updateLinkFrom: () => {},
};

export { ConcentricCircles };

export default ConcentricCircles;
