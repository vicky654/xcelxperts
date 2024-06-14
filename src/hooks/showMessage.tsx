// src/utils/showMessage.ts
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const showMessage = (msg: string = '', type: 'success' | 'error' = 'success') => {
  const toast = Swal.mixin({
    toast: true,
    position: 'top',
    showConfirmButton: false,
    showCloseButton: true,
    timer: 3000,
    customClass: {
      container: 'toast',
      popup: type === 'success' ? 'success-toast' : 'error-toast', // Custom classes based on type
    },
  });
  toast.fire({
    icon: type,
    title: msg,
    padding: '10px 20px',
    // border-radius:"0px",
  });
};

export default showMessage;
