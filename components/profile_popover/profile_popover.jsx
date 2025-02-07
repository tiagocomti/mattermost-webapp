// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import PropTypes from 'prop-types';
import React from 'react';
import {Tooltip} from 'react-bootstrap';
import {FormattedMessage, injectIntl} from 'react-intl';

import EventEmitter from 'mattermost-redux/utils/event_emitter';

import StatusIcon from 'components/status_icon';
import Timestamp from 'components/timestamp';
import OverlayTrigger from 'components/overlay_trigger';
import UserSettingsModal from 'components/user_settings/modal';
import {browserHistory} from 'utils/browser_history';
import * as GlobalActions from 'actions/global_actions';
import Constants, {ModalIdentifiers, UserStatuses} from 'utils/constants';
import {t} from 'utils/i18n';
import {intlShape} from 'utils/react_intl';
import * as Utils from 'utils/utils.jsx';
import Pluggable from 'plugins/pluggable';
import AddUserToChannelModal from 'components/add_user_to_channel_modal';
import LocalizedIcon from 'components/localized_icon';
import ToggleModalButtonRedux from 'components/toggle_modal_button_redux';
import Avatar from 'components/widgets/users/avatar';
import Popover from 'components/widgets/popover';
import SharedUserIndicator from 'components/shared_user_indicator.tsx';
import CustomStatusEmoji from 'components/custom_status/custom_status_emoji';
import CustomStatusModal from 'components/custom_status/custom_status_modal';
import CustomStatusText from 'components/custom_status/custom_status_text';

import './profile_popover.scss';
import {Permissions} from "mattermost-redux/constants";

/**
 * The profile popover, or hovercard, that appears with user information when clicking
 * on the username or profile picture of a user.
 */
class ProfilePopover extends React.PureComponent {
    static getComponentName() {
        return 'ProfilePopover';
    }

    static propTypes = {

        /**
         * Source URL from the image to display in the popover
         */
        src: PropTypes.string.isRequired,

        /**
         * Source URL from the image that should override default image
         */
        overwriteIcon: PropTypes.string,

        /**
         * User the popover is being opened for
         */
        user: PropTypes.object,

        channelId: PropTypes.string,

        /**
         * Status for the user, either 'offline', 'away', 'dnd' or 'online'
         */
        status: PropTypes.string,

        hideStatus: PropTypes.bool,

        /**
         * Function to call to hide the popover
         */
        hide: PropTypes.func,

        /**
         * Set to true if the popover was opened from the right-hand
         * sidebar (comment thread, search results, etc.)
         */
        isRHS: PropTypes.bool,

        /**
         * Returns state of modals in redux for determing which need to be closed
         */
        modals: PropTypes.object,

        currentTeamId: PropTypes.string.isRequired,

        /**
         * @internal
         */
        currentUserId: PropTypes.string.isRequired,
        customStatus: PropTypes.object,
        isCustomStatusEnabled: PropTypes.bool.isRequired,

        /**
         * @internal
         */
        hasMention: PropTypes.bool,

        /**
         * @internal
         */
        isInCurrentTeam: PropTypes.bool.isRequired,

        /**
         * @internal
         */
        teamUrl: PropTypes.string.isRequired,

        /**
         * @internal
         */
        isTeamAdmin: PropTypes.bool.isRequired,

        /**
         * @internal
         */
        isChannelAdmin: PropTypes.bool.isRequired,

        /**
         * @internal
         */
        canManageAnyChannelMembersInCurrentTeam: PropTypes.bool.isRequired,

        /**
         * The overwritten username that should be shown at the top of the popover
         */
        overwriteName: PropTypes.node,

        /**
         * @internal
         */
        actions: PropTypes.shape({
            getMembershipForEntities: PropTypes.func.isRequired,
            openDirectChannelToUserId: PropTypes.func.isRequired,
            openModal: PropTypes.func.isRequired,
            closeModal: PropTypes.func.isRequired,
        }).isRequired,

        /**
         * react-intl helper object
         */
        intl: intlShape.isRequired,
        roles: PropTypes.string,

        ...Popover.propTypes,
    }

    static defaultProps = {
        isRHS: false,
        hasMention: false,
        status: UserStatuses.OFFLINE,
        customStatus: {},
        roles: "",
    }

    constructor(props) {
        super(props);
        this.roles = props.roles;
        this.state = {
            loadingDMChannel: -1,
        };
    }

    componentDidMount() {
        const {currentTeamId, userId, channelId} = this.props;
        if (currentTeamId && userId) {
            this.props.actions.getMembershipForEntities(currentTeamId, userId, channelId);
        }
    }

    handleShowDirectChannel = (e) => {
        const {actions} = this.props;
        e.preventDefault();

        if (!this.props.user) {
            return;
        }

        const user = this.props.user;

        if (this.state.loadingDMChannel !== -1) {
            return;
        }

        this.setState({loadingDMChannel: user.id});

        actions.openDirectChannelToUserId(user.id).then((result) => {
            if (!result.error) {
                if (Utils.isMobile()) {
                    GlobalActions.emitCloseRightHandSide();
                }
                this.setState({loadingDMChannel: -1});
                if (this.props.hide) {
                    this.props.hide();
                }
                browserHistory.push(`${this.props.teamUrl}/messages/@${user.username}`);
            }
        });
        this.handleCloseModals();
    }

    handleMentionKeyClick = (e) => {
        e.preventDefault();

        if (!this.props.user) {
            return;
        }
        if (this.props.hide) {
            this.props.hide();
        }
        EventEmitter.emit('mention_key_click', this.props.user.username, this.props.isRHS);
        this.handleCloseModals();
    }

    handleEditAccountSettings = (e) => {
        e.preventDefault();

        if (!this.props.user) {
            return;
        }
        if (this.props.hide) {
            this.props.hide();
        }
        this.props.actions.openModal({ModalId: ModalIdentifiers.USER_SETTINGS, dialogType: UserSettingsModal});
        this.handleCloseModals();
    }

    showCustomStatusModal = (e) => {
        e.preventDefault();

        if (this.props.hide) {
            this.props.hide();
        }
        const customStatusInputModalData = {
            ModalId: ModalIdentifiers.CUSTOM_STATUS,
            dialogType: CustomStatusModal,
        };

        this.props.actions.openModal(customStatusInputModalData);
    }

    handleAddToChannel = (e) => {
        e.preventDefault();

        this.handleCloseModals();
    }

    handleCloseModals = () => {
        const {modals} = this.props;

        for (const modal in modals) {
            if (!Object.prototype.hasOwnProperty.call(modals, modal)) {
                continue;
            }

            if (modals[modal].open) {
                this.props.actions.closeModal(modal);
            }
        }
    };

    renderCustomStatus() {
        const {customStatus, isCustomStatusEnabled, user, currentUserId, hideStatus} = this.props;

        const customStatusSet = (customStatus.text || customStatus.emoji);
        const canSetCustomStatus = (user.id === currentUserId);
        const shouldShowCustomStatus = isCustomStatusEnabled && !hideStatus && customStatus && (customStatusSet || canSetCustomStatus);

        if (!shouldShowCustomStatus) {
            return null;
        }

        let customStatusContent;
        if (customStatusSet) {
            const customStatusEmoji = (
                <span className='d-flex'>
                    <CustomStatusEmoji
                        userID={this.props.user.id}
                        showTooltip={false}
                        emojiStyle={{
                            marginRight: 4,
                            marginTop: 1,
                        }}
                    />
                </span>
            );

            customStatusContent = (
                <div className='d-flex'>
                    {customStatusEmoji}
                    <CustomStatusText
                        tooltipDirection='top'
                        text={customStatus.text}
                        className='user-popover__email pb-1'
                    />
                </div>
            );
        } else if (canSetCustomStatus) {
            customStatusContent = (
                <div>
                </div>
            );
        }

        return customStatusContent;
    }

    render() {
        if (!this.props.user) {
            return null;
        }

        const popoverProps = Object.assign({}, this.props);
        delete popoverProps.user;
        delete popoverProps.userId;
        delete popoverProps.channelId;
        delete popoverProps.src;
        delete popoverProps.status;
        delete popoverProps.hideStatus;
        delete popoverProps.isBusy;
        delete popoverProps.hide;
        delete popoverProps.isRHS;
        delete popoverProps.hasMention;
        delete popoverProps.dispatch;
        delete popoverProps.enableTimezone;
        delete popoverProps.currentUserId;
        delete popoverProps.currentTeamId;
        delete popoverProps.teamUrl;
        delete popoverProps.actions;
        delete popoverProps.isTeamAdmin;
        delete popoverProps.isChannelAdmin;
        delete popoverProps.canManageAnyChannelMembersInCurrentTeam;
        delete popoverProps.intl;
        delete popoverProps.roles;

        const {formatMessage} = this.props.intl;

        var dataContent = [];
        const urlSrc = this.props.overwriteIcon ? this.props.overwriteIcon : this.props.src;
        dataContent.push(
            <div
                className='user-popover-image status-selector-agf zindex-agf tooltip-agf'
                key='user-popover-image'
            >
                {this.props.user.roles != undefined && this.props.user.roles.includes(Permissions.USER_FRAME_GOLD) == true &&
                    <div class='moldura-gold-popover'></div>
                }
                {this.props.user.roles != undefined && this.props.user.roles.includes(Permissions.USER_FRAME_BRONZE) == true &&
                    <div class='moldura-bronze-popover'></div>
                }
                <Avatar
                    size='xxl'
                    username={this.props.user.username}
                    url={urlSrc}
                />
                <StatusIcon
                    className='status user-popover-status'
                    status={this.props.user.roles}
                    button={true}
                    popover={true}
                />
            </div>,
        );

        const fullname = Utils.getFullName(this.props.user);
        const haveOverrideProp = this.props.overwriteIcon || this.props.overwriteName;
        if ((fullname || this.props.user.position) && !haveOverrideProp) {
            dataContent.push(
                <hr
                    key='user-popover-hr'
                    className='divider divider--expanded'
                />,
            );
        }

        if (fullname && !haveOverrideProp) {
            let sharedIcon;
            if (this.props.user.remote_id) {
                sharedIcon = (
                    <SharedUserIndicator
                        className='shared-user-icon'
                        withTooltip={true}
                    />
                );
            }

            dataContent.push(
                <div
                    data-testId={`popover-fullname-${this.props.user.username}`}
                    className='overflow--ellipsis text-nowrap'
                    key='user-popover-fullname'
                >
                    <OverlayTrigger
                        delayShow={Constants.OVERLAY_TIME_DELAY}
                        placement='top'
                        overlay={<Tooltip id='fullNameTooltip'>{fullname}</Tooltip>}
                    >
                        <span className='user-profile-popover__heading'>{fullname}</span>
                    </OverlayTrigger>
                    {sharedIcon}
                </div>,
            );
        }

        if (this.props.user.is_bot && !haveOverrideProp) {
            dataContent.push(
                <div
                    key='bot-description'
                    className='overflow--ellipsis text-nowrap'
                >
                    {this.props.user.bot_description}
                </div>,
            );
        }

        if (this.props.user.position && !haveOverrideProp) {
            const position = this.props.user.position.substring(0, Constants.MAX_POSITION_LENGTH);
            dataContent.push(
                <OverlayTrigger
                    delayShow={Constants.OVERLAY_TIME_DELAY}
                    placement='top'
                    overlay={<Tooltip id='positionTooltip'>{position}</Tooltip>}
                    key='user-popover-position'
                >
                    <div
                        className='overflow--ellipsis text-nowrap pt-1 pb-1'
                    >
                        {position}
                    </div>
                </OverlayTrigger>,
            );
        }

        const email = this.props.user.email;
        if (email && !this.props.user.is_bot && !haveOverrideProp) {
            dataContent.push(
                <hr
                    key='user-popover-hr2'
                    className='divider divider--expanded'
                />,
            );

            dataContent.push(
                <div
                    data-toggle='tooltip'
                    title={email}
                    key='user-popover-email'
                >
                    <a
                        href={'mailto:' + email}
                        className='text-nowrap text-lowercase user-popover__email pb-1'
                    >
                        {email}
                    </a>
                </div>,
            );
        }

        dataContent.push(
            <Pluggable
                key='profilePopoverPluggable2'
                pluggableName='PopoverUserAttributes'
                user={this.props.user}
                hide={this.props.hide}
                status={this.props.hideStatus ? null : this.props.status}
            />,
        );

        if (this.props.enableTimezone && this.props.user.timezone && !haveOverrideProp) {
            dataContent.push(
                <div
                    key='user-popover-local-time'
                    className='pb-1'
                >
                    <span className='user-profile-popover__heading'>
                        <FormattedMessage
                            id='user_profile.account.localTime'
                            defaultMessage='Local Time'
                        />
                    </span>
                    <div>
                        <Timestamp
                            useRelative={false}
                            useDate={false}
                            userTimezone={this.props.user.timezone}
                            useTime={{hour: 'numeric', minute: 'numeric', timeZoneName: 'short'}}
                        />
                    </div>
                </div>,
            );
        }

        const customStatusContent = !haveOverrideProp && this.renderCustomStatus();
        if (customStatusContent) {
            dataContent.push(
                <div
                    key='user-popover-status'
                    id='user-popover-status'
                    className='pb-1'
                >
                    <span className='user-profile-popover__heading'>
                        <FormattedMessage
                            id='user_profile.custom_status'
                            defaultMessage='Status'
                        />
                    </span>
                    {customStatusContent}
                </div>,
            );
        }

        if (this.props.user.id === this.props.currentUserId && !haveOverrideProp) {
            dataContent.push(
                <div>
                </div>,
            );
        }

        if (haveOverrideProp) {
            dataContent.push(
                <div
                    data-toggle='tooltip'
                    key='user-popover-settings'
                    className='popover__row first'
                >
                    <FormattedMessage
                        id='user_profile.account.post_was_created'
                        defaultMessage='This post was created by an integration from'
                    />
                    <a onClick={this.handleMentionKeyClick}>{` @${this.props.user.username}`}</a>
                </div>,
            );
        }

        if (this.props.user.id !== this.props.currentUserId && !haveOverrideProp) {
            dataContent.push(
                <div
                    data-toggle='tooltip'
                    key='user-popover-dm'
                    className='popover__row first'
                >
                    <a
                        href='#'
                        className='text-nowrap user-popover__email'
                        onClick={this.handleShowDirectChannel}
                    >
                        <LocalizedIcon
                            className='fa fa-paper-plane'
                            title={{id: t('user_profile.send.dm.icon'), defaultMessage: 'Send Message Icon'}}
                        />
                        <FormattedMessage
                            id='user_profile.send.dm'
                            defaultMessage='Send Message'
                        />
                    </a>
                </div>,
            );
        }

        dataContent.push(
            <Pluggable
                key='profilePopoverPluggable3'
                pluggableName='PopoverUserActions'
                user={this.props.user}
                hide={this.props.hide}
                status={this.props.hideStatus ? null : this.props.status}
            />,
        );

        let roleTitle;
        if (this.props.user.is_bot) {
            roleTitle = <span className='user-popover__role'>{Utils.localizeMessage('bots.is_bot', 'BOT')}</span>;
        } else if (Utils.isGuest(this.props.user)) {
            roleTitle = <span className='user-popover__role'>{Utils.localizeMessage('post_info.guest', 'GUEST')}</span>;
        } else if (Utils.isSystemAdmin(this.props.user.roles)) {
            roleTitle = <span className='user-popover__role'>{Utils.localizeMessage('admin.permissions.roles.system_admin.name', 'System Admin')}</span>;
        } else if (this.props.isTeamAdmin) {
            roleTitle = <span className='user-popover__role'>{Utils.localizeMessage('admin.permissions.roles.team_admin.name', 'Team Admin')}</span>;
        } else if (this.props.isChannelAdmin) {
            roleTitle = <span className='user-popover__role'>{Utils.localizeMessage('admin.permissions.roles.channel_admin.name', 'Channel Admin')}</span>;
        }

        let title = `@${this.props.user.username}`;
        if (this.props.overwriteName) {
            title = `${this.props.overwriteName}`;
            roleTitle = '';
        } else if (this.props.hasMention) {
            title = <a onClick={this.handleMentionKeyClick}>{title}</a>;
        }
        title = (
            <span data-testid={`profilePopoverTitle_${this.props.user.username}`}>
                <span className='user-popover__username'>
                    {title}
                </span>
                {roleTitle}
            </span>
        );

        return (
            <Popover
                {...popoverProps}
                title={title}
                id='user-profile-popover'
            >
                {dataContent}
            </Popover>
        );
    }
}

delete ProfilePopover.propTypes.id;

export default injectIntl(ProfilePopover);
