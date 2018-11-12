import React, { Component } from "react";
import {
	Text,
	ScrollView,
	ActivityIndicator,
	TouchableOpacity,
	StyleSheet
} from "react-native";
import {
	Header,
	Left,
	Card,
	Body,
	Title,
	CardItem,
	Right,
	Button,
	View,
	ListItem,
	List
} from "native-base";
import { connect } from "react-redux";
import {
	widthPercentageToDP as wp,
	listenOrientationChange as loc,
	removeOrientationListener as rol
} from "react-native-responsive-screen";
import FontAwesome from "react-native-vector-icons/FontAwesome5";
import CachedImage from "react-native-image-cache-wrapper";
import { scale } from "react-native-size-matters";
import roundTo from "round-to";

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

	navigateToProducts = (navigate, id, name) => {
		this.props.onNavigateToProducts(navigate, id, name)
	}

	renderCategoriesList = () => {
		const { categories, navigation } = this.props;
		const { showCategoriesList } = this.state;
		return (
			<List
				style={{
					display: showCategoriesList ? "flex" : "none",
					backgroundColor: "white"
				}}
				dataArray={categories}
				renderRow={category => (
					<TouchableOpacity>
						<ListItem
							onPress={() => {
								this.setState({ showCategoriesList: false, currentPage: 1 });
								this.navigateToProducts(
									navigation.navigate,
									category.id,
									category.slug
								)
							}}
						>
							<Left style={styles.catListListItemLeft}>
								<CachedImage
									style={styles.catListProductImg}
									source={{ uri: category.image.src }}
									activityIndicator={
										<ActivityIndicator size="small" color="#968037" />
									}
								/>
								<Text style={styles.catListListItemText}>{category.slug}</Text>
							</Left>
							<Right>
								<FontAwesome
									theme={{ iconFamily: "FontAwesome5" }}
									name="arrow-right"
								/>
							</Right>
						</ListItem>
					</TouchableOpacity>
				)}
			/>
		);
	};

	renderContent = () => {
		const {
			cart,
			orientation,
			onRemoveFromCart,
			onAddToCart,
			totalPrice,
			onEmptyCart
		} = this.props;
		const regex = /(<([^>]+)>)/ig
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
										fontSize:
											orientation === "portrate" ? scale(12) : scale(14)
									}}
								>
									{el.itemObj.short_description.replace(regex, "")}
								</Text>
								<Text
									style={{
										fontSize:
											orientation === "portrate" ? scale(14) : scale(16),
										fontWeight: "bold",
										color: "#968037"
									}}
								>
									{el.itemObj.price} S.R
								</Text>
							</Left>
							<Right>
								<CachedImage
									style={styles.productImg}
									source={{ uri: el.itemObj.images[0].src }}
									activityIndicator={
										<ActivityIndicator size="small" color="#968037" />
									}
								/>
							</Right>

						</CardItem>
						<CardItem style={styles.productPriceCardItem}>

							<View
								style={{ flexDirection: "row", justifyContent: "flex-end" }}
							>

								<View style={styles.quantityCotrolsContainer}>
									<Text
										style={{
											fontSize: orientation === "portrate" ? scale(12) : scale(14)
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
							<Left
								style={styles.subTotalPriceContainer}
							>
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
						<CardItem style={styles.totalPriceContainer}>
							<Right>
								<Text
									style={{
										fontWeight: "bold",
										color: "#968037",
										fontSize: orientation === "portrate" ? scale(12) : scale(14)
									}}
								>
									Total Price {totalPrice} S.R
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
		const { navigation, orientation } = this.props;
		return (
			<View style={{ flex: 1 }}>
				<Header style={styles.header} androidStatusBarColor="#968037">
					<Left style={styles.headerLeft}>
						<Button
							style={styles.catListListIToggle}
							onPress={() => navigation.openDrawer()}
						>
							<FontAwesome
								theme={{ iconFamily: "FontAwesome" }}
								name="bars"
								style={{
									color: "#E6E2D5",
									fontSize: orientation === "portrate" ? wp("4%") : wp("2.5%"),
									paddingHorizontal: wp("1%"),
									paddingVertical: wp("1%")
								}}
							/>
						</Button>
					</Left>
					<Body style={styles.headerBody}>
						<Title
							style={{
								fontWeight: "bold",
								fontSize: orientation === "portrate" ? scale(14) : scale(16),
								color: "#E6E2D5"
							}}
						>
							Favorites
						</Title>
					</Body>
					<Right style={styles.headerRight}>
						<Button style={styles.menuBtn} onPress={this.toggleCategoriesList}>
							<FontAwesome
								theme={{ iconFamily: "FontAwesome" }}
								name="th-large"
								style={{
									color: "#E6E2D5",
									fontSize:
										orientation === "portrate" ? wp("3.5%") : wp("2.5%"),
									paddingHorizontal: wp("1%"),
									paddingVertical: wp("1%")
								}}
							/>
						</Button>
					</Right>
				</Header>
				{this.renderContent()}
				{this.renderCategoriesList()}
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
		borderTopColor: "#968037",
		borderTopWidth: 1
	},
	quantityCotrolsContainer: {
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
	},
	header: {
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		backgroundColor: "#968037"
	},
	headerLeft: {
		flexGrow: 1,
		marginLeft: wp("2%")
	},
	menuBtn: {
		backgroundColor: "#444444",
		display: "flex",
		alignItems: "center",
		justifyContent: "center"
	},
	headerBody: {
		flex: 1,
		alignItems: "center"
	},
	headerRight: {
		marginRight: wp("2%")
	},
	catListListIToggle: {
		backgroundColor: "#444444",
		display: "flex",
		alignItems: "center",
		justifyContent: "center"
	}
});

const mapStateToProps = state => {
	return {
		categories: state.categories,
		cart: state.cart,
		totalPrice: state.totalPrice,
		orientation: state.orientation,
		deviceWidth: state.deviceWidth,
		deviceHeight: state.deviceHeight
	};
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
