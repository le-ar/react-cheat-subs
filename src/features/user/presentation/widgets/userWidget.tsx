import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { AuthStore } from "../../../auth/presentation/stores/authStore";
import { Avatar, Button, Loading } from "@shopify/polaris";
import { CirclePlusMinor } from '@shopify/polaris-icons';
import DonateStore from "../../../donate/presentation/stores/donateStore";
import MyTasksStore from "../../../tasks/presentation/store/myTasksStore";

interface UserWidgetProps {
    authStore?: AuthStore;
    donateStore?: DonateStore;
    myTasksStore?: MyTasksStore;
}

@inject('authStore', 'donateStore', 'myTasksStore')
@observer
export default class UserWidget extends Component<UserWidgetProps> {
    render() {
        if (typeof this.props.authStore === 'undefined' ||
            this.props.authStore.myAccount === null ||
            typeof this.props.donateStore === 'undefined' ||
            typeof this.props.myTasksStore === 'undefined') {
            return <Loading />;
        }

        let orders = (
            <div></div>
        );

        if (this.props.authStore.myAccount.orderCount > 0) {
            orders = (
                <div>
                    <Button plain onClick={() => {
                        this.props.myTasksStore?.setModalOpen(true);
                    }}>
                        Мои задания
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
                        <div>
                            {this.props.authStore.myAccount.name}
                            {/* <Button plain>
                                {this.props.authStore.myAccount.name}
                            </Button> */}
                        </div>
                        <div className="d-flex fs-12">
                            <span className="mr-1">Поинтов: {this.props.authStore.myAccount.point}</span>
                            <Button plain icon={CirclePlusMinor} textAlign="left" onClick={() => { this.props.donateStore?.setModalOpen(true) }} />
                        </div>
                    </div>
                </div>
                {orders}
                <Button plain>Выйти</Button>
            </div>
        );
    }
}