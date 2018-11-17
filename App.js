import React, { Component } from "react";
import { Dimensions } from "react-native";
import { createSwitchNavigator } from "react-navigation";
import { Root } from "native-base";
import {
	widthPercentageToDP as wp,
	heightPercentageToDP as hp,
	listenOrientationChange as loc,
	removeOrientationListener as rol
} from "react-native-responsive-screen";
import { connect } from "react-redux";
import Loading from "./src/components/Loading";
import SelectLang from "./src/components/SelectLang";
import MainEN from "./src/components/MainEN";
import Main from "./src/components/Main";
import AuthEN from "./src/components/AuthEn";
import Auth from "./src/components/Auth";
import SplashScreen from "react-native-splash-screen";

const AppNavigation = createSwitchNavigator({
	Loading: {
		screen: Loading
	},
	AuthEN: {
		screen: AuthEN
	},
	Auth: {
		screen: Auth
	},
	SelectLang: {
		screen: SelectLang
	},
	MainEN: {
		screen: MainEN
	},
	Main: {
		screen: Main
	}
});

class App extends Component {
	constructor(props) {
		super(props);
		Dimensions.addEventListener("change", dims => {
			this.layoutHandler();
		});
	}

	componentDidMount() {
		this.layoutHandler();
		loc(this);
		SplashScreen.hide();
	}

	componentWillUnmount() {
		rol();
	}

	layoutHandler = () => {
		let { width, height } = Dimensions.get("window");
		if (width > height) {
			this.props.onOrientationchange(width, height, "landscape");
		} else {
			this.props.onOrientationchange(width, height, "portrate");
		}
	};

	render() {
		return (
			<Root>
				<AppNavigation />
			</Root>
		);
	}
}

const mapDispatchToProps = dispatch => {
	return {
		onOrientationchange: (width, height, orientation) =>
			dispatch({
				type: "SET_DEVICE_DIMENSIONS",
				deviceWidth: width,
				deviceHeight: height,
				orientation
			})
	};
};

const mapStateToProps = state => {
	return {
		orientation: state.orientation,
		deviceHeight: state.deviceHeight
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(App);
