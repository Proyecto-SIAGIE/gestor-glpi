export interface IGlpiApiService {
    initSessionToken(): Promise<string>;
}