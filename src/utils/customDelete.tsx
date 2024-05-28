import Swal from 'sweetalert2';
import { handleError } from './handlerror';

interface PostDataFunction {
  (apiUrl: string, formData: FormData): Promise<{ api_response: string }>;
}

const useCustomDelete = () => {
  const customDelete = async (
    postData: PostDataFunction,
    apiUrl: string,
    formData: FormData,
    handleSuccess: () => void,
    text?: string,
    title?: string,
    navigate?: (path: string) => void // Add navigate parameter
  ) => {
    Swal.fire({
      title: title || "Are you sure?",
      text: text || "You will not be able to recover this item!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await postData(apiUrl, formData);
          if (response.api_response === "success") {
            handleSuccess();
          }
        } catch (error) {
          if (navigate) {
            handleError(error, navigate); // Pass navigate to handleError
          } else {
            handleError(error, () => {}); // Pass a dummy function if navigate is not provided
          }
        }
      }
    });
  };

  return { customDelete };
};

export default useCustomDelete;
