import { act } from "@testing-library/react";
import * as zustand from "zustand";

const { create: actualCreate, createStore: actualCreateStore } =
  jest.requireActual<typeof zustand>("zustand");

export const storeResetFns = new Set<() => void>();

const createUncurried = <T>(stateCreator: zustand.StateCreator<T>) => {
  const store = actualCreate(stateCreator);
  const initialState = store.getState();
  storeResetFns.add(() => {
    store.setState(initialState, true);
  });
  return store;
};

export const create = (<T>(stateCreator: zustand.StateCreator<T>) => {
  console.log("zustand create mock");

  return typeof stateCreator === "function"
    ? createUncurried(stateCreator)
    : createUncurried;
}) as typeof zustand.create;

const createStoreUncurried = <T>(stateCreator: zustand.StateCreator<T>) => {
  const store = actualCreateStore(stateCreator);
  const initialState = store.getState();
  storeResetFns.add(() => {
    store.setState(initialState, true);
  });
  return store;
};

export const createStore = (<T>(stateCreator: zustand.StateCreator<T>) => {
  return typeof stateCreator === "function"
    ? createStoreUncurried(stateCreator)
    : createStoreUncurried;
}) as typeof zustand.createStore;

afterEach(() => {
  act(() => {
    storeResetFns.forEach((resetFn) => {
      resetFn();
    });
  });
});
