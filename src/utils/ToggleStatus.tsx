import { handleError } from './handlerror';

interface PostDataFunction {
  (apiUrl: string, formData: FormData): Promise<{ api_response: string }>;
}

const useToggleStatus = () => {
  const toggleStatus = async (
    postData: PostDataFunction,
    apiUrl: string,
    formData: FormData,
    handleSuccess: () => void,
    navigate?: (path: string) => void
  ) => {
    try {
      const response = await postData(apiUrl, formData);
      if (response.api_response === "success") {
        handleSuccess();
      }
    } catch (error) {
      handleError(error, navigate ?? (() => {})); // Provide a default no-op function if navigate is undefined
    }
  };

  return { toggleStatus };
};

export default useToggleStatus;
