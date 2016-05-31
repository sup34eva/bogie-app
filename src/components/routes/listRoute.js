import React from 'react';
import Relay from 'react-relay';

import TrainList from '../trainList';

class ListRoute extends Relay.Route {
    static routeName = 'ListRoute';
    static queries = {
        viewer: Component => Relay.QL`
            query {
                viewer {
                    ${Component.getFragment('viewer')}
                }
            }
        `
    };
}

export default class ListContainer extends React.Component {
    render() {
        return <Relay.RootContainer Component={TrainList} route={new ListRoute()} />;
    }
}
