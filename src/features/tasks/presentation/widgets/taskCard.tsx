import { Component } from "react"
import React from "react";
import { Icon, Spinner, Card, TextStyle } from "@shopify/polaris";
import { RefreshMinor } from '@shopify/polaris-icons';
import Task from "../../data/entities/task";
import { Flipper, Flipped } from "react-flip-toolkit";
import { CameraMajorMonotone } from '@shopify/polaris-icons';
import { NoteMajorMonotone } from '@shopify/polaris-icons';
import { CancelSmallMinor } from '@shopify/polaris-icons';

export interface TaskCardProps {
    title: string;
    isLoading: boolean;
    tasks: Task[];
    doText: string;
    info?: string;
    onRefresh: () => void;
    onRemove: (id: number) => void;
}

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

        console.log(result);

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

            return (
                <Card.Section>
                    <Flipped key={task.id} flipId={task.id}>
                        <div className="d-flex">
                            <div className="d-flex mr-2">
                                <Icon source={icon} />
                            </div>
                            <div className="flex-grow-1">
                                <div>{this.props.doText} {type}</div>
                                <div>Получи <TextStyle variation="strong">{task.price} поинтов</TextStyle></div>
                            </div>
                            <div className="close" onClick={() => this.props.onRemove(task.id)}>
                                <Icon source={CancelSmallMinor} />
                            </div>
                        </div>
                    </Flipped>
                </Card.Section>
            );
        });
    }
}