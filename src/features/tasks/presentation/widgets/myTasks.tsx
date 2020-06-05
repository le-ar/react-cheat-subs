import { Component } from "react";
import React from "react";
import { Modal, Loading, Icon, Button, Link, Spinner } from "@shopify/polaris";
import MyTasksStore from "../store/myTasksStore";
import { inject, observer } from "mobx-react";
import { CameraMajorMonotone, NoteMajorMonotone } from "@shopify/polaris-icons";

export interface MyTasksProps {
    myTasksStore?: MyTasksStore;
}

@inject('myTasksStore')
@observer
export default class MyTasks extends Component<MyTasksProps> {
    render() {
        if (typeof this.props.myTasksStore === 'undefined') {
            return <Loading />;
        }

        let content: JSX.Element | JSX.Element[] = this.props.myTasksStore.myTasks.map(task => {
            let icon = CameraMajorMonotone;
            if (task.resourceType === 'note') {
                icon = NoteMajorMonotone;
            }

            let name = 'Поставили лайки';
            if (task.resourceType === 'note') {
                name = 'Подписались'
            }

            return (
                <Modal.Section key={task.id}>
                    <div className="d-flex">
                        <div className="mr-2">
                            <Icon source={icon} />
                        </div>
                        <div>
                            <div>
                                <Link url="https://google.com" external>{task.name}</Link>
                            </div>
                            <div>{name} {task.done}/{task.orderCount}</div>
                            <div className="d-flex">
                                {/* <div className="mr-1">
                                    <Button plain>Пополнить</Button>
                                </div> */}
                                <Button plain>Отменить</Button>
                            </div>
                        </div>
                    </div>
                </Modal.Section>
            );
        });

        if (this.props.myTasksStore.myTasksError.length > 0) {
            content = (
                <Modal.Section>
                    {this.props.myTasksStore.myTasksError}
                </Modal.Section>
            );
        }

        if (Array.isArray(content)) {
            let nextLoading = <div key="loading"></div>;

            if (!this.props.myTasksStore.isMyTasksAllLoaded) {
                nextLoading = (
                    <Modal.Section key="loading">
                        <div className="d-flex justify-content-center" >
                            <Button plain onClick={() => this.props.myTasksStore?.loadMyTasks()}>Загрузить еще</Button>
                        </div>
                    </Modal.Section>
                );
                if (this.props.myTasksStore?.myTasksNextLoading) {
                    nextLoading = (
                        <Modal.Section key="loading">
                            <div className="d-flex justify-content-center">
                                <Spinner size="small" />
                            </div>
                        </Modal.Section>
                    );
                }
            }

            content.push(nextLoading);
        }

        return (
            <Modal
                loading={this.props.myTasksStore.myTasksLoading}
                onScrolledToBottom={() => this.props.myTasksStore?.loadMyTasks()}
                title="Мои задания"
                open={this.props.myTasksStore.isModalOpen}
                onClose={() => { this.props.myTasksStore?.setModalOpen(false) }}
            >
                {content}
            </Modal>
        );
    }
}