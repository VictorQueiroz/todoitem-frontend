import { ITodoItem } from '../todo.service';

export default function getIncomingTodoItem(value: ITodoItem) {
  return {
    ...value,
    /**
     * This is a workaround for a bug in the database, which added the `assignee` property, but did
     * not fill it as it should have.
     */
    assignee: value.assignee ?? '',
  };
}
