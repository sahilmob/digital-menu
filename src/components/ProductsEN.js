import {
	ActivityIndicator,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View
} from "react-native";
import { Card, CardItem, Left, Right } from "native-base";
import React, { Component } from "react";
import {
	heightPercentageToDP as hp,
	listenOrientationChange as loc,
	removeOrientationListener as rol,
	widthPercentageToDP as wp
} from "react-native-responsive-screen";
import { moderateScale, scale } from "react-native-size-matters";

import CachedImage from "react-native-image-cache-wrapper";
import CategoriesScrollView from "./Shared/CategoriesScrollViewEN";
import CatergoriesList from "./Shared/CategoriesListEn";
import FontAwesome from "react-native-vector-icons/FontAwesome5";
import GridView from "react-native-super-grid";
import Header from "./Shared/HeaderEn";
import Pagenation from "./Shared/Pagenation";
import { connect } from "react-redux";
import roundTo from "round-to";

class Products extends Component {
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

	scrollToTop = () => {
		this.scroller && this.scroller.scrollTo({ x: 0, y: 0 });
	};

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

	handlePageClick = pageNumber => {
		const { productsPerPage } = this.props;
		let pageLowerLimit = pageNumber * productsPerPage - productsPerPage;
		let pageUpperLimit = pageNumber * productsPerPage - 1;
		this.setState({
			currentPage: pageNumber,
			pageLowerLimit,
			pageUpperLimit
		});
		this.scrollToTop();
	};

	renderContent = () => {
		const {
			categoryProducts,
			productsPerPage,
			orientation,
			deviceWidth,
			showAddtoCartBtn,
			onAddToCart,
			loading,
			resturantData: {
				acf: { color, Tax_Note_Eng, Note_Eng, currency_eng, tax }
			}
		} = this.props;
		const regex = /(<([^>]+)>)/gi;

		const { pageLowerLimit, showCategoriesList, currentPage } = this.state;

		if (categoryProducts.length) {
			const productsArr = [];
			const range = productsPerPage - 1;
			for (let i = pageLowerLimit; i <= pageLowerLimit + range; i++) {
				if (categoryProducts[i]) {
					productsArr.push(categoryProducts[i]);
				}
			}
			return (
				<ScrollView
					ref={scroller => {
						this.scroller = scroller;
					}}
					style={{ display: showCategoriesList ? "none" : "flex" }}
				>
					<Text style={styles.taxNotification}>{Tax_Note_Eng}</Text>
					<GridView
						contentContainerStyle={styles.gridViewContentContainer}
						items={productsArr}
						itemDimension={orientation === "portrate" ? scale(125) : scale(150)}
						itemContainerStyle={{
							height:
								orientation === "portrate"
									? deviceWidth > 400
										? moderateScale(290, 0.7)
										: deviceWidth < 300
										? moderateScale(300, 0.7)
										: moderateScale(280, 0.7)
									: deviceWidth > 400
									? moderateScale(280, 0.6)
									: moderateScale(350, 0.7),
							marginBottom: scale(15)
						}}
						renderItem={item => (
							<Card transparent key={item.id} style={{ height: "100%" }}>
								<CardItem style={styles.cardItemContainer}>
									{item.images[0].src ? (
										<CachedImage
											source={{ uri: item.images[0].src }}
											style={styles.productImg}
											activityIndicator={
												<ActivityIndicator size="small" color={color} />
											}
										/>
									) : null}
								</CardItem>
								<CardItem>
									<Text style={styles.productName}>
										{item.short_description.replace(regex, "")}
									</Text>
								</CardItem>
								<CardItem style={styles.caloriesCardItem}>
									<Text style={styles.caloriesText}>
										{item.meta_data.map(m => {
											if (m.key === "wccaf_cal") {
												return m.value && `Calories: ${m.value}`;
											}
										})}
									</Text>
									<Text style={styles.caloriesText}>
										{item.meta_data.map(m => {
											if (m.key === "wccaf_per") {
												if (m.value === "1") {
													return " / Piece";
												} else if (m.value === "2") {
													return " / 100 gram";
												}
											}
										})}
									</Text>
								</CardItem>
								<CardItem>
									<Left>
										<Text
											style={{
												fontSize:
													orientation === "portrate" ? scale(12) : scale(14),
												fontWeight: "900",
												color: color
											}}
										>
											{+roundTo.down(item.price * +tax, 2) + +item.price}{" "}
											{currency_eng}
										</Text>
									</Left>
									<Right>
										{showAddtoCartBtn ? (
											<TouchableOpacity onPress={() => onAddToCart(item)}>
												<FontAwesome
													theme={{ iconFamily: "FontAwesome5" }}
													name="plus-circle"
													style={[styles.addToCartIcon, { color }]}
												/>
											</TouchableOpacity>
										) : null}
									</Right>
								</CardItem>
							</Card>
						)}
					/>
					<Pagenation
						currentPage={currentPage}
						showCategoriesList={showCategoriesList}
						handlePageClick={this.handlePageClick}
					/>
					<Text style={styles.noteText}>{Note_Eng}</Text>
				</ScrollView>
			);
		} else {
			return (
				<View style={styles.activityIndicatorContainer}>
					<ActivityIndicator
						size="large"
						color={color}
						style={{ display: loading === true ? "flex" : "none" }}
					/>
				</View>
			);
		}
	};

	render() {
		const { navigation, currentCategoryName } = this.props;
		return (
			<View
				style={{
					backgroundColor: "white",
					flex: 1
				}}
			>
				<Header
					navigation={navigation}
					toggleCategoriesList={this.toggleCategoriesList}
					title={currentCategoryName}
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
	taxNotification: {
		fontSize: scale(10),
		textAlign: "center",
		marginVertical: scale(10)
	},
	gridViewContentContainer: {
		backgroundColor: "white"
	},
	cardItemContainer: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center"
	},
	productImg: {
		width: scale(140),
		height: scale(140),
		borderRadius: 5
	},
	productName: {
		fontSize: scale(12),
		fontWeight: "bold",
		color: "#444444",
		textAlign: "left",
		flex: 1,
		height: scale(30)
	},
	caloriesCardItem: {
		flexDirection: "row",
		flex: 1,
		width: "100%"
	},
	caloriesText: {
		fontSize: scale(10),
		fontWeight: "bold",
		color: "#898989"
	},
	addToCartIcon: {
		marginLeft: wp("1.5%"),
		fontSize: scale(20)
	},
	activityIndicatorContainer: {
		position: "absolute",
		top: hp("50%"),
		left: wp("50%")
	},
	noteText: {
		paddingHorizontal: scale(10),
		paddingBottom: scale(35),
		textAlign: "center"
	}
});

const mapStateToProps = state => {
	return ({
		categories,
		categoryProducts,
		currentCategoryId,
		showErrorAlert,
		errMsg,
		orientation,
		deviceWidth,
		deviceHeight,
		currentCategoryName,
		productsPerPage,
		showAddtoCartBtn,
		resturantData
	} = state);
};

const mapDispatchToProps = dispatch => {
	return {
		onAddToCart: item => dispatch({ type: "ADD_TO_CART", payload: item }),
		onHideErrorMessage: () => dispatch({ type: "HIDE_ERROR_ALERT" })
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Products);
