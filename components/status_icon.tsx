// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import StatusAwayAvatarIcon from 'components/widgets/icons/status_away_avatar_icon';
import StatusAwayIcon from 'components/widgets/icons/status_away_icon';
import StatusDndAvatarIcon from 'components/widgets/icons/status_dnd_avatar_icon';
import StatusDndIcon from 'components/widgets/icons/status_dnd_icon';
import StatusOfflineAvatarIcon from 'components/widgets/icons/status_offline_avatar_icon';
import StatusOfflineIcon from 'components/widgets/icons/status_offline_icon';
import StatusOnlineAvatarIcon from 'components/widgets/icons/status_online_avatar_icon';
import StatusOnlineIcon from 'components/widgets/icons/status_online_icon';
import {Permissions} from "mattermost-redux/constants";
import AgfStatusIcon from "components/widgets/icons/agf_status_icon";
import {getMySystemRoles} from "mattermost-redux/selectors/entities/roles_helpers";

type Props = {
    button?: boolean;
    status?: string;
    className?: string;
    type?: string;
    roles?: string;
}

export default class StatusIcon extends React.PureComponent<Props> {
    static defaultProps = {
        className: '',
        button: false,
    };

    render() {
        const {button, status, type} = this.props;

        if (!status) {
            return null;
        }

        let className = 'status ' + this.props.className;

        if (button) {
            className = this.props.className || '';
        }

        let IconComponent: React.ComponentType<{className?: string}> | string;
        const iconComponentProps = {className, roles_agf: status};
        if (type === 'avatar') {
            if(status.includes(Permissions.USER_STATUS_MODERATOR) ||
                status.includes(Permissions.USER_STATUS_FOUNDER) ||
                status.includes(Permissions.USER_STATUS_MENTOR)){
                IconComponent = AgfStatusIcon;
            }else if (status === 'online') {
                IconComponent = StatusOnlineAvatarIcon;
            } else if (status === 'away') {
                IconComponent = StatusAwayAvatarIcon;
            } else if (status === 'dnd') {
                IconComponent = StatusDndAvatarIcon;
            } else {
                return null;
                IconComponent = StatusOfflineAvatarIcon;
            }
        }else if(status.includes(Permissions.USER_STATUS_MODERATOR) ||
            status.includes(Permissions.USER_STATUS_FOUNDER) ||
            status.includes(Permissions.USER_STATUS_MENTOR)){
            IconComponent = AgfStatusIcon;
        }
        else if (status === 'online') {
            IconComponent = StatusOnlineIcon;
        } else if (status === 'away') {
            IconComponent = StatusAwayIcon;
        } else if (status === 'dnd') {
            IconComponent = StatusDndIcon;
        }
        else {
            return null;
        }

        return <IconComponent {...iconComponentProps}/>;
    }
}

