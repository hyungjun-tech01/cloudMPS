import React from 'react';
import 'material-icons/iconfont/material-icons.css';

export default function MaterialIcon({ name, type, props }: { name: string, type: string, props: string }) {
    return React.createElement('span', { className : `material-icons-${type}  ${props}` }, name);
}