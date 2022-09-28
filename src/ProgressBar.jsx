import React from "react";

class ProgressBar extends React.Component {
    render() {
        const {progressValue, 
            rightSideOffset, 
            containerClassName, 
            backgroundClassName, 
            barClassName, 
            percentClassName, 
            messageClassName,
            progressMessages} = this.props;
        const styleString = `calc(${(1 - progressValue) * 100}% + ${rightSideOffset})`;
        const messagesValid = progressMessages.length > 1;
        let messageIndex = !messagesValid ? 0 : Math.round(progressValue * (progressMessages.length - 2));
        if (progressValue === 1) { messageIndex = progressMessages.length - 1 }
        let messageToShow = progressValue === 0 || !messagesValid ? "" : progressMessages[messageIndex];
        return (
            <div className={containerClassName}>
                <div className={backgroundClassName}>
                    <div className={barClassName} style={{right: styleString}}></div>
                    <span className={percentClassName}>{Math.trunc(progressValue * 100)}%</span>
                </div>
                <div className={messageClassName}>{messageToShow}</div>
            </div>
        )
    }
}

export default ProgressBar;