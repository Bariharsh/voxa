interface ApiResponse {
    success: boolean;
    message: string;
    status: number;
    bot: { text: string };
    reply: string
}
export default ApiResponse