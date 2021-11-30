/* eslint-disable no-param-reassign */
import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { motion, useDragControls } from 'framer-motion';
import { Toggle } from '@codaco/ui/lib/components/Fields';
import AutorenewIcon from '@material-ui/icons/AutorenewRounded';
import ZoomInIcon from '@material-ui/icons/ZoomInRounded';
import ZoomOutIcon from '@material-ui/icons/ZoomOutRounded';
import MinimizeIcon from '@material-ui/icons/MinimizeRounded';
import LayoutContext from '../../contexts/LayoutContext';

const panelVariants = {
  minimized: {
    height: 0,
    transition: {
    },
  },
  normal: {
    height: 'auto',
    transition: {
      when: 'afterChildren',
    },
  },
};

const controlVariants = {
  disabled: {
    height: 0,
    transition: {
    },
  },
  enabled: {
    height: 'auto',
    transition: {
      when: 'afterChildren',
    },
  },
};

const SimulationControl = ({
  icon: Icon,
  onClick,
  children,
  disabled,
}) => (
  <div
    className={cx(
      'simulation-panel__control',
      { 'simulation-panel__control--disabled': disabled },
    )}
    onClick={() => {
      if (disabled) { return; }
      onClick();
    }}
  >
    <div className="simulation-panel__control-icon">
      <Icon />
    </div>
    {children}
  </div>
);

SimulationControl.propTypes = {
  icon: PropTypes.any.isRequired,
  onClick: PropTypes.isRequired,
  children: PropTypes.any,
  disabled: PropTypes.bool,
};

SimulationControl.defaultProps = {
  children: null,
  disabled: false,
};

const SimulationPanel = ({
  dragConstraints,
}) => {
  const {
    viewport,
    allowSimulation,
    simulation,
  } = useContext(LayoutContext);

  const {
    reheat,
    isRunning,
    simulationEnabled,
    toggleSimulation,
  } = simulation;

  const [isMinimized, setMinimized] = useState(false);
  const dragControls = useDragControls();

  const toggleMinimize = () => setMinimized((minimized) => !minimized);

  const startDrag = (event) => {
    dragControls.start(event);
  };

  if (!allowSimulation) { return null; }

  return (
    <motion.div
      className="simulation-panel"
      drag
      dragControls={dragControls}
      dragConstraints={dragConstraints}
      dragListener={false}
    >
      <motion.div
        className="simulation-panel__header"
        onTap={toggleMinimize}
        onPointerDown={startDrag}
      >
        { isMinimized ? (
          <motion.div
            role="button"
            aria-label="Tap to show simulation controls"
            className="simulation-panel__header-open-prompt"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.5 } }}
          >
            <strong>Tap to show simulation controls</strong>
          </motion.div>
        ) : (
          <MinimizeIcon className="simulation-panel__header-minimize" titleAccess="Minimize" />
        )}
      </motion.div>
      <motion.div
        className="simulation-panel__controls"
        animate={isMinimized ? 'minimized' : 'normal'}
        variants={panelVariants}
      >
        <motion.div
          className={cx(
            'simulation-panel__enable',
            { 'simulation-panel__enable--active': simulationEnabled },
          )}
        >
          <Toggle
            className="simulation-panel__enable-toggle"
            input={{
              value: simulationEnabled,
              onChange: toggleSimulation,
            }}
            label="Simulation enabled"
          />
        </motion.div>
        <motion.div
          className="simulation-panel__controls"
          animate={simulationEnabled ? 'enabled' : 'disabled'}
          variants={controlVariants}
        >
          <SimulationControl
            icon={ZoomInIcon}
            onClick={() => viewport.zoomViewport(1.5)}
          >
            Zoom In
          </SimulationControl>
          <SimulationControl
            icon={ZoomOutIcon}
            onClick={() => viewport.zoomViewport(0.67)}
          >
            Zoom Out
          </SimulationControl>
          <SimulationControl
            icon={AutorenewIcon}
            onClick={reheat}
            disabled={isRunning}
          >
            Reheat
          </SimulationControl>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

SimulationPanel.propTypes = {
  dragConstraints: PropTypes.object,
};

SimulationPanel.defaultProps = {
  dragConstraints: undefined,
};

export default SimulationPanel;
