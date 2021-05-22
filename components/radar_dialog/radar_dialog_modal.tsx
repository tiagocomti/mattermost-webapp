// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {Modal} from 'react-bootstrap';
import {FormattedMessage} from 'react-intl';

import {Channel} from 'mattermost-redux/types/channels';

import MemberListChannel from 'components/member_list_channel';
import ChannelInviteModal from 'components/channel_invite_modal';
import {ModalIdentifiers} from 'utils/constants';

type Props = {

    /**
     * Bool whether user has permission to manage current channel
     */
    canManageChannelMembers: boolean;

    /**
     * Object with info about current channel
     */
    channel: Channel;

    /**
     * Function that is called when modal is hidden
     */
    onHide: () => void;

    actions: {
        openModal: (modalData: {
            modalId: string;
            dialogProps: {[key: string]: any};
            dialogType: (props: any) => React.ReactElement | null;
        }) => Promise<{data: boolean}>;
    };
}

type State = {
    show: boolean;
}

export default class RadarDialogModal extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            show: true,
        };
    }

    handleHide = () => {
        this.setState({show: false});
    }

    handleExit = () => {
        this.handleHide();
    }

    render() {
        return (
            <div>
                <Modal
                    dialogClassName='a11y__modal more-modal more-modal--action'
                    show={this.state.show}
                    onHide={this.handleHide}
                    onExited={this.handleExit}
                    role='dialog'
                    aria-labelledby='channelPostRadarDialog'
                    id='postRadar'
                >
                    <Modal.Header closeButton={true}>
                        <Modal.Title
                            componentClass='h1'
                            id='channelMembersModalLabel'
                        >
                            <span className='name'>teste</span>
                            add Radar
                        </Modal.Title>
                        aaaaa
                    </Modal.Header>
                    <Modal.Body>]
                        BODY
                    </Modal.Body>
                </Modal>
            </div>
        );
    }
}
