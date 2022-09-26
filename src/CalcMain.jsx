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

    changePaymentAmount = event => this.setState({paymentField: event.target.value});
    calcInterestPayment = () => (this.state.interestRate * 0.01 / 12) * this.state.principal;
    isPaymentValid = () => this.state.paymentField >= this.calcMinPaymentTotal(); 
    isPrincipalValid = () => this.state.payments.length > 0 || this.state.principal <= 999999;
    changePrincipal = event => {
        let {principal, payments} = this.state;
        let valToSet = payments.length === 0 ? event.target.value : principal;
        this.setState({ principal: valToSet });
    };
    changeInterestRate = event => {
        this.setState({ interestRate: event.target.value });
    };
    calcMinPrincipalPayment = () => {
        let {principal} = this.state;
        let payment = principal > 100 ? principal * 0.01 : principal * 1;
        return payment.toFixed(2) * 1;
    };
    calcMinPaymentTotal = () => {
        let interest = this.calcInterestPayment();
        let principal = this.calcMinPrincipalPayment();
        return (interest + principal).toFixed(2) * 1;
    }
    setMinPayment = () => {
        this.setState({paymentField: this.calcMinPaymentTotal()});
    };
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
    };
    makePayment = () => {
        if (!this.isPaymentValid()) { return; }
        let {principal, paymentField} = this.state;
        const newPayment = {
            id: Date.now(),
            amount: paymentField,
        };
        let interestToPay = this.calcInterestPayment();
        let principalPayment = newPayment.amount - interestToPay;
        let prevPrincipal = principal;
        this.setState(prevState => ({
            principal: prevPrincipal - principalPayment,
            payments: [...prevState.payments, newPayment],
            paymentField: 0,
        }));
    };

    render() {
        let { principal, interestRate, paymentField, payments } = this.state;
        const monthsToZero = this.calcMonthsToRepayment(principal, interestRate);
        principal *= 1;
        const balanceRounded = principal > 0 ? principal.toFixed(2) : 0;
        const principalInvalidMsg = this.isPrincipalValid() ? "" : `The maximum principal is $999,999.00.`;
        const paymentInvalidMsg = this.isPaymentValid() ? "" : `The minimum payment is ${this.calcMinPaymentTotal()}.`;
        const principalFieldDisabled = payments.length > 0;

        return (
            <div>
                <h1>Debt-Free Calculator</h1>
                <form>
                    <label htmlFor="principal">Principal:</label>
                    <input onChange={this.changePrincipal} type="number" id="principal" disabled={principalFieldDisabled} />
                    <label htmlFor="interest-rate">Interest Rate:</label>
                    <input onChange={this.changeInterestRate} type="number" id="interest-rate" /><span>%</span>
                </form>
                <label htmlFor="payment-field">Make A Payment:</label>
                <input type="number" id="payment-field" value={paymentField} onChange={this.changePaymentAmount} />
                <button onClick={this.makePayment}>Make Payment</button>
                <button onClick={this.setMinPayment}>Set Minimum Payment</button>
                <p>{principalInvalidMsg}</p>
                <p>{paymentInvalidMsg}</p>
                <p>Balance: {balanceRounded}</p>
                <p>Months to pay off: {monthsToZero}</p>
                <CalcPayHistory payments={payments} />
            </div>
        )
    }
}

export default CalcMain;