import {
	AppRegistry,
	AsyncStorage,
	ActivityIndicator,
	View
} from "react-native";
import App from "./App";
import { name as appName } from "./app.json";
import React from "react";
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose } from "redux";
import reducer from "./src/store/reducer";
import thunk from "redux-thunk";
import { persistStore, persistReducer } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";

const persistConfig = {
	key: "root",
	storage: AsyncStorage
};

renderLoading = () => {
	<View>
		<ActivityIndicator
			size="large"
			color="#f0ad4e"
			style={{
				top: hp("50%")
			}}
		/>
	</View>;
};

const persistedReducer = persistReducer(persistConfig, reducer);

let composeEnhancers = compose;

if (__DEV__) {
	composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
}
const store = createStore(
	persistedReducer,
	composeEnhancers(applyMiddleware(thunk))
);

const AppContainer = () => (
	<Provider store={store}>
		<PersistGate persistor={persistStore(store)} loading={this.renderLoading}>
			<App />
		</PersistGate>
	</Provider>
);

AppRegistry.registerComponent(appName, () => AppContainer);
