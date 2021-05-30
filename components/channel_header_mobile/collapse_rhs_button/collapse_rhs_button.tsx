// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import MenuIcon from 'components/widgets/icons/menu_icon';

type Actions = {
    toggleRhsMenu: (e?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

type Props = {
    actions: Actions;
}

const CollapseRhsButton: React.FunctionComponent<Props> = (props: Props) => (
    <div></div>
);

export default CollapseRhsButton;
