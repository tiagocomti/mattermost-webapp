// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {connect} from 'react-redux';

import {
    getMySystemRoles,
    haveISystemPermission
} from 'mattermost-redux/selectors/entities/roles';

import {GlobalState} from 'types/store';

import SystemPermissionGate from './system_permission_gate';

type Props = {
    permissions: string[];
}
function mapStateToProps(state: GlobalState, ownProps: Props) {
    for (const permission of ownProps.permissions) {
        if(permission == "user_gold" || permission == "user_bronze" ){
            let myPermissions = getMySystemRoles(state);
            if(myPermissions.has(permission))
            {
                return {hasPermission: true};
            }
        }
        else if (haveISystemPermission(state, {permission})) {
            return {hasPermission: true};
        }
    }

    return {hasPermission: false};
}
export default connect(mapStateToProps)(SystemPermissionGate);
