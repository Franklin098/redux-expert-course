# Designing a Redux Store

## Redux State vs Local State
 
 Is it correct to have local state in our UI components? or do we have to put all the state logic in the redux store?

 If we store all the data in the redux store, we have:

 * Unified data access
 * Cacheability
 * Easier Debugging
 * More testable code

---

 Expection: Forms state

 We shouldn't store the state of a UI form being filled, because:

 * Forms have temporary values until the user submits the form
 * Too many dispatches (1 dispatch event per each keyboard type)
 * Harder debugging (we'll see 5000 actions dispatched just for keyboard events)

 *Probably we want to change the redux store state when the user submits the form, not just when he is filling the form.*

Use local state when it makes sense


## Structuring a Redux Store

Probably in lots of scenarios using a Map instead of an Array is a better idea.

With maps we have quick look ups for an object given its id.

In our example we can find a Bug or a Project whith its id using a map.

```
{
    1: {
        id: 1,
        description:"bug 1",
        resolved: false
        },
    2: {
        id: 2,
        description:"bug 2",
        resolved: true
        }
}
```

Maps doesn't preserver order. If the user sorts the list of bugs, we'll not be able to change the order of the properties in the object. **Always look at the problem you want to solve**.

**We can also use a combination of Maps and Arrays !:**

```
{
    byId:{
        1: {
            id: 1,
            description:"bug 1",
            resolved: false
            },
        2: {
            id: 2,
            description:"bug 2",
            resolved: true
            }
        3: {
            id: 3,
            description:"bug 3",
            resolved: true
            }
    },
    allIds:[3,1,2]  
}
```

allIds represent the order of the items in case the user wants to sort them

## Ideas to structure the Store:

* Create multiple slices for each entity in your app

```
{
    bugs: [],
    projects:[],
    tags:[]
}
```

* Put all entities in a parent slice

```
{
    entities: {
                bugs: [],
                projects:[],
                tags:[]
              }
}
```

* Store global user data


```
{
    entities: {
                bugs: [],
                projects:[],
                tags:[]
              },
    auth: {
        userId: 1,
        name: 'Jhon',
        token: 'etc1kkskxk'
    }
}
```

* Create a separate space to store User Interface State data:

For example if we want to add sort and filter functionality for our bugs list:

```
{
    entities: {
                bugs: [],
                projects:[],
                tags:[]
              },
    auth: {
        userId: 1,
        name: 'Jhon',
        token: 'etc1kkskxk'
    },
    ui: {
        bugs:{
            query: '....',
            sortBy: '...'
        }
    }
}
```

## Combining Reducers

We can use combineReducer() funciton from Redux to combine multiple slices/reducers. 

When we dispatch an action, each node in the reduceres tree pass the action to its children -> so in redux multiple reducers can handle the same action.

Each reducer is responsible for updating a slice of the hole store state.

<image src="../../images/combiningReducers.png" width="50%"/>

## Normalization

**We should not duplicate data in our store**

Let's say our Bugs objects have a 'project' name field, and we also have an entity called Projects, so if the user updates the project name, we'll need to update it in every place.

<image src="../../images/notNormalizedStore.png" width="50%"/>

In this case we need to normalize the data and replace the project object inside our bugs list, with a project id

<image src="../../images/normalized.png" width="50%"/>

**What if we are consuming an external API that provide us de-normalized data?**

We can use libraries like *normalizr* to normalize the data, which is very easy to use.

## Selectors

When we want to consume data from our store we can use selector to quickly get a slice of our store.