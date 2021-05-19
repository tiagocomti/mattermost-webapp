// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import React from 'react';

import {FormattedMessage} from 'react-intl';

import {Channel} from 'mattermost-redux/types/channels';

import {Permissions} from 'mattermost-redux/constants';

import ToggleModalButtonRedux from 'components/toggle_modal_button_redux';
import ToggleModalButton from 'components/toggle_modal_button.jsx';
import InvitationModal from 'components/invitation_modal';
import ChannelInviteModal from 'components/channel_invite_modal';
import AddGroupsToChannelModal from 'components/add_groups_to_channel_modal';
import ChannelPermissionGate from 'components/permissions_gates/channel_permission_gate';

import {Constants, ModalIdentifiers} from 'utils/constants';
import * as Utils from 'utils/utils.jsx';

import './add_members_button.scss';

import LoadingSpinner from 'components/widgets/loading/loading_spinner';

import MembersSvg from './members_illustration.svg';

export interface AddMembersButtonProps {
    totalUsers?: number;
    usersLimit: number;
    channel: Channel;
    setHeader: React.ReactNode;
    theme: any;
}

const AddMembersButton: React.FC<AddMembersButtonProps> = ({totalUsers, usersLimit, channel, setHeader, theme}: AddMembersButtonProps) => {
    if (!totalUsers) {
        return (<LoadingSpinner/>);
    }

    const isPrivate = channel.type === Constants.PRIVATE_CHANNEL;
    const inviteUsers = totalUsers < usersLimit;

    return (
        inviteUsers && !isPrivate ? lessThanMaxFreeUsers(setHeader, theme) : moreThanMaxFreeUsers(channel, setHeader)
    );
};

const lessThanMaxFreeUsers = (setHeader: React.ReactNode, theme: any) => {
    return (
        <>
            {setHeader}
            <div className='LessThanMaxFreeUsers'>
                <MembersSvg theme={theme}/>
                <div className='titleAndButton'>
                    <FormattedMessage
                        id='intro_messages.inviteOthersToWorkspace.title'
                        defaultMessage='Let’s add some people to the workspace!'
                    />
                    <ToggleModalButtonRedux
                        accessibilityLabel={Utils.localizeMessage('intro_messages.inviteOthers', 'Invite others to the workspace')}
                        id='introTextInvite'
                        className='intro-links color--link cursor--pointer'
                        modalId={ModalIdentifiers.INVITATION}
                        dialogType={InvitationModal}
                    >
                        <FormattedMessage
                            id='generic_icons.add'
                            defaultMessage='Add Icon'
                        >
                            {(title: string) => (
                                <i
                                    className='icon-email-plus-outline'
                                    title={title}
                                />
                            )}
                        </FormattedMessage>
                        <FormattedMessage
                            id='intro_messages.inviteOthersToWorkspace.button'
                            defaultMessage='Invite others to the workspace'
                        />
                    </ToggleModalButtonRedux>
                </div>
            </div>
        </>
    );
};

const moreThanMaxFreeUsers = (channel: Channel, setHeader: React.ReactNode) => {
    const modal = channel.group_constrained ? AddGroupsToChannelModal : ChannelInviteModal;
    const channelIsArchived = channel.delete_at !== 0;
    if (channelIsArchived) {
        return null;
    }
    const isPrivate = channel.type === Constants.PRIVATE_CHANNEL;
    return (
        <div className='MoreThanMaxFreeUsersWrapper'>
            <div className='MoreThanMaxFreeUsers'>

            </div>
        </div>
    );
};

export default React.memo(AddMembersButton);
