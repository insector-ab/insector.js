import _ from 'lodash';
import classNames from 'classnames';
import React from 'react';

/**
 * Loader
 */
export function Loader(props) {
    return (
        <div className="react-loader cover">
            <div className="cover"></div>
            <div className="circle circle1"></div>
            <div className="circle circle2"></div>
        </div>
    );
}

// --------- Media components (composition) --------- //

/**
 * Media
 */
export function Media(props) {
    let attrs = _.omit(props, ... _.keys(Media.propTypes));
    attrs.className = classNames('media', attrs.className || '');
    return (
        <div {... attrs}>
            {props.children}
        </div>
    );
}
Media.propTypes = {
    children: React.PropTypes.node
};

/**
 * MediaLeft
 */
export function MediaLeft(props) {
    let attrs = _.omit(props, ... _.keys(MediaLeft.propTypes));
    attrs.className = classNames('media-left', attrs.className || '');
    return (
        <div {... attrs}>
            {props.children}
        </div>
    );
}
MediaLeft.propTypes = {
    children: React.PropTypes.node
};

/**
 * MediaBody
 */
export function MediaBody(props) {
    let attrs = _.omit(props, ... _.keys(MediaBody.propTypes));
    attrs.className = classNames('media-body', attrs.className || '');
    return (
        <div {... attrs}>
            {props.children}
        </div>
    );
}
MediaBody.propTypes = {
    children: React.PropTypes.node
};

// --------- Special, move somewhere else? --------- //

/**
 * CloudItem
 */
export function CloudItem(props) {
    let attrs = _.omit(props, ... _.keys(CloudItem.propTypes));
    attrs.className = classNames('cloud-item', attrs.className || '');
    if (!attrs.hasOwnProperty('tabIndex')) {
        let cls = attrs.className.toString();
        if (!(cls.indexOf('disabled') > -1 || cls.indexOf('auto') > -1)) {
            attrs.tabIndex = 0;
        }
    }
    return (
        <div {...attrs}>
            <span className="cloud-item-text">{props.title}</span>
        </div>
    );
}
CloudItem.propTypes = {
    title: React.PropTypes.string
};

/**
 * Base64IMG
 */
export function Base64IMG(props) {
    let src = Base64IMG.getSrc(props.mimetype, props.data);
    return (
        <img src={src} width={props.width} height={props.height} alt={props.alt} />
    );
}
Base64IMG.propTypes = {
    mimetype: React.PropTypes.string.isRequired,
    data: React.PropTypes.string.isRequired,
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    alt: React.PropTypes.string
};

Base64IMG.MimeTypes = {
    PNG: 'image/png',
    JPG: 'image/jpg'
};

Base64IMG.getSrc = (mimetype, data) => {
    return 'data:' + mimetype + ';base64,' + data;
};

/**
 * GoogleStaticMap
 */
export class GoogleStaticMap extends React.Component {

    render() {
        let attrs = _.omit(this.props, ... _.keys(GoogleStaticMap.propTypes));
        attrs.className = classNames(
            'static-map',
            attrs.className || ''
        );
        attrs.style = _.defaults(
            this.props.style,
            GoogleStaticMap.defaultStyle
        );
        attrs.style.backgroundImage = 'url("' + this.getMapUrl() + '")';
        return (
            <div data-center={this.props.center} {... attrs} />
        );
    }

    getMapUrl() {
        let {center, size, scale, zoom} = this.props;
        if (center) {
            return 'http://maps.googleapis.com/maps/api/staticmap?center=' + center + '&maptype=roadmap&markers=color:0x33cfff|' + center + '&size=' + size + '&scale=' + scale + '&sensor=false&zoom=' + zoom + '&key=' + GoogleStaticMap.key + GoogleStaticMap.mapStyle;
        }
        // Undefined
        return 'http://maps.googleapis.com/maps/api/staticmap?maptype=roadmap&size=' + size + '&scale=' + scale + '&sensor=false&zoom=1&key=' + GoogleStaticMap.key + GoogleStaticMap.mapStyle;
    }

}
GoogleStaticMap.propTypes = {
    center: React.PropTypes.string,
    zoom: React.PropTypes.number,
    size: React.PropTypes.string,
    scale: React.PropTypes.number,
    style: React.PropTypes.object
};
GoogleStaticMap.defaultProps = {
    zoom: 2,
    size: '800x300',
    scale: 2,
    style: {}
};
GoogleStaticMap.defaultStyle = {
    paddingTop: '40%',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'cover'
};
GoogleStaticMap.key = 'AIzaSyC5viZWzGHUGHKBVZbhX5JcIcumJFAa_z4';
GoogleStaticMap.mapStyle = '&style=feature%3Awater%7Celement%3Ageometry%7Ccolor%3A0xc9c9c9%7Clightness%3A17%7C&style=feature%3Alandscape%7Celement%3Ageometry%7Ccolor%3A0xf5f5f5%7Clightness%3A20%7C&style=feature%3Aroad.highway%7Celement%3Ageometry.fill%7Ccolor%3A0xffffff%7Clightness%3A17%7C&style=feature%3Aroad.highway%7Celement%3Ageometry.stroke%7Ccolor%3A0xffffff%7Clightness%3A29%7Cweight%3A0.2%7C&style=feature%3Aroad.arterial%7Celement%3Ageometry%7Ccolor%3A0xffffff%7Clightness%3A18%7C&style=feature%3Aroad.local%7Celement%3Ageometry%7Ccolor%3A0xffffff%7Clightness%3A16%7C&style=feature%3Apoi%7Celement%3Ageometry%7Ccolor%3A0xf5f5f5%7Clightness%3A21%7C&style=feature%3Apoi.park%7Celement%3Ageometry%7Ccolor%3A0xdedede%7Clightness%3A21%7C&style=feature%3Aall%7Celement%3Alabels.text.stroke%7Cvisibility%3Aon%7Ccolor%3A0xffffff%7Clightness%3A16%7C&style=feature%3Aall%7Celement%3Alabels.text.fill%7Csaturation%3A0%7Ccolor%3A0x333333%7Clightness%3A40%7C&style=feature%3Aall%7Celement%3Alabels.icon%7Cvisibility%3Aoff%7C&style=feature%3Atransit%7Celement%3Ageometry%7Ccolor%3A0xf2f2f2%7Clightness%3A19%7C&style=feature%3Aadministrative%7Celement%3Ageometry.fill%7Ccolor%3A0xfefefe%7Clightness%3A20%7C&style=feature%3Aadministrative%7Celement%3Ageometry.stroke%7Ccolor%3A0xfefefe%7Clightness%3A17%7Cweight%3A1.2%7C';
