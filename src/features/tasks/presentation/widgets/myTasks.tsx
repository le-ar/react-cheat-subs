import { Component } from "react";
import React from "react";
import { Modal, Loading, Icon, Button, Link, Spinner, TextStyle } from "@shopify/polaris";
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

            let taskStatus = (
                <TextStyle>В работе</TextStyle>
            );
            if (task.status === 'Done') {
                taskStatus = (
                    <TextStyle variation="positive">Выполнен</TextStyle>
                );
            } else if (task.status === 'Canceled') {
                taskStatus = (
                    <TextStyle variation="strong">Отменен</TextStyle>
                );
            } else if (task.status === 'Banned') {
                taskStatus = (
                    <TextStyle variation="negative">Заблокирован</TextStyle>
                );
            }

            let actions: JSX.Element | undefined = undefined;
            if (task.status === 'Started') {
                actions = (
                    <div className="d-flex">
                        {/* <div className="mr-1">
                            <Button plain>Пополнить</Button>
                        </div> */}
                        <Button plain>Отменить</Button>
                    </div>
                );
            }

            return (
                <Modal.Section key={task.id}>
                    <div className="d-flex">
                        <div className="mr-2">
                            <Icon source={icon} />
                        </div>
                        <div className="my-task__main mr-1">
                            <div className="my-task__url">
                                <Link url="https://google.com" external>
                                    <span>{task.name}</span>
                                </Link>
                            </div>
                            <div>{name} {task.done}/{task.orderCount}</div>
                            {actions}
                        </div>
                        <div>
                            {taskStatus}
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