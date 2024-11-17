# Kanpla React Native Challenge

Thank you to have read my technical test.

## Getting Started

```bash
npm install
npx expo prebuild

npm run android
npm run ios
```

## Introduction

### First task - Upgrade Expo

Expo is a fast moving project and just brought a new version right before the test.
It brings improvements in the DevTools that is useful for debugging and testing network requests.
The main goal of expo is to save us time, that's why this upgrade is a simple and fast task.

### Second task - Linter and Formatter

To help having a homogeneous codebase, I used to use BiomeJs which is faster than ESlint and brings its own formatter.
Tastes or colors, that's can be changed by something else.

### Third task - Error Handling

According to the documentation of your API, you have an OpenAPI specification.
I could use an OpenAPI parser to generate the types and the error handling code for fetch, axios or any other library.
But I wanted to keep a simple and "low level" to show the abstractions made.

Then, the folder `services` contains the code for the API calls.
You can see that the `kanplaFetch` function is a wrapper around the fetch function.
It handles the API key and the error handling.

The `errors.ts` file contains the error class that is used to handle the errors.
On the top of that, I added a `getErrorMessage` function that returns a generic error message.

To use these functions, you can use the `useQuery` hook from `react-query` and the `getErrorMessage` function.
React-Query is a very powerful library that allows you to handle the any async function and help you to get : loading, error, data states.
And more, it can be plugged to have cache, refetch, retry, etc.

### Fourth task - Optimistic Updates

I wanted to show you how to use optimistic updates to keep the app responsive.
Since most of the abstractions were already done, I just needed to plug kind of "skeleton" components.
Visible in the `OrderCardLoading` component for example.

Also, to show the loading state in actions and by definition in buttons,
I used the `PressableButton` component that is a wrapper around the `Pressable` component with a loading indicator.
It is useful also to avoid double actions by disabling the button when the action is loading.

Also, I've made sure that when you go back to the order list, the orders are refetched.

### Fifth task - UI Improvements

I wanted to show you how to improve the visual design and add support for different screen orientations.
In order to fit in the time left, I decided just to polish the UI not adding new complexe components.
But we can point some improvements :

- The project card is scaling up when pressing. I assume the user in a rush wants to make sure fast is pressing the button.
- Product list is refreshable with pull to refresh.
- The order list is refreshable with pull to refresh.
- The order list is using a dynamic number of columns depending on the screen width.
- You can copy the order id by pressing the share button.
- The orientation is handled properly.
- You can remove a product from the basket by pressing the product.

With time and real design, we could focus on modern stack like : reanimated/skia thqt would improve the feeling of the app.

### Sixth task - Offline Order Creation

Reading the task, I did not understand the feature : stacking orders or having one offline order pending.
I started to make a stack of offline orders and it went too far because bigger flows came to my mind.
Then, in the purpose of the test and the limited time, I decided to keep it simple : one order pending.

The `useOrder` hook is a wrapper around the `useMutation` hook from `react-query`.
It handles the creation of the order and the retry of the offline orders.

The `use-order.ts` file contains the logic for the offline orders.
It uses the `AsyncStorage` library to store the orders in the device.

The `offline.ts` file contains the logic for the offline storage.

So, createOrder is a wrapper that checks if the user is connected to the internet.
If he is, it calls the `mutateAsync` function from `react-query` to create the order.
If not, it creates the offline order and sets the order to offline.

Then, the `retry` function is called when the user is connected to the internet.

## What's next ?

As a technical test, you can't go further than this.
I've focused on abstrations but still by getting straight to the needed features. 
Most of the features are splitted into hooks, libs and components to make it easier to understand.

But as far we could go, an app needs to be more complex.
Here, what I would do in case of a real app (from MVP to a real production app) :

- Fully synchronising the API client (from OpenAPI convention, we have a lot of tools to help us),
- Notifications systems (a small toast wrapper to make it simpler),
- Internationalization (from i18next to linguiJS, we can choose),
- Design system (NativeWind, react-native-unityles) (I have a preference for unityles),
- Storage : I would go for MMKV instead of AsyncStorage,
- Switch from Expo Go to a continuous native project (see: https://docs.expo.dev/develop/development-builds/introduction/),
- From nodeJS to Bun (I have a preference for Bun and its rapidity).
- Keep continuing with Expo,
- Keep continuing with Expo Router

## Conclusion

In the case of the technical test, we were able to cover most of the usecase for mobile development.
I'll be happy to talk about the test results and the next steps.

Erwan
