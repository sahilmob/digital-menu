import {
	Dimensions,
	Image,
	SafeAreaView,
	ScrollView,
	Text,
	TouchableOpacity,
	View
} from "react-native";
import { DrawerItems, createDrawerNavigator } from "react-navigation";
import { scale, verticalScale } from "react-native-size-matters";

import Categories from "./Categories";
import FontAwesome from "react-native-vector-icons/FontAwesome5";
import Products from "./Products";
import React from "react";
import Wishlist from "./Wishlist";
import { connect } from "react-redux";

Main = props => {
	const {
		onSetLanguage,
		resturantData: {
			acf: { color, logo }
		}
	} = props;
	const CustomDrawerComponent = drawerProps => {
		let orientation = null;
		let { width, height } = Dimensions.get("window");
		if (width > height) {
			orientation = "landscape";
		} else {
			orientation = "portrate";
		}
		return (
			<SafeAreaView style={{ backgroundColor: "white" }}>
				<ScrollView
					contentContainerStyle={{
						justifyContent: "space-between",
						alignItems: "stretch"
					}}
				>
					<View style={{ alignItems: "center", marginBottom: scale(10) }}>
						<Image
							source={{ uri: logo }}
							style={{ height: scale(50), width: scale(50) }}
						/>
					</View>
					<DrawerItems {...drawerProps} />
					{/* <TouchableOpacity
						style={{ justifyContent: "flex-end", flexDirection: "row" }}
						onPress={() => {
							props.onSetLanguage();
							setTimeout(RNRestart.Restart, 1);
						}}
					>
						<Text>Switch Language to English</Text>
						<FontAwesome
							theme={{ iconFamily: "FontAwesome" }}
							name="language"
							style={{
								color: drawerProps.activeTintColor,
								fontSize: scale(16),
								marginRight: scale(30),
								marginLeft: scale(10)
							}}
						/>
					</TouchableOpacity> */}
				</ScrollView>
			</SafeAreaView>
		);
	};

	const Navigation = createDrawerNavigator(
		{
			Categories: {
				screen: Categories
			},
			Wishlist: {
				screen: Wishlist
			},
			Products: {
				screen: Products,
				navigationOptions: {
					drawerLabel: () => null
				}
			}
		},
		{
			drawerPosition: "right",
			contentComponent: CustomDrawerComponent,
			contentOptions: {
				activeTintColor: color,
				itemStyle: {
					flex: 1,
					flexDirection: "row-reverse",
					marginLeft: 30
				},
				labelStyle: {
					fontSize: scale(12)
				}
			}
		}
	);
	return <Navigation />;
};

const mapStateToProps = state => {
	return {
		resturantData: state.resturantData
	};
};

const mapDispatchToProps = dispatch => {
	return {
		onSetLanguage: () => {
			dispatch({ type: "SET_LANGUAGE", lang: "en" });
		}
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Main);
