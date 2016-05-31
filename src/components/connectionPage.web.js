import React from 'react';
import ReactDOM from 'react-dom';
import {
    StyleSheet,
    View
} from 'react-native';
import {
    Link
} from 'react-router';

const cdnUrl = `${process.env.CDN_URL}${(process.env.HEROKU_SLUG_COMMIT ? `/${process.env.HEROKU_SLUG_COMMIT}` : '')}`;

const cssStyles = {
    blur: {
        position: 'absolute',
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.6)), url('${cdnUrl}/background.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        WebkitFilter: 'blur(10px)',
        filter: 'blur(10px)',
        margin: -15
    },
    tab: {
        flex: 1,
        color: '#2D2D2D',
        textAlign: 'center',
        padding: '1em',
        textTransform: 'uppercase',
        textDecoration: 'none',
        fontSize: '1.2em'
    },
    tabActive: {
        color: '#fff',
        backgroundColor: '#25A795'
    }
};
const styles = StyleSheet.create({
    body: {
        height: '100vh',
        backgroundImage: `url('${cdnUrl}/background.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        alignItems: 'center',
        justifyContent: 'center'
    },
    modal: {
        position: 'relative',
        width: '75vw',
        borderRadius: 4,
        overflow: 'hidden',
        boxShadow: '0 0 20px rgba(0, 0, 0, 0.65)',
        flexDirection: 'column'
    },
    tabBar: {
        position: 'relative',
        flexDirection: 'row',
        borderBottomWidth: '4px',
        borderBottomStyle: 'solid',
        borderBottomColor: '#25A795'
    },
    tabContent: {
        flex: 1,
        paddingTop: '3em',
        paddingRight: '2em',
        paddingBottom: '3em',
        paddingLeft: '2em',
        position: 'relative'
    }
});

export default class ConnectionPage extends React.Component {
    static propTypes = {
        style: View.propTypes.style,
        children: React.PropTypes.element,
        route: React.PropTypes.shape({
            childRoutes: React.PropTypes.arrayOf(React.PropTypes.shape({
                path: React.PropTypes.string
            }))
        }),
        location: React.PropTypes.shape({
            pathname: React.PropTypes.string
        })
    };

    constructor(props) {
        super(props);
        this.handleResize = this.handleResize.bind(this);
        this.state = {
            currentTab: 0,
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        };
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleResize);
        this.handleResize();
    }

    componentDidUpdate() {
        this.handleResize();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }

    handleResize() {
        if (this.refs.modal) {
            const rect = ReactDOM.findDOMNode(this.refs.modal).getBoundingClientRect();
            const changed = ['top', 'right', 'bottom', 'left'].filter(key => {
                if (key === 'right') {
                    return window.innerWidth - rect[key] !== this.state[key];
                }
                if (key === 'bottom') {
                    return window.innerHeight - rect[key] !== this.state[key];
                }
                return rect[key] !== this.state[key];
            });

            if (changed.length > 0) {
                this.setState(changed.reduce((state, key) => {
                    if (key === 'right') {
                        state[key] = window.innerWidth - rect[key];
                    } else if (key === 'bottom') {
                        state[key] = window.innerHeight - rect[key];
                    } else {
                        state[key] = rect[key];
                    }

                    return state;
                }, {}));
            }
        }
    }

    render() {
        return (
            <View style={styles.body}>
                <View ref="modal" style={styles.modal}>
                    <div style={{
                        ...cssStyles.blur,
                        top: -this.state.top,
                        right: -this.state.right,
                        bottom: -this.state.bottom,
                        left: -this.state.left
                    }} />
                    <View style={styles.tabBar}>
                        {this.props.route.childRoutes.map(({path}) =>
                            <Link to={path} key={path} style={cssStyles.tab} activeStyle={cssStyles.tabActive}>{path.slice(1)}</Link>
                        )}
                    </View>
                    {React.cloneElement(this.props.children, {
                        ...this.props,
                        style: [this.props.style, styles.tabContent]
                    })}
                </View>
            </View>
        );
    }
}
