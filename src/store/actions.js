import axios from "axios";
export const setResturantData = resturantData => {
	return {
		type: "SET_RESTURANT_DATA",
		resturantData
	};
};
export const saveProduncts = products => {
	return {
		type: "STORE_PRODUCTS",
		products
	};
};
export const saveCategories = categories => {
	return {
		type: "STORE_CATEGORIES",
		categories
	};
};

export const setLoadingTrue = () => {
	return {
		type: "SET_LOADING_TRUE"
	};
};

export const setLoadingFalse = () => {
	return {
		type: "SET_LOADING_FALSE"
	};
};

export const setRefreshingTrue = () => {
	return {
		type: "SET_REFRESHING_TRUE"
	};
};

export const setRefreshingFalse = () => {
	return {
		type: "SET_REFRESHING_FALSE"
	};
};

export const clearProducts = () => {
	return {
		type: "CLEAR_PRODUCTS"
	};
};

export const onShowErrorAlert = errMsg => {
	return {
		type: "SHOW_ERROR_ALERT",
		errMsg
	};
};
export const onHideErrorAlert = () => {
	return {
		type: "HIDE_ERROR_ALERT"
	};
};

export const fetchResturants = () => {
	return (dispatch, getState) => {
		axios({
			method: "get",
			baseURL: "https://almenu.net/wp-json/wp/v2/res",
			params: {
				bclid: "IwAR159Z8l0c03zzstmX3kvysZx7LkiR_eMaL3KwegDVvogOmaIZmLW75a4Wg"
			}
		})
			.then(({ data }) => {
				const resturantData = data.find(({ slug }) => {
					return slug === getState().restId;
				});
				if (!resturantData) {
					return dispatch(onShowErrorAlert("Resturant data are invlaid"));
				}
				return dispatch(setResturantData(resturantData));
			})
			.catch(err => {
				dispatch(onShowErrorAlert(err));
			});
	};
};

export const fetchProducts = (url, id, pass) => {
	return (dispatch, getState) => {
		const { products, categories } = getState();
		if (products.length > 0) {
			return;
		} else {
			categories.map(cat => {
				axios({
					method: "get",
					// baseURL: "https://lemoulinbakery.com.sa/wp-json/wc/v2",
					baseURL: `${url}wp-json/wc/v2`,
					url: `/products`,
					auth: {
						username: id,
						password: pass
					},
					params: {
						category: cat.id,
						per_page: 100
					}
				})
					.then(({ data }) => {
						dispatch(saveProduncts(data));
						console.log(data);
					})
					.catch(err => {
						dispatch(setLoadingFalse());
						// if (err == "Error: Network Error") {
						// 	dispatch(
						// 		onShowErrorAlert(
						// 			"عذرا، لا يوجد إتصال بالانترنت، تأكد من الاتصال ثم قم بتحديث الصفحة"
						// 		)
						// 	);
						// } else {
						// 	dispatch(onShowErrorAlert(err));
						// }
					});
			});
		}
	};
};

// export const refreshProducts = () => {
// 	return (dispatch, getState) => {
// 		dispatch(setRefreshingTrue());
// 		const { currentCategoryId } = getState;
// 		axios({
// 			method: "get",
// 			baseURL: "https://lemol.sheraa.sa/wp-json/wc/v2",
// 			url: "/products",
// 			params: {
// 				category: currentCategoryId,
// 				per_page: 100
// 			},
// 			auth: {
// 				username: "ck_78bbb572b458e6b9d9993eb5864a8268c7221e1c",
// 				password: "cs_f4abfebe27b3232933d9367cef57c147fc2d86cd"
// 			}
// 		})
// 			.then(res => {
// 				dispatch(saveProduncts(res.data));
// 				dispatch(setRefreshingFalse());
// 			})
// 			.catch(err => {
// 				dispatch(setRefreshingFalse());
// 				if (err == "Error: Network Error") {
// 					dispatch(
// 						onShowErrorAlert(
// 							"عذرا، لا يوجد إتصال بالانترنت، تأكد من الاتصال ثم قم بتحديث الصفحة"
// 						)
// 					);
// 				} else {
// 					dispatch(onShowErrorAlert(err));
// 				}
// 			});
// 	};
// };

export const getCategories = (url, id, pass) => {
	return dispatch => {
		dispatch(setLoadingTrue());
		axios({
			method: "get",
			// baseURL: "https://lemoulinbakery.com.sa/wp-json/wc/v2",
			// baseURL: "https://lemol.sheraaholding.sa/wp-json/wc/v2",
			baseURL: `${url}wp-json/wc/v2`,
			url: "/products/categories",
			params: { per_page: 100 },
			auth: {
				username: id,
				password: pass
			}
		})
			.then(({ data }) => {
				console.log(data);
				dispatch(saveCategories(data));
				dispatch(setLoadingFalse());
				dispatch(clearProducts());
				dispatch(fetchProducts(url, id, pass));
			})
			.catch(err => {
				dispatch(setLoadingFalse());
				// if (err == "Error: Network Error") {
				// 	dispatch(
				// 		onShowErrorAlert(
				// 			"عذرا، لا يوجد إتصال بالانترنت، تأكد من الاتصال ثم قم بتحديث الصفحة"
				// 		)
				// 	);
				// } else {
				// 	dispatch(onShowErrorAlert(err));
				// }
			});
	};
};

export const refreshCategories = () => {
	return dispatch => {
		dispatch(setRefreshingTrue());
		axios({
			method: "get",
			// baseURL: "https://lemoulinbakery.com.sa/wp-json/wc/v2",
			baseURL: "https://lemol.sheraaholding.sa/wp-json/wc/v2",
			url: "/products/categories",
			params: { per_page: 100 },
			auth: {
				username: "ck_78bbb572b458e6b9d9993eb5864a8268c7221e1c",
				password: "cs_f4abfebe27b3232933d9367cef57c147fc2d86cd"
			},
			timeout: 60000
		})
			.then(res => {
				dispatch(saveCategories(res.data));
				dispatch(setRefreshingFalse());
				dispatch(clearProducts());
				dispatch(fetchProducts());
			})
			.catch(err => {
				dispatch(setRefreshingFalse());
				// if (err == "Error: Network Error") {
				// 	dispatch(setRefreshingFalse());
				// 	dispatch(
				// 		onShowErrorAlert(
				// 			"عذرا، لا يوجد إتصال بالانترنت، تأكد من الاتصال ثم قم بتحديث الصفحة"
				// 		)
				// 	);
				// } else {
				// 	dispatch(setRefreshingFalse());
				// 	dispatch(onShowErrorAlert("خطأ في الاتصال"));
				// }
			});
	};
};

export const checkStore = () => {
	return (dispatch, getState) => {
		const {
			categories,
			resturantData: {
				acf: { url, Id, pass }
			}
		} = getState();
		if (categories.length > 0) {
			dispatch(fetchProducts(url, Id, pass));
		} else {
			dispatch(getCategories(url, Id, pass));
		}
	};
};
