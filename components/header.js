import _ from 'lodash';
import React from 'react';
import classNames from 'classnames';
import {ReactInput} from 'insectorjs/react/form';

/**
 * DropdownAppNav
 */
export class DropdownAppNav extends React.Component {

    render() {
        let attrs = _.omit(this.props, 'username');
        attrs.className = classNames('dropdown', 'btn-group', 'app-nav', attrs.className || '');
        let menuCls = classNames('dropdown-menu', {'pull-right': attrs.className.indexOf('pull-right') !== -1});

        return (
            <div {... attrs}>
                <button type="button"
                        className="btn btn-primary btn-transp navbar-btn dropdown-toggle"
                        tabIndex="0"
                        data-toggle="dropdown">
                    {this.props.icon &&
                        <span className={classNames('fa', 'fa-fw', this.props.icon)} />
                    }
                    <span className="btn-text hidden-xs"> {this.props.title || 'App'}</span>
                    <span className="fa fa-angle-down"></span>
                </button>
                <ul className={menuCls} role="menu">
                    {this.props.children}
                </ul>
            </div>
        );
    }

}
DropdownAppNav.propTypes = {
    title: React.PropTypes.string,
    icon: React.PropTypes.string,
    children: React.PropTypes.node
};

/**
 * DropdownUserNav
 */
export class DropdownUserNav extends React.Component {

    render() {
        let attrs = _.omit(this.props, 'username');
        attrs.className = classNames('inline-block', 'dropdown', 'user-nav', attrs.className || '');
        return (
            <div {... attrs}>
                <button className="btn btn-primary btn-transp navbar-btn dropdown-toggle"
                        type="button"
                        tabIndex="0"
                        data-toggle="dropdown"
                        title={'User: ' + (this.props.username || 'Unknown')}>
                    <span className="fa fa-fw fa-user"></span>
                    <span className="btn-text hidden-xs hidden-sm"> {this.props.username || 'Unknown'}</span>
                    <span className="fa fa-angle-down"></span>
                </button>
                <ul className="dropdown-menu pull-right" role="menu">
                    {this.props.children}
                </ul>
            </div>
        );
    }

}
DropdownUserNav.propTypes = {
    username: React.PropTypes.string,
    children: React.PropTypes.node
};

/**
 * NavbarSearch
 */
export class NavbarSearch extends React.Component {

    render() {
        let attrs = _.omit(this.props, 'placeholder', 'value');
        attrs.className = classNames('navbar-search', attrs.className || '');
        return (
            <div {... attrs}>
                <span className="fa fa-search" />
                <ReactInput type="text"
                            className="form-control"
                            placeholder={this.props.placeholder}
                            value={this.props.value} />
            </div>
        );
    }

}
NavbarSearch.propTypes = {
    placeholder: React.PropTypes.string,
    value: React.PropTypes.string
};
