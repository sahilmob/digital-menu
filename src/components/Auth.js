import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button, Form, Item, Input } from "native-base";
import { scale } from "react-native-size-matters";
import { connect } from "react-redux";
import Modal from "react-native-modal";

import { fetchResturants } from "../store/actions";

class Main extends Component {
	state = {
		restId: null
	};
	handleClick = () => {
		this.props.onFetchResturants(this.state.restId);
	};

	handleChange = id => {
		this.setState(
			{
				restId: id
			},
			() => {
				console.log(this.state.restId);
			}
		);
	};

	componentDidUpdate(prevProps) {
		const { restId, onFetchResturants, resturantData } = this.props;
		if (prevProps.restId !== restId) {
			onFetchResturants();
		}

		if (resturantData) {
			this.props.navigation.navigate("Main");
		}
	}

	render() {
		const { handleClick } = this;
		const { showErrorAlert, errMsg, onHideErrorMessage, loading } = this.props;
		return (
			<View style={styles.outer}>
				<Modal isVisible={showErrorAlert}>
					<View style={styles.modal}>
						<Text>{errMsg}</Text>
						<Button
							style={styles.btn}
							onPress={() => {
								onHideErrorMessage();
							}}
						>
							<Text style={styles.btnText}>إخفاء</Text>
						</Button>
					</View>
				</Modal>
				<Modal isVisible={loading}>
					<View style={styles.modal}>
						<Text>يرجى الإنتظار</Text>
					</View>
				</Modal>
				<Form>
					<Item>
						<Input
							placeholder="معرف المطعم"
							onChangeText={id => this.handleChange(id)}
						/>
					</Item>
					<Button
						style={styles.btn}
						onPress={() => {
							handleClick();
						}}
					>
						<Text style={styles.btnText}>ادخال</Text>
					</Button>
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
		backgroundColor: "#ff9955",
		fontSize: scale(20),
		width: scale(80)
	},
	btnText: {
		color: "#444444",
		textAlign: "center",
		width: "100%"
	},
	modal: {
		height: scale(100),
		width: scale(200),
		backgroundColor: "white",
		alignSelf: "center",
		justifyContent: "center",
		alignItems: "center"
	}
});

const mapDispatchToProps = dispatch => {
	return {
		onFetchResturants: id => dispatch(fetchResturants(id)),
		onHideErrorMessage: () => dispatch({ type: "HIDE_ERROR_ALERT" })
	};
};

const mapStateToProps = state => {
	return ({ restId, showErrorAlert, errMsg, resturantData, loading } = state);
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Main);
