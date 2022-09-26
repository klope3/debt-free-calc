import React from "react";

class CalcPayHistory extends React.Component {
    render() {
        const { payments } = this.props;
        const listItems = payments.map(item => {
            let value = (item.amount * 1).toFixed(2)
            return (<li key={item.id}>{value}</li>)
        });
        return (
            <ul>
                {listItems}
            </ul>
        )
    }
}

export default CalcPayHistory;