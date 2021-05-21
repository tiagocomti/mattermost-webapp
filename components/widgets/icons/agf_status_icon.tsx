// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {useIntl} from 'react-intl';
import {Permissions} from "mattermost-redux/constants";

export default function AgfStatusIcon(props: React.HTMLAttributes<HTMLSpanElement>) {
    let texto_status = "Membro ";
    const {formatMessage} = useIntl();
    if(props.roles_agf.includes(Permissions.USER_FRAME_GOLD)){
        texto_status += "Gold";
    }
    if(props.roles_agf.includes(Permissions.USER_STATUS_MODERATOR)){
        texto_status += " e moderador";
    }

    return (
        <span {...props} class={'status'}>
            <img src={'https://tc.tradersclub.com.br/static/files/8fbe9849d48fe32bfa4f5c03df0455b5.svg'} style={{height: "15px"}} />
            <span class="tooltip-agf-text">{texto_status}</span>
        </span>
    );
}
