import React, { Component } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Button, Form, Item, Input } from "native-base";
import { scale } from "react-native-size-matters";
import { connect } from "react-redux";
import AwesomeAlert from "react-native-awesome-alerts";

import { fetchResturants } from "../store/actions";

class Main extends Component {
	state = {
		restId: null
	};
	handleClick = () => {
		this.props.onSetRestCredentials(this.state.restId);
	};

	handleChange = id => {
		this.setState({
			restId: id
		});
	};

	componentDidUpdate(prevProps) {
		const { restId, onFetchResturants, resturantData } = this.props;
		if (prevProps.restId !== restId) {
			onFetchResturants();
		}

		if (resturantData) {
			this.props.navigation.navigate("MainEN");
		}
	}

	render() {
		const { handleClick } = this;
		const { showErrorAlert, errMsg, onHideErrorMessage } = this.props;
		return (
			<View style={styles.outer}>
				<Form>
					<Item>
						<Input
							placeholder="Restaurant ID"
							onChangeText={id => this.handleChange(id)}
						/>
					</Item>
					{/* <Item last>
						<Input placeholder="ID" />
					</Item>
					<Item last>
						<Input placeholder="Password" />
					</Item> */}
					<Button
						style={styles.btn}
						onPress={() => {
							handleClick();
						}}
					>
						<Text style={styles.btnText}>Submit</Text>
					</Button>
				</Form>
				<AwesomeAlert
					show={showErrorAlert}
					showProgress={false}
					title="Alert"
					message={errMsg}
					closeOnTouchOutside={true}
					closeOnHardwareBackPress={false}
					showCancelButton={true}
					showConfirmButton={false}
					cancelText="Dismiss"
					cancelButtonColor="red"
					onCancelPressed={() => {
						onHideErrorMessage();
					}}
				/>
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
		onSetRestCredentials: restId => {
			dispatch({ type: "SET_REST_CREDNTIALS", restId });
		},
		onFetchResturants: () => dispatch(fetchResturants()),
		onHideErrorMessage: () => dispatch({ type: "HIDE_ERROR_ALERT" })
	};
};

const mapStateToProps = state => {
	return ({ restId, showErrorAlert, errMsg, resturantData } = state);
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Main);
