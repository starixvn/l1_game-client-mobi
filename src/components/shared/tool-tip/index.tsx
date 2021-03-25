// import React from "react";
import Styles from "./tooltip.module.scss";
import React, { Component } from "react";

export const ToolTipChild: React.FC = (props) => {
    return <div className={Styles["tooltiptext"]}>{props.children}</div>;
};

type Props = {
    isOpen: boolean;
    onClose: Function;
};

export default class ToolTipModal extends Component<Props> {
    wrapperRef: React.RefObject<HTMLDivElement>;

    constructor(props: Props) {
        super(props);
        this.wrapperRef = React.createRef();
        this.closeModal = this.closeModal.bind(this);
    }

    componentDidMount() {
        document.addEventListener("mousedown", this.handleClickOutside);
    }

    componentWillUnmountMount() {
        document.removeEventListener("mousedown", this.handleClickOutside);
    }

    handleClickOutside = (event) => {
        if (this.props.isOpen && this.wrapperRef && this.wrapperRef.current && !this.wrapperRef.current.contains(event.target)) {
            this.closeModal();
        }
    };

    closeModal() {
        this.props.onClose();
    }

    render() {
        return (
            <div ref={this.wrapperRef} className={Styles["tooltip"]}>
                {this.props.children}
            </div>
        );
    }
}
