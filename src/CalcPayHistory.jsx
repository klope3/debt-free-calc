import React from "react";

class CalcPayHistory extends React.Component {
    render() {
        const { payments } = this.props;
        const listItems = payments.map(item => {
            const {date, amount, balance} = item;
            const dateString = `${date.getMonth()}/${date.getDate()}/${date.getFullYear()}`;
            return (<li key={item.id} className="payment-history-row">
                <div>{dateString}</div>
                <div>{`$${amount.toFixed(2)}`}</div>
                <div>{`$${balance.toFixed(2)}`}</div>
            </li>)
        });
        return (
            <div className="payment-history-container">
                <div className="payment-history-row" id="payment-table-header">
                    <div>Date</div>
                    <div>Amount</div>
                    <div>Balance</div>
                </div>
                <ul>
                    {listItems}
                </ul>
            </div>
        )
    }
}

export default CalcPayHistory;