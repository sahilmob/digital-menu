import React, { Component } from "react";
import { View, Text } from "react-native";
import { Button } from "native-base";
import { scale } from "react-native-size-matters";

export default class Picker extends Component {
	render() {
		return (
			<View
				style={{
					display: "flex",
					flexDirection: "row",
					justifyContent: "center",
					alignItems: "center"
				}}
			>
				<Button
					style={{
						maxHeight: scale(20),
						backgroundColor: "#968037",
						paddingHorizontal: scale(10)
					}}
					onPress={this.props.onDec}
				>
					<Text
						style={{
							color: "#E6E2D5",
							fontWeight: "bold",
							fontSize: scale(11)
						}}
					>
						-
					</Text>
				</Button>
				<Text
					style={{
						marginHorizontal: 10,
						width: 40,
						textAlign: "center",
						fontSize: scale(11)
					}}
				>
					{this.props.productsPerPage}
				</Text>
				<Button
					onPress={this.props.onInc}
					style={{
						maxHeight: scale(20),
						backgroundColor: "#968037",
						paddingHorizontal: scale(10)
					}}
				>
					<Text
						style={{
							color: "#E6E2D5",
							fontWeight: "bold",
							fontSize: scale(11)
						}}
					>
						+
					</Text>
				</Button>
			</View>
		);
	}
}
