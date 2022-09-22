import React from "react";
import CalcForm from "./CalcForm";
import CalcPayHistory from "./CalcPayHistory";

class CalcMain extends React.Component {
    constructor() {
        super();
        this.state = {
            paymentField: 0,
            payments: [],
        }
    }

    changePaymentAmount = event => this.setState({ paymentField: event.target.value });
    makePayment = event => {
        const newPayment = {
            id: Date.now(),
            amount: this.state.paymentField,
        };
        this.setState(state => ({
            payments: [...state.payments, newPayment],
            paymentField: 0,
        }));
    };

    render() {
        const { paymentField: paymentField } = this.state;
        return (
            <div>
                <CalcForm />
                <label htmlFor="payment-field">Make A Payment:</label>
                <input type="number" id="payment-field" value={paymentField} onChange={this.changePaymentAmount} />
                <button onClick={this.makePayment}>Make Payment</button>
                <CalcPayHistory payments={this.state.payments} />
            </div>
        )
    }
}

export default CalcMain;