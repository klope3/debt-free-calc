import React from "react";

class CalcDataContainer extends React.Component {
    render() {
        let {labelText, strings, bigStringClassName} = this.props;
        let [string1, string2, string3, string4] = strings;
        return (
            <div className="right-side-data-container">
                <div>{labelText}</div>
                <div><span className={bigStringClassName}>{string1}</span> {string2} <span className={bigStringClassName}>{string3}</span> {string4}</div>
            </div>
        )
    }
}

export default CalcDataContainer;