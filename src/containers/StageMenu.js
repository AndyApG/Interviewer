import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { actionCreators as menuActions } from '../ducks/modules/menu';
import { actionCreators as stageActions } from '../ducks/modules/stage';
import { stages, stage, filteredStages, menuIsOpen, searchTerm } from '../selectors/session';
import { Menu } from '../components';

/**
  * Renders a Menu using stages to construct items in the menu
  * @extends Component
  */
class StageMenu extends Component {
  /**
    * updates search term and matching stages when input changes
    * @param event {event}
    */
  onInputChange = (event) => {
    this.props.updateSearch(event.target.value);
  }

  render() {
    const {
      currentStages, currentStage, filteredList, isOpen, onStageClick, toggleMenu,
    } = this.props;

    const items = filteredList.map(filteredStage =>
      ({
        id: filteredStage.id,
        title: filteredStage.title,
        imageType: filteredStage.type,
        isActive: currentStage === filteredStage,
        onClick: () => onStageClick(currentStages, filteredStage.id),
      }));

    const search = (
      <div className="menu__search">
        <input type="search" placeholder="Filter" onKeyUp={this.onInputChange} />
      </div>
    );

    return (
      <Menu
        isOpen={isOpen}
        items={items}
        searchField={search}
        toggleMenu={toggleMenu}
      />
    );
  }
}

StageMenu.propTypes = {
  currentStages: PropTypes.array.isRequired,
  currentStage: PropTypes.object,
  filteredList: PropTypes.array.isRequired,
  isOpen: PropTypes.bool,
  onStageClick: PropTypes.func.isRequired,
  toggleMenu: PropTypes.func.isRequired,
  updateSearch: PropTypes.func,
};

StageMenu.defaultProps = {
  currentStage: null,
  isOpen: false,
  searchTerm: '',
  updateSearch: () => {},
};

function mapStateToProps(state) {
  const currentStages = stages(state);
  const currentStage = stage(state);
  const filteredList = filteredStages(state);

  return {
    isOpen: menuIsOpen(state),
    currentStages,
    currentStage,
    filteredList,
    searchTerm: searchTerm(state),
  };
}

const mapDispatchToProps = dispatch => ({
  onStageClick: bindActionCreators(stageActions.setStage, dispatch),
  toggleMenu: bindActionCreators(menuActions.toggleMenu, dispatch),
  updateSearch: bindActionCreators(menuActions.updateSearch, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(StageMenu);