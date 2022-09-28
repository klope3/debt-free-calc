import React from "react";

class CalcPayHistory extends React.Component {
    render() {
        const { payments } = this.props;
        const listItems = payments.map(item => {
            let {date, amount, balance} = item;
            
            return (<li key={item.id} className="payment-history-row">
                <div>{`${date.getMonth()}/${date.getDate()}/${date.getFullYear()}`}</div>
                <div>{`$${amount}`}</div>
                <div>{`$${balance}`}</div>
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