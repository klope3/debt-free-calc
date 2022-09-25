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
        let {principal, payments} = this.state;
        let valToSet = payments.length === 0 ? event.target.value : principal;
        this.setState({ principal: valToSet }, () => this.validatePaymentField());
    };
    changeInterestRate = event => {
        this.setState({ interestRate: event.target.value }, () => this.validatePaymentField());
    };
    changePaymentAmount = event => {
        let valFromUser = event.target.value;
        this.setState({paymentField: valFromUser}, () => this.validatePaymentField());
    };
    validatePaymentField = () => {
        let {principal, interestRate, paymentField} = this.state;
        let valToSet = this.clampPaymentToMinimum(principal, interestRate, paymentField);
        this.setState({ paymentField: valToSet });
    };
    clampPaymentToMinimum = (principal, interestRate, paymentAmount) => {
        let minPayment = this.calcMinimumPayment(principal, interestRate);
        let {principalPaid, interestPaid} = minPayment;
        let minPaymentTotal = principalPaid * 1 + interestPaid * 1;
        let clampedVal = paymentAmount >= minPaymentTotal ? paymentAmount : minPaymentTotal;
        return clampedVal;
    };
    calcMinimumPayment = (principal, interestRate) => ({
        interestPaid: (interestRate * 0.01 / 12) * principal,
        principalPaid: principal > 100 ? principal * 0.01 : principal * 1,
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
        let principalPayment = newPayment.amount - interestPaid;
        this.setState(state => ({
            principal: principal - principalPayment,
            payments: [...state.payments, newPayment],
            paymentField: 0,
        }), () => this.validatePaymentField());
    };

    render() {
        let { principal, interestRate, paymentField } = this.state;
        const monthsToZero = this.calcMonthsToRepayment(principal, interestRate);
        paymentField *= 1;
        const paymentRounded = paymentField.toFixed(2);
        principal *= 1;
        const balanceRounded = principal > 0 ? principal.toFixed(2) : 0;

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
                <input type="number" id="payment-field" value={paymentRounded} onChange={this.changePaymentAmount} />
                <button onClick={this.makePayment}>Make Payment</button>
                <p></p>
                <p>Balance: {balanceRounded}</p>
                <p>Months to pay off: {monthsToZero}</p>
                <CalcPayHistory payments={this.state.payments} />
            </div>
        )
    }
}

export default CalcMain;