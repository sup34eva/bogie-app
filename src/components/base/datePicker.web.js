import React from 'react';
import Calendar from 'react-datepicker';

if (typeof window !== 'undefined') {
    require('react-datepicker/dist/react-datepicker.css');
}

export default class DatePicker extends React.Component {
    static propTypes = {
        valueLink: React.PropTypes.shape({
            value: React.PropTypes.object,
            requestChange: React.PropTypes.func
        })
    };

    render() {
        return (
            <Calendar selected={this.props.valueLink.value} onChange={this.props.valueLink.requestChange} />
        );
    }
}
