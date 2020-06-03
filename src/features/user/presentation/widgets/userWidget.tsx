import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { AuthStore } from "../../../auth/presentation/stores/authStore";
import { Avatar, Button, Loading } from "@shopify/polaris";
import { CirclePlusMinor } from '@shopify/polaris-icons';
import DonateStore from "../../../donate/presentation/stores/donateStore";

interface UserWidgetProps {
    authStore?: AuthStore;
    donateStore?: DonateStore;
}

@inject('authStore', 'donateStore')
@observer
export default class UserWidget extends Component<UserWidgetProps> {
    render() {
        if (typeof this.props.authStore === 'undefined' || this.props.authStore.myAccount === null) {
            return <Loading />;
        }

        let orders = (
            <div></div>
        );

        if (this.props.authStore.myAccount.orderCount > 0) {
            orders = (
                <div>
                    <Button plain>
                        Активные заказы
                    </Button>
                </div>
            );
        }

        return (
            <div className="mb-4 profile">
                <div className="d-flex align-items-center mb-1">
                    <div className="mr-2">
                        <Avatar source={this.props.authStore.myAccount.avatar} customer />
                    </div>
                    <div>
                        <div>{this.props.authStore.myAccount.name}</div>
                        <div className="d-flex fs-12">
                            <span className="mr-1">Поинтов: {this.props.authStore.myAccount.point}</span>
                            <Button plain icon={CirclePlusMinor} textAlign="left" onClick={() => { this.props.donateStore?.setModalOpen(true)}} />
                        </div>
                    </div>
                </div>
                {orders}
            </div>
        );
    }
}