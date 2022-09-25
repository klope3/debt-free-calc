import React from "react";

class CalcForm extends React.Component {
    constructor() {
        super();
        this.state = {
            totalDebt: 0,
            interestRate: 0,
        }
    }

    changeTotalDebt = event => this.setState({ totalDebt: event.target.value });
    changeInterestRate = event => this.setState({ interestRate: event.target.value });

    makePayment = event => {
        event.preventDefault();
    };

    render() {
        return(
            <div>
                <h1>Debt-Free Calculator</h1>
                <form>
                    <label htmlFor="principal">Total Debt:</label>
                    <input onChange={this.changeTotalDebt} type="number" id="principal" />
                    <label htmlFor="interest-rate">Interest Rate:</label>
                    <input onChange={this.changeInterestRate} type="number" id="interest-rate" />
                </form>
            </div>
        )
    }
}

export default CalcForm;