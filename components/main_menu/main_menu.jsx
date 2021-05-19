// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import PropTypes from 'prop-types';
import React from 'react';
import {injectIntl, FormattedMessage} from 'react-intl';

import {Permissions} from 'mattermost-redux/constants';

import * as GlobalActions from 'actions/global_actions';
import {Constants, ModalIdentifiers} from 'utils/constants';
import {intlShape} from 'utils/react_intl';
import {cmdOrCtrlPressed, isKeyPressed} from 'utils/utils';
import {useSafeUrl} from 'utils/url';
import * as UserAgent from 'utils/user_agent';
import InvitationModal from 'components/invitation_modal';

import TeamPermissionGate from 'components/permissions_gates/team_permission_gate';
import SystemPermissionGate from 'components/permissions_gates/system_permission_gate';

import LeaveTeamIcon from 'components/widgets/icons/leave_team_icon';

import LeaveTeamModal from 'components/leave_team_modal';
import UserSettingsModal from 'components/user_settings/modal';
import TeamMembersModal from 'components/team_members_modal';
import TeamSettingsModal from 'components/team_settings_modal';
import AboutBuildModal from 'components/about_build_modal';
import AddGroupsToTeamModal from 'components/add_groups_to_team_modal';
import MarketplaceModal from 'components/plugin_marketplace';
import UpgradeLink from 'components/widgets/links/upgrade_link';

import Menu from 'components/widgets/menu/menu';
import TeamGroupsManageModal from 'components/team_groups_manage_modal';

import withGetCloudSubscription from '../common/hocs/cloud/with_get_cloud_subscription';

class MainMenu extends React.PureComponent {
    static propTypes = {
        mobile: PropTypes.bool.isRequired,
        id: PropTypes.string,
        teamId: PropTypes.string,
        teamName: PropTypes.string,
        siteName: PropTypes.string,
        currentUser: PropTypes.object,
        appDownloadLink: PropTypes.string,
        enableCommands: PropTypes.bool.isRequired,
        enableCustomEmoji: PropTypes.bool.isRequired,
        enableIncomingWebhooks: PropTypes.bool.isRequired,
        enableOAuthServiceProvider: PropTypes.bool.isRequired,
        enableOutgoingWebhooks: PropTypes.bool.isRequired,
        canManageSystemBots: PropTypes.bool.isRequired,
        canCreateOrDeleteCustomEmoji: PropTypes.bool.isRequired,
        canManageIntegrations: PropTypes.bool.isRequired,
        enablePluginMarketplace: PropTypes.bool.isRequired,
        experimentalPrimaryTeam: PropTypes.string,
        helpLink: PropTypes.string,
        reportAProblemLink: PropTypes.string,
        moreTeamsToJoin: PropTypes.bool.isRequired,
        pluginMenuItems: PropTypes.arrayOf(PropTypes.object),
        isMentionSearch: PropTypes.bool,
        teamIsGroupConstrained: PropTypes.bool.isRequired,
        isLicensedForLDAPGroups: PropTypes.bool,
        showGettingStarted: PropTypes.bool.isRequired,
        intl: intlShape.isRequired,
        showNextStepsTips: PropTypes.bool,
        isFreeTrial: PropTypes.bool,
        daysLeftOnTrial: PropTypes.number,
        isCloud: PropTypes.bool,
        subscriptionStats: PropTypes.object,
        firstAdminVisitMarketplaceStatus: PropTypes.bool,
        actions: PropTypes.shape({
            openModal: PropTypes.func.isRequred,
            showMentions: PropTypes.func,
            showFlaggedPosts: PropTypes.func,
            closeRightHandSide: PropTypes.func.isRequired,
            closeRhsMenu: PropTypes.func.isRequired,
            unhideNextSteps: PropTypes.func.isRequired,
            getSubscriptionStats: PropTypes.func.isRequired,
        }).isRequired,
    };

    static defaultProps = {
        teamType: '',
        mobile: false,
        pluginMenuItems: [],
    };

    toggleShortcutsModal = (e) => {
        e.preventDefault();
        GlobalActions.toggleShortcutsModal();
    }

    async componentDidMount() {
        document.addEventListener('keydown', this.handleKeyDown);
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyDown);
    }

    handleKeyDown = (e) => {
        if (cmdOrCtrlPressed(e) && e.shiftKey && isKeyPressed(e, Constants.KeyCodes.A)) {
            this.props.actions.openModal({ModalId: ModalIdentifiers.USER_SETTINGS, dialogType: UserSettingsModal});
        }
    }

    handleEmitUserLoggedOutEvent = () => {
        GlobalActions.emitUserLoggedOutEvent();
    }

    getFlagged = (e) => {
        e.preventDefault();
        this.props.actions.showFlaggedPosts();
        this.props.actions.closeRhsMenu();
    }

    searchMentions = (e) => {
        e.preventDefault();

        if (this.props.isMentionSearch) {
            this.props.actions.closeRightHandSide();
        } else {
            this.props.actions.closeRhsMenu();
            this.props.actions.showMentions();
        }
    }

    shouldShowUpgradeModal = () => {
        const {subscriptionStats, isCloud} = this.props;

        if (subscriptionStats?.is_paid_tier === 'true') { // eslint-disable-line camelcase
            return false;
        }
        return isCloud && subscriptionStats?.remaining_seats <= 0;
    }

    render() {
        const {currentUser, teamIsGroupConstrained, isLicensedForLDAPGroups, isFreeTrial, daysLeftOnTrial, isCloud} = this.props;

        if (!currentUser) {
            return null;
        }

        const pluginItems = this.props.pluginMenuItems.map((item) => {
            return (
                <Menu.ItemAction
                    id={item.id + '_pluginmenuitem'}
                    key={item.id + '_pluginmenuitem'}
                    onClick={() => {
                        if (item.action) {
                            item.action();
                        }
                    }}
                    text={item.text}
                    icon={this.props.mobile && item.mobileIcon}
                />
            );
        });

        const someIntegrationEnabled = this.props.enableIncomingWebhooks || this.props.enableOutgoingWebhooks || this.props.enableCommands || this.props.enableOAuthServiceProvider || this.props.canManageSystemBots;
        const showIntegrations = !this.props.mobile && someIntegrationEnabled && this.props.canManageIntegrations;

        const {formatMessage} = this.props.intl;

        const invitePeopleModal = (
            <Menu.ItemToggleModalRedux
                id='invitePeople'
                modalId={ModalIdentifiers.INVITATION}
                dialogType={InvitationModal}
                text={formatMessage({
                    id: 'navbar_dropdown.invitePeople',
                    defaultMessage: 'Invite People',
                })}
                extraText={formatMessage({
                    id: 'navbar_dropdown.invitePeopleExtraText',
                    defaultMessage: 'Add or invite people to the team',
                })}
                icon={this.props.mobile && <i className='fa fa-user-plus'/>}
            />
        );

        return (
            <Menu
                mobile={this.props.mobile}
                id={this.props.id}
                ariaLabel={formatMessage({id: 'navbar_dropdown.menuAriaLabel', defaultMessage: 'main menu'})}
            >
                {isCloud && isFreeTrial &&
                    <Menu.Group>
                        <SystemPermissionGate permissions={Permissions.SYSCONSOLE_WRITE_BILLING}>
                            <Menu.TopNotification
                                show={true}
                                id='topNotification'
                            >
                                <FormattedMessage
                                    id='admin.billing.subscription.cloudTrial.trialTopMenuNotification'
                                    defaultMessage='There are {daysLeftOnTrial} days left on your Cloud trial.'
                                    values={{daysLeftOnTrial}}
                                />
                                <UpgradeLink
                                    buttonText='Subscribe Now'
                                    styleLink={true}
                                />
                            </Menu.TopNotification>
                        </SystemPermissionGate>
                    </Menu.Group>
                }
                <Menu.Group>
                    <Menu.ItemAction
                        id='recentMentions'
                        show={this.props.mobile}
                        onClick={this.searchMentions}
                        icon={this.props.mobile && <i className='mentions'>{'@'}</i>}
                        text={formatMessage({id: 'sidebar_right_menu.recentMentions', defaultMessage: 'Recent Mentions'})}
                    />
                    <Menu.ItemAction
                        id='flaggedPosts'
                        show={this.props.mobile}
                        onClick={this.getFlagged}
                        icon={this.props.mobile && <i className='fa fa-bookmark'/>}
                        text={formatMessage({id: 'sidebar_right_menu.flagged', defaultMessage: 'Saved Posts'})}
                    />
                </Menu.Group>
                <Menu.Group>
                    <Menu.ItemToggleModalRedux
                        id='accountSettings'
                        modalId={ModalIdentifiers.USER_SETTINGS}
                        dialogType={UserSettingsModal}
                        text={formatMessage({id: 'navbar_dropdown.accountSettings', defaultMessage: 'Account Settings'})}
                        icon={this.props.mobile && <i className='fa fa-cog'/>}
                    />
                </Menu.Group>
                <Menu.Group>
                    <SystemPermissionGate permissions={Permissions.SYSCONSOLE_READ_PERMISSIONS}>
                        <Menu.ItemLink
                            id='systemConsole'
                            show={!this.props.mobile}
                            to='/admin_console'
                            text={formatMessage({id: 'navbar_dropdown.console', defaultMessage: 'System Console'})}
                            icon={this.props.mobile && <i className='fa fa-wrench'/>}
                        />
                    </SystemPermissionGate>
                </Menu.Group>
                <Menu.Group>
                    <Menu.ItemExternalLink
                        id='helpLink'
                        show={Boolean(this.props.helpLink)}
                        url={this.props.helpLink}
                        text={formatMessage({id: 'navbar_dropdown.help', defaultMessage: 'Help'})}
                        icon={this.props.mobile && <i className='fa fa-question'/>}
                    />
                    <Menu.ItemToggleModalRedux
                        id='about'
                        modalId={ModalIdentifiers.ABOUT}
                        dialogType={AboutBuildModal}
                        text={formatMessage({id: 'navbar_dropdown.about', defaultMessage: 'About {appTitle}'}, {appTitle: this.props.siteName || 'Mattermost'})}
                        icon={this.props.mobile && <i className='fa fa-info'/>}
                    />
                </Menu.Group>
                <Menu.Group>
                    <Menu.ItemAction
                        id='logout'
                        onClick={this.handleEmitUserLoggedOutEvent}
                        text={formatMessage({id: 'navbar_dropdown.logout', defaultMessage: 'Log Out'})}
                        icon={this.props.mobile && <i className='fa fa-sign-out'/>}
                    />
                </Menu.Group>
            </Menu>
        );
    }
}

export default injectIntl(withGetCloudSubscription((MainMenu)));
