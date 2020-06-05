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
import DonateStore from "../../../donate/presentation/stores/donateStore";
import DonateWidget from "../../../donate/presentation/widgets/donateWidget";
import MyTasksStore from "../store/myTasksStore";
import MyTasks from "../widgets/myTasks";
import { TaskRemoteDatasourceImpl } from '../../data/datasources/taskRemoteDatasource';
import { DonateRemoteDatasourceImpl } from '../../../donate/data/datasources/donateRemoteDatasource';

interface TaskPageProps {
    authStore?: AuthStore;
}

@inject('authStore')
@observer
export default class TaskPage extends Component<TaskPageProps> {
    private interval: NodeJS.Timeout | null = null;
    @observable private taskStore?: TaskStore;
    @observable private addTaskStore?: AddTaskStore;
    @observable private donateStore?: DonateStore;
    @observable private myTasksStore?: MyTasksStore;

    componentWillUnmount() {
        if (this.interval !== null) {
            clearInterval(this.interval);
        }
    }

    componentDidMount() {
        this.mounted();
    }

    async mounted() {
        let taskRemoteDatasource = new TaskRemoteDatasourceImpl();
        let donateRemoteDatasource = new DonateRemoteDatasourceImpl();

        this.addTaskStore = new AddTaskStore({
            taskRemoteDatasource,
            authStore: this.props.authStore!
        });
        this.taskStore = new TaskStore({
            taskRemoteDatasource,
        });
        this.donateStore = new DonateStore({
            donateRemoteDatasource
        });
        this.myTasksStore = new MyTasksStore({
            taskRemoteDatasource
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
        if (typeof this.taskStore === 'undefined' ||
            typeof this.addTaskStore === 'undefined' ||
            typeof this.donateStore === 'undefined' ||
            typeof this.myTasksStore === 'undefined') {
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
                <Provider donateStore={this.donateStore} myTasksStore={this.myTasksStore}>
                    <div>
                        <UserWidget />
                        <MyTasks />
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
                    <DonateWidget />
                </Provider>
                <Provider taskStore={this.taskStore}>
                    <div className="d-flex flex-wrap tasks">
                        <TaskCard
                            title="Лайки"
                            isLoading={!this.taskStore!.isTasksLikesLoaded}
                            tasks={this.taskStore!.tasksLikes}
                            onRefresh={() => this.handleLikesRefresh()}
                            doText="Лайкни"
                            info={info}
                            onRemove={(id) => {
                                this.taskStore?.removeTaskLikeById(id);
                            }}
                            onComplete={(taskId) => {
                                this.taskStore?.completeTask(taskId, this.props.authStore!.myAccount!.id);
                            }}
                        />
                    </div>
                </Provider>
            </div>
        );
    }
}