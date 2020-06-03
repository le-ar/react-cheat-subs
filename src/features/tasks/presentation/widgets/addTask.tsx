import { Component } from "react"
import { Modal, FormLayout, TextField, Select, Button, InlineError } from "@shopify/polaris";
import React from "react";
import AddTaskStore from "../store/addTaskStore";
import { inject, observer } from "mobx-react";
import { AuthStore } from "../../../auth/presentation/stores/authStore";
import { TaskType } from "../../data/entities/addTask";

export interface AddTaskProps {
    addTaskStore?: AddTaskStore;
    authStore?: AuthStore;
}

@inject('addTaskStore', 'authStore')
@observer
export default class AddTask extends Component<AddTaskProps> {
    render() {
        let content = <div></div>;

        if (!this.props.addTaskStore?.isPricesLoading) {
            if (this.props.addTaskStore?.pricesHasError) {
                content = <div>{this.props.addTaskStore.pricesError}</div>;
            } else {
                let needAddPoints: boolean = parseInt(this.props.addTaskStore!.calculatedPrice) > this.props.authStore!.myAccount!.point;

                content = (
                    <FormLayout>
                        <Select
                            disabled={this.props.addTaskStore?.addTaskLoading}
                            label="Тип"
                            options={this.props.addTaskStore?.taskTypes}
                            onChange={(selected: TaskType) => { this.props.addTaskStore!.taskSelected = selected; }}
                            value={this.props.addTaskStore!.taskSelected}
                        />
                        <TextField
                            disabled={this.props.addTaskStore?.addTaskLoading}
                            label="Ссылка"
                            value={this.props.addTaskStore!.taskUrl}
                            onChange={(value) => { this.props.addTaskStore!.taskUrl = value; }}
                        />
                        <TextField
                            disabled={this.props.addTaskStore?.addTaskLoading}
                            min={1}
                            type="number"
                            label="Кол-во"
                            value={this.props.addTaskStore?.taskCount}
                            onChange={(value) => { this.props.addTaskStore?.setTaskCount(value) }}
                            error={this.props.addTaskStore?.validTaskCount ? '' : 'Кол-во должно быть больше 0'}
                        />
                        <TextField
                            label="Стоимость"
                            value={this.props.addTaskStore?.calculatedPrice}
                            disabled={true}
                        />
                        <InlineError message={this.props.addTaskStore!.addTaskError} fieldID=""/>
                        <div className="d-flex">
                            <div className="mr-1">
                                <Button
                                    disabled={needAddPoints || !this.props.addTaskStore?.validTaskCount}
                                    loading={this.props.addTaskStore?.addTaskLoading}
                                    onClick={() => { this.props.addTaskStore?.addTask() }}
                                >
                                    Добавить
                                </Button>
                            </div>
                            <Button plain>Пополнить счет</Button>
                        </div>
                    </FormLayout>
                );

                if (this.props.addTaskStore?.addTaskSuccess) {
                    content = (
                        <div>
                            <h1>Успешно добавлено!</h1>
                        </div>
                    );
                }
            }
        }

        return (
            <Modal
                title="Добавление задания"
                open={this.props.addTaskStore!.isModalOpen}
                onClose={() => { this.props.addTaskStore!.setIsModalOpen(false) }}
                loading={this.props.addTaskStore?.isPricesLoading}
            >
                <Modal.Section>
                    {content}
                </Modal.Section>
            </Modal>
        );
    }
}