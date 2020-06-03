import { Component } from "react";
import React from "react";
import { Loading, Button } from "@shopify/polaris";
import TaskStore from "../store/taskStore";
import { inject, observer, Provider } from "mobx-react";
import { AuthStore } from "../../../auth/presentation/stores/authStore";
import { observable } from "mobx";
import TaskCard from "../widgets/taskCard";
import UserWidget from "../../../user/presentation/widgets/userWidget";
import AddTaskStore from "../store/addTaskStore";
import AddTask from "../widgets/addTask";

interface TaskPageProps {
    authStore?: AuthStore;
}

@inject('authStore')
@observer
export default class TaskPage extends Component<TaskPageProps> {
    private interval: NodeJS.Timeout | null = null;
    @observable private taskStore: TaskStore | undefined = undefined;
    @observable private addTaskStore: AddTaskStore | undefined = undefined;

    componentWillUnmount() {
        if (this.interval !== null) {
            clearInterval(this.interval);
        }
    }

    componentDidMount() {
        this.mounted();
    }

    async mounted() {
        let taskClass = (await import('../store/taskStore')).default;
        let addTaskClass = (await import('../store/addTaskStore')).default;
        let taskRemoteDatasource = new (await import('../../data/datasources/taskRemoteDatasource')).TaskRemoteDatasourceImpl();

        this.addTaskStore = new addTaskClass({
            taskRemoteDatasource,
            authStore: this.props.authStore!
        });
        this.taskStore = new taskClass({
            taskRemoteDatasource,
        });
        this.taskStore.refreshTasksLikes();

        this.interval = setInterval(() => {
            if (!this.taskStore?.isTasksLikesLoading) {
                this.taskStore?.loadTasksLikes();
            }
        }, 5000);
    }

    handleLikesRefresh() {
        this.taskStore?.refreshTasksLikes();
    }

    render() {
        if (typeof this.taskStore === 'undefined' || typeof this.addTaskStore === 'undefined') {
            return <Loading />;
        }

        let likesInfo;
        if (this.taskStore?.isTasksLikesLoaded) {
            if (this.taskStore.tasksLikesHasError) {
                likesInfo = this.taskStore?.tasksLikesError;
            }
        }

        let info;
        if (this.taskStore.tasksLikesHasError) {
            info = this.taskStore.tasksLikesError;
        }

        return (
            <div>
                <div>
                    <UserWidget />
                </div>
                <div className="mb-1">
                    <Button plain onClick={() => {
                        this.addTaskStore!.setIsModalOpen(true);
                    }}>
                        Добавить задание
                    </Button>
                    <Provider addTaskStore={this.addTaskStore}>
                        <AddTask />
                    </Provider>
                </div>
                <div className="d-flex flex-wrap tasks">
                    <TaskCard
                        title="Лайки"
                        isLoading={!this.taskStore!.isTasksLikesLoaded}
                        tasks={this.taskStore!.tasksLikes}
                        onRefresh={() => this.handleLikesRefresh()}
                        doText="Лайкни"
                        info={info}
                        onRemove={(id) => {
                            this.taskStore!.tasksLikes = this.taskStore!.tasksLikes.filter(t => t.id !== id);
                        }}
                    />
                    <TaskCard
                        title="Лайки"
                        isLoading={!this.taskStore!.isTasksLikesLoaded}
                        tasks={this.taskStore!.tasksLikes}
                        onRefresh={() => this.handleLikesRefresh()}
                        doText="Лайкни"
                        info={info}
                        onRemove={(id) => {
                            this.taskStore!.tasksLikes = this.taskStore!.tasksLikes.filter(t => t.id !== id);
                        }}
                    />
                    <TaskCard
                        title="Лайки"
                        isLoading={!this.taskStore!.isTasksLikesLoaded}
                        tasks={this.taskStore!.tasksLikes}
                        onRefresh={() => this.handleLikesRefresh()}
                        doText="Лайкни"
                        info={info}
                        onRemove={(id) => {
                            this.taskStore!.tasksLikes = this.taskStore!.tasksLikes.filter(t => t.id !== id);
                        }}
                    />
                </div>
            </div>
        );
    }
}