import React, { Component } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { connect } from "react-redux";

class Loading extends Component {
	componentWillMount() {
		const {
			selectedLanguage,
			url,
			id,
			password,
			navigation: { navigate }
		} = this.props;

		if (!selectedLanguage) {
			navigate("SelectLang");
		} else if (selectedLanguage === "en") {
			if (!url || !id || !password) {
				navigate("AuthEN");
			} else {
				navigate("MainEN");
			}
		} else if (selectedLanguage === "ar") {
			if (!url || !id || !password) {
				navigate("Auth");
			} else {
				navigate("Main");
			}
		}
	}
	render() {
		return (
			<View style={styles.container}>
				<ActivityIndicator size="large" color="#968037" />
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
	return ({ selectedLanguage, url, id, password } = state);
};

export default connect(
	mapStateToProps,
	null
)(Loading);
