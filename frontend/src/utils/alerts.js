import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'

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
  title = 'Eliminar elemento',
  text = 'Esta accion no se puede deshacer.',
  confirmButtonText = 'Eliminar',
  cancelButtonText = 'Cancelar',
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
  title = 'Accion completada',
  text = 'La operacion se ha realizado correctamente.',
  confirmButtonText = 'Aceptar',
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
  title = 'No se pudo completar',
  text = 'Intentelo de nuevo.',
  confirmButtonText = 'Aceptar',
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
