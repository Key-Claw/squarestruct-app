import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'
import i18n from '../i18n'

const squareStructAlert = Swal.mixin({
  customClass: {
    popup: 'square-alert-popup',
    title: 'square-alert-title',
    htmlContainer: 'square-alert-text',
    actions: 'square-alert-actions',
    confirmButton: 'square-alert-confirm',
    cancelButton: 'square-alert-cancel',
  },
  buttonsStyling: false,
  reverseButtons: true,
  width: 'min(420px, calc(100vw - 32px))',
  backdrop: 'rgba(16, 39, 54, 0.48)',
  allowOutsideClick: true,
  heightAuto: false,
})

export const confirmDelete = async ({
  title = i18n.t('alerts.deleteTitle'),
  text = i18n.t('alerts.deleteText'),
  confirmButtonText = i18n.t('alerts.deleteConfirm'),
  cancelButtonText = i18n.t('alerts.cancel'),
} = {}) => {
  const result = await squareStructAlert.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    focusCancel: true,
    customClass: {
      confirmButton: 'square-alert-confirm square-alert-confirm-danger',
    },
  })

  return result.isConfirmed
}

export const showSuccess = ({
  title = i18n.t('alerts.successTitle'),
  text = i18n.t('alerts.successText'),
  confirmButtonText = i18n.t('alerts.ok'),
} = {}) => (
  squareStructAlert.fire({
    title,
    text,
    icon: 'success',
    confirmButtonText,
    customClass: {
      confirmButton: 'square-alert-confirm square-alert-confirm-success',
    },
  })
)

export const showError = ({
  title = i18n.t('alerts.errorTitle'),
  text = i18n.t('alerts.errorText'),
  confirmButtonText = i18n.t('alerts.ok'),
} = {}) => (
  squareStructAlert.fire({
    title,
    text,
    icon: 'error',
    confirmButtonText,
    customClass: {
      confirmButton: 'square-alert-confirm square-alert-confirm-danger',
    },
  })
)
