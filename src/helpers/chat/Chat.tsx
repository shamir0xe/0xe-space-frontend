export enum ChatStates {
  NOT_STARTED = 0,
  IN_PROGRESS = 1,
  SUCCESS = 12345,
  FAILURE = -1,
}

export abstract class Chat {
  state: number = ChatStates.NOT_STARTED;
  history: JSX.Element[] = [<div></div>];

  isEnded(): boolean {
    return this.state == ChatStates.SUCCESS || this.state == ChatStates.FAILURE;
  }

  renderHistory(): JSX.Element {
    return (
      <div>
        {this.history.map((value, index) => {
          return (
            <div key={index} className="text-left">
              {value}
            </div>
          );
        })}
      </div>
    );
  }

  abstract recieve(line: string): Promise<JSX.Element>;
}
