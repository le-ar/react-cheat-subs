import { Component } from "react";
import React from "react";
import { Modal, Loading, Icon, Button, Link } from "@shopify/polaris";
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
                                <div className="mr-1">
                                    <Button plain>Пополнить</Button>
                                </div>
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

        return (
            <Modal
                title="Мои задания"
                open={this.props.myTasksStore.isModalOpen}
                onClose={() => { this.props.myTasksStore?.setModalOpen(false) }}
            >
                {content}
            </Modal>
        );
    }
}