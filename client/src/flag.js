import React from 'react';

function flag(country) {
    return (
        <img
            src={require('./emoji/' + country + '.png')}
            style={{
                display: 'inline-block',
                width: '1em',
                height: '1em',
                verticalAlign: 'middle'
            }}
        />
    )
}

export default flag;