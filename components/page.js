import _ from 'lodash';
import classNames from 'classnames';
import {truncate} from 'underscore.string';
import React from 'react';
import {Row, Col, PageHeader} from 'react-bootstrap';

/**
 * PageHeaderRow
 */
export class PageHeaderRow extends React.Component {

    render() {
        let attrs = _.omit(this.props, 'title', 'noValueText', 'faIcon', 'id');
        let title = this.props.title || (this.props.noValueText || 'Untitled');
        return (
            <Row {... attrs}>
                <Col md={12}>
                    <PageHeader title={title}>
                        {this.props.labelClassName &&
                            <span className={classNames('label', this.props.labelClassName)}>
                                <span className={classNames('fa', 'fa-fw', this.props.faIcon || 'fa-file-o')}></span>
                            </span>
                        }
                        {!this.props.labelClassName && this.props.faIcon &&
                            <span className={classNames('fa', this.props.faIcon)}></span>
                        }
                        <span>
                            &nbsp;{truncate(title, 22, '…')}
                            {this.props.small &&
                                <small>&nbsp;{this.props.small}</small>
                            }
                        </span>

                        {this.props.children}

                    </PageHeader>
                </Col>
            </Row>
        );
    }

}
PageHeaderRow.propTypes = {
    title: React.PropTypes.string,
    noValueText: React.PropTypes.string,
    faIcon: React.PropTypes.string,
    small: React.PropTypes.string,
    labelClassName: React.PropTypes.string,
    children: React.PropTypes.node
};
