import {
	ActivityIndicator,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity
} from "react-native";
import { Button, Card, CardItem, Left, Right, View } from "native-base";
import React, { Component } from "react";
import {
	listenOrientationChange as loc,
	removeOrientationListener as rol,
	widthPercentageToDP as wp
} from "react-native-responsive-screen";

import CachedImage from "react-native-image-cache-wrapper";
import CategoriesScrollView from "./Shared/CategoriesScrollViewEN";
import CatergoriesList from "./Shared/CategoriesListEn";
import FontAwesome from "react-native-vector-icons/FontAwesome5";
import Header from "./Shared/HeaderEn";
import { connect } from "react-redux";
import roundTo from "round-to";
import { scale } from "react-native-size-matters";

class Products extends Component {
	static navigationOptions = {
		drawerLabel: "Favorites",
		drawerIcon: ({ tintColor }) => (
			<FontAwesome
				theme={{ iconFamily: "FontAwesome" }}
				name="star"
				style={{ color: tintColor, fontSize: wp("3%"), marginRight: -20 }}
			/>
		)
	};

	state = {
		currentPage: 1,
		pageLowerLimit: 0,
		showCategoriesList: false
	};

	componentDidMount() {
		loc(this);
	}

	componentWillUnmount() {
		rol();
	}
	onSelectCategoryFromList = () => {
		this.setState({
			showCategoriesList: false,
			currentPage: 1,
			pageLowerLimit: 0
		});
	};

	toggleCategoriesList = () => {
		this.setState({
			showCategoriesList: !this.state.showCategoriesList
		});
	};

	renderContent = () => {
		const {
			cart,
			orientation,
			onRemoveFromCart,
			onAddToCart,
			totalPrice,
			onEmptyCart,
			resturantData: {
				acf: { color, service }
			}
		} = this.props;
		const regex = /(<([^>]+)>)/gi;
		const { showCategoriesList } = this.state;
		if (cart.length) {
			let cartArr = [];
			cart.forEach(el => {
				cartArr.push(
					<Card key={el.id}>
						<CardItem style={styles.productCardItem}>
							<Left style={styles.productCardItemLeft}>
								<Text
									style={{
										fontSize: orientation === "portrate" ? scale(12) : scale(14)
									}}
								>
									{el.itemObj.short_description.replace(regex, "")}
								</Text>
								<Text
									style={{
										fontSize:
											orientation === "portrate" ? scale(14) : scale(16),
										fontWeight: "bold",
										color
									}}
								>
									{el.itemObj.price} S.R
								</Text>
							</Left>
							<Right>
								{el.itemObj.images[0].src ? (
									<CachedImage
										style={styles.productImg}
										source={{ uri: el.itemObj.images[0].src }}
										activityIndicator={
											<ActivityIndicator size="small" color={color} />
										}
									/>
								) : null}
							</Right>
						</CardItem>
						<CardItem
							style={[
								styles.productPriceCardItem,
								{
									borderTopColor: color
								}
							]}
						>
							<View
								style={{ flexDirection: "row", justifyContent: "flex-end" }}
							>
								<View style={styles.quantityControlsContainer}>
									<Text
										style={{
											fontSize:
												orientation === "portrate" ? scale(12) : scale(14)
										}}
									>
										Quantity:
									</Text>
									<TouchableOpacity
										onPress={() => onRemoveFromCart(el.itemObj)}
									>
										<FontAwesome
											theme={{ iconFamily: "FontAwesome" }}
											name="minus-circle"
											style={{
												color: "red",
												fontSize:
													orientation === "portrate" ? scale(14) : scale(16),
												marginHorizontal: scale(25)
											}}
										/>
									</TouchableOpacity>
									<Text
										style={{
											fontSize:
												orientation === "portrate" ? scale(12) : scale(14)
										}}
									>
										{el.count}
									</Text>
									<TouchableOpacity
										onPress={() => {
											onAddToCart(el.itemObj);
										}}
									>
										<FontAwesome
											theme={{ iconFamily: "FontAwesome" }}
											name="plus-circle"
											style={{
												color: "green",
												fontSize:
													orientation === "portrate" ? scale(14) : scale(16),
												marginHorizontal: scale(25)
											}}
										/>
									</TouchableOpacity>
								</View>
							</View>
							<Left style={styles.subTotalPriceContainer}>
								<Text
									style={{
										fontSize: orientation === "portrate" ? scale(12) : scale(14)
									}}
								>
									Sub Total:{" "}
								</Text>
								<Text
									style={{
										fontSize: orientation === "portrate" ? scale(12) : scale(14)
									}}
								>
									{roundTo.down(el.count * (el.itemObj.price * 1.05), 2)}
								</Text>
								<Text
									style={{
										fontSize: orientation === "portrate" ? scale(12) : scale(14)
									}}
								>
									{" "}
									S.R
								</Text>
							</Left>
						</CardItem>
					</Card>
				);
			});
			return (
				<ScrollView style={{ display: showCategoriesList ? "none" : "flex" }}>
					{cartArr}
					<Card>
						{+service > 0 ? (
							<CardItem style={styles.totalPriceContainer}>
								<Right>
									<Text
										style={{
											fontWeight: "bold",
											fontSize:
												orientation === "portrate" ? scale(12) : scale(14),
											color
										}}
									>
										Service : {+service} S.R
									</Text>
								</Right>
							</CardItem>
						) : null}
						<CardItem style={styles.totalPriceContainer}>
							<Right>
								<Text
									style={{
										fontWeight: "bold",
										fontSize:
											orientation === "portrate" ? scale(12) : scale(14),
										color
									}}
								>
									Total Price{" "}
									{+service > 0
										? totalPrice + +service * totalPrice
										: totalPrice}{" "}
									S.R
								</Text>
							</Right>
						</CardItem>
					</Card>
					<View style={styles.emptyCartContainer}>
						<Button
							danger
							rounded
							style={styles.emptyCartBtn}
							onPress={onEmptyCart}
						>
							<Text>Empty Favorites</Text>
						</Button>
					</View>
					<View style={styles.auxView} />
				</ScrollView>
			);
		} else {
			return (
				<Text
					style={{
						color: "#444444",
						fontSize: wp("4%"),
						marginTop: wp("1%"),
						marginLeft: wp("1%"),
						display: this.state.showCategoriesList ? "none" : "flex"
					}}
				>
					No items added to the favorites
				</Text>
			);
		}
	};

	render() {
		const { navigation } = this.props;
		return (
			<View style={{ flex: 1 }}>
				<Header
					navigation={navigation}
					toggleCategoriesList={this.toggleCategoriesList}
					title="Favorites"
				/>
				{this.renderContent()}
				{/* <CatergoriesList
					navigation={navigation}
					showCategoriesList={this.state.showCategoriesList}
					onSelectCategoryFromList={this.onSelectCategoryFromList}
				/> */}
				<CategoriesScrollView
					onSelectCategoryFromList={this.onSelectCategoryFromList}
					navigation={navigation}
				/>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	catListListItemLeft: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center"
	},
	catListListItemText: {
		fontSize: scale(12),
		fontWeight: "bold",
		marginLeft: scale(10)
	},
	catListProductImg: {
		width: wp("10%"),
		height: wp("10%"),
		borderRadius: 5
	},
	productCardItem: {
		flex: 1,
		justifyContent: "center"
	},
	productImg: {
		width: wp("15%"),
		height: wp("15%"),
		borderRadius: 5
	},
	productCardItemLeft: {
		minWidth: wp("60%"),
		maxWidth: wp("60%"),
		flexDirection: "column",
		alignItems: "flex-start"
	},
	productPriceCardItem: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "flex-end",
		borderTopWidth: 1
	},
	quantityControlsContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginRight: 25
	},
	subTotalPriceContainer: {
		flexDirection: "row",
		justifyContent: "flex-end"
	},
	totalPriceContainer: {
		justifyContent: "flex-end"
	},
	emptyCartContainer: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		marginVertical: 30
	},
	emptyCartBtn: {
		fontWeight: "bold",
		paddingHorizontal: 20
	},
	auxView: {
		marginBottom: scale(30)
	}
});

const mapStateToProps = state => {
	return ({
		categories,
		cart,
		totalPrice,
		deviceWidth,
		deviceHeight,
		resturantData
	} = state);
};

const mapDispatchToProps = dispatch => {
	return {
		onAddToCart: item => dispatch({ type: "ADD_TO_CART", payload: item }),
		onRemoveFromCart: item =>
			dispatch({ type: "REMOVE_FROM_CART", payload: item }),
		onEmptyCart: () => dispatch({ type: "EMPTY_CART" }),
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
)(Products);
