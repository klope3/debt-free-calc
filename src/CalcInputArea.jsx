import React from "react";

class CalcInputArea extends React.Component {
    render() {
        let {idPrefix, labelText, fieldValue, innerTextLeft, innerTextRight, invalidMessage, showButton, buttonText, buttonId, disableButton, changeFunction, buttonFunction, disableField} = this.props;
        let inputId = `${idPrefix}-field`;
        let button;
        if (showButton) { button = <button onClick={buttonFunction} disabled={disableButton} id={buttonId}>{buttonText}</button> }
        return (
            <div className="input-container">
                <label htmlFor={inputId}>{labelText}</label>
                <div className="input-row">
                    <span className="input-inner-text">{innerTextLeft}</span>
                    <input 
                        type="number" 
                        id={inputId} 
                        value={fieldValue}
                        onChange={changeFunction}
                        disabled={disableField} />
                    {button}
                    <span className="input-inner-text input-inner-text-right">{innerTextRight}</span>
                </div>
                <span class="invalid-message">{invalidMessage}</span>
            </div>
        )
    }
}

export default CalcInputArea;