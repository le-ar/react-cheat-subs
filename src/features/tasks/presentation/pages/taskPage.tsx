import { Component } from "react";
import React from "react";
import { Loading } from "@shopify/polaris";
import TaskStore from "../store/taskStore";
import { inject, observer } from "mobx-react";
import { AuthStore } from "../../../auth/presentation/stores/authStore";
import { observable } from "mobx";
import TaskCard from "../widgets/taskCard";
import UserWidget from "../../../user/presentation/widgets/userWidget";

interface TaskPageProps {
    authStore?: AuthStore;
}

@inject('authStore')
@observer
export default class TaskPage extends Component<TaskPageProps> {
    private interval: NodeJS.Timeout | null = null;
    @observable private taskStore: TaskStore | undefined = undefined;

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
        let taskRemoteDatasource = new (await import('../../data/datasources/taskRemoteDatasource')).TaskRemoteDatasourceImpl();

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
        if (typeof this.taskStore === 'undefined') {
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
                <div className="d-flex">
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