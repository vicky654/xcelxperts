import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

// Show message function
const showMessage = (msg: string = '', type: 'success' | 'error' = 'success') => {
  const toast = Swal.mixin({
    toast: true,
    position: 'top',
    showConfirmButton: false,
    timer: 3000,
    customClass: { container: 'toast' },
  });
  toast.fire({
    icon: type,
    title: msg,
    padding: '10px 20px',
  });
};

export default showMessage;
