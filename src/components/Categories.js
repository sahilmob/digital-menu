import {
	ActivityIndicator,
	Dimensions,
	StyleSheet,
	Text,
	TouchableOpacity,
	View
} from "react-native";
import { Body, Card, CardItem } from "native-base";
import React, { Component } from "react";
import { checkStore, refreshCategories } from "../store/actions";
import {
	heightPercentageToDP as hp,
	listenOrientationChange as loc,
	removeOrientationListener as rol,
	widthPercentageToDP as wp
} from "react-native-responsive-screen";
import { moderateScale, scale } from "react-native-size-matters";

import CachedImage from "react-native-image-cache-wrapper";
import FontAwesome from "react-native-vector-icons/FontAwesome5";
import GridView from "react-native-super-grid";
import Header from "./Shared/Header";
import { connect } from "react-redux";

class Categories extends Component {
	static navigationOptions = {
		drawerIcon: ({ tintColor }) => (
			<FontAwesome
				theme={{ iconFamily: "FontAwesome" }}
				name="th-large"
				style={{ color: tintColor, fontSize: wp("3%"), marginRight: -20 }}
			/>
		),
		drawerLabel: "الأقسام"
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
			onNavigateToProducts,
			resturantData: {
				acf: { color }
			}
		} = this.props;
		if (categories.length) {
			return (
				<GridView
					style={styles.gridView}
					contentContainerStyle={{ alignItems: "flex-end" }}
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
								onNavigateToProducts(navigate, item.id, item.name);
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
													<ActivityIndicator size="small" color={color} />
												}
											/>
										</Body>
									</CardItem>
								) : null}
								<CardItem style={styles.catNameCardItem}>
									<Text style={styles.catName}>{item.name}</Text>
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
						color={color}
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
		const { navigation, refreshing, onRefreshCategories } = this.props;
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
				<Header navigation={navigation} title="الأقسام" />
				{this.renderContent()}
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
		color: "#444444"
	},
	activityIndicatorContainer: {
		position: "absolute",
		top: hp("-10%"),
		left: wp("50%")
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
		resturantData: {
			acf: { color }
		}
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
