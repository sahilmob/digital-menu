import React, { Component } from "react";
import {
	StyleSheet,
	TouchableOpacity,
	Text,
	ActivityIndicator
} from "react-native";
import { List, ListItem, Left, Right, Icon } from "native-base";
import { connect } from "react-redux";
import { scale } from "react-native-size-matters";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import CachedImage from "react-native-image-cache-wrapper";

class CategoriesList extends Component {
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
			showCategoriesList,
			resturantData: {
				acf: { color }
			}
		} = this.props;
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
								this.categoryClicked(category.id, category.name);
							}}
						>
							<Left>
								<Icon name="arrow-back" />
							</Left>
							<Right style={styles.catListListItemRight}>
								<Text style={styles.catListListItemText}>{category.name}</Text>
								{category.image ? (
									<CachedImage
										style={styles.catListProductImg}
										source={{ uri: category.image.src }}
										activityIndicator={
											<ActivityIndicator size="small" color={color} />
										}
									/>
								) : null}
							</Right>
						</ListItem>
					</TouchableOpacity>
				)}
			/>
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
	}
});

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
)(CategoriesList);
