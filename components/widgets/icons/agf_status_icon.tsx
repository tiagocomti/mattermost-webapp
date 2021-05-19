// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {useIntl} from 'react-intl';

export default function StatusDndAvatarIcon(props: React.HTMLAttributes<HTMLSpanElement>) {
    const {formatMessage} = useIntl();
    return (
        <span {...props} class={'status'}>
            <img src={'https://tc.tradersclub.com.br/static/files/8fbe9849d48fe32bfa4f5c03df0455b5.svg'} />
        </span>
    );
}
