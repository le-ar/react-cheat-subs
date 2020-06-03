import { Component } from "react";
import { Modal, Loading, FormLayout, TextField, InlineError, Button } from "@shopify/polaris";
import React from "react";
import { inject, observer } from "mobx-react";
import DonateStore from "../stores/donateStore";
import { observable } from "mobx";

export interface DonateWidgetProps {
    donateStore?: DonateStore
}

@inject('donateStore')
@observer
export default class DonateWidget extends Component<DonateWidgetProps> {
    render() {
        if (typeof this.props.donateStore === 'undefined') {
            return <Loading />;
        }

        let content = (
            <div><InlineError message={this.props.donateStore.exchangeError} fieldID="" /></div>
        );
        if (this.props.donateStore.exchangeError.length === 0) {
            content = (
                <FormLayout>
                    <TextField label="Рубли"
                        type="number"
                        value={this.props.donateStore.sumRub}
                        onChange={(value) => {
                            this.props.donateStore?.setSumRub(value);
                        }}
                    />
                    <TextField label="Поинты"
                        type="number"
                        value={this.props.donateStore.sumPoints}
                        onChange={(value) => {
                            this.props.donateStore?.setSumPoints(value);
                        }}
                    />
                    <InlineError message={this.props.donateStore.sumError} fieldID="" />
                    <InlineError message={this.props.donateStore.donateError} fieldID="" />
                    <Button
                        loading={this.props.donateStore.isDonateLoading}
                        disabled={this.props.donateStore.sumError.length > 0}
                        onClick={() => {
                            this.props.donateStore?.donate();
                        }}
                    >
                        Пополнить
                    </Button>
                </FormLayout>
            );
        }

        return (
            <Modal
                loading={this.props.donateStore.exchangeLoading}
                title="Пополнение счета"
                open={this.props.donateStore.isModalOpen}
                onClose={() => {
                    this.props.donateStore?.setModalOpen(false);
                }}
            >
                <Modal.Section>
                    {content}
                </Modal.Section>
            </Modal>
        );
    }
}