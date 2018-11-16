import React, { Component } from "react";
import {
	StyleSheet,
	TouchableOpacity,
	Text,
	ActivityIndicator
} from "react-native";
import { List, ListItem, Left, Right } from "native-base";
import { connect } from "react-redux";
import { scale } from "react-native-size-matters";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import FontAwesome from "react-native-vector-icons/FontAwesome5";
import CachedImage from "react-native-image-cache-wrapper";

class CategoriesList extends Component {
	categoryClicked = (id, slug) => {
		const {
			onSelectCategoryFromList,
			onNavigateToProducts,
			navigation
		} = this.props;
		onNavigateToProducts(navigation.navigate, id, slug);
		onSelectCategoryFromList();
	};

	render() {
		const { categories, showCategoriesList } = this.props;
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
								this.categoryClicked(category.id, category.slug);
							}}
						>
							<Left style={styles.catListListItemLeft}>
								{category.image ? (
									<CachedImage
										style={styles.catListProductImg}
										source={{ uri: category.image.src }}
										activityIndicator={
											<ActivityIndicator size="small" color="#968037" />
										}
									/>
								) : null}
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
	}
});

const mapStateToProps = state => {
	return {
		categories: state.categories
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
