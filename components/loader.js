import React from 'react';

export class Loader extends React.Component {

    render() {
        return (
            <div className="react-loader cover">
                <div className="cover"></div>
                <div className="circle circle1"></div>
                <div className="circle circle2"></div>
            </div>
        );
    }

}
