import React from 'react';
import {
    StyleSheet,
    View
} from 'react-native';

export const styles = StyleSheet.create({
    button: {
        backgroundColor: '#25A795',
        borderWidth: '.1rem',
        borderStyle: 'solid',
        borderColor: '#25A795',
        borderRadius: '.4rem',
        height: '3.8rem',
        paddingTop: 0,
        paddingRight: '3rem',
        paddingBottom: 0,
        paddingLeft: '3rem'
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: '1.1rem',
        fontWeight: '700',
        letterSpacing: '.1rem',
        lineHeight: '3.8rem',
        textDecorationLine: 'none',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap'
    },

    buttonHover: {
        backgroundColor: '#177568',
        borderColor: '#177568',
        color: '#fff',
        outline: '0'
    },

    buttonActive: {
        backgroundColor: '#177568'
    },

    buttonDisabled: {
        opacity: 0.5,
        cursor: 'default'
    },
    buttonDisabledHover: {
        backgroundColor: '#177568',
        borderColor: '#177568'
    }
});

export const variants = {
    none: StyleSheet.create({
        outline: {
            color: '#9b4dca',
            backgroundColor: 'transparent'
        }
    }),

    hover: StyleSheet.create({
        outline: {
            color: '#606c76',
            backgroundColor: 'transparent',
            borderColor: '#606c76'
        }
    })
};

export default class Button extends React.Component {
    static Text = styles.buttonText;

    static propTypes = {
        style: View.propTypes.style,
        variant: React.PropTypes.oneOf(['outline']),
        disabled: React.PropTypes.bool,
        children: React.PropTypes.node,
        onPress: React.PropTypes.func
    };

    constructor(props) {
        super(props);
        this.state = {
            hover: false
        };
    }

    render() {
        const filteredProps = {};
        const style = [
            styles.button,
            this.state.hover && styles.buttonHover,
            this.state.active && styles.buttonActive,
            this.props.disabled && styles.buttonDisabled,
            this.props.disabled && this.state.hover && styles.buttonDisabledHover
        ];
        Object.keys(this.props).forEach(key => {
            switch (key) {
                case 'style':
                    style.push(this.props.style);
                    break;
                case 'variant':
                    style.push(variants[this.state.hover ? 'hover' : 'none'][this.props.variant]);
                    break;
                case 'onPress':
                case 'children':
                    break;
                default:
                    filteredProps[key] = this.props[key];
                    break;
            }
        });

        const styleProps = StyleSheet.resolve({
            style
        });

        return (
            <button {...filteredProps} {...styleProps} onClick={this.props.onPress}>
                {this.props.children}
            </button>
        );
    }
}
