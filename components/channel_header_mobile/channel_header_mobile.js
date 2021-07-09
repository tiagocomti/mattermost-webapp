// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import PropTypes from 'prop-types';

import {FormattedMessage} from 'react-intl';
import {Tooltip, Overlay} from 'react-bootstrap';
import classNames from 'classnames';

import {MobileChannelHeaderDropdown} from 'components/channel_header_dropdown';
import MobileChannelHeaderPlug from 'plugins/mobile_channel_header_plug';

import * as Utils from 'utils/utils';

import CollapseLhsButton from './collapse_lhs_button';
import CollapseRhsButton from './collapse_rhs_button';
import ChannelInfoButton from './channel_info_button';
import ShowSearchButton from './show_search_button';
import UnmuteChannelButton from './unmute_channel_button';
import OverlayTrigger from "../overlay_trigger";
import {Constants} from "../../utils/constants";
import store from "../../stores/redux_store";
import {searchForTerm} from "../../actions/post_actions";

export default class ChannelHeaderMobile extends React.PureComponent {
    static propTypes = {

        /**
         *
         */
        user: PropTypes.object.isRequired,

        /**
         * Object with info about current channel
         */
        channel: PropTypes.object,

        /**
         * Bool whether the current channel is read only
         */
        isReadOnly: PropTypes.bool,

        /**
         * Bool whether the current channel is muted
         */
        isMuted: PropTypes.bool,

        /**
         * Bool whether the right hand side is open
         */
        isRHSOpen: PropTypes.bool,

        /**
         * Relative url for the team, used to redirect if a link in the channel header is clicked
         */
        currentRelativeTeamUrl: PropTypes.string,

        inGlobalThreads: PropTypes.bool,

        /**
         * Object with action creators
         */
        actions: PropTypes.shape({
            closeLhs: PropTypes.func.isRequired,
            closeRhs: PropTypes.func.isRequired,
            closeRhsMenu: PropTypes.func.isRequired,
        }).isRequired,

    };

    componentDidMount() {
        document.querySelector('.inner-wrap').addEventListener('click', this.hideSidebars);
    }

    componentWillUnmount() {
        document.querySelector('.inner-wrap').removeEventListener('click', this.hideSidebars);
    }

    hideSidebars = (e) => {
        if (Utils.isMobile()) {
            this.props.actions.closeRhs();

            if (e.target.className !== 'navbar-toggle' && e.target.className !== 'icon-bar') {
                this.props.actions.closeLhs();
                this.props.actions.closeRhsMenu();
            }
        }
    }
    searchForMentors = (e) => {
        e.stopPropagation();
        store.dispatch(searchForTerm("From: louise.barsi From:felipe.ruiz From: fabio.baroni In: "+this.props.channel.display_name));
    };

    render() {
        const {user, channel, isMuted, isReadOnly, isRHSOpen, currentRelativeTeamUrl, inGlobalThreads} = this.props;

        let heading;
        if (inGlobalThreads) {
            heading = (
                <FormattedMessage
                    id='globalThreads.heading'
                    defaultMessage='Followed threads'
                />
            );
        } else if (channel) {
            heading = (
                <>
                    <MobileChannelHeaderDropdown/>
                    {isMuted && (
                        <UnmuteChannelButton
                            user={user}
                            channel={channel}
                        />
                    )}
                </>
            );
        }
        let toggleSearchForMentors = null;
        let toggleFavoriteSearchMentors;
        const formattedMessageMentors = {
            id: 'channelHeader.searchForMentors',
            defaultMessage: 'Procure por colaboradores nesse canal',
        }
        toggleFavoriteSearchMentors = (
            <Tooltip id='searchForMentorsTooltip' >
                <FormattedMessage
                    {...formattedMessageMentors}
                />
            </Tooltip>
        );
        if(this.props.channel === undefined ||
            this.props.channel.id === "f14wxd4z1pnf78941gmrmjqyzo" ||
            this.props.channel.id === "INs4pou39inturgfzennmfk4gr" ||
            this.props.channel.id === "dwu4pou39inturgfzennmfk4gr") {
            toggleSearchForMentors = (
                <OverlayTrigger
                    key={`isSearchMentors`}
                    delayShow={Constants.OVERLAY_TIME_DELAY}
                    placement='bottom'
                    overlay={toggleFavoriteSearchMentors}
                >
                    <button
                        id='postsFromMentors'
                        onClick={this.searchForMentors}
                        className={'style--none color--link channel-header__favorites '}
                        aria-label={'mentors'}
                        style={{marginTop: '-3px'}}
                    >
                            <span alt=':crocodile:' className='emoticon' title='Insights' style={{
                                backgroundImage: 'url(/static/badges/mentor_icone.svg)',
                                backgroundSize: '30px',
                                marginRight: '8px',
                                borderRadius: '100%',
                                width: "30px",
                                height: "30px"

                            }}>:crocodile:</span>
                    </button>
                </OverlayTrigger>
            );
        }

        return (
            <nav
                id='navbar'
                className='navbar navbar-default navbar-fixed-top'
                role='navigation'
            >
                <div className='container-fluid theme'>
                    <div className='navbar-header'>
                        <CollapseLhsButton/>
                        <div className={classNames('navbar-brand', {GlobalThreads___title: inGlobalThreads})}>
                            {heading}
                        </div>
                        <div className='spacer'/>
                        {channel && (
                            <ChannelInfoButton
                                channel={channel}
                                isReadOnly={isReadOnly}
                                isRHSOpen={isRHSOpen}
                                currentRelativeTeamUrl={currentRelativeTeamUrl}
                            />
                        )}
                        {toggleSearchForMentors}
                        <ShowSearchButton/>
                        {channel && (
                            <MobileChannelHeaderPlug
                                channel={channel}
                                isDropdown={false}
                            />
                        )}
                        <CollapseRhsButton/>
                    </div>
                </div>
            </nav>
        );
    }
}
