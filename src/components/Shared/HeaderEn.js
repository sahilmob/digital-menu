import { Body, Button, Header, Left, Right, Title } from "native-base";

import FontAwesome from "react-native-vector-icons/FontAwesome5";
import React from "react";
import { StyleSheet } from "react-native";
import { connect } from "react-redux";
import { scale } from "react-native-size-matters";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

const AppHeader = props => {
	const {
		currentCategoryName,
		toggleCategoriesList,
		title,
		navigation: {
			openDrawer,
			state: { key }
		},
		orientation,
		resturantData: {
			acf: { color }
		}
	} = props;
	return (
		<Header
			style={[styles.header, { backgroundColor: color }]}
			androidStatusBarColor={color ? color : "#ff9955"}
		>
			<Left style={styles.headerLeft}>
				<Button style={styles.menuBtn} onPress={() => openDrawer()}>
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
					{title}
				</Title>
			</Body>
			<Right style={styles.headerRight}>
				<FontAwesome
					theme={{ iconFamily: "FontAwesome" }}
					name="th-large"
					style={{
						color: "transparent",
						fontSize: orientation === "portrate" ? wp("3.5%") : wp("2.5%"),
						paddingHorizontal: wp("1%"),
						paddingVertical: wp("1%")
					}}
				/>
				{/* {key === "Categories" ? (
					<FontAwesome
						theme={{ iconFamily: "FontAwesome" }}
						name="th-large"
						style={{
							color: color,
							fontSize: orientation === "portrate" ? wp("3.5%") : wp("2.5%"),
							paddingHorizontal: wp("1%"),
							paddingVertical: wp("1%")
						}}
					/>
				) : (
					<Button
						style={[
							styles.catListListIToggle,
							{
								backgroundColor: "#444444"
							}
						]}
						onPress={toggleCategoriesList}
					>
						<FontAwesome
							theme={{ iconFamily: "FontAwesome" }}
							name="th-large"
							style={{
								color: "#E6E2D5",
								fontSize: orientation === "portrate" ? wp("3.5%") : wp("2.5%"),
								paddingHorizontal: wp("1%"),
								paddingVertical: wp("1%")
							}}
						/>
					</Button>
				)} */}
			</Right>
		</Header>
	);
};

const styles = StyleSheet.create({
	header: {
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center"
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
		display: "flex",
		alignItems: "center",
		justifyContent: "center"
	}
});

const mapStateToProps = state => {
	return ({ currentCategoryName, orientation, resturantData } = state);
};

export default connect(mapStateToProps)(AppHeader);
