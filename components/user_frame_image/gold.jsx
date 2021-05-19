// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import menuItem from "../widgets/menu/menu_items/menu_item";
import {MenuItemActionImpl} from "../widgets/menu/menu_items/menu_item_action";

const MenuTopNotification => {
    if (!show) {
        return null;
    }

    return (
        <li
            className={'MenuTopNotification'}
            role='menuitem'
            id={id}
        >
            {children}
        </li>
    );
};

