import React, { Component } from 'react'
import { View, ActivityIndicator, StyleSheet } from 'react-native'
import { connect } from 'react-redux'



class Loading extends Component {
  componentWillMount() {
    const { selectedLanguage, navigation: { navigate } } = this.props
    if (!selectedLanguage) {
      navigate("SelectLang")
    } else if (selectedLanguage === "en") {
      navigate("MainEN")
    }
    else if (selectedLanguage === "ar") {
      navigate("Main")
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#968037" />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
})

const mapStateToProps = state => {
  return {
    selectedLanguage
  } = state
}

export default connect(mapStateToProps, null)(Loading)

