import React from "react";

class CalcForm extends React.Component {
    constructor() {
        super();
        this.state = {
            principal: 0,
            interestRate: 0,
        }
    }

    changePrincipal = event => this.setState({ principal: event.target.value });
    changeInterestRate = event => this.setState({ interestRate: event.target.value });

    makePayment = event => {
        event.preventDefault();
    };

    render() {
        return(
            <div>
                <h1>Debt-Free Calculator</h1>
                <form>
                    <label htmlFor="principal">Principal Amount:</label>
                    <input onChange={this.changePrincipal} type="number" id="principal" />
                    <label htmlFor="interest-rate">Interest Rate:</label>
                    <input onChange={this.changeInterestRate} type="number" id="interest-rate" />
                </form>
            </div>
        )
    }
}

export default CalcForm;