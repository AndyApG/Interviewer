import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import DragManager, { NO_SCROLL } from '../../behaviours/DragAndDrop/DragManager';
import { Fade } from '../../ui/components/Transitions';

const AnnotationLines = ({ lines, isDrawing }) => (
  <svg className="annotations__lines" width="100%" height="100%" viewBox="0 0 1 1" preserveAspectRatio="none">
    {lines.map((line, index) => (
      <AnnotationLine
        key={index}
        line={line}
        showLine={isDrawing && index === lines.length - 1}
      />
    ))}
  </svg>
);

AnnotationLines.propTypes = {
  isDrawing: PropTypes.bool.isRequired,
  lines: PropTypes.array.isRequired,
};

const AnnotationLine = ({ line, showLine }) => {
  const pathData = `M ${line.map(point => (`${point.x} ${point.y}`)).join(' L ')}`;

  return (
    <Fade
      in={showLine}
      enter={false}
      customDuration={{ enter: 0, exit: 3000 * Math.log10(line.length ** 2) }}
    >
      <path className="annotations__path" d={pathData} vectorEffect="non-scaling-stroke" />
    </Fade>
  );
};

AnnotationLine.propTypes = {
  line: PropTypes.array.isRequired,
  showLine: PropTypes.bool.isRequired,
};

class Annotations extends Component {
  constructor() {
    super();

    this.state = {
      lines: [],
      activeLines: 0,
      isDrawing: false,
    };

    this.dragManager = null;
    this.portal = document.createElement('div');
    this.portal.className = 'annotations';
    this.removeLineTimers = [];
  }

  componentDidMount() {
    const nodeListRoot = document.getElementsByClassName('node-layout').length > 0 ?
      document.getElementsByClassName('node-layout')[0] :
      document.getElementById('narrative-interface__canvas');
    if (nodeListRoot) {
      nodeListRoot.insertBefore(this.portal, nodeListRoot.firstChild);
    }

    this.dragManager = new DragManager({
      el: this.portal,
      onDragStart: this.onDragStart,
      onDragMove: this.onDragMove,
      onDragEnd: this.onDragEnd,
      scrollDirection: NO_SCROLL,
    });
  }

  componentWillUnmount() {
    this.cleanupDragManager();
    this.resetRemoveLineTimers();

    if (this.portal) {
      this.portal.remove();
    }
  }

  onDragStart = (mouseEvent) => {
    const point = this.relativeCoordinatesForEvent(mouseEvent);
    const lines = this.state.lines.slice();
    lines.push([point]);

    this.setState({
      lines,
      activeLines: this.state.activeLines + 1,
      isDrawing: true,
    });

    this.props.setActiveStatus(true);
  };

  onDragMove = (mouseEvent) => {
    if (!this.state.isDrawing) {
      return;
    }

    const point = this.relativeCoordinatesForEvent(mouseEvent);
    const lines = this.state.lines.slice();
    lines[lines.length - 1].push(point);

    this.setState({
      lines,
    });
  };

  onDragEnd = () => {
    this.setState({ isDrawing: false });

    // Add a setTimeout that decreases state.activeLines once a line has faded out.
    // Could possibly be replaced by a callback from <Fade />?
    this.removeLineTimers.push(
      setTimeout(
        () => {
          this.setState({
            activeLines: this.state.activeLines - 1,
          }, () => {
            if (this.state.activeLines === 0) {
              this.props.setActiveStatus(false);
            }
          });
        },
        3000 * Math.log10(this.state.lines[this.state.lines.length - 1].length ** 2),
      ),
    );
  };

  // Called by parent component via ref when the reset button is clicked.
  reset = () => {
    this.setState({
      lines: [],
      activeLines: 0,
      isDrawing: false,
    });

    this.resetRemoveLineTimers();
    this.props.setActiveStatus(false);
  };

  resetRemoveLineTimers = () => {
    if (this.removeLineTimers) {
      this.removeLineTimers.map(timer => clearTimeout(timer));
      this.removeLineTimers = [];
    }
  }

  cleanupDragManager = () => {
    if (this.dragManager) {
      this.dragManager.unmount();
      this.dragManager = null;
    }
  };

  relativeCoordinatesForEvent(mouseEvent) {
    const boundingRect = this.portal.getBoundingClientRect();
    return ({
      x: (mouseEvent.x - boundingRect.left) / boundingRect.width,
      y: (mouseEvent.y - boundingRect.top) / boundingRect.height,
    });
  }

  render() {
    return ReactDOM.createPortal(
      (
        <AnnotationLines
          lines={this.state.lines}
          isDrawing={this.state.isDrawing}
        />
      ),
      this.portal,
    );
  }
}

Annotations.propTypes = {
  setActiveStatus: PropTypes.func,
};

Annotations.defaultProps = {
  setActiveStatus: () => { },
};

export default Annotations;