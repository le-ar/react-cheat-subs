import React, { Component, lazy, Suspense } from 'react';
import logo from './logo.svg';
import { inject, observer } from 'mobx-react';
import { AuthStore } from './features/auth/presentation/stores/authStore';
import { Frame, Loading, Button, Layout, Card } from '@shopify/polaris';
import User from './features/user/data/entities/user';

const Auth = lazy(() => import('./features/auth/presentation/pages/authPage'));
const TaskPage = lazy(() => import('./features/tasks/presentation/pages/taskPage'));

interface AppProps {
  authStore?: AuthStore;
}

@inject('authStore')
@observer
export class App extends Component<AppProps> {

  refresh(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
    event.preventDefault();
    window.location.reload();
  }

  render() {
    let isLoading = this.props.authStore?.isMyAccountLoading;
    let content = <Loading />;

    if (!isLoading) {
      if (this.props.authStore?.myAccountHasError) {
        content = (
          <Card title="Произошла ошибка!">
            <Card.Section>
              <a href="#" onClick={(event) => this.refresh(event)}>Попробуйте обновить страницу</a>
            </Card.Section>
          </Card>
        );
      }

      if (this.props.authStore?.myAccount === null) {
        content = <Auth />;
      }

      if (this.props.authStore?.myAccount instanceof User) {
        content = <TaskPage />;
      }
    }


    return (
      <Frame>
        <div className="d-flex mw-100 mh-100 justify-content-center align-items-center">

          <Suspense fallback={<Loading />}>
            {content}
          </Suspense>
        </div>
      </Frame>
    );
  }
}