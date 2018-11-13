import React, { Component } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Button, Form, Item, Input } from "native-base";
import { scale } from "react-native-size-matters";
import { connect } from "react-redux";

class Main extends Component {
	handleClick = lang => {
		this.props.onSetLanguage(lang);
		if (lang === "en") {
			this.props.navigation.navigate("MainEN");
		} else if (lang === "ar") {
			this.props.navigation.navigate("Main");
		}
	};

	render() {
		const { handleClick } = this;
		return (
			<View style={styles.outer}>
				<Form>
					<Item>
						<Input placeholder="Doamin" />
					</Item>
					<Item last>
						<Input placeholder="ID" />
					</Item>
					<Item last>
						<Input placeholder="Password" />
					</Item>
				</Form>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	outer: {
		flex: 1,
		justifyContent: "center"
	},
	logoContainer: {
		alignItems: "center",
		marginBottom: 30
	},
	container: {
		flexDirection: "row"
	},
	langContainer: {
		flex: 1,
		alignItems: "center"
	},
	btn: {
		alignSelf: "center",
		marginTop: 20,
		backgroundColor: "#968037",
		fontSize: scale(20),
		width: scale(80)
	},
	btnText: {
		color: "#E6E2D5",
		textAlign: "center",
		width: "100%"
	}
});

const mapDispatchToProps = dispatch => {
	return {
		onSetLanguage: lang => {
			dispatch({ type: "SET_LANGUAGE", lang });
		}
	};
};

export default connect(
	null,
	mapDispatchToProps
)(Main);
