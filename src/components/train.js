import moment from 'moment';
import React from 'react';
import {
    StyleSheet,
    Text
} from 'react-native';
import Relay from 'react-relay';

import ListRow from './base/listRow';

const styles = StyleSheet.create({
    primary: {
        fontSize: 16,
        color: 'rgba(0, 0, 0, 0.87)'
    },
    secondary: {
        fontSize: 14,
        color: 'rgba(0, 0, 0, 0.54)'
    }
});

export default class Train extends React.Component {
    static propTypes = {
        train: React.PropTypes.object
    };

    render() {
        return (
            <ListRow style={ListRow.twoLine}>
                <Text style={styles.primary}>{this.props.train.departure.name} &rarr; {this.props.train.arrival.name}</Text>
                <Text style={styles.secondary}>{moment(this.props.train.date).format('lll')}</Text>
            </ListRow>
        );
    }
}

export default Relay.createContainer(Train, {
    fragments: {
        train: () => Relay.QL`
            fragment on Train {
                date,
                departure {
                    name
                },
                arrival {
                    name
                }
            }
        `
    }
});
