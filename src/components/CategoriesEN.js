import React, { Component } from "react";
import {
	View,
	Text,
	ActivityIndicator,
	Dimensions,
	TouchableOpacity,
	StyleSheet
} from "react-native";
import { Card, Body, CardItem } from "native-base";
import {
	widthPercentageToDP as wp,
	heightPercentageToDP as hp,
	listenOrientationChange as loc,
	removeOrientationListener as rol
} from "react-native-responsive-screen";
import { connect } from "react-redux";
import { checkStore, refreshCategories } from "../store/actions";
import CachedImage from "react-native-image-cache-wrapper";
import FontAwesome from "react-native-vector-icons/FontAwesome5";
import GridView from "react-native-super-grid";
import AwesomeAlert from "react-native-awesome-alerts";
import { scale, moderateScale } from "react-native-size-matters";

import Header from "./Shared/HeaderEn";

class Categories extends Component {
	static navigationOptions = {
		drawerIcon: ({ tintColor }) => (
			<FontAwesome
				theme={{ iconFamily: "FontAwesome" }}
				name="th-large"
				style={{ color: tintColor, fontSize: wp("3%"), marginRight: -20 }}
			/>
		),
		drawerLabel: "Categories"
	};

	componentDidMount() {
		loc(this);
		this.props.onCheckStore();
	}

	componentWillUnmount() {
		rol();
	}

	renderContent = () => {
		const {
			navigation: { navigate },
			loading,
			refreshing,
			onRefreshCategories,
			orientation,
			deviceWidth,
			categories,
			onNavigateToProducts
		} = this.props;
		if (categories.length) {
			return (
				<GridView
					style={styles.gridView}
					refreshing={refreshing}
					onRefresh={onRefreshCategories}
					itemDimension={orientation === "portrate" ? scale(100) : scale(120)}
					itemContainerStyle={{
						height:
							orientation === "portrate"
								? deviceWidth > 400
									? moderateScale(170, 0.6)
									: moderateScale(150, 0.7)
								: deviceWidth > 400
								? moderateScale(160, 0.6)
								: moderateScale(160, 0.7),
						marginBottom: scale(15)
					}}
					items={categories}
					renderItem={item => (
						<TouchableOpacity
							onPress={() => {
								onNavigateToProducts(
									navigate,
									item.id,
									selectedLanguage === "en" ? item.description : item.name
								);
							}}
						>
							<Card transparent>
								{item.image ? (
									<CardItem>
										<Body style={styles.cardItemBody}>
											<CachedImage
												style={styles.cardItemImage}
												source={{ uri: item.image.src }}
												activityIndicator={
													<ActivityIndicator size="small" color="#968037" />
												}
											/>
										</Body>
									</CardItem>
								) : null}
								<CardItem style={styles.catNameCardItem}>
									<Text style={styles.catName}>{item.description}</Text>
								</CardItem>
							</Card>
						</TouchableOpacity>
					)}
				/>
			);
		} else {
			return (
				<View style={styles.activityIndicatorContainer}>
					<ActivityIndicator
						size="large"
						color="#968037"
						style={{
							display: loading === true ? "flex" : "none",
							zIndex: 1000,
							top: hp("50%")
						}}
					/>
				</View>
			);
		}
	};

	render() {
		const {
			navigation,
			refreshing,
			onRefreshCategories,
			onHideErrorMessage,
			showErrorAlert,
			errMsg,
			resturantData: {
				acf: { color }
			}
		} = this.props;
		return (
			<View
				refreshing={refreshing}
				onRefresh={onRefreshCategories}
				style={{
					width: wp("100%"),
					maxHeight: Dimensions.get("window").height,
					flex: 1
				}}
			>
				<Header navigation={navigation} title="Categories" />

				{this.renderContent()}
				<AwesomeAlert
					show={showErrorAlert}
					showProgress={false}
					title="تنبيه"
					message={errMsg}
					closeOnTouchOutside={true}
					closeOnHardwareBackPress={false}
					showCancelButton={true}
					showConfirmButton={false}
					cancelText="إخفاء"
					cancelButtonColor="red"
					onCancelPressed={() => {
						onHideErrorMessage();
					}}
				/>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	gridView: {
		marginTop: scale(10),
		backgroundColor: "white"
	},
	cardItemBody: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		width: wp("90%")
	},
	cardItemImage: {
		width: scale(100),
		height: scale(100),
		borderRadius: 5
	},
	catNameCardItem: {
		flex: 1,
		justifyContent: "center",
		marginBottom: hp("2%"),
		marginTop: hp("1.5%")
	},
	catName: {
		fontSize: scale(12),
		fontWeight: "bold",
		textAlign: "center",
		color: "#444444",
		textTransform: "capitalize"
	},
	activityIndicatorContainer: {
		position: "absolute",
		top: hp("-10%"),
		left: wp("50%")
	},
	header: {
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center"
	},
	headerLeft: {
		flexGrow: 1,
		marginLeft: wp("2%")
	},
	headerRight: {
		marginRight: wp("2%")
	},
	menuBtn: {
		backgroundColor: "#444444",
		display: "flex",
		alignItems: "center",
		justifyContent: "center"
	}
});

const mapStateToProps = state => {
	return ({
		categories,
		loading,
		refreshing,
		showErrorAlert,
		errMsg,
		orientation,
		deviceWidth,
		deviceHeight,
		selectedLanguage,
		resturantData
	} = state);
};

const mapDispatchToProps = dispatch => {
	return {
		onCheckStore: () => dispatch(checkStore()),
		onHideErrorMessage: () => dispatch({ type: "HIDE_ERROR_ALERT" }),
		onRefreshCategories: () => dispatch(refreshCategories()),
		onNavigateToProducts: (navigate, categoryId, categoryName) =>
			dispatch({
				type: "GET_PRODUCTS_BY_CAT_ID",
				navigate,
				categoryId,
				categoryName
			})
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Categories);
