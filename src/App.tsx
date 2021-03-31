import s from './App.module.css';
import React, { useState, useEffect, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import TodoList from './components/TodoList/TodoList';
import Filter from './components/TodoList/Filter';
import Stats from './components/TodoList/Stats';
import TodoEditor from './components/TodoList/TodoEditor';
import ITodo from './interfaces/Todo.interface';

const getInitialTodoState = () => {
  const savedTodos = localStorage.getItem('todos');

  return savedTodos ? JSON.parse(savedTodos) : [];
};

const App = () => {
  const [todos, setTodos] = useState<ITodo[]>(getInitialTodoState);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (text: string) => {
    const todo = {
      id: uuidv4(),
      text,
      completed: false,
    };

    setTodos(todos => [todo, ...todos]);
  };

  const deleteTodo = (todoId: string) => {
    setTodos(todos => todos.filter(todo => todo.id !== todoId));
  };

  const toggleCompleted = (todoId: string) => {
    setTodos(todos =>
      todos.map(todo =>
        todo.id === todoId ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  const changeFilter = (filter: string) => {
    setFilter(filter);
  };

  const visibleTodos = useMemo(() => {
    const normalizedFilter = filter.toLowerCase();

    return todos.filter(todo =>
      todo.text.toLowerCase().includes(normalizedFilter),
    );
  }, [filter, todos]);

  const completedTodoCount = useMemo(() => {
    return todos.reduce(
      (total, todo) => (todo.completed ? total + 1 : total),
      0,
    );
  }, [todos]);

  return (
    <div className={s.wrap}>
      <TodoEditor onSubmit={addTodo} />

      <Filter value={filter} onChange={changeFilter} />
      <Stats total={todos.length} completed={completedTodoCount} />

      <TodoList
        todos={visibleTodos}
        onDeleteTodo={deleteTodo}
        onToggleCompleted={toggleCompleted}
      />
    </div>
  );
};

export default App;

