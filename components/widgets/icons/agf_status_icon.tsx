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
    }else if(props.roles_agf.includes(Permissions.USER_FRAME_BRONZE)){
        texto_status += "Bronze";
    }
    if(props.roles_agf.includes(Permissions.USER_STATUS_MODERATOR)){
        texto_status += " e Moderador";
    }else if(props.roles_agf.includes(Permissions.USER_STATUS_MENTOR)){
        texto_status += " e Colaborador";
    }else if(props.roles_agf.includes(Permissions.USER_STATUS_FOUNDER_PRIME)){
        texto_status += " e Fundador Prime";
    }else if(props.roles_agf.includes(Permissions.USER_STATUS_FOUNDER)){
        texto_status += " e Fundador";
    }


    if(props.roles_agf.includes(Permissions.USER_STATUS_MODERATOR)){
        return (
            <span {...props} class={'status'}>
                <img src={'/static/badges/moderador_icone.svg'} style={{height: "16px"}} />
                <span class="tooltip-agf-text">{texto_status}</span>
            </span>
        );
    }else if(props.roles_agf.includes(Permissions.USER_STATUS_MENTOR)){
        return (
            <span {...props} class={'status'}>
                <img src={'/static/badges/mentor_icone.svg'} style={{height: "16px"}} />
                <span class="tooltip-agf-text">{texto_status}</span>
            </span>
        );
    }else if(props.roles_agf.includes(Permissions.USER_STATUS_FOUNDER) || props.roles_agf.includes(Permissions.USER_STATUS_FOUNDER_PRIME)){
        return (
            <span {...props} class={'status'}>
                <img src={'/static/badges/fundador_icone.svg'} style={{height: "15px"}} />
                <span class="tooltip-agf-text">{texto_status}</span>
            </span>
        );
    }

}
