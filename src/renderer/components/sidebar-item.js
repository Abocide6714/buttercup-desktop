import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import capitalize from 'lodash/capitalize';
import LockOpen from 'react-icons/lib/md/lock-open';
import LockClosed from 'react-icons/lib/md/lock-outline';
import { GithubPicker } from 'react-color';
import Portal from 'react-portal';
import { brands } from '../../shared/buttercup/brands';
import { showContextMenu } from '../system/menu';

const Wrapper = styled.li`
  display: flex;
  align-items: center;
  color: #fff;
  background-color: ${props => props.active ? 'rgba(255, 255, 255, .1)' : 'transparent'};
  padding: var(--spacing-half) var(--spacing-one);
  cursor: ${props => props.locked ? 'pointer' : 'default'} !important;

  figure {
    margin: 0;
    padding: 0;
    flex: 0 0 3rem;
    width: 3rem;
    height: 3rem;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      width: 100%;
      display: block;
      border-radius: 50%;
      border: 3px solid rgba(255, 255, 255, .2);
    }
  }

  .status {
    font-weight: 300;
    font-size: .75em;
    color: ${props => props.locked ? 'var(--red)' : 'var(--gray-dark)'};
    text-transform: uppercase;
    display: block;

    svg {
      vertical-align: -2px !important;
      margin-right: 3px;
      height: 12px;
      width: 12px;
    }
  }

  section {
    font-size: .9em;
    flex: 1;
    min-width: 0;
    padding-left: var(--spacing-one);

    div {
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
`;

const Avatar = styled.div`
  width: 3rem;
  height: 3rem;
  border-radius: 50px;
  border: 2px solid rgba(255, 255, 255, .2);
  background-color: ${props => props.color};
  font-weight: 400;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  &:hover {
    .cog {
      display: block;
    }
  }
`;

const PickerWrapper = styled.div`
  position: fixed;
  top: ${props => props.top + 20}px;
  left: ${props => props.left + 5}px;
`;

class SidebarItem extends Component {
  static propTypes = {
    archive: PropTypes.object,
    active: PropTypes.bool,
    condenced: PropTypes.bool,
    index: PropTypes.number,
    onClick: PropTypes.func,
    onRemoveClick: PropTypes.func,
    onArchiveUpdate: PropTypes.func
  };

  state = {
    isPickerOpen: false,
    top: 0,
    left: 0
  };

  handleContextMenu = () => {
    const { status, name } = this.props.archive;
    showContextMenu([{
      label: `${status === 'locked' ? 'Unlock' : 'Open'} ${name}`,
      accelerator: `CmdOrCtrl+${this.props.index + 1}`,
      click: this.props.onClick
    }, {
      label: `Remove ${name}`,
      click: this.props.onRemoveClick
    }, {
      type: 'separator'
    }, {
      label: 'Change Color',
      click: this.showColorPopup
    }]);
  }

  showColorPopup = () => {
    const el = this.avatarRef;
    const bodyRect = document.body.getBoundingClientRect();
    const targetRect = el.getBoundingClientRect();
    this.setState({
      isPickerOpen: true,
      top: (targetRect.top - bodyRect.top) + el.clientHeight - 10,
      left: targetRect.left - bodyRect.left
    });
  }

  handlePickerClose = () => {
    this.setState({ isPickerOpen: false });
  }

  handleColorChange = color => {
    this.props.onArchiveUpdate({
      ...this.props.archive,
      color: color.hex
    });
  }

  render() {
    const { archive, onClick, active, condenced } = this.props;
    const { name, color, status, type } = archive;
    const locked = status === 'locked';

    const formattedName = capitalize(name.replace('.bcup', ''));
    const briefName = capitalize(name.substring(0, 2));

    return (
      <Wrapper
        locked={locked}
        active={active}
        onContextMenu={this.handleContextMenu}
        onClick={onClick}
        >
        <Avatar
          color={color || '#000000'}
          innerRef={ref => {
            this.avatarRef = ref;
          }}>
          <span>{briefName}</span>
          <Portal
            closeOnOutsideClick
            isOpened={this.state.isPickerOpen}
            onClose={this.handlePickerClose}
            >
            <PickerWrapper left={this.state.left} top={this.state.top}>
              <GithubPicker width={212} triangle="top-left" onChange={this.handleColorChange} />
            </PickerWrapper>
          </Portal>
        </Avatar>
        {!condenced && <section>
          <div>{formattedName}</div>
          <span className='status'>
            {locked ? <LockClosed /> : <LockOpen />}
            {status}
          </span>
        </section>}
      </Wrapper>
    );
  }
}

export default SidebarItem;
