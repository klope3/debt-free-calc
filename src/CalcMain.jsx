import React from "react";
import CalcDataContainer from "./CalcDataContainer";
import CalcInputArea from "./CalcInputArea";
import CalcPayHistory from "./CalcPayHistory";
import ProgressBar from "./ProgressBar";

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

    changePaymentAmount = event => this.setState({paymentField: event.target.value * 1});
    calcInterestPayment = () => (this.state.interestRate * 0.01 / 12) * this.state.principal;
    isPaymentValid = () => {
        let {principal, interestRate, paymentField} = this.state;
        let minPayment = this.calcMinPaymentTotal().toFixed(2);
        return interestRate >= 0 && paymentField * 1 <= principal && paymentField > 0 && paymentField >= minPayment;
    }; 
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
        let interestPayment = this.calcInterestPayment();
        let principalPayment = this.calcMinPrincipalPayment();
        let {principal} = this.state;
        let total = interestPayment + principalPayment;
        if (total > principal) { total = principal; }
        return total;
    }
    setMinPayment = () => this.setState({paymentField: this.calcMinPaymentTotal().toFixed(2)});
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
        let interestToPay = this.calcInterestPayment();
        let principalPayment = (paymentField - interestToPay).toFixed(2) * 1;
        console.log("Subtracting " + principal + " - " + principalPayment);
        let newPrincipal = (principal - principalPayment).toFixed(2) * 1;
        const newPayment = {
            id: Date.now(),
            date: new Date(),
            amount: paymentField * 1,
            balance: newPrincipal,
        };
        this.setState(prevState => ({
            principal: newPrincipal,
            payments: [...prevState.payments, newPayment],
            paymentField: 0,
        }));
    };

    render() {
        let { principal, interestRate, paymentField, payments } = this.state;
        const monthsToZero = this.calcMonthsToRepayment(principal, interestRate);
        const years = Math.trunc(monthsToZero / 12);
        const monthRemainder = monthsToZero % 12;
        principal *= 1;
        const paymentValid = this.isPaymentValid();
        console.log("Payment valid? " + paymentValid);
        const minPayment = this.calcMinPaymentTotal().toFixed(2);
        const balanceRounded = principal > 0 ? principal.toFixed(2) : 0;
        const principalInvalidMsg = this.isPrincipalValid() ? "" : `The maximum principal is $999,999.00.`;
        let paymentInvalidMsg = !paymentValid || minPayment === 0 || interestRate < 0 ? `The minimum payment is $${minPayment}.` : "";
        if (principal > 0 && paymentField > principal) { paymentInvalidMsg = "You can't pay more than the current balance."; }
        const interestInvalidMsg = interestRate >= 0 ? "" : "The interest rate needs to be at least 0%.";
        const principalFieldDisabled = payments.length > 0;
        const topDataStrings = !isNaN(years) && monthsToZero > 0 ? [years, "years", monthRemainder, "months"] : ["--"];
        const botDataStrings = [`$${balanceRounded}`];
        const firstPayment = payments.length === 0 ? 0 : payments[0];
        const paymentProgress = firstPayment === 0 ? 0 : 1 - (principal / (firstPayment.amount + firstPayment.balance));
        const progressMessages = [
            "You're off to a great start!",
            "Hey, you're picking up steam!",
            "Wow! Look how far you've come!",
            "You're on the home stretch!",
            "Congrats! You did it!!"
        ];

        return (
            <div>
                <h1>Debt-Free Calculator</h1>
                <div class="calc-container">
                    <div class="calc-sub-container">
                        <CalcInputArea 
                            idPrefix="principal" 
                            labelText="Principal" 
                            innerTextLeft="$"
                            invalidMessage={principalInvalidMsg} 
                            showButton={false} 
                            changeFunction={this.changePrincipal}
                            disableField={principalFieldDisabled} />
                        <CalcInputArea 
                            idPrefix="interest" 
                            labelText="Interest Rate" 
                            innerTextRight="%"
                            invalidMessage={interestInvalidMsg} 
                            showButton={false}
                            changeFunction={this.changeInterestRate} />
                        <CalcInputArea 
                            idPrefix="payment" 
                            labelText="Amount To Pay"
                            fieldValue={paymentField} 
                            innerTextLeft="$"
                            invalidMessage={paymentInvalidMsg} 
                            showButton={true}
                            buttonText="Pay Now"
                            buttonId="pay-button"
                            disableButton={!paymentValid}
                            changeFunction={this.changePaymentAmount}
                            buttonFunction={this.makePayment} />
                        <button onClick={this.setMinPayment} id="min-payment-button">Set Minimum Payment</button>
                    </div>
                    <div class="calc-sub-container" id="right-side">
                        <CalcDataContainer labelText="Time to pay off" strings={topDataStrings} bigStringClassName="time-number" />
                        <CalcDataContainer labelText="Balance" strings={botDataStrings} bigStringClassName="balance-number" />
                        <ProgressBar 
                            progressValue={paymentProgress}
                            rightSideOffset="6px"
                            containerClassName="progress-bar-container"
                            backgroundClassName="progress-bar-background"
                            barClassName="progress-bar"
                            percentClassName="progress-bar-percent"
                            messageClassName="progress-message"
                            progressMessages={progressMessages} />
                    </div>
                </div>
                <CalcPayHistory payments={payments} />
            </div>
        )
    }
}

export default CalcMain;