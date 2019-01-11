import React, { Component } from "react";
import { ScrollView, Text, TouchableOpacity } from "react-native";

import { connect } from "react-redux";
import { scale } from "react-native-size-matters";

class CategoriesScrollView extends Component {
	categoryClicked = (id, description) => {
		const {
			onSelectCategoryFromList,
			onNavigateToProducts,
			navigation
		} = this.props;
		onNavigateToProducts(navigation.navigate, id, description);
		onSelectCategoryFromList();
	};

	render() {
		const {
			categories,
			resturantData: {
				acf: { color }
			}
		} = this.props;
		return (
			<ScrollView
				horizontal={true}
				showsHorizontalScrollIndicator={false}
				style={{
					position: "absolute",
					bottom: 0,
					backgroundColor: color
				}}
			>
				{categories.map(item => {
					return (
						<TouchableOpacity
							key={item.id}
							style={{
								height: scale(30),
								justifyContent: "center"
							}}
							onPress={() => {
								this.categoryClicked(item.id, item.description);
							}}
						>
							<Text
								key={item.id}
								style={{ marginHorizontal: scale(20), color: "white" }}
							>
								{item.description}
							</Text>
						</TouchableOpacity>
					);
				})}
			</ScrollView>
		);
	}
}

const mapStateToProps = state => {
	return {
		categories: state.categories,
		resturantData
	};
};

const mapDispatchToProps = dispatch => {
	return {
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
)(CategoriesScrollView);
