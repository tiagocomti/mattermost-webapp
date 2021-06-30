// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {CSSProperties} from 'react';
import {useIntl} from 'react-intl';
import {Permissions} from "mattermost-redux/constants";

export default function AgfPopoverIcon(props: React.HTMLAttributes<HTMLSpanElement>) {
    let texto_status = "Membro ";
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
    const {formatMessage} = useIntl();

    if(props.roles_agf.includes(Permissions.USER_STATUS_MODERATOR)) {
        return (
            <span {...props}>
             <img src={'/static/badges/moderador_icone.svg'} style={{
                 height: "40px",
                 width: "100px !important",
                 maxWidth: "100px",
                 left: "-10px",
                 top: "-11px",
                 position: "relative"
             }}/>
             <span class="tooltip-agf-text">{texto_status}</span>
        </span>
        );
    }else if(props.roles_agf.includes(Permissions.USER_STATUS_MENTOR)){
        return (
            <span {...props}>
             <img src={'/static/badges/mentor_icone.svg'} style={{
                 height: "40px",
                 width: "100px !important",
                 maxWidth: "100px",
                 left: "-10px",
                 top: "-11px",
                 position: "relative"
             }}/>
             <span class="tooltip-agf-text">{texto_status}</span>
            </span>
        );
    }else if(props.roles_agf.includes(Permissions.USER_STATUS_FOUNDER) || props.roles_agf.includes(Permissions.USER_STATUS_FOUNDER_PRIME)){
        return (
            <span {...props}>
             <img src={'/static/badges/fundador_icone.svg'} style={{
                 height: "40px",
                 width: "100px !important",
                 maxWidth: "100px",
                 left: "-10px",
                 top: "-11px",
                 position: "relative"
             }}/>
             <span class="tooltip-agf-text">{texto_status}</span>
            </span>
        );
    }
}

const style: CSSProperties = {
    fillRule: 'evenodd',
    clipRule: 'evenodd',
    strokeLinejoin: 'round',
    strokeMiterlimit: 1.41421,
};
