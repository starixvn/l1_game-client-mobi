import React, { Component } from "react";

import Styles from "./base-modal.module.scss";

type Props = {
    isOpen: boolean;
    onCloseModal: Function;
    children: React.ReactNode;
};

export default class BaseModal extends Component<Props> {
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
        this.props.onCloseModal();
    }
    render() {
        const { children } = this.props;
        return (
            <div ref={this.wrapperRef} className={`popup ${Styles["base-modal"]}`}>
                <div className="popup-logo">
                    <span className="icon-small-logo"></span>
                </div>
                <div className="popup-closed-icon" onClick={this.closeModal}>
                    <span className="icon-close"></span>
                </div>
                <div className={Styles["popup-content"]}>{children}</div>
            </div>
        );
    }
}
