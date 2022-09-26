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
        this.setState({ principal: valToSet });
    };
    changeInterestRate = event => {
        this.setState({ interestRate: event.target.value });
    };
    changePaymentAmount = event => this.setState({paymentField: event.target.value});
    //validatePaymentField = () => {
    //    let {principal, interestRate, paymentField} = this.state;
    //    let valToSet = this.clampPaymentToMinimum(principal, interestRate, paymentField);
    //    this.setState({ paymentField: valToSet });
    //};
    //clampPaymentToMinimum = (principal, interestRate, paymentAmount) => {
    //    let minPayment = this.calcMinimumPayment(principal, interestRate);
    //    let {principalPaid, interestPaid} = minPayment;
    //    let minPaymentTotal = principalPaid * 1 + interestPaid * 1;
    //    let clampedVal = paymentAmount >= minPaymentTotal ? paymentAmount : minPaymentTotal;
    //    return clampedVal;
    //};
    //calcMinimumPayment = (principal, interestRate) => ({
    //    interestPaid: (interestRate * 0.01 / 12) * principal,
    //    principalPaid: principal > 100 ? principal * 0.01 : principal * 1,
    //});
    calcInterestPayment = () => (this.state.interestRate * 0.01 / 12) * this.state.principal; 
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
        //let {principal, interestRate} = this.state;
        //let minPayment = this.calcMinimumPayment(principal, interestRate);
        //let {interestPaid, principalPaid} = minPayment;
        //let paymentRounded = (interestPaid + principalPaid).toFixed(2);
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
    isPaymentValid = () => {
        //let {principal, interestRate} = this.state;
        //let minPayment = this.calcMinimumPayment(principal, interestRate);
        //let {interestPaid, principalPaid} = minPayment;
        //let minPaymentTotal = (interestPaid + principalPaid).toFixed(2);
        return (this.state.paymentField >= this.calcMinPaymentTotal());
    };
    makePayment = () => {
        if (!this.isPaymentValid()) { return; }
        const newPayment = {
            id: Date.now(),
            amount: this.state.paymentField,
        };
        let interestToPay = this.calcInterestPayment();
        let principalPayment = newPayment.amount - interestToPay;
        let prevPrincipal = this.state.principal;
        this.setState(state => ({
            principal: prevPrincipal - principalPayment,
            payments: [...state.payments, newPayment],
            paymentField: 0,
        }));
    };

    render() {
        let { principal, interestRate, paymentField } = this.state;
        const monthsToZero = this.calcMonthsToRepayment(principal, interestRate);
        principal *= 1;
        const balanceRounded = principal > 0 ? principal.toFixed(2) : 0;
        const paymentValidMsg = this.isPaymentValid() ? "" : `The minimum payment is ${this.calcMinPaymentTotal()}.`;

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
                <button onClick={this.setMinPayment}>Set Minimum Payment</button>
                <p>{paymentValidMsg}</p>
                <p>Balance: {balanceRounded}</p>
                <p>Months to pay off: {monthsToZero}</p>
                <CalcPayHistory payments={this.state.payments} />
            </div>
        )
    }
}

export default CalcMain;