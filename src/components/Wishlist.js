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
import CategoriesScrollView from "./Shared/CategoriesScrollView";
import CatergoriesList from "./Shared/CategoriesList";
import FontAwesome from "react-native-vector-icons/FontAwesome5";
import Header from "./Shared/Header";
import { connect } from "react-redux";
import roundTo from "round-to";
import { scale } from "react-native-size-matters";

class Products extends Component {
	static navigationOptions = {
		drawerLabel: "المفضلة",
		drawerIcon: ({ tintColor }) => (
			<FontAwesome
				theme={{ iconFamily: "FontAwesome" }}
				name="star"
				style={{ color: tintColor, fontSize: wp("3%"), marginRight: -20 }}
			/>
		)
	};
	constructor(props) {
		super(props);
		this.state = {
			showCategoriesList: false
		};
	}

	componentDidMount() {
		loc(this);
	}

	componentWillUnmount() {
		rol();
	}

	toggleCategoriesList = () => {
		this.setState({
			showCategoriesList: !this.state.showCategoriesList
		});
	};

	onSelectCategoryFromList = () => {
		this.setState({
			showCategoriesList: false,
			currentPage: 1,
			pageLowerLimit: 0
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
		const { showCategoriesList } = this.state;
		if (cart.length) {
			let cartArr = [];
			cart.forEach(el => {
				cartArr.push(
					<Card key={el.id}>
						<CardItem style={styles.productCardItem}>
							<Left>
								{el.itemObj.images[0].src ? (
									<CachedImage
										style={styles.productImg}
										source={{ uri: el.itemObj.images[0].src }}
										activityIndicator={
											<ActivityIndicator size="small" color={color} />
										}
									/>
								) : null}
							</Left>
							<Right style={styles.productCardItemRight}>
								<Text
									style={{
										fontSize:
											orientation === "portrate" ? scale(14) : scale(16),
										fontWeight: "bold"
									}}
								>
									{el.itemObj.name}
								</Text>
								<Text
									style={{
										fontSize:
											orientation === "portrate" ? scale(14) : scale(16),
										fontWeight: "bold",
										color
									}}
								>
									{el.itemObj.price} ر.س
								</Text>
							</Right>
						</CardItem>
						<CardItem
							style={[styles.productPriceCardItem, { borderTopColor: color }]}
						>
							<Left
								style={{ flexDirection: "row", justifyContent: "flex-start" }}
							>
								<Text
									style={{
										fontSize: orientation === "portrate" ? scale(12) : scale(14)
									}}
								>
									{" "}
									ر.س
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
									المجموع:{" "}
								</Text>
							</Left>
							<View
								style={{ flexDirection: "row", justifyContent: "flex-end" }}
							>
								<View style={styles.quantityControlsContainer}>
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
								<Text
									style={{
										fontSize: orientation === "portrate" ? scale(12) : scale(14)
									}}
								>
									الكمية:
								</Text>
							</View>
						</CardItem>
					</Card>
				);
			});
			return (
				<ScrollView style={{ display: showCategoriesList ? "none" : "flex" }}>
					{cartArr}
					<Card>
						{+service > 0 ? (
							<CardItem>
								<Left>
									<Text
										style={{
											fontWeight: "bold",
											fontSize:
												orientation === "portrate" ? scale(12) : scale(14),
											color
										}}
									>
										خدمة : {+service} ر.س
									</Text>
								</Left>
							</CardItem>
						) : null}
						<CardItem>
							<Left>
								<Text
									style={{
										fontWeight: "bold",
										fontSize:
											orientation === "portrate" ? scale(12) : scale(14),
										color
									}}
								>
									السعر الاجمالي:{" "}
									{+service > 0
										? totalPrice + +service * totalPrice
										: totalPrice}{" "}
									ر.س
								</Text>
							</Left>
						</CardItem>
					</Card>
					<View style={styles.emptyCartContainer}>
						<Button
							danger
							rounded
							style={styles.emptyCartBtn}
							onPress={onEmptyCart}
						>
							<Text>تفريغ المفضلة</Text>
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
						marginRight: wp("1%"),
						display: this.state.showCategoriesList ? "none" : "flex"
					}}
				>
					لم تقم بإضافة اي منتج الى المفضلة
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
					title="المفضلة"
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
	productCardItem: {
		flex: 1,
		justifyContent: "center"
	},
	productImg: {
		width: wp("15%"),
		height: wp("15%"),
		borderRadius: 5
	},
	productCardItemRight: {
		minWidth: wp("70%"),
		maxWidth: wp("70%")
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
		marginRight: 5,
		marginLeft: 25
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
	},
	catListListIToggle: {
		backgroundColor: "#444444",
		display: "flex",
		alignItems: "center",
		justifyContent: "center"
	}
});

const mapStateToProps = state => {
	return ({
		categories,
		cart,
		totalPrice,
		orientation,
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
