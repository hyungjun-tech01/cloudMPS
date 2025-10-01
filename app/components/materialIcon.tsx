import React from 'react';
import 'material-icons/iconfont/material-icons.css';

export default function MaterialIcon({
    name, type, props
}: {
    name: string,
    type?: string,
    props: string
}) {
    const type_name = 'material-icons' + (type ? `-${type}` : '');

    return React.createElement('span', { className : `${type_name}  ${props}` }, name);
}