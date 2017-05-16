import React from 'react';
import PropTypes from 'prop-types';
import {truncate} from 'underscore.string';
import classNames from 'classnames';

import {NodeModel} from '../node/model';
import {Mappable} from '../proptypes';
import {getAttrs} from '../helpers';

/**
 * EventList
 */
export class EventList extends React.Component {

    render() {
        let attrs = getAttrs(this.props, EventList);
        attrs.className = classNames('event-list', attrs.className || '');
        return (
            <div {... attrs}>
                {this.props.events.map((event, i) => {
                    let ItemCls = EventList.getItemClass(event);
                    return (
                        <ItemCls key={event.id}
                                 event={event}
                                 currentUser={this.props.currentUser} />
                    );
                })}
                {this.props.events.length === 0 &&
                    <EventListItem faIcon="fa-clock-o">
                        {this.props.noEventsText}
                    </EventListItem>
                }
            </div>
        );
    }

    static getItemClass(event) {
        let eventStr = String(event);
        if (EventList.itemClasses.hasOwnProperty(eventStr)) {
            return EventList.itemClasses[eventStr];
        }
        return DefaultEventListItem;
    }

    static parseText(text, data, currentUser) {
        // split string {some_key}
        let result = text.split(/(\{\w+\})/g);
        // Apply to odd elements
        for (let i = 1, length = result.length; i < length; i += 2) {
            let key = result[i].replace(/\W/g, '');
            result[i] = EventList.replaceKey(key, data, currentUser);
        }
        return result;
    }

    static replaceKey(key, data, currentUser) {
        let url, name;

        switch (key) {
            case 'comment_parent':
                url = '/' + data.node.parent.discriminator + '/' + data.node.parent.id;
                name = data.node.parent.name;
                // temp fix for revisions
                if (data.node.parent.discriminator === 'revision') {
                    url = EventList.getQuotationUrl(data.node.parent);
                    name = EventList.getRevisionName(data.node.parent);
                }
                if (data.node.node_state === 'DELETED') {
                    return <del>{name}</del>;
                }
                return <a href={url} className="page-route">{name}</a>;

            case 'action_by':
                url = '/user/' + data.action_by.id;
                return <a href={url} className="page-route">{data.action_by.name}</a>;

        }
        return '{' + key + '}';
    }

    static getNodeATag(data) {
        let key = 'node';
        let nodeData = data.hasOwnProperty(key) ? data[key] : {};
        let discriminator = nodeData.discriminator;
        let url = '/' + discriminator + '/' + nodeData.id;
        let name = nodeData.name || '[undefined]';
        if (nodeData && nodeData.node_state === 'DELETED') {
            return <del>“{truncate(name, 22, '…')}”</del>;
        }
        return <a href={url} className="page-route">{truncate(name, 22, '…')}</a>;
    }

    static getIcon(event) {
        let eventStr = String(event);
        if (EventList.icons.hasOwnProperty(eventStr)) {
            return EventList.icons[eventStr];
        }
        return 'fa-clock-o';
    }

}
EventList.propTypes = {
    events: Mappable,
    currentUser: PropTypes.instanceOf(NodeModel),
    noEventsText: PropTypes.string
};
EventList.defaultProps = {
    noEventsText: 'No events found.'
};
EventList.icons = {
    'user_action.create.comment': 'fa-comment'
};

// --------- Concrete items --------- //

/**
 * DefaultEventListItem
 */
export class DefaultEventListItem extends React.Component {

    render() {
        let event = this.props.event;
        return (
            <EventListItem faIcon={EventList.getIcon(event)}>
                {Boolean(event.description) && EventList.parseText(event.description, event.eventData, this.props.currentUser)}
                <DefaultEventListItemBottom createdAt={event.createdAt.calendar()} />
            </EventListItem>
        );
    }

}
DefaultEventListItem.propTypes = {
    event: PropTypes.instanceOf(NodeModel),
    currentUser: PropTypes.instanceOf(NodeModel)
};

/**
 * CommentEventListItem
 */
export class CommentEventListItem extends React.Component {

    render() {
        let event = this.props.event;
        let showComment = event.eventData.node.node_state !== 'DELETED';

        return (
            <EventListItem faIcon={EventList.getIcon(event)}>
                {Boolean(event.description) &&
                    EventList.parseText(event.description, event.eventData, this.props.currentUser)
                }
                {showComment &&
                    <div>“{event.eventData.node.text}”</div>
                }
                {!showComment &&
                    <div className="text-novalue">[DELETED]</div>
                }
                <DefaultEventListItemBottom createdAt={event.createdAt.calendar()} />
            </EventListItem>
        );
    }

}
CommentEventListItem.propTypes = {
    event: PropTypes.instanceOf(NodeModel),
    currentUser: PropTypes.instanceOf(NodeModel)
};

/**
 * Event components, replace with Factory?
 */
EventList.itemClasses = {
    'user_action.create.comment': CommentEventListItem
};

// --------- Item components (composition) --------- //

/**
 * EventListItem
 * FIX: Use general Media components
 */
export class EventListItem extends React.Component {

    render() {
        return (
            <div className="media list-group-item event-list-item">
                <div className="media-left">
                    <span className={classNames('media-object fa fa-fw fa-lg', this.props.faIcon)} />
                </div>
                <div className="media-body event-list-item-body">
                    {this.props.children}
                </div>
            </div>
        );
    }

}
EventListItem.propTypes = {
    children: PropTypes.node,
    faIcon: PropTypes.string
};

/**
 * EventListItemBottom
 */
export class EventListItemBottom extends React.Component {

    render() {
        return (
            <div className="small event-list-item-bottom">
                {this.props.children}
            </div>
        );
    }

}
EventListItemBottom.propTypes = {
    children: PropTypes.node
};

/**
 * EventListItemTime
 */
export class EventListItemTime extends React.Component {

    render() {
        let attrs = getAttrs(this.props, EventListItemTime);
        attrs.className = classNames('event-list-item-time', attrs.className || '');
        return (
            <span {... attrs}>
                <span className="fa fa-clock-o" /> {this.props.createdAt}
            </span>
        );
    }

}
EventListItemTime.propTypes = {
    createdAt: PropTypes.string
};

/**
 * DefaultEventListItemBottom
 */
export class DefaultEventListItemBottom extends React.Component {

    render() {
        return (
            <EventListItemBottom>
                <EventListItemTime createdAt={this.props.createdAt} />
                {this.props.children}
            </EventListItemBottom>
        );
    }

}
DefaultEventListItemBottom.propTypes = {
    children: PropTypes.node,
    createdAt: PropTypes.string
};

