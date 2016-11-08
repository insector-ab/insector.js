import _ from 'lodash';
import classNames from 'classnames';
import React from 'react';

/**
 * FAButton
 */
export class FAButton extends React.Component {

    render() {
        let attrs = _.omit(this.props, ... _.keys(FAButton.propTypes));
        attrs.type = attrs.type || 'button';
        attrs.className = classNames('btn', attrs.className || '');
        let iconCls = classNames('fa', this.props.faClassName || '', this.props.faIcon);
        return (
            <button {... attrs}>
                <span className={iconCls} />
                {this.props.title &&
                    <span> {this.props.title}</span>
                }
                {this.props.children}
            </button>
        );
    }

}
FAButton.propTypes = {
    title: React.PropTypes.string,
    faIcon: React.PropTypes.string,
    faClassName: React.PropTypes.string,
    children: React.PropTypes.node
};

/**
 * FANavItem
 */
export class FANavItem extends React.Component {

    render() {
        let attrs = _.omit(this.props, ... _.keys(FANavItem.propTypes));
        let classes = classNames(
            {'page-route': this.props.href}
        );
        return (
            <li {... attrs}>
                <a href={this.props.href} tabIndex="0" className={classes}>
                    {this.props.faIcon &&
                        <span className={classNames('fa', 'fa-fw', this.props.faIcon)}></span>
                    }
                    <span> {this.props.title}</span>
                </a>
            </li>
        );
    }

}
FANavItem.propTypes = {
    href: React.PropTypes.string,
    faIcon: React.PropTypes.string,
    title: React.PropTypes.string
};

/**
 * ShowAllAboveButton
 */
export class ShowAllAboveButton extends React.Component {

    render() {
        let attrs = _.omit(this.props, 'children');
        let btnCls = classNames(
            'btn btn-lg btn-default btn-transp',
            attrs.className || ''
        );
        return (
            <div className="fade-content-above">
                <div className="gradient"></div>
                <div className="btn-wrapper text-center">
                    <button className={btnCls}>
                        {this.props.children ||
                            [(<span className="fa fa-angle-down" />),
                             (<span> Show all</span>)]
                        }
                    </button>
                </div>
            </div>
        );
    }

}
ShowAllAboveButton.propTypes = {
    children: React.PropTypes.node
};

/**
 * Base64IMG
 */
export class Base64IMG extends React.Component {
    render() {
        let src = Base64IMG.getSrc(this.props.mimetype, this.props.data);
        return (
            <img src={src} width={this.props.width} height={this.props.height} alt={this.props.alt} />
        );
    }
}
Base64IMG.propTypes = {
    mimetype: React.PropTypes.string,
    data: React.PropTypes.string,
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
 * UserFilter
 */
export class UserFilter extends React.Component {

    render() {
        // console.log('UserFilter.render selectedUserId:', this.props.selectedUserId);
        return (
            <div className={classNames('filter', this.props.className || '')}>
                <h4>User</h4>
                <select tabIndex="0" className="user-filter-select form-control" value={this.props.selectedUserId}>
                    <option value="-1">Anyone</option>

                    {this.props.users.map(user => {
                        let countStr = this.props.countKey ? ' (' + user[this.props.countKey] + ')' : '';
                        return (
                            <option value={user.id} key={user.id}>
                                {user.fullname}{countStr}
                            </option>
                        );
                    })}

                </select>
            </div>
        );
    }

}
UserFilter.propTypes = {
    selectedUserId: React.PropTypes.number,
    users: React.PropTypes.array,
    countKey: React.PropTypes.string,
    className: React.PropTypes.string
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
