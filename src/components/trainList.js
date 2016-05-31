import React from 'react';
import {
    StyleSheet
} from 'react-native';
import Relay from 'react-relay';

import ListView from './base/listView';
import Train from './train';

const styles = StyleSheet.create({
    list: {
        flex: 1,
        paddingTop: 8,
        paddingBottom: 8
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

class TrainList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        };
    }

    render() {
        return (
            <ListView dataSource={this.props.viewer.trains.edges} style={styles.list}
                renderRow={edge => <Train key={edge.node.id} train={edge.node} />}
                onEndReached={() => {
                    if (this.props.viewer.trains.pageInfo.hasNextPage) {
                        this.props.relay.setVariables({
                            count: this.props.relay.variables.count + 15
                        });
                    }
                }}
                onRefresh={() => new Promise(resolve => {
                    this.props.relay.forceFetch({}, ({done}) => {
                        if (done) {
                            resolve();
                        }
                    });
                })} />
        );
    }

    static propTypes = {
        viewer: React.PropTypes.object,
        relay: React.PropTypes.shape({
            forceFetch: React.PropTypes.func,
            setVariables: React.PropTypes.func,
            variables: React.PropTypes.shape({
                count: React.PropTypes.number
            })
        })
    };
}

export default Relay.createContainer(TrainList, {
    initialVariables: {
        count: 15
    },
    fragments: {
        viewer: () => Relay.QL`
            fragment on Viewer {
                trains(first: $count) {
                    edges {
                        node {
                            id,
                            ${Train.getFragment('train')}
                        }
                    },
                    pageInfo {
                        hasNextPage
                    }
                }
            }
        `
    }
});
