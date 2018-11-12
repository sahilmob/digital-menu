import React from 'react'
import {
  View, SafeAreaView,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
  Text
} from 'react-native'
import { createDrawerNavigator, DrawerItems, } from "react-navigation"
import { verticalScale, scale } from 'react-native-size-matters'
import FontAwesome from "react-native-vector-icons/FontAwesome5";
import { connect } from 'react-redux';
import RNRestart from 'react-native-restart';


import Categories from './CategoriesEN'
import Wishlist from "./WishlistEN";
import Products from "./ProductsEN";
import Settings from "./SettingsEN";
import logo from "../components/assets/img/logo.png";

Main = (prop) => {
  const CustomDrawerComponent = props => {
    let orientation = null;
    let { width, height } = Dimensions.get("window");
    if (width > height) {
      orientation = "landscape";
    } else {
      orientation = "portrate";
    }
    return (
      <SafeAreaView style={{ backgroundColor: "white" }}>
        <ScrollView
          contentContainerStyle={{
            justifyContent: "space-between",
            alignItems: "stretch"
          }}
        >
          <View style={{ alignItems: "center", marginBottom: scale(10) }}>
            <Image
              source={logo}
              style={{ height: scale(50), width: scale(50) }}
            />
          </View>
          <DrawerItems {...props} />
          <TouchableOpacity style={{ flexDirection: "row" }} onPress={() => {
            prop.onSetLanguage()
            setTimeout(RNRestart.Restart, 1);
          }}>
            <FontAwesome
              theme={{ iconFamily: "FontAwesome" }}
              name="language"
              style={{
                color: props.activeTintColor,
                fontSize: scale(16),
                marginRight: scale(10),
                marginLeft: scale(45)
              }}
            />
            <Text>
              تغيير اللغة الى العربية
          </Text>
          </TouchableOpacity>
          <View
            style={{
              flex: 1,
              justifyContent: "flex-end",
              height:
                orientation === "portrate"
                  ? height > 700
                    ? height > 1000
                      ? verticalScale(515)
                      : verticalScale(485)
                    : verticalScale(455)
                  : height > 700
                    ? verticalScale(250)
                    : height < 500
                      ? verticalScale(185)
                      : verticalScale(215)
            }}
          >
            <TouchableOpacity>
              <FontAwesome
                theme={{ iconFamily: "FontAwesome" }}
                name="cog"
                style={{
                  color: props.activeTintColor,
                  fontSize: scale(16),
                  marginLeft: 25
                }}
                onPress={() => {
                  props.navigation.navigate("Settings");
                }}
              />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  };

  const Navigation = createDrawerNavigator(
    {
      Categories: {
        screen: Categories
      },
      Wishlist: {
        screen: Wishlist
      },
      Products: {
        screen: Products,
        navigationOptions: {
          drawerLabel: () => null
        }
      },
      Settings: {
        screen: Settings,
        navigationOptions: {
          drawerLabel: () => null
        }
      }
    },
    {
      contentComponent: CustomDrawerComponent,
      contentOptions: {
        activeTintColor: "#715C31",
        itemStyle: {
          flex: 1,
          flexDirection: "row",
          marginLeft: 30
        },
        labelStyle: {
          fontSize: scale(12)
        }
      }
    }
  );
  return (
    <Navigation />
  )
}


const mapDispatchToProps = dispatch => {
  return {
    onSetLanguage: () => { dispatch({ type: "SET_LANGUAGE", lang: "ar" }) }
  }
}

export default connect(null, mapDispatchToProps)(Main)