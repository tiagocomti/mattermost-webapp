import {UserProfile} from 'mattermost-redux/types/users';
import React from 'react';
import {AnyAction, Dispatch} from 'redux';

import {GlobalState} from 'mattermost-redux/types/store';


import {GetStateFunc} from "mattermost-redux/types/actions";
import apps_form from "../apps_form/apps_form";
import {getCurrentChannel} from "mattermost-redux/selectors/entities/channels";
import {getCurrentTeamId} from "mattermost-redux/selectors/entities/teams";
import {Client4} from "mattermost-redux/client";
import {IntegrationTypes} from "mattermost-redux/action_types";

type Props = {
    debug: GlobalState;
    user: UserProfile;
    currentUserID: string;
    openRHS: (() => void) | null;
    hide: () => void;
    status?: string;
    actions: {
        openRadarDialog: () => void;
    };
}

class OpenRadar extends React.PureComponent<Props> {
    public static defaultProps = {
        show: false,
        title: 'Change URL',
        submitButtonText: 'Save',
        currentURL: '',
        serverError: null,
        actions: {
            openRadarDialog
        }
    }

    constructor(props: Props) {
        super(props);
    }

    handleSubmitDialog = () => {
        console.log(this.props);
        var promise = new Promise(function(openRadarDialog) {
            // call resolve if the method succeeds
            resolve(true);
        })
        promise.then(bool => console.log('Bool is true'))

        openRadarDialog();
    }

    render() {
        return (
            <div>
                <button
                    id='create_post_radar'
                    onClick={this.handleSubmitDialog}
                >
                    Clique aqui
                </button>
            </div>
        );
        // return (
        //     <div>
        //         <form
        //             id='create_post_radar'
        //             onsubmit={this.handleSubmitDialog}
        //         >
        //            <button type={'submit'}> Apenas um tste </button>
        //         </form>
        //     </div>
        // );
    }
}

export default OpenRadar;
export function openRadarDialog() {
    console.log("passou aqui ainda");
    return (dispatch: Dispatch<AnyAction>, getState: GetStateFunc) => {
        let command = '/radar';
        console.log("passou aquiisss");
        clientExecuteCommand(dispatch, getState, command);
        return {data: true};
    };
}

export async function clientExecuteCommand(dispatch: Dispatch<AnyAction>, getState: GetStateFunc, command: string) {
    let currentChannel = getCurrentChannel(getState());
    const currentTeamId = getCurrentTeamId(getState());

    // Default to town square if there is no current channel (i.e., if Mattermost has not yet loaded)
    if (!currentChannel) {
        currentChannel = await Client4.getChannelByName(currentTeamId, 'town-square');
    }

    const args = {
        channel_id: currentChannel?.id,
        team_id: currentTeamId,
    };

    try {
        //@ts-ignore Typing in mattermost-redux is wrong
        const data = await Client4.executeCommand(command, args);
        dispatch(setTriggerId(data?.trigger_id));
        console.log(data);
    } catch (error) {
        console.log(error); //eslint-disable-line no-console
    }
}

export function setTriggerId(triggerId: string) {
    return {
        type: IntegrationTypes.RECEIVED_DIALOG_TRIGGER_ID,
        data: triggerId,
    };
}

