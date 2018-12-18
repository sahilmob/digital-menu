import axios from "axios";
export const setResturantData = (resturantData, restId) => {
	return {
		type: "SET_RESTURANT_DATA",
		resturantData,
		restId
	};
};
export const saveProducts = products => {
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
export const clearCategories = () => {
	return {
		type: "CLEAR_CATEGORIES"
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

export const fetchResturants = restId => {
	return (dispatch, getState) => {
		dispatch(setLoadingTrue());
		axios({
			method: "get",
			baseURL: "https://almenu.net/wp-json/wp/v2/res",
			params: {
				bclid: "IwAR159Z8l0c03zzstmX3kvysZx7LkiR_eMaL3KwegDVvogOmaIZmLW75a4Wg"
			}
		})
			.then(({ data }) => {
				dispatch(setLoadingFalse());
				const resturantData = data.find(({ slug }) => {
					return slug === restId;
				});
				if (!resturantData) {
					if (getState().selectedLanguage === "en") {
						return dispatch(onShowErrorAlert("Resturant data are invalid"));
					} else {
						return dispatch(onShowErrorAlert("معلومات المطعم غير صحيحه"));
					}
				}
				return dispatch(setResturantData(resturantData, restId));
			})
			.catch(err => {
				dispatch(setLoadingFalse());
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
						dispatch(saveProducts(data));
					})
					.catch(err => {
						dispatch(setLoadingFalse());
					});
			});
		}
	};
};
export const getCategories = (url, id, pass) => {
	return dispatch => {
		dispatch(setLoadingTrue());
		axios({
			method: "get",
			baseURL: `${url}wp-json/wc/v2`,
			url: "/products/categories",
			params: { per_page: 100 },
			auth: {
				username: id,
				password: pass
			}
		})
			.then(({ data }) => {
				dispatch(saveCategories(data));
				dispatch(setLoadingFalse());
				dispatch(clearProducts());
				dispatch(fetchProducts(url, id, pass));
			})
			.catch(err => {
				dispatch(setLoadingFalse());
			});
	};
};

export const refreshCategories = () => {
	return (dispatch, getState) => {
		const { url, Id, pass } = getState().resturantData.acf;
		dispatch(setRefreshingTrue());
		dispatch(clearCategories());
		dispatch(clearProducts());
		axios({
			method: "get",
			baseURL: `${url}wp-json/wc/v2`,
			url: "/products/categories",
			params: { per_page: 100 },
			auth: {
				username: Id,
				password: pass
			},
			timeout: 60000
		})
			.then(({ data }) => {
				dispatch(saveCategories(data));
				return dispatch(fetchProducts(url, Id, pass));
			})
			.then(() => {
				dispatch(setRefreshingFalse());
			})
			.catch(err => {
				dispatch(setRefreshingFalse());
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
