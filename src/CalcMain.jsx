import React from "react";
import CalcDataContainer from "./CalcDataContainer";
import CalcForm from "./CalcForm";
import CalcInputArea from "./CalcInputArea";
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
        let interestToPay = this.calcInterestPayment();
        let principalPayment = paymentField - interestToPay;
        let newPrincipal = principal - principalPayment;
        const newPayment = {
            id: Date.now(),
            date: new Date(),
            amount: paymentField,
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
        const balanceRounded = principal > 0 ? principal.toFixed(2) : 0;
        const principalInvalidMsg = this.isPrincipalValid() ? "" : `The maximum principal is $999,999.00.`;
        const paymentInvalidMsg = this.isPaymentValid() ? "" : `The minimum payment is ${this.calcMinPaymentTotal()}.`;
        const principalFieldDisabled = payments.length > 0;
        const topDataStrings = [years, "years", monthRemainder, "months"];
        const botDataStrings = [`$${balanceRounded}`];

        return (
            <div>
                <h1>Debt-Free Calculator</h1>
                <div class="calc-container">
                    <div class="calc-sub-container">
                        <CalcInputArea 
                            idPrefix="principal" 
                            labelText="Principal" 
                            invalidMessage={principalInvalidMsg} 
                            showButton={false} 
                            changeFunction={this.changePrincipal}
                            disableField={principalFieldDisabled} />
                        <CalcInputArea 
                            idPrefix="interest" 
                            labelText="Interest Rate" 
                            invalidMessage="" 
                            showButton={false}
                            changeFunction={this.changeInterestRate} />
                        <CalcInputArea 
                            idPrefix="payment" 
                            labelText="Amount To Pay"
                            fieldValue={paymentField} 
                            invalidMessage={paymentInvalidMsg} 
                            showButton={true}
                            changeFunction={this.changePaymentAmount}
                            buttonFunction={this.makePayment} />
                        <button onClick={this.setMinPayment}>Set Minimum Payment</button>
                        {/* <div class="input-container">
                            <label for="principal-field">Principal</label>
                            <input type="number" id="principal-field" />
                            <span>The maximum principal is $999,999.00</span>
                        </div>
                        <div class="input-container">
                            <label for="interest-field">Interest Rate</label>
                            <input type="number" id="interest-field" />
                        </div>
                        <div class="input-container">
                            <label for="payment-field">Amount To Pay</label>
                            <input type="number" id="payment-field" />
                            <button>Pay Now</button>
                            <span>The minimum payment is $680.23</span>
                            <button>Set Minimum Payment</button>
                        </div> */}
                    </div>
                    <div class="calc-sub-container" id="right-side">
                        <CalcDataContainer labelText="Time to pay off" strings={topDataStrings} bigStringClassName="time-number" />
                        <CalcDataContainer labelText="Balance" strings={botDataStrings} bigStringClassName="balance-number" />
                        {/* <div class="right-side-data-container">
                            <div>Time to pay off</div>
                            <div><span class="time-number">12</span> years <span class="time-number">5</span> months</div>
                        </div>
                        <div class="right-side-data-container">
                            <div>Balance</div>
                            <div class="balance-number">$37,629.00</div>
                        </div> */}
                    </div>
                </div>
                <CalcPayHistory payments={payments} />
                {/* <div class="payment-history-container">
                    <div class="payment-history-row" id="payment-table-header">
                        <div class="column-outer">Date</div>
                        <div>Amount</div>
                        <div class="column-outer">Balance</div>
                    </div>
                    <ul>
                        <li class="payment-history-row">
                            <div>6/15/22</div>
                            <div>$640.00</div>
                            <div>$37,240.00</div>
                        </li>
                        <li class="payment-history-row">
                            <div>6/15/22</div>
                            <div>$640.00</div>
                            <div>$37,240.00</div>
                        </li>
                        <li class="payment-history-row">
                            <div>6/15/22</div>
                            <div>$640.00</div>
                            <div>$37,240.00</div>
                        </li>
                        <li class="payment-history-row">
                            <div>6/15/22</div>
                            <div>$640.00</div>
                            <div>$37,240.00</div>
                        </li>
                        <li class="payment-history-row">
                            <div>6/15/22</div>
                            <div>$640.00</div>
                            <div>$37,240.00</div>
                        </li>
                        <li class="payment-history-row">
                            <div>6/15/22</div>
                            <div>$640.00</div>
                            <div>$37,240.00</div>
                        </li>
                    </ul>
                </div> */}
                {/* <form>
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
                <CalcPayHistory payments={payments} /> */}
            </div>
        )
    }
}

export default CalcMain;