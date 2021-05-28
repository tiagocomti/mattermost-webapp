// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

type RadioGroupProps = {
    id: string;
    values: Array<{ key: string; value: string}>;
    value: string;
    isDisabled?: (id: string) => boolean | boolean;
    onChange(e: React.ChangeEvent<HTMLInputElement>): void;
}
const RadioButtonGroup: React.FC<RadioGroupProps> = ({
    id,
    onChange,
    isDisabled,
    values,
    value,
}: RadioGroupProps) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e);
    };

    const options = [];
    for (const {value: val, key} of values) {
        const disabled = isDisabled ? isDisabled(val) : false;
        options.push(
            <div
                className='radio'
                key={val}
            >
                <label className={val === value ? 'selected' : ''}>
                    <input
                        type='radio'
                        value={val}
                        name={id}
                        checked={val === value}
                        onChange={handleChange}
                        disabled={disabled}
                    />
                    {key}
                </label>
            </div>,
        );
    }

    return (
        <div className='radio-list'>
            {options}
        </div>
    );
};

export default RadioButtonGroup;
