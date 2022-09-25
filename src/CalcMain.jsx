import React from "react";
import CalcForm from "./CalcForm";
import CalcPayHistory from "./CalcPayHistory";

class CalcMain extends React.Component {
    constructor() {
        super();
        this.state = {
            principal: 0,
            interestRate: 0,
            paymentField: 0,
            payments: [],
        }
    }

    changePrincipal = event => {
        console.log(this.state.payments);
        let {principal, payments} = this.state;
        let valToSet = payments.length === 0 ? event.target.value : principal;
        this.setState({ principal: valToSet });
    };
    changeInterestRate = event => this.setState({ interestRate: event.target.value });
    changePaymentAmount = event => {
        let valFromUser = event.target.value;
        let {principal, interestRate} = this.state;
        console.log("Sending " + principal + ", " + interestRate);
        let minPayment = this.calcMinimumPayment(principal, interestRate);
        let {principalPaid, interestPaid} = minPayment;
        let minPaymentTotal = (principalPaid + interestPaid).toFixed(2);
        let valToSet = valFromUser >= minPaymentTotal ? valFromUser : minPaymentTotal;
        this.setState({ paymentField: valToSet });
    };
    calcMinimumPayment = (principal, interestRate) => ({
        interestPaid: (interestRate * 0.01 / 12) * principal,
        principalPaid: principal > 100 ? principal * 0.01 : principal,
    });
    calcMonthsToRepayment = (principal) => {
        let curPrincipal = principal;
        let totalMonths = 0;
        let safety = 0;
        while (curPrincipal > 0 && safety < 999)
        {
            curPrincipal = curPrincipal > 100 ? curPrincipal * 0.99 : 0;
            totalMonths++;
            safety++;
        }
        if (safety === 999) { return "(Principal too high)"; }
        return totalMonths;
    }
    makePayment = () => {
        const newPayment = {
            id: Date.now(),
            amount: this.state.paymentField,
        };
        let {principal, interestRate} = this.state;
        let interestPaid = (interestRate * 0.01 / 12) * principal;
        this.setState(state => ({
            principal: principal - interestPaid,
            payments: [...state.payments, newPayment],
            paymentField: 0,
        }));
    };

    render() {
        let { principal, interestRate, paymentField } = this.state;
        const monthsToZero = this.calcMonthsToRepayment(principal, interestRate);
        principal *= 1;
        const roundedBalance = principal > 0 ? principal.toFixed(2) : 0;

        return (
            <div>
                <h1>Debt-Free Calculator</h1>
                <form>
                    <label htmlFor="principal">Principal:</label>
                    <input onChange={this.changePrincipal} type="number" id="principal" />
                    <label htmlFor="interest-rate">Interest Rate:</label>
                    <input onChange={this.changeInterestRate} type="number" id="interest-rate" /><span>%</span>
                </form>
                <label htmlFor="payment-field">Make A Payment:</label>
                <input type="number" id="payment-field" value={paymentField} onChange={this.changePaymentAmount} />
                <button onClick={this.makePayment}>Make Payment</button>
                <p></p>
                <p>Balance: {roundedBalance}</p>
                <p>Months to pay off: {monthsToZero}</p>
                <CalcPayHistory payments={this.state.payments} />
            </div>
        )
    }
}

export default CalcMain;