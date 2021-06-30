// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import {Channel} from 'mattermost-redux/types/channels';

import {trackEvent} from 'actions/telemetry_actions';
import * as GlobalActions from 'actions/global_actions';

import SidebarChannelLink from 'components/sidebar/sidebar_channel/sidebar_channel_link';
import SharedChannelIndicator from 'components/shared_channel_indicator';
import {localizeMessage} from 'utils/utils';
import Constants from 'utils/constants';

type Props = {
    channel: Channel;
    currentTeamName: string;
    isCollapsed: boolean;
    actions: {
        leaveChannel: (channelId: any) => void;
    };
};

type State = {

};

export default class SidebarBaseChannel extends React.PureComponent<Props, State> {
    handleLeavePublicChannel = () => {
        this.props.actions.leaveChannel(this.props.channel.id);
        trackEvent('ui', 'ui_public_channel_x_button_clicked');
    }

    handleLeavePrivateChannel = () => {
        GlobalActions.showLeavePrivateChannelModal({id: this.props.channel.id, display_name: this.props.channel.display_name} as Channel);
        trackEvent('ui', 'ui_private_channel_x_button_clicked');
    }

    getCloseHandler = () => {
        const {channel} = this.props;

        if (channel.type === Constants.OPEN_CHANNEL && channel.name !== Constants.DEFAULT_CHANNEL) {
            return this.handleLeavePublicChannel;
        } else if (channel.type === Constants.PRIVATE_CHANNEL) {
            return this.handleLeavePrivateChannel;
        }

        return null;
    }

    getIcon = () => {
        const {channel} = this.props;

        if (channel.shared) {
            return (
                <SharedChannelIndicator
                    className='icon'
                    channelType={channel.type}
                    withTooltip={true}
                />
            );
        } else if (channel.type === Constants.OPEN_CHANNEL) {
            return (
                <i className='icon icon-globe'/>
            );
        } else if(channel.display_name === "Radar"){
            return (
                <div className='suggestion-list__icon suggestion-list__icon--large' style={{opacity:1,margin: "0 4px 0 0"}}>
                    <span alt=':crocodile:' className='emoticon' title=':crocodile:'
                          style={{backgroundImage: 'url(/static/emoji/1f40a.png)',marginRight: '1px'}} >:crocodile:</span>
                </div>
            );
        } else if(channel.display_name === "Insights"){
            return (
                <div className='suggestion-list__icon suggestion-list__icon--large' style={{opacity:1,margin: "0 4px 0 0"}}>
                    <span alt=':crocodile:' className='emoticon' title='Insights'
                          style={{backgroundImage: 'url(/static/badges/mentor_icone.svg)',backgroundSize:'17px',marginRight: '1px'}} >:crocodile:</span>
                </div>
            );
        }else if(channel.display_name === "Investimentos"){
            return (
                <div className='suggestion-list__icon suggestion-list__icon--large' style={{opacity:1,margin: "0 4px 0 0"}}>
                    <span alt=':crocodile:' className='emoticon' title='Investimentos'
                          style={{backgroundImage: 'url(/static/emoji/1f4b0.png)',marginRight: '1px'}} >:moneybag:</span>
                </div>
            );
        }else if(channel.display_name === "Ajuda"){
            return (
                <div className='suggestion-list__icon suggestion-list__icon--large' style={{opacity:1,margin: "0 4px 0 0"}}>
                    <span alt=':crocodile:' className='emoticon' title='Ajuda'
                          style={{backgroundImage: 'url(/static/emoji/2754.png)',marginRight: '1px'}} >:question:</span>
                </div>
            );
        }else if(channel.display_name === "Regras"){
            return (
                <div className='suggestion-list__icon suggestion-list__icon--large' style={{opacity:1,margin: "0 4px 0 0"}}>
                    <span alt=':crocodile:' className='emoticon' title='Regras'
                          style={{backgroundImage: 'url(/static/emoji/1f4d6.png)',marginRight: '1px'}} >:book:</span>
                </div>
            );
        }else if(channel.display_name === "Moderadores"){
            return (
                <div className='suggestion-list__icon suggestion-list__icon--large' style={{opacity:1,margin: "0 4px 0 0"}}>
                    <span alt=':crocodile:' className='emoticon' title='Moderadores'
                          style={{backgroundImage: 'url(/static/badges/moderador_icone.svg)',backgroundSize:'17px',marginRight: '1px'}} >:book:</span>
                </div>
            );
        }else if(channel.display_name === "Melhorias"){
            return (
                <div className='suggestion-list__icon suggestion-list__icon--large' style={{opacity:1,margin: "0 4px 0 0"}}>
                    <span alt=':gear:' className='emoticon' title='Moderadores'
                          style={{backgroundImage: 'url(/static/emoji/2699-fe0f.png)',marginRight: '1px'}} >:gear:</span>
                </div>
            );
        }
        else if (channel.type === Constants.PRIVATE_CHANNEL) {
            return (
                <i className='icon icon-lock-outline'/>
            );
        }

        return null;
    }

    render() {
        const {channel, currentTeamName} = this.props;

        let ariaLabelPrefix;
        if (channel.type === Constants.OPEN_CHANNEL) {
            ariaLabelPrefix = localizeMessage('accessibility.sidebar.types.public', 'public channel');
        } else if (channel.type === Constants.PRIVATE_CHANNEL) {
            ariaLabelPrefix = localizeMessage('accessibility.sidebar.types.private', 'private channel');
        }

        return (
            <SidebarChannelLink
                channel={channel}
                link={`/${currentTeamName}/channels/${channel.name}`}
                label={channel.display_name}
                ariaLabelPrefix={ariaLabelPrefix}
                closeHandler={this.getCloseHandler()!}
                icon={this.getIcon()!}
                isCollapsed={this.props.isCollapsed}
            />
        );
    }
}
