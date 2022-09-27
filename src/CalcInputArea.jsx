import React from "react";

class CalcInputArea extends React.Component {
    render() {
        let {idPrefix, labelText, fieldValue, invalidMessage, showButton, changeFunction, buttonFunction, disableField} = this.props;
        let inputId = `${idPrefix}-field`;
        let button;
        if (showButton) { button = <button onClick={buttonFunction}>Pay Now</button> }
        return (
            <div className="input-container">
                <label htmlFor={inputId}>{labelText}</label>
                <input 
                    type="number" 
                    id={inputId} 
                    value={fieldValue}
                    onChange={changeFunction}
                    disabled={disableField} />
                {button}
                <span>{invalidMessage}</span>
            </div>
        )
    }
}

export default CalcInputArea;