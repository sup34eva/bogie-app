import React from 'react';
import {
    ListView,
    RefreshControl
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
        this.rows = new ListView.DataSource({
            rowHasChanged: (a, b) => a !== b
        });
    }

    render() {
        this.rows = this.rows.cloneWithRows(this.props.dataSource);
        return (
            <ListView {...this.props} dataSource={this.rows} renderRow={this.props.renderRow}
                refreshControl={
                    <RefreshControl refreshing={this.state.loading}
                        onRefresh={() => {
                            this.props.onRefresh()
                                .then(() => {
                                    this.setState({
                                        loading: false
                                    });
                                });
                            this.setState({
                                loading: true
                            });
                        }} />
                } />
        );
    }
}
