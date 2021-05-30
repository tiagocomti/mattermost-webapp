// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

type Props = {
    inputId?: string;
    label: React.ReactNode;
    labelClassName?: string;
    inputClassName?: string;
    children: React.ReactNode;
    helpText?: React.ReactNode;
    footer?: React.ReactNode;
    resize?: false;
    type?: "";
}

const Setting: React.FC<Props> = ({
                                      inputId,
                                      label,
                                      labelClassName,
                                      inputClassName,
                                      children,
                                      footer,
                                      helpText,
                                      resize,
                                      type,
                                  }: Props) => {
    if(type === "textarea"){
        return (
            <div
                data-testid={inputId}
                className='form-group'
                style={{marginTop: "50px"}}
            >
                <label
                    data-testid={inputId + 'label'}
                    className={'control-label ' + labelClassName}
                    htmlFor={inputId}
                >
                    {label}
                </label>
                <div className={inputClassName}>
                    {children}
                    <div
                        data-testid={inputId + 'help-text'}
                        className='help-text'
                    >
                        {helpText}
                    </div>
                    {footer}
                </div>
            </div>
        );
    }
    else if(resize == false || resize == undefined || resize == "") {
        return (
            <div
                data-testid={inputId}
                className='form-group'
            >
                <label
                    data-testid={inputId + 'label'}
                    className={'control-label ' + labelClassName}
                    htmlFor={inputId}
                >
                    {label}
                </label>
                <div className={inputClassName}>
                    {children}
                    <div
                        data-testid={inputId + 'help-text'}
                        className='help-text'
                    >
                        {helpText}
                    </div>
                    {footer}
                </div>
            </div>
        );
    }
    else{
        let style = {height: "19px"};
        if(inputId == "troca"){
            style = {height: "25px"}
        }
        return (
            <div
                data-testid={inputId}
                className='form-group'
                style={style}
            >
                <label
                    data-testid={inputId + 'label'}
                    className={'control-label ' + labelClassName}
                    htmlFor={inputId}
                >
                    {label}
                </label>
                <div className={inputClassName}>
                    {children}
                    <div
                        data-testid={inputId + 'help-text'}
                        className='help-text'
                    >
                        {helpText}
                    </div>
                    {footer}
                </div>
            </div>
        );
    }
};

export default Setting;
