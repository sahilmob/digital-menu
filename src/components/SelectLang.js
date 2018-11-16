import React, { Component } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Button } from "native-base";
import { scale } from "react-native-size-matters";
import { connect } from "react-redux";

class Main extends Component {
	handleClick = lang => {
		this.props.onSetLanguage(lang);
		if (lang === "en") {
			this.props.navigation.navigate("AuthEN");
		} else if (lang === "ar") {
			this.props.navigation.navigate("Auth");
		}
	};

	render() {
		const { handleClick } = this;
		return (
			<View style={styles.outer}>
				<View style={styles.logoContainer}>
					<Image source={require("./assets/img/logo.png")} />
				</View>
				<View style={styles.container}>
					<View style={styles.langContainer}>
						<Text>Select Language</Text>
						<Button
							style={styles.btn}
							onPress={() => {
								handleClick("en");
							}}
						>
							<Text style={styles.btnText}>English</Text>
						</Button>
					</View>
					<View style={styles.langContainer}>
						<Text>اختر اللغة</Text>
						<Button
							style={styles.btn}
							onPress={() => {
								handleClick("ar");
							}}
						>
							<Text style={styles.btnText}>العربية</Text>
						</Button>
					</View>
				</View>
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
		backgroundColor: "#ff9955",
		fontSize: scale(20),
		width: scale(80)
	},
	btnText: {
		color: "#444444",
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
