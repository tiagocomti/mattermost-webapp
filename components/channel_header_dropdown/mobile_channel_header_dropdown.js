// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import PropTypes from 'prop-types';
import {FormattedMessage} from 'react-intl';

import StatusIcon from 'components/status_icon';

import {Constants} from 'utils/constants';

import {ChannelHeaderDropdownItems} from 'components/channel_header_dropdown';

import Menu from 'components/widgets/menu/menu';
import MenuWrapper from 'components/widgets/menu/menu_wrapper';

import MobileChannelHeaderDropdownAnimation from './mobile_channel_header_dropdown_animation.jsx';

export default class MobileChannelHeaderDropdown extends React.PureComponent {
    static propTypes = {
        user: PropTypes.object.isRequired,
        channel: PropTypes.object.isRequired,
        teammateId: PropTypes.string,
        teammateIsBot: PropTypes.bool,
        teammateStatus: PropTypes.string,
        displayName: PropTypes.string.isRequired,
    }

    getChannelTitle = () => {
        const {user, channel, teammateId, displayName} = this.props;

        if (channel.type === Constants.DM_CHANNEL) {
            if (user.id === teammateId) {
                return (
                    <FormattedMessage
                        id='channel_header.directchannel.you'
                        defaultMessage='{displayname} (you)'
                        values={{displayname: displayName}}
                    />
                );
            }
            return displayName;
        }
        return channel.display_name;
    }

    render() {
        const {teammateIsBot, teammateStatus} = this.props;
        let dmHeaderIconStatus;

        if (!teammateIsBot) {
            dmHeaderIconStatus = (
                <StatusIcon status={teammateStatus}/>
            );
        }

        return (
            <MenuWrapper animationComponent={MobileChannelHeaderDropdownAnimation}>
                <a>
                    <span className='heading'>
                        {dmHeaderIconStatus}
                        {this.getChannelTitle()}
                    </span>
                    <FormattedMessage
                        id='generic_icons.dropdown'
                        defaultMessage='Dropdown Icon'
                    >
                        {(title) => (
                            <span
                                className=''
                                title={title}
                            />
                        )}
                    </FormattedMessage>
                </a>

                <div></div>
            </MenuWrapper>
        );
    }
}
