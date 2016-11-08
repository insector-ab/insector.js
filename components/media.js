import _ from 'lodash';
import classNames from 'classnames';
import React from 'react';

// --------- Concrete items --------- //

/**
 * FAMediaItem
 */
export class FAMediaItem extends React.Component {

    render() {
        let attrs = _.omit(this.props, ... _.keys(FAMediaItem.propTypes));
        attrs.className = classNames('fa-media', attrs.className || '');
        return (
            <Media {... attrs}>
                <MediaLeft>
                    <span className={classNames('media-object fa fa-fw', this.props.faSize, this.props.faIcon)} />
                </MediaLeft>
                <MediaBody>
                    {this.props.children}
                </MediaBody>
            </Media>
        );
    }

}
FAMediaItem.propTypes = {
    faIcon: React.PropTypes.string,
    faSize: React.PropTypes.string,
    children: React.PropTypes.node
};
FAMediaItem.defaultProps = {
    faicon: 'fa-circle-thin'
};

// --------- Item components (composition) --------- //

/**
 * Media
 */
export class Media extends React.Component {

    render() {
        let attrs = _.omit(this.props, ... _.keys(Media.propTypes));
        attrs.className = classNames('media', attrs.className || '');
        return (
            <div {... attrs}>
                {this.props.children}
            </div>
        );
    }

}
Media.propTypes = {
    children: React.PropTypes.node
};

/**
 * MediaLeft
 */
export class MediaLeft extends React.Component {

    render() {
        let attrs = _.omit(this.props, ... _.keys(MediaLeft.propTypes));
        attrs.className = classNames('media-left', attrs.className || '');
        return (
            <div {... attrs}>
                {this.props.children}
            </div>
        );
    }

}
MediaLeft.propTypes = {
    children: React.PropTypes.node
};

/**
 * MediaBody
 */
export class MediaBody extends React.Component {

    render() {
        let attrs = _.omit(this.props, ... _.keys(MediaBody.propTypes));
        attrs.className = classNames('media-body', attrs.className || '');
        return (
            <div {... attrs}>
                {this.props.children}
            </div>
        );
    }

}
MediaBody.propTypes = {
    children: React.PropTypes.node
};
