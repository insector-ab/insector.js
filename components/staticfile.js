import _ from 'lodash';
import React from 'react';
import classNames from 'classnames';

import {Mappable} from 'insectorjs/react/proptypes';

/**
 * Table helpers
 */

var defaultColMap = {
    icon: ['p-r-0'],
    name: ['overflow-ellipsis']
};

function getColCls(colMap, key, ... cls) {
    return classNames(key, colMap[key], ... cls);
}

function defaultGetHref(rawFile) {
    return rawFile.url;
}

/**
 * StaticFileTable
 */
export class StaticFileTable extends React.Component {

    render() {
        let items = this.props.items || [];
        let attrs = _.omit(this.props, ... _.keys(StaticFileTable.propTypes));
        attrs.className = classNames(
            'table', 'table-striped', 'table-fixed',
            {'table-hover': items.length},
            {'table-focus': items.length},
            'table-static-files',
            (attrs.className || '')
        );
        let colMap = _.defaults(this.props.colMap, defaultColMap);
        return (
            <table {... attrs}>
                {this.props.showHead &&
                    <thead>
                        <tr>
                            <th className={getColCls(colMap, 'icon')} />
                            <th className={getColCls(colMap, 'file-type')}>Type</th>
                            <th className={getColCls(colMap, 'name')}>Name</th>
                        </tr>
                    </thead>
                }

                <tbody>

                    {items.map((item, i) => {
                        return (
                            <StaticFileTableRow key={'item' + i}
                                                item={item}
                                                href={this.props.getHref(item)}
                                                active={item.id === this.props.activeId} />
                        );
                    })}

                    {items.length === 0 &&
                        <tr>
                            <td className="text-novalue" colSpan="3">No static files</td>
                        </tr>
                    }

                </tbody>

            </table>
        );
    }

}
StaticFileTable.propTypes = {
    items: Mappable,
    activeId: React.PropTypes.number,
    getHref: React.PropTypes.func,
    colMap: React.PropTypes.object,
    showHead: React.PropTypes.bool
};
StaticFileTable.defaultProps = {
    items: [],
    getHref: defaultGetHref,
    colMap: {},
    showHead: true
};

/*
{
    'id': 12340000002,
    'uuid': unicode(uuid.uuid1().get_hex()),
    'discriminator': 'staticfile',
    'name': 'Orgalime S 2012',
    'file_type': 'PDF',
    'icon': '/img/icons/file_pdf.png',
    'url': '/files/Orgalime-S-2012.pdf'
}
*/
/**
 * StaticFileTableRow
 */
class StaticFileTableRow extends React.Component {

    render() {
        let item = this.props.item;
        let attrs = _.omit(this.props, ... _.keys(StaticFileTableRow.propTypes));
        attrs.tabIndex = attrs.tabIndex || 0;
        attrs['data-id'] = item.id;
        attrs['data-href'] = this.props.href;
        attrs['data-target'] = '_blank';

        let classnames = classNames({active: this.props.active}, {'dbl-page-route': this.props.href});

        let colMap = _.defaults(this.props.colMap, defaultColMap);

        return (
            <tr className={classnames} {... attrs}>

                <td className={getColCls(colMap, 'icon')}>
                    <img src={item.icon} height="24" alt="" />
                </td>

                <td className={getColCls(colMap, 'file-type')} title={item.file_type}>{item.file_type}</td>

                <td className={getColCls(colMap, 'name')} title={item.name}>
                    <a href={this.props.href} tabIndex={-1} target="_blank">{item.name}</a>
                </td>
            </tr>
        );
    }

}
StaticFileTableRow.propTypes = {
    item: React.PropTypes.object,
    href: React.PropTypes.string,
    active: React.PropTypes.bool,
    colMap: React.PropTypes.object
};
StaticFileTableRow.defaultProps = {
    active: false,
    colMap: {}
};
