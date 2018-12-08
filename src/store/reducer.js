import { toaster, toasterEn } from "./toast";
const initialState = {
	products: [],
	categories: [],
	cart: [],
	categoryProducts: [],
	currentCategoryId: 0,
	currentCategoryName: "",
	loading: false,
	refreshing: false,
	showErrorAlert: false,
	totalPrice: 0,
	showAddtoCartBtn: true,
	orientation: "protrate",
	deviceWidth: 0,
	deviceHeight: 0,
	productsPerPage: 12,
	selectedLanguage: null,
	restId: null,
	id: null,
	password: null,
	resturantData: null
};
import update from "immutability-helper";

export default (state = initialState, action) => {
	switch (action.type) {
		case "SET_LANGUAGE": {
			return {
				...state,
				selectedLanguage: action.lang
			};
		}
		case "SET_RESTURANT_DATA": {
			return {
				...state,
				resturantData: action.resturantData,
				productsPerPage: action.resturantData.acf.Product_per_page,
				restId: action.restId
			};
		}
		case "GET_PRODUCTS_BY_CAT_ID":
			let categoryProducts = [];
			state.products.map((el, index) => {
				if (el === null || !el.length) {
				} else {
					if (action.categoryId === el[0].categories[0].id) {
						categoryProducts = state.products[index];
					}
				}
			});
			action.navigate("Products");
			return {
				...state,
				categoryProducts: categoryProducts,
				currentCategoryId: action.categoryId,
				currentCategoryName: action.categoryName
			};

		case "STORE_PRODUCTS":
			let newProducts = update(state.products, { $push: [action.products] });
			return {
				...state,
				products: newProducts
			};
		case "STORE_CATEGORIES":
			return {
				...state,
				categories: action.categories
			};
		case "ADD_TO_CART":
			let itemId = action.payload.id;
			let itemIndex = state.cart.findIndex(el => el.id === itemId);
			let updatedPrice = 0;
			if (itemIndex > -1) {
				let item = state.cart.filter(el => el.id === itemId);
				let newCartArr = [...state.cart];
				let oldCount = item[0].count;
				let newCount = oldCount + 1;
				let newItemObj = {
					...item[0],
					count: newCount
				};
				newCartArr.splice(itemIndex, 1, newItemObj);
				newCartArr.forEach(el => {
					updatedPrice =
						updatedPrice +
						parseFloat(el.itemObj.price * 1.05).toFixed(2) * parseInt(el.count);
				});
				if (state.selectedLanguage === "ar") {
					toaster.showToast("تم إضافة المنتح الى المفضلة");
				} else if (state.selectedLanguage === "en") {
					toasterEn.showToast("Product added successfully");
				}
				return {
					...state,
					cart: [...newCartArr],
					totalPrice: updatedPrice.toFixed(2)
				};
			} else {
				if (state.selectedLanguage === "ar") {
					toaster.showToast("تم إضافة المنتح الى المفضلة");
				} else if (state.selectedLanguage === "en") {
					toasterEn.showToast("Product added successfully");
				}
				let newCartArr = [
					...state.cart,
					{
						id: action.payload.id,
						count: 1,
						itemObj: action.payload
					}
				];
				newCartArr.forEach(el => {
					updatedPrice =
						updatedPrice +
						parseFloat(el.itemObj.price * 1.05).toFixed(2) * parseInt(el.count);
				});
				return {
					...state,
					cart: [...newCartArr],
					totalPrice: updatedPrice.toFixed(2)
				};
			}
		case "REMOVE_FROM_CART":
			let itemIdRemoved = action.payload.id;
			let itemIndexRemoved = state.cart.findIndex(
				el => el.id === itemIdRemoved
			);
			let updatedPriceRemoved = 0;
			if (itemIndexRemoved > -1) {
				let item = state.cart.filter(el => el.id === itemIdRemoved);
				if (state.selectedLanguage === "ar") {
					toaster.showToast("تم إزالة المنتج من المفضلة");
				} else if (state.selectedLanguage === "en") {
					toasterEn.showToast("Product removed successfully");
				}
				if (item[0].count > 1) {
					let newCartArr = [...state.cart];
					let oldCount = item[0].count;
					let newCount = oldCount - 1;
					let newItemObj = {
						...item[0],
						count: newCount
					};
					newCartArr.splice(itemIndexRemoved, 1, newItemObj);
					newCartArr.forEach(el => {
						updatedPriceRemoved =
							updatedPriceRemoved +
							parseFloat(el.itemObj.price).toFixed(2) * parseInt(el.count);
					});
					return {
						...state,
						cart: [...newCartArr],
						totalPrice: updatedPriceRemoved.toFixed(2)
					};
				} else {
					let newArr = state.cart.filter(el => el.id !== itemIdRemoved);
					newArr.forEach(el => {
						updatedPriceRemoved =
							updatedPriceRemoved +
							parseFloat(el.itemObj.price).toFixed(2) * parseInt(el.count);
					});
					return {
						...state,
						cart: [...newArr],
						totalPrice: updatedPriceRemoved.toFixed(2)
					};
				}
			} else {
				return state;
			}
		case "SET_PRODUCTS_PER_PAGE":
			return {
				...state,
				productsPerPage: action.value
			};
		case "SET_SHOW_ADD_TO_CART_BTN":
			let { showAddtoCartBtn } = state;
			return {
				...state,
				showAddtoCartBtn: !showAddtoCartBtn
			};
		case "SET_LOADING_TRUE":
			return {
				...state,
				loading: true
			};
		case "SET_LOADING_FALSE":
			return {
				...state,
				loading: false
			};
		case "SET_REFRESHING_TRUE":
			return {
				...state,
				refreshing: true
			};
		case "SET_REFRESHING_FALSE":
			return {
				...state,
				refreshing: false
			};
		case "CLEAR_PRODUCTS":
			return {
				...state,
				products: []
			};
		case "EMPTY_CART":
			return {
				...state,
				cart: []
			};
		case "SHOW_ERROR_ALERT":
			return {
				...state,
				showErrorAlert: true,
				errMsg: action.errMsg
			};
		case "HIDE_ERROR_ALERT":
			return {
				...state,
				showErrorAlert: false
			};
		case "SET_DEVICE_DIMENSIONS":
			return {
				...state,
				orientation: action.orientation,
				deviceHeight: action.deviceHeight,
				deviceWidth: action.deviceWidth
			};

		default:
			return state;
	}
};
