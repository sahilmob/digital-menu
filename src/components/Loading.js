import React, { Component } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { connect } from "react-redux";

class Loading extends Component {
	componentWillMount() {
		const {
			selectedLanguage,
			restId,
			categories,
			navigation: { navigate }
		} = this.props;

		if (!selectedLanguage) {
			navigate("SelectLang");
		} else if (selectedLanguage === "en") {
			if (!restId || !categories) {
				navigate("AuthEN");
			} else {
				navigate("MainEN");
			}
		} else if (selectedLanguage === "ar") {
			if (!restId || !categories) {
				navigate("Auth");
			} else {
				navigate("Main");
			}
		}
	}
	render() {
		return (
			<View style={styles.container}>
				<ActivityIndicator size="large" color="#ff9955" />
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center"
	}
});

const mapStateToProps = state => {
	return ({ selectedLanguage, restId, categories, resturantData } = state);
};

export default connect(
	mapStateToProps,
	null
)(Loading);
