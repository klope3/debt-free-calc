import React from "react";

class CalcPayHistory extends React.Component {
    render() {
        const { payments } = this.props;
        const listItems = payments.map(item => (<li key={item.id}>{item.amount}</li>));
        return (
            <ul>
                {listItems}
            </ul>
        )
    }
}

export default CalcPayHistory;