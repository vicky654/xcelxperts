// commonInterfaces.ts
export interface CommonDataEntryProps {
    stationId: string | null;
    startDate: string | null;
    isLoading: boolean;
    getData: (url: string) => Promise<any>;
    postData: (url: string, body: any) => Promise<any>;
    applyFilters: (values: any) => Promise<void>;
}
