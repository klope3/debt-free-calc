import React from "react";

class CalcInputArea extends React.Component {
    render() {
        let {idPrefix, labelText, fieldValue, invalidMessage, showButton, disableButton, changeFunction, buttonFunction, disableField} = this.props;
        let inputId = `${idPrefix}-field`;
        let button;
        if (showButton) { button = <button onClick={buttonFunction} disabled={disableButton}>Pay Now</button> }
        return (
            <div className="input-container">
                <label htmlFor={inputId}>{labelText}</label>
                <div className="input-row">
                    <input 
                        type="number" 
                        id={inputId} 
                        value={fieldValue}
                        onChange={changeFunction}
                        disabled={disableField} />
                    {button}
                </div>
                <span class="invalid-message">{invalidMessage}</span>
            </div>
        )
    }
}

export default CalcInputArea;