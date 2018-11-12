import React, { Component } from "react";
import {
	View,
	Text,
	ActivityIndicator,
	ScrollView,
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
	List,
	ListItem,
	Icon
} from "native-base";
import {
	widthPercentageToDP as wp,
	heightPercentageToDP as hp,
	listenOrientationChange as loc,
	removeOrientationListener as rol
} from "react-native-responsive-screen";
import { connect } from "react-redux";
import FontAwesome from "react-native-vector-icons/FontAwesome5";
import AwesomeAlert from "react-native-awesome-alerts";
import CachedImage from "react-native-image-cache-wrapper";
import GridView from "react-native-super-grid";
import { scale, moderateScale } from "react-native-size-matters";
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
		this.scroller.scrollTo({ x: 0, y: 0 });
	};


	navigateToProducts = (navigate, id, name) => {
		this.props.onNavigateToProducts(navigate, id, name)
	}

	toggleCategoriesList = () => {
		this.setState({
			showCategoriesList: !this.state.showCategoriesList
		});
	};

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
								this.setState({ showCategoriesList: false, currentPage: 1, pageLowerLimit: 0 });
								this.navigateToProducts(
									navigation.navigate,
									category.id,
									category.name
								);
								this.scrollToTop()
							}}
						>
							<Left>
								<Icon name="arrow-back" />
							</Left>
							<Right style={styles.catListListItemRight}>
								<Text style={styles.catListListItemText}>{category.name}</Text>
								<CachedImage
									style={styles.catListProductImg}
									source={{ uri: category.image.src }}
									activityIndicator={
										<ActivityIndicator size="small" color="#968037" />
									}
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
			categoryProducts,
			productsPerPage,
			orientation,
			deviceWidth,
			showAddtoCartBtn,
			onAddToCart,
			loading
		} = this.props;
		const { pageLowerLimit, showCategoriesList } = this.state;

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
					<Text style={styles.taxNotification}>الاسعار شاملة الضريبة</Text>
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
							<Card transparent key={item.id} style={{ height: "100%", alignItems: "flex-end" }}>
								<CardItem style={styles.cardItemContainer}>
									<CachedImage
										source={{ uri: item.images[0].src }}
										style={styles.productImg}
										activityIndicator={
											<ActivityIndicator size="small" color="#968037" />
										}
									/>
								</CardItem>
								<CardItem>
									<Text style={styles.productName}>{item.name}</Text>
								</CardItem>
								{item.dimensions.height ? (
									<CardItem style={styles.caloriesCardItem}>
										<Text style={styles.caloriesText}>
											عدد السعرات الحرارية: {item.dimensions.height}
										</Text>
									</CardItem>
								) : null}
								<CardItem>
									<Left>
										{showAddtoCartBtn ? (
											<TouchableOpacity onPress={() => onAddToCart(item)}>
												<FontAwesome
													theme={{ iconFamily: "FontAwesome5" }}
													name="plus-circle"
													style={styles.addToCartIcon}
												/>
											</TouchableOpacity>
										) : null}
									</Left>
									<Right>
										<Text
											style={{
												fontSize:
													orientation === "portrate" ? scale(12) : scale(14),
												fontWeight: "900",
												color: "#968037"
											}}
										>
											{roundTo.down(item.price * 1.05, 2)} ر.س
										</Text>
									</Right>
								</CardItem>
							</Card>
						)}
					/>
					{this.renderPagination()}
					<Text style={styles.noteText}>يحتاج البالغون الى 2000 سعرة حرارية في المتوسط يوميا, وقد تختلف الاحتياجات الفردية من السعرات الحرارية من شخص لآخر. إن القيم الغذائية الموضحة مبنية على المعدلات الوسطية وعلى التركيب النموذجي المعتمد للمنتجات وقد تتفاوت أحجام الوجبات والقيم الغذائية الفعلية كما تخضع المكونات للتغيرات الموسمية ولعوامل أخرى. القيم الغذائية وأحجام الوجبات المعلنة لا تنطبق على طلبات العملاء المعدّلة. البيانات التغذوية الإضافية متاحة عند الطلب.</Text>
				</ScrollView>
			);
		} else {
			return (
				<View style={styles.activityIndicatorContainer}>
					<ActivityIndicator
						size="large"
						color="#968037"
						style={{ display: loading === true ? "flex" : "none" }}
					/>
				</View>
			);
		}
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

	renderPagination = () => {
		let pagination = [];
		let { categoryProducts, productsPerPage } = this.props;
		let noOfPages = Math.ceil(categoryProducts.length / productsPerPage);
		for (let i = 1; i <= noOfPages; i++) {
			if (noOfPages == 1) {
				return <View style={{ marginBottom: scale(30) }} />;
			}
			if (i === this.state.currentPage) {
				pagination.push(
					<Button
						style={styles.activePageBtn}
						key={i}
						disabled
						onPress={() => this.handlePageClick(i)}
					>
						<Text style={styles.activePageBtnText}>{i}</Text>
					</Button>
				);
			} else {
				pagination.push(
					<TouchableOpacity key={i}>
						<Button
							style={styles.pageBtn}
							key={i}
							active={this.state.currentPage === i}
							bordered
							warning
							onPress={() => this.handlePageClick(i)}
						>
							<Text style={styles.pageBtnText}>{i}</Text>
						</Button>
					</TouchableOpacity>
				);
			}
		}
		return (
			<View
				style={{
					flex: 1,
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "center",
					marginTop: wp("3%"),
					marginBottom: scale(50),
					flexWrap: "wrap",
					paddingHorizontal: wp("1.5%"),
					backgroundColor: "white",
					display: this.state.showCategoriesList ? "none" : "flex"
				}}
			>
				{pagination}
			</View>
		);
	};

	render() {
		const {
			currentCategoryName,
			navigation,
			orientation,
			showErrorAlert,
			errMsg,
			onHideErrorMessage
		} = this.props;
		return (
			<View
				style={{
					backgroundColor: "white",
					flex: 1
				}}
			>
				<Header style={styles.header} androidStatusBarColor="#968037">
					<Left style={styles.headerLeft}>
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
					</Left>
					<Body style={styles.headerBody}>
						<Title
							style={{
								fontWeight: "bold",
								fontSize: orientation === "portrate" ? scale(14) : scale(16),
								color: "#E6E2D5"
							}}
						>
							{currentCategoryName}
						</Title>
					</Body>
					<Right style={styles.headerRight}>
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
					</Right>
				</Header>
				{this.renderContent()}
				{this.renderCategoriesList()}
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
	catListListItemRight: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "flex-end",
		alignItems: "center"
	},
	catListListItemText: {
		fontSize: scale(12),
		fontWeight: "bold",
		marginRight: scale(10)
	},
	catListProductImg: {
		width: wp("10%"),
		height: wp("10%"),
		borderRadius: 5
	},
	taxNotification: {
		fontSize: scale(10),
		textAlign: "center",
		marginVertical: scale(10)
	},
	gridViewContentContainer: {
		alignItems: "flex-end",
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
		textAlign: "right",
		flex: 1,
		height: scale(30)
	},
	caloriesCardItem: {
		flexDirection: "row",
		flex: 1,
		justifyContent: "flex-end"
	},
	caloriesText: {
		fontSize: scale(10),
		fontWeight: "bold",
		color: "#898989",
		textAlign: "right"
	},
	addToCartIcon: {
		marginLeft: wp("1.5%"),
		fontSize: scale(20),
		color: "#715C31"
	},
	activityIndicatorContainer: {
		position: "absolute",
		top: hp("50%"),
		left: wp("50%")
	},
	activePageBtn: {
		padding: 10,
		backgroundColor: "#968037"
	},
	activePageBtnText: {
		color: "#E6E2D5"
	},
	pageBtn: {
		backgroundColor: "white",
		padding: 10,
		borderColor: "#968037"
	},
	pageBtnText: {
		color: "#444444"
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
	},
	noteText: {
		paddingHorizontal: scale(10),
		paddingBottom: scale(10),
		textAlign: 'center'
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
		showAddtoCartBtn
	} = state);
};

const mapDispatchToProps = dispatch => {
	return {
		onAddToCart: item => dispatch({ type: "ADD_TO_CART", payload: item }),
		onHideErrorMessage: () => dispatch({ type: "HIDE_ERROR_ALERT" }),
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
