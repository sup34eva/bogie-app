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
    }
};
const styles = StyleSheet.create({
    body: {
        flex: 1,
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
        flexDirection: 'column',
        paddingTop: '3em',
        paddingRight: '2em',
        paddingBottom: '3em',
        paddingLeft: '2em'
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
            const modal = ReactDOM.findDOMNode(this.refs.modal);
            const body = modal.parentNode;

            const rect = modal.getBoundingClientRect();
            const bodyRect = body.getBoundingClientRect();

            const changed = ['top', 'right', 'bottom', 'left'].filter(key =>
                (rect[key] - bodyRect[key]) !== this.state[key]
            );

            if (changed.length > 0) {
                const state = changed.reduce((state, key) => {
                    state[key] = rect[key] - bodyRect[key];
                    return state;
                }, {});

                console.log(bodyRect, rect, state);
                this.setState(state);
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
                        right: this.state.right,
                        bottom: this.state.bottom,
                        left: -this.state.left
                    }} />
                    {React.cloneElement(this.props.children, {
                        ...this.props,
                        style: [this.props.style, styles.tabContent]
                    })}
                </View>
            </View>
        );
    }
}
