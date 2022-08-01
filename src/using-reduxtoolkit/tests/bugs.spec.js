import configureStore from "../configureStore";
import { apiCallBegan } from "../api";
import {
  addBug,
  bugAdded,
  loadBugs,
  resolveBug,
  selectUnresolvedBugs,
} from "../bugs";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";

describe("bugsSlice - Solitarity Test", () => {
  describe("action creators", () => {
    // Solitarity Test
    it("addBug", () => {
      const bug = { description: "a" };
      const result = addBug(bug);
      const expected = {
        type: apiCallBegan.type,
        payload: {
          url: "/bugs",
          method: "post",
          data: bug,
          onSuccess: bugAdded.type,
        },
      };

      expect(result).toEqual(expected);
    });
  });
});

describe("bugsSlice - Social Tests", () => {
  //Arrange
  let fakeAxios;
  let store;

  beforeEach(() => {
    store = configureStore(); // we want to test the behaviour, dispatch(addBug)=> store

    // we should not talk to the API directly in our tests, create a mock
    fakeAxios = new MockAdapter(axios);
  });

  const bugSlice = () => store.getState().entities.bugs;

  // Social test
  it("should add the bug to the store if it's saved to the server", async () => {
    // Arrange
    const bug = { description: "a" };
    const savedBug = { ...bug, id: 1 };
    fakeAxios.onPost("/bugs").reply(200, savedBug); // tell fake axios to reply with 200 and savedBug data

    // Act
    await store.dispatch(addBug(bug));

    // Assert
    expect(bugSlice().list).toContainEqual(savedBug); // array should contain the savedBug
  });

  it("should not add the bug to the store if it's not saved to the server", async () => {
    // Arrange
    const bug = { description: "a" };
    fakeAxios.onPost("/bugs").reply(500); // tell fake axios to reply with 500

    // Act
    await store.dispatch(addBug(bug));

    // Assert
    expect(bugSlice().list).toHaveLength(0);
  });

  // make it a function so we can get a clean new state every time we call it
  const createInitState = () => ({ entities: { bugs: { list: [] } } });

  describe("selectors", () => {
    it("should get unresolved bugs", async () => {
      // Arrange
      const initState = createInitState();
      initState.entities.bugs.list = [
        { id: 1, resolved: true },
        { id: 2, resolved: false },
        { id: 3, resolved: false },
      ];

      // Act
      const result = selectUnresolvedBugs(initState);

      // Assert
      expect(result).toHaveLength(2);
    });
  });

  it("should mark a bug as resolved if server response succeed", async () => {
    // Arrange
    const bug = { id: 87 };
    // first create a bug
    fakeAxios.onPost("/bugs").reply(200, bug);
    await store.dispatch(addBug(bug)); // it is okay to dispatch multiple actions, like in a real scenario
    fakeAxios.onPatch(`/bugs/${bug.id}`).reply(200, bug);

    // Act
    await store.dispatch(resolveBug(bug.id));

    // Assert
    const result = bugSlice().list.filter((item) => item.id === bug.id);
    console.log(bugSlice().list);
    expect(result).toHaveLength(1);
    expect(result[0].resolved).toBeTruthy();
  });

  it("should not mark a bug as resolved if server response is failed", async () => {
    // Arrange
    const bug = { id: 87 };
    // first create a bug
    fakeAxios.onPost("/bugs").reply(200, bug);
    await store.dispatch(addBug(bug)); // it is okay to dispatch multiple actions, like in a real scenario
    fakeAxios.onPatch(`/bugs/${bug.id}`).reply(500, bug);

    // Act
    await store.dispatch(resolveBug(bug.id));

    // Assert
    const result = bugSlice().list.filter((item) => item.id === bug.id);

    expect(result).toHaveLength(1);
    expect(result[0].resolved).toBeFalsy();
  });

  describe("loading bugs", () => {
    describe("if the bugs exist in the cache", () => {
      it("should not be fetched from the server again", async () => {
        fakeAxios.onGet("/bugs").reply(200, [{ id: 1 }]);

        // proper way to test: check if the server has been called twice
        await store.dispatch(loadBugs());
        await store.dispatch(loadBugs());

        const numberOfCalls = fakeAxios.history.get.length;
        expect(numberOfCalls).toBe(1);
      });
    });

    describe("if the bugs don't exist in the cache", () => {
      it("should be fetched from the server and put in the store", async () => {
        fakeAxios.onGet("/bugs").reply(200, [{ id: 1 }]);

        await store.dispatch(loadBugs());

        expect(bugSlice().list).toHaveLength(1);
      });

      describe("loading indicator", () => {
        it("should be true while fetching the bugs", async () => {
          // Arrange
          fakeAxios.onGet("/bugs").reply(() => {
            // exeute code before server response
            expect(bugSlice().loading).toBe(true);
            // server response
            return [200, [{ id: 1 }]];
          });

          store.dispatch(loadBugs());
        });
        it("should be false after fething the bugs", async () => {
          // Arrange
          fakeAxios.onGet("/bugs").reply(200, [{ id: 1 }]);

          await store.dispatch(loadBugs());

          expect(bugSlice().loading).toBe(false);
        });

        it("should be false if server returns an error", async () => {
          // Arrange
          fakeAxios.onGet("/bugs").reply(500);

          await store.dispatch(loadBugs());

          expect(bugSlice().loading).toBe(false);
        });
      });
    });
  });
});
