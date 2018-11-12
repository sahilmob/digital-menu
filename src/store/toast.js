import { Toast } from 'native-base'
export const toaster = {
    showToast: (message, duration = 1000) => {
        Toast.show({
            text: message,
            duration,
            buttonText: 'إخفاء',
            textStyle: {
                textAlign: 'right'
            },
            buttonStyle: {
                display: 'none'
            }
        })
    }
}

export const toasterEn = {
    showToast: (message, duration = 1000) => {
        Toast.show({
            text: message,
            duration,
            buttonText: 'Hide',
            textStyle: {
                textAlign: 'left'
            },
            buttonStyle: {
                display: 'none'
            }
        })
    }
}