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
        this.maxPrincipal = 999999;
        this.minPrincipal = 1;
        this.minPaymentOnPrincipal = 0.01;
        this.progressMessages = [
            "You're off to a great start!",
            "Hey, you're picking up steam!",
            "Wow! Look how far you've come!",
            "You're on the home stretch!",
            "Congrats! You did it!!"
        ];
    }

    //#region Functions
    //#region Field Changes
    changePaymentAmount = event => this.setState({paymentField: event.target.value * 1});
    changePrincipal = event => this.setState({ principal: event.target.value * 1 });
    changeInterestRate = event => this.setState({ interestRate: event.target.value * 1 });
    setMinPayment = () => this.setState({paymentField: this.calcMinPaymentTotal().toFixed(2)});
    //#endregion
    //#region Validation
    isPaymentValid = (principal, paymentAmount) => {
        let minPayment = this.calcMinPaymentTotal().toFixed(2);
        return paymentAmount <= principal && paymentAmount > 0 && paymentAmount >= minPayment;
    }; 
    isPrincipalValid = () => this.state.payments.length > 0 || this.state.principal <= this.maxPrincipal;
    getPaymentInvalidMessage = (paymentAmount, principal, minPayment) => {
        if (paymentAmount < minPayment && minPayment > 0) { return `The minimum payment is $${minPayment}.`; }
        if (paymentAmount > principal) { return "You can't pay more than the current balance."; }
        return "";
    }
    getPrincipalInvalidMessage = (principal) => {
        if (principal < this.minPrincipal ) { return `The minimum principal is $${this.minPrincipal}.`; }
        if (principal > this.maxPrincipal) { return `The maximum principal is $${this.maxPrincipal}.`; }
        return "";
    }
    inputValidation = () => {
        const { principal, paymentField, interestRate } = this.state;
        const paymentAmount = paymentField * 1;
        const paymentValid = this.isPaymentValid(principal, paymentAmount);
        const principalValid = this.isPrincipalValid();
        const interestValid = interestRate >= 0;
        const minPayment = this.calcMinPaymentTotal().toFixed(2);
        const paymentInvalidMessage = this.getPaymentInvalidMessage(paymentAmount, principal, minPayment);
        const principalInvalidMessage = this.getPrincipalInvalidMessage(principal);
        const interestInvalidMessage = interestRate < 0 ? "The interest rate needs to be at least 0%." : "";
        return {
            paymentAllowed: paymentValid && principalValid && interestValid,
            setMinimumAllowed: minPayment > 0,
            principalInvalidMessage: principalInvalidMessage,
            interestInvalidMessage: interestInvalidMessage,
            paymentInvalidMessage: paymentInvalidMessage,
        }
    }
    //#endregion
    //#region Calculation
    calcInterestPayment = () => (this.state.interestRate * 0.01 / 12) * this.state.principal;
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
    calcMonthsToRepayment = (principal) => {
        let curPrincipal = principal;
        let totalMonths = 0;
        let safety = 0;
        while (curPrincipal > 0 && safety < 999) {
            curPrincipal = curPrincipal > 100 ? curPrincipal * (1 - this.minPaymentOnPrincipal) : 0;
            totalMonths++;
            safety++;
        }
        if (safety === 999) { return "(Principal too high)"; }
        return totalMonths;
    };
    //#endregion
    //#region Misc
    getRepaymentStrings = (principal) => {
        const monthsToZero = this.calcMonthsToRepayment(principal);
        const years = Math.trunc(monthsToZero / 12);
        const monthRemainder = monthsToZero % 12;
        const topStrings = !isNaN(years) && monthsToZero > 0 ? [years, "years", monthRemainder, "months"] : ["--"];
        const balanceRounded = principal > 0 ? principal.toFixed(2) : 0;
        const botStrings = [`$${balanceRounded}`];
        return {
            topRepaymentStrings: topStrings,
            botRepaymentStrings: botStrings,
        }
    }
    makePayment = () => {
        const {paymentAllowed} = this.inputValidation();
        if (!paymentAllowed) { return; }
        let {principal, paymentField} = this.state;
        let interestToPay = this.calcInterestPayment();
        let principalPayment = (paymentField - interestToPay).toFixed(2) * 1;
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
    //#endregion
    //#endregion

    render() {
        const { principal, paymentField, payments } = this.state;
        const {  
            paymentAllowed, 
            setMinimumAllowed,
            principalInvalidMessage, 
            interestInvalidMessage, 
            paymentInvalidMessage 
        } = this.inputValidation();
        const { topRepaymentStrings, botRepaymentStrings } = this.getRepaymentStrings(principal);
        const principalFieldDisabled = payments.length > 0;
        const firstPayment = payments.length === 0 ? 0 : payments[0];
        const paymentProgress = firstPayment === 0 ? 0 : 1 - (principal / (firstPayment.amount + firstPayment.balance));

        return (
            <div>
                <h1>Debt-Free Calculator</h1>
                <div class="calc-container">
                    <div class="calc-sub-container">
                        <CalcInputArea 
                            idPrefix="principal" 
                            labelText="Principal" 
                            innerTextLeft="$"
                            invalidMessage={principalInvalidMessage} 
                            showButton={false} 
                            changeFunction={this.changePrincipal}
                            disableField={principalFieldDisabled} />
                        <CalcInputArea 
                            idPrefix="interest" 
                            labelText="Interest Rate" 
                            innerTextRight="%"
                            invalidMessage={interestInvalidMessage} 
                            showButton={false}
                            changeFunction={this.changeInterestRate} />
                        <CalcInputArea 
                            idPrefix="payment" 
                            labelText="Amount To Pay"
                            fieldValue={paymentField} 
                            innerTextLeft="$"
                            invalidMessage={paymentInvalidMessage} 
                            showButton={true}
                            buttonText="Pay Now"
                            buttonId="pay-button"
                            disableButton={!paymentAllowed}
                            changeFunction={this.changePaymentAmount}
                            buttonFunction={this.makePayment} />
                        <button 
                            onClick={this.setMinPayment} 
                            id="min-payment-button" 
                            disabled={!setMinimumAllowed}>
                            Set Minimum Payment
                        </button>
                    </div>
                    <div class="calc-sub-container" id="right-side">
                        <CalcDataContainer 
                            labelText="Time to pay off" 
                            strings={topRepaymentStrings} 
                            bigStringClassName="time-number" />
                        <CalcDataContainer 
                            labelText="Balance" 
                            strings={botRepaymentStrings} 
                            bigStringClassName="balance-number" />
                        <ProgressBar 
                            progressValue={paymentProgress}
                            rightSideOffset="6px"
                            containerClassName="progress-bar-container"
                            backgroundClassName="progress-bar-background"
                            barClassName="progress-bar"
                            percentClassName="progress-bar-percent"
                            messageClassName="progress-message"
                            progressMessages={this.progressMessages} />
                    </div>
                </div>
                <CalcPayHistory payments={payments} />
            </div>
        )
    }
}

export default CalcMain;