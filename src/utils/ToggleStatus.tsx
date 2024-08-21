
const useToggleStatus = () => {
    const toggleStatus = async (postData: (url: string, body: any) => Promise<any>, apiUrl: string, formData: FormData, handleSuccess: () => void) => {
        try {
            const response = await postData(apiUrl, formData);

            if (response) {
                handleSuccess();
            }
        } catch (error) {
            // handleError(error,navigate);
          
        }
    };

    return { toggleStatus };
};

export default useToggleStatus;
