import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import {
	ListItem,
	Left,
	Right,
	Switch,
	Header,
	Body,
	Title,
	Button,
	Picker
} from "native-base";
import NumPicker from "./UI/NumPicker";
import { connect } from "react-redux";
import FontAwesome from "react-native-vector-icons/FontAwesome5";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { scale } from "react-native-size-matters";
import RNRestart from 'react-native-restart';

class Settings extends Component {
	handleIncrement = () => {
		const currenProductPerPage = this.props.productsPerPage;
		if (currenProductPerPage >= 18) {
			return;
		}

		this.props.onSetProductsPerPage(currenProductPerPage + 1);
	};
	handleDecrement = () => {
		const currenProductPerPage = this.props.productsPerPage;
		if (currenProductPerPage <= 6) {
			return;
		}
		this.props.onSetProductsPerPage(currenProductPerPage - 1);
	};

	onChangeLanguage = (lang) => {
		this.props.onSetLanguage(lang);
		setTimeout(RNRestart.Restart, 1);
	}

	render() {
		let {
			productsPerPage,
			showAddtoCartBtn,
			handleShowAddToCartBtnToggle,
			navigation,
			selectedLanguage
		} = this.props;
		return (
			<View>
				<Header style={styles.header} androidStatusBarColor="#968037">
					<Left style={styles.headerLeft}>
						<Button
							style={styles.menuBtn}
							onPress={() => navigation.navigate("Categories")}
						>
							<FontAwesome
								theme={{ iconFamily: "FontAwesome" }}
								name="home"
								style={{
									color: "#E6E2D5",
									fontSize:
										this.props.orientation === "portrate"
											? wp("4%")
											: wp("2.5%"),
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
								fontSize:
									this.props.orientation === "portrate" ? scale(14) : scale(16),
								color: "#E6E2D5"
							}}
						>
							الإعدادت
						</Title>
					</Body>
					<Right style={styles.headerRight}>
						<Button
							style={styles.homeBtn}
							onPress={() => this.props.navigation.openDrawer()}
						>
							<FontAwesome
								theme={{ iconFamily: "FontAwesome" }}
								name="bars"
								style={{
									color: "#E6E2D5",
									fontSize:
										this.props.orientation === "portrate"
											? wp("4%")
											: wp("2.5%"),
									paddingHorizontal: wp("1%"),
									paddingVertical: wp("1%")
								}}
							/>
						</Button>
					</Right>
				</Header>
				<ListItem>
					<Left>
						<Switch
							trackColor={{ false: "gray", true: "#968037" }}
							thumbColor="#968037"
							value={showAddtoCartBtn}
							onValueChange={handleShowAddToCartBtnToggle}
						/>
					</Left>
					<Right
						style={{
							flex: 1
						}}
					>
						<Text style={styles.addToCartSwitchText}>
							إضهار زر الاضافة الى المفضلة
						</Text>
					</Right>
				</ListItem>
				<ListItem>
					<Left>
						<NumPicker
							onInc={this.handleIncrement}
							onDec={this.handleDecrement}
							productsPerPage={productsPerPage}
						/>
					</Left>
					<Right
						style={{
							flex: 1
						}}
					>
						<Text style={styles.noOfProductsPerPageText}>
							عدد المنتجات في الصفحه
						</Text>
					</Right>
				</ListItem>
				<ListItem>
					<Left>
						<Picker
							selectedValue={selectedLanguage}
							onValueChange={this.onChangeLanguage}
							style={{ width: 120 }}
						>
							<Picker.Item label="العربية" value="ar" />
							<Picker.Item label="English" value="en" />
						</Picker>
					</Left>
					<Right
						style={{
							flex: 1
						}}
					>
						<Text style={styles.noOfProductsPerPageText}>
							اللغة
						</Text>
					</Right>
				</ListItem>
			</View>
		);
	}
}

const styles = StyleSheet.create({
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
	homeBtn: {
		backgroundColor: "#444444",
		display: "flex",
		alignItems: "center",
		justifyContent: "center"
	},
	addToCartSwitchText: {
		fontWeight: "bold",
		fontSize: scale(11)
	},
	noOfProductsPerPageText: {
		fontWeight: "bold",
		fontSize: scale(11)
	}
});

mapStateToProps = state => {
	return ({ productsPerPage, showAddtoCartBtn, orientation, selectedLanguage } = state);
};
mapDispatchToProps = dispatch => {
	return {
		onSetProductsPerPage: value => {
			dispatch({ type: "SET_PRODUCTS_PER_PAGE", value });
		},
		handleShowAddToCartBtnToggle: () => {
			dispatch({
				type: "SET_SHOW_ADD_TO_CART_BTN"
			});
		},
		onSetLanguage: (lang) => { dispatch({ type: "SET_LANGUAGE", lang }) }
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Settings);
