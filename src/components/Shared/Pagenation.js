import React from "react";
import { StyleSheet, TouchableOpacity, Text, View } from "react-native";
import { Button } from "native-base";
import { connect } from "react-redux";
import { scale } from "react-native-size-matters";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

const Pagenation = props => {
	let pagination = [];
	let {
		categoryProducts,
		productsPerPage,
		currentPage,
		showCategoriesList,
		handlePageClick,
		resturantData: {
			acf: { color }
		}
	} = props;
	let noOfPages = Math.ceil(categoryProducts.length / productsPerPage);
	for (let i = 1; i <= noOfPages; i++) {
		if (noOfPages == 1) {
			return <View style={{ marginBottom: scale(30) }} />;
		}
		if (i === currentPage) {
			pagination.push(
				<Button
					style={[styles.activePageBtn, { backgroundColor: color }]}
					key={i}
					disabled
					onPress={() => handlePageClick(i)}
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
						active={currentPage === i}
						bordered
						warning
						onPress={() => handlePageClick(i)}
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
				display: showCategoriesList ? "none" : "flex"
			}}
		>
			{pagination}
		</View>
	);
};

const styles = StyleSheet.create({
	activePageBtn: {
		padding: 10
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
	}
});

const mapStateToProps = state => {
	return ({ categoryProducts, productsPerPage, resturantData } = state);
};

export default connect(mapStateToProps)(Pagenation);
