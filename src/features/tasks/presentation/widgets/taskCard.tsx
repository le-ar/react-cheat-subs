import { Component } from "react"
import React from "react";
import { Icon, Spinner, Card, TextStyle, Button, Link } from "@shopify/polaris";
import { RefreshMinor } from '@shopify/polaris-icons';
import Task from "../../data/entities/task";
import { Flipper, Flipped } from "react-flip-toolkit";
import { CameraMajorMonotone } from '@shopify/polaris-icons';
import { NoteMajorMonotone } from '@shopify/polaris-icons';
import { CancelSmallMinor } from '@shopify/polaris-icons';
import TaskStore from "../store/taskStore";
import { inject, observer } from "mobx-react";

export interface TaskCardProps {
    taskStore?: TaskStore;

    title: string;
    isLoading: boolean;
    tasks: Task[];
    doText: string;
    info?: string;
    onRefresh: () => void;
    onRemove: (id: number) => void;
    onComplete: (taskId: number) => void;
}

@inject('taskStore')
@observer
export default class TaskCard extends Component<TaskCardProps> {
    handleRefresh(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
        event.preventDefault();
        this.props.onRefresh();
    }

    render() {
        let header = (
            < div className="d-flex justify-content-between" >
                <h2 className="Polaris-Heading">{this.props.title}</h2>
                <a href="#" className="d-flex" onClick={(event) => this.handleRefresh(event)}>
                    <Icon
                        source={RefreshMinor} />
                </a>
            </div >
        );

        let content: JSX.Element | JSX.Element[] = <div></div>

        if (this.props.isLoading) {
            content = (
                <div className="d-flex justify-content-center align-items-center flex-grow-1">
                    <Spinner size="large" color="teal" />
                </div>
            );
        } else {
            content = this.renderTaskLikes();
        }

        if (typeof this.props.info !== 'undefined') {
            content = this.renderInfo();
        }

        return (
            <div className="card-task">
                <Flipper flipKey={this.getUniquieArrayKey()}>
                    <Card title={header}>
                        {content}
                    </Card>
                </Flipper>
            </div>
        );
    }

    private getUniquieArrayKey(): string {
        let result = '';

        for (let task of this.props.tasks) {
            result += task.id + '-';
        }

        return result;
    }

    private renderInfo(): JSX.Element {
        return (
            <div className="d-flex justify-content-center center align-items-center flex-grow-1 no-hover">
                <Card.Section>
                    {this.props.info}
                </Card.Section>
            </div>
        );
    }

    private renderTaskLikes(): JSX.Element | JSX.Element[] {
        if (this.props.tasks.length === 0) {
            return (
                <div className="d-flex justify-content-center center align-items-center flex-grow-1 no-hover">
                    <Card.Section>
                        Нет заданий
                    </Card.Section>
                </div>
            );
        }

        return this.props.tasks.map<JSX.Element>((task) => {
            let icon = CameraMajorMonotone;
            if (task.resourceType === 'note') {
                icon = NoteMajorMonotone;
            }

            let type = 'фотографию';
            if (task.resourceType === 'note') {
                type = 'запись на стене';
            }

            let completeTask = (
                <div onClick={(event) => { this.handleComplete(event, task.id) }}>
                    <Link>
                        Получи <TextStyle variation="strong">{task.price} поинтов</TextStyle>
                    </Link>
                </div>
            );

            if (this.props.taskStore?.isTaskChecking(task.id)) {
                completeTask = <div>Проверка...</div>;
            }

            return (
                <Card.Section key={task.id}>
                    <Flipped flipId={task.id}>
                        <div className="d-flex" onClick={() => this.runTask(task.url, task.id)}>
                            <div className="d-flex mr-2">
                                <Icon source={icon} />
                            </div>
                            <div className="flex-grow-1">
                                <div>{this.props.doText} {type}</div>
                                {completeTask}
                            </div>
                            <div className="close" onClick={(event) => this.handleRemove(event, task.id)}>
                                <Icon source={CancelSmallMinor} />
                            </div>
                        </div>
                    </Flipped>
                </Card.Section>
            );
        });
    }

    private handleComplete(event: React.MouseEvent<HTMLDivElement, MouseEvent>, taskId: number) {
        event.stopPropagation();
        this.props.onComplete(taskId)
    }

    private handleRemove(event: React.MouseEvent<HTMLDivElement, MouseEvent>, taskId: number) {
        event.stopPropagation()
        this.props.onRemove(taskId);
    }

    private runTask(url: string, taskId: number) {
        let win = window.open(url, '_blank', 'toolbar=0,location=0,menubar=0,width=1100,height=700');
        let checker = setInterval(() => {
            if (win?.closed) {
                clearInterval(checker);
                this.props.onComplete(taskId);
            }
        }, 350);
    }
}