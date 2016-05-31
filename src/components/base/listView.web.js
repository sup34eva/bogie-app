import React from 'react';
import {
    ListView
} from 'react-native';

export default class ListWrapper extends React.Component {
    static propTypes = {
        dataSource: React.PropTypes.array,
        renderRow: React.PropTypes.func,
        onRefresh: React.PropTypes.func
    };

    constructor(props) {
        super(props);
        this.state = {
            loading: false
        };
    }

    render() {
        return (
            <ListView {...this.props}>
                {this.props.dataSource.map(this.props.renderRow)}
            </ListView>
        );
    }
}
